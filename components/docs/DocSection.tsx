import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";

type DocSectionProps = {
  id?: string;
  number?: string;
  title: string;
  children: ReactNode;
  className?: string;
};

export function DocSection({ id, number, title, children, className = "" }: DocSectionProps) {
  return (
    <Reveal>
      <section id={id} className={`scroll-mt-32 border-b border-[#ececec] pb-10 last:border-b-0 last:pb-0 ${className}`}>
        <h2 className="mb-4 flex items-center gap-3 text-xl font-bold text-black md:text-2xl">
          {number && (
            <span className="bg-brand-orange flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white md:size-9">
              {number}
            </span>
          )}
          {title}
        </h2>
        <div className="flex flex-col gap-4 text-sm leading-relaxed text-black/70 md:text-base">{children}</div>
      </section>
    </Reveal>
  );
}
