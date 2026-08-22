/**
 * GCC country helpers for content scoping and public APIs.
 */

export const GCC_COUNTRY_CODES = ['AE', 'SA', 'KW', 'QA', 'BH', 'OM']

export function normalizeCountryCode(value, fallback = 'AE') {
  const upper = String(value ?? '')
    .trim()
    .toUpperCase()
  return GCC_COUNTRY_CODES.includes(upper) ? upper : fallback
}

export function matchesCountryScope(contentCountryCode, selectedCode) {
  const code = String(contentCountryCode ?? '')
    .trim()
    .toUpperCase()
  if (!code || code === 'ALL' || code === 'GCC') return true
  return code === normalizeCountryCode(selectedCode)
}

export function readBilingualCountry(value, lang = 'en') {
  if (typeof value === 'string') return value.trim()
  if (!value || typeof value !== 'object') return ''
  const primary = lang === 'ar' ? value.ar : value.en
  const fallback = lang === 'ar' ? value.en : value.ar
  if (typeof primary === 'string' && primary.trim()) return primary.trim()
  if (typeof fallback === 'string' && fallback.trim()) return fallback.trim()
  return ''
}

export function publishedCountries(doc, lang = 'en') {
  const defaultCode = normalizeCountryCode(doc?.defaultCountryCode, 'AE')
  const items = (doc?.items || [])
    .filter((item) => item && item.enabled !== false && GCC_COUNTRY_CODES.includes(String(item.code || '').toUpperCase()))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((item) => ({
      code: normalizeCountryCode(item.code, defaultCode),
      name: readBilingualCountry(item.name, lang),
      shortName: readBilingualCountry(item.shortName, lang) || readBilingualCountry(item.name, lang),
      currency: item.currency || '',
      phoneCode: item.phoneCode || '',
      primaryEmail: item.primaryEmail || '',
      salesEmail: item.salesEmail || '',
      supportEmail: item.supportEmail || '',
      phoneDisplay: item.phoneDisplay || '',
      phoneHref: item.phoneHref || '',
      whatsappNumber: String(item.whatsappNumber || '').replace(/\D/g, ''),
      officeAddress: readBilingualCountry(item.officeAddress, lang),
      workingHours: readBilingualCountry(item.workingHours, lang),
      isDefault: item.isDefault === true || normalizeCountryCode(item.code) === defaultCode,
    }))

  return {
    schemaVersion: doc?.schemaVersion ?? 1,
    defaultCountryCode: defaultCode,
    items,
  }
}

export function resolveCountryProfile(doc, code, lang = 'en') {
  const payload = publishedCountries(doc, lang)
  const selected = normalizeCountryCode(code, payload.defaultCountryCode)
  const match = payload.items.find((item) => item.code === selected)
  if (match) return match
  return payload.items.find((item) => item.isDefault) || payload.items[0] || null
}

export function defaultCountriesDoc() {
  return {
    schemaVersion: 1,
    defaultCountryCode: 'AE',
    items: [
      {
        code: 'AE',
        name: { en: 'United Arab Emirates', ar: 'الإمارات العربية المتحدة' },
        shortName: { en: 'UAE', ar: 'الإمارات' },
        enabled: true,
        isDefault: true,
        currency: 'AED',
        phoneCode: '+971',
        primaryEmail: 'info@digitalmanager.ae',
        salesEmail: 'info@digitalmanager.ae',
        supportEmail: 'info@digitalmanager.ae',
        phoneDisplay: '+971 6 536 6786',
        phoneHref: 'tel:+97165366786',
        whatsappNumber: '971581174911',
        officeAddress: {
          en: '607, Al Rahma 1, Al Wahda St, Sharjah, UAE',
          ar: '٦٠٧، الرحمة ١، شارع الوحدة، الشارقة، الإمارات',
        },
        workingHours: { en: 'Sat - Thu : 10.00 am - 9.00 pm', ar: 'السبت–الخميس: ١٠ ص – ٩ م' },
        sortOrder: 0,
      },
      {
        code: 'SA',
        name: { en: 'Saudi Arabia', ar: 'المملكة العربية السعودية' },
        shortName: { en: 'KSA', ar: 'السعودية' },
        enabled: true,
        currency: 'SAR',
        phoneCode: '+966',
        primaryEmail: 'info@digitalmanager.ae',
        sortOrder: 1,
      },
      {
        code: 'KW',
        name: { en: 'Kuwait', ar: 'الكويت' },
        shortName: { en: 'Kuwait', ar: 'الكويت' },
        enabled: true,
        currency: 'KWD',
        phoneCode: '+965',
        primaryEmail: 'info@digitalmanager.ae',
        sortOrder: 2,
      },
      {
        code: 'QA',
        name: { en: 'Qatar', ar: 'قطر' },
        shortName: { en: 'Qatar', ar: 'قطر' },
        enabled: true,
        currency: 'QAR',
        phoneCode: '+974',
        primaryEmail: 'info@digitalmanager.ae',
        sortOrder: 3,
      },
      {
        code: 'BH',
        name: { en: 'Bahrain', ar: 'البحرين' },
        shortName: { en: 'Bahrain', ar: 'البحرين' },
        enabled: true,
        currency: 'BHD',
        phoneCode: '+973',
        primaryEmail: 'info@digitalmanager.ae',
        sortOrder: 4,
      },
      {
        code: 'OM',
        name: { en: 'Oman', ar: 'عُمان' },
        shortName: { en: 'Oman', ar: 'عُمان' },
        enabled: true,
        currency: 'OMR',
        phoneCode: '+968',
        primaryEmail: 'info@digitalmanager.ae',
        sortOrder: 5,
      },
    ],
  }
}
