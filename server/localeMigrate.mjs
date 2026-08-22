/**
 * Bootstrap global locale baselines from existing UAE content (no duplication per country).
 */
import { nanoid } from 'nanoid'
import {
  LOCALE_CONTENT_SCHEMA_VERSION,
  LOCALE_ROUTE_REGISTRY,
  SETUP_CONTENT_TYPES,
  defaultLocaleRecord,
  makeTranslationGroupId,
} from './localeContentModel.mjs'

function erpPagePayload(valueChain, modules) {
  return {
    template: 'cms-page',
    useBaseline: false,
    title: valueChain?.title || { en: 'Enterprise ERP Software', ar: 'برنامج ERP للمؤسسات' },
    heading: valueChain?.title || { en: 'Enterprise-grade control across your value chain', ar: 'تحكم على مستوى المؤسسات' },
    shortDescription: valueChain?.subtitle || { en: 'Manage every department with one connected ERP system.', ar: '' },
    sections: [
      {
        id: 'erp-hero',
        type: 'hero',
        visible: true,
        order: 0,
        content: {
          eyebrow: valueChain?.eyebrow || { en: 'All-in-One ERP Modules', ar: '' },
          title: valueChain?.title || { en: 'Enterprise ERP', ar: '' },
          description: valueChain?.subtitle || { en: '', ar: '' },
          primaryCta: { label: { en: 'Get a Demo', ar: 'احجز عرضًا' }, href: '/contact' },
          secondaryCta: { label: { en: 'Explore Modules', ar: 'استكشف الوحدات' }, href: '#modules' },
        },
      },
      {
        id: 'erp-modules',
        type: 'modules',
        visible: true,
        order: 1,
        content: {
          eyebrow: modules?.eyebrow || { en: 'ERP Modules', ar: '' },
          title: modules?.title || { en: 'Powerful Modules', ar: '' },
          subtitle: modules?.subtitle || { en: '', ar: '' },
        },
      },
      {
        id: 'erp-faqs',
        type: 'faqs',
        visible: true,
        order: 2,
        content: { eyebrow: { en: 'FAQ', ar: 'الأسئلة الشائعة' }, title: { en: 'ERP Questions', ar: '' } },
      },
    ],
  }
}

