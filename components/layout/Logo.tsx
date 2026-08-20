import Image from "next/image";
import type { Locale } from "@/lib/i18n/locales";

export function Logo({ locale }: { locale: Locale }) {
  return (
    <a href={`/${locale}`} className="shrink-0">
      <Image
        src="/assets/logotype-talenco.svg"
        alt="TalenCo"
        width={149}
        height={40}
        priority
        className="h-8 w-auto md:h-9"
      />
    </a>
  );
}
