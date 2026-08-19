#!/usr/bin/env node
/**
 * Run CMS schema v2 migration on draft and published JSON files.
 * Safe to run repeatedly — migration is idempotent.
 */
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { migrateCmsSchemaV2 } from '../server/cmsSchemaMigrate.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA_DIR = path.join(__dirname, '..', 'server', 'data')

async function readJsonFile(relPath) {
  const p = path.join(DATA_DIR, relPath)
  const raw = await fs.readFile(p, 'utf8')
  return JSON.parse(raw)
}

async function writeJsonFile(relPath, data) {
  const p = path.join(DATA_DIR, relPath)
  await fs.mkdir(path.dirname(p), { recursive: true })
  const tmp = `${p}.tmp`
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8')
  await fs.rename(tmp, p)
}

async function safeReadJson(relPath, fallback = null) {
  try {
    return await readJsonFile(relPath)
  } catch {
    return fallback
  }
}

const draft = await migrateCmsSchemaV2({
  dataDir: DATA_DIR,
  readJsonFile,
  writeJsonFile,
  safeReadJson,
})

const published = await migrateCmsSchemaV2({
  dataDir: path.join(DATA_DIR, 'published'),
  readJsonFile: (relPath) => readJsonFile(`published/${relPath}`),
  writeJsonFile: (relPath, data) => writeJsonFile(`published/${relPath}`, data),
  safeReadJson: (relPath, fallback) => safeReadJson(`published/${relPath}`, fallback),
})

console.log(JSON.stringify({ ok: true, draft, published }, null, 2))
