import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { BENEFITS } from "@/lib/constants/benefits";
import type { Dictionary } from "@/lib/i18n/dictionary";

export function Benefits({ dict }: { dict: Dictionary["benefits"] }) {
  return (
    <section id="benefits" className="w-full pb-14 md:pb-18 lg:pb-20">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-12 px-4 md:gap-16 md:px-8">
        <Reveal className="flex flex-col items-center gap-5 text-center">
          <SectionHeading eyebrow={dict.eyebrow} title={dict.title} align="center" />
        </Reveal>

        <Stagger staggerDelay={0.09} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon;
            const item = dict.items[benefit.key];
            return (
              <StaggerItem key={benefit.key} className="h-full">
                <div className="hover:bg-brand-orange hover:border-brand-orange group flex h-full flex-col gap-4 rounded-2xl border-[0.5px] border-[#e9e9e9] bg-white p-6 shadow-sm shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10">
                  <div className="flex size-[60px] shrink-0 items-center justify-center rounded-full border-[0.5px] border-[#ff9977] bg-[rgba(255,192,114,0.3)] transition-colors duration-300 group-hover:border-white/40 group-hover:bg-white/20">
                    <Icon
                      size={24}
                      strokeWidth={1.75}
                      className="text-brand-orange transition-colors duration-300 group-hover:text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-black transition-colors duration-300 group-hover:text-white md:text-xl">
                      {item.label}
                    </h3>
                    <p className="text-sm font-light leading-relaxed text-black/60 transition-colors duration-300 group-hover:text-white/80">
                      {item.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            );
          })}
        </Stagger>
      </div>
    </section>
  );
}
