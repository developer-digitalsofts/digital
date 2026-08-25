/**
 * Locale record mutation actions — copy, reset, unpublish.
 */
import {
  defaultLocaleRecord,
  findRecordByIdentity,
  validateLocaleRecord,
  DEFAULT_GLOBAL_COUNTRY,
  DEFAULT_GLOBAL_LANG,
} from './localeContentModel.mjs'
import { normalizeCountryCode } from './countryHelpers.mjs'
import { deleteLocaleOverride, upsertLocaleRecord } from './countrySetup.mjs'
import { resetFieldToInherited, copyFieldFromSource } from './localeFieldHelpers.mjs'
import { regionalizeDocument, loadCountryProfile } from './localeRegionalize.mjs'
import { HOMEPAGE_LOCALE_MAP } from './localeHomepage.mjs'

const LAYOUT_IDENTITY = {
  navigation: 'header',
  footer: 'footer',
  seo: 'site',
  contact: 'contact',
}

async function loadMergedSourcePayload(deps, source, publishStore) {
  let payload = structuredClone(source.payload || {})
  const baselineFile = source.baselineRef || payload.sourceFile
  if (baselineFile) {
    try {
      const raw = await publishStore.readPublished(baselineFile)
      const baseline = publishStore.stripMeta(raw) ?? raw ?? {}
      if (payload.useBaseline === true || source.inheritanceMode === 'global' || source.inheritanceMode === 'inherit') {
        payload = { ...baseline, ...(payload.fields || {}), ...payload }
        delete payload.fields
        delete payload.useBaseline
        delete payload.sourceFile
      }
    } catch {
      /* keep payload as-is */
    }
  }
  return payload
}

export async function repairCountryLocaleRecords(deps, countryCode, lang) {
  const country = normalizeCountryCode(countryCode)
  const language = lang === 'ar' ? 'ar' : 'en'

  const { result } = await deps.localeStorage.mutateLocaleStore(async (store) => {
    const records = store.records || []
    const keyFor = (r) => `${r.contentType}:${r.globalIdentity}:${normalizeCountryCode(r.countryCode)}:${r.languageCode}`

    const grouped = new Map()
    for (const rec of records) {
      if (normalizeCountryCode(rec.countryCode) !== country || rec.languageCode !== language) continue
      const key = keyFor(rec)
      if (!grouped.has(key)) grouped.set(key, [])
      grouped.get(key).push(rec)
    }

    const toRemove = new Set()
    for (const [, list] of grouped) {
      if (list.length <= 1) continue
      const sorted = [...list].sort((a, b) => {
        if (a.inheritanceMode === 'override' && b.inheritanceMode !== 'override') return -1
        if (b.inheritanceMode === 'override' && a.inheritanceMode !== 'override') return 1
        return String(a.updatedAt || '').localeCompare(String(b.updatedAt || ''))
      })
      for (const dup of sorted.slice(1)) toRemove.add(dup.id)
    }

    store.records = records.filter((r) => !toRemove.has(r.id))

    const created = []
    for (const ct of ['navigation', 'footer', 'seo']) {
      const globalIdentity = LAYOUT_IDENTITY[ct]
      const exists = store.records.some(
        (r) =>
          r.contentType === ct &&
          r.globalIdentity === globalIdentity &&
          normalizeCountryCode(r.countryCode) === country &&
          r.languageCode === language,
      )
      if (exists) continue
      const source = findRecordByIdentity(store.records, ct, globalIdentity, DEFAULT_GLOBAL_COUNTRY, DEFAULT_GLOBAL_LANG)
      if (!source) continue
      created.push(
        defaultLocaleRecord({
          contentType: ct,
          globalIdentity,
          slug: source.slug,
          countryCode: country,
          languageCode: language,
          translationGroupId: source.translationGroupId,
          sourceRecordId: source.id,
          inheritanceMode: 'inherit',
          translationStatus: 'missing',
          publicationStatus: 'draft',
          payload: { fields: {} },
        }),
      )
    }

    if (created.length) store.records = [...store.records, ...created]
    return { removed: toRemove.size, created: created.length }
  })

  return result
}

