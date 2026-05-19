import { useCallback, useEffect, useState, type ChangeEvent } from 'react'
import { adminFetch, getAdminToken, readErrorMessage, friendlyAdminApiMessage } from './adminApi'
import { useAdminToast } from './AdminToastContext'
import { apiBase } from '../cms/api'

type MediaRow = {
  id: string
  url: string
  filename: string
  originalName: string
  size: number
  uploadedAt: string
}

type MediaLoadState = 'loading' | 'ready' | 'error'

export function AdminMedia() {
  const toast = useAdminToast()
  const [items, setItems] = useState<MediaRow[]>([])
  const [loadState, setLoadState] = useState<MediaLoadState>('loading')
  const [busy, setBusy] = useState(false)
  const [del, setDel] = useState<MediaRow | null>(null)

  const load = useCallback(() => {
    setLoadState('loading')
    adminFetch<MediaRow[]>('/api/admin/media')
      .then((rows) => {
        setItems(Array.isArray(rows) ? rows : [])
        setLoadState('ready')
      })
      .catch(() => {
        setItems([])
        setLoadState('error')
      })
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const publicFileUrl = (path: string) => {
    const b = apiBase().replace(/\/$/, '')
    const p = path.startsWith('/') ? path : `/${path}`
    if (b.startsWith('http')) return `${b}${p}`
    return `${window.location.origin}${b}${p}`
  }

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const token = getAdminToken()
      const res = await fetch(`${apiBase()}/api/admin/media`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: fd,
      })
      if (!res.ok) {
        throw new Error(await readErrorMessage(res))
      }
      const row = (await res.json()) as MediaRow
      setItems((prev) => [row, ...prev])
      setLoadState('ready')
      toast.push('Uploaded', 'success')
    } catch (err) {
      toast.push(err instanceof Error ? friendlyAdminApiMessage(err.message) : 'Upload failed', 'error')
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }

  const copy = (url: string) => {
    navigator.clipboard.writeText(publicFileUrl(url)).then(
      () => toast.push('URL copied', 'success'),
      () => toast.push('Copy failed', 'error'),
    )
  }

  const remove = async () => {
    if (!del) return
    try {
      await adminFetch(`/api/admin/media/${del.id}`, { method: 'DELETE' })
      setItems((prev) => prev.filter((x) => x.id !== del.id))
      setDel(null)
      toast.push('Deleted', 'success')
    } catch (e) {
      toast.push(e instanceof Error ? friendlyAdminApiMessage(e.message) : 'Delete failed', 'error')
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Media library</h1>
        <p className="text-sm text-slate-600">PNG, JPG, WebP, GIF, SVG, ICO — max 6MB.</p>
      </div>

      <label className="flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-slate-300 bg-white px-6 py-10 text-center shadow-sm hover:border-brand">
        <span className="text-sm font-semibold text-slate-800">{busy ? 'Uploading…' : 'Drop or choose image'}</span>
        <span className="mt-1 text-xs text-slate-500">Supports logo, favicon, hero, OG images</span>
        <input type="file" accept="image/*,.ico" className="sr-only" onChange={onFile} disabled={busy} />
      </label>

      {loadState === 'error' ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-950">
          <p className="font-medium">We couldn’t load the media library.</p>
          <p className="mt-1 text-amber-900/90">Check your connection, confirm the CMS server is running, then refresh this page. You can try uploading again once the connection is restored.</p>
        </div>
      ) : null}

      {loadState === 'loading' ? (
        <p className="text-sm text-slate-600">Loading…</p>
      ) : loadState === 'ready' && items.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white py-12 text-center text-sm text-slate-500">No media uploaded yet.</p>
      ) : loadState === 'ready' ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((m) => (
            <div key={m.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex h-36 items-center justify-center bg-slate-50">
                <img src={publicFileUrl(m.url)} alt="" className="max-h-full max-w-full object-contain p-2" />
              </div>
              <div className="space-y-1 border-t border-slate-100 p-4 text-xs">
                <p className="truncate font-mono font-medium text-slate-900">{m.originalName}</p>
                <p className="text-slate-500">
                  {m.filename} · {(m.size / 1024).toFixed(1)} KB · {new Date(m.uploadedAt).toLocaleString()}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <button type="button" className="rounded-lg bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand hover:bg-brand/20" onClick={() => copy(m.url)}>
                    Copy URL
                  </button>
                  <button type="button" className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100" onClick={() => setDel(m)}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {del ? (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900">Delete file?</h2>
            <p className="mt-2 text-sm text-slate-600">Remove {del.filename} from the server?</p>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100" onClick={() => setDel(null)}>
                Cancel
              </button>
              <button type="button" className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700" onClick={remove}>
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
