/**
 * Locale-aware homepage payload builder — merges published locale records with UAE baselines.
 */
import { normalizeCountryCode } from './countryHelpers.mjs'
import {
  DEFAULT_GLOBAL_COUNTRY,
  DEFAULT_GLOBAL_LANG,
  normalizeLocaleLang,
} from './localeContentModel.mjs'
import { findLocaleRecord, mergePayloadFromBaseline, resolveLocaleRecord } from './localeHelpers.mjs'
import { regionalizeDocument, loadCountryProfile, regionalizeTrustStats } from './localeRegionalize.mjs'
import { regionalizeHomepageBaseline } from './gccLocalizedContent/regionalizeBaselines.mjs'

export const HOMEPAGE_LOCALE_MAP = {
  hero: { contentType: 'pageSection', globalIdentity: 'hero', file: 'hero.json' },
  stats: { contentType: 'pageSection', globalIdentity: 'stats', file: 'stats.json' },
  about: { contentType: 'pageSection', globalIdentity: 'about', file: 'about.json' },
  valueChain: { contentType: 'pageSection', globalIdentity: 'valueChain', file: 'valueChain.json' },
  modules: { contentType: 'pageSection', globalIdentity: 'modules', file: 'modules.json' },
  industries: { contentType: 'pageSection', globalIdentity: 'industries', file: 'industries.json' },
  testimonials: { contentType: 'pageSection', globalIdentity: 'testimonials', file: 'testimonials.json' },
  faqs: { contentType: 'pageSection', globalIdentity: 'faqs', file: 'faqs.json' },
  header: { contentType: 'navigation', globalIdentity: 'header', file: 'header.json' },
  footer: { contentType: 'footer', globalIdentity: 'footer', file: 'footer.json' },
  seo: { contentType: 'seo', globalIdentity: 'site', file: 'seo.json' },
}

const BASELINE_ONLY_KEYS = [
  'workflow',
  'demoCta',
  'cta',
  'personalizedDemo',
  'blogSection',
  'pageSections',
  'megaMenus',
  'siteSettings',
  'whatsappSettings',
  'countries',
]

async function readBaseline(publishStore, file) {
  try {
    const doc = await publishStore.readPublished(file)
    return publishStore.stripMeta(doc) ?? doc ?? {}
  } catch {
    return {}
  }
}

async function resolveHomeSection(store, query, baselineDoc, opts) {
  const matches = findLocaleRecord(store.records || [], query)
  const resolved = resolveLocaleRecord(null, matches, opts)

  if (!resolved.record) {
    return { doc: baselineDoc, meta: resolved.meta, usedFallback: true }
  }

  if (resolved.meta?.fallbackUsed) {
    return { doc: baselineDoc, meta: resolved.meta, usedFallback: true }
  }

  const useBaseline =
    resolved.record.inheritanceMode === 'inherit' ||
    resolved.record.inheritanceMode === 'global' ||
    resolved.record.payload?.useBaseline === true

  const doc = mergePayloadFromBaseline(resolved.record, useBaseline ? baselineDoc : null, query.lang)
  return {
    doc,
    meta: resolved.meta,
    usedFallback: false,
  }
}

function overlayCountrySiteSettings(doc, countryProfile, lang) {
  if (!doc || typeof doc !== 'object' || !countryProfile) return doc
  const next = { ...doc }
  if (countryProfile.currency) next.defaultCurrency = countryProfile.currency
  if (countryProfile.phoneCode) next.defaultPhoneCode = countryProfile.phoneCode
  if (countryProfile.name?.en) {
    next.defaultCountry = {
      en: countryProfile.name.en,
      ar: countryProfile.name.ar || next.defaultCountry?.ar || '',
    }
  }
  if (countryProfile.primaryEmail) next.primaryEmail = countryProfile.primaryEmail
  if (countryProfile.phoneDisplay) next.phoneDisplay = countryProfile.phoneDisplay
  if (countryProfile.phoneHref) next.phoneHref = countryProfile.phoneHref
  if (countryProfile.whatsappNumber) {
    next.whatsappNumber = String(countryProfile.whatsappNumber).replace(/\D/g, '')
  }
  if (lang === 'ar' && next.defaultCountry?.ar) {
    /* keep bilingual fields intact */
  }
  return next
}

