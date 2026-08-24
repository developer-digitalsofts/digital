/**
 * Capture CMS blog list, public /blog, and one detail page after publish.
 */
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const WEB = process.env.BASE_URL || 'http://127.0.0.1:5280'
const API = process.env.API_URL || 'http://127.0.0.1:3040'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@admin.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123'
const outDir = path.join('screenshots', 'blog-publish-eight')

fs.mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } })

const login = await page.request.post(`${API}/api/admin/auth/login`, {
  data: { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
})
const { token } = await login.json()
if (!token) throw new Error('Admin login failed for screenshots')

await page.goto(`${WEB}/admin/login`, { waitUntil: 'networkidle' })
await page.evaluate((t) => localStorage.setItem('dm_admin_token', t), token)
await page.goto(`${WEB}/admin/content/blog`, { waitUntil: 'networkidle' })
await page.waitForTimeout(1200)
await page.screenshot({ path: path.join(outDir, '01-cms-blog-list-published.png'), fullPage: true })

await page.goto(`${WEB}/blog`, { waitUntil: 'networkidle' })
await page.waitForSelector('.blog-list__grid, .blog-list__featured', { timeout: 15000 })
await page.waitForTimeout(800)
await page.screenshot({ path: path.join(outDir, '02-public-blog-listing.png'), fullPage: true })

await page.goto(`${WEB}/blog/what-is-cloud-erp-growing-businesses`, { waitUntil: 'networkidle' })
await page.waitForSelector('h1', { timeout: 15000 })
await page.waitForTimeout(800)
await page.screenshot({ path: path.join(outDir, '03-blog-detail-cloud-erp.png'), fullPage: true })

const checks = await page.evaluate(() => {
  const scripts = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => s.textContent || '')
  return {
    title: document.querySelector('h1')?.textContent?.trim(),
    faqCount: document.querySelectorAll('.blog-article__faq-item').length,
    tocLinks: document.querySelectorAll('.blog-article__toc a').length,
    hasArticleLd: scripts.some((t) => t.includes('BlogPosting') || t.includes('Article')),
    hasBreadcrumbLd: scripts.some((t) => t.includes('BreadcrumbList')),
    hasFaqLd: scripts.some((t) => t.includes('FAQPage')),
    bodyParagraphs: document.querySelectorAll('.blog-article__body p').length,
  }
})

await browser.close()
console.log(JSON.stringify({ outDir, checks }, null, 2))
