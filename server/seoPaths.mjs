/**
 * Locale path builders — Pakistan single-market (no /country/lang prefix).
 */
export const LOCALE_COUNTRY_SLUGS = ['pk']
export const LOCALE_LANGS = ['en']

export const COUNTRY_SLUG_TO_CODE = {
  pk: 'PK',
}

export const COUNTRY_CODE_TO_SLUG = {
  PK: 'pk',
}

export const ROOT_TO_LOCALE_ALIASES = { blog: 'insights' }

export function isDefaultLocale(country, lang) {
  return (country === 'pk' || !country) && (lang === 'en' || !lang)
}

export function parseLocalePath(pathname) {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  return {
    country: 'pk',
    lang: 'en',
    restPath: path,
    hasLocalePrefix: false,
  }
}

export function buildLocalePath(_country, _lang, restPath = '/') {
  const normalizedRest = restPath.startsWith('/') ? restPath : `/${restPath}`
  return normalizedRest === '/' ? '/' : normalizedRest
}

export function buildLocalizedHref(_country, _lang, internalPath) {
  const clean = internalPath.startsWith('/') ? internalPath : `/${internalPath}`
  return clean
}

export function toPublicSegment(segment) {
  return ROOT_TO_LOCALE_ALIASES[segment] || segment
}

export function hreflangTag(countrySlug = 'pk', lang = 'en') {
  return `${lang}-${String(countrySlug).toUpperCase()}`
}

export function ogLocaleTag(countrySlug = 'pk', lang = 'en') {
  return `${lang}_${String(countrySlug).toUpperCase()}`
}

export function normalizePublicPath(pathname) {
  const parsed = parseLocalePath(pathname)
  let rest = parsed.restPath.replace(/\/+$/, '') || '/'
  if (rest !== '/' && rest.endsWith('/')) rest = rest.slice(0, -1)
  return buildLocalePath(parsed.country, parsed.lang, rest)
}
