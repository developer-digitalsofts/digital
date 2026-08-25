/**
 * Regionalize bilingual CMS documents when copying UAE baseline to another GCC country.
 */
import { normalizeCountryCode } from './countryHelpers.mjs'

const CITY_REPLACEMENTS = {
  SA: [
    ['Dubai', 'Riyadh'],
    ['Abu Dhabi', 'Jeddah'],
    ['Sharjah', 'Dammam'],
    ['Ajman', 'Dammam'],
    ['Al Ain', 'Jeddah'],
  ],
  QA: [
    ['Dubai', 'Doha'],
    ['Abu Dhabi', 'Doha'],
    ['Sharjah', 'Doha'],
    ['United Arab Emirates', 'Qatar'],
  ],
  OM: [
    ['Dubai', 'Muscat'],
    ['Abu Dhabi', 'Muscat'],
    ['Sharjah', 'Sohar'],
    ['United Arab Emirates', 'Oman'],
  ],
  KW: [
    ['Dubai', 'Kuwait City'],
    ['Abu Dhabi', 'Kuwait City'],
    ['Sharjah', 'Kuwait City'],
    ['United Arab Emirates', 'Kuwait'],
  ],
  BH: [
    ['Dubai', 'Manama'],
    ['Abu Dhabi', 'Manama'],
    ['Sharjah', 'Manama'],
    ['United Arab Emirates', 'Bahrain'],
  ],
}

const TEXT_REPLACEMENTS = {
  SA: [
    [/\bUnited Arab Emirates\b/gi, 'Saudi Arabia'],
    [/\bUAE\b/g, 'KSA'],
    [/\bEmirati\b/gi, 'Saudi'],
    [/\bEmirates\b/gi, 'Kingdom'],
    [/\bAED\b/g, 'SAR'],
    [/\+971\b/g, '+966'],
    [/\b971(\d)/g, '966$1'],
    [/UAE & GCC Ready/gi, 'KSA & GCC Ready'],
    [/UAE-ready/gi, 'KSA-ready'],
    [/in the UAE/gi, 'in Saudi Arabia'],
    [/across the UAE/gi, 'across Saudi Arabia'],
    [/UAE, GCC/gi, 'Saudi Arabia and the GCC'],
  ],
  QA: [
    [/\bUnited Arab Emirates\b/gi, 'Qatar'],
    [/\bUAE\b/g, 'Qatar'],
    [/\bAED\b/g, 'QAR'],
    [/\+971\b/g, '+974'],
    [/Dubai, Abu Dhabi and Sharjah/gi, 'Doha'],
    [/across UAE, GCC/gi, 'across Qatar and the GCC'],
    [/in the UAE/gi, 'in Qatar'],
  ],
  OM: [
    [/\bUnited Arab Emirates\b/gi, 'Oman'],
    [/\bUAE\b/g, 'Oman'],
    [/\bAED\b/g, 'OMR'],
    [/\+971\b/g, '+968'],
    [/Dubai, Abu Dhabi and Sharjah/gi, 'Muscat, Sohar and Salalah'],
    [/in the UAE/gi, 'in Oman'],
  ],
  KW: [
    [/\bUnited Arab Emirates\b/gi, 'Kuwait'],
    [/\bUAE\b/g, 'Kuwait'],
    [/\bAED\b/g, 'KWD'],
    [/\+971\b/g, '+965'],
    [/Dubai, Abu Dhabi and Sharjah/gi, 'Kuwait City'],
    [/in the UAE/gi, 'in Kuwait'],
  ],
  BH: [
    [/\bUnited Arab Emirates\b/gi, 'Bahrain'],
    [/\bUAE\b/g, 'Bahrain'],
    [/\bAED\b/g, 'BHD'],
    [/\+971\b/g, '+973'],
    [/Dubai, Abu Dhabi and Sharjah/gi, 'Manama'],
    [/in the UAE/gi, 'in Bahrain'],
  ],
}

function applyReplacements(text, rules) {
  if (typeof text !== 'string' || !text) return text
  let out = text
  for (const [from, to] of rules) {
    if (from instanceof RegExp) out = out.replace(from, to)
    else out = out.split(from).join(to)
  }
  return out
}

function regionalizeValue(value, countryCode) {
  const country = normalizeCountryCode(countryCode)
  const textRules = [...(TEXT_REPLACEMENTS[country] || []), ...(CITY_REPLACEMENTS[country] || [])]

  if (typeof value === 'string') return applyReplacements(value, textRules)

  if (Array.isArray(value)) return value.map((item) => regionalizeValue(item, countryCode))

  if (value && typeof value === 'object') {
    if ('en' in value || 'ar' in value) {
      const next = { ...value }
      if ('en' in next) next.en = applyReplacements(String(next.en ?? ''), textRules)
      if ('ar' in next) next.ar = applyReplacements(String(next.ar ?? ''), textRules)
      return next
    }
    const out = {}
    for (const [k, v] of Object.entries(value)) {
      out[k] = regionalizeValue(v, countryCode)
    }
    return out
  }

  return value
}

