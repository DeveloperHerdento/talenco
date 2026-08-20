"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useScrollVisibility } from "@/hooks/useScrolled";

type DocSidebarItem = {
  href: string;
  label: string;
};

type DocSidebarProps = {
  items: DocSidebarItem[];
};

function useActiveSection(items: DocSidebarItem[]) {
  const [active, setActive] = useState(items[0]?.href.slice(1) ?? "");

  useEffect(() => {
    const ids = items.map((item) => item.href.slice(1));
    const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const topMost = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        setActive(topMost.target.id);
      },
      { rootMargin: "-120px 0px -60% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return active;
}

export function DocSidebarMobile({ items }: DocSidebarProps) {
  const { hidden } = useScrollVisibility();
  const active = useActiveSection(items);
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

  const activeItem = items.find((item) => item.href.slice(1) === active) ?? items[0];

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
        aria-label="Section navigation"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 py-4 text-left text-sm font-semibold text-brand-blue"
      >
        {activeItem?.label}
        <ChevronDown size={16} strokeWidth={2.25} className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="flex flex-col gap-1 border-t border-[#ececec] py-2">
          {items.map((item) => {
            const id = item.href.slice(1);
            const isActive = active === id;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? "bg-[#eaf3ff] text-brand-blue" : "text-black/70 hover:bg-[#f7f9fc]"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Rendered as the sidebar column inside the grid — its cell stretches to the
// tall content column next to it, so sticky works fine here without the
// same restructuring the mobile bar needs.
export function DocSidebarDesktop({ items }: DocSidebarProps) {
  const { hidden } = useScrollVisibility();
  const active = useActiveSection(items);

  return (
    <nav
      aria-label="Section navigation"
      className={`sticky hidden h-fit w-full flex-col gap-1 transition-[top] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:flex ${
        hidden ? "top-6" : "top-36"
      }`}
    >
      {items.map((item) => {
        const id = item.href.slice(1);
        const isActive = active === id;
        return (
          <a
            key={item.href}
            href={item.href}
            className={`relative rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              isActive ? "bg-[#eaf3ff] text-brand-blue" : "text-black/60 hover:bg-[#f7f9fc] hover:text-black"
            }`}
          >
            {isActive && (
              <span className="absolute top-1/2 left-0 h-4 w-[3px] -translate-y-1/2 rounded-full bg-brand-blue" />
            )}
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
