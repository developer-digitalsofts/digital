/**
 * City registry — Pakistan market (pakistan-version branch).
 */
import {
  CITY_HOME_SLUG,
  CITY_PRODUCT_PAGE_SLUGS,
  MARKET_CODE,
  MARKET_CURRENCY,
  PK_CITY_SLUGS,
} from './pakistanConfig.mjs'

/** Default city landing identity (homepage). */
export const CITY_PAGE_SLUG = CITY_HOME_SLUG

export { CITY_HOME_SLUG, CITY_PRODUCT_PAGE_SLUGS }

export const CITY_CONTENT_TYPE = 'cityPage'

const CITY_DEFS = {
  karachi: {
    name: { en: 'Karachi' },
    focus: {
      en: 'port-linked trading, wholesale depots and multi-branch retail',
    },
    industries: ['Trading & Distribution', 'Retail & E-commerce', 'Logistics', 'Manufacturing'],
    services: ['Multi-branch GL consolidation', 'PKR invoicing', 'POS with inventory sync', 'CRM for B2B sales'],
  },
  lahore: {
    name: { en: 'Lahore' },
    focus: {
      en: 'textile manufacturing, FMCG distribution and Punjab retail expansion',
    },
    industries: ['Textile', 'FMCG Distribution', 'Retail', 'F&B'],
    services: ['Production planning', 'Route delivery', 'Branch KPIs', 'Credit terms & ageing'],
  },
  islamabad: {
    name: { en: 'Islamabad' },
    focus: {
      en: 'professional services, IT firms and healthcare clinics',
    },
    industries: ['Professional Services', 'IT & Software', 'Healthcare', 'Consulting'],
    services: ['Milestone billing', 'Approval workflows', 'Timesheet billing', 'Audit-ready exports'],
  },
  rawalpindi: {
    name: { en: 'Rawalpindi' },
    focus: {
      en: 'workshops, spare-parts retail and twin-city wholesale',
    },
    industries: ['Automotive Parts', 'Workshops', 'Wholesale', 'Retail'],
    services: ['Job costing', 'Spare parts catalogue', 'Simple inventory', 'Branch dashboards'],
  },
  faisalabad: {
    name: { en: 'Faisalabad' },
    focus: {
      en: 'textile mills, agri-trading and industrial supply',
    },
    industries: ['Textile Manufacturing', 'Agri-Trading', 'Industrial Supply', 'Export'],
    services: ['BOM & production', 'Landed cost tracking', 'Vendor payments', 'PKR consolidation'],
  },
  multan: {
    name: { en: 'Multan' },
    focus: {
      en: 'agri-business, cold storage and southern Punjab hubs',
    },
    industries: ['Agriculture', 'Cold Storage', 'Wholesale', 'Logistics'],
    services: ['Seasonal forecasting', 'Cold-chain inventory', 'Inter-city transfers', 'PKR reporting'],
  },
  peshawar: {
    name: { en: 'Peshawar' },
    focus: {
      en: 'pharma wholesale, regional distribution and healthcare',
    },
    industries: ['Pharmaceuticals', 'Wholesale', 'Healthcare', 'Trading'],
    services: ['Batch tracking', 'Credit ageing', 'Multi-warehouse stock', 'Compliance audit trails'],
  },
  quetta: {
    name: { en: 'Quetta' },
    focus: {
      en: 'trading houses, transport and provincial logistics',
    },
    industries: ['Trading Houses', 'Transport', 'Construction Supply', 'Services'],
    services: ['Fleet costing', 'Project billing', 'Affordable ERP rollout', 'Branch reporting'],
  },
  hyderabad: {
    name: { en: 'Hyderabad' },
    focus: {
      en: 'Sindh wholesale, light manufacturing and retail chains',
    },
    industries: ['Wholesale', 'Light Manufacturing', 'Retail', 'Services'],
    services: ['Multi-branch stock', 'PKR invoicing', 'Distributor credit', 'POS sync'],
  },
  sialkot: {
    name: { en: 'Sialkot' },
    focus: {
      en: 'export manufacturing, sports goods and surgical instruments',
    },
    industries: ['Export Manufacturing', 'Sports Goods', 'Surgical Instruments', 'Trading'],
    services: ['Export documentation', 'Job costing', 'Landed costs', 'PKR consolidation'],
  },
  gujranwala: {
    name: { en: 'Gujranwala' },
    focus: {
      en: 'ceramics, electrical goods and Punjab wholesale markets',
    },
    industries: ['Ceramics', 'Electrical Goods', 'Wholesale', 'Manufacturing'],
    services: ['Production planning', 'Dealer billing', 'Inventory control', 'PKR reporting'],
  },
}

/** @type {Record<string, { slug: string, name: { en: string }, countryCode: string, focus: { en: string }, industries: string[], services: string[] }>} */
export const CITY_REGISTRY = Object.fromEntries(
  PK_CITY_SLUGS.map((slug) => {
    const def = CITY_DEFS[slug]
    return [
      slug,
      {
        slug,
        countryCode: MARKET_CODE,
        name: def.name,
        focus: def.focus,
        industries: def.industries,
        services: def.services,
      },
    ]
  }),
)

export const ALL_CITY_SLUGS = Object.keys(CITY_REGISTRY)

export function getCity(citySlug) {
  if (!citySlug) return null
  return CITY_REGISTRY[String(citySlug).toLowerCase()] || null
}

export function getCitiesForCountry(countryCode = MARKET_CODE) {
  const code = String(countryCode || MARKET_CODE).toUpperCase()
  return ALL_CITY_SLUGS.map((slug) => CITY_REGISTRY[slug]).filter((c) => c.countryCode === code)
}

export function isValidCityForCountry(citySlug, countryCode = MARKET_CODE) {
  const city = getCity(citySlug)
  if (!city) return false
  return city.countryCode === String(countryCode || MARKET_CODE).toUpperCase()
}

export function isKnownCityProductSlug(pageSlug) {
  const slug = String(pageSlug || '').toLowerCase()
  return slug === CITY_HOME_SLUG || CITY_PRODUCT_PAGE_SLUGS.includes(slug)
}

export function isCityHomeSlug(pageSlug) {
  return String(pageSlug || '').toLowerCase() === CITY_HOME_SLUG
}

export function cityGlobalIdentity(citySlug, pageSlug = CITY_PAGE_SLUG) {
  return `city:${citySlug}:${pageSlug}`
}

export function cityRecordKey(citySlug, pageSlug = CITY_PAGE_SLUG) {
  return `${CITY_CONTENT_TYPE}:${cityGlobalIdentity(citySlug, pageSlug)}`
}

export function getCountryProfileForCity(_citySlug) {
  return {
    code: MARKET_CODE,
    currency: MARKET_CURRENCY,
    name: 'Pakistan',
  }
}
