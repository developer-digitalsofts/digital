/**
 * Locale-aware content resolution service — reusable resolver for all CMS content types.
 * Resolution order: country+language override → country default language → approved global → missing.
 */
import { readBilingualText } from './contentHelpers.mjs'
import { normalizeCountryCode } from './countryHelpers.mjs'
import {
  DEFAULT_GLOBAL_COUNTRY,
  DEFAULT_GLOBAL_LANG,
  canPublishRecord,
  normalizeLocaleLang,
} from './localeContentModel.mjs'

export { normalizeLocaleLang, localeKey } from './localeContentModel.mjs'
export { detectCountryFromRequest } from './localeDetect.mjs'

export const TRANSLATION_STATUSES = new Set(['missing', 'draft', 'needs_review', 'approved', 'published'])

export const RESOLVED_FROM = {
  CITY_OVERRIDE: 'city_override',
  LOCALE_OVERRIDE: 'locale_override',
  COUNTRY_DEFAULT: 'country_default',
  GCC_SHARED: 'gcc_shared',
  GLOBAL: 'global',
  MISSING: 'missing',
}

export const RESOLVABLE_CONTENT_TYPES = new Set([
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

export function findLocaleRecord(records, { contentType, globalIdentity, slug, countryCode, lang, citySlug = null }) {
  const country = normalizeCountryCode(countryCode)
  const language = normalizeLocaleLang(lang)
  const city = citySlug ? String(citySlug).toLowerCase() : null
  const list = records || []

  const match = (c, l, cityFilter) =>
    list.find((r) => {
      if (r.enabled === false) return false
      if (contentType && r.contentType !== contentType) return false
      if (globalIdentity && r.globalIdentity !== globalIdentity) return false
      if (slug && r.slug !== slug) return false
      const recordCity = r.citySlug ? String(r.citySlug).toLowerCase() : null
      if (cityFilter !== undefined && recordCity !== cityFilter) return false
      return normalizeCountryCode(r.countryCode) === c && normalizeLocaleLang(r.languageCode) === l
    })

  const matches = {
    exact: match(country, language, city),
    countryLevel: city ? match(country, language, null) : null,
    countryDefault: language !== 'en' ? match(country, 'en', city) : null,
    countryLevelDefault: city && language !== 'en' ? match(country, 'en', null) : null,
    global: match(DEFAULT_GLOBAL_COUNTRY, DEFAULT_GLOBAL_LANG, null),
  }

  // Legacy shape for non-city resolution
  if (!city) {
    return {
      exact: matches.exact,
      countryDefault: matches.countryDefault,
      global: matches.global,
    }
  }

  return matches
}

export function resolveLocaleRecord(_record, matches, { context = 'public', countryEnabled = true, allowFallback = true, allowGlobalFallback = true, allowArabicDraftPreview = false, citySlug = null } = {}) {
  const buildMeta = (resolvedFrom, source, translationStatus, publicationStatus, inherited, fallbackUsed = false) => ({
    resolvedFrom,
    inherited,
    customized:
      (resolvedFrom === RESOLVED_FROM.LOCALE_OVERRIDE || resolvedFrom === RESOLVED_FROM.CITY_OVERRIDE) &&
      source?.inheritanceMode === 'override',
    sourceCountry: source?.countryCode || DEFAULT_GLOBAL_COUNTRY,
    sourceLanguage: source?.languageCode || DEFAULT_GLOBAL_LANG,
    citySlug: source?.citySlug || null,
    translationStatus,
    publicationStatus,
    fallbackUsed,
    missing: resolvedFrom === RESOLVED_FROM.MISSING,
  })

  const isPublic = context === 'public'

  const tryRecord = (rec, resolvedFrom, fallbackUsed = false) => {
    if (!rec) return null
    const pub = rec.publicationStatus || 'draft'
    const trans = rec.translationStatus || 'draft'
    const langCode = normalizeLocaleLang(rec.languageCode)
    const arabicDraftPreview =
      allowArabicDraftPreview &&
      langCode === 'ar' &&
      pub !== 'published' &&
      ['draft', 'needs_review'].includes(trans) &&
      rec.payload &&
      typeof rec.payload === 'object' &&
      Object.keys(rec.payload).length > 0

    if (isPublic && pub !== 'published' && !arabicDraftPreview) return null
    if (isPublic && !arabicDraftPreview) {
      const can = canPublishRecord(rec, { countryEnabled })
      if (!can.ok) return null
    }
    return {
      record: rec,
      meta: buildMeta(
        resolvedFrom,
        rec,
        trans,
        pub,
        resolvedFrom !== RESOLVED_FROM.LOCALE_OVERRIDE && resolvedFrom !== RESOLVED_FROM.CITY_OVERRIDE,
        arabicDraftPreview ? false : fallbackUsed,
      ),
    }
  }

  let result = tryRecord(matches.exact, citySlug ? RESOLVED_FROM.CITY_OVERRIDE : RESOLVED_FROM.LOCALE_OVERRIDE)
  if (result) return result

  if (allowFallback && citySlug && matches.countryLevel) {
    result = tryRecord(matches.countryLevel, RESOLVED_FROM.LOCALE_OVERRIDE, true)
    if (result) return result
  }

  if (allowFallback) {
    result = tryRecord(matches.countryDefault, RESOLVED_FROM.COUNTRY_DEFAULT, true)
    if (result) return result
  }

  if (allowFallback && citySlug && matches.countryLevelDefault) {
    result = tryRecord(matches.countryLevelDefault, RESOLVED_FROM.COUNTRY_DEFAULT, true)
    if (result) return result
  }

  if (allowFallback) {
    result = tryRecord(matches.gccShared, RESOLVED_FROM.GCC_SHARED, true)
    if (result) return result
  }

  if (allowFallback && allowGlobalFallback) {
    result = tryRecord(matches.global, RESOLVED_FROM.GLOBAL, true)
    if (result) return result
  }

  if (!isPublic) {
    const draft = matches.exact || matches.countryLevel || matches.countryDefault || matches.countryLevelDefault || matches.gccShared || matches.global
    if (draft) {
      const resolvedFrom = matches.exact
        ? citySlug
          ? RESOLVED_FROM.CITY_OVERRIDE
          : RESOLVED_FROM.LOCALE_OVERRIDE
        : matches.countryLevel
          ? RESOLVED_FROM.LOCALE_OVERRIDE
          : matches.countryDefault
            ? RESOLVED_FROM.COUNTRY_DEFAULT
            : matches.gccShared
              ? RESOLVED_FROM.GCC_SHARED
              : RESOLVED_FROM.GLOBAL
      return {
        record: draft,
        meta: buildMeta(
          resolvedFrom,
          draft,
          draft.translationStatus || 'draft',
          draft.publicationStatus || 'draft',
          resolvedFrom !== RESOLVED_FROM.LOCALE_OVERRIDE && resolvedFrom !== RESOLVED_FROM.CITY_OVERRIDE,
          resolvedFrom !== RESOLVED_FROM.LOCALE_OVERRIDE && resolvedFrom !== RESOLVED_FROM.CITY_OVERRIDE,
        ),
      }
    }
  }

  return {
    record: null,
    meta: buildMeta(RESOLVED_FROM.MISSING, null, 'missing', 'draft', false),
  }
}

export function mergePayloadFromBaseline(record, baselineDoc, lang) {
  if (!record) return {}
  const payload = { ...(record.payload || {}) }
  if (baselineDoc && (payload.useBaseline === true || record.inheritanceMode === 'inherit' || record.inheritanceMode === 'global')) {
    const merged = { ...baselineDoc, ...(payload.fields || {}) }
    const out = { ...merged, ...payload }
    delete out.fields
    delete out.useBaseline
    return flattenBilingualFields(out, lang)
  }
  return flattenBilingualFields(payload, lang)
}

function flattenBilingualFields(obj, lang) {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return obj
  const out = { ...obj }
  for (const [k, v] of Object.entries(out)) {
    if (v && typeof v === 'object' && !Array.isArray(v) && ('en' in v || 'ar' in v)) {
      out[k] = readBilingualText(v, lang)
    }
  }
  return out
}

export function resolveContent(store, query, opts = {}) {
  const {
    contentType,
    globalIdentity,
    slug,
    countryCode = DEFAULT_GLOBAL_COUNTRY,
    lang = DEFAULT_GLOBAL_LANG,
    citySlug = null,
  } = query
  let matches

  if (slug && !globalIdentity && !contentType) {
    const list = store.records || []
    const normCountry = normalizeCountryCode(countryCode)
    const normLang = normalizeLocaleLang(lang)
    const normCity = citySlug ? String(citySlug).toLowerCase() : null
    const exactSlug = list.find(
      (r) =>
        r.slug === slug &&
        normalizeCountryCode(r.countryCode) === normCountry &&
        normalizeLocaleLang(r.languageCode) === normLang &&
        (r.citySlug ? String(r.citySlug).toLowerCase() : null) === normCity,
    )
    if (exactSlug) {
      matches = { exact: exactSlug, countryDefault: null, global: null }
      const globalSlug = list.find(
        (r) =>
          r.slug === slug &&
          normalizeCountryCode(r.countryCode) === DEFAULT_GLOBAL_COUNTRY &&
          r.languageCode === DEFAULT_GLOBAL_LANG &&
          !r.citySlug,
      )
      if (globalSlug) matches.global = globalSlug
      if (normLang !== 'en') {
        matches.countryDefault = list.find(
          (r) =>
            r.slug === slug &&
            normalizeCountryCode(r.countryCode) === normCountry &&
            r.languageCode === 'en' &&
            (r.citySlug ? String(r.citySlug).toLowerCase() : null) === normCity,
        )
      }
      if (normCity) {
        matches.countryLevel = list.find(
          (r) =>
            r.slug === slug &&
            normalizeCountryCode(r.countryCode) === normCountry &&
            normalizeLocaleLang(r.languageCode) === normLang &&
            !r.citySlug,
        )
      }
    } else {
      matches = findLocaleRecord(list, { contentType, globalIdentity, slug, countryCode, lang, citySlug })
    }
  } else {
    matches = findLocaleRecord(store.records || [], { contentType, globalIdentity, slug, countryCode, lang, citySlug })
  }

  return resolveLocaleRecord(null, matches, { ...opts, citySlug })
}

export function resolveContentWithBaseline(store, query, baselineDoc, opts = {}) {
  const resolved = resolveContent(store, query, opts)
  if (!resolved.record) return { ...resolved, payload: null, publicView: null }
  const language = normalizeLocaleLang(query.lang)
  const payload = mergePayloadFromBaseline(resolved.record, baselineDoc, language)
  return {
    ...resolved,
    payload,
    publicView: shapePublicLocaleView(resolved.record, payload, language, resolved.meta),
  }
}

export function shapePublicLocaleView(record, payload, lang, meta) {
  if (!record) return null
  const title = payload.title || payload.heading
  const titleText = typeof title === 'string' ? title : readBilingualText(title, lang)
  const view = {
    id: record.id,
    slug: record.slug,
    contentType: record.contentType,
    globalIdentity: record.globalIdentity,
    template: payload.template || 'cms-page',
    title: titleText,
    heading: payload.heading
      ? typeof payload.heading === 'string'
        ? payload.heading
        : readBilingualText(payload.heading, lang)
      : titleText,
    shortDescription: payload.shortDescription
      ? typeof payload.shortDescription === 'string'
        ? payload.shortDescription
        : readBilingualText(payload.shortDescription, lang)
      : '',
    sections: Array.isArray(payload.sections) ? payload.sections.filter((s) => s.visible !== false) : [],
    seo: record.seo || payload.seo || {},
    sortOrder: record.sortOrder ?? 0,
    citySlug: record.citySlug || payload.citySlug || null,
    _locale: meta,
  }

  if (payload.template === 'software-detail') {
    view.kind = payload.kind
    view.label =
      payload.label && typeof payload.label === 'object'
        ? readBilingualText(payload.label, lang)
        : titleText
    view.hero = localizeSoftwareDetailBlock(payload.hero, lang)
    view.demoCta = localizeSoftwareDetailBlock(payload.demoCta, lang)
    view.fields = localizeSoftwareDetailFields(payload.fields, lang)
    view.regional = localizeSoftwareDetailRegional(payload.regional, lang)
  }

  return view
}

function localizeSoftwareDetailBlock(block, lang) {
  if (!block || typeof block !== 'object') return null
  const out = {}
  for (const [key, value] of Object.entries(block)) {
    if (value && typeof value === 'object' && ('en' in value || 'ar' in value)) {
      out[key] = readBilingualText(value, lang)
    } else {
      out[key] = value
    }
  }
  return out
}

function localizeSoftwareDetailFields(fields, lang) {
  if (!fields || typeof fields !== 'object') return null
  const out = {}
  for (const [key, value] of Object.entries(fields)) {
    out[key] =
      value && typeof value === 'object' && ('en' in value || 'ar' in value)
        ? readBilingualText(value, lang)
        : value
  }
  return out
}

function localizeSoftwareDetailRegional(regional, lang) {
  if (!regional || typeof regional !== 'object') return null
  const citiesRaw = regional.cities
  const companiesRaw = regional.companies
  const cities = Array.isArray(citiesRaw)
    ? citiesRaw
    : citiesRaw && typeof citiesRaw === 'object'
      ? citiesRaw[lang] || citiesRaw.en || []
      : []
  const companies = Array.isArray(companiesRaw)
    ? companiesRaw
    : companiesRaw && typeof companiesRaw === 'object'
      ? companiesRaw[lang] || companiesRaw.en || []
      : []
  return {
    currency: regional.currency,
    currencyName:
      regional.currencyName && typeof regional.currencyName === 'object'
        ? readBilingualText(regional.currencyName, lang)
        : regional.currencyName,
    countryCode: regional.countryCode,
    countryName:
      regional.countryName && typeof regional.countryName === 'object'
        ? readBilingualText(regional.countryName, lang)
        : regional.countryName,
    cityPhrase:
      regional.cityPhrase && typeof regional.cityPhrase === 'object'
        ? readBilingualText(regional.cityPhrase, lang)
        : regional.cityPhrase,
    cities,
    companies,
    vatLabel:
      regional.vatLabel && typeof regional.vatLabel === 'object'
        ? readBilingualText(regional.vatLabel, lang)
        : regional.vatLabel,
    dashboard: regional.dashboard || null,
    branches: Array.isArray(regional.branches) ? regional.branches : [],
  }
}

/** Parse software detail path segments into locale query fields. */
export function parseSoftwareLocalePath(kind, slug) {
  const k = kind === 'module' || kind === 'industry' ? kind : null
  if (!k || !slug) return null
  return {
    contentType: k === 'module' ? 'solution' : 'industry',
    globalIdentity: `${k}:${slug}`,
    slug,
  }
}

/** Legacy nested-locales helper — kept for blog/testimonial documents using locales map. */
export function resolveLocalizedRecord(record, { countryCode = 'AE', lang = 'en', globalCountry = 'AE', globalLang = 'en' } = {}) {
  if (!record || typeof record !== 'object') {
    return { value: record, source: 'missing', status: 'missing' }
  }

  const country = normalizeCountryCode(countryCode)
  const language = normalizeLocaleLang(lang)
  const key = `${country}:${language}`
  const locales = record.locales && typeof record.locales === 'object' ? record.locales : {}
  const exact = locales[key]
  if (exact) {
    return {
      value: exact,
      source: 'locale_override',
      status: exact.translationStatus || exact.status || 'draft',
    }
  }

  const countryDefault = locales[`${country}:en`]
  if (language === 'ar' && countryDefault) {
    return {
      value: countryDefault,
      source: 'country_default',
      status: countryDefault.translationStatus || countryDefault.status || 'draft',
    }
  }

  const global = locales[`${globalCountry}:${globalLang}`] || record
  if (global && global !== record) {
    return {
      value: global,
      source: 'global',
      status: global.translationStatus || global.status || 'published',
    }
  }

  if (record.translationStatus === 'published' || record.status === 'published') {
    return { value: record, source: 'global', status: 'published' }
  }

  return { value: record, source: 'global', status: record.translationStatus || record.status || 'draft' }
}

export function filterByLocaleScope(items, countryCode, lang, { includeDraft = false } = {}) {
  const country = normalizeCountryCode(countryCode)
  const language = normalizeLocaleLang(lang)
  return (items || []).filter((item) => {
    const scoped = item?.countryCode ? normalizeCountryCode(item.countryCode) : null
    if (scoped && scoped !== country && scoped !== 'GCC') return false
    const langs = Array.isArray(item?.languages) ? item.languages : null
    if (langs && langs.length && !langs.includes(language)) return false
    if (!includeDraft && item?.status && item.status !== 'published') return false
    return true
  })
}

