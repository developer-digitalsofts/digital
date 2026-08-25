/**
 * Temporary test fixtures via admin API (uses server writeJsonFile + cache invalidation).
 */
import { defaultLocaleRecord } from '../../server/localeContentModel.mjs'
import { TEST_RECORDS, isTestRecordId } from './locale-test-fixtures.mjs'

const API = process.env.API_URL || 'http://127.0.0.1:3040'

async function json(url, opts) {
  const res = await fetch(url, opts)
  const body = await res.json().catch(() => ({}))
  return { res, body }
}

function fixtureId(partial) {
  return `loc_test_${partial.countryCode.toLowerCase()}_${partial.slug}_${partial.languageCode}`
}

function matchRecord(records, partial) {
  return (records || []).find(
    (r) =>
      r.contentType === partial.contentType &&
      r.globalIdentity === partial.globalIdentity &&
      r.countryCode === partial.countryCode &&
      r.languageCode === partial.languageCode,
  )
}

/**
 * Apply test fixtures through admin API, run fn, then restore prior records.
 * @param {(auth: Record<string, string>) => Promise<void>} fn
 * @param {Record<string, string>} auth
 */
export async function withDraftTestFixtures(fn, auth) {
  const createdIds = []
  const restored = []

  try {
    const draft = await json(`${API}/api/admin/locale/records`, { headers: auth })
    const records = draft.body?.records || []
    const aeErp = records.find((r) => r.globalIdentity === 'erp' && r.countryCode === 'AE' && r.languageCode === 'en')

    for (const partial of TEST_RECORDS) {
      const existing = matchRecord(records, partial)
      const id = existing?.id || fixtureId(partial)
      if (existing) restored.push({ kind: 'put', id, snapshot: structuredClone(existing) })

      const record = defaultLocaleRecord({
        ...(existing || {}),
        ...partial,
        id,
        sourceRecordId: existing?.sourceRecordId || aeErp?.id || null,
        translationGroupId: existing?.translationGroupId || aeErp?.translationGroupId,
        enabled: true,
        updatedAt: new Date().toISOString(),
      })

      const write = existing
        ? await json(`${API}/api/admin/locale/records/${id}`, {
            method: 'PUT',
            headers: auth,
            body: JSON.stringify(record),
          })
        : await json(`${API}/api/admin/locale/records`, {
            method: 'POST',
            headers: auth,
            body: JSON.stringify(record),
          })

      if (!write.res.ok) {
        throw new Error(`Fixture apply failed for ${partial.countryCode}/${partial.languageCode}/${partial.globalIdentity}: ${write.body?.error || write.res.status}`)
      }
      if (!existing) createdIds.push(id)
    }

    await fn(auth)
  } finally {
    for (const item of [...restored].reverse()) {
      await json(`${API}/api/admin/locale/records/${item.id}`, {
        method: 'PUT',
        headers: auth,
        body: JSON.stringify(item.snapshot),
      })
    }
    for (const id of createdIds) {
      await json(`${API}/api/admin/locale/records/${id}`, { method: 'DELETE', headers: auth })
    }
  }
}

export async function purgeLeakedTestRecords(auth) {
  const draft = await json(`${API}/api/admin/locale/records`, { headers: auth })
  const leaked = (draft.body?.records || []).filter((r) => isTestRecordId(r.id))
  for (const rec of leaked) {
    await json(`${API}/api/admin/locale/records/${rec.id}`, { method: 'DELETE', headers: auth })
  }
}