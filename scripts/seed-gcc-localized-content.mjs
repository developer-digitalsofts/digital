/**
 * Idempotent GCC localized CMS content seeder.
 * Usage: node scripts/seed-gcc-localized-content.mjs [--dry-run]
 */
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { GCC_COUNTRIES, SEED_VERSION, getProfile } from '../server/gccLocalizedContent/profiles.mjs'
import { buildLocalizedContent, buildTrustStats } from '../server/gccLocalizedContent/buildSections.mjs'
import { validateLocaleRecord, defaultLocaleRecord, makeTranslationGroupId } from '../server/localeContentModel.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const LOCALE_STORE = path.join(ROOT, 'server/data/localeRecords.json')
const STATS_BASELINE = path.join(ROOT, 'server/data/stats.json')
const STATS_PUBLISHED = path.join(ROOT, 'server/data/published/stats.json')
const BACKUP_DIR = path.join(ROOT, 'server/data/backups/locale-seed')

const TARGET_RECORDS = [
  { contentType: 'pageSection', globalIdentity: 'hero', slug: 'hero' },
  { contentType: 'pageSection', globalIdentity: 'stats', slug: 'stats' },
  { contentType: 'pageSection', globalIdentity: 'about', slug: 'about' },
  { contentType: 'pageSection', globalIdentity: 'valueChain', slug: 'valueChain' },
  { contentType: 'pageSection', globalIdentity: 'modules', slug: 'modules' },
  { contentType: 'pageSection', globalIdentity: 'industries', slug: 'industries' },
  { contentType: 'pageSection', globalIdentity: 'testimonials', slug: 'testimonials' },
  { contentType: 'pageSection', globalIdentity: 'faqs', slug: 'faqs' },
  { contentType: 'navigation', globalIdentity: 'header', slug: 'header' },
  { contentType: 'footer', globalIdentity: 'footer', slug: 'footer' },
  { contentType: 'seo', globalIdentity: 'site', slug: 'seo' },
  { contentType: 'solution', globalIdentity: 'erp', slug: 'erp' },
  { contentType: 'contact', globalIdentity: 'contact', slug: 'contact' },
  { contentType: 'industry', globalIdentity: 'industries-list', slug: 'industries' },
  { contentType: 'solution', globalIdentity: 'solutions-list', slug: 'solutions' },
  { contentType: 'businessModel', globalIdentity: 'business-models-list', slug: 'business-models' },
  { contentType: 'faq', globalIdentity: 'faqs', slug: 'faqs' },
  { contentType: 'testimonial', globalIdentity: 'testimonials', slug: 'testimonials' },
]

const DRY_RUN = process.argv.includes('--dry-run')

const report = {
  seedVersion: SEED_VERSION,
  dryRun: DRY_RUN,
  backupPath: null,
  created: [],
  updated: [],
  skipped: [],
  invalid: [],
  trustHeadings: [],
  byLocale: {},
  previewUrls: [],
}

function localeKey(country, lang) {
  return `${country}/${lang}`
}

function ensureReportBucket(country, lang) {
  const key = localeKey(country, lang)
  if (!report.byLocale[key]) {
    report.byLocale[key] = { created: 0, updated: 0, skipped: 0, contentTypes: [] }
    report.previewUrls.push(`/${getProfile(country).slug}/${lang}`)
  }
  return report.byLocale[key]
}

function dedupeLocaleRecords(records) {
  const keyFor = (r) => `${r.contentType}:${r.globalIdentity}:${r.countryCode}:${r.languageCode}`
  const grouped = new Map()
  for (const rec of records) {
    const key = keyFor(rec)
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key).push(rec)
  }
  const remove = new Set()
  for (const [, list] of grouped) {
    if (list.length <= 1) continue
    const sorted = [...list].sort((a, b) => {
      if (a.inheritanceMode === 'override' && b.inheritanceMode !== 'override') return -1
      if (b.inheritanceMode === 'override' && a.inheritanceMode !== 'override') return 1
      if (a.payload?._seedVersion === SEED_VERSION && b.payload?._seedVersion !== SEED_VERSION) return -1
      return String(a.updatedAt || '').localeCompare(String(b.updatedAt || ''))
    })
    for (const dup of sorted.slice(1)) remove.add(dup.id)
  }
  return records.filter((r) => !remove.has(r.id))
}

function isCustomizedRecord(record) {
  if (record.payload?._seedVersion === SEED_VERSION) return false
  if (record.inheritanceMode === 'inherit') return false
  if (record.inheritanceMode === 'global' && record.countryCode === 'AE' && record.languageCode === 'en') return true
  if (record.payload?._manualOverride === true) return true
  if (record.languageCode === 'ar' && record.translationStatus === 'approved') return true
  return false
}

