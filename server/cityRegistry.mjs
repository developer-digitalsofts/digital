/**
 * City registry for GCC localized city pages.
 * Each city belongs to one country and maps to a URL slug.
 */
import { normalizeCountryCode } from './countryHelpers.mjs'
import { getProfile } from './gccLocalizedContent/profiles.mjs'

/** Primary city page slug (ERP landing per city). */
export const CITY_PAGE_SLUG = 'erp-software'

export const CITY_CONTENT_TYPE = 'cityPage'

/** @type {Record<string, { slug: string, name: { en: string, ar: string }, countryCode: string, focus: { en: string, ar: string }, industries: string[], services: string[] }>} */
export const CITY_REGISTRY = {
  dubai: {
    slug: 'dubai',
    countryCode: 'AE',
    name: { en: 'Dubai', ar: 'دبي' },
    focus: {
      en: 'free-zone trading, retail chains and multi-branch finance teams',
      ar: 'التجارة في المناطق الحرة وسلاسل التجزئة وفرق المالية متعددة الفروع',
    },
    industries: ['Retail & E-commerce', 'Trading & Distribution', 'Hospitality', 'Real Estate'],
    services: ['Multi-branch GL consolidation', 'VAT-compliant invoicing', 'POS with inventory sync', 'CRM for B2B sales'],
  },
  'abu-dhabi': {
    slug: 'abu-dhabi',
    countryCode: 'AE',
    name: { en: 'Abu Dhabi', ar: 'أبوظبي' },
    focus: {
      en: 'government-linked projects, contracting and enterprise procurement',
      ar: 'المشاريع المرتبطة بالجهات الحكومية والمقاولات ومشتريات المؤسسات',
    },
    industries: ['Construction & Contracting', 'Oil & Gas Services', 'Facilities Management', 'Healthcare'],
    services: ['Project cost tracking', 'Purchase order workflows', 'Retention & milestone billing', 'Audit-ready reporting'],
  },
  sharjah: {
    slug: 'sharjah',
    countryCode: 'AE',
    name: { en: 'Sharjah', ar: 'الشارقة' },
    focus: {
      en: 'industrial manufacturing, warehousing and export-oriented SMEs',
      ar: 'التصنيع الصناعي والمستودعات والشركات الصغيرة والمتوسطة orientated للتصدير',
    },
    industries: ['Manufacturing', 'Wholesale Distribution', 'Import/Export', 'Automotive Parts'],
    services: ['BOM & production planning', 'Warehouse bin management', 'Landed cost tracking', 'Export documentation support'],
  },
  ajman: {
    slug: 'ajman',
    countryCode: 'AE',
    name: { en: 'Ajman', ar: 'عجمان' },
    focus: {
      en: 'cost-conscious SMEs, light manufacturing and trading offices',
      ar: 'الشركات الصغيرة والمتوسطة conscious للتكلفة والتصنيع الخفيف ومكاتب التجارة',
    },
    industries: ['Trading', 'Light Manufacturing', 'Services', 'F&B Outlets'],
    services: ['Affordable cloud ERP rollout', 'Simple inventory & invoicing', 'Payroll for small teams', 'Branch-level dashboards'],
  },
  riyadh: {
    slug: 'riyadh',
    countryCode: 'SA',
    name: { en: 'Riyadh', ar: 'الرياض' },
    focus: {
      en: 'Vision 2030 enterprises, retail expansion and centralized HQ reporting',
      ar: 'م enterprises رؤية 2030 وتوسع التجزئة وتقارير المقر المركزي',
    },
    industries: ['Retail Chains', 'Healthcare Groups', 'Contracting', 'Professional Services'],
    services: ['ZATCA e-invoicing readiness', 'Multi-entity consolidation', 'SAR payroll & GOSI', 'Branch performance KPIs'],
  },
  jeddah: {
    slug: 'jeddah',
    countryCode: 'SA',
    name: { en: 'Jeddah', ar: 'جدة' },
    focus: {
      en: 'Red Sea port logistics, wholesale distribution and hospitality groups',
      ar: 'logistics ميناء البحر الأحمر والتوزيع بالجملة ومجموعات الضيافة',
    },
    industries: ['Logistics & Warehousing', 'Wholesale', 'Hotels & Restaurants', 'Import/Export'],
    services: ['Route & delivery planning', 'Cold-chain inventory', 'Inter-city stock transfers', 'Hospitality revenue tracking'],
  },
  dammam: {
    slug: 'dammam',
    countryCode: 'SA',
    name: { en: 'Dammam', ar: 'الدمام' },
    focus: {
      en: 'Eastern Province industrial services, spare parts and project-based billing',
      ar: 'خدمات صناعية المنطقة الشرقية وقطع الغيار والفوترة القائمة على المشاريع',
    },
    industries: ['Oil & Gas Services', 'Industrial Supply', 'Workshop & Maintenance', 'Construction'],
    services: ['Job costing & timesheets', 'Spare parts catalogue', 'Service contract billing', 'Vendor payment schedules'],
  },
  doha: {
    slug: 'doha',
    countryCode: 'QA',
    name: { en: 'Doha', ar: 'الدوحة' },
    focus: {
      en: 'services-led businesses, events infrastructure and growing retail brands',
      ar: 'الشركات القائمة على الخدمات والبنية التحتية للفعاليات وعلامات التجزئة النامية',
    },
    industries: ['Professional Services', 'Events & Catering', 'Retail', 'Facilities'],
    services: ['QAR billing & approvals', 'Project milestone tracking', 'Multi-site inventory', 'Client portal invoicing'],
  },
  muscat: {
    slug: 'muscat',
    countryCode: 'OM',
    name: { en: 'Muscat', ar: 'مسقط' },
    focus: {
      en: 'logistics corridors, tourism hospitality and family-owned trading groups',
      ar: 'ممرات logistics والضيافة السياحية ومجموعات التجارة العائلية',
    },
    industries: ['Tourism & Hospitality', 'Trading & Distribution', 'Logistics', 'Healthcare Clinics'],
    services: ['OMR multi-branch accounting', 'Seasonal demand forecasting', 'Fleet & delivery costing', 'Clinic appointment billing'],
  },
  'kuwait-city': {
    slug: 'kuwait-city',
    countryCode: 'KW',
    name: { en: 'Kuwait City', ar: 'مدينة الكويت' },
    focus: {
      en: 'family businesses, trading houses and multi-brand retail operators',
      ar: 'الشركات العائلية وبيوت التجارة ومشغلي التجزئة متعددة العلامات',
    },
    industries: ['Trading Houses', 'Retail', 'F&B Groups', 'Automotive'],
    services: ['KWD consolidated reporting', 'Credit terms & ageing', 'Showroom POS integration', 'Inter-company transfers'],
  },
  manama: {
    slug: 'manama',
    countryCode: 'BH',
    name: { en: 'Manama', ar: 'المنامة' },
    focus: {
      en: 'financial services support, professional firms and compact multi-branch operators',
      ar: 'دعم الخدمات المالية والشركات المهنية والمشغلين متعددي الفروع compact',
    },
    industries: ['Professional Services', 'Retail', 'Healthcare', 'Trading'],
    services: ['BHD VAT-ready invoicing', 'Time & expense billing', 'Compact branch rollouts', 'Compliance audit trails'],
  },
}

export const ALL_CITY_SLUGS = Object.keys(CITY_REGISTRY)

export function getCity(citySlug) {
  if (!citySlug) return null
  return CITY_REGISTRY[String(citySlug).toLowerCase()] || null
}

export function getCitiesForCountry(countryCode) {
  const code = normalizeCountryCode(countryCode)
  return ALL_CITY_SLUGS.map((slug) => CITY_REGISTRY[slug]).filter((c) => c.countryCode === code)
}

export function isValidCityForCountry(citySlug, countryCode) {
  const city = getCity(citySlug)
  if (!city) return false
  return normalizeCountryCode(city.countryCode) === normalizeCountryCode(countryCode)
}

export function cityGlobalIdentity(citySlug, pageSlug = CITY_PAGE_SLUG) {
  return `city:${citySlug}:${pageSlug}`
}

export function cityRecordKey(citySlug, pageSlug = CITY_PAGE_SLUG) {
  return `${CITY_CONTENT_TYPE}:${cityGlobalIdentity(citySlug, pageSlug)}`
}

export function getCountryProfileForCity(citySlug) {
  const city = getCity(citySlug)
  if (!city) return getProfile('AE')
  return getProfile(city.countryCode)
}
