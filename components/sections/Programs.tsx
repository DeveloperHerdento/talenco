import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { PROGRAMS } from "@/lib/constants/programs";
import { ProgramCard } from "@/components/sections/ProgramCard";
import type { Dictionary } from "@/lib/i18n/dictionary";

export function Programs({ dict }: { dict: Dictionary["programs"] }) {
  return (
    <section id="programs" className="w-full py-14 md:py-18 lg:py-20">
      {/* Shared clip-path (notched top-right corner, from public/assets/card.svg) reused by every ProgramCard. */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <clipPath id="program-card-clip" clipPathUnits="objectBoundingBox">
            <path d="M0.7394 0C0.7734 0 0.7981 0.0434 0.7981 0.0716C0.7981 0.1243 0.8494 0.1671 0.913 0.1671C0.947 0.1671 1 0.1877 1 0.216V0.9523C1 0.9786 0.9743 1 0.9425 1H0.0575C0.02573 1 0 0.9786 0 0.9523V0.04773C0 0.02137 0.02573 0 0.0575 0H0.7394Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-12 px-4 md:px-8 lg:gap-16">
        <Reveal className="flex flex-col items-center gap-5 text-center">
          <SectionHeading eyebrow={dict.eyebrow} align="center" />
        </Reveal>

        <Stagger
          className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
          staggerDelay={0.15}
          viewportAmount={0.3}
          viewportMargin="0px 0px 0px 0px"
        >
          {PROGRAMS.map((program) => (
            <StaggerItem key={program.key}>
              <ProgramCard program={program} item={dict.items[program.key]} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
