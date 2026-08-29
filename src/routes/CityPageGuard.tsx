import { Navigate, useParams } from 'react-router-dom'
import { isValidCitySlug, parseCityPagePath } from '../locale/cityPaths'
import { isCityProductPageSlug, MARKET_CODE } from '../market/pakistanConfig'
import { CityLocalePage } from '../pages/CityLocalePage'
import { CmsPage } from '../pages/CmsPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { SoftwarePage } from '../pages/SoftwarePage'
import { useLocation } from 'react-router-dom'

export function CityHomeOrCmsGuard() {
  const { citySlug = '' } = useParams()
  const city = citySlug.toLowerCase()
  if (isValidCitySlug(city, MARKET_CODE)) {
    return <CityLocalePage citySlug={city} pageSlug="home" />
  }
  return <CmsPage />
}

export function CitySoftwareGuard() {
  const { citySlug = '', flatSlug, kind, slug } = useParams()
  const city = citySlug.toLowerCase()
  if (!isValidCitySlug(city, MARKET_CODE)) {
    return <NotFoundPage />
  }
  if (kind && slug) {
    return <SoftwarePage forceKind={kind === 'industry' ? 'industry' : 'module'} forceSlug={slug} />
  }
  return <SoftwarePage forceKind="module" forceSlug={flatSlug} />
}

export function CityLegacyProductGuard() {
  const location = useLocation()
  const parsed = parseCityPagePath(location.pathname)
  if (parsed.redirectTo) {
    return <Navigate to={parsed.redirectTo} replace />
  }
  if (parsed.unknownCityPath) {
    return <NotFoundPage />
  }
  const { citySlug = '', pageSlug = '' } = useParams()
  const city = citySlug.toLowerCase()
  const page = pageSlug.toLowerCase()
  if (isValidCitySlug(city, MARKET_CODE) && isCityProductPageSlug(page)) {
    return <Navigate to={`/${city}/software/${page}`} replace />
  }
  return <NotFoundPage />
}

/** @deprecated Use CityHomeOrCmsGuard / CitySoftwareGuard */
export function CityPageGuard() {
  return <CityLegacyProductGuard />
}
