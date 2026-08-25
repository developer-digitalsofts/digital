/**
 * @deprecated Use verify-locale-phase.mjs (applies fixtures in a temporary session).
 * Writes fixtures to a gitignored temp file only — never to production localeRecords.json.
 * Usage: node scripts/seed-locale-test-records.mjs [--write-temp]
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFile } from 'node:fs/promises'
import { applyTestFixturesToStore } from './lib/locale-test-fixtures.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const LOCALE_STORE = path.resolve(__dirname, '../server/data/localeRecords.json')
const TEMP_DIR = path.resolve(__dirname, '../server/data/.test-fixtures')
const TEMP_FILE = path.join(TEMP_DIR, 'localeRecords-with-fixtures.json')

async function main() {
  const writeTemp = process.argv.includes('--write-temp')
  if (!writeTemp) {
    console.error('This script no longer writes to production localeRecords.json.')
    console.error('Run: node scripts/verify-locale-phase.mjs')
    console.error('Or export a temp fixture: node scripts/seed-locale-test-records.mjs --write-temp')
    process.exit(1)
  }

  const raw = await readFile(LOCALE_STORE, 'utf8')
  const store = applyTestFixturesToStore(JSON.parse(raw))
  await mkdir(TEMP_DIR, { recursive: true })
  await writeFile(TEMP_FILE, JSON.stringify(store, null, 2), 'utf8')
  console.log(`Wrote temporary fixture (${store.records?.length ?? 0} records) to ${TEMP_FILE}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
