/**
 * Migrate current public city homepage output into city-scoped CMS section records.
 * Preserves existing rendered content by snapshotting applyCityHomepageOverlay output.
 *
 * Usage: node scripts/migrate-pk-city-cms-sections.mjs [--dry-run]
 */
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PK_CITY_SLUGS, PK_CMS_DATA_DIR_NAME } from '../server/pakistanConfig.mjs'
import {
  CITY_CMS_SECTIONS,
  CITY_CMS_SEED_VERSION,
  makeCitySectionRecord,
} from '../server/cityCmsSections.mjs'
import { applyCityHomepageOverlay } from '../server/cityHomepage.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DATA_DIR = path.join(ROOT, 'server', PK_CMS_DATA_DIR_NAME)
const LOCALE_STORE = path.join(DATA_DIR, 'localeRecords.json')
const PUBLISHED_STORE = path.join(DATA_DIR, 'published', 'localeRecords.json')
const DRY_RUN = process.argv.includes('--dry-run')

async function readPublishedJson(name) {
  const raw = await readFile(path.join(DATA_DIR, 'published', name), 'utf8')
  const doc = JSON.parse(raw)
  delete doc._meta
  return doc
}

async function loadPublishedHomepagePayload() {
  const keys = [
    'hero',
    'stats',
    'industries',
    'valueChain',
    'modules',
    'testimonials',
    'faqs',
    'demoCta',
    'personalizedDemo',
    'pageSections',
    'seo',
    'header',
    'footer',
    'siteSettings',
    'megaMenus',
    'whatsappSettings',
    'countries',
    'blogSection',
  ]
  const out = {}
  for (const key of keys) {
    try {
      out[key] = await readPublishedJson(`${key}.json`)
    } catch {
      out[key] = {}
    }
  }
  out.meta = { schemaVersion: 2 }
  return out
}

async function main() {
  console.log(`Migrating Pakistan city CMS sections${DRY_RUN ? ' (dry run)' : ''}`)
  const baseline = await loadPublishedHomepagePayload()
  const store = JSON.parse(await readFile(LOCALE_STORE, 'utf8'))
  const records = store.records || []

  const filtered = records.filter(
    (r) => !(r.citySlug && (r.id?.startsWith('loc_pk_city_') || r.payload?._seedVersion === CITY_CMS_SEED_VERSION)),
  )

  let created = 0
  for (const citySlug of PK_CITY_SLUGS) {
    const homepage = applyCityHomepageOverlay(baseline, citySlug, {})
    for (const sectionKey of Object.keys(CITY_CMS_SECTIONS)) {
      const sectionDoc = sectionKey === 'seo' ? homepage.seo : homepage[sectionKey]
      if (!sectionDoc || typeof sectionDoc !== 'object') continue
      const payload = { ...sectionDoc }
      if (sectionKey === 'hero' && homepage.regional) {
        if (homepage.regional.cities?.length >= 4) payload.dashboardCities = homepage.regional.cities
        if (homepage.regional.companies?.length >= 4) payload.dashboardCompanies = homepage.regional.companies
      }
      filtered.push(makeCitySectionRecord(citySlug, sectionKey, payload))
      created += 1
    }
    console.log(`  ${citySlug}: ${Object.keys(CITY_CMS_SECTIONS).length} sections`)
  }

  const next = { ...store, records: filtered, _meta: { ...(store._meta || {}), updatedAt: new Date().toISOString() } }
  if (DRY_RUN) {
    console.log(`Dry run complete — would write ${created} section records (${filtered.length} total records)`)
    return
  }

  await mkdir(path.join(DATA_DIR, 'backups', 'city-cms-migrate'), { recursive: true })
  const stamp = Date.now()
  await copyFile(LOCALE_STORE, path.join(DATA_DIR, 'backups', 'city-cms-migrate', `localeRecords.json-${stamp}.json`))
  await copyFile(PUBLISHED_STORE, path.join(DATA_DIR, 'backups', 'city-cms-migrate', `published-localeRecords.json-${stamp}.json`))

  await writeFile(LOCALE_STORE, `${JSON.stringify(next, null, 2)}\n`, 'utf8')
  await writeFile(PUBLISHED_STORE, `${JSON.stringify(next, null, 2)}\n`, 'utf8')
  console.log(`Done — ${created} city section records written to draft + published stores`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
