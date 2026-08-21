import { CurriculumSection } from "@/components/course/CurriculumSection";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/locales";

export async function CultureCourse({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale);
  const t = dict.course.curriculum.culture;

  return (
    <CurriculumSection id="curriculum-culture" number="5" title={t.title} paragraph={t.paragraph} />
  );
}
