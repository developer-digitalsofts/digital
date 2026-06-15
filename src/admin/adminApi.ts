import { apiBase } from '../cms/api'

const TOKEN_KEY = 'dm_admin_token'

/** Shown when the response is HTML (e.g. Vite 404) or non-JSON noise. */
export const ADMIN_API_GENERIC_ERROR =
  'Data could not be loaded. Please refresh or check API server.'

export const ADMIN_API_OFFLINE_HINT =
  'CMS API is not reachable. Run npm run dev (starts frontend + API together) or npm run dev:api in a second terminal.'

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

export async function adminFetch<T = unknown>(path: string, init?: RequestInit): Promise<T> {
  const url = `${apiBase()}${path.startsWith('/') ? path : `/${path}`}`
  const headers = new Headers(init?.headers)
  const tok = getAdminToken()
  if (tok) headers.set('Authorization', `Bearer ${tok}`)
  if (init?.body && typeof init.body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  let res: Response
  try {
    res = await fetch(url, { ...init, headers })
  } catch {
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
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return res.json() as Promise<T>
  const text = await res.text()
  const trimmed = text.trim()
  if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
    try {
      return JSON.parse(trimmed) as T
    } catch {
      throw new Error(ADMIN_API_OFFLINE_HINT)
    }
  }
  throw new Error(ADMIN_API_OFFLINE_HINT)
}

export async function adminDownloadBlob(path: string): Promise<Blob> {
  const url = `${apiBase()}${path.startsWith('/') ? path : `/${path}`}`
  const headers = new Headers()
  const tok = getAdminToken()
  if (tok) headers.set('Authorization', `Bearer ${tok}`)

  let res: Response
  try {
    res = await fetch(url, { headers })
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
