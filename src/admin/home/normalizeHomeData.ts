import type { Bilingual } from '../../cms/types'

export function emptyBilingual(): Bilingual {
  return { en: '', ar: '' }
}

export function normalizeBilingual(raw: unknown): Bilingual {
  if (!raw || typeof raw !== 'object') return emptyBilingual()
  const o = raw as Record<string, unknown>
  return {
    en: typeof o.en === 'string' ? o.en : '',
    ar: typeof o.ar === 'string' ? o.ar : '',
  }
}
