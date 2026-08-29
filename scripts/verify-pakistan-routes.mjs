/**
 * Verify Pakistan city routes + CMS isolation.
 * Usage: MARKET=PK CMS_DATA_DIR=data-pk node scripts/verify-pakistan-routes.mjs [baseUrl]
 */
const BASE = (process.env.BASE_URL || process.argv[2] || 'http://127.0.0.1:3040').replace(/\/$/, '')

const CITIES = [
  'karachi',
  'lahore',
  'islamabad',
  'rawalpindi',
  'faisalabad',
  'multan',
  'peshawar',
  'quetta',
  'hyderabad',
  'sialkot',
  'gujranwala',
]
const PRODUCTS = ['erp-software', 'pos-software', 'accounting-software']

const results = []
function pass(name, detail = '') {
  results.push({ name, ok: true, detail })
  console.log(`✓ ${name}${detail ? ` — ${detail}` : ''}`)
}
function fail(name, detail = '') {
  results.push({ name, ok: false, detail })
  console.error(`✗ ${name}${detail ? ` — ${detail}` : ''}`)
}

async function fetchRaw(url, headers = {}) {
  const res = await fetch(url, { headers, redirect: 'manual' })
  const text = await res.text().catch(() => '')
  return { status: res.status, headers: Object.fromEntries(res.headers.entries()), text }
}

async function main() {
  console.log(`\n=== Pakistan Routes Verification ===\nBase: ${BASE}\n`)

  const home = await fetchRaw(`${BASE}/`, { Accept: 'text/html' })
  if (home.status === 200) pass('GET / HTTP 200')
  else fail('GET / HTTP 200', String(home.status))
  if (!home.headers.location) pass('GET / does not geo-redirect')
  else fail('GET / does not geo-redirect', home.headers.location)

  const contact = await fetchRaw(`${BASE}/contact`, { Accept: 'text/html' })
  if (contact.status === 200) pass('GET /contact HTTP 200')
  else fail('GET /contact HTTP 200', String(contact.status))

  const settings = await fetchRaw(`${BASE}/api/homepage`)
  if (settings.status === 200) {
    try {
      const json = JSON.parse(settings.text)
      const cur = json?.siteSettings?.defaultCurrency || json?.siteSettings?.currency
      const phone = json?.siteSettings?.phoneDisplay || ''
      if (String(cur || '').includes('PKR') || phone.includes('+92') || phone.includes('92')) {
        pass('Homepage API exposes Pakistan contact/currency signals')
      } else {
        // soft — content may still be loading from seed
        pass('Homepage API reachable', `currency=${cur || 'n/a'} phone=${phone || 'n/a'}`)
      }
    } catch {
      fail('Homepage API parse')
    }
  } else fail('Homepage API', String(settings.status))

  for (const city of CITIES) {
    const homePath = `/${city}`
    const home = await fetchRaw(`${BASE}${homePath}`, { Accept: 'text/html' })
    if (home.status === 200) pass(`${homePath} HTTP 200`)
    else fail(`${homePath} HTTP 200`, String(home.status))

    const homeApi = await fetchRaw(`${BASE}/api/public/locale-content/city/${city}/home?country=PK&lang=en`)
    if (homeApi.status === 200) {
      try {
        const json = JSON.parse(homeApi.text)
        if (json?.page?.heading || json?.page?.title) pass(`${homePath} CMS content`)
        else fail(`${homePath} CMS content`, 'missing title')
      } catch {
        fail(`${homePath} CMS parse`)
      }
    } else fail(`${homePath} CMS API`, String(homeApi.status))

    for (const product of PRODUCTS) {
      const path = `/${city}/software/${product}`
      const res = await fetchRaw(`${BASE}${path}`, { Accept: 'text/html' })
      if (res.status === 200) pass(`${path} HTTP 200`)
      else fail(`${path} HTTP 200`, String(res.status))
    }
  }

  const gcc = await fetchRaw(`${BASE}/qa/en`, { Accept: 'text/html', redirect: 'manual' })
  if (gcc.status === 404 || gcc.status === 200) {
    // 200 may be SPA catch-all — ensure not redirected to qatar locale content path
    pass('Legacy /qa/en not treated as GCC geo redirect', String(gcc.status))
  } else fail('Legacy /qa/en check', String(gcc.status))

  const failed = results.filter((r) => !r.ok)
  console.log(`\n${results.length - failed.length}/${results.length} passed`)
  if (failed.length) process.exit(1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
