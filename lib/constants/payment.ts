export const PROGRAM_FEES = {
  // amountIdr computed from the approved JPY sticker price at ¥1 = Rp112.99 (business-provided rate).
  online: { amountIdr: 3_367_102, amountJpy: 29_800, nameJa: "オンラインプログラム", nameEn: "Online Program" },
  onsite: { amountIdr: 33_671_020, amountJpy: 298_000, nameJa: "オンサイトプログラム", nameEn: "On-Site Program" },
} as const;

export type ProgramScheme = keyof typeof PROGRAM_FEES;

export const XENDIT_CURRENCY = "IDR" as const;

export const DP_PERCENT = 0.3;

export type PaymentType = "dp" | "full";

type FeeKey = "amountIdr" | "amountJpy";

function resolveByKey(scheme: ProgramScheme, paymentType: PaymentType, key: FeeKey): number {
  const fee = PROGRAM_FEES[scheme][key];
  return paymentType === "dp" ? Math.round(fee * DP_PERCENT) : fee;
}

function resolveBalanceByKey(scheme: ProgramScheme, paymentType: PaymentType, key: FeeKey): number | null {
  if (paymentType !== "dp") return null;
  return PROGRAM_FEES[scheme][key] - resolveByKey(scheme, "dp", key);
}

// Actual amount charged through Xendit (IDR) — server-side only, never rendered to the customer.
export function resolveAmount(scheme: ProgramScheme, paymentType: PaymentType): number {
  return resolveByKey(scheme, paymentType, "amountIdr");
}

export function resolveBalance(scheme: ProgramScheme, paymentType: PaymentType): number | null {
  return resolveBalanceByKey(scheme, paymentType, "amountIdr");
}

// Customer-facing JPY equivalent — same DP split, purely for display. Never sent to Xendit.
// Only safe to call for a price that hasn't been charged yet (e.g. the selection preview) —
// once a session is created, the charged JPY figure must come from the DB (display_amount /
// display_balance_amount), not be recomputed here, or a later pricing change would silently
// alter what an already-paid registrant sees on their status page.
export function resolveDisplayAmount(scheme: ProgramScheme, paymentType: PaymentType): number {
  return resolveByKey(scheme, paymentType, "amountJpy");
}

export function resolveDisplayBalance(scheme: ProgramScheme, paymentType: PaymentType): number | null {
  return resolveBalanceByKey(scheme, paymentType, "amountJpy");
}

export function formatJpy(amount: number): string {
  return `¥${amount.toLocaleString("ja-JP")}`;
}
