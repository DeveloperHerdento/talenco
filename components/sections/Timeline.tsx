"use client";

import { motion, type Variants } from "motion/react";
import type { LucideIcon } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { TIMELINE, getTimelineStatus, type TimelineStatus } from "@/lib/constants/timeline";
import type { Dictionary } from "@/lib/i18n/dictionary";

const groupVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
};

const lineVariants: Variants = {
  hidden: { scaleX: 0, scaleY: 0 },
  visible: { scaleX: 1, scaleY: 1, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

function StatusIcon({ status, icon: Icon }: { status: TimelineStatus; icon: LucideIcon }) {
  if (status === "upcoming") {
    return (
      <span className="relative z-10 flex size-16 shrink-0 items-center justify-center rounded-full border-[1.5px] border-[#e0e0e0] bg-white text-black/50 md:size-20">
        <Icon className="size-6 md:size-8" strokeWidth={1.75} />
      </span>
    );
  }

  return (
    <span className="relative z-10 flex size-16 shrink-0 items-center justify-center md:size-20">
      {status === "active" && (
        <motion.span
          aria-hidden="true"
          className="bg-brand-orange absolute inset-0 rounded-full"
          animate={{ scale: [1, 1.35, 1], opacity: [0.35, 0, 0.35] }}
          transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity }}
        />
      )}
      <span className="bg-brand-orange relative flex size-16 items-center justify-center rounded-full text-white shadow-lg shadow-black/15 md:size-20">
        <Icon className="size-6 md:size-8" strokeWidth={1.75} />
      </span>
    </span>
  );
}

function Connector({ completed }: { completed: boolean }) {
  const color = completed ? "bg-brand-orange" : "bg-[#e9e9e9]";
  return (
    <motion.span
      aria-hidden="true"
      variants={lineVariants}
      className={`absolute top-1/2 left-8 z-0 h-[calc(100%+2.5rem)] w-0.5 origin-top -translate-x-1/2 sm:top-8 sm:left-1/2 sm:h-0.5 sm:w-[calc(100%+1.5rem)] sm:origin-left sm:translate-x-0 md:top-10 ${color}`}
    />
  );
}

export function Timeline({ dict }: { dict: Dictionary["timeline"] }) {
  const statuses = TIMELINE.map((step) => getTimelineStatus(step));

  return (
    <section id="schedule" className="w-full py-14 md:py-18 lg:py-20">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-14 px-4 md:gap-20 md:px-8">
        <Reveal className="flex flex-col items-center gap-5 text-center">
          <SectionHeading eyebrow={dict.eyebrow} title={dict.title} align="center" />
        </Reveal>

        <motion.div
          className="grid grid-cols-1 gap-10 sm:grid-cols-4 sm:gap-6"
          variants={groupVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {TIMELINE.map((step, index) => {
            const status = statuses[index];
            const isLast = index === TIMELINE.length - 1;
            return (
              <motion.div
                key={step.key}
                variants={itemVariants}
                className="relative flex flex-row items-center gap-4 sm:flex-col sm:items-center sm:gap-4 sm:text-center"
              >
                {!isLast && <Connector completed={status === "completed"} />}
                <StatusIcon status={status} icon={step.icon} />
                <div className="flex flex-col gap-1">
                  <p
                    className={`text-base font-bold ${status === "upcoming" ? "text-black/70" : "text-black"} md:text-lg`}
                  >
                    {step.date}
                  </p>
                  <p className="text-sm font-medium text-black/70">{dict.items[step.key]}</p>
                  {status === "active" && (
                    <span className="text-brand-orange text-[11px] font-semibold tracking-wide uppercase">
                      {dict.inProgress}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
