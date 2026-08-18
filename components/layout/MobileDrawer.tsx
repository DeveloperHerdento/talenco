"use client";

import { AnimatePresence, motion } from "motion/react";
import { NAV_LINKS } from "@/lib/constants/nav-links";
import { Button } from "@/components/ui/Button";
import { LangDropdown } from "@/components/layout/LangDropdown";

type MobileDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileDrawer({ open, onClose }: MobileDrawerProps) {
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
                {link.label}
              </motion.a>
            ))}
          </nav>

          <div className="flex flex-col items-center gap-3 px-6 pt-2 pb-6">
            <LangDropdown />
            <Button variant="primary" href="#programs" onClick={onClose} className="w-full justify-center">
              Register
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
