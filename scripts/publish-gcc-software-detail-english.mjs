/**
 * Publish English software/industry detail locale records for SA, QA, OM, KW, BH.
 */
import { readFile } from 'node:fs/promises'
import { GCC_COUNTRIES } from '../server/gccLocalizedContent/profiles.mjs'
import { ALL_SOFTWARE_DETAIL_PAGES, softwareDetailContentType, softwareDetailIdentity } from '../server/gccLocalizedContent/softwareDetailCatalog.mjs'

const API = process.env.API_URL || 'http://127.0.0.1:3040'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@admin.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123'
const PUBLISH_COUNTRIES = GCC_COUNTRIES.filter((c) => c !== 'AE')

async function json(url, opts = {}) {
  const res = await fetch(url, opts)
  const body = await res.json().catch(() => ({}))
  return { res, body }
}

async function main() {
  const token = (
    await json(`${API}/api/admin/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    })
  ).body?.token
  if (!token) {
    console.error('Admin auth failed')
    process.exit(1)
  }
  const auth = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  const store = JSON.parse(await readFile('server/data/localeRecords.json', 'utf8'))
  const report = { published: [], failed: [] }

  for (const country of PUBLISH_COUNTRIES) {
    for (const page of ALL_SOFTWARE_DETAIL_PAGES) {
      const globalIdentity = softwareDetailIdentity(page.kind, page.slug)
      const contentType = softwareDetailContentType(page.kind)
      const record = (store.records || []).find(
        (r) =>
          r.countryCode === country &&
          r.languageCode === 'en' &&
          r.contentType === contentType &&
          r.globalIdentity === globalIdentity,
      )
      if (!record) continue
      if (record.publicationStatus === 'published') continue

      const pub = await json(`${API}/api/admin/locale/records/${record.id}/publish`, {
        method: 'POST',
        headers: auth,
      })
      const label = `${country}/en ${globalIdentity}`
      if (pub.res.ok) report.published.push(label)
      else report.failed.push(`${label}: ${pub.body?.error || pub.res.status}`)
    }
  }

  const sync = await json(`${API}/api/admin/locale/publish-store`, { method: 'POST', headers: auth, body: '{}' })
  if (!sync.res.ok) {
    console.error('publish-store failed:', sync.body?.error)
    process.exit(1)
  }

  console.log(`\nPublished: ${report.published.length}`)
  console.log(`Failed: ${report.failed.length}`)
  if (report.failed.length) {
    console.error(report.failed.slice(0, 10).join('\n'))
    process.exit(1)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
