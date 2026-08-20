import { Reveal } from "@/components/ui/Reveal";
import { DocSection } from "@/components/docs/DocSection";
import { Button } from "@/components/ui/Button";
import { REGISTER_FORM_URL, VISA_FORM_URL } from "@/lib/constants/course-guide";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/locales";

export async function CourseRegistration({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale);
  const t = dict.course.registration;

  return (
    <div id="register" className="flex flex-col gap-10 scroll-mt-44 lg:scroll-mt-32">
      <Reveal>
        <h2 className="text-2xl font-bold text-black md:text-3xl">{t.heading}</h2>
        <p className="mt-2 text-sm text-black/60 md:text-base">{t.subtitle}</p>
      </Reveal>

      <DocSection number="1" title={t.sectionTitle}>
        <ol className="flex flex-col gap-3">
          {t.steps.map((text, i) => (
            <li key={text} className="flex items-start gap-3 rounded-xl bg-[#f7f9fc] p-4 text-xs md:text-sm">
              <span className="bg-brand-orange flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white">
                {i + 1}
              </span>
              <span className="text-black/70">{text}</span>
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap gap-3">
          <a href={REGISTER_FORM_URL} target="_blank" rel="noreferrer">
            <Button variant="primary">{t.registrationFormBtn}</Button>
          </a>
          <a href={VISA_FORM_URL} target="_blank" rel="noreferrer">
            <Button variant="outline">{t.visaFormBtn}</Button>
          </a>
        </div>
      </DocSection>

      <DocSection number="2" title={t.termsSectionTitle}>
        <ul className="list-disc space-y-2 pl-5 text-black/60">
          <li>{t.termsItem1}</li>
          <li>{t.termsItem2}</li>
          <li>{t.termsItem3}</li>
          <li>
            {t.refundPrefix}{" "}
            <a href={`/${locale}/terms`} className="text-brand-blue hover:underline">
              {t.termsLinkLabel}
            </a>{" "}
            {t.refundSuffix}
          </li>
          <li>{t.termsItem5}</li>
        </ul>
      </DocSection>
    </div>
  );
}
