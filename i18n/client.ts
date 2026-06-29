'use client'

import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { i18nConfig } from './config'
import jaLanding from '../locales/ja/landing.json'
import enLanding from '../locales/en/landing.json'

// Guard against double-init in dev hot-reload
if (!i18next.isInitialized) {
  i18next
    .use(initReactI18next)
    .init({
      resources: {
        ja: { landing: jaLanding },
        en: { landing: enLanding },
      },
      lng: i18nConfig.defaultLocale,
      fallbackLng: i18nConfig.defaultLocale,
      defaultNS: 'landing',
      interpolation: { escapeValue: false },
    })
    .catch((err) => console.error("[i18n] init failed:", err));
}

export default i18next
