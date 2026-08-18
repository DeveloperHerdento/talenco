import Image from "next/image";
import Link from "next/link";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n/locales";

// Only two locales exist, so a direct toggle (click switches straight to the
// other one) beats a dropdown — no expand/collapse state, and nothing that
// can overlap surrounding content on narrow screens.
export function LangToggle({ locale }: { locale: Locale }) {
  const next = LOCALES.find((code) => code !== locale) ?? locale;
  const target = LOCALE_LABELS[next];

  return (
    <Link
      href={`/${next}`}
      className="inline-flex h-10 items-center gap-2.5 rounded-[20px] border border-[#e0e0e0] bg-white px-[18px] py-3 text-sm font-semibold text-black transition-colors hover:bg-black/5"
    >
      <Image src={target.flag} alt="" width={18} height={18} className="rounded-full object-cover" />
      {target.code}
    </Link>
  );
}
