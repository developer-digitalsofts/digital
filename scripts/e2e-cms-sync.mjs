/**
 * Verify CMS save vs publish sync on public /api/homepage
 */
const BASE = process.env.CMS_API_BASE || 'http://127.0.0.1:3040'
const MARKER = process.env.CMS_SYNC_MARKER || 'CMS_SYNC_TEST_2026'

async function req(path, init = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
  })
  const text = await res.text()
  let json = null
  try {
    json = JSON.parse(text)
  } catch {
    /* html */
  }
  return { status: res.status, text, json, ct: res.headers.get('content-type') || '' }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg)
}

async function main() {
  const homeApi = await req('/api/homepage')
  assert(homeApi.status === 200, `GET /api/homepage failed: ${homeApi.status}`)
  assert(homeApi.ct.includes('json'), `Expected JSON, got ${homeApi.ct}`)
  assert(!/<html/i.test(homeApi.text), 'API must not return HTML')
  assert(homeApi.json?.meta?.status === 'published', 'homepage meta.status must be published')

  const login = await req('/api/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'admin@admin.com', password: 'Admin@123' }),
  })
  assert(login.status === 200 && login.json?.token, `login failed: ${login.text}`)
  const auth = { Authorization: `Bearer ${login.json.token}` }

  const draft = await req('/api/admin/data/demoCta', { headers: auth })
  assert(draft.status === 200, 'read demoCta draft')
  const original = draft.json

  const saveDraft = await req('/api/admin/data/demoCta', {
    method: 'PUT',
    headers: auth,
    body: JSON.stringify({ ...original, title: { en: MARKER, ar: MARKER } }),
  })
  assert(saveDraft.status === 200, `save draft failed: ${saveDraft.text}`)

  const publicAfterDraft = await req(`/api/homepage?v=${Date.now()}`)
  assert(
    publicAfterDraft.json?.demoCta?.title?.en !== MARKER,
    'public API must not expose draft-only demoCta title',
  )

  const pub = await req('/api/admin/publish/demoCta', { method: 'POST', headers: auth, body: '{}' })
  assert(pub.status === 200 && pub.json?.data?.published?.title?.en === MARKER, `publish response missing published data: ${pub.text}`)

  const publicAfterPub = await req(`/api/homepage?v=${Date.now()}`)
  assert(publicAfterPub.json?.demoCta?.title?.en === MARKER, 'public API must show published demoCta title')

  await req('/api/admin/data/demoCta', { method: 'PUT', headers: auth, body: JSON.stringify(original) })
  await req('/api/admin/publish/demoCta', { method: 'POST', headers: auth, body: '{}' })

  console.log('CMS sync checks passed')
}

main().catch((e) => {
  console.error('CMS sync FAILED:', e.message)
  process.exit(1)
})
