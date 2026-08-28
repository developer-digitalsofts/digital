/**
 * City page path parsing — Pakistan flat URLs: /karachi/erp-software
 */
import {
  CITY_PAGE_SLUG,
  getCity,
  isKnownCityProductSlug,
  isValidCityForCountry,
} from './cityRegistry.mjs'
import { MARKET_CODE, MARKET_SLUG } from './pakistanConfig.mjs'

export { CITY_PAGE_SLUG }

export function buildCityPagePath(_countrySlug, _lang, citySlug, pageSlug = CITY_PAGE_SLUG) {
  return `/${String(citySlug).toLowerCase()}/${String(pageSlug).toLowerCase()}`
}

export function parseCityPagePath(pathname) {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  const parts = path.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean)

  if (parts.length !== 2) {
    return {
      country: MARKET_SLUG,
      lang: 'en',
      countryCode: MARKET_CODE,
      citySlug: null,
      pageSlug: null,
      isCityPage: false,
      restPath: path,
      hasLocalePrefix: false,
    }
  }

  const [citySlug, pageSlug] = parts
  if (!isValidCityForCountry(citySlug, MARKET_CODE) || !isKnownCityProductSlug(pageSlug)) {
    return {
      country: MARKET_SLUG,
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
    country: MARKET_SLUG,
    lang: 'en',
    countryCode: MARKET_CODE,
    citySlug: citySlug.toLowerCase(),
    pageSlug: pageSlug.toLowerCase(),
    isCityPage: true,
    restPath: path,
    hasLocalePrefix: false,
    internalPath: `/${citySlug.toLowerCase()}/${pageSlug.toLowerCase()}`,
  }
}

export function isKnownCityPageSlug(pageSlug) {
  return isKnownCityProductSlug(pageSlug)
}

export function cityBreadcrumbPaths(_countrySlug, _lang, citySlug, pageSlug = CITY_PAGE_SLUG) {
  const city = getCity(citySlug)
  const cityPath = buildCityPagePath(MARKET_SLUG, 'en', citySlug, pageSlug)
  return [
    { name: 'Home', path: '/' },
    { name: city?.name?.en || citySlug, path: cityPath },
  ]
}

export function absoluteCityUrl(base, _countrySlug, _lang, citySlug, pageSlug = CITY_PAGE_SLUG) {
  const path = buildCityPagePath(MARKET_SLUG, 'en', citySlug, pageSlug)
  return `${base.replace(/\/$/, '')}${path}`
}
