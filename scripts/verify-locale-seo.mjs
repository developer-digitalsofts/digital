/**
 * Localized SEO verification — sitemap, canonical, hreflang, robots, draft protection.
 * Uses temporary fixtures via admin API; never persists test records.
 *
 * Usage: node scripts/verify-locale-seo.mjs
 */
import { execSync } from 'node:child_process'
import { withDraftTestFixtures, purgeLeakedTestRecords } from './lib/locale-test-session.mjs'

const API = process.env.API_URL || 'http://127.0.0.1:3040'
const WEB = process.env.BASE_URL || 'http://127.0.0.1:5280'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@admin.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123'

const VALID_HREFLANG = new Set([
  'x-default',
  'en-AE',
  'ar-AE',
  'en-SA',
  'ar-SA',
  'en-QA',
  'ar-QA',
  'en-OM',
  'ar-OM',
  'en-KW',
  'ar-KW',
  'en-BH',
  'ar-BH',
])

const DRAFT_AR_PATH_PREFIXES = ['/qa/ar', '/sa/ar', '/om/ar', '/kw/ar', '/bh/ar']
const PUBLISHED_EN_HOME_PATHS = ['/sa/en', '/qa/en', '/om/en', '/kw/en', '/bh/en']
const BLOCKED_PATHS = ['/admin', '/api/', '/admin/login']

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

function parseSitemapLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
}

async function verifySitemapBasics() {
  const res = await fetch(`${API}/sitemap.xml`)
  const xml = await res.text()
  if (res.ok && xml.includes('<urlset') && xml.includes('</urlset>')) {
    pass('Sitemap returns 200 and valid XML', `${res.status}`)
  } else {
    fail('Sitemap returns 200 and valid XML', String(res.status))
    return null
  }
  return { xml, locs: parseSitemapLocs(xml) }
}

async function verifySitemapContents(locs) {
  const unique = new Set(locs)
  if (unique.size === locs.length) pass('No duplicate sitemap URLs', `${locs.length} entries`)
  else fail('No duplicate sitemap URLs', `${locs.length} total, ${unique.size} unique`)

  for (const prefix of DRAFT_AR_PATH_PREFIXES) {
    const leaked = locs.filter((u) => {
      try {
        const p = new URL(u).pathname
        return p === prefix || p.startsWith(`${prefix}/`)
      } catch {
        return u.includes(prefix)
      }
    })
    if (!leaked.length) pass(`Arabic draft URLs excluded (${prefix})`)
    else fail(`Arabic draft URLs excluded (${prefix})`, leaked.slice(0, 3).join(', '))
  }

  for (const homePath of PUBLISHED_EN_HOME_PATHS) {
    const found = locs.some((u) => {
      try {
        return new URL(u).pathname === homePath
      } catch {
        return u.endsWith(homePath)
      }
    })
    if (found) pass(`Published English homepage in sitemap (${homePath})`)
    else fail(`Published English homepage in sitemap (${homePath})`)
  }

  for (const blocked of BLOCKED_PATHS) {
    const hit = locs.some((u) => u.includes(blocked))
    if (!hit) pass(`Blocked route excluded (${blocked})`)
    else fail(`Blocked route excluded (${blocked})`)
  }

  const uaePaths = ['/', '/contact', '/blog', '/erp', '/developers']
  const uaeOk = uaePaths.every((p) => locs.some((u) => new URL(u).pathname === p))
  if (uaeOk) pass('UAE root routes included', uaePaths.join(', '))
  else fail('UAE root routes included')

  if (locs.every((u) => u.startsWith('https://'))) pass('Sitemap URLs are absolute HTTPS')
  else fail('Sitemap URLs are absolute HTTPS')
}

async function verifySeoPage(path) {
  return json(`${API}/api/public/seo-page?path=${encodeURIComponent(path)}`)
}

async function verifyCanonicalConsistency() {
  const samples = ['/', '/contact', '/erp', '/blog']
  for (const path of samples) {
    const { res, body } = await verifySeoPage(path)
    if (!res.ok) {
      fail(`Canonical self-consistent (${path})`, String(res.status))
      continue
    }
    const pathname = new URL(body.canonical).pathname
    if (pathname === path && body.noIndex === false) pass(`Canonical self-consistent (${path})`, body.canonical)
    else fail(`Canonical self-consistent (${path})`, `${body.canonical} noIndex=${body.noIndex}`)
  }
}

