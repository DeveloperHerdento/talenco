import { headers } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DocHero } from "@/components/docs/DocHero";
import { DocContactLinks } from "@/components/docs/DocContactLinks";
import { Reveal } from "@/components/ui/Reveal";
import { InitialPaymentPanel } from "@/components/payment/InitialPaymentPanel";
import { InstallmentPaymentPanel } from "@/components/payment/InstallmentPaymentPanel";
import { LineGroupInvite } from "@/components/payment/LineGroupInvite";
import { supabase } from "@/lib/supabase";
import { statusLimiter } from "@/lib/ratelimit";
import { getClientIpFromHeaders } from "@/lib/request";
import { logger } from "@/lib/logger";
import { PROGRAM_FEES, INSTALLMENT_COUNT, formatJpy, resolveDisplayInstallmentAmounts, type ProgramScheme } from "@/lib/constants/payment";
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
  display_amount: number | null;
  paid_at: string | null;
  next_step: string;
};

function formatPaidDate(iso: string): string {
  const d = new Date(iso);
  const ja = d.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
  const en = d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return `${ja} / ${en}`;
}

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
        <DocHero title="登録状況の確認 / My Registration" meta="Global Career Starter Program" />

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

function ErrorCard() {
  return (
    <Reveal className="flex flex-col items-center gap-4 rounded-2xl border border-[#ececec] p-10 text-center">
      <p className="text-sm text-black/60">
        登録状況の確認中にエラーが発生しました。しばらくしてからもう一度お試しください。
        <br />
        Something went wrong while checking your registration. Please try again shortly.
      </p>
      <DocContactLinks />
    </Reveal>
  );
}

async function RegistrationStatus({ token, lang }: { token: string; lang: Locale }) {
  const { data: reg, error } = await supabase
    .from("registrations")
    .select("id, full_name, status, scheme, payment_type, expected_amount, expected_currency, display_amount, paid_at, next_step")
    .eq("access_token", token)
    .maybeSingle<Registration>();

  // A query error isn't the same as "no such token" — keep them distinguishable in the logs.
  if (error) {
    logger.error("My page: registration lookup failed", { error: error.message });
    return <ErrorCard />;
  }
  if (!reg) return <NotFoundCard />;

  const fee = reg.scheme ? PROGRAM_FEES[reg.scheme as ProgramScheme] : null;
  const isPaid = reg.status === "paid";
  const isInstallment = reg.payment_type === "installment";
  const needsInitialPayment = !isPaid && reg.next_step === "payment";

  type InstallmentStatus = "scheduled" | "charging" | "paid" | "failed" | "manual_pending";
  let installmentRows: { installmentNo: number; amountJpy: number; dueDate: string; status: InstallmentStatus }[] = [];
  let installmentPlanStatus = "";
  let installmentCardLast4: string | null = null;

  if (isPaid && isInstallment && reg.scheme) {
    const { data: plan } = await supabase
      .from("installment_plans")
      .select("id, status, card_last4")
      .eq("registration_id", reg.id)
      .maybeSingle();

    if (plan) {
      installmentPlanStatus = plan.status;
      installmentCardLast4 = plan.card_last4;
      const { data: rows } = await supabase
        .from("installments")
        .select("installment_no, due_date, status")
        .eq("plan_id", plan.id)
        .order("installment_no", { ascending: true });

      const displayAmounts = resolveDisplayInstallmentAmounts(reg.scheme as ProgramScheme);
      installmentRows = (rows ?? []).map((r) => ({
        installmentNo: r.installment_no,
        amountJpy: displayAmounts[r.installment_no - 1] ?? 0,
        dueDate: r.due_date,
        status: r.status as InstallmentStatus,
      }));
    }
  }

  // Hidden while payment is pending — InitialPaymentPanel is the only card shown until paid.
  return (
    <>
      {!needsInitialPayment && (
      <Reveal className="flex flex-col gap-5 rounded-2xl border border-[#ececec] p-6 shadow-sm md:p-8">
        <div className="">
          <h2 className="text-xl font-bold text-brand-blue md:text-2xl">登録情報</h2>
          <p className="text-sm text-black/50">Registration Details</p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm text-black/50">
            {reg.full_name} 様 <span className="text-black/30">/ {reg.full_name}</span>
          </p>
          {isInstallment && isPaid && installmentPlanStatus !== "completed" ? (
            <StatusBadge label="分割払い中 / Installments in Progress" tone="action" />
          ) : isPaid ? (
            <StatusBadge label="お支払い完了 / Fully Paid" tone="done" />
          ) : (
            <StatusBadge label="お支払い待ち / Payment Pending" tone="pending" />
          )}
        </div>

        {fee && (
          <div className="flex flex-col gap-2.5 border-t border-[#ececec] pt-4 text-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="text-black/60">プログラム / Program</span>
              <span className="font-semibold text-black">
                {fee.nameJa} <span className="font-normal text-black/50">/ {fee.nameEn}</span>
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-black/60">お支払い方法 / Payment Method</span>
              <span className="font-semibold text-black">
                {isInstallment ? `分割払い (${INSTALLMENT_COUNT}回)` : "一括払い"}{" "}
                <span className="font-normal text-black/50">/ {isInstallment ? `Installment (${INSTALLMENT_COUNT}x)` : "Full Payment"}</span>
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-black/60">プログラム料金 / Program Fee</span>
              <span className="font-semibold text-black">{formatJpy(fee.amountJpy)}</span>
            </div>
            {isPaid && reg.display_amount !== null && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-black/60">お支払い済み額 / Amount Paid</span>
                <span className="font-semibold text-black">{formatJpy(reg.display_amount)}</span>
              </div>
            )}
            {isPaid && reg.paid_at && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-black/60">お支払い日 / Payment Date</span>
                <span className="font-semibold text-black">{formatPaidDate(reg.paid_at)}</span>
              </div>
            )}
            <div className="flex items-center justify-between gap-4">
              <span className="text-black/60">登録番号 / Reference No.</span>
              <span className="font-semibold text-black">TC-{reg.id.slice(0, 8).toUpperCase()}</span>
            </div>
            <p className="text-xs text-black/45">表示金額はすべて税抜きです。/ All amounts shown are excluding tax.</p>
          </div>
        )}

        {!isPaid && !needsInitialPayment && (
          <p className="border-t border-[#ececec] pt-4 text-xs leading-relaxed text-black/50">
            近日中に担当者より詳細情報をご案内します。/ Our team will follow up shortly with more information.
          </p>
        )}

        {isPaid && !isInstallment && (
          <>
            <p className="border-t border-[#ececec] pt-4 text-xs leading-relaxed text-black/50">
              お支払いありがとうございます。担当者より近日中にプログラム開始のご案内をメールでお送りします。<br />
              Thank you for your payment. Our team will email you with program start details shortly.
            </p>
            <LineGroupInvite />
          </>
        )}
      </Reveal>
      )}

      {needsInitialPayment && <InitialPaymentPanel accessToken={token} locale={lang} />}

      {isPaid && isInstallment && installmentRows.length > 0 && (
        <InstallmentPaymentPanel
          accessToken={token}
          installments={installmentRows}
          cardLast4={installmentCardLast4}
          planStatus={installmentPlanStatus}
        />
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
