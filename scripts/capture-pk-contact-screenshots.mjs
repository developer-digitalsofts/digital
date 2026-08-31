/**
 * Capture Pakistan contact verification screenshots.
 * Usage: node scripts/capture-pk-contact-screenshots.mjs [baseUrl]
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const BASE = (process.argv[2] || 'http://127.0.0.1:3041').replace(/\/$/, '')
const outDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'screenshots', 'pakistan-contact')

const pages = [
  { name: 'homepage-topbar-desktop', url: '/', width: 1440, height: 900 },
  { name: 'homepage-header-mobile', url: '/', width: 390, height: 844 },
  { name: 'contact-desktop', url: '/contact', width: 1440, height: 900 },
  { name: 'contact-mobile', url: '/contact', width: 390, height: 844 },
  { name: 'footer-desktop', url: '/', width: 1440, height: 900, fullPage: true },
  { name: 'whatsapp-desktop', url: '/', width: 1440, height: 900 },
  { name: 'faisalabad-desktop', url: '/faisalabad', width: 1440, height: 900 },
  { name: 'lahore-desktop', url: '/lahore', width: 1440, height: 900 },
  { name: 'karachi-desktop', url: '/karachi', width: 1440, height: 900 },
]

await fs.mkdir(outDir, { recursive: true })
const browser = await chromium.launch({ headless: true })

for (const pageDef of pages) {
  const context = await browser.newContext({ viewport: { width: pageDef.width, height: pageDef.height } })
  const page = await context.newPage()
  await page.goto(`${BASE}${pageDef.url}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)
  if (pageDef.name === 'whatsapp-desktop') {
    const fab = page.locator('button[aria-label*="WhatsApp"], button[aria-expanded]').last()
    if (await fab.count()) {
      await fab.click()
      await page.waitForTimeout(600)
    }
  }
  if (pageDef.name === 'homepage-header-mobile') {
    const menu = page.getByRole('button', { name: /menu|open navigation/i })
    if (await menu.count()) {
      await menu.first().click()
      await page.waitForTimeout(500)
    }
  }
  const file = path.join(outDir, `${pageDef.name}.png`)
  await page.screenshot({ path: file, fullPage: Boolean(pageDef.fullPage) })
  console.log('saved', file)
  await context.close()
}

await browser.close()
console.log(`Screenshots in ${outDir}`)
