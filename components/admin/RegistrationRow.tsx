"use client";

import { useState } from "react";
import { ChevronDown, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { formatJpy, INSTALLMENT_COUNT } from "@/lib/constants/payment";
import { resolveRegistrationStatus, statusMeta, type AdminInstallmentRow, type InstallmentStatus } from "@/lib/admin/status";

type InstallmentRow = AdminInstallmentRow;

export type Registration = {
  id: string;
  full_name: string;
  email: string;
  scheme: string | null;
  payment_type: string | null;
  status: string;
  display_amount: number | null;
  created_at: string;
  next_step: string;
};

function StatusPill({ label, tone }: { label: string; tone: "pending" | "action" | "done" }) {
  const cls =
    tone === "done"
      ? "bg-[#eaf3ff] text-brand-blue"
      : tone === "action"
        ? "bg-brand-orange text-white"
        : "bg-[#ececec] text-black/60";
  return <span className={`w-fit rounded-full px-2.5 py-1 text-xs font-bold whitespace-nowrap ${cls}`}>{label}</span>;
}

const formatIdr = (amount: number) => `Rp${amount.toLocaleString("id-ID")}`;

const formatDate = (isoDate: string) =>
  new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

const INSTALLMENT_META: Record<InstallmentStatus, { label: string; tone: "pending" | "action" | "done"; icon: typeof CheckCircle2 }> = {
  paid: { label: "Paid", tone: "done", icon: CheckCircle2 },
  scheduled: { label: "Upcoming", tone: "pending", icon: Clock },
  charging: { label: "Charging", tone: "pending", icon: Clock },
  failed: { label: "Failed", tone: "action", icon: AlertTriangle },
  manual_pending: { label: "Action needed", tone: "action", icon: AlertTriangle },
};

export function AdminRegistrationRow({ reg, hasPlan, installments }: { reg: Registration; hasPlan: boolean; installments: InstallmentRow[] }) {
  const [open, setOpen] = useState(false);

  const isInstallment = reg.payment_type === "installment";
  const paidCount = installments.filter((r) => r.status === "paid").length;
  const nextDue = installments.find((r) => r.status === "scheduled");
  const statusKey = resolveRegistrationStatus(reg, installments);
  const { label, tone } = statusMeta(statusKey);

  return (
    <>
      <tr className="border-b border-[#f2f2f2] last:border-0">
        <td className="px-4 py-3">
          <div className="font-medium text-black">{reg.full_name}</div>
          <div className="text-xs text-black/45">{reg.email}</div>
        </td>
        <td className="px-4 py-3 text-black/70">{reg.scheme ?? "—"}</td>
        <td className="px-4 py-3 text-black/70">
          {reg.payment_type === "installment" ? "Installment" : reg.payment_type === "full" ? "Full" : "—"}
        </td>
        <td className="px-4 py-3">
          <StatusPill label={label} tone={tone} />
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-black/70">
          {reg.display_amount !== null ? formatJpy(reg.display_amount) : "—"}
        </td>
        <td className="px-4 py-3 whitespace-nowrap text-black/70">
          {isInstallment && hasPlan ? (
            paidCount >= INSTALLMENT_COUNT ? (
              "Completed"
            ) : (
              <div className="flex flex-col gap-0.5">
                <span>
                  {paidCount} of {INSTALLMENT_COUNT} paid
                </span>
                {nextDue && <span className="text-xs text-black/45">next: {formatDate(nextDue.due_date)}</span>}
              </div>
            )
          ) : (
            "—"
          )}
        </td>
        <td className="px-4 py-3 text-nowrap text-black/50">{new Date(reg.created_at).toISOString().slice(0, 10)}</td>
        <td className="px-4 py-3">
          {isInstallment && hasPlan && (
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="flex items-center gap-1 text-xs font-semibold text-brand-blue hover:underline"
            >
              Show
              <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
          )}
        </td>
      </tr>
      {open && (
        <tr className="border-b border-[#f2f2f2] bg-[#f9fafb] last:border-0">
          <td colSpan={8} className="px-4 py-4">
            <div className="mb-2 text-xs font-semibold tracking-wide text-black/40 uppercase">
              Installment breakdown · {paidCount} of {INSTALLMENT_COUNT} paid
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {installments.map((row) => {
                const meta = INSTALLMENT_META[row.status] ?? { label: row.status, tone: "pending" as const, icon: Clock };
                const Icon = meta.icon;
                return (
                  <div key={row.installment_no} className="rounded-xl border border-[#ececec] bg-white p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold text-black/45">Installment {row.installment_no} of {INSTALLMENT_COUNT}</span>
                      <StatusPill label={meta.label} tone={meta.tone} />
                    </div>
                    <div className="mb-2 text-lg font-bold text-black">{formatIdr(row.amount)}</div>
                    <div className="flex items-center gap-1.5 text-xs text-black/50">
                      <Icon size={13} className="shrink-0" aria-hidden="true" />
                      {row.status === "paid" ? "Paid" : `Due ${formatDate(row.due_date)}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
