import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { PARTICIPANTS } from "@/lib/constants/participants";
import type { Dictionary } from "@/lib/i18n/dictionary";

export function Participants({ dict }: { dict: Dictionary["participants"] }) {
  return (
    <section id="participants" className="w-full py-14 md:py-18 lg:py-20">
      <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 gap-6 px-4 md:px-8 lg:grid-cols-3 lg:gap-6">
        <Reveal className="flex flex-col justify-center">
          <SectionHeading eyebrow={dict.eyebrow} title={dict.title} subtitle={dict.subtitle} />
        </Reveal>

        <Stagger staggerDelay={0.08} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-2">
          {PARTICIPANTS.map((participant) => {
            const Icon = participant.icon;
            return (
              <StaggerItem key={participant.key}>
                <div className="hover:bg-brand-orange hover:border-brand-orange group flex h-[100px] items-center gap-2.5 rounded-xl border-[0.5px] border-[#e9e9e9] bg-white p-5 shadow-sm shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10">
                  <p className="flex-1 text-base font-normal tracking-wide text-black transition-colors duration-300 group-hover:text-white">
                    {dict.items[participant.key]}
                  </p>
                  <div className="flex size-[45px] shrink-0 items-center justify-center rounded-full border-[0.5px] border-[#ff9977] bg-[rgba(255,192,114,0.3)] transition-colors duration-300 group-hover:border-white/40 group-hover:bg-white/20">
                    <Icon
                      size={20}
                      strokeWidth={1.75}
                      className="text-brand-orange transition-colors duration-300 group-hover:text-white"
                    />
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
