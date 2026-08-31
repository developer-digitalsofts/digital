/**
 * City-scoped homepage CMS sections for Pakistan multi-city sites.
 * Each section is stored as a locale record with citySlug set.
 */
import { PK_CITY_NAMES, buildCityHomePath, isPkCitySlug } from './pakistanConfig.mjs'
import { normalizeCountryCode } from './countryHelpers.mjs'
import { DEFAULT_GLOBAL_COUNTRY, DEFAULT_GLOBAL_LANG, normalizeLocaleLang } from './localeContentModel.mjs'
import { mergePayloadFromBaseline, resolveContent, resolveContentWithBaseline } from './localeHelpers.mjs'
import { readBilingualText } from './contentHelpers.mjs'

export const CITY_CMS_SEED_VERSION = 'pk-city-cms-sections-v1'

/** Homepage sections editable per city (mirrors national JSON + SEO). */
export const CITY_CMS_SECTIONS = {
  hero: { contentType: 'pageSection', globalIdentity: 'hero', file: 'hero.json', adminKey: 'hero' },
  stats: { contentType: 'pageSection', globalIdentity: 'stats', file: 'stats.json', adminKey: 'stats' },
  industries: { contentType: 'pageSection', globalIdentity: 'industries', file: 'industries.json', adminKey: 'industries' },
  valueChain: { contentType: 'pageSection', globalIdentity: 'valueChain', file: 'valueChain.json', adminKey: 'valueChain' },
  modules: { contentType: 'pageSection', globalIdentity: 'modules', file: 'modules.json', adminKey: 'modules' },
  testimonials: { contentType: 'pageSection', globalIdentity: 'testimonials', file: 'testimonials.json', adminKey: 'testimonials' },
  faqs: { contentType: 'faq', globalIdentity: 'faqs', file: 'faqs.json', adminKey: 'faqs' },
  demoCta: { contentType: 'pageSection', globalIdentity: 'demoCta', file: 'demoCta.json', adminKey: 'demoCta' },
  personalizedDemo: {
    contentType: 'pageSection',
    globalIdentity: 'personalizedDemo',
    file: 'personalizedDemo.json',
    adminKey: 'personalizedDemo',
  },
  pageSections: { contentType: 'pageSection', globalIdentity: 'pageSections', file: 'pageSections.json', adminKey: 'pageSections' },
  seo: { contentType: 'seo', globalIdentity: 'site', file: 'seo.json', adminKey: 'seo' },
}

export const CITY_CMS_SECTION_KEYS = Object.keys(CITY_CMS_SECTIONS)

export function citySectionRecordId(citySlug, globalIdentity) {
  const city = String(citySlug || '').toLowerCase()
  const identity = String(globalIdentity || 'section').toLowerCase().replace(/[^a-z0-9-]/g, '-')
  return `loc_pk_city_${city}_${identity}_en`
}

export function citySectionQuery(citySlug, sectionKey) {
  const def = CITY_CMS_SECTIONS[sectionKey]
  if (!def) return null
  return {
    contentType: def.contentType,
    globalIdentity: def.globalIdentity,
    slug: def.globalIdentity,
    countryCode: 'PK',
    lang: 'en',
    citySlug: String(citySlug).toLowerCase(),
  }
}

function clone(value) {
  return value && typeof value === 'object' ? JSON.parse(JSON.stringify(value)) : value
}

function stripSeedMeta(payload) {
  if (!payload || typeof payload !== 'object') return payload
  const next = { ...payload }
  delete next._seedVersion
  delete next._seedAt
  delete next._citySlug
  delete next._sectionKey
  return next
}

function resolveCitySectionDoc(store, query, baselineDoc, opts) {
  const resolved = resolveContent(store, query, opts)
  const record = resolved.record
  if (!record) return { doc: clone(baselineDoc), record: null }

  const isCityOverride =
    record.citySlug === query.citySlug &&
    record.inheritanceMode === 'override' &&
    (opts.context === 'preview' || record.publicationStatus === 'published')

  if (query.contentType === 'seo') {
    const seoDoc = isCityOverride && record.seo ? clone(record.seo) : clone(baselineDoc)
    return { doc: seoDoc, record: isCityOverride ? record : null }
  }

  if (isCityOverride) {
    const payload = stripSeedMeta(record.payload || {})
    if (Object.keys(payload).length > 0) return { doc: payload, record }
  }

  return { doc: clone(baselineDoc), record: null }
}

async function readBaselineDoc(publishStore, file) {
  try {
    const doc = await publishStore.readPublished(file)
    return publishStore.stripMeta(doc) ?? doc ?? {}
  } catch {
    return {}
  }
}

