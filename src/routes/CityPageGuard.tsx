import { Navigate, useParams } from 'react-router-dom'
import { isValidCitySlug, parseCityPagePath } from '../locale/cityPaths'
import { isCityProductPageSlug, isCitySitePageSlug, MARKET_CODE } from '../market/pakistanConfig'
import { AboutPage } from '../pages/AboutPage'
import { ContactPage } from '../pages/ContactPage'
import { HomePage } from '../pages/HomePage'
import { IndustriesPage } from '../pages/IndustriesPage'
import {
  BusinessModelsLocalePage,
  ErpLocalePage,
  FaqsLocalePage,
  SolutionsLocalePage,
} from '../pages/LocaleSlugPage'
import { TestimonialsPage } from '../pages/TestimonialsPage'
import { CmsPage } from '../pages/CmsPage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { SoftwarePage } from '../pages/SoftwarePage'
import { CityLocalePage } from '../pages/CityLocalePage'
import { useLocation } from 'react-router-dom'

const INDUSTRY_SHORT_ALIASES: Record<string, string> = {
  retail: 'retail-management-software',
}

export function CityHomeOrCmsGuard() {
  const { citySlug = '' } = useParams()
  const city = citySlug.toLowerCase()
  if (isValidCitySlug(city, MARKET_CODE)) {
    return <HomePage />
  }
  return <CmsPage />
}

export function CitySitePageGuard() {
  const { citySlug = '', pageSlug = '' } = useParams()
  const location = useLocation()
  const city = citySlug.toLowerCase()
  const parsed = parseCityPagePath(location.pathname)
  const page = (pageSlug || parsed.pageSlug || '').toLowerCase()
  if (!isValidCitySlug(city, MARKET_CODE)) return <NotFoundPage />
  if (page === 'contact') return <ContactPage />
  if (page === 'faqs') return <FaqsLocalePage />
  if (page === 'industries') return <IndustriesPage />
  if (page === 'about') return <AboutPage />
  if (page === 'testimonials') return <TestimonialsPage />
  if (page === 'erp') return <ErpLocalePage />
  if (page === 'solutions') return <SolutionsLocalePage />
  if (page === 'business-models') return <BusinessModelsLocalePage />
  return <NotFoundPage />
}

export function CityIndustryGuard() {
  const { citySlug = '', industrySlug = '' } = useParams()
  const city = citySlug.toLowerCase()
  if (!isValidCitySlug(city, MARKET_CODE)) return <NotFoundPage />
  const slug = INDUSTRY_SHORT_ALIASES[industrySlug.toLowerCase()] || industrySlug
  return <SoftwarePage forceKind="industry" forceSlug={slug} />
}

export function CitySoftwareGuard() {
  const { citySlug = '', flatSlug, kind, slug } = useParams()
  const city = citySlug.toLowerCase()
  if (!isValidCitySlug(city, MARKET_CODE)) {
    return <NotFoundPage />
  }
  const productSlug = flatSlug || slug || ''
  if (productSlug && isCityProductPageSlug(productSlug)) {
    return <CityLocalePage citySlug={city} pageSlug={productSlug} />
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
  if (isValidCitySlug(city, MARKET_CODE) && isCitySitePageSlug(page)) {
    return <CitySitePageGuard />
  }
  return <NotFoundPage />
}

/** @deprecated Use CityHomeOrCmsGuard / CitySoftwareGuard */
export function CityPageGuard() {
  return <CityLegacyProductGuard />
}
