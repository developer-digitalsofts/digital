import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Copy,
  ExternalLink,
  Layers,
  Pencil,
  Plus,
  Rocket,
  Trash2,
  UploadCloud,
} from 'lucide-react'
import { adminFetch } from './adminApi'
import { useAdminToast } from './AdminToastContext'
import { ConfirmDialog } from './cms/ConfirmDialog'
import type { CmsPageRecord } from '../cms/pagesTypes'
import { SYSTEM_PAGES } from '../cms/pagesTypes'
import type { SoftwareDetailCmsRecord } from '../cms/softwareDetailTypes'
import { buildDetailPageCatalog, type DetailPageListRow } from './detail/buildDetailPageCatalog'

type PageRow =
  | (CmsPageRecord & { rowKind: 'custom' | 'system' })
  | (DetailPageListRow & { rowKind: 'software' })

function statusBadge(status: string) {
  const cls =
    status === 'Published'
      ? 'bg-emerald-100 text-emerald-800'
      : status === 'Unpublished Changes'
        ? 'bg-orange-100 text-orange-900'
        : 'bg-amber-100 text-amber-900'
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${cls}`}>{status}</span>
  )
}

export function AdminPagesList() {
  const toast = useAdminToast()
  const [cmsItems, setCmsItems] = useState<SoftwareDetailCmsRecord[]>([])
  const [pages, setPages] = useState<CmsPageRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [deleteCustomId, setDeleteCustomId] = useState<string | null>(null)
  const [deleteSoftware, setDeleteSoftware] = useState<DetailPageListRow | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    setErr(null)
    Promise.all([
      adminFetch<{ items: SoftwareDetailCmsRecord[] }>('/api/admin/software-details'),
      adminFetch<{ items: CmsPageRecord[] }>('/api/admin/pages'),
    ])
      .then(([sw, pg]) => {
        setCmsItems(sw.items || [])
        setPages(pg.items || [])
      })
      .catch((e: Error) => setErr(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const softwareRows = useMemo(() => buildDetailPageCatalog(cmsItems), [cmsItems])

  const rows = useMemo(() => {
    const system = pages
      .filter((p) => p.kind === 'system')
      .map((p) => ({ ...p, rowKind: 'system' as const }))
    const custom = pages
      .filter((p) => p.kind !== 'system')
      .map((p) => ({ ...p, rowKind: 'custom' as const }))
    const software = softwareRows.map((p) => ({ ...p, rowKind: 'software' as const }))
    return [...system, ...software, ...custom]
  }, [pages, softwareRows])

  const navLabel = (p: CmsPageRecord) => {
    const h = p.headerNav?.enabled ? 'Header' : null
    const f = p.footerNav?.enabled ? 'Footer' : null
    if (h && f) return 'Both'
    if (h) return 'Header'
    if (f) return 'Footer'
    return '—'
  }

  const pageUrl = (row: PageRow) => {
    if (row.rowKind === 'software') return row.url
    if (row.rowKind === 'system') {
      const sp = SYSTEM_PAGES.find((s) => s.id === row.id)
      return sp?.publicPath || '/'
    }
    return row.slug ? `/${row.slug}` : '/'
  }

  const pageTitle = (row: PageRow) => {
    if (row.rowKind === 'software') return row.titleEn
    return row.title?.en || row.slug || row.id
  }

  const pageStatus = (row: PageRow) => {
    if (row.rowKind === 'software') return row.active ? 'Published' : 'Draft'
    return row.editorialStatus || (row.status === 'published' ? 'Published' : 'Draft')
  }

  const runAction = async (id: string, fn: () => Promise<void>) => {
    setBusyId(id)
    try {
      await fn()
      load()
    } finally {
      setBusyId(null)
    }
  }

  const publishPage = (id: string) =>
    runAction(id, async () => {
      await adminFetch(`/api/admin/pages/${id}/publish`, { method: 'POST' })
      toast.push('Page published', 'success')
    })

  const unpublishPage = (id: string) =>
    runAction(id, async () => {
      await adminFetch(`/api/admin/pages/${id}/unpublish`, { method: 'POST' })
      toast.push('Page unpublished', 'success')
    })

  const duplicatePage = (id: string) =>
    runAction(id, async () => {
      const res = await adminFetch<{ page: CmsPageRecord }>(`/api/admin/pages/${id}/duplicate`, { method: 'POST' })
      toast.push('Page duplicated', 'success')
      window.location.href = `/admin/pages/${res.page.id}/edit`
    })

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

  const onDeleteSoftware = async () => {
    if (!deleteSoftware?.cms?.isCustom) return
    setDeleting(true)
    try {
      await adminFetch(`/api/admin/software-details/${deleteSoftware.kind}/${deleteSoftware.slug}`, { method: 'DELETE' })
      toast.push('Page deleted', 'success')
      setDeleteSoftware(null)
      load()
    } catch (e: unknown) {
      toast.push(e instanceof Error ? e.message : 'Delete failed', 'error')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Pages</h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage the homepage, software detail pages, and CMS-built pages. Draft saves stay private until you publish.
          </p>
        </div>
        <Link
          to="/admin/pages/new"
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark"
        >
          <Plus className="size-4" aria-hidden />
          Add New Page
        </Link>
      </div>

      {err ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{err}</p> : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
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
                  <th className="px-4 py-3">Navigation</th>
                  <th className="px-4 py-3">Updated</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-slate-500">
                      No pages found.
                    </td>
                  </tr>
                ) : (
                  rows.map((row) => {
                    const id = row.rowKind === 'software' ? `${row.kind}:${row.slug}` : row.id
                    const busy = busyId === (row.rowKind === 'custom' ? row.id : id)
                    return (
                      <tr key={id} className="hover:bg-slate-50/80">
                        <td className="px-4 py-3 font-medium text-slate-900">{pageTitle(row)}</td>
                        <td className="max-w-[14rem] truncate px-4 py-3 font-mono text-xs text-slate-600" title={pageUrl(row)}>
                          {pageUrl(row)}
                        </td>
                        <td className="px-4 py-3 text-slate-700">
                          {row.rowKind === 'system' ? 'System' : row.rowKind === 'software' ? 'Software detail' : 'CMS page'}
                        </td>
                        <td className="px-4 py-3">{statusBadge(pageStatus(row))}</td>
                        <td className="px-4 py-3 text-slate-600">
                          {row.rowKind === 'custom' ? navLabel(row) : '—'}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {row.rowKind === 'software'
                            ? row.updatedAt
                              ? new Date(row.updatedAt).toLocaleString()
                              : '—'
                            : row.updatedAt
                              ? new Date(row.updatedAt).toLocaleString()
                              : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap justify-end gap-1">
                            {row.rowKind === 'system' && row.id === 'sys-home' ? (
                              <Link to="/admin/pages/home" className="action-btn">
                                <Pencil className="size-3.5" /> Edit
                              </Link>
                            ) : row.rowKind === 'system' ? (
                              <Link to={pageUrl(row)} className="action-btn">
                                <Pencil className="size-3.5" /> Edit
                              </Link>
                            ) : row.rowKind === 'software' ? (
                              <Link to={`/admin/pages/detail/${row.kind}/${row.slug}/edit`} className="action-btn">
                                <Pencil className="size-3.5" /> Edit
                              </Link>
                            ) : (
                              <Link to={`/admin/pages/${row.id}/edit`} className="action-btn">
                                <Pencil className="size-3.5" /> Edit
                              </Link>
                            )}

                            <button type="button" onClick={() => window.open(pageUrl(row), '_blank')} className="action-btn">
                              <ExternalLink className="size-3.5" /> Preview
                            </button>

                            {row.rowKind === 'custom' ? (
                              <>
                                <Link to={`/admin/pages/${row.id}/sections`} className="action-btn">
                                  <Layers className="size-3.5" /> Sections
                                </Link>
                                <button type="button" disabled={busy} onClick={() => void duplicatePage(row.id)} className="action-btn">
                                  <Copy className="size-3.5" /> Duplicate
                                </button>
                                <button type="button" disabled={busy} onClick={() => void publishPage(row.id)} className="action-btn">
                                  <Rocket className="size-3.5" /> Publish
                                </button>
                                <button type="button" disabled={busy} onClick={() => void unpublishPage(row.id)} className="action-btn">
                                  <UploadCloud className="size-3.5" /> Unpublish
                                </button>
                                <button type="button" onClick={() => setDeleteCustomId(row.id)} className="action-btn-danger">
                                  <Trash2 className="size-3.5" /> Delete
                                </button>
                              </>
                            ) : null}

                            {row.rowKind === 'software' && row.isCustom ? (
                              <button type="button" onClick={() => setDeleteSoftware(row)} className="action-btn-danger">
                                <Trash2 className="size-3.5" /> Delete
                              </button>
                            ) : null}

                            {row.rowKind === 'system' && row.id === 'sys-home' ? (
                              <Link to="/admin/pages/home?panel=visibility" className="action-btn">
                                <Layers className="size-3.5" /> Sections
                              </Link>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteCustomId}
        title="Delete page?"
        message="This permanently removes the page and its navigation links after the next publish cycle."
        confirmLabel="Delete"
        busy={deleting}
        onClose={() => !deleting && setDeleteCustomId(null)}
        onConfirm={() => void onDeleteCustom()}
      />

      <ConfirmDialog
        open={!!deleteSoftware}
        title="Delete custom detail page?"
        message={`Remove "${deleteSoftware?.titleEn}" permanently?`}
        confirmLabel="Delete"
        busy={deleting}
        onClose={() => !deleting && setDeleteSoftware(null)}
        onConfirm={() => void onDeleteSoftware()}
      />

      <style>{`
        .action-btn { display:inline-flex; align-items:center; gap:0.25rem; border-radius:0.5rem; border:1px solid #e2e8f0; background:#fff; padding:0.25rem 0.5rem; font-size:0.75rem; font-weight:600; color:#1e293b; }
        .action-btn:hover { background:#f8fafc; }
        .action-btn:disabled { opacity:0.6; }
        .action-btn-danger { display:inline-flex; align-items:center; gap:0.25rem; border-radius:0.5rem; border:1px solid #fecaca; background:#fff; padding:0.25rem 0.5rem; font-size:0.75rem; font-weight:600; color:#b91c1c; }
        .action-btn-danger:hover { background:#fef2f2; }
      `}</style>
    </div>
  )
}
