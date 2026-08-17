"use client";

import { useState } from "react";
import Image from "next/image";
import { useScrolled } from "@/hooks/useScrolled";
import { NAV_LINKS } from "@/lib/constants/nav-links";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";
import { MobileDrawer } from "@/components/layout/MobileDrawer";

export default function Navbar() {
  const scrolled = useScrolled();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-10 md:px-14 md:pt-12">
      <div
        className={`flex w-full max-w-[1240px] items-center justify-between rounded-full bg-white/90 px-5 py-3 backdrop-blur-md transition-shadow duration-300 md:px-8 md:py-4 ${
          scrolled ? "shadow-lg shadow-black/10" : ""
        }`}
      >
        <Logo />

        <nav className="hidden items-center gap-8 text-sm text-black lg:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-brand-blue">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          <Button
            variant="outline"
            icon={<Image src="/images/figma/icon-globe.svg" alt="" width={16} height={16} />}
          >
            Lang
          </Button>
          <Button variant="primary" href="#programs">
            Register
          </Button>
        </div>

        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setDrawerOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e0e0e0] lg:hidden"
        >
          <span className="flex flex-col gap-1.5">
            <span className="h-0.5 w-5 rounded-full bg-black" />
            <span className="h-0.5 w-5 rounded-full bg-black" />
            <span className="h-0.5 w-3.5 rounded-full bg-black" />
          </span>
        </button>
      </div>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
}
