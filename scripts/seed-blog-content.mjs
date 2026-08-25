/**
 * Idempotent blog SEO content seeder.
 * Usage: node scripts/seed-blog-content.mjs [--dry-run]
 */
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { BLOG_SEED_VERSION, SHARED_ARTICLES, COUNTRY_ARTICLES } from '../server/blogContent/catalog.mjs'
import { buildEnglishPost, buildArabicDraft } from '../server/blogContent/buildArabicDraft.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const BLOG_POSTS = path.join(ROOT, 'server/data/blogPosts.json')
const BACKUP_DIR = path.join(ROOT, 'server/data/backups/blog-seed')
const DRY_RUN = process.argv.includes('--dry-run')

const report = {
  seedVersion: BLOG_SEED_VERSION,
  dryRun: DRY_RUN,
  backupPath: null,
  created: [],
  updated: [],
  skipped: [],
  invalid: [],
  englishDrafts: 0,
  arabicDrafts: 0,
}

function shouldSkip(existing) {
  if (!existing) return false
  if (existing._seedVersion !== BLOG_SEED_VERSION) return false
  if (existing.status === 'published') return true
  const editedAt = existing.updatedDate || existing._meta?.updatedAt
  const seededAt = existing._seedVersion
  if (editedAt && existing._seedVersion === BLOG_SEED_VERSION) {
    const manualEdit = existing._meta?.updatedBy && !String(existing._meta.updatedBy).includes('seed-blog')
    if (manualEdit) return true
  }
  return Boolean(seededAt)
}

function collectArticles() {
  const all = [...SHARED_ARTICLES]
  for (const code of Object.keys(COUNTRY_ARTICLES)) {
    for (const article of COUNTRY_ARTICLES[code]) {
      all.push(article)
    }
  }
  return all
}

async function main() {
  const raw = JSON.parse(await readFile(BLOG_POSTS, 'utf8'))
  const items = Array.isArray(raw.items) ? [...raw.items] : []
  const byId = new Map(items.map((p) => [p.id, p]))
  const now = new Date().toISOString()

  for (const article of collectArticles()) {
    const enId = article.id
    const arId = `${article.id}-ar`
    const scope = article.countryCode || 'GCC'

    const existingEn = byId.get(enId)
    if (shouldSkip(existingEn)) {
      report.skipped.push(enId)
    } else {
      const post = buildEnglishPost(article, {
        updatedDate: now,
        status: 'draft',
        translationPairId: enId,
      })
      post._meta = { updatedBy: 'seed-blog-content', updatedAt: now }
      byId.set(enId, post)
      if (existingEn) report.updated.push(enId)
      else report.created.push(enId)
      report.englishDrafts++
    }

    const existingAr = byId.get(arId)
    if (shouldSkip(existingAr)) {
      report.skipped.push(arId)
    } else {
      const arPost = buildArabicDraft(article, {
        englishPostId: enId,
        translationPairId: enId,
        updatedDate: now,
        status: 'draft',
        translationStatus: 'needs_review',
      })
      arPost._meta = { updatedBy: 'seed-blog-content', updatedAt: now }
      byId.set(arId, arPost)
      if (existingAr) report.updated.push(arId)
      else report.created.push(arId)
      report.arabicDrafts++
    }
  }

  const nextItems = items.map((p) => byId.get(p.id) || p)
  for (const [id, post] of byId) {
    if (!nextItems.some((p) => p.id === id)) nextItems.push(post)
  }

  const nextDoc = {
    ...raw,
    items: nextItems,
    _meta: { ...(raw._meta || {}), updatedAt: now, updatedBy: 'seed-blog-content' },
  }

  console.log('\n=== Blog SEO Content Seed Report ===')
  console.log(`Seed version: ${BLOG_SEED_VERSION}`)
  console.log(`Dry run: ${DRY_RUN}`)
  console.log(`English drafts: ${report.englishDrafts}`)
  console.log(`Arabic drafts (needs_review): ${report.arabicDrafts}`)
  console.log(`Created: ${report.created.length}`)
  console.log(`Updated: ${report.updated.length}`)
  console.log(`Skipped: ${report.skipped.length}`)

  if (DRY_RUN) {
    console.log('\nDry run — no files written.')
    return
  }

  await mkdir(BACKUP_DIR, { recursive: true })
  const backupPath = path.join(BACKUP_DIR, `blogPosts.json-${Date.now()}.json`)
  await copyFile(BLOG_POSTS, backupPath)
  report.backupPath = backupPath
  await writeFile(BLOG_POSTS, `${JSON.stringify(nextDoc, null, 2)}\n`, 'utf8')
  console.log(`Backup: ${backupPath}`)
  console.log('Publishing: NOT performed — all seeded articles remain draft/noindex')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
