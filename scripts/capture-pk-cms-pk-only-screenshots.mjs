/**
 * Capture Pakistan-only CMS admin screenshots (after UI lock).
 * Usage: node scripts/capture-pk-cms-pk-only-screenshots.mjs [baseUrl]
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const BASE = (process.argv[2] || 'http://127.0.0.1:3040').replace(/\/$/, '')
const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'screenshots', 'pk-cms-pk-only')
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

await page.goto(`${BASE}/admin`)
await page.waitForTimeout(1200)
await page.screenshot({ path: path.join(OUT, 'after-dashboard.png'), fullPage: true })

await page.goto(`${BASE}/admin/content/cities`)
await page.waitForTimeout(1200)
await page.screenshot({ path: path.join(OUT, 'after-city-pages-hub.png'), fullPage: true })

await page.goto(`${BASE}/admin/content/cities/faisalabad/home`)
await page.waitForTimeout(1500)
await page.screenshot({ path: path.join(OUT, 'after-faisalabad-editor.png'), fullPage: true })

await page.goto(`${BASE}/admin/content/cities/lahore/home`)
await page.waitForTimeout(1500)
await page.screenshot({ path: path.join(OUT, 'after-lahore-editor.png'), fullPage: true })

await page.goto(`${BASE}/admin/pages/home`)
await page.waitForTimeout(1200)
await page.screenshot({ path: path.join(OUT, 'after-homepage-editor.png'), fullPage: true })

await browser.close()
console.log('Screenshots saved to', OUT)
