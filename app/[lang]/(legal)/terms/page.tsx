import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DocLayout } from "@/components/docs/DocLayout";
import { DocSection } from "@/components/docs/DocSection";
import { DocContactLinks } from "@/components/docs/DocContactLinks";
import { isLocale, type Locale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.legal.terms.metaTitle,
    description: dict.legal.terms.metaDescription,
  };
}

export default async function TermsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const t = dict.legal.terms;

  const DEFINITIONS: [string, string][] = [
    [t.definitions.hgsTerm, t.definitions.hgsDesc],
    [t.definitions.hgsServicesTerm, t.definitions.hgsServicesDesc],
    [t.definitions.talencoTerm, t.definitions.talencoDesc],
    [t.definitions.userTerm, t.definitions.userDesc],
    [t.definitions.affiliateTerm, t.definitions.affiliateDesc],
  ];

  const TERMS_NAV = [
    { href: "#general-provisions", label: t.nav.generalProvisions },
    { href: "#overview", label: t.nav.overview },
    { href: "#registration", label: t.nav.registration },
    { href: "#account-security", label: t.nav.accountSecurity },
    { href: "#payment", label: t.nav.payment },
    { href: "#third-party", label: t.nav.thirdParty },
    { href: "#miscellaneous", label: t.nav.miscellaneous },
    { href: "#doc-contact", label: t.nav.contact },
  ];

  return (
    <DocLayout dict={dict} locale={lang as Locale} title={t.title} meta={t.lastUpdated} navItems={TERMS_NAV}>
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-800 md:text-sm">
        {t.banner}
      </div>

      <DocSection id="general-provisions" number="1" title={t.section1.title}>
        <p>{t.section1.intro}</p>
        <div className="flex flex-col gap-2">
          {DEFINITIONS.map(([term, desc]) => (
            <div key={term} className="rounded-xl bg-[#f7f9fc] p-4 text-xs md:text-sm">
              <p className="font-semibold text-black">{term}</p>
              <p className="mt-1 text-black/60">{desc}</p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection id="overview" number="2" title={t.section2.title}>
        <p>{t.section2.intro}</p>
        <ul className="list-disc space-y-1 pl-5 text-black/60">
          <li>{t.section2.bullet1}</li>
          <li>{t.section2.bullet2}</li>
          <li>{t.section2.bullet3}</li>
        </ul>
      </DocSection>

      <DocSection id="registration" number="3" title={t.section3.title}>
        <ul className="flex flex-col gap-2">
          <li className="rounded-xl bg-[#f7f9fc] p-4 text-xs md:text-sm">{t.section3.item1}</li>
          <li className="rounded-xl bg-[#f7f9fc] p-4 text-xs md:text-sm">{t.section3.item2}</li>
          <li className="rounded-xl bg-[#f7f9fc] p-4 text-xs md:text-sm">{t.section3.item3}</li>
          <li className="rounded-xl border border-brand-blue bg-[#eaf3ff] p-4 text-xs md:text-sm">
            {t.section3.privacyPrefix}{" "}
            <a href={`/${lang}/privacy`} className="text-brand-blue hover:underline">
              {t.section3.privacyLinkLabel}
            </a>
            {t.section3.privacySuffix}
          </li>
        </ul>
      </DocSection>

      <DocSection id="account-security" number="4" title={t.section4.title}>
        <p className="font-semibold text-black">{t.section4.accountSecurityLabel}</p>
        <p>{t.section4.accountSecurityText}</p>
        <p className="font-semibold text-black">{t.section4.dataAccuracyLabel}</p>
        <p>{t.section4.dataAccuracyText}</p>
        <p className="font-semibold text-black">{t.section4.cyberLabel}</p>
        <p>{t.section4.cyberText}</p>
      </DocSection>

      <DocSection id="payment" number="5" title={t.section5.title}>
        <p>{t.section5.intro}</p>
        <div className="rounded-xl bg-[#f7f9fc] p-4 text-xs md:text-sm">
          <p className="mb-1 font-semibold text-black">{t.section5.bankingLabel}</p>
          <p className="text-black/60">{t.section5.bankingText}</p>
        </div>
        <div className="rounded-xl bg-[#f7f9fc] p-4 text-xs md:text-sm">
          <p className="mb-1 font-semibold text-black">{t.section5.liabilityLabel}</p>
          <p className="text-black/60">{t.section5.liabilityText}</p>
        </div>
        <div className="rounded-xl border border-brand-blue bg-[#eaf3ff] p-4 text-xs md:text-sm">
          <p className="mb-1 font-semibold text-brand-blue">{t.section5.finalLabel}</p>
          <p className="text-black/70">{t.section5.finalText}</p>
        </div>
      </DocSection>

      <DocSection id="third-party" number="6" title={t.section6.title}>
        <p>{t.section6.text1}</p>
        <p>{t.section6.text2}</p>
      </DocSection>

      <DocSection id="miscellaneous" number="7" title={t.section7.title}>
        <ul className="list-disc space-y-2 pl-5 text-black/60">
          <li>{t.section7.item1}</li>
          <li>{t.section7.item2}</li>
          <li>{t.section7.item3}</li>
          <li>{t.section7.item4}</li>
          <li>{t.section7.item5}</li>
          <li>{t.section7.item6}</li>
        </ul>
      </DocSection>

      <DocSection id="doc-contact" number="8" title={t.section8.title}>
        <p>{t.section8.text}</p>
        <DocContactLinks />
      </DocSection>
    </DocLayout>
  );
}
