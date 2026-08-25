/**
 * Capture Testimonials CMS list, homepage section area, and public page.
 */
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const WEB = process.env.BASE_URL || 'http://127.0.0.1:5280'
const API = process.env.API_URL || 'http://127.0.0.1:3040'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@admin.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123'
const outDir = path.join('screenshots', 'testimonials-complete')

fs.mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } })

const login = await page.request.post(`${API}/api/admin/auth/login`, {
  data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
})
const { token } = await login.json()
await page.goto(`${WEB}/admin/login`, { waitUntil: 'networkidle' })
await page.evaluate((t) => localStorage.setItem('dm_admin_token', t), token)
await page.goto(`${WEB}/admin/content/testimonials`, { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)
await page.screenshot({ path: path.join(outDir, '01-cms-testimonials-list.png'), fullPage: true })

await page.goto(`${WEB}/`, { waitUntil: 'networkidle' })
await page.waitForTimeout(1000)
const hasSection = await page.locator('#testimonials').count()
await page.screenshot({ path: path.join(outDir, '02-homepage-testimonials-area.png'), fullPage: false })
// Scroll near where testimonials would be
await page.evaluate(() => {
  const el = document.querySelector('#testimonials') || document.querySelector('#insights') || document.querySelector('footer')
  el?.scrollIntoView({ block: 'center' })
})
await page.waitForTimeout(500)
await page.screenshot({ path: path.join(outDir, '02b-homepage-scroll-region.png'), fullPage: false })

await page.goto(`${WEB}/testimonials`, { waitUntil: 'networkidle' })
await page.waitForTimeout(800)
await page.screenshot({ path: path.join(outDir, '03-public-testimonials-page.png'), fullPage: true })

const pageText = await page.locator('.testimonials-page__empty, .content-page__empty, h1').allTextContents()
await browser.close()
console.log(JSON.stringify({ outDir, hasHomepageSection: hasSection > 0, pageText }, null, 2))
