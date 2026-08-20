import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DocHero } from "@/components/docs/DocHero";
import { DocSidebarMobile, DocSidebarDesktop } from "@/components/docs/DocSidebar";
import { CourseOverview } from "@/components/course/CourseOverview";
import { CourseSchemes } from "@/components/course/CourseSchemes";
import { CourseSchedule } from "@/components/course/CourseSchedule";
import { CourseRegistration } from "@/components/course/CourseRegistration";
import { CourseCurriculum } from "@/components/course/CourseCurriculum";
import { CourseContact } from "@/components/course/CourseContact";
import { getCourseGuide } from "@/lib/constants/course-guide";
import { isLocale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export const metadata: Metadata = {
  title: "Program Guideline - Global Career Starter Program | TalenCo",
  description:
    "Full curriculum, schedule, fees, and course-by-course details of TalenCo's Global Career Starter Program.",
};

export default async function CoursePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = await getDictionary(lang);
  const { quickNav } = getCourseGuide(lang);

  return (
    <>
      <main className="flex min-h-screen w-full flex-col items-center bg-white">
        <Navbar dict={dict.nav} locale={lang} />
        <DocHero title={dict.course.hero.title} meta={dict.course.hero.meta} />

        <div className="w-full px-4 py-10 md:px-8 md:py-14">
          <div className="mx-auto w-full max-w-[1200px]">
            <DocSidebarMobile items={quickNav} />

            <div className="grid grid-cols-1 gap-4 pt-4 lg:grid-cols-[220px_1fr] lg:gap-12 lg:pt-0">
              <DocSidebarDesktop items={quickNav} />

              <div className="flex min-w-0 flex-col gap-16">
                <CourseOverview locale={lang} />
                <CourseSchemes locale={lang} />
                <CourseSchedule locale={lang} />
                <CourseRegistration locale={lang} />
                <CourseCurriculum locale={lang} />
                <CourseContact locale={lang} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer nav={dict.nav} dict={dict.footer} locale={lang} />
    </>
  );
}
