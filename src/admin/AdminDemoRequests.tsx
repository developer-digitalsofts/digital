import { useCallback, useEffect, useMemo, useState } from 'react'
import { adminDownloadBlob, adminFetch } from './adminApi'
import { useAdminToast } from './AdminToastContext'

export type DemoRequestStatus =
  | 'New'
  | 'Contacted'
  | 'Demo Scheduled'
  | 'Follow-up'
  | 'Converted'
  | 'Not Interested'
  | 'Closed'

export type DemoRequest = {
  id: string
  name: string
  email: string
  phone: string
  message: string
  topic: string
  company: string
  productService: string
  status: DemoRequestStatus
  sourcePage: string
  source: string
  internalNote: string
  assignedTo: string
  followUpAt: string
  createdAt: string
  updatedAt: string
}

const STATUSES: DemoRequestStatus[] = [
  'New',
  'Contacted',
  'Demo Scheduled',
  'Follow-up',
  'Converted',
  'Not Interested',
  'Closed',
]

const PAGE_SIZE = 20

function formatSource(row: DemoRequest): string {
  if (row.source?.trim()) return row.source.trim()
  if (row.sourcePage.includes('header-get-demo')) return 'Header — Get Demo'
  return row.sourcePage || 'Website'
}

function toLocalDatetimeInput(iso: string): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function AdminDemoRequests() {
  const toast = useAdminToast()
  const [rows, setRows] = useState<DemoRequest[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<string>('')
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [detail, setDetail] = useState<DemoRequest | null>(null)
  const [delTarget, setDelTarget] = useState<DemoRequest | null>(null)
  const [loading, setLoading] = useState(true)

  const qs = useMemo(() => {
    const p = new URLSearchParams()
    if (q.trim()) p.set('q', q.trim())
    if (status) p.set('status', status)
    if (from) p.set('from', from)
    if (to) p.set('to', to)
    p.set('page', String(page))
    p.set('pageSize', String(PAGE_SIZE))
    return `?${p.toString()}`
  }, [q, status, from, to, page])

  const load = useCallback(() => {
    setLoading(true)
    adminFetch<{ items: DemoRequest[]; total: number; page: number }>(`/api/admin/demo-requests${qs}`)
      .then((data) => {
        setRows(data.items)
        setTotal(data.total)
      })
      .catch((e: Error) => toast.push(e.message, 'error'))
      .finally(() => setLoading(false))
  }, [qs, toast])

  useEffect(() => {
    load()
  }, [load])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const patch = async (
    id: string,
    body: Partial<Pick<DemoRequest, 'status' | 'internalNote' | 'assignedTo' | 'followUpAt'>>,
  ) => {
    try {
      const updated = await adminFetch<DemoRequest>(`/api/admin/demo-requests/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(body),
      })
      setRows((prev) => prev.map((r) => (r.id === id ? updated : r)))
      setDetail((d) => (d?.id === id ? updated : d))
      toast.push('Demo request updated', 'success')
    } catch (e) {
      toast.push(e instanceof Error ? e.message : 'Update failed', 'error')
    }
  }

  const remove = async () => {
    if (!delTarget) return
    try {
      await adminFetch(`/api/admin/demo-requests/${delTarget.id}`, { method: 'DELETE' })
      setRows((prev) => prev.filter((r) => r.id !== delTarget.id))
      setTotal((t) => Math.max(0, t - 1))
      setDetail((d) => (d?.id === delTarget.id ? null : d))
      setDelTarget(null)
      toast.push('Demo request deleted', 'success')
    } catch (e) {
      toast.push(e instanceof Error ? e.message : 'Delete failed', 'error')
    }
  }

  const exportCsv = async () => {
    try {
      const p = new URLSearchParams()
      if (q.trim()) p.set('q', q.trim())
      if (status) p.set('status', status)
      if (from) p.set('from', from)
      if (to) p.set('to', to)
      const suffix = p.toString() ? `?${p.toString()}` : ''
      const blob = await adminDownloadBlob(`/api/admin/demo-requests/export${suffix}`)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'demo-requests.csv'
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
          <h1 className="text-2xl font-bold text-slate-900">Demo Requests</h1>
          <p className="text-sm text-slate-600">Manage Get Demo form submissions from the public website.</p>
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
          onChange={(e) => {
            setPage(1)
            setQ(e.target.value)
          }}
          placeholder="Search name, phone, email, company…"
          className="min-w-[12rem] flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand"
        />
        <select
          value={status}
          onChange={(e) => {
            setPage(1)
            setStatus(e.target.value)
          }}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={from}
          onChange={(e) => {
            setPage(1)
            setFrom(e.target.value)
          }}
          className="rounded-lg border border-slate-200 px-2 py-2 text-sm"
        />
        <input
          type="date"
          value={to}
          onChange={(e) => {
            setPage(1)
            setTo(e.target.value)
          }}
          className="rounded-lg border border-slate-200 px-2 py-2 text-sm"
        />
        <button
          type="button"
          onClick={() => {
            setPage(1)
            load()
          }}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Apply
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <p className="p-6 text-sm text-slate-600">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">No demo requests match your filters.</p>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-4 py-3">Submitted</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Company</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Follow-up</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 last:border-0">
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{new Date(r.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{r.name || '—'}</td>
                  <td className="max-w-[120px] truncate px-4 py-3">{r.company || '—'}</td>
                  <td className="px-4 py-3">{r.phone}</td>
                  <td className="max-w-[140px] truncate px-4 py-3">{r.email}</td>
                  <td className="max-w-[120px] truncate px-4 py-3 text-xs text-slate-500">{formatSource(r)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={r.status}
                      onChange={(e) => patch(r.id, { status: e.target.value as DemoRequestStatus })}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                    {r.followUpAt ? new Date(r.followUpAt).toLocaleString() : '—'}
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

      {total > PAGE_SIZE ? (
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
          <p>
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-2 py-1.5 tabular-nums">
              Page {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg border border-slate-200 px-3 py-1.5 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : null}

      {detail ? (
        <div className="fixed inset-0 z-[140] flex items-end justify-center bg-black/40 p-4 sm:items-center" role="dialog">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-lg font-bold text-slate-900">Demo request</h2>
              <button type="button" className="text-sm font-semibold text-slate-500 hover:text-slate-800" onClick={() => setDetail(null)}>
                Close
              </button>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="font-semibold text-slate-700">Submitted</dt>
                <dd>{new Date(detail.createdAt).toLocaleString()}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-700">Name</dt>
                <dd>{detail.name || '—'}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-700">Company / business type</dt>
                <dd>{detail.company || '—'}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-700">Email</dt>
                <dd>{detail.email}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-700">Phone / WhatsApp</dt>
                <dd>{detail.phone}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-700">Product / service</dt>
                <dd>{detail.productService || '—'}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-700">Message / requirements</dt>
                <dd className="whitespace-pre-wrap text-slate-600">{detail.message || '—'}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-700">Source page</dt>
                <dd className="break-all text-slate-600">{formatSource(detail)}</dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-700">Status</dt>
                <select
                  value={detail.status}
                  onChange={(e) => patch(detail.id, { status: e.target.value as DemoRequestStatus })}
                  className="mt-1 rounded-lg border border-slate-200 px-2 py-1 text-sm"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <dt className="font-semibold text-slate-700">Assigned to</dt>
                <input
                  defaultValue={detail.assignedTo}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  placeholder="Team member name or email"
                  onBlur={(e) => {
                    if (e.target.value !== detail.assignedTo) patch(detail.id, { assignedTo: e.target.value })
                  }}
                />
              </div>
              <div>
                <dt className="font-semibold text-slate-700">Next follow-up</dt>
                <input
                  type="datetime-local"
                  defaultValue={toLocalDatetimeInput(detail.followUpAt)}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  onBlur={(e) => {
                    const next = e.target.value ? new Date(e.target.value).toISOString() : ''
                    if (next !== detail.followUpAt) patch(detail.id, { followUpAt: next })
                  }}
                />
              </div>
              <div>
                <dt className="font-semibold text-slate-700">Internal notes</dt>
                <textarea
                  defaultValue={detail.internalNote}
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  onBlur={(e) => {
                    if (e.target.value !== detail.internalNote) patch(detail.id, { internalNote: e.target.value })
                  }}
                />
              </div>
            </dl>
          </div>
        </div>
      ) : null}

      {delTarget ? (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-bold text-slate-900">Delete demo request?</h2>
            <p className="mt-2 text-sm text-slate-600">
              This will permanently remove the request from {delTarget.name || delTarget.phone}.
            </p>
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
