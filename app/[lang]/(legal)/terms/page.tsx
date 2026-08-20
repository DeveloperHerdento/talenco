import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DocLayout } from "@/components/docs/DocLayout";
import { DocSection } from "@/components/docs/DocSection";
import { DocContactLinks } from "@/components/docs/DocContactLinks";
import { isLocale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export const metadata: Metadata = {
  title: "Terms & Conditions - TalenCo",
  description: "Terms and conditions governing the use of TalenCo's digital platform and services.",
};

const DEFINITIONS: [string, string][] = [
  ["HGS", "PT Herdento Global Solusi, the principal legal entity owning and operating the services."],
  [
    "HGS Services",
    "All products, digital platforms (including TalenCo), career consultation services (such as GCSP), educational programs, and other integrated systems developed, managed, and operated under PT Herdento Global Solusi.",
  ],
  [
    "TalenCo",
    "The digital education service platform and ecosystem wholly owned, managed, and operated by HGS. References to “TalenCo” relating to releases of liability, licenses, or absolute rights are legally binding and directly protect its parent entity, PT Herdento Global Solusi.",
  ],
  [
    "User",
    "Any individual, whether an Indonesian Citizen (WNI) or Foreign Citizen (WNA), who registers, creates an account, accesses, or conducts transactions on the TalenCo platform or other HGS Services.",
  ],
  [
    "Affiliate Partner / Third Party",
    "External entities, academic institutions, government agencies, or technology vendors (including payment gateways) lawfully integrated with and cooperating with HGS in providing the Services.",
  ],
];

const TERMS_NAV = [
  { href: "#general-provisions", label: "General Provisions" },
  { href: "#overview", label: "Overview" },
  { href: "#registration", label: "Registration" },
  { href: "#account-security", label: "Account Security" },
  { href: "#payment", label: "Payment Gateway" },
  { href: "#third-party", label: "Third-Party & Media" },
  { href: "#miscellaneous", label: "Miscellaneous" },
  { href: "#doc-contact", label: "Contact" },
];

export default async function TermsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <DocLayout
      dict={dict}
      locale={lang}
      title="Terms & Conditions"
      meta="Last updated: 29 June 2026"
      navItems={TERMS_NAV}
    >
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-800 md:text-sm">
        These Terms and Conditions strictly govern the use of the TalenCo platform and digital services only.
        Technical operational details, academic curricula, physical facility coverage, and specific program
        prerequisites (including On-Site activities) are separately governed by an Activity Implementation
        Agreement or service offering document issued for each program.
      </div>

      <DocSection id="general-provisions" number="1" title="General Provisions">
        <p>In these Terms and Conditions, the following terms have the meanings set out below.</p>
        <div className="flex flex-col gap-2">
          {DEFINITIONS.map(([term, desc]) => (
            <div key={term} className="rounded-xl bg-[#f7f9fc] p-4 text-xs md:text-sm">
              <p className="font-semibold text-black">{term}</p>
              <p className="mt-1 text-black/60">{desc}</p>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection id="overview" number="2" title="Overview of the TalenCo Ecosystem Services">
        <p>
          The TalenCo ecosystem facilitates international education programs, career development, consulting, and
          other supporting services. Through this ecosystem, Users may:
        </p>
        <ul className="list-disc space-y-1 pl-5 text-black/60">
          <li>Register for and participate in various programs, classes, or consulting services offered;</li>
          <li>
            Access curricula, learning materials, or mentoring sessions through the Learning Management System
            (LMS) or other communication platforms; and/or
          </li>
          <li>Make payment transactions to secure a spot in certain services or events.</li>
        </ul>
      </DocSection>

      <DocSection id="registration" number="3" title="User Registration and Data Accuracy">
        <ul className="flex flex-col gap-2">
          <li className="rounded-xl bg-[#f7f9fc] p-4 text-xs md:text-sm">
            The User must independently complete the registration form and provide accurate, complete, and
            up-to-date information, including basic information, background, English proficiency level, and
            motivation.
          </li>
          <li className="rounded-xl bg-[#f7f9fc] p-4 text-xs md:text-sm">
            By clicking &quot;Agree&quot; or submitting registration data, the User grants TalenCo permission to
            collect, process, store, and use such data for academic profile evaluation, administrative
            communication, and transfer to relevant third parties for immigration and academic verification
            purposes.
          </li>
          <li className="rounded-xl bg-[#f7f9fc] p-4 text-xs md:text-sm">
            Failure to provide accurate data may result in disqualification from program participation.
          </li>
          <li className="rounded-xl border border-brand-blue bg-[#eaf3ff] p-4 text-xs md:text-sm">
            Collection, use, disclosure, and protection of the User&apos;s personal and sensitive data (including
            documents used for visa applications) are fully governed by our{" "}
            <a href={`/${lang}/privacy`} className="text-brand-blue hover:underline">
              Privacy Policy
            </a>
            . By submitting the registration form, the User is deemed to have read and agreed to it.
          </li>
        </ul>
      </DocSection>

      <DocSection id="account-security" number="4" title="Account Security &amp; Limitation of Data Liability">
        <p className="font-semibold text-black">Account Security Responsibility</p>
        <p>
          The User is solely responsible for maintaining the confidentiality of their account credentials. All
          activities conducted under the User&apos;s account are legally deemed authorized actions of the User.
          TalenCo is released from any losses arising from the User&apos;s negligence in securing their device or
          account (including hacking or phishing incidents).
        </p>
        <p className="font-semibold text-black">Guarantee of Data Accuracy and Validity</p>
        <p>
          The User warrants that all data, identification documents, medical certificates, and financial data
          submitted are accurate, valid, unexpired, and not falsified. If discrepancy, falsification, or legal
          implication (such as visa rejection) is discovered, TalenCo has the right to unilaterally terminate the
          services without refund of the program fee.
        </p>
        <p className="font-semibold text-black">Cyber Protection Measures</p>
        <p>
          TalenCo implements reasonable industry-standard security measures. To the extent permitted by law,
          TalenCo is not liable for data breaches or damage caused by third-party cyber-attacks, advanced hacking,
          or system failures beyond its reasonable control (digital Force Majeure).
        </p>
      </DocSection>

      <DocSection id="payment" number="5" title="Transactions and Payment Gateway">
        <p>
          Payments are processed through official third-party Payment Gateway providers designated by TalenCo
          (such as Xendit or other affiliated partners). Payment of service fees, in full or by installment, is
          subject to the policies determined by TalenCo for each program.
        </p>
        <div className="rounded-xl bg-[#f7f9fc] p-4 text-xs md:text-sm">
          <p className="mb-1 font-semibold text-black">Banking Data Security</p>
          <p className="text-black/60">
            TalenCo does not directly process, store, or manage the User&apos;s sensitive banking data (card
            numbers, CVV, or PIN). Financial data processing is subject to the security standards and policies of
            the relevant Payment Gateway partner.
          </p>
        </div>
        <div className="rounded-xl bg-[#f7f9fc] p-4 text-xs md:text-sm">
          <p className="mb-1 font-semibold text-black">Limitation of Liability</p>
          <p className="text-black/60">
            TalenCo is released from obligations or claims arising from issues beyond its reasonable control,
            including transaction failures, double charges, settlement delays, downtime, or data breaches within
            the Payment Gateway partner&apos;s system.
          </p>
        </div>
        <div className="rounded-xl border border-brand-blue bg-[#eaf3ff] p-4 text-xs md:text-sm">
          <p className="mb-1 font-semibold text-brand-blue">Final Contract Details</p>
          <p className="text-black/70">
            These Terms exclusively govern the use of digital facilities. Service fees, cost exclusions, payment
            deadlines, and the Refund Policy are separately regulated in the Activity Implementation Agreement or
            official Invoice.
          </p>
        </div>
      </DocSection>

      <DocSection id="third-party" number="6" title="Third-Party Services &amp; Media Release">
        <p>
          TalenCo services may be integrated with Third Parties, including academic curriculum providers, testing
          facilities, consulting services, technology vendors, and immigration document verification providers.
          TalenCo is not responsible for technical issues or policies specific to such Third Party&apos;s systems.
        </p>
        <p>
          For documentation, portfolio, and promotional purposes, the User grants TalenCo a non-exclusive,
          royalty-free, and perpetual right to take, record, store, and publish visual documentation (photos/videos)
          containing the User&apos;s face, voice, or activities while using the Services, and waives the right to
          demand take-down, except where publication violates public decency norms under Indonesian law.
        </p>
      </DocSection>

      <DocSection id="miscellaneous" number="7" title="Miscellaneous">
        <ul className="list-disc space-y-2 pl-5 text-black/60">
          <li>
            Notices, invoices, consents, and disclosures sent electronically via the User&apos;s registered email or
            official communication channels satisfy all legal requirements for valid written communication.
          </li>
          <li>
            TalenCo reserves the right to update these Terms at any time without prior notice. Continuing payment
            and not withdrawing from the program after changes are published constitutes acceptance.
          </li>
          <li>
            These Terms are exclusively governed by the laws of the Republic of Indonesia. Foreign Citizen (WNA)
            Users expressly waive jurisdiction in their country of origin; unresolved disputes are submitted
            exclusively to the Central Jakarta District Court.
          </li>
          <li>
            In case of conflict with a physical contract signed by the User (such as an Activity Implementation
            Agreement), the physical contract prevails to the extent of the conflict.
          </li>
          <li>
            The User represents that they are at least 18 years old or have reached the age of majority in their
            country of origin. Users below this age must obtain written consent from a parent or lawful guardian.
          </li>
          <li>
            If any provision of these Terms is declared invalid or unenforceable, the remaining provisions remain
            valid and unaffected.
          </li>
        </ul>
      </DocSection>

      <DocSection id="doc-contact" number="8" title="Contact">
        <p>For questions about these Terms or other inquiries, please contact us via:</p>
        <DocContactLinks />
      </DocSection>
    </DocLayout>
  );
}
