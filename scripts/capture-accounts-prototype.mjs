/**
 * Capture Accounts & Finance approved-layout screenshots (desktop + mobile).
 * Usage: node scripts/capture-accounts-prototype.mjs
 */
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:5280'
const OUT = 'screenshots/accounts-prototype'
const PATH = '/software/accounts-management-software'

async function capture(page, name, width, height, fullPage = true) {
  await page.setViewportSize({ width, height })
  await page.goto(`${BASE}${PATH}`, { waitUntil: 'networkidle', timeout: 120000 })
  await page.waitForTimeout(1500)
  await page.screenshot({ path: `${OUT}/${name}`, fullPage })
  console.log(`Saved ${OUT}/${name}`)
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await capture(page, 'accounts-finance-desktop-1440.png', 1440, 900)
  await capture(page, 'accounts-finance-mobile-390.png', 390, 844)
  await browser.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
