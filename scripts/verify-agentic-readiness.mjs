/**
 * Agentic readiness verification suite.
 * Usage: node scripts/verify-agentic-readiness.mjs [baseUrl]
 *
 * Requires production server with SERVE_STATIC=true (npm run build && SERVE_STATIC=true node server/index.mjs)
 */
const BASE = (process.env.BASE_URL || process.argv[2] || 'http://127.0.0.1:3040').replace(/\/$/, '')

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

function stripScripts(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '')
}

function visibleText(html) {
  return stripScripts(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
}

function countTag(html, tag) {
  const re = new RegExp(`<${tag}[^>]*>`, 'gi')
  return (html.match(re) || []).length
}

function hasJsonLd(html) {
  return /<script type="application\/ld\+json">/i.test(html)
}

async function main() {
  console.log(`\n=== Agentic Readiness Verification ===`)
  console.log(`Base: ${BASE}\n`)

  const home = await fetchProbe(`${BASE}/`, { Accept: 'text/html' })
  const visible = visibleText(home.text)
  if (home.status === 200) pass('Homepage HTTP 200')
  else fail('Homepage HTTP 200', String(home.status))
  if (visible.length >= 500) pass('Homepage raw visible text 500+ chars', `${visible.length} chars`)
  else fail('Homepage raw visible text 500+ chars', `${visible.length} chars`)
  if (countTag(home.text, 'h1') >= 1) pass('Homepage has H1')
  else fail('Homepage has H1')
  if (countTag(home.text, 'h2') >= 1) pass('Homepage has H2 hierarchy')
  else fail('Homepage has H2 hierarchy')
  if (/<html[^>]*lang=["']en["']/i.test(home.text)) pass('Homepage html lang=en')
  else fail('Homepage html lang')
  if (/rel=["']canonical["']/i.test(home.text)) pass('Homepage canonical link')
  else fail('Homepage canonical link')
  if (/property=["']og:type["']/i.test(home.text)) pass('Homepage og:type')
  else fail('Homepage og:type')
  if (/property=["']og:image["']/i.test(home.text)) pass('Homepage og:image')
  else fail('Homepage og:image')
  if (hasJsonLd(home.text)) pass('Homepage JSON-LD present')
  else fail('Homepage JSON-LD present')
  const vary = String(home.headers.vary || home.headers.Vary || '').toLowerCase()
  if (vary.includes('accept')) pass('Homepage Vary Accept', home.headers.vary || home.headers.Vary)
  else fail('Homepage Vary Accept', vary || 'missing')

  const unknown = await fetchProbe(`${BASE}/this-route-does-not-exist-xyz`, { Accept: 'text/html' })
  if (unknown.status === 404) pass('Unknown route HTTP 404')
  else fail('Unknown route HTTP 404', String(unknown.status))
  if (unknown.text.includes('Page not found') || unknown.text.includes('not found')) pass('404 HTML body useful')
  else fail('404 HTML body useful')

  const unknownMd = await fetchProbe(`${BASE}/this-route-does-not-exist-xyz`, { Accept: 'text/markdown' })
  if (unknownMd.status === 404) pass('Unknown markdown route HTTP 404')
  else fail('Unknown markdown route HTTP 404', String(unknownMd.status))
  if ((unknownMd.headers['content-type'] || '').includes('text/markdown')) pass('404 markdown content-type')
  else fail('404 markdown content-type', unknownMd.headers['content-type'])

  const homeMd = await fetchProbe(`${BASE}/`, { Accept: 'text/markdown' })
  if (homeMd.status === 200) pass('Homepage markdown negotiation 200')
  else fail('Homepage markdown negotiation 200', String(homeMd.status))
  if ((homeMd.headers['content-type'] || '').includes('text/markdown')) pass('Homepage markdown content-type')
  else fail('Homepage markdown content-type', homeMd.headers['content-type'])
  if (homeMd.text.startsWith('# ')) pass('Homepage markdown H1 heading')
  else fail('Homepage markdown H1 heading')

  const llms = await fetchProbe(`${BASE}/llms.txt`)
  if (llms.status === 200) pass('llms.txt HTTP 200')
  else fail('llms.txt HTTP 200', String(llms.status))
  if (llms.text.includes('DigitalManager') && llms.text.includes('private')) pass('llms.txt identity and privacy note')
  else fail('llms.txt content')

  const robots = await fetchProbe(`${BASE}/robots.txt`)
  if (robots.status === 200 && robots.text.includes('Sitemap:')) pass('robots.txt valid')
  else fail('robots.txt valid')

  const sitemap = await fetchProbe(`${BASE}/sitemap.xml`)
  if (sitemap.status === 200) pass('sitemap.xml HTTP 200')
  else fail('sitemap.xml HTTP 200', String(sitemap.status))
  if (sitemap.text.includes('<urlset') && sitemap.text.includes('<loc>')) pass('sitemap.xml valid XML')
  else fail('sitemap.xml valid XML')

  const openapi = await fetchProbe(`${BASE}/openapi.json`)
  if (openapi.status === 200) pass('openapi.json HTTP 200')
  else fail('openapi.json HTTP 200', String(openapi.status))
  if (openapi.text.includes('"/api/leads"') && !openapi.text.includes('/api/admin')) pass('openapi.json public-only surface')
  else fail('openapi.json public-only surface')

  for (const path of ['/about', '/contact', '/privacy']) {
    const page = await fetchProbe(`${BASE}${path}`, { Accept: 'text/html' })
    const chars = visibleText(page.text).length
    if (page.status === 200 && chars >= 500) pass(`${path} trust page 500+ raw chars`, `${chars}`)
    else fail(`${path} trust page 500+ raw chars`, `${page.status}, ${chars}`)
  }

  const api404 = await fetchProbe(`${BASE}/api/public/this-endpoint-does-not-exist`)
  let apiJson
  try {
    apiJson = JSON.parse(api404.text)
  } catch {
    apiJson = null
  }
  if (api404.status === 404) pass('Unknown API HTTP 404')
  else fail('Unknown API HTTP 404', String(api404.status))
  if (apiJson?.error?.code && apiJson?.error?.message && apiJson?.error?.resolution) pass('API structured error JSON')
  else fail('API structured error JSON', api404.text.slice(0, 120))

  const locale = await fetchProbe(`${BASE}/sa/en`, { Accept: 'text/html' })
  if (locale.status === 200) pass('Locale route /sa/en loads')
  else fail('Locale route /sa/en loads', String(locale.status))

  const blog = await fetchProbe(`${BASE}/blog`, { Accept: 'text/html' })
  if (blog.status === 200) pass('Blog listing loads')
  else fail('Blog listing loads', String(blog.status))

  const testimonials = await fetchProbe(`${BASE}/testimonials`, { Accept: 'text/html' })
  if (testimonials.status === 200) pass('Testimonials page loads')
  else fail('Testimonials page loads', String(testimonials.status))

  const failed = results.filter((r) => !r.ok)
  console.log(`\n${results.length - failed.length}/${results.length} passed`)
  if (failed.length) process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
