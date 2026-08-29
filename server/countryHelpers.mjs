/**
 * Country helpers — Pakistan market (pakistan-version).
 */
import { PK_CONTACT_PLACEHOLDERS, MARKET_CURRENCY, MARKET_PHONE_CODE } from './pakistanConfig.mjs'

export const GCC_COUNTRY_CODES = ['PK']

export function normalizeCountryCode(value, fallback = 'PK') {
  const upper = String(value ?? '')
    .trim()
    .toUpperCase()
  return GCC_COUNTRY_CODES.includes(upper) ? upper : fallback
}

export function matchesCountryScope(contentCountryCode, selectedCode) {
  const code = String(contentCountryCode ?? '')
    .trim()
    .toUpperCase()
  if (!code || code === 'ALL' || code === 'PK' || code === 'PAKISTAN') return true
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
  const defaultCode = normalizeCountryCode(doc?.defaultCountryCode, 'PK')
  const items = (doc?.items || [])
    .filter((item) => item && item.enabled !== false && GCC_COUNTRY_CODES.includes(String(item.code || '').toUpperCase()))
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((item) => ({
      code: normalizeCountryCode(item.code, defaultCode),
      name: readBilingualCountry(item.name, lang),
      shortName: readBilingualCountry(item.shortName, lang) || readBilingualCountry(item.name, lang),
      currency: item.currency || MARKET_CURRENCY,
      phoneCode: item.phoneCode || MARKET_PHONE_CODE,
      primaryEmail: item.primaryEmail || PK_CONTACT_PLACEHOLDERS.primaryEmail,
      salesEmail: item.salesEmail || '',
      supportEmail: item.supportEmail || '',
      phoneDisplay: item.phoneDisplay || PK_CONTACT_PLACEHOLDERS.phoneDisplay,
      phoneHref: item.phoneHref || PK_CONTACT_PLACEHOLDERS.phoneHref,
      whatsappNumber: String(item.whatsappNumber || PK_CONTACT_PLACEHOLDERS.whatsappNumber).replace(/\D/g, ''),
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
    defaultCountryCode: 'PK',
    items: [
      {
        code: 'PK',
        name: { en: 'Pakistan', ar: 'Pakistan' },
        shortName: { en: 'Pakistan', ar: 'Pakistan' },
        enabled: true,
        isDefault: true,
        currency: MARKET_CURRENCY,
        phoneCode: MARKET_PHONE_CODE,
        primaryEmail: PK_CONTACT_PLACEHOLDERS.primaryEmail,
        salesEmail: PK_CONTACT_PLACEHOLDERS.salesEmail,
        supportEmail: PK_CONTACT_PLACEHOLDERS.supportEmail,
        phoneDisplay: PK_CONTACT_PLACEHOLDERS.phoneDisplay,
        phoneHref: PK_CONTACT_PLACEHOLDERS.phoneHref,
        whatsappNumber: PK_CONTACT_PLACEHOLDERS.whatsappNumber,
        officeAddress: PK_CONTACT_PLACEHOLDERS.officeAddress,
        workingHours: PK_CONTACT_PLACEHOLDERS.workingHours,
        sortOrder: 0,
        autoDetectEnabled: false,
        allowAutoRedirect: false,
      },
    ],
  }
}
