/**
 * Footer visual verification — desktop + mobile screenshots.
 * Usage: node scripts/capture-footer-visuals.mjs [baseUrl]
 */
import { chromium } from 'playwright'
import fs from 'fs'

const BASE = (process.argv[2] || process.env.BASE_URL || 'http://127.0.0.1:3040').replace(/\/$/, '')
const OUT = 'screenshots/footer-fix'
const WIDTHS = [
  { width: 1440, name: 'desktop-1440' },
  { width: 390, name: 'mobile-390' },
]

fs.mkdirSync(OUT, { recursive: true })

async function inspectFooter(page) {
  return page.evaluate(() => {
    const footer = document.querySelector('.dm-footer')
    const titles = [...document.querySelectorAll('.dm-footer__col-title')].map((el) => el.textContent?.trim() || '')
    const copyright = document.querySelector('.dm-footer__copyright')?.textContent?.trim() || ''
    const form = document.querySelector('.dm-footer__newsletter-form')
    const input = document.querySelector('.dm-footer__newsletter-input')
    const button = document.querySelector('.dm-footer__newsletter-submit')
    const formStyle = form ? getComputedStyle(form) : null
    const inputRect = input?.getBoundingClientRect()
    const buttonRect = button?.getBoundingClientRect()
    const cardRect = document.querySelector('.dm-footer__newsletter-card')?.getBoundingClientRect()
    const logoRect = document.querySelector('.dm-footer__brand-logo')?.getBoundingClientRect()
    const firstColTitle = document.querySelector('.dm-footer__col-title')?.getBoundingClientRect()

    return {
      titles,
      copyright,
      hasUndefined: /undefined|null/i.test(copyright),
      formFlexDirection: formStyle?.flexDirection || '',
      inputFullWidth: inputRect && cardRect ? Math.abs(inputRect.width - (cardRect.width - 32)) < 4 : false,
      stackedLayout: inputRect && buttonRect ? buttonRect.top > inputRect.bottom + 8 : false,
      footerOverflowX: footer ? footer.scrollWidth > footer.clientWidth + 1 : false,
      pageOverflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
      logoHeight: logoRect?.height ?? 0,
      logoTop: logoRect?.top ?? 0,
      firstColTop: firstColTitle?.top ?? 0,
    }
  })
}

async function main() {
  const browser = await chromium.launch()
  const results = []

  for (const { width, name } of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } })
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForSelector('.dm-footer', { timeout: 15000 })
    await page.locator('.dm-footer').scrollIntoViewIfNeeded()
    await page.waitForTimeout(400)

    const metrics = await inspectFooter(page)
    await page.locator('.dm-footer').screenshot({ path: `${OUT}/footer-${name}.png` })
    results.push({ width, name, ...metrics })
    await page.close()
  }

  await browser.close()

  console.log(JSON.stringify(results, null, 2))

  const failures = []
  for (const row of results) {
    const expectedTitles = ['Product', 'Industries', 'Resources', 'Company']
    for (const title of expectedTitles) {
      if (!row.titles.some((t) => t.toLowerCase() === title.toLowerCase())) {
        failures.push(`${row.name}: missing column heading "${title}" (got: ${row.titles.join(', ')})`)
      }
    }
    if (row.hasUndefined) failures.push(`${row.name}: copyright contains undefined/null`)
    if (!row.copyright.includes('All rights reserved')) {
      failures.push(`${row.name}: copyright missing "All rights reserved" (${row.copyright})`)
    }
    if (row.formFlexDirection !== 'column') failures.push(`${row.name}: newsletter form not column layout`)
    if (!row.stackedLayout) failures.push(`${row.name}: input and button not stacked`)
    if (!row.inputFullWidth) failures.push(`${row.name}: email input not full width`)
    if (row.footerOverflowX || row.pageOverflowX) failures.push(`${row.name}: horizontal overflow detected`)
    if (row.width === 1440 && (row.logoHeight < 58 || row.logoHeight > 72)) {
      failures.push(`${row.name}: logo height ${row.logoHeight.toFixed(1)}px outside expected range`)
    }
  }

  if (failures.length) {
    console.error('FAILURES:\n' + failures.map((f) => `- ${f}`).join('\n'))
    process.exit(1)
  }

  console.log(`Screenshots saved to ${OUT}/`)
  console.log('All footer visual checks passed.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
