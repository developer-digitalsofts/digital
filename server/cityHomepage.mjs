/**
 * Build a full Pakistan homepage payload localized to one city.
 * City sections are CMS-managed via city-scoped locale records; national JSON is the fallback baseline.
 */
import { buildCityHomepageFromCms, listCitySectionRecords } from './cityCmsSections.mjs'
import { getCityHomepageProfile } from './cityHomepageProfiles.mjs'
import { isPkCitySlug, buildCityHomePath, servingBusinessesIn } from './pakistanConfig.mjs'
import { readBilingualText } from './contentHelpers.mjs'

function clone(value) {
  return value && typeof value === 'object' ? JSON.parse(JSON.stringify(value)) : value
}

function bi(en) {
  return { en, ar: en }
}

function overlayText(doc, field, en) {
  if (!doc || !en) return
  const current = doc[field]
  if (current && typeof current === 'object') {
    doc[field] = { ...current, en }
  } else {
    doc[field] = bi(en)
  }
}

async function loadCityCmsOverlay(deps, citySlug) {
  if (!deps?.localePublish?.readPublishedStore) return null
  try {
    const store = await deps.localePublish.readPublishedStore()
    const record = (store.records || []).find(
      (r) =>
        r.contentType === CITY_CONTENT_TYPE &&
        r.citySlug === citySlug &&
        r.globalIdentity === cityGlobalIdentity(citySlug, CITY_PAGE_SLUG) &&
        normalizeCountryCode(r.countryCode) === 'PK' &&
        r.languageCode === 'en' &&
        r.publicationStatus === 'published' &&
        r.enabled !== false,
    )
    return record || null
  } catch {
    return null
  }
}

function cityAwareH1(profile, cmsHeading) {
  const raw = String(cmsHeading || profile.h1 || '').trim()
  const hasBrand = /digitalmanager/i.test(raw)
  const hasCity = new RegExp(profile.cityName, 'i').test(raw)
  if (hasBrand && hasCity) return raw
  if (hasCity && !hasBrand) return `DigitalManager in ${profile.cityName} — ${raw}`
  return profile.h1
}

function applyHeroOverlay(hero, profile, cms) {
  const next = clone(hero) || {}
  const h1 = cityAwareH1(profile, cms.heading)
  const intro = cms.intro || profile.intro
  const eyebrow = cms.eyebrow || profile.eyebrow
  overlayText(next, 'title', h1)
  overlayText(next, 'titleBefore', profile.titleBefore)
  overlayText(next, 'titleAccent', profile.titleAccent)
  if (profile.titleLine2) overlayText(next, 'titleLine2', profile.titleLine2)
  else next.titleLine2 = { en: '', ar: '' }
  overlayText(next, 'sub', intro)
  overlayText(next, 'body', intro)
  overlayText(next, 'pill', eyebrow)
  next.useStructuredTitle = true
  if (Array.isArray(next.slides) && next.slides.length) {
    next.slides = next.slides.map((slide, index) => {
      const row = { ...slide }
      if (index === 0) {
        overlayText(row, 'pill', eyebrow)
        overlayText(row, 'titleBefore', profile.titleBefore)
        overlayText(row, 'titleAccent', profile.titleAccent)
        if (profile.titleLine2) overlayText(row, 'titleLine2', profile.titleLine2)
        else row.titleLine2 = { en: '', ar: '' }
        overlayText(row, 'body', intro)
      } else if (row.body?.en) {
        overlayText(
          row,
          'body',
          `${row.body.en} ${profile.serviceArea}.`,
        )
      }
      return row
    })
  }
  return next
}

function applyStatsOverlay(stats, profile) {
  const next = clone(stats) || {}
  overlayText(next, 'title', `Trusted by growing businesses — ${profile.serviceArea.toLowerCase()}`)
  overlayText(next, 'heading', `Trusted by growing businesses — ${profile.serviceArea.toLowerCase()}`)
  return next
}

function applyIndustriesOverlay(industries, profile) {
  const next = clone(industries) || {}
  overlayText(next, 'title', `Built for ${profile.cityName} industries`)
  overlayText(
    next,
    'subtitle',
    `DigitalManager supports ${profile.industriesFocus}. ${profile.serviceArea}. National industry programmes stay available — city copy highlights the local mix.`,
  )
  overlayText(
    next,
    'description',
    `DigitalManager supports ${profile.industriesFocus}. ${profile.serviceArea}.`,
  )
  return next
}

