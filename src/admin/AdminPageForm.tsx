import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { adminFetch } from './adminApi'
import { useAdminToast } from './AdminToastContext'
import { BilingualInputs } from './cms/BilingualInputs'
import { AdminFormActions } from './cms/AdminFormActions'
import { AdminLayoutMediaField } from './layout/AdminLayoutMediaField'
import {
  emptyPageDraft,
  PAGE_TYPE_OPTIONS,
  slugifyTitle,
  type CmsPageRecord,
  type PageFooterNav,
  type PageHeaderNav,
  type PageHeroCta,
} from '../cms/pagesTypes'
import { PAGE_TEMPLATES, emptySeo, type PageSeo } from '../cms/sectionCatalog'

type Mode = 'new' | 'edit'

type FormState = ReturnType<typeof emptyPageDraft>

function clonePageState(p: CmsPageRecord): FormState {
  const draft = emptyPageDraft()
  return {
    slug: p.slug,
    pageType: p.pageType,
    template: p.template || 'blank',
    status: p.status,
    language: p.language,
    sortOrder: p.sortOrder,
    showInMenu: p.showInMenu,
    metaTitle: { ...p.metaTitle },
    metaDescription: { ...p.metaDescription },
    seo: { ...emptySeo(), ...(p.seo || {}) },
    title: { ...p.title },
    heading: { ...p.heading },
    shortDescription: { ...p.shortDescription },
    content: { ...p.content },
    featuredImageUrl: p.featuredImageUrl || '',
    headerNav: { ...draft.headerNav!, ...(p.headerNav || {}), label: { ...(p.headerNav?.label || p.title) } },
    footerNav: { ...draft.footerNav!, ...(p.footerNav || {}), label: { ...(p.footerNav?.label || p.title) } },
    heroCta: { ...draft.heroCta!, ...(p.heroCta || {}) },
    sections: p.sections || [],
    publishedContent: p.publishedContent ?? null,
    lastPublishedAt: p.lastPublishedAt ?? null,
  }
}

