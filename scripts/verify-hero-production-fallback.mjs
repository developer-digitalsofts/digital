/**
 * Production-build hero resilience checks against a running server.
 * Run: npm run build && npm run start (separate terminal) && node scripts/verify-hero-production-fallback.mjs
 */
import { chromium } from 'playwright'

const BASE = process.env.BASE_URL || 'http://127.0.0.1:3040'

async function heroMetrics(page) {
  return page.evaluate(() => {
    const section = document.querySelector('#home.dm-hero')
    const title = section?.querySelector('.dm-hero__title')?.textContent?.trim() || ''
    const pill = section?.querySelector('.dm-hero__pill')?.textContent?.trim() || ''
    const tabs = section?.querySelectorAll('.dm-hero__tab').length ?? 0
    const rect = section?.getBoundingClientRect()
    const style = section ? getComputedStyle(section) : null
    return {
      exists: Boolean(section),
      title,
      pill,
      tabs,
      height: rect?.height ?? 0,
      opacity: style?.opacity ?? '',
      visibility: style?.visibility ?? '',
      display: style?.display ?? '',
    }
  })
}

async function waitForHero(page, ms = 15000) {
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: ms })
  await page.waitForSelector('#home.dm-hero', { timeout: ms })
  await page.waitForFunction(
    () => {
      const section = document.querySelector('#home.dm-hero')
      const title = section?.querySelector('.dm-hero__title')?.textContent?.trim()
      return Boolean(section && title)
    },
    { timeout: ms },
  )
}

function assertHeroVisible(metrics, label) {
  if (!metrics.exists) throw new Error(`${label}: hero section missing`)
  if (metrics.height < 400) throw new Error(`${label}: hero blank (${metrics.height}px)`)
  if (!metrics.title && !metrics.pill) throw new Error(`${label}: hero copy missing`)
  if (metrics.opacity === '0' || metrics.visibility === 'hidden' || metrics.display === 'none') {
    throw new Error(`${label}: hero hidden by CSS`)
  }
}

async function runCase(name, setupRoute, assertFn) {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  try {
    if (setupRoute) await setupRoute(page)
    await waitForHero(page)
    const before = await heroMetrics(page)
    await page.waitForTimeout(2500)
    const after = await heroMetrics(page)
    await assertFn({ before, after, page })
    console.log(`PASS  ${name}`)
    return true
  } catch (e) {
    console.error(`FAIL  ${name}:`, e instanceof Error ? e.message : e)
    return false
  } finally {
    await browser.close()
  }
}

let passed = 0
let failed = 0

function record(ok) {
  if (ok) passed += 1
  else failed += 1
}

record(
  await runCase('valid CMS response (default server)', null, async ({ after }) => {
    assertHeroVisible(after, 'valid CMS')
  }),
)

record(
  await runCase('empty slides array from API', async (page) => {
    await page.route('**/api/homepage**', async (route) => {
      const res = await route.fetch()
      const json = await res.json()
      json.hero = { ...(json.hero || {}), slides: [], carouselEnabled: true }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(json),
      })
    })
  }, async ({ after }) => {
    assertHeroVisible(after, 'empty slides')
    if (after.tabs < 1) throw new Error('hero tabs missing')
  }),
)

record(
  await runCase('missing hero field from API', async (page) => {
    await page.route('**/api/homepage**', async (route) => {
      const res = await route.fetch()
      const json = await res.json()
      delete json.hero
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(json),
      })
    })
  }, async ({ after }) => {
    assertHeroVisible(after, 'missing hero field')
  }),
)

record(
  await runCase('malformed slide objects', async (page) => {
    await page.route('**/api/homepage**', async (route) => {
      const res = await route.fetch()
      const json = await res.json()
      json.hero = {
        carouselEnabled: true,
        slides: [{ id: 'bad' }, null, { visible: false }],
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(json),
      })
    })
  }, async ({ after }) => {
    assertHeroVisible(after, 'malformed slides')
  }),
)

record(
  await runCase('HTTP 500 from API', async (page) => {
    await page.route('**/api/homepage**', (route) =>
      route.fulfill({ status: 500, contentType: 'application/json', body: '{"error":"fail"}' }),
    )
  }, async ({ after }) => {
    assertHeroVisible(after, 'API 500')
  }),
)

record(
  await runCase('request timeout (aborted fetch)', async (page) => {
    await page.route('**/api/homepage**', async (route) => {
      await new Promise((r) => setTimeout(r, 1500))
      route.abort('timedout')
    })
  }, async ({ page }) => {
    await page.waitForTimeout(9500)
    const after = await heroMetrics(page)
    assertHeroVisible(after, 'timeout')
  }),
)

record(
  await runCase('delayed valid CMS response', async (page) => {
    await page.route('**/api/homepage**', async (route) => {
      await new Promise((r) => setTimeout(r, 1800))
      const res = await route.fetch()
      await route.fulfill({ response: res })
    })
  }, async ({ before, after }) => {
    assertHeroVisible(before, 'delayed before')
    assertHeroVisible(after, 'delayed after')
  }),
)

record(
  await runCase('carousel survives two slide advances', null, async ({ page }) => {
    const labels = []
    for (let i = 0; i < 3; i++) {
      const m = await heroMetrics(page)
      assertHeroVisible(m, `carousel cycle ${i}`)
      labels.push(m.pill || m.title)
      if (i < 2) await page.waitForTimeout(5200)
    }
    if (new Set(labels.filter(Boolean)).size < 2) {
      throw new Error(`carousel did not advance (labels: ${labels.join(' | ')})`)
    }
  }),
)

console.log(`\nHero production fallback verification: ${passed} passed, ${failed} failed`)
process.exit(failed > 0 ? 1 : 0)
