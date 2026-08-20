import { Reveal } from "@/components/ui/Reveal";

type CourseHeadingProps = { number: string; title: string };

export function CourseHeading({ number, title }: CourseHeadingProps) {
  return (
    <Reveal className="flex items-center gap-3">
      <span className="bg-brand-orange flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white md:size-9">
        {number}
      </span>
      <h3 className="text-xl font-bold text-black md:text-2xl">{title}</h3>
    </Reveal>
  );
}
