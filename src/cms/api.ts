/** Central API client — same-origin relative URLs in production. */

export const API_TIMEOUT_MS = 9000

export class ApiError extends Error {
  status?: number
  isTimeout: boolean
  isOffline: boolean

  constructor(message: string, opts?: { status?: number; isTimeout?: boolean; isOffline?: boolean }) {
    super(message)
    this.name = 'ApiError'
    this.status = opts?.status
    this.isTimeout = opts?.isTimeout === true
    this.isOffline = opts?.isOffline === true
  }
}

function isLocalhostUrl(url: string): boolean {
  return /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?(\/|$)/i.test(url)
}

/**
 * Base URL for API requests. Empty string = same-origin relative paths (/api/...).
 * Never returns localhost in production browser builds (avoids baked-in dev env vars).
 * Ignores cross-host baked URLs (e.g. apex API URL while on www) — use relative /api.
 */
export function apiBase(): string {
  const v = import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_CMS_API_URL
  if (typeof v !== 'string' || !v.trim()) return ''
  const base = v.trim().replace(/\/$/, '')
  if (import.meta.env.PROD && typeof window !== 'undefined') {
    if (isLocalhostUrl(base)) {
      console.warn('[api] Ignoring localhost API URL in production — using same-origin /api')
      return ''
    }
    try {
      const configured = new URL(base)
      if (configured.host !== window.location.host) {
        console.warn('[api] Ignoring cross-host API URL in production — using same-origin /api')
        return ''
      }
    } catch {
      return ''
    }
  }
  return base
}

export function apiUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  return `${apiBase()}${p}`
}

export async function fetchWithTimeout(
  input: string,
  init?: RequestInit,
  timeoutMs = API_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController()
  const extSignal = init?.signal
  if (extSignal) {
    if (extSignal.aborted) {
      controller.abort()
    } else {
      extSignal.addEventListener('abort', () => controller.abort(), { once: true })
    }
  }
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    return await fetch(input, { ...init, signal: controller.signal })
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      throw new ApiError('Request timed out', { isTimeout: true, isOffline: true })
    }
    throw new ApiError('Network request failed', { isOffline: true })
  } finally {
    clearTimeout(timer)
  }
}

async function readBody(res: Response): Promise<string> {
  try {
    return await res.text()
  } catch {
    return ''
  }
}

function looksLikeHtml(body: string): boolean {
  const s = body.slice(0, 600)
  return /<!doctype html/i.test(s) || /<html[\s>]/i.test(s) || /cannot\s+(get|post|put|patch|delete)\s+\/api/i.test(s)
}

export async function fetchJson<T>(path: string, init?: RequestInit, timeoutMs = API_TIMEOUT_MS): Promise<T> {
  const url = apiUrl(path)
  let res: Response
  try {
    res = await fetchWithTimeout(url, init, timeoutMs)
  } catch (e) {
    if (e instanceof ApiError) throw e
    throw new ApiError('Network request failed', { isOffline: true })
  }

  const ct = res.headers.get('content-type') || ''
  const body = await readBody(res)

  if (looksLikeHtml(body) || (ct.includes('text/html') && !ct.includes('json'))) {
    throw new ApiError('API returned HTML instead of JSON', { status: res.status, isOffline: true })
  }

  if (!res.ok) {
    let message = body || `Request failed (${res.status})`
    try {
      const j = JSON.parse(body) as { error?: string; message?: string }
      if (j?.error) message = j.error
      else if (j?.message) message = j.message
    } catch {
      /* use raw */
    }
    throw new ApiError(message, { status: res.status })
  }

  if (!body.trim()) return undefined as T
  try {
    return JSON.parse(body) as T
  } catch {
    throw new ApiError('Invalid JSON response', { status: res.status, isOffline: true })
  }
}

/** Short-lived in-memory cache for public homepage payload (navigation + header). */
let homepageCache: { data: unknown; at: number } | null = null
const HOMEPAGE_CACHE_MS = 60_000

export async function fetchHomepage<T>(init?: RequestInit): Promise<T> {
  if (homepageCache && Date.now() - homepageCache.at < HOMEPAGE_CACHE_MS) {
    return homepageCache.data as T
  }
  const data = await fetchJson<T>('/api/homepage', {
    ...init,
    headers: {
      ...((init?.headers as Record<string, string>) || {}),
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
    },
    cache: 'no-store',
  })
  homepageCache = { data, at: Date.now() }
  return data
}

export function clearHomepageCache() {
  homepageCache = null
}
