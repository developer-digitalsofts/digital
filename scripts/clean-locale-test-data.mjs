/**
 * Remove [TEST]/[اختبار] locale records from persistent CMS data stores.
 * Usage: node scripts/clean-locale-test-data.mjs
 */
import { readFile, writeFile } from 'node:fs/promises'
import { invalidateJsonCache } from '../server/jsonCache.mjs'
import { cleanLocaleStore } from './lib/locale-test-fixtures.mjs'

const TARGETS = ['server/data/localeRecords.json', 'server/data/published/localeRecords.json']

async function cleanFile(relPath) {
  const raw = await readFile(relPath, 'utf8')
  const parsed = JSON.parse(raw)
  const { store, removedIds, restored } = cleanLocaleStore(parsed)
  await writeFile(relPath, JSON.stringify(store, null, 2), 'utf8')
  if (relPath.endsWith('localeRecords.json')) invalidateJsonCache('localeRecords.json')
  return { relPath, removedIds, restored, recordCount: store.records?.length ?? 0 }
}

async function main() {
  const reports = []
  for (const relPath of TARGETS) {
    try {
      reports.push(await cleanFile(relPath))
    } catch (err) {
      if (err?.code === 'ENOENT') {
        console.log(`• Skipped missing file: ${relPath}`)
        continue
      }
      throw err
    }
  }

  for (const report of reports) {
    console.log(`✓ Cleaned ${report.relPath} — removed ${report.removedIds.length} test record(s), ${report.recordCount} records remain`)
    if (report.removedIds.length) console.log(`  removed: ${report.removedIds.join(', ')}`)
    if (report.restored.length) console.log(`  restored inherit placeholders: ${report.restored.join(', ')}`)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
