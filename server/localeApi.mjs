/**
 * Locale CMS API routes — public resolution + admin CRUD + country setup.
 */
import { normalizeCountryCode } from './countryHelpers.mjs'
import {
  normalizeLocaleLang,
  validateLocaleRecord,
  canPublishRecord,
  findRecordByIdentity,
} from './localeContentModel.mjs'
import { resolveContentWithBaseline, parseSoftwareLocalePath, RESOLVED_FROM } from './localeHelpers.mjs'
import { runCountrySetup, deleteLocaleOverride, upsertLocaleRecord } from './countrySetup.mjs'
import {
  copyLocaleFromSource,
  useGlobalContent,
  customizeForCountry,
  unpublishLocaleRecord,
  approveLocaleRecord,
  setTranslationStatus,
  archiveLocaleRecord,
  resetLocaleField,
  copyLocaleField,
} from './localeActions.mjs'
import { createLocalePublishHelpers } from './localePublish.mjs'
import { listFieldMeta } from './localeFieldHelpers.mjs'
import { productionErrorMessage } from './localeStorage.mjs'

function parseLocaleQuery(req) {
  const countryCode = normalizeCountryCode(req.query.country || req.query.countryCode || 'AE')
  const lang = normalizeLocaleLang(req.query.lang || req.query.language || 'en')
  return { countryCode, lang }
}

