/**
 * City-level locale content API and resolution.
 */
import { normalizeCountryCode } from './countryHelpers.mjs'
import {
  CITY_CONTENT_TYPE,
  CITY_PAGE_SLUG,
  cityGlobalIdentity,
  getCitiesForCountry,
  getCity,
  isValidCityForCountry,
  isKnownCityProductSlug,
  ALL_CITY_SLUGS,
  CITY_REGISTRY,
  CITY_PRODUCT_PAGE_SLUGS,
} from './cityRegistry.mjs'
import { buildCityPagePath } from './cityPaths.mjs'
import { isDefaultLocale, COUNTRY_CODE_TO_SLUG } from './seoPaths.mjs'
import {
  canPublishRecord,
  defaultLocaleRecord,
  makeTranslationGroupId,
  normalizeLocaleLang,
  validateLocaleRecord,
} from './localeContentModel.mjs'
import { RESOLVED_FROM, resolveContentWithBaseline } from './localeHelpers.mjs'
import { buildCityLocaleRecord } from './cityContentBuilder.mjs'

export function resolveCityContentQuery(citySlug, pageSlug, countryCode, lang) {
  const city = getCity(citySlug)
  if (!city || !isValidCityForCountry(citySlug, countryCode)) return null
  if (!isKnownCityProductSlug(pageSlug)) return null
  return {
    contentType: CITY_CONTENT_TYPE,
    globalIdentity: cityGlobalIdentity(citySlug, pageSlug),
    slug: pageSlug,
    citySlug: city.slug,
    countryCode: normalizeCountryCode(countryCode),
    lang: normalizeLocaleLang(lang),
  }
}

export async function resolveCityContent(deps, { citySlug, pageSlug, countryCode, lang, context = 'public' }) {
  const query = resolveCityContentQuery(citySlug, pageSlug, countryCode, lang)
  if (!query) return { record: null, meta: { missing: true }, publicView: null, payload: null }

  const store =
    context === 'public'
      ? await deps.localePublish.readPublishedStore()
      : await deps.localePublish.readDraftStore()

  const countryEnabled = true
  const full = resolveContentWithBaseline(
    store,
    {
      contentType: query.contentType,
      globalIdentity: query.globalIdentity,
      slug: query.slug,
      citySlug: query.citySlug,
      countryCode: query.countryCode,
      lang: query.lang,
    },
    null,
    {
      context,
      countryEnabled,
      allowGlobalFallback: false,
      allowFallback: true,
      allowArabicDraftPreview: query.lang === 'ar',
      citySlug: query.citySlug,
    },
  )

  // Country-level ERP fallback when city record missing (serve with noindex via meta)
  if (!full.record && context === 'public') {
    const erpFallback = resolveContentWithBaseline(
      store,
      { slug: 'erp', countryCode: query.countryCode, lang: query.lang },
      null,
      { context, countryEnabled, allowGlobalFallback: query.countryCode === 'PK', allowFallback: true },
    )
    if (erpFallback.publicView) {
      return {
        ...erpFallback,
        meta: {
          ...erpFallback.meta,
          resolvedFrom: RESOLVED_FROM.LOCALE_OVERRIDE,
          fallbackUsed: true,
          cityFallback: true,
          requestedCity: query.citySlug,
        },
        publicView: {
          ...erpFallback.publicView,
          citySlug: query.citySlug,
          _locale: {
            ...erpFallback.meta,
            fallbackUsed: true,
            cityFallback: true,
          },
        },
      }
    }
  }

  return full
}

export function evaluateCityIndexability({ record, meta, countryCode, lang, countryEnabled = true }) {
  if (!record || meta?.missing) return { indexable: false, reason: 'missing' }
  if (meta?.fallbackUsed || meta?.cityFallback) return { indexable: false, reason: 'city_fallback' }
  if (meta?.resolvedFrom !== RESOLVED_FROM.CITY_OVERRIDE) return { indexable: false, reason: 'not_city_override' }
  if (!record.citySlug) return { indexable: false, reason: 'not_city_record' }
  if (record.enabled === false) return { indexable: false, reason: 'record_disabled' }
  if (record.publicationStatus !== 'published') return { indexable: false, reason: 'not_published' }
  const can = canPublishRecord(record, { countryEnabled })
  if (!can.ok) return { indexable: false, reason: can.reason }
  const language = normalizeLocaleLang(lang)
  if (language === 'ar' && !['approved', 'published'].includes(record.translationStatus || '')) {
    return { indexable: false, reason: 'translation_not_approved' }
  }
  if (record.seo?.noIndex === true) return { indexable: false, reason: 'seo_noindex' }
  return { indexable: true, reason: 'city_published' }
}

