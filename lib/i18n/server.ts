import { cookies } from 'next/headers'
import type { Locale } from './translations'

const VALID: Locale[] = ['en', 'es']

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const raw = cookieStore.get('caretrack_locale')?.value
  return VALID.includes(raw as Locale) ? (raw as Locale) : 'en'
}
