/**
 * Phase 2 verification: GCC setup, draft/published separation, test routes, inheritance.
 * Test draft routes use temporary fixtures (backup/restore) — never persistent production data.
 * Usage: node scripts/verify-locale-phase.mjs
 */
import { readFile } from 'node:fs/promises'
import { withDraftTestFixtures, purgeLeakedTestRecords } from './lib/locale-test-session.mjs'

const API = process.env.API_URL || 'http://127.0.0.1:3040'
const WEB = process.env.BASE_URL || 'http://127.0.0.1:5280'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@admin.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123'
const LOCALE_STORE = 'server/data/localeRecords.json'
const PUBLISHED_STORE = 'server/data/published/localeRecords.json'

const GCC_COUNTRIES = ['AE', 'SA', 'QA', 'OM', 'KW', 'BH']
const SETUP_COUNTRIES = ['SA', 'KW', 'OM', 'BH']

const TEST_ROUTES = [
  { label: 'QA ERP en', public: '/api/public/locale-content/erp?country=QA&lang=en', admin: { contentType: 'solution', globalIdentity: 'erp', slug: 'erp', countryCode: 'QA', lang: 'en' }, marker: '[TEST QA]' },
  { label: 'SA ERP ar', public: '/api/public/locale-content/erp?country=SA&lang=ar', admin: { contentType: 'solution', globalIdentity: 'erp', slug: 'erp', countryCode: 'SA', lang: 'ar' }, marker: '[اختبار]' },
  { label: 'OM industry en', public: '/api/public/locale-content/software/industry/retail-management-software?country=OM&lang=en', admin: { contentType: 'industry', globalIdentity: 'industry:retail-management-software', slug: 'retail-management-software', countryCode: 'OM', lang: 'en' }, marker: '[TEST OM]' },
  { label: 'KW module ar', public: '/api/public/locale-content/software/module/inventory-management-software?country=KW&lang=ar', admin: { contentType: 'solution', globalIdentity: 'module:inventory-management-software', slug: 'inventory-management-software', countryCode: 'KW', lang: 'ar' }, marker: '[اختبار]' },
  { label: 'BH contact en', public: '/api/public/locale-content/contact?country=BH&lang=en', admin: { contentType: 'contact', globalIdentity: 'contact', slug: 'contact', countryCode: 'BH', lang: 'en' }, marker: '[TEST BH]' },
]

const results = []

function pass(name, detail = '') {
  results.push({ name, ok: true, detail })
  console.log(`✓ ${name}${detail ? ` — ${detail}` : ''}`)
}

function fail(name, detail = '') {
  results.push({ name, ok: false, detail })
  console.error(`✗ ${name}${detail ? ` — ${detail}` : ''}`)
}

async function json(url, opts) {
  const res = await fetch(url, opts)
  const body = await res.json().catch(() => ({}))
  return { res, body }
}

