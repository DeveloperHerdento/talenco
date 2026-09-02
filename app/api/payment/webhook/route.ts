import { timingSafeEqual } from "crypto";
import { NextRequest, after } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { env } from "@/lib/env";
import { resend } from "@/lib/resend";
import { htmlEscape } from "@/lib/html";
import { logger } from "@/lib/logger";

function tokenValid(header: string | null): boolean {
  if (!header) return false;
  const a = Buffer.from(header);
  const b = Buffer.from(env.xenditWebhookToken);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

const payloadSchema = z.object({
  event: z.string(),
  data: z.object({
    payment_session_id: z.string(),
    reference_id: z.string(),
    status: z.string(),
    currency: z.string(),
    amount: z.number(),
    payment_id: z.string().optional(),
  }),
});

function sendPaidEmail(to: string, fullName: string, statusUrl: string, isDp: boolean) {
  const safeName = htmlEscape(fullName);
  // after() keeps the function alive for this send — a bare fire-and-forget promise can
  // be silently dropped if the serverless runtime freezes right after we return 200.
  after(() =>
    resend.emails
      .send({
        from: env.resendFromEmail,
        to,
        subject: "【TalenCo】お支払いを確認しました / Payment Received",
        html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#2081F9">TalenCo グローバルキャリア・スタータープログラム</h2>
          <p>${safeName} 様</p>
          <p>お支払いを確認しました。ありがとうございます。<br/>We've received your payment — thank you!</p>
          <p>近日中に担当者よりプログラムの詳細をご案内します。<br/>Our team will follow up shortly with program details.</p>
          <div style="background:#f0f7ff;border-radius:8px;padding:16px;margin:20px 0">
            <p style="margin:0 0 8px;font-weight:bold">📋 登録状況の確認 / View Your Registration</p>
            ${
              isDp
                ? `<p style="margin:0 0 12px;font-size:13px;color:#475569">残額のお支払いはこちらのページから行えます。<br/>Pay your remaining balance from this page.</p>`
                : `<p style="margin:0 0 12px;font-size:13px;color:#475569">以下のリンクからいつでも登録状況を確認できます。<br/>Use this link anytime to check your registration status.</p>`
            }
            <a href="${statusUrl}"
               style="display:inline-block;background:#2081F9;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:14px">
              登録状況を確認する / View My Registration →
            </a>
          </div>
        </div>
      `,
      })
      .catch((err: unknown) => logger.error("Resend: payment confirmation email failed", { error: String(err) }))
  );
}

function sendBalancePaidEmail(to: string, fullName: string) {
  const safeName = htmlEscape(fullName);
  after(() =>
    resend.emails
      .send({
        from: env.resendFromEmail,
        to,
        subject: "【TalenCo】残額のお支払いを確認しました / Balance Payment Received",
        html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          <h2 style="color:#2081F9">TalenCo グローバルキャリア・スタータープログラム</h2>
          <p>${safeName} 様</p>
          <p>残額のお支払いを確認しました。ありがとうございます。これでお支払いは完了です。<br/>We've received your balance payment — your payment is now complete. Thank you!</p>
        </div>
      `,
      })
      .catch((err: unknown) => logger.error("Resend: balance confirmation email failed", { error: String(err) }))
  );
}

export async function POST(request: NextRequest) {
  // Xendit retries on any non-2xx response, so we verify auth before touching the body.
  if (!tokenValid(request.headers.get("x-callback-token"))) {
    logger.warn("Payment webhook: invalid callback token");
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let rawPayload: unknown;
  try {
    rawPayload = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = payloadSchema.safeParse(rawPayload);
  if (!parsed.success) {
    logger.warn("Payment webhook: malformed payload", { issues: parsed.error.issues });
    // 200 — a malformed payload won't fix itself on retry, and we don't want Xendit hammering us.
    return Response.json({ received: true });
  }

  const payload = parsed.data;

  if (payload.event !== "payment_session.completed" || payload.data.status !== "COMPLETED") {
    // Acknowledge everything else (expired/canceled/other events) so Xendit stops retrying.
    return Response.json({ received: true });
  }

  const { payment_session_id: paymentSessionId, payment_id: paymentId, amount, currency } = payload.data;

  const selectCols =
    "id, email, full_name, status, payment_type, access_token, locale, expected_amount, expected_currency, xendit_session_id, balance_amount, balance_currency, balance_session_id, balance_paid_at";

  // Two plain .eq() lookups run in parallel instead of a single .or() built by string-
  // interpolating paymentSessionId — .or() takes a raw PostgREST filter expression, and an
  // unescaped value containing a comma or parenthesis could break out of the intended filter.
  const [xenditMatch, balanceMatch] = await Promise.all([
    supabase.from("registrations").select(selectCols).eq("xendit_session_id", paymentSessionId).maybeSingle(),
    supabase.from("registrations").select(selectCols).eq("balance_session_id", paymentSessionId).maybeSingle(),
  ]);

  // A query error on either side is not the same as "no match" — if e.g. the balance-side
  // lookup fails transiently while the xendit-side legitimately finds nothing, treating that
  // as "not found" would silently drop a real payment. Only a clean double-miss is a 200.
  if (xenditMatch.error || balanceMatch.error) {
    logger.error("Payment webhook: registration lookup failed", {
      paymentSessionId,
      xenditError: xenditMatch.error?.message,
      balanceError: balanceMatch.error?.message,
    });
    return Response.json({ error: "Lookup failed" }, { status: 500 });
  }

  const reg = xenditMatch.data ?? balanceMatch.data;
  const isBalanceLeg = !xenditMatch.data && !!balanceMatch.data;

  if (!reg) {
    logger.error("Payment webhook: no registration matches this session on either column", { paymentSessionId });
    // Still 200 — this can legitimately happen for sessions from other flows/environments,
    // and retrying won't manufacture a matching row.
    return Response.json({ received: true });
  }

  if (!isBalanceLeg) {
    // ── DP or full payment ──────────────────────────────────────────────
    const { data: updated, error: updateErr } = await supabase
      .from("registrations")
      .update({ status: "paid", paid_at: new Date().toISOString(), xendit_payment_id: paymentId ?? null })
      .eq("xendit_session_id", paymentSessionId)
      .eq("expected_amount", amount)
      .eq("expected_currency", currency)
      .neq("status", "paid")
      .select("id, email, full_name")
      .maybeSingle();

    if (updateErr) {
      logger.error("Payment webhook: failed to mark registration paid", { error: updateErr.message, paymentSessionId });
      return Response.json({ error: "Failed to update registration" }, { status: 500 });
    }

    if (!updated) {
      if (reg.status === "paid") {
        // Already handled by an earlier delivery of this same event — expected on retry.
        return Response.json({ received: true });
      }
      logger.error("Payment webhook: amount/currency mismatch — refused to mark paid", {
        registrationId: reg.id,
        paymentSessionId,
        expected: { amount: reg.expected_amount, currency: reg.expected_currency },
        received: { amount, currency },
      });
      return Response.json({ error: "Amount mismatch" }, { status: 409 });
    }

    logger.info("Registration marked paid", { registrationId: updated.id, paymentSessionId, amount, currency });
    const statusUrl = `${env.appUrl}/${reg.locale}/my?token=${reg.access_token}`;
    sendPaidEmail(updated.email, updated.full_name, statusUrl, reg.payment_type === "dp");
    return Response.json({ received: true });
  }

  // ── Balance payment ────────────────────────────────────────────────────
  const { data: updated, error: updateErr } = await supabase
    .from("registrations")
    .update({ balance_paid_at: new Date().toISOString(), balance_payment_id: paymentId ?? null })
    .eq("balance_session_id", paymentSessionId)
    .eq("balance_amount", amount)
    .eq("balance_currency", currency)
    .is("balance_paid_at", null)
    .select("id, email, full_name")
    .maybeSingle();

  if (updateErr) {
    logger.error("Payment webhook: failed to mark balance paid", { error: updateErr.message, paymentSessionId });
    return Response.json({ error: "Failed to update registration" }, { status: 500 });
  }

  if (!updated) {
    if (reg.balance_paid_at) {
      // Already handled by an earlier delivery of this same event — expected on retry.
      return Response.json({ received: true });
    }
    logger.error("Payment webhook: balance amount/currency mismatch — refused to mark paid", {
      registrationId: reg.id,
      paymentSessionId,
      expected: { amount: reg.balance_amount, currency: reg.balance_currency },
      received: { amount, currency },
    });
    return Response.json({ error: "Amount mismatch" }, { status: 409 });
  }

  logger.info("Balance marked paid", { registrationId: updated.id, paymentSessionId, amount, currency });
  sendBalancePaidEmail(updated.email, updated.full_name);
  return Response.json({ received: true });
}
