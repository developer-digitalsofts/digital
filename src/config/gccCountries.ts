/** GCC country codes supported by DigitalManager.ae */
export const GCC_COUNTRY_CODES = ['AE', 'SA', 'KW', 'QA', 'BH', 'OM'] as const

export type GccCountryCode = (typeof GCC_COUNTRY_CODES)[number]

export const COUNTRY_STORAGE_KEY = 'dm_gcc_country'

export function isGccCountryCode(value: string | null | undefined): value is GccCountryCode {
  return Boolean(value && GCC_COUNTRY_CODES.includes(value as GccCountryCode))
}

export function normalizeCountryCode(value: string | null | undefined, fallback: GccCountryCode = 'AE'): GccCountryCode {
  const upper = (value ?? '').trim().toUpperCase()
  return isGccCountryCode(upper) ? upper : fallback
}

/** Content visible when countryCode matches, is regional (GCC), or is global (empty). */
export function matchesCountryScope(contentCountryCode: string | undefined | null, selected: GccCountryCode): boolean {
  const code = (contentCountryCode ?? '').trim().toUpperCase()
  if (!code || code === 'ALL' || code === 'GCC') return true
  return code === selected
}

export const GCC_COUNTRY_FLAGS: Record<GccCountryCode, string> = {
  AE: '🇦🇪',
  SA: '🇸🇦',
  KW: '🇰🇼',
  QA: '🇶🇦',
  BH: '🇧🇭',
  OM: '🇴🇲',
}
