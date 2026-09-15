import { NextRequest } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { checkoutLimiter } from "@/lib/ratelimit";
import { env } from "@/lib/env";
import { createCardPaymentSession, XenditApiError } from "@/lib/xendit";
import { getClientIp } from "@/lib/request";
import { logger } from "@/lib/logger";
import { PROGRAM_FEES, XENDIT_CURRENCY, resolveAmount, resolveDisplayAmount, type ProgramScheme } from "@/lib/constants/payment";

const schema = z.object({
  accessToken: z.string().uuid(),
  scheme: z.enum(["online", "onsite"]),
  locale: z.enum(["ja", "en"]).default("ja"),
});

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  const { success: allowed } = await checkoutLimiter.limit(ip);
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

  const result = schema.safeParse(body);
  if (!result.success) {
    return Response.json({ error: "入力内容に誤りがあります / Validation failed" }, { status: 400 });
  }

  const { accessToken, scheme, locale } = result.data;

  // access_token is the browser's only identity for this registration — a wrong token
  // looks identical to "not found."
  const { data: reg, error: fetchErr } = await supabase
    .from("registrations")
    .select("id, email, full_name, status")
    .eq("access_token", accessToken)
    .maybeSingle();

  if (fetchErr || !reg) {
    return Response.json(
      { error: "登録情報が見つかりませんでした。/ Registration not found." },
      { status: 404 }
    );
  }

  if (reg.status === "paid") {
    return Response.json({ error: "この登録はすでにお支払い済みです。/ This registration is already paid." }, { status: 409 });
  }

  // Atomic claim (not read-then-write) closes the race where two concurrent requests both
  // create a live Xendit session and the second silently overwrites the first's session id.
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
    logger.error("Payment session: failed to claim session slot", { error: claimErr.message, registrationId: reg.id });
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

  const fee = PROGRAM_FEES[scheme as ProgramScheme];
  // Derived server-side from scheme only — the client never names a price.
  const amount = resolveAmount(scheme);
  const referenceId = reg.id;

  let session;
  try {
    session = await createCardPaymentSession({
      referenceId,
      amount,
      currency: XENDIT_CURRENCY,
      description: `${locale === "ja" ? fee.nameJa : fee.nameEn} (${locale === "ja" ? "全額" : "Full payment"})`,
      customerName: reg.full_name,
      customerEmail: reg.email,
      // /my re-derives status from the DB via the token, so it survives a 3DS full-page redirect.
      successReturnUrl: `${env.appUrl}/${locale}/my?token=${accessToken}`,
      cancelReturnUrl: `${env.appUrl}/${locale}/my?token=${accessToken}`,
      origins: [env.appUrl],
      metadata: { registrationId: reg.id, scheme },
    });
  } catch (err) {
    if (err instanceof XenditApiError) {
      logger.error("Payment session: Xendit create session failed", { status: err.status, body: err.body });
    } else {
      logger.error("Payment session: Xendit request failed", { error: String(err) });
    }
    // Release the claim now rather than waiting for it to self-expire; guarded so it can't
    // clobber a different claim that may have won the row in between.
    const { error: releaseErr } = await supabase
      .from("registrations")
      .update({ xendit_session_id: null, xendit_session_expires_at: null })
      .eq("id", reg.id)
      .eq("xendit_session_id", "__claiming__");
    if (releaseErr) {
      logger.error("Payment session: failed to release claim after Xendit failure", { error: releaseErr.message, registrationId: reg.id });
    }
    return Response.json(
      { error: "決済セッションの作成に失敗しました。/ Failed to start the payment session." },
      { status: 502 }
    );
  }

  // Locked in now so a later pricing change can't retroactively alter what a paid registrant sees.
  const displayAmount = resolveDisplayAmount(scheme);

  const { error: updateErr } = await supabase
    .from("registrations")
    .update({
      scheme,
      payment_type: "full",
      xendit_session_id: session.paymentSessionId,
      xendit_session_expires_at: session.expiresAt,
      expected_amount: amount,
      expected_currency: XENDIT_CURRENCY,
      display_amount: displayAmount,
    })
    .eq("id", reg.id);

  if (updateErr) {
    // The Xendit session now exists but is untracked — safer to fail here than hand the
    // browser a session with no matching DB row for the webhook to find.
    logger.error("Payment session: failed to persist session id", { error: updateErr.message });
    return Response.json(
      { error: "決済セッションの作成に失敗しました。/ Failed to start the payment session." },
      { status: 502 }
    );
  }

  logger.info("Payment session created", {
    registrationId: reg.id,
    scheme,
    amount,
    paymentSessionId: session.paymentSessionId,
  });

  return Response.json({
    componentsSdkKey: session.componentsSdkKey,
    paymentSessionId: session.paymentSessionId,
    expiresAt: session.expiresAt,
    amount,
    currency: XENDIT_CURRENCY,
  });
}
