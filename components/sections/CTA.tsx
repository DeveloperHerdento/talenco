import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { RichText } from "@/components/ui/RichText";
import { REGISTER_FORM_URL } from "@/lib/constants/course-guide";
import type { Dictionary } from "@/lib/i18n/dictionary";

export function CTA({ dict }: { dict: Dictionary["cta"] }) {
  return (
    <section className="w-full py-14 md:py-18 lg:py-20">
      <div className="mx-auto w-full max-w-[1240px] px-4 md:px-8">
        <Reveal
          className="flex flex-col items-start gap-8 rounded-[20px] border border-white/15 p-12 shadow-lg shadow-black/10 md:p-20 lg:p-24"
          style={{
            backgroundImage: "linear-gradient(135deg, #FF6E00 0%, #6b625a 52%, #2081F9 100%)",
          }}
        >
          <div className="flex flex-col gap-5">
            <h2 className="text-3xl font-bold text-white sm:text-4xl md:text-5xl">
              <RichText text={dict.heading} />
            </h2>
            <p className="text-sm text-white/80 md:text-base">{dict.subtitle}</p>
          </div>
          <a href={REGISTER_FORM_URL} target="_blank" rel="noreferrer">
            <Button variant="outline" size="lg">
              {dict.ctaPrimary}
            </Button>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
