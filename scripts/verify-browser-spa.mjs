/**
 * Regression: all Accept:text/html clients receive the same styled React shell;
 * Accept:text/markdown receives Markdown only.
 * Usage: node scripts/verify-browser-spa.mjs [baseUrl]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const BASE = (process.env.BASE_URL || process.argv[2] || 'http://127.0.0.1:3040').replace(/\/$/, '')
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST_ASSETS = path.join(__dirname, '..', 'dist', 'assets')

const BROWSER_HEADERS = {
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Site': 'none',
}

const HTML_ACCEPT = { Accept: 'text/html' }

const results = []

function pass(name, detail = '') {
  results.push({ name, ok: true, detail })
  console.log(`✓ ${name}${detail ? ` — ${detail}` : ''}`)
}

function fail(name, detail = '') {
  results.push({ name, ok: false, detail })
  console.error(`✗ ${name}${detail ? ` — ${detail}` : ''}`)
}

async function fetchProbe(url, headers = {}) {
  const res = await fetch(url, { headers, redirect: 'follow' })
  const text = await res.text()
  return { status: res.status, headers: Object.fromEntries(res.headers.entries()), text }
}

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function findAsset(ext) {
  if (!fs.existsSync(DIST_ASSETS)) return null
  return fs.readdirSync(DIST_ASSETS).find((f) => f.endsWith(ext)) || null
}

function styledShellOk(text) {
  return (
    text.includes('<div id="root">') &&
    /<div id="root">\s*<\/div>/i.test(text) &&
    text.includes('data-agentic-semantic="true"') &&
    !text.includes('data-agentic-prerender="true"') &&
    !text.includes('<noscript>') &&
    text.includes('type="module"') &&
    /\/assets\/[^"']+\.(js|css)/.test(text)
  )
}

async function main() {
  console.log(`\n=== Browser SPA / Accept Negotiation Regression ===`)
  console.log(`Base: ${BASE}\n`)

  const browserHome = await fetchProbe(`${BASE}/`, BROWSER_HEADERS)
  if (browserHome.status === 200) pass('Browser GET / HTTP 200')
  else fail('Browser GET / HTTP 200', String(browserHome.status))

  if (styledShellOk(browserHome.text)) pass('Browser homepage is styled React shell with hidden semantic block')
  else fail('Browser homepage is styled React shell with hidden semantic block')

  const browserVisible = visibleText(browserHome.text)
  if (browserHome.text.includes('<title>') && browserHome.text.includes('meta name="description"')) {
    pass('Browser homepage includes title and meta description in head', `${browserVisible.length} visible chars`)
  } else fail('Browser homepage includes title and meta description in head')

  if (browserHome.text.includes('"@type":"Organization"') && browserHome.text.includes('"@type":"SoftwareApplication"')) {
    pass('Browser homepage includes Organization and SoftwareApplication JSON-LD')
  } else fail('Browser homepage includes Organization and SoftwareApplication JSON-LD')

  if (browserVisible.length >= 500) {
    pass('Browser homepage raw semantic text 500+ chars', `${browserVisible.length} chars`)
  } else fail('Browser homepage raw semantic text 500+ chars', `${browserVisible.length} chars`)

  if (browserHome.text.includes('type="module"') && /href="\/assets\/[^"]+\.css"/.test(browserHome.text)) {
    pass('Browser homepage includes Vite CSS and module JS in head')
  } else fail('Browser homepage includes Vite CSS and module JS in head')

  const cssPos = browserHome.text.search(/href="\/assets\/[^"]+\.css"/)
  const jsPos = browserHome.text.search(/src="\/assets\/[^"]+\.js"/)
  if (cssPos >= 0 && jsPos >= 0 && cssPos < jsPos) {
    pass('Browser homepage loads CSS before module JS')
  } else fail('Browser homepage loads CSS before module JS')

  const browserVary = String(browserHome.headers.vary || browserHome.headers.Vary || '').toLowerCase()
  if (browserVary.includes('accept') && browserVary.includes('accept-encoding')) {
    pass('Browser homepage Vary Accept, Accept-Encoding')
  } else fail('Browser homepage Vary header', browserHome.headers.vary || browserHome.headers.Vary || 'missing')

  const htmlAccept = await fetchProbe(`${BASE}/`, HTML_ACCEPT)
  if (htmlAccept.status === 200 && styledShellOk(htmlAccept.text) && visibleText(htmlAccept.text).length >= 500) {
    pass('Accept:text/html returns styled HTML shell with 500+ raw chars')
  } else fail('Accept:text/html returns styled HTML shell', `${visibleText(htmlAccept.text).length} chars`)

  const botHtml = await fetchProbe(`${BASE}/`, {
    ...HTML_ACCEPT,
    'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  })
  if (htmlAccept.text.length === botHtml.text.length) pass('Accept:text/html response is User-Agent invariant')
  else fail('Accept:text/html response is User-Agent invariant', `${htmlAccept.text.length} vs ${botHtml.text.length}`)

  const softwareBrowser = await fetchProbe(`${BASE}/software/crm-software`, BROWSER_HEADERS)
  if (softwareBrowser.status === 200 && styledShellOk(softwareBrowser.text)) {
    pass('Browser /software/crm-software uses styled HTML shell')
  } else fail('Browser /software/crm-software uses styled HTML shell')

  const homeMd = await fetchProbe(`${BASE}/`, { Accept: 'text/markdown' })
  const mdType = homeMd.headers['content-type'] || ''
  if (homeMd.status === 200 && mdType.includes('text/markdown') && !mdType.includes('text/html')) {
    pass('Markdown Accept returns text/markdown; charset=utf-8')
  } else fail('Markdown Accept content-type', mdType)
  const mdVary = String(homeMd.headers.vary || homeMd.headers.Vary || '').toLowerCase()
  if (mdVary.includes('accept') && mdVary.includes('accept-encoding')) {
    pass('Markdown Vary Accept, Accept-Encoding')
  } else fail('Markdown Vary header', homeMd.headers.vary || homeMd.headers.Vary || 'missing')
  if (homeMd.text.startsWith('# ') && !homeMd.text.includes('<html')) pass('Markdown homepage starts with H1 and is not HTML')
  else fail('Markdown homepage starts with H1 and is not HTML')

  const cssFile = findAsset('.css')
  const jsFile = findAsset('.js')
  if (cssFile) {
    const css = await fetchProbe(`${BASE}/assets/${cssFile}`, BROWSER_HEADERS)
    const cssType = css.headers['content-type'] || ''
    if (css.status === 200 && cssType.includes('text/css')) pass('GET /assets/*.css returns text/css', cssFile)
    else fail('GET /assets/*.css returns text/css', `${css.status} ${cssType}`)
  } else fail('dist/assets/*.css exists for asset test')

  if (jsFile) {
    const js = await fetchProbe(`${BASE}/assets/${jsFile}`, BROWSER_HEADERS)
    const jsType = js.headers['content-type'] || ''
    if (js.status === 200 && (jsType.includes('javascript') || jsType.includes('text/javascript'))) {
      pass('GET /assets/*.js returns JavaScript', jsFile)
    } else fail('GET /assets/*.js returns JavaScript', `${js.status} ${jsType}`)
  } else fail('dist/assets/*.js exists for asset test')

  const unknownBrowser = await fetchProbe(`${BASE}/this-route-does-not-exist-spa-xyz`, BROWSER_HEADERS)
  if (unknownBrowser.status === 404) pass('Unknown browser route returns HTTP 404')
  else fail('Unknown browser route returns HTTP 404', String(unknownBrowser.status))

  const unknownHtml = await fetchProbe(`${BASE}/this-route-does-not-exist-spa-xyz`, HTML_ACCEPT)
  if (unknownHtml.status === 404 && unknownHtml.text.includes('not found')) {
    pass('Unknown Accept:text/html route returns HTTP 404 HTML')
  } else fail('Unknown Accept:text/html route returns HTTP 404 HTML', String(unknownHtml.status))

  const failed = results.filter((r) => !r.ok)
  console.log(`\n${results.length - failed.length}/${results.length} passed`)
  if (failed.length) process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
