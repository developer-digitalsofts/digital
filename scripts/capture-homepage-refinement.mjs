/**
 * Capture homepage refinement screenshots for visual approval.
 * Usage: node scripts/capture-homepage-refinement.mjs
 */
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:4173'
const OUT = 'screenshots/homepage-refinement'

async function scrollTo(page, selector) {
  const el = page.locator(selector).first()
  await el.waitFor({ state: 'visible', timeout: 15000 })
  await el.scrollIntoViewIfNeeded()
  await page.waitForTimeout(400)
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage()

  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })

  await page.setViewportSize({ width: 1920, height: 1080 })
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 90000 })
  await page.waitForSelector('#home', { timeout: 15000 })
  await page.waitForTimeout(800)

  await page.screenshot({ path: `${OUT}/01-full-desktop-1920x1080.png`, fullPage: true })

  await scrollTo(page, '#home')
  await page.screenshot({ path: `${OUT}/02-hero-1920x1080.png`, fullPage: false })

  await scrollTo(page, '#about')
  await page.screenshot({ path: `${OUT}/03-industries-1920x1080.png`, fullPage: false })

  await scrollTo(page, '#erp-modules')
  await page.screenshot({ path: `${OUT}/04-erp-modules-1920x1080.png`, fullPage: false })

  await scrollTo(page, '#modules')
  await page.screenshot({ path: `${OUT}/05-powerful-modules-1920x1080.png`, fullPage: false })

  await scrollTo(page, '#erp-modules')
  const modulesTop = await page.locator('#erp-modules').boundingBox()
  const powerfulTop = await page.locator('#modules').boundingBox()
  if (modulesTop && powerfulTop) {
    const y = Math.min(modulesTop.y, powerfulTop.y) - 40
    const height = Math.max(modulesTop.y + modulesTop.height, powerfulTop.y + powerfulTop.height) - y + 40
    await page.screenshot({
      path: `${OUT}/04-05-both-module-sections-1920x1080.png`,
      clip: { x: 0, y: Math.max(0, y), width: 1920, height: Math.min(height, 1080) },
    })
  }

  await scrollTo(page, '#testimonials')
  await page.screenshot({ path: `${OUT}/06-testimonials-demo-start-1920x1080.png`, fullPage: false })

  await scrollTo(page, '#personalized-demo')
  await page.screenshot({ path: `${OUT}/07-personalized-demo-1920x1080.png`, fullPage: false })

  await scrollTo(page, '#faqs')
  await page.screenshot({ path: `${OUT}/08-faq-footer-start-1920x1080.png`, fullPage: false })

  await scrollTo(page, '.dm-footer')
  await page.screenshot({ path: `${OUT}/09-footer-1920x1080.png`, fullPage: false })

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 90000 })
  await page.waitForTimeout(600)
  await page.screenshot({ path: `${OUT}/10-mobile-full-390x844.png`, fullPage: true })

  await browser.close()

  if (errors.length) {
    console.warn('Console errors:', errors.slice(0, 8))
  }
  console.log(`Screenshots saved to ${OUT}/`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
