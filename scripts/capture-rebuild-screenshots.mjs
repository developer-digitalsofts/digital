/**
 * Capture hero carousel redesign screenshots.
 * Usage: node scripts/capture-rebuild-screenshots.mjs
 */
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:5280'
const OUT = 'screenshots/hero-carousel/rebuild-final'
const MODULES = ['ERP', 'Finance', 'Inventory', 'POS', 'HR']

async function captureSlides(page, viewport, suffix) {
  await page.setViewportSize(viewport)
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForSelector('#home', { timeout: 15000 })
  await page.locator('#home').scrollIntoViewIfNeeded()
  await page.waitForSelector('.dm-hero__tab', { timeout: 15000 })
  await page.waitForTimeout(500)

  for (const mod of MODULES) {
    const tab = page.locator('.dm-hero__tab').filter({ hasText: mod }).first()
    await tab.click({ force: true })
    await page.waitForTimeout(900)
    await page.screenshot({ path: `${OUT}/slide-${mod.toLowerCase()}-${suffix}.png`, fullPage: false })
  }
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage()

  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })

  await captureSlides(page, { width: 1920, height: 900 }, '1920x900')
  await captureSlides(page, { width: 1440, height: 900 }, '1440x900')
  await page.setViewportSize({ width: 1024, height: 768 })
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.screenshot({ path: `${OUT}/tablet-1024x768.png` })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.locator('#home').scrollIntoViewIfNeeded()
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${OUT}/mobile-390x844.png` })

  await browser.close()

  if (errors.length) {
    console.warn('Console errors:', errors.slice(0, 5))
  }
  console.log(`Screenshots saved to ${OUT}/`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
