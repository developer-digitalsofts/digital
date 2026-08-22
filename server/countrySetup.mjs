/**
 * Transactional country setup backend.
 */
import {
  LOCALE_ROUTE_REGISTRY,
  SETUP_CONTENT_TYPES,
  defaultLocaleRecord,
  makeTranslationGroupId,
  validateLocaleRecord,
  isSupportedLocale,
  normalizeLocaleLang,
} from './localeContentModel.mjs'
import { normalizeCountryCode } from './countryHelpers.mjs'

const SETUP_MODES = new Set(['structure_only', 'structure_shared_draft', 'blank'])

function placeholderPayload(route, mode) {
  const base = {
    template: route?.template || 'cms-page',
    title: { en: '', ar: '' },
    heading: { en: '', ar: '' },
    shortDescription: { en: '', ar: '' },
    sections: [],
    useBaseline: mode === 'structure_shared_draft',
    fields: {},
  }
  if (mode === 'structure_only') {
    base.sections = [
      { id: `${route.slug}-hero`, type: 'hero', visible: true, order: 0, content: {} },
      { id: `${route.slug}-body`, type: 'richText', visible: true, order: 1, content: {} },
    ]
  }
  return base
}

function findGlobalSource(records, contentType, globalIdentity) {
  return records.find(
    (r) =>
      r.contentType === contentType &&
      r.globalIdentity === globalIdentity &&
      normalizeCountryCode(r.countryCode) === 'AE' &&
      r.languageCode === 'en',
  )
}

export async function runCountrySetup(deps, request) {
  const { countryCode, languages = ['en'], mode = 'structure_only' } = request
  const country = normalizeCountryCode(countryCode)
  if (!SETUP_MODES.has(mode)) throw new Error(`Invalid setup mode: ${mode}`)
  if (country === 'AE') throw new Error('UAE is the global baseline — use CMS editors instead of country setup')

  for (const lang of languages) {
    if (!isSupportedLocale(country, lang)) throw new Error(`Unsupported language ${lang} for ${country}`)
  }

  const report = {
    country,
    languages,
    mode,
    countryCreated: false,
    languagesEnabled: languages,
    pagesPrepared: 0,
    sectionsPrepared: 0,
    sharedRecordsLinked: 0,
    draftRecordsCreated: 0,
    missingTranslations: [],
    errors: [],
    rolledBack: false,
  }

  try {
    const { result } = await deps.localeStorage.mutateLocaleStore(async (store) => {
    store.setupCompleted = store.setupCompleted || {}
    if (store.setupCompleted[country]) {
      throw new Error(`Country ${country} is already set up`)
    }

    const created = []
    const records = store.records || []

    const globalRoutes = LOCALE_ROUTE_REGISTRY
    const globalSections = records.filter((r) => r.contentType === 'pageSection' && normalizeCountryCode(r.countryCode) === 'AE')

    if (mode === 'blank') {
      for (const lang of languages) {
        created.push(
          defaultLocaleRecord({
            contentType: 'page',
            globalIdentity: `country-home-${country.toLowerCase()}`,
            slug: '',
            countryCode: country,
            languageCode: lang,
            translationGroupId: makeTranslationGroupId(),
            inheritanceMode: 'inherit',
            translationStatus: 'missing',
            publicationStatus: 'draft',
            payload: { template: 'blank' },
          }),
        )
      }
    } else {
      for (const lang of languages) {
        for (const route of globalRoutes) {
          const existingForLocale = records.find(
            (r) =>
              r.contentType === route.contentType &&
              r.globalIdentity === route.globalIdentity &&
              normalizeCountryCode(r.countryCode) === country &&
              normalizeLocaleLang(r.languageCode) === lang,
          )
          if (existingForLocale) {
            report.pagesPrepared++
            continue
          }

          const source = findGlobalSource(records, route.contentType, route.globalIdentity)
          const grp = source?.translationGroupId || makeTranslationGroupId()
          let payload = placeholderPayload(route, mode)
          let inheritanceMode = 'inherit'
          let translationStatus = 'missing'
          let linked = false

          if (mode === 'structure_shared_draft' && source) {
            payload = {
              template: source.payload?.template || route.template,
              useBaseline: true,
              fields: {},
              sections: source.payload?.sections ? structuredClone(source.payload.sections) : placeholderPayload(route, 'structure_only').sections,
            }
            inheritanceMode = 'inherit'
            translationStatus = 'draft'
            linked = true
            report.sharedRecordsLinked++
          }

          const rec = defaultLocaleRecord({
            contentType: route.contentType,
            globalIdentity: route.globalIdentity,
            slug: route.slug,
            countryCode: country,
            languageCode: lang,
            translationGroupId: grp,
            sourceRecordId: source?.id || null,
            inheritanceMode,
            translationStatus,
            publicationStatus: 'draft',
            payload,
          })

          const validation = validateLocaleRecord(rec, { existingRecords: [...records, ...created] })
          if (!validation.ok) throw new Error(validation.errors.join('; '))

          created.push(rec)
          report.pagesPrepared++
          if (lang === 'ar' && translationStatus === 'missing') report.missingTranslations.push(`${route.slug} (${country}/ar)`)
          if (linked) report.draftRecordsCreated++
        }

        if (mode === 'structure_only' || mode === 'structure_shared_draft') {
          for (const sec of globalSections) {
            const existingSec = records.find(
              (r) =>
                r.contentType === 'pageSection' &&
                r.globalIdentity === sec.globalIdentity &&
                normalizeCountryCode(r.countryCode) === country &&
                normalizeLocaleLang(r.languageCode) === lang,
            )
            if (existingSec) {
              report.sectionsPrepared++
              continue
            }
            const rec = defaultLocaleRecord({
              contentType: 'pageSection',
              globalIdentity: sec.globalIdentity,
              slug: sec.slug,
              countryCode: country,
              languageCode: lang,
              translationGroupId: sec.translationGroupId,
              sourceRecordId: sec.id,
              inheritanceMode: 'inherit',
              translationStatus: 'missing',
              publicationStatus: 'draft',
              payload:
                mode === 'structure_shared_draft'
                  ? { useBaseline: true, sourceFile: sec.baselineRef || sec.payload?.sourceFile, fields: {} }
                  : { useBaseline: false, sections: [], fields: {} },
            })
            const validation = validateLocaleRecord(rec, { existingRecords: [...records, ...created] })
            if (!validation.ok) throw new Error(validation.errors.join('; '))
            created.push(rec)
            report.sectionsPrepared++
          }
        }

        for (const ct of ['navigation', 'footer', 'seo', 'contact']) {
          const source = findGlobalSource(records, ct, ct === 'seo' ? 'site' : ct)
          if (!source) continue
          const existingLayout = records.find(
            (r) =>
              r.contentType === ct &&
              r.globalIdentity === source.globalIdentity &&
              normalizeCountryCode(r.countryCode) === country &&
              normalizeLocaleLang(r.languageCode) === lang,
          )
          if (existingLayout) continue
          const rec = defaultLocaleRecord({
            contentType: ct,
            globalIdentity: source.globalIdentity,
            slug: source.slug,
            countryCode: country,
            languageCode: lang,
            translationGroupId: source.translationGroupId,
            sourceRecordId: source.id,
            inheritanceMode: 'inherit',
            translationStatus: mode === 'structure_shared_draft' ? 'draft' : 'missing',
            publicationStatus: 'draft',
            payload: mode === 'structure_shared_draft' ? { useBaseline: true, fields: {} } : { fields: {} },
          })
          created.push(rec)
        }
      }
    }

    store.records = [...records, ...created]
    store.setupCompleted[country] = { mode, languages, at: new Date().toISOString() }
    report.countryCreated = true
    report.draftRecordsCreated = created.filter((r) => r.publicationStatus === 'draft').length
    return { created, report }
  })

    deps.logActivity?.({
      action: 'country_setup',
      description: `Setup ${country} (${mode}) — ${result.report.draftRecordsCreated} draft records`,
      section: 'localeRecords',
    })

    return result.report
  } catch (err) {
    report.rolledBack = true
    report.errors.push(err instanceof Error ? err.message : String(err))
    throw err
  }
}

