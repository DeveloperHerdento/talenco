"use client";

import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
};

export function SearchInput({ value, onChange, placeholder, className = "" }: Props) {
  return (
    <div className={`relative w-full sm:max-w-xs ${className}`}>
      <Search size={15} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-black/35" aria-hidden="true" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[#e0e0e0] py-2 pr-3 pl-9 text-sm outline-none focus:border-brand-blue"
      />
    </div>
  );
}
