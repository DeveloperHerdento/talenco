"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export type SelectOption<T extends string> = { value: T; label: string };

// Custom listbox — native <select> can't have its open option list restyled by CSS.
export function SelectMenu<T extends string>({
  value,
  options,
  onChange,
  className = "",
}: {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const selected = options.find((opt) => opt.value === value);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-[#e0e0e0] bg-white px-3 py-2 text-sm text-black/70 outline-none transition-colors hover:border-black/20 focus:border-brand-blue"
      >
        <span>{selected?.label ?? "Select"}</span>
        <ChevronDown size={15} className={`shrink-0 text-black/40 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute top-[calc(100%+6px)] left-0 z-20 w-full min-w-[10rem] overflow-hidden rounded-xl border border-[#ececec] bg-white p-1 shadow-lg shadow-black/5"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li key={opt.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    isSelected ? "bg-brand-blue/10 font-semibold text-brand-blue" : "text-black/70 hover:bg-[#f5f7fa]"
                  }`}
                >
                  {opt.label}
                  {isSelected && <Check size={14} className="shrink-0" aria-hidden="true" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
