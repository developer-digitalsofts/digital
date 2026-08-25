/**
 * Temporary locale test fixtures — never written to production stores directly.
 * Used by verify-locale-phase.mjs inside a backup/restore session.
 */
import { normalizeCountryCode } from '../../server/countryHelpers.mjs'
import { defaultLocaleRecord, findRecordByIdentity, LOCALE_ROUTE_REGISTRY, normalizeLocaleLang } from '../../server/localeContentModel.mjs'

export const TEST_MARKER_PATTERN = /\[TEST|\[اختبار\]/

export const TEST_RECORDS = [
  {
    contentType: 'solution',
    globalIdentity: 'erp',
    slug: 'erp',
    countryCode: 'QA',
    languageCode: 'en',
    inheritanceMode: 'override',
    translationStatus: 'draft',
    publicationStatus: 'draft',
    payload: {
      template: 'cms-page',
      title: { en: '[TEST QA] ERP Page', ar: '' },
      heading: { en: '[TEST QA] Enterprise ERP for Qatar', ar: '' },
      shortDescription: { en: 'Test-only draft ERP content for Qatar English preview.', ar: '' },
      sections: [{ id: 'qa-test-hero', type: 'hero', visible: true, order: 0, content: { title: { en: 'QA ERP Test', ar: '' } } }],
      fieldMeta: { heading: { status: 'customized', inherited: false } },
      fields: { heading: { en: '[TEST QA] Enterprise ERP for Qatar', ar: '' } },
    },
  },
  {
    contentType: 'solution',
    globalIdentity: 'erp',
    slug: 'erp',
    countryCode: 'SA',
    languageCode: 'ar',
    inheritanceMode: 'override',
    translationStatus: 'needs_review',
    publicationStatus: 'draft',
    payload: {
      template: 'cms-page',
      title: { en: '', ar: '[اختبار] نظام ERP' },
      heading: { en: '', ar: '[اختبار] ERP للمملكة' },
      shortDescription: { en: '', ar: 'محتوى تجريبي — مسودة فقط.' },
      sections: [],
      fieldMeta: { heading: { status: 'customized', inherited: false } },
      fields: { heading: { en: '', ar: '[اختبار] ERP للمملكة' } },
    },
  },
  {
    contentType: 'industry',
    globalIdentity: 'industry:retail-management-software',
    slug: 'retail-management-software',
    countryCode: 'OM',
    languageCode: 'en',
    inheritanceMode: 'override',
    translationStatus: 'draft',
    publicationStatus: 'draft',
    payload: {
      template: 'software-detail',
      title: { en: '[TEST OM] Retail Management', ar: '' },
      heading: { en: '[TEST OM] Retail Industry Software', ar: '' },
      shortDescription: { en: 'Test draft industry page for Oman.', ar: '' },
      sections: [{ id: 'om-retail-body', type: 'richText', visible: true, order: 0, content: {} }],
    },
  },
  {
    contentType: 'solution',
    globalIdentity: 'module:inventory-management-software',
    slug: 'inventory-management-software',
    countryCode: 'KW',
    languageCode: 'ar',
    inheritanceMode: 'override',
    translationStatus: 'draft',
    publicationStatus: 'draft',
    payload: {
      template: 'software-detail',
      title: { en: '', ar: '[اختبار] إدارة المخزون' },
      heading: { en: '', ar: '[اختبار] برنامج المخزون' },
      shortDescription: { en: '', ar: 'مسودة تجريبية — الكويت.' },
      sections: [],
    },
  },
  {
    contentType: 'contact',
    globalIdentity: 'contact',
    slug: 'contact',
    countryCode: 'BH',
    languageCode: 'en',
    inheritanceMode: 'override',
    translationStatus: 'draft',
    publicationStatus: 'draft',
    payload: {
      template: 'cms-page',
      title: { en: '[TEST BH] Contact Us', ar: '' },
      heading: { en: '[TEST BH] Contact Digital Manager Bahrain', ar: '' },
      shortDescription: { en: 'Test draft contact page for Bahrain.', ar: '' },
      sections: [],
    },
  },
]

/** Country-setup route identities that must exist as inherit placeholders after cleanup. */
export const SETUP_RESTORE_IDENTITIES = [
  { contentType: 'solution', globalIdentity: 'erp', slug: 'erp', countryCode: 'QA', languageCode: 'en' },
  { contentType: 'solution', globalIdentity: 'erp', slug: 'erp', countryCode: 'SA', languageCode: 'ar' },
  { contentType: 'contact', globalIdentity: 'contact', slug: 'contact', countryCode: 'BH', languageCode: 'en' },
]

export function isTestRecordId(id) {
  return String(id || '').startsWith('loc_test_')
}

export function hasTestMarkers(value) {
  if (typeof value === 'string') return TEST_MARKER_PATTERN.test(value)
  if (Array.isArray(value)) return value.some(hasTestMarkers)
  if (value && typeof value === 'object') return Object.values(value).some(hasTestMarkers)
  return false
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

function structureOnlyPayload(route) {
  return {
    template: route?.template || 'cms-page',
    title: { en: '', ar: '' },
    heading: { en: '', ar: '' },
    shortDescription: { en: '', ar: '' },
    sections: [
      { id: `${route.slug}-hero`, type: 'hero', visible: true, order: 0, content: {} },
      { id: `${route.slug}-body`, type: 'richText', visible: true, order: 1, content: {} },
    ],
    useBaseline: false,
    fields: {},
  }
}

function routeForIdentity(contentType, globalIdentity) {
  const fromRegistry = LOCALE_ROUTE_REGISTRY.find(
    (r) => r.contentType === contentType && r.globalIdentity === globalIdentity,
  )
  if (fromRegistry) return fromRegistry
  if (globalIdentity.startsWith('industry:') || globalIdentity.startsWith('module:')) {
    const slug = globalIdentity.split(':').slice(1).join(':')
    return {
      slug,
      contentType,
      globalIdentity,
      template: 'software-detail',
    }
  }
  return { slug: globalIdentity, contentType, globalIdentity, template: 'cms-page' }
}

function makeInheritPlaceholder(records, partial) {
  const source = findGlobalSource(records, partial.contentType, partial.globalIdentity)
  const route = routeForIdentity(partial.contentType, partial.globalIdentity)
  return defaultLocaleRecord({
    contentType: partial.contentType,
    globalIdentity: partial.globalIdentity,
    slug: partial.slug || route.slug,
    countryCode: partial.countryCode,
    languageCode: partial.languageCode,
    translationGroupId: source?.translationGroupId || undefined,
    sourceRecordId: source?.id || null,
    inheritanceMode: 'inherit',
    translationStatus: 'missing',
    publicationStatus: 'draft',
    enabled: true,
    publishedAt: null,
    payload: structureOnlyPayload(route),
  })
}

/**
 * Remove test records/markers from a locale store and restore missing setup placeholders.
 * @param {object} store
 * @returns {{ store: object, removedIds: string[], restored: string[] }}
 */
export function cleanLocaleStore(store) {
  const next = structuredClone(store)
  const records = next.records || []
  const removedIds = []

  next.records = records.filter((r) => {
    if (isTestRecordId(r.id)) {
      removedIds.push(r.id)
      return false
    }
    if (hasTestMarkers(r.payload) || hasTestMarkers(r.seo)) {
      removedIds.push(r.id)
      return false
    }
    return true
  })

  const restored = []
  for (const partial of SETUP_RESTORE_IDENTITIES) {
    const exists = findRecordByIdentity(
      next.records,
      partial.contentType,
      partial.globalIdentity,
      partial.countryCode,
      partial.languageCode,
    )
    if (!exists) {
      next.records.push(makeInheritPlaceholder(next.records, partial))
      restored.push(`${partial.countryCode}/${partial.languageCode}/${partial.globalIdentity}`)
    }
  }

  if (next._meta) {
    delete next._meta.testRecordsSeededAt
  }
  next._meta = {
    ...(next._meta || {}),
    updatedAt: new Date().toISOString(),
  }

  return { store: next, removedIds, restored }
}

/**
 * Apply temporary test fixtures to a cloned store (does not mutate input).
 * @param {object} store
 */
export function applyTestFixturesToStore(store) {
  const next = structuredClone(store)
  next.records = (next.records || []).filter((r) => !isTestRecordId(r.id))
  const aeErp = next.records.find((r) => r.globalIdentity === 'erp' && r.countryCode === 'AE' && r.languageCode === 'en')

  for (const partial of TEST_RECORDS) {
    // Drop the inherit placeholder for this identity so only the temporary loc_test_* record exists.
    next.records = next.records.filter(
      (r) =>
        !(
          r.contentType === partial.contentType &&
          r.globalIdentity === partial.globalIdentity &&
          normalizeCountryCode(r.countryCode) === normalizeCountryCode(partial.countryCode) &&
          normalizeLocaleLang(r.languageCode) === normalizeLocaleLang(partial.languageCode)
        ),
    )

    next.records.push(
      defaultLocaleRecord({
        ...partial,
        id: `loc_test_${partial.countryCode.toLowerCase()}_${partial.slug}_${partial.languageCode}`,
        sourceRecordId: aeErp?.id || null,
        translationGroupId: aeErp?.translationGroupId,
        enabled: true,
        updatedAt: new Date().toISOString(),
      }),
    )
  }

  return next
}
