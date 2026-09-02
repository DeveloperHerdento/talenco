"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SecurityDisclaimer } from "@/components/payment/SecurityDisclaimer";
import { useXenditCardSession } from "@/components/payment/useXenditCardSession";
import { pollPaymentStatus } from "@/components/payment/pollPaymentStatus";

type BalancePaymentPanelProps = {
  accessToken: string;
  locale: string;
  balanceAmount: number;
  balanceCurrency: string;
};

export function BalancePaymentPanel({ accessToken, locale, balanceAmount, balanceCurrency }: BalancePaymentPanelProps) {
  const [paid, setPaid] = useState(false);
  const { phase, error, ready, chargedAmount, containerRef, start, pay } = useXenditCardSession(() => setPaid(true), {
    confirmPaid: () => pollPaymentStatus(accessToken, (d) => d.balancePaidAt !== null),
  });

  const startSession = () =>
    start(() =>
      fetch("/api/payment/balance-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, locale }),
      })
    );

  if (paid) {
    return (
      <Reveal className="flex flex-col items-center gap-3 rounded-2xl border border-[#ececec] p-8 text-center">
        <span className="bg-brand-orange flex size-12 items-center justify-center rounded-full text-xl text-white">✓</span>
        <p className="text-sm font-semibold text-black">残額のお支払いが完了しました</p>
        <p className="text-xs text-black/50">Your balance payment is complete.</p>
      </Reveal>
    );
  }

  const showSelection = phase === "idle" || phase === "starting";

  return (
    <Reveal className="overflow-hidden rounded-2xl border border-[#ececec] p-6 shadow-sm md:p-8">
      <div className="mb-6 border-b border-[#ececec] pb-5">
        <h2 className="text-lg font-bold text-black">残額のお支払い</h2>
        <p className="text-sm text-black/50">Pay Remaining Balance</p>
      </div>

      {showSelection ? (
        <div className="space-y-5">
          <div className="flex items-center justify-between rounded-lg bg-[#f7f9fc] px-4 py-3 text-sm">
            <span className="text-black/60">残額 / Balance due</span>
            <span className="text-base font-semibold text-black">
              ${balanceAmount} {balanceCurrency}
            </span>
          </div>

          <SecurityDisclaimer />

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button variant="primary" onClick={startSession} disabled={phase === "starting"} className="w-full justify-center">
            {phase === "starting" ? "準備中... / Preparing..." : `カード情報を入力する ($${balanceAmount}) / Enter Card Details`}
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center justify-between rounded-lg bg-[#f7f9fc] px-4 py-3 text-sm">
            <span className="text-black/60">残額 / Balance due</span>
            <span className="font-semibold text-black">
              {chargedAmount ? `$${chargedAmount.amount} ${chargedAmount.currency}` : `$${balanceAmount} ${balanceCurrency}`}
            </span>
          </div>

          <div ref={containerRef} className="min-h-[120px]" />

          <SecurityDisclaimer compact />

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button
            variant="primary"
            onClick={pay}
            disabled={!ready || phase === "submitting" || phase === "confirming"}
            className="w-full justify-center"
          >
            {phase === "confirming"
              ? "お支払いを確認しています... / Confirming payment..."
              : phase === "submitting"
                ? "処理中... / Processing..."
                : "支払う / Pay"}
          </Button>
        </div>
      )}
    </Reveal>
  );
}
