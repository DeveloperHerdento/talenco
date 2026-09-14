import { NextRequest, after } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { env } from "@/lib/env";
import { resend } from "@/lib/resend";
import { htmlEscape } from "@/lib/html";
import { logger } from "@/lib/logger";
import { timingSafeStringEqual } from "@/lib/timing-safe";
import { webhookLimiter } from "@/lib/ratelimit";
import { getClientIp } from "@/lib/request";
import { sendOpsAlert } from "@/lib/alerts";
import { forwardWebhookToDestinations } from "@/lib/webhook-forward";
import { sendInstallmentPaidEmail, sendInstallmentFailedEmail } from "@/lib/emails/installments";
import { emailLogoHeader, emailLogoAttachment, emailLineGroupInvite, emailLineGroupAttachment } from "@/lib/emails/layout";

// reference_id is minted as `${planId}-${mode}-${timestamp}` — the fixed-length UUID prefix.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function tokenValid(header: string | null): boolean {
  if (!header) return false;
  return timingSafeStringEqual(header, env.xenditWebhookToken);
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
    // Present only when the session was created with allow_save_payment_method: "FORCED".
    payment_token_id: z.string().optional(),
  }),
});

const captureEventSchema = z.object({
  event: z.literal("payment.capture"),
  data: z.object({
    payment_request_id: z.string(),
    reference_id: z.string().optional(),
    status: z.string(), // "SUCCEEDED" | "FAILED"
    request_amount: z.number(),
    currency: z.string(),
    payment_id: z.string().optional(),
  }),
});

