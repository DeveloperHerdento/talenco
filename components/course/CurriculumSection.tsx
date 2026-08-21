import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { CourseHeading } from "@/components/course/CourseHeading";

type CurriculumSectionProps = {
  id: string;
  number: string;
  title: string;
  paragraph: string;
  paragraphExtra?: ReactNode;
  children?: ReactNode;
};

export function CurriculumSection({
  id,
  number,
  title,
  paragraph,
  paragraphExtra,
  children,
}: CurriculumSectionProps) {
  return (
    <div id={id} className="flex flex-col gap-6 scroll-mt-44 lg:scroll-mt-32">
      <CourseHeading number={number} title={title} />
      <Reveal className="flex flex-col gap-4 text-sm text-black/70 md:text-base">
        <p>{paragraph}</p>
        {paragraphExtra}
      </Reveal>
      {children}
    </div>
  );
}
