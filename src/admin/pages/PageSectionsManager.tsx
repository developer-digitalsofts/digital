import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowDown,
  ArrowUp,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Layers,
  Plus,
  Trash2,
} from 'lucide-react'
import { adminFetch } from '../adminApi'
import { useAdminToast } from '../AdminToastContext'
import { AdminFormActions } from '../cms/AdminFormActions'
import { ConfirmDialog } from '../cms/ConfirmDialog'
import { CmsPageSectionRenderer } from '../../components/CmsPageSectionRenderer'
import type { CmsPageRecord } from '../../cms/pagesTypes'
import type { PageSectionRecord, SectionType } from '../../cms/sectionCatalog'
import { SECTION_LIBRARY } from '../../cms/sectionCatalog'
import { SectionLibraryModal } from './SectionLibraryModal'
import { SectionEditorForm } from './SectionEditorForm'

export function PageSectionsManager() {
  const { id = '' } = useParams<{ id: string }>()
  const toast = useAdminToast()
  const [page, setPage] = useState<CmsPageRecord | null>(null)
  const [sections, setSections] = useState<PageSectionRecord[]>([])
  const [baseline, setBaseline] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [adding, setAdding] = useState(false)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(() => {
    if (!id) return
    setLoading(true)
    adminFetch<{ page: CmsPageRecord }>(`/api/admin/pages/${id}`)
      .then(({ page: p }) => {
        setPage(p)
        const rows = [...(p.sections || [])].sort((a, b) => a.order - b.order)
        setSections(rows)
        setBaseline(JSON.stringify(rows))
        setActiveId(rows[0]?.id || null)
      })
      .catch((e: Error) => toast.push(e.message, 'error'))
      .finally(() => setLoading(false))
  }, [id, toast])

  useEffect(() => {
    load()
  }, [load])

  const dirty = useMemo(() => JSON.stringify(sections) !== baseline, [sections, baseline])
  const active = sections.find((s) => s.id === activeId) || null
  const sectionLabel = (type: string) => SECTION_LIBRARY.find((x) => x.type === type)?.name || type

  const persistPage = async (action?: 'publish') => {
    if (!page) return
    setSaving(action !== 'publish')
    setPublishing(action === 'publish')
    try {
      const res = await adminFetch<{ page: CmsPageRecord }>(`/api/admin/pages/${page.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          ...page,
          sections,
          action: action === 'publish' ? 'publish' : undefined,
        }),
      })
      setPage(res.page)
      const rows = [...(res.page.sections || [])].sort((a, b) => a.order - b.order)
      setSections(rows)
      setBaseline(JSON.stringify(rows))
      toast.push(action === 'publish' ? 'Page published' : 'Draft saved', 'success')
    } catch (e: unknown) {
      toast.push(e instanceof Error ? e.message : 'Save failed', 'error')
    } finally {
      setSaving(false)
      setPublishing(false)
    }
  }

  const addSection = async (type: SectionType) => {
    if (!page) return
    setAdding(true)
    try {
      const res = await adminFetch<{ section: PageSectionRecord; page: CmsPageRecord }>(
        `/api/admin/pages/${page.id}/sections`,
        { method: 'POST', body: JSON.stringify({ type }) },
      )
      const rows = [...(res.page.sections || [])].sort((a, b) => a.order - b.order)
      setSections(rows)
      setBaseline(JSON.stringify(rows))
      setActiveId(res.section.id)
      setLibraryOpen(false)
      toast.push('Section added to draft', 'success')
    } catch (e: unknown) {
      toast.push(e instanceof Error ? e.message : 'Add failed', 'error')
    } finally {
      setAdding(false)
    }
  }

  const move = (sectionId: string, dir: -1 | 1) => {
    const sorted = [...sections].sort((a, b) => a.order - b.order)
    const idx = sorted.findIndex((s) => s.id === sectionId)
    const swap = idx + dir
    if (idx < 0 || swap < 0 || swap >= sorted.length) return
    ;[sorted[idx], sorted[swap]] = [sorted[swap], sorted[idx]]
    setSections(sorted.map((s, i) => ({ ...s, order: i + 1 })))
  }

  const duplicateSection = async (sectionId: string) => {
    if (!page) return
    try {
      const res = await adminFetch<{ section: PageSectionRecord; page: CmsPageRecord }>(
        `/api/admin/pages/${page.id}/sections/${sectionId}/duplicate`,
        { method: 'POST' },
      )
      const rows = [...(res.page.sections || [])].sort((a, b) => a.order - b.order)
      setSections(rows)
      setActiveId(res.section.id)
      toast.push('Section duplicated', 'success')
    } catch (e: unknown) {
      toast.push(e instanceof Error ? e.message : 'Duplicate failed', 'error')
    }
  }

  const deleteSection = async () => {
    if (!page || !deleteId) return
    setDeleting(true)
    try {
      const res = await adminFetch<{ page: CmsPageRecord }>(`/api/admin/pages/${page.id}/sections/${deleteId}`, {
        method: 'DELETE',
      })
      const rows = [...(res.page.sections || [])].sort((a, b) => a.order - b.order)
      setSections(rows)
      setBaseline(JSON.stringify(rows))
      if (activeId === deleteId) setActiveId(rows[0]?.id || null)
      setDeleteId(null)
      toast.push('Section deleted', 'success')
    } catch (e: unknown) {
      toast.push(e instanceof Error ? e.message : 'Delete failed', 'error')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-8 text-sm text-slate-600">
        <span className="size-4 animate-spin rounded-full border-2 border-brand border-t-transparent" aria-hidden />
        Loading sections…
      </div>
    )
  }

  if (!page) {
    return <p className="p-8 text-sm text-red-700">Page not found.</p>
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manage Sections</h1>
          <p className="mt-1 text-sm text-slate-600">
            {page.title?.en || page.slug} · Status: {page.editorialStatus || page.status}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={`/admin/pages/${page.id}/edit`} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">
            Page settings
          </Link>
          <button
            type="button"
            onClick={() => window.open(`/${page.slug}`, '_blank')}
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
          >
            <ExternalLink className="size-4" />
            Preview
          </button>
          <button
            type="button"
            onClick={() => setLibraryOpen(true)}
            className="inline-flex items-center gap-1 rounded-xl bg-brand px-3 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
          >
            <Plus className="size-4" />
            Add New Section
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[18rem,minmax(0,1fr)]">
        <aside className="rounded-2xl border border-slate-200 bg-white p-3">
          <p className="px-2 py-1 text-xs font-bold uppercase tracking-wide text-slate-500">Sections</p>
          <ul className="mt-2 space-y-1">
            {sections.length === 0 ? (
              <li className="px-2 py-4 text-sm text-slate-500">No sections yet.</li>
            ) : (
              sections.map((s) => (
                <li key={s.id}>
                  <button
                    type="button"
                    onClick={() => setActiveId(s.id)}
                    className={`flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-sm ${
                      activeId === s.id ? 'bg-brand/10 font-semibold text-brand' : 'text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Layers className="size-3.5 shrink-0" />
                      {sectionLabel(s.type)}
                    </span>
                    {s.visible === false ? <EyeOff className="size-3.5 text-slate-400" /> : null}
                  </button>
                </li>
              ))
            )}
          </ul>
        </aside>

        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
          {previewMode ? (
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <CmsPageSectionRenderer sections={sections.filter((s) => s.visible !== false)} />
            </div>
          ) : active ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-bold text-slate-900">{sectionLabel(active.type)}</h2>
                <div className="flex flex-wrap gap-1">
                  <button type="button" onClick={() => setPreviewMode(true)} className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold">
                    <Eye className="mr-1 inline size-3.5" />
                    Preview
                  </button>
                  <button type="button" onClick={() => move(active.id, -1)} className="rounded-lg border border-slate-200 p-1.5" aria-label="Move up">
                    <ArrowUp className="size-3.5" />
                  </button>
                  <button type="button" onClick={() => move(active.id, 1)} className="rounded-lg border border-slate-200 p-1.5" aria-label="Move down">
                    <ArrowDown className="size-3.5" />
                  </button>
                  <button type="button" onClick={() => void duplicateSection(active.id)} className="rounded-lg border border-slate-200 p-1.5" aria-label="Duplicate">
                    <Copy className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSections((rows) =>
                        rows.map((s) => (s.id === active.id ? { ...s, visible: s.visible === false } : s)),
                      )
                    }
                    className="rounded-lg border border-slate-200 p-1.5"
                    aria-label="Toggle visibility"
                  >
                    {active.visible === false ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                  </button>
                  <button type="button" onClick={() => setDeleteId(active.id)} className="rounded-lg border border-red-200 p-1.5 text-red-700">
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
              <SectionEditorForm
                section={active}
                onChange={(next) => setSections((rows) => rows.map((s) => (s.id === next.id ? next : s)))}
              />
            </>
          ) : (
            <p className="text-sm text-slate-600">Select a section or add a new one.</p>
          )}

          {previewMode ? (
            <button type="button" onClick={() => setPreviewMode(false)} className="text-sm font-semibold text-brand hover:underline">
              ← Back to editor
            </button>
          ) : null}

          <AdminFormActions
            saving={saving}
            publishing={publishing}
            onSave={() => void persistPage()}
            onPublish={() => void persistPage('publish')}
            onCancel={() => {
              setSections(JSON.parse(baseline) as PageSectionRecord[])
              toast.push('Changes reverted', 'info')
            }}
            disableSave={!dirty}
            statusLabel={page.editorialStatus || page.status}
          />
        </div>
      </div>

      <SectionLibraryModal open={libraryOpen} onClose={() => setLibraryOpen(false)} onSelect={(t) => void addSection(t)} busy={adding} />

      <ConfirmDialog
        open={!!deleteId}
        title="Delete section?"
        message="This removes the section from the draft page. Publish to update the public site."
        confirmLabel="Delete"
        busy={deleting}
        onClose={() => !deleting && setDeleteId(null)}
        onConfirm={() => void deleteSection()}
      />
    </div>
  )
}
