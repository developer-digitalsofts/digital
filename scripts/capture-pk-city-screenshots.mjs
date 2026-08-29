/**
 * Capture Pakistan homepage, city pages, header/footer, hero, and /cities screenshots.
 * Usage: node scripts/capture-pk-city-screenshots.mjs [baseUrl]
 */
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'

const BASE = (process.env.BASE_URL || process.argv[2] || 'http://127.0.0.1:3040').replace(/\/$/, '')
const OUT = 'screenshots/pakistan-cities'

async function revealPage(page) {
  await page.evaluate(async () => {
    const step = 700
    const max = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight)
    for (let y = 0; y < max; y += step) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 80))
    }
    window.scrollTo(0, 0)
    await new Promise((r) => setTimeout(r, 200))
  })
}

async function assertCleanChrome(page, path) {
  const headerSelect = await page.locator('header .dm-locale-select, .dm-header__actions .dm-locale-select').count()
  const footerSelect = await page.locator('footer .dm-locale-select, .dm-footer__city-select').count()
  const trust = await page.locator('.dm-trust-stats, .home-section--trust-stats').count()
  if (headerSelect) throw new Error(`${path}: header city selector still present`)
  if (footerSelect) throw new Error(`${path}: footer city selector still present`)
  if (trust) throw new Error(`${path}: trust strip still present`)
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()

  const shots = [
    { path: '/', name: 'homepage-desktop', width: 1440, height: 900 },
    { path: '/faisalabad', name: 'faisalabad-desktop', width: 1440, height: 900 },
    { path: '/lahore', name: 'lahore-desktop', width: 1440, height: 900 },
    { path: '/gujranwala', name: 'gujranwala-desktop', width: 1440, height: 900 },
    { path: '/faisalabad', name: 'faisalabad-tablet', width: 768, height: 1024 },
    { path: '/faisalabad', name: 'faisalabad-mobile', width: 390, height: 844 },
    { path: '/cities', name: 'cities-index', width: 1440, height: 900 },
  ]

  for (const shot of shots) {
    const page = await browser.newPage({ viewport: { width: shot.width, height: shot.height } })
    await page.goto(`${BASE}${shot.path}`, { waitUntil: 'networkidle', timeout: 45000 })
    await page.waitForSelector('header, h1', { timeout: 20000 })
    if (shot.path !== '/cities') await assertCleanChrome(page, shot.path)
    await revealPage(page)
    const file = `${OUT}/${shot.name}.png`
    await page.screenshot({ path: file, fullPage: true })
    console.log(`saved ${file}`)

    if (shot.name === 'faisalabad-desktop') {
      await page.locator('header').first().screenshot({ path: `${OUT}/header-no-city-selector.png` })
      await page.locator('.dm-hero').first().screenshot({ path: `${OUT}/hero-dashboard-unobstructed.png` })
      await page.locator('.dm-hero__right-stack').first().screenshot({ path: `${OUT}/module-cards-below-image.png` })
      const afterHero = page.locator('main > *:nth-child(2), .home-section--industries, #about').first()
      if (await afterHero.count()) {
        await afterHero.screenshot({ path: `${OUT}/after-trust-strip-removed.png` })
      }
      console.log('saved header/hero/module/after-strip crops')
    }
    if (shot.name === 'homepage-desktop') {
      await page.locator('footer').first().screenshot({ path: `${OUT}/footer-no-city-selector.png` })
      console.log(`saved ${OUT}/footer-no-city-selector.png`)
    }
    await page.close()
  }

  await browser.close()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
