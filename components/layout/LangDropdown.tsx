"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";

const LANGUAGES = [
  { code: "EN", label: "English", flag: "/assets/icons/EN.svg" },
  { code: "JP", label: "Japanese", flag: "/assets/icons/JP.svg" },
];

export function LangDropdown() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(LANGUAGES[0]);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex h-10 cursor-pointer items-center gap-2.5 rounded-[20px] border border-[#e0e0e0] bg-white px-[18px] py-3 text-sm font-semibold text-black"
      >
        <Image src={selected.flag} alt="" width={18} height={18} className="rounded-full object-cover" />
        {selected.code}
        <ChevronDown
          size={14}
          strokeWidth={2}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-32 overflow-hidden rounded-xl border border-[#e9e9e9] bg-white shadow-lg shadow-black/10">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                setSelected(lang);
                setOpen(false);
              }}
              className={`flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm transition-colors hover:bg-black/5 ${
                lang.code === selected.code ? "text-brand-blue font-semibold" : "text-black"
              }`}
            >
              <Image src={lang.flag} alt="" width={18} height={18} className="rounded-full object-cover" />
              {lang.code}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
