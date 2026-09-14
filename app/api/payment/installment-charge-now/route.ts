import { NextRequest } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { installmentCheckoutLimiter } from "@/lib/ratelimit";
import { claimAndChargeInstallments } from "@/lib/installments";
import { XENDIT_CURRENCY } from "@/lib/constants/payment";
import { getClientIp } from "@/lib/request";
import { logger } from "@/lib/logger";

const schema = z.object({
  accessToken: z.string().uuid(),
  mode: z.enum(["next", "all"]),
});

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

  const { accessToken, mode } = parsed.data;

  const { data: reg, error: fetchErr } = await supabase
    .from("registrations")
    .select("id")
    .eq("access_token", accessToken)
    .maybeSingle();

  if (fetchErr || !reg) {
    return Response.json({ error: "登録情報が見つかりませんでした。/ Registration not found." }, { status: 404 });
  }

  const { data: plan, error: planErr } = await supabase
    .from("installment_plans")
    .select("id, payment_token_id, currency, status")
    .eq("registration_id", reg.id)
    .maybeSingle();

  if (planErr || !plan) {
    return Response.json({ error: "分割払いプランが見つかりませんでした。/ Installment plan not found." }, { status: 404 });
  }

  if (!plan.payment_token_id) {
    return Response.json(
      { error: "カード情報がまだ保存されていません。/ No saved card on file yet — pay installment 1 first." },
      { status: 409 }
    );
  }

  // Amount is derived from unpaid rows server-side — never accepted from the client.
  const { data: unpaid, error: unpaidErr } = await supabase
    .from("installments")
    .select("id, installment_no, amount")
    .eq("plan_id", plan.id)
    .eq("status", "scheduled")
    .order("installment_no", { ascending: true });

  if (unpaidErr) {
    logger.error("Installment charge-now: lookup failed", { error: unpaidErr.message, planId: plan.id });
    return Response.json({ error: "エラーが発生しました。/ Something went wrong." }, { status: 500 });
  }

  if (!unpaid || unpaid.length === 0) {
    return Response.json({ error: "未払いの分割払いはありません。/ Nothing left to pay." }, { status: 409 });
  }

  const targets = mode === "next" ? unpaid.slice(0, 1) : unpaid;
  const totalAmount = targets.reduce((sum, row) => sum + row.amount, 0);
  const targetIds = targets.map((row) => row.id);

  const result = await claimAndChargeInstallments({
    planId: plan.id,
    installmentIds: targetIds,
    totalAmount,
    currency: plan.currency ?? XENDIT_CURRENCY,
    paymentTokenId: plan.payment_token_id,
    referenceIdPrefix: `${plan.id}-${mode}`,
  });

  if (!result.ok) {
    const messages: Record<number, string> = {
      409: "すでに処理中の分割払いがあります。/ One of these installments is already being processed.",
      500: "エラーが発生しました。/ Something went wrong.",
      502: "決済に失敗しました。/ The charge failed. We'll follow up shortly.",
    };
    return Response.json({ error: messages[result.status] }, { status: result.status });
  }

  logger.info("Installment charge-now initiated", {
    planId: plan.id,
    mode,
    installmentIds: targetIds,
    amount: totalAmount,
    paymentRequestId: result.paymentRequestId,
  });

  // The webhook (payment.capture), not this response, is what marks rows paid/manual_pending.
  return Response.json({ paymentRequestId: result.paymentRequestId, status: result.status, amount: totalAmount });
}
