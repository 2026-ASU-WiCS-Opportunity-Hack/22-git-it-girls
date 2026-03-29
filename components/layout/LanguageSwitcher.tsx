'use client'

import { useI18n, LOCALES } from '@/lib/i18n/context'

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n()

  return (
    <div className="flex items-center gap-1 px-3 py-2">
      {LOCALES.map((l) => (
        <button
          key={l.code}
          onClick={() => setLocale(l.code)}
          title={l.label}
          className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${
            locale === l.code
              ? 'bg-blue-100 text-blue-700'
              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
          }`}
        >
          {l.flag} {l.code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
