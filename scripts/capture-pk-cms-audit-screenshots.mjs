/**
 * Capture CMS admin screenshots for Pakistan city audit.
 * Usage: node scripts/capture-pk-cms-audit-screenshots.mjs [baseUrl]
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const BASE = (process.argv[2] || 'http://127.0.0.1:3044').replace(/\/$/, '')
const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'screenshots', 'pk-cms-audit')
const EMAIL = process.env.ADMIN_EMAIL || 'admin@admin.com'
const PASS = process.env.ADMIN_PASSWORD || 'Admin@123'

await fs.mkdir(OUT, { recursive: true })
const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
const page = await context.newPage()

await page.goto(`${BASE}/admin/login`)
await page.fill('input[type="email"], input[name="email"]', EMAIL)
await page.fill('input[type="password"]', PASS)
await page.click('button[type="submit"]')
await page.waitForURL(/\/admin(?!\/login)/, { timeout: 15000 })

await page.goto(`${BASE}/admin/content/cities`)
await page.waitForTimeout(1500)
await page.screenshot({ path: path.join(OUT, 'cms-city-list.png'), fullPage: true })

// Expand Faisalabad editor
const faisEdit = page.getByRole('button', { name: 'Edit' }).first()
for (const btn of await page.getByRole('button', { name: 'Edit' }).all()) {
  const row = btn.locator('xpath=ancestor::tr')
  const text = await row.innerText()
  if (text.includes('Faisalabad')) {
    await btn.click()
    break
  }
}
await page.waitForTimeout(800)
await page.screenshot({ path: path.join(OUT, 'cms-faisalabad-editor.png'), fullPage: true })

// Lahore editor
await page.goto(`${BASE}/admin/content/cities`)
await page.waitForTimeout(1000)
for (const btn of await page.getByRole('button', { name: 'Edit' }).all()) {
  const row = btn.locator('xpath=ancestor::tr')
  const text = await row.innerText()
  if (text.includes('Lahore')) {
    await btn.click()
    break
  }
}
await page.waitForTimeout(800)
await page.screenshot({ path: path.join(OUT, 'cms-lahore-editor.png'), fullPage: true })

// SEO fields visible in city editor (same page, scroll)
await page.screenshot({ path: path.join(OUT, 'cms-city-seo-fields.png'), fullPage: true })

// Publish controls on list
await page.goto(`${BASE}/admin/content/cities`)
await page.waitForTimeout(800)
await page.screenshot({ path: path.join(OUT, 'cms-draft-publish-controls.png'), fullPage: true })

// Public pages after restoration
await page.goto(`${BASE}/faisalabad`)
await page.waitForTimeout(2000)
await page.screenshot({ path: path.join(OUT, 'public-faisalabad-restored.png'), fullPage: false })

await page.goto(`${BASE}/lahore`)
await page.waitForTimeout(2000)
await page.screenshot({ path: path.join(OUT, 'public-lahore-restored.png'), fullPage: false })

await browser.close()
console.log('Screenshots saved to', OUT)
