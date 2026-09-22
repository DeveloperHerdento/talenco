"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";
import { FADE_UP_EASE, FADE_UP_OFFSET } from "@/lib/constants/animation";

type StaggerProps = {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
  viewportAmount?: number;
  viewportMargin?: string;
};

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  duration?: number;
  id?: string;
};

export function Stagger({
  children,
  className,
  staggerDelay = 0.2,
  viewportAmount = 0.25,
  viewportMargin = "0px 0px -20% 0px",
}: StaggerProps) {
  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: staggerDelay } },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: viewportMargin, amount: viewportAmount }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className, duration = 0.85, id }: StaggerItemProps) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: FADE_UP_OFFSET },
    visible: { opacity: 1, y: 0, transition: { duration, ease: FADE_UP_EASE } },
  };

  return (
    <motion.div id={id} className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
