export const LOCALES = ["en", "ja"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_COOKIE = "locale";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export const LOCALE_LABELS: Record<Locale, { code: string; name: string; flag: string }> = {
  en: { code: "EN", name: "English", flag: "/assets/icons/EN.svg" },
  ja: { code: "JP", name: "日本語", flag: "/assets/icons/JP.svg" },
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}
