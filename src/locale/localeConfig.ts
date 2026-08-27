/** GCC locale routing — country slug + language code in URL path (not query string). */

export const LOCALE_COUNTRY_SLUGS = ['ae', 'sa', 'kw', 'qa', 'om', 'bh'] as const
export type LocaleCountrySlug = (typeof LOCALE_COUNTRY_SLUGS)[number]
export type LocaleLang = 'en' | 'ar'

export const DEFAULT_LOCALE: { country: LocaleCountrySlug; lang: LocaleLang } = { country: 'ae', lang: 'en' }

export const COUNTRY_SLUG_TO_CODE: Record<LocaleCountrySlug, string> = {
  ae: 'AE',
  sa: 'SA',
  kw: 'KW',
  qa: 'QA',
  om: 'OM',
  bh: 'BH',
}

export const COUNTRY_CODE_TO_SLUG: Record<string, LocaleCountrySlug> = {
  AE: 'ae',
  SA: 'sa',
  KW: 'kw',
  QA: 'qa',
  OM: 'om',
  BH: 'bh',
}

export const GCC_COUNTRY_FLAGS: Record<string, string> = {
  AE: '🇦🇪',
  SA: '🇸🇦',
  KW: '🇰🇼',
  QA: '🇶🇦',
  BH: '🇧🇭',
  OM: '🇴🇲',
}

export const LOCALE_STORAGE_KEY = 'dm_locale_pref'
export const LOCALE_PREF_COOKIE = 'dm_locale_pref'
export const LOCALE_PREF_MAX_AGE_SEC = 604800 // 7 days
export const LOCALE_SUGGEST_DISMISS_KEY = 'dm_locale_suggest_dismiss'

export function isDefaultLocale(country: LocaleCountrySlug, lang: LocaleLang): boolean {
  return country === 'ae' && lang === 'en'
}

export function isLocaleCountrySlug(value: string | null | undefined): value is LocaleCountrySlug {
  return Boolean(value && LOCALE_COUNTRY_SLUGS.includes(value as LocaleCountrySlug))
}

export function isLocaleLang(value: string | null | undefined): value is LocaleLang {
  return value === 'en' || value === 'ar'
}

export function codeToCountrySlug(code: string | null | undefined): LocaleCountrySlug {
  const upper = (code ?? '').trim().toUpperCase()
  return COUNTRY_CODE_TO_SLUG[upper] ?? 'ae'
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

export function localeDefaultsForCountry(country: LocaleCountrySlug) {
  const isUae = country === 'ae'
  return {
    editorialStatus: isUae ? ('published' as const) : ('draft' as const),
    noIndex: !isUae,
  }
}
