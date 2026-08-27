/**
 * Unified locale-aware CMS content model — validation and constants.
 */
import { nanoid } from 'nanoid'
import { normalizeCountryCode } from './countryHelpers.mjs'
import { validateLocalePublishMarkers } from './localePublishMarkers.mjs'

export const LOCALE_CONTENT_SCHEMA_VERSION = 1

export const CONTENT_TYPES = new Set([
  'page',
  'pageSection',
  'solution',
  'industry',
  'businessModel',
  'navigation',
  'footer',
  'faq',
  'contact',
  'seo',
  'blog',
  'testimonial',
  'cityPage',
])

export const INHERITANCE_MODES = new Set(['global', 'inherit', 'override'])

export const TRANSLATION_STATUSES = new Set(['missing', 'draft', 'needs_review', 'approved', 'published', 'archived'])

export const PUBLICATION_STATUSES = new Set(['draft', 'published', 'unpublished', 'archived'])

/** Content types whose slug participates in public URL routing (slug must be unique per country/lang). */
export const SLUG_ROUTED_CONTENT_TYPES = new Set([
  'page',
  'solution',
  'industry',
  'businessModel',
  'contact',
  'faq',
  'blog',
  'testimonial',
  'cityPage',
])

/** Supported country → languages */
export const SUPPORTED_LOCALES = {
  AE: ['en', 'ar'],
  SA: ['en', 'ar'],
  QA: ['en', 'ar'],
  OM: ['en', 'ar'],
  KW: ['en', 'ar'],
  BH: ['en', 'ar'],
}

export const DEFAULT_GLOBAL_COUNTRY = 'AE'
export const DEFAULT_GLOBAL_LANG = 'en'

export function normalizeLocaleLang(lang) {
  return lang === 'ar' ? 'ar' : 'en'
}

export function localeKey(countryCode, lang) {
  return `${normalizeCountryCode(countryCode)}:${normalizeLocaleLang(lang)}`
}

export function isSupportedLocale(countryCode, lang) {
  const c = normalizeCountryCode(countryCode)
  const l = normalizeLocaleLang(lang)
  return Array.isArray(SUPPORTED_LOCALES[c]) && SUPPORTED_LOCALES[c].includes(l)
}

export function recordIdentityKey(contentType, globalIdentity) {
  return `${contentType}:${globalIdentity}`
}

export function makeLocaleRecordId() {
  return `loc_${nanoid(12)}`
}

export function makeTranslationGroupId() {
  return `grp_${nanoid(10)}`
}

/**
 * @param {unknown} record
 * @param {{ existingRecords?: object[], allowMissingFields?: boolean }} opts
 */
export function validateLocaleRecord(record, opts = {}) {
  const errors = []
  if (!record || typeof record !== 'object') {
    return { ok: false, errors: ['Record must be an object'] }
  }

  const r = /** @type {Record<string, unknown>} */ (record)
  const required = [
    'id',
    'contentType',
    'globalIdentity',
    'countryCode',
    'languageCode',
    'translationGroupId',
    'inheritanceMode',
    'translationStatus',
    'publicationStatus',
    'enabled',
  ]

  for (const field of required) {
    if (r[field] === undefined || r[field] === null || r[field] === '') {
      if (!opts.allowMissingFields) errors.push(`Missing required field: ${field}`)
    }
  }

  if (r.contentType && !CONTENT_TYPES.has(String(r.contentType))) {
    errors.push(`Invalid contentType: ${r.contentType}`)
  }
  if (r.inheritanceMode && !INHERITANCE_MODES.has(String(r.inheritanceMode))) {
    errors.push(`Invalid inheritanceMode: ${r.inheritanceMode}`)
  }
  if (r.translationStatus && !TRANSLATION_STATUSES.has(String(r.translationStatus))) {
    errors.push(`Invalid translationStatus: ${r.translationStatus}`)
  }
  if (r.publicationStatus && !PUBLICATION_STATUSES.has(String(r.publicationStatus))) {
    errors.push(`Invalid publicationStatus: ${r.publicationStatus}`)
  }

  const country = normalizeCountryCode(String(r.countryCode || ''))
  const lang = normalizeLocaleLang(String(r.languageCode || ''))
  if (country && lang && !isSupportedLocale(country, lang)) {
    errors.push(`Unsupported locale combination: ${country}/${lang}`)
  }

  if (r.inheritanceMode === 'override' && !r.sourceRecordId && !r.payload?._seedVersion) {
    errors.push('Override records require sourceRecordId')
  }

  if (lang === 'ar' && r.publicationStatus === 'published' && r.translationStatus !== 'approved' && r.translationStatus !== 'published') {
    errors.push('Arabic content cannot publish without approved translation status')
  }

  const existing = opts.existingRecords || []

  if (r.sourceRecordId) {
    const source = existing.find((x) => x.id === r.sourceRecordId)
    if (!source && !opts.allowMissingFields) {
      errors.push(`sourceRecordId references missing or deleted record: ${r.sourceRecordId}`)
    }
    if (source && r.id === source.id) {
      errors.push('Record cannot inherit from itself')
    }
    const loop = detectInheritanceLoop(r, existing)
    if (loop) errors.push(`Invalid inheritance loop detected via ${loop}`)
  }
  const dup = existing.find(
    (x) =>
      x.id !== r.id &&
      x.contentType === r.contentType &&
      x.globalIdentity === r.globalIdentity &&
      normalizeCountryCode(x.countryCode) === country &&
      normalizeLocaleLang(x.languageCode) === lang &&
      (x.citySlug || null) === (r.citySlug || null),
  )
  if (dup) errors.push(`Duplicate record for ${r.contentType}/${r.globalIdentity} at ${country}/${lang}${r.citySlug ? `/${r.citySlug}` : ''}`)

  if (r.slug && typeof r.slug === 'string' && SLUG_ROUTED_CONTENT_TYPES.has(String(r.contentType))) {
    const slugDup = existing.find(
      (x) =>
        x.id !== r.id &&
        x.slug === r.slug &&
        SLUG_ROUTED_CONTENT_TYPES.has(String(x.contentType)) &&
        normalizeCountryCode(x.countryCode) === country &&
        normalizeLocaleLang(x.languageCode) === lang &&
        (x.citySlug || null) === (r.citySlug || null),
    )
    if (slugDup) errors.push(`Duplicate slug "${r.slug}" within ${country}/${lang}${r.citySlug ? `/${r.citySlug}` : ''}`)
  }

  return { ok: errors.length === 0, errors }
}

