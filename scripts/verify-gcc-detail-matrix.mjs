/**
 * Verify CRM + industry detail pages per GCC country (currency, cities, no UAE leakage).
 * Usage: node scripts/verify-gcc-detail-matrix.mjs [baseUrl]
 */
const BASE = (process.env.BASE_URL || process.argv[2] || 'http://127.0.0.1:3040').replace(/\/$/, '')

const MATRIX = [
  { country: 'AE', prefix: '', pathPrefix: '/software', currency: 'AED', cities: ['Dubai', 'Abu Dhabi'], forbidden: [] },
  { country: 'SA', prefix: '/sa/en', pathPrefix: '/sa/en/software', currency: 'SAR', cities: ['Riyadh', 'Jeddah'], forbidden: ['AED', 'Dubai', 'Abu Dhabi', 'Sharjah', 'Dubai Holdings'] },
  { country: 'QA', prefix: '/qa/en', pathPrefix: '/qa/en/software', currency: 'QAR', cities: ['Doha', 'Al Rayyan'], forbidden: ['AED', 'Dubai', 'Abu Dhabi', 'Sharjah'] },
  { country: 'OM', prefix: '/om/en', pathPrefix: '/om/en/software', currency: 'OMR', cities: ['Muscat', 'Salalah'], forbidden: ['AED', 'Dubai', 'Abu Dhabi', 'Sharjah'] },
  { country: 'KW', prefix: '/kw/en', pathPrefix: '/kw/en/software', currency: 'KWD', cities: ['Kuwait City', 'Hawalli'], forbidden: ['AED', 'Dubai', 'Abu Dhabi', 'Sharjah'] },
  { country: 'BH', prefix: '/bh/en', pathPrefix: '/bh/en/software', currency: 'BHD', cities: ['Manama', 'Riffa'], forbidden: ['AED', 'Dubai', 'Abu Dhabi', 'Sharjah', 'Emirates Supplies'] },
]

const BROWSER_HEADERS = {
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Dest': 'document',
}

const results = []

function pass(name, detail = '') {
  results.push({ ok: true, name, detail })
  console.log(`✓ ${name}${detail ? ` — ${detail}` : ''}`)
}

function fail(name, detail = '') {
  results.push({ ok: false, name, detail })
  console.error(`✗ ${name}${detail ? ` — ${detail}` : ''}`)
}

function visible(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const AGENT_HEADERS = {
  Accept: 'text/html',
  'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
}

async function checkRoute(label, path, row) {
  const res = await fetch(`${BASE}${path}`, { headers: AGENT_HEADERS })
  const html = await res.text()
  const text = visible(html)

  if (res.status === 200) pass(`${label} HTTP 200`)
  else fail(`${label} HTTP 200`, String(res.status))

  if (html.includes('type="module"')) pass(`${label} React shell`)
  else fail(`${label} React shell`)

  if (text.includes(row.currency) || html.includes(row.currency)) pass(`${label} currency ${row.currency}`)
  else fail(`${label} currency ${row.currency}`)

  const cityOk = row.cities.some((c) => text.includes(c) || html.includes(c))
  if (cityOk) pass(`${label} local city in page`)
  else fail(`${label} local city in page`, row.cities.join(', '))

  for (const bad of row.forbidden) {
    if (!text.includes(bad)) pass(`${label} free of ${bad}`)
    else fail(`${label} free of ${bad}`)
  }

  const api = await fetch(
    `${BASE}/api/public/locale-content/software/module/crm-software?country=${row.country}&lang=en`.replace(
      'module/crm-software',
      path.includes('/industry/') ? `industry/${path.split('/industry/')[1]}` : 'module/crm-software',
    ),
  )
  if (path.includes('crm-software')) {
    const apiRes = await fetch(
      `${BASE}/api/public/locale-content/software/module/crm-software?country=${row.country}&lang=en`,
    )
    if (row.country === 'AE') {
      if (apiRes.status === 404 || apiRes.ok) pass(`${label} locale API`)
    } else if (apiRes.ok) {
      const body = await apiRes.json()
      if (body.page?.regional?.currency === row.currency) pass(`${label} CMS regional.currency`)
      else fail(`${label} CMS regional.currency`, body.page?.regional?.currency)
    } else fail(`${label} locale API`, String(apiRes.status))
  }
}

async function main() {
  console.log(`\n=== GCC Detail Matrix ===\nBase: ${BASE}\n`)

  for (const row of MATRIX) {
    const crmPath = `${row.pathPrefix}/crm-software`
    const industryPath = `${row.pathPrefix}/industry/petrol-pump-software`
    await checkRoute(`${row.country} CRM`, crmPath, row)
    await checkRoute(`${row.country} industry`, industryPath, row)
  }

  const failed = results.filter((r) => !r.ok)
  console.log(`\n${results.length - failed.length}/${results.length} passed`)
  if (failed.length) process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
