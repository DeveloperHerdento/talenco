import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { RichText } from "@/components/ui/RichText";
import { FadeUp } from "@/components/ui/FadeUp";
import { REGISTER_FORM_URL } from "@/lib/constants/course-guide";
import { NAVBAR_ANIMATION_END_MS } from "@/lib/constants/animation";
import type { Dictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/locales";

export function Hero({ dict, locale }: { dict: Dictionary["hero"]; locale: Locale }) {
  return (
    <section
      id="top"
      className="relative flex min-h-[max(520px,100dvh)] w-full items-center overflow-hidden pt-28 pb-12 sm:min-h-[max(580px,100dvh)] md:min-h-[max(660px,100dvh)] md:pt-32 md:pb-16 lg:min-h-[max(740px,100dvh)]"
    >
      <div className="absolute inset-2 overflow-hidden rounded-[20px] md:inset-3">
        <Image
          src="/assets/images/hero-bg.webp"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(32,129,249,0.6) 0%, rgba(0,0,0,0.6) 50%, rgba(255,110,0,0.6) 100%)",
          }}
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-4 md:px-8">
        <div className="flex max-w-5xl flex-col gap-12">
          <h1 className="flex flex-col text-6xl leading-tight font-extrabold tracking-normal text-white sm:text-5xl md:text-6xl lg:text-7xl lg:leading-tight xl:text-[96px] xl:leading-tight">
            <FadeUp as="span" className="block" delayMs={NAVBAR_ANIMATION_END_MS + 0} durationMs={500}>
              <RichText text={dict.titleLine1} />
            </FadeUp>
            <FadeUp as="span" className="block" delayMs={NAVBAR_ANIMATION_END_MS + 120} durationMs={500}>
              <RichText text={dict.titleLine2} />
            </FadeUp>
          </h1>

          <p className="text-base leading-normal text-white sm:text-lg md:text-xl lg:text-2xl">
            {dict.paragraph.map((line, index) => (
              <FadeUp
                key={line}
                as="span"
                className="block"
                delayMs={NAVBAR_ANIMATION_END_MS + 300 + index * 60}
                durationMs={350}
              >
                {line}
              </FadeUp>
            ))}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <FadeUp className="inline-block" delayMs={NAVBAR_ANIMATION_END_MS + 500} durationMs={400}>
              <a href={REGISTER_FORM_URL} target="_blank" rel="noreferrer">
                <Button variant="primary" size="lg">{dict.ctaPrimary}</Button>
              </a>
            </FadeUp>
            <FadeUp className="inline-block" delayMs={NAVBAR_ANIMATION_END_MS + 580} durationMs={400}>
              <a href={`/${locale}/course`}>
                <Button variant="secondary" size="lg">{dict.ctaSecondary}</Button>
              </a>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
