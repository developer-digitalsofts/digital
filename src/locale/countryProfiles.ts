/** Client-side GCC country profiles — mirrors server/gccLocalizedContent/profiles.mjs */
import type { GccCountryCode } from '../config/gccCountries'

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

export const COUNTRY_PROFILES: Record<GccCountryCode, CountryProfile> = {
  AE: {
    code: 'AE',
    slug: 'ae',
    currency: 'AED',
    currencyName: { en: 'UAE Dirham (AED)', ar: 'درهم إماراتي (AED)' },
    name: { en: 'UAE', ar: 'الإمارات' },
    fullName: { en: 'United Arab Emirates', ar: 'الإمارات العربية المتحدة' },
    cities: { en: ['Dubai', 'Abu Dhabi', 'Sharjah'], ar: ['دبي', 'أبوظبي', 'الشارقة'] },
    cityPhrase: { en: 'Dubai, Abu Dhabi and Sharjah', ar: 'دبي وأبوظبي والشارقة' },
  },
  SA: {
    code: 'SA',
    slug: 'sa',
    currency: 'SAR',
    currencyName: { en: 'Saudi Riyal (SAR)', ar: 'ريال سعودي (SAR)' },
    name: { en: 'Saudi Arabia', ar: 'السعودية' },
    fullName: { en: 'Saudi Arabia', ar: 'المملكة العربية السعودية' },
    cities: { en: ['Riyadh', 'Jeddah', 'Dammam'], ar: ['الرياض', 'جدة', 'الدمام'] },
    cityPhrase: { en: 'Riyadh, Jeddah and Dammam', ar: 'الرياض وجدة والدمام' },
  },
  QA: {
    code: 'QA',
    slug: 'qa',
    currency: 'QAR',
    currencyName: { en: 'Qatari Riyal (QAR)', ar: 'ريال قطري (QAR)' },
    name: { en: 'Qatar', ar: 'قطر' },
    fullName: { en: 'Qatar', ar: 'دولة قطر' },
    cities: { en: ['Doha', 'Al Rayyan', 'Al Wakrah'], ar: ['الدوحة', 'الريان', 'الوكرة'] },
    cityPhrase: { en: 'Doha, Al Rayyan and Al Wakrah', ar: 'الدوحة والريان والوكرة' },
  },
  OM: {
    code: 'OM',
    slug: 'om',
    currency: 'OMR',
    currencyName: { en: 'Omani Rial (OMR)', ar: 'ريال عُماني (OMR)' },
    name: { en: 'Oman', ar: 'عُمان' },
    fullName: { en: 'Oman', ar: 'سلطنة عُمان' },
    cities: { en: ['Muscat', 'Sohar', 'Salalah'], ar: ['مسقط', 'صحار', 'صلالة'] },
    cityPhrase: { en: 'Muscat, Sohar and Salalah', ar: 'مسقط وصحار وصلالة' },
  },
  KW: {
    code: 'KW',
    slug: 'kw',
    currency: 'KWD',
    currencyName: { en: 'Kuwaiti Dinar (KWD)', ar: 'دينار كويتي (KWD)' },
    name: { en: 'Kuwait', ar: 'الكويت' },
    fullName: { en: 'Kuwait', ar: 'دولة الكويت' },
    cities: { en: ['Kuwait City', 'Hawalli', 'Farwaniya'], ar: ['مدينة الكويت', 'حولي', 'الفروانية'] },
    cityPhrase: { en: 'Kuwait City, Hawalli and Farwaniya', ar: 'مدينة الكويت وحولي والفروانية' },
  },
  BH: {
    code: 'BH',
    slug: 'bh',
    currency: 'BHD',
    currencyName: { en: 'Bahraini Dinar (BHD)', ar: 'دينار بحريني (BHD)' },
    name: { en: 'Bahrain', ar: 'البحرين' },
    fullName: { en: 'Bahrain', ar: 'مملكة البحرين' },
    cities: { en: ['Manama', 'Riffa', 'Muharraq'], ar: ['المنامة', 'الرفاع', 'المحرق'] },
    cityPhrase: { en: 'Manama, Riffa and Muharraq', ar: 'المنامة والرفاع والمحرق' },
  },
}

const VAT_LABELS: Record<GccCountryCode, string> = {
  AE: 'UAE VAT',
  SA: 'Saudi VAT',
  QA: 'Qatar VAT',
  OM: 'Oman tax',
  KW: 'Kuwait tax',
  BH: 'Bahrain VAT',
}

export function getCountryProfile(code: string): CountryProfile {
  const upper = (code || 'AE').toUpperCase() as GccCountryCode
  return COUNTRY_PROFILES[upper] ?? COUNTRY_PROFILES.AE
}

export function vatLabelFor(code: string): string {
  const upper = (code || 'AE').toUpperCase() as GccCountryCode
  return VAT_LABELS[upper] ?? VAT_LABELS.AE
}
