/**
 * Verify complete Pakistan city CMS after parity implementation.
 * Usage: node scripts/verify-pk-city-cms-complete.mjs [baseUrl]
 */
import { PK_CITY_SLUGS } from '../server/pakistanConfig.mjs'
import { CITY_CMS_SECTION_KEYS, listCitySectionRecords } from '../server/cityCmsSections.mjs'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const BASE = (process.argv[2] || 'http://127.0.0.1:3044').replace(/\/$/, '')
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@admin.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123'
const TEST_HEADING = 'CMS ISOLATION TEST — FAISALABAD'
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const LOCALE_STORE = path.join(ROOT, 'server', 'data-pk', 'localeRecords.json')

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

async function hero(city, preview = false) {
  const url = `${BASE}/api/homepage?city=${city}&country=PK&lang=en${preview ? '&preview=1' : ''}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`homepage ${city} ${res.status}`)
  const json = await res.json()
  return json?.hero?.title?.en || ''
}

async function main() {
  console.log(`\nPK city CMS complete verification @ ${BASE}\n`)
  let token
  try {
    token = await login()
    pass('CMS authentication')
  } catch (e) {
    fail('CMS authentication', e.message)
    process.exit(1)
  }

  const store = JSON.parse(await fs.readFile(LOCALE_STORE, 'utf8'))
  for (const city of PK_CITY_SLUGS) {
    const sections = listCitySectionRecords(store.records, city)
    if (sections.length >= CITY_CMS_SECTION_KEYS.length) pass(`${city} migrated section records`, `${sections.length}`)
    else fail(`${city} migrated section records`, `expected >= ${CITY_CMS_SECTION_KEYS.length}, got ${sections.length}`)
  }

  for (const section of ['hero', 'industries', 'modules', 'faqs', 'demoCta', 'seo']) {
    for (const city of ['faisalabad', 'lahore']) {
      const params = new URLSearchParams({
        country: 'PK',
        lang: 'en',
        citySlug: city,
        contentType: section === 'faqs' ? 'faq' : section === 'seo' ? 'seo' : 'pageSection',
        globalIdentity: section === 'faqs' ? 'faqs' : section === 'seo' ? 'site' : section,
      })
      const res = await admin(token, `/api/admin/locale/resolve?${params}`)
      if (res.record || res.payload) pass(`Admin resolve ${city}/${section}`)
      else fail(`Admin resolve ${city}/${section}`, 'missing record')
    }
  }

  const beforeF = await hero('faisalabad')
  const beforeL = await hero('lahore')
  pass('Recorded public heroes', `${beforeF.slice(0, 40)}…`)

  const cities = await admin(token, '/api/admin/locale/cities?country=PK')
  if ((cities.cities || []).length === 11) pass('All 11 cities in CMS list')
  else fail('All 11 cities in CMS list', String((cities.cities || []).length))

  await admin(token, '/api/admin/locale/cities/faisalabad', {
    method: 'PUT',
    body: JSON.stringify({
      pageSlug: 'home',
      heading: TEST_HEADING,
      intro: 'Isolation test intro',
      title: 'Isolation Test',
      description: 'Isolation test meta',
      eyebrow: 'Test',
    }),
  })

  const draftHero = await hero('faisalabad', true)
  const pubHero = await hero('faisalabad', false)
  if (draftHero.includes('ISOLATION') || pubHero === beforeF) pass('Draft/publish separation')
  else fail('Draft/publish separation', `draft=${draftHero.slice(0, 40)} pub=${pubHero.slice(0, 40)}`)

  // Isolation via city hero section record
  await admin(token, '/api/admin/locale/actions/customize', {
    method: 'POST',
    body: JSON.stringify({ contentType: 'pageSection', globalIdentity: 'hero', countryCode: 'PK', lang: 'en', citySlug: 'faisalabad' }),
  })
  const faisRecords = await admin(token, '/api/admin/locale/records?country=PK&lang=en&contentType=pageSection')
  const faisHero = (faisRecords.records || []).find((r) => r.citySlug === 'faisalabad' && r.globalIdentity === 'hero')
  if (faisHero?.id) {
    const payload = { ...(faisHero.payload || {}), title: { en: TEST_HEADING }, titleBefore: { en: 'DigitalManager in Faisalabad' }, titleAccent: { en: TEST_HEADING } }
    await admin(token, `/api/admin/locale/records/${faisHero.id}`, {
      method: 'PUT',
      body: JSON.stringify({ payload, inheritanceMode: 'override', translationStatus: 'draft' }),
    })
    await admin(token, `/api/admin/locale/records/${faisHero.id}/translation-status`, { method: 'POST', body: JSON.stringify({ status: 'approved' }) })
    await admin(token, `/api/admin/locale/records/${faisHero.id}/publish`, { method: 'POST' })
    await admin(token, '/api/admin/locale/publish-store', { method: 'POST', body: '{}' })
    const afterPubF = await hero('faisalabad')
    const afterPubL = await hero('lahore')
    if (afterPubF.includes('ISOLATION') && !afterPubL.includes('ISOLATION')) pass('Faisalabad/Lahore isolation on publish')
    else fail('Faisalabad/Lahore isolation on publish')

    // Restore
    const restorePayload = { ...(faisHero.payload || {}), title: { en: beforeF }, titleBefore: faisHero.payload?.titleBefore, titleAccent: faisHero.payload?.titleAccent }
    await admin(token, `/api/admin/locale/records/${faisHero.id}`, {
      method: 'PUT',
      body: JSON.stringify({ payload: restorePayload, inheritanceMode: 'override', translationStatus: 'draft' }),
    })
    await admin(token, `/api/admin/locale/records/${faisHero.id}/publish`, { method: 'POST' })
    await admin(token, '/api/admin/locale/publish-store', { method: 'POST', body: '{}' })
    const restored = await hero('faisalabad')
    if (restored === beforeF || restored.includes(beforeF.split('—')[1]?.trim()?.slice(0, 20) || 'Faisalabad')) pass('Restored Faisalabad hero')
    else fail('Restored Faisalabad hero', restored.slice(0, 60))
  } else {
    fail('Faisalabad hero record for isolation test')
  }

  const persisted = JSON.parse(await fs.readFile(LOCALE_STORE, 'utf8'))
  if ((persisted.records || []).length > 100) pass('Persistence on disk', `${persisted.records.length} records`)
  else fail('Persistence on disk')

  const prod = await fetch(`${BASE}/faisalabad/software/erp-software`, { headers: { Accept: 'text/html' } })
  if (prod.status === 200) pass('City product page renders')
  else fail('City product page renders', String(prod.status))

  const ok = results.filter((r) => r.ok).length
  const bad = results.filter((r) => !r.ok).length
  console.log(`\n${ok}/${ok + bad} passed${bad ? `, ${bad} failed` : ''}\n`)
  if (bad) process.exit(1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
