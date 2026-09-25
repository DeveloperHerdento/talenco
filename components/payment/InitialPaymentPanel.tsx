"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Reveal } from "@/components/ui/Reveal";
import { Spinner } from "@/components/ui/Spinner";
import { PaymentStep } from "@/components/payment/PaymentStep";
import { PaymentSuccessBadge } from "@/components/payment/PaymentSuccessBadge";
import { LineGroupInvite } from "@/components/payment/LineGroupInvite";
import type { PaymentType } from "@/lib/constants/payment";

type InitialPaymentPanelProps = {
  accessToken: string;
  locale: string;
};

export function InitialPaymentPanel({ accessToken, locale }: InitialPaymentPanelProps) {
  const router = useRouter();
  const [paidType, setPaidType] = useState<PaymentType | null>(null);
  useEffect(() => {
    if (paidType === "installment") {
      router.push(`/${locale}/my?token=${accessToken}`);
    }
  }, [paidType, locale, accessToken, router]);

  if (paidType === "installment") {
    return (
      <Reveal className="mx-auto flex w-full max-w-lg flex-col items-center gap-4 rounded-2xl border border-[#ececec] p-10 shadow-sm text-center">
        <Spinner className="size-8 text-brand-blue" />
        <p className="text-sm text-black/60">登録状況ページへ移動しています... / Redirecting to your registration status...</p>
      </Reveal>
    );
  }

  if (paidType === "full") {
    return (
      <Reveal className="mx-auto flex w-full max-w-lg flex-col items-center gap-4 rounded-2xl border border-[#ececec] p-10 shadow-sm text-center">
        <div className="mb-2 w-full border-b border-[#ececec] pb-5 text-left">
          <h2 className="text-xl font-bold text-brand-blue md:text-2xl">お支払い完了</h2>
          <p className="text-sm text-black/50">Payment Complete</p>
        </div>
        <PaymentSuccessBadge size="lg" />
        <h3 className="text-xl font-bold text-black">お支払いが完了しました</h3>
        <p className="text-sm text-black/60">Your payment is complete.</p>
        <LineGroupInvite />
        <a href={`/${locale}`} className="text-brand-blue text-sm font-semibold hover:underline">
          トップページに戻る / Back to Home
        </a>
      </Reveal>
    );
  }

  return <PaymentStep accessToken={accessToken} locale={locale} onPaid={setPaidType} />;
}
