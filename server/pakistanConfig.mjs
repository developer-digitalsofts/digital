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

const TEMP_PUBLIC_HOST_RE = /pk-test\.digitalmanager\.ae/i

/** Canonical production origin. Temporary Coolify/test hosts are never used in public SEO URLs. */
export function resolvePublicSiteUrl() {
  const raw = String(process.env.PUBLIC_SITE_URL || process.env.VITE_PUBLIC_SITE_URL || '').trim().replace(/\/$/, '')
  if (raw && !TEMP_PUBLIC_HOST_RE.test(raw)) return raw
  return PUBLIC_SITE_URL_DEFAULT
}

/** Official contact published on https://digitalmanager.pk (Head Office + site-wide channels). */
export const PK_OFFICIAL_CONTACT = {
  brandName: 'DigitalManager',
  legalName: 'DigitalSofts Pvt. Ltd.',
  emails: {
    primary: 'sales@digitalmanager.pk',
    sales: 'sales@digitalmanager.pk',
    support: 'sales@digitalmanager.pk',
  },
  phones: {
    primary: { display: '+92 326 786 6000', href: 'tel:+923267866000' },
    secondary: { display: '+92 321 866 1765', href: 'tel:+923218661765' },
    headOffice: { display: '+92 41 8535 044', href: 'tel:+92418535044' },
    headOfficeAlt: { display: '+92 300 033 4427', href: 'tel:+923000334427' },
  },
  whatsapp: {
    display: '+92 321 866 1765',
    international: '923218661765',
    href: 'https://wa.me/923218661765',
  },
  address: {
    line1: "Sitara Techno Park, Lower Canal Road, People's Colony No 1",
    city: 'Faisalabad',
    province: 'Punjab',
    postalCode: '',
    country: 'Pakistan',
    formatted: "Sitara Techno Park, Lower Canal Road, People's Colony No 1, Faisalabad, Pakistan",
  },
  businessHours: {
    en: 'We endeavour to answer all enquiries within 24 hours on business days.',
  },
  mapUrl: '',
  socialLinks: {
    facebook: 'https://www.facebook.com/DigitalManagerERP',
    linkedin: '',
    instagram: '',
    youtube: '',
    twitter: '',
  },
}

/** Flat CMS / API defaults derived from {@link PK_OFFICIAL_CONTACT}. */
export const PK_CONTACT_PLACEHOLDERS = {
  primaryEmail: PK_OFFICIAL_CONTACT.emails.primary,
  salesEmail: PK_OFFICIAL_CONTACT.emails.sales,
  supportEmail: PK_OFFICIAL_CONTACT.emails.support,
  phoneDisplay: PK_OFFICIAL_CONTACT.phones.primary.display,
  phoneHref: PK_OFFICIAL_CONTACT.phones.primary.href,
  whatsappNumber: PK_OFFICIAL_CONTACT.whatsapp.international,
  officeAddress: {
    en: PK_OFFICIAL_CONTACT.address.formatted,
  },
  workingHours: PK_OFFICIAL_CONTACT.businessHours,
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
  const whatsappNumber = String(siteSettings.whatsappNumber || PK_CONTACT_PLACEHOLDERS.whatsappNumber).replace(/\D/g, '')
  return {
    brandName: PK_OFFICIAL_CONTACT.brandName,
    legalName: PK_OFFICIAL_CONTACT.legalName,
    primaryEmail: siteSettings.primaryEmail || PK_CONTACT_PLACEHOLDERS.primaryEmail,
    salesEmail: siteSettings.salesEmail || PK_CONTACT_PLACEHOLDERS.salesEmail,
    supportEmail: siteSettings.supportEmail || PK_CONTACT_PLACEHOLDERS.supportEmail,
    phoneDisplay: siteSettings.phoneDisplay || PK_CONTACT_PLACEHOLDERS.phoneDisplay,
    phoneHref: siteSettings.phoneHref || PK_CONTACT_PLACEHOLDERS.phoneHref,
    secondaryPhoneDisplay: PK_OFFICIAL_CONTACT.phones.secondary.display,
    secondaryPhoneHref: PK_OFFICIAL_CONTACT.phones.secondary.href,
    whatsappNumber,
    whatsappUrl: whatsappNumber ? `https://wa.me/${whatsappNumber}` : PK_OFFICIAL_CONTACT.whatsapp.href,
    officeAddress:
      siteSettings.officeAddress?.en || siteSettings.officeAddress || PK_CONTACT_PLACEHOLDERS.officeAddress.en,
    workingHours: siteSettings.workingHours?.en || PK_CONTACT_PLACEHOLDERS.workingHours.en,
    mapUrl: siteSettings.googleMapLink || PK_OFFICIAL_CONTACT.mapUrl,
    socialLinks: PK_OFFICIAL_CONTACT.socialLinks,
  }
}
