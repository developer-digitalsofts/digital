/**
 * Capture city CMS editor screenshots after parity implementation.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const BASE = (process.argv[2] || 'http://127.0.0.1:3045').replace(/\/$/, '')
const OUT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'screenshots', 'pk-city-cms-complete')
const EMAIL = process.env.ADMIN_EMAIL || 'admin@admin.com'
const PASS = process.env.ADMIN_PASSWORD || 'Admin@123'

await fs.mkdir(OUT, { recursive: true })
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

await page.goto(`${BASE}/admin/login`)
await page.fill('input[type="email"], input[name="email"]', EMAIL)
await page.fill('input[type="password"]', PASS)
await page.click('button[type="submit"]')
await page.waitForURL(/\/admin(?!\/login)/, { timeout: 15000 })

await page.goto(`${BASE}/admin/content/cities`)
await page.waitForTimeout(1200)
await page.screenshot({ path: path.join(OUT, 'city-hub.png'), fullPage: true })

await page.goto(`${BASE}/admin/content/cities/faisalabad/home`)
await page.waitForTimeout(1500)
await page.screenshot({ path: path.join(OUT, 'faisalabad-home-editor.png'), fullPage: true })

await page.goto(`${BASE}/admin/content/cities/faisalabad/home?panel=hero`)
await page.waitForTimeout(1500)
await page.screenshot({ path: path.join(OUT, 'faisalabad-hero-tab.png'), fullPage: true })

await page.goto(`${BASE}/admin/content/cities/lahore/home`)
await page.waitForTimeout(1500)
await page.screenshot({ path: path.join(OUT, 'lahore-home-editor.png'), fullPage: true })

await page.goto(`${BASE}/admin/content/cities/faisalabad/home?panel=seo`)
await page.waitForTimeout(1500)
await page.screenshot({ path: path.join(OUT, 'faisalabad-seo-tab.png'), fullPage: true })

await page.goto(`${BASE}/admin/content/cities/faisalabad/products`)
await page.waitForTimeout(1200)
await page.screenshot({ path: path.join(OUT, 'faisalabad-products.png'), fullPage: true })

await page.goto(`${BASE}/faisalabad`)
await page.waitForTimeout(2000)
await page.screenshot({ path: path.join(OUT, 'public-faisalabad.png'), fullPage: false })

await page.goto(`${BASE}/lahore`)
await page.waitForTimeout(2000)
await page.screenshot({ path: path.join(OUT, 'public-lahore.png'), fullPage: false })

await browser.close()
console.log('Screenshots saved to', OUT)
