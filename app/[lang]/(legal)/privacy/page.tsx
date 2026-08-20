import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DocLayout } from "@/components/docs/DocLayout";
import { DocSection } from "@/components/docs/DocSection";
import { DocContactLinks } from "@/components/docs/DocContactLinks";
import { isLocale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export const metadata: Metadata = {
  title: "Privacy Policy - TalenCo",
  description: "How TalenCo collects, uses, and protects your personal information.",
};

const THIRD_PARTIES: [string, string][] = [
  [
    "Institutional & Academic Partners",
    "Universities, certification bodies, or affiliated consultants that directly facilitate the User's curriculum and program operations. Data sharing is limited to information relevant to academic needs.",
  ],
  [
    "Government & Legal Authorities",
    "Ministries, embassies, or Immigration Authorities, where submission of identification and financial documents is mandatory for residence permits or visa eligibility. TalenCo is released from liability for further data management after lawful submission.",
  ],
];

const RIGHTS: string[] = [
  "Request access to or copies of administrative personal data stored in the TalenCo system;",
  "Request updates or rectification of data proven to be inaccurate; and",
  "Request deletion of data or withdraw communication consent (opt-out/unsubscribe) from marketing channels and official community groups.",
];

const PRIVACY_NAV = [
  { href: "#collection", label: "Data Collection" },
  { href: "#disclosure", label: "Third-Party Disclosure" },
  { href: "#retention", label: "Retention & Destruction" },
  { href: "#rights", label: "Data Subject Rights" },
  { href: "#withdrawal", label: "Data Withdrawal" },
  { href: "#doc-contact", label: "Contact" },
];

export default async function PrivacyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <DocLayout
      dict={dict}
      locale={lang}
      title="Privacy Policy"
      meta="Last updated: 29 June 2026"
      navItems={PRIVACY_NAV}
    >
      <DocSection id="collection" number="1" title="Collection and Management of Sensitive Data">
        <p>
          When a User registers for TalenCo Services that require physical mobility, cross-border travel, or
          face-to-face programs, relevant legal authorities require TalenCo to collect data classified as Sensitive
          Personal Data — including copies of immigration documents (passport, visa), medical records (health
          certificate, health insurance), and private financial data (financial guarantee certificate, bank account
          statements).
        </p>
        <p>
          TalenCo guarantees that Sensitive Data is processed solely for legal compliance, visa requirements, and
          smooth logistical operations, and is never exploited, sold, or disclosed for commercial or marketing
          purposes.
        </p>
      </DocSection>

      <DocSection id="disclosure" number="2" title="Transparency and Third-Party Disclosure">
        <p>
          To provide the Services and comply with applicable regulations, the User expressly consents to TalenCo
          sharing personal data, on a limited basis, with the following third parties:
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {THIRD_PARTIES.map(([name, desc]) => (
            <div key={name} className="flex flex-col gap-1 rounded-xl border border-[#ececec] p-4 text-xs md:text-sm">
              <p className="font-semibold text-black">{name}</p>
              <p className="text-black/60">{desc}</p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection id="retention" number="3" title="Data Retention and Destruction Policy">
        <p>
          TalenCo strictly implements the principle of data minimization. Sensitive Data relating to immigration,
          financial, and medical requirements is retained only during the critical period of permit processing and
          for the duration of the physical Service.
        </p>
        <p>
          Immediately after the User completes the program and/or is confirmed to have safely returned to their
          country of origin, all copies of such Sensitive Data are deleted and permanently destroyed (secure
          wiping). Basic administrative data (such as name and program completion history) may be retained longer
          solely for certificate issuance, alumni records, and future academic verification.
        </p>
      </DocSection>

      <DocSection id="rights" number="4" title="Data Subject Rights">
        <p>Subject to applicable data protection laws, the User, as a data subject, has the legal right to:</p>
        <ul className="list-disc space-y-2 pl-5 text-black/60">
          {RIGHTS.map((right) => (
            <li key={right}>{right}</li>
          ))}
        </ul>
        <p className="text-xs text-black/45">
          All requests to exercise these rights must be submitted in writing through TalenCo&apos;s official
          communication channels and are processed within a reasonable period in accordance with applicable law.
        </p>
      </DocSection>

      <DocSection id="withdrawal" number="5" title="Exception Clause Regarding Data Withdrawal">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-800 md:text-sm">
          The User&apos;s right to request data deletion is expressly limited while the service process is ongoing.
          If the User withdraws consent or demands deletion of Sensitive Data (such as passport or financial data)
          while the immigration permit application or physical program is ongoing, such action is legally classified
          as unilateral cancellation and voluntary withdrawal. TalenCo then has the absolute right to automatically
          terminate the Services, cancel immigration sponsorship, and all program fees paid shall be deemed fully
          forfeited and strictly non-refundable.
        </div>
      </DocSection>

      <DocSection id="doc-contact" number="6" title="Contact">
        <p>For privacy inquiries, data access, or deletion requests, please contact us via:</p>
        <DocContactLinks />
      </DocSection>
    </DocLayout>
  );
}
