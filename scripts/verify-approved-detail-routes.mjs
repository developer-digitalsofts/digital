/**
 * Verify approved detail layout on live routes.
 */
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:5280'
const OUT = 'screenshots/approved-detail-live'

const ROUTES = [
  { path: '/software/accounts-management-software', name: 'accounts', template: 'module' },
  { path: '/software/inventory-management-software', name: 'inventory', template: 'module' },
  { path: '/software/production-management-software', name: 'production', template: 'module' },
  { path: '/software/industry/petrol-pump-software', name: 'petrol-pump', template: 'industry' },
  { path: '/software/industry/petrol-gas-filling-station-software', name: 'petrol-filling', template: 'industry' },
  { path: '/software/industry/garments-manufacturing-software', name: 'garments', template: 'industry' },
  { path: '/software/industry/fuel-tank-lorry-management-software', name: 'fuel-tank', template: 'industry' },
]

const MARKER = {
  module: 'data-module-detail',
  industry: 'data-industry-detail',
}

async function inspectPage(page, template) {
  const marker = MARKER[template]
  return page.evaluate((attr) => {
      const main = document.querySelector(`main[${attr}]`)
      const isModule = attr === 'data-module-detail'
      const isIndustry = attr === 'data-industry-detail'
      return {
        template: isModule ? 'module' : isIndustry ? 'industry' : null,
        slug: main?.getAttribute('data-detail-slug') ?? null,
        legacyPremium: !!document.querySelector('main:not([data-module-detail]):not([data-industry-detail]) .card-accent-hover'),
        legacyApproved: !!document.querySelector('main[data-approved-detail]'),
        h1: document.querySelector('h1')?.textContent?.slice(0, 80) ?? null,
        sections: isModule
          ? {
              hero: !!document.querySelector('.mod-hero'),
              metrics: !!document.querySelector('.mod-metrics'),
              workflow: !!document.querySelector('.mod-workflow'),
            }
          : {
              hero: !!document.querySelector('.ind-hero'),
              metrics: !!document.querySelector('.ind-metrics'),
              workflow: !!document.querySelector('.ind-workflow'),
              operational: !!document.querySelector('.ind-op-cards'),
              compare: !!document.querySelector('.ind-compare'),
              dashboard: !!document.querySelector('.ind-dashboard-showcase'),
              analytics: !!document.querySelector('.ind-analytics'),
              testimonial: !!document.querySelector('.ind-testimonial'),
            },
      }
    }, marker)
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const page = await browser.newPage()
  const failures = []

  for (const route of ROUTES) {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(`${BASE}${route.path}`, { waitUntil: 'networkidle', timeout: 120000 })
    const selector = `[${MARKER[route.template]}]`
    try {
      await page.waitForSelector(selector, { timeout: 30000 })
    } catch {
      failures.push(`${route.path} — missing ${selector} layout marker`)
      continue
    }
    const info = await inspectPage(page, route.template)
    console.log(route.path, JSON.stringify(info, null, 2))
    if (info.template !== route.template) {
      failures.push(`${route.path} — expected ${route.template}, got ${info.template}`)
    }
    if (info.legacyPremium) {
      failures.push(`${route.path} — legacy PremiumSoftwareDetailView detected`)
    }
    if (info.legacyApproved) {
      failures.push(`${route.path} — legacy ApprovedDetailPageView still active`)
    }
    await page.screenshot({ path: `${OUT}/${route.name}-desktop-1440.png`, fullPage: true })
  }

  await browser.close()
  if (failures.length) {
    console.error('FAILURES:\n' + failures.join('\n'))
    process.exit(1)
  }
  console.log(`Verified ${ROUTES.length} routes — all use approved layout.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
