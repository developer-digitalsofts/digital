/**
 * Draft vs published content store.
 * - Draft lives in server/data/*.json (admin edit/save)
 * - Published lives in server/data/published/*.json (public site)
 * - Missing published files are bootstrapped once from draft (never overwrite existing published)
 */
import fs from 'fs/promises'
import path from 'path'
import { nanoid } from 'nanoid'

const PUBLISH_META_FILE = 'publishMeta.json'

export function createPublishStore({ dataDir, writeJsonFile, safeReadJson, readJsonFile }) {
  const publishedDir = path.join(dataDir, 'published')

  async function ensurePublishedDir() {
    await fs.mkdir(publishedDir, { recursive: true })
  }

  function publishedRel(relPath) {
    return path.join('published', relPath).replace(/\\/g, '/')
  }

  async function readPublishMeta() {
    return (await safeReadJson(PUBLISH_META_FILE, {})) || {}
  }

  async function writePublishMeta(meta) {
    await writeJsonFile(PUBLISH_META_FILE, meta)
  }

  async function readDraft(relPath) {
    return safeReadJson(relPath, null)
  }

  /**
   * Read published content. If published file is missing and draft exists,
   * copy draft → published once (initial migrate). Never replaces existing published.
   */
  async function readPublished(relPath, { bootstrap = true } = {}) {
    await ensurePublishedDir()
    const pubRel = publishedRel(relPath)
    let data = await safeReadJson(pubRel, null)
    if (data != null) return data
    if (!bootstrap) return null
    const draft = await safeReadJson(relPath, null)
    if (draft == null) return null
    await writeJsonFile(pubRel, draft)
    const meta = await readPublishMeta()
    const key = relPath.replace(/\.json$/i, '')
    const now = new Date().toISOString()
    meta[key] = {
      ...(meta[key] || {}),
      lastPublishedAt: meta[key]?.lastPublishedAt || now,
      lastSavedAt: meta[key]?.lastSavedAt || draft?._meta?.updatedAt || now,
      hasUnpublishedChanges: false,
      bootstrappedAt: now,
    }
    await writePublishMeta(meta)
    return draft
  }

  async function markDraftSaved(key, email) {
    const meta = await readPublishMeta()
    const now = new Date().toISOString()
    const prev = meta[key] || {}
    meta[key] = {
      ...prev,
      lastSavedAt: now,
      lastSavedBy: email || '',
      hasUnpublishedChanges: true,
    }
    await writePublishMeta(meta)
    return meta[key]
  }

  async function publishFile(relPath, key, email) {
    await ensurePublishedDir()
    const draft = await readJsonFile(relPath)
    const pubRel = publishedRel(relPath)
    // Atomic-ish write via writeJsonFile
    await writeJsonFile(pubRel, draft)
    const meta = await readPublishMeta()
    const now = new Date().toISOString()
    meta[key] = {
      ...(meta[key] || {}),
      lastSavedAt: meta[key]?.lastSavedAt || draft?._meta?.updatedAt || now,
      lastPublishedAt: now,
      lastPublishedBy: email || '',
      hasUnpublishedChanges: false,
    }
    await writePublishMeta(meta)
    return { published: draft, status: meta[key] }
  }

  async function getSectionStatus(key, relPath) {
    const meta = await readPublishMeta()
    const row = meta[key] || {}
    const draft = await safeReadJson(relPath, null)
    const published = await safeReadJson(publishedRel(relPath), null)
    let status = 'Draft'
    if (published) {
      status = row.hasUnpublishedChanges ? 'Unpublished Changes' : 'Published'
    }
    return {
      status,
      lastSavedAt: row.lastSavedAt || draft?._meta?.updatedAt || null,
      lastPublishedAt: row.lastPublishedAt || null,
      hasUnpublishedChanges: Boolean(row.hasUnpublishedChanges) || (published == null && draft != null),
      hasPublished: published != null,
    }
  }

  function stripMeta(doc) {
    if (!doc || typeof doc !== 'object' || Array.isArray(doc)) return doc
    if (!('_meta' in doc)) return doc
    const { _meta: _m, ...rest } = doc
    return rest
  }

  return {
    publishedDir,
    publishedRel,
    ensurePublishedDir,
    readDraft,
    readPublished,
    markDraftSaved,
    publishFile,
    getSectionStatus,
    readPublishMeta,
    stripMeta,
    PUBLISH_META_FILE,
  }
}

export function stableStringify(value) {
  return JSON.stringify(value)
}

export { nanoid }
