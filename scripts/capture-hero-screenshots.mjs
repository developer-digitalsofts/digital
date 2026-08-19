/**
 * Capture hero carousel screenshots for visual verification.
 * Usage: node scripts/capture-hero-screenshots.mjs
 */
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:5280'
const OUT = 'screenshots/hero-carousel/rebuild-final'

const VIEWPORTS = [
  { name: 'desktop-1920x1080', width: 1920, height: 1080 },
  { name: 'desktop-1440x900', width: 1440, height: 900 },
  { name: 'tablet-1024x768', width: 1024, height: 768 },
  { name: 'mobile-390x844', width: 390, height: 844 },
]

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage()

  for (const vp of VIEWPORTS) {
    await page.setViewportSize({ width: vp.width, height: vp.height })
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForSelector('#home', { timeout: 15000 })
    await page.waitForTimeout(500)
    await page.screenshot({ path: `${OUT}/${vp.name}.png`, fullPage: false })
  }

  await page.setViewportSize({ width: 1920, height: 1080 })
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForSelector('#home', { timeout: 15000 })

  const modules = ['ERP', 'Finance', 'Inventory', 'POS', 'HR']
  for (const mod of modules) {
    const tab = page.getByRole('tab', { name: new RegExp(`Go to ${mod}`, 'i') }).first()
    await tab.click()
    await page.waitForTimeout(650)
    await page.screenshot({ path: `${OUT}/slide-${mod.toLowerCase()}-1920x1080.png`, fullPage: false })
  }

  await page.getByRole('button', { name: /Book Free Demo/i }).first().click()
  await page.waitForSelector('[role="dialog"]', { timeout: 5000 })
  await page.screenshot({ path: `${OUT}/get-demo-modal-desktop.png`, fullPage: false })

  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))
  console.log('Horizontal overflow check (1920):', overflow.scrollWidth <= overflow.clientWidth ? 'OK' : 'OVERFLOW')

  await browser.close()
  console.log(`Screenshots saved to ${OUT}/`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