function applyCitySeoCanonical(seo, citySlug) {
  const next = clone(seo) || {}
  const cityName = PK_CITY_NAMES[citySlug] || citySlug
  const canonical = buildCityHomePath(citySlug)
  next.canonicalUrl = canonical
  if (!readBilingualText(next.pageTitle, 'en')) {
    next.pageTitle = { en: `DigitalManager in ${cityName} | ERP & Business Management Software`, ar: '' }
  }
  if (!readBilingualText(next.metaDescription, 'en')) {
    next.metaDescription = {
      en: `DigitalManager is cloud ERP software for ${cityName} businesses — PKR finance, inventory, POS and payroll.`,
      ar: '',
    }
  }
  const title = readBilingualText(next.pageTitle, 'en')
  const desc = readBilingualText(next.metaDescription, 'en')
  next.ogTitle = next.ogTitle || { en: title, ar: title }
  next.ogDescription = next.ogDescription || { en: desc, ar: desc }
  next.twitterTitle = next.twitterTitle || { en: title, ar: title }
  next.twitterDescription = next.twitterDescription || { en: desc, ar: desc }
  next.robotsIndex = next.robotsIndex || 'index'
  next.robotsFollow = next.robotsFollow || 'follow'
  return next
}

function hideStatsForCity(pageSections) {
  const next = clone(pageSections) || { sections: [] }
  const byId = new Map((next.sections || []).map((s) => [s.id, { ...s }]))
  const stats = byId.get('stats')
  if (stats) byId.set('stats', { ...stats, visible: false })
  next.sections = [...byId.values()].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  return next
}

/**
 * Build a city homepage from national baseline + city-scoped CMS section records.
 */
export async function buildCityHomepageFromCms(deps, citySlug, { context = 'public' } = {}) {
  const slug = String(citySlug || '').toLowerCase()
  if (!isPkCitySlug(slug)) {
    return deps.loadPublishedHomepagePayload()
  }

  const baseline = await deps.loadPublishedHomepagePayload()
  const store =
    context === 'preview' && deps.localePublish?.readDraftStore
      ? await deps.localePublish.readDraftStore()
      : await deps.localePublish.readPublishedStore()

  const opts = {
    context,
    countryEnabled: true,
    allowFallback: true,
    allowGlobalFallback: true,
    allowArabicDraftPreview: false,
    citySlug: slug,
  }

  const out = clone(baseline)
  let usedCityRecords = 0

  for (const [sectionKey, def] of Object.entries(CITY_CMS_SECTIONS)) {
    const baselineDoc =
      sectionKey === 'seo'
        ? out.seo || (await readBaselineDoc(deps.publishStore, def.file))
        : out[sectionKey] || (await readBaselineDoc(deps.publishStore, def.file))

    const { doc, record } = resolveCitySectionDoc(
      store,
      {
        contentType: def.contentType,
        globalIdentity: def.globalIdentity,
        slug: def.globalIdentity,
        countryCode: DEFAULT_GLOBAL_COUNTRY,
        lang: DEFAULT_GLOBAL_LANG,
        citySlug: slug,
      },
      baselineDoc,
      opts,
    )

    if (record?.citySlug === slug) usedCityRecords += 1

    if (sectionKey === 'seo') {
      out.seo = applyCitySeoCanonical(doc, slug)
    } else if (doc && typeof doc === 'object') {
      out[sectionKey] = doc
    }
  }

  if (out.pageSections) {
    out.pageSections = hideStatsForCity(out.pageSections)
  }

  const cityName = PK_CITY_NAMES[slug] || slug
  out.city = {
    slug,
    name: cityName,
    serviceArea: `Serving businesses in ${cityName}`,
  }
  out.meta = {
    ...(out.meta || {}),
    locale: {
      ...(out.meta?.locale || {}),
      countryCode: 'PK',
      lang: 'en',
      citySlug: slug,
      fallbackUsed: usedCityRecords === 0,
      noIndex: false,
      cmsSections: usedCityRecords,
    },
  }

  return out
}

export function makeCitySectionRecord(citySlug, sectionKey, payload, { sourceRecordId = null } = {}) {
  const def = CITY_CMS_SECTIONS[sectionKey]
  if (!def) throw new Error(`Unknown city section: ${sectionKey}`)
  const city = String(citySlug).toLowerCase()
  const now = new Date().toISOString()
  const base = {
    id: citySectionRecordId(city, def.globalIdentity),
    contentType: def.contentType,
    globalIdentity: def.globalIdentity,
    slug: def.globalIdentity,
    countryCode: 'PK',
    languageCode: 'en',
    translationGroupId: `grp_city_${city}_${def.globalIdentity}`,
    sourceRecordId,
    inheritanceMode: 'override',
    translationStatus: 'published',
    publicationStatus: 'published',
    enabled: true,
    publishedAt: now,
    updatedAt: now,
    sortOrder: 0,
    citySlug: city,
    payload: {
      _seedVersion: CITY_CMS_SEED_VERSION,
      _seedAt: now,
      _citySlug: city,
      _sectionKey: sectionKey,
    },
  }
  if (sectionKey === 'seo') {
    return { ...base, seo: payload }
  }
  return { ...base, payload: { ...base.payload, ...payload } }
}

export function listCitySectionRecords(records, citySlug) {
  const city = String(citySlug).toLowerCase()
  return (records || []).filter(
    (r) =>
      r.citySlug === city &&
      normalizeCountryCode(r.countryCode) === 'PK' &&
      r.languageCode === 'en' &&
      CITY_CMS_SECTION_KEYS.some((k) => CITY_CMS_SECTIONS[k].globalIdentity === r.globalIdentity),
  )
}
