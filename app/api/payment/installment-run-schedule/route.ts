import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { env } from "@/lib/env";
import { claimAndChargeInstallments } from "@/lib/installments";
import { timingSafeStringEqual } from "@/lib/timing-safe";
import { cronLimiter } from "@/lib/ratelimit";
import { getClientIp } from "@/lib/request";
import { logger } from "@/lib/logger";
import { sendInstallmentReminderEmail } from "@/lib/emails/installments";
import { INSTALLMENT_REMINDER_DAYS_BEFORE, resolveDisplayInstallmentAmounts, type ProgramScheme } from "@/lib/constants/payment";

type ReminderRow = {
  installment_no: number;
  due_date: string;
  plan: { registration: { email: string; full_name: string; locale: string; access_token: string; scheme: string } | null } | null;
};

// Exact-date match (not <=) so each installment only ever lands on "today" once across daily
// cron runs — no separate "already reminded" column needed to dedupe the send.
async function sendDueSoonReminders(today: Date) {
  const reminderDate = new Date(today);
  reminderDate.setDate(reminderDate.getDate() + INSTALLMENT_REMINDER_DAYS_BEFORE);
  const reminderDateStr = reminderDate.toISOString().slice(0, 10);

  const { data: dueSoon, error } = await supabase
    .from("installments")
    .select("installment_no, due_date, plan:installment_plans(registration:registrations(email, full_name, locale, access_token, scheme))")
    .eq("status", "scheduled")
    .eq("due_date", reminderDateStr)
    .returns<ReminderRow[]>();

  if (error) {
    logger.error("Installment schedule: reminder lookup failed", { error: error.message });
    return;
  }

  for (const row of dueSoon ?? []) {
    const reg = row.plan?.registration;
    if (!reg) continue;

    const amounts = resolveDisplayInstallmentAmounts(reg.scheme as ProgramScheme);
    const amountJpy = amounts[row.installment_no - 1] ?? 0;
    const statusUrl = `${env.appUrl}/${reg.locale}/my?token=${reg.access_token}`;
    sendInstallmentReminderEmail(reg.email, reg.full_name, row.installment_no, amountJpy, row.due_date, statusUrl);
  }
}

function secretValid(header: string | null): boolean {
  if (!header?.startsWith("Bearer ")) return false;
  return timingSafeStringEqual(header.slice(7), env.installmentCronSecret);
}

// Triggered once daily by an external cron calling `Authorization: Bearer <INSTALLMENT_CRON_SECRET>`.
// Charges every plan with an installment due today or earlier. See docs/PAYMENT.md for deploy wiring.
export async function GET(request: NextRequest) {
  const { success: allowed } = await cronLimiter.limit(getClientIp(request));
  if (!allowed) {
    return Response.json({ error: "Too many requests" }, { status: 429 });
  }

  if (!secretValid(request.headers.get("authorization"))) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  await sendDueSoonReminders(now);

  const { data: due, error: dueErr } = await supabase
    .from("installments")
    .select("id, plan_id, amount, due_date")
    .eq("status", "scheduled")
    .lte("due_date", today);

  if (dueErr) {
    logger.error("Installment schedule: due-rows lookup failed", { error: dueErr.message });
    return Response.json({ error: "Lookup failed" }, { status: 500 });
  }

  if (!due || due.length === 0) {
    return Response.json({ charged: 0, skipped: 0 });
  }

  const byPlan = new Map<string, typeof due>();
  for (const row of due) {
    const list = byPlan.get(row.plan_id) ?? [];
    list.push(row);
    byPlan.set(row.plan_id, list);
  }

  const planIds = [...byPlan.keys()];
  const { data: plans, error: plansErr } = await supabase
    .from("installment_plans")
    .select("id, payment_token_id, currency")
    .in("id", planIds);

  if (plansErr) {
    logger.error("Installment schedule: plans lookup failed", { error: plansErr.message });
    return Response.json({ error: "Lookup failed" }, { status: 500 });
  }

  // Small concurrent batches, not one plan at a time — a sequential loop risks the route's
  // serverless timeout on a large cohort; unbounded concurrency risks bursting Xendit.
  const BATCH_SIZE = 10;
  let charged = 0;
  let skipped = 0;

  const chargeOne = async (plan: NonNullable<typeof plans>[number]) => {
    // Nothing to charge until installment 1 finishes tokenizing. xendit_customer_id is
    // deliberately not part of this gate — it's informational only, never sent to Xendit.
    if (!plan.payment_token_id) {
      skipped++;
      return;
    }

    const rows = byPlan.get(plan.id) ?? [];
    const totalAmount = rows.reduce((sum, r) => sum + r.amount, 0);

    const result = await claimAndChargeInstallments({
      planId: plan.id,
      installmentIds: rows.map((r) => r.id),
      totalAmount,
      currency: plan.currency,
      paymentTokenId: plan.payment_token_id,
      referenceIdPrefix: `${plan.id}-scheduled`,
    });

    if (result.ok) charged++;
    else skipped++;
  };

  const allPlans = plans ?? [];
  for (let i = 0; i < allPlans.length; i += BATCH_SIZE) {
    await Promise.all(allPlans.slice(i, i + BATCH_SIZE).map(chargeOne));
  }

  logger.info("Installment schedule run complete", { plansConsidered: allPlans.length, charged, skipped });
  return Response.json({ charged, skipped });
}
