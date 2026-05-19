import { useCallback, useEffect, useState } from 'react'
import { adminFetch, friendlyAdminApiMessage } from './adminApi'
import { useAdminToast } from './AdminToastContext'

type Props = {
  section: string
  title: string
  /** Compact panel for tabbed editors (no page-level H1). */
  embedded?: boolean
}

export function AdminJsonEditor({ section, title, embedded = false }: Props) {
  const toast = useAdminToast()
  const [text, setText] = useState('')
  const [metaLine, setMetaLine] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setLoading(true)
    setErr(null)
    Promise.all([
      adminFetch<unknown>(`/api/admin/data/${section}`),
      adminFetch<Record<string, { updatedAt?: string; updatedBy?: string }>>('/api/admin/content-meta').catch(
        (): Record<string, { updatedAt?: string; updatedBy?: string }> => ({}),
      ),
    ])
      .then(([data, meta]) => {
        setText(JSON.stringify(data, null, 2))
        const m = meta[section]
        setMetaLine(m?.updatedAt ? `Last saved: ${new Date(m.updatedAt).toLocaleString()} · ${m.updatedBy || '—'}` : null)
      })
      .catch((e: Error) => setErr(friendlyAdminApiMessage(e.message)))
      .finally(() => setLoading(false))
  }, [section])

  const onSave = useCallback(async () => {
    setErr(null)
    let parsed: unknown
    try {
      parsed = JSON.parse(text)
    } catch {
      setErr('Invalid JSON — fix syntax before saving.')
      toast.push('Invalid JSON', 'error')
      return
    }
    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
      setErr('Root value must be a JSON object.')
      toast.push('Root must be a JSON object', 'error')
      return
    }
    setSaving(true)
    try {
      await adminFetch(`/api/admin/data/${section}`, {
        method: 'PUT',
        body: JSON.stringify(parsed),
      })
      toast.push('Saved successfully', 'success')
      const meta = await adminFetch<Record<string, { updatedAt?: string; updatedBy?: string }>>('/api/admin/content-meta')
      const m = meta[section]
      setMetaLine(m?.updatedAt ? `Last saved: ${new Date(m.updatedAt).toLocaleString()} · ${m.updatedBy || '—'}` : null)
    } catch (e) {
      const msg = e instanceof Error ? friendlyAdminApiMessage(e.message) : 'Save failed'
      setErr(msg)
      toast.push(msg, 'error')
    } finally {
      setSaving(false)
    }
  }, [section, text, toast])

  if (loading) {
    return (
      <div className={`flex items-center gap-2 text-sm text-slate-600 ${embedded ? 'py-6' : ''}`}>
        <span className="size-4 animate-spin rounded-full border-2 border-brand border-t-transparent" aria-hidden />
        Loading…
      </div>
    )
  }

  const head = embedded ? (
    <div className="flex flex-col gap-1 border-b border-slate-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-sm font-bold text-slate-900">{title}</h2>
      {metaLine ? <p className="text-xs font-medium text-slate-500">{metaLine}</p> : null}
    </div>
  ) : (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="mt-1 text-sm text-slate-600">
          Edit JSON below. Bilingual fields use <code className="text-xs">en</code> / <code className="text-xs">ar</code>.
        </p>
      </div>
      {metaLine ? <p className="text-xs font-medium text-slate-500">{metaLine}</p> : null}
    </div>
  )

  return (
    <div className={embedded ? 'w-full max-w-full' : 'mx-auto max-w-4xl'}>
      {head}
      {err ? <p className={`rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 ${embedded ? 'mt-3' : 'mt-4'}`}>{err}</p> : null}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        className={`w-full rounded-xl border border-slate-200 bg-white p-4 font-mono text-sm text-slate-900 shadow-inner outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 ${
          embedded ? 'mt-3 h-[min(55vh,420px)]' : 'mt-6 h-[min(70vh,560px)]'
        }`}
      />
      <div
        className={`sticky bottom-0 z-10 mt-4 flex flex-wrap gap-3 border-t py-3 backdrop-blur ${
          embedded ? 'border-slate-200/80 bg-white/95' : 'border-slate-200/80 bg-[#f4f6f8]/95'
        }`}
      >
        <button
          type="button"
          disabled={saving}
          onClick={onSave}
          className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-brand-dark disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </div>
    </div>
  )
}
