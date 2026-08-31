import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { SITE_URL } from "@/lib/constants/site";
import { LOCALES, DEFAULT_LOCALE, isLocale, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import "../globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
});

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

const OG_LOCALE: Record<Locale, string> = { en: "en_US", ja: "ja_JP" };

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = isLocale(rawLang) ? rawLang : DEFAULT_LOCALE;

  const dict = await getDictionary(lang);
  const { title, description, ogAlt } = dict.meta;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        en: "/en",
        ja: "/ja",
        "x-default": "/en",
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${lang}`,
      siteName: "TalenCo",
      images: [{ url: "/assets/images/hero-bg.webp", alt: ogAlt }],
      locale: OG_LOCALE[lang],
      alternateLocale: LOCALES.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/assets/images/hero-bg.webp"],
    },
    verification: {
      google: "3ji-lE_IqbeW5mTS9uIiuTbJ9P5QQTN9y7gTbS_Yc3I"
    }
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang: rawLang } = await params;
  const lang = isLocale(rawLang) ? rawLang : DEFAULT_LOCALE;

  const dict = await getDictionary(lang);

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "TalenCo",
    description: dict.meta.description,
    inLanguage: lang,
    url: `${SITE_URL}/${lang}`,
    logo: `${SITE_URL}/assets/logo-talenco.svg`,
    sameAs: [
      "https://instagram.com/talencoid",
      "https://facebook.com/talencoindonesia",
      "https://tiktok.com/@talencoid",
    ],
  };

  return (
    <html lang={lang} className={plusJakartaSans.variable} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
