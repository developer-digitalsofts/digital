/**
 * Capture Trust section screenshots for UAE and Kuwait routes.
 * Usage: node scripts/capture-trust-section.mjs
 */
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:5280'
const outDir = path.join('screenshots', 'trust-section-fix')

fs.mkdirSync(outDir, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage()

async function captureTrust(route, label) {
  await page.setViewportSize({ width: 1366, height: 900 })
  await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' })
  await page.waitForSelector('#trust-stats', { timeout: 15000 })
  await page.waitForTimeout(600)

  const bannerVisible = await page.locator('text=Showing UAE fallback content').count()
  const metrics = await page.evaluate(() => {
    const bar = document.querySelector('.dm-trust-stats__bar')
    const intro = document.querySelector('.dm-trust-stats__intro')
    const grid = document.querySelector('.dm-trust-stats__grid')
    const barRect = bar?.getBoundingClientRect()
    const introRect = intro?.getBoundingClientRect()
    const gridRect = grid?.getBoundingClientRect()
    const values = [...document.querySelectorAll('.dm-trust-stats__value')].map((el) => el.textContent?.trim())
    const eyebrow = document.querySelector('.dm-trust-stats__eyebrow')?.textContent?.trim()
    const heading = document.querySelector('.dm-trust-stats__heading')?.textContent?.trim()
    const subheading = document.querySelector('.dm-trust-stats__subheading')
    const inner = document.querySelector('.dm-trust-stats__bar-inner')
    return {
      barHeight: barRect ? Math.round(barRect.height) : null,
      introLeft: introRect ? Math.round(introRect.left) : null,
      gridLeft: gridRect ? Math.round(gridRect.left) : null,
      sameRow: introRect && gridRect ? Math.abs(introRect.top - gridRect.top) < 40 : null,
      flexDirection: inner ? getComputedStyle(inner).flexDirection : null,
      values,
      eyebrow,
      heading,
      hasSubheading: Boolean(subheading),
    }
  })

  await page.locator('#trust-stats').screenshot({ path: path.join(outDir, `${label}-after.png`) })

  return { label, route, bannerVisible, metrics }
}

const results = []
results.push(await captureTrust('/', 'uae'))
results.push(await captureTrust('/kw/en', 'kuwait'))

await browser.close()
console.log(JSON.stringify({ outDir, results }, null, 2))