function sendPaidEmail(to: string, fullName: string, statusUrl: string) {
  const safeName = htmlEscape(fullName);
  // after() keeps the function alive for this send instead of a fire-and-forget promise.
  after(() =>
    resend.emails
      .send({
        from: `TalenCo <${env.resendFromEmail}>`,
        to,
        subject: "【TalenCo】お支払いを確認しました / Payment Received",
        attachments: [emailLogoAttachment, emailLineGroupAttachment],
        html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
          ${emailLogoHeader()}
          <h2 style="color:#2081F9">TalenCo グローバルキャリア・スタータープログラム</h2>
          <p>${safeName} 様</p>
          <p>お支払いを確認しました。ありがとうございます。<br/>We've received your payment — thank you!</p>
          <p>近日中に担当者よりプログラムの詳細をご案内します。<br/>Our team will follow up shortly with program details.</p>
          ${emailLineGroupInvite()}
          <div style="background:#f0f7ff;border-radius:8px;padding:16px;margin:20px 0">
            <p style="margin:0 0 8px;font-weight:bold">📋 登録状況の確認 / View Your Registration</p>
            <p style="margin:0 0 12px;font-size:13px;color:#475569">以下のリンクからいつでも登録状況を確認できます。<br/>Use this link anytime to check your registration status.</p>
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

// payment.capture — the outcome of an installment charge (scheduled or user-initiated). Marks
// the matching 'charging' rows paid, or routes them to the manual-pay fallback on failure.
async function handlePaymentCapture(rawPayload: unknown) {
  const parsed = captureEventSchema.safeParse(rawPayload);
  if (!parsed.success) {
    logger.warn("Payment webhook: malformed payment.capture payload", { issues: parsed.error.issues });
    return Response.json({ received: true });
  }

  const { payment_request_id: paymentRequestId, reference_id: referenceId, status, request_amount: amount, payment_id: paymentId } =
    parsed.data.data;

  // The UUID prefix names the plan directly — matching by amount alone would be ambiguous
  // whenever two registrants on the same scheme are charging at once (identical totals).
  const planId = referenceId?.slice(0, 36);
  if (!planId || !UUID_RE.test(planId)) {
    logger.error("Payment webhook: payment.capture has no usable plan id in reference_id", { paymentRequestId, referenceId });
    return Response.json({ received: true });
  }

  const { data: charging, error: chargingErr } = await supabase
    .from("installments")
    .select("id, plan_id, amount, installment_no, plan:installment_plans(id, registration_id)")
    .eq("plan_id", planId)
    .eq("status", "charging")
    .order("installment_no", { ascending: true });

  if (chargingErr) {
    logger.error("Payment webhook: charging-rows lookup failed", { error: chargingErr.message, paymentRequestId, planId });
    return Response.json({ error: "Lookup failed" }, { status: 500 });
  }

  const rows = charging ?? [];
  const totalAmount = rows.reduce((sum, r) => sum + r.amount, 0);

  if (rows.length === 0 || totalAmount !== amount) {
    logger.error("Payment webhook: no charging installments for this plan match the capture amount", {
      paymentRequestId,
      planId,
      amount,
      chargingTotal: totalAmount,
    });
    sendOpsAlert("Card charged with no matching installment rows", {
      paymentRequestId,
      planId,
      capturedAmount: amount,
      chargingRowsFound: rows.length,
      chargingRowsTotal: totalAmount,
    });
    return Response.json({ received: true });
  }

  const rowIds = rows.map((r) => r.id);
  const registrationId = (rows[0] as unknown as { plan: { registration_id: string } }).plan.registration_id;

  const { data: reg } = await supabase
    .from("registrations")
    .select("email, full_name, locale, access_token")
    .eq("id", registrationId)
    .maybeSingle();

  if (status === "SUCCEEDED") {
    const { error: updateErr } = await supabase
      .from("installments")
      .update({ status: "paid", paid_at: new Date().toISOString(), xendit_payment_request_id: paymentRequestId })
      .in("id", rowIds);

    if (updateErr) {
      logger.error("Payment webhook: failed to mark installments paid", { error: updateErr.message, rowIds });
      return Response.json({ error: "Failed to update installments" }, { status: 500 });
    }

    // Installment 1 is handled by the payment_session.completed path above; this only ever
    // sees installments 2-4. Counts every non-paid row (not just 'scheduled') so a plan with an
    // unresolved manual_pending row is never marked 'completed'.
    const { count: remaining } = await supabase
      .from("installments")
      .select("id", { count: "exact", head: true })
      .eq("plan_id", planId)
      .neq("status", "paid");

    if (!remaining) {
      await supabase.from("installment_plans").update({ status: "completed" }).eq("id", planId);
    }

    if (reg) {
      const statusUrl = `${env.appUrl}/${reg.locale}/my?token=${reg.access_token}`;
      // rows is ordered by installment_no, so this is the lowest number this charge covered.
      sendInstallmentPaidEmail(reg.email, reg.full_name, rows[0].installment_no, remaining ?? 0, statusUrl);
    }
    logger.info("Installments marked paid", { rowIds, paymentRequestId, amount });
    return Response.json({ received: true });
  }

  // FAILED — flip to manual_pending and email a "please retry" (no self-serve pay link yet).
  const { error: failErr } = await supabase.from("installments").update({ status: "manual_pending" }).in("id", rowIds);
  if (failErr) {
    logger.error("Payment webhook: failed to mark installments manual_pending", { error: failErr.message, rowIds });
    return Response.json({ error: "Failed to update installments" }, { status: 500 });
  }

  if (reg) {
    const statusUrl = `${env.appUrl}/${reg.locale}/my?token=${reg.access_token}`;
    sendInstallmentFailedEmail(reg.email, reg.full_name, statusUrl);
  }
  logger.warn("Installment charge failed, routed to manual fallback", { rowIds, paymentRequestId, paymentId });
  return Response.json({ received: true });
}

export async function POST(request: NextRequest) {
  if (!tokenValid(request.headers.get("x-callback-token"))) {
    // Rate-limited only on the failed-auth path — Xendit's own deliveries always carry a valid
    // token, so this can't throttle legitimate webhook traffic.
    const { success: allowed } = await webhookLimiter.limit(getClientIp(request));
    if (!allowed) {
      return Response.json({ error: "Too many requests" }, { status: 429 });
    }
    logger.warn("Payment webhook: invalid callback token");
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const rawBody = await request.text();
  let rawPayload: unknown;
  try {
    rawPayload = JSON.parse(rawBody);
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  forwardWebhookToDestinations(rawBody);

  const eventName = (rawPayload as { event?: unknown } | null)?.event;
  if (eventName === "payment.capture") return handlePaymentCapture(rawPayload);

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

  const { payment_session_id: paymentSessionId, payment_id: paymentId, payment_token_id: paymentTokenId, amount, currency } =
    payload.data;

  const selectCols =
    "id, email, full_name, status, payment_type, access_token, locale, expected_amount, expected_currency, xendit_session_id";

  const { data: reg, error: fetchErr } = await supabase
    .from("registrations")
    .select(selectCols)
    .eq("xendit_session_id", paymentSessionId)
    .maybeSingle();

  if (fetchErr) {
    logger.error("Payment webhook: registration lookup failed", { paymentSessionId, error: fetchErr.message });
    return Response.json({ error: "Lookup failed" }, { status: 500 });
  }

  if (!reg) {
    logger.error("Payment webhook: no registration matches this session", { paymentSessionId });
    // Still 200 — this can legitimately happen for sessions from other flows/environments,
    // and retrying won't manufacture a matching row.
    return Response.json({ received: true });
  }

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
    sendOpsAlert("Amount/currency mismatch on payment_session.completed", {
      registrationId: reg.id,
      paymentSessionId,
      expectedAmount: reg.expected_amount,
      expectedCurrency: reg.expected_currency,
      receivedAmount: amount,
      receivedCurrency: currency,
    });
    return Response.json({ error: "Amount mismatch" }, { status: 409 });
  }

  logger.info("Registration marked paid", { registrationId: updated.id, paymentSessionId, amount, currency });
  const statusUrl = `${env.appUrl}/${reg.locale}/my?token=${reg.access_token}`;

  // Installment 1 completing works like a full payment, plus: persist the saved-card token
  // Xendit hands back, mark installment #1 paid, and send the installment-specific email.
  if (reg.payment_type === "installment") {
    const { data: plan } = await supabase
      .from("installment_plans")
      .select("id")
      .eq("registration_id", updated.id)
      .maybeSingle();

    if (plan) {
      const { error: planUpdateErr } = await supabase
        .from("installment_plans")
        .update({ payment_token_id: paymentTokenId ?? null, status: "active" })
        .eq("id", plan.id);

      const { error: installmentUpdateErr } = await supabase
        .from("installments")
        .update({ status: "paid", paid_at: new Date().toISOString(), xendit_payment_request_id: paymentId ?? null })
        .eq("plan_id", plan.id)
        .eq("installment_no", 1);

      // The registration is already, correctly, marked paid above — a 5xx here wouldn't help:
      // Xendit's retry would short-circuit at the "already paid" check and never reach this
      // block again. So a failure here can't self-heal via retry; it must be a human, hence the
      // alert instead of the usual 500 — this closes the "silently invisible forever" version of
      // this bug, where payment_token_id or installment #1 never gets persisted and nothing
      // downstream (future installment charges, the admin dashboard) ever finds out why.
      if (planUpdateErr || installmentUpdateErr) {
        logger.error("Payment webhook: failed to persist installment token/status after marking paid", {
          registrationId: updated.id,
          planId: plan.id,
          planUpdateErr: planUpdateErr?.message,
          installmentUpdateErr: installmentUpdateErr?.message,
        });
        sendOpsAlert("Registration paid but installment plan/token failed to persist — needs manual fix", {
          registrationId: updated.id,
          planId: plan.id,
          planUpdateErr: planUpdateErr?.message ?? "ok",
          installmentUpdateErr: installmentUpdateErr?.message ?? "ok",
        });
      }

      // Skip the "payment received" email on a persist failure — otherwise the customer is told
      // installment 1 succeeded while the DB still shows it scheduled, and remaining (below)
      // would double-count it since the status update never landed.
      if (!planUpdateErr && !installmentUpdateErr) {
        const { count: remaining } = await supabase
          .from("installments")
          .select("id", { count: "exact", head: true })
          .eq("plan_id", plan.id)
          .eq("status", "scheduled");

        sendInstallmentPaidEmail(updated.email, updated.full_name, 1, remaining ?? 0, statusUrl);
      }
    } else {
      logger.error("Payment webhook: installment plan not found for paid registration", { registrationId: updated.id });
      sendOpsAlert("Registration marked paid as installment but has no plan", {
        registrationId: updated.id,
        paymentSessionId,
      });
    }
  } else {
    sendPaidEmail(updated.email, updated.full_name, statusUrl);
  }

  return Response.json({ received: true });
}
