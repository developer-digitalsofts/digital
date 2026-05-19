import type { Bilingual } from './types'

export function pick(b: Bilingual | undefined, lang: 'en' | 'ar'): string {
  if (!b) return ''
  return lang === 'ar' ? b.ar : b.en
}