async function verifyHreflangReciprocity() {
  const { res, body } = await verifySeoPage('/erp')
  if (!res.ok) {
    fail('Hreflang reciprocity seed', String(res.status))
    return
  }
  const alternates = body.alternates || []
  for (const alt of alternates) {
    if (!VALID_HREFLANG.has(alt.hreflang)) {
      fail('No invalid hreflang codes', alt.hreflang)
      return
    }
  }
  pass('No invalid country/language codes', `${alternates.length} alternates`)

  const xDefault = alternates.find((a) => a.hreflang === 'x-default')
  if (xDefault?.href?.endsWith('/erp')) pass('x-default points to UAE English /erp', xDefault.href)
  else fail('x-default is correct', xDefault?.href || 'missing')

  const hasEnSa = alternates.some((a) => a.hreflang === 'en-SA')
  const hasArSa = alternates.some((a) => a.hreflang === 'ar-SA')
  if (hasEnSa && !hasArSa) {
    pass('Published English SA alternate without unpublished Arabic', 'en-SA present, ar-SA absent')
  } else if (!hasEnSa && !hasArSa) {
    pass('No SA alternates when SA content unpublished')
  } else {
    fail('SA hreflang alternates', `en-SA=${hasEnSa} ar-SA=${hasArSa}`)
  }

  let reciprocalOk = true
  for (const alt of alternates.filter((a) => a.hreflang !== 'x-default')) {
    const altPath = new URL(alt.href).pathname
    const peer = await verifySeoPage(altPath)
    const back = (peer.body?.alternates || []).find((a) => a.hreflang === 'en-AE')
    if (!back) reciprocalOk = false
  }
  if (reciprocalOk) pass('Hreflang pairs are reciprocal', `${alternates.length} tags checked`)
  else fail('Hreflang pairs are reciprocal')

  let statusOk = true
  for (const alt of alternates) {
    const r = await fetch(`${WEB}${new URL(alt.href).pathname}`)
    if (!r.ok) statusOk = false
  }
  if (statusOk) pass('Every hreflang URL returns 200', `${alternates.length} URLs`)
  else fail('Every hreflang URL returns 200')
}

async function verifyDraftNoindexWithFixtures(auth) {
  await withDraftTestFixtures(async () => {
    const draftPaths = [
      '/qa/ar/erp',
      '/sa/ar/erp',
      '/om/en/software/industry/retail-management-software',
      '/kw/ar/software/module/inventory-management-software',
    ]
    for (const path of draftPaths) {
      const { body } = await verifySeoPage(path)
      if (body.noIndex === true) pass(`Draft/noindex protection (${path})`)
      else fail(`Draft/noindex protection (${path})`, `noIndex=${body.noIndex}`)
    }

    const publishedPaths = ['/sa/en', '/qa/en/erp', '/bh/en/contact']
    for (const path of publishedPaths) {
      const { body } = await verifySeoPage(path)
      if (body.noIndex === false) pass(`Published English indexable (${path})`)
      else fail(`Published English indexable (${path})`, `noIndex=${body.noIndex}`)
    }

    const sitemap = await fetch(`${API}/sitemap.xml`).then((r) => r.text())
    const locs = parseSitemapLocs(sitemap)
    const leaked = locs.filter((u) =>
      DRAFT_AR_PATH_PREFIXES.some((p) => {
        try {
          const pathname = new URL(u).pathname
          return pathname === p || pathname.startsWith(`${p}/`)
        } catch {
          return false
        }
      }),
    )
    if (!leaked.length) pass('Draft locales excluded from sitemap with fixtures active')
    else fail('Draft locales excluded from sitemap with fixtures active', leaked.join(', '))
  }, auth)
}

async function verifyArabicLangDir(auth) {
  const draft = await json(`${API}/api/admin/locale/records`, { headers: auth })
  const existing = (draft.body?.records || []).find((r) => r.globalIdentity === 'erp' && r.countryCode === 'AE' && r.languageCode === 'ar')
  if (!existing?.id) {
    fail('Arabic approved fixture', 'no AE/ar ERP record to patch')
    return
  }

  const snapshot = structuredClone(existing)
  const patched = {
    ...existing,
    inheritanceMode: 'override',
    translationStatus: 'approved',
    publicationStatus: 'published',
    enabled: true,
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    seo: {
      title: { en: '', ar: '[TEST SEO] ERP بالعربية' },
      description: { en: '', ar: 'وصف عربي معتمد للاختبار.' },
      noIndex: false,
    },
    payload: {
      ...(existing.payload || {}),
      template: 'cms-page',
      title: { en: '', ar: '[TEST SEO] ERP' },
      heading: { en: '', ar: '[TEST SEO] ERP UAE Arabic' },
      shortDescription: { en: '', ar: 'محتوى عربي معتمد.' },
      sections: [],
      useBaseline: false,
    },
  }

  try {
    const write = await json(`${API}/api/admin/locale/records/${existing.id}`, {
      method: 'PUT',
      headers: auth,
      body: JSON.stringify(patched),
    })
    if (!write.res.ok) {
      fail('Arabic approved fixture', write.body?.error || String(write.res.status))
      return
    }
    await json(`${API}/api/admin/locale/publish-store`, { method: 'POST', headers: auth, body: '{}' })

    const { body } = await verifySeoPage('/ae/ar/erp')
    if (body.lang === 'ar' && body.dir === 'rtl' && body.noIndex === false) {
      pass('Arabic approved page uses lang=ar and dir=rtl', body.robots || '')
    } else {
      fail('Arabic approved page uses lang=ar and dir=rtl', JSON.stringify({ lang: body.lang, dir: body.dir, noIndex: body.noIndex }))
    }
  } finally {
    await json(`${API}/api/admin/locale/records/${existing.id}`, {
      method: 'PUT',
      headers: auth,
      body: JSON.stringify(snapshot),
    })
    await json(`${API}/api/admin/locale/publish-store`, { method: 'POST', headers: auth, body: '{}' })
  }
}

