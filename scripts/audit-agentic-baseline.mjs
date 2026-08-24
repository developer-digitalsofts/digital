/**
 * Phase 1 baseline audit — records raw HTML, headers, and route behavior.
 * Usage: node scripts/audit-agentic-baseline.mjs [baseUrl]
 */
const BASE = (process.argv[2] || process.env.BASE_URL || 'https://digitalmanager.ae').replace(/\/$/, '')

const paths = [
  '/',
  '/this-route-does-not-exist-xyz',
  '/robots.txt',
  '/sitemap.xml',
  '/llms.txt',
  '/openapi.json',
  '/about',
  '/contact',
  '/privacy',
  '/api/public/this-endpoint-does-not-exist',
]

async function fetchProbe(url, headers = {}) {
  const res = await fetch(url, { headers, redirect: 'follow' })
  const text = await res.text()
  return { status: res.status, headers: Object.fromEntries(res.headers.entries()), text }
}

function stripScripts(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
}

function visibleText(html) {
  return stripScripts(html)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function countHeadings(html) {
  const tags = ['h1', 'h2', 'h3']
  const out = {}
  for (const tag of tags) {
    const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi')
    out[tag] = [...html.matchAll(re)].map((m) => m[1].replace(/<[^>]+>/g, '').trim()).filter(Boolean)
  }
  return out
}

function extractMeta(html, name, attr = 'name') {
  const re = new RegExp(`<meta[^>]+${attr}=["']${name}["'][^>]*content=["']([^"']*)["']`, 'i')
  const alt = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+${attr}=["']${name}["']`, 'i')
  return html.match(re)?.[1] || html.match(alt)?.[1] || null
}

function extractLink(html, rel) {
  const re = new RegExp(`<link[^>]+rel=["']${rel}["'][^>]*href=["']([^"']*)["']`, 'i')
  return html.match(re)?.[1] || null
}

function extractJsonLd(html) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)]
  return blocks.map((m) => {
    try {
      return JSON.parse(m[1])
    } catch {
      return { parseError: true, raw: m[1].slice(0, 200) }
    }
  })
}

async function main() {
  console.log(`\n=== Agentic Readiness Baseline Audit ===`)
  console.log(`Base URL: ${BASE}\n`)

  const homeHtml = await fetchProbe(`${BASE}/`, { Accept: 'text/html' })
  const visible = visibleText(homeHtml.text)
  const headings = countHeadings(homeHtml.text)

  console.log('--- Homepage (Accept: text/html, no JS execution) ---')
  console.log(`HTTP status: ${homeHtml.status}`)
  console.log(`Visible raw text character count: ${visible.length}`)
  console.log(`H1 count: ${headings.h1.length}`, headings.h1.slice(0, 3))
  console.log(`H2 count: ${headings.h2.length}`, headings.h2.slice(0, 5))
  console.log(`H3 count: ${headings.h3.length}`)
  console.log(`html lang: ${homeHtml.text.match(/<html[^>]*lang=["']([^"']*)["']/i)?.[1] || '(missing)'}`)
  console.log(`canonical: ${extractLink(homeHtml.text, 'canonical') || '(missing)'}`)
  console.log(`og:type: ${extractMeta(homeHtml.text, 'og:type', 'property') || '(missing)'}`)
  console.log(`og:image: ${extractMeta(homeHtml.text, 'og:image', 'property') || '(missing)'}`)
  console.log(`JSON-LD blocks: ${extractJsonLd(homeHtml.text).length}`)
  console.log(`Vary: ${homeHtml.headers.vary || '(missing)'}`)

  const homeMd = await fetchProbe(`${BASE}/`, { Accept: 'text/markdown' })
  console.log('\n--- Homepage (Accept: text/markdown) ---')
  console.log(`HTTP status: ${homeMd.status}`)
  console.log(`Content-Type: ${homeMd.headers['content-type'] || '(missing)'}`)
  console.log(`Vary: ${homeMd.headers.vary || '(missing)'}`)
  console.log(`Body preview: ${homeMd.text.slice(0, 120).replace(/\n/g, ' ')}`)

  for (const path of paths.slice(1)) {
    const probe = await fetchProbe(`${BASE}${path}`, { Accept: 'text/html' })
    const preview = probe.text.slice(0, 80).replace(/\s+/g, ' ')
    console.log(`\n--- ${path} ---`)
    console.log(`HTTP status: ${probe.status}`)
    console.log(`Content-Type: ${probe.headers['content-type'] || '(missing)'}`)
    if (path.startsWith('/api/')) {
      try {
        const json = JSON.parse(probe.text)
        console.log(`JSON error shape: ${JSON.stringify(json).slice(0, 200)}`)
      } catch {
        console.log(`Body preview: ${preview}`)
      }
    } else if (path.endsWith('.xml')) {
      console.log(`Valid XML start: ${probe.text.trimStart().startsWith('<?xml') || probe.text.trimStart().startsWith('<urlset')}`)
      console.log(`Body preview: ${preview}`)
    } else {
      console.log(`Body preview: ${preview}`)
    }
  }

  for (const ua of ['ChatGPT-User', 'ClaudeBot', 'Google-Extended']) {
    const probe = await fetchProbe(`${BASE}/`, { Accept: 'text/html', 'User-Agent': ua })
    console.log(`\n--- / (User-Agent: ${ua}) ---`)
    console.log(`HTTP status: ${probe.status}, visible chars: ${visibleText(probe.text).length}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
