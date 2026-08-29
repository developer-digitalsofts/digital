/**
 * Seed and publish Pakistan city homepages and product pages.
 * Usage: node scripts/seed-city-locale-content.mjs [--dry-run]
 */
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ALL_CITY_SLUGS, CITY_HOME_SLUG, CITY_PRODUCT_PAGE_SLUGS, CITY_REGISTRY } from '../server/cityRegistry.mjs'
import { buildCityLocaleRecord, CITY_SEED_VERSION } from '../server/cityContentBuilder.mjs'
import {
  defaultLocaleRecord,
  makeTranslationGroupId,
  validateLocaleRecord,
} from '../server/localeContentModel.mjs'
import { PK_CMS_DATA_DIR_NAME } from '../server/pakistanConfig.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DATA_DIR = path.join(ROOT, 'server', PK_CMS_DATA_DIR_NAME)
const LOCALE_STORE = path.join(DATA_DIR, 'localeRecords.json')
const PUBLISHED_STORE = path.join(DATA_DIR, 'published', 'localeRecords.json')
const BACKUP_DIR = path.join(DATA_DIR, 'backups/city-seed')
const DRY_RUN = process.argv.includes('--dry-run')

const report = { seedVersion: CITY_SEED_VERSION, dryRun: DRY_RUN, created: [], updated: [], published: [] }

function recordKey(r) {
  return `${r.contentType}:${r.globalIdentity}:${r.countryCode}:${r.languageCode}:${r.citySlug || ''}`
}

async function main() {
  const raw = await readFile(LOCALE_STORE, 'utf8')
  const store = JSON.parse(raw)
  const records = store.records || []
  const byKey = new Map(records.map((r) => [recordKey(r), r]))

  if (!DRY_RUN) {
    await mkdir(BACKUP_DIR, { recursive: true })
    const backupPath = path.join(BACKUP_DIR, `localeRecords.json-${Date.now()}.json`)
    await copyFile(LOCALE_STORE, backupPath)
    report.backupPath = backupPath
  }

  const pageSlugs = [CITY_HOME_SLUG, ...CITY_PRODUCT_PAGE_SLUGS]

  for (const citySlug of ALL_CITY_SLUGS) {
    const city = CITY_REGISTRY[citySlug]
    for (const pageSlug of pageSlugs) {
      const partial = buildCityLocaleRecord(citySlug, pageSlug, 'en', {
        publicationStatus: 'published',
        translationStatus: 'published',
        publishedAt: new Date().toISOString(),
        enabled: true,
      })
      const key = recordKey(partial)
      const existing = byKey.get(key)
      const record = existing
        ? {
            ...existing,
            payload: partial.payload,
            seo: partial.seo,
            citySlug: city.slug,
            globalIdentity: partial.globalIdentity,
            slug: pageSlug,
            publicationStatus: 'published',
            translationStatus: 'published',
            enabled: true,
            publishedAt: existing.publishedAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        : defaultLocaleRecord({
            ...partial,
            id: `loc_city_${city.slug}_${pageSlug}_en`,
            translationGroupId: makeTranslationGroupId(),
            sourceRecordId: null,
          })

      const validation = validateLocaleRecord(record, { existingRecords: records.filter((r) => r.id !== record.id) })
      if (!validation.ok) {
        console.error(`Invalid ${citySlug}/${pageSlug}:`, validation.errors)
        process.exit(1)
      }

      const label = `${citySlug}/${pageSlug}`
      if (existing) {
        const idx = records.findIndex((r) => r.id === existing.id)
        records[idx] = record
        report.updated.push(label)
      } else {
        records.push(record)
        byKey.set(key, record)
        report.created.push(label)
      }
      report.published.push(label)
    }
  }

  store.records = records
  store._meta = { ...(store._meta || {}), updatedAt: new Date().toISOString(), citySeed: CITY_SEED_VERSION }

  if (DRY_RUN) {
    console.log(JSON.stringify(report, null, 2))
    console.log('Dry run — no files written.')
    return
  }

  await mkdir(path.dirname(PUBLISHED_STORE), { recursive: true })
  await writeFile(LOCALE_STORE, `${JSON.stringify(store, null, 2)}\n`, 'utf8')
  await writeFile(PUBLISHED_STORE, `${JSON.stringify(store, null, 2)}\n`, 'utf8')
  console.log(JSON.stringify(report, null, 2))
  console.log(`Seeded ${report.published.length} city pages (draft + published snapshot).`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
