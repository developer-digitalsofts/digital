/** Country profiles for GCC localized CMS content generation. */
export const GCC_COUNTRIES = ['AE', 'SA', 'QA', 'OM', 'KW', 'BH']

export const COUNTRY_PROFILES = {
  AE: {
    code: 'AE',
    slug: 'ae',
    currency: 'AED',
    currencyName: { en: 'UAE Dirham (AED)', ar: 'درهم إماراتي (AED)' },
    name: { en: 'UAE', ar: 'الإمارات' },
    fullName: { en: 'United Arab Emirates', ar: 'الإمارات العربية المتحدة' },
    cities: { en: ['Dubai', 'Abu Dhabi', 'Sharjah'], ar: ['دبي', 'أبوظبي', 'الشارقة'] },
    cityPhrase: {
      en: 'Dubai, Abu Dhabi and Sharjah',
      ar: 'دبي وأبوظبي والشارقة',
    },
    trustHeading: {
      en: 'Built on Trust.\nProven by Results.',
      ar: 'مبني على الثقة.\nمثبت بالنتائج.',
    },
    heroAccent: {
      en: 'UAE & GCC',
      ar: 'الإمارات ودول الخليج',
    },
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
    trustHeading: {
      en: 'Built for Growing Businesses Across Saudi Arabia',
      ar: 'مصمّم للشركات النامية في المملكة العربية السعودية',
    },
    heroAccent: { en: 'KSA', ar: 'السعودية' },
  },
  QA: {
    code: 'QA',
    slug: 'qa',
    currency: 'QAR',
    currencyName: { en: 'Qatari Riyal (QAR)', ar: 'ريال قطري (QAR)' },
    name: { en: 'Qatar', ar: 'قطر' },
    fullName: { en: 'Qatar', ar: 'دولة قطر' },
    cities: { en: ['Doha'], ar: ['الدوحة'] },
    cityPhrase: { en: 'Doha', ar: 'الدوحة' },
    trustHeading: {
      en: 'Supporting Modern Businesses Across Qatar',
      ar: 'ندعم الشركات الحديثة في قطر',
    },
    heroAccent: { en: 'Qatar', ar: 'قطر' },
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
    trustHeading: {
      en: 'Smarter Business Operations for Companies in Oman',
      ar: 'عمليات أذكى للشركات في سلطنة عُمان',
    },
    heroAccent: { en: 'Oman', ar: 'عُمان' },
  },
  KW: {
    code: 'KW',
    slug: 'kw',
    currency: 'KWD',
    currencyName: { en: 'Kuwaiti Dinar (KWD)', ar: 'دينار كويتي (KWD)' },
    name: { en: 'Kuwait', ar: 'الكويت' },
    fullName: { en: 'Kuwait', ar: 'دولة الكويت' },
    cities: { en: ['Kuwait City'], ar: ['مدينة الكويت'] },
    cityPhrase: { en: 'Kuwait City', ar: 'مدينة الكويت' },
    trustHeading: {
      en: 'One Platform for Growing Businesses in Kuwait',
      ar: 'منصة واحدة للشركات النامية في الكويت',
    },
    heroAccent: { en: 'Kuwait', ar: 'الكويت' },
  },
  BH: {
    code: 'BH',
    slug: 'bh',
    currency: 'BHD',
    currencyName: { en: 'Bahraini Dinar (BHD)', ar: 'دينار بحريني (BHD)' },
    name: { en: 'Bahrain', ar: 'البحرين' },
    fullName: { en: 'Bahrain', ar: 'مملكة البحرين' },
    cities: { en: ['Manama'], ar: ['المنامة'] },
    cityPhrase: { en: 'Manama', ar: 'المنامة' },
    trustHeading: {
      en: 'Cloud ERP Built for Businesses in Bahrain',
      ar: 'ERP سحابي للشركات في البحرين',
    },
    heroAccent: { en: 'Bahrain', ar: 'البحرين' },
  },
}

export const SHARED_COPY = {
  trustEyebrow: {
    en: 'PROVEN PERFORMANCE',
    ar: 'أداء مُثبت',
  },
  trustSubheading: {
    en: 'A unified cloud ERP platform designed to support finance, inventory, sales and multi-branch operations.',
    ar: 'منصة ERP سحابية موحّدة لدعم المالية والمخزون والمبيعات وعمليات الفروع المتعددة.',
  },
  regionalSupportNote: {
    en: 'Regional GCC support from DigitalManager (UAE headquarters).',
    ar: 'دعم إقليمي لدول الخليج من DigitalManager (المقر في الإمارات).',
  },
}

export const SEED_VERSION = 'gcc-localized-content-v4'

export function arIn(name) {
  return `في ${name}`
}

/** Approved regional GCC support contact — not a local office. */
export const REGIONAL_SUPPORT = {
  phoneDisplay: '+971 58 117 4911',
  phoneHref: 'tel:+971581174911',
  email: 'info@digitalmanager.ae',
  label: { en: 'Regional GCC Support', ar: 'دعم إقليمي لدول الخليج' },
}

export function getProfile(countryCode) {
  const code = String(countryCode || 'AE').toUpperCase()
  return COUNTRY_PROFILES[code] || COUNTRY_PROFILES.AE
}
