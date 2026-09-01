"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useScrollVisibility } from "@/hooks/useScrolled";

type StepItem = {
  label: string;
  sublabel: string;
};

type RegisterSidebarProps = {
  steps: StepItem[];
  current: number;
  maxStep: number;
  onSelect: (index: number) => void;
};

export function RegisterSidebarMobile({ steps, current, maxStep, onSelect }: RegisterSidebarProps) {
  const { hidden } = useScrollVisibility();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onClickOutside);
    return () => document.removeEventListener("click", onClickOutside);
  }, [open]);

  const activeItem = steps[current];

  return (
    <div
      ref={rootRef}
      className={`sticky z-30 -mx-4 border-b border-[#ececec] bg-white/95 px-4 backdrop-blur-sm transition-[top] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:-mx-8 md:px-8 lg:hidden ${
        hidden ? "top-0" : "top-16 sm:top-18"
      }`}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-label="Step navigation"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 py-4 text-left text-sm font-semibold text-brand-blue"
      >
        {`${current + 1}. ${activeItem?.label}`}
        <ChevronDown size={16} strokeWidth={2.25} className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="flex flex-col gap-1 border-t border-[#ececec] py-2">
          {steps.map((step, i) => {
            const isActive = i === current;
            const isDone = i < current;
            const reachable = i <= maxStep;
            return (
              <button
                key={step.label}
                type="button"
                disabled={!reachable}
                onClick={() => {
                  if (!reachable) return;
                  onSelect(i);
                  setOpen(false);
                }}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#eaf3ff] text-brand-blue"
                    : reachable
                      ? "text-black/70 hover:bg-[#f7f9fc]"
                      : "cursor-not-allowed text-black/30"
                }`}
              >
                <span
                  className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                    isDone || isActive ? "bg-brand-orange text-white" : "bg-[#ececec] text-black/40"
                  }`}
                >
                  {isDone ? "✓" : i + 1}
                </span>
                {step.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function RegisterSidebarDesktop({ steps, current, maxStep, onSelect }: RegisterSidebarProps) {
  const { hidden } = useScrollVisibility();

  return (
    <nav
      aria-label="Step navigation"
      className={`sticky hidden h-fit w-full flex-col gap-1 transition-[top] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:flex ${
        hidden ? "top-6" : "top-36"
      }`}
    >
      {steps.map((step, i) => {
        const isActive = i === current;
        const isDone = i < current;
        const reachable = i <= maxStep;
        return (
          <button
            key={step.label}
            type="button"
            disabled={!reachable}
            onClick={() => reachable && onSelect(i)}
            className={`relative flex items-start gap-3 rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${
              isActive
                ? "bg-[#eaf3ff] text-brand-blue"
                : reachable
                  ? "text-black/60 hover:bg-[#f7f9fc] hover:text-black"
                  : "cursor-not-allowed text-black/30"
            }`}
          >
            {isActive && (
              <span className="absolute top-1/2 left-0 h-4 w-[3px] -translate-y-1/2 rounded-full bg-brand-blue" />
            )}
            <span
              className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
                isDone || isActive ? "bg-brand-orange text-white" : "bg-[#ececec] text-black/40"
              }`}
            >
              {isDone ? "✓" : i + 1}
            </span>
            <span className="flex flex-col">
              {step.label}
              <span className="text-xs font-normal text-black/40">{step.sublabel}</span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
