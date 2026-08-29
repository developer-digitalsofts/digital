/**
 * Pakistan multi-city route, selector-contract, SEO and 404 verification.
 * Usage: node scripts/verify-pk-cities.mjs [baseUrl]
 */
import { ALL_CITY_SLUGS, CITY_PRODUCT_PAGE_SLUGS, CITY_REGISTRY } from '../server/cityRegistry.mjs'
import { buildCityHomePath, buildCitySoftwarePath } from '../server/pakistanConfig.mjs'
import { parseCityPagePath } from '../server/cityPaths.mjs'

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

function assertCityParser() {
  const home = parseCityPagePath('/karachi')
  if (!home.isCityHome || home.citySlug !== 'karachi') fail('parser', '/karachi is not city home')
  const software = parseCityPagePath('/lahore/software/erp-software')
  if (!software.isCitySoftware || software.citySlug !== 'lahore') fail('parser', '/lahore/software/erp-software')
  const legacy = parseCityPagePath('/islamabad/erp-software')
  if (!legacy.redirectTo || !legacy.redirectTo.includes('/islamabad/software/erp-software')) {
    fail('parser', 'legacy product should redirect')
  }
  const unknown = parseCityPagePath('/karachi/not-a-page')
  if (!unknown.unknownCityPath) fail('parser', 'unknown city path should 404')
  const prefMustNotWin = parseCityPagePath('/quetta')
  if (prefMustNotWin.citySlug !== 'quetta') fail('parser', 'explicit URL city must win')
}

async function main() {
  console.log(`Pakistan city verification against ${BASE}`)
  assertCityParser()

  for (const citySlug of ALL_CITY_SLUGS) {
    const city = CITY_REGISTRY[citySlug]
    const apiPath = `/api/public/locale-content/city/${citySlug}/home?country=PK&lang=en`
    const { res, json } = await get(apiPath)
    if (res.status !== 200) fail(`${citySlug} API`, `status ${res.status}`)
    else {
      const heading = typeof json?.page?.heading === 'string' ? json.page.heading : json?.page?.heading?.en || ''
      if (!heading) fail(`${citySlug} API`, 'missing heading')
      else if (!String(heading).toLowerCase().includes(city.name.en.toLowerCase())) {
        fail(`${citySlug} API`, `heading not city-specific: ${heading}`)
      }
      const body = JSON.stringify(json?.page || {})
      if (body.length < 500) fail(`${citySlug} API`, `payload too short (${body.length})`)
    }

    const homePath = buildCityHomePath(citySlug)
    const { res: htmlRes, text } = await get(homePath, { Accept: 'text/html', 'User-Agent': 'GPTBot' })
    if (htmlRes.status !== 200) fail(homePath, `status ${htmlRes.status}`)
    else {
      if (!text.includes('<h1')) fail(homePath, 'missing H1')
      const h1Count = (text.match(/<h1[\s>]/g) || []).length
      if (h1Count !== 1) fail(homePath, `expected 1 H1, got ${h1Count}`)
      const textLen = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().length
      if (textLen < 500) fail(homePath, `raw text too short (${textLen})`)
      if (!text.includes(`rel="canonical"`) && !text.includes('rel=canonical')) fail(homePath, 'missing canonical')
      if (
        text.includes('607, Al Rahma') ||
        text.includes('+971 58') ||
        text.includes('+971 6') ||
        text.includes('info@digitalmanager.ae')
      ) {
        fail(homePath, 'UAE leftover in HTML')
      }
    }

    const productPath = buildCitySoftwarePath(citySlug, 'erp-software')
    const { res: prodRes } = await get(productPath, { Accept: 'text/html', 'User-Agent': 'GPTBot' })
    if (prodRes.status !== 200) fail(productPath, `status ${prodRes.status}`)
  }

  const { res: notFound } = await get('/not-a-real-city', { Accept: 'text/html' })
  if (notFound.status !== 404) fail('/not-a-real-city', `expected 404, got ${notFound.status}`)

  const { res: badPath } = await get('/karachi/not-a-real-path', { Accept: 'text/html' })
  if (badPath.status !== 404) fail('/karachi/not-a-real-path', `expected 404, got ${badPath.status}`)

  const { res: legacy } = await get('/karachi/erp-software', { Accept: 'text/html', redirect: 'manual' })
  if (legacy.status !== 301 && legacy.status !== 302) fail('/karachi/erp-software', `expected redirect, got ${legacy.status}`)

  const prefCookie = encodeURIComponent(JSON.stringify({ citySlug: 'karachi', manual: true }))
  const { text: lahoreWithKarachiPref } = await get('/lahore', {
    Accept: 'text/html',
    'User-Agent': 'GPTBot',
    Cookie: `dm_pk_city_pref=${prefCookie}`,
  })
  if (!/lahore/i.test(lahoreWithKarachiPref) || /karachi cloud erp|erp software for karachi/i.test(lahoreWithKarachiPref)) {
    fail('/lahore with karachi cookie', 'explicit city URL was overridden by saved preference')
  }
  const h1Match = lahoreWithKarachiPref.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
  if (!h1Match || !/lahore/i.test(h1Match[1])) {
    fail('/lahore with karachi cookie', `H1 did not stay Lahore: ${h1Match?.[1] || 'missing'}`)
  }

  const { text: sitemap } = await get('/sitemap.xml')
  for (const citySlug of ALL_CITY_SLUGS) {
    if (!sitemap.includes(`/${citySlug}`)) fail('sitemap', `missing /${citySlug}`)
  }

  const { text: llms } = await get('/llms.txt')
  for (const citySlug of ['karachi', 'lahore', 'islamabad']) {
    if (!llms.includes(`/${citySlug}`)) fail('llms.txt', `missing /${citySlug}`)
  }
  for (const product of CITY_PRODUCT_PAGE_SLUGS) {
    if (!llms.includes(`/karachi/software/${product}`)) fail('llms.txt', `missing /karachi/software/${product}`)
  }

  if (failures.length) {
    console.error('FAILED')
    for (const row of failures) console.error(` - ${row}`)
    process.exit(1)
  }
  console.log(`OK — ${ALL_CITY_SLUGS.length} cities, routes, 404s, sitemap and llms.txt`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
