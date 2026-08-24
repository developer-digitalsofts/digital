/**
 * Seed and publish city-level ERP pages for all GCC cities.
 * Usage: node scripts/seed-city-locale-content.mjs [--dry-run]
 */
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ALL_CITY_SLUGS, CITY_REGISTRY } from '../server/cityRegistry.mjs'
import { buildCityLocaleRecord, CITY_SEED_VERSION } from '../server/cityContentBuilder.mjs'
import {
  defaultLocaleRecord,
  makeTranslationGroupId,
  validateLocaleRecord,
} from '../server/localeContentModel.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const LOCALE_STORE = path.join(ROOT, 'server/data/localeRecords.json')
const PUBLISHED_STORE = path.join(ROOT, 'server/data/published/localeRecords.json')
const BACKUP_DIR = path.join(ROOT, 'server/data/backups/city-seed')
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

  for (const citySlug of ALL_CITY_SLUGS) {
    const city = CITY_REGISTRY[citySlug]
    const partial = buildCityLocaleRecord(citySlug, 'en', {
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
          publicationStatus: 'published',
          translationStatus: 'published',
          enabled: true,
          publishedAt: existing.publishedAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      : defaultLocaleRecord({
          ...partial,
          id: `loc_city_${city.slug}_en`,
          translationGroupId: makeTranslationGroupId(),
          sourceRecordId: null,
        })

    const validation = validateLocaleRecord(record, { existingRecords: records.filter((r) => r.id !== record.id) })
    if (!validation.ok) {
      console.error(`Invalid ${citySlug}:`, validation.errors)
      process.exit(1)
    }

    if (existing) {
      const idx = records.findIndex((r) => r.id === existing.id)
      records[idx] = record
      report.updated.push(citySlug)
    } else {
      records.push(record)
      report.created.push(citySlug)
    }
    report.published.push(citySlug)
  }

  store.records = records
  store._meta = { ...(store._meta || {}), updatedAt: new Date().toISOString(), citySeed: CITY_SEED_VERSION }

  if (DRY_RUN) {
    console.log(JSON.stringify(report, null, 2))
    console.log('Dry run — no files written.')
    return
  }

  await writeFile(LOCALE_STORE, `${JSON.stringify(store, null, 2)}\n`, 'utf8')
  await writeFile(PUBLISHED_STORE, `${JSON.stringify(store, null, 2)}\n`, 'utf8')
  console.log(JSON.stringify(report, null, 2))
  console.log(`Seeded ${report.published.length} city pages (draft + published snapshot).`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
