/**
 * Capture targeted homepage fix screenshots.
 * Usage: node scripts/capture-four-fixes.mjs
 */
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:4173'
const OUT = 'screenshots/homepage-four-fixes'

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })

  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 90000 })
  await page.waitForSelector('#home', { timeout: 15000 })

  await page.locator('#home').scrollIntoViewIfNeeded()
  await page.waitForTimeout(600)
  await page.screenshot({ path: `${OUT}/01-hero-erp-1920x1080.png` })

  const dash = await page.evaluate(() => {
    const frame = document.querySelector('.dm-hero__dashboard-frame')
    if (!frame) return null
    const r = frame.getBoundingClientRect()
    const style = window.getComputedStyle(frame)
    return {
      rendered: { width: Math.round(r.width), height: Math.round(r.height) },
      css: { width: style.width, height: style.height },
    }
  })

  await page.locator('.dm-hero__tab').filter({ hasText: 'POS' }).first().click({ force: true })
  await page.waitForTimeout(700)
  await page.screenshot({ path: `${OUT}/02-hero-pos-1920x1080.png` })

  await page.locator('#about').scrollIntoViewIfNeeded()
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${OUT}/03-homepage-industries-1920x1080.png` })

  await page.goto(`${BASE}/industries`, { waitUntil: 'networkidle' })
  await page.waitForSelector('.industries-page__grid', { timeout: 15000 })
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${OUT}/04-full-industries-page-1920x1080.png`, fullPage: true })

  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.locator('#modules').scrollIntoViewIfNeeded()
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${OUT}/05-powerful-modules-1920x1080.png` })

  await page.locator('#testimonials').scrollIntoViewIfNeeded()
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${OUT}/06-testimonials-1920x1080.png` })

  const quoteSize = await page.evaluate(() => {
    const q = document.querySelector('.dm-testimonials__quote')
    if (!q) return null
    return window.getComputedStyle(q).fontSize
  })

  const moduleCols = await page.evaluate(() => {
    const grid = document.querySelector('.powerful-modules-editorial__grid')
    if (!grid) return null
    return window.getComputedStyle(grid).gridTemplateColumns.split(' ').length
  })

  const industryCount = await page.goto(`${BASE}/industries`).then(async () => {
    await page.waitForSelector('.industry-card')
    return page.locator('.industry-card').count()
  })

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${OUT}/07-mobile-homepage-390x844.png`, fullPage: true })

  await browser.close()

  console.log('Screenshots saved to', OUT)
  console.log('Hero dashboard dimensions:', dash)
  console.log('Testimonial font size:', quoteSize)
  console.log('Powerful modules columns at 1920:', moduleCols)
  console.log('Published industries rendered:', industryCount)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