function translationStatusFor(country, lang) {
  if (lang === 'ar') return 'needs_review'
  if (country === 'AE' && lang === 'en') return 'published'
  return 'draft'
}

function publicationStatusFor(country, lang, existing) {
  if (existing?.publicationStatus === 'published' && country === 'AE' && lang === 'en') return 'published'
  return 'draft'
}

async function backupFile(filePath) {
  await mkdir(BACKUP_DIR, { recursive: true })
  const stamp = Date.now()
  const dest = path.join(BACKUP_DIR, `${path.basename(filePath)}-${stamp}.json`)
  await copyFile(filePath, dest)
  return dest
}

async function patchStatsBaseline() {
  const profile = getProfile('AE')
  const patch = buildTrustStats(profile)
  const raw = JSON.parse(await readFile(STATS_BASELINE, 'utf8'))
  let changed = false

  for (const key of ['eyebrow', 'title', 'subheading']) {
    if (!raw[key]?.en || raw[key].en.includes('Proven Performance') || key === 'subheading') {
      raw[key] = patch[key]
      changed = true
    }
  }

  const hasBadStat = (raw.items || []).some((it) => it.value === '120+' || it.value === 'Cluad')
  if (hasBadStat || !(raw.items || []).length) {
    raw.items = patch.items
    changed = true
  }

  if (changed && !DRY_RUN) {
    raw._meta = { ...(raw._meta || {}), updatedAt: new Date().toISOString(), updatedBy: 'seed-gcc-localized-content' }
    await writeFile(STATS_BASELINE, `${JSON.stringify(raw, null, 2)}\n`, 'utf8')
    report.updated.push('baseline:stats.json')
    try {
      await writeFile(STATS_PUBLISHED, `${JSON.stringify(raw, null, 2)}\n`, 'utf8')
      report.updated.push('published:stats.json')
    } catch {
      report.skipped.push('published:stats.json (missing)')
    }
  } else if (changed) {
    report.updated.push('baseline:stats.json (dry-run)')
  } else {
    report.skipped.push('baseline:stats.json (preserved)')
  }
}

function applySeedToRecord(record, built, records) {
  const country = record.countryCode
  const lang = record.languageCode
  const source =
    records.find(
      (r) =>
        r.countryCode === 'AE' &&
        r.languageCode === 'en' &&
        r.contentType === record.contentType &&
        r.globalIdentity === record.globalIdentity,
    ) || null

  const hasSeedPayload = Boolean(built.payload?._seedVersion === SEED_VERSION)

  const next = {
    ...record,
    sourceRecordId: record.sourceRecordId || source?.id || null,
    inheritanceMode: country === 'AE' && lang === 'en' && record.inheritanceMode === 'global' ? 'global' : 'override',
    translationStatus: translationStatusFor(country, lang),
    publicationStatus: 'draft',
    publishedAt: null,
    payload: built.payload || record.payload,
    seo: built.seo !== undefined ? built.seo : record.seo,
    updatedAt: new Date().toISOString(),
  }

  if (next.inheritanceMode === 'override' && !next.sourceRecordId && !hasSeedPayload) {
    next.inheritanceMode = 'inherit'
  }

  if (record.contentType === 'pageSection' && record.globalIdentity === 'stats') {
    report.trustHeadings.push(`${country}/${lang}: ${built.payload?.title?.en || ''}`)
  }

  return next
}

async function ensureTargetRecords(store) {
  const records = store.records || []
  const aeSource = (identity) =>
    records.find(
      (r) =>
        r.countryCode === 'AE' &&
        r.languageCode === 'en' &&
        r.contentType === identity.contentType &&
        r.globalIdentity === identity.globalIdentity,
    )

  for (const country of GCC_COUNTRIES) {
    for (const lang of ['en', 'ar']) {
      if (country === 'AE' && lang === 'en') continue
      for (const target of TARGET_RECORDS) {
        const exists = records.some(
          (r) =>
            r.countryCode === country &&
            r.languageCode === lang &&
            r.contentType === target.contentType &&
            r.globalIdentity === target.globalIdentity,
        )
        if (exists) continue
        const source = aeSource(target)
        const rec = defaultLocaleRecord({
          contentType: target.contentType,
          globalIdentity: target.globalIdentity,
          slug: target.slug,
          countryCode: country,
          languageCode: lang,
          translationGroupId: source?.translationGroupId || makeTranslationGroupId(),
          sourceRecordId: source?.id || null,
          inheritanceMode: 'inherit',
          translationStatus: lang === 'ar' ? 'needs_review' : 'missing',
          publicationStatus: 'draft',
          payload: { fields: {} },
        })
        const validation = validateLocaleRecord(rec, { existingRecords: records })
        if (!validation.ok) {
          report.invalid.push({ id: rec.id, errors: validation.errors })
          continue
        }
        records.push(rec)
        report.created.push(`record:${country}/${lang} ${target.contentType}/${target.globalIdentity}`)
      }
    }
  }
  store.records = records
  return store
}

