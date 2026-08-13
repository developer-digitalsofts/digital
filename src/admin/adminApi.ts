import {
  apiBase,
  apiUrl,
  ApiError,
  fetchWithTimeout,
} from '../cms/api'

export { API_TIMEOUT_MS } from '../cms/api'

const TOKEN_KEY = 'dm_admin_token'

const ADMIN_API_OFFLINE_DEV =
  'CMS API is not reachable. Run npm run dev (starts frontend + API together) or npm run dev:api in a second terminal.'

/** Shown in production when the API is down or returns HTML. */
export const ADMIN_API_OFFLINE_HINT = import.meta.env.PROD
  ? 'CMS service is temporarily unavailable. Please try again.'
  : ADMIN_API_OFFLINE_DEV

export const ADMIN_API_GENERIC_ERROR = import.meta.env.PROD
  ? 'CMS service is temporarily unavailable. Please try again.'
  : 'Data could not be loaded. Please refresh or check API server.'

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setAdminToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export function friendlyAdminApiMessage(raw: string, status?: number): string {
  const t = raw.trim()
  if (!t) {
    if (status === 502 || status === 503 || status === 504) return ADMIN_API_OFFLINE_HINT
    return status && status >= 500 ? ADMIN_API_GENERIC_ERROR : `Request failed: ${status ?? ''}`.trim()
  }
  if (/cannot\s+(get|post|put|patch|delete)\s+/i.test(t.slice(0, 400))) return ADMIN_API_OFFLINE_HINT
  if (/<!doctype html/i.test(t) || /<html[\s>]/i.test(t)) return ADMIN_API_OFFLINE_HINT
  if (t.length > 400 && /<body/i.test(t)) return ADMIN_API_OFFLINE_HINT
  if (/request timed out/i.test(t) || /network request failed/i.test(t)) return ADMIN_API_OFFLINE_HINT
  try {
    const j = JSON.parse(t) as { error?: string; message?: string; success?: boolean }
    if (j && typeof j.message === 'string' && j.message.trim()) return j.message.trim()
    if (j && typeof j.error === 'string' && j.error.trim()) {
      const er = j.error.trim()
      if (er === 'Unknown resource' || /cannot\s+(get|post|put|patch|delete)/i.test(er)) return ADMIN_API_OFFLINE_HINT
      return er
    }
  } catch {
    /* ignore */
  }
  if (t.length > 400) return ADMIN_API_GENERIC_ERROR
  return t
}

export async function readErrorMessage(res: Response): Promise<string> {
  const text = await res.text().catch(() => '')
  return friendlyAdminApiMessage(text, res.status)
}

async function parseAdminJson<T>(res: Response): Promise<T> {
  const ct = res.headers.get('content-type') || ''
  const text = await res.text()
  const trimmed = text.trim()
  if (/<!doctype html/i.test(trimmed) || /<html[\s>]/i.test(trimmed)) {
    throw new Error(ADMIN_API_OFFLINE_HINT)
  }
  if (ct.includes('application/json') || trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      return JSON.parse(trimmed) as T
    } catch {
      throw new Error(ADMIN_API_OFFLINE_HINT)
    }
  }
  throw new Error(ADMIN_API_OFFLINE_HINT)
}

export async function adminFetch<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const url = apiUrl(path)
  const headers = new Headers(init?.headers)
  const tok = getAdminToken()
  if (tok) headers.set('Authorization', `Bearer ${tok}`)
  if (init?.body && typeof init.body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  let res: Response
  try {
    res = await fetchWithTimeout(url, { ...init, headers })
  } catch (e) {
    if (e instanceof ApiError) {
      throw new Error(e.isTimeout ? 'Request timed out — CMS service is slow or unavailable.' : e.message || ADMIN_API_OFFLINE_HINT)
    }
    throw new Error(ADMIN_API_OFFLINE_HINT)
  }

  if (res.status === 401) {
    const msg = await readErrorMessage(res)
    setAdminToken(null)
    if (!path.includes('/auth/login')) {
      window.location.href = `/admin/login?return=${encodeURIComponent(window.location.pathname + window.location.search)}`
    }
    throw new Error(msg)
  }
  if (!res.ok) {
    throw new Error(await readErrorMessage(res))
  }
  if (res.status === 204) return undefined as T
  return parseAdminJson<T>(res)
}

export async function adminDownloadBlob(path: string): Promise<Blob> {
  const url = apiUrl(path)
  const headers = new Headers()
  const tok = getAdminToken()
  if (tok) headers.set('Authorization', `Bearer ${tok}`)

  let res: Response
  try {
    res = await fetchWithTimeout(url, { headers })
  } catch {
    throw new Error(ADMIN_API_OFFLINE_HINT)
  }

  if (res.status === 401) {
    const msg = await readErrorMessage(res)
    setAdminToken(null)
    window.location.href = `/admin/login?return=${encodeURIComponent(window.location.pathname + window.location.search)}`
    throw new Error(msg)
  }
  if (!res.ok) throw new Error(await readErrorMessage(res))
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('text/html')) throw new Error(ADMIN_API_OFFLINE_HINT)
  return res.blob()
}

/** @deprecated use apiUrl — kept for uploads that need absolute base */
export { apiBase }
