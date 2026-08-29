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

const AGENT_HTML_HEADERS = { Accept: 'text/html' }

const BROWSER_HTML_HEADERS = {
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Dest': 'document',
}

async function fetchProbe(url, headers = {}) {
  const res = await fetch(url, {
    headers: { 'X-Forwarded-For': '203.0.113.77', ...headers },
    redirect: 'follow',
  })
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

function parseJsonLdBlocks(html) {
  const blocks = []
  for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)) {
    try {
      blocks.push(JSON.parse(match[1]))
    } catch {
      /* ignore */
    }
  }
  return blocks
}

async function main() {
  console.log(`\n=== Agentic Readiness Verification ===`)
  console.log(`Base: ${BASE}\n`)

  const home = await fetchProbe(`${BASE}/`, AGENT_HTML_HEADERS)
  const visible = visibleText(home.text)
  if (home.status === 200) pass('Homepage HTTP 200')
  else fail('Homepage HTTP 200', String(home.status))
  if (visible.length >= 500) pass('Homepage raw visible text 500+ chars', `${visible.length} chars`)
  else fail('Homepage raw visible text 500+ chars', `${visible.length} chars`)
  const efficiency = home.text.length > 0 ? (visible.length / home.text.length) * 100 : 0
  if (efficiency >= 5) pass('Homepage content efficiency 5%+', `${efficiency.toFixed(2)}%`)
  else fail('Homepage content efficiency 5%+', `${efficiency.toFixed(2)}%`)
  if (home.text.includes('/developers') && home.text.includes('/openapi.json')) pass('Homepage links developer resources')
  else fail('Homepage links developer resources')
  if (countTag(home.text, 'h1') === 1) pass('Homepage exactly one H1')
  else fail('Homepage exactly one H1', `${countTag(home.text, 'h1')} found`)
  if (countTag(home.text, 'h2') >= 1) pass('Homepage has H2 hierarchy')
  else fail('Homepage has H2 hierarchy')
  if (/<html[^>]*lang=["']en["']/i.test(home.text)) pass('Homepage html lang=en')
  else fail('Homepage html lang')
  if (
    /rel=["']canonical["'][^>]+https:\/\/(www\.)?digitalmanager\.com\.pk/i.test(home.text) ||
    /href=["']https:\/\/(www\.)?digitalmanager\.com\.pk\/?["']/i.test(home.text)
  ) {
    pass('Homepage canonical uses Pakistan production origin')
  } else fail('Homepage canonical uses Pakistan production origin')
  if (/pk-test\.digitalmanager\.ae/i.test(home.text)) {
    fail('Homepage HTML must not use the temporary Coolify domain')
  } else pass('Homepage HTML avoids temporary Coolify domain')
  if (/property=["']og:type["']/i.test(home.text)) pass('Homepage og:type')
  else fail('Homepage og:type')
  if (/property=["']og:image["']/i.test(home.text)) pass('Homepage og:image')
  else fail('Homepage og:image')
  if (hasJsonLd(home.text)) pass('Homepage JSON-LD present')
  else fail('Homepage JSON-LD present')
  const orgBlock = parseJsonLdBlocks(home.text).find((block) => block['@type'] === 'Organization')
  if (orgBlock?.contactPoint?.email && orgBlock?.address?.addressCountry) {
    pass('Organization JSON-LD includes contactPoint and address')
  } else fail('Organization JSON-LD includes contactPoint and address')
  const jsonLdTypes = parseJsonLdBlocks(home.text).map((b) => b['@type']).filter(Boolean)
  if (jsonLdTypes.includes('Organization') && jsonLdTypes.includes('WebSite') && jsonLdTypes.includes('SoftwareApplication')) {
    pass('Homepage JSON-LD includes Organization, WebSite, SoftwareApplication')
  } else fail('Homepage JSON-LD schema trio', jsonLdTypes.join(', '))
  if (home.text.includes('type="module"') && /\/assets\/[^"']+\.(js|css)/.test(home.text)) {
    pass('Homepage HTML includes production CSS and JS assets')
  } else fail('Homepage HTML includes production CSS and JS assets')
  if (!home.text.includes('data-agentic-prerender="true"') && /<div id="root">\s*<\/div>/i.test(home.text)) {
    pass('Homepage HTML keeps empty #root (no prerender flash)')
  } else fail('Homepage HTML keeps empty #root')
  const vary = String(home.headers.vary || home.headers.Vary || '').toLowerCase()
  if (vary.includes('accept')) pass('Homepage Vary Accept', home.headers.vary || home.headers.Vary)
  else fail('Homepage Vary Accept', vary || 'missing')

  const unknown = await fetchProbe(`${BASE}/this-route-does-not-exist-xyz`, AGENT_HTML_HEADERS)
  if (unknown.status === 404) pass('Unknown route HTTP 404')
  else fail('Unknown route HTTP 404', String(unknown.status))
  if (unknown.text.includes('Page not found') || unknown.text.includes('not found')) pass('404 HTML body useful')
  else fail('404 HTML body useful')

  const unknownMd = await fetchProbe(`${BASE}/this-route-does-not-exist-xyz`, { Accept: 'text/markdown' })
  if (unknownMd.status === 404) pass('Unknown markdown route HTTP 404')
  else fail('Unknown markdown route HTTP 404', String(unknownMd.status))
  if ((unknownMd.headers['content-type'] || '').includes('text/markdown')) pass('404 markdown content-type')
  else fail('404 markdown content-type', unknownMd.headers['content-type'])
  const unknownMdVary = String(unknownMd.headers.vary || unknownMd.headers.Vary || '').toLowerCase()
  if (unknownMdVary.includes('accept')) pass('404 markdown Vary Accept')
  else fail('404 markdown Vary Accept', unknownMdVary || 'missing')
  if (unknownMd.text.includes('/developers') && unknownMd.text.includes('/openapi.json') && unknownMd.text.includes('/sitemap.xml')) {
    pass('404 markdown recovery links')
  } else fail('404 markdown recovery links')

  const homeMd = await fetchProbe(`${BASE}/`, { Accept: 'text/markdown' })
  if (homeMd.status === 200) pass('Homepage markdown negotiation 200')
  else fail('Homepage markdown negotiation 200', String(homeMd.status))
  if ((homeMd.headers['content-type'] || '').includes('text/markdown')) pass('Homepage markdown content-type')
  else fail('Homepage markdown content-type', homeMd.headers['content-type'])
  if (homeMd.text.startsWith('# ')) pass('Homepage markdown H1 heading')
  else fail('Homepage markdown H1 heading')
  const homeMdVary = String(homeMd.headers.vary || homeMd.headers.Vary || '').toLowerCase()
  if (homeMdVary.includes('accept') && homeMdVary.includes('accept-encoding')) {
    pass('Homepage markdown Vary Accept, Accept-Encoding')
  } else fail('Homepage markdown Vary header', homeMd.headers.vary || homeMd.headers.Vary || 'missing')

  const llms = await fetchProbe(`${BASE}/llms.txt`)
  if (llms.status === 200) pass('llms.txt HTTP 200')
  else fail('llms.txt HTTP 200', String(llms.status))
  if (llms.text.includes('DigitalManager') && llms.text.includes('private')) pass('llms.txt identity and privacy note')
  else fail('llms.txt content')
  if (llms.text.includes('DigitalManager Developer Platform')) pass('llms.txt names DigitalManager Developer Platform')
  else fail('llms.txt names DigitalManager Developer Platform')

  const robots = await fetchProbe(`${BASE}/robots.txt`)
  if (robots.status === 200 && robots.text.includes('Sitemap:')) pass('robots.txt valid')
  else fail('robots.txt valid')

  const sitemap = await fetchProbe(`${BASE}/sitemap.xml`)
  if (sitemap.status === 200) pass('sitemap.xml HTTP 200')
  else fail('sitemap.xml HTTP 200', String(sitemap.status))
  if (sitemap.text.includes('<urlset') && sitemap.text.includes('<loc>')) pass('sitemap.xml valid XML')
  else fail('sitemap.xml valid XML')
  if (sitemap.text.includes('/developers')) pass('sitemap.xml includes /developers')
  else fail('sitemap.xml includes /developers')

  const openapi = await fetchProbe(`${BASE}/openapi.json`)
  if (openapi.status === 200) pass('openapi.json HTTP 200')
  else fail('openapi.json HTTP 200', String(openapi.status))
  let spec
  try {
    spec = JSON.parse(openapi.text)
  } catch {
    spec = null
  }
  if (spec?.openapi === '3.1.0') pass('openapi.json is OpenAPI 3.1.0')
  else fail('openapi.json is OpenAPI 3.1.0', spec?.openapi || 'parse failed')
  if (openapi.text.includes('"/api/leads"') && !openapi.text.includes('"/api/admin')) pass('openapi.json public-only surface')
  else fail('openapi.json public-only surface')
  const opIds = new Set()
  let dupId = false
  let missingId = false
  for (const methods of Object.values(spec?.paths || {})) {
    for (const op of Object.values(methods || {})) {
      if (!op?.operationId) missingId = true
      else if (opIds.has(op.operationId)) dupId = true
      else opIds.add(op.operationId)
    }
  }
  if (!missingId && !dupId && opIds.size >= 20) pass('openapi.json unique operationIds', `${opIds.size} ops`)
  else fail('openapi.json unique operationIds', `missing=${missingId} dup=${dupId} count=${opIds.size}`)
  for (const required of ['/api/public/v1/testimonials', '/api/public/v1/locale-content/{slug}', '/api/public/v1/site-settings']) {
    if (spec?.paths?.[required]) pass(`openapi.json documents ${required}`)
    else fail(`openapi.json documents ${required}`)
  }

  const developers = await fetchProbe(`${BASE}/developers`, AGENT_HTML_HEADERS)
  const devChars = visibleText(developers.text).length
  if (developers.status === 200 && devChars >= 500) pass('/developers page 500+ raw chars', `${devChars}`)
  else fail('/developers page 500+ raw chars', `${developers.status}, ${devChars}`)
  if (developers.text.includes('DigitalManager Developers')) pass('/developers title in raw HTML')
  else fail('/developers title in raw HTML')

  const devMd = await fetchProbe(`${BASE}/developers`, { Accept: 'text/markdown' })
  if (devMd.status === 200) pass('/developers markdown negotiation 200')
  else fail('/developers markdown negotiation 200', String(devMd.status))
  const devMdType = devMd.headers['content-type'] || ''
  if (devMdType.includes('text/markdown') && devMdType.includes('charset=utf-8')) pass('/developers markdown content-type')
  else fail('/developers markdown content-type', devMdType)
  const devMdVary = String(devMd.headers.vary || devMd.headers.Vary || '').toLowerCase()
  if (devMdVary.includes('accept')) pass('/developers markdown Vary Accept')
  else fail('/developers markdown Vary Accept', devMdVary || 'missing')

  if ((homeMd.headers['content-type'] || '').includes('charset=utf-8')) pass('Homepage markdown charset=utf-8')
  else fail('Homepage markdown charset=utf-8', homeMd.headers['content-type'])

  const llmsDev = await fetchProbe(`${BASE}/llms.txt`)
  if (llmsDev.text.includes('/developers') && llmsDev.text.includes('/openapi.json')) pass('llms.txt links developers and openapi')
  else fail('llms.txt links developers and openapi')
  if (llmsDev.text.includes('/api/public/v1/') && llmsDev.text.includes('Authentication')) pass('llms.txt documents v1 and auth')
  else fail('llms.txt documents v1 and auth')
  if (llmsDev.text.includes('When agents should call the public API')) pass('llms.txt agent API guidance')
  else fail('llms.txt agent API guidance')

  for (const path of ['/about', '/contact', '/privacy']) {
    const page = await fetchProbe(`${BASE}${path}`, AGENT_HTML_HEADERS)
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

  const invalidSoftware = await fetchProbe(`${BASE}/api/public/locale-content/software/bad-kind/not-a-real-slug`)
  let invalidJson
  try {
    invalidJson = JSON.parse(invalidSoftware.text)
  } catch {
    invalidJson = null
  }
  if (invalidSoftware.status === 400 && invalidJson?.error?.code === 'VALIDATION_ERROR') pass('Invalid API params structured 400')
  else fail('Invalid API params structured 400', `${invalidSoftware.status} ${invalidSoftware.text.slice(0, 80)}`)

  const locale404 = await fetchProbe(`${BASE}/api/public/locale-content/not-a-registry-slug?country=AE&lang=en`)
  let locale404Json
  try {
    locale404Json = JSON.parse(locale404.text)
  } catch {
    locale404Json = null
  }
  if (locale404.status === 404 && locale404Json?.error?.code === 'RESOURCE_NOT_FOUND') pass('Locale content 404 structured JSON')
  else fail('Locale content 404 structured JSON', locale404.text.slice(0, 120))

  function browserShellOk(text) {
    return (
      text.includes('<div id="root">') &&
      !text.includes('data-agentic-prerender="true"') &&
      text.includes('data-agentic-semantic="true"') &&
      text.includes('type="module"') &&
      /\/assets\/[^"']+\.(js|css)/.test(text) &&
      hasJsonLd(text)
    )
  }

  const locale = await fetchProbe(`${BASE}/sa/en`, BROWSER_HTML_HEADERS)
  if (locale.status === 404) pass('Legacy GCC locale /sa/en is a real HTTP 404')
  else fail('Legacy GCC locale /sa/en is a real HTTP 404', String(locale.status))

  const blog = await fetchProbe(`${BASE}/blog`, BROWSER_HTML_HEADERS)
  if (blog.status === 200 && blog.text.includes('type="module"')) pass('Blog listing loads React shell for browser')
  else fail('Blog listing loads React shell for browser', String(blog.status))

  const testimonials = await fetchProbe(`${BASE}/testimonials`, BROWSER_HTML_HEADERS)
  if (testimonials.status === 200 && testimonials.text.includes('type="module"')) {
    pass('Testimonials page loads React shell for browser')
  } else fail('Testimonials page loads React shell for browser', String(testimonials.status))

  const browserHome = await fetchProbe(`${BASE}/`, BROWSER_HTML_HEADERS)
  const browserVisible = visibleText(browserHome.text)
  if (browserHome.status === 200 && browserVisible.length >= 500 && countTag(browserHome.text, 'h1') >= 1) {
    pass('Browser homepage raw text 500+ chars with H1', `${browserVisible.length} chars`)
  } else fail('Browser homepage raw text 500+ chars with H1', `${browserVisible.length} chars`)

  const defaultHtml = await fetchProbe(`${BASE}/`, { Accept: 'text/html' })
  if (
    defaultHtml.status === 200 &&
    defaultHtml.text.includes('type="module"') &&
    !defaultHtml.text.includes('data-agentic-prerender="true"') &&
    visibleText(defaultHtml.text).length >= 500 &&
    countTag(defaultHtml.text, 'h1') >= 1
  ) {
    pass('Accept:text/html returns styled HTML shell with H1 and 500+ raw chars', `${visibleText(defaultHtml.text).length} chars`)
  } else fail('Accept:text/html returns styled HTML shell', `${visibleText(defaultHtml.text).length} chars`)

  const uaHtmlA = await fetchProbe(`${BASE}/`, { Accept: 'text/html', 'User-Agent': 'curl/8.0' })
  const uaHtmlB = await fetchProbe(`${BASE}/`, {
    Accept: 'text/html',
    'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  })
  if (uaHtmlA.text.length === uaHtmlB.text.length && uaHtmlA.text.includes('data-agentic-semantic="true"')) {
    pass('Accept:text/html HTML body is User-Agent invariant')
  } else fail('Accept:text/html HTML body is User-Agent invariant', `${uaHtmlA.text.length} vs ${uaHtmlB.text.length}`)

  const failed = results.filter((r) => !r.ok)
  console.log(`\n${results.length - failed.length}/${results.length} passed`)
  if (failed.length) process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
