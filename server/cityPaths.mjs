/**
 * City page path parsing — Pakistan URLs:
 *   /karachi
 *   /karachi/software/crm-software
 *   /lahore/software/erp-software
 */
import {
  CITY_HOME_SLUG,
  CITY_PAGE_SLUG,
  getCity,
  isKnownCityProductSlug,
  isValidCityForCountry,
} from './cityRegistry.mjs'
import {
  MARKET_CODE,
  MARKET_SLUG,
  buildCityAwarePath,
  buildCityHomePath,
  buildCitySoftwarePath,
  isCitySitePageSlug,
} from './pakistanConfig.mjs'

export { CITY_PAGE_SLUG, CITY_HOME_SLUG }

export function buildCityPagePath(_countrySlug, _lang, citySlug, pageSlug = CITY_HOME_SLUG) {
  const city = String(citySlug).toLowerCase()
  const page = String(pageSlug || CITY_HOME_SLUG).toLowerCase()
  if (!page || page === CITY_HOME_SLUG) return buildCityHomePath(city)
  if (page.startsWith('software/')) return `/${city}/${page}`
  return buildCitySoftwarePath(city, page)
}

function emptyParse(path) {
  return {
    country: MARKET_SLUG,
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

export function parseCityPagePath(pathname) {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  const parts = path.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean)

  if (parts.length === 0 || !isValidCityForCountry(parts[0], MARKET_CODE)) {
    return emptyParse(path)
  }

  const citySlug = parts[0].toLowerCase()

  if (parts.length === 1) {
    return {
      country: MARKET_SLUG,
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
      internalPath: buildCityHomePath(citySlug),
    }
  }

  if (parts[1] === 'software' && parts.length >= 3 && parts.length <= 4) {
    const softwarePath = `/${parts.slice(1).join('/')}`
    return {
      country: MARKET_SLUG,
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
      internalPath: `/${citySlug}${softwarePath}`,
    }
  }

  if (parts[1] === 'industries' && parts.length <= 3) {
    const sitePath = `/${parts.slice(1).join('/')}`
    return {
      country: MARKET_SLUG,
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
      internalPath: `/${citySlug}${sitePath}`,
    }
  }

  if (parts.length === 2 && isCitySitePageSlug(parts[1])) {
    const sitePath = `/${parts[1]}`
    return {
      country: MARKET_SLUG,
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
      internalPath: `/${citySlug}${sitePath}`,
    }
  }

  if (parts.length === 2 && isKnownCityProductSlug(parts[1]) && parts[1] !== CITY_HOME_SLUG) {
    return {
      country: MARKET_SLUG,
      lang: 'en',
      countryCode: MARKET_CODE,
      citySlug,
      pageSlug: parts[1].toLowerCase(),
      softwarePath: `/software/${parts[1].toLowerCase()}`,
      isCityPage: true,
      isCityHome: false,
      isCitySoftware: false,
      isCitySitePage: false,
      isLegacyCityProduct: true,
      sitePath: `/software/${parts[1].toLowerCase()}`,
      restPath: path,
      hasLocalePrefix: false,
      redirectTo: buildCitySoftwarePath(citySlug, parts[1]),
      internalPath: buildCitySoftwarePath(citySlug, parts[1]),
    }
  }

  return {
    ...emptyParse(path),
    citySlug,
    unknownCityPath: true,
  }
}

export function isKnownCityPageSlug(pageSlug) {
  return isKnownCityProductSlug(pageSlug)
}

export function cityBreadcrumbPaths(_countrySlug, _lang, citySlug, pageSlug = CITY_HOME_SLUG) {
  const city = getCity(citySlug)
  const cityPath = buildCityHomePath(citySlug)
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: city?.name?.en || citySlug, path: cityPath },
  ]
  if (pageSlug && pageSlug !== CITY_HOME_SLUG) {
    crumbs.push({ name: pageSlug, path: buildCityPagePath(MARKET_SLUG, 'en', citySlug, pageSlug) })
  }
  return crumbs
}

export function absoluteCityUrl(base, _countrySlug, _lang, citySlug, pageSlug = CITY_HOME_SLUG) {
  const path = buildCityPagePath(MARKET_SLUG, 'en', citySlug, pageSlug)
  return `${base.replace(/\/$/, '')}${path}`
}