function applyFaqsOverlay(faqs, profile, cmsFaqs) {
  const next = clone(faqs) || {}
  const extras = Array.isArray(cmsFaqs) && cmsFaqs.length ? cmsFaqs : profile.faqs
  const items = Array.isArray(next.items) ? [...next.items] : []
  const existingQs = new Set(items.map((item) => readBilingualText(item.question || item.q, 'en').toLowerCase()))
  for (const extra of extras) {
    const q = extra.q || extra.question?.en || extra.question
    const a = extra.a || extra.answer?.en || extra.answer
    if (!q || !a || existingQs.has(String(q).toLowerCase())) continue
    items.push({
      id: `city-faq-${profile.slug}-${items.length}`,
      question: bi(q),
      answer: bi(a),
      active: true,
      sortOrder: items.length,
    })
  }
  next.items = items
  return next
}

function applyDemoCtaOverlay(demoCta, profile) {
  const next = clone(demoCta) || {}
  overlayText(next, 'title', `See DigitalManager in action for ${profile.cityName}`)
  overlayText(next, 'heading', `See DigitalManager in action for ${profile.cityName}`)
  overlayText(next, 'subtitle', `${profile.serviceArea}. Book a walkthrough of finance, inventory, POS and payroll.`)
  return next
}

function cityAwareTitle(profile, cmsTitle) {
  const raw = String(cmsTitle || '').trim()
  if (new RegExp(`DigitalManager in ${profile.cityName}`, 'i').test(raw)) return raw
  return profile.metaTitle
}

function applySeoOverlay(seo, profile, cms) {
  const next = clone(seo) || {}
  const title = cityAwareTitle(profile, cms.title)
  const description = cms.description || profile.metaDesc
  overlayText(next, 'pageTitle', title)
  overlayText(next, 'metaDescription', description)
  overlayText(next, 'ogTitle', title)
  overlayText(next, 'ogDescription', description)
  overlayText(next, 'twitterTitle', title)
  overlayText(next, 'twitterDescription', description)
  next.canonicalUrl = buildCityHomePath(profile.slug)
  next.robotsIndex = 'index'
  next.robotsFollow = 'follow'
  return next
}

function applySiteSettingsOverlay(siteSettings, profile) {
  const next = clone(siteSettings) || {}
  next.officeAddress = bi(profile.serviceArea)
  overlayText(next, 'defaultMetaDescription', profile.metaDesc)
  overlayText(next, 'websiteTagline', profile.serviceArea)
  return next
}

const CITY_REQUIRED_SECTIONS = [
  'hero',
  'about',
  'valueChain',
  'demoCta',
  'modules',
  'testimonials',
  'personalizedDemo',
  'faqs',
]

function applyPageSectionsOverlay(pageSections, cmsSections) {
  const next = clone(pageSections) || { sections: [] }
  const byId = new Map((next.sections || []).map((s) => [s.id, { ...s }]))
  for (const id of CITY_REQUIRED_SECTIONS) {
    const current = byId.get(id) || { id, name: id, visible: true, sortOrder: byId.size }
    byId.set(id, { ...current, visible: true })
  }
  const stats = byId.get('stats')
  if (stats) byId.set('stats', { ...stats, visible: false })
  if (Array.isArray(cmsSections) && cmsSections.length) {
    for (const row of cmsSections) {
      if (!row?.id) continue
      const current = byId.get(row.id) || { id: row.id, name: row.name || row.id, visible: true, sortOrder: 0 }
      byId.set(row.id, {
        ...current,
        visible: row.visible !== false,
        sortOrder: Number.isFinite(row.sortOrder) ? row.sortOrder : current.sortOrder,
        name: row.name || current.name,
      })
    }
  }
  next.sections = [...byId.values()].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  return next
}

