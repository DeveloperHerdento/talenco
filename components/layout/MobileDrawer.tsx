"use client";

import { AnimatePresence, motion } from "motion/react";
import { NAV_LINKS } from "@/lib/constants/nav-links";
import { Button } from "@/components/ui/Button";
import { LangToggle } from "@/components/layout/LangToggle";
import type { Dictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locales";

type MobileDrawerProps = {
  open: boolean;
  onClose: () => void;
  dict: Dictionary["nav"];
  locale: Locale;
};

export function MobileDrawer({ open, onClose, dict, locale }: MobileDrawerProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="absolute inset-x-0 top-full overflow-hidden rounded-b-[24px] bg-white lg:hidden"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-modal="true"
        >
          <nav className="flex flex-col items-center gap-2 px-6 pt-4 pb-2">
            {NAV_LINKS.map((link, index) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={onClose}
                className="w-full rounded-lg px-3 py-3 text-center text-base font-medium text-black transition-colors hover:bg-black/5"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                {dict[link.key]}
              </motion.a>
            ))}
          </nav>

          <div className="flex flex-col items-center gap-3 px-6 pt-2 pb-6">
            <LangToggle locale={locale} />
            <Button variant="primary" href="#programs" onClick={onClose} className="w-full justify-center">
              {dict.register}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
