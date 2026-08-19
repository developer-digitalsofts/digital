/**
 * Capture Powerful Modules editorial section at 1920×900 + measurements.
 * Usage: node scripts/capture-powerful-modules.mjs
 */
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:5280'
const OUT = 'screenshots/powerful-modules'

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.setViewportSize({ width: 1920, height: 900 })
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForSelector('#modules', { timeout: 15000 })
  await page.locator('#modules').scrollIntoViewIfNeeded()
  await page.waitForTimeout(600)

  const measurements = await page.evaluate(() => {
    const cards = [...document.querySelectorAll('.powerful-module-editorial-card')]
    return cards.map((card, index) => {
      const rect = card.getBoundingClientRect()
      return {
        card: index + 1,
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        top: Math.round(rect.top),
        bottom: Math.round(rect.bottom),
      }
    })
  })

  console.table(measurements)

  const container = await page.evaluate(() => {
    const el = document.querySelector('.powerful-modules-editorial__container')
    const rect = el?.getBoundingClientRect()
    return rect
      ? {
          width: Math.round(rect.width),
          left: Math.round(rect.left),
          right: Math.round(window.innerWidth - rect.right),
        }
      : null
  })
  console.log('Container:', container)

  await page.locator('#modules').screenshot({ path: `${OUT}/implementation-1920x900.png` })

  await browser.close()
  console.log(`Screenshot saved to ${OUT}/implementation-1920x900.png`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
