import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLine, faInstagram, faFacebook, faTiktok } from "@fortawesome/free-brands-svg-icons";
import { ChevronUp, Mail, Phone } from "lucide-react";
import { NAV_LINKS, resolveNavHref } from "@/lib/constants/nav-links";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import type { Dictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locales";

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/talencoid", icon: faInstagram },
  { label: "Facebook", href: "https://facebook.com/talencoindonesia", icon: faFacebook },
  { label: "TikTok", href: "https://tiktok.com/@talencoid", icon: faTiktok },
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
        <Stagger
          className="mx-auto grid w-full max-w-[1240px] grid-cols-1 gap-10 px-4 pt-14 pb-12 sm:grid-cols-4 sm:gap-8 md:px-8"
          staggerDelay={0.12}
          viewportMargin="0px 0px -10% 0px"
        >
          <StaggerItem className="flex flex-col gap-4 sm:col-span-2">
            <div className="flex justify-start">
              <Image src="/assets/logotype-talenco.svg" alt="TalenCo" width={149} height={40} className="h-10 w-auto" />
            </div>
            <p className="max-w-md text-sm font-light text-white/50">{dict.tagline}</p>
            <div className="mt-1 flex items-center gap-2.5">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex size-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-brand-blue/40 hover:text-brand-blue"
                >
                  <FontAwesomeIcon icon={social.icon} className="size-4.5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </StaggerItem>

          <StaggerItem className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold tracking-wide text-white uppercase">{dict.quickLinksHeading}</h4>
            <ul className="flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={resolveNavHref(link.href, locale)}
                    className="text-sm text-white/60 transition-colors hover:text-brand-blue"
                  >
                    {nav[link.key]}
                  </a>
                </li>
              ))}
            </ul>
          </StaggerItem>

          <StaggerItem id="contact" className="flex flex-col gap-4" duration={0.65}>
            <h4 className="text-sm font-semibold tracking-wide text-white uppercase">{dict.contactHeading}</h4>
            <ul className="flex flex-col gap-3 text-sm text-white/60">
              <li>
                <a
                  href="mailto:hello@talenco.co"
                  className="flex min-w-0 items-center gap-2 transition-colors hover:text-brand-blue"
                >
                  <Mail size={19} strokeWidth={1.75} className="shrink-0" />
                  <span className="break-all">talencoindonesia@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/+6285117804811"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-w-0 items-center gap-2 transition-colors hover:text-brand-blue"
                >
                  <Phone size={19} strokeWidth={1.75} className="shrink-0" />
                  +62 85 1178 04811
                </a>
              </li>
              <li>
                <a
                  href="https://line.me/R/ti/p/%40601ffdki"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-w-0 items-center gap-2 transition-colors hover:text-brand-blue"
                >
                  <FontAwesomeIcon icon={faLine} className="size-4.75 shrink-0" aria-hidden="true" />
                  {dict.lineOfficialAccount}
                </a>
              </li>
              <li>
                <a
                  href="https://line.me/ti/p/~talenco"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-w-0 items-center gap-2 transition-colors hover:text-brand-blue"
                >
                  <FontAwesomeIcon icon={faLine} className="size-4.75 shrink-0" aria-hidden="true" />
                  {dict.lineId}
                </a>
              </li>
            </ul>
          </StaggerItem>
        </Stagger>

        <div className="border-t border-white/10">
          <div className="mx-auto flex w-full max-w-[1240px] flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row md:px-8">
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
            <div className="flex items-center gap-5 text-xs text-white/60">
              <Link href={`/${locale}/privacy`} className="transition-colors hover:text-brand-blue">
                {dict.privacyPolicy}
              </Link>
              <Link href={`/${locale}/terms`} className="transition-colors hover:text-brand-blue">
                {dict.termsOfService}
              </Link>
              <a href="#top" className="flex items-center gap-1 transition-colors hover:text-brand-blue">
                {dict.backToTop}
                <ChevronUp size={14} strokeWidth={2} className="text-brand-orange" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
