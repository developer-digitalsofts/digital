/**
 * Atomic file operations with backup and write locking for locale records.
 */
import fs from 'fs/promises'
import path from 'path'
import { nanoid } from 'nanoid'

const writeLocks = new Map()

export function createLocaleStorage({ dataDir, writeJsonFile, readJsonFile, safeReadJson }) {
  const LOCALE_RECORDS_FILE = 'localeRecords.json'
  const BACKUP_DIR = path.join(dataDir, 'backups', 'locale')

  async function ensureBackupDir() {
    await fs.mkdir(BACKUP_DIR, { recursive: true })
  }

  async function withWriteLock(key, fn) {
    while (writeLocks.has(key)) {
      await writeLocks.get(key)
    }
    let release
    const gate = new Promise((resolve) => {
      release = resolve
    })
    writeLocks.set(key, gate)
    try {
      return await fn()
    } finally {
      writeLocks.delete(key)
      release()
    }
  }

  async function backupFile(relPath) {
    await ensureBackupDir()
    const src = path.join(dataDir, relPath)
    try {
      const raw = await fs.readFile(src, 'utf8')
      const stamp = Date.now()
      const dest = path.join(BACKUP_DIR, `${relPath.replace(/[/\\]/g, '-')}-${stamp}.json`)
      await fs.writeFile(dest, raw, 'utf8')
      return dest
    } catch {
      return null
    }
  }

  async function readLocaleStore() {
    const fallback = { schemaVersion: 1, records: [], _meta: { createdAt: new Date().toISOString() } }
    return (await safeReadJson(LOCALE_RECORDS_FILE, fallback)) || fallback
  }

  async function writeLocaleStore(store) {
    store._meta = {
      ...(store._meta || {}),
      updatedAt: new Date().toISOString(),
    }
    await writeJsonFile(LOCALE_RECORDS_FILE, store)
    return store
  }

  async function mutateLocaleStore(mutator) {
    return withWriteLock(LOCALE_RECORDS_FILE, async () => {
      const backupPath = await backupFile(LOCALE_RECORDS_FILE)
      const store = await readLocaleStore()
      const snapshot = structuredClone(store)
      try {
        const result = await mutator(store)
        await writeLocaleStore(store)
        return { ok: true, store, result, backupPath }
      } catch (err) {
        if (backupPath) {
          try {
            const raw = await fs.readFile(backupPath, 'utf8')
            await fs.writeFile(path.join(dataDir, LOCALE_RECORDS_FILE), raw, 'utf8')
          } catch {
            /* best effort rollback */
          }
        } else {
          await writeLocaleStore(snapshot)
        }
        throw err
      }
    })
  }

  return {
    LOCALE_RECORDS_FILE,
    backupFile,
    readLocaleStore,
    writeLocaleStore,
    mutateLocaleStore,
    withWriteLock,
  }
}

export async function safeParseJsonFile(filePath, fallback = null) {
  try {
    const raw = await fs.readFile(filePath, 'utf8')
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function productionErrorMessage(err) {
  if (process.env.NODE_ENV === 'production') return 'An error occurred'
  return err instanceof Error ? err.message : String(err)
}
