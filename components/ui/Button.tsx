"use client";

import { ButtonHTMLAttributes, CSSProperties, MouseEvent, ReactNode, useRef, useState } from "react";

type Variant = "primary" | "secondary" | "outline" | "outlineLight";
type Size = "md" | "lg";

type BaseProps = {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
};

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: "bg-brand-orange text-white border border-white/20",
  secondary: "bg-brand-blue text-white border border-white/20",
  outline: "bg-white text-black border border-[#e0e0e0]",
  outlineLight: "bg-white/10 text-white border border-white/40",
};

const FILL_CLASSES: Record<Variant, string> = {
  primary: "bg-white",
  secondary: "bg-white",
  outline: "bg-brand-orange",
  outlineLight: "bg-brand-orange",
};

const HOVER_TEXT_CLASSES: Record<Variant, string> = {
  primary: "group-hover:text-brand-orange",
  secondary: "group-hover:text-brand-blue",
  outline: "group-hover:text-white",
  outlineLight: "group-hover:text-white",
};

const SIZE_CLASSES: Record<Size, string> = {
  md: "h-10 px-[18px] py-3 text-sm rounded-[20px]",
  lg: "h-12 px-6 py-3.5 text-base md:h-14 md:px-8 rounded-full",
};

type ConflictingHandlers =
  | "onDrag"
  | "onDragStart"
  | "onDragEnd"
  | "onAnimationStart"
  | "onAnimationEnd"
  | "onAnimationIteration";

type ButtonProps = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, ConflictingHandlers | "onClick"> & {
    href?: string;
  };

export function Button({
  variant = "primary",
  size = "md",
  icon,
  children,
  className = "",
  style,
  href,
  onClick,
  ...props
}: ButtonProps) {
  const rootRef = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);

  const setOrigin = (e: MouseEvent<HTMLElement>) => {
    const el = rootRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--fill-x", `${x}%`);
    el.style.setProperty("--fill-y", `${y}%`);
  };

  const handleEnter = (e: MouseEvent<HTMLElement>) => {
    setOrigin(e);
    setHovered(true);
  };

  const handleLeave = (e: MouseEvent<HTMLElement>) => {
    setOrigin(e);
    setHovered(false);
  };

  const classes = `group relative isolate inline-flex items-center gap-2.5 overflow-hidden font-semibold whitespace-nowrap cursor-pointer ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]} ${className}`;

  const content = (
    <>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 -z-10 transition-[clip-path] duration-500 ease-out ${FILL_CLASSES[variant]}`}
        style={{
          clipPath: hovered
            ? "circle(150% at var(--fill-x, 50%) var(--fill-y, 50%))"
            : "circle(0% at var(--fill-x, 50%) var(--fill-y, 50%))",
        }}
      />
      <span
        className={`relative z-10 inline-flex items-center gap-2.5 transition-colors duration-300 ${HOVER_TEXT_CLASSES[variant]}`}
      >
        {children}
        {icon}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        ref={rootRef}
        href={href}
        className={classes}
        style={style}
        onClick={onClick}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={rootRef}
      className={classes}
      style={style}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      {...props}
      onClick={onClick}
    >
      {content}
    </button>
  );
}
