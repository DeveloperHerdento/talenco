import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DocHero } from "@/components/docs/DocHero";
import { DocContactLinks } from "@/components/docs/DocContactLinks";
import { RegisterForm } from "@/components/register/RegisterForm";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export const metadata: Metadata = {
  title: "登録フォーム / Registration Form | TalenCo",
  description: "Global Career Starter Program への参加登録はこちらから。",
};

export default async function RegisterPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <>
      <main className="flex min-h-screen w-full flex-col items-center bg-white">
        <Navbar dict={dict.nav} locale={lang as Locale} />
        <DocHero title="参加登録 / Registration" meta="Global Career Starter Program" />

        <div className="w-full px-4 py-10 md:px-8 md:py-14">
          <RegisterForm locale={lang} />

          <div className="mx-auto mt-10 flex w-full max-w-[720px] flex-col items-center gap-3 text-center">
            <p className="text-sm text-black/50">
              ご不明な点はお気軽にお問い合わせください。
              <br />
              Feel free to reach out if you have any questions.
            </p>
            <DocContactLinks />
          </div>
        </div>
      </main>
      <Footer nav={dict.nav} dict={dict.footer} locale={lang as Locale} />
    </>
  );
}
