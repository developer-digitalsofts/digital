/**
 * Locale architecture verification screenshots.
 * Usage: node scripts/capture-locale-verify.mjs
 */
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:5280'
const OUT = 'screenshots/locale-verify'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@admin.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123'

async function loginAdmin(page) {
  await page.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle', timeout: 90000 })
  await page.fill('input[type="email"]', ADMIN_EMAIL)
  await page.fill('input[type="password"]', ADMIN_PASSWORD)
  await page.click('button[type="submit"]')
  await page.waitForURL(/\/admin(?:\/|$)/, { timeout: 30000 })
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } })

  await desktop.goto(BASE, { waitUntil: 'networkidle', timeout: 90000 })
  await desktop.waitForSelector('header', { timeout: 15000 })
  await desktop.screenshot({ path: `${OUT}/01-desktop-locale-selector-1440.png` })

  await mobile.goto(BASE, { waitUntil: 'networkidle', timeout: 90000 })
  await mobile.click('button[aria-label="Open menu"]')
  await mobile.waitForTimeout(500)
  await mobile.screenshot({ path: `${OUT}/02-mobile-locale-selector-390.png` })

  await desktop.goto(`${BASE}/qa/en`, { waitUntil: 'networkidle', timeout: 90000 })
  await desktop.waitForTimeout(800)
  await desktop.screenshot({ path: `${OUT}/05-qatar-english-homepage-1440.png` })

  await desktop.goto(`${BASE}/sa/ar`, { waitUntil: 'networkidle', timeout: 90000 })
  await desktop.waitForTimeout(800)
  await desktop.screenshot({ path: `${OUT}/06-saudi-arabic-rtl-homepage-1440.png` })

  await desktop.goto(`${BASE}/qa/en/insights`, { waitUntil: 'networkidle', timeout: 90000 })
  await desktop.screenshot({ path: `${OUT}/08-blog-filtered-by-country-1440.png` })

  await desktop.goto(`${BASE}/qa/en/testimonials`, { waitUntil: 'networkidle', timeout: 90000 })
  await desktop.screenshot({ path: `${OUT}/09-testimonial-filtered-by-country-1440.png` })

  await desktop.goto(BASE, { waitUntil: 'networkidle' })
  await desktop.evaluate(() => {
    window.__DM_COUNTRY_HINT__ = 'QA'
    localStorage.removeItem('dm_locale_suggest_dismiss')
  })
  await desktop.reload({ waitUntil: 'networkidle' })
  await desktop.waitForTimeout(700)
  await desktop.screenshot({ path: `${OUT}/07-country-suggestion-popup-1440.png` })

  await loginAdmin(desktop)
  await desktop.goto(`${BASE}/admin/content/countries`, { waitUntil: 'networkidle', timeout: 90000 })
  await desktop.screenshot({ path: `${OUT}/03-cms-countries-1440.png` })

  await desktop.goto(`${BASE}/admin/pages/home`, { waitUntil: 'networkidle', timeout: 90000 })
  await desktop.screenshot({ path: `${OUT}/04-cms-locale-context-1440.png` })

  await browser.close()
  console.log(`Screenshots saved to ${OUT}/`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
