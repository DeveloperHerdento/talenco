"use client";

import { useState } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { PaymentStep } from "@/components/payment/PaymentStep";

type InitialPaymentPanelProps = {
  accessToken: string;
  locale: string;
};

export function InitialPaymentPanel({ accessToken, locale }: InitialPaymentPanelProps) {
  const [paid, setPaid] = useState(false);

  if (paid) {
    return (
      <Reveal className="flex flex-col items-center gap-3 rounded-2xl border border-[#ececec] p-8 text-center">
        <span className="bg-brand-orange flex size-12 items-center justify-center rounded-full text-xl text-white">✓</span>
        <p className="text-sm font-semibold text-black">お支払いが完了しました</p>
        <p className="text-xs text-black/50">Your payment is complete.</p>
      </Reveal>
    );
  }

  return <PaymentStep accessToken={accessToken} locale={locale} onPaid={() => setPaid(true)} />;
}
