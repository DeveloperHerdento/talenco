import { NextRequest } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { checkoutLimiter } from "@/lib/ratelimit";
import { env } from "@/lib/env";
import { createCardPaymentSession, XenditApiError } from "@/lib/xendit";
import { getClientIp } from "@/lib/request";
import { logger } from "@/lib/logger";
import { PROGRAM_FEES, XENDIT_CURRENCY, resolveAmount, resolveBalance, type ProgramScheme } from "@/lib/constants/payment";

const schema = z.object({
  accessToken: z.string().uuid(),
  scheme: z.enum(["online", "onsite"]),
  paymentType: z.enum(["dp", "full"]),
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
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    return Response.json({ error: "入力内容に誤りがあります / Validation failed" }, { status: 400 });
  }

  const { accessToken, scheme, paymentType, locale } = result.data;

  // access_token is a server-generated, unique-indexed UUID — the only identity a
  // browser holds for its registration, same pattern as the register confirmation
  // email's /my?token= link. A wrong token looks identical to "not found."
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

  // Atomically claim the "no active session" slot before calling Xendit at all — a plain
  // check-then-act (read, then a later unconditional UPDATE) leaves a race window where two
  // concurrent requests both pass the check and each create a live Xendit session, with the
  // second UPDATE silently overwriting the first session id. If the FIRST (now-orphaned)
  // session is the one that gets paid, the webhook's lookup by xendit_session_id no longer
  // matches this row. The claim's WHERE clause (not paid, and no session or an expired one)
  // is re-evaluated atomically by Postgres, so only one concurrent claim can ever succeed.
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
  // Amount is derived server-side from (scheme, paymentType) only — the client never
  // gets to name a price. This value is also what the webhook cross-checks against.
  const amount = resolveAmount(scheme, paymentType);
  // Matches registrations.id directly so the Xendit dashboard can be cross-referenced
  // with the DB without decoding a composite string.
  const referenceId = reg.id;

  let session;
  try {
    session = await createCardPaymentSession({
      referenceId,
      amount,
      currency: XENDIT_CURRENCY,
      description: `${locale === "ja" ? fee.nameJa : fee.nameEn} (${paymentType === "dp" ? "DP" : locale === "ja" ? "全額" : "Full payment"})`,
      customerName: reg.full_name,
      customerEmail: reg.email,
      // Points at /my, not back into the register wizard — a full-page redirect (e.g. some
      // 3DS flows) loses the wizard's in-memory state entirely, whereas /my re-derives the
      // true status from the DB via the token regardless of how the user got there.
      successReturnUrl: `${env.appUrl}/${locale}/my?token=${accessToken}`,
      cancelReturnUrl: `${env.appUrl}/${locale}/my?token=${accessToken}`,
      origins: [env.appUrl],
      metadata: { registrationId: reg.id, scheme, paymentType },
    });
  } catch (err) {
    if (err instanceof XenditApiError) {
      logger.error("Payment session: Xendit create session failed", { status: err.status, body: err.body });
    } else {
      logger.error("Payment session: Xendit request failed", { error: String(err) });
    }
    return Response.json(
      { error: "決済セッションの作成に失敗しました。/ Failed to start the payment session." },
      { status: 502 }
    );
  }

  // Locked in now, not recomputed later from `scheme` — protects the amount owed from
  // drifting if pricing changes between the DP and balance payments. null for "full".
  const balanceAmount = resolveBalance(scheme, paymentType);

  // Stored so the webhook can verify the amount Xendit reports actually matches
  // what we asked for, instead of trusting the webhook payload on its own.
  const { error: updateErr } = await supabase
    .from("registrations")
    .update({
      scheme,
      payment_type: paymentType,
      xendit_session_id: session.paymentSessionId,
      xendit_session_expires_at: session.expiresAt,
      expected_amount: amount,
      expected_currency: XENDIT_CURRENCY,
      balance_amount: balanceAmount,
      balance_currency: balanceAmount !== null ? XENDIT_CURRENCY : null,
    })
    .eq("id", reg.id);

  if (updateErr) {
    logger.error("Payment session: failed to persist session id", { error: updateErr.message });
  }

  logger.info("Payment session created", {
    registrationId: reg.id,
    scheme,
    paymentType,
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
