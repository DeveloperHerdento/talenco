"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SecurityDisclaimer } from "@/components/payment/SecurityDisclaimer";
import { useXenditCardSession } from "@/components/payment/useXenditCardSession";
import { pollPaymentStatus } from "@/components/payment/pollPaymentStatus";
import { Spinner } from "@/components/ui/Spinner";
import {
  PROGRAM_FEES,
  INSTALLMENT_COUNT,
  resolveDisplayAmount,
  resolveDisplayInstallmentAmounts,
  resolveInstallmentSchedule,
  formatJpy,
  type ProgramScheme,
  type PaymentType,
} from "@/lib/constants/payment";

type PaymentStepProps = {
  accessToken: string;
  locale: string;
  onPaid: (paymentType: PaymentType) => void;
};

export function PaymentStep({ accessToken, locale, onPaid }: PaymentStepProps) {
  const [scheme, setScheme] = useState<ProgramScheme>("online");
  const [paymentType, setPaymentType] = useState<PaymentType>("full");
  const { phase, error, ready, containerRef, start, pay } = useXenditCardSession(() => onPaid(paymentType), {
    confirmPaid: () => pollPaymentStatus(accessToken, (d) => d.status === "paid"),
  });

  // Full payment and installment 1 share this hook — installment just sets allow_save_payment_method server-side.
  const startPayment = () =>
    start(() =>
      fetch(paymentType === "installment" ? "/api/payment/installment-session" : "/api/payment/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken, scheme, locale }),
      })
    );

  const fee = PROGRAM_FEES[scheme];
  const previewAmount = resolveDisplayAmount(scheme);
  const installmentAmounts = resolveDisplayInstallmentAmounts(scheme);
  const installmentAvailable = resolveInstallmentSchedule() !== null;
  const chargeAmount = paymentType === "installment" ? installmentAmounts[0] : previewAmount;
  const showSelection = phase === "idle" || phase === "starting";

  return (
    <Reveal className="overflow-hidden rounded-2xl border border-[#ececec] p-6 shadow-sm md:p-8">
      <div className="mb-6 border-b border-[#ececec] pb-5">
        <h2 className="text-xl font-bold text-brand-blue md:text-2xl">お支払い</h2>
        <p className="text-sm text-black/50">Payment</p>
      </div>

      <div className="space-y-6" hidden={!showSelection}>
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
                  <span className="text-sm font-semibold text-black/70">{formatJpy(option.amountJpy)}</span>
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
              <span className="text-sm font-semibold text-black/70">{formatJpy(resolveDisplayAmount(scheme))}</span>
            </label>
            {installmentAvailable && (
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors ${
                  paymentType === "installment" ? "border-brand-blue bg-[#eaf3ff]" : "border-[#e0e0e0] hover:border-black/20"
                }`}
              >
                <input
                  type="radio"
                  name="paymentType"
                  checked={paymentType === "installment"}
                  onChange={() => setPaymentType("installment")}
                  className="mt-0.5 accent-brand-blue"
                />
                <span className="flex-1 text-sm text-black">
                  {INSTALLMENT_COUNT}回の分割払い
                  <br />
                  <span className="text-black/50">Pay in {INSTALLMENT_COUNT} installments</span>
                </span>
                <span className="text-sm font-semibold text-black/70">{formatJpy(installmentAmounts[0])}〜</span>
              </label>
            )}
            {paymentType === "installment" && (
              <p className="px-1 text-xs text-black/45">
                カード情報は保存され、以降の{INSTALLMENT_COUNT - 1}回は自動的に請求されます。/ Your card is saved and the
                remaining {INSTALLMENT_COUNT - 1} charges happen automatically.
              </p>
            )}
          </div>

          <p className="px-1 text-xs text-black/45">表示金額はすべて税抜きです。/ All amounts shown are excluding tax.</p>

          <SecurityDisclaimer />

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button variant="primary" onClick={startPayment} disabled={phase === "starting"} className="w-full justify-center">
            {phase === "starting"
              ? "準備中... / Preparing..."
              : `カード情報を入力する (${formatJpy(chargeAmount)}) / Enter Card Details`}
          </Button>
      </div>

      <div className="space-y-5" hidden={showSelection}>
          <div className="flex items-center justify-between rounded-lg bg-[#f7f9fc] px-4 py-3 text-sm">
            <span className="text-black/60">
              {fee.nameJa} / {fee.nameEn} ·{" "}
              {paymentType === "installment"
                ? locale === "ja"
                  ? "分割払い 1/4"
                  : "Installment 1/4"
                : locale === "ja"
                  ? "全額"
                  : "Full"}
            </span>
            <span className="font-semibold text-black">{formatJpy(chargeAmount)}</span>
          </div>

          <div className="relative min-h-30">
            <div ref={containerRef} className={phase === "submitting" || phase === "confirming" ? "invisible h-0 overflow-hidden" : ""} />
            {(phase === "submitting" || phase === "confirming") && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Spinner className="size-8 text-brand-blue" />
              </div>
            )}
          </div>

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
    </Reveal>
  );
}
