import { useCallback, useEffect, useMemo, useState, type MouseEvent } from 'react'
import { Link as LinkIcon } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ACCENT_COLOR_OPTIONS,
  emptyBilingual,
  emptySoftwareDetailDraft,
  type SoftwareDetailCmsRecord,
} from '../cms/softwareDetailTypes'
import { adminFetch } from './adminApi'
import { useAdminToast } from './AdminToastContext'
import { BilingualInputs } from './cms/BilingualInputs'
import { AdminFormActions } from './cms/AdminFormActions'
import { AdminButtonTabs } from './cms/AdminButtonTabs'
import { AdminLayoutMediaField } from './layout/AdminLayoutMediaField'
import { defaultLabelForSlug, iconForSlug } from './detail/buildDetailPageCatalog'
import { ADMIN_DETAIL_PAGES_PATH } from './home/adminHomeEditorTabs'

type Mode = 'new' | 'edit'

const DETAIL_TABS = [
  { id: 'hero', label: 'Hero' },
  { id: 'overview', label: 'Overview' },
  { id: 'features', label: 'Features' },
  { id: 'modules', label: 'Modules' },
  { id: 'operations', label: 'Operations' },
  { id: 'implementation', label: 'Implementation' },
  { id: 'faqs', label: 'FAQs' },
  { id: 'cta', label: 'CTA' },
  { id: 'seo', label: 'SEO' },
  { id: 'settings', label: 'Settings' },
] as const

type DetailTabId = (typeof DETAIL_TABS)[number]['id']

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20'

function cloneForm(rec: SoftwareDetailCmsRecord) {
  return JSON.parse(JSON.stringify(rec)) as SoftwareDetailCmsRecord
}

function linesToArray(text: string): string[] {
  return text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean)
}

function arrayToLines(xs: string[]): string {
  return xs.join('\n')
}

