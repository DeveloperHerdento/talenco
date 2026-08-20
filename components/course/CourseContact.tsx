import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLine } from "@fortawesome/free-brands-svg-icons";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/locales";

export async function CourseContact({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale);
  const t = dict.course.contact;

  return (
    <div id="course-contact" className="scroll-mt-44 lg:scroll-mt-32">
      <Reveal className="bg-brand-orange flex flex-col items-start gap-8 rounded-[20px] p-10 shadow-lg shadow-black/10 md:p-14">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-white md:text-3xl">{t.heading}</h2>
          <p className="text-sm text-white/80 md:text-base">{t.infoLine}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a href="https://lin.ee/EQaovqv" target="_blank" rel="noreferrer">
            <Button variant="outline" icon={<FontAwesomeIcon icon={faLine} className="size-4" aria-hidden="true" />}>
              {t.lineButton}
            </Button>
          </a>
          <a href="https://wa.me/+6285117804811" target="_blank" rel="noreferrer">
            <Button variant="secondary">{t.chatButton}</Button>
          </a>
        </div>
      </Reveal>
    </div>
  );
}
