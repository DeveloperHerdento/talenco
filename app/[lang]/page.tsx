import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
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
        <Hero dict={dict.hero} />
        <About dict={dict.about} />
        <Participants dict={dict.participants} />
        <Programs dict={dict.programs} />
        <Benefits dict={dict.benefits} />
        <Timeline dict={dict.timeline} />
        <Testimonials dict={dict.testimonials} />
        <Location dict={dict.location} />
        <FAQ dict={dict.faq} />
        <CTA dict={dict.cta} />
      </main>
      <Footer nav={dict.nav} programs={dict.programs} dict={dict.footer} />
    </>
  );
}
