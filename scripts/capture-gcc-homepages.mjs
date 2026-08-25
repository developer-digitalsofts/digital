/**
 * Capture screenshots of all six GCC English homepages + CMS country matrix.
 * Output: screenshots/gcc-localized-homepages/
 */
import { mkdir, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT = path.join(ROOT, 'screenshots', 'gcc-localized-homepages')
const BASE = process.env.BASE_URL || 'http://127.0.0.1:5280'
const API = process.env.API_URL || 'http://127.0.0.1:3040'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@admin.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123'

const HOMEPAGES = [
  { file: '01-uae-home-1440.png', url: `${BASE}/`, label: 'UAE', currency: 'AED' },
  { file: '02-saudi-home-1440.png', url: `${BASE}/sa/en`, label: 'Saudi', currency: 'SAR' },
  { file: '03-qatar-home-1440.png', url: `${BASE}/qa/en`, label: 'Qatar', currency: 'QAR' },
  { file: '04-oman-home-1440.png', url: `${BASE}/om/en`, label: 'Oman', currency: 'OMR' },
  { file: '05-kuwait-home-1440.png', url: `${BASE}/kw/en`, label: 'Kuwait', currency: 'KWD' },
  { file: '06-bahrain-home-1440.png', url: `${BASE}/bh/en`, label: 'Bahrain', currency: 'BHD' },
]

async function adminToken() {
  const login = await fetch(`${API}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })
  const { token } = await login.json()
  return token
}

async function shot(page, filename, opts = {}) {
  const filePath = path.join(OUT, filename)
  await page.screenshot({ path: filePath, ...opts })
  const info = await stat(filePath)
  console.log(`  ✓ ${filename} (${info.size} bytes)`)
  return filePath
}

async function main() {
  await mkdir(OUT, { recursive: true })
  console.log(`Output: ${OUT}`)

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

  for (const home of HOMEPAGES) {
    console.log(`Capturing ${home.label}…`)
    await page.goto(home.url, { waitUntil: 'domcontentloaded', timeout: 90000 })
    await page.waitForTimeout(2000)
    const html = await page.content()
    if (home.currency && !html.includes(home.currency)) {
      console.warn(`  ⚠ Expected currency ${home.currency} not found in page HTML`)
    }
    if (home.label !== 'UAE' && (html.includes('>AED<') || html.includes('Dubai, Abu Dhabi'))) {
      console.warn(`  ⚠ Possible UAE content leak on ${home.label} homepage`)
    }
    await shot(page, home.file, { fullPage: true })
  }

  const token = await adminToken()
  await page.goto(`${BASE}/admin/login`, { waitUntil: 'domcontentloaded' })
  await page.evaluate((t) => localStorage.setItem('dm_admin_token', t), token)
  await page.goto(`${BASE}/admin/content/countries`, { waitUntil: 'domcontentloaded', timeout: 90000 })
  await page.waitForTimeout(1500)
  await shot(page, '07-cms-country-matrix-1440.png', { fullPage: true })

  await page.goto(`${BASE}/admin/pages/home`, { waitUntil: 'domcontentloaded', timeout: 90000 })
  await page.waitForTimeout(1000)
  const countrySelect = page.locator('select').filter({ has: page.locator('option[value="sa"]') }).first()
  if (await countrySelect.count()) {
    await countrySelect.selectOption('sa')
    await page.waitForTimeout(800)
    await shot(page, '08-saudi-cms-hero-record-1440.png')
  }

  await browser.close()
  console.log(`\nScreenshots saved to ${OUT}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