export async function copyUaeStructureAsCountryDraft(deps, { countryCode, lang = 'en', regionalize = true }) {
  const country = normalizeCountryCode(countryCode)
  if (country === DEFAULT_GLOBAL_COUNTRY) throw new Error('Cannot bulk-copy UAE structure onto UAE baseline')

  const language = lang === 'ar' ? 'ar' : 'en'
  await repairCountryLocaleRecords(deps, country, language)

  const countryProfile = regionalize ? await loadCountryProfile(deps.publishStore, country) : null
  const draftStore = await deps.localeStorage.readLocaleStore()
  const targets = (draftStore.records || []).filter(
    (r) => normalizeCountryCode(r.countryCode) === country && r.languageCode === language,
  )

  const report = { copied: 0, skipped: 0, errors: [] }

  for (const target of targets) {
    try {
      const source = findRecordByIdentity(
        draftStore.records,
        target.contentType,
        target.globalIdentity,
        DEFAULT_GLOBAL_COUNTRY,
        DEFAULT_GLOBAL_LANG,
      )
      if (!source) {
        report.skipped++
        continue
      }

      let payload = await loadMergedSourcePayload(deps, source, deps.publishStore)
      let seo = source.seo ? structuredClone(source.seo) : target.seo

      if (regionalize && countryProfile) {
        payload = regionalizeDocument(payload, country, { countryProfile })
        if (seo) seo = regionalizeDocument(seo, country, { countryProfile })
      }

      const next = {
        ...target,
        sourceRecordId: source.id,
        inheritanceMode: 'override',
        translationStatus: 'draft',
        publicationStatus: 'draft',
        publishedAt: null,
        payload,
        seo,
        updatedAt: new Date().toISOString(),
      }

      const validation = validateLocaleRecord(next, { existingRecords: draftStore.records })
      if (!validation.ok) throw new Error(validation.errors.join('; '))

      await upsertLocaleRecord(deps, next)
      report.copied++
    } catch (err) {
      report.errors.push(`${target.contentType}/${target.globalIdentity}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  // Ensure homepage pageSection records exist even if missing from setup
  for (const map of Object.values(HOMEPAGE_LOCALE_MAP)) {
    const existing = findRecordByIdentity(draftStore.records, map.contentType, map.globalIdentity, country, language)
    if (existing) continue
    const source = findRecordByIdentity(draftStore.records, map.contentType, map.globalIdentity, DEFAULT_GLOBAL_COUNTRY, DEFAULT_GLOBAL_LANG)
    if (!source) continue
    let payload = await loadMergedSourcePayload(deps, source, deps.publishStore)
    if (regionalize && countryProfile) payload = regionalizeDocument(payload, country, { countryProfile })
    await upsertLocaleRecord(
      deps,
      defaultLocaleRecord({
        contentType: map.contentType,
        globalIdentity: map.globalIdentity,
        slug: source.slug,
        countryCode: country,
        languageCode: language,
        translationGroupId: source.translationGroupId,
        sourceRecordId: source.id,
        inheritanceMode: 'override',
        translationStatus: 'draft',
        publicationStatus: 'draft',
        payload,
      }),
    )
    report.copied++
  }

  deps.logActivity?.({
    action: 'locale_bulk_copy',
    description: `Copied UAE structure to ${country}/${language} — ${report.copied} records`,
    section: 'localeRecords',
  })

  return report
}

export async function copyLocaleFromSource(deps, { targetId, sourceCountry, sourceLang, asDraft = true }) {
  const store = await deps.localeStorage.readLocaleStore()
  const target = (store.records || []).find((r) => r.id === targetId)
  if (!target) throw new Error('Target record not found')

  const source = findRecordByIdentity(store.records, target.contentType, target.globalIdentity, sourceCountry, sourceLang)
  if (!source) throw new Error(`No source record for ${target.contentType}/${target.globalIdentity} at ${sourceCountry}/${sourceLang}`)

  const next = {
    ...target,
    sourceRecordId: source.id,
    inheritanceMode: 'override',
    translationStatus: asDraft ? 'draft' : source.translationStatus,
    publicationStatus: asDraft ? 'draft' : source.publicationStatus,
    payload: structuredClone(source.payload || {}),
    seo: source.seo ? structuredClone(source.seo) : target.seo,
    updatedAt: new Date().toISOString(),
  }

  const validation = validateLocaleRecord(next, { existingRecords: store.records })
  if (!validation.ok) throw new Error(validation.errors.join('; '))

  return upsertLocaleRecord(deps, next)
}

export async function useGlobalContent(deps, { contentType, globalIdentity, countryCode, lang }) {
  const store = await deps.localeStorage.readLocaleStore()
  const country = normalizeCountryCode(countryCode)
  const language = lang === 'ar' ? 'ar' : 'en'

  const existing = findRecordByIdentity(store.records, contentType, globalIdentity, country, language)
  if (existing?.inheritanceMode === 'override') {
    await deleteLocaleOverride(deps, existing.id)
  }

  const global = findRecordByIdentity(store.records, contentType, globalIdentity, DEFAULT_GLOBAL_COUNTRY, DEFAULT_GLOBAL_LANG)
  if (!global) throw new Error('Global baseline not found')

  if (existing && existing.inheritanceMode !== 'override') {
    const next = {
      ...existing,
      inheritanceMode: 'inherit',
      sourceRecordId: global.id,
      translationStatus: 'missing',
      publicationStatus: 'draft',
      payload: { useBaseline: true, fields: {} },
      updatedAt: new Date().toISOString(),
    }
    return upsertLocaleRecord(deps, next)
  }

  if (existing) return existing

  const rec = defaultLocaleRecord({
    contentType,
    globalIdentity,
    slug: global.slug,
    countryCode: country,
    languageCode: language,
    translationGroupId: global.translationGroupId,
    sourceRecordId: global.id,
    inheritanceMode: 'inherit',
    translationStatus: 'missing',
    publicationStatus: 'draft',
    payload: { useBaseline: true, fields: {} },
  })

  return upsertLocaleRecord(deps, rec)
}

export async function customizeForCountry(deps, { contentType, globalIdentity, countryCode, lang, slug }) {
  const store = await deps.localeStorage.readLocaleStore()
  const country = normalizeCountryCode(countryCode)
  const language = lang === 'ar' ? 'ar' : 'en'

  const global = findRecordByIdentity(store.records, contentType, globalIdentity, DEFAULT_GLOBAL_COUNTRY, DEFAULT_GLOBAL_LANG)
  const existing = findRecordByIdentity(store.records, contentType, globalIdentity, country, language)

  if (existing?.inheritanceMode === 'override') return existing

  const rec = defaultLocaleRecord({
    ...(existing || {}),
    contentType,
    globalIdentity,
    slug: slug || global?.slug || globalIdentity,
    countryCode: country,
    languageCode: language,
    translationGroupId: global?.translationGroupId || existing?.translationGroupId,
    sourceRecordId: global?.id || existing?.sourceRecordId || null,
    inheritanceMode: 'override',
    translationStatus: 'draft',
    publicationStatus: 'draft',
    payload: existing?.payload ? structuredClone(existing.payload) : global?.payload ? structuredClone(global.payload) : {},
  })

  return upsertLocaleRecord(deps, rec)
}

export async function unpublishLocaleRecord(deps, recordId) {
  const store = await deps.localeStorage.readLocaleStore()
  const existing = (store.records || []).find((r) => r.id === recordId)
  if (!existing) throw new Error('Record not found')
  if (normalizeCountryCode(existing.countryCode) === DEFAULT_GLOBAL_COUNTRY && existing.languageCode === DEFAULT_GLOBAL_LANG) {
    throw new Error('Cannot unpublish global UAE English baseline')
  }
  return upsertLocaleRecord(deps, { ...existing, publicationStatus: 'unpublished' })
}

export async function approveLocaleRecord(deps, recordId) {
  const store = await deps.localeStorage.readLocaleStore()
  const existing = (store.records || []).find((r) => r.id === recordId)
  if (!existing) throw new Error('Record not found')
  return upsertLocaleRecord(deps, { ...existing, translationStatus: 'approved' })
}

export async function setTranslationStatus(deps, recordId, status) {
  const allowed = new Set(['missing', 'draft', 'needs_review', 'approved', 'published', 'archived'])
  if (!allowed.has(status)) throw new Error(`Invalid translation status: ${status}`)
  const store = await deps.localeStorage.readLocaleStore()
  const existing = (store.records || []).find((r) => r.id === recordId)
  if (!existing) throw new Error('Record not found')
  const next = { ...existing, translationStatus: status, updatedAt: new Date().toISOString() }
  if (status === 'archived') next.publicationStatus = 'archived'
  return upsertLocaleRecord(deps, next)
}

export async function archiveLocaleRecord(deps, recordId) {
  return setTranslationStatus(deps, recordId, 'archived')
}

export async function resetLocaleField(deps, recordId, fieldName) {
  const store = await deps.localeStorage.readLocaleStore()
  const existing = (store.records || []).find((r) => r.id === recordId)
  if (!existing) throw new Error('Record not found')
  const payload = resetFieldToInherited(existing.payload || {}, fieldName)
  return upsertLocaleRecord(deps, { ...existing, payload, inheritanceMode: 'override', translationStatus: 'draft' })
}

export async function copyLocaleField(deps, recordId, fieldName, sourceCountry, sourceLang) {
  const store = await deps.localeStorage.readLocaleStore()
  const existing = (store.records || []).find((r) => r.id === recordId)
  if (!existing) throw new Error('Record not found')
  const source = findRecordByIdentity(store.records, existing.contentType, existing.globalIdentity, sourceCountry, sourceLang)
  if (!source) throw new Error(`No source for field copy at ${sourceCountry}/${sourceLang}`)
  const payload = copyFieldFromSource(existing.payload || {}, fieldName, source.payload || {})
  return upsertLocaleRecord(deps, { ...existing, payload, inheritanceMode: 'override', translationStatus: 'draft' })
}