export function AdminPageForm({ mode }: { mode: Mode }) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const toast = useAdminToast()
  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [editorialStatus, setEditorialStatus] = useState<string>('Draft')
  const [baseline, setBaseline] = useState(() => JSON.stringify(emptyPageDraft()))

  const [form, setForm] = useState<FormState>(() => ({ ...emptyPageDraft() }))

  const loadEdit = useCallback(() => {
    if (mode !== 'edit' || !id) return
    setLoading(true)
    setErr(null)
    adminFetch<{ page: CmsPageRecord }>(`/api/admin/pages/${id}`)
      .then(({ page }) => {
        const st = clonePageState(page)
        setForm(st)
        setBaseline(JSON.stringify(st))
        setEditorialStatus(page.editorialStatus || page.status || 'Draft')
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
      const parsed = JSON.parse(baseline) as FormState
      setForm(parsed)
    } catch {
      setForm({ ...emptyPageDraft() })
    }
    toast.push('Changes reverted', 'info')
  }

  const persist = async (action: 'draft' | 'publish') => {
    setErr(null)
    if (action === 'publish') setPublishing(true)
    else setSaving(true)
    try {
      const payload = {
        ...form,
        metaTitle: form.seo?.title || form.metaTitle,
        metaDescription: form.seo?.description || form.metaDescription,
        showInMenu: form.headerNav?.enabled === true,
        action: action === 'publish' ? 'publish' : undefined,
        status: action === 'publish' ? 'published' : 'draft',
      }
      if (mode === 'new') {
        const res = await adminFetch<{ page: CmsPageRecord }>('/api/admin/pages', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        toast.push(action === 'publish' ? 'Page published' : 'Draft saved', 'success')
        navigate(`/admin/pages/${res.page.id}/edit`, { replace: true })
        return
      }
      if (!id) return
      const res = await adminFetch<{ page: CmsPageRecord }>(`/api/admin/pages/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      })
      const st = clonePageState(res.page)
      setForm(st)
      setBaseline(JSON.stringify(st))
      setEditorialStatus(res.page.editorialStatus || (action === 'publish' ? 'Published' : 'Draft'))
      toast.push(action === 'publish' ? 'Published successfully' : 'Draft saved', 'success')
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Save failed'
      setErr(msg)
      toast.push(msg, 'error')
    } finally {
      setSaving(false)
      setPublishing(false)
    }
  }

  const setHeaderNav = (patch: Partial<PageHeaderNav>) =>
    setForm((f) => ({ ...f, headerNav: { ...f.headerNav!, ...patch } }))
  const setFooterNav = (patch: Partial<PageFooterNav>) =>
    setForm((f) => ({ ...f, footerNav: { ...f.footerNav!, ...patch } }))
  const setHeroCta = (patch: Partial<PageHeroCta>) =>
    setForm((f) => ({ ...f, heroCta: { ...f.heroCta!, ...patch } }))

  const setSeo = (patch: Partial<PageSeo>) =>
    setForm((f) => ({ ...f, seo: { ...emptySeo(), ...(f.seo || {}), ...patch } }))

  const onTitleEnChange = (en: string) => {
    setForm((f) => {
      const next = { ...f, title: { ...f.title, en } }
      if (mode === 'new' && !f.slug) next.slug = slugifyTitle(en)
      if (f.headerNav?.enabled && !f.headerNav.label.en) {
        next.headerNav = { ...f.headerNav!, label: { ...f.headerNav!.label, en } }
      }
      return next
    })
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
          <p className="mt-1 text-sm text-slate-600">
            Save Draft keeps the public site unchanged. Publish copies this draft to the live site.
          </p>
          <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Status: {editorialStatus}</p>
        </div>
        <Link to="/admin/pages-list" className="text-sm font-semibold text-brand hover:underline">
          ← All pages
        </Link>
        {mode === 'edit' && id ? (
          <Link to={`/admin/pages/${id}/sections`} className="text-sm font-semibold text-brand hover:underline">
            Manage sections →
          </Link>
        ) : null}
      </div>

      {err ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{err}</p> : null}

      <div className="space-y-6 rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Page details</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="font-semibold text-slate-800">Page title (English)</span>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
              value={form.title.en}
              onChange={(e) => onTitleEnChange(e.target.value)}
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
            <span className="font-semibold text-slate-800">Initial page template</span>
            <select
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
              value={form.template || 'blank'}
              disabled={mode === 'edit'}
              onChange={(e) => setForm((f) => ({ ...f, template: e.target.value }))}
            >
              {PAGE_TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
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
        </div>

        <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Navigation placement</h2>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <input
              type="checkbox"
              checked={form.headerNav?.enabled === true}
              onChange={(e) =>
                setHeaderNav({
                  enabled: e.target.checked,
                  label: e.target.checked && !form.headerNav?.label.en ? form.title : form.headerNav!.label,
                })
              }
            />
            Add to Header Navigation
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <input
              type="checkbox"
              checked={form.footerNav?.enabled === true}
              onChange={(e) => setFooterNav({ enabled: e.target.checked })}
            />
            Add to Footer Navigation
          </label>
        </div>

        {form.headerNav?.enabled ? (
          <div className="space-y-3 rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-bold text-slate-800">Header options</h3>
            <BilingualInputs
              labelEn="Menu label (English)"
              labelAr="Menu label (Arabic)"
              value={form.headerNav.label}
              onChange={(label) => setHeaderNav({ label })}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="font-semibold text-slate-800">Display order</span>
                <input
                  type="number"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={form.headerNav.sortOrder}
                  onChange={(e) => setHeaderNav({ sortOrder: Number(e.target.value) || 0 })}
                />
              </label>
              <label className="flex items-center gap-2 pt-6 text-sm font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={form.headerNav.openInNewTab === true}
                  onChange={(e) => setHeaderNav({ openInNewTab: e.target.checked })}
                />
                Open in new tab
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={form.headerNav.highlightAsCta === true}
                  onChange={(e) => setHeaderNav({ highlightAsCta: e.target.checked })}
                />
                Highlight as CTA
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={form.headerNav.showDesktop !== false}
                  onChange={(e) => setHeaderNav({ showDesktop: e.target.checked })}
                />
                Show on desktop
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={form.headerNav.showMobile !== false}
                  onChange={(e) => setHeaderNav({ showMobile: e.target.checked })}
                />
                Show on mobile
              </label>
            </div>
          </div>
        ) : null}

        {form.footerNav?.enabled ? (
          <div className="space-y-3 rounded-xl border border-slate-200 p-4">
            <h3 className="text-sm font-bold text-slate-800">Footer options</h3>
            <BilingualInputs
              labelEn="Footer link label (English)"
              labelAr="Footer link label (Arabic)"
              value={form.footerNav.label}
              onChange={(label) => setFooterNav({ label })}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="font-semibold text-slate-800">Footer column</span>
                <select
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                  value={form.footerNav.column}
                  onChange={(e) =>
                    setFooterNav({
                      column: e.target.value as PageFooterNav['column'],
                    })
                  }
                >
                  <option value="product">Product</option>
                  <option value="industries">Industries</option>
                  <option value="company">Company</option>
                  <option value="contact">Contact</option>
                </select>
              </label>
              <label className="block text-sm">
                <span className="font-semibold text-slate-800">Display order</span>
                <input
                  type="number"
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                  value={form.footerNav.sortOrder}
                  onChange={(e) => setFooterNav({ sortOrder: Number(e.target.value) || 0 })}
                />
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={form.footerNav.openInNewTab === true}
                  onChange={(e) => setFooterNav({ openInNewTab: e.target.checked })}
                />
                Open in new tab
              </label>
            </div>
          </div>
        ) : null}

        <div className="space-y-3 rounded-xl border border-slate-200 p-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <input
              type="checkbox"
              checked={form.heroCta?.enabled === true}
              onChange={(e) => setHeroCta({ enabled: e.target.checked })}
            />
            Add as Hero CTA (optional — separate from header nav)
          </label>
          {form.heroCta?.enabled ? (
            <>
              <BilingualInputs
                labelEn="CTA label (English)"
                labelAr="CTA label (Arabic)"
                value={form.heroCta.label}
                onChange={(label) => setHeroCta({ label })}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="font-semibold text-slate-800">Button style</span>
                  <select
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    value={form.heroCta.variant}
                    onChange={(e) =>
                      setHeroCta({ variant: e.target.value as 'primary' | 'secondary' })
                    }
                  >
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                  </select>
                </label>
                <label className="block text-sm">
                  <span className="font-semibold text-slate-800">Display order</span>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
                    value={form.heroCta.sortOrder}
                    onChange={(e) => setHeroCta({ sortOrder: Number(e.target.value) || 0 })}
                  />
                </label>
              </div>
            </>
          ) : null}
        </div>

        <div className="space-y-3 rounded-xl border border-slate-200 p-4">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">SEO settings</h2>
          <BilingualInputs
            labelEn="SEO title (English)"
            labelAr="SEO title (Arabic)"
            value={form.seo?.title || form.metaTitle}
            onChange={(title) => {
              setSeo({ title })
              setForm((f) => ({ ...f, metaTitle: title }))
            }}
          />
          <BilingualInputs
            labelEn="Meta description (English)"
            labelAr="Meta description (Arabic)"
            multiline
            rows={3}
            value={form.seo?.description || form.metaDescription}
            onChange={(description) => {
              setSeo({ description })
              setForm((f) => ({ ...f, metaDescription: description }))
            }}
          />
          <AdminLayoutMediaField
            label="Social sharing image"
            value={form.seo?.socialImage || ''}
            onChange={(socialImage) => setSeo({ socialImage })}
          />
          <label className="block text-sm">
            <span className="font-semibold text-slate-800">Canonical URL</span>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              value={form.seo?.canonicalUrl || ''}
              onChange={(e) => setSeo({ canonicalUrl: e.target.value })}
              placeholder="https://example.com/page"
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <input
              type="checkbox"
              checked={form.seo?.noIndex === true}
              onChange={(e) => setSeo({ noIndex: e.target.checked })}
            />
            No-index (hide from search engines)
          </label>
        </div>

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

        <AdminLayoutMediaField
          label="Featured image (optional)"
          value={form.featuredImageUrl}
          onChange={(featuredImageUrl) => setForm((f) => ({ ...f, featuredImageUrl }))}
        />

        <AdminFormActions
          saving={saving}
          publishing={publishing}
          onSave={() => void persist('draft')}
          onPublish={() => void persist('publish')}
          onCancel={cancel}
          disableSave={mode === 'edit' && !dirty}
          statusLabel={editorialStatus}
        />
      </div>
    </div>
  )
}
