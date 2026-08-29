/**
 * Public API v1, versioning, and rate-limit verification.
 * Usage: node scripts/verify-public-api-v1.mjs [baseUrl]
 */
import { PUBLIC_GET_RATE_LIMIT_MAX } from '../server/publicApiRateLimit.mjs'

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

async function fetchJson(path, init = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'X-Forwarded-For': '203.0.113.88', ...(init.headers || {}) },
  })
  const text = await res.text()
  let json = null
  try {
    json = JSON.parse(text)
  } catch {
    json = null
  }
  return { res, json, text }
}

async function main() {
  console.log(`\n=== Public API v1 Verification ===`)
  console.log(`Base: ${BASE}\n`)

  const v1Health = await fetchJson('/api/public/v1/health')
  if (v1Health.res.status === 200 && v1Health.json?.ok === true) pass('GET /api/public/v1/health')
  else fail('GET /api/public/v1/health', String(v1Health.res.status))

  const healthLimit = v1Health.res.headers.get('ratelimit-limit')
  const healthRemaining = v1Health.res.headers.get('ratelimit-remaining')
  const healthReset = v1Health.res.headers.get('ratelimit-reset')
  if (healthLimit && healthRemaining != null && healthReset) {
    pass('RateLimit headers on /api/public/v1/health', `limit=${healthLimit} remaining=${healthRemaining}`)
  } else fail('RateLimit headers on /api/public/v1/health', `limit=${healthLimit} remaining=${healthRemaining} reset=${healthReset}`)

  const legacyHealth = await fetchJson('/api/health')
  if (legacyHealth.res.status === 200) pass('Legacy GET /api/health alias still works')
  else fail('Legacy GET /api/health alias still works', String(legacyHealth.res.status))

  const v1Testimonials = await fetchJson('/api/public/v1/testimonials?country=AE&lang=en')
  if (v1Testimonials.res.status === 200) pass('GET /api/public/v1/testimonials')
  else fail('GET /api/public/v1/testimonials', String(v1Testimonials.res.status))

  const limit = v1Testimonials.res.headers.get('ratelimit-limit')
  const remaining = v1Testimonials.res.headers.get('ratelimit-remaining')
  const reset = v1Testimonials.res.headers.get('ratelimit-reset')
  if (limit && remaining != null && reset) {
    pass('RateLimit headers on v1 GET', `limit=${limit} remaining=${remaining}`)
  } else fail('RateLimit headers on v1 GET', `limit=${limit} remaining=${remaining} reset=${reset}`)

  if (Number(limit) === PUBLIC_GET_RATE_LIMIT_MAX) pass('RateLimit-Limit matches policy', limit)
  else fail('RateLimit-Limit matches policy', `${limit} expected ${PUBLIC_GET_RATE_LIMIT_MAX}`)

  const legacyTestimonials = await fetchJson('/api/public/testimonials?country=AE&lang=en')
  const deprecation = legacyTestimonials.res.headers.get('deprecation')
  const sunset = legacyTestimonials.res.headers.get('sunset')
  const link = legacyTestimonials.res.headers.get('link') || ''
  if (deprecation && sunset && link.includes('/developers')) {
    pass('Legacy alias Deprecation/Sunset/Link headers', `deprecation=${deprecation}`)
  } else fail('Legacy alias Deprecation/Sunset/Link headers', `dep=${deprecation} sunset=${sunset}`)

  const openapi = await fetchJson('/openapi.json')
  const paths = openapi.json?.paths || {}
  if (paths['/api/public/v1/health'] && paths['/api/public/v1/testimonials']) pass('OpenAPI documents v1 paths')
  else fail('OpenAPI documents v1 paths')
  if (paths['/api/public/testimonials']?.get?.deprecated === true) pass('OpenAPI marks legacy testimonials deprecated')
  else fail('OpenAPI marks legacy testimonials deprecated')

  const opIds = new Set()
  let dup = false
  for (const methods of Object.values(paths)) {
    for (const op of Object.values(methods || {})) {
      if (op?.operationId) {
        if (opIds.has(op.operationId)) dup = true
        opIds.add(op.operationId)
      }
    }
  }
  if (!dup && opIds.size >= 40) pass('OpenAPI unique operationIds incl. v1', `${opIds.size}`)
  else fail('OpenAPI unique operationIds incl. v1', `count=${opIds.size} dup=${dup}`)

  // Trigger 429 using an isolated test IP so other checks are unaffected
  let saw429 = false
  for (let i = 0; i < PUBLIC_GET_RATE_LIMIT_MAX + 5; i++) {
    const probe = await fetch(`${BASE}/api/public/v1/seo-page?path=/erp&_t=${i}`, {
      headers: { 'X-Forwarded-For': '203.0.113.99' },
    })
    const text = await probe.text()
    let json = null
    try {
      json = JSON.parse(text)
    } catch {
      json = null
    }
    if (probe.status === 429) {
      saw429 = true
      const retryAfter = probe.headers.get('retry-after')
      if (json?.error?.code === 'RATE_LIMITED' && retryAfter) {
        pass('HTTP 429 structured JSON with Retry-After', `retry-after=${retryAfter}`)
      } else fail('HTTP 429 structured JSON with Retry-After', text.slice(0, 120))
      break
    }
  }
  if (!saw429) fail('HTTP 429 observed after burst GET requests')

  const locale = await fetch(`${BASE}/sa/en`, {
    headers: { Accept: 'text/html', 'X-Forwarded-For': '203.0.113.88' },
  })
  if (locale.status === 404) pass('Legacy GCC locale /sa/en returns HTTP 404')
  else fail('Legacy GCC locale /sa/en returns HTTP 404', String(locale.status))

  const failed = results.filter((r) => !r.ok)
  console.log(`\n${results.length - failed.length}/${results.length} passed`)
  if (failed.length) process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
