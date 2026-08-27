/**
 * Publish-aware SEO resolution: sitemap entries, canonical URLs, hreflang alternates.
 */
import { isPublishedRecord, isValidTestimonial, readBilingualText } from './contentHelpers.mjs'
import { normalizeCountryCode, publishedCountries } from './countryHelpers.mjs'
import {
  LOCALE_ROUTE_REGISTRY,
  canPublishRecord,
  normalizeLocaleLang,
  softwareDetailRoute,
} from './localeContentModel.mjs'
import { RESOLVED_FROM, findLocaleRecord, resolveContent, resolveLocaleRecord } from './localeHelpers.mjs'
import {
  buildLocalizedHref,
  buildLocalePath,
  hreflangTag,
  isDefaultLocale,
  normalizePublicPath,
  ogLocaleTag,
  parseLocalePath,
} from './seoPaths.mjs'
import { registryStaticPaths, uaeCorePaths, uaeSoftwarePaths } from './seoRouteCatalog.mjs'
import { getLocaleHomepageIndexMeta } from './localeHomepage.mjs'
import { CITY_PAGE_SLUG, getCitiesForCountry } from './cityRegistry.mjs'
import { buildCityPagePath, parseCityPagePath } from './cityPaths.mjs'
import { evaluateCityIndexability, resolveCityContent } from './cityLocaleApi.mjs'

export const PUBLIC_SITE_BASE =
  (process.env.PUBLIC_SITE_URL || 'https://www.digitalmanager.ae').replace(/\/$/, '')

const GCC_COUNTRY_SLUGS = ['ae', 'sa', 'kw', 'qa', 'om', 'bh']
const GCC_LANGS = ['en', 'ar']

function absoluteUrl(pathname) {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  return `${PUBLIC_SITE_BASE}${path}`
}

function isoDate(value) {
  if (!value) return null
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString().slice(0, 10)
}

function pickLastmod(...candidates) {
  let best = null
  for (const raw of candidates) {
    const iso = isoDate(raw)
    if (!iso) continue
    if (!best || iso > best) best = iso
  }
  return best || null
}

function recordSeoNoIndex(record) {
  const seo = record?.seo || {}
  return seo.noIndex === true || seo.robotsIndex === 'noindex'
}

/**
 * Whether a resolved locale page should be indexed (sitemap + hreflang + robots).
 */
export function evaluateIndexability({ record, meta, countryCode, lang, countryEnabled = true }) {
  if (!countryEnabled) return { indexable: false, reason: 'country_disabled' }
  if (!record || meta?.missing) return { indexable: false, reason: 'missing' }
  if (record.enabled === false) return { indexable: false, reason: 'record_disabled' }
  if (record.publicationStatus !== 'published') return { indexable: false, reason: 'not_published' }
  if (recordSeoNoIndex(record)) return { indexable: false, reason: 'seo_noindex' }

  const country = normalizeCountryCode(countryCode)
  const language = normalizeLocaleLang(lang)
  const can = canPublishRecord(record, { countryEnabled })
  if (!can.ok) return { indexable: false, reason: can.reason }

  if (country === 'AE' && language === 'en' && !record?.citySlug) {
    return { indexable: true, reason: 'uae_english_canonical' }
  }

  if (meta?.resolvedFrom === RESOLVED_FROM.CITY_OVERRIDE && record?.citySlug) {
    return evaluateCityIndexability({ record, meta, countryCode, lang, countryEnabled })
  }

  if (meta.resolvedFrom !== RESOLVED_FROM.LOCALE_OVERRIDE) {
    return { indexable: false, reason: 'fallback_content' }
  }
  if (meta.fallbackUsed) return { indexable: false, reason: 'fallback_used' }
  if (language === 'ar' && !['approved', 'published'].includes(record.translationStatus || '')) {
    return { indexable: false, reason: 'translation_not_approved' }
  }

  return { indexable: true, reason: 'localized_published' }
}

function groupKeyForRecord(record) {
  if (!record) return null
  if (record.translationGroupId) return `grp:${record.translationGroupId}`
  if (record.globalIdentity) return `id:${record.contentType}:${record.globalIdentity}`
  if (record.slug) return `slug:${record.contentType}:${record.slug}`
  return null
}