async function adminToken() {
  const login = await json(`${API}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })
  return login.body?.token || null
}

async function verifyTestDraftRoutes(auth) {
  for (const route of TEST_ROUTES) {
    const pub = await json(`${API}${route.public}`)
    if (pub.res.status === 404 && (pub.body.missing || pub.body.error === 'not_found')) {
      pass(`${route.label} hidden from public API`)
    } else {
      fail(`${route.label} public leak`, `status ${pub.res.status}`)
    }

    const q = new URLSearchParams(route.admin)
    const admin = await json(`${API}/api/admin/locale/resolve?${q}`, { headers: auth })
    const heading = String(
      admin.body?.payload?.heading?.en ||
        admin.body?.payload?.heading?.ar ||
        admin.body?.payload?.heading ||
        admin.body?.publicView?.heading ||
        '',
    )
    if (admin.res.ok && String(heading).includes(route.marker)) {
      pass(`${route.label} resolves in admin preview`)
    } else {
      fail(`${route.label} admin preview`, heading ? String(heading).slice(0, 60) : 'no heading')
    }
  }

  const fixtureStore = await json(`${API}/api/admin/locale/records`, { headers: auth })
  const saTestAr = (fixtureStore.body?.records || []).find(
    (r) => r.id === 'loc_test_sa_erp_ar' || (r.globalIdentity === 'erp' && r.countryCode === 'SA' && r.languageCode === 'ar' && r.inheritanceMode === 'override'),
  )
  if (saTestAr?.id) {
    const saArPublish = await json(`${API}/api/admin/locale/records/${saTestAr.id}/publish`, { method: 'POST', headers: auth })
    if (saArPublish.res.status === 400) pass('Test SA Arabic draft blocked from publish (needs approved)')
    else fail('Test SA Arabic publish gate', String(saArPublish.res.status))
  } else {
    fail('Test SA Arabic publish gate', 'fixture override not found')
  }
}

async function main() {
  const store = JSON.parse(await readFile(LOCALE_STORE, 'utf8'))

  const token = await adminToken()
  if (!token) {
    fail('Admin auth', 'no token')
    process.exit(1)
  }
  const auth = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  // Country setup for SA/KW/OM/BH (idempotent — skips existing records)
  for (const countryCode of SETUP_COUNTRIES) {
    const setup = store.setupCompleted?.[countryCode]
    if (setup) {
      pass(`${countryCode} country setup completed`, setup.mode || '')
    } else {
      const res = await json(`${API}/api/admin/countries/setup`, {
        method: 'POST',
        headers: auth,
        body: JSON.stringify({ countryCode, languages: ['en', 'ar'], mode: 'structure_only' }),
      })
      if (res.res.ok || String(res.body?.error || '').includes('already set up')) {
        pass(`${countryCode} country setup completed`, res.body?.report?.mode || 'structure_only')
      } else {
        fail(`${countryCode} country setup`, res.body?.error || String(res.res.status))
      }
    }
  }

  const sync = await json(`${API}/api/admin/locale/publish-store`, { method: 'POST', headers: auth, body: '{}' })
  if (sync.res.ok) pass('Locale published snapshot synced')
  else fail('Locale published snapshot sync', sync.body?.error || String(sync.res.status))

  // UAE regression
  const uaeErp = await json(`${API}/api/public/locale-content/erp?country=AE&lang=en`)
  if (uaeErp.res.ok && uaeErp.body.page?.slug === 'erp') pass('UAE ERP public page resolves')
  else fail('UAE ERP public page resolves', String(uaeErp.res.status))

  const home = await fetch(`${WEB}/`)
  if (home.ok) pass('UAE homepage loads')
  else fail('UAE homepage loads')

  const erpPage = await fetch(`${WEB}/erp`)
  if (erpPage.ok) pass('/erp serves real locale page')
  else fail('/erp route', String(erpPage.status))

  const freshStore = JSON.parse(await readFile(LOCALE_STORE, 'utf8'))
  for (const code of GCC_COUNTRIES) {
    if (code === 'AE') continue
    const recs = (freshStore.records || []).filter((r) => r.countryCode === code)
    const allDraft = recs.every((r) => r.publicationStatus === 'draft' || r.publicationStatus === 'unpublished')
    if (recs.length > 0 && allDraft) pass(`${code} records remain draft (noindex)`)
    else fail(`${code} draft/noindex`, `${recs.length} records`)
  }

  // Draft/published separation
  let publishedExists = false
  try {
    await readFile(PUBLISHED_STORE, 'utf8')
    publishedExists = true
  } catch {
    publishedExists = false
  }
  if (publishedExists) pass('Published locale snapshot file exists')
  else fail('Published locale snapshot file', 'missing')

  const aeErpDraft = (freshStore.records || []).find((r) => r.globalIdentity === 'erp' && r.countryCode === 'AE' && r.languageCode === 'en')
  if (aeErpDraft?.publicationStatus === 'published') {
    const marker = `__draft_sep_${Date.now()}`
    const mutated = {
      ...aeErpDraft,
      payload: { ...(aeErpDraft.payload || {}), heading: { en: marker, ar: aeErpDraft.payload?.heading?.ar || '' } },
      updatedAt: new Date().toISOString(),
    }
    await json(`${API}/api/admin/locale/records/${aeErpDraft.id}`, {
      method: 'PUT',
      headers: auth,
      body: JSON.stringify(mutated),
    })
    const publicBeforeSync = await json(`${API}/api/public/locale-content/erp?country=AE&lang=en`)
    const pubHeading = publicBeforeSync.body?.page?.heading || ''
    if (publicBeforeSync.res.ok && !String(pubHeading).includes(marker)) {
      pass('Draft edit hidden from public before snapshot sync')
    } else {
      fail('Draft/published separation', `public heading leaked marker: ${pubHeading.slice(0, 40)}`)
    }
    await json(`${API}/api/admin/locale/records/${aeErpDraft.id}`, {
      method: 'PUT',
      headers: auth,
      body: JSON.stringify(aeErpDraft),
    })
    await json(`${API}/api/admin/locale/publish-store`, { method: 'POST', headers: auth, body: '{}' })
  } else {
    fail('Draft/published separation', 'AE ERP not published')
  }

  const publishStatus = await json(`${API}/api/admin/locale/publish-status`, { headers: auth })
  if (publishStatus.res.ok && publishStatus.body?.hasPublished != null) pass('Locale publish status API')
  else fail('Locale publish status API')

  // Real localized routes (not homepage scroll)
  const saErpPage = await fetch(`${WEB}/sa/ar/erp`)
  const saErpHtml = saErpPage.ok ? await saErpPage.text() : ''
  if (saErpPage.ok && !saErpHtml.includes('id="modules"')) pass('/sa/ar/erp is real page route (not homepage scroll)')
  else fail('/sa/ar/erp route', String(saErpPage.status))

  const qaFallback = await fetch(`${WEB}/qa/en/erp`)
  const fbHtml = qaFallback.ok ? await qaFallback.text() : ''
  if (qaFallback.ok && !fbHtml.includes('id="modules"')) pass('/qa/en/erp locale route shell (draft/missing)')
  else fail('/qa/en/erp web route', String(qaFallback.status))

  // Arabic publish gate (production data)
  const qaAr = (freshStore.records || []).find((r) => r.globalIdentity === 'erp' && r.countryCode === 'QA' && r.languageCode === 'ar')
  if (qaAr?.id) {
    const arPublish = await json(`${API}/api/admin/locale/records/${qaAr.id}/publish`, { method: 'POST', headers: auth })
    if (arPublish.res.status === 400) pass('Arabic cannot publish without Approved status')
    else fail('Arabic publish gate', String(arPublish.res.status))
  } else {
    fail('Arabic publish gate', 'no QA/ar ERP record')
  }

  // Temporary fixtures for admin-only test draft routes (never persisted) — before API mutations
  await withDraftTestFixtures(verifyTestDraftRoutes, auth)
  await purgeLeakedTestRecords(auth)
  await json(`${API}/api/admin/locale/publish-store`, { method: 'POST', headers: auth, body: '{}' })

  // Inheritance: customize, field reset preserves source
  const customize = await json(`${API}/api/admin/locale/actions/customize`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({ contentType: 'solution', globalIdentity: 'erp', countryCode: 'QA', lang: 'en', slug: 'erp' }),
  })
  const qaRecordId = customize.body?.record?.id
  if (customize.res.ok && qaRecordId) pass('Customize Qatar ERP English override')
  else fail('Customize Qatar ERP', customize.body?.error || String(customize.res.status))

  if (qaRecordId) {
    await json(`${API}/api/admin/locale/records/${qaRecordId}/copy-from`, {
      method: 'POST',
      headers: auth,
      body: JSON.stringify({ sourceCountry: 'AE', sourceLang: 'en', asDraft: true }),
    })

    const uaeBefore = JSON.parse(await readFile(LOCALE_STORE, 'utf8'))
    const uaeErpRec = uaeBefore.records.find((r) => r.globalIdentity === 'erp' && r.countryCode === 'AE' && r.languageCode === 'en')
    const uaeHeadingBefore = uaeErpRec?.payload?.heading?.en || uaeErpRec?.payload?.fields?.heading?.en

    await json(`${API}/api/admin/locale/records/${qaRecordId}/fields/heading/reset`, { method: 'POST', headers: auth })

    const afterReset = JSON.parse(await readFile(LOCALE_STORE, 'utf8'))
    const uaeAfterRec = afterReset.records.find((r) => r.globalIdentity === 'erp' && r.countryCode === 'AE' && r.languageCode === 'en')
    const uaeHeadingAfter = uaeAfterRec?.payload?.heading?.en || uaeAfterRec?.payload?.fields?.heading?.en
    if (uaeHeadingBefore && uaeHeadingBefore === uaeHeadingAfter) pass('Field reset never deletes UAE English source content')
    else fail('Field reset source safety', 'UAE heading changed')

    const reset = await json(`${API}/api/admin/locale/records/${qaRecordId}`, { method: 'DELETE', headers: auth })
    if (reset.res.ok) pass('Reset Qatar override to inherited')
    else fail('Reset override', reset.body?.error || String(reset.res.status))

    const uaeAfter = await json(`${API}/api/public/locale-content/erp?country=AE&lang=en`)
    if (uaeAfter.res.ok) pass('UAE global ERP intact after Qatar reset')
    else fail('UAE regression after reset')
  }

  const dupSetup = await json(`${API}/api/admin/countries/setup`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({ countryCode: 'QA', languages: ['en'], mode: 'structure_only' }),
  })
  if (dupSetup.res.status === 400) pass('Duplicate country setup prevented (rollback-safe)')
  else fail('Duplicate country setup guard', String(dupSetup.res.status))

  // Country matrix API
  const matrix = await json(`${API}/api/admin/locale/country-matrix`, { headers: auth })
  if (matrix.res.ok && Array.isArray(matrix.body?.matrix)) {
    pass('Country matrix API', `${matrix.body.matrix.length} countries`)
    for (const row of matrix.body.matrix) {
      const ok = row.countryCode === 'AE' || row.setupCompleted
      if (ok) pass(`Matrix ${row.countryCode} setup flag`, row.setupMode || (row.countryCode === 'AE' ? 'baseline' : ''))
      else fail(`Matrix ${row.countryCode} setup flag`, 'not completed')
    }
  } else {
    fail('Country matrix API')
  }

  if (store.records?.length > 0) pass('Locale migration baselines', `${store.records.length} records`)
  else fail('Locale migration', 'no records')

  const failed = results.filter((r) => !r.ok)
  console.log(`\n${results.length - failed.length}/${results.length} passed`)
  if (failed.length) process.exit(1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
