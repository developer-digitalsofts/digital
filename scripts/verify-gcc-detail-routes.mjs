/**
 * Verify GCC software/industry detail routes show correct regional content.
 * Usage: node scripts/verify-gcc-detail-routes.mjs [baseUrl]
 */
const BASE = (process.env.BASE_URL || process.argv[2] || 'http://127.0.0.1:3040').replace(/\/$/, '')

const SAMPLE_ROUTES = [
  { path: '/software/inventory-management-software', country: 'AE', currency: 'AED', cities: ['Dubai'], countryName: 'United Arab Emirates', forbidden: [] },
  { path: '/bh/en/software/inventory-management-software', country: 'BH', currency: 'BHD', cities: ['Manama'], countryName: 'Bahrain', forbidden: ['AED', 'Dubai', 'Dubai Holdings'] },
  { path: '/bh/en/software/industry/petrol-pump-software', country: 'BH', currency: 'BHD', cities: ['Manama', 'Muharraq'], countryName: 'Bahrain', forbidden: ['AED', 'Dubai', 'Emirates Supplies'] },
  { path: '/sa/en/software/accounts-management-software', country: 'SA', currency: 'SAR', cities: ['Riyadh'], countryName: 'Saudi Arabia', forbidden: ['AED', 'Dubai Holdings'] },
  { path: '/qa/en/software/industry/pharmacy-business-management-software', country: 'QA', currency: 'QAR', cities: ['Doha'], countryName: 'Qatar', forbidden: ['AED', 'Dubai'] },
  { path: '/om/en/software/point-of-sale-software', country: 'OM', currency: 'OMR', cities: ['Muscat'], countryName: 'Oman', forbidden: ['AED', 'Dubai'] },
  { path: '/kw/en/software/industry/dairy-farm-management-software', country: 'KW', currency: 'KWD', cities: ['Kuwait City'], countryName: 'Kuwait', forbidden: ['AED', 'Dubai'] },
  { path: '/bh/en/industries/petrol-pump-software', country: 'BH', currency: 'BHD', cities: ['Manama'], countryName: 'Bahrain', forbidden: ['AED', 'Dubai Holdings'] },
]

const results = []

function pass(name, detail = '') {
  results.push({ ok: true, name, detail })
  console.log(`✓ ${name}${detail ? ` — ${detail}` : ''}`)
}

function fail(name, detail = '') {
  results.push({ ok: false, name, detail })
  console.error(`✗ ${name}${detail ? ` — ${detail}` : ''}`)
}

function stripScripts(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '')
}

async function main() {
  console.log(`\n=== GCC Detail Route Verification ===\nBase: ${BASE}\n`)

  for (const route of SAMPLE_ROUTES) {
    const label = route.path
    const res = await fetch(`${BASE}${route.path}`, {
      headers: { Accept: 'text/html', 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' },
    })
    const html = await res.text()
    const visible = stripScripts(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

    if (res.status === 200) pass(`${label} HTML 200`)
    else fail(`${label} HTML 200`, String(res.status))

    if (html.includes(route.currency)) pass(`${label} currency ${route.currency}`)
    else fail(`${label} currency ${route.currency}`)

    const cityHit =
      route.cities.some((c) => visible.includes(c)) ||
      (route.countryName && visible.includes(route.countryName))
    if (cityHit) pass(`${label} local city/country reference`)
    else fail(`${label} local city/country reference`, [...route.cities, route.countryName].filter(Boolean).join(', '))

    for (const bad of route.forbidden) {
      if (!visible.includes(bad)) pass(`${label} free of ${bad}`)
      else fail(`${label} free of ${bad}`, 'found in visible text')
    }

    if (route.country !== 'AE') {
      const localeApi = route.path.match(/^\/([a-z]{2})\/(en|ar)\//)
      if (localeApi) {
        const [, slug, lang] = localeApi
        const country = { sa: 'SA', qa: 'QA', om: 'OM', kw: 'KW', bh: 'BH' }[slug]
        const kindSlug = route.path.replace(`/${slug}/${lang}/`, '')
        const m = kindSlug.match(/^software\/(?:industry\/)?([^/?#]+)/)
        if (m && country) {
          const detailSlug = m[1]
          const isIndustry = kindSlug.includes('/industry/')
          const seo = await fetch(
            `${BASE}/api/public/seo-page?path=${encodeURIComponent(route.path)}`,
          )
          if (seo.ok) pass(`${label} SEO API`)
          else fail(`${label} SEO API`)
        }
      }
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
