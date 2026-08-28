/**
 * City page path parsing — Pakistan flat URLs: /karachi/erp-software
 */
import {
  CITY_PRODUCT_LABELS,
  CITY_PRODUCT_PAGE_SLUGS,
  isCityProductPageSlug,
  isPkCitySlug,
  MARKET_CODE,
  MARKET_SLUG,
  PK_CITY_SLUGS,
  type CityProductPageSlug,
} from '../market/pakistanConfig'
import type { LocaleCountrySlug, LocaleLang } from './localeConfig'

export const CITY_DISPLAY_NAMES: Record<string, { en: string }> = {
  karachi: { en: 'Karachi' },
  lahore: { en: 'Lahore' },
  islamabad: { en: 'Islamabad' },
  rawalpindi: { en: 'Rawalpindi' },
  faisalabad: { en: 'Faisalabad' },
  multan: { en: 'Multan' },
  peshawar: { en: 'Peshawar' },
  quetta: { en: 'Quetta' },
}

export function getCityDisplayName(citySlug: string, _lang: 'en' | 'ar' = 'en'): string {
  const names = CITY_DISPLAY_NAMES[citySlug.toLowerCase()]
  if (names) return names.en
  return citySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export const CITY_PAGE_SLUG = 'erp-software'

export { CITY_PRODUCT_PAGE_SLUGS, CITY_PRODUCT_LABELS }

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
  isCityPage: boolean
  restPath: string
  hasLocalePrefix: boolean
}

export function buildCityPagePath(
  _country: LocaleCountrySlug,
  _lang: LocaleLang,
  citySlug: string,
  pageSlug: string = CITY_PAGE_SLUG,
): string {
  return `/${citySlug.toLowerCase()}/${pageSlug.toLowerCase()}`
}

export function parseCityPagePath(pathname: string): ParsedCityPath {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  const parts = path.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean)

  if (parts.length !== 2 || !isPkCitySlug(parts[0]) || !isCityProductPageSlug(parts[1])) {
    return {
      country: MARKET_SLUG as LocaleCountrySlug,
      lang: 'en',
      countryCode: MARKET_CODE,
      citySlug: null,
      pageSlug: null,
      isCityPage: false,
      restPath: path,
      hasLocalePrefix: false,
    }
  }

  return {
    country: MARKET_SLUG as LocaleCountrySlug,
    lang: 'en',
    countryCode: MARKET_CODE,
    citySlug: parts[0].toLowerCase(),
    pageSlug: parts[1].toLowerCase() as CityProductPageSlug,
    isCityPage: true,
    restPath: path,
    hasLocalePrefix: false,
  }
}

export function isCityRouteSegment(segment: string): boolean {
  return isPkCitySlug(segment)
}

export function isDefaultLocale(_country?: LocaleCountrySlug, _lang?: LocaleLang): boolean {
  return true
}
