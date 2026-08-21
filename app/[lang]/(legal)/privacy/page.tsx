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
    title: dict.legal.privacy.metaTitle,
    description: dict.legal.privacy.metaDescription,
  };
}

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const p = dict.legal.privacy;

  const THIRD_PARTIES: [string, string][] = [
    [p.thirdParties.institutionalTerm, p.thirdParties.institutionalDesc],
    [p.thirdParties.governmentTerm, p.thirdParties.governmentDesc],
  ];

  const RIGHTS: string[] = [p.rights.item1, p.rights.item2, p.rights.item3];

  const PRIVACY_NAV = [
    { href: "#collection", label: p.nav.collection },
    { href: "#disclosure", label: p.nav.disclosure },
    { href: "#retention", label: p.nav.retention },
    { href: "#rights", label: p.nav.rights },
    { href: "#withdrawal", label: p.nav.withdrawal },
    { href: "#doc-contact", label: p.nav.contact },
  ];

  return (
    <DocLayout dict={dict} locale={lang as Locale} title={p.title} meta={p.lastUpdated} navItems={PRIVACY_NAV}>
      <DocSection id="collection" number="1" title={p.section1.title}>
        <p>{p.section1.text1}</p>
        <p>{p.section1.text2}</p>
      </DocSection>

      <DocSection id="disclosure" number="2" title={p.section2.title}>
        <p>{p.section2.intro}</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {THIRD_PARTIES.map(([name, desc]) => (
            <div key={name} className="flex flex-col gap-1 rounded-xl border border-[#ececec] p-4 text-xs md:text-sm">
              <p className="font-semibold text-black">{name}</p>
              <p className="text-black/60">{desc}</p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection id="retention" number="3" title={p.section3.title}>
        <p>{p.section3.text1}</p>
        <p>{p.section3.text2}</p>
      </DocSection>

      <DocSection id="rights" number="4" title={p.section4.title}>
        <p>{p.section4.intro}</p>
        <ul className="list-disc space-y-2 pl-5 text-black/60">
          {RIGHTS.map((right) => (
            <li key={right}>{right}</li>
          ))}
        </ul>
        <p className="text-xs text-black/45">{p.section4.footnote}</p>
      </DocSection>

      <DocSection id="withdrawal" number="5" title={p.section5.title}>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-800 md:text-sm">
          {p.section5.text}
        </div>
      </DocSection>

      <DocSection id="doc-contact" number="6" title={p.section6.title}>
        <p>{p.section6.text}</p>
        <DocContactLinks />
      </DocSection>
    </DocLayout>
  );
}
