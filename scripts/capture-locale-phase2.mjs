/**
 * Phase 2 locale CMS screenshots — writes to repo-root screenshots/locale-phase2/
 */
import { mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'screenshots', 'locale-phase2')
const BASE = process.env.BASE_URL || 'http://127.0.0.1:5280'
const API = process.env.API_URL || 'http://127.0.0.1:3040'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@admin.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123'

const EXPECTED = [
  '01-uae-erp-real-page-1440.png',
  '02-qa-erp-draft-fallback-1440.png',
  '03-country-setup-wizard-1440.png',
  '04-qatar-english-cms-context-1440.png',
  '05-qatar-arabic-workflow-1440.png',
  '06-sa-ar-erp-locale-route-1440.png',
  '07-inherited-vs-customized-1440.png',
  '08-gcc-country-matrix-1440.png',
]

async function goto(page, url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90000 })
      await page.waitForTimeout(1500)
      return
    } catch (e) {
      if (i === retries - 1) throw e
      await page.waitForTimeout(2000)
    }
  }
}

async function loginAdmin(page, token) {
  if (token) {
    await page.goto(`${BASE}/admin/login`, { waitUntil: 'domcontentloaded', timeout: 90000 })
    await page.evaluate((t) => localStorage.setItem('dm_admin_token', t), token)
    await page.goto(`${BASE}/admin`, { waitUntil: 'domcontentloaded', timeout: 90000 })
    await page.waitForTimeout(800)
    return
  }
  await goto(page, `${BASE}/admin/login`)
  await page.fill('#adm-email', ADMIN_EMAIL)
  await page.fill('#adm-password', ADMIN_PASSWORD)
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/admin(?:\/|$)/, { timeout: 30000 })
}

async function adminAuth() {
  const login = await fetch(`${API}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })
  const { token } = await login.json()
  return token
}

async function shot(page, filename, opts = {}) {
  const filePath = path.join(OUT, filename)
  await page.screenshot({ path: filePath, ...opts })
  const info = await stat(filePath)
  if (info.size < 1024) throw new Error(`Screenshot too small: ${filename} (${info.size} bytes)`)
  console.log(`  ✓ ${filename} (${info.size} bytes)`)
  return filePath
}

async function verifyOutputs() {
  const missing = []
  for (const name of EXPECTED) {
    const filePath = path.join(OUT, name)
    try {
      const info = await stat(filePath)
      if (info.size < 1024) missing.push(`${name} (${info.size} bytes)`)
    } catch {
      missing.push(`${name} (missing)`)
    }
  }
  if (missing.length) throw new Error(`Screenshot verification failed: ${missing.join(', ')}`)
}

async function main() {
  await mkdir(OUT, { recursive: true })
  console.log(`Output directory: ${OUT}`)

  const token = await adminAuth()
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

  console.log('Capturing public pages…')
  await goto(page, `${BASE}/erp`)
  await page.waitForSelector('h1', { timeout: 15000 })
  await shot(page, '01-uae-erp-real-page-1440.png', { fullPage: true })

  await goto(page, `${BASE}/qa/en/erp`)
  await page.waitForSelector('h1', { timeout: 15000 })
  await shot(page, '02-qa-erp-draft-fallback-1440.png', { fullPage: true })

  await goto(page, `${BASE}/sa/ar/erp`)
  await page.waitForSelector('h1', { timeout: 15000 })
  await shot(page, '06-sa-ar-erp-locale-route-1440.png', { fullPage: true })

  console.log('Capturing admin CMS…')
  await loginAdmin(page, token)
  await goto(page, `${BASE}/admin/content/countries/setup`)
  await page.waitForSelector('legend:has-text("Bootstrap mode")', { timeout: 30000 })
  await shot(page, '03-country-setup-wizard-1440.png')

  await goto(page, `${BASE}/admin/pages/home`)
  await page.waitForSelector('h1:has-text("Home Page Sections")', { timeout: 30000 })
  await page.waitForSelector('text=Editing:', { timeout: 15000 })
  const countrySelect = page.locator('select').filter({ has: page.locator('option[value="qa"]') }).first()
  await countrySelect.selectOption('qa')
  await page.waitForTimeout(800)
  await shot(page, '04-qatar-english-cms-context-1440.png')

  const langSelect = page.locator('select').filter({ has: page.locator('option[value="ar"]') }).first()
  await langSelect.selectOption('ar')
  await page.waitForTimeout(800)
  await page.waitForSelector('text=Translation workflow:', { timeout: 15000 })
  await shot(page, '05-qatar-arabic-workflow-1440.png')

  await langSelect.selectOption('en')
  await page.waitForTimeout(400)
  const customizeBtn = page.getByRole('button', { name: 'Customize for This Country' })
  if (await customizeBtn.count()) {
    await customizeBtn.first().click()
    await page.waitForTimeout(1200)
  }
  await shot(page, '07-inherited-vs-customized-1440.png')

  await goto(page, `${BASE}/admin/content/countries`)
  await page.waitForTimeout(1200)
  await shot(page, '08-gcc-country-matrix-1440.png', { fullPage: true })

  await browser.close()
  await verifyOutputs()
  console.log(`\nAll ${EXPECTED.length} screenshots verified in:\n${OUT}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
