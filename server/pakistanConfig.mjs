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
    en: 'Suite 100, Placeholder Tower, Karachi, Pakistan',
  },
  workingHours: {
    en: 'Mon - Sat : 10.00 am - 6.00 pm',
  },
}

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
]

/** CMS data folder relative to server/ — never share with UAE server/data */
export const PK_CMS_DATA_DIR_NAME = 'data-pk'

export function isPakistanMarket() {
  const market = String(process.env.MARKET || process.env.DM_MARKET || '').trim().toUpperCase()
  if (market === 'PK' || market === 'PAKISTAN') return true
  const dataDir = String(process.env.CMS_DATA_DIR || '').trim().toLowerCase()
  return dataDir.includes('data-pk') || dataDir.endsWith('pk')
}
