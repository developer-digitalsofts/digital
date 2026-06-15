export function apiBase(): string {
  const v =
    import.meta.env.VITE_API_URL ||
    import.meta.env.NEXT_PUBLIC_CMS_API_URL
  if (typeof v === 'string' && v.trim()) return v.replace(/\/$/, '')
  return ''
}

export async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${apiBase()}${path.startsWith('/') ? path : `/${path}`}`
  const res = await fetch(url, init)
  if (!res.ok) {
    const errBody = await res.text().catch(() => '')
    throw new Error(errBody || `Request failed ${res.status}`)
  }
  return res.json() as Promise<T>
}
