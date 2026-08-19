/**
 * Step 1–2 diagnostic: save/publish hero slide pill and verify draft/published/API.
 */
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const MARKER = 'CMS_SYNC_TEST_2026_08_19'
const BASE = process.env.CMS_API_BASE || 'http://127.0.0.1:3040'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA = path.join(__dirname, '..', 'server', 'data')

async function req(urlPath, init = {}) {
  const url = `${BASE}${urlPath}`
  const res = await fetch(url, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
  })
  const text = await res.text()
  let json = null
  try {
    json = JSON.parse(text)
  } catch {
    /* */
  }
  return { url, status: res.status, ct: res.headers.get('content-type') || '', text, json }
}

async function readJson(rel) {
  const raw = await fs.readFile(path.join(DATA, rel), 'utf8')
  return JSON.parse(raw)
}

async function main() {
  console.log('=== STEP 1: SAVE AND PUBLISH TEST ===\n')

  const login = await req('/api/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'admin@admin.com', password: 'Admin@123' }),
  })
  if (!login.json?.token) {
    throw new Error(`Login failed: ${login.status} ${login.text.slice(0, 200)}`)
  }
  const auth = { Authorization: `Bearer ${login.json.token}` }

  const heroGet = await req('/api/admin/data/hero', { headers: auth })
  if (!heroGet.json) throw new Error('Could not read hero draft via admin API')

  const original = structuredClone(heroGet.json)
  const slides = [...(heroGet.json.slides || [])]
  if (!slides.length) throw new Error('Hero has no slides')
  slides[0] = {
    ...slides[0],
    pill: { en: MARKER, ar: MARKER },
  }

  const heroBody = { ...heroGet.json, slides }
  const save = await req('/api/admin/data/hero', {
    method: 'PUT',
    headers: auth,
    body: JSON.stringify(heroBody),
  })
  console.log('Save Draft:', save.status, save.json?.ok ?? save.json)

  const publish = await req('/api/admin/publish/hero', {
    method: 'POST',
    headers: auth,
    body: '{}',
  })
  console.log('Publish hero:', publish.status, publish.json?.ok ?? publish.json?.success)

  const draftFile = await readJson('hero.json')
  const publishedFile = await readJson('published/hero.json')

  const draftPill = draftFile.slides?.[0]?.pill?.en
  const publishedPill = publishedFile.slides?.[0]?.pill?.en
  const draftTopPill = draftFile.pill?.en

  console.log('\n--- Storage inspection ---')
  console.log('Draft path:', path.join(DATA, 'hero.json'))
  console.log('Published path:', path.join(DATA, 'published/hero.json'))
  console.log('Draft slides[0].pill.en:', draftPill)
  console.log('Published slides[0].pill.en:', publishedPill)
  console.log('Draft top-level pill.en (legacy, not rendered when carousel active):', draftTopPill ?? '(none)')

  console.log('\n=== STEP 2: PUBLIC API ===\n')
  const api = await req(`/api/homepage?v=${Date.now()}`)
  console.log('Request URL:', api.url)
  console.log('HTTP status:', api.status)
  console.log('Content-Type:', api.ct)
  console.log('meta:', JSON.stringify(api.json?.meta, null, 2))
  console.log('hero.slides[0].pill.en:', api.json?.hero?.slides?.[0]?.pill?.en)
  console.log('hero.pill.en (legacy):', api.json?.hero?.pill?.en)

  const apiHas = api.json?.hero?.slides?.[0]?.pill?.en === MARKER
  const draftHas = draftPill === MARKER
  const pubHas = publishedPill === MARKER

  console.log('\n=== OUTCOME ===')
  console.log('Draft contains marker:', draftHas)
  console.log('Published file contains marker:', pubHas)
  console.log('Public API contains marker:', apiHas)

  if (!draftHas) console.log('→ Outcome A partial: draft save failed')
  else if (!pubHas) console.log('→ Outcome A: Published storage missing value — fix Save/Publish')
  else if (!apiHas) console.log('→ Outcome B: Published has it but API does not — fix API/cache')
  else console.log('→ Outcome C candidate: API has it — check frontend mapping/cache')

  // Restore
  await req('/api/admin/data/hero', {
    method: 'PUT',
    headers: auth,
    body: JSON.stringify(original),
  })
  await req('/api/admin/publish/hero', { method: 'POST', headers: auth, body: '{}' })
  console.log('\nRestored original hero content.')
}

main().catch((e) => {
  console.error('DIAG FAILED:', e.message)
  process.exit(1)
})
