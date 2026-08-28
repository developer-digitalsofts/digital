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
  officeAddress: 'Suite 100, Placeholder Tower, Karachi, Pakistan',
  workingHours: 'Mon - Sat : 10.00 am - 6.00 pm',
  defaultCountry: 'Pakistan',
  defaultCurrency: 'PKR',
  defaultPhoneCode: '+92',
} as const

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
] as const

export type PkCitySlug = (typeof PK_CITY_SLUGS)[number]

export function isCityProductPageSlug(value: string | null | undefined): value is CityProductPageSlug {
  return Boolean(value && (CITY_PRODUCT_PAGE_SLUGS as readonly string[]).includes(value))
}

export function isPkCitySlug(value: string | null | undefined): value is PkCitySlug {
  return Boolean(value && (PK_CITY_SLUGS as readonly string[]).includes(value.toLowerCase()))
}