export function applyCityHomepageOverlay(baseline, citySlug, cmsOverlay = {}) {
  const profile = getCityHomepageProfile(citySlug)
  if (!profile || !baseline) return baseline
  const out = clone(baseline)
  out.hero = applyHeroOverlay(out.hero, profile, cmsOverlay)
  out.stats = applyStatsOverlay(out.stats, profile)
  out.industries = applyIndustriesOverlay(out.industries, profile)
  out.faqs = applyFaqsOverlay(out.faqs, profile, cmsOverlay.faqs)
  if (out.demoCta) out.demoCta = applyDemoCtaOverlay(out.demoCta, profile)
  out.seo = applySeoOverlay(out.seo, profile, cmsOverlay)
  out.siteSettings = applySiteSettingsOverlay(out.siteSettings, profile)
  out.pageSections = applyPageSectionsOverlay(out.pageSections, cmsOverlay.pageSections)
  out.city = {
    slug: profile.slug,
    name: profile.cityName,
    serviceArea: profile.serviceArea,
  }
  out.regional = {
    currency: 'PKR',
    cities: cmsOverlay.dashboardCities?.length >= 4 ? cmsOverlay.dashboardCities : profile.branches,
    companies: cmsOverlay.dashboardCompanies?.length >= 4 ? cmsOverlay.dashboardCompanies : profile.companies,
  }
  out.meta = {
    ...(out.meta || {}),
    locale: {
      ...(out.meta?.locale || {}),
      countryCode: 'PK',
      lang: 'en',
      citySlug: profile.slug,
      fallbackUsed: false,
      noIndex: false,
    },
  }
  return out
}

export async function buildCityHomepagePayload(deps, citySlug, options = {}) {
  const slug = String(citySlug || '').toLowerCase()
  if (!isPkCitySlug(slug)) return deps.loadPublishedHomepagePayload()

  const context = options.preview ? 'preview' : 'public'
  const store =
    context === 'preview'
      ? await deps.localePublish.readDraftStore()
      : await deps.localePublish.readPublishedStore()
  const citySections = listCitySectionRecords(store.records, slug)

  // Legacy profile overlay — used only until city section records are migrated
  if (citySections.length === 0 && !options.preview) {
    return buildLegacyProfileHomepage(deps, slug)
  }

  const cmsDeps = {
    ...deps,
    publishStore: deps.publishStore,
  }
  const out = await buildCityHomepageFromCms(cmsDeps, slug, { context })

  const heroRecord = citySections.find((r) => r.globalIdentity === 'hero')
  const dashCities = heroRecord?.payload?.dashboardCities
  const dashCompanies = heroRecord?.payload?.dashboardCompanies
  const profile = getCityHomepageProfile(slug)
  if (dashCities?.length >= 4 || dashCompanies?.length >= 4 || profile) {
    out.regional = {
      currency: 'PKR',
      cities: dashCities?.length >= 4 ? dashCities : profile?.branches || [],
      companies: dashCompanies?.length >= 4 ? dashCompanies : profile?.companies || [],
    }
  }

  return out
}

async function buildLegacyProfileHomepage(deps, slug) {
  const baseline = await deps.loadPublishedHomepagePayload()
  const store = await deps.localePublish.readPublishedStore()
  const record = (store.records || []).find(
    (r) => r.contentType === 'cityPage' && r.citySlug === slug && r.slug === 'home' && r.publicationStatus === 'published',
  )
  const cmsOverlay = {
    heading: readBilingualText(record?.payload?.heading, 'en'),
    intro: readBilingualText(record?.payload?.shortDescription, 'en'),
    title: readBilingualText(record?.seo?.title, 'en'),
    description: readBilingualText(record?.seo?.description, 'en'),
    eyebrow: readBilingualText(record?.payload?.eyebrow, 'en') || record?.payload?.eyebrow,
    faqs: record?.payload?.homepageFaqs || record?.payload?.extraFaqs,
    pageSections: record?.payload?.pageSections,
    dashboardCities: record?.payload?.dashboardCities,
    dashboardCompanies: record?.payload?.dashboardCompanies,
  }
  return applyCityHomepageOverlay(baseline, slug, cmsOverlay)
}

export function cityServiceAreaCopy(citySlug) {
  const profile = getCityHomepageProfile(citySlug)
  return profile?.serviceArea || servingBusinessesIn(citySlug)
}
