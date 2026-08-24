/**
 * City locale routing and SEO verification.
 * Usage: node scripts/verify-city-locale.mjs [baseUrl]
 */
import { ALL_CITY_SLUGS, CITY_PAGE_SLUG, CITY_REGISTRY } from '../server/cityRegistry.mjs'
import { buildCityPagePath } from '../server/cityPaths.mjs'

const BASE = (process.argv[2] || process.env.BASE_URL || 'http://127.0.0.1:3040').replace(/\/$/, '')
const failures = []

function fail(label, detail) {
  failures.push(`${label}: ${detail}`)
}

async function get(path, headers = {}) {
  const res = await fetch(`${BASE}${path}`, { headers, redirect: 'manual' })
  const text = await res.text()
  let json = null
  try {
    json = JSON.parse(text)
  } catch {
    /* html */
  }
  return { res, text, json }
}

async function main() {
  console.log(`City locale verification against ${BASE}`)

  // API: each city returns published English content
  for (const citySlug of ALL_CITY_SLUGS) {
    const city = CITY_REGISTRY[citySlug]
    const apiPath = `/api/public/locale-content/city/${citySlug}/${CITY_PAGE_SLUG}?country=${city.countryCode}&lang=en`
    const { res, json } = await get(apiPath)
    if (res.status !== 200) fail(`${citySlug} API`, `status ${res.status}`)
    else if (!json?.page?.heading) fail(`${citySlug} API`, 'missing heading')
    else if (json.page.heading.toLowerCase().includes(city.name.en.toLowerCase()) === false &&
      !json.page.heading.toLowerCase().includes(citySlug.replace(/-/g, ' '))) {
      fail(`${citySlug} API`, `heading not city-specific: ${json.page.heading}`)
    }
    if (json?.meta?.fallbackUsed) fail(`${citySlug} API`, 'unexpected fallback on published city')
  }

  // Routes
  const routeChecks = [
    { path: '/dubai/erp-software', expect: 200, city: 'dubai' },
    { path: '/ae/en/dubai/erp-software', expect: 302, city: 'dubai' },
    { path: '/sa/en/riyadh/erp-software', expect: 200, city: 'riyadh' },
    { path: '/qa/en/doha/erp-software', expect: 200, city: 'doha' },
    { path: '/bh/en/manama/erp-software', expect: 200, city: 'manama' },
  ]

  for (const check of routeChecks) {
    const { res, text } = await get(check.path, { Accept: 'text/html' })
    if (check.expect === 302) {
      if (res.status !== 301 && res.status !== 302) fail(check.path, `expected redirect, got ${res.status}`)
      const loc = res.headers.get('location') || ''
      if (!loc.includes(`/${check.city}/${CITY_PAGE_SLUG}`)) fail(check.path, `bad redirect location: ${loc}`)
    } else if (res.status !== 200) {
      fail(check.path, `status ${res.status}`)
    } else if (!text.includes('<!DOCTYPE html') && !text.includes('<html')) {
      fail(check.path, 'not HTML')
    }
  }

  // Sitemap includes city URLs
  const { text: sitemap } = await get('/sitemap.xml')
  for (const citySlug of ['dubai', 'riyadh', 'doha']) {
    const countrySlug = CITY_REGISTRY[citySlug].countryCode.toLowerCase()
    const url =
      countrySlug === 'ae'
        ? `${BASE}/dubai/erp-software`.replace('dubai', citySlug)
        : `${BASE}${buildCityPagePath(countrySlug, 'en', citySlug, CITY_PAGE_SLUG)}`
    if (!sitemap.includes(url.replace(BASE, '').startsWith('/') ? url : new URL(url).pathname)) {
      const path = countrySlug === 'ae' ? `/${citySlug}/${CITY_PAGE_SLUG}` : buildCityPagePath(countrySlug, 'en', citySlug, CITY_PAGE_SLUG)
      if (!sitemap.includes(path)) fail('sitemap', `missing ${path}`)
    }
  }

  // SEO API: canonical + noindex for fallback (unpublished city simulation via invalid)
  const seo = await get('/api/public/seo-page?path=/sa/en/riyadh/erp-software')
  if (seo.json?.noIndex === true) fail('riyadh SEO', 'should be indexable when published')
  if (!seo.json?.canonical?.includes('/riyadh/erp-software')) fail('riyadh SEO', `bad canonical ${seo.json?.canonical}`)

  if (failures.length) {
    console.error('FAILURES:\n' + failures.map((f) => `- ${f}`).join('\n'))
    process.exit(1)
  }

  console.log(`All city locale checks passed (${ALL_CITY_SLUGS.length} cities).`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
