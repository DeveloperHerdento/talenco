import { Reveal } from "@/components/ui/Reveal";
import { DocTable } from "@/components/docs/DocTable";
import { CourseHeading } from "@/components/course/CourseHeading";
import { getCourseGuide } from "@/lib/constants/course-guide";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/locales";

export async function BipaCourse({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale);
  const t = dict.course.curriculum.bipa;
  const { bipaSyllabus } = getCourseGuide(locale);

  return (
    <div id="curriculum-bipa" className="flex flex-col gap-6 scroll-mt-44 lg:scroll-mt-32">
      <CourseHeading number="2" title={t.title} />
      <Reveal className="flex flex-col gap-4 text-sm text-black/70 md:text-base">
        <p>{t.paragraph}</p>
        <p className="text-xs text-black/45">{t.footnote}</p>
      </Reveal>
      <DocTable headers={t.tableHeaders} rows={bipaSyllabus} />
    </div>
  );
}
