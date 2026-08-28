/** Client-side country profiles — Pakistan market (pakistan-version). */
import type { GccCountryCode } from '../config/gccCountries'
import {
  MARKET_CODE,
  MARKET_CURRENCY,
  MARKET_SLUG,
  PK_CITY_SLUGS,
  PK_CONTACT_PLACEHOLDERS,
} from '../market/pakistanConfig'

export type CountryProfile = {
  code: GccCountryCode
  slug: string
  currency: string
  currencyName: { en: string; ar: string }
  name: { en: string; ar: string }
  fullName: { en: string; ar: string }
  cities: { en: string[]; ar: string[] }
  cityPhrase: { en: string; ar: string }
}

const PK_CITY_NAMES = PK_CITY_SLUGS.map((slug) => slug.charAt(0).toUpperCase() + slug.slice(1))

export const COUNTRY_PROFILES: Record<GccCountryCode, CountryProfile> = {
  PK: {
    code: MARKET_CODE,
    slug: MARKET_SLUG,
    currency: MARKET_CURRENCY,
    currencyName: { en: 'Pakistani Rupee (PKR)', ar: 'روبية باكستانية (PKR)' },
    name: { en: 'Pakistan', ar: 'باكستان' },
    fullName: { en: 'Pakistan', ar: 'جمهورية باكستان الإسلامية' },
    cities: {
      en: [...PK_CITY_NAMES],
      ar: [...PK_CITY_NAMES],
    },
    cityPhrase: {
      en: 'Karachi, Lahore and Islamabad',
      ar: 'كراتشي ولاهور وإسلام آباد',
    },
  },
}

const VAT_LABELS: Record<GccCountryCode, string> = {
  PK: 'Pakistan sales tax',
}

export function getCountryProfile(code: string): CountryProfile {
  const upper = (code || MARKET_CODE).toUpperCase() as GccCountryCode
  return COUNTRY_PROFILES[upper] ?? COUNTRY_PROFILES.PK
}

export function vatLabelFor(code: string): string {
  const upper = (code || MARKET_CODE).toUpperCase() as GccCountryCode
  return VAT_LABELS[upper] ?? VAT_LABELS.PK
}

/** Contact placeholders for regionalized copy (from pakistanConfig). */
export const COUNTRY_CONTACT = PK_CONTACT_PLACEHOLDERS
