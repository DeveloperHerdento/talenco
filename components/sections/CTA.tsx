import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RichText } from "@/components/ui/RichText";
import type { Dictionary } from "@/lib/i18n/dictionary";

export function CTA({ dict }: { dict: Dictionary["cta"] }) {
  return (
    <section className="w-full py-14 md:py-18 lg:py-20">
      <div className="mx-auto w-full max-w-[1240px] px-4 md:px-8">
        <Reveal
          className="flex flex-col items-start justify-between gap-8 rounded-[20px] border border-white/15 p-12 shadow-lg shadow-black/10 md:flex-row md:items-center md:gap-10 md:p-20 lg:p-24"
          style={{
            // Orange and blue are near-complementary — blending them directly
            // (a plain 2-stop gradient) passes through a muddy gray-mauve
            // midpoint. Routing through a neutral gray instead (lighter
            // version of the trick Hero's overlay uses with black) keeps
            // both ends vivid without going too dark in the middle.
            backgroundImage: "linear-gradient(135deg, #FF6E00 0%, #6b625a 52%, #2081F9 100%)",
          }}
        >
          <div className="flex flex-col gap-5">
            <h2 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              <RichText text={dict.heading} />
            </h2>
            <p className="text-sm text-white/80 md:text-base">{dict.subtitle}</p>
          </div>
          <Button variant="secondary" href="#programs" className="shrink-0">
            {dict.ctaPrimary}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
