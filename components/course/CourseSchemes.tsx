import { Reveal } from "@/components/ui/Reveal";
import { Stagger, StaggerItem } from "@/components/ui/Stagger";
import { DocTable } from "@/components/docs/DocTable";
import { getCourseGuide } from "@/lib/constants/course-guide";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/locales";

type IncludedListProps = { title: string; items: string[]; dotClassName: string; delayMs?: number };

function IncludedList({ title, items, dotClassName, delayMs }: IncludedListProps) {
  return (
    <Reveal className="rounded-2xl border border-[#ececec] p-6" delayMs={delayMs}>
      <h3 className="mb-3 text-base font-bold text-black">{title}</h3>
      <ul className="flex flex-col gap-2 text-sm text-black/65">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${dotClassName}`} />
            {item}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

export async function CourseSchemes({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale);
  const t = dict.course.schemes;
  const { addOnRows, included, notIncluded, onsitePeriod } = getCourseGuide(locale);

  return (
    <div id="schemes" className="flex flex-col gap-10 scroll-mt-44 lg:scroll-mt-32">
      <Reveal>
        <h2 className="text-2xl font-bold text-black md:text-3xl">{t.heading}</h2>
        <p className="mt-2 text-sm text-black/60 md:text-base">{t.subtitle}</p>
      </Reveal>

      <Stagger className="grid grid-cols-1 gap-6 lg:grid-cols-2" staggerDelay={0.15}>
        <StaggerItem>
          <div className="flex h-full flex-col gap-4 rounded-2xl border border-[#ececec] p-6 shadow-sm">
            <span className="w-fit rounded-full bg-[#eaf3ff] px-3 py-1 text-xs font-bold text-brand-blue uppercase">
              {t.scheme1Badge}
            </span>
            <h3 className="text-lg font-bold text-black">{t.scheme1Title}</h3>
            <p className="text-sm text-black/60">{t.scheme1Desc}</p>
            <div className="mt-auto flex items-end justify-between border-t border-[#ececec] pt-4">
              <div>
                <p className="text-xs text-black/45">{t.programFeeLabel}</p>
                <p className="text-2xl font-extrabold text-brand-blue">¥29,800</p>
                <p className="text-xs text-black/45">{t.scheme1Note}</p>
              </div>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="flex h-full flex-col gap-4 rounded-2xl border border-brand-blue bg-[#f7fbff] p-6 shadow-md">
            <span className="bg-brand-orange w-fit rounded-full px-3 py-1 text-xs font-bold text-white uppercase">
              {t.scheme2Badge}
            </span>
            <h3 className="text-lg font-bold text-black">{t.scheme2Title}</h3>
            <p className="text-sm text-black/60">{t.scheme2Desc}</p>
            <div className="mt-auto flex items-end justify-between border-t border-brand-blue/20 pt-4">
              <div>
                <p className="text-xs text-black/45">{t.programFeeLabel}</p>
                <p className="text-2xl font-extrabold text-brand-orange">¥298,000</p>
                <p className="text-xs text-black/45">{t.scheme2Note}</p>
              </div>
            </div>
          </div>
        </StaggerItem>
      </Stagger>

      <Reveal className="flex flex-col gap-3">
        <h3 className="text-lg font-bold text-black">{t.onsitePeriodTitle}</h3>
        <DocTable headers={[t.milestoneHeader, t.dateHeader]} rows={onsitePeriod} highlightLastCol />
      </Reveal>

      <Reveal className="flex flex-col gap-3">
        <h3 className="text-lg font-bold text-black">{t.addOnTitle}</h3>
        <DocTable headers={[t.componentHeader, t.priceHeader]} rows={addOnRows} highlightLastCol />
      </Reveal>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <IncludedList title={t.includedTitle} items={included} dotClassName="bg-brand-blue" />
        <IncludedList title={t.notIncludedTitle} items={notIncluded} dotClassName="bg-brand-orange" delayMs={100} />
      </div>
    </div>
  );
}
