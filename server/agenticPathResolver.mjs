/**
 * Resolve whether a public HTML path is a known React route (vs true 404).
 */
import { isPublishedRecord } from './contentHelpers.mjs'
import { LOCALE_ROUTE_REGISTRY } from './localeContentModel.mjs'
import { parseLocalePath, LOCALE_COUNTRY_SLUGS, LOCALE_LANGS } from './seoPaths.mjs'
import { parseCityPagePath } from './cityPaths.mjs'
import { isValidCityForCountry } from './cityRegistry.mjs'
import { registryStaticPaths, uaeSoftwarePaths } from './seoRouteCatalog.mjs'

const TRUST_PATHS = new Set(['/about', '/contact', '/privacy', '/developers'])
const CORE_PATHS = new Set([
  '/',
  '/industries',
  '/contact',
  '/about',
  '/privacy',
  '/developers',
  '/testimonials',
  '/blog',
  '/erp',
  '/solutions',
  '/business-models',
  '/faqs',
  '/cities',
  ...registryStaticPaths().filter((p) => p !== '/industries' && p !== '/contact' && p !== '/testimonials'),
])

const SOFTWARE_PATHS = new Set(uaeSoftwarePaths())

function normalizePath(pathname) {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1)
  return path
}

function blogSegment(lang, country) {
  return country === 'ae' && lang === 'en' ? 'blog' : 'insights'
}

