import { useCallback, useEffect, useState } from 'react'
import { adminFetch, getAdminToken, readErrorMessage } from '../adminApi'
import { useAdminToast } from '../AdminToastContext'
import { resolvePublicMediaUrl } from '../../cms/publicMediaUrl'
import { apiBase } from '../../cms/api'

type MediaRow = { id: string; url: string; originalName: string }

type Props = {
  label: string
  value: string
  onChange: (url: string) => void
  hint?: string
  /** Larger preview for detail-page hero images. */
  variant?: 'default' | 'hero'
}

export function AdminLayoutMediaField({ label, value, onChange, hint, variant = 'default' }: Props) {
  const toast = useAdminToast()
  const [items, setItems] = useState<MediaRow[]>([])
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState(false)

  const load = useCallback(() => {
    adminFetch<MediaRow[]>('/api/admin/media')
      .then((rows) => setItems(Array.isArray(rows) ? rows : []))
      .catch(() => setItems([]))
  }, [])

  useEffect(() => {
    if (open) load()
  }, [open, load])

  const onPick = (url: string) => {
    onChange(url)
    setOpen(false)
    toast.push('Image selected from library', 'success')
  }

  const onUpload = async (file: File | null) => {
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
        toast.push(await readErrorMessage(res), 'error')
        return
      }
      const row = (await res.json()) as MediaRow
      onChange(row.url)
      setOpen(false)
      load()
      toast.push('Image uploaded', 'success')
    } finally {
      setBusy(false)
    }
  }

  const previewSrc = value ? resolvePublicMediaUrl(value) : ''
  const previewClass =
    variant === 'hero'
      ? 'h-40 w-full max-w-md rounded-xl border border-slate-200 object-cover shadow-sm'
      : 'h-10 max-w-[120px] object-contain'

  return (
    <div className="space-y-2">
      <span className="block text-sm font-semibold text-slate-800">{label}</span>
      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/uploads/… or https://…"
        />
        <div className="flex shrink-0 gap-2">
          <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50">
            {busy ? '…' : 'Upload'}
            <input type="file" accept="image/*,.ico" className="sr-only" onChange={(e) => void onUpload(e.target.files?.[0] ?? null)} disabled={busy} />
          </label>
          <button
            type="button"
            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? 'Close' : 'Library'}
          </button>
          {value ? (
            <button
              type="button"
              className="rounded-xl border border-red-200 bg-white px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50"
              onClick={() => onChange('')}
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>
      {previewSrc ? (
        <div
          className={
            variant === 'hero'
              ? 'rounded-xl border border-slate-100 bg-slate-50/80 p-3'
              : 'flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3'
          }
        >
          <img src={previewSrc} alt="" className={previewClass} />
          {variant !== 'hero' ? <span className="truncate font-mono text-[11px] text-slate-600">{value}</span> : null}
          {variant === 'hero' ? (
            <span className="mt-2 block truncate font-mono text-[11px] text-slate-600">{value}</span>
          ) : null}
        </div>
      ) : null}
      {open ? (
        <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-inner">
          {items.length === 0 ? (
            <p className="p-3 text-xs text-slate-500">No files yet. Upload above or add files in Media Library.</p>
          ) : (
            <ul className="grid gap-1 sm:grid-cols-2">
              {items.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-lg border border-transparent p-2 text-left hover:border-brand/40 hover:bg-orange-50/50"
                    onClick={() => onPick(m.url)}
                  >
                    <img src={resolvePublicMediaUrl(m.url)} alt="" className="size-10 shrink-0 rounded bg-slate-100 object-contain" />
                    <span className="truncate text-xs font-medium text-slate-800">{m.originalName}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  )
}
