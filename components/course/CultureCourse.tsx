import { Reveal } from "@/components/ui/Reveal";
import { CourseHeading } from "@/components/course/CourseHeading";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/locales";

export async function CultureCourse({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale);
  const t = dict.course.curriculum.culture;

  return (
    <div id="curriculum-culture" className="flex flex-col gap-6 scroll-mt-44 lg:scroll-mt-32">
      <CourseHeading number="5" title={t.title} />
      <Reveal className="text-sm text-black/70 md:text-base">
        <p>{t.paragraph}</p>
      </Reveal>
    </div>
  );
}
