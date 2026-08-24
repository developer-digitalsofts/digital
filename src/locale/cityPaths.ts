/**
 * City page path parsing and building — client-side.
 */
import {
  COUNTRY_SLUG_TO_CODE,
  DEFAULT_LOCALE,
  countrySlugToCode,
  isDefaultLocale,
  type LocaleCountrySlug,
  type LocaleLang,
} from './localeConfig'
import { buildLocalePath, parseLocalePath } from './localePaths'

export const CITY_PAGE_SLUG = 'erp-software'

/** Known city slugs per country (must match server/cityRegistry.mjs). */
export const CITY_SLUGS_BY_COUNTRY: Record<string, string[]> = {
  AE: ['dubai', 'abu-dhabi', 'sharjah', 'ajman'],
  SA: ['riyadh', 'jeddah', 'dammam'],
  QA: ['doha'],
  OM: ['muscat'],
  KW: ['kuwait-city'],
  BH: ['manama'],
}

export function getCitySlugsForCountry(countryCode: string): string[] {
  return CITY_SLUGS_BY_COUNTRY[countryCode.toUpperCase()] || []
}

export function isValidCitySlug(citySlug: string, countryCode: string): boolean {
  return getCitySlugsForCountry(countryCode).includes(citySlug.toLowerCase())
}

export type ParsedCityPath = {
  country: LocaleCountrySlug
  lang: LocaleLang
  countryCode: string
  citySlug: string | null
  pageSlug: string | null
  isCityPage: boolean
  restPath: string
  hasLocalePrefix: boolean
}

export function buildCityPagePath(
  country: LocaleCountrySlug,
  lang: LocaleLang,
  citySlug: string,
  pageSlug = CITY_PAGE_SLUG,
): string {
  return buildLocalePath(country, lang, `/${citySlug}/${pageSlug}`)
}

export function parseCityPagePath(pathname: string): ParsedCityPath {
  const parsed = parseLocalePath(pathname)
  const countryCode = COUNTRY_SLUG_TO_CODE[parsed.country] || 'AE'
  const parts = parsed.restPath.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean)

  if (parts.length < 2) {
    return { ...parsed, countryCode, citySlug: null, pageSlug: null, isCityPage: false }
  }

  const [citySlug, pageSlug, ...rest] = parts
  if (rest.length > 0 || !isValidCitySlug(citySlug, countryCode)) {
    return { ...parsed, countryCode, citySlug: null, pageSlug: null, isCityPage: false }
  }

  return {
    ...parsed,
    countryCode,
    citySlug: citySlug.toLowerCase(),
    pageSlug,
    isCityPage: true,
  }
}

export function isCityRouteSegment(segment: string, countryCode = countrySlugToCode(DEFAULT_LOCALE.country)): boolean {
  return getCitySlugsForCountry(countryCode).includes(segment.toLowerCase())
}

export { isDefaultLocale }
