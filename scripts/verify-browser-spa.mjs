/**
 * Regression: browsers receive React SPA; agents/crawlers receive prerender HTML.
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

const AGENT_HEADERS = {
  Accept: 'text/html',
  'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
}

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

function findAsset(ext) {
  if (!fs.existsSync(DIST_ASSETS)) return null
  return fs.readdirSync(DIST_ASSETS).find((f) => f.endsWith(ext)) || null
}

async function main() {
  console.log(`\n=== Browser SPA / Agent Prerender Regression ===`)
  console.log(`Base: ${BASE}\n`)

  const browserHome = await fetchProbe(`${BASE}/`, BROWSER_HEADERS)
  if (browserHome.status === 200) pass('Browser GET / HTTP 200')
  else fail('Browser GET / HTTP 200', String(browserHome.status))

  if (browserHome.text.includes('<div id="root">') && browserHome.text.includes('type="module"')) {
    pass('Browser homepage is React shell (root + module script)')
  } else fail('Browser homepage is React shell (root + module script)')

  if (/\/assets\/[^"']+\.(js|css)/.test(browserHome.text)) {
    pass('Browser homepage references /assets JS or CSS')
  } else fail('Browser homepage references /assets JS or CSS')

  if (!browserHome.text.includes('data-agentic-prerender="true"')) {
    pass('Browser homepage does not include agent prerender markup')
  } else fail('Browser homepage does not include agent prerender markup')

  const agentHome = await fetchProbe(`${BASE}/`, AGENT_HEADERS)
  if (agentHome.status === 200) pass('Agent GET / HTTP 200')
  else fail('Agent GET / HTTP 200', String(agentHome.status))

  if (agentHome.text.includes('data-agentic-prerender="true"') && /<h1[^>]*>/i.test(agentHome.text)) {
    pass('Agent homepage includes semantic prerender H1')
  } else fail('Agent homepage includes semantic prerender H1')

  const homeMd = await fetchProbe(`${BASE}/`, { Accept: 'text/markdown' })
  const mdType = homeMd.headers['content-type'] || ''
  if (homeMd.status === 200 && mdType.includes('text/markdown') && mdType.includes('charset=utf-8')) {
    pass('Markdown Accept returns text/markdown; charset=utf-8')
  } else fail('Markdown Accept content-type', mdType)
  const mdVary = String(homeMd.headers.vary || homeMd.headers.Vary || '').toLowerCase()
  if (mdVary.includes('accept') && mdVary.includes('accept-encoding')) {
    pass('Markdown Vary Accept, Accept-Encoding')
  } else fail('Markdown Vary header', homeMd.headers.vary || homeMd.headers.Vary || 'missing')
  if (homeMd.text.startsWith('# ')) pass('Markdown homepage starts with H1')
  else fail('Markdown homepage starts with H1')

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

  const unknownAgent = await fetchProbe(`${BASE}/this-route-does-not-exist-spa-xyz`, AGENT_HEADERS)
  if (unknownAgent.status === 404 && unknownAgent.text.includes('not found')) {
    pass('Unknown agent route returns HTTP 404 prerender')
  } else fail('Unknown agent route returns HTTP 404 prerender', String(unknownAgent.status))

  const failed = results.filter((r) => !r.ok)
  console.log(`\n${results.length - failed.length}/${results.length} passed`)
  if (failed.length) process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
