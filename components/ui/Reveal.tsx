"use client";

import { CSSProperties, ReactNode } from "react";
import { motion } from "motion/react";

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
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px", amount: 0.1 }}
      transition={{ duration: 0.65, delay: delayMs / 1000, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
