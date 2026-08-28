import {
  DEFAULT_LOCALE,
  isDefaultLocale,
  isLocaleCountrySlug,
  isLocaleLang,
  type LocaleCountrySlug,
  type LocaleLang,
} from './localeConfig'

export type ParsedLocalePath = {
  country: LocaleCountrySlug
  lang: LocaleLang
  restPath: string
  hasLocalePrefix: boolean
}

/** Pakistan: no /country/lang URL prefix — all paths are root-relative. */
export function parseLocalePath(pathname: string): ParsedLocalePath {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  return {
    country: DEFAULT_LOCALE.country,
    lang: DEFAULT_LOCALE.lang,
    restPath: path,
    hasLocalePrefix: false,
  }
}

export function buildLocalePath(_country: LocaleCountrySlug, _lang: LocaleLang, restPath = '/'): string {
  const normalizedRest = restPath.startsWith('/') ? restPath : `/${restPath}`
  return normalizedRest === '/' ? '/' : normalizedRest
}

export function buildLocalizedHref(_country: LocaleCountrySlug, _lang: LocaleLang, internalPath: string): string {
  const clean = internalPath.startsWith('/') ? internalPath : `/${internalPath}`
  // Strip accidental legacy GCC prefixes if pasted
  const stripped = clean.replace(/^\/(ae|sa|kw|qa|om|bh|pk)\/(en|ar)(?=\/|$)/i, '') || '/'
  return stripped.startsWith('/') ? stripped : `/${stripped}`
}

export function localePathFromQueryCountry(_countryCode: string, _lang: LocaleLang, currentPath: string): string {
  return currentPath.startsWith('/') ? currentPath : `/${currentPath}`
}

export function fromLocalePublicSegment(publicSegment: string): string {
  return publicSegment
}

export function countryCodeFromLocale(country: LocaleCountrySlug): string {
  return country === 'pk' ? 'PK' : 'PK'
}

export function validateLocaleParams(country: string, lang: string): { country: LocaleCountrySlug; lang: LocaleLang } | null {
  if (!isLocaleCountrySlug(country) || !isLocaleLang(lang)) return null
  return { country, lang }
}

export { isDefaultLocale }
