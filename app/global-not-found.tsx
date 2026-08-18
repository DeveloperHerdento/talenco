// Experimental Next.js convention (requires experimental.globalNotFound in
// next.config.ts) for apps whose only layout is nested under a dynamic
// segment (here, app/[lang]/layout.tsx). Next.js skips normal rendering for
// this file, so it must be a fully self-contained document — its own
// <html>/<body>, its own font, and its own import of globals.css — and it
// can't read route params. It can still be async and read the saved-locale
// cookie (set by proxy.ts) via next/headers, so the copy isn't stuck in
// English for visitors who'd chosen Japanese.
import type { Metadata } from "next";
import Image from "next/image";
import { cookies } from "next/headers";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Button } from "@/components/ui/Button";
import { RichText } from "@/components/ui/RichText";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
});

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for doesn't exist or may have moved.",
};

export default async function GlobalNotFound() {
  const cookieStore = await cookies();
  const saved = cookieStore.get(LOCALE_COOKIE)?.value;
  const locale = saved && isLocale(saved) ? saved : DEFAULT_LOCALE;
  const dict = (await getDictionary(locale)).notFound;

  return (
    <html lang={locale} className={plusJakartaSans.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <main className="flex min-h-screen w-full flex-col items-center justify-center gap-10 bg-white px-4 py-20 text-center sm:gap-12 sm:py-24 md:gap-14 md:px-8 md:py-28">
          <a href={`/${locale}`} className="shrink-0">
            <Image
              src="/assets/logotype-talenco.svg"
              alt="TalenCo"
              width={149}
              height={40}
              priority
              className="h-8 w-auto md:h-9"
            />
          </a>

          <span className="text-brand-blue text-8xl leading-none font-extrabold sm:text-8xl md:text-9xl">
            404
          </span>

          <div className="flex flex-col gap-5 md:gap-6">
            <span className="text-brand-orange text-base font-bold tracking-[1px] uppercase sm:text-lg md:text-xl">
              {dict.eyebrow}
            </span>
            <h1 className="text-2xl font-extrabold text-black sm:text-3xl md:text-4xl lg:text-5xl">
              <RichText text={dict.title} />
            </h1>
            <p className="mx-auto max-w-md text-sm leading-relaxed text-black/60 sm:text-base md:text-lg">
              {dict.body}
            </p>
          </div>

          <Button variant="primary" href={`/${locale}`}>
            {dict.ctaPrimary}
          </Button>
        </main>
      </body>
    </html>
  );
}
