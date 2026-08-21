import { DocTable } from "@/components/docs/DocTable";
import { CurriculumSection } from "@/components/course/CurriculumSection";
import { getCourseGuide } from "@/lib/constants/course-guide";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/locales";

export async function BipaCourse({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale);
  const t = dict.course.curriculum.bipa;
  const { bipaSyllabus } = getCourseGuide(locale);

  return (
    <CurriculumSection
      id="curriculum-bipa"
      number="2"
      title={t.title}
      paragraph={t.paragraph}
      paragraphExtra={<p className="text-xs text-black/45">{t.footnote}</p>}
    >
      <DocTable headers={t.tableHeaders} rows={bipaSyllabus} />
    </CurriculumSection>
  );
}
