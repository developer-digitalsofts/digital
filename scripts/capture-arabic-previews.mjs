/**
 * Capture Arabic homepage preview screenshots for all six GCC countries.
 * Output: screenshots/arabic-localized-previews/
 */
import { mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'screenshots', 'arabic-localized-previews')
const BASE = process.env.BASE_URL || 'http://127.0.0.1:5280'
const API = process.env.API_URL || 'http://127.0.0.1:3040'

const ROUTES = [
  { file: '01-uae-ar-1440.png', url: `${BASE}/ae/ar`, currency: 'AED', country: 'AE', label: 'UAE' },
  { file: '02-saudi-ar-1440.png', url: `${BASE}/sa/ar`, currency: 'SAR', country: 'SA', label: 'Saudi' },
  { file: '03-qatar-ar-1440.png', url: `${BASE}/qa/ar`, currency: 'QAR', country: 'QA', label: 'Qatar' },
  { file: '04-oman-ar-1440.png', url: `${BASE}/om/ar`, currency: 'OMR', country: 'OM', label: 'Oman' },
  { file: '05-kuwait-ar-1440.png', url: `${BASE}/kw/ar`, currency: 'KWD', country: 'KW', label: 'Kuwait' },
  { file: '06-bahrain-ar-1440.png', url: `${BASE}/bh/ar`, currency: 'BHD', country: 'BH', label: 'Bahrain' },
]

async function shot(page, filename, opts = {}) {
  const filePath = path.join(OUT, filename)
  await page.screenshot({ path: filePath, ...opts })
  const info = await stat(filePath)
  console.log(`  ✓ ${filename} (${info.size} bytes)`)
}

async function main() {
  await mkdir(OUT, { recursive: true })
  console.log(`Output: ${OUT}`)

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

  for (const route of ROUTES) {
    console.log(`Capturing ${route.label} Arabic…`)
    await page.goto(route.url, { waitUntil: 'domcontentloaded', timeout: 90000 })
    await page.waitForTimeout(2000)

    const dir = await page.evaluate(() => document.documentElement.getAttribute('dir'))
    if (dir !== 'rtl') console.warn(`  ⚠ Expected dir=rtl, got ${dir}`)

    const home = await fetch(`${API}/api/homepage?country=${route.country}&lang=ar`).then((r) => r.json())
    if (home.meta?.locale?.noIndex !== true) console.warn(`  ⚠ Expected noIndex for Arabic draft`)
    if (home.meta?.locale?.fallbackUsed === true) console.warn(`  ⚠ UAE fallback still active`)

    const html = await page.content()
    if (!html.includes(route.currency)) console.warn(`  ⚠ Currency ${route.currency} not found`)

    await shot(page, route.file, { fullPage: true })
  }

  await browser.close()
  console.log(`\nScreenshots saved to ${OUT}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
