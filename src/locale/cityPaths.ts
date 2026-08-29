/**
 * City page path parsing — Pakistan URLs:
 *   /karachi
 *   /karachi/software/crm-software
 */
import {
  CITY_HOME_SLUG,
  CITY_PRODUCT_LABELS,
  CITY_PRODUCT_PAGE_SLUGS,
  CITY_SITE_PAGE_SLUGS,
  PK_CITY_NAMES,
  PK_CITY_SLUGS,
  buildCityAwarePath,
  buildCityHomePath,
  buildCitySoftwarePath,
  isCityProductPageSlug,
  isCitySitePageSlug,
  isPkCitySlug,
  MARKET_CODE,
  MARKET_SLUG,
  type CityProductPageSlug,
  type PkCitySlug,
} from '../market/pakistanConfig'
import type { LocaleCountrySlug, LocaleLang } from './localeConfig'

export const CITY_DISPLAY_NAMES: Record<string, { en: string }> = Object.fromEntries(
  PK_CITY_SLUGS.map((slug) => [slug, { en: PK_CITY_NAMES[slug] }]),
)

export function getCityDisplayName(citySlug: string, _lang: 'en' | 'ar' = 'en'): string {
  const names = CITY_DISPLAY_NAMES[citySlug.toLowerCase()]
  if (names) return names.en
  return citySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export const CITY_PAGE_SLUG = CITY_HOME_SLUG

export {
  CITY_HOME_SLUG,
  CITY_PRODUCT_PAGE_SLUGS,
  CITY_PRODUCT_LABELS,
  CITY_SITE_PAGE_SLUGS,
  buildCityAwarePath,
  buildCityHomePath,
  buildCitySoftwarePath,
  isCitySitePageSlug,
}

export const CITY_SLUGS_BY_COUNTRY: Record<string, string[]> = {
  PK: [...PK_CITY_SLUGS],
}

export function getCitySlugsForCountry(countryCode = MARKET_CODE): string[] {
  return CITY_SLUGS_BY_COUNTRY[countryCode.toUpperCase()] || [...PK_CITY_SLUGS]
}

export function isValidCitySlug(citySlug: string, countryCode = MARKET_CODE): boolean {
  return getCitySlugsForCountry(countryCode).includes(citySlug.toLowerCase())
}

export type ParsedCityPath = {
  country: LocaleCountrySlug
  lang: LocaleLang
  countryCode: string
  citySlug: string | null
  pageSlug: string | null
  softwarePath: string | null
  isCityPage: boolean
  isCityHome: boolean
  isCitySoftware: boolean
  isCitySitePage: boolean
  isLegacyCityProduct: boolean
  sitePath: string | null
  redirectTo?: string
  unknownCityPath?: boolean
  restPath: string
  hasLocalePrefix: boolean
}

function emptyParse(path: string): ParsedCityPath {
  return {
    country: MARKET_SLUG as LocaleCountrySlug,
    lang: 'en',
    countryCode: MARKET_CODE,
    citySlug: null,
    pageSlug: null,
    softwarePath: null,
    isCityPage: false,
    isCityHome: false,
    isCitySoftware: false,
    isCitySitePage: false,
    isLegacyCityProduct: false,
    sitePath: null,
    restPath: path,
    hasLocalePrefix: false,
  }
}

export function buildCityPagePath(
  _country: LocaleCountrySlug,
  _lang: LocaleLang,
  citySlug: string,
  pageSlug: string = CITY_HOME_SLUG,
): string {
  const city = citySlug.toLowerCase()
  const page = (pageSlug || CITY_HOME_SLUG).toLowerCase()
  if (!page || page === CITY_HOME_SLUG) return buildCityHomePath(city)
  return buildCitySoftwarePath(city, page)
}

export function parseCityPagePath(pathname: string): ParsedCityPath {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  const parts = path.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean)

  if (parts.length === 0 || !isPkCitySlug(parts[0])) {
    return emptyParse(path)
  }

  const citySlug = parts[0].toLowerCase() as PkCitySlug

  if (parts.length === 1) {
    return {
      country: MARKET_SLUG as LocaleCountrySlug,
      lang: 'en',
      countryCode: MARKET_CODE,
      citySlug,
      pageSlug: CITY_HOME_SLUG,
      softwarePath: null,
      isCityPage: true,
      isCityHome: true,
      isCitySoftware: false,
      isCitySitePage: false,
      isLegacyCityProduct: false,
      sitePath: '/',
      restPath: path,
      hasLocalePrefix: false,
    }
  }

  if (parts[1] === 'software' && parts.length >= 3 && parts.length <= 4) {
    const softwarePath = `/${parts.slice(1).join('/')}`
    return {
      country: MARKET_SLUG as LocaleCountrySlug,
      lang: 'en',
      countryCode: MARKET_CODE,
      citySlug,
      pageSlug: parts.slice(2).join('/'),
      softwarePath,
      isCityPage: true,
      isCityHome: false,
      isCitySoftware: true,
      isCitySitePage: false,
      isLegacyCityProduct: false,
      sitePath: softwarePath,
      restPath: path,
      hasLocalePrefix: false,
    }
  }

  if (parts[1] === 'industries' && parts.length <= 3) {
    const sitePath = `/${parts.slice(1).join('/')}`
    return {
      country: MARKET_SLUG as LocaleCountrySlug,
      lang: 'en',
      countryCode: MARKET_CODE,
      citySlug,
      pageSlug: parts.slice(1).join('/'),
      softwarePath: parts[2] ? `/software/industry/${parts[2]}` : null,
      isCityPage: true,
      isCityHome: false,
      isCitySoftware: false,
      isCitySitePage: true,
      isLegacyCityProduct: false,
      sitePath,
      restPath: path,
      hasLocalePrefix: false,
    }
  }

  if (parts.length === 2 && isCitySitePageSlug(parts[1])) {
    const sitePath = `/${parts[1]}`
    return {
      country: MARKET_SLUG as LocaleCountrySlug,
      lang: 'en',
      countryCode: MARKET_CODE,
      citySlug,
      pageSlug: parts[1],
      softwarePath: null,
      isCityPage: true,
      isCityHome: false,
      isCitySoftware: false,
      isCitySitePage: true,
      isLegacyCityProduct: false,
      sitePath,
      restPath: path,
      hasLocalePrefix: false,
    }
  }

  if (parts.length === 2 && isCityProductPageSlug(parts[1])) {
    return {
      country: MARKET_SLUG as LocaleCountrySlug,
      lang: 'en',
      countryCode: MARKET_CODE,
      citySlug,
      pageSlug: parts[1].toLowerCase() as CityProductPageSlug,
      softwarePath: `/software/${parts[1].toLowerCase()}`,
      isCityPage: true,
      isCityHome: false,
      isCitySoftware: false,
      isCitySitePage: false,
      isLegacyCityProduct: true,
      sitePath: `/software/${parts[1].toLowerCase()}`,
      redirectTo: buildCitySoftwarePath(citySlug, parts[1]),
      restPath: path,
      hasLocalePrefix: false,
    }
  }

  return {
    ...emptyParse(path),
    citySlug,
    unknownCityPath: true,
  }
}

export function isCityRouteSegment(segment: string): boolean {
  return isPkCitySlug(segment)
}

export function isDefaultLocale(_country?: LocaleCountrySlug, _lang?: LocaleLang): boolean {
  return true
}
