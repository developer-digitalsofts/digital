/**
 * Publish-time validation: block publishing locale overrides that still contain
 * another country's currency, cities or demo company names.
 */
import { GCC_COUNTRIES } from './gccLocalizedContent/profiles.mjs'
import { normalizeCountryCode } from './countryHelpers.mjs'

const UAE_MARKERS = [
  'AED',
  'Dubai Holdings',
  'Emirates Supplies',
  'Al Noor Trading',
  'Gulf Retail LLC',
]

const UAE_CITY_MARKERS = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman']

/** Intentional regional support copy — not treated as content leakage. */
const ALLOWED_PHRASES = [
  'UAE headquarters',
  'Regional GCC support',
  'info@digitalmanager.ae',
  '+971 58 117 4911',
  'from our UAE team',
  'المقر في الإمارات',
  'دعم إقليمي لدول الخليج',
]

const COUNTRY_REQUIRED = {
  AE: { currency: 'AED', cities: ['Dubai', 'Abu Dhabi'] },
  SA: { currency: 'SAR', cities: ['Riyadh', 'Jeddah'], forbidden: UAE_MARKERS },
  QA: { currency: 'QAR', cities: ['Doha'], forbidden: UAE_MARKERS },
  OM: { currency: 'OMR', cities: ['Muscat'], forbidden: UAE_MARKERS },
  KW: { currency: 'KWD', cities: ['Kuwait City', 'Hawalli'], forbidden: UAE_MARKERS },
  BH: { currency: 'BHD', cities: ['Manama', 'Riffa', 'Muharraq'], forbidden: UAE_MARKERS },
}

function collectStrings(value, out = []) {
  if (value == null) return out
  if (typeof value === 'string') {
    out.push(value)
    return out
  }
  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, out)
    return out
  }
  if (typeof value === 'object') {
    for (const v of Object.values(value)) collectStrings(v, out)
  }
  return out
}

export function validateLocalePublishMarkers(record) {
  const country = normalizeCountryCode(record?.countryCode)
  if (country === 'AE') return { ok: true }

  const rules = COUNTRY_REQUIRED[country]
  if (!rules) return { ok: true }

  const haystack = collectStrings(record?.payload || {})
    .concat(collectStrings(record?.seo || {}))
    .join('\n')

  let scrubbed = haystack
  for (const phrase of ALLOWED_PHRASES) {
    scrubbed = scrubbed.split(phrase).join('')
  }

  const forbidden = [...(rules.forbidden || UAE_MARKERS), ...UAE_CITY_MARKERS]
  for (const marker of forbidden) {
    if (scrubbed.includes(marker)) {
      return {
        ok: false,
        reason: `Publish blocked: ${country} content still references "${marker}" (UAE/global marker)`,
      }
    }
  }

  if (record.inheritanceMode === 'override') {
    const isSoftwareDetail =
      typeof record.globalIdentity === 'string' &&
      record.globalIdentity.includes(':') &&
      ['solution', 'industry'].includes(record.contentType)
    const needsLocalMarkers =
      isSoftwareDetail ||
      ['hero', 'stats', 'about', 'valueChain', 'modules', 'industries', 'erp', 'contact'].includes(
        record.globalIdentity,
      )
    if (needsLocalMarkers) {
      const hasCurrency = scrubbed.includes(rules.currency)
      const hasCity = rules.cities.some((city) => scrubbed.includes(city))
      if (!hasCurrency && !hasCity) {
        return {
          ok: false,
          reason: `Publish blocked: ${country} override must include ${rules.currency} or a local city reference`,
        }
      }
    }
  }

  return { ok: true }
}

export function countryPublishMarkerSummary() {
  return GCC_COUNTRIES.filter((c) => c !== 'AE').map((code) => ({
    countryCode: code,
    ...COUNTRY_REQUIRED[code],
  }))
}