export async function ensureLocaleBaselines(deps) {
  const { localeStorage, publishStore, safeReadJson, writeJsonFile, logActivity } = deps
  const store = await localeStorage.readLocaleStore()
  if (store.schemaVersion >= LOCALE_CONTENT_SCHEMA_VERSION && store.records?.length > 0) {
    const added = await ensureMissingRouteBaselines(deps, store)
    return { migrated: false, reason: 'already_initialized', count: store.records.length, added }
  }

  const valueChain = await publishStore.readPublished('valueChain.json')
  const modules = await publishStore.readPublished('modules.json')
  const faqs = await publishStore.readPublished('faqs.json')
  const header = await publishStore.readPublished('header.json')
  const footer = await publishStore.readPublished('footer.json')
  const seo = await publishStore.readPublished('seo.json')

  const now = new Date().toISOString()
  const erpGroup = makeTranslationGroupId()
  const records = []

  // Global published ERP solution page (AE/en) — single baseline, not duplicated per country
  records.push(
    defaultLocaleRecord({
      id: `loc_global_erp_en`,
      contentType: 'solution',
      globalIdentity: 'erp',
      slug: 'erp',
      countryCode: 'AE',
      languageCode: 'en',
      translationGroupId: erpGroup,
      sourceRecordId: null,
      inheritanceMode: 'global',
      translationStatus: 'published',
      publicationStatus: 'published',
      enabled: true,
      publishedAt: now,
      updatedAt: now,
      payload: erpPagePayload(valueChain, modules),
      seo: { title: { en: 'ERP Software', ar: 'برنامج ERP' }, noIndex: false },
    }),
  )

  records.push(
    defaultLocaleRecord({
      id: `loc_global_erp_ar`,
      contentType: 'solution',
      globalIdentity: 'erp',
      slug: 'erp',
      countryCode: 'AE',
      languageCode: 'ar',
      translationGroupId: erpGroup,
      sourceRecordId: 'loc_global_erp_en',
      inheritanceMode: 'inherit',
      translationStatus: 'draft',
      publicationStatus: 'draft',
      enabled: true,
      updatedAt: now,
      payload: { template: 'cms-page', useBaseline: true, fields: {} },
    }),
  )

  for (const route of LOCALE_ROUTE_REGISTRY.filter((r) => r.globalIdentity !== 'erp')) {
    const grp = makeTranslationGroupId()
    records.push(
      defaultLocaleRecord({
        contentType: route.contentType,
        globalIdentity: route.globalIdentity,
        slug: route.slug,
        countryCode: 'AE',
        languageCode: 'en',
        translationGroupId: grp,
        inheritanceMode: 'global',
        translationStatus: 'published',
        publicationStatus: 'published',
        publishedAt: now,
        payload: { template: route.template, title: { en: route.slug, ar: '' } },
      }),
    )
  }

  const sectionFiles = [
    { id: 'hero', file: 'hero.json', type: 'pageSection' },
    { id: 'stats', file: 'stats.json', type: 'pageSection' },
    { id: 'about', file: 'about.json', type: 'pageSection' },
    { id: 'valueChain', file: 'valueChain.json', type: 'pageSection' },
    { id: 'modules', file: 'modules.json', type: 'pageSection' },
    { id: 'industries', file: 'industries.json', type: 'pageSection' },
    { id: 'faqs', file: 'faqs.json', type: 'pageSection' },
  ]

  for (const sec of sectionFiles) {
    const doc = await publishStore.readPublished(sec.file)
    if (!doc) continue
    const grp = makeTranslationGroupId()
    records.push(
      defaultLocaleRecord({
        contentType: 'pageSection',
        globalIdentity: sec.id,
        slug: sec.id,
        countryCode: 'AE',
        languageCode: 'en',
        translationGroupId: grp,
        inheritanceMode: 'global',
        translationStatus: 'published',
        publicationStatus: 'published',
        publishedAt: now,
        payload: { useBaseline: true, sourceFile: sec.file, fields: {} },
        baselineRef: sec.file,
      }),
    )
  }

  if (header) {
    records.push(
      defaultLocaleRecord({
        contentType: 'navigation',
        globalIdentity: 'header',
        slug: 'header',
        countryCode: 'AE',
        languageCode: 'en',
        translationGroupId: makeTranslationGroupId(),
        inheritanceMode: 'global',
        translationStatus: 'published',
        publicationStatus: 'published',
        publishedAt: now,
        payload: { useBaseline: true, sourceFile: 'header.json' },
      }),
    )
  }

  if (footer) {
    records.push(
      defaultLocaleRecord({
        contentType: 'footer',
        globalIdentity: 'footer',
        slug: 'footer',
        countryCode: 'AE',
        languageCode: 'en',
        translationGroupId: makeTranslationGroupId(),
        inheritanceMode: 'global',
        translationStatus: 'published',
        publicationStatus: 'published',
        publishedAt: now,
        payload: { useBaseline: true, sourceFile: 'footer.json' },
      }),
    )
  }

  if (seo) {
    records.push(
      defaultLocaleRecord({
        contentType: 'seo',
        globalIdentity: 'site',
        slug: 'seo',
        countryCode: 'AE',
        languageCode: 'en',
        translationGroupId: makeTranslationGroupId(),
        inheritanceMode: 'global',
        translationStatus: 'published',
        publicationStatus: 'published',
        publishedAt: now,
        payload: { useBaseline: true, sourceFile: 'seo.json' },
        seo,
      }),
    )
  }

  const nextStore = {
    schemaVersion: LOCALE_CONTENT_SCHEMA_VERSION,
    records,
    setupCompleted: {},
    _meta: { createdAt: now, updatedAt: now, migratedFrom: 'uae_global_baseline' },
  }

  await writeJsonFile('localeRecords.json', nextStore)
  logActivity?.({ action: 'locale_migrate', description: `Initialized ${records.length} global locale baselines`, section: 'localeRecords' })

  return { migrated: true, count: records.length, contentTypes: SETUP_CONTENT_TYPES }
}

/** Add AE global baselines for newly registered routes without duplicating existing records. */
export async function ensureMissingRouteBaselines(deps, store) {
  const { writeJsonFile, publishStore } = deps
  const records = store.records || []
  const now = new Date().toISOString()
  const added = []

  for (const route of LOCALE_ROUTE_REGISTRY) {
    const exists = records.some(
      (r) =>
        r.contentType === route.contentType &&
        r.globalIdentity === route.globalIdentity &&
        r.countryCode === 'AE' &&
        r.languageCode === 'en',
    )
    if (exists) continue

    let baselineFile = null
    if (route.slug === 'industries') baselineFile = 'industries.json'
    if (route.slug === 'faqs') baselineFile = 'faqs.json'
    if (route.slug === 'contact') baselineFile = 'contact.json'

    const grp = makeTranslationGroupId()
    added.push(
      defaultLocaleRecord({
        contentType: route.contentType,
        globalIdentity: route.globalIdentity,
        slug: route.slug,
        countryCode: 'AE',
        languageCode: 'en',
        translationGroupId: grp,
        inheritanceMode: 'global',
        translationStatus: 'published',
        publicationStatus: 'published',
        publishedAt: now,
        payload: baselineFile
          ? { template: route.template, useBaseline: true, sourceFile: baselineFile, fields: {} }
          : { template: route.template, title: { en: route.slug, ar: '' } },
        baselineRef: baselineFile || undefined,
      }),
    )
  }

  if (!added.length) return 0

  const nextStore = {
    ...store,
    records: [...records, ...added],
    _meta: { ...(store._meta || {}), updatedAt: now, routeBaselinesAdded: added.length },
  }
  await writeJsonFile('localeRecords.json', nextStore)
  return added.length
}
