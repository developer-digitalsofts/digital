/** Pakistan market config — client mirror of server/pakistanConfig.mjs */

export const MARKET_CODE = 'PK' as const
export const MARKET_SLUG = 'pk' as const
export const MARKET_CURRENCY = 'PKR' as const
export const MARKET_PHONE_CODE = '+92' as const

export const PUBLIC_SITE_ORIGIN =
  (typeof import.meta !== 'undefined' && (import.meta as { env?: { VITE_PUBLIC_SITE_URL?: string } }).env?.VITE_PUBLIC_SITE_URL) ||
  'https://digitalmanager.com.pk'

export const PK_CONTACT_PLACEHOLDERS = {
  primaryEmail: 'info@digitalmanager.com.pk',
  salesEmail: 'info@digitalmanager.com.pk',
  supportEmail: 'info@digitalmanager.com.pk',
  phoneDisplay: '+92 300 000 0000',
  phoneHref: 'tel:+923000000000',
  whatsappNumber: '923000000000',
  officeAddress: 'Serving businesses across Pakistan',
  workingHours: 'Mon - Sat : 10.00 am - 6.00 pm',
  defaultCountry: 'Pakistan',
  defaultCurrency: 'PKR',
  defaultPhoneCode: '+92',
} as const

export const PK_SITE_COPY = {
  trustLine: 'Trusted by growing businesses across Pakistan.',
  trustTitle: 'Trusted By Businesses Across Pakistan',
  heroBadge: 'Pakistan Ready',
  marketsBadge: 'Serving businesses across Pakistan',
  vatLabel: 'Pakistan sales tax',
  defaultSeoTitle: 'DigitalManager — Cloud ERP for Pakistan',
  defaultMetaDescription:
    'Cloud ERP software for retail, manufacturing, logistics and services across Pakistan.',
} as const

export const CITY_PREF_COOKIE = 'dm_pk_city_pref'
export const CITY_PREF_STORAGE_KEY = 'dm_pk_city_view'
export const CITY_PREF_MAX_AGE_SEC = 15552000

export const CITY_HOME_SLUG = 'home' as const

export const CITY_PRODUCT_PAGE_SLUGS = ['erp-software', 'pos-software', 'accounting-software'] as const
export type CityProductPageSlug = (typeof CITY_PRODUCT_PAGE_SLUGS)[number]

export const CITY_PRODUCT_LABELS: Record<CityProductPageSlug, string> = {
  'erp-software': 'ERP Software',
  'pos-software': 'POS Software',
  'accounting-software': 'Accounting Software',
}

export const PK_CITY_SLUGS = [
  'karachi',
  'lahore',
  'islamabad',
  'rawalpindi',
  'faisalabad',
  'multan',
  'peshawar',
  'quetta',
  'hyderabad',
  'sialkot',
  'gujranwala',
] as const

export type PkCitySlug = (typeof PK_CITY_SLUGS)[number]

export const PK_CITY_NAMES: Record<PkCitySlug, string> = {
  karachi: 'Karachi',
  lahore: 'Lahore',
  islamabad: 'Islamabad',
  rawalpindi: 'Rawalpindi',
  faisalabad: 'Faisalabad',
  multan: 'Multan',
  peshawar: 'Peshawar',
  quetta: 'Quetta',
  hyderabad: 'Hyderabad',
  sialkot: 'Sialkot',
  gujranwala: 'Gujranwala',
}

export function servingBusinessesIn(cityName: string): string {
  return `Serving businesses in ${cityName}`
}

export function isCityProductPageSlug(value: string | null | undefined): value is CityProductPageSlug {
  return Boolean(value && (CITY_PRODUCT_PAGE_SLUGS as readonly string[]).includes(value))
}

export function isPkCitySlug(value: string | null | undefined): value is PkCitySlug {
  return Boolean(value && (PK_CITY_SLUGS as readonly string[]).includes(value.toLowerCase()))
}

export function buildCityHomePath(citySlug: string): string {
  return `/${String(citySlug).toLowerCase()}`
}

export function buildCitySoftwarePath(citySlug: string, softwarePath: string): string {
  const rest = softwarePath.startsWith('/') ? softwarePath : `/${softwarePath}`
  if (rest === '/' || rest === '') return buildCityHomePath(citySlug)
  if (rest.startsWith('/software/')) return `/${String(citySlug).toLowerCase()}${rest}`
  return `/${String(citySlug).toLowerCase()}/software${rest.startsWith('/') ? rest : `/${rest}`}`
}

/** Site pages that keep the selected city in the URL. */
export const CITY_SITE_PAGE_SLUGS = [
  'contact',
  'faqs',
  'industries',
  'about',
  'testimonials',
  'erp',
  'solutions',
  'business-models',
] as const

export type CitySitePageSlug = (typeof CITY_SITE_PAGE_SLUGS)[number]

export const CITY_AWARE_FIRST_SEGMENTS = ['software', ...CITY_SITE_PAGE_SLUGS] as const

export function isCitySitePageSlug(value: string | null | undefined): value is CitySitePageSlug {
  return Boolean(value && (CITY_SITE_PAGE_SLUGS as readonly string[]).includes(value))
}

function splitPathAffixes(internalPath: string): { path: string; suffix: string } {
  const raw = internalPath || '/'
  const hashIndex = raw.indexOf('#')
  const queryIndex = raw.indexOf('?')
  const cut = [hashIndex, queryIndex].filter((i) => i >= 0).sort((a, b) => a - b)[0]
  if (cut == null) return { path: raw, suffix: '' }
  return { path: raw.slice(0, cut), suffix: raw.slice(cut) }
}

export function isCityAwareInternalPath(internalPath: string): boolean {
  const { path } = splitPathAffixes(internalPath)
  const rest = path.startsWith('/') ? path : `/${path}`
  if (rest === '/' || rest === '') return true
  const first = rest.replace(/^\//, '').split('/')[0]
  return (CITY_AWARE_FIRST_SEGMENTS as readonly string[]).includes(first)
}

export function buildCityAwarePath(citySlug: string, internalPath: string): string {
  const { path, suffix } = splitPathAffixes(internalPath || '/')
  const rest = path.startsWith('/') ? path : `/${path}`
  const city = String(citySlug).toLowerCase()
  if (!city) return `${rest === '' ? '/' : rest}${suffix}`
  if (rest === '/' || rest === '') return `/${city}${suffix}`
  if (rest === `/${city}` || rest.startsWith(`/${city}/`)) return `${rest}${suffix}`
  if (!isCityAwareInternalPath(rest)) return `${rest}${suffix}`
  return `/${city}${rest}${suffix}`
}

export function stripCityAwarePrefix(pathname: string): string {
  const { path, suffix } = splitPathAffixes(pathname || '/')
  const parts = path.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean)
  if (parts.length === 0) return `/${suffix}` === '/' ? '/' : `/${suffix}`.replace(/^\/+/, '/') || '/'
  if (isPkCitySlug(parts[0])) {
    const rest = parts.slice(1)
    return `${rest.length ? `/${rest.join('/')}` : '/'}${suffix}`
  }
  return `${path.startsWith('/') ? path : `/${path}`}${suffix}`
}
