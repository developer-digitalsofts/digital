import { useCallback, useEffect, useMemo, useState } from 'react'
import { adminFetch, adminDownloadBlob } from './adminApi'
import { useAdminToast } from './AdminToastContext'

type Lead = {
  id: string
  name: string
  email: string
  phone: string
  message: string
  topic: string
  company: string
  status: 'New' | 'Contacted' | 'Closed'
  sourcePage: string
  internalNote: string
  createdAt: string
  updatedAt: string
}

const statuses = ['New', 'Contacted', 'Closed'] as const

export function AdminLeads() {
  const toast = useAdminToast()
  const [rows, setRows] = useState<Lead[]>([])
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<string>('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [detail, setDetail] = useState<Lead | null>(null)
  const [delTarget, setDelTarget] = useState<Lead | null>(null)
  const [loading, setLoading] = useState(true)

  const qs = useMemo(() => {
    const p = new URLSearchParams()
    if (q.trim()) p.set('q', q.trim())
    if (status) p.set('status', status)
    if (from) p.set('from', from)
    if (to) p.set('to', to)
    const s = p.toString()
    return s ? `?${s}` : ''
  }, [q, status, from, to])

  const load = useCallback(() => {
    setLoading(true)
    adminFetch<Lead[]>(`/api/admin/leads${qs}`)
      .then(setRows)
      .catch((e: Error) => toast.push(e.message, 'error'))
      .finally(() => setLoading(false))
  }, [qs, toast])

  useEffect(() => {
    load()
  }, [load])

  const patch = async (id: string, body: Partial<Pick<Lead, 'status' | 'internalNote'>>) => {
    try {
      const updated = await adminFetch<Lead>(`/api/admin/leads/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      })
      setRows((prev) => prev.map((r) => (r.id === id ? updated : r)))
      setDetail((d) => (d?.id === id ? updated : d))
      toast.push('Lead updated', 'success')
    } catch (e) {
      toast.push(e instanceof Error ? e.message : 'Update failed', 'error')
    }
  }

  const remove = async () => {
    if (!delTarget) return
    try {
      await adminFetch(`/api/admin/leads/${delTarget.id}`, { method: 'DELETE' })
      setRows((prev) => prev.filter((r) => r.id !== delTarget.id))
      setDetail((d) => (d?.id === delTarget.id ? null : d))
      setDelTarget(null)
      toast.push('Lead deleted', 'success')
    } catch (e) {
      toast.push(e instanceof Error ? e.message : 'Delete failed', 'error')
    }
  }

  const exportCsv = async () => {
    try {
      const blob = await adminDownloadBlob('/api/admin/leads/export')
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'leads.csv'
      a.click()
      URL.revokeObjectURL(url)
      toast.push('Export started', 'success')
    } catch (e) {
      toast.push(e instanceof Error ? e.message : 'Export failed', 'error')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
          <p className="text-sm text-slate-600">Search, filter, export, and manage enquiry statuses.</p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-brand hover:text-brand"
        >
          Export CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, email, phone…"
          className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand"
        >
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-2 text-sm" />
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="rounded-lg border border-slate-200 px-2 py-2 text-sm" />
        <button type="button" onClick={load} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
          Apply
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <p className="p-6 text-sm text-slate-600">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">No leads match your filters.</p>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Topic</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 last:border-0">
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{new Date(r.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{r.name || '—'}</td>
                  <td className="max-w-[140px] truncate px-4 py-3">{r.email}</td>
                  <td className="px-4 py-3">{r.phone}</td>
                  <td className="max-w-[100px] truncate px-4 py-3">{r.topic || '—'}</td>
                  <td className="max-w-[120px] truncate px-4 py-3 text-xs text-slate-500">{r.sourcePage || '—'}</td>
                  <td className="px-4 py-3">
                    <select
                      value={r.status}
                      onChange={(e) => patch(r.id, { status: e.target.value as Lead['status'] })}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold"
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="space-x-2 px-4 py-3">
                    <button type="button" className="text-brand hover:underline" onClick={() => setDetail(r)}>
                      View
                    </button>
                    <button type="button" className="text-red-600 hover:underline" onClick={() => setDelTarget(r)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {detail ? (
        <div className="fixed inset-0 z-[140] flex items-end justify-center bg-black/40 p-4 sm:items-center" role="dialog">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-lg font-bold text-slate-900">Lead detail</h2>
              <button type="button" className="text-sm font-semibold text-slate-500 hover:text-slate-800" onClick={() => setDetail(null)}>
                Close
              </button>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <div>
                <dt className="font-semibold text-slate-700">Email</dt>
                <dd>{detail.email}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-700">Phone</dt>
                <dd>{detail.phone}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-700">Message</dt>
                <dd className="whitespace-pre-wrap text-slate-600">{detail.message || '—'}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-700">Internal note</dt>
                <textarea
                  defaultValue={detail.internalNote}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  onBlur={(e) => {
                    if (e.target.value !== detail.internalNote) patch(detail.id, { internalNote: e.target.value })
                  }}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold" onClick={() => patch(detail.id, { status: 'Contacted' })}>
                  Mark contacted
                </button>
                <button type="button" className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold" onClick={() => patch(detail.id, { status: 'Closed' })}>
                  Mark closed
                </button>
              </div>
            </dl>
          </div>
        </div>
      ) : null}

      {delTarget ? (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900">Delete lead?</h2>
            <p className="mt-2 text-sm text-slate-600">This will permanently remove {delTarget.email}.</p>
            <div className="mt-6 flex justify-end gap-2">
              <button type="button" className="rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100" onClick={() => setDelTarget(null)}>
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
