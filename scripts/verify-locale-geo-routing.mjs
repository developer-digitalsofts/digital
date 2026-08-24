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

function prefCookie(payload) {
  return encodeURIComponent(JSON.stringify(payload))
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

  const qaRedirect = await fetchRaw(`${BASE}/`, { 'x-test-country-code': 'QA' })
  if (qaRedirect.headers['set-cookie']?.includes('dm_locale_pref=')) {
    pass('Geo redirect sets locale cookie')
  } else {
    fail('Geo redirect sets locale cookie', qaRedirect.headers['set-cookie'] || 'missing')
  }

  const autoCookie = prefCookie({ country: 'qa', lang: 'en', manual: false })
  const remembered = await fetchRaw(`${BASE}/`, {
    'x-test-country-code': 'SA',
    Cookie: `dm_locale_pref=${autoCookie}`,
  })
  if (remembered.status === 302 && remembered.headers.location === '/qa/en') {
    pass('Remembered auto locale overrides new IP')
  } else {
    fail('Remembered auto locale overrides new IP', `${remembered.status} ${remembered.headers.location}`)
  }

  const arabicQa = await fetchRaw(`${BASE}/`, {
    'x-test-country-code': 'QA',
    'x-test-accept-language': 'ar,en;q=0.8',
  })
  if (arabicQa.status === 302 && arabicQa.headers.location === '/qa/en') {
    pass('Arabic Accept-Language falls back to English when Arabic unpublished')
  } else {
    fail('Arabic Accept-Language fallback', `${arabicQa.status} ${arabicQa.headers.location}`)
  }

  const deep = await fetchRaw(`${BASE}/qa/en/erp`, { 'x-test-country-code': 'SA' })
  if (deep.status === 200) pass('/qa/en/erp not redirected from SA IP')
  else fail('/qa/en/erp deep link preserved', String(deep.status))

  const localizedDeep = await fetchRaw(`${BASE}/sa/en/contact`, { 'x-test-country-code': 'QA' })
  if (localizedDeep.status === 200) pass('/sa/en/contact not redirected from QA IP')
  else fail('/sa/en/contact deep link preserved', String(localizedDeep.status))

  const botCases = [
    ['Googlebot/2.1', 'Googlebot'],
    ['Mozilla/5.0 (compatible; bingbot/2.0)', 'Bingbot'],
    ['ChatGPT-User', 'ChatGPT-User'],
    ['Mozilla/5.0 GPTBot/1.0', 'GPTBot'],
    ['ClaudeBot/1.0', 'ClaudeBot'],
  ]
  for (const [ua, label] of botCases) {
    const bot = await fetchRaw(`${BASE}/`, { 'x-test-country-code': 'QA', 'User-Agent': ua })
    if (bot.status === 200) pass(`${label} / not geo-redirected`)
    else fail(`${label} / not geo-redirected`, String(bot.status))
  }

  const unknown = await fetchRaw(`${BASE}/does-not-exist-route-xyz`, { 'x-test-country-code': 'QA' })
  if (unknown.status === 404) pass('Unknown route still 404')
  else fail('Unknown route still 404', String(unknown.status))

  const api = await fetchRaw(`${BASE}/api/homepage`, { 'x-test-country-code': 'QA' })
  if (api.status === 200) pass('/api not redirected')
  else fail('/api not redirected', String(api.status))

  const manualCookie = prefCookie({ country: 'sa', lang: 'en', manual: true })
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

  const routingDeep = await fetchRaw(`${BASE}/api/public/locale-routing?path=/qa/en/erp`, { 'x-test-country-code': 'QA' })
  if (routingDeep.status === 200) {
    try {
      const json = JSON.parse(routingDeep.text)
      if (json.redirect == null && json.reason === 'not_entry_route') pass('locale-routing API skips deep paths')
      else fail('locale-routing API deep path', JSON.stringify(json))
    } catch {
      fail('locale-routing API deep path parse')
    }
  } else fail('locale-routing API deep path', String(routingDeep.status))

  const md = await fetchRaw(`${BASE}/`, {
    'x-test-country-code': 'QA',
    Accept: 'text/markdown',
  })
  if (md.status === 302 && md.headers.location === '/qa/en') pass('Markdown Accept still geo-redirects on /')
  else fail('Markdown geo redirect on /', `${md.status}`)

  const repeatRoot = await fetchRaw(`${BASE}/`, {
    'x-test-country-code': 'QA',
    Cookie: `dm_locale_pref=${prefCookie({ country: 'qa', lang: 'en', manual: false })}`,
  })
  if (repeatRoot.status === 302 && repeatRoot.headers.location === '/qa/en') pass('Repeat / visit uses remembered locale')
  else fail('Repeat / visit uses remembered locale', `${repeatRoot.status} ${repeatRoot.headers.location}`)

  const failed = results.filter((r) => !r.ok)
  console.log(`\n${results.length - failed.length}/${results.length} passed`)
  if (failed.length) process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
