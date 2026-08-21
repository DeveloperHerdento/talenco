import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { DayCard } from "@/components/docs/DayCard";
import { CurriculumSection } from "@/components/course/CurriculumSection";
import { getCourseGuide } from "@/lib/constants/course-guide";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/locales";

export async function DigitalMarketingCourse({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale);
  const t = dict.course.curriculum.digitalMarketing;
  const { digitalMarketingDays } = getCourseGuide(locale);

  return (
    <CurriculumSection
      id="curriculum-digital-marketing"
      number="3"
      title={t.title}
      paragraph={t.paragraph}
    >
      <Stagger className="flex flex-col gap-5" staggerDelay={0.12}>
        {digitalMarketingDays.map((day) => (
          <StaggerItem key={day.day}>
            <DayCard {...day} labels={dict.course.dayCardLabels} />
          </StaggerItem>
        ))}
      </Stagger>
    </CurriculumSection>
  );
}
