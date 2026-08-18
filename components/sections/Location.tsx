import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { MapEmbed } from "@/components/ui/MapEmbed";
import type { Dictionary } from "@/lib/i18n/dictionary";

const CAMPUS_ADDRESS =
  "Lembaga Bahasa Internasional Fakultas Ilmu Pengetahuan Budaya Gedung X - Koentjaraningrat, Kampus UI Lantai 1, Pondok Cina, Kecamatan Beji, Kota Depok, Jawa Barat 16424";
const MAP_SRC = `https://www.google.com/maps?q=${encodeURIComponent(CAMPUS_ADDRESS)}&output=embed`;

export function Location({ dict }: { dict: Dictionary["location"] }) {
  return (
    <section id="location" className="w-full py-14 md:py-18 lg:py-20">
      <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-12 px-4 md:gap-16 md:px-8">
        <Reveal className="flex flex-col items-center gap-5 text-center">
          <SectionHeading eyebrow={dict.eyebrow} title={dict.title} align="center" />
        </Reveal>

        <Stagger className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <StaggerItem className="relative h-64 overflow-hidden rounded-[20px] shadow-lg shadow-black/10 lg:h-[320px]">
            <MapEmbed src={MAP_SRC} title={dict.campusName} className="absolute inset-0 h-full w-full overflow-hidden" />
          </StaggerItem>

          <StaggerItem className="flex flex-col gap-5">
            <div>
              <h3 className="text-xl font-semibold text-black md:text-2xl">{dict.campusName}</h3>
              <p className="mt-1 text-sm text-[#0d5bc9] md:text-base">{dict.campusLocation}</p>
            </div>

            <p className="text-sm leading-relaxed text-black/60 md:text-base">{dict.body}</p>

            <ul className="flex flex-col gap-3">
              {dict.highlights.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="btn-gradient-brand flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                    ✓
                  </span>
                  <span className="text-sm font-medium text-black md:text-base">{item}</span>
                </li>
              ))}
            </ul>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  );
}
