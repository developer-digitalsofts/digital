/**
 * Publish verified English locale CMS records for SA, QA, OM, KW, BH
 * through the real admin API (per-record publish → publish-store sync).
 *
 * Usage: node scripts/publish-gcc-locale-english.mjs [--dry-run]
 */
import { readFile } from 'node:fs/promises'
import { GCC_COUNTRIES } from '../server/gccLocalizedContent/profiles.mjs'

const API = process.env.API_URL || 'http://127.0.0.1:3040'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@admin.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123'
const DRY_RUN = process.argv.includes('--dry-run')
const PUBLISH_COUNTRIES = GCC_COUNTRIES.filter((c) => c !== 'AE')

async function json(url, opts = {}) {
  const res = await fetch(url, opts)
  const body = await res.json().catch(() => ({}))
  return { res, body }
}

async function adminToken() {
  const login = await json(`${API}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })
  return login.body?.token || null
}

async function main() {
  const token = await adminToken()
  if (!token) {
    console.error('Admin auth failed')
    process.exit(1)
  }
  const auth = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  const store = JSON.parse(await readFile('server/data/localeRecords.json', 'utf8'))
  const report = { published: [], skipped: [], failed: [] }

  for (const country of PUBLISH_COUNTRIES) {
    const records = (store.records || []).filter(
      (r) =>
        r.countryCode === country &&
        r.languageCode === 'en' &&
        r.publicationStatus !== 'published' &&
        r.enabled !== false &&
        (r.inheritanceMode === 'override' || r.payload?._seedVersion),
    )

    for (const record of records) {
      const label = `${country}/en ${record.contentType}/${record.globalIdentity}`
      if (DRY_RUN) {
        report.skipped.push(`${label} (dry-run)`)
        continue
      }

      const pub = await json(`${API}/api/admin/locale/records/${record.id}/publish`, {
        method: 'POST',
        headers: auth,
      })

      if (pub.res.ok) {
        report.published.push(label)
      } else {
        report.failed.push(`${label}: ${pub.body?.error || pub.res.status}`)
      }
    }
  }

  if (!DRY_RUN) {
    const sync = await json(`${API}/api/admin/locale/publish-store`, { method: 'POST', headers: auth, body: '{}' })
    if (!sync.res.ok) {
      console.error('publish-store failed:', sync.body?.error || sync.res.status)
      process.exit(1)
    }
  }

  console.log('\n=== GCC English Locale Publish Report ===')
  console.log(`Dry run: ${DRY_RUN}`)
  console.log(`Published: ${report.published.length}`)
  for (const line of report.published) console.log(`  ✓ ${line}`)
  console.log(`Skipped: ${report.skipped.length}`)
  console.log(`Failed: ${report.failed.length}`)
  for (const line of report.failed) console.error(`  ✗ ${line}`)

  if (report.failed.length) process.exit(1)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
