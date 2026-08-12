/**
 * E2E: draft vs publish for homepage + CMS page
 */
const BASE = 'http://127.0.0.1:3040'

async function req(path, init = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  })
  const text = await res.text()
  let json = null
  try {
    json = JSON.parse(text)
  } catch {
    /* html */
  }
  return { status: res.status, text, json }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg)
}

async function main() {
  // Public homepage loads (SPA + API)
  const homeHtml = await req('/')
  assert(homeHtml.status === 200 && /doctype/i.test(homeHtml.text), 'GET / should serve SPA')
  assert(!homeHtml.text.includes('Cannot GET'), 'GET / must not be Cannot GET')

  const homeApi = await req('/api/homepage')
  assert(homeApi.status === 200 && homeApi.json?.hero, 'GET /api/homepage published payload')
  const publishedTitleBefore = homeApi.json.hero?.title?.en || ''

  // Admin login
  const login = await req('/api/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: 'admin@admin.com', password: 'Admin@123' }),
  })
  assert(login.status === 200 && login.json?.token, `login failed: ${login.text}`)
  const auth = { Authorization: `Bearer ${login.json.token}` }

  // Save draft hero with unique marker — public must stay unchanged
  const draftMarker = `DRAFT-ONLY-${Date.now()}`
  const heroDraft = await req('/api/admin/data/hero', { headers: auth })
  assert(heroDraft.status === 200, 'read hero draft')
  const heroBody = {
    ...heroDraft.json,
    title: { en: draftMarker, ar: draftMarker },
  }
  const saveDraft = await req('/api/admin/data/hero', {
    method: 'PUT',
    headers: auth,
    body: JSON.stringify(heroBody),
  })
  assert(saveDraft.status === 200, `save draft failed: ${saveDraft.text}`)

  const publicAfterDraft = await req('/api/homepage')
  assert(
    publicAfterDraft.json.hero?.title?.en !== draftMarker,
    'public homepage must NOT show draft hero title',
  )
  assert(
    publicAfterDraft.json.hero?.title?.en === publishedTitleBefore,
    'public hero title unchanged after draft save',
  )
  console.log('OK: Save Draft does not change public homepage')

  // Publish hero
  const pub = await req('/api/admin/publish/hero', { method: 'POST', headers: auth, body: '{}' })
  assert(pub.status === 200, `publish failed: ${pub.text}`)
  const publicAfterPub = await req('/api/homepage')
  assert(publicAfterPub.json.hero?.title?.en === draftMarker, 'public homepage updates after publish')
  console.log('OK: Publish updates public homepage')

  // Restore previous title and publish
  const restore = {
    ...heroBody,
    title: {
      en: publishedTitleBefore || 'DigitalManager ERP',
      ar: heroDraft.json?.title?.ar || '',
    },
  }
  await req('/api/admin/data/hero', { method: 'PUT', headers: auth, body: JSON.stringify(restore) })
  await req('/api/admin/publish/hero', { method: 'POST', headers: auth, body: '{}' })

  // New page draft then publish
  const slug = `cms-test-${Date.now()}`
  const create = await req('/api/admin/pages', {
    method: 'POST',
    headers: auth,
    body: JSON.stringify({
      slug,
      title: { en: 'CMS Test Page', ar: 'اختبار' },
      heading: { en: 'CMS Test Page', ar: 'اختبار' },
      shortDescription: { en: 'Draft body', ar: '' },
      content: { en: 'Hello from CMS draft', ar: '' },
      pageType: 'custom',
      language: 'both',
      headerNav: {
        enabled: true,
        label: { en: 'CMS Test', ar: 'اختبار' },
        sortOrder: 99,
        showDesktop: true,
        showMobile: true,
      },
      footerNav: {
        enabled: true,
        label: { en: 'CMS Test', ar: 'اختبار' },
        column: 'company',
        sortOrder: 99,
      },
      status: 'draft',
    }),
  })
  assert(create.status === 201 && create.json?.page?.id, `create page: ${create.text}`)
  const pageId = create.json.page.id

  const draftPublic = await req(`/api/public/pages/${slug}`)
  assert(draftPublic.status === 404, 'draft page must not be public')
  console.log('OK: Draft page not publicly accessible')

  const publishPage = await req(`/api/admin/pages/${pageId}`, {
    method: 'PUT',
    headers: auth,
    body: JSON.stringify({
      ...create.json.page,
      action: 'publish',
      content: { en: 'Hello from CMS published', ar: '' },
      headerNav: create.json.page.headerNav,
      footerNav: create.json.page.footerNav,
    }),
  })
  assert(publishPage.status === 200, `publish page: ${publishPage.text}`)

  const livePage = await req(`/api/public/pages/${slug}`)
  assert(livePage.status === 200 && livePage.json?.page?.content?.en.includes('published'), 'published page public')
  const spaPage = await req(`/${slug}`)
  assert(spaPage.status === 200 && /doctype/i.test(spaPage.text), 'SPA fallback for CMS page')
  console.log('OK: Published page URL opens via SPA fallback')

  const nav = await req('/api/public/navigation')
  assert(nav.status === 200, 'navigation api')
  const inHeader = (nav.json.headerLinks || []).some((l) => l.href === `/${slug}`)
  const inFooter = (nav.json.footerColumns?.company || []).some((l) => l.href === `/${slug}`)
  assert(inHeader, 'published page in header nav')
  assert(inFooter, 'published page in footer nav')
  console.log('OK: Page appears in header and footer navigation')

  // Disable header, keep footer, publish
  await req(`/api/admin/pages/${pageId}`, {
    method: 'PUT',
    headers: auth,
    body: JSON.stringify({
      ...publishPage.json.page,
      action: 'publish',
      headerNav: { ...publishPage.json.page.headerNav, enabled: false },
      footerNav: { ...publishPage.json.page.footerNav, enabled: true },
    }),
  })
  const nav2 = await req('/api/public/navigation')
  assert(!(nav2.json.headerLinks || []).some((l) => l.href === `/${slug}`), 'removed from header')
  assert((nav2.json.footerColumns?.company || []).some((l) => l.href === `/${slug}`), 'still in footer')
  console.log('OK: Header disabled, footer remains')

  // Delete page — no orphan links
  const del = await req(`/api/admin/pages/${pageId}`, { method: 'DELETE', headers: auth })
  assert(del.status === 200, `delete: ${del.text}`)
  const gone = await req(`/api/public/pages/${slug}`)
  assert(gone.status === 404, 'deleted page gone')
  const nav3 = await req('/api/public/navigation')
  assert(!(nav3.json.headerLinks || []).some((l) => l.href === `/${slug}`), 'no header orphan')
  assert(!(nav3.json.footerColumns?.company || []).some((l) => l.href === `/${slug}`), 'no footer orphan')
  console.log('OK: Delete removes page and nav links')

  console.log('\nALL E2E CHECKS PASSED')
}

main().catch((e) => {
  console.error('E2E FAILED:', e.message)
  process.exit(1)
})