export function regionalizeDocument(doc, countryCode, { countryProfile } = {}) {
  let out = regionalizeValue(doc, countryCode)
  if (!out || typeof out !== 'object') return out

  if (countryProfile && typeof out === 'object' && !Array.isArray(out)) {
    out = { ...out }
    if (countryProfile.currency) {
      if (out.defaultCurrency) out.defaultCurrency = countryProfile.currency
      if (out.currency) out.currency = countryProfile.currency
    }
    if (countryProfile.phoneCode) {
      if (out.defaultPhoneCode) out.defaultPhoneCode = countryProfile.phoneCode
    }
    if (countryProfile.name?.en && out.defaultCountry) {
      out.defaultCountry = {
        en: countryProfile.name.en,
        ar: countryProfile.name.ar || out.defaultCountry?.ar || '',
      }
    }
    if (countryProfile.primaryEmail) {
      if (out.primaryEmail) out.primaryEmail = countryProfile.primaryEmail
      if (out.email) out.email = countryProfile.primaryEmail
    }
    if (countryProfile.phoneDisplay) {
      if (out.phoneDisplay) out.phoneDisplay = countryProfile.phoneDisplay
      if (out.topBar?.phoneDisplay) out.topBar = { ...out.topBar, phoneDisplay: countryProfile.phoneDisplay }
    }
    if (countryProfile.phoneHref) {
      if (out.phoneHref) out.phoneHref = countryProfile.phoneHref
      if (out.topBar?.phoneHref) out.topBar = { ...out.topBar, phoneHref: countryProfile.phoneHref }
    }
  }

  return out
}

const TRUST_REGION_META = {
  AE: { value: 'UAE', labelEn: 'Focused Implementation', labelAr: 'تنفيذ مركّز' },
  SA: { value: 'KSA', labelEn: 'Saudi-Focused Implementation', labelAr: 'تنفيذ مخصص للسعودية' },
  QA: { value: 'Qatar', labelEn: 'Qatar-Focused Implementation', labelAr: 'تنفيذ مخصص لقطر' },
  OM: { value: 'Oman', labelEn: 'Oman-Focused Implementation', labelAr: 'تنفيذ مخصص لعُمان' },
  KW: { value: 'Kuwait', labelEn: 'Kuwait-Focused Implementation', labelAr: 'تنفيذ مخصص للكويت' },
  BH: { value: 'Bahrain', labelEn: 'Bahrain-Focused Implementation', labelAr: 'تنفيذ مخصص للبحرين' },
}

/** Apply country-specific trust stat values when falling back to the UAE baseline. */
export function regionalizeTrustStats(doc, countryCode, { countryProfile } = {}) {
  const country = normalizeCountryCode(countryCode)
  if (country === 'AE' || !doc || typeof doc !== 'object') return doc

  const profile = countryProfile || {}
  const currency = profile.currency || profile.defaultCurrency
  const region = TRUST_REGION_META[country]
  if (!currency && !region) return regionalizeDocument(doc, country, { countryProfile })

  const next = regionalizeDocument(doc, country, { countryProfile })
  if (!Array.isArray(next.items)) return next

  next.items = next.items.map((item) => {
    const stat = { ...item }
    if (stat.id === 's-currency' || stat.value === 'AED') {
      if (currency) stat.value = currency
      stat.label = {
        en: 'VAT-Ready Invoicing',
        ar: 'فوترة جاهزة للضريبة',
      }
    }
    if (stat.id === 's-solutions' && stat.value === '120+') {
      stat.value = 'Modular'
    }
    if (stat.id === 's-region' || stat.value === 'UAE' || stat.value === 'GCC') {
      if (region) {
        stat.value = region.value
        stat.label = { en: region.labelEn, ar: region.labelAr }
      } else if (profile.name?.en) {
        stat.value = profile.name.en
      }
    }
    return stat
  })

  return next
}

export async function loadCountryProfile(publishStore, countryCode) {
  try {
    const doc = await publishStore.readPublished('countries.json')
    const items = doc?.items || doc?.countries || []
    const match = items.find((item) => normalizeCountryCode(item.code) === normalizeCountryCode(countryCode))
    return match || null
  } catch {
    return null
  }
}
