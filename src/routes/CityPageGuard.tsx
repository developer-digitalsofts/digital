import { Navigate, useParams } from 'react-router-dom'
import { useLocale } from '../locale/LocaleContext'
import { CITY_PAGE_SLUG, isValidCitySlug } from '../locale/cityPaths'
import { CityLocalePage } from '../pages/CityLocalePage'

/** Validates city segment and renders city page, or redirects unknown paths. */
export function CityPageGuard() {
  const { citySlug = '', pageSlug = CITY_PAGE_SLUG } = useParams()
  const { countryCode } = useLocale()
  const city = citySlug.toLowerCase()
  const page = (pageSlug || CITY_PAGE_SLUG).toLowerCase()

  if (!isValidCitySlug(city, countryCode) || page !== CITY_PAGE_SLUG) {
    return <Navigate to="/" replace />
  }

  return <CityLocalePage citySlug={city} pageSlug={page} />
}

/** Redirect /ae/en/:city/:page → /:city/:page for UAE English city canonical URLs. */
export function AeEnCityRedirect() {
  const { citySlug = '', pageSlug = '' } = useParams()
  const city = citySlug.toLowerCase()
  const page = (pageSlug || CITY_PAGE_SLUG).toLowerCase()

  if (isValidCitySlug(city, 'AE') && page === CITY_PAGE_SLUG) {
    return <Navigate to={`/${city}/${page}`} replace />
  }
  return <Navigate to="/ae/en" replace />
}
