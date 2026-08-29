/**
 * Runtime regionalization for software/industry detail page copy.
 * Pakistan (PK) is the default market; replacements apply when countryCode !== 'PK'.
 */
import type { GccCountryCode } from '../config/gccCountries'
import { normalizeCountryCode } from '../config/gccCountries'
import { getDashboardRegionalData } from '../components/hero/dashboards/dashboardRegionalData'
import { getCountryProfile, vatLabelFor } from './countryProfiles'

const BASELINE_CITIES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Al Ain']
const BASELINE_COMPANIES = ['Dubai Holdings', 'Emirates Supplies', 'Al Noor Trading', 'Gulf Retail LLC']

const ALLOWED_PHRASES: string[] = []

function scrubAllowed(text: string): string {
  let out = text
  for (const phrase of ALLOWED_PHRASES) {
    out = out.split(phrase).join('\0')
  }
  return out
}

function restoreAllowed(text: string, original: string): string {
  let out = text
  for (const phrase of ALLOWED_PHRASES) {
    if (original.includes(phrase)) {
      out = out.replace('\0', phrase)
    }
  }
  return out.replace(/\0/g, '')
}

function replaceRegionalString(text: string, countryCode: GccCountryCode): string {
  if (!text) return text

  const profile = getCountryProfile(countryCode)
  const regional = getDashboardRegionalData(countryCode)
  const scrubbed = scrubAllowed(text)
  let out = scrubbed

  for (const company of BASELINE_COMPANIES) {
    const idx = BASELINE_COMPANIES.indexOf(company)
    const replacement = regional.companies[idx] ?? regional.companies[0]
    out = out.split(company).join(replacement)
  }

  for (const city of BASELINE_CITIES) {
    const idx = BASELINE_CITIES.indexOf(city)
    const replacement = profile.cities.en[idx] ?? profile.cities.en[0]
    out = out.split(city).join(replacement)
  }

  out = out
    .split('United Arab Emirates').join(profile.fullName.en)
    .split('across the UAE').join(`across ${profile.fullName.en}`)
    .split('in the UAE').join(`in ${profile.fullName.en}`)
    .split('for the UAE').join(`for ${profile.fullName.en}`)
    .split('from the UAE').join(`from ${profile.fullName.en}`)
    .split('the UAE').join(profile.fullName.en)
    .split('UAE VAT-compliant').join(`${profile.currency} invoicing compliant`)
    .split('UAE VAT-integrated').join(`${profile.currency} invoicing integrated`)
    .split('UAE VAT-Integrated').join(`${profile.currency} Invoicing Integrated`)
    .split('UAE VAT & Tax Compliance').join(`${vatLabelFor(countryCode)} & Tax Compliance`)
    .split('UAE VAT POS').join(`${profile.name.en} VAT POS`)
    .split('UAE VAT').join(vatLabelFor(countryCode))
    .split('UAE Dirham (AED)').join(profile.currencyName.en)
    .split('UAE').join(profile.name.en)
    .split('AED').join(profile.currency)

  return restoreAllowed(out, text)
}

function walkRegionalize<T>(value: T, countryCode: GccCountryCode): T {
  if (typeof value === 'string') return replaceRegionalString(value, countryCode) as T
  if (Array.isArray(value)) return value.map((item) => walkRegionalize(item, countryCode)) as T
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(value)) {
      out[k] = walkRegionalize(v, countryCode)
    }
    return out as T
  }
  return value
}

export function regionalizeSoftwareDetailPage<T>(page: T, countryCode: string): T {
  const code = normalizeCountryCode(countryCode)
  // PK is the default market (`isDefault = code === 'PK'`). Baseline content still
  // uses AED/UAE strings, so we always walk and rewrite to the active profile.
  return walkRegionalize(page, code)
}

export function regionalizeRichPage<T>(page: T, countryCode: string): T {
  return regionalizeSoftwareDetailPage(page, countryCode)
}
