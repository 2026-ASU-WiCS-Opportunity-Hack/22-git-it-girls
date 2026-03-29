'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { translations, LOCALES, type Locale, type TranslationKey } from './translations'

const COOKIE_KEY = 'caretrack_locale'

interface I18nContextValue {
  locale: Locale
  t: (key: TranslationKey) => string
  setLocale: (l: Locale) => void
}

const I18nContext = createContext<I18nContextValue>({
  locale: 'en',
  t: (key) => translations.en[key],
  setLocale: () => {},
})

export function I18nProvider({
  children,
  initialLocale,
}: {
  children: ReactNode
  initialLocale: Locale
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale)

  function setLocale(l: Locale) {
    setLocaleState(l)
    document.cookie = `${COOKIE_KEY}=${l}; path=/; max-age=31536000; SameSite=Lax`
  }

  function t(key: TranslationKey): string {
    return (translations[locale] as Record<string, string>)[key] ?? translations.en[key] ?? key
  }

  return (
    <I18nContext.Provider value={{ locale, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}

export { LOCALES }