function internalPathForRegistrySlug(slug) {
  return slug === 'home' ? '/' : `/${slug}`
}

function internalPathForSoftware(globalIdentity) {
  if (!globalIdentity) return null
  if (globalIdentity.startsWith('module:')) {
    const s = globalIdentity.slice('module:'.length)
    const flat = uaeSoftwarePaths().find((p) => p.endsWith(`/${s}`) || p.endsWith(`/${s.replace(/-management-software$/, '-software')}`))
    if (flat) return flat
    return `/software/module/${s}`
  }
  if (globalIdentity.startsWith('industry:')) {
    return `/software/industry/${globalIdentity.slice('industry:'.length)}`
  }
  return null
}

function resolveRegistryPage(store, route, countryCode, lang, countryEnabled) {
  const resolved = resolveContent(
    store,
    {
      contentType: route.contentType,
      globalIdentity: route.globalIdentity,
      slug: route.slug,
      countryCode,
      lang,
    },
    {
      context: 'public',
      countryEnabled,
      allowGlobalFallback: countryCode === 'AE',
      allowFallback: countryCode === 'AE' || lang === 'en',
    },
  )
  return resolved
}

function makePageEntry({ internalPath, countrySlug, lang, record, meta, groupKey, lastmod, identity }) {
  const path = buildLocalePath(countrySlug, lang, internalPath)
  return {
    internalPath,
    path,
    absoluteUrl: absoluteUrl(path),
    countrySlug,
    lang,
    countryCode: normalizeCountryCode(countrySlug.toUpperCase()),
    hreflang: hreflangTag(countrySlug, lang),
    ogLocale: ogLocaleTag(countrySlug, lang),
    record,
    meta,
    groupKey,
    lastmod,
    identity,
    indexable: true,
  }
}

function tryAddEntry(entries, seen, candidate) {
  if (!candidate?.absoluteUrl || seen.has(candidate.absoluteUrl)) return
  seen.add(candidate.absoluteUrl)
  entries.push(candidate)
}

function homepageLastmod(publishMeta, seoDoc) {
  const sectionDates = Object.values(publishMeta || {})
    .map((v) => v?.lastPublishedAt)
    .filter(Boolean)
  return pickLastmod(seoDoc?._meta?.updatedAt, seoDoc?._meta?.lastPublishedAt, ...sectionDates)
}

function blogInternalPath(slug, countrySlug, lang) {
  const segment = isDefaultLocale(countrySlug, lang) ? 'blog' : 'insights'
  return `/${segment}/${slug}`
}

/**
 * Build all indexable public pages for sitemap + SEO API.
 */