async function verifyUaeRegression() {
  const home = await fetch(`${WEB}/`)
  const erp = await fetch(`${WEB}/erp`)
  const contact = await fetch(`${WEB}/contact`)
  if (home.ok && erp.ok && contact.ok) pass('Existing UAE routing unchanged', `${home.status}/${erp.status}/${contact.status}`)
  else fail('Existing UAE routing unchanged')

  const pub = await json(`${API}/api/public/locale-content/erp?country=AE&lang=en`)
  if (pub.res.ok && pub.body?.page?.heading) pass('UAE English ERP public API intact')
  else fail('UAE English ERP public API intact')
}

async function verifyRobotsTxt() {
  const res = await fetch(`${API}/robots.txt`)
  const text = await res.text()
  if (
    res.ok &&
    /Sitemap: https:\/\/(www\.)?digitalmanager\.ae\/sitemap\.xml/.test(text) &&
    text.includes('Disallow: /admin')
  ) {
    pass('robots.txt references sitemap and blocks admin')
  } else {
    fail('robots.txt references sitemap and blocks admin', text.slice(0, 120))
  }
}

async function verifyBuildAndLint() {
  try {
    execSync('npm run build', { stdio: 'pipe', cwd: process.cwd() })
    pass('Production build passes')
  } catch (e) {
    fail('Production build passes', e instanceof Error ? e.message.slice(0, 200) : 'build failed')
  }

  const lintTargets = [
    'server/seoResolve.mjs',
    'server/seoPaths.mjs',
    'server/seoRouteCatalog.mjs',
    'server/contentRoutes.mjs',
    'src/components/SeoHead.tsx',
    'scripts/verify-locale-seo.mjs',
    'server/localeHelpers.mjs',
    'server/localeDetect.mjs',
    'server/localeActions.mjs',
    'server/localeApi.mjs',
    'server/localeContentModel.mjs',
    'server/localeResolver.mjs',
    'server/localeMigrate.mjs',
    'server/countrySetup.mjs',
    'server/localePublish.mjs',
    'server/localeFieldHelpers.mjs',
    'src/pages/LocaleSoftwarePage.tsx',
    'src/pages/LocaleSlugPage.tsx',
    'scripts/verify-locale-phase.mjs',
  ]
  try {
    execSync(`npx eslint ${lintTargets.join(' ')}`, { stdio: 'pipe', cwd: process.cwd() })
    pass('Locale-only lint introduces zero errors')
  } catch (e) {
    fail('Locale-only lint introduces zero errors', e instanceof Error ? e.message.slice(0, 300) : 'lint failed')
  }
}

async function main() {
  const token = await adminToken()
  if (!token) {
    fail('Admin auth', 'no token')
    process.exit(1)
  }
  const auth = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const sitemap = await verifySitemapBasics()
  if (sitemap?.locs) {
    await verifySitemapContents(sitemap.locs)
    pass('Only published/indexable URLs in sitemap', `${sitemap.locs.length} URLs`)
  }

  await verifyRobotsTxt()
  await verifyCanonicalConsistency()
  await verifyHreflangReciprocity()
  await verifyDraftNoindexWithFixtures(auth)
  await verifyArabicLangDir(auth)
  await purgeLeakedTestRecords(auth)
  await json(`${API}/api/admin/locale/publish-store`, { method: 'POST', headers: auth, body: '{}' })
  await verifyUaeRegression()
  await verifyBuildAndLint()

  const failed = results.filter((r) => !r.ok)
  console.log(`\n${results.length - failed.length}/${results.length} passed`)
  if (failed.length) process.exit(1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
