/**
 * Agentic readiness routes: prerender HTML, markdown negotiation, llms.txt, openapi, 404.
 */
import fs from 'node:fs/promises'
import {
  resolvePublicPath,
  isMarkdownPreferred,
  prefersHtmlDocument,
} from './agenticPathResolver.mjs'
import { loadAgenticPageContent } from './agenticContentLoader.mjs'
import { injectBrowserSeoShellHtml, render404Html } from './agenticHtml.mjs'
import { renderAgenticMarkdown, render404Markdown } from './agenticMarkdown.mjs'
import { buildLlmsTxt, buildLlmsFullTxt } from './agenticLlms.mjs'
import { buildPublicOpenApiSpec } from './agenticOpenApi.mjs'
import { parseLocalePath } from './seoPaths.mjs'

const AGENTIC_EXCLUDED =
  /^(?:\/api(?:\/|$)|\/uploads(?:\/|$)|\/admin(?:\/|$)|\/assets(?:\/|$)|\/favicon\.|\/digitalmanager-|.*\.(?:js|css|png|jpg|jpeg|gif|svg|webp|ico|woff2?|map|txt|xml|json)$)/i

const NEGOTIABLE_PAGE_KINDS = new Set([
  'home',
  'about',
  'contact',
  'privacy',
  'developers',
  'blog-list',
  'blog-post',
  'registry',
  'software',
  'testimonials',
  'industries',
  'erp',
  'solutions',
  'business-models',
  'faqs',
  'cms-page',
  'locale-industry',
  'city-home',
  'city-software',
  'city-page',
  'cities',
])

let templateCache = { html: '', mtimeMs: 0 }

async function readTemplate(distIndex) {
  const stat = await fs.stat(distIndex)
  if (templateCache.html && templateCache.mtimeMs === stat.mtimeMs) return templateCache.html
  templateCache = { html: await fs.readFile(distIndex, 'utf8'), mtimeMs: stat.mtimeMs }
  return templateCache.html
}

/** Negotiable representations — Accept must vary so CDNs do not mix HTML/Markdown caches. */
function varyHeader(res) {
  res.set('Vary', 'Accept, Accept-Encoding, Origin')
}

function negotiableCacheHeaders(res) {
  res.set({
    'Cache-Control': 'private, no-store, max-age=0',
    Pragma: 'no-cache',
  })
}

export function registerAgenticRoutes(app, deps) {
  app.get('/llms.txt', (_req, res) => {
    res.set({
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
      Vary: 'Accept-Encoding',
    })
    res.send(buildLlmsTxt({ compact: true }))
  })

  app.get('/llms-full.txt', (_req, res) => {
    res.set({
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
      Vary: 'Accept-Encoding',
    })
    res.send(buildLlmsFullTxt())
  })

  app.get('/openapi.json', (_req, res) => {
    res.set({
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
      Vary: 'Accept-Encoding',
    })
    res.json(buildPublicOpenApiSpec())
  })

  app.get(/^(?!\/api|\/uploads).*/, async (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next()
    const pathname = req.path || '/'
    if (pathname === '/robots.txt' || pathname === '/sitemap.xml') return next()
    if (AGENTIC_EXCLUDED.test(pathname)) return next()

    if (!isMarkdownPreferred(req)) return next()

    try {
      const routeInfo = await resolvePublicPath(deps, pathname)
      const parsed = parseLocalePath(pathname)
      const lang = parsed.lang || 'en'

      if (!routeInfo.known) {
        varyHeader(res)
        negotiableCacheHeaders(res)
        res.status(404).type('text/markdown; charset=utf-8').send(render404Markdown(pathname, lang))
        return
      }

      if (routeInfo.kind === 'admin' || routeInfo.kind === 'redirect') {
        if (routeInfo.redirectTo) {
          res.redirect(302, routeInfo.redirectTo)
          return
        }
        return next()
      }

      if (!NEGOTIABLE_PAGE_KINDS.has(routeInfo.kind)) return next()

      const content = await loadAgenticPageContent(deps, pathname, routeInfo)
      varyHeader(res)
      negotiableCacheHeaders(res)
      res.status(200).type('text/markdown; charset=utf-8').send(renderAgenticMarkdown(content))
    } catch (err) {
      console.error('[agentic]', err)
      next(err)
    }
  })
}

/**
 * Serve styled React HTML for all Accept:text/html clients (browsers and agents).
 * Representation is chosen only via Accept — never User-Agent.
 */
export function createSpaShellHandler(deps) {
  return async (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next()
    const pathname = req.path || '/'
    if (AGENTIC_EXCLUDED.test(pathname)) {
      if (pathname.startsWith('/admin') && prefersHtmlDocument(req)) {
        res.sendFile(deps.distIndex)
        return
      }
      return next()
    }
    if (pathname === '/robots.txt' || pathname === '/sitemap.xml') return next()
    if (isMarkdownPreferred(req)) return next()
    if (!prefersHtmlDocument(req)) return next()

    try {
      const routeInfo = await resolvePublicPath(deps, pathname)
      const parsed = parseLocalePath(pathname)
      const lang = parsed.lang || 'en'

      if (routeInfo.kind === 'redirect' && routeInfo.redirectTo) {
        res.redirect(302, routeInfo.redirectTo)
        return
      }
      if (!routeInfo.known) {
        const template = await readTemplate(deps.distIndex)
        varyHeader(res)
        negotiableCacheHeaders(res)
        res.status(404).type('text/html; charset=utf-8').send(render404Html(template, pathname, lang))
        return
      }

      varyHeader(res)
      negotiableCacheHeaders(res)

      if (NEGOTIABLE_PAGE_KINDS.has(routeInfo.kind)) {
        const content = await loadAgenticPageContent(deps, pathname, routeInfo)
        const template = await readTemplate(deps.distIndex)
        const html = injectBrowserSeoShellHtml(template, content)
        res.status(200).type('text/html; charset=utf-8').send(html)
        return
      }

      res.sendFile(deps.distIndex)
    } catch (err) {
      console.error('[spa-shell]', err)
      next(err)
    }
  }
}
