/**
 * Homepage visual verification screenshots + header layout checks.
 * Usage: node scripts/capture-homepage-visuals.mjs [baseUrl]
 */
import { chromium } from 'playwright'
import fs from 'fs'

const BASE = (process.argv[2] || process.env.BASE_URL || 'http://127.0.0.1:3040').replace(/\/$/, '')
const OUT = 'screenshots/homepage-visual-fix'
const WIDTHS = [1440, 1366, 1024, 390]

fs.mkdirSync(OUT, { recursive: true })

async function inspectHeader(page) {
  return page.evaluate(() => {
    const bar = document.querySelector('.dm-header__bar')
    const logo = document.querySelector('.dm-header__logo-img')
    const nav = document.querySelector('.dm-header__nav-list')
    const actions = document.querySelector('.dm-header__actions')
    const navItems = nav ? [...nav.children] : []
    const rects = navItems.map((li) => {
      const r = li.getBoundingClientRect()
      return { left: r.left, right: r.right, top: r.top, bottom: r.bottom }
    })

    let navOverlap = false
    for (let i = 1; i < rects.length; i++) {
      if (rects[i].left < rects[i - 1].right - 1) navOverlap = true
    }

    const actionRect = actions?.getBoundingClientRect()
    const navRect = nav?.getBoundingClientRect()
    const actionOverlapNav =
      actionRect && navRect ? actionRect.left < navRect.right - 2 : false

    const title = document.querySelector('.dm-hero__title')
    const titleStyle = title ? getComputedStyle(title) : null
    const progress = document.querySelector('.dm-hero__progress')

    return {
      barHeight: bar ? bar.getBoundingClientRect().height : 0,
      logoWidth: logo ? logo.getBoundingClientRect().width : 0,
      logoHeight: logo ? logo.getBoundingClientRect().height : 0,
      navGapPx:
        navItems.length > 1
          ? navItems[1].getBoundingClientRect().left - navItems[0].getBoundingClientRect().right
          : 0,
      navWrap: nav ? getComputedStyle(nav).flexWrap !== 'nowrap' && nav.scrollWidth > nav.clientWidth + 1 : false,
      navOverlap,
      actionOverlapNav,
      headerOverflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
      heroTitleTextShadow: titleStyle?.textShadow || '',
      heroTitleFilter: titleStyle?.filter || '',
      progressPresent: Boolean(progress),
      tabCount: document.querySelectorAll('.dm-hero__tab').length,
    }
  })
}

async function main() {
  const browser = await chromium.launch()
  const results = []

  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } })
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForSelector('.dm-hero', { timeout: 15000 })
    const metrics = await inspectHeader(page)
    await page.screenshot({ path: `${OUT}/homepage-${width}.png`, fullPage: false })
    results.push({ width, ...metrics })
    await page.close()
  }

  await browser.close()

  console.log(JSON.stringify(results, null, 2))

  const failures = []
  for (const row of results) {
    if (row.width >= 1180) {
      if (row.barHeight < 82 || row.barHeight > 88) failures.push(`${row.width}px: header height ${row.barHeight.toFixed(1)}px`)
      if (row.logoWidth < 165 || row.logoWidth > 190) failures.push(`${row.width}px: logo width ${row.logoWidth.toFixed(1)}px`)
    }
    if (row.width === 390 && row.logoWidth < 120) failures.push(`${row.width}px: mobile logo too small (${row.logoWidth.toFixed(1)}px)`)
    if (row.navOverlap || row.actionOverlapNav) failures.push(`${row.width}px: header overlap detected`)
    if (row.headerOverflowX) failures.push(`${row.width}px: horizontal overflow`)
    if (row.progressPresent) failures.push(`${row.width}px: hero progress indicator still present`)
    if (row.heroTitleTextShadow && row.heroTitleTextShadow !== 'none') failures.push(`${row.width}px: hero title text-shadow present`)
    if (row.heroTitleFilter && row.heroTitleFilter !== 'none') failures.push(`${row.width}px: hero title filter present`)
    if (row.tabCount < 5) failures.push(`${row.width}px: module tabs missing (${row.tabCount})`)
  }

  if (failures.length) {
    console.error('FAILURES:\n' + failures.map((f) => `- ${f}`).join('\n'))
    process.exit(1)
  }

  console.log(`Screenshots saved to ${OUT}/`)
  console.log('All homepage visual checks passed.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
