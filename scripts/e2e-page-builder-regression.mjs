/**
 * Functional regression: Page Builder + Section Builder (draft/publish/nav/sections).
 * Cleans up all test data before exit (success or failure).
 */
const BASE = process.env.E2E_BASE || 'http://127.0.0.1:3040'
const LOGIN_EMAIL = process.env.E2E_ADMIN_EMAIL || 'admin@admin.com'
const LOGIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD || 'Admin@123'

const testSlug = `regression-test-${Date.now()}`
let pageId = null
let sectionId = null
let auth = null
let publishedHeroTitleBefore = ''

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
    /* */
  }
  return { status: res.status, text, json }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg)
}

async function login() {
  const r = await req('/api/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: LOGIN_EMAIL, password: LOGIN_PASSWORD }),
  })
  assert(r.status === 200 && r.json?.token, `login failed: ${r.text}`)
  auth = { Authorization: `Bearer ${r.json.token}` }
}

async function cleanup() {
  if (!auth || !pageId) return
  try {
    await req(`/api/admin/pages/${pageId}`, { method: 'DELETE', headers: auth })
  } catch {
    /* */
  }
  pageId = null
}

async function main() {
  console.log('=== Page Builder Regression ===\n')

  // Health
  const home = await req('/')
  assert(home.status === 200 && /doctype/i.test(home.text), 'SPA root loads')

  await login()

  // --- Test 1 & 2: Draft save + publish single field (homepage hero) ---
  const homePub = await req('/api/homepage')
  assert(homePub.status === 200, 'GET /api/homepage')
  publishedHeroTitleBefore = homePub.json?.hero?.title?.en || homePub.json?.hero?.titleBefore?.en || ''

  const draftMarker = `REGRESSION-DRAFT-${Date.now()}`
  const heroDraft = await req('/api/admin/data/hero', { headers: auth })
  assert(heroDraft.status === 200, 'read hero draft')
  await req('/api/admin/data/hero', {
    method: 'PUT',
    headers: auth,
    body: JSON.stringify({ ...heroDraft.json, title: { en: draftMarker, ar: draftMarker } }),
  })
  const afterDraft = await req('/api/homepage')
  const pubTitle = afterDraft.json?.hero?.title?.en || afterDraft.json?.hero?.titleBefore?.en || ''
  assert(pubTitle !== draftMarker, 'Test 1 FAIL: public changed after draft save')
  console.log('PASS 1: Save Draft does not change public website')

  await req('/api/admin/publish/hero', { method: 'POST', headers: auth, body: '{}' })
  const afterPub = await req('/api/homepage')
  const pubTitle2 = afterPub.json?.hero?.title?.en || afterPub.json?.hero?.titleBefore?.en || ''
  assert(pubTitle2 === draftMarker || afterPub.json?.hero?.title?.en === draftMarker, 'Test 2 FAIL: publish did not update hero')
  console.log('PASS 2: Publish updates only the published hero field')

  // Restore hero
  const restoreHero = {
    ...heroDraft.json,
    title: heroDraft.json?.title || { en: publishedHeroTitleBefore, ar: '' },
  }
  if (publishedHeroTitleBefore) {
    restoreHero.title = { en: publishedHeroTitleBefore, ar: heroDraft.json?.title?.ar || '' }
  }
  await req('/api/admin/data/hero', { method: 'PUT', headers: auth, body: JSON.stringify(restoreHero) })
  await req('/api/admin/publish/hero', { method: 'POST', headers: auth, body: '{}' })

  // --- Test 3 & 4: Create page with nav, draft not public ---
  const create = await req('/api/admin/pages', {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({
      slug: testSlug,
      template: 'blank',
      title: { en: 'Regression Test Page', ar: 'اختبار' },
      heading: { en: 'Regression Test', ar: 'اختبار' },
      content: { en: 'Draft-only body marker', ar: '' },
      pageType: 'custom',
      language: 'both',
      headerNav: {
        enabled: true,
        label: { en: 'RegTest Nav', ar: 'اختبار' },
        sortOrder: 88,
        showDesktop: true,
        showMobile: true,
      },
      footerNav: {
        enabled: true,
        label: { en: 'RegTest Footer', ar: 'اختبار' },
        column: 'company',
        sortOrder: 88,
      },
      status: 'draft',
    }),
  })
  assert(create.status === 201 && create.json?.page?.id, `create page: ${create.text}`)
  pageId = create.json.page.id
  console.log('PASS 3: Created page with Header + Footer nav enabled')

  const draftPublic = await req(`/api/public/pages/${testSlug}`)
  assert(draftPublic.status === 404, 'Test 4 FAIL: draft page is public')
  const navDraft = await req('/api/public/navigation')
  const headerDraft = (navDraft.json?.headerLinks || []).some((l) => l.href === `/${testSlug}`)
  const footerDraft = (navDraft.json?.footerColumns?.company || []).some((l) => l.href === `/${testSlug}`)
  assert(!headerDraft && !footerDraft, 'Test 4 FAIL: draft page in navigation')
  console.log('PASS 4: Draft page not public and not in navigation')

  // --- Test 5: Publish page, URL + nav ---
  const publishPage = await req(`/api/admin/pages/${pageId}`, {
    method: 'PUT',
    headers: auth,
    body: JSON.stringify({
      ...create.json.page,
      action: 'publish',
      content: { en: 'Published regression body', ar: '' },
    }),
  })
  assert(publishPage.status === 200, `publish page: ${publishPage.text}`)

  const live = await req(`/api/public/pages/${testSlug}`)
  assert(live.status === 200 && live.json?.page?.slug === testSlug, 'Test 5 FAIL: published page not at slug')
  const spa = await req(`/${testSlug}`)
  assert(spa.status === 200 && /doctype/i.test(spa.text), 'SPA fallback for slug')

  const navPub = await req('/api/public/navigation')
  assert(
    (navPub.json?.headerLinks || []).some((l) => l.href === `/${testSlug}`),
    'Test 5 FAIL: not in header',
  )
  assert(
    (navPub.json?.footerColumns?.company || []).some((l) => l.href === `/${testSlug}`),
    'Test 5 FAIL: not in footer',
  )
  console.log('PASS 5: Published URL, Header link and Footer link appear')

  // --- Test 6 & 7 & 8: Add section, edit, publish, verify public ---
  const addSec = await req(`/api/admin/pages/${pageId}/sections`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({ type: 'richText' }),
  })
  assert(addSec.status === 201 && addSec.json?.section?.id, `add section: ${addSec.text}`)
  sectionId = addSec.json.section.id
  console.log('PASS 6: Added new section to page')

  const sectionMarker = `SECTION-MARKER-${Date.now()}`
  const patchSec = await req(`/api/admin/pages/${pageId}/sections/${sectionId}`, {
    method: 'PATCH',
    headers: auth,
    body: JSON.stringify({
      content: {
        heading: { en: sectionMarker, ar: sectionMarker },
        body: { en: 'Regression section body text', ar: '' },
      },
    }),
  })
  assert(patchSec.status === 200, `patch section: ${patchSec.text}`)

  // Save draft first — public should still lack section content
  await req(`/api/admin/pages/${pageId}`, {
    method: 'PUT',
    headers: auth,
    body: JSON.stringify({ ...patchSec.json.page }),
  })
  const pubBeforeSecPub = await req(`/api/public/pages/${testSlug}`)
  const secsBefore = pubBeforeSecPub.json?.page?.sections || []
  const hasMarkerBefore = secsBefore.some((s) => JSON.stringify(s.content || {}).includes(sectionMarker))
  // If page had no sections before publish, draft sections shouldn't be public
  if (secsBefore.length > 0) {
    assert(!hasMarkerBefore, 'section draft leaked to public before page publish')
  }

  const pubWithSec = await req(`/api/admin/pages/${pageId}`, {
    method: 'PUT',
    headers: auth,
    body: JSON.stringify({ ...patchSec.json.page, action: 'publish' }),
  })
  assert(pubWithSec.status === 200, `publish with section: ${pubWithSec.text}`)

  const pubAfterSec = await req(`/api/public/pages/${testSlug}`)
  const pubSections = pubAfterSec.json?.page?.sections || []
  const found = pubSections.find((s) => s.id === sectionId)
  assert(found, 'Test 8 FAIL: section not in public page')
  assert(
    JSON.stringify(found.content || {}).includes(sectionMarker),
    'Test 8 FAIL: section content not public',
  )
  console.log('PASS 7-8: Section edited and appears publicly after publish')

  // --- Test 9: Hide, reorder, delete without affecting other sections ---
  const addSec2 = await req(`/api/admin/pages/${pageId}/sections`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({ type: 'cta' }),
  })
  assert(addSec2.status === 201, 'add second section')
  const sectionId2 = addSec2.json.section.id

  // Hide first section
  await req(`/api/admin/pages/${pageId}/sections/${sectionId}`, {
    method: 'PATCH',
    headers: auth,
    body: JSON.stringify({ visible: false }),
  })

  // Reorder: cta first, richText second
  await req(`/api/admin/pages/${pageId}/sections/reorder`, {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({ order: [sectionId2, sectionId] }),
  })

  const pageAfterReorder = await req(`/api/admin/pages/${pageId}`, { headers: auth })
  const secs = (pageAfterReorder.json?.page?.sections || []).sort((a, b) => a.order - b.order)
  assert(secs[0]?.id === sectionId2, 'reorder failed')
  assert(secs.find((s) => s.id === sectionId)?.visible === false, 'hide failed')

  // Publish and verify hidden section not public
  await req(`/api/admin/pages/${pageId}`, {
    method: 'PUT',
    headers: auth,
    body: JSON.stringify({ ...pageAfterReorder.json.page, action: 'publish' }),
  })
  const pubHidden = await req(`/api/public/pages/${testSlug}`)
  const visibleIds = (pubHidden.json?.page?.sections || []).map((s) => s.id)
  assert(!visibleIds.includes(sectionId), 'hidden section still public')
  assert(visibleIds.includes(sectionId2), 'other section removed incorrectly')

  // Delete first section
  await req(`/api/admin/pages/${pageId}/sections/${sectionId}`, { method: 'DELETE', headers: auth })
  const afterDel = await req(`/api/admin/pages/${pageId}`, { headers: auth })
  assert(!afterDel.json?.page?.sections?.some((s) => s.id === sectionId), 'delete section failed')
  assert(afterDel.json?.page?.sections?.some((s) => s.id === sectionId2), 'delete affected other section')
  console.log('PASS 9: Hide, reorder, delete section without affecting others')

  // --- Test 10: Delete page, no orphan nav ---
  const del = await req(`/api/admin/pages/${pageId}`, { method: 'DELETE', headers: auth })
  assert(del.status === 200, `delete page: ${del.text}`)
  pageId = null

  assert((await req(`/api/public/pages/${testSlug}`)).status === 404, 'page still public after delete')
  const navFinal = await req('/api/public/navigation')
  assert(
    !(navFinal.json?.headerLinks || []).some((l) => l.href === `/${testSlug}`),
    'orphan header link',
  )
  assert(
    !(navFinal.json?.footerColumns?.company || []).some((l) => l.href === `/${testSlug}`),
    'orphan footer link',
  )
  console.log('PASS 10: Page deleted, no orphan navigation links')

  console.log('\n=== ALL REGRESSION TESTS PASSED ===')
}

main()
  .catch(async (e) => {
    console.error('\nREGRESSION FAILED:', e.message)
    await cleanup()
    process.exit(1)
  })
  .then(async () => {
    await cleanup()
  })
