"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X } from "lucide-react";
import { useScrolled } from "@/hooks/useScrolled";
import { NAV_LINKS } from "@/lib/constants/nav-links";
import { Button } from "@/components/ui/Button";
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
  const scrolled = useScrolled();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isTransparent = !scrolled && !drawerOpen;

  const headerPaddingClass = isTransparent ? "pt-2" : "pt-0";
  const barBgClass = `${isTransparent ? "bg-transparent" : "bg-white"} lg:bg-white`;
  const barShadowClass = scrolled && !drawerOpen ? "shadow-lg shadow-black/10" : "";
  const logoFilterClass = isTransparent ? "brightness-0 invert" : "";
  const iconColorClass = isTransparent ? "text-white" : "text-brand-orange";

  return (
    <header className={`fixed inset-x-0 top-0 z-50 flex justify-center lg:px-14 lg:pt-12 ${headerPaddingClass}`}>
      <div
        className={`relative flex w-full max-w-[1240px] items-center justify-between px-5 py-4 transition-all duration-300 md:px-8 lg:rounded-full lg:py-4 lg:backdrop-blur-md lg:shadow-md lg:shadow-black/5 ${barBgClass} ${barShadowClass}`}
      >
        <span
          className={`animate-fade-up inline-block opacity-0 transition-[filter] duration-300 lg:filter-none ${logoFilterClass}`}
          style={{ animationDelay: "0ms", animationDuration: "500ms" }}
        >
          <Logo />
        </span>

        <nav className="hidden items-center gap-8 text-sm text-black lg:flex">
          {NAV_LINKS.map((link, index) => (
            <span
              key={link.href}
              className="animate-fade-up inline-block opacity-0"
              style={{ animationDelay: `${120 + index * 60}ms`, animationDuration: "500ms" }}
            >
              <a href={link.href} className="transition-colors hover:text-brand-blue">
                {dict[link.key]}
              </a>
            </span>
          ))}
        </nav>

        <div
          className="animate-fade-up hidden items-center gap-2.5 opacity-0 lg:flex"
          style={{ animationDelay: "500ms", animationDuration: "500ms" }}
        >
          <LangToggle locale={locale} />
          <a   href="https://docs.google.com/forms/d/e/1FAIpQLSewS35OEIG1OmTJ-CQwl4RFpSsj-3QwRYJWEObNpvr6mP6h6A/viewform" target="_blank">
            <Button variant="primary">
              {dict.register}
            </Button>
          </a>
        </div>

        <button
          type="button"
          aria-label={drawerOpen ? dict.closeMenu : dict.openMenu}
          onClick={() => setDrawerOpen((v) => !v)}
          className={`animate-fade-up flex h-10 w-10 items-center justify-center opacity-0 transition-colors duration-300 lg:hidden ${iconColorClass}`}
          style={{ animationDelay: "120ms", animationDuration: "500ms" }}
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