export async function buildIndexablePages(deps) {
  const { localePublish, publishStore } = deps
  const [localeStore, countriesDoc, postsDoc, testimonialsDoc, seoDoc, publishMeta] = await Promise.all([
    localePublish.readPublishedStore(),
    publishStore.readPublished('countries.json').catch(() => ({ items: [] })),
    publishStore.readPublished('blogPosts.json').catch(() => ({ items: [] })),
    publishStore.readPublished('testimonials.json').catch(() => ({ items: [] })),
    publishStore.readPublished('seo.json').catch(() => ({})),
    publishStore.readPublished('publishMeta.json').catch(() => ({})),
  ])

  const enabledCodes = new Set(
    (countriesDoc?.items || [])
      .filter((c) => c.enabled !== false)
      .map((c) => normalizeCountryCode(c.code)),
  )

  const entries = []
  const seen = new Set()
  const homeLastmod = homepageLastmod(publishMeta, seoDoc)

  // Homepage — UAE English canonical
  tryAddEntry(entries, seen, {
    internalPath: '/',
    path: '/',
    absoluteUrl: absoluteUrl('/'),
    countrySlug: 'ae',
    lang: 'en',
    countryCode: 'AE',
    hreflang: hreflangTag('ae', 'en'),
    ogLocale: ogLocaleTag('ae', 'en'),
    record: null,
    meta: { resolvedFrom: RESOLVED_FROM.GLOBAL },
    groupKey: 'page:home',
    lastmod: homeLastmod,
    identity: { kind: 'home' },
    indexable: true,
  })

  // UAE English trust and developer pages
  const trustPages = [
    { path: '/developers', kind: 'developers', title: 'DigitalManager Developer Platform' },
    { path: '/about', kind: 'about', title: 'About DigitalManager' },
    { path: '/contact', kind: 'contact', title: 'Contact DigitalManager' },
    { path: '/privacy', kind: 'privacy', title: 'DigitalManager Privacy Policy' },
  ]
  for (const page of trustPages) {
    tryAddEntry(entries, seen, {
      internalPath: page.path,
      path: page.path,
      absoluteUrl: absoluteUrl(page.path),
      countrySlug: 'ae',
      lang: 'en',
      countryCode: 'AE',
      hreflang: hreflangTag('ae', 'en'),
      ogLocale: ogLocaleTag('ae', 'en'),
      record: null,
      meta: { resolvedFrom: RESOLVED_FROM.GLOBAL },
      groupKey: `page:${page.kind}`,
      lastmod: homeLastmod,
      identity: { kind: page.kind },
      indexable: true,
      seoTitle: page.title,
    })
  }

  // Published GCC English homepages
  for (const countrySlug of GCC_COUNTRY_SLUGS) {
    if (countrySlug === 'ae') continue
    const countryCode = normalizeCountryCode(countrySlug.toUpperCase())
    if (!enabledCodes.has(countryCode)) continue
    const homeMeta = await getLocaleHomepageIndexMeta(deps, countryCode, 'en')
    if (!homeMeta.hasPublishedContent) continue
    const path = buildLocalePath(countrySlug, 'en', '/')
    tryAddEntry(entries, seen, {
      internalPath: '/',
      path,
      absoluteUrl: absoluteUrl(path),
      countrySlug,
      lang: 'en',
      countryCode,
      hreflang: hreflangTag(countrySlug, 'en'),
      ogLocale: ogLocaleTag(countrySlug, 'en'),
      record: null,
      meta: { resolvedFrom: RESOLVED_FROM.LOCALE_OVERRIDE },
      groupKey: 'page:home',
      lastmod: homeLastmod,
      identity: { kind: 'home', countryCode, lang: 'en' },
      indexable: true,
    })
  }

  // Static registry pages (erp, contact, industries list, etc.)
  for (const route of LOCALE_ROUTE_REGISTRY) {
    const internalPath = internalPathForRegistrySlug(route.slug)
    for (const countrySlug of GCC_COUNTRY_SLUGS) {
      for (const lang of GCC_LANGS) {
        const countryCode = normalizeCountryCode(countrySlug.toUpperCase())
        if (!enabledCodes.has(countryCode)) continue
        const resolved = resolveRegistryPage(localeStore, route, countryCode, lang, enabledCodes.has(countryCode))
        const check = evaluateIndexability({
          record: resolved.record,
          meta: resolved.meta,
          countryCode,
          lang,
          countryEnabled: enabledCodes.has(countryCode),
        })
        if (!check.indexable) continue
        tryAddEntry(
          entries,
          seen,
          makePageEntry({
            internalPath,
            countrySlug,
            lang,
            record: resolved.record,
            meta: resolved.meta,
            groupKey: groupKeyForRecord(resolved.record) || `registry:${route.globalIdentity}`,
            lastmod: pickLastmod(resolved.record?.updatedAt, resolved.record?.publishedAt),
            identity: { kind: 'registry', globalIdentity: route.globalIdentity, slug: route.slug },
          }),
        )
      }
    }
  }

  // Blog listing — UAE English
  tryAddEntry(entries, seen, {
    internalPath: '/blog',
    path: '/blog',
    absoluteUrl: absoluteUrl('/blog'),
    countrySlug: 'ae',
    lang: 'en',
    countryCode: 'AE',
    hreflang: hreflangTag('ae', 'en'),
    ogLocale: ogLocaleTag('ae', 'en'),
    record: null,
    meta: {},
    groupKey: 'page:blog-list',
    lastmod: pickLastmod(postsDoc?._meta?.updatedAt, postsDoc?._meta?.lastPublishedAt),
    identity: { kind: 'blog-list' },
    indexable: true,
  })

  // Testimonials listing (UAE only when enabled content exists)
  const tPage = testimonialsDoc?.page || {}
  const hasTestimonials =
    tPage.enabled !== false &&
    (testimonialsDoc?.items || []).some((i) => isPublishedRecord(i) && isValidTestimonial(i))
  if (hasTestimonials) {
    tryAddEntry(entries, seen, {
      internalPath: '/testimonials',
      path: '/testimonials',
      absoluteUrl: absoluteUrl('/testimonials'),
      countrySlug: 'ae',
      lang: 'en',
      countryCode: 'AE',
      hreflang: hreflangTag('ae', 'en'),
      ogLocale: ogLocaleTag('ae', 'en'),
      record: null,
      meta: {},
      groupKey: 'page:testimonials',
      lastmod: pickLastmod(testimonialsDoc?._meta?.updatedAt, testimonialsDoc?._meta?.lastPublishedAt),
      identity: { kind: 'testimonials' },
      indexable: true,
    })
  }

  // Blog posts — UAE English only (blog CMS is not locale-record based yet)
  for (const post of (postsDoc?.items || []).filter((p) => isPublishedRecord(p) && p.slug)) {
    const internalPath = `/blog/${post.slug}`
    tryAddEntry(entries, seen, {
      internalPath,
      path: internalPath,
      absoluteUrl: absoluteUrl(internalPath),
      countrySlug: 'ae',
      lang: 'en',
      countryCode: 'AE',
      hreflang: hreflangTag('ae', 'en'),
      ogLocale: ogLocaleTag('ae', 'en'),
      record: null,
      meta: {},
      groupKey: `blog:${post.slug}`,
      lastmod: pickLastmod(post.updatedAt, post.publishedAt, post.createdAt),
      identity: { kind: 'blog-post', slug: post.slug },
      indexable: true,
    })
  }

  // UAE software detail routes (static route catalog)
  for (const internalPath of uaeSoftwarePaths()) {
    let globalIdentity = null
    let contentType = null
    const industryMatch = internalPath.match(/^\/software\/industry\/([^/]+)$/)
    const moduleMatch = internalPath.match(/^\/software\/([^/]+)$/)
    if (industryMatch) {
      globalIdentity = `industry:${industryMatch[1]}`
      contentType = 'industry'
    } else if (moduleMatch) {
      const slugPart = moduleMatch[1]
      const route = softwareDetailRoute('module', slugPart) || softwareDetailRoute('module', slugPart.replace(/-software$/, '-management-software'))
      if (route) {
        globalIdentity = route.globalIdentity
        contentType = route.contentType
      }
    }

    let addedForPath = false

    if (globalIdentity && contentType) {
      for (const countrySlug of GCC_COUNTRY_SLUGS) {
        for (const lang of GCC_LANGS) {
          const countryCode = normalizeCountryCode(countrySlug.toUpperCase())
          if (!enabledCodes.has(countryCode)) continue
          const resolved = resolveContent(
            localeStore,
            { contentType, globalIdentity, slug: globalIdentity.split(':').slice(1).join(':'), countryCode, lang },
            {
              context: 'public',
              countryEnabled: enabledCodes.has(countryCode),
              allowGlobalFallback: countryCode === 'AE',
              allowFallback: countryCode === 'AE',
            },
          )
          const check = evaluateIndexability({
            record: resolved.record,
            meta: resolved.meta,
            countryCode,
            lang,
            countryEnabled: enabledCodes.has(countryCode),
          })
          if (!check.indexable) continue
          addedForPath = true
          tryAddEntry(
            entries,
            seen,
            makePageEntry({
              internalPath,
              countrySlug,
              lang,
              record: resolved.record,
              meta: resolved.meta,
              groupKey: groupKeyForRecord(resolved.record) || `software:${globalIdentity}`,
              lastmod: pickLastmod(resolved.record?.updatedAt, resolved.record?.publishedAt),
              identity: { kind: 'software', globalIdentity, internalPath },
            }),
          )
        }
      }
    }

    if (!addedForPath) {
      tryAddEntry(entries, seen, {
        internalPath,
        path: internalPath,
        absoluteUrl: absoluteUrl(internalPath),
        countrySlug: 'ae',
        lang: 'en',
        countryCode: 'AE',
        hreflang: hreflangTag('ae', 'en'),
        ogLocale: ogLocaleTag('ae', 'en'),
        record: null,
        meta: { resolvedFrom: RESOLVED_FROM.GLOBAL },
        groupKey: `software-static:${internalPath}`,
        lastmod: homeLastmod,
        identity: { kind: 'software-static', internalPath },
        indexable: true,
      })
    }
  }

  // Scan published locale records for any additional indexable localized pages
  for (const record of localeStore.records || []) {
    if (record.enabled === false) continue
    const countryCode = normalizeCountryCode(record.countryCode)
    const lang = normalizeLocaleLang(record.languageCode)
    const countrySlug = countryCode.toLowerCase()
    if (!enabledCodes.has(countryCode)) continue

    let internalPath = null
    if (record.slug && LOCALE_ROUTE_REGISTRY.some((r) => r.slug === record.slug)) {
      internalPath = internalPathForRegistrySlug(record.slug)
    } else if (record.globalIdentity?.startsWith('module:') || record.globalIdentity?.startsWith('industry:')) {
      internalPath = internalPathForSoftware(record.globalIdentity)
    }
    if (!internalPath) continue

    const matches = findLocaleRecord(localeStore.records, {
      contentType: record.contentType,
      globalIdentity: record.globalIdentity,
      slug: record.slug,
      countryCode,
      lang,
    })
    const resolved = resolveLocaleRecord(null, matches, {
      context: 'public',
      countryEnabled: enabledCodes.has(countryCode),
      allowGlobalFallback: countryCode === 'AE',
      allowFallback: countryCode === 'AE',
    })
    const check = evaluateIndexability({
      record: resolved.record,
      meta: resolved.meta,
      countryCode,
      lang,
      countryEnabled: enabledCodes.has(countryCode),
    })
    if (!check.indexable) continue

    tryAddEntry(
      entries,
      seen,
      makePageEntry({
        internalPath,
        countrySlug,
        lang,
        record: resolved.record,
        meta: resolved.meta,
        groupKey: groupKeyForRecord(resolved.record),
        lastmod: pickLastmod(resolved.record?.updatedAt, resolved.record?.publishedAt),
        identity: { kind: 'locale-record', globalIdentity: record.globalIdentity, slug: record.slug },
      }),
    )
  }

  // Published city ERP pages (/dubai/erp-software, /sa/en/riyadh/erp-software, …)
  for (const countrySlug of GCC_COUNTRY_SLUGS) {
    const countryCode = normalizeCountryCode(countrySlug.toUpperCase())
    if (!enabledCodes.has(countryCode)) continue
    for (const city of getCitiesForCountry(countryCode)) {
      for (const lang of GCC_LANGS) {
        const resolved = resolveContent(
          localeStore,
          {
            contentType: 'cityPage',
            globalIdentity: `city:${city.slug}:${CITY_PAGE_SLUG}`,
            slug: CITY_PAGE_SLUG,
            citySlug: city.slug,
            countryCode,
            lang,
          },
          {
            context: 'public',
            countryEnabled: enabledCodes.has(countryCode),
            allowGlobalFallback: false,
            allowFallback: false,
            citySlug: city.slug,
          },
        )
        const check = evaluateCityIndexability({
          record: resolved.record,
          meta: resolved.meta,
          countryCode,
          lang,
          countryEnabled: enabledCodes.has(countryCode),
        })
        if (!check.indexable) continue
        const internalPath = `/${city.slug}/${CITY_PAGE_SLUG}`
        tryAddEntry(
          entries,
          seen,
          makePageEntry({
            internalPath,
            countrySlug,
            lang,
            record: resolved.record,
            meta: resolved.meta,
            groupKey: groupKeyForRecord(resolved.record) || `city:${city.slug}:${CITY_PAGE_SLUG}`,
            lastmod: pickLastmod(resolved.record?.updatedAt, resolved.record?.publishedAt),
            identity: { kind: 'city-page', citySlug: city.slug, slug: CITY_PAGE_SLUG },
          }),
        )
      }
    }
  }

  return { entries, enabledCodes, seoDoc, countriesDoc }
}

