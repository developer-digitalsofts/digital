/** Pakistan country codes (pakistan-version). */
export const GCC_COUNTRY_CODES = ['PK'] as const

export type GccCountryCode = (typeof GCC_COUNTRY_CODES)[number]

export const COUNTRY_STORAGE_KEY = 'dm_pk_country'

export function isGccCountryCode(value: string | null | undefined): value is GccCountryCode {
  return Boolean(value && GCC_COUNTRY_CODES.includes(value as GccCountryCode))
}

export function normalizeCountryCode(value: string | null | undefined, fallback: GccCountryCode = 'PK'): GccCountryCode {
  const upper = (value ?? '').trim().toUpperCase()
  return isGccCountryCode(upper) ? upper : fallback
}

export function matchesCountryScope(contentCountryCode: string | undefined | null, selected: GccCountryCode): boolean {
  const code = (contentCountryCode ?? '').trim().toUpperCase()
  if (!code || code === 'ALL' || code === 'PK' || code === 'PAKISTAN') return true
  return code === selected
}

export const GCC_COUNTRY_FLAGS: Record<GccCountryCode, string> = {
  PK: '🇵🇰',
}
