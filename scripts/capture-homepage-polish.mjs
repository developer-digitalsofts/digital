/**
 * Capture homepage visual-polish pass screenshots.
 * Usage: node scripts/capture-homepage-polish.mjs
 */
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:4173'
const OUT = 'screenshots/homepage-polish'

async function scrollTo(page, selector) {
  const el = page.locator(selector).first()
  await el.waitFor({ state: 'visible', timeout: 15000 })
  await el.scrollIntoViewIfNeeded()
  await page.waitForTimeout(450)
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage()

  await page.setViewportSize({ width: 1920, height: 1080 })
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 90000 })
  await page.waitForSelector('#home', { timeout: 15000 })
  await page.waitForTimeout(900)

  await page.screenshot({ path: `${OUT}/01-full-desktop-1920x1080.png`, fullPage: true })

  await scrollTo(page, '#home')
  await page.screenshot({ path: `${OUT}/02-hero-progress-1920x1080.png`, fullPage: false })

  await scrollTo(page, '#modules')
  await page.screenshot({ path: `${OUT}/03-powerful-modules-1920x1080.png`, fullPage: false })

  await scrollTo(page, '#testimonials')
  await page.screenshot({ path: `${OUT}/04-testimonials-1920x1080.png`, fullPage: false })

  await scrollTo(page, '#personalized-demo')
  await page.screenshot({ path: `${OUT}/05-demo-faq-start-1920x1080.png`, fullPage: false })

  await scrollTo(page, '#faqs')
  await page.screenshot({ path: `${OUT}/06-faq-1920x1080.png`, fullPage: false })

  await scrollTo(page, '.dm-footer')
  await page.screenshot({ path: `${OUT}/07-footer-1920x1080.png`, fullPage: false })

  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 90000 })
  await page.waitForTimeout(700)
  await page.screenshot({ path: `${OUT}/08-mobile-full-390x844.png`, fullPage: true })

  await browser.close()
  console.log(`Saved screenshots to ${OUT}/`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
