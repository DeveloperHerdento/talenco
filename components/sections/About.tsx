import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { RichText } from "@/components/ui/RichText";
import type { Dictionary } from "@/lib/i18n/dictionary";

export function About({ dict }: { dict: Dictionary["about"] }) {
  return (
    <section id="about" className="w-full py-14 md:py-18 lg:py-20">
      <Stagger className="mx-auto grid w-full max-w-[1240px] grid-cols-1 gap-8 px-4 md:px-8 lg:grid-cols-3 lg:gap-x-10 lg:gap-y-8">
        <StaggerItem className="flex flex-col justify-center gap-4 lg:col-start-1 lg:row-start-1">
          <SectionHeading eyebrow={dict.eyebrow} title={dict.title} />
        </StaggerItem>

        <StaggerItem className="relative h-48 overflow-hidden rounded-[10px] shadow-lg shadow-black/10 lg:col-start-2 lg:row-start-1">
          <Image
            src="/assets/images/about-img-1.webp"
            alt="TalenCo cultural learning event"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, 100vw"
          />
        </StaggerItem>

        <StaggerItem className="relative h-48 overflow-hidden rounded-[10px] shadow-lg shadow-black/10 lg:col-start-3 lg:row-start-1">
          <Image
            src="/assets/images/about-img-2.webp"
            alt="TalenCo Agustusan celebration"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, 100vw"
          />
        </StaggerItem>

        <StaggerItem className="relative hidden h-48 overflow-hidden rounded-[10px] shadow-lg shadow-black/10 md:block lg:col-start-1 lg:row-start-2">
          <Image
            src="/assets/images/about-img-3.webp"
            alt="TalenCo BIPA program opening"
            fill
            className="object-cover"
            sizes="33vw"
          />
        </StaggerItem>

        <StaggerItem className="flex items-center lg:col-start-2 lg:col-span-2 lg:row-start-2">
          <p className="text-lg leading-relaxed text-black md:text-2xl">
            <RichText text={dict.body} />
          </p>
        </StaggerItem>
      </Stagger>
    </section>
  );
}
