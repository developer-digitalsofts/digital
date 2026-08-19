/**
 * Homepage functional smoke checks (preview/dev).
 * Usage: node scripts/homepage-functional-check.mjs
 */
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:4173'

const results = []

function pass(name) {
  results.push({ name, ok: true })
  console.log(`✓ ${name}`)
}

function fail(name, detail) {
  results.push({ name, ok: false, detail })
  console.log(`✗ ${name}: ${detail}`)
}

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })

  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForSelector('#home', { timeout: 15000 })

  // Hero autoplay interval
  const duration = await page.locator('.dm-hero__progress-fill').first().evaluate((el) => el.style.animationDuration)
  if (duration === '5000ms') pass('Hero autoplay duration is 5s')
  else fail('Hero autoplay duration is 5s', `got ${duration}`)

  // Hero tabs
  const tabs = await page.locator('.dm-hero__tab').count()
  if (tabs >= 5) pass('Hero module tabs present')
  else fail('Hero module tabs present', `count ${tabs}`)

  await page.locator('.dm-hero__tab').filter({ hasText: 'Finance' }).first().click({ force: true })
  await page.waitForTimeout(300)
  const activeTab = await page.locator('.dm-hero__tab--active').textContent()
  if (activeTab?.includes('Finance')) pass('Hero tab selection works')
  else fail('Hero tab selection works', activeTab || 'none')

  // Demo CTA scroll
  await page.locator('.dm-demo-cta__button').click()
  await page.waitForTimeout(800)
  const demoInView = await page.evaluate(() => {
    const el = document.getElementById('personalized-demo')
    if (!el) return false
    const r = el.getBoundingClientRect()
    return r.top >= 0 && r.top < window.innerHeight * 0.6
  })
  if (demoInView) pass('Demo CTA scrolls to personalized demo')
  else fail('Demo CTA scrolls to personalized demo', 'section not in view')

  // FAQ accordion
  await page.locator('#faqs').scrollIntoViewIfNeeded()
  const faqBtn = page.locator('.dm-faq__trigger').first()
  await faqBtn.click()
  await page.waitForTimeout(350)
  const faqOpen = await page.locator('.dm-faq__item.is-open').count()
  if (faqOpen === 1) pass('FAQ accordion opens one item')
  else fail('FAQ accordion opens one item', `open count ${faqOpen}`)

  // Industry cards count
  const industryCards = await page.locator('.industry-showcase-card').count()
  if (industryCards === 6) pass('Homepage shows 6 industry cards')
  else fail('Homepage shows 6 industry cards', `count ${industryCards}`)

  // Powerful modules cards
  await page.locator('#modules').scrollIntoViewIfNeeded()
  const moduleCards = await page.locator('.powerful-module-editorial-card').count()
  if (moduleCards === 6) pass('Powerful modules editorial cards (6)')
  else fail('Powerful modules editorial cards (6)', `count ${moduleCards}`)

  // Testimonials dots
  const testimonialDots = await page.locator('.dm-testimonials__dot').count()
  if (testimonialDots >= 3) pass('Testimonials pagination present')
  else fail('Testimonials pagination present', `dots ${testimonialDots}`)

  // Footer newsletter input
  await page.locator('.dm-footer').scrollIntoViewIfNeeded()
  const newsletterInput = page.locator('.dm-footer__newsletter-input')
  if (await newsletterInput.isVisible()) pass('Footer newsletter form visible')
  else fail('Footer newsletter form visible', 'input hidden')

  // Arabic switch (if present)
  const langBtn = page.locator('button').filter({ hasText: /^AR$|^EN$/ }).first()
  if (await langBtn.count()) {
    await langBtn.click()
    await page.waitForTimeout(400)
    const dir = await page.evaluate(() => document.documentElement.dir)
    if (dir === 'rtl') pass('Arabic / RTL switch')
    else fail('Arabic / RTL switch', `dir=${dir}`)
  } else {
    fail('Arabic / RTL switch', 'language control not found')
  }

  await browser.close()

  const failed = results.filter((r) => !r.ok)
  console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
  if (failed.length) process.exitCode = 1
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
