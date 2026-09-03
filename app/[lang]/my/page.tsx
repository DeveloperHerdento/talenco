import { headers } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DocHero } from "@/components/docs/DocHero";
import { DocContactLinks } from "@/components/docs/DocContactLinks";
import { Reveal } from "@/components/ui/Reveal";
import { BalancePaymentPanel } from "@/components/payment/BalancePaymentPanel";
import { supabase } from "@/lib/supabase";
import { statusLimiter } from "@/lib/ratelimit";
import { getClientIpFromHeaders } from "@/lib/request";
import { PROGRAM_FEES, type ProgramScheme } from "@/lib/constants/payment";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export const metadata: Metadata = {
  title: "登録状況の確認 / My Registration | TalenCo",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

type Registration = {
  id: string;
  full_name: string;
  status: string;
  scheme: string | null;
  payment_type: string | null;
  expected_amount: number | null;
  expected_currency: string | null;
  paid_at: string | null;
  balance_amount: number | null;
  balance_currency: string | null;
  balance_paid_at: string | null;
  next_step: string;
};

function StatusBadge({ label, tone }: { label: string; tone: "pending" | "action" | "done" }) {
  const toneClass =
    tone === "done"
      ? "bg-[#eaf3ff] text-brand-blue"
      : tone === "action"
        ? "bg-brand-orange text-white"
        : "bg-[#ececec] text-black/60";
  return <span className={`w-fit rounded-full px-3 py-1 text-xs font-bold uppercase ${toneClass}`}>{label}</span>;
}

export default async function MyRegistrationPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const { token } = await searchParams;
  const dict = await getDictionary(lang);

  const ip = getClientIpFromHeaders(await headers());
  const { success: allowed } = await statusLimiter.limit(ip);

  return (
    <>
      <main className="flex min-h-screen w-full flex-col items-center bg-white">
        <Navbar dict={dict.nav} locale={lang as Locale} />
        <DocHero title={lang === "ja" ? "登録状況の確認" : "My Registration"} meta="Global Career Starter Program" />

        <div className="w-full px-4 py-10 md:px-8 md:py-14">
          <div className="mx-auto flex w-full max-w-[560px] flex-col gap-8">
            {!allowed ? (
              <Reveal className="rounded-2xl border border-[#ececec] p-8 text-center">
                <p className="text-sm text-black/60">
                  リクエストが多すぎます。しばらくしてからもう一度お試しください。
                  <br />
                  Too many requests. Please try again later.
                </p>
              </Reveal>
            ) : !token ? (
              <NotFoundCard />
            ) : (
              <RegistrationStatus token={token} lang={lang as Locale} />
            )}
          </div>
        </div>
      </main>
      <Footer nav={dict.nav} dict={dict.footer} locale={lang as Locale} />
    </>
  );
}

function NotFoundCard() {
  return (
    <Reveal className="flex flex-col items-center gap-4 rounded-2xl border border-[#ececec] p-10 text-center">
      <p className="text-sm text-black/60">
        登録情報が見つかりませんでした。リンクをご確認ください。
        <br />
        Registration not found. Please check the link and try again.
      </p>
      <DocContactLinks />
    </Reveal>
  );
}

async function RegistrationStatus({ token, lang }: { token: string; lang: Locale }) {
  const { data: reg } = await supabase
    .from("registrations")
    .select(
      "id, full_name, status, scheme, payment_type, expected_amount, expected_currency, paid_at, balance_amount, balance_currency, balance_paid_at, next_step"
    )
    .eq("access_token", token)
    .maybeSingle<Registration>();

  if (!reg) return <NotFoundCard />;

  const fee = reg.scheme ? PROGRAM_FEES[reg.scheme as ProgramScheme] : null;
  const isPaid = reg.status === "paid";
  const isDp = reg.payment_type === "dp";
  const balanceOwed = isPaid && isDp && !reg.balance_paid_at;

  return (
    <>
      <Reveal className="flex flex-col gap-5 rounded-2xl border border-[#ececec] p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-black/50">
            {reg.full_name} 様 <span className="text-black/30">/ {reg.full_name}</span>
          </p>
          {balanceOwed ? (
            <StatusBadge label="頭金支払い済み・残額あり / Balance Due" tone="action" />
          ) : isPaid ? (
            <StatusBadge label="お支払い完了 / Fully Paid" tone="done" />
          ) : (
            <StatusBadge label="お支払い待ち / Payment Pending" tone="pending" />
          )}
        </div>

        {fee && (
          <div className="flex flex-col gap-2 border-t border-[#ececec] pt-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-black/60">プログラム / Program</span>
              <span className="font-semibold text-black">{fee.jpyLabel}</span>
            </div>
            {isPaid && reg.expected_amount !== null && (
              <div className="flex items-center justify-between">
                <span className="text-black/60">{isDp ? "頭金 / Down payment" : "お支払い額 / Paid"}</span>
                <span className="font-semibold text-black">
                  ${reg.expected_amount} {reg.expected_currency}
                </span>
              </div>
            )}
            {isDp && reg.balance_amount !== null && (
              <div className="flex items-center justify-between">
                <span className="text-black/60">残額 / Balance</span>
                <span className="font-semibold text-black">
                  {reg.balance_paid_at ? "お支払い済み / Paid" : `$${reg.balance_amount} ${reg.balance_currency}`}
                </span>
              </div>
            )}
          </div>
        )}

        {!isPaid && (
          <p className="border-t border-[#ececec] pt-4 text-xs text-black/50">
            {reg.next_step === "payment"
              ? "お支払いに関するご案内は登録完了メールをご確認ください。/ Check your registration email for payment instructions."
              : "近日中に担当者より詳細情報をご案内します。/ Our team will follow up shortly with more information."}
          </p>
        )}
      </Reveal>

      {balanceOwed && reg.balance_amount !== null && reg.balance_currency && (
        <BalancePaymentPanel accessToken={token} locale={lang} balanceAmount={reg.balance_amount} balanceCurrency={reg.balance_currency} />
      )}

      <div className="flex flex-col items-center gap-3 text-center">
        <p className="text-sm text-black/50">
          ご不明な点はお気軽にお問い合わせください。
          <br />
          Feel free to reach out if you have any questions.
        </p>
        <DocContactLinks />
      </div>
    </>
  );
}
