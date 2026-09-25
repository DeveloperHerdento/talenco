"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";

export function FieldWrap({
  label,
  sublabel,
  required,
  error,
  children,
}: {
  label: string;
  sublabel?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-black">
        {label}
        {sublabel && <span className="ml-1 font-normal text-black/50">/ {sublabel}</span>}
        {required && <span className="ml-1 text-brand-red">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-brand-red">{error}</p>}
    </div>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
  error,
  maxLength,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
  maxLength?: number;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      className={`w-full rounded-lg border px-4 py-3 text-sm text-black outline-none transition-colors ${
        error ? "border-brand-red focus:border-brand-red" : "border-[#e0e0e0] focus:border-brand-blue"
      }`}
    />
  );
}

export function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
    />
  );
}

export function Select({
  value,
  onChange,
  options,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  error?: string;
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

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center gap-3 rounded-lg border bg-white py-3 pr-4 pl-4 text-left text-sm outline-none transition-colors ${
          error ? "border-brand-red focus:border-brand-red" : "border-[#e0e0e0] focus:border-brand-blue"
        } ${value ? "text-black" : "text-black/40"}`}
      >
        <ChevronDown
          className={`size-4 shrink-0 text-black/40 transition-transform ${open ? "rotate-180" : ""}`}
        />
        <span className="truncate">{value || "選択してください / Choose"}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-[#e0e0e0] bg-white p-1.5 shadow-lg shadow-black/5"
          >
            {options.map((o) => (
              <li key={o}>
                <button
                  type="button"
                  role="option"
                  aria-selected={value === o}
                  onClick={() => {
                    onChange(o);
                    setOpen(false);
                  }}
                  className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                    value === o ? "bg-brand-blue/10 text-brand-blue" : "text-black/70 hover:bg-black/5"
                  }`}
                >
                  {o}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export function RadioGroup({
  name,
  value,
  options,
  onChange,
  error,
}: {
  name: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      {options.map((o) => (
        <label
          key={o}
          className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
            value === o ? "border-brand-blue bg-[#eaf3ff]" : "border-[#e0e0e0] hover:border-black/20"
          }`}
        >
          <input
            type="radio"
            name={name}
            value={o}
            checked={value === o}
            onChange={() => onChange(o)}
            className="accent-brand-blue"
          />
          <span className="text-sm text-black">{o}</span>
        </label>
      ))}
      {error && <p className="text-xs text-brand-red">{error}</p>}
    </div>
  );
}

export function CheckboxGroup({
  values,
  options,
  onChange,
  error,
}: {
  values: string[];
  options: string[];
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div className="space-y-2">
      {options.map((o) => (
        <label
          key={o}
          className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 transition-colors ${
            values.includes(o) ? "border-brand-blue bg-[#eaf3ff]" : "border-[#e0e0e0] hover:border-black/20"
          }`}
        >
          <input
            type="checkbox"
            checked={values.includes(o)}
            onChange={() => onChange(o)}
            className="mt-0.5 shrink-0 accent-brand-blue"
          />
          <span className="text-sm text-black">{o}</span>
        </label>
      ))}
      {error && <p className="text-xs text-brand-red">{error}</p>}
    </div>
  );
}