export function registerLocaleRoutes(app, deps) {
  const { authMiddleware, localeStorage, publishStore, logActivity } = deps
  const localePublish = createLocalePublishHelpers({ localeStorage, publishStore })

  async function loadBaseline(record) {
    const file = record?.baselineRef || record?.payload?.sourceFile
    if (!file) return null
    try {
      return await publishStore.readPublished(file)
    } catch {
      return null
    }
  }

  async function readStoreForContext(context) {
    return context === 'public' ? localePublish.readPublishedStore() : localePublish.readDraftStore()
  }

  async function resolveSlugContent(slug, countryCode, lang, context) {
    const store = await readStoreForContext(context)
    const list = store.records || []

    const candidate =
      list.find(
        (r) =>
          r.slug === slug &&
          normalizeCountryCode(r.countryCode) === countryCode &&
          normalizeLocaleLang(r.languageCode) === lang,
      ) ||
      list.find((r) => r.slug === slug && normalizeCountryCode(r.countryCode) === 'AE' && r.languageCode === 'en')

    let baseline = await loadBaseline(candidate)
    if (!baseline && slug === 'erp') baseline = await publishStore.readPublished('valueChain.json').catch(() => null)
    if (!baseline && slug === 'contact') baseline = await publishStore.readPublished('contact.json').catch(() => null)
    if (!baseline && slug === 'industries') baseline = await publishStore.readPublished('industries.json').catch(() => null)
    if (!baseline && slug === 'faqs') baseline = await publishStore.readPublished('faqs.json').catch(() => null)

    return resolveContentWithBaseline(
      store,
      { slug, countryCode, lang, contentType: candidate?.contentType, globalIdentity: candidate?.globalIdentity },
      baseline,
      { context, countryEnabled: true, allowGlobalFallback: countryCode === 'AE' },
    )
  }

  async function afterLocaleMutation(email, { syncPublished = false } = {}) {
    await localePublish.markLocaleDraftSaved(email)
    if (syncPublished) await localePublish.syncLocalePublishedSnapshot(email)
  }

  app.get('/api/public/locale-content/:slug', async (req, res) => {
    try {
      const slug = String(req.params.slug || '').trim().toLowerCase()
      const { countryCode, lang } = parseLocaleQuery(req)
      const full = await resolveSlugContent(slug, countryCode, lang, 'public')
      if (!full.publicView) {
        res.status(404).json({
          error: 'not_found',
          missing: true,
          slug,
          countryCode,
          lang,
          meta: full.meta,
          fallback: { countryCode: 'AE', lang: 'en', href: countryCode === 'AE' && lang === 'en' ? `/${slug}` : `/ae/en/${slug}` },
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

  app.get('/api/public/locale-content/software/:kind/:slug', async (req, res) => {
    try {
      const kind = String(req.params.kind || '')
      const slug = String(req.params.slug || '').trim().toLowerCase()
      const { countryCode, lang } = parseLocaleQuery(req)
      const parsed = parseSoftwareLocalePath(kind, slug)
      if (!parsed) {
        res.status(400).json({ error: 'Invalid software detail path' })
        return
      }
      const store = await localePublish.readPublishedStore()
      const match = findRecordByIdentity(store.records, parsed.contentType, parsed.globalIdentity, countryCode, lang)
      const baseline = match ? await loadBaseline(match) : null
      const full = resolveContentWithBaseline(
        store,
        { ...parsed, countryCode, lang },
        baseline,
        { context: 'public', countryEnabled: true, allowGlobalFallback: countryCode === 'AE' },
      )
      if (!full.publicView) {
        res.status(404).json({
          error: 'not_found',
          missing: true,
          kind,
          slug,
          countryCode,
          lang,
          meta: full.meta,
          fallback: { countryCode: 'AE', lang: 'en', href: `/software/${kind}/${slug}` },
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

  app.get('/api/admin/locale/publish-status', authMiddleware, async (_req, res) => {
    try {
      const status = await localePublish.getLocalePublishStatus()
      res.json(status)
    } catch (e) {
      res.status(500).json({ error: productionErrorMessage(e) })
    }
  })

  app.post('/api/admin/locale/publish-store', authMiddleware, async (req, res) => {
    try {
      await localePublish.syncLocalePublishedSnapshot(req.user?.email)
      const status = await localePublish.getLocalePublishStatus()
      res.json({ ok: true, publishStatus: status })
    } catch (e) {
      res.status(400).json({ error: productionErrorMessage(e) })
    }
  })

  app.get('/api/admin/locale/records', authMiddleware, async (req, res) => {
    try {
      const { countryCode, lang, contentType } = req.query
      const store = await localePublish.readDraftStore()
      let records = store.records || []
      if (countryCode) records = records.filter((r) => normalizeCountryCode(r.countryCode) === normalizeCountryCode(String(countryCode)))
      if (lang) records = records.filter((r) => normalizeLocaleLang(r.languageCode) === normalizeLocaleLang(String(lang)))
      if (contentType) records = records.filter((r) => r.contentType === contentType)
      const publishStatus = await localePublish.getLocalePublishStatus()
      res.json({ records, setupCompleted: store.setupCompleted || {}, publishStatus })
    } catch (e) {
      res.status(500).json({ error: productionErrorMessage(e) })
    }
  })

  app.get('/api/admin/locale/resolve', authMiddleware, async (req, res) => {
    try {
      const { countryCode, lang } = parseLocaleQuery(req)
      const { contentType, globalIdentity, slug } = req.query
      const store = await localePublish.readDraftStore()
      const match = (store.records || []).find(
        (r) =>
          (!contentType || r.contentType === contentType) &&
          (!globalIdentity || r.globalIdentity === globalIdentity) &&
          (!slug || r.slug === slug) &&
          normalizeCountryCode(r.countryCode) === countryCode &&
          normalizeLocaleLang(r.languageCode) === lang,
      )
      const baseline = await loadBaseline(match)
      const full = resolveContentWithBaseline(
        store,
        { contentType, globalIdentity, slug, countryCode, lang },
        baseline,
        { context: 'preview', allowGlobalFallback: true },
      )
      res.json({ ...full, fieldMeta: listFieldMeta(full.record?.payload) })
    } catch (e) {
      res.status(500).json({ error: productionErrorMessage(e) })
    }
  })

  app.get('/api/admin/locale/country-matrix', authMiddleware, async (_req, res) => {
    try {
      const draft = await localePublish.readDraftStore()
      const published = await localePublish.readPublishedStore()
      const countries = ['AE', 'SA', 'QA', 'OM', 'KW', 'BH']
      const matrix = countries.map((code) => {
        const setup = draft.setupCompleted?.[code] || null
        const summarize = (store, lang) => {
          const recs = (store.records || []).filter((r) => normalizeCountryCode(r.countryCode) === code && r.languageCode === lang)
          const pageRecs = recs.filter((r) => ['solution', 'industry', 'contact', 'page'].includes(r.contentType))
          return {
            recordCount: recs.length,
            translationStatuses: [...new Set(recs.map((r) => r.translationStatus))],
            publicationStatuses: [...new Set(recs.map((r) => r.publicationStatus))],
            hasOverride: recs.some((r) => r.inheritanceMode === 'override'),
            publishedPages: pageRecs.filter((r) => r.publicationStatus === 'published').map((r) => r.slug || r.globalIdentity),
          }
        }
        return {
          countryCode: code,
          setupCompleted: Boolean(setup),
          setupMode: setup?.mode || null,
          noIndex: code !== 'AE',
          en: { draft: summarize(draft, 'en'), published: summarize(published, 'en') },
          ar: { draft: summarize(draft, 'ar'), published: summarize(published, 'ar') },
        }
      })
      res.json({ matrix, publishStatus: await localePublish.getLocalePublishStatus() })
    } catch (e) {
      res.status(500).json({ error: productionErrorMessage(e) })
    }
  })

  app.put('/api/admin/locale/records/:id', authMiddleware, async (req, res) => {
    try {
      const store = await localePublish.readDraftStore()
      const existing = (store.records || []).find((r) => r.id === req.params.id)
      const body = { ...(existing || {}), ...req.body, id: req.params.id, updatedAt: new Date().toISOString() }
      if (body.customized) {
        body.inheritanceMode = 'override'
        body.translationStatus = body.translationStatus || 'draft'
      }
      const record = await upsertLocaleRecord(deps, body)
      await afterLocaleMutation(req.user?.email)
      logActivity?.({ action: 'locale_save', description: `Saved locale record ${body.id}`, section: 'localeRecords' })
      res.json({ record })
    } catch (e) {
      res.status(400).json({ error: productionErrorMessage(e) })
    }
  })

  app.post('/api/admin/locale/records/:id/publish', authMiddleware, async (req, res) => {
    try {
      const store = await localePublish.readDraftStore()
      const existing = (store.records || []).find((r) => r.id === req.params.id)
      if (!existing) {
        res.status(404).json({ error: 'Not found' })
        return
      }
      const can = canPublishRecord(existing)
      if (!can.ok) {
        res.status(400).json({ error: can.reason })
        return
      }
      const record = await upsertLocaleRecord(deps, existing, { publish: true })
      await afterLocaleMutation(req.user?.email, { syncPublished: true })
      res.json({ record })
    } catch (e) {
      res.status(400).json({ error: productionErrorMessage(e) })
    }
  })

  app.post('/api/admin/locale/records/:id/unpublish', authMiddleware, async (req, res) => {
    try {
      const record = await unpublishLocaleRecord(deps, req.params.id)
      await afterLocaleMutation(req.user?.email, { syncPublished: true })
      res.json({ record })
    } catch (e) {
      res.status(400).json({ error: productionErrorMessage(e) })
    }
  })

  app.post('/api/admin/locale/records/:id/approve', authMiddleware, async (req, res) => {
    try {
      const record = await approveLocaleRecord(deps, req.params.id)
      await afterLocaleMutation(req.user?.email)
      res.json({ record })
    } catch (e) {
      res.status(400).json({ error: productionErrorMessage(e) })
    }
  })

  app.post('/api/admin/locale/records/:id/translation-status', authMiddleware, async (req, res) => {
    try {
      const { status } = req.body || {}
      const record = await setTranslationStatus(deps, req.params.id, status)
      await afterLocaleMutation(req.user?.email)
      res.json({ record })
    } catch (e) {
      res.status(400).json({ error: productionErrorMessage(e) })
    }
  })

  app.post('/api/admin/locale/records/:id/archive', authMiddleware, async (req, res) => {
    try {
      const record = await archiveLocaleRecord(deps, req.params.id)
      await afterLocaleMutation(req.user?.email, { syncPublished: true })
      res.json({ record })
    } catch (e) {
      res.status(400).json({ error: productionErrorMessage(e) })
    }
  })

  app.post('/api/admin/locale/records/:id/fields/:field/reset', authMiddleware, async (req, res) => {
    try {
      const record = await resetLocaleField(deps, req.params.id, req.params.field)
      await afterLocaleMutation(req.user?.email)
      res.json({ record, fieldMeta: listFieldMeta(record.payload) })
    } catch (e) {
      res.status(400).json({ error: productionErrorMessage(e) })
    }
  })

  app.post('/api/admin/locale/records/:id/fields/:field/copy-from', authMiddleware, async (req, res) => {
    try {
      const { sourceCountry = 'AE', sourceLang = 'en' } = req.body || {}
      const record = await copyLocaleField(deps, req.params.id, req.params.field, sourceCountry, sourceLang)
      await afterLocaleMutation(req.user?.email)
      res.json({ record, fieldMeta: listFieldMeta(record.payload) })
    } catch (e) {
      res.status(400).json({ error: productionErrorMessage(e) })
    }
  })

  app.post('/api/admin/locale/records/:id/copy-from', authMiddleware, async (req, res) => {
    try {
      const { sourceCountry = 'AE', sourceLang = 'en', asDraft = true } = req.body || {}
      const record = await copyLocaleFromSource(deps, {
        targetId: req.params.id,
        sourceCountry,
        sourceLang,
        asDraft: asDraft !== false,
      })
      await afterLocaleMutation(req.user?.email)
      res.json({ record })
    } catch (e) {
      res.status(400).json({ error: productionErrorMessage(e) })
    }
  })

  app.post('/api/admin/locale/actions/use-global', authMiddleware, async (req, res) => {
    try {
      const { contentType, globalIdentity, countryCode, lang } = req.body || {}
      if (!contentType || !globalIdentity || !countryCode) {
        res.status(400).json({ error: 'contentType, globalIdentity, countryCode required' })
        return
      }
      const record = await useGlobalContent(deps, { contentType, globalIdentity, countryCode, lang: lang || 'en' })
      await afterLocaleMutation(req.user?.email)
      res.json({ record })
    } catch (e) {
      res.status(400).json({ error: productionErrorMessage(e) })
    }
  })

  app.post('/api/admin/locale/actions/customize', authMiddleware, async (req, res) => {
    try {
      const { contentType, globalIdentity, countryCode, lang, slug } = req.body || {}
      if (!contentType || !globalIdentity || !countryCode) {
        res.status(400).json({ error: 'contentType, globalIdentity, countryCode required' })
        return
      }
      const record = await customizeForCountry(deps, { contentType, globalIdentity, countryCode, lang: lang || 'en', slug })
      await afterLocaleMutation(req.user?.email)
      res.json({ record })
    } catch (e) {
      res.status(400).json({ error: productionErrorMessage(e) })
    }
  })

  app.delete('/api/admin/locale/records/:id', authMiddleware, async (req, res) => {
    try {
      const result = await deleteLocaleOverride(deps, req.params.id)
      await afterLocaleMutation(req.user?.email, { syncPublished: true })
      logActivity?.({ action: 'locale_reset', description: `Reset locale override ${req.params.id}`, section: 'localeRecords' })
      res.json(result)
    } catch (e) {
      res.status(400).json({ error: productionErrorMessage(e) })
    }
  })

  app.post('/api/admin/countries/setup', authMiddleware, async (req, res) => {
    try {
      const { countryCode, languages, mode } = req.body || {}
      if (!countryCode || !mode) {
        res.status(400).json({ error: 'countryCode and mode are required' })
        return
      }
      const report = await runCountrySetup(deps, {
        countryCode,
        languages: Array.isArray(languages) ? languages : ['en'],
        mode,
      })
      await afterLocaleMutation(req.user?.email)
      res.json({ ok: true, report })
    } catch (e) {
      res.status(400).json({ error: productionErrorMessage(e), rolledBack: true })
    }
  })

  app.post('/api/admin/locale/records', authMiddleware, async (req, res) => {
    try {
      const body = req.body || {}
      const validation = validateLocaleRecord(body, { existingRecords: (await localePublish.readDraftStore()).records })
      if (!validation.ok) {
        res.status(400).json({ error: validation.errors.join('; ') })
        return
      }
      const record = await upsertLocaleRecord(deps, body)
      await afterLocaleMutation(req.user?.email)
      res.status(201).json({ record })
    } catch (e) {
      res.status(400).json({ error: productionErrorMessage(e) })
    }
  })

  return { resolveSlugContent, RESOLVED_FROM, localePublish }
}