function groupAlternates(entries) {
  const byGroup = new Map()
  for (const entry of entries) {
    if (!entry.groupKey) continue
    if (!byGroup.has(entry.groupKey)) byGroup.set(entry.groupKey, [])
    byGroup.get(entry.groupKey).push(entry)
  }
  return byGroup
}

function xDefaultPathForGroup(groupEntries) {
  const aeEn =
    groupEntries.find((e) => e.countrySlug === 'ae' && e.lang === 'en') ||
    groupEntries.find((e) => isDefaultLocale(e.countrySlug, e.lang))
  if (!aeEn) return null
  return aeEn.path
}

export function attachAlternates(entries) {
  const groups = groupAlternates(entries)
  return entries.map((entry) => {
    const group = groups.get(entry.groupKey) || [entry]
    const xDefaultPath = xDefaultPathForGroup(group)
    const alternates = []
    if (xDefaultPath) {
      alternates.push({ hreflang: 'x-default', href: absoluteUrl(xDefaultPath) })
    }
    for (const alt of group) {
      alternates.push({ hreflang: alt.hreflang, href: alt.absoluteUrl })
    }
    const canonical = entry.absoluteUrl
    return { ...entry, canonical, alternates, xDefault: xDefaultPath ? absoluteUrl(xDefaultPath) : null }
  })
}

