"use client";

import { CSSProperties, ReactNode } from "react";
import { motion } from "motion/react";
import { FADE_UP_EASE, FADE_UP_OFFSET } from "@/lib/constants/animation";

type RevealProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delayMs?: number;
};

export function Reveal({ children, className, style, delayMs = 0 }: RevealProps) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={{ opacity: 0, y: FADE_UP_OFFSET }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px", amount: 0.1 }}
      transition={{ duration: 0.65, delay: delayMs / 1000, ease: FADE_UP_EASE }}
    >
      {children}
    </motion.div>
  );
}
