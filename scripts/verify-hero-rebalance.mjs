/**
 * Hero rebalance visual checks at required breakpoints.
 * Usage: node scripts/verify-hero-rebalance.mjs
 */
import { chromium } from 'playwright'
import fs from 'fs'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:4173'
const OUT = 'screenshots/hero-carousel/rebalance-verify'
const WIDTHS = [1440, 1280, 1024, 768, 390]

fs.mkdirSync(OUT, { recursive: true })

async function inspect(page) {
  return page.evaluate(() => {
    const hero = document.querySelector('.dm-hero')
    const container = document.querySelector('.dm-hero__container')
    const copy = document.querySelector('.dm-hero__copy')
    const stack = document.querySelector('.dm-hero__right-stack')
    const nav = document.querySelector('.dm-hero__nav')
    const stage = document.querySelector('.dm-hero__dashboard-stage')
    const frame = document.querySelector('.dm-hero__dashboard-frame')
    const trust = document.querySelector('.home-section--trust-stats')
    const titleLines = [...document.querySelectorAll('.dm-hero__title-line')].map((el) => el.textContent?.trim())

    const r = (el) => (el ? el.getBoundingClientRect() : null)

    const heroR = r(hero)
    const copyR = r(copy)
    const stackR = r(stack)
    const navR = r(nav)
    const stageR = r(stage)
    const frameR = r(frame)
    const trustR = r(trust)

    const frameFullyVisible =
      frameR && frameR.top >= 0 && frameR.bottom <= window.innerHeight + 2 && frameR.height > 200

    const tabsAboveDashboard = navR && stageR ? navR.bottom <= stageR.top + 4 : false
    const tabsHorizontal = nav ? getComputedStyle(nav).flexDirection === 'row' : false

    const dashboardNotCropped =
      frame &&
      frame.scrollHeight <= frame.clientHeight + 2 &&
      frame.clientHeight > 0

    const overflowX = document.documentElement.scrollWidth > window.innerWidth + 1

    const heroHeight = heroR ? heroR.height : 0
    const headerBottom = document.querySelector('header')?.getBoundingClientRect().bottom ?? 0
    const heroContentTop = container?.getBoundingClientRect().top ?? 0
    const gapBelowHeader = heroContentTop - headerBottom

    const nextSectionVisible = trustR ? trustR.top < window.innerHeight : false

    return {
      titleLines,
      titleLineCount: titleLines.length,
      heroHeight,
      gapBelowHeader,
      frameHeight: frameR?.height,
      frameWidth: frameR?.width,
      tabsAboveDashboard,
      tabsHorizontal,
      dashboardNotCropped,
      frameFullyVisible,
      overflowX,
      nextSectionVisible,
      columnsBalanced: copyR && stackR ? Math.abs(copyR.top - stackR.top) < 80 : false,
    }
  })
}

async function main() {
  const browser = await chromium.launch()
  const results = []

  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } })
    await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForSelector('.dm-hero', { timeout: 15000 })
    await page.locator('.dm-hero__tab').filter({ hasText: 'Finance' }).first().click({ force: true })
    await page.waitForTimeout(400)

    const metrics = await inspect(page)
    await page.screenshot({ path: `${OUT}/hero-${width}.png`, fullPage: false })
    results.push({ width, ...metrics })
    await page.close()
  }

  await browser.close()

  console.log(JSON.stringify(results, null, 2))

  const failures = []
  for (const row of results) {
    if (row.overflowX) failures.push(`${row.width}px: horizontal overflow`)
    if (row.width >= 1024 && !row.tabsHorizontal) failures.push(`${row.width}px: tabs not horizontal`)
    if (row.width >= 1024 && !row.tabsAboveDashboard) failures.push(`${row.width}px: tabs not above dashboard`)
    if (row.width >= 1280 && row.titleLineCount > 3) failures.push(`${row.width}px: title has ${row.titleLineCount} lines`)
    if (row.width >= 1280 && row.gapBelowHeader > 100) failures.push(`${row.width}px: excessive header gap (${row.gapBelowHeader}px)`)
    if (row.width >= 1280 && row.heroHeight > 780) failures.push(`${row.width}px: hero too tall (${row.heroHeight}px)`)
    if (!row.dashboardNotCropped) failures.push(`${row.width}px: dashboard appears cropped`)
  }

  if (failures.length) {
    console.error('FAILURES:\n' + failures.map((f) => `- ${f}`).join('\n'))
    process.exit(1)
  }

  console.log('All hero rebalance checks passed.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
