/**
 * Download per-slug Unsplash images (w=1600) into public/software-images/{slug}/
 * Updates softwareImageManifest.json and writes image-replacement-report.json
 */
import { copyFile, mkdir, writeFile, access } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildSlugImagePlan, fallbackUrlsFor } from './unsplash-image-catalog.mjs'

const root = join(fileURLToPath(new URL('.', import.meta.url)), '..')
const outRoot = join(root, 'public', 'software-images')
const cacheRoot = join(outRoot, '_cache')
const DELAY_MS = 350
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function fileExists(path) {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

function cachePathForUrl(url) {
  const hash = createHash('sha256').update(url).digest('hex').slice(0, 20)
  return join(cacheRoot, `${hash}.jpg`)
}

const urlCache = new Map()

async function fetchToCache(url) {
  if (urlCache.has(url)) return urlCache.get(url)
  const cached = cachePathForUrl(url)
  if (await fileExists(cached)) {
    urlCache.set(url, cached)
    return cached
  }
  const res = await fetch(url, {
    headers: { 'User-Agent': 'DigitalManagerImageBot/1.0 (Unsplash; local build)' },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`)
  await mkdir(cacheRoot, { recursive: true })
  await writeFile(cached, Buffer.from(await res.arrayBuffer()))
  urlCache.set(url, cached)
  await sleep(DELAY_MS)
  return cached
}

async function downloadWithFallback(urls, dest, force = false) {
  if (!force && (await fileExists(dest))) return { ok: true, url: urls[0] }
  await mkdir(dirname(dest), { recursive: true })
  const tried = new Set()
  for (const url of urls) {
    if (tried.has(url)) continue
    tried.add(url)
    try {
      const cached = await fetchToCache(url)
      await copyFile(cached, dest)
      console.log('OK', dest.replace(root, ''), '←', url.slice(0, 80))
      return { ok: true, url }
    } catch (e) {
      console.warn('retry', dest.replace(root, ''), e.message)
    }
  }
  console.error('FAIL', dest.replace(root, ''))
  return { ok: false, url: null }
}

const force = process.argv.includes('--force')
const { plan, report } = buildSlugImagePlan()

let ok = 0
let fail = 0
const manifest = {}
const reportOut = []

for (const [slug, entry] of Object.entries(plan)) {
  const roles = [
    ['hero', entry.hero, 'heroTeam'],
    ['reports', entry.reports, 'financialReports'],
    ['dashboard', entry.dashboard, 'dashboard'],
    ['meeting', entry.meeting, 'teamMeeting'],
    ['ledger', entry.ledger, 'ledgerOffice'],
  ]

  const pageReport = report.find((r) => r.slug === slug)
  const imageResults = {}

  for (const [file, primaryUrl, key] of roles) {
    const dest = join(outRoot, slug, `${file}.jpg`)
    const fallbacks = fallbackUrlsFor(slug, file)
    const urls = [primaryUrl, ...fallbacks.filter((u) => u !== primaryUrl)]
    const result = await downloadWithFallback(urls, dest, force)
    if (result.ok) ok++
    else fail++

    imageResults[file] = {
      selectedUrl: result.url,
      dest: `/software-images/${slug}/${file}.jpg`,
    }
  }

  manifest[slug] = {
    heroTeam: `/software-images/${slug}/hero.jpg`,
    financialReports: `/software-images/${slug}/reports.jpg`,
    dashboard: `/software-images/${slug}/dashboard.jpg`,
    teamMeeting: `/software-images/${slug}/meeting.jpg`,
    ledgerOffice: `/software-images/${slug}/ledger.jpg`,
  }

  if (pageReport) {
    reportOut.push({
      ...pageReport,
      downloaded: imageResults,
    })
  }
}

await writeFile(
  join(root, 'src/data/softwareDetail/softwareImageManifest.json'),
  JSON.stringify(manifest, null, 2),
)
await writeFile(
  join(root, 'scripts', 'image-replacement-report.json'),
  JSON.stringify({ generatedAt: new Date().toISOString(), pages: reportOut }, null, 2),
)

console.log(`Done: ${ok} ok, ${fail} fail, ${Object.keys(manifest).length} slugs`)
