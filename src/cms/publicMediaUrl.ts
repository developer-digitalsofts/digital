import { apiBase } from './api'

/** Resolve CMS media paths (/uploads/…) and absolute URLs for img src. */
export function resolvePublicMediaUrl(path: string | undefined | null): string {
  const raw = (path ?? '').trim()
  if (!raw) return ''
  if (/^(https?:|data:|blob:)/i.test(raw)) return raw
  const normalized = raw.startsWith('/') ? raw : `/${raw}`
  const base = apiBase().replace(/\/$/, '')
  if (base.startsWith('http')) return `${base}${normalized}`
  if (typeof window !== 'undefined') return `${window.location.origin}${normalized}`
  return normalized
}
