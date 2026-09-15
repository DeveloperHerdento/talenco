"use client";

import { useState } from "react";
import { Calendar, CreditCard, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { PaymentSuccessBadge } from "@/components/payment/PaymentSuccessBadge";
import { LineGroupInvite } from "@/components/payment/LineGroupInvite";
import { formatJpy } from "@/lib/constants/payment";

type ApiInstallmentRow = { installment_no: number; amount: number; due_date: string; status: string };

async function fetchInstallmentStatus(accessToken: string): Promise<ApiInstallmentRow[] | null> {
  const res = await fetch(`/api/payment/installment-status?accessToken=${encodeURIComponent(accessToken)}`);
  if (!res.ok) return null;
  const json = await res.json();
  return json.installments as ApiInstallmentRow[];
}

// Polls until none of the targeted installments are still 'charging'.
async function pollUntilSettled(accessToken: string, targetNos: number[], attempts = 8, intervalMs = 1500): Promise<ApiInstallmentRow[] | null> {
  let last: ApiInstallmentRow[] | null = null;
  for (let i = 0; i < attempts; i++) {
    last = await fetchInstallmentStatus(accessToken);
    const stillCharging = last?.some((r) => targetNos.includes(r.installment_no) && r.status === "charging");
    if (last && !stillCharging) return last;
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  return last;
}

type InstallmentRow = {
  installmentNo: number;
  amountJpy: number;
  dueDate: string;
  status: "scheduled" | "charging" | "paid" | "failed" | "manual_pending";
};

type InstallmentPaymentPanelProps = {
  accessToken: string;
  installments: InstallmentRow[];
  cardLast4: string | null;
  planStatus: string;
};

const STATUS_LABEL: Record<InstallmentRow["status"], string> = {
  scheduled: "予定 / Upcoming",
  charging: "処理中 / Processing",
  paid: "支払い済み / Paid",
  failed: "失敗 / Failed",
  manual_pending: "要お支払い / Action needed",
};

export function InstallmentPaymentPanel({ accessToken, installments, cardLast4, planStatus }: InstallmentPaymentPanelProps) {
  const [rows, setRows] = useState(installments);
  const [busy, setBusy] = useState<"next" | "all" | null>(null);
  const [error, setError] = useState("");

  const unpaid = rows.filter((r) => r.status === "scheduled");
  const remainingTotal = unpaid.reduce((sum, r) => sum + r.amountJpy, 0);
  const isComplete = planStatus === "completed" || unpaid.length === 0;

  const chargeNow = async (mode: "next" | "all") => {
    setBusy(mode);
    setError("");
    try {
      const res = await fetch("/api/payment/installment-charge-now", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, mode }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "決済に失敗しました。/ The charge failed.");
        setBusy(null);
        return;
      }

      const targetNos = (mode === "next" ? unpaid.slice(0, 1) : unpaid).map((r) => r.installmentNo);
      const settled = await pollUntilSettled(accessToken, targetNos);
      if (settled) {
        setRows(
          settled.map((r) => ({
            installmentNo: r.installment_no,
            amountJpy: rows.find((x) => x.installmentNo === r.installment_no)?.amountJpy ?? 0,
            dueDate: r.due_date,
            status: r.status as InstallmentRow["status"],
          }))
        );
      }
      setBusy(null);
    } catch {
      setError("ネットワークエラーが発生しました。再度お試しください。/ Network error. Please try again.");
      setBusy(null);
    }
  };

  if (isComplete) {
    return (
      <Reveal className="flex flex-col items-center gap-3 rounded-2xl border border-[#ececec] p-8 text-center">
        <PaymentSuccessBadge />
        <p className="text-sm font-semibold text-black">分割払いが完了しました</p>
        <p className="text-xs text-black/50">All installments are paid.</p>
        <LineGroupInvite />
      </Reveal>
    );
  }

  const nextDue = unpaid[0];

  return (
    <Reveal className="overflow-hidden rounded-2xl border border-[#ececec] p-6 shadow-sm md:p-8">
      <div className="mb-5 border-b border-[#ececec] pb-5">
        <h2 className="text-lg font-bold text-black">分割払いのお支払い状況</h2>
        <p className="text-sm text-black/50">Installment Plan</p>
        <p className="mt-2 text-xs text-black/45">表示金額はすべて税抜きです。/ All amounts shown are excluding tax.</p>
      </div>

      <ul className="mb-5 space-y-2">
        {rows.map((row) => (
          <li
            key={row.installmentNo}
            className="flex items-center justify-between rounded-lg border border-[#ececec] px-4 py-3 text-sm"
          >
            <span className="flex items-center gap-2 text-black/70">
              <span className="font-semibold text-black">{row.installmentNo}回目</span>
              <span className="text-black/40">·</span>
              <Calendar size={14} className="text-black/40" aria-hidden="true" />
              {row.dueDate}
            </span>
            <span className="flex items-center gap-3">
              <span className="font-semibold text-black">{formatJpy(row.amountJpy)}</span>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                  row.status === "paid"
                    ? "bg-[#eaf3ff] text-brand-blue"
                    : row.status === "manual_pending" || row.status === "failed"
                      ? "bg-brand-orange text-white"
                      : "bg-[#ececec] text-black/60"
                }`}
              >
                {STATUS_LABEL[row.status]}
              </span>
            </span>
          </li>
        ))}
      </ul>

      {cardLast4 && (
        <div className="mb-5 flex items-center gap-2 rounded-lg bg-[#f7f9fc] px-4 py-3 text-sm text-black/60">
          <CreditCard size={16} className="text-black/40" aria-hidden="true" />
          カード末尾 {cardLast4} / Card ending in {cardLast4}
        </div>
      )}

      {error && (
        <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <AlertCircle size={16} className="mt-0.5 shrink-0 text-red-500" aria-hidden="true" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <div className="flex flex-col gap-2.5">
        <Button
          variant="outline"
          onClick={() => chargeNow("next")}
          disabled={busy !== null}
          className="w-full justify-center"
        >
          {busy === "next" ? "処理中... / Processing..." : `次回分を今すぐ支払う (${formatJpy(nextDue.amountJpy)}) / Pay Next Now`}
        </Button>
        {unpaid.length > 1 && (
          <Button
            variant="primary"
            onClick={() => chargeNow("all")}
            disabled={busy !== null}
            className="w-full justify-center"
          >
            {busy === "all"
              ? "処理中... / Processing..."
              : `残額を今すぐ支払う (${formatJpy(remainingTotal)}) / Pay Full Remaining Now`}
          </Button>
        )}
      </div>
    </Reveal>
  );
}
