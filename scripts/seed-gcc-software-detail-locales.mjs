/**
 * Seed GCC locale CMS records for every software module and industry detail page.
 * Usage: node scripts/seed-gcc-software-detail-locales.mjs [--dry-run]
 */
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { GCC_COUNTRIES, SEED_VERSION, getProfile } from '../server/gccLocalizedContent/profiles.mjs'
import { buildSoftwareDetailLocale } from '../server/gccLocalizedContent/buildSoftwareDetail.mjs'
import {
  ALL_SOFTWARE_DETAIL_PAGES,
  softwareDetailContentType,
  softwareDetailIdentity,
} from '../server/gccLocalizedContent/softwareDetailCatalog.mjs'
import { defaultLocaleRecord, makeTranslationGroupId, validateLocaleRecord } from '../server/localeContentModel.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const LOCALE_STORE = path.join(ROOT, 'server/data/localeRecords.json')
const BACKUP_DIR = path.join(ROOT, 'server/data/backups/locale-seed')
const DRY_RUN = process.argv.includes('--dry-run')

const report = { seedVersion: SEED_VERSION, dryRun: DRY_RUN, created: [], updated: [], skipped: [], invalid: [] }

async function backupFile(filePath) {
  await mkdir(BACKUP_DIR, { recursive: true })
  const dest = path.join(BACKUP_DIR, `${path.basename(filePath)}-${Date.now()}.json`)
  await copyFile(filePath, dest)
  return dest
}

function translationStatusFor(country, lang) {
  if (lang === 'ar') return 'needs_review'
  return 'draft'
}

async function main() {
  const store = JSON.parse(await readFile(LOCALE_STORE, 'utf8'))
  const records = store.records || []
  report.backupPath = DRY_RUN ? null : await backupFile(LOCALE_STORE)

  for (const country of GCC_COUNTRIES) {
    if (country === 'AE') continue
    for (const lang of ['en', 'ar']) {
      for (const page of ALL_SOFTWARE_DETAIL_PAGES) {
        const globalIdentity = softwareDetailIdentity(page.kind, page.slug)
        const contentType = softwareDetailContentType(page.kind)
        const existingIdx = records.findIndex(
          (r) =>
            r.countryCode === country &&
            r.languageCode === lang &&
            r.contentType === contentType &&
            r.globalIdentity === globalIdentity,
        )

        const profile = getProfile(country)
        const built = buildSoftwareDetailLocale(profile, page.kind, page.slug, page.labelEn, lang)
        built.payload._seedVersion = SEED_VERSION
        built.payload._seedKind = 'software-detail'

        const next = {
          ...(existingIdx >= 0 ? records[existingIdx] : defaultLocaleRecord({
            contentType,
            globalIdentity,
            slug: page.slug,
            countryCode: country,
            languageCode: lang,
            translationGroupId: makeTranslationGroupId(),
            inheritanceMode: 'override',
            translationStatus: translationStatusFor(country, lang),
            publicationStatus: 'draft',
          })),
          inheritanceMode: 'override',
          translationStatus: translationStatusFor(country, lang),
          publicationStatus: existingIdx >= 0 && records[existingIdx].publicationStatus === 'published' && lang === 'en'
            ? 'published'
            : 'draft',
          payload: built.payload,
          seo: built.seo,
          updatedAt: new Date().toISOString(),
        }

        if (lang === 'ar') {
          next.publicationStatus = 'draft'
          next.publishedAt = null
        }

        const validation = validateLocaleRecord(next, { existingRecords: records })
        if (!validation.ok) {
          report.invalid.push({ id: next.id, errors: validation.errors })
          continue
        }

        if (existingIdx >= 0) {
          records[existingIdx] = next
          report.updated.push(`${country}/${lang} ${globalIdentity}`)
        } else {
          records.push(next)
          report.created.push(`${country}/${lang} ${globalIdentity}`)
        }
      }
    }
  }

  store.records = records
  if (!DRY_RUN) {
    await writeFile(LOCALE_STORE, `${JSON.stringify(store, null, 2)}\n`, 'utf8')
  }

  console.log('\n=== GCC Software Detail Locale Seed ===')
  console.log(`Seed version: ${SEED_VERSION}`)
  console.log(`Created: ${report.created.length}`)
  console.log(`Updated: ${report.updated.length}`)
  console.log(`Invalid: ${report.invalid.length}`)
  if (report.invalid.length) {
    console.error(report.invalid.slice(0, 5))
    process.exit(1)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
