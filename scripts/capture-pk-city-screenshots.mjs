/**
 * Capture Pakistan homepage, city landings, and CMS city editor screenshots.
 * Usage: node scripts/capture-pk-city-screenshots.mjs [baseUrl]
 */
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'

const BASE = (process.env.BASE_URL || process.argv[2] || 'http://127.0.0.1:3040').replace(/\/$/, '')
const OUT = 'screenshots/pakistan-cities'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@admin.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123'

const ROUTES = [
  { path: '/', name: 'homepage' },
  { path: '/karachi', name: 'karachi' },
  { path: '/lahore', name: 'lahore' },
  { path: '/islamabad', name: 'islamabad' },
]

async function loginAdmin(page) {
  const res = await fetch(`${BASE}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })
  const auth = await res.json()
  if (!auth.token) throw new Error(`Admin login failed: ${res.status} ${JSON.stringify(auth)}`)
  await page.goto(`${BASE}/admin/login`, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await page.evaluate((token) => localStorage.setItem('dm_admin_token', token), auth.token)
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })

  for (const route of ROUTES) {
    const page = await context.newPage()
    await page.goto(`${BASE}${route.path}`, { waitUntil: 'networkidle', timeout: 45000 })
    await page.waitForSelector('.dm-header__actions .dm-locale-select, header .dm-locale-select, footer .dm-locale-select', {
      timeout: 20000,
    })
    const headerSelect = page.locator('header .dm-locale-select, .dm-header__actions .dm-locale-select').first()
    const footerSelect = page.locator('footer .dm-locale-select').first()
    if ((await headerSelect.count()) === 0) throw new Error(`${route.path}: header city selector missing`)
    if ((await footerSelect.count()) === 0) throw new Error(`${route.path}: footer city selector missing`)
    const file = `${OUT}/${route.name}.png`
    await page.screenshot({ path: file, fullPage: true })
    console.log(`saved ${file}`)
    if (route.name === 'homepage') {
      await page.locator('header').first().screenshot({ path: `${OUT}/homepage-header-selector.png` })
      await page.locator('footer').first().screenshot({ path: `${OUT}/homepage-footer-selector.png` })
      console.log(`saved ${OUT}/homepage-header-selector.png`)
      console.log(`saved ${OUT}/homepage-footer-selector.png`)
    }
    await page.close()
  }

  const loginRes = await fetch(`${BASE}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })
  const auth = await loginRes.json()
  if (!auth.token) throw new Error(`Admin login failed: ${loginRes.status} ${JSON.stringify(auth)}`)

  const adminContext = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  await adminContext.addInitScript((token) => {
    localStorage.setItem('dm_admin_token', token)
  }, auth.token)
  const adminPage = await adminContext.newPage()
  await adminPage.goto(`${BASE}/admin/content/cities`, { waitUntil: 'domcontentloaded', timeout: 45000 })
  await adminPage.waitForTimeout(1500)
  await adminPage.screenshot({ path: `${OUT}/cms-city-editor.png`, fullPage: true })
  console.log(`saved ${OUT}/cms-city-editor.png`)
  const editBtn = adminPage.getByRole('button', { name: 'Edit' }).first()
  if (await editBtn.count()) {
    await editBtn.click()
    await adminPage.waitForTimeout(400)
    await adminPage.screenshot({ path: `${OUT}/cms-city-editor.png`, fullPage: true })
    console.log(`saved ${OUT}/cms-city-editor.png (edit open)`)
  }
  await adminPage.close()
  await adminContext.close()

  await browser.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