export function registerCityLocaleRoutes(app, deps) {
  const { localePublish, upsertLocaleRecord, authMiddleware, productionErrorMessage, localeContentNotFound } = deps

  app.get('/api/public/locale-content/city/:citySlug/:pageSlug', async (req, res) => {
    try {
      const citySlug = String(req.params.citySlug || '').toLowerCase()
      const pageSlug = String(req.params.pageSlug || '').toLowerCase()
      const countryCode = normalizeCountryCode(String(req.query.country || 'PK'))
      const lang = normalizeLocaleLang(String(req.query.lang || 'en'))

      const full = await resolveCityContent(deps, { citySlug, pageSlug, countryCode, lang, context: 'public' })
      if (!full.publicView) {
        localeContentNotFound(res, {
          citySlug,
          pageSlug,
          countryCode,
          lang,
          meta: full.meta,
        })
        return
      }
      res.set({ 'Cache-Control': 'no-store' })
      res.json({ page: full.publicView, meta: full.meta })
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: productionErrorMessage(e) })
    }
  })

  app.get('/api/public/cities', async (req, res) => {
    try {
      const countryCode = normalizeCountryCode(String(req.query.country || ''))
      if (!countryCode || countryCode === 'ALL') {
        res.json({ cities: ALL_CITY_SLUGS.map((slug) => CITY_REGISTRY[slug]) })
        return
      }
      res.json({ cities: getCitiesForCountry(countryCode) })
    } catch (e) {
      res.status(500).json({ error: productionErrorMessage(e) })
    }
  })

  app.get('/api/admin/locale/cities', authMiddleware, async (req, res) => {
    try {
      const countryCode = normalizeCountryCode(String(req.query.country || 'PK'))
      const store = await localePublish.readDraftStore()
      const published = await localePublish.readPublishedStore()
      const cities = getCitiesForCountry(countryCode).map((city) => {
        const match = (records) =>
          (records || []).find(
            (r) =>
              r.contentType === CITY_CONTENT_TYPE &&
              r.citySlug === city.slug &&
              r.globalIdentity === cityGlobalIdentity(city.slug, CITY_PAGE_SLUG) &&
              normalizeCountryCode(r.countryCode) === countryCode &&
              r.languageCode === 'en',
          )
        const draft = match(store.records)
        const pub = match(published.records)
        const source = draft || pub
        const heading = source?.payload?.heading?.en || source?.payload?.title?.en || ''
        const intro = source?.payload?.shortDescription?.en || ''
        const title = source?.seo?.title?.en || source?.payload?.title?.en || heading
        const description = source?.seo?.description?.en || ''
        const eyebrow = source?.payload?.eyebrow?.en || source?.payload?.eyebrow || ''
        const dashboardCities = Array.isArray(source?.payload?.dashboardCities)
          ? source.payload.dashboardCities.join(', ')
          : ''
        const dashboardCompanies = Array.isArray(source?.payload?.dashboardCompanies)
          ? source.payload.dashboardCompanies.join(', ')
          : ''
        const extraFaq = source?.payload?.extraFaqs?.[0] || source?.payload?.homepageFaqs?.[0] || null
        const pageSections = source?.payload?.pageSections || []
        return {
          ...city,
          recordId: draft?.id || pub?.id || null,
          heading,
          intro,
          title,
          description,
          eyebrow,
          dashboardCities,
          dashboardCompanies,
          extraFaqQ: extraFaq?.q || extraFaq?.question?.en || '',
          extraFaqA: extraFaq?.a || extraFaq?.answer?.en || '',
          pageSections,
          draft: draft
            ? {
                publicationStatus: draft.publicationStatus,
                translationStatus: draft.translationStatus,
                enabled: draft.enabled !== false,
                updatedAt: draft.updatedAt,
              }
            : null,
          published: pub
            ? {
                publicationStatus: pub.publicationStatus,
                translationStatus: pub.translationStatus,
                enabled: pub.enabled !== false,
                publishedAt: pub.publishedAt,
              }
            : null,
          previewPath: buildCityPagePath(
            COUNTRY_CODE_TO_SLUG[city.countryCode] || 'pk',
            'en',
            city.slug,
            CITY_PAGE_SLUG,
          ),
        }
      })
      res.json({ countryCode, cities })
    } catch (e) {
      res.status(500).json({ error: productionErrorMessage(e) })
    }
  })

  app.post('/api/admin/locale/cities/:citySlug/seed', authMiddleware, async (req, res) => {
    try {
      const citySlug = String(req.params.citySlug || '').toLowerCase()
      const city = getCity(citySlug)
      if (!city) {
        res.status(404).json({ error: 'Unknown city' })
        return
      }
      const store = await localePublish.readDraftStore()
      const pageSlug = String(req.body?.pageSlug || CITY_PAGE_SLUG).toLowerCase()
      const existing = (store.records || []).find(
        (r) =>
          r.contentType === CITY_CONTENT_TYPE &&
          r.citySlug === city.slug &&
          r.globalIdentity === cityGlobalIdentity(city.slug, pageSlug) &&
          normalizeCountryCode(r.countryCode) === city.countryCode &&
          r.languageCode === 'en',
      )
      const partial = buildCityLocaleRecord(city.slug, pageSlug, 'en')
      const record = existing
        ? { ...existing, payload: partial.payload, seo: partial.seo, updatedAt: new Date().toISOString() }
        : defaultLocaleRecord({
            ...partial,
            id: `loc_city_${city.slug}_en`,
            translationGroupId: makeTranslationGroupId(),
            sourceRecordId: null,
          })
      const validation = validateLocaleRecord(record, { existingRecords: store.records || [] })
      if (!validation.ok) {
        res.status(400).json({ error: validation.errors.join('; ') })
        return
      }
      const saved = await upsertLocaleRecord(deps, record)
      res.json({ record: saved })
    } catch (e) {
      res.status(400).json({ error: productionErrorMessage(e) })
    }
  })

  app.put('/api/admin/locale/cities/:citySlug', authMiddleware, async (req, res) => {
    try {
      const citySlug = String(req.params.citySlug || '').toLowerCase()
      const city = getCity(citySlug)
      if (!city) {
        res.status(404).json({ error: 'Unknown city' })
        return
      }
      const pageSlug = String(req.body?.pageSlug || CITY_PAGE_SLUG).toLowerCase()
      const store = await localePublish.readDraftStore()
      const existing = (store.records || []).find(
        (r) =>
          r.contentType === CITY_CONTENT_TYPE &&
          r.citySlug === city.slug &&
          r.globalIdentity === cityGlobalIdentity(city.slug, pageSlug) &&
          normalizeCountryCode(r.countryCode) === city.countryCode &&
          r.languageCode === 'en',
      )
      if (!existing) {
        res.status(404).json({ error: 'Seed the city page before editing' })
        return
      }
      const heading = String(req.body?.heading || '').trim()
      const intro = String(req.body?.intro || '').trim()
      const title = String(req.body?.title || '').trim()
      const description = String(req.body?.description || '').trim()
      const eyebrow = String(req.body?.eyebrow || '').trim()
      const dashboardCities = String(req.body?.dashboardCities || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      const dashboardCompanies = String(req.body?.dashboardCompanies || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      const extraFaqQ = String(req.body?.extraFaqQ || '').trim()
      const extraFaqA = String(req.body?.extraFaqA || '').trim()
      const pageSections = Array.isArray(req.body?.pageSections) ? req.body.pageSections : existing.payload?.pageSections
      const payload = {
        ...existing.payload,
        heading: heading ? { en: heading } : existing.payload?.heading,
        shortDescription: intro ? { en: intro } : existing.payload?.shortDescription,
        title: title ? { en: title } : existing.payload?.title,
        eyebrow: eyebrow ? { en: eyebrow } : existing.payload?.eyebrow,
        dashboardCities: dashboardCities.length ? dashboardCities : existing.payload?.dashboardCities,
        dashboardCompanies: dashboardCompanies.length ? dashboardCompanies : existing.payload?.dashboardCompanies,
        extraFaqs: extraFaqQ && extraFaqA ? [{ q: extraFaqQ, a: extraFaqA }] : existing.payload?.extraFaqs,
        pageSections,
      }
      if (heading && payload.sections?.[0]?.content) {
        payload.sections[0].content = {
          ...payload.sections[0].content,
          title: { en: heading },
          description: intro ? { en: intro } : payload.sections[0].content.description,
        }
      }
      const seo = {
        ...existing.seo,
        title: title ? { en: title } : existing.seo?.title,
        description: description ? { en: description } : existing.seo?.description,
      }
      const saved = await upsertLocaleRecord(deps, {
        ...existing,
        payload,
        seo,
        updatedAt: new Date().toISOString(),
      })
      res.json({ record: saved })
    } catch (e) {
      res.status(400).json({ error: productionErrorMessage(e) })
    }
  })
}

export { CITY_PAGE_SLUG, CITY_CONTENT_TYPE }
