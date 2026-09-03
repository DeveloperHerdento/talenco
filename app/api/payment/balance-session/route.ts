import { NextRequest } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { balanceCheckoutLimiter } from "@/lib/ratelimit";
import { env } from "@/lib/env";
import { createCardPaymentSession, XenditApiError } from "@/lib/xendit";
import { getClientIp } from "@/lib/request";
import { logger } from "@/lib/logger";
import { PROGRAM_FEES, type ProgramScheme } from "@/lib/constants/payment";

const schema = z.object({
  accessToken: z.string().uuid(),
  locale: z.enum(["ja", "en"]).default("ja"),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  const { success: allowed } = await balanceCheckoutLimiter.limit(ip);
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
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    return Response.json({ error: "入力内容に誤りがあります / Validation failed" }, { status: 400 });
  }

  const { accessToken, locale } = result.data;

  const { data: reg, error: fetchErr } = await supabase
    .from("registrations")
    .select("id, email, full_name, scheme, payment_type, status, balance_amount, balance_currency, balance_paid_at")
    .eq("access_token", accessToken)
    .maybeSingle();

  if (fetchErr || !reg) {
    return Response.json(
      { error: "登録情報が見つかりませんでした。/ Registration not found." },
      { status: 404 }
    );
  }

  if (reg.payment_type !== "dp") {
    return Response.json(
      { error: "この登録には残額のお支払いはありません。/ This registration has no outstanding balance." },
      { status: 409 }
    );
  }

  if (reg.status !== "paid") {
    return Response.json(
      { error: "頭金のお支払いが確認できるまで残額のお支払いはできません。/ The down payment must be confirmed before paying the balance." },
      { status: 409 }
    );
  }

  if (reg.balance_paid_at) {
    return Response.json(
      { error: "残額のお支払いはすでに完了しています。/ The balance has already been paid." },
      { status: 409 }
    );
  }

  if (reg.balance_amount === null || reg.balance_currency === null) {
    // Shouldn't happen for a payment_type='dp' row past the DP session — data integrity issue.
    logger.error("Balance session: missing balance_amount/currency on dp row", { registrationId: reg.id });
    return Response.json(
      { error: "残額情報が見つかりませんでした。サポートにお問い合わせください。/ Balance amount missing. Please contact support." },
      { status: 500 }
    );
  }

  // Same atomic-claim guard as /api/payment/session — see that file's comment for why a
  // plain check-then-act read wouldn't close the double-submit race.
  const claimExpiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
  const { data: claimed, error: claimErr } = await supabase
    .from("registrations")
    .update({ balance_session_id: "__claiming__", balance_session_expires_at: claimExpiresAt })
    .eq("id", reg.id)
    .is("balance_paid_at", null)
    .or(`balance_session_id.is.null,balance_session_expires_at.lt.${new Date().toISOString()}`)
    .select("id")
    .maybeSingle();

  if (claimErr) {
    logger.error("Balance session: failed to claim session slot", { error: claimErr.message, registrationId: reg.id });
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

  const fee = reg.scheme ? PROGRAM_FEES[reg.scheme as ProgramScheme] : null;
  // Suffix distinguishes this from the DP session's reference_id in the Xendit dashboard —
  // and lets a human eyeball which registration + which leg of the payment a session is for.
  const referenceId = `${reg.id}-balance`;

  let session;
  try {
    session = await createCardPaymentSession({
      referenceId,
      amount: reg.balance_amount,
      currency: reg.balance_currency,
      description: `${fee ? (locale === "ja" ? fee.nameJa : fee.nameEn) : "TalenCo"} (${locale === "ja" ? "残額" : "Balance"})`,
      customerName: reg.full_name,
      customerEmail: reg.email,
      // Points at /my — the balance panel only ever renders there, and a full-page redirect
      // (e.g. some 3DS flows) landing on the register wizard would show a blank form instead
      // of the true, DB-backed status this token resolves to.
      successReturnUrl: `${env.appUrl}/${locale}/my?token=${accessToken}`,
      cancelReturnUrl: `${env.appUrl}/${locale}/my?token=${accessToken}`,
      origins: [env.appUrl],
      metadata: { registrationId: reg.id, leg: "balance" },
    });
  } catch (err) {
    if (err instanceof XenditApiError) {
      logger.error("Balance session: Xendit create session failed", { status: err.status, body: err.body });
    } else {
      logger.error("Balance session: Xendit request failed", { error: String(err) });
    }
    return Response.json(
      { error: "決済セッションの作成に失敗しました。/ Failed to start the payment session." },
      { status: 502 }
    );
  }

  const { error: updateErr } = await supabase
    .from("registrations")
    .update({ balance_session_id: session.paymentSessionId, balance_session_expires_at: session.expiresAt })
    .eq("id", reg.id);

  if (updateErr) {
    logger.error("Balance session: failed to persist session id", { error: updateErr.message });
  }

  logger.info("Balance payment session created", {
    registrationId: reg.id,
    amount: reg.balance_amount,
    paymentSessionId: session.paymentSessionId,
  });

  return Response.json({
    componentsSdkKey: session.componentsSdkKey,
    paymentSessionId: session.paymentSessionId,
    expiresAt: session.expiresAt,
    amount: reg.balance_amount,
    currency: reg.balance_currency,
  });
}
