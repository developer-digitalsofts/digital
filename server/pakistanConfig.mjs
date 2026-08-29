/**
 * Pakistan market config — used by pakistan-version branch only.
 * Final domain: digitalmanager.com.pk (temp: pk-test.digitalmanager.ae)
 */
export const MARKET_CODE = 'PK'
export const MARKET_SLUG = 'pk'
export const MARKET_NAME = { en: 'Pakistan', ur: 'پاکستان' }
export const MARKET_CURRENCY = 'PKR'
export const MARKET_PHONE_CODE = '+92'

export const PUBLIC_SITE_URL_DEFAULT = 'https://digitalmanager.com.pk'
export const PUBLIC_SITE_URL_TEMP = 'https://pk-test.digitalmanager.ae'

export const PK_CONTACT_PLACEHOLDERS = {
  primaryEmail: 'info@digitalmanager.com.pk',
  salesEmail: 'info@digitalmanager.com.pk',
  supportEmail: 'info@digitalmanager.com.pk',
  phoneDisplay: '+92 300 000 0000',
  phoneHref: 'tel:+923000000000',
  whatsappNumber: '923000000000',
  officeAddress: {
    en: 'Serving businesses across Pakistan',
  },
  workingHours: {
    en: 'Mon - Sat : 10.00 am - 6.00 pm',
  },
}

export const PK_SITE_COPY = {
  trustLine: 'Trusted by growing businesses across Pakistan.',
  trustTitle: 'Trusted By Businesses Across Pakistan',
  heroBadge: 'Pakistan Ready',
  marketsBadge: 'Serving businesses across Pakistan',
  vatLabel: 'Pakistan sales tax',
  defaultSeoTitle: 'DigitalManager — Cloud ERP for Pakistan',
  defaultMetaDescription:
    'Cloud ERP software for retail, manufacturing, logistics and services across Pakistan.',
}

export const CITY_HOME_SLUG = 'home'

export const CITY_PRODUCT_PAGE_SLUGS = ['erp-software', 'pos-software', 'accounting-software']

export const CITY_PRODUCT_LABELS = {
  'erp-software': { en: 'ERP Software' },
  'pos-software': { en: 'POS Software' },
  'accounting-software': { en: 'Accounting Software' },
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
]

export const PK_CITY_NAMES = {
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

export function servingBusinessesIn(cityName) {
  return `Serving businesses in ${cityName}`
}

export function isPkCitySlug(value) {
  return Boolean(value && PK_CITY_SLUGS.includes(String(value).toLowerCase()))
}

export function buildCityHomePath(citySlug) {
  return `/${String(citySlug).toLowerCase()}`
}

export function buildCitySoftwarePath(citySlug, softwarePath) {
  const rest = softwarePath.startsWith('/') ? softwarePath : `/${softwarePath}`
  if (rest === '/' || rest === '') return buildCityHomePath(citySlug)
  if (rest.startsWith('/software/')) return `/${String(citySlug).toLowerCase()}${rest}`
  return `/${String(citySlug).toLowerCase()}/software${rest.startsWith('/') ? rest : `/${rest}`}`
}

export const CITY_SITE_PAGE_SLUGS = [
  'contact',
  'faqs',
  'industries',
  'about',
  'testimonials',
  'erp',
  'solutions',
  'business-models',
]

export const CITY_AWARE_FIRST_SEGMENTS = ['software', ...CITY_SITE_PAGE_SLUGS]

export function isCitySitePageSlug(value) {
  return Boolean(value && CITY_SITE_PAGE_SLUGS.includes(String(value).toLowerCase()))
}

function splitPathAffixes(internalPath) {
  const raw = internalPath || '/'
  const hashIndex = raw.indexOf('#')
  const queryIndex = raw.indexOf('?')
  const cut = [hashIndex, queryIndex].filter((i) => i >= 0).sort((a, b) => a - b)[0]
  if (cut == null) return { path: raw, suffix: '' }
  return { path: raw.slice(0, cut), suffix: raw.slice(cut) }
}

export function isCityAwareInternalPath(internalPath) {
  const { path } = splitPathAffixes(internalPath)
  const rest = path.startsWith('/') ? path : `/${path}`
  if (rest === '/' || rest === '') return true
  const first = rest.replace(/^\//, '').split('/')[0]
  return CITY_AWARE_FIRST_SEGMENTS.includes(first)
}

export function buildCityAwarePath(citySlug, internalPath) {
  const { path, suffix } = splitPathAffixes(internalPath || '/')
  const rest = path.startsWith('/') ? path : `/${path}`
  const city = String(citySlug).toLowerCase()
  if (!city) return `${rest === '' ? '/' : rest}${suffix}`
  if (rest === '/' || rest === '') return `/${city}${suffix}`
  if (rest === `/${city}` || rest.startsWith(`/${city}/`)) return `${rest}${suffix}`
  if (!isCityAwareInternalPath(rest)) return `${rest}${suffix}`
  return `/${city}${rest}${suffix}`
}

export function stripCityAwarePrefix(pathname) {
  const { path, suffix } = splitPathAffixes(pathname || '/')
  const parts = path.replace(/^\/+|\/+$/g, '').split('/').filter(Boolean)
  if (parts.length === 0) return suffix || '/'
  if (PK_CITY_SLUGS.includes(parts[0])) {
    const rest = parts.slice(1)
    return `${rest.length ? `/${rest.join('/')}` : '/'}${suffix}`
  }
  return `${path.startsWith('/') ? path : `/${path}`}${suffix}`
}

/** CMS data folder relative to server/ — never share with UAE server/data */
export const PK_CMS_DATA_DIR_NAME = 'data-pk'

export function isPakistanMarket() {
  const market = String(process.env.MARKET || process.env.DM_MARKET || '').trim().toUpperCase()
  if (market === 'PK' || market === 'PAKISTAN') return true
  const dataDir = String(process.env.CMS_DATA_DIR || '').trim().toLowerCase()
  return dataDir.includes('data-pk') || dataDir.endsWith('pk')
}

export function resolvePakistanContact(siteSettings = {}) {
  return {
    primaryEmail: siteSettings.primaryEmail || PK_CONTACT_PLACEHOLDERS.primaryEmail,
    salesEmail: siteSettings.salesEmail || PK_CONTACT_PLACEHOLDERS.salesEmail,
    supportEmail: siteSettings.supportEmail || PK_CONTACT_PLACEHOLDERS.supportEmail,
    phoneDisplay: siteSettings.phoneDisplay || PK_CONTACT_PLACEHOLDERS.phoneDisplay,
    phoneHref: siteSettings.phoneHref || PK_CONTACT_PLACEHOLDERS.phoneHref,
    whatsappNumber: siteSettings.whatsappNumber || PK_CONTACT_PLACEHOLDERS.whatsappNumber,
    workingHours: siteSettings.workingHours?.en || PK_CONTACT_PLACEHOLDERS.workingHours.en,
  }
}
