export const i18nConfig = {
  defaultLocale: "ja",
  locales: ["en", "ja"] as const,
};

export type Locale = typeof i18nConfig.locales[number];