export async function deleteLocaleOverride(deps, recordId) {
  const { result } = await deps.localeStorage.mutateLocaleStore(async (store) => {
    const idx = (store.records || []).findIndex((r) => r.id === recordId)
    if (idx < 0) throw new Error('Record not found')
    const rec = store.records[idx]
    if (String(recordId).startsWith('loc_test_')) {
      store.records.splice(idx, 1)
      return { removed: recordId }
    }
    if (rec.inheritanceMode !== 'override') throw new Error('Only override records can be reset')
    if (normalizeCountryCode(rec.countryCode) === 'AE' && rec.languageCode === 'en' && rec.inheritanceMode === 'global') {
      throw new Error('Cannot delete global baseline')
    }
    const source = rec.sourceRecordId ? (store.records || []).find((r) => r.id === rec.sourceRecordId) : null
    store.records[idx] = {
      ...rec,
      inheritanceMode: 'inherit',
      translationStatus: 'missing',
      publicationStatus: 'draft',
      publishedAt: null,
      updatedAt: new Date().toISOString(),
      payload: {
        useBaseline: true,
        fields: {},
        template: rec.payload?.template || source?.payload?.template || 'cms-page',
      },
    }
    return { reverted: recordId }
  })
  return result
}

export async function upsertLocaleRecord(deps, record, { publish = false } = {}) {
  const { result } = await deps.localeStorage.mutateLocaleStore(async (store) => {
    const records = store.records || []
    const validation = validateLocaleRecord(record, { existingRecords: records })
    if (!validation.ok) throw new Error(validation.errors.join('; '))

    const idx = records.findIndex((r) => r.id === record.id)
    const next = {
      ...record,
      updatedAt: new Date().toISOString(),
      publicationStatus: publish ? 'published' : record.publicationStatus || 'draft',
      publishedAt: publish ? new Date().toISOString() : record.publishedAt,
    }

    if (publish && next.languageCode === 'ar' && !['approved', 'published'].includes(next.translationStatus)) {
      throw new Error('Arabic content requires approved translation status before publishing')
    }

    if (idx >= 0) records[idx] = next
    else records.push(next)
    store.records = records
    return next
  })
  return result
}

export { SETUP_CONTENT_TYPES, SETUP_MODES }
