export const PROGRAM_FEES = {
  // amountIdr computed from the approved JPY sticker price at ¥1 = Rp112.99 (business-provided rate).
  online: { amountIdr: 3_367_102, amountJpy: 29_800, nameJa: "オンラインプログラム", nameEn: "Online Program" },
  onsite: { amountIdr: 33_671_020, amountJpy: 298_000, nameJa: "オンサイトプログラム", nameEn: "On-Site Program" },
} as const;

export type ProgramScheme = keyof typeof PROGRAM_FEES;

export const XENDIT_CURRENCY = "IDR" as const;

export type PaymentType = "full" | "installment";

// Actual amount charged through Xendit (IDR) — server-side only, never rendered to the customer.
export function resolveAmount(scheme: ProgramScheme): number {
  return PROGRAM_FEES[scheme].amountIdr;
}

// Customer-facing JPY equivalent, display only. Only safe before a session is created — once
// charged, the figure must come from the DB (display_amount), not be recomputed here.
export function resolveDisplayAmount(scheme: ProgramScheme): number {
  return PROGRAM_FEES[scheme].amountJpy;
}

export function formatJpy(amount: number): string {
  return `¥${amount.toLocaleString("ja-JP")}`;
}

// ── Installment plan (fixed 4x, deadline-derived schedule) ─────────────────

export const INSTALLMENT_COUNT = 4;

// How many days before due_date the reminder email goes out.
export const INSTALLMENT_REMINDER_DAYS_BEFORE = 3;

// Business-set per cohort — update this before each program run. Installment 4 always lands
// exactly on this date, never after it (see resolveInstallmentSchedule below).
export const INSTALLMENT_PAYMENT_DEADLINE = new Date("2026-11-04T00:00:00+07:00");

// Minimum days needed between "now" and the deadline for 4 evenly-spaced installments to make
// sense at all. Below this, the installment option should be hidden (DP/full still available).
export const INSTALLMENT_MIN_DAYS_REMAINING = 4;

export type InstallmentDue = { installmentNo: number; dueDate: Date };

// Divides (deadline − today) into 3 equal gaps rather than a fixed "30 days apart" cadence,
// which would silently blow past the deadline whenever less time remains before the program.
export function resolveInstallmentSchedule(now: Date = new Date()): InstallmentDue[] | null {
  const msRemaining = INSTALLMENT_PAYMENT_DEADLINE.getTime() - now.getTime();
  const daysRemaining = msRemaining / (24 * 60 * 60 * 1000);
  if (daysRemaining < INSTALLMENT_MIN_DAYS_REMAINING) return null;

  const gapMs = msRemaining / (INSTALLMENT_COUNT - 1);
  return Array.from({ length: INSTALLMENT_COUNT }, (_, i) => ({
    installmentNo: i + 1,
    dueDate: i === INSTALLMENT_COUNT - 1 ? INSTALLMENT_PAYMENT_DEADLINE : new Date(now.getTime() + gapMs * i),
  }));
}

// Actual amount charged per installment (IDR) — full scheme price split evenly across
// INSTALLMENT_COUNT. Any remainder from integer division is folded into the last installment so
// the four amounts always sum to exactly the scheme's full price.
export function resolveInstallmentAmounts(scheme: ProgramScheme): number[] {
  const total = PROGRAM_FEES[scheme].amountIdr;
  const base = Math.floor(total / INSTALLMENT_COUNT);
  const amounts = Array.from({ length: INSTALLMENT_COUNT }, () => base);
  amounts[INSTALLMENT_COUNT - 1] += total - base * INSTALLMENT_COUNT;
  return amounts;
}

export function resolveDisplayInstallmentAmounts(scheme: ProgramScheme): number[] {
  const total = PROGRAM_FEES[scheme].amountJpy;
  const base = Math.floor(total / INSTALLMENT_COUNT);
  const amounts = Array.from({ length: INSTALLMENT_COUNT }, () => base);
  amounts[INSTALLMENT_COUNT - 1] += total - base * INSTALLMENT_COUNT;
  return amounts;
}
