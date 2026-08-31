/**
 * Verify Pakistan-only CMS UI: no country controls, APIs still use PK.
 * Usage: node scripts/verify-pk-cms-ui.mjs [baseUrl]
 */
import { chromium } from 'playwright'
import { ALL_CITY_SLUGS } from '../server/cityRegistry.mjs'

const BASE = (process.argv[2] || process.env.BASE_URL || 'http://127.0.0.1:3040').replace(/\/$/, '')
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@admin.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123'

const failures = []
function fail(name, detail) {
  failures.push(`${name}: ${detail}`)
  console.error(`✗ ${name} — ${detail}`)
}
function pass(name, detail = '') {
  console.log(`✓ ${name}${detail ? ` — ${detail}` : ''}`)
}

async function login(page) {
  await page.goto(`${BASE}/admin/login`)
  await page.fill('input[type="email"], input[name="email"]', ADMIN_EMAIL)
  await page.fill('input[type="password"]', ADMIN_PASSWORD)
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/admin(?!\/login)/, { timeout: 15000 })
}

async function main() {
  console.log(`Pakistan CMS UI verification against ${BASE}`)

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()
  const page = await context.newPage()

  await login(page)
  pass('Admin login')

  await page.goto(`${BASE}/admin`)
  await page.waitForTimeout(1000)

  const countriesLink = page.locator('aside a[href="/admin/content/countries"]')
  if (await countriesLink.count()) fail('Sidebar', 'Countries link still visible')
  else pass('Sidebar', 'Countries link absent')

  const countrySetupLink = page.locator('aside a[href="/admin/content/countries/setup"]')
  if (await countrySetupLink.count()) fail('Sidebar', 'Country Setup link still visible')
  else pass('Sidebar', 'Country Setup link absent')

  const countrySelect = page.locator('label:has-text("Country") select')
  if (await countrySelect.count()) fail('Dashboard', 'Country selector visible')
  else pass('Dashboard', 'Country selector absent')

  const pkContent = page.getByText('Pakistan Website Content')
  if (!(await pkContent.count())) fail('Dashboard', 'missing Pakistan Website Content label')
  else pass('Dashboard', 'Pakistan Website Content label shown')

  if (await page.getByText('Pakistan · English').count()) {
    fail('Dashboard', 'redundant Pakistan · English label still shown')
  } else {
    pass('Dashboard', 'Pakistan · English label absent')
  }

  await page.goto(`${BASE}/admin/content/countries`)
  await page.waitForTimeout(800)
  if (!page.url().includes('/admin/content/countries')) {
    pass('Countries route', 'redirects away from Countries page')
  } else {
    fail('Countries route', 'Countries page still accessible')
  }

  await page.goto(`${BASE}/admin/content/cities`)
  await page.waitForTimeout(1000)

  if (!(await page.getByRole('heading', { name: 'City Pages' }).count())) {
    fail('City Pages hub', 'missing City Pages heading')
  } else {
    pass('City Pages hub', 'heading present')
  }

  const desc = page.getByText('Manage individual Pakistan city websites')
  if (!(await desc.count())) fail('City Pages hub', 'missing updated description')
  else pass('City Pages hub', 'updated description present')

  if (await page.getByText('Pakistan Website Content').count()) {
    fail('City Pages hub', 'global locale bar should be hidden on city pages')
  } else {
    pass('City Pages hub', 'no global locale bar on city pages')
  }

  if (await page.locator('label:has-text("Country") select').count()) {
    fail('City Pages hub', 'Country selector visible')
  } else {
    pass('City Pages hub', 'Country selector absent')
  }

  await page.goto(`${BASE}/admin/content/cities/faisalabad/home`)
  await page.waitForTimeout(1200)

  if (!(await page.getByText('City CMS').count())) fail('Faisalabad editor', 'missing city context bar')
  else pass('Faisalabad editor', 'city context bar present')

  if (await page.locator('label:has-text("Country") select').count()) {
    fail('Faisalabad editor', 'Country selector visible')
  } else {
    pass('Faisalabad editor', 'Country selector absent')
  }

  await browser.close()

  const loginRes = await fetch(`${BASE}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })
  const { token } = await loginRes.json()

  const citiesApi = await fetch(`${BASE}/api/admin/locale/cities?country=PK`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!citiesApi.ok) fail('Cities API', `status ${citiesApi.status}`)
  else {
    const data = await citiesApi.json()
    const slugs = (data.cities || []).map((c) => c.slug).sort()
    const expected = [...ALL_CITY_SLUGS].sort()
    if (slugs.length !== expected.length || !expected.every((s, i) => slugs[i] === s)) {
      fail('Cities API', `expected ${expected.length} cities, got ${slugs.length}: ${slugs.join(', ')}`)
    } else {
      pass('Cities API', `all ${expected.length} city records accessible via PK`)
    }
    const published = (data.cities || []).filter((c) => c.published?.publicationStatus === 'published').length
    pass('Cities published', `${published}/${expected.length} city homepages published`)
  }

  for (const citySlug of ALL_CITY_SLUGS) {
    const pub = await fetch(`${BASE}/api/homepage?country=PK&lang=en&city=${citySlug}`)
    if (pub.status !== 200) fail(`${citySlug} homepage API`, `status ${pub.status}`)
    else pass(`${citySlug} homepage API`, 'resolves with country=PK')
  }

  console.log('\n--- Summary ---')
  if (failures.length) {
    console.error(`FAILED (${failures.length}):`)
    failures.forEach((f) => console.error(`  - ${f}`))
    process.exit(1)
  }
  console.log('All Pakistan CMS UI checks passed.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
