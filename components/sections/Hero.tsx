import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { RichText } from "@/components/ui/RichText";
import type { Dictionary } from "@/lib/i18n/dictionary";

const NAVBAR_ANIMATION_END_MS = 750;

export function Hero({ dict }: { dict: Dictionary["hero"] }) {
  return (
    <section
      id="top"
      className="relative flex min-h-[520px] w-full items-center overflow-hidden pt-28 pb-12 sm:min-h-[580px] md:min-h-[660px] md:pt-32 md:pb-16 lg:min-h-[740px]"
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
            <span
              className="animate-fade-up block opacity-0"
              style={{ animationDelay: `${NAVBAR_ANIMATION_END_MS + 0}ms`, animationDuration: "900ms" }}
            >
              <RichText text={dict.titleLine1} />
            </span>
            <span
              className="animate-fade-up block opacity-0"
              style={{ animationDelay: `${NAVBAR_ANIMATION_END_MS + 300}ms`, animationDuration: "900ms" }}
            >
              <RichText text={dict.titleLine2} />
            </span>
          </h1>

          <p className="text-base leading-normal text-white sm:text-lg md:text-xl lg:text-2xl">
            {dict.paragraph.map((line, index) => (
              <span
                key={line}
                className="animate-fade-up block opacity-0"
                style={{
                  animationDelay: `${NAVBAR_ANIMATION_END_MS + 650 + index * 150}ms`,
                  animationDuration: "700ms",
                }}
              >
                {line}
              </span>
            ))}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className="animate-fade-up inline-block opacity-0"
              style={{ animationDelay: `${NAVBAR_ANIMATION_END_MS + 1200}ms`, animationDuration: "700ms" }}
            >
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSewS35OEIG1OmTJ-CQwl4RFpSsj-3QwRYJWEObNpvr6mP6h6A/viewform" target="_blank">
                <Button variant="primary"> 
                  {dict.ctaPrimary}
                </Button>
              </a>
            </span>
            <span
              className="animate-fade-up inline-block opacity-0"
              style={{ animationDelay: `${NAVBAR_ANIMATION_END_MS + 1400}ms`, animationDuration: "700ms" }}
            >
              <a href="https://docs.google.com/document/d/1QlYQ3RWkfynswIt028RzrwrJCfKzb2haRj9vrkN9vQo/edit?tab=t.0#heading=h.iohq25xcrl5ns" target="_blank">
                <Button variant="secondary"> 
                  {dict.ctaSecondary}
                </Button>
              </a>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
