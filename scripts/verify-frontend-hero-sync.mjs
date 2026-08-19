/**
 * Verify published API slide.pill reaches frontend mapping logic.
 */
const MARKER = 'CMS_SYNC_TEST_2026_08_19'
const BASE = process.env.CMS_API_BASE || 'http://127.0.0.1:3040'
const DEFAULT_PILL = 'ONE PLATFORM. COMPLETE CONTROL.'

function resolveLikeFrontend(hero, cmsLoaded) {
  if (!hero) return cmsLoaded ? [] : [{ pill: { en: DEFAULT_PILL } }]
  const raw = hero.slides
  if (Array.isArray(raw) && raw.length > 0) {
    const filtered = raw.filter((s) => s && s.visible !== false).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    if (filtered.length > 0) return filtered
  }
  return cmsLoaded ? [] : [{ pill: { en: DEFAULT_PILL } }]
}

async function main() {
  const login = await fetch(`${BASE}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@admin.com', password: 'Admin@123' }),
  }).then((r) => r.json())

  const auth = { Authorization: `Bearer ${login.token}`, 'Content-Type': 'application/json' }
  const heroDraft = await fetch(`${BASE}/api/admin/data/hero`, { headers: auth }).then((r) => r.json())
  const original = structuredClone(heroDraft)
  const slides = [...(heroDraft.slides || [])]
  slides[0] = { ...slides[0], pill: { en: MARKER, ar: MARKER } }

  await fetch(`${BASE}/api/admin/data/hero`, { method: 'PUT', headers: auth, body: JSON.stringify({ ...heroDraft, slides }) })
  await fetch(`${BASE}/api/admin/publish/hero`, { method: 'POST', headers: auth, body: '{}' })

  const api = await fetch(`${BASE}/api/homepage?v=${Date.now()}`, {
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  }).then((r) => r.json())

  const beforeFix = resolveLikeFrontend(undefined, false)[0]?.pill?.en
  const afterFix = resolveLikeFrontend(api.hero, true)[0]?.pill?.en

  console.log('API slides[0].pill.en:', api.hero?.slides?.[0]?.pill?.en)
  console.log('When API missing (old bug):', beforeFix)
  console.log('When API loaded (fixed):', afterFix)

  if (api.hero?.slides?.[0]?.pill?.en !== MARKER) throw new Error('API missing marker after publish')
  if (afterFix !== MARKER) throw new Error('Frontend mapping would not render marker')

  await fetch(`${BASE}/api/admin/data/hero`, { method: 'PUT', headers: auth, body: JSON.stringify(original) })
  await fetch(`${BASE}/api/admin/publish/hero`, { method: 'POST', headers: auth, body: '{}' })
  console.log('OK')
}

main().catch((e) => {
  console.error('FAILED:', e.message)
  process.exit(1)
})
