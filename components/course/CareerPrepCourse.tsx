import { Reveal } from "@/components/ui/Reveal";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { DayCard } from "@/components/docs/DayCard";
import { CourseHeading } from "@/components/course/CourseHeading";
import { getCourseGuide } from "@/lib/constants/course-guide";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/locales";

export async function CareerPrepCourse({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale);
  const t = dict.course.curriculum.careerPrep;
  const { careerPrepDays, individualChallenge } = getCourseGuide(locale);

  return (
    <div id="curriculum-career" className="flex flex-col gap-6 scroll-mt-44 lg:scroll-mt-32">
      <CourseHeading number="4" title={t.title} />
      <Reveal className="text-sm text-black/70 md:text-base">
        <p>{t.paragraph}</p>
      </Reveal>

      <Stagger className="flex flex-col gap-5" staggerDelay={0.12}>
        {careerPrepDays.map((day) => (
          <StaggerItem key={day.day}>
            <DayCard {...day} labels={dict.course.dayCardLabels} />
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal className="rounded-2xl border border-[#ececec] p-6">
        <h4 className="mb-3 text-base font-bold text-black">{t.individualChallengeTitle}</h4>
        <ol className="flex flex-col gap-2 text-sm text-black/65">
          {individualChallenge.map((text, i) => (
            <li key={text} className="flex gap-2">
              <span className="font-semibold text-brand-blue">{i + 1}.</span>
              {text}
            </li>
          ))}
        </ol>
      </Reveal>
    </div>
  );
}
