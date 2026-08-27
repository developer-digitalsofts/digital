/**
 * Country detection + Google discoverability verification.
 * Usage: node scripts/verify-locale-country-discovery.mjs [baseUrl]
 */
const BASE = (process.env.BASE_URL || process.argv[2] || 'http://127.0.0.1:3040').replace(/\/$/, '')

const BROWSER_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'

const results = []

function pass(name, detail = '') {
  results.push({ name, ok: true, detail })
  console.log(`✓ ${name}${detail ? ` — ${detail}` : ''}`)
}

function fail(name, detail = '') {
  results.push({ name, ok: false, detail })
  console.error(`✗ ${name}${detail ? ` — ${detail}` : ''}`)
}

async function fetchRaw(url, headers = {}, redirect = 'manual') {
  const res = await fetch(url, { headers, redirect })
  const text = await res.text().catch(() => '')
  return { status: res.status, headers: Object.fromEntries(res.headers.entries()), text }
}

function prefCookie(payload) {
  return encodeURIComponent(JSON.stringify(payload))
}

async function main() {
  console.log(`\n=== Country Detection + Discoverability ===`)
  console.log(`Base: ${BASE}\n`)

  const qaRoot = await fetchRaw(`${BASE}/`, {
    'CF-IPCountry': 'QA',
    Accept: 'text/html',
    'User-Agent': BROWSER_UA,
  })
  if (qaRoot.status === 302 && qaRoot.headers.location === '/qa/en') pass('New QA visitor / → /qa/en')
  else fail('New QA visitor / → /qa/en', `${qaRoot.status} location=${qaRoot.headers.location || ''}`)

  const saRoot = await fetchRaw(`${BASE}/`, { 'CF-IPCountry': 'SA', 'User-Agent': BROWSER_UA })
  if (saRoot.status === 302 && saRoot.headers.location === '/sa/en') pass('New SA visitor / → /sa/en')
  else fail('New SA visitor / → /sa/en', `${saRoot.status} location=${saRoot.headers.location || ''}`)

  const explicitBh = await fetchRaw(`${BASE}/bh/en`, { 'CF-IPCountry': 'QA', 'User-Agent': BROWSER_UA })
  if (explicitBh.status === 200) pass('Explicit /bh/en preserved with QA header')
  else fail('Explicit /bh/en preserved', String(explicitBh.status))

  const googlebot = await fetchRaw(`${BASE}/`, {
    'CF-IPCountry': 'QA',
    'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  })
  if (googlebot.status === 200) pass('Googlebot not geo-redirected on /')
  else fail('Googlebot not geo-redirected', String(googlebot.status))

  const manualSa = await fetchRaw(`${BASE}/`, {
    'CF-IPCountry': 'QA',
    Cookie: `dm_locale_pref=${prefCookie({ country: 'sa', lang: 'en', manual: true })}`,
    'User-Agent': BROWSER_UA,
  })
  if (manualSa.status === 302 && manualSa.headers.location === '/sa/en') pass('Manual SA preference overrides QA IP')
  else fail('Manual SA preference', `${manualSa.status} ${manualSa.headers.location || ''}`)

  const rememberedQa = await fetchRaw(`${BASE}/`, {
    'CF-IPCountry': 'SA',
    Cookie: `dm_locale_pref=${prefCookie({ country: 'qa', lang: 'en', manual: false })}`,
    'User-Agent': BROWSER_UA,
  })
  if (rememberedQa.status === 302 && rememberedQa.headers.location === '/qa/en') {
    pass('Remembered auto QA preference overrides SA IP')
  } else {
    fail('Remembered auto preference', `${rememberedQa.status} ${rememberedQa.headers.location || ''}`)
  }

  if (qaRoot.headers['cache-control']?.includes('no-store')) pass('Geo redirect is private no-store')
  else fail('Geo redirect cache-control', qaRoot.headers['cache-control'] || 'missing')

  const vary = qaRoot.headers.vary || ''
  if (vary.includes('CF-IPCountry') && vary.includes('Cookie')) pass('Geo redirect Vary header')
  else fail('Geo redirect Vary header', vary || 'missing')

  const routingApi = await fetchRaw(`${BASE}/api/public/locale-routing?path=/`, { 'CF-IPCountry': 'QA' })
  if (routingApi.status === 200) {
    try {
      const json = JSON.parse(routingApi.text)
      if (json.redirect === '/qa/en') pass('locale-routing API returns /qa/en')
      else fail('locale-routing API', JSON.stringify(json))
      if (json.geoHeaders?.cfIpCountry === 'QA') pass('locale-routing exposes geo header diagnostics')
      else fail('Geo header diagnostics', JSON.stringify(json.geoHeaders))
    } catch {
      fail('locale-routing API parse')
    }
  } else fail('locale-routing API', String(routingApi.status))

  const seoQaHome = await fetchRaw(`${BASE}/api/public/seo-page?path=${encodeURIComponent('/qa/en')}`)
  if (seoQaHome.status === 200) {
    try {
      const seo = JSON.parse(seoQaHome.text)
      if (seo.noIndex === false) pass('/qa/en SEO API indexable')
      else fail('/qa/en SEO API indexable', `noIndex=${seo.noIndex}`)
      if (/qatar/i.test(seo.title || '')) pass('/qa/en SEO title mentions Qatar', seo.title)
      else fail('/qa/en SEO title mentions Qatar', seo.title || 'missing')
      const canonicalPath = new URL(seo.canonical).pathname
      if (canonicalPath === '/qa/en') pass('/qa/en self-referencing canonical', seo.canonical)
      else fail('/qa/en canonical', seo.canonical)
      const hasEnQa = (seo.alternates || []).some((a) => a.hreflang === 'en-QA')
      const hasXDefault = (seo.alternates || []).some((a) => a.hreflang === 'x-default')
      if (hasEnQa && hasXDefault) pass('/qa/en hreflang includes en-QA and x-default')
      else fail('/qa/en hreflang', JSON.stringify(seo.alternates?.map((a) => a.hreflang)))
    } catch {
      fail('/qa/en SEO parse')
    }
  } else fail('/qa/en SEO API', String(seoQaHome.status))

  const seoQaErp = await fetchRaw(`${BASE}/api/public/seo-page?path=${encodeURIComponent('/qa/en/erp')}`)
  if (seoQaErp.status === 200) {
    try {
      const seo = JSON.parse(seoQaErp.text)
      if (seo.noIndex === false && /qatar/i.test(seo.title || '')) {
        pass('/qa/en/erp indexable with Qatar title', seo.title)
      } else {
        fail('/qa/en/erp SEO', JSON.stringify({ noIndex: seo.noIndex, title: seo.title }))
      }
    } catch {
      fail('/qa/en/erp SEO parse')
    }
  } else fail('/qa/en/erp SEO API', String(seoQaErp.status))

  const sitemap = await fetchRaw(`${BASE}/sitemap.xml`)
  if (sitemap.status === 200 && sitemap.text.includes('/qa/en')) pass('Sitemap includes /qa/en')
  else fail('Sitemap includes /qa/en')

  const gbQaEn = await fetchRaw(`${BASE}/qa/en`, {
    'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
    Accept: 'text/html',
  })
  if (gbQaEn.status === 200) {
    const hasQatarTitle = /qatar/i.test(gbQaEn.text)
    const hasNoindex = /<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i.test(gbQaEn.text)
    const hasH1 = /<h1[^>]*>[\s\S]*?<\/h1>/i.test(gbQaEn.text)
    if (hasQatarTitle) pass('Googlebot /qa/en HTML title mentions Qatar')
    else fail('Googlebot /qa/en title', 'no Qatar in HTML')
    if (!hasNoindex) pass('Googlebot /qa/en HTML not noindex')
    else fail('Googlebot /qa/en HTML noindex')
    if (hasH1) pass('Googlebot /qa/en HTML has visible H1')
    else fail('Googlebot /qa/en HTML H1 missing')
  } else fail('Googlebot /qa/en fetch', String(gbQaEn.status))

  console.log('\n--- curl commands (production-compatible) ---')
  console.log(`curl -sI -H "CF-IPCountry: QA" ${BASE}/`)
  console.log(`curl -sI -H "CF-IPCountry: SA" ${BASE}/`)
  console.log(`curl -sI -H "CF-IPCountry: QA" ${BASE}/bh/en`)
  console.log(`curl -sI -H "CF-IPCountry: QA" -A "Googlebot" ${BASE}/`)
  console.log(`curl -s "${BASE}/api/public/seo-page?path=/qa/en"`)
  console.log(`curl -s "${BASE}/sitemap.xml" | findstr /i qa/en`)
  console.log(`node scripts/clear-locale-pref.mjs`)

  const failed = results.filter((r) => !r.ok)
  console.log(`\n${results.length - failed.length}/${results.length} passed`)
  if (failed.length) process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
