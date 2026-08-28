import { Navigate, useParams } from 'react-router-dom'
import { CITY_PAGE_SLUG, isValidCitySlug } from '../locale/cityPaths'
import { isCityProductPageSlug } from '../market/pakistanConfig'
import { CityLocalePage } from '../pages/CityLocalePage'
import { MARKET_CODE } from '../market/pakistanConfig'

/** Validates Pakistan city + product page segment. */
export function CityPageGuard() {
  const { citySlug = '', pageSlug = CITY_PAGE_SLUG } = useParams()
  const city = citySlug.toLowerCase()
  const page = (pageSlug || CITY_PAGE_SLUG).toLowerCase()

  if (!isValidCitySlug(city, MARKET_CODE) || !isCityProductPageSlug(page)) {
    return <Navigate to="/" replace />
  }

  return <CityLocalePage citySlug={city} pageSlug={page} />
}