export function AdminSoftwareDetailForm({ mode }: { mode: Mode }) {
  const params = useParams<{ kind: string; slug: string }>()
  const navigate = useNavigate()
  const toast = useAdminToast()

  const paramKind = params.kind === 'industry' ? 'industry' : params.kind === 'module' ? 'module' : 'module'
  const paramSlug = params.slug ?? ''

  const [loading, setLoading] = useState(mode === 'edit')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<DetailTabId>('hero')
  const [baseline, setBaseline] = useState('')
  const [form, setForm] = useState<SoftwareDetailCmsRecord>(() => ({
    ...emptySoftwareDetailDraft(mode === 'new' ? 'module' : paramKind),
    id: '',
    createdAt: '',
    updatedAt: '',
  }))

  const setTab = useCallback((tab: DetailTabId, e?: MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault()
    e?.stopPropagation()
    setActiveTab(tab)
  }, [])

  const loadEdit = useCallback(async () => {
    if (mode !== 'edit') return
    setLoading(true)
    setErr(null)
    try {
      const { page } = await adminFetch<{ page: SoftwareDetailCmsRecord }>(
        `/api/admin/software-details/${paramKind}/${paramSlug}`,
      )
      const merged: SoftwareDetailCmsRecord = {
        ...page,
        sectionImages: page.sectionImages ?? emptySoftwareDetailDraft(paramKind).sectionImages,
      }
      setForm(cloneForm(merged))
      setBaseline(JSON.stringify(merged))
    } catch {
      const draft: SoftwareDetailCmsRecord = {
        ...emptySoftwareDetailDraft(paramKind),
        id: '',
        kind: paramKind,
        slug: paramSlug,
        icon: iconForSlug(paramKind, paramSlug),
        label: { en: defaultLabelForSlug(paramKind, paramSlug), ar: '' },
        isCustom: false,
        createdAt: '',
        updatedAt: '',
      }
      setForm(draft)
      setBaseline(JSON.stringify(draft))
    } finally {
      setLoading(false)
    }
  }, [mode, paramKind, paramSlug])

  useEffect(() => {
    if (mode === 'edit') void loadEdit()
    else {
      const draft: SoftwareDetailCmsRecord = {
        ...emptySoftwareDetailDraft('module'),
        id: '',
        createdAt: '',
        updatedAt: '',
      }
      setForm(draft)
      setBaseline(JSON.stringify(draft))
    }
  }, [mode, loadEdit])

  const dirty = useMemo(() => JSON.stringify(form) !== baseline, [form, baseline])

  const cancel = () => {
    try {
      setForm(JSON.parse(baseline) as SoftwareDetailCmsRecord)
      toast.push('Changes reverted', 'info')
    } catch {
      /* */
    }
  }

  const save = async () => {
    setErr(null)
    const slug = form.slug.trim()
    if (!slug) {
      setErr('Slug is required.')
      return
    }
    if (!form.label.en.trim()) {
      setErr('Title (English) is required.')
      return
    }
    setSaving(true)
    try {
      const { page } = await adminFetch<{ page: SoftwareDetailCmsRecord }>(
        `/api/admin/software-details/${form.kind}/${mode === 'edit' ? paramSlug : slug}`,
        { method: 'PUT', body: JSON.stringify(form) },
      )
      setForm(cloneForm(page))
      setBaseline(JSON.stringify(page))
      toast.push('Saved successfully', 'success')
      if (mode === 'new') {
        navigate(`/admin/pages/detail/${page.kind}/${page.slug}/edit`, { replace: true })
      }
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const patch = (partial: Partial<SoftwareDetailCmsRecord>) => setForm((f) => ({ ...f, ...partial }))

  const patchHero = (partial: Partial<SoftwareDetailCmsRecord['hero']>) =>
    setForm((f) => ({ ...f, hero: { ...f.hero, ...partial } }))

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-12 text-sm text-slate-600">
        <span className="size-4 animate-spin rounded-full border-2 border-brand border-t-transparent" aria-hidden />
        Loading page…
      </div>
    )
  }

  const previewUrl = form.kind === 'module' ? `/software/module/${form.slug}` : `/software/industry/${form.slug}`

  return (
    <div className="mx-auto max-w-4xl space-y-5 pb-28">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link to={ADMIN_DETAIL_PAGES_PATH} className="text-xs font-semibold text-brand hover:underline">
            ← Back to Detail Pages
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">
            {mode === 'new' ? 'Add detail page' : form.label.en || form.slug || 'Edit detail page'}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Content uses the same premium template as existing module & industry pages — only text and images change.
          </p>
        </div>
        {form.slug ? (
          <a
            href={previewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:border-brand hover:text-brand"
          >
            <LinkIcon className="size-3.5" aria-hidden />
            View page
          </a>
        ) : null}
      </div>

      {err ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{err}</p> : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
        <AdminButtonTabs tabs={DETAIL_TABS} activeTab={activeTab} onTabChange={setTab} ariaLabel="Detail page sections" />

        <div className="space-y-4 p-4 sm:p-6" role="tabpanel">
          {activeTab === 'settings' ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="font-semibold text-slate-800">Page type</span>
                  <select
                    className={inputClass}
                    value={form.kind}
                    disabled={mode === 'edit' && !form.isCustom}
                    onChange={(e) => patch({ kind: e.target.value as 'module' | 'industry' })}
                  >
                    <option value="module">ERP Module Page</option>
                    <option value="industry">Industry Page</option>
                  </select>
                </label>
                <label className="block text-sm">
                  <span className="font-semibold text-slate-800">Sort order</span>
                  <input
                    type="number"
                    className={inputClass}
                    value={form.sortOrder}
                    onChange={(e) => patch({ sortOrder: Number(e.target.value) || 0 })}
                  />
                </label>
                <label className="block text-sm sm:col-span-2">
                  <span className="font-semibold text-slate-800">Slug / URL segment</span>
                  <input
                    className={`${inputClass} font-mono`}
                    value={form.slug}
                    disabled={mode === 'edit' && !form.isCustom}
                    onChange={(e) => patch({ slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    placeholder="accounts-management-software"
                  />
                  <span className="mt-1 block text-xs text-slate-500">
                    Public URL:{' '}
                    {form.kind === 'module' ? `/software/module/${form.slug || '…'}` : `/software/industry/${form.slug || '…'}`}
                  </span>
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="font-semibold text-slate-800">Icon (Lucide name)</span>
                  <input className={`${inputClass} font-mono`} value={form.icon} onChange={(e) => patch({ icon: e.target.value })} />
                </label>
                <label className="block text-sm">
                  <span className="font-semibold text-slate-800">Accent color</span>
                  <select
                    className={inputClass}
                    value={form.accentColor}
                    onChange={(e) => patch({ accentColor: e.target.value as typeof form.accentColor })}
                  >
                    {ACCENT_COLOR_OPTIONS.map((c) => (
                      <option key={c} value={c}>
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={form.active !== false}
                  onChange={(e) => patch({ active: e.target.checked })}
                  className="rounded border-slate-300 text-brand"
                />
                Active on website
              </label>
            </>
          ) : null}

          {activeTab === 'overview' ? (
            <>
              <BilingualInputs labelEn="Title (EN)" labelAr="Title (AR)" value={form.label} onChange={(label) => patch({ label })} />
              <BilingualInputs
                labelEn="Short description (EN)"
                labelAr="Short description (AR)"
                multiline
                rows={2}
                value={form.shortDescription}
                onChange={(shortDescription) => patch({ shortDescription })}
              />
            </>
          ) : null}

          {activeTab === 'hero' ? (
            <>
              <AdminLayoutMediaField
                variant="hero"
                label="Hero / page image"
                value={form.heroImageUrl}
                onChange={(heroImageUrl) => patch({ heroImageUrl })}
                hint="Upload a new image or pick from Media Library. Shown on the public detail page hero when set."
              />
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <p className="text-sm font-semibold text-slate-800">Section images (optional)</p>
                <p className="mt-1 text-xs text-slate-600">
                  Override photos for operational cards, benefit rows, business types, and testimonial. Leave blank to use
                  semantic defaults. Changing the hero image does not affect these fields.
                </p>
                <div className="mt-4 grid gap-4">
                  {[0, 1, 2].map((idx) => (
                    <AdminLayoutMediaField
                      key={`op-${idx}`}
                      label={`Operational card ${idx + 1}`}
                      value={form.sectionImages.operational[idx] ?? ''}
                      onChange={(url) => {
                        const operational = [...form.sectionImages.operational]
                        operational[idx] = url
                        patch({ sectionImages: { ...form.sectionImages, operational } })
                      }}
                    />
                  ))}
                  {[0, 1].map((idx) => (
                    <AdminLayoutMediaField
                      key={`benefit-${idx}`}
                      label={`Benefit row ${idx + 1}`}
                      value={form.sectionImages.benefitRows[idx] ?? ''}
                      onChange={(url) => {
                        const benefitRows = [...form.sectionImages.benefitRows]
                        benefitRows[idx] = url
                        patch({ sectionImages: { ...form.sectionImages, benefitRows } })
                      }}
                    />
                  ))}
                  {[0, 1, 2, 3].map((idx) => (
                    <AdminLayoutMediaField
                      key={`biz-${idx}`}
                      label={`Business type card ${idx + 1}`}
                      value={form.sectionImages.businessTypes[idx] ?? ''}
                      onChange={(url) => {
                        const businessTypes = [...form.sectionImages.businessTypes]
                        businessTypes[idx] = url
                        patch({ sectionImages: { ...form.sectionImages, businessTypes } })
                      }}
                    />
                  ))}
                  <AdminLayoutMediaField
                    label="Testimonial photo"
                    value={form.sectionImages.testimonial}
                    onChange={(testimonial) => patch({ sectionImages: { ...form.sectionImages, testimonial } })}
                  />
                </div>
              </div>
              <BilingualInputs labelEn="Eyebrow (EN)" labelAr="Eyebrow (AR)" value={form.hero.eyebrow} onChange={(eyebrow) => patchHero({ eyebrow })} />
              <BilingualInputs labelEn="Hero headline (EN)" labelAr="Hero headline (AR)" value={form.hero.headline} onChange={(headline) => patchHero({ headline })} />
              <BilingualInputs labelEn="Hero subhead (EN)" labelAr="Hero subhead (AR)" value={form.hero.subhead} onChange={(subhead) => patchHero({ subhead })} />
              <BilingualInputs labelEn="Hero intro (EN)" labelAr="Hero intro (AR)" multiline rows={4} value={form.hero.intro} onChange={(intro) => patchHero({ intro })} />
              <div className="grid gap-4 sm:grid-cols-2">
                <BilingualInputs
                  labelEn="Primary CTA label (EN)"
                  labelAr="Primary CTA label (AR)"
                  value={form.hero.ctaPrimary.label}
                  onChange={(label) => patchHero({ ctaPrimary: { ...form.hero.ctaPrimary, label } })}
                />
                <label className="block text-sm">
                  <span className="font-semibold text-slate-800">Primary CTA link</span>
                  <input
                    className={inputClass}
                    value={form.hero.ctaPrimary.href}
                    onChange={(e) => patchHero({ ctaPrimary: { ...form.hero.ctaPrimary, href: e.target.value } })}
                  />
                </label>
                <BilingualInputs
                  labelEn="Secondary CTA label (EN)"
                  labelAr="Secondary CTA label (AR)"
                  value={form.hero.ctaSecondary.label}
                  onChange={(label) => patchHero({ ctaSecondary: { ...form.hero.ctaSecondary, label } })}
                />
                <label className="block text-sm">
                  <span className="font-semibold text-slate-800">Secondary CTA link</span>
                  <input
                    className={inputClass}
                    value={form.hero.ctaSecondary.href}
                    onChange={(e) => patchHero({ ctaSecondary: { ...form.hero.ctaSecondary, href: e.target.value } })}
                  />
                </label>
              </div>
            </>
          ) : null}

          {activeTab === 'seo' ? (
            <>
              <BilingualInputs labelEn="Meta title (EN)" labelAr="Meta title (AR)" value={form.metaTitle} onChange={(metaTitle) => patch({ metaTitle })} />
              <BilingualInputs
                labelEn="Meta description (EN)"
                labelAr="Meta description (AR)"
                multiline
                rows={2}
                value={form.metaDescription}
                onChange={(metaDescription) => patch({ metaDescription })}
              />
            </>
          ) : null}

          {activeTab === 'features' ? (
            <>
              <label className="block text-sm">
                <span className="font-semibold text-slate-800">Highlights (EN) — one per line</span>
                <textarea
                  rows={4}
                  className={inputClass}
                  value={arrayToLines(form.highlights.en)}
                  onChange={(e) => patch({ highlights: { ...form.highlights, en: linesToArray(e.target.value) } })}
                />
              </label>
              <label className="block text-sm">
                <span className="font-semibold text-slate-800">Highlights (AR) — one per line</span>
                <textarea
                  dir="rtl"
                  rows={4}
                  className={inputClass}
                  value={arrayToLines(form.highlights.ar)}
                  onChange={(e) => patch({ highlights: { ...form.highlights, ar: linesToArray(e.target.value) } })}
                />
              </label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">Feature cards</span>
                  <button
                    type="button"
                    className="text-xs font-semibold text-brand hover:underline"
                    onClick={() =>
                      patch({
                        features: [...form.features, { icon: 'Sparkles', title: emptyBilingual(), description: emptyBilingual() }],
                      })
                    }
                  >
                    + Add feature
                  </button>
                </div>
                {form.features.map((f, i) => (
                  <div key={i} className="rounded-lg border border-slate-200 p-3">
                    <div className="mb-2 flex justify-end">
                      <button
                        type="button"
                        className="text-xs font-semibold text-red-600"
                        onClick={() => patch({ features: form.features.filter((_, j) => j !== i) })}
                      >
                        Remove
                      </button>
                    </div>
                    <label className="block text-sm">
                      <span className="font-semibold text-slate-800">Icon</span>
                      <input
                        className={`${inputClass} font-mono`}
                        value={f.icon}
                        onChange={(e) => patch({ features: form.features.map((x, j) => (j === i ? { ...x, icon: e.target.value } : x)) })}
                      />
                    </label>
                    <BilingualInputs
                      labelEn="Title (EN)"
                      labelAr="Title (AR)"
                      value={f.title}
                      onChange={(title) => patch({ features: form.features.map((x, j) => (j === i ? { ...x, title } : x)) })}
                    />
                    <BilingualInputs
                      labelEn="Description (EN)"
                      labelAr="Description (AR)"
                      multiline
                      rows={2}
                      value={f.description}
                      onChange={(description) => patch({ features: form.features.map((x, j) => (j === i ? { ...x, description } : x)) })}
                    />
                  </div>
                ))}
              </div>
            </>
          ) : null}

          {activeTab === 'modules' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">Module capabilities</span>
                <button
                  type="button"
                  className="text-xs font-semibold text-brand hover:underline"
                  onClick={() => patch({ capabilities: [...form.capabilities, { title: emptyBilingual(), body: emptyBilingual() }] })}
                >
                  + Add capability
                </button>
              </div>
              {form.capabilities.map((c, i) => (
                <div key={i} className="rounded-lg border border-slate-200 p-3">
                  <div className="mb-2 flex justify-end">
                    <button
                      type="button"
                      className="text-xs font-semibold text-red-600"
                      onClick={() => patch({ capabilities: form.capabilities.filter((_, j) => j !== i) })}
                    >
                      Remove
                    </button>
                  </div>
                  <BilingualInputs
                    labelEn="Title (EN)"
                    labelAr="Title (AR)"
                    value={c.title}
                    onChange={(title) => patch({ capabilities: form.capabilities.map((x, j) => (j === i ? { ...x, title } : x)) })}
                  />
                  <BilingualInputs
                    labelEn="Body (EN)"
                    labelAr="Body (AR)"
                    multiline
                    rows={3}
                    value={c.body}
                    onChange={(body) => patch({ capabilities: form.capabilities.map((x, j) => (j === i ? { ...x, body } : x)) })}
                  />
                </div>
              ))}
            </div>
          ) : null}

          {activeTab === 'operations' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">Workflow steps</span>
                <button
                  type="button"
                  className="text-xs font-semibold text-brand hover:underline"
                  onClick={() => patch({ workflows: [...form.workflows, { step: emptyBilingual(), detail: emptyBilingual() }] })}
                >
                  + Add step
                </button>
              </div>
              {form.workflows.map((w, i) => (
                <div key={i} className="rounded-lg border border-slate-200 p-3">
                  <div className="mb-2 flex justify-end">
                    <button
                      type="button"
                      className="text-xs font-semibold text-red-600"
                      onClick={() => patch({ workflows: form.workflows.filter((_, j) => j !== i) })}
                    >
                      Remove
                    </button>
                  </div>
                  <BilingualInputs
                    labelEn="Step (EN)"
                    labelAr="Step (AR)"
                    value={w.step}
                    onChange={(step) => patch({ workflows: form.workflows.map((x, j) => (j === i ? { ...x, step } : x)) })}
                  />
                  <BilingualInputs
                    labelEn="Detail (EN)"
                    labelAr="Detail (AR)"
                    multiline
                    rows={2}
                    value={w.detail}
                    onChange={(detail) => patch({ workflows: form.workflows.map((x, j) => (j === i ? { ...x, detail } : x)) })}
                  />
                </div>
              ))}
            </div>
          ) : null}

          {activeTab === 'implementation' ? (
            <>
              <label className="block text-sm">
                <span className="font-semibold text-slate-800">Outcomes (EN) — one per line</span>
                <textarea
                  rows={5}
                  className={inputClass}
                  value={arrayToLines(form.outcomes.en)}
                  onChange={(e) => patch({ outcomes: { ...form.outcomes, en: linesToArray(e.target.value) } })}
                />
              </label>
              <label className="block text-sm">
                <span className="font-semibold text-slate-800">Outcomes (AR) — one per line</span>
                <textarea
                  dir="rtl"
                  rows={5}
                  className={inputClass}
                  value={arrayToLines(form.outcomes.ar)}
                  onChange={(e) => patch({ outcomes: { ...form.outcomes, ar: linesToArray(e.target.value) } })}
                />
              </label>
            </>
          ) : null}

          {activeTab === 'faqs' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-900">FAQs</span>
                <button
                  type="button"
                  className="text-xs font-semibold text-brand hover:underline"
                  onClick={() => patch({ faqs: [...form.faqs, { q: emptyBilingual(), a: emptyBilingual() }] })}
                >
                  + Add FAQ
                </button>
              </div>
              {form.faqs.map((f, i) => (
                <div key={i} className="rounded-lg border border-slate-200 p-3">
                  <div className="mb-2 flex justify-end">
                    <button
                      type="button"
                      className="text-xs font-semibold text-red-600"
                      onClick={() => patch({ faqs: form.faqs.filter((_, j) => j !== i) })}
                    >
                      Remove
                    </button>
                  </div>
                  <BilingualInputs
                    labelEn="Question (EN)"
                    labelAr="Question (AR)"
                    value={f.q}
                    onChange={(q) => patch({ faqs: form.faqs.map((x, j) => (j === i ? { ...x, q } : x)) })}
                  />
                  <BilingualInputs
                    labelEn="Answer (EN)"
                    labelAr="Answer (AR)"
                    multiline
                    rows={2}
                    value={f.a}
                    onChange={(a) => patch({ faqs: form.faqs.map((x, j) => (j === i ? { ...x, a } : x)) })}
                  />
                </div>
              ))}
            </div>
          ) : null}

          {activeTab === 'cta' ? (
            <>
              <BilingualInputs
                labelEn="Final CTA heading (EN)"
                labelAr="Final CTA heading (AR)"
                value={form.demoCta.heading}
                onChange={(heading) => patch({ demoCta: { ...form.demoCta, heading } })}
              />
              <BilingualInputs
                labelEn="Final CTA subtext (EN)"
                labelAr="Final CTA subtext (AR)"
                multiline
                rows={2}
                value={form.demoCta.sub}
                onChange={(sub) => patch({ demoCta: { ...form.demoCta, sub } })}
              />
            </>
          ) : null}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(15,23,42,0.06)] backdrop-blur-sm md:left-[15.5rem]">
        <div className="mx-auto max-w-4xl">
          <AdminFormActions saving={saving} onSave={save} onCancel={cancel} disableSave={!dirty} className="border-t-0 pt-0" />
        </div>
      </div>
    </div>
  )
}