export async function resolvePublicPath(deps, pathname) {
  const path = normalizePath(pathname)

  if (path.startsWith('/admin')) {
    return { known: true, kind: 'admin', path, locale: null, restPath: path }
  }

  if (path.match(/^\/ae\/en(\/|$)/)) {
    const cityUnderAe = path.match(/^\/ae\/en\/([^/]+)\/([^/]+)\/?$/)
    if (cityUnderAe && isValidCityForCountry(cityUnderAe[1], 'AE')) {
      return {
        known: true,
        kind: 'redirect',
        redirectTo: `/${cityUnderAe[1]}/${cityUnderAe[2]}`,
        path,
        locale: { country: 'ae', lang: 'en' },
        restPath: `/${cityUnderAe[1]}/${cityUnderAe[2]}`,
      }
    }
    return { known: true, kind: 'redirect', path, locale: { country: 'ae', lang: 'en' }, restPath: '/' }
  }

  const parsed = parseLocalePath(path)
  const { country, lang, restPath, hasLocalePrefix } = parsed

  if (hasLocalePrefix) {
    if (!LOCALE_COUNTRY_SLUGS.includes(country) || !LOCALE_LANGS.includes(lang)) {
      return { known: false, kind: 'unknown', path, locale: parsed, restPath }
    }
  }

  const internal = restPath === '' ? '/' : restPath.startsWith('/') ? restPath : `/${restPath}`
  const normalizedInternal = internal.length > 1 && internal.endsWith('/') ? internal.slice(0, -1) : internal

  if (normalizedInternal === '/' || CORE_PATHS.has(normalizedInternal) || TRUST_PATHS.has(normalizedInternal)) {
    return {
      known: true,
      kind: normalizedInternal === '/' ? 'home' : normalizedInternal.slice(1).replace(/\//g, '-') || 'home',
      path,
      locale: parsed,
      restPath: normalizedInternal,
    }
  }

  if (SOFTWARE_PATHS.has(normalizedInternal)) {
    return { known: true, kind: 'software', path, locale: parsed, restPath: normalizedInternal }
  }

  if (normalizedInternal.startsWith('/software/')) {
    const parts = normalizedInternal.split('/').filter(Boolean)
    if (parts.length === 2 || parts.length === 3) {
      return { known: true, kind: 'software', path, locale: parsed, restPath: normalizedInternal }
    }
  }

  const blogBase = `/${blogSegment(lang, country)}`
  if (normalizedInternal === blogBase) {
    return { known: true, kind: 'blog-list', path, locale: parsed, restPath: normalizedInternal }
  }

  if (normalizedInternal.startsWith(`${blogBase}/`)) {
    const slug = normalizedInternal.slice(blogBase.length + 1).split('/')[0]
    if (slug) {
      const postsDoc = await deps.publishStore.readPublished('blogPosts.json').catch(() => ({ items: [] }))
      const post = (postsDoc?.items || []).find((p) => isPublishedRecord(p) && p.slug === slug)
      if (post) {
        return { known: true, kind: 'blog-post', path, locale: parsed, restPath: normalizedInternal, slug, post }
      }
      return { known: false, kind: 'unknown', path, locale: parsed, restPath: normalizedInternal }
    }
  }

  if (hasLocalePrefix && normalizedInternal.startsWith('/industries/')) {
    const slug = normalizedInternal.split('/')[2]
    if (slug) {
      return { known: true, kind: 'locale-industry', path, locale: parsed, restPath: normalizedInternal, slug }
    }
  }

  const cityParsed = parseCityPagePath(path)
  if (cityParsed.redirectTo) {
    return {
      known: true,
      kind: 'redirect',
      redirectTo: cityParsed.redirectTo,
      path,
      locale: parsed,
      restPath: normalizedInternal,
      citySlug: cityParsed.citySlug,
      pageSlug: cityParsed.pageSlug,
    }
  }
  if (cityParsed.unknownCityPath) {
    return { known: false, kind: 'unknown', path, locale: parsed, restPath: normalizedInternal }
  }
  if (cityParsed.isCityHome && cityParsed.citySlug) {
    return {
      known: true,
      kind: 'city-home',
      path,
      locale: parsed,
      restPath: normalizedInternal,
      citySlug: cityParsed.citySlug,
      pageSlug: cityParsed.pageSlug,
    }
  }
  if (cityParsed.isCitySoftware && cityParsed.citySlug) {
    return {
      known: true,
      kind: 'city-software',
      path,
      locale: parsed,
      restPath: normalizedInternal,
      citySlug: cityParsed.citySlug,
      pageSlug: cityParsed.pageSlug,
      softwarePath: cityParsed.softwarePath,
    }
  }
  if (cityParsed.isCitySitePage && cityParsed.citySlug) {
    const site = cityParsed.sitePath || `/${cityParsed.pageSlug || ''}`
    if (site.startsWith('/industries/')) {
      return {
        known: true,
        kind: 'city-software',
        path,
        locale: parsed,
        restPath: normalizedInternal,
        citySlug: cityParsed.citySlug,
        pageSlug: cityParsed.pageSlug,
        softwarePath: cityParsed.softwarePath || `/software/industry/${site.split('/')[2]}`,
      }
    }
    const kind = site.replace(/^\//, '').replace(/\//g, '-') || 'home'
    return {
      known: true,
      kind,
      path,
      locale: parsed,
      restPath: normalizedInternal,
      citySlug: cityParsed.citySlug,
      pageSlug: cityParsed.pageSlug,
    }
  }
  if (cityParsed.isCityPage && cityParsed.citySlug && cityParsed.pageSlug) {
    return {
      known: true,
      kind: 'city-page',
      path,
      locale: parsed,
      restPath: normalizedInternal,
      citySlug: cityParsed.citySlug,
      pageSlug: cityParsed.pageSlug,
    }
  }

  const registrySlugs = new Set(LOCALE_ROUTE_REGISTRY.map((r) => r.slug))
  const segments = normalizedInternal.split('/').filter(Boolean)
  if (segments.length === 1 && registrySlugs.has(segments[0])) {
    return { known: true, kind: 'registry', path, locale: parsed, restPath: normalizedInternal, slug: segments[0] }
  }

  const pagesStore = await deps.readPagesStore?.().catch(() => ({ items: [] }))
  const cmsSlug = segments.length === 1 ? segments[0] : null
  if (cmsSlug) {
    const page = (pagesStore?.items || []).find((p) => p.slug === cmsSlug && p.status === 'published')
    if (page) {
      return { known: true, kind: 'cms-page', path, locale: parsed, restPath: normalizedInternal, slug: cmsSlug, page }
    }
  }

  return { known: false, kind: 'unknown', path, locale: parsed, restPath: normalizedInternal }
}

export function isMarkdownPreferred(req) {
  const accept = String(req.headers.accept || '').toLowerCase()
  if (!accept.includes('text/markdown')) return false
  const htmlWeight = accept.match(/text\/html(?:;\s*q=([\d.]+))?/)?.[1]
  const mdWeight = accept.match(/text\/markdown(?:;\s*q=([\d.]+))?/)?.[1]
  const htmlQ = htmlWeight ? Number(htmlWeight) : accept.includes('text/html') ? 1 : 0
  const mdQ = mdWeight ? Number(mdWeight) : 1
  return mdQ >= htmlQ
}

/** True when the client prefers an HTML document over Markdown (Accept negotiation). */
export function prefersHtmlDocument(req) {
  if (isMarkdownPreferred(req)) return false
  const accept = String(req.headers.accept || '').toLowerCase().trim()
  if (!accept) return true
  return accept.includes('text/html') || accept.includes('*/*')
}

/** Approved crawler/agent User-Agent fragments (shared with geo-routing bot skip list). */
export const APPROVED_CRAWLER_UA =
  /googlebot|bingbot|duckduckbot|baiduspider|yandexbot|gptbot|chatgpt-user|claudebot|anthropic-ai|google-extended|bytespider|petalbot|cohere-ai|ia_archiver|facebookexternalhit|linkedinbot|twitterbot|applebot|slackbot|whatsapp|discordbot|amazonbot|perplexitybot|deepseekbot|ora-agent|mediapartners|slurp|semrush|ahrefs|mj12bot|dotbot|rogerbot|embedly|outbrain|pinterest/i

/** True for real browser document navigations — never treat as an AI/crawler HTML client. */
export function isNormalBrowser(req) {
  const ua = String(req.headers['user-agent'] || '')
  if (!ua.trim()) return false

  const lower = ua.toLowerCase()
  if (APPROVED_CRAWLER_UA.test(lower)) return false
  if (/\b(bot|crawl|spider|slurp|archiver)\b/.test(lower)) return false

  // Modern browser navigation signals (Chromium, Firefox, Safari, Edge)
  if (req.headers['sec-fetch-mode'] === 'navigate' || req.headers['sec-fetch-dest'] === 'document') {
    return true
  }
  if (req.headers['sec-ch-ua'] || req.headers['sec-ch-ua-mobile'] != null) return true

  // Typical human browser engines (desktop + mobile WebKit/Chromium)
  if (/mozilla\/|applewebkit|chrome|crios|fxios|safari|firefox|edg\/|samsungbrowser|opera/i.test(lower)) {
    return true
  }

  return false
}

/**
 * Prerender semantic HTML for non-browser HTML clients (crawlers, agents, Accept: text/html tools).
 * Normal browsers receive the React SEO shell via createSpaShellHandler.
 */
export function isHtmlAgentClient(req) {
  if (isNormalBrowser(req)) return false
  return prefersHtmlDocument(req)
}

/**
 * Prerender semantic HTML only for approved crawlers/agents — not normal browsers.
 * Browsers must receive the empty React shell via static/SPA fallback.
 */
export function isAgentHtmlRequest(req) {
  if (isNormalBrowser(req)) return false
  if (!prefersHtmlDocument(req)) return false

  if (String(req.headers['x-agent-prerender'] || '').trim() === '1') return true

  const ua = String(req.headers['user-agent'] || '')
  return APPROVED_CRAWLER_UA.test(ua)
}

/** True when the response should include full server-rendered HTML (agents + markdown/HTML tools). */
export function wantsAgenticHtml(req) {
  return isAgentHtmlRequest(req) || isHtmlAgentClient(req)
}