export function canPublishRecord(record, { countryEnabled = true } = {}) {
  if (!countryEnabled) return { ok: false, reason: 'Country is disabled' }
  if (record.enabled === false) return { ok: false, reason: 'Record is disabled' }
  if (record.publicationStatus === 'archived') return { ok: false, reason: 'Record is archived' }
  if (record.translationStatus === 'missing') return { ok: false, reason: 'Translation is missing' }
  if (normalizeLocaleLang(record.languageCode) === 'ar' && !['approved', 'published'].includes(record.translationStatus)) {
    return { ok: false, reason: 'Arabic requires approved translation status' }
  }
  if (!record.payload || (typeof record.payload === 'object' && Object.keys(record.payload).length === 0)) {
    if (record.inheritanceMode === 'override') return { ok: false, reason: 'Override has incomplete required fields' }
  }
  const markerCheck = validateLocalePublishMarkers(record)
  if (!markerCheck.ok) return markerCheck
  return { ok: true }
}

export function defaultLocaleRecord(partial = {}) {
  const now = new Date().toISOString()
  return {
    id: makeLocaleRecordId(),
    contentType: 'page',
    globalIdentity: '',
    slug: '',
    countryCode: DEFAULT_GLOBAL_COUNTRY,
    languageCode: DEFAULT_GLOBAL_LANG,
    translationGroupId: makeTranslationGroupId(),
    sourceRecordId: null,
    inheritanceMode: 'global',
    translationStatus: 'draft',
    publicationStatus: 'draft',
    enabled: true,
    publishedAt: null,
    updatedAt: now,
    sortOrder: 0,
    seo: null,
    payload: {},
    ...partial,
  }
}

export function detectInheritanceLoop(record, records, visited = new Set()) {
  if (!record?.sourceRecordId) return null
  if (visited.has(record.id)) return record.id
  visited.add(record.id)
  const source = (records || []).find((x) => x.id === record.sourceRecordId)
  if (!source) return null
  if (source.id === record.id) return record.id
  return detectInheritanceLoop(source, records, visited)
}

export function findRecordByIdentity(records, contentType, globalIdentity, countryCode, lang, citySlug = null) {
  const country = normalizeCountryCode(countryCode)
  const language = normalizeLocaleLang(lang)
  const city = citySlug || null
  return (records || []).find(
    (r) =>
      r.contentType === contentType &&
      r.globalIdentity === globalIdentity &&
      normalizeCountryCode(r.countryCode) === country &&
      normalizeLocaleLang(r.languageCode) === language &&
      (r.citySlug || null) === city,
  )
}

export const LOCALE_ROUTE_REGISTRY = [
  { slug: 'erp', contentType: 'solution', globalIdentity: 'erp', template: 'cms-page' },
  { slug: 'contact', contentType: 'contact', globalIdentity: 'contact', template: 'cms-page' },
  { slug: 'industries', contentType: 'industry', globalIdentity: 'industries-list', template: 'cms-page' },
  { slug: 'solutions', contentType: 'solution', globalIdentity: 'solutions-list', template: 'cms-page' },
  { slug: 'business-models', contentType: 'businessModel', globalIdentity: 'business-models-list', template: 'cms-page' },
  { slug: 'faqs', contentType: 'faq', globalIdentity: 'faqs', template: 'cms-page' },
  { slug: 'testimonials', contentType: 'testimonial', globalIdentity: 'testimonials', template: 'cms-page' },
]

/** Dynamic detail routes: /software/:kind/:slug */
export function softwareDetailRoute(kind, slug) {
  const k = kind === 'module' ? 'solution' : kind === 'industry' ? 'industry' : null
  if (!k || !slug) return null
  return {
    slug,
    contentType: k,
    globalIdentity: `${kind}:${slug}`,
    template: 'software-detail',
    kind,
  }
}

export const SETUP_CONTENT_TYPES = [
  'page',
  'pageSection',
  'solution',
  'industry',
  'businessModel',
  'navigation',
  'footer',
  'faq',
  'contact',
  'seo',
]
