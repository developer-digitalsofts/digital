import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react'
import { adminFetch } from './adminApi'
import { useAdminToast } from './AdminToastContext'
import { ConfirmDialog } from './cms/ConfirmDialog'
import type { CmsPageRecord } from '../cms/pagesTypes'
import type { SoftwareDetailCmsRecord } from '../cms/softwareDetailTypes'
import { buildDetailPageCatalog, type DetailPageListRow } from './detail/buildDetailPageCatalog'

type Tab = 'software' | 'custom'

export function AdminPagesList() {
  const toast = useAdminToast()
  const [tab, setTab] = useState<Tab>('software')
  const [cmsItems, setCmsItems] = useState<SoftwareDetailCmsRecord[]>([])
  const [customPages, setCustomPages] = useState<CmsPageRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<DetailPageListRow | null>(null)
  const [deleteCustomId, setDeleteCustomId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    setErr(null)
    Promise.all([
      adminFetch<{ items: SoftwareDetailCmsRecord[] }>('/api/admin/software-details'),
      adminFetch<{ items: CmsPageRecord[] }>('/api/admin/pages'),
    ])
      .then(([sw, pages]) => {
        setCmsItems(sw.items || [])
        setCustomPages(pages.items || [])
      })
      .catch((e: Error) => setErr(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const softwareRows = useMemo(() => buildDetailPageCatalog(cmsItems), [cmsItems])

  const onDeleteSoftware = async () => {
    if (!deleteTarget?.cms?.isCustom) return
    setDeleting(true)
    try {
      await adminFetch(`/api/admin/software-details/${deleteTarget.kind}/${deleteTarget.slug}`, { method: 'DELETE' })
      toast.push('Page deleted', 'success')
      setDeleteTarget(null)
      load()
    } catch (e: unknown) {
      toast.push(e instanceof Error ? e.message : 'Delete failed', 'error')
    } finally {
      setDeleting(false)
    }
  }

  const onDeleteCustom = async () => {
    if (!deleteCustomId) return
    setDeleting(true)
    try {
      await adminFetch(`/api/admin/pages/${deleteCustomId}`, { method: 'DELETE' })
      toast.push('Page deleted', 'success')
      setDeleteCustomId(null)
      load()
    } catch (e: unknown) {
      toast.push(e instanceof Error ? e.message : 'Delete failed', 'error')
    } finally {
      setDeleting(false)
    }
  }

  const previewSoftware = (row: DetailPageListRow) => {
    window.open(row.url, '_blank', 'noopener,noreferrer')
    if (!row.active) toast.push('Page is inactive — visitors may see the built-in version or a 404 for custom pages.', 'info')
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Detail Pages</h1>
          <p className="mt-1 text-sm text-slate-600">
            Edit module & industry detail pages, or manage custom text pages. All software pages use the same premium template.
          </p>
        </div>
        <Link
          to={tab === 'software' ? '/admin/pages/detail/new' : '/admin/pages/new'}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark"
        >
          <Plus className="size-4" aria-hidden />
          Add New Page
        </Link>
      </div>

      <div className="flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-slate-50/80 p-1">
        {(
          [
            ['software', `Software pages (${softwareRows.length})`],
            ['custom', `Custom pages (${customPages.length})`],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`rounded-lg px-3.5 py-2 text-xs font-bold transition-colors sm:text-sm ${
              tab === id ? 'bg-brand text-white' : 'text-slate-600 hover:bg-white hover:text-slate-900'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {err ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{err}</p> : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        {loading ? (
          <div className="flex items-center gap-2 p-8 text-sm text-slate-600">
            <span className="size-4 animate-spin rounded-full border-2 border-brand border-t-transparent" aria-hidden />
            Loading…
          </div>
        ) : tab === 'software' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50/90 text-xs font-bold uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">URL</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {softwareRows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-500">
                      No software detail pages found.
                    </td>
                  </tr>
                ) : (
                  softwareRows.map((row) => (
                    <tr key={`${row.kind}:${row.slug}`} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3 font-medium text-slate-900">{row.titleEn}</td>
                      <td className="max-w-[12rem] truncate px-4 py-3 font-mono text-xs text-slate-600" title={row.url}>
                        {row.url}
                      </td>
                      <td className="px-4 py-3 text-slate-700">{row.kind === 'module' ? 'ERP Module' : 'Industry'}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            row.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {row.active ? 'Active' : 'Inactive'}
                        </span>
                        {row.cms ? (
                          <span className="ml-1.5 inline-flex rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-brand">CMS</span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{row.updatedAt ? new Date(row.updatedAt).toLocaleString() : '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap justify-end gap-1">
                          <Link
                            to={`/admin/pages/detail/${row.kind}/${row.slug}/edit`}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                          >
                            <Pencil className="size-3.5" aria-hidden />
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => previewSoftware(row)}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-50"
                          >
                            <ExternalLink className="size-3.5" aria-hidden />
                            View
                          </button>
                          {row.isCustom ? (
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(row)}
                              className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="size-3.5" aria-hidden />
                              Delete
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50/90 text-xs font-bold uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customPages.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                      No custom pages yet. Add pages like privacy policy or terms.
                    </td>
                  </tr>
                ) : (
                  customPages.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3 font-medium text-slate-900">{p.title?.en || p.slug}</td>
                      <td className="px-4 py-3 font-mono text-xs text-slate-600">/{p.slug}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${p.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'}`}>
                          {p.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{p.updatedAt ? new Date(p.updatedAt).toLocaleString() : '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap justify-end gap-1">
                          <Link to={`/admin/pages/${p.id}/edit`} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-50">
                            <Pencil className="size-3.5" aria-hidden />
                            Edit
                          </Link>
                          <button type="button" onClick={() => window.open(`/${p.slug}`, '_blank')} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold text-slate-800 hover:bg-slate-50">
                            <ExternalLink className="size-3.5" aria-hidden />
                            View
                          </button>
                          <button type="button" onClick={() => setDeleteCustomId(p.id)} className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-white px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50">
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
        open={!!deleteTarget}
        title="Delete custom detail page?"
        message={`Remove "${deleteTarget?.titleEn}" permanently?`}
        confirmLabel="Delete"
        busy={deleting}
        onClose={() => !deleting && setDeleteTarget(null)}
        onConfirm={() => void onDeleteSoftware()}
      />

      <ConfirmDialog
        open={!!deleteCustomId}
        title="Delete page?"
        message="Are you sure you want to delete this custom page?"
        confirmLabel="Delete"
        busy={deleting}
        onClose={() => !deleting && setDeleteCustomId(null)}
        onConfirm={() => void onDeleteCustom()}
      />
    </div>
  )
}
