import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { adminFetch } from './adminApi'
import { useAdminToast } from './AdminToastContext'
import { BilingualInputs } from './cms/BilingualInputs'
import { AdminFormActions } from './cms/AdminFormActions'
import { emptyPageDraft, PAGE_TYPE_OPTIONS, type CmsPageRecord } from '../cms/pagesTypes'

type Mode = 'new' | 'edit'

function clonePageState(p: CmsPageRecord) {
  return {
    slug: p.slug,
    pageType: p.pageType,
    status: p.status,
    language: p.language,
    sortOrder: p.sortOrder,
    showInMenu: p.showInMenu,
    metaTitle: { ...p.metaTitle },
    metaDescription: { ...p.metaDescription },
    title: { ...p.title },
    heading: { ...p.heading },
    shortDescription: { ...p.shortDescription },
    content: { ...p.content },
    featuredImageUrl: p.featuredImageUrl || '',
  }
}

export function AdminPageForm({ mode }: { mode: Mode }) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useAdminToast()
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [baseline, setBaseline] = useState(() => JSON.stringify(emptyPageDraft()))

  const [form, setForm] = useState(() => ({ ...emptyPageDraft() }))

  const loadEdit = useCallback(() => {
    if (mode !== 'edit' || !id) return
    setLoading(true)
    setErr(null)
    adminFetch<{ page: CmsPageRecord }>(`/api/admin/pages/${id}`)
      .then(({ page }) => {
        const st = clonePageState(page)
        setForm(st)
        setBaseline(JSON.stringify(st))
      })
      .catch((e: Error) => setErr(e.message))
      .finally(() => setLoading(false))
  }, [mode, id])

  useEffect(() => {
    loadEdit()
  }, [loadEdit])

  const dirty = useMemo(() => JSON.stringify(form) !== baseline, [form, baseline])

  const cancel = () => {
    try {
      const parsed = JSON.parse(baseline) as typeof form
      setForm(parsed)
    } catch {
      setForm({ ...emptyPageDraft() })
    }
    toast.push('Changes reverted', 'info')
  }

  const save = async () => {
    setErr(null)
    setSaving(true)
    try {
      if (mode === 'new') {
        const res = await adminFetch<{ page: CmsPageRecord }>('/api/admin/pages', {
          method: 'POST',
          body: JSON.stringify(form),
        })
        toast.push('Page created', 'success')
        navigate(`/admin/pages/${res.page.id}/edit`, { replace: true })
        return
      }
      if (!id) return
      await adminFetch(`/api/admin/pages/${id}`, {
        method: 'PUT',
        body: JSON.stringify(form),
      })
      toast.push('Saved successfully', 'success')
      const st = { ...form }
      setBaseline(JSON.stringify(st))
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Save failed'
      setErr(msg)
      toast.push(msg, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 p-8 text-sm text-slate-600">
        <span className="size-4 animate-spin rounded-full border-2 border-brand border-t-transparent" aria-hidden />
        Loading…
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{mode === 'new' ? 'Add New Page' : 'Edit Page'}</h1>
          <p className="mt-1 text-sm text-slate-600">Fill in the fields below. Slug becomes the public URL path.</p>
        </div>
        <Link to="/admin/pages" className="text-sm font-semibold text-brand hover:underline">
          ← All pages
        </Link>
      </div>

      {err ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{err}</p> : null}

      <div className="space-y-6 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-semibold text-slate-800">Page title (English)</span>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
              value={form.title.en}
              onChange={(e) => setForm((f) => ({ ...f, title: { ...f.title, en: e.target.value } }))}
            />
          </label>
          <label className="block text-sm">
            <span className="font-semibold text-slate-800">Page title (Arabic)</span>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
              dir="rtl"
              value={form.title.ar}
              onChange={(e) => setForm((f) => ({ ...f, title: { ...f.title, ar: e.target.value } }))}
            />
          </label>
        </div>

        <label className="block text-sm">
          <span className="font-semibold text-slate-800">Slug / URL</span>
          <div className="mt-1 flex rounded-xl border border-slate-200 bg-slate-50/80">
            <span className="shrink-0 px-3 py-2 text-sm text-slate-500">/</span>
            <input
              className="min-w-0 flex-1 bg-transparent py-2 pr-3 text-sm outline-none"
              value={form.slug}
              onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value.trim() }))}
              placeholder="privacy-policy"
            />
          </div>
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-semibold text-slate-800">Page type</span>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
              value={form.pageType}
              onChange={(e) => setForm((f) => ({ ...f, pageType: e.target.value }))}
            >
              {PAGE_TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t.replace(/-/g, ' ')}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-semibold text-slate-800">Status</span>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as 'published' | 'draft' }))}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-semibold text-slate-800">Language</span>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
              value={form.language}
              onChange={(e) => setForm((f) => ({ ...f, language: e.target.value as 'en' | 'ar' | 'both' }))}
            >
              <option value="both">English / Arabic</option>
              <option value="en">English</option>
              <option value="ar">Arabic</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="font-semibold text-slate-800">Sort order</span>
            <input
              type="number"
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
              value={form.sortOrder}
              onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) || 0 }))}
            />
          </label>
        </div>

        <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <input
            type="checkbox"
            checked={form.showInMenu}
            onChange={(e) => setForm((f) => ({ ...f, showInMenu: e.target.checked }))}
          />
          Show in menu
        </label>

        <BilingualInputs
          labelEn="Meta title (English)"
          labelAr="Meta title (Arabic)"
          value={form.metaTitle}
          onChange={(metaTitle) => setForm((f) => ({ ...f, metaTitle }))}
        />
        <BilingualInputs
          labelEn="Meta description (English)"
          labelAr="Meta description (Arabic)"
          multiline
          rows={3}
          value={form.metaDescription}
          onChange={(metaDescription) => setForm((f) => ({ ...f, metaDescription }))}
        />
        <BilingualInputs
          labelEn="Page heading (English)"
          labelAr="Page heading (Arabic)"
          value={form.heading}
          onChange={(heading) => setForm((f) => ({ ...f, heading }))}
        />
        <BilingualInputs
          labelEn="Short description (English)"
          labelAr="Short description (Arabic)"
          multiline
          value={form.shortDescription}
          onChange={(shortDescription) => setForm((f) => ({ ...f, shortDescription }))}
        />
        <BilingualInputs
          labelEn="Main content (English)"
          labelAr="Main content (Arabic)"
          multiline
          rows={8}
          value={form.content}
          onChange={(content) => setForm((f) => ({ ...f, content }))}
        />

        <label className="block text-sm">
          <span className="font-semibold text-slate-800">Featured image URL (optional)</span>
          <input
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
            value={form.featuredImageUrl}
            onChange={(e) => setForm((f) => ({ ...f, featuredImageUrl: e.target.value }))}
            placeholder="/uploads/… or https://…"
          />
        </label>

        <AdminFormActions saving={saving} onSave={save} onCancel={cancel} disableSave={mode === 'edit' && !dirty} />
      </div>
    </div>
  )
}
