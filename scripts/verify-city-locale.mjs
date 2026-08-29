/**
 * City locale routing and SEO verification — Pakistan market.
 * Usage: node scripts/verify-city-locale.mjs [baseUrl]
 */
import { ALL_CITY_SLUGS, CITY_HOME_SLUG, CITY_REGISTRY } from '../server/cityRegistry.mjs'
import { buildCityHomePath } from '../server/pakistanConfig.mjs'

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

  for (const citySlug of ALL_CITY_SLUGS) {
    const city = CITY_REGISTRY[citySlug]
    const apiPath = `/api/public/locale-content/city/${citySlug}/${CITY_HOME_SLUG}?country=${city.countryCode}&lang=en`
    const { res, json } = await get(apiPath)
    if (res.status !== 200) fail(`${citySlug} API`, `status ${res.status}`)
    else if (!json?.page?.heading) fail(`${citySlug} API`, 'missing heading')
    if (json?.meta?.fallbackUsed) fail(`${citySlug} API`, 'unexpected fallback on published city')
  }

  for (const citySlug of ['karachi', 'lahore', 'islamabad']) {
    const path = buildCityHomePath(citySlug)
    const { res, text } = await get(path, { Accept: 'text/html' })
    if (res.status !== 200) fail(path, `status ${res.status}`)
    else if (!text.includes('<!DOCTYPE html') && !text.includes('<html')) fail(path, 'not HTML')
  }

  const { text: sitemap } = await get('/sitemap.xml')
  for (const citySlug of ALL_CITY_SLUGS) {
    if (!sitemap.includes(`/${citySlug}`)) fail('sitemap', `missing /${citySlug}`)
  }

  const seo = await get('/api/public/seo-page?path=/karachi')
  if (seo.json?.noIndex === true) fail('karachi SEO', 'should be indexable when published')
  if (!seo.json?.canonical?.includes('/karachi')) fail('karachi SEO', `bad canonical ${seo.json?.canonical}`)

  if (failures.length) {
    console.error('FAILURES:\n' + failures.map((f) => `- ${f}`).join('\n'))
    process.exit(1)
  }

  console.log('OK — city locale API, routes, sitemap and SEO')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