export async function buildLocaleHomepagePayload(deps, countryCode, lang, { buildNavigation, buildMeta } = {}) {
  const country = normalizeCountryCode(countryCode)
  const language = normalizeLocaleLang(lang)
  const isDefault = country === DEFAULT_GLOBAL_COUNTRY && language === DEFAULT_GLOBAL_LANG

  if (isDefault) {
    return deps.loadPublishedHomepagePayload()
  }

  const store = await deps.readPublishedLocaleStore()
  const countryProfile = await loadCountryProfile(deps.publishStore, country)
  const opts = {
    context: 'public',
    countryEnabled: true,
    allowFallback: true,
    allowGlobalFallback: language !== 'ar',
    allowArabicDraftPreview: language === 'ar',
  }

  const fallbackSections = []
  let publishedLocaleSections = 0
  const out = {}

  for (const [key, map] of Object.entries(HOMEPAGE_LOCALE_MAP)) {
    const baselineDoc = await readBaseline(deps.publishStore, map.file)
    const { doc, meta, usedFallback } = await resolveHomeSection(
      store,
      { contentType: map.contentType, globalIdentity: map.globalIdentity, countryCode: country, lang: language },
      baselineDoc,
      opts,
    )

    let sectionDoc = doc
    if (usedFallback && countryProfile) {
      sectionDoc =
        key === 'stats' ? regionalizeTrustStats(baselineDoc, country, { countryProfile }) : regionalizeDocument(doc, country, { countryProfile })
    }

    out[key] = sectionDoc
    if (meta?.resolvedFrom === 'locale_override' && !meta?.fallbackUsed) publishedLocaleSections++
    if (usedFallback || meta?.fallbackUsed) fallbackSections.push(key)
  }

  for (const key of BASELINE_ONLY_KEYS) {
    const file = deps.dataFiles?.[key] || deps.extraHomepageFiles?.[key]
    if (!file) continue
    const baselineDoc = await readBaseline(deps.publishStore, file)
    const regionalized = countryProfile
      ? regionalizeHomepageBaseline(key, regionalizeDocument(baselineDoc, country, { countryProfile }), country)
      : baselineDoc
    out[key] = regionalized
    if (!countryProfile) fallbackSections.push(key)
  }

  if (countryProfile) {
    out.siteSettings = overlayCountrySiteSettings(out.siteSettings, countryProfile, language)
    out.whatsappSettings = regionalizeDocument(out.whatsappSettings || {}, country, { countryProfile })
  }

  out.navigation = buildNavigation ? await buildNavigation(out) : out.header
  out.meta = buildMeta ? await buildMeta() : { slug: 'home', status: 'published', schemaVersion: 2 }

  const fallbackUsed =
    publishedLocaleSections === 0 ||
    fallbackSections.some((key) => Object.prototype.hasOwnProperty.call(HOMEPAGE_LOCALE_MAP, key))
  out.meta = {
    ...out.meta,
    locale: {
      countryCode: country,
      lang: language,
      fallbackUsed,
      fallbackSections: [...new Set(fallbackSections)],
      publishedLocaleSections,
      noIndex: language === 'ar' || publishedLocaleSections === 0,
    },
  }

  return out
}

export async function getLocaleHomepageIndexMeta(deps, countryCode, lang) {
  const country = normalizeCountryCode(countryCode)
  const language = normalizeLocaleLang(lang)
  if (country === DEFAULT_GLOBAL_COUNTRY && language === DEFAULT_GLOBAL_LANG) {
    return { noIndex: false, fallbackUsed: false, hasPublishedContent: true }
  }

  const readStore =
    deps.readPublishedLocaleStore ||
    (() => deps.localePublish?.readPublishedStore?.())
  const store = readStore ? await readStore() : { records: [] }
  const homepageKeys = Object.values(HOMEPAGE_LOCALE_MAP)
  let publishedCount = 0

  for (const map of homepageKeys) {
    const matches = findLocaleRecord(store.records || [], {
      contentType: map.contentType,
      globalIdentity: map.globalIdentity,
      countryCode: country,
      lang: language,
    })
    const resolved = resolveLocaleRecord(null, matches, {
      context: 'public',
      allowFallback: false,
      allowGlobalFallback: false,
    })
    if (resolved.record && !resolved.meta?.fallbackUsed) publishedCount++
  }

  return {
    noIndex: publishedCount === 0,
    fallbackUsed: publishedCount === 0,
    hasPublishedContent: publishedCount > 0,
    publishedLocaleSections: publishedCount,
  }
}
