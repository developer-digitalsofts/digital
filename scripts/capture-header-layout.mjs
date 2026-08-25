/**
 * Capture header layout screenshots at common breakpoints.
 * Usage: node scripts/capture-header-layout.mjs
 */
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:5280'
const outDir = path.join('screenshots', 'header-layout-fix')
const widths = [1920, 1536, 1440, 1366, 1280, 1024, 390]

fs.mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage()

for (const w of widths) {
  await page.setViewportSize({ width: w, height: 900 })
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  await page.screenshot({ path: path.join(outDir, `header-${w}px.png`), fullPage: false })
}

await page.setViewportSize({ width: 1366, height: 900 })
await page.goto(BASE, { waitUntil: 'networkidle' })

const checks = await page.evaluate(() => {
  const bar = document.querySelector('.dm-header__bar')
  const nav = document.querySelector('.dm-header__nav')
  const mobile = document.querySelector('.dm-header__mobile')
  const hero = document.querySelector('.dm-hero')
  const barRect = bar?.getBoundingClientRect()
  const heroRect = hero?.getBoundingClientRect()
  const navTops = [...document.querySelectorAll('.dm-header__nav-list > li')].map((li) => Math.round(li.getBoundingClientRect().top))
  const aeStandalone = [...document.querySelectorAll('.dm-header__actions *')].filter(
    (el) => el.children.length === 0 && el.textContent?.trim() === 'AE',
  )
  return {
    barHeight: barRect ? Math.round(barRect.height) : null,
    navDisplay: nav ? getComputedStyle(nav).display : null,
    mobileDisplay: mobile ? getComputedStyle(mobile).display : null,
    navRowCount: new Set(navTops).size,
    heroGapPx: barRect && heroRect ? Math.round(heroRect.top - barRect.bottom) : null,
    aeStandaloneCount: aeStandalone.length,
    actionsText: document.querySelector('.dm-header__actions')?.textContent?.replace(/\s+/g, ' ').trim(),
  }
})

await browser.close()

console.log(JSON.stringify({ outDir, checks }, null, 2))
