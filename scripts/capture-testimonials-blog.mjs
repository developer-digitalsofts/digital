/**
 * Capture testimonials + blog verification screenshots.
 * Usage: node scripts/capture-testimonials-blog.mjs
 */
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:5280'
const OUT = 'screenshots/testimonials-blog-verify'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@admin.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123'

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

  // Homepage — scroll to modules / demo area (testimonials hidden when no published items)
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 90000 })
  await page.waitForSelector('#home', { timeout: 15000 })
  const hasTestimonials = await page.locator('#testimonials').count()
  if (hasTestimonials) {
    await page.locator('#testimonials').scrollIntoViewIfNeeded()
    await page.waitForTimeout(500)
    await page.screenshot({ path: `${OUT}/01-homepage-testimonials-1440.png` })
  } else {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.55))
    await page.waitForTimeout(600)
    await page.screenshot({ path: `${OUT}/01-homepage-no-fake-testimonials-1440.png` })
  }

  // Blog preview section if visible
  const insights = page.locator('#insights')
  if (await insights.count()) {
    await insights.scrollIntoViewIfNeeded()
    await page.waitForTimeout(400)
    await page.screenshot({ path: `${OUT}/01b-homepage-insights-preview-1440.png` })
  }

  await page.goto(`${BASE}/testimonials`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  await page.screenshot({ path: `${OUT}/02-testimonials-page-1440.png`, fullPage: true })

  await page.goto(`${BASE}/blog`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  await page.screenshot({ path: `${OUT}/03-blog-listing-1440.png`, fullPage: true })

  await page.goto(`${BASE}/blog/uae-inventory-accuracy-across-branches`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(600)
  await page.screenshot({ path: `${OUT}/04-blog-detail-1440.png`, fullPage: true })

  // Admin CMS
  await page.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle' })
  const loginRes = await page.request.post(`${BASE.replace(/\/$/, '')}/api/admin/auth/login`, {
    data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  })
  if (!loginRes.ok()) throw new Error(`Admin login failed: ${loginRes.status()}`)
  const loginJson = await loginRes.json()
  await page.evaluate((token) => {
    localStorage.setItem('dm_admin_token', token)
  }, loginJson.token)
  await page.goto(`${BASE}/admin/content/testimonials`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  await page.screenshot({ path: `${OUT}/05-cms-testimonials-1440.png`, fullPage: true })

  await page.goto(`${BASE}/admin/content/blog`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  await page.screenshot({ path: `${OUT}/06-cms-blog-list-1440.png`, fullPage: true })

  await page.goto(`${BASE}/admin/content/blog/post-uae-inventory-guide/edit`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  await page.screenshot({ path: `${OUT}/07-cms-blog-editor-1440.png`, fullPage: true })

  await browser.close()
  console.log(`Screenshots saved to ${OUT}/`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
