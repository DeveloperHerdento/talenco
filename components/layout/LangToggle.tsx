import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { LOCALES, LOCALE_LABELS, type Locale } from "@/lib/i18n/locales";


export function LangToggle({ locale, className = "" }: { locale: Locale; className?: string }) {
  const next = LOCALES.find((code) => code !== locale) ?? locale;
  const target = LOCALE_LABELS[next];

  return (
    <Button variant="outline" href={`/${next}`} className={className}>
      <Image src={target.flag} alt="" width={18} height={18} className="rounded-full object-cover" />
      {target.code}
    </Button>
  );
}
