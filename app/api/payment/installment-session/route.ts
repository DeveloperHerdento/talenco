import { NextRequest } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { installmentCheckoutLimiter } from "@/lib/ratelimit";
import { env } from "@/lib/env";
import { createCardPaymentSession, XenditApiError } from "@/lib/xendit";
import { getClientIp } from "@/lib/request";
import { logger } from "@/lib/logger";
import {
  PROGRAM_FEES,
  XENDIT_CURRENCY,
  resolveInstallmentSchedule,
  resolveInstallmentAmounts,
  resolveDisplayInstallmentAmounts,
  type ProgramScheme,
} from "@/lib/constants/payment";

const schema = z.object({
  accessToken: z.string().uuid(),
  scheme: z.enum(["online", "onsite"]),
  locale: z.enum(["ja", "en"]).default("ja"),
});

// Installment 1 reuses /api/payment/session's Sessions-API flow with allowSavePaymentMethod:
// "FORCED", plus inserting the installment schedule and recording the plan.
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  const { success: allowed } = await installmentCheckoutLimiter.limit(ip);
  if (!allowed) {
    return Response.json(
      { error: "リクエストが多すぎます。しばらくしてからもう一度お試しください。/ Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "リクエストの形式が正しくありません。/ Invalid request body." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "入力内容に誤りがあります / Validation failed" }, { status: 400 });
  }

  const { accessToken, scheme, locale } = parsed.data;

  const { data: reg, error: fetchErr } = await supabase
    .from("registrations")
    .select("id, email, full_name, status")
    .eq("access_token", accessToken)
    .maybeSingle();

  if (fetchErr || !reg) {
    return Response.json({ error: "登録情報が見つかりませんでした。/ Registration not found." }, { status: 404 });
  }

  if (reg.status === "paid") {
    return Response.json({ error: "この登録はすでにお支払い済みです。/ This registration is already paid." }, { status: 409 });
  }

  const schedule = resolveInstallmentSchedule();
  if (!schedule) {
    return Response.json(
      { error: "分割払いのお申し込み期限を過ぎています。/ It's too close to the payment deadline for installments." },
      { status: 409 }
    );
  }

  // Same atomic claim as /api/payment/session; full and installment paths never contend for
  // the same registration's claim concurrently.
  const claimExpiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
  const { data: claimed, error: claimErr } = await supabase
    .from("registrations")
    .update({ xendit_session_id: "__claiming__", xendit_session_expires_at: claimExpiresAt })
    .eq("id", reg.id)
    .neq("status", "paid")
    .or(`xendit_session_id.is.null,xendit_session_expires_at.lt.${new Date().toISOString()}`)
    .select("id")
    .maybeSingle();

  if (claimErr) {
    logger.error("Installment session: failed to claim session slot", { error: claimErr.message, registrationId: reg.id });
    return Response.json({ error: "決済セッションの作成に失敗しました。/ Failed to start the payment session." }, { status: 500 });
  }

  if (!claimed) {
    return Response.json(
      {
        error:
          "すでに決済手続きが進行中です。しばらくしてからもう一度お試しください。/ A payment is already in progress. Please wait for it to complete or expire, then try again.",
      },
      { status: 409 }
    );
  }

  // Second, independent claim (unique index on registration_id) — must be rolled back too on
  // a Xendit failure below, or a half-finished attempt permanently locks out retries.
  const { data: plan, error: planErr } = await supabase
    .from("installment_plans")
    .insert({ registration_id: reg.id, currency: XENDIT_CURRENCY, status: "pending" })
    .select("id")
    .single();

  if (planErr || !plan) {
    if (planErr?.code === "23505") {
      return Response.json(
        {
          error:
            "すでに分割払いのお申し込みが進行中です。/ An installment plan is already in progress for this registration.",
        },
        { status: 409 }
      );
    }
    logger.error("Installment session: failed to create plan", { error: planErr?.message, registrationId: reg.id });
    return Response.json({ error: "決済セッションの作成に失敗しました。/ Failed to start the payment session." }, { status: 500 });
  }

  const amounts = resolveInstallmentAmounts(scheme as ProgramScheme);
  const displayAmounts = resolveDisplayInstallmentAmounts(scheme as ProgramScheme);

  const { error: rowsErr } = await supabase.from("installments").insert(
    schedule.map(({ installmentNo, dueDate }) => ({
      plan_id: plan.id,
      installment_no: installmentNo,
      amount: amounts[installmentNo - 1],
      due_date: dueDate.toISOString().slice(0, 10),
      status: "scheduled",
    }))
  );

  if (rowsErr) {
    logger.error("Installment session: failed to create installment rows", { error: rowsErr.message, planId: plan.id });
    await supabase.from("installment_plans").delete().eq("id", plan.id);
    return Response.json({ error: "決済セッションの作成に失敗しました。/ Failed to start the payment session." }, { status: 500 });
  }

  const fee = PROGRAM_FEES[scheme as ProgramScheme];

  let session;
  try {
    session = await createCardPaymentSession({
      referenceId: reg.id,
      amount: amounts[0],
      currency: XENDIT_CURRENCY,
      description: `${locale === "ja" ? fee.nameJa : fee.nameEn} (${locale === "ja" ? "分割払い 1/4" : "Installment 1/4"})`,
      customerName: reg.full_name,
      customerEmail: reg.email,
      successReturnUrl: `${env.appUrl}/${locale}/my?token=${accessToken}`,
      cancelReturnUrl: `${env.appUrl}/${locale}/my?token=${accessToken}`,
      origins: [env.appUrl],
      allowSavePaymentMethod: "FORCED",
      metadata: { registrationId: reg.id, scheme, installment: "1" },
    });
  } catch (err) {
    if (err instanceof XenditApiError) {
      logger.error("Installment session: Xendit create session failed", { status: err.status, body: err.body });
    } else {
      logger.error("Installment session: Xendit request failed", { error: String(err) });
    }
    // Roll back the plan (cascades to installments) and release the session claim so a retry
    // isn't permanently blocked.
    await supabase.from("installment_plans").delete().eq("id", plan.id);
    const { error: releaseErr } = await supabase
      .from("registrations")
      .update({ xendit_session_id: null, xendit_session_expires_at: null })
      .eq("id", reg.id)
      .eq("xendit_session_id", "__claiming__");
    if (releaseErr) {
      logger.error("Installment session: failed to release claim after Xendit failure", { error: releaseErr.message, registrationId: reg.id });
    }
    return Response.json({ error: "決済セッションの作成に失敗しました。/ Failed to start the payment session." }, { status: 502 });
  }

  const { error: updateErr } = await supabase
    .from("registrations")
    .update({
      scheme,
      payment_type: "installment",
      xendit_session_id: session.paymentSessionId,
      xendit_session_expires_at: session.expiresAt,
      expected_amount: amounts[0],
      expected_currency: XENDIT_CURRENCY,
      display_amount: displayAmounts[0],
    })
    .eq("id", reg.id);

  if (updateErr) {
    // The session now exists but is untracked — fail here rather than hand the browser a
    // session with no DB row. Plan is left in place; a retry reuses it.
    logger.error("Installment session: failed to persist session id", { error: updateErr.message });
    return Response.json({ error: "決済セッションの作成に失敗しました。/ Failed to start the payment session." }, { status: 502 });
  }

  const { error: planUpdateErr } = await supabase
    .from("installment_plans")
    .update({ xendit_customer_id: session.customerId })
    .eq("id", plan.id);

  if (planUpdateErr) {
    logger.error("Installment session: failed to persist customer id", { error: planUpdateErr.message, planId: plan.id });
  }

  logger.info("Installment plan session created", {
    registrationId: reg.id,
    planId: plan.id,
    scheme,
    amount: amounts[0],
    paymentSessionId: session.paymentSessionId,
  });

  return Response.json({
    componentsSdkKey: session.componentsSdkKey,
    paymentSessionId: session.paymentSessionId,
    expiresAt: session.expiresAt,
    amount: amounts[0],
    currency: XENDIT_CURRENCY,
  });
}
