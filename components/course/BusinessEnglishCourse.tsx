import { Reveal } from "@/components/ui/Reveal";
import { DocTable } from "@/components/docs/DocTable";
import { CourseHeading } from "@/components/course/CourseHeading";
import { getCourseGuide } from "@/lib/constants/course-guide";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/locales";

export async function BusinessEnglishCourse({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale);
  const t = dict.course.curriculum.businessEnglish;
  const { businessEnglishSyllabus } = getCourseGuide(locale);

  return (
    <div id="curriculum-business-english" className="flex flex-col gap-6 scroll-mt-44 lg:scroll-mt-32">
      <CourseHeading number="1" title={t.title} />
      <Reveal className="flex flex-col gap-4 text-sm text-black/70 md:text-base">
        <p>{t.paragraph}</p>
        <ul className="list-disc space-y-1.5 pl-5 text-black/60">
          {t.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      </Reveal>
      <DocTable headers={t.tableHeaders} rows={businessEnglishSyllabus} />
    </div>
  );
}
