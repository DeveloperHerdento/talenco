import type { ReactNode } from "react";

type FadeUpProps = {
  children: ReactNode;
  delayMs?: number;
  durationMs?: number;
  className?: string;
  as?: "span" | "div";
};

export function FadeUp({ children, delayMs = 0, durationMs = 700, className = "", as = "span" }: FadeUpProps) {
  const Tag = as;
  const needsInlineBlock = as === "span" && !className.includes("block");
  const displayClass = needsInlineBlock ? "inline-block" : "";

  return (
    <Tag
      className={`animate-fade-up ${displayClass} opacity-0 ${className}`}
      style={{ animationDelay: `${delayMs}ms`, animationDuration: `${durationMs}ms` }}
    >
      {children}
    </Tag>
  );
}
