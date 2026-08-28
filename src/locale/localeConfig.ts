/** Pakistan locale config — single market, English only (pakistan-version). */

export const LOCALE_COUNTRY_SLUGS = ['pk'] as const
export type LocaleCountrySlug = (typeof LOCALE_COUNTRY_SLUGS)[number]
export type LocaleLang = 'en' | 'ar'

export const DEFAULT_LOCALE: { country: LocaleCountrySlug; lang: LocaleLang } = { country: 'pk', lang: 'en' }

export const COUNTRY_SLUG_TO_CODE: Record<LocaleCountrySlug, string> = {
  pk: 'PK',
}

export const COUNTRY_CODE_TO_SLUG: Record<string, LocaleCountrySlug> = {
  PK: 'pk',
}

export const GCC_COUNTRY_FLAGS: Record<string, string> = {
  PK: '🇵🇰',
}

export const LOCALE_VIEW_STORAGE_KEY = 'dm_locale_view_pk'
export const LOCALE_STORAGE_KEY = LOCALE_VIEW_STORAGE_KEY
export const LOCALE_PREF_COOKIE = 'dm_locale_pref_pk'
export const LOCALE_PREF_MAX_AGE_SEC = 15552000
export const LOCALE_SUGGEST_DISMISS_KEY = 'dm_locale_suggest_dismiss_pk'

export function isDefaultLocale(country: LocaleCountrySlug, lang: LocaleLang): boolean {
  return country === 'pk' && lang === 'en'
}

export function isLocaleCountrySlug(value: string | null | undefined): value is LocaleCountrySlug {
  return Boolean(value && LOCALE_COUNTRY_SLUGS.includes(value as LocaleCountrySlug))
}

export function isLocaleLang(value: string | null | undefined): value is LocaleLang {
  return value === 'en' || value === 'ar'
}

export function codeToCountrySlug(code: string | null | undefined): LocaleCountrySlug {
  const upper = (code ?? '').trim().toUpperCase()
  return COUNTRY_CODE_TO_SLUG[upper] ?? 'pk'
}

export function countrySlugToCode(slug: LocaleCountrySlug): string {
  return COUNTRY_SLUG_TO_CODE[slug]
}

export const LOCALE_ROUTE_ALIASES: Record<string, string> = {
  insights: 'blog',
}

export const ROOT_TO_LOCALE_ALIASES: Record<string, string> = {
  blog: 'insights',
}

export type TranslationStatus = 'missing' | 'draft' | 'needs_review' | 'approved' | 'published' | 'archived'

export const TRANSLATION_STATUS_LABELS: Record<TranslationStatus, string> = {
  missing: 'Missing',
  draft: 'Draft',
  needs_review: 'Needs Review',
  approved: 'Approved',
  published: 'Published',
  archived: 'Archived',
}

export function localeDefaultsForCountry(_country: LocaleCountrySlug) {
  return {
    editorialStatus: 'published' as const,
    noIndex: false,
  }
}
