import { Reveal } from "@/components/ui/Reveal";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { DayCard } from "@/components/docs/DayCard";
import { CourseHeading } from "@/components/course/CourseHeading";
import { getCourseGuide } from "@/lib/constants/course-guide";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/locales";

export async function DigitalMarketingCourse({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale);
  const t = dict.course.curriculum.digitalMarketing;
  const { digitalMarketingDays } = getCourseGuide(locale);

  return (
    <div id="curriculum-digital-marketing" className="flex flex-col gap-6 scroll-mt-44 lg:scroll-mt-32">
      <CourseHeading number="3" title={t.title} />
      <Reveal className="text-sm text-black/70 md:text-base">
        <p>{t.paragraph}</p>
      </Reveal>

      <Stagger className="flex flex-col gap-5" staggerDelay={0.12}>
        {digitalMarketingDays.map((day) => (
          <StaggerItem key={day.day}>
            <DayCard {...day} labels={dict.course.dayCardLabels} />
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
