import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Participants } from "@/components/sections/Participants";
import { Programs } from "@/components/sections/Programs";
import { Benefits } from "@/components/sections/Benefits";
import { Timeline } from "@/components/sections/Timeline";
import { Testimonials } from "@/components/sections/Testimonials";
import { Location } from "@/components/sections/Location";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";
import { Footer } from "@/components/layout/Footer";
import { isLocale } from "@/lib/i18n/locales";
import { getDictionary } from "@/lib/i18n/get-dictionary";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = await getDictionary(lang);

  return (
    <>
      <main className="flex min-h-screen flex-col items-center bg-white">
        <Navbar dict={dict.nav} locale={lang} />
        <Hero dict={dict.hero} locale={lang} />
        <About dict={dict.about} />
        <Participants dict={dict.participants} />

        <div className="relative w-full">
          <div className="absolute inset-2 rounded-[20px] bg-[#E9F2FF] md:inset-3" />
          <div className="relative z-10">
            <Programs dict={dict.programs} />
            <Benefits dict={dict.benefits} />
          </div>
        </div>

        <Timeline dict={dict.timeline} locale={lang} />
        <Testimonials dict={dict.testimonials} />
        <Location dict={dict.location} locale={lang} />
        <FAQ dict={dict.faq} />
        <CTA dict={dict.cta} />
      </main>
      <Footer nav={dict.nav} dict={dict.footer} locale={lang} />
    </>
  );
}
