import { DocTable } from "@/components/docs/DocTable";
import { CurriculumSection } from "@/components/course/CurriculumSection";
import { getCourseGuide } from "@/lib/constants/course-guide";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/locales";

export async function BusinessEnglishCourse({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale);
  const t = dict.course.curriculum.businessEnglish;
  const { businessEnglishSyllabus } = getCourseGuide(locale);

  return (
    <CurriculumSection
      id="curriculum-business-english"
      number="1"
      title={t.title}
      paragraph={t.paragraph}
      paragraphExtra={
        <ul className="list-disc space-y-1.5 pl-5 text-black/60">
          {t.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      }
    >
      <DocTable headers={t.tableHeaders} rows={businessEnglishSyllabus} />
    </CurriculumSection>
  );
}
