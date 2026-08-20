import { Reveal } from "@/components/ui/Reveal";
import { BusinessEnglishCourse } from "@/components/course/BusinessEnglishCourse";
import { BipaCourse } from "@/components/course/BipaCourse";
import { DigitalMarketingCourse } from "@/components/course/DigitalMarketingCourse";
import { CareerPrepCourse } from "@/components/course/CareerPrepCourse";
import { CultureCourse } from "@/components/course/CultureCourse";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/locales";

export async function CourseCurriculum({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale);

  return (
    <div id="curriculum" className="flex flex-col gap-16 scroll-mt-44 lg:scroll-mt-32">
      <Reveal>
        <h2 className="text-2xl font-bold text-black md:text-3xl">{dict.course.curriculum.heading}</h2>
        <p className="mt-2 text-sm text-black/60 md:text-base">{dict.course.curriculum.subtitle}</p>
      </Reveal>

      <BusinessEnglishCourse locale={locale} />
      <BipaCourse locale={locale} />
      <DigitalMarketingCourse locale={locale} />
      <CareerPrepCourse locale={locale} />
      <CultureCourse locale={locale} />
    </div>
  );
}
