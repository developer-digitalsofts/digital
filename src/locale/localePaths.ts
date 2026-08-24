import {
  COUNTRY_CODE_TO_SLUG,
  COUNTRY_SLUG_TO_CODE,
  DEFAULT_LOCALE,
  LOCALE_ROUTE_ALIASES,
  ROOT_TO_LOCALE_ALIASES,
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

const LOCALE_PREFIX_RE = /^\/(ae|sa|kw|qa|om|bh)\/(en|ar)(?=\/|$)/i

export function parseLocalePath(pathname: string): ParsedLocalePath {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  const match = path.match(LOCALE_PREFIX_RE)
  if (match) {
    const country = match[1].toLowerCase() as LocaleCountrySlug
    const lang = match[2].toLowerCase() as LocaleLang
    const rest = path.slice(match[0].length) || '/'
    return {
      country,
      lang,
      restPath: rest.startsWith('/') ? rest : `/${rest}`,
      hasLocalePrefix: true,
    }
  }
  return {
    country: DEFAULT_LOCALE.country,
    lang: DEFAULT_LOCALE.lang,
    restPath: path,
    hasLocalePrefix: false,
  }
}

export function buildLocalePath(country: LocaleCountrySlug, lang: LocaleLang, restPath = '/'): string {
  const normalizedRest = restPath.startsWith('/') ? restPath : `/${restPath}`
  if (isDefaultLocale(country, lang)) {
    return normalizedRest === '/' ? '/' : normalizedRest
  }
  const prefix = `/${country}/${lang}`
  if (normalizedRest === '/') return prefix
  return `${prefix}${normalizedRest}`
}

export function buildLocalizedHref(country: LocaleCountrySlug, lang: LocaleLang, internalPath: string): string {
  const clean = internalPath.startsWith('/') ? internalPath : `/${internalPath}`
  if (clean === '/') return buildLocalePath(country, lang, '/')
  const parts = clean.split('/').filter(Boolean)
  // UAE English keeps /blog; other locales use /insights
  if (!isDefaultLocale(country, lang) && parts[0] && ROOT_TO_LOCALE_ALIASES[parts[0]]) {
    parts[0] = ROOT_TO_LOCALE_ALIASES[parts[0]]
  }
  return buildLocalePath(country, lang, `/${parts.join('/')}`)
}

export function localePathFromQueryCountry(countryCode: string, lang: LocaleLang, currentPath: string): string {
  const slug = COUNTRY_CODE_TO_SLUG[countryCode.toUpperCase()] ?? 'ae'
  const parsed = parseLocalePath(currentPath)
  return buildLocalePath(slug, lang, parsed.restPath)
}

export function fromLocalePublicSegment(publicSegment: string): string {
  return LOCALE_ROUTE_ALIASES[publicSegment] ?? publicSegment
}

export function countryCodeFromLocale(country: LocaleCountrySlug): string {
  return COUNTRY_SLUG_TO_CODE[country]
}

export function validateLocaleParams(country: string, lang: string): { country: LocaleCountrySlug; lang: LocaleLang } | null {
  if (!isLocaleCountrySlug(country) || !isLocaleLang(lang)) return null
  return { country, lang }
}
