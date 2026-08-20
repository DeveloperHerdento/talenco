import { Reveal } from "@/components/ui/Reveal";
import { DocSection } from "@/components/docs/DocSection";
import { getCourseGuide } from "@/lib/constants/course-guide";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/locales";

export async function CourseOverview({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale);
  const t = dict.course.overview;
  const { programStructure } = getCourseGuide(locale);

  return (
    <div id="overview" className="flex flex-col gap-10 scroll-mt-44 lg:scroll-mt-32">
      <Reveal>
        <h2 className="text-2xl font-bold text-black md:text-3xl">{t.heading}</h2>
        <p className="mt-2 text-sm text-black/60 md:text-base">{t.subtitle}</p>
      </Reveal>

      <DocSection number="1" title={t.section1Title}>
        <p>{t.welcome1}</p>
        <p>{t.welcome2}</p>
      </DocSection>

      <DocSection number="2" title={t.section2Title}>
        <p>{t.about1}</p>
        <div className="rounded-xl bg-[#f7f9fc] p-4">
          <p className="mb-1 text-xs font-bold tracking-[1.5px] text-brand-orange uppercase">{t.visionLabel}</p>
          <p>{t.visionText}</p>
        </div>
        <ul className="list-disc space-y-1.5 pl-5 text-black/60">
          {t.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </DocSection>

      <DocSection number="3" title={t.section3Title}>
        <p>{t.whatIs}</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {programStructure.map(([title, desc]) => (
            <div key={title} className="rounded-xl border border-[#ececec] p-4 text-xs md:text-sm">
              <p className="font-semibold text-black">{title}</p>
              <p className="mt-1 text-black/60">{desc}</p>
            </div>
          ))}
        </div>
      </DocSection>
    </div>
  );
}
