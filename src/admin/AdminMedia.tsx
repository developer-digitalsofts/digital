import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react'
import { Copy, Eye, Trash2, Upload } from 'lucide-react'
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

function formatFileType(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  return ext ? ext.toUpperCase() : 'FILE'
}

export function AdminMedia() {
  const toast = useAdminToast()
  const fileRef = useRef<HTMLInputElement>(null)
  const [items, setItems] = useState<MediaRow[]>([])
  const [loadState, setLoadState] = useState<MediaLoadState>('loading')
  const [busy, setBusy] = useState(false)
  const [del, setDel] = useState<MediaRow | null>(null)
  const [preview, setPreview] = useState<MediaRow | null>(null)

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

  const uploadFile = async (file: File) => {
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
      toast.push('Uploaded successfully', 'success')
    } catch (err) {
      toast.push(err instanceof Error ? friendlyAdminApiMessage(err.message) : 'Upload failed', 'error')
    } finally {
      setBusy(false)
    }
  }

  const onFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await uploadFile(file)
    e.target.value = ''
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
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Media Library</h1>
          <p className="mt-1 text-sm text-slate-600">Upload and manage images for detail pages, hero sections, and custom pages.</p>
          <p className="mt-1 text-xs text-slate-500">Allowed: JPG, JPEG, PNG, WebP, SVG, GIF, ICO — max 6MB</p>
        </div>
        <button
          type="button"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark disabled:opacity-60"
        >
          <Upload className="size-4" aria-hidden />
          {busy ? 'Uploading…' : 'Upload Media'}
        </button>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif,.ico" className="sr-only" onChange={onFile} disabled={busy} />
      </div>

      <label className="flex cursor-pointer flex-col items-center rounded-2xl border-2 border-dashed border-slate-300 bg-white px-6 py-8 text-center hover:border-brand">
        <span className="text-sm font-semibold text-slate-800">{busy ? 'Uploading…' : 'Drop image here or click to browse'}</span>
        <span className="mt-1 text-xs text-slate-500">Files are stored in /uploads and can be selected in page forms</span>
        <input type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif,.ico" className="sr-only" onChange={onFile} disabled={busy} />
      </label>

      {loadState === 'error' ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-950">
          <p className="font-medium">We couldn’t load the media library.</p>
          <p className="mt-1">Confirm the CMS server is running, then refresh this page.</p>
        </div>
      ) : null}

      {loadState === 'loading' ? (
        <p className="text-sm text-slate-600">Loading…</p>
      ) : loadState === 'ready' && items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center text-sm text-slate-500">No media uploaded yet. Click Upload Media to add your first file.</p>
      ) : loadState === 'ready' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((m) => (
            <div key={m.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <button type="button" className="block w-full" onClick={() => setPreview(m)}>
                <div className="flex h-36 items-center justify-center bg-slate-50">
                  <img src={publicFileUrl(m.url)} alt="" className="max-h-full max-w-full object-contain p-2" />
                </div>
              </button>
              <div className="space-y-1 border-t border-slate-100 p-3 text-xs">
                <p className="truncate font-medium text-slate-900">{m.originalName}</p>
                <p className="text-slate-500">
                  {formatFileType(m.originalName)} · {(m.size / 1024).toFixed(1)} KB · {new Date(m.uploadedAt).toLocaleString()}
                </p>
                <p className="truncate font-mono text-[10px] text-slate-400">{m.url}</p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  <button type="button" className="inline-flex items-center gap-1 rounded-lg bg-brand/10 px-2.5 py-1.5 text-xs font-semibold text-brand hover:bg-brand/20" onClick={() => copy(m.url)}>
                    <Copy className="size-3" aria-hidden />
                    Copy URL
                  </button>
                  <button type="button" className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50" onClick={() => setPreview(m)}>
                    <Eye className="size-3" aria-hidden />
                    Preview
                  </button>
                  <button type="button" className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100" onClick={() => setDel(m)}>
                    <Trash2 className="size-3" aria-hidden />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {preview ? (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 p-4" onClick={() => setPreview(null)}>
          <div className="max-h-[90vh] max-w-3xl overflow-auto rounded-2xl bg-white p-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <img src={publicFileUrl(preview.url)} alt={preview.originalName} className="mx-auto max-h-[70vh] object-contain" />
            <p className="mt-3 text-center text-sm font-medium text-slate-900">{preview.originalName}</p>
            <p className="mt-1 text-center font-mono text-xs text-slate-500">{preview.url}</p>
            <div className="mt-4 flex justify-center gap-2">
              <button type="button" className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white" onClick={() => copy(preview.url)}>
                Copy URL
              </button>
              <button type="button" className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-800" onClick={() => setPreview(null)}>
                Close
              </button>
            </div>
          </div>
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
              <button type="button" className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700" onClick={() => void remove()}>
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