async function seedLocaleStore(store) {
  store = await ensureTargetRecords(store)
  store.records = dedupeLocaleRecords(store.records || [])
  const records = store.records

  for (const country of GCC_COUNTRIES) {
    for (const lang of ['en', 'ar']) {
      const bucket = ensureReportBucket(country, lang)
      const localeRecords = records.filter((r) => r.countryCode === country && r.languageCode === lang)

      for (const record of localeRecords) {
        if (country === 'AE' && lang === 'en' && record.inheritanceMode === 'global' && record.publicationStatus === 'published') {
          if (record.contentType === 'pageSection' && record.globalIdentity === 'stats') {
            report.skipped.push(`${record.id} (AE/en global stats uses baseline JSON)`)
            bucket.skipped++
          } else {
            report.skipped.push(`${record.id} (AE/en published baseline preserved)`)
            bucket.skipped++
          }
          continue
        }

        if (country === 'AE' && lang === 'ar' && record.inheritanceMode === 'global' && record.publicationStatus === 'published') {
          report.skipped.push(`${record.id} (AE/ar published global preserved)`)
          bucket.skipped++
          continue
        }

        if (isCustomizedRecord(record)) {
          report.skipped.push(`${record.id} (customized)`)
          bucket.skipped++
          continue
        }

        const built = buildLocalizedContent(country, lang, record.contentType, record.globalIdentity)
        if (!built) {
          report.skipped.push(`${record.id} (no template for ${record.contentType}/${record.globalIdentity})`)
          bucket.skipped++
          continue
        }

        const next = applySeedToRecord(record, built, records)
        const validation = validateLocaleRecord(next, { existingRecords: records })
        if (!validation.ok) {
          report.invalid.push({ id: record.id, errors: validation.errors })
          continue
        }

        const idx = records.findIndex((r) => r.id === record.id)
        const isReseed = record.payload?._seedVersion === SEED_VERSION
        records[idx] = next

        if (isReseed) {
          report.updated.push(`${country}/${lang} ${record.contentType}/${record.globalIdentity}`)
          bucket.updated++
        } else {
          report.created.push(`${country}/${lang} ${record.contentType}/${record.globalIdentity}`)
          bucket.created++
        }
        bucket.contentTypes.push(record.contentType)
      }
    }
  }

  store.records = records
  return store
}

function printReport() {
  console.log('\n=== GCC Localized Content Seed Report ===')
  console.log(`Seed version: ${report.seedVersion}`)
  console.log(`Dry run: ${report.dryRun}`)
  if (report.backupPath) console.log(`Backup: ${report.backupPath}`)

  console.log('\nRecords created:', report.created.length)
  console.log('Records updated:', report.updated.length)
  console.log('Records skipped:', report.skipped.length)
  console.log('Invalid:', report.invalid.length)

  console.log('\nTrust headings seeded:')
  for (const line of report.trustHeadings) console.log(`  • ${line}`)

  console.log('\nPer locale:')
  for (const [key, bucket] of Object.entries(report.byLocale)) {
    console.log(`  ${key}: +${bucket.created} ~${bucket.updated} skip=${bucket.skipped} types=${[...new Set(bucket.contentTypes)].join(', ')}`)
  }

  console.log('\nPreview URLs (CMS preview — drafts not public until published):')
  for (const url of report.previewUrls) console.log(`  ${url}`)

  console.log('\nArabic status: needs_review (draft, noindex until approved)')
  console.log('Publishing: NOT performed by this script')

  if (report.invalid.length) {
    console.error('\nInvalid records:')
    for (const row of report.invalid) console.error(`  ${row.id}: ${row.errors.join('; ')}`)
    process.exitCode = 1
  }
}

async function main() {
  for (const country of GCC_COUNTRIES) {
    if (!getProfile(country)) {
      console.error(`Invalid country code: ${country}`)
      process.exit(1)
    }
  }

  if (!DRY_RUN) {
    report.backupPath = await backupFile(LOCALE_STORE)
  }

  await patchStatsBaseline()

  const store = JSON.parse(await readFile(LOCALE_STORE, 'utf8'))
  const nextStore = await seedLocaleStore(store)

  if (!DRY_RUN) {
    await writeFile(LOCALE_STORE, `${JSON.stringify(nextStore, null, 2)}\n`, 'utf8')
  }

  printReport()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
