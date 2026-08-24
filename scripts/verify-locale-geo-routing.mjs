/**
 * GCC automatic geo-routing verification.
 * Usage: node scripts/verify-locale-geo-routing.mjs [baseUrl]
 */
const BASE = (process.env.BASE_URL || process.argv[2] || 'http://127.0.0.1:3040').replace(/\/$/, '')

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

async function main() {
  console.log(`\n=== GCC Geo Routing Verification ===`)
  console.log(`Base: ${BASE}\n`)

  const cases = [
    ['AE', '/'],
    ['QA', '/qa/en'],
    ['SA', '/sa/en'],
    ['OM', '/om/en'],
    ['KW', '/kw/en'],
    ['BH', '/bh/en'],
  ]

  for (const [code, expected] of cases) {
    const res = await fetchRaw(`${BASE}/`, { 'x-test-country-code': code, Accept: 'text/html' })
    const location = res.headers.location || ''
    if (code === 'AE') {
      if (res.status === 200) pass(`UAE / stays 200`)
      else fail(`UAE / stays 200`, String(res.status))
    } else if (res.status === 302 && location === expected) {
      pass(`${code} / → ${expected}`, '302')
    } else {
      fail(`${code} / redirect`, `${res.status} location=${location}`)
    }
    if (res.headers['cache-control']?.includes('no-store')) pass(`${code} redirect not cacheable`)
    else if (code !== 'AE') fail(`${code} redirect cache-control`, res.headers['cache-control'])
  }

  const deep = await fetchRaw(`${BASE}/qa/en/erp`, { 'x-test-country-code': 'SA' })
  if (deep.status === 200) pass('/qa/en/erp not redirected from SA IP')
  else fail('/qa/en/erp deep link preserved', String(deep.status))

  const bot = await fetchRaw(`${BASE}/`, { 'x-test-country-code': 'QA', 'User-Agent': 'Googlebot/2.1' })
  if (bot.status === 200) pass('Googlebot / not geo-redirected')
  else fail('Googlebot / not geo-redirected', String(bot.status))

  const chatgpt = await fetchRaw(`${BASE}/`, { 'x-test-country-code': 'QA', 'User-Agent': 'ChatGPT-User' })
  if (chatgpt.status === 200) pass('ChatGPT-User / not geo-redirected')
  else fail('ChatGPT-User / not geo-redirected', String(chatgpt.status))

  const unknown = await fetchRaw(`${BASE}/does-not-exist-route-xyz`, { 'x-test-country-code': 'QA' })
  if (unknown.status === 404) pass('Unknown route still 404')
  else fail('Unknown route still 404', String(unknown.status))

  const api = await fetchRaw(`${BASE}/api/homepage`, { 'x-test-country-code': 'QA' })
  if (api.status === 200) pass('/api not redirected')
  else fail('/api not redirected', String(api.status))

  const manualCookie = encodeURIComponent(JSON.stringify({ country: 'sa', lang: 'en', manual: true }))
  const manual = await fetchRaw(`${BASE}/`, {
    'x-test-country-code': 'QA',
    Cookie: `dm_locale_pref=${manualCookie}`,
  })
  if (manual.status === 302 && manual.headers.location === '/sa/en') pass('Manual SA pref overrides QA IP')
  else fail('Manual SA pref overrides QA IP', `${manual.status} ${manual.headers.location}`)

  const routingApi = await fetchRaw(`${BASE}/api/public/locale-routing?path=/`, { 'x-test-country-code': 'QA' })
  if (routingApi.status === 200) {
    try {
      const json = JSON.parse(routingApi.text)
      if (json.redirect === '/qa/en') pass('locale-routing API QA → /qa/en')
      else fail('locale-routing API QA', JSON.stringify(json))
    } catch {
      fail('locale-routing API parse')
    }
  } else fail('locale-routing API', String(routingApi.status))

  const md = await fetchRaw(`${BASE}/`, {
    'x-test-country-code': 'QA',
    Accept: 'text/markdown',
  })
  if (md.status === 302 && md.headers.location === '/qa/en') pass('Markdown Accept still geo-redirects on /')
  else fail('Markdown geo redirect on /', `${md.status}`)

  const failed = results.filter((r) => !r.ok)
  console.log(`\n${results.length - failed.length}/${results.length} passed`)
  if (failed.length) process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
