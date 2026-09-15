import { INSTALLMENT_COUNT } from "@/lib/constants/payment";

export type RegistrationStatusKey = "paid" | "in_progress" | "action" | "pending" | "no_payment";

export type Registration = {
  status: string;
  payment_type: string | null;
  next_step: string;
};

// Single source of truth for the installments.status enum — avoids a typo like "schedule" vs
// "scheduled" type-checking fine in one call site but silently never matching at runtime.
export type InstallmentStatus = "scheduled" | "charging" | "paid" | "failed" | "manual_pending";

export type AdminInstallmentRow = {
  installment_no: number;
  status: InstallmentStatus;
  due_date: string;
  amount: number;
};

export type InstallmentLike = { status: InstallmentStatus };

const STATUS_META: Record<RegistrationStatusKey, { label: string; tone: "pending" | "action" | "done" }> = {
  paid: { label: "Paid", tone: "done" },
  in_progress: { label: "In progress", tone: "action" },
  action: { label: "Action needed", tone: "action" },
  pending: { label: "Payment pending", tone: "pending" },
  no_payment: { label: "No payment", tone: "pending" },
};

// Shared by the row renderer and the table filter so they can never disagree on what a badge means.
export function resolveRegistrationStatus(reg: Registration, installments: InstallmentLike[]): RegistrationStatusKey {
  const isPaid = reg.status === "paid";
  const isInstallment = reg.payment_type === "installment";
  const paidCount = installments.filter((r) => r.status === "paid").length;
  const hasFailure = installments.some((r) => r.status === "manual_pending" || r.status === "failed");

  if (hasFailure) return "action";
  if (isPaid && isInstallment && paidCount < INSTALLMENT_COUNT) return "in_progress";
  if (isPaid) return "paid";
  if (reg.next_step === "payment") return "pending";
  return "no_payment";
}

export function statusMeta(key: RegistrationStatusKey) {
  return STATUS_META[key];
}

export const STATUS_FILTER_OPTIONS: { value: RegistrationStatusKey | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "paid", label: "Paid" },
  { value: "in_progress", label: "In progress" },
  { value: "action", label: "Action needed" },
  { value: "pending", label: "Payment pending" },
  { value: "no_payment", label: "No payment" },
];
