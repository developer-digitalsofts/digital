/**
 * Locale path builders — server mirror of src/locale/localePaths.ts
 */
export const LOCALE_COUNTRY_SLUGS = ['ae', 'sa', 'kw', 'qa', 'om', 'bh']
export const LOCALE_LANGS = ['en', 'ar']

export const COUNTRY_SLUG_TO_CODE = {
  ae: 'AE',
  sa: 'SA',
  kw: 'KW',
  qa: 'QA',
  om: 'OM',
  bh: 'BH',
}

export const COUNTRY_CODE_TO_SLUG = {
  AE: 'ae',
  SA: 'sa',
  KW: 'kw',
  QA: 'qa',
  OM: 'om',
  BH: 'bh',
}

export const ROOT_TO_LOCALE_ALIASES = { blog: 'insights' }

const LOCALE_PREFIX_RE = /^\/(ae|sa|kw|qa|om|bh)\/(en|ar)(?=\/|$)/i

export function isDefaultLocale(country, lang) {
  return country === 'ae' && lang === 'en'
}

export function parseLocalePath(pathname) {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  const match = path.match(LOCALE_PREFIX_RE)
  if (match) {
    const country = match[1].toLowerCase()
    const lang = match[2].toLowerCase()
    const rest = path.slice(match[0].length) || '/'
    return {
      country,
      lang,
      restPath: rest.startsWith('/') ? rest : `/${rest}`,
      hasLocalePrefix: true,
    }
  }
  return {
    country: 'ae',
    lang: 'en',
    restPath: path,
    hasLocalePrefix: false,
  }
}

export function buildLocalePath(country, lang, restPath = '/') {
  const normalizedRest = restPath.startsWith('/') ? restPath : `/${restPath}`
  if (isDefaultLocale(country, lang)) {
    return normalizedRest === '/' ? '/' : normalizedRest
  }
  const prefix = `/${country}/${lang}`
  if (normalizedRest === '/') return prefix
  return `${prefix}${normalizedRest}`
}

export function buildLocalizedHref(country, lang, internalPath) {
  const clean = internalPath.startsWith('/') ? internalPath : `/${internalPath}`
  if (clean === '/') return buildLocalePath(country, lang, '/')
  const parts = clean.split('/').filter(Boolean)
  if (parts[0] && ROOT_TO_LOCALE_ALIASES[parts[0]]) {
    parts[0] = ROOT_TO_LOCALE_ALIASES[parts[0]]
  }
  return buildLocalePath(country, lang, `/${parts.join('/')}`)
}

export function hreflangTag(countrySlug, lang) {
  return `${lang}-${countrySlug.toUpperCase()}`
}

export function ogLocaleTag(countrySlug, lang) {
  return `${lang}_${countrySlug.toUpperCase()}`
}

export function normalizePublicPath(pathname) {
  const parsed = parseLocalePath(pathname)
  let rest = parsed.restPath.replace(/\/+$/, '') || '/'
  if (rest !== '/' && rest.endsWith('/')) rest = rest.slice(0, -1)
  return buildLocalePath(parsed.country, parsed.lang, rest)
}
