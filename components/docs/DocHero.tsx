import Image from "next/image";
import { FadeUp } from "@/components/ui/FadeUp";

const NAVBAR_ANIMATION_END_MS = 750;

type DocHeroProps = {
  title: string;
  meta?: string;
  image?: string;
};

export function DocHero({ title, meta, image = "/assets/images/about-img-1.webp" }: DocHeroProps) {
  return (
    <section className="relative flex min-h-[320px] w-full items-end overflow-hidden pt-28 pb-14 md:min-h-[380px] md:pt-40 md:pb-16">
      <div className="absolute inset-2 overflow-hidden rounded-[20px] md:inset-3">
        <Image src={image} alt="" fill priority className="object-cover object-center" sizes="100vw" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(32,129,249,0.6) 0%, rgba(0,0,0,0.6) 50%, rgba(255,110,0,0.6) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-4 md:px-8">
        <div className="flex w-full flex-col items-center gap-3 text-center">
          <FadeUp
            as="span"
            className="text-white block text-6xl leading-tight font-extrabold sm:text-5xl md:text-6xl lg:text-7xl"
            delayMs={NAVBAR_ANIMATION_END_MS + 150}
            durationMs={800}
          >
            {title}
          </FadeUp>
          {meta && (
            <FadeUp
              as="span"
              className="block text-sm text-white/60 md:text-sm"
              delayMs={NAVBAR_ANIMATION_END_MS + 350}
              durationMs={700}
            >
              {meta}
            </FadeUp>
          )}
        </div>
      </div>
    </section>
  );
}
