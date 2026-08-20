import { Reveal } from "@/components/ui/Reveal";
import { getCourseGuide, type ScheduleRow } from "@/lib/constants/course-guide";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import type { Locale } from "@/lib/i18n/locales";

function ScheduleRows({ rows }: { rows: ScheduleRow[] }) {
  return (
    <>
      {rows.map((row, i) => (
        <tr key={row.day} className={`border-t border-[#eee] hover:bg-[#f4f8ff] ${i % 2 === 1 ? "bg-[#fafbfd]" : "bg-white"}`}>
          <td className="px-3 py-3 font-bold text-brand-blue">{row.day}</td>
          <td className="px-3 py-3 font-medium text-black">{row.topic}</td>
          <td className="px-3 py-3 text-black/60">{row.bipa}</td>
          <td className="px-3 py-3 text-black/60">{row.english}</td>
          <td className="px-3 py-3 text-black/60">{row.digitalMarketing}</td>
          <td className="px-3 py-3 text-black/60">{row.groupTask}</td>
          <td className="px-3 py-3 text-black/60">{row.catchUp ?? "—"}</td>
        </tr>
      ))}
    </>
  );
}

export async function CourseSchedule({ locale }: { locale: Locale }) {
  const dict = await getDictionary(locale);
  const t = dict.course.schedule;
  const { scheduleRows } = getCourseGuide(locale);

  return (
    <div id="schedule" className="flex flex-col gap-6 scroll-mt-44 lg:scroll-mt-32">
      <Reveal>
        <h2 className="text-2xl font-bold text-black md:text-3xl">{t.heading}</h2>
        <p className="mt-2 text-sm text-black/60 md:text-base">{t.subtitle}</p>
      </Reveal>

      <Reveal className="w-full overflow-x-auto rounded-xl border border-[#e5e5e5] shadow-sm">
        <table className="w-full min-w-[860px] border-collapse text-left text-xs md:text-sm">
          <thead>
            <tr className="bg-brand-orange">
              {t.headers.map((h) => (
                <th key={h} className="px-3 py-3 font-semibold whitespace-nowrap text-white first:rounded-tl-xl last:rounded-tr-xl">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <ScheduleRows rows={scheduleRows.slice(0, 5)} />
            <tr className="border-t border-[#eee] bg-amber-50">
              <td colSpan={7} className="px-3 py-3 text-center font-semibold text-amber-700">
                {t.weekendTrip}
              </td>
            </tr>
            <ScheduleRows rows={scheduleRows.slice(5)} />
            <tr className="border-t border-[#eee] bg-[#f7f9fc]">
              <td colSpan={7} className="rounded-b-xl px-3 py-3 text-center font-semibold text-black/60">
                {t.weekendReturn}
              </td>
            </tr>
          </tbody>
        </table>
      </Reveal>
    </div>
  );
}
