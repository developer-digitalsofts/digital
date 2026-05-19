import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react'
import { adminFetch } from './adminApi'
import { useAdminToast } from './AdminToastContext'
import { ConfirmDialog } from './cms/ConfirmDialog'
import type { CmsPageRecord } from '../cms/pagesTypes'

export function AdminPagesList() {
  const toast = useAdminToast()
  const [items, setItems] = useState<CmsPageRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    setErr(null)
    adminFetch<{ items: CmsPageRecord[] }>('/api/admin/pages')
      .then((r) => setItems(r.items || []))
      .catch((e: Error) => setErr(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const onDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await adminFetch(`/api/admin/pages/${deleteId}`, { method: 'DELETE' })
      toast.push('Page deleted', 'success')
      setDeleteId(null)
      load()
    } catch (e: unknown) {
      toast.push(e instanceof Error ? e.message : 'Delete failed', 'error')
    } finally {
      setDeleting(false)
    }
  }

  const preview = (p: CmsPageRecord) => {
    const path = `/${p.slug}`
    window.open(path, '_blank', 'noopener,noreferrer')
    if (p.status !== 'published') {
      toast.push('Note: visitors only see published pages at this URL.', 'info')
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pages</h1>
          <p className="mt-1 text-sm text-slate-600">Manage site pages and custom landing URLs. Content is stored in pages.json.</p>
        </div>
        <Link
          to="/admin/pages/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark"
        >
          <Plus className="size-4" aria-hidden />
          Add New Page
        </Link>
      </div>

      {err ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{err}</p> : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center gap-2 p-8 text-sm text-slate-600">
            <span className="size-4 animate-spin rounded-full border-2 border-brand border-t-transparent" aria-hidden />
            Loading pages…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50/90 text-xs font-bold uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Slug / URL</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Language</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                      No pages yet. Create a custom page (for example <span className="font-mono text-slate-700">privacy-policy</span>) or add
                      structured entries for your site.
                    </td>
                  </tr>
                ) : (
                  items.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3 font-medium text-slate-900">{p.title?.en || p.slug}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">/{p.slug}</td>
                      <td className="px-4 py-3 capitalize text-slate-700">{p.pageType?.replace(/-/g, ' ')}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            p.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                          }`}
                        >
                          {p.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{p.language === 'both' ? 'English / Arabic' : p.language === 'ar' ? 'Arabic' : 'English'}</td>
                      <td className="px-4 py-3 text-slate-600">{p.updatedAt ? new Date(p.updatedAt).toLocaleString() : '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap justify-end gap-1">
                          <Link
                            to={`/admin/pages/${p.id}/edit`}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                          >
                            <Pencil className="size-3.5" aria-hidden />
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => preview(p)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                          >
                            <ExternalLink className="size-3.5" aria-hidden />
                            Preview
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteId(p.id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="size-3.5" aria-hidden />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete page?"
        message="Are you sure you want to delete this item? This cannot be undone."
        confirmLabel="Delete"
        busy={deleting}
        onClose={() => !deleting && setDeleteId(null)}
        onConfirm={() => void onDelete()}
      />
    </div>
  )
}
