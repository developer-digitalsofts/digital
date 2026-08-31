/**
 * Reversible Faisalabad/Lahore CMS isolation test (city-scoped hero section records).
 * Usage: node scripts/verify-pk-city-cms-isolation.mjs [baseUrl]
 */
const BASE = (process.argv[2] || process.env.API_URL || 'http://127.0.0.1:3043').replace(/\/$/, '')
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@admin.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123'
const TEST_HEADING = 'CMS ISOLATION TEST — FAISALABAD'

const results = []
function pass(name, detail = '') {
  results.push({ ok: true, name, detail })
  console.log(`✓ ${name}${detail ? ` — ${detail}` : ''}`)
}
function fail(name, detail = '') {
  results.push({ ok: false, name, detail })
  console.error(`✗ ${name}${detail ? ` — ${detail}` : ''}`)
}

async function login() {
  const res = await fetch(`${BASE}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })
  if (!res.ok) throw new Error(`Login failed: ${res.status}`)
  return (await res.json()).token
}

async function admin(token, path, init = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(init.headers || {}) },
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.error || `${path} ${res.status}`)
  return json
}

async function publicHero(city) {
  const res = await fetch(`${BASE}/api/homepage?city=${city}&country=PK&lang=en`)
  if (!res.ok) throw new Error(`homepage ${city} ${res.status}`)
  const json = await res.json()
  return json?.hero?.title?.en || ''
}

async function heroRecord(token, city) {
  const params = new URLSearchParams({
    country: 'PK',
    lang: 'en',
    citySlug: city,
    contentType: 'pageSection',
    globalIdentity: 'hero',
  })
  const res = await admin(token, `/api/admin/locale/resolve?${params}`)
  return res.record
}

async function ensureHeroRecord(token, city) {
  let record = await heroRecord(token, city)
  if (!record?.id) {
    const created = await admin(token, '/api/admin/locale/actions/customize', {
      method: 'POST',
      body: JSON.stringify({ contentType: 'pageSection', globalIdentity: 'hero', countryCode: 'PK', lang: 'en', citySlug: city }),
    })
    record = created.record
  }
  return record
}

async function saveHeroHeading(token, city, titleEn, publish = false) {
  const record = await ensureHeroRecord(token, city)
  const payload = {
    ...(record.payload || {}),
    title: { en: titleEn, ar: titleEn },
    titleBefore: { en: `DigitalManager in ${city[0].toUpperCase()}${city.slice(1)}`, ar: '' },
    titleAccent: { en: titleEn, ar: titleEn },
    useStructuredTitle: true,
  }
  await admin(token, `/api/admin/locale/records/${record.id}`, {
    method: 'PUT',
    body: JSON.stringify({ payload, inheritanceMode: 'override', translationStatus: 'draft' }),
  })
  if (publish) {
    await admin(token, `/api/admin/locale/records/${record.id}/translation-status`, { method: 'POST', body: JSON.stringify({ status: 'approved' }) })
    await admin(token, `/api/admin/locale/records/${record.id}/publish`, { method: 'POST' })
    await admin(token, '/api/admin/locale/publish-store', { method: 'POST', body: '{}' })
  }
}

async function main() {
  console.log(`\nPK city CMS isolation test @ ${BASE}\n`)
  const token = await login()
  pass('Admin authentication')

  const pubFais0 = await publicHero('faisalabad')
  const pubLah0 = await publicHero('lahore')
  pass('Public Faisalabad hero before test', pubFais0)
  pass('Public Lahore hero before test', pubLah0)

  await saveHeroHeading(token, 'faisalabad', TEST_HEADING, false)
  pass('Saved Faisalabad draft test heading (unpublished)')

  const pubFaisDraft = await publicHero('faisalabad')
  if (pubFaisDraft === pubFais0) pass('Draft change did NOT affect public Faisalabad')
  else fail('Draft leaked to public Faisalabad', pubFaisDraft)
  if ((await publicHero('lahore')) === pubLah0) pass('Draft change did NOT affect public Lahore')
  else fail('Draft leaked to public Lahore')

  await saveHeroHeading(token, 'faisalabad', TEST_HEADING, true)
  pass('Published Faisalabad test heading')

  const pubFais1 = await publicHero('faisalabad')
  if (pubFais1.includes('CMS ISOLATION TEST')) pass('Published Faisalabad shows test heading', pubFais1)
  else fail('Published Faisalabad missing test heading', pubFais1)

  const pubLah1 = await publicHero('lahore')
  if (!pubLah1.includes('CMS ISOLATION TEST')) pass('Lahore unchanged after Faisalabad publish', pubLah1)
  else fail('Lahore contaminated by Faisalabad test')

  for (const city of ['karachi', 'islamabad', 'multan']) {
    const h = await publicHero(city)
    if (!h.includes('CMS ISOLATION TEST')) pass(`${city} unchanged`)
    else fail(`${city} contaminated`, h)
  }

  await saveHeroHeading(token, 'faisalabad', pubFais0, true)
  pass('Restored and published original Faisalabad heading')

  if ((await publicHero('faisalabad')) === pubFais0) pass('Faisalabad restored to original public hero')
  else fail('Faisalabad restore mismatch')
  if ((await publicHero('lahore')) === pubLah0) pass('Lahore still original after restore')
  else fail('Lahore changed after restore')

  const bad = results.filter((r) => !r.ok)
  console.log(`\n${results.length - bad.length}/${results.length} passed`)
  if (bad.length) process.exit(1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
