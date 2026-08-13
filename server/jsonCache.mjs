/**
 * JSON file reads with timeout + in-memory TTL cache.
 * Prevents API handlers from hanging indefinitely on slow/unavailable storage.
 */

const DEFAULT_READ_TIMEOUT_MS = 8000
const DEFAULT_CACHE_TTL_MS = 30_000

/** @type {Map<string, { data: unknown, at: number }>} */
const cache = new Map()

export function clearJsonCache() {
  cache.clear()
}

export function jsonCacheStats() {
  return { entries: cache.size }
}

function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`${label}_TIMEOUT`)), ms)
    }),
  ])
}

/**
 * @param {object} opts
 * @param {(relPath: string) => Promise<unknown>} opts.readFile
 * @param {string} opts.relPath
 * @param {unknown} [opts.fallback]
 * @param {number} [opts.timeoutMs]
 * @param {number} [opts.cacheTtlMs]
 * @param {boolean} [opts.useCache]
 */
export async function readJsonCached(opts) {
  const {
    readFile,
    relPath,
    fallback = null,
    timeoutMs = DEFAULT_READ_TIMEOUT_MS,
    cacheTtlMs = DEFAULT_CACHE_TTL_MS,
    useCache = true,
  } = opts

  const hit = useCache ? cache.get(relPath) : null
  if (hit && Date.now() - hit.at < cacheTtlMs) {
    return hit.data
  }

  try {
    const data = await withTimeout(readFile(relPath), timeoutMs, `readJson:${relPath}`)
    if (useCache) cache.set(relPath, { data, at: Date.now() })
    return data
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    const timedOut = msg.includes('_TIMEOUT')
    if (hit && timedOut) {
      console.warn(`[jsonCache] ${relPath} read timed out — serving stale cache`)
      return hit.data
    }
    if (fallback !== null && (timedOut || (e && typeof e === 'object' && 'code' in e && e.code === 'ENOENT'))) {
      return fallback
    }
    throw e
  }
}

export function invalidateJsonCache(relPath) {
  cache.delete(relPath)
}

export function invalidateJsonCachePrefix(prefix) {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) cache.delete(key)
  }
}

export { DEFAULT_READ_TIMEOUT_MS, DEFAULT_CACHE_TTL_MS }
