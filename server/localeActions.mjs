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

