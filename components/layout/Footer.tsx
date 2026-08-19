import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLine } from "@fortawesome/free-brands-svg-icons";
import { ChevronUp, Mail, Phone } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants/nav-links";
import type { Dictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locales";

const SOCIALS = [
  {
    label: "Instagram",
    href: "https://instagram.com/talencoid",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com/talencoindonesia",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M14.5 8.5h2V5.2c-.35-.05-1.55-.2-2.96-.2-2.93 0-4.94 1.79-4.94 5.08V13H6v3.6h3.6V21h3.6v-4.4h3.16l.5-3.6h-3.66v-2.55c0-1.04.28-1.75 1.8-1.75Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://tiktok.com/@talencoid",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M14 3v10.2a3 3 0 1 1-2.4-2.94M14 3c.3 2 1.8 3.6 4 3.9"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

type FooterProps = {
  nav: Dictionary["nav"];
  dict: Dictionary["footer"];
  locale: Locale;
};

export function Footer({ nav, dict, locale }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative w-full px-2 pt-2 pb-2 md:px-3 md:pt-3 md:pb-3">
      <div className="overflow-hidden rounded-[20px] bg-[#0b1220]">
        <div className="h-1 w-full" aria-hidden="true" />

        <div className="mx-auto grid w-full max-w-[1240px] grid-cols-2 gap-x-8 gap-y-12 px-4 pt-14 pb-12 sm:grid-cols-3 md:px-8 lg:grid-cols-5">
          <div className="col-span-2 flex flex-col gap-4 sm:col-span-3 lg:col-span-2">
            <div className="flex justify-start">
              <Image src="/assets/logotype-talenco.svg" alt="TalenCo" width={149} height={40} className="h-10 w-auto" />
            </div>
            <p className="max-w-xs text-sm font-light text-white/50">{dict.tagline}</p>
            <div className="mt-1 flex items-center gap-2.5">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex size-9 items-center justify-center rounded-full border border-white/15 text-white/60 transition-colors hover:border-brand-blue/40 hover:text-brand-blue"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold tracking-wide text-white uppercase">{dict.quickLinksHeading}</h4>
            <ul className="flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-white/60 transition-colors hover:text-brand-blue">
                    {nav[link.key]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold tracking-wide text-white uppercase">{dict.legalHeading}</h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link
                  href={`/${locale}/privacy`}
                  className="text-sm text-white/60 transition-colors hover:text-brand-blue"
                >
                  {dict.privacyPolicy}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/terms`} className="text-sm text-white/60 transition-colors hover:text-brand-blue">
                  {dict.termsOfService}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/subscription-agreement`}
                  className="text-sm text-white/60 transition-colors hover:text-brand-blue"
                >
                  {dict.subscriptionAgreement}
                </Link>
              </li>
            </ul>
          </div>

          <div id="contact" className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold tracking-wide text-white uppercase">{dict.contactHeading}</h4>
            <ul className="flex flex-col gap-3 text-sm text-white/60">
              <li>
                <a href="mailto:hello@talenco.co" className="flex items-center gap-2 transition-colors hover:text-brand-blue">
                  <Mail size={15} strokeWidth={1.75} className="shrink-0" />
                  talencoindonesia@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+622156789012" className="flex items-center gap-2 transition-colors hover:text-brand-blue">
                  <Phone size={15} strokeWidth={1.75} className="shrink-0" /> 
                  +62 85 1178 04811 
                </a>
              </li>
              <li className="flex items-center gap-2">
                <FontAwesomeIcon icon={faLine} className="size-3.75 shrink-0" aria-hidden="true" />
                {dict.lineOfficialAccount}
              </li>
              <li className="flex items-center gap-2">
                <FontAwesomeIcon icon={faLine} className="size-3.75 shrink-0" aria-hidden="true" />
                {dict.lineId}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex w-full max-w-[1240px] flex-col-reverse items-center justify-between gap-4 px-4 py-6 sm:flex-row md:px-8">
            <p className="text-xs text-white/60">
              © {year} TalenCo. {dict.rightsReserved}{" "}
              <a
                href="https://herdento.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-brand-blue"
              >
                {dict.builtBy} Herdento Global Solusi
              </a>
            </p>
            <a
              href="#top"
              className="flex items-center gap-1.5 text-xs font-medium text-white/50 transition-colors hover:text-brand-blue"
            >
              {dict.backToTop}
              <ChevronUp size={14} strokeWidth={2} className="text-brand-orange" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
