"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useScrollVisibility } from "@/hooks/useScrolled";
import { NAV_LINKS, resolveNavHref } from "@/lib/constants/nav-links";
import { REGISTER_FORM_URL } from "@/lib/constants/course-guide";
import { NAVBAR_START_MS } from "@/lib/constants/animation";
import { Button } from "@/components/ui/Button";
import { FadeUp } from "@/components/ui/FadeUp";
import { Logo } from "@/components/layout/Logo";
import { LangToggle } from "@/components/layout/LangToggle";
import { MobileDrawer } from "@/components/layout/MobileDrawer";
import type { Dictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locales";

type NavbarProps = {
  dict: Dictionary["nav"];
  locale: Locale;
};

export default function Navbar({ dict, locale }: NavbarProps) {
  const { scrolled, hidden } = useScrollVisibility();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isTransparent = !scrolled && !drawerOpen;

  const headerPaddingClass = isTransparent ? "pt-2" : "pt-0";
  const barBgClass = `${isTransparent ? "bg-transparent" : "bg-white"} lg:bg-white`;
  const barShadowClass = scrolled && !drawerOpen ? "shadow-lg shadow-black/10" : "";
  const logoFilterClass = isTransparent ? "brightness-0 invert" : "";
  const iconColorClass = isTransparent ? "text-white" : "text-brand-orange";
  const hideClass = hidden && !drawerOpen ? "-translate-y-[calc(100%+1.5rem)]" : "translate-y-0";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex justify-center transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:px-14 lg:pt-12 ${headerPaddingClass} ${hideClass}`}
    >
      <div
        className={`relative flex w-full max-w-[1240px] items-center justify-between px-5 py-4 transition-all duration-300 md:px-8 lg:rounded-full lg:py-4 lg:backdrop-blur-md lg:shadow-md lg:shadow-black/5 ${barBgClass} ${barShadowClass}`}
      >
        <FadeUp
          className={`transition-[filter] duration-300 lg:filter-none ${logoFilterClass}`}
          delayMs={NAVBAR_START_MS}
          durationMs={300}
        >
          <Logo locale={locale} />
        </FadeUp>

        <nav className="hidden items-center gap-8 text-sm text-black lg:flex">
          {NAV_LINKS.map((link, index) => (
            <FadeUp key={link.href} delayMs={NAVBAR_START_MS + 60 + index * 40} durationMs={300}>
              <a
                href={resolveNavHref(link.href, locale)}
                className="group relative py-1 transition-colors hover:text-brand-blue"
              >
                {dict[link.key]}
                <span className="bg-brand-blue absolute inset-x-0 -bottom-0.5 h-px origin-center scale-x-0 transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </a>
            </FadeUp>
          ))}
        </nav>

        <FadeUp
          as="div"
          className="hidden items-center gap-2.5 lg:flex"
          delayMs={NAVBAR_START_MS + 250}
          durationMs={300}
        >
          <LangToggle locale={locale} />
          <a href={REGISTER_FORM_URL} target="_blank" rel="noreferrer">
            <Button variant="primary">{dict.register}</Button>
          </a>
        </FadeUp>

        <button
          type="button"
          aria-label={drawerOpen ? dict.closeMenu : dict.openMenu}
          onClick={() => setDrawerOpen((v) => !v)}
          className={`animate-fade-up flex h-10 w-10 items-center justify-center opacity-0 transition-colors duration-300 lg:hidden ${iconColorClass}`}
          style={{ animationDelay: `${NAVBAR_START_MS + 60}ms`, animationDuration: "300ms" }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {drawerOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="flex"
              >
                <X size={26} strokeWidth={2} />
              </motion.span>
            ) : (
              <motion.span
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="flex"
              >
                <Menu size={26} strokeWidth={2} />
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} dict={dict} locale={locale} />
      </div>
    </header>
  );
}
