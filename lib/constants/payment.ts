export const PROGRAM_FEES = {
  online: { amountUsd: 199, jpyLabel: "¥29,800", nameJa: "オンラインプログラム", nameEn: "Online Program" },
  onsite: { amountUsd: 1990, jpyLabel: "¥298,000", nameJa: "オンサイトプログラム", nameEn: "On-Site Program" },
} as const;

export type ProgramScheme = keyof typeof PROGRAM_FEES;

export const XENDIT_CURRENCY = "USD" as const;

export const DP_PERCENT = 0.3;

export type PaymentType = "dp" | "full";

export function resolveAmount(scheme: ProgramScheme, paymentType: PaymentType): number {
  const fee = PROGRAM_FEES[scheme].amountUsd;
  return paymentType === "dp" ? Math.round(fee * DP_PERCENT) : fee;
}

export function resolveBalance(scheme: ProgramScheme, paymentType: PaymentType): number | null {
  if (paymentType !== "dp") return null;
  const fee = PROGRAM_FEES[scheme].amountUsd;
  return fee - resolveAmount(scheme, "dp");
}
