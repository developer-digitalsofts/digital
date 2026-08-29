/**
 * Pakistan multi-city route, SEO, 404, discovery and homepage-contract verification.
 * Usage: node scripts/verify-pk-cities.mjs [baseUrl]
 */
import { ALL_CITY_SLUGS, CITY_PRODUCT_PAGE_SLUGS, CITY_REGISTRY } from '../server/cityRegistry.mjs'
import { buildCityHomePath, buildCitySoftwarePath, PUBLIC_SITE_URL_DEFAULT } from '../server/pakistanConfig.mjs'
import { parseCityPagePath } from '../server/cityPaths.mjs'
import { getCityHomepageProfile } from '../server/cityHomepageProfiles.mjs'

const BASE = (process.argv[2] || process.env.BASE_URL || 'http://127.0.0.1:3040').replace(/\/$/, '')
const failures = []
const PRODUCTION_HOST = new URL(PUBLIC_SITE_URL_DEFAULT).host

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

function stripHtml(html) {
  return html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
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
  const contact = parseCityPagePath('/hyderabad/contact')
  if (!contact.isCitySitePage || contact.sitePath !== '/contact') fail('parser', '/hyderabad/contact')
  const industries = parseCityPagePath('/hyderabad/industries/retail')
  if (!industries.isCitySitePage || industries.sitePath !== '/industries/retail') fail('parser', '/hyderabad/industries/retail')
  const prefMustNotWin = parseCityPagePath('/quetta')
  if (prefMustNotWin.citySlug !== 'quetta') fail('parser', 'explicit URL city must win')
}

