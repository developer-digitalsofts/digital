/**
 * Verify GCC locale routes show correct currency/cities and no UAE demo leakage.
 * Usage: node scripts/verify-gcc-locale-content.mjs [baseUrl]
 */
const BASE = (process.env.BASE_URL || process.argv[2] || 'http://127.0.0.1:3040').replace(/\/$/, '')

const ROUTES = [
  { path: '/', country: 'AE', lang: 'en', currency: 'AED', cities: ['Dubai', 'Abu Dhabi'], forbidden: [] },
  { path: '/sa/en', country: 'SA', lang: 'en', currency: 'SAR', cities: ['Riyadh', 'Jeddah'], forbidden: ['AED', 'Dubai Holdings', 'Emirates Supplies'] },
  { path: '/qa/en', country: 'QA', lang: 'en', currency: 'QAR', cities: ['Doha'], forbidden: ['AED', 'Dubai', 'Dubai Holdings'] },
  { path: '/om/en', country: 'OM', lang: 'en', currency: 'OMR', cities: ['Muscat'], forbidden: ['AED', 'Dubai', 'Dubai Holdings'] },
  { path: '/kw/en', country: 'KW', lang: 'en', currency: 'KWD', cities: ['Kuwait City', 'Hawalli'], forbidden: ['AED', 'Dubai', 'Dubai Holdings'] },
  { path: '/bh/en', country: 'BH', lang: 'en', currency: 'BHD', cities: ['Manama', 'Riffa', 'Muharraq'], forbidden: ['AED', 'Dubai', 'Dubai Holdings', 'Emirates Supplies'] },
  { path: '/sa/ar', country: 'SA', lang: 'ar', currency: 'SAR', cities: ['الرياض'], forbidden: ['AED', 'Dubai Holdings'], noindex: true },
  { path: '/bh/ar', country: 'BH', lang: 'ar', currency: 'BHD', cities: ['المنامة'], forbidden: ['AED', 'Dubai Holdings'], noindex: true },
]

const results = []

function pass(name, detail = '') {
  results.push({ name, ok: true, detail })
  console.log(`✓ ${name}${detail ? ` — ${detail}` : ''}`)
}

function fail(name, detail = '') {
  results.push({ name, ok: false, detail })
  console.error(`✗ ${name}${detail ? ` — ${detail}` : ''}`)
}

function stripScripts(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '')
}

async function fetchHomeApi(country, lang) {
  const res = await fetch(`${BASE}/api/homepage?country=${country}&lang=${lang}`)
  return res.ok ? res.json() : null
}

async function main() {
  console.log(`\n=== GCC Locale Content Verification ===`)
  console.log(`Base: ${BASE}\n`)

  for (const route of ROUTES) {
    const label = `${route.path} (${route.country}/${route.lang})`

    const api = await fetchHomeApi(route.country, route.lang)
    if (!api) {
      fail(`${label} homepage API`, 'failed to load')
      continue
    }
    pass(`${label} homepage API`)

    const apiText = JSON.stringify(api)
    if (apiText.includes(route.currency)) pass(`${label} CMS currency ${route.currency}`)
    else fail(`${label} CMS currency ${route.currency}`)

    const cityHit = route.cities.some((c) => apiText.includes(c))
    if (cityHit) pass(`${label} CMS local city reference`)
    else fail(`${label} CMS local city reference`, route.cities.join(', '))

    for (const bad of route.forbidden) {
      if (!apiText.includes(bad)) pass(`${label} CMS free of ${bad}`)
      else fail(`${label} CMS free of ${bad}`)
    }

    const htmlRes = await fetch(`${BASE}${route.path}`, {
      headers: {
        Accept: 'text/html',
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)',
      },
    })
    const html = await htmlRes.text()
    const visible = stripScripts(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

    if (htmlRes.status === 200) pass(`${label} HTML 200`)
    else fail(`${label} HTML 200`, String(htmlRes.status))

    if (html.includes(route.currency)) pass(`${label} raw HTML currency ${route.currency}`)
    else fail(`${label} raw HTML currency ${route.currency}`)

    for (const bad of route.forbidden) {
      if (!visible.includes(bad)) pass(`${label} HTML free of ${bad}`)
      else fail(`${label} HTML free of ${bad}`, 'found in visible text')
    }

    const cityInHtml = route.cities.some((c) => visible.includes(c))
    if (cityInHtml) pass(`${label} HTML local city in visible text`)
    else fail(`${label} HTML local city`, route.cities.join(', '))

    if (route.lang === 'ar') {
      if (/lang=["']ar["']/i.test(html) || html.includes('dir="rtl"')) pass(`${label} Arabic RTL/html lang`)
      else fail(`${label} Arabic RTL/html lang`)
    }

    const seo = await fetch(`${BASE}/api/public/seo-page?path=${encodeURIComponent(route.path)}`)
    if (seo.ok) {
      const meta = await seo.json()
      if (route.noindex) {
        if (meta.noIndex || String(meta.robots || '').includes('noindex')) pass(`${label} draft/noindex SEO`)
        else fail(`${label} draft/noindex SEO`, meta.robots || 'index')
      } else if (!meta.noIndex) pass(`${label} indexable SEO`)
      else fail(`${label} indexable SEO`, 'unexpected noindex')
    }
  }

  const failed = results.filter((r) => !r.ok)
  console.log(`\n${results.length - failed.length}/${results.length} passed`)
  if (failed.length) process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
