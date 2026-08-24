/**
 * City page path parsing and building — server mirror of src/locale/cityPaths.ts
 */
import { isDefaultLocale, buildLocalePath, parseLocalePath } from './seoPaths.mjs'
import {
  CITY_PAGE_SLUG,
  getCity,
  isValidCityForCountry,
} from './cityRegistry.mjs'
import { COUNTRY_SLUG_TO_CODE } from './seoPaths.mjs'

export { CITY_PAGE_SLUG }

export function buildCityPagePath(countrySlug, lang, citySlug, pageSlug = CITY_PAGE_SLUG) {
  const rest = `/${citySlug}/${pageSlug}`
  return buildLocalePath(countrySlug, lang, rest)
}

export function parseCityPagePath(pathname) {
  const parsed = parseLocalePath(pathname)
  const countryCode = COUNTRY_SLUG_TO_CODE[parsed.country] || 'AE'
  const parts = parsed.restPath.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean)

  if (parts.length < 2) {
    return { ...parsed, countryCode, citySlug: null, pageSlug: null, isCityPage: false }
  }

  const [citySlug, pageSlug, ...rest] = parts
  if (rest.length > 0) {
    return { ...parsed, countryCode, citySlug: null, pageSlug: null, isCityPage: false }
  }

  if (!isValidCityForCountry(citySlug, countryCode)) {
    return { ...parsed, countryCode, citySlug: null, pageSlug: null, isCityPage: false }
  }

  return {
    ...parsed,
    countryCode,
    citySlug,
    pageSlug,
    isCityPage: true,
    internalPath: `/${citySlug}/${pageSlug}`,
  }
}

export function isKnownCityPageSlug(pageSlug) {
  return pageSlug === CITY_PAGE_SLUG
}

export function cityBreadcrumbPaths(countrySlug, lang, citySlug, pageSlug = CITY_PAGE_SLUG) {
  const city = getCity(citySlug)
  const homePath = buildLocalePath(countrySlug, lang, '/')
  const countryPath = isDefaultLocale(countrySlug, lang) ? '/' : buildLocalePath(countrySlug, lang, '/')
  const cityPath = buildCityPagePath(countrySlug, lang, citySlug, pageSlug)
  return [
    { name: 'Home', path: homePath },
    { name: city?.name?.en || citySlug, path: cityPath },
  ]
}

export function absoluteCityUrl(base, countrySlug, lang, citySlug, pageSlug = CITY_PAGE_SLUG) {
  const path = buildCityPagePath(countrySlug, lang, citySlug, pageSlug)
  return `${base.replace(/\/$/, '')}${path}`
}
