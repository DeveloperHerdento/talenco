"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SecurityDisclaimer } from "@/components/payment/SecurityDisclaimer";
import { useXenditCardSession } from "@/components/payment/useXenditCardSession";
import { pollPaymentStatus } from "@/components/payment/pollPaymentStatus";
import { PROGRAM_FEES, DP_PERCENT, resolveAmount, type ProgramScheme, type PaymentType } from "@/lib/constants/payment";

type PaymentStepProps = {
  accessToken: string;
  locale: string;
  onPaid: () => void;
};

const DP_LABEL = `${Math.round(DP_PERCENT * 100)}%`;

export function PaymentStep({ accessToken, locale, onPaid }: PaymentStepProps) {
  const [scheme, setScheme] = useState<ProgramScheme>("online");
  const [paymentType, setPaymentType] = useState<PaymentType>("full");
  const { phase, error, ready, chargedAmount, containerRef, start, pay } = useXenditCardSession(onPaid, {
    confirmPaid: () => pollPaymentStatus(accessToken, (d) => d.status === "paid"),
  });

  const startSession = () =>
    start(() =>
      fetch("/api/payment/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, scheme, paymentType, locale }),
      })
    );

  const fee = PROGRAM_FEES[scheme];
  const previewAmount = resolveAmount(scheme, paymentType);
  const showSelection = phase === "idle" || phase === "starting";

  return (
    <Reveal className="overflow-hidden rounded-2xl border border-[#ececec] p-6 shadow-sm md:p-8">
      <div className="mb-6 border-b border-[#ececec] pb-5">
        <h2 className="text-lg font-bold text-black">お支払い</h2>
        <p className="text-sm text-black/50">Payment</p>
      </div>

      {showSelection ? (
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-black">
              参加プログラム <span className="ml-1 font-normal text-black/50">/ Program</span>
            </p>
            {(Object.keys(PROGRAM_FEES) as ProgramScheme[]).map((key) => {
              const option = PROGRAM_FEES[key];
              return (
                <label
                  key={key}
                  className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg border px-4 py-3 transition-colors ${
                    scheme === key ? "border-brand-blue bg-[#eaf3ff]" : "border-[#e0e0e0] hover:border-black/20"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="scheme"
                      checked={scheme === key}
                      onChange={() => setScheme(key)}
                      className="accent-brand-blue"
                    />
                    <span className="text-sm text-black">
                      {option.nameJa} <span className="text-black/50">/ {option.nameEn}</span>
                    </span>
                  </span>
                  <span className="text-sm font-semibold text-black/70">{option.jpyLabel}</span>
                </label>
              );
            })}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-semibold text-black">
              お支払い方法 <span className="ml-1 font-normal text-black/50">/ Payment Amount</span>
            </p>
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors ${
                paymentType === "dp" ? "border-brand-blue bg-[#eaf3ff]" : "border-[#e0e0e0] hover:border-black/20"
              }`}
            >
              <input
                type="radio"
                name="paymentType"
                checked={paymentType === "dp"}
                onChange={() => setPaymentType("dp")}
                className="mt-0.5 accent-brand-blue"
              />
              <span className="flex-1 text-sm text-black">
                頭金（{DP_LABEL}）で予約する
                <br />
                <span className="text-black/50">Reserve with a {DP_LABEL} down payment</span>
              </span>
              <span className="text-sm font-semibold text-black/70">${resolveAmount(scheme, "dp")}</span>
            </label>
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors ${
                paymentType === "full" ? "border-brand-blue bg-[#eaf3ff]" : "border-[#e0e0e0] hover:border-black/20"
              }`}
            >
              <input
                type="radio"
                name="paymentType"
                checked={paymentType === "full"}
                onChange={() => setPaymentType("full")}
                className="mt-0.5 accent-brand-blue"
              />
              <span className="flex-1 text-sm text-black">
                全額を支払う
                <br />
                <span className="text-black/50">Pay in full</span>
              </span>
              <span className="text-sm font-semibold text-black/70">${resolveAmount(scheme, "full")}</span>
            </label>
            {paymentType === "dp" && (
              <p className="px-1 text-xs text-black/45">
                残金 ${fee.amountUsd - previewAmount} は後日ご案内します。/ The remaining $
                {fee.amountUsd - previewAmount} will be invoiced separately.
              </p>
            )}
          </div>

          <SecurityDisclaimer />

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button variant="primary" onClick={startSession} disabled={phase === "starting"} className="w-full justify-center">
            {phase === "starting"
              ? "準備中... / Preparing..."
              : `カード情報を入力する ($${previewAmount}) / Enter Card Details`}
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex items-center justify-between rounded-lg bg-[#f7f9fc] px-4 py-3 text-sm">
            <span className="text-black/60">
              {fee.nameJa} / {fee.nameEn} · {paymentType === "dp" ? `${DP_LABEL} DP` : locale === "ja" ? "全額" : "Full"}
            </span>
            <span className="font-semibold text-black">
              {chargedAmount ? `$${chargedAmount.amount} ${chargedAmount.currency}` : fee.jpyLabel}
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
