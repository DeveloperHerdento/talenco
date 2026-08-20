import type { ReactNode } from "react";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DocHero } from "@/components/docs/DocHero";
import { DocSidebarMobile, DocSidebarDesktop } from "@/components/docs/DocSidebar";
import type { Dictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locales";

type DocLayoutProps = {
  dict: Dictionary;
  locale: Locale;
  title: string;
  meta?: string;
  image?: string;
  contentClassName?: string;
  navItems?: { href: string; label: string }[];
  children: ReactNode;
};

export function DocLayout({
  dict,
  locale,
  title,
  meta,
  image,
  contentClassName = "max-w-[820px]",
  navItems,
  children,
}: DocLayoutProps) {
  return (
    <>
      <main className="flex min-h-screen w-full flex-col items-center bg-white">
        <Navbar dict={dict.nav} locale={locale} />
        <DocHero title={title} meta={meta} image={image} />

        <div className="w-full px-4 py-10 md:px-8 md:py-14">
          {navItems ? (
            <div className="mx-auto w-full max-w-[1200px]">
              <DocSidebarMobile items={navItems} />

              <div className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-[220px_1fr] lg:gap-12 lg:pt-0">
                <DocSidebarDesktop items={navItems} />
                <div className={`flex min-w-0 flex-col gap-10 ${contentClassName}`}>{children}</div>
              </div>
            </div>
          ) : (
            <div className={`mx-auto flex w-full flex-col gap-10 ${contentClassName}`}>{children}</div>
          )}
        </div>
      </main>
      <Footer nav={dict.nav} dict={dict.footer} locale={locale} />
    </>
  );
}
