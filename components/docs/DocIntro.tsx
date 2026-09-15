import { Reveal } from "@/components/ui/Reveal";

type DocIntroProps = { heading: string; subtitle: string };

export function DocIntro({ heading, subtitle }: DocIntroProps) {
  return (
    <Reveal>
      <h2 className="text-2xl font-bold text-black md:text-3xl">{heading}</h2>
      <p className="mt-2 text-sm text-black/60 md:text-base">{subtitle}</p>
    </Reveal>
  );
}
