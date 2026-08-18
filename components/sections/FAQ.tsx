"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { FAQ_KEYS, type FAQKey } from "@/lib/constants/faq";
import type { Dictionary } from "@/lib/i18n/dictionary";

export function FAQ({ dict }: { dict: Dictionary["faq"] }) {
  const [openKeys, setOpenKeys] = useState<Set<FAQKey>>(new Set([FAQ_KEYS[0]]));

  const toggle = (key: FAQKey) => {
    setOpenKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <section id="faq" className="w-full py-14 md:py-18 lg:py-20">
      <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 gap-10 px-4 md:px-8 lg:grid-cols-3 lg:gap-16">
        <Reveal className="flex flex-col gap-5 text-center lg:col-span-1 lg:items-start lg:text-left">
          <SectionHeading eyebrow={dict.eyebrow} title={dict.title} subtitle={dict.subtitle} />
        </Reveal>

        <Stagger staggerDelay={0.08} className="flex w-full flex-col lg:col-span-2">
          {FAQ_KEYS.map((key) => {
            const item = dict.items[key];
            const isOpen = openKeys.has(key);
            return (
              <StaggerItem key={key} className="border-b border-[#e9e9e9]">
                <button
                  type="button"
                  onClick={() => toggle(key)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-6 py-6 text-left"
                >
                  <span className="text-base font-semibold text-black md:text-lg">{item.question}</span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="flex size-8 shrink-0 items-center justify-center rounded-full border-[0.5px] border-[#e0e0e0] bg-white"
                  >
                    <ChevronDown size={14} strokeWidth={1.75} className="text-black" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-6 text-sm leading-relaxed text-black/60 md:text-base">{item.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
