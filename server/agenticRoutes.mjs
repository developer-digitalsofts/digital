/**
 * Agentic readiness routes: prerender HTML, markdown negotiation, llms.txt, openapi, 404.
 */
import fs from 'node:fs/promises'
import {
  resolvePublicPath,
  isMarkdownPreferred,
  isAgentHtmlRequest,
  prefersHtmlDocument,
  isNormalBrowser,
} from './agenticPathResolver.mjs'
import { loadAgenticPageContent } from './agenticContentLoader.mjs'
import { injectAgenticHtml, injectBrowserShellHtml, render404Html } from './agenticHtml.mjs'
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
])

let templateCache = { html: '', mtimeMs: 0 }

async function readTemplate(distIndex) {
  const stat = await fs.stat(distIndex)
  if (templateCache.html && templateCache.mtimeMs === stat.mtimeMs) return templateCache.html
  templateCache = { html: await fs.readFile(distIndex, 'utf8'), mtimeMs: stat.mtimeMs }
  return templateCache.html
}

function varyHeader(res) {
  res.set('Vary', 'Accept, Accept-Encoding')
}

async function sendAgent404(req, res, deps, pathname, lang) {
  const template = await readTemplate(deps.distIndex)
  varyHeader(res)
  res.status(404).type('text/html; charset=utf-8').send(render404Html(template, pathname, lang))
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

    const wantsMarkdown = isMarkdownPreferred(req)
    const wantsAgentHtml = isAgentHtmlRequest(req)
    if (!wantsMarkdown && !wantsAgentHtml) return next()

    try {
      const routeInfo = await resolvePublicPath(deps, pathname)
      const parsed = parseLocalePath(pathname)
      const lang = parsed.lang || 'en'

      if (!routeInfo.known) {
        if (wantsMarkdown) {
          varyHeader(res)
          res.status(404).type('text/markdown; charset=utf-8').send(render404Markdown(pathname, lang))
          return
        }
        await sendAgent404(req, res, deps, pathname, lang)
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

      if (wantsMarkdown) {
        varyHeader(res)
        res.status(200).type('text/markdown; charset=utf-8').send(renderAgenticMarkdown(content))
        return
      }

      const template = await readTemplate(deps.distIndex)
      const html = injectAgenticHtml(template, content)
      varyHeader(res)
      res.status(200).type('text/html; charset=utf-8').send(html)
    } catch (err) {
      console.error('[agentic]', err)
      next(err)
    }
  })
}

export function createAgenticSpaFallback(deps) {
  return async (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next()
    const pathname = req.path || '/'
    if (AGENTIC_EXCLUDED.test(pathname)) return next()

    const wantsMarkdown = isMarkdownPreferred(req)
    const wantsAgentHtml = isAgentHtmlRequest(req)
    if (!wantsMarkdown && !wantsAgentHtml) return next()

    try {
      const routeInfo = await resolvePublicPath(deps, pathname)
      if (!routeInfo.known) {
        const parsed = parseLocalePath(pathname)
        const lang = parsed.lang || 'en'
        if (wantsMarkdown) {
          varyHeader(res)
          res.status(404).type('text/markdown; charset=utf-8').send(render404Markdown(pathname, lang))
          return
        }
        await sendAgent404(req, res, deps, pathname, lang)
        return
      }
    } catch (err) {
      console.error('[agentic-fallback]', err)
    }
    next()
  }
}

/**
 * Serve the React shell with server-injected SEO (H1, body copy, JSON-LD) for HTML clients.
 * Crawlers are handled upstream; browsers and generic Accept:text/html fetchers get the same
 * published CMS semantics inside #root while CSS/JS assets load the styled SPA.
 */
export function createSpaShellHandler(deps) {
  return async (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next()
    const pathname = req.path || '/'
    if (AGENTIC_EXCLUDED.test(pathname)) return next()
    if (pathname === '/robots.txt' || pathname === '/sitemap.xml') return next()
    if (isMarkdownPreferred(req) || isAgentHtmlRequest(req)) return next()
    if (!prefersHtmlDocument(req)) return next()

    try {
      const routeInfo = await resolvePublicPath(deps, pathname)
      if (routeInfo.kind === 'redirect' && routeInfo.redirectTo) {
        res.redirect(302, routeInfo.redirectTo)
        return
      }
      if (!routeInfo.known) {
        res.status(404).type('text/html; charset=utf-8').send('<!doctype html><title>Not found</title><h1>Page not found</h1>')
        return
      }

      varyHeader(res)

      if (NEGOTIABLE_PAGE_KINDS.has(routeInfo.kind)) {
        const content = await loadAgenticPageContent(deps, pathname, routeInfo)
        const template = await readTemplate(deps.distIndex)
        const html = isNormalBrowser(req)
          ? injectBrowserShellHtml(template, content)
          : injectAgenticHtml(template, content)
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
