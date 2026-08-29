/**
 * Browser UI checks for Pakistan city homepage layout.
 * Usage: node scripts/verify-pk-city-ui.mjs [baseUrl]
 */
import { chromium } from 'playwright'

const BASE = (process.argv[2] || process.env.BASE_URL || 'http://127.0.0.1:3040').replace(/\/$/, '')
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
]
const failures = []

function fail(label, detail) {
  failures.push(`${label}: ${detail}`)
}

async function inspect(page) {
  return page.evaluate(() => {
    const headerSelect = document.querySelector('header .dm-locale-select, .dm-header__actions .dm-locale-select')
    const footerSelect = document.querySelector('footer .dm-locale-select, .dm-footer__city-select')
    const cityLabel = [...document.querySelectorAll('header span, header label, footer span, footer label')].some(
      (el) => el.textContent?.trim() === 'City',
    )
    const trust = document.querySelector('.dm-trust-stats, .home-section--trust-stats, .dm-trust-stats__bar')
    const nav = document.querySelector('.dm-hero__nav')
    const stage = document.querySelector('.dm-hero__dashboard-stage, .dm-hero__dashboard-frame')
    const search = document.querySelector('.dm-header__search-btn, header [aria-label="Search"]')
    const demo = document.querySelector('.dm-header__demo-btn, header button')
    const r = (el) => (el ? el.getBoundingClientRect() : null)
    const navR = r(nav)
    const stageR = r(stage)
    const overlap =
      navR && stageR ? !(navR.bottom <= stageR.top + 2 || navR.top >= stageR.bottom - 2) : false
    const tabsBelow = navR && stageR ? navR.top >= stageR.bottom - 4 : false
    return {
      headerSelect: Boolean(headerSelect),
      footerSelect: Boolean(footerSelect),
      cityLabel,
      trust: Boolean(trust),
      tabsBelow,
      overlap,
      hasSearch: Boolean(search),
      hasDemo: Boolean(demo),
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
      hero: Boolean(document.querySelector('.dm-hero, h1')),
      industries: Boolean(document.querySelector('#about, .home-section--industries, [class*="industry"]')),
    }
  })
}

async function main() {
  console.log(`Pakistan city UI verification against ${BASE}`)
  const browser = await chromium.launch()

  for (const path of ['/', '/faisalabad', '/lahore', '/gujranwala']) {
    for (const viewport of VIEWPORTS) {
      const page = await browser.newPage({ viewport })
      await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle', timeout: 45000 })
      await page.waitForSelector('.dm-hero, h1', { timeout: 20000 })
      const metrics = await inspect(page)
      const label = `${path} ${viewport.name}`
      if (metrics.headerSelect || metrics.cityLabel) fail(label, 'header city selector still visible')
      if (metrics.footerSelect) fail(label, 'footer city selector still visible')
      if (metrics.trust) fail(label, 'dark-blue trust strip still visible')
      if (metrics.overlap) fail(label, 'module cards overlap dashboard image')
      if (!metrics.tabsBelow) fail(label, 'module cards are not below the dashboard image')
      if (!metrics.hasSearch || !metrics.hasDemo) fail(label, 'Search or Get Demo missing')
      if (metrics.overflowX) fail(label, 'horizontal overflow')
      if (!metrics.hero) fail(label, 'missing hero')

      if (path === '/faisalabad' && viewport.name === 'desktop') {
        const finance = page.locator('.dm-hero__tab').filter({ hasText: 'Finance' }).first()
        if (await finance.count()) {
          await finance.click()
          await page.waitForTimeout(400)
          const selected = await page.locator('.dm-hero__tab--active').first().innerText()
          if (!/finance/i.test(selected)) fail(label, 'module tab interaction did not activate Finance')
        } else {
          fail(label, 'Finance module tab missing')
        }
      }
      await page.close()
    }
  }

  const cities = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await cities.goto(`${BASE}/cities`, { waitUntil: 'networkidle', timeout: 45000 })
  const cityLinks = await cities.locator('main a[href^="/"]').evaluateAll((els) => els.map((el) => el.getAttribute('href')))
  for (const slug of ['faisalabad', 'lahore', 'karachi', 'gujranwala']) {
    if (!cityLinks.includes(`/${slug}`)) fail('/cities UI', `missing link /${slug}`)
  }
  await cities.close()
  await browser.close()

  if (failures.length) {
    console.error('FAILED')
    for (const row of failures) console.error(` - ${row}`)
    process.exit(1)
  }
  console.log('OK — header/footer selectors absent, trust strip absent, module cards below dashboard')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
