import { useEffect, useState } from 'react'
import { adminFetch } from './adminApi'
import { useAdminToast } from './AdminToastContext'

type Row = {
  id: string
  action: string
  section: string
  description: string
  adminEmail: string
  adminName: string
  at: string
}

export function AdminActivity() {
  const toast = useAdminToast()
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminFetch<Row[]>('/api/admin/activity')
      .then(setRows)
      .catch((e: Error) => toast.push(e.message, 'error'))
      .finally(() => setLoading(false))
  }, [toast])

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <span className="size-4 animate-spin rounded-full border-2 border-brand border-t-transparent" aria-hidden />
        Loading…
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Activity log</h1>
        <p className="text-sm text-slate-600">Recent authenticated actions in the CMS.</p>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        {rows.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">No activity recorded yet.</p>
        ) : (
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Section</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Admin</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 last:border-0">
                  <td className="whitespace-nowrap px-4 py-3 text-slate-600">{new Date(r.at).toLocaleString()}</td>
                  <td className="px-4 py-3 font-medium text-slate-900">{r.action}</td>
                  <td className="px-4 py-3 text-slate-700">{r.section}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-slate-600">{r.description}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {r.adminName || '—'}
                    <br />
                    {r.adminEmail}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