async function main() {
  console.log(`Pakistan city verification against ${BASE}`)
  assertCityParser()

  const titles = new Set()
  const h1s = new Set()
  const canonicals = new Set()
  const descriptions = new Set()

  for (const citySlug of ALL_CITY_SLUGS) {
    const city = CITY_REGISTRY[citySlug]
    const cityName = city.name.en
    const profile = getCityHomepageProfile(citySlug)
    const apiPath = `/api/public/locale-content/city/${citySlug}/home?country=PK&lang=en`
    const { res, json } = await get(apiPath)
    if (res.status !== 200) fail(`${citySlug} API`, `status ${res.status}`)
    else {
      const heading = typeof json?.page?.heading === 'string' ? json.page.heading : json?.page?.heading?.en || ''
      if (!heading) fail(`${citySlug} API`, 'missing heading')
      else if (!String(heading).toLowerCase().includes(cityName.toLowerCase())) {
        fail(`${citySlug} API`, `heading not city-specific: ${heading}`)
      }
      const body = JSON.stringify(json?.page || {})
      if (body.length < 500) fail(`${citySlug} API`, `payload too short (${body.length})`)
    }

    const homeApi = `/api/homepage?country=PK&lang=en&city=${citySlug}`
    const { res: homeApiRes, json: homeJson } = await get(homeApi)
    if (homeApiRes.status !== 200) fail(`${citySlug} homepage API`, `status ${homeApiRes.status}`)
    else {
      if (homeJson?.city?.slug !== citySlug) fail(`${citySlug} homepage API`, 'missing city overlay')
      if (!homeJson?.hero || !homeJson?.modules || !homeJson?.industries || !homeJson?.faqs) {
        fail(`${citySlug} homepage API`, 'missing full homepage sections')
      }
      const heroTitle = homeJson?.hero?.title?.en || ''
      if (!/digitalmanager/i.test(heroTitle) || !String(heroTitle).toLowerCase().includes(cityName.toLowerCase())) {
        fail(`${citySlug} homepage API`, `hero title must include DigitalManager and ${cityName}: ${heroTitle}`)
      }
      const statsVisible = (homeJson?.pageSections?.sections || []).find((s) => s.id === 'stats' && s.visible !== false)
      if (statsVisible) fail(`${citySlug} homepage API`, 'stats strip still visible in page sections')
    }

    const homePath = buildCityHomePath(citySlug)
    const { res: htmlRes, text } = await get(homePath, { Accept: 'text/html', 'User-Agent': 'GPTBot' })
    if (htmlRes.status !== 200) fail(homePath, `status ${htmlRes.status}`)
    else {
      if (!text.includes('<h1')) fail(homePath, 'missing H1')
      const h1Count = (text.match(/<h1[\s>]/g) || []).length
      if (h1Count !== 1) fail(homePath, `expected 1 H1, got ${h1Count}`)
      const h1Match = text.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)
      const h1Text = stripHtml(h1Match?.[1] || '')
      if (!/digitalmanager/i.test(h1Text) || !new RegExp(cityName, 'i').test(h1Text)) {
        fail(homePath, `H1 must include DigitalManager and ${cityName}: ${h1Text}`)
      }
      if (h1s.has(h1Text)) fail(homePath, `duplicate H1: ${h1Text}`)
      h1s.add(h1Text)

      const titleMatch = text.match(/<title>([\s\S]*?)<\/title>/i)
      const title = stripHtml(titleMatch?.[1] || '')
      if (!title.includes(`DigitalManager in ${cityName}`)) {
        fail(homePath, `title must include DigitalManager in ${cityName}: ${title}`)
      }
      if (titles.has(title)) fail(homePath, `duplicate title: ${title}`)
      titles.add(title)

      const descMatch = text.match(/<meta name="description" content="([^"]+)"/i)
      const description = descMatch?.[1] || ''
      if (!/digitalmanager/i.test(description) || !new RegExp(cityName, 'i').test(description)) {
        fail(homePath, `meta description must include DigitalManager and ${cityName}`)
      }
      if (descriptions.has(description)) fail(homePath, `duplicate description`)
      descriptions.add(description)

      const canonMatch = text.match(/<link rel="canonical" href="([^"]+)"/i)
      const canonical = canonMatch?.[1] || ''
      const expectedCanon = `${PUBLIC_SITE_URL_DEFAULT}${homePath}`
      if (canonical !== expectedCanon) fail(homePath, `canonical ${canonical} !== ${expectedCanon}`)
      if (canonicals.has(canonical)) fail(homePath, `duplicate canonical`)
      canonicals.add(canonical)
      if (/pk-test\.digitalmanager\.ae/i.test(text)) fail(homePath, 'temporary Coolify domain in HTML')
      if (/noindex/i.test(text.match(/<meta name="robots" content="([^"]+)"/i)?.[1] || '')) {
        fail(homePath, 'robots must allow index')
      }

      const textLen = stripHtml(text).length
      if (textLen < 500) fail(homePath, `raw text too short (${textLen})`)
      const h2Count = (text.match(/<h2[\s>]/g) || []).length
      if (h2Count < 3) fail(homePath, `expected full homepage H2s, got ${h2Count}`)
      if (!/ERP Modules|Industries|Why DigitalManager|modules|DigitalManager across Pakistan/i.test(text)) {
        fail(homePath, 'agent HTML is not the full homepage')
      }
      if (!new RegExp(cityName, 'i').test(text)) fail(homePath, 'missing city name')
      if (text.includes('aria-label="Select city"') || /<span[^>]*>City<\/span>/.test(text)) {
        fail(homePath, 'city selector still present in raw HTML')
      }
      if (text.includes('dm-trust-stats__bar') || text.includes('home-section--trust-stats')) {
        fail(homePath, 'dark-blue trust strip still present')
      }
      if (
        text.includes('607, Al Rahma') ||
        text.includes('+971 58') ||
        text.includes('+971 6') ||
        text.includes('info@digitalmanager.ae')
      ) {
        fail(homePath, 'UAE leftover in HTML')
      }

      const jsonLd = [...text.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map((m) => {
        try {
          return JSON.parse(m[1])
        } catch {
          return null
        }
      })
      const types = new Set(jsonLd.filter(Boolean).map((b) => b['@type']))
      for (const needed of ['Organization', 'SoftwareApplication', 'WebSite', 'WebPage', 'BreadcrumbList']) {
        if (!types.has(needed)) fail(homePath, `missing JSON-LD ${needed}`)
      }
      if (types.has('LocalBusiness')) fail(homePath, 'must not invent LocalBusiness schema')
      const breadcrumb = jsonLd.find((b) => b?.['@type'] === 'BreadcrumbList')
      const crumbNames = (breadcrumb?.itemListElement || []).map((i) => String(i.name || ''))
      if (!crumbNames.some((n) => /home/i.test(n)) || !crumbNames.some((n) => new RegExp(cityName, 'i').test(n))) {
        fail(homePath, 'breadcrumb must identify Home and the city')
      }

      const { res: mdRes, text: md, headers } = await get(homePath, { Accept: 'text/markdown' })
      if (mdRes.status !== 200) fail(`${homePath} markdown`, `status ${mdRes.status}`)
      else {
        const ctype = mdRes.headers.get('content-type') || ''
        if (!ctype.includes('text/markdown')) fail(`${homePath} markdown`, `content-type ${ctype}`)
        const vary = String(mdRes.headers.get('vary') || '').toLowerCase()
        if (!vary.includes('accept')) fail(`${homePath} markdown`, `Vary missing Accept: ${vary}`)
        if (!md.includes(cityName) || !/digitalmanager/i.test(md)) fail(`${homePath} markdown`, 'missing city/DigitalManager')
      }
    }

    for (const site of ['/contact', '/faqs', '/industries']) {
      const { res: siteRes } = await get(`/${citySlug}${site}`, { Accept: 'text/html' })
      if (siteRes.status !== 200) fail(`/${citySlug}${site}`, `status ${siteRes.status}`)
    }

    const productPath = buildCitySoftwarePath(citySlug, 'erp-software')
    const { res: prodRes } = await get(productPath, { Accept: 'text/html', 'User-Agent': 'GPTBot' })
    if (prodRes.status !== 200) fail(productPath, `status ${prodRes.status}`)

    if (profile && !profile.metaTitle.includes(cityName)) fail(`${citySlug} profile`, 'meta title missing city')
  }

  const { res: notFound, text: notFoundHtml } = await get('/not-a-real-city', { Accept: 'text/html' })
  if (notFound.status !== 404) fail('/not-a-real-city', `expected 404, got ${notFound.status}`)
  if (!notFoundHtml.includes('/cities') || !notFoundHtml.includes('/sitemap.xml') || !notFoundHtml.includes('/llms.txt')) {
    fail('/not-a-real-city', '404 missing homepage/cities/sitemap/llms links')
  }

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
  const lahoreH1 = stripHtml(lahoreWithKarachiPref.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '')
  if (!/lahore/i.test(lahoreH1) || /karachi/i.test(lahoreH1)) {
    fail('/lahore with karachi cookie', `explicit city URL was overridden: ${lahoreH1 || 'missing H1'}`)
  }

  const { res: citiesRes, text: citiesHtml } = await get('/cities', { Accept: 'text/html', 'User-Agent': 'GPTBot' })
  if (citiesRes.status !== 200) fail('/cities', `status ${citiesRes.status}`)
  else {
    if (!/<h1/i.test(citiesHtml)) fail('/cities', 'missing H1')
    for (const citySlug of ALL_CITY_SLUGS) {
      if (!citiesHtml.includes(`href="/${citySlug}"`) && !citiesHtml.includes(`href="${PUBLIC_SITE_URL_DEFAULT}/${citySlug}"`)) {
        fail('/cities', `missing crawlable link to /${citySlug}`)
      }
    }
  }

  const { res: sitemapRes, text: sitemap } = await get('/sitemap.xml')
  const sitemapType = sitemapRes.headers.get('content-type') || ''
  if (!sitemapType.includes('xml')) fail('sitemap', `content-type ${sitemapType}`)
  if (/pk-test\.digitalmanager\.ae/i.test(sitemap)) fail('sitemap', 'temporary Coolify domain')
  for (const citySlug of ALL_CITY_SLUGS) {
    if (!sitemap.includes(`${PUBLIC_SITE_URL_DEFAULT}/${citySlug}`)) fail('sitemap', `missing ${PUBLIC_SITE_URL_DEFAULT}/${citySlug}`)
  }
  if (!sitemap.includes(`${PUBLIC_SITE_URL_DEFAULT}/cities`)) fail('sitemap', 'missing /cities')

  const { text: robots } = await get('/robots.txt')
  if (!robots.includes(`Sitemap: ${PUBLIC_SITE_URL_DEFAULT}/sitemap.xml`)) {
    fail('robots.txt', `must reference ${PUBLIC_SITE_URL_DEFAULT}/sitemap.xml`)
  }

  const { text: llms } = await get('/llms.txt')
  if (!llms.includes('/cities')) fail('llms.txt', 'missing /cities')
  if (!/localized full DigitalManager/i.test(llms) && !/city URLs provide localized/i.test(llms)) {
    fail('llms.txt', 'missing explanation that city URLs are full localized pages')
  }
  for (const citySlug of ['karachi', 'lahore', 'islamabad']) {
    if (!llms.includes(`/${citySlug}`)) fail('llms.txt', `missing /${citySlug}`)
  }
  for (const product of CITY_PRODUCT_PAGE_SLUGS) {
    if (!llms.includes(`/karachi/software/${product}`)) fail('llms.txt', `missing /karachi/software/${product}`)
  }
  if (/pk-test\.digitalmanager\.ae/i.test(llms)) fail('llms.txt', 'temporary Coolify domain')

  if (failures.length) {
    console.error('FAILED')
    for (const row of failures) console.error(` - ${row}`)
    process.exit(1)
  }
  console.log(`OK — ${ALL_CITY_SLUGS.length} cities on ${PRODUCTION_HOST}, unique SEO, /cities, sitemap, robots, llms`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
