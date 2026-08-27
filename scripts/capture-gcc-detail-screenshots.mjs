/**
 * Capture CRM software detail pages for all six GCC countries.
 * Usage: node scripts/capture-gcc-detail-screenshots.mjs [baseUrl]
 */
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'

const BASE = (process.env.BASE_URL || process.argv[2] || 'http://127.0.0.1:3040').replace(/\/$/, '')
const OUT = 'screenshots/gcc-detail-localization'

const ROUTES = [
  { code: 'AE', path: '/software/crm-software', currency: 'AED', city: 'Dubai' },
  { code: 'SA', path: '/sa/en/software/crm-software', currency: 'SAR', city: 'Riyadh' },
  { code: 'QA', path: '/qa/en/software/crm-software', currency: 'QAR', city: 'Doha' },
  { code: 'OM', path: '/om/en/software/crm-software', currency: 'OMR', city: 'Muscat' },
  { code: 'KW', path: '/kw/en/software/crm-software', currency: 'KWD', city: 'Kuwait City' },
  { code: 'BH', path: '/bh/en/software/crm-software', currency: 'BHD', city: 'Manama' },
]

const INDUSTRY_ROUTES = [
  { code: 'SA', path: '/sa/en/software/industry/petrol-pump-software', currency: 'SAR', city: 'Riyadh' },
  { code: 'BH', path: '/bh/en/software/industry/petrol-pump-software', currency: 'BHD', city: 'Manama' },
]

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const checks = []

  for (const route of [...ROUTES, ...INDUSTRY_ROUTES]) {
    await page.goto(`${BASE}${route.path}`, { waitUntil: 'networkidle', timeout: 90000 })
    await page.waitForSelector('h1, main', { timeout: 20000 }).catch(() => {})
    const mainText = await page.locator('main').innerText().catch(() => '')
    const hasCurrency = mainText.includes(route.currency)
    const hasCity = mainText.includes(route.city)
    const uaeLeak = ['Dubai Holdings', 'Emirates Supplies'].some((s) => mainText.includes(s))
    const forbidden =
      route.code === 'AE'
        ? false
        : ['AED', 'Dubai', 'Abu Dhabi', 'Sharjah'].some((s) => mainText.includes(s))
    checks.push({
      route: route.path,
      hasCurrency,
      hasCity,
      uaeLeak: route.code !== 'AE' && uaeLeak,
      forbiddenUae: route.code !== 'AE' && forbidden,
    })
    const name = route.path.replace(/^\//, '').replace(/\//g, '-')
    await page.screenshot({ path: `${OUT}/${name}-1440x900.png`, fullPage: false })
    console.log(`${hasCurrency && hasCity && !forbidden ? '✓' : '✗'} ${route.path}`)
  }

  await browser.close()
  console.log(`\nScreenshots saved to ${OUT}/`)
  console.log(JSON.stringify(checks, null, 2))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
