/**
 * Capture browser screenshots after hard navigation — confirms styled React pages load.
 * Usage: node scripts/capture-no-flash-screenshots.mjs [baseUrl]
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'

const BASE = (process.env.BASE_URL || process.argv[2] || 'http://127.0.0.1:3040').replace(/\/$/, '')
const OUT = 'screenshots/no-flash-fix'

const ROUTES = [
  { path: '/', name: 'homepage', waitFor: '#home, header, .dm-hero' },
  { path: '/software/crm-software', name: 'crm-software', waitFor: 'h1, main, .dm-page' },
  { path: '/bh/en', name: 'bh-en', waitFor: '#home, header, .dm-hero' },
  { path: '/blog', name: 'blog', waitFor: 'h1, main, article' },
  { path: '/contact', name: 'contact', waitFor: 'h1, main, form, .dm-page' },
]

async function verifyInitialHtml(path) {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Dest': 'document',
    },
  })
  const html = await res.text()
  const hasAgentFallback =
    html.includes('data-agentic-prerender="true"') ||
    html.includes('Back to homepage') ||
    html.includes('dm-ssr-shell')
  const hasAssets = html.includes('type="module"') && /\/assets\/[^"']+\.css/.test(html)
  const emptyRoot = /<div id="root">\s*<\/div>/i.test(html)
  return { status: res.status, hasAgentFallback, hasAssets, emptyRoot }
}

async function main() {
  await mkdir(OUT, { recursive: true })

  const htmlChecks = []
  for (const route of ROUTES) {
    const check = await verifyInitialHtml(route.path)
    htmlChecks.push({ route: route.path, ...check })
    const ok = check.status === 200 && !check.hasAgentFallback && check.hasAssets && check.emptyRoot
    console.log(`${ok ? '✓' : '✗'} Initial HTML ${route.path} — agentFallback=${check.hasAgentFallback} emptyRoot=${check.emptyRoot}`)
  }

  await writeFile(`${OUT}/initial-html-checks.json`, JSON.stringify(htmlChecks, null, 2))

  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  })
  const page = await context.newPage()

  for (const route of ROUTES) {
    await page.goto(`${BASE}${route.path}`, { waitUntil: 'networkidle', timeout: 60000 })
    try {
      await page.waitForSelector(route.waitFor, { timeout: 15000 })
    } catch {
      console.warn(`  waitFor timeout on ${route.path}, capturing anyway`)
    }
    const bodyText = await page.locator('body').innerText()
    const hasAgentFlashText =
      bodyText.includes('Back to homepage') &&
      !bodyText.includes('Contact') &&
      bodyText.length < 400
    if (hasAgentFlashText) {
      console.warn(`  ⚠ Possible agent fallback visible on ${route.path}`)
    }
    await page.screenshot({ path: `${OUT}/${route.name}-1440x900.png`, fullPage: false })
    console.log(`  screenshot: ${OUT}/${route.name}-1440x900.png`)
  }

  await browser.close()
  console.log(`\nScreenshots saved to ${OUT}/`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
