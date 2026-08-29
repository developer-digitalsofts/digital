/**
 * Capture Pakistan homepage, city landings, and CMS city editor screenshots.
 * Usage: node scripts/capture-pk-city-screenshots.mjs [baseUrl]
 */
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'
import { ALL_CITY_SLUGS } from '../server/cityRegistry.mjs'

const BASE = (process.env.BASE_URL || process.argv[2] || 'http://127.0.0.1:3040').replace(/\/$/, '')
const OUT = 'screenshots/pakistan-cities'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@admin.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123'

const ROUTES = [
  { path: '/', name: 'homepage' },
  { path: '/karachi', name: 'karachi' },
  { path: '/lahore', name: 'lahore' },
  { path: '/hyderabad', name: 'hyderabad' },
  { path: '/faisalabad', name: 'faisalabad' },
]

async function revealPage(page) {
  await page.evaluate(async () => {
    const step = 700
    const max = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
    for (let y = 0; y < max; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 90))
    }
    window.scrollTo(0, 0)
    await new Promise((r) => setTimeout(r, 250))
  })
}

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
    await revealPage(page)
    const file = `${OUT}/${route.name}.png`
    await page.screenshot({ path: file, fullPage: true })
    console.log(`saved ${file}`)
    await page.setViewportSize({ width: 390, height: 844 })
    await revealPage(page)
    await page.screenshot({ path: `${OUT}/${route.name}-mobile.png`, fullPage: true })
    console.log(`saved ${OUT}/${route.name}-mobile.png`)
    await page.setViewportSize({ width: 1440, height: 900 })
    if (route.name === 'homepage') {
      await page.locator('header').first().screenshot({ path: `${OUT}/homepage-header-selector.png` })
      await page.locator('footer').first().screenshot({ path: `${OUT}/homepage-footer-selector.png` })
      console.log(`saved ${OUT}/homepage-header-selector.png`)
      console.log(`saved ${OUT}/homepage-footer-selector.png`)
    }
    await page.close()
  }

  const captured = new Set(ROUTES.map((r) => r.path))
  for (const citySlug of ALL_CITY_SLUGS) {
    const path = `/${citySlug}`
    if (captured.has(path)) continue
    for (const viewport of [
      { width: 1440, height: 900 },
      { width: 390, height: 844 },
    ]) {
      const page = await context.newPage()
      await page.setViewportSize(viewport)
      await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 45000 })
      await page.waitForSelector('header .dm-locale-select, .dm-header__actions .dm-locale-select, footer .dm-locale-select', {
        state: 'attached',
        timeout: 20000,
      })
      const hero = await page.locator('h1, .dm-hero').first().count()
      const footer = await page.locator('footer').count()
      if (!hero || !footer) throw new Error(`${path} @${viewport.width}: missing hero or footer`)
      await page.close()
      console.log(`ok ${path} ${viewport.width}px`)
    }
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