export async function buildSitemapXml(deps) {
  const { entries } = await buildIndexablePages(deps)
  const withAlternates = attachAlternates(entries)
  const lines = withAlternates.map((entry) => {
    const lastmod = entry.lastmod ? `\n    <lastmod>${entry.lastmod}</lastmod>` : ''
    return `  <url>\n    <loc>${entry.absoluteUrl}</loc>${lastmod}\n  </url>`
  })
  return {
    xml: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${lines.join('\n')}\n</urlset>\n`,
    count: withAlternates.length,
    entries: withAlternates,
  }
}

function matchEntryForPath(entries, pathname) {
  const normalized = normalizePublicPath(pathname)
  let match = entries.find((e) => e.path === normalized)
  if (match) return match

  const parsed = parseLocalePath(pathname)
  const rest = parsed.restPath.replace(/\/+$/, '') || '/'

  // Blog alias: /insights -> /blog internal identity
  if (rest.startsWith('/insights')) {
    const blogRest = rest.replace(/^\/insights/, '/blog')
    const blogPath = buildLocalePath(parsed.country, parsed.lang, blogRest)
    match = entries.find((e) => e.path === blogPath)
    if (match) return match
  }

  return entries.find((e) => e.path === buildLocalePath(parsed.country, parsed.lang, rest)) || null
}

function fallbackSeoForPath(pathname, seoDoc, lang) {
  const parsed = parseLocalePath(pathname)
  const canonical = absoluteUrl(normalizePublicPath(pathname))
  const title = readBilingualText(seoDoc?.pageTitle, parsed.lang) || readBilingualText(seoDoc?.pageTitle, 'en') || 'DigitalManager'
  const description =
    readBilingualText(seoDoc?.metaDescription, parsed.lang) || readBilingualText(seoDoc?.metaDescription, 'en') || ''
  const noIndex = !isDefaultLocale(parsed.country, parsed.lang)
  const xDefaultPath = buildLocalizedHref('ae', 'en', parsed.restPath)
  const alternates = [{ hreflang: 'x-default', href: absoluteUrl(xDefaultPath) }]
  if (noIndex) {
    return {
      path: normalizePublicPath(pathname),
      canonical,
      noIndex: true,
      robots: 'noindex, follow',
      lang: parsed.lang,
      dir: parsed.lang === 'ar' ? 'rtl' : 'ltr',
      title,
      description,
      ogLocale: ogLocaleTag(parsed.country, parsed.lang),
      ogUrl: canonical,
      alternates,
      xDefault: absoluteUrl(xDefaultPath),
      indexable: false,
    }
  }
  alternates.push({ hreflang: hreflangTag('ae', 'en'), href: absoluteUrl(xDefaultPath) })
  return {
    path: normalizePublicPath(pathname),
    canonical,
    noIndex: false,
    robots: 'index, follow',
    lang: parsed.lang,
    dir: parsed.lang === 'ar' ? 'rtl' : 'ltr',
    title,
    description,
    ogLocale: ogLocaleTag(parsed.country, parsed.lang),
    ogUrl: canonical,
    alternates,
    xDefault: absoluteUrl(xDefaultPath),
    indexable: true,
  }
}

export async function resolveSeoForPath(deps, pathname) {
  const { entries, seoDoc } = await buildIndexablePages(deps)
  const withAlternates = attachAlternates(entries)
  const match = matchEntryForPath(withAlternates, pathname)

  if (!match) {
    const cityParsed = parseCityPagePath(pathname)
    if (cityParsed.isCityPage && cityParsed.citySlug && cityParsed.pageSlug) {
      const full = await resolveCityContent(deps, {
        citySlug: cityParsed.citySlug,
        pageSlug: cityParsed.pageSlug,
        countryCode: cityParsed.countryCode,
        lang: cityParsed.lang,
        context: 'public',
      })
      const check = evaluateCityIndexability({
        record: full.record,
        meta: full.meta,
        countryCode: cityParsed.countryCode,
        lang: cityParsed.lang,
        countryEnabled: true,
      })
      const seo = full.record?.seo || {}
      const titleFromRecord = readBilingualText(seo.title || seo.pageTitle, cityParsed.lang)
      const descFromRecord = readBilingualText(seo.description || seo.metaDescription, cityParsed.lang)
      const canonical = absoluteUrl(buildCityPagePath(cityParsed.country, cityParsed.lang, cityParsed.citySlug, cityParsed.pageSlug))
      const noIndex = !check.indexable || full.meta?.fallbackUsed || full.meta?.cityFallback
      return {
        path: buildCityPagePath(cityParsed.country, cityParsed.lang, cityParsed.citySlug, cityParsed.pageSlug),
        canonical,
        noIndex,
        robots: noIndex ? 'noindex, follow' : 'index, follow',
        lang: cityParsed.lang,
        dir: cityParsed.lang === 'ar' ? 'rtl' : 'ltr',
        title: titleFromRecord || readBilingualText(seoDoc?.pageTitle, cityParsed.lang) || 'DigitalManager',
        description: descFromRecord || readBilingualText(seoDoc?.metaDescription, cityParsed.lang) || '',
        ogLocale: ogLocaleTag(cityParsed.country, cityParsed.lang),
        ogUrl: canonical,
        alternates: [{ hreflang: 'x-default', href: absoluteUrl(buildLocalePath('ae', 'en', '/')) }],
        xDefault: absoluteUrl(buildLocalePath('ae', 'en', '/')),
        indexable: !noIndex,
      }
    }
    return fallbackSeoForPath(pathname, seoDoc)
  }

  const parsed = parseLocalePath(pathname)
  const lang = parsed.lang
  const seo = match.record?.seo || {}
  const titleFromRecord = readBilingualText(seo.title || seo.pageTitle, lang)
  const descFromRecord = readBilingualText(seo.description || seo.metaDescription, lang)
  const globalTitle = readBilingualText(seoDoc?.pageTitle, lang)
  const globalDesc = readBilingualText(seoDoc?.metaDescription, lang)

  const title = titleFromRecord || match.seoTitle || globalTitle || 'DigitalManager'
  const description = descFromRecord || globalDesc || ''
  const noIndex = !match.indexable
  const robotsIndex = seo.robotsIndex === 'noindex' || noIndex ? 'noindex' : 'index'
  const robotsFollow = seo.robotsFollow === 'nofollow' ? 'nofollow' : 'follow'

  return {
    path: match.path,
    canonical: match.canonical,
    noIndex,
    robots: `${robotsIndex}, ${robotsFollow}`,
    lang,
    dir: lang === 'ar' ? 'rtl' : 'ltr',
    title,
    description,
    ogLocale: match.ogLocale,
    ogUrl: match.canonical,
    alternates: match.alternates,
    xDefault: match.xDefault,
    indexable: match.indexable,
    hreflang: match.hreflang,
  }
}

export function sitemapStats(entries) {
  const included = entries.length
  const uaeRoot = entries.filter((e) => isDefaultLocale(e.countrySlug, e.lang)).length
  const localized = included - uaeRoot
  const corePaths = uaeCorePaths().length + 1
  const softwarePaths = uaeSoftwarePaths().length
  const excludedDraftLocales = GCC_COUNTRY_SLUGS.filter((c) => c !== 'ae').length * GCC_LANGS.length
  return {
    included,
    uaeRoot,
    localized,
    coreRouteCatalog: corePaths,
    softwareRouteCatalog: softwarePaths,
    excludedNonUaeDraftSlots: excludedDraftLocales,
  }
}

export { absoluteUrl, normalizePublicPath, parseLocalePath, uaeCorePaths, registryStaticPaths }
