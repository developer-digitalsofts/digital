import { useEffect, useMemo, useState } from 'react'
import type { Bilingual } from '../../cms/types'
import type { TestimonialRecord, TestimonialsContentDoc } from '../../types/testimonialsContent'
import { useAdminSection } from '../hooks/useAdminSection'
import { useAdminToast } from '../AdminToastContext'
import { BilingualInputs } from '../cms/BilingualInputs'
import { AdminFormActions } from '../cms/AdminFormActions'
import { ConfirmDialog } from '../cms/ConfirmDialog'
import { AdminLayoutMediaField } from '../layout/AdminLayoutMediaField'
import { AdminLocaleEditorBanner } from '../AdminLocaleEditorBanner'
import { ADMIN_EDITOR_LOCALE } from '../adminLocaleSections'

const emptyBi = (): Bilingual => ({ en: '', ar: '' })

function sortItems(xs: TestimonialRecord[]) {
  return [...xs].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}

export function AdminTestimonialsPage() {
  const toast = useAdminToast()
  const sec = useAdminSection<TestimonialsContentDoc>('testimonials')
  const [local, setLocal] = useState<TestimonialsContentDoc | null>(null)
  const [baseline, setBaseline] = useState('')
  const [delId, setDelId] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all')
  const [countryFilter, setCountryFilter] = useState('all')
  const [langFilter, setLangFilter] = useState('all')
  const [industryFilter, setIndustryFilter] = useState('all')

  useEffect(() => {
    if (!sec.data) return
    const d = {
      ...sec.data,
      section: sec.data.section || {},
      page: sec.data.page || {},
      items: sortItems(sec.data.items || []),
    }
    setLocal(d)
    setBaseline(JSON.stringify(d))
  }, [sec.data])

  const dirty = useMemo(() => (local ? JSON.stringify(local) !== baseline : false), [local, baseline])

  const industries = useMemo(() => {
    if (!local) return []
    return [...new Set(local.items.map((i) => i.industry).filter(Boolean))].sort() as string[]
  }, [local])

  const filteredItems = useMemo(() => {
    if (!local) return []
    return sortItems(local.items).filter((item) => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false
      if (countryFilter !== 'all' && (item.countryCode || 'AE') !== countryFilter) return false
      if (langFilter !== 'all' && (item.languageCode || 'en') !== langFilter) return false
      if (industryFilter !== 'all' && item.industry !== industryFilter) return false
      if (!query.trim()) return true
      const q = query.toLowerCase()
      const hay = [item.internalTitle, item.customerName?.en, item.company?.en, item.industry, item.country]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [local, query, statusFilter, countryFilter, langFilter, industryFilter])

  const updateItem = (id: string, patch: Partial<TestimonialRecord>) => {
    if (!local) return
    setLocal({ ...local, items: local.items.map((item) => (item.id === id ? { ...item, ...patch } : item)) })
  }

  const moveItem = (id: string, dir: -1 | 1) => {
    if (!local) return
    const items = sortItems(local.items)
    const idx = items.findIndex((i) => i.id === id)
    const swap = idx + dir
    if (idx < 0 || swap < 0 || swap >= items.length) return
    const next = [...items]
    const a = next[idx]
    const b = next[swap]
    next[idx] = { ...b, sortOrder: a.sortOrder ?? idx }
    next[swap] = { ...a, sortOrder: b.sortOrder ?? swap }
    setLocal({ ...local, items: next })
  }

  const duplicateItem = (item: TestimonialRecord) => {
    if (!local) return
    const id = `testimonial-${Date.now().toString(36)}`
    setLocal({
      ...local,
      items: sortItems([
        ...local.items,
        {
          ...item,
          id,
          internalTitle: `${item.internalTitle || item.customerName?.en || item.id} (copy)`,
          status: 'draft',
          featuredOnHomepage: false,
          isSample: false,
          sortOrder: local.items.length,
        },
      ]),
    })
    toast.push('Draft duplicate created', 'success')
  }

  const save = async () => {
    if (!local) return
    const out = { ...local, schemaVersion: 3, items: sortItems(local.items) }
    await sec.save(out as TestimonialsContentDoc & Record<string, unknown>)
    setBaseline(JSON.stringify(out))
    toast.push('Testimonials saved', 'success')
  }

  if (sec.loading || !local) {
    return <p className="py-8 text-sm text-slate-600">Loading testimonials…</p>
  }

  return (
    <div className="space-y-8">
      <AdminLocaleEditorBanner {...ADMIN_EDITOR_LOCALE.testimonials} />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Testimonials</h2>
          <p className="text-sm text-slate-600">Manage verified client testimonials. Sample drafts are never published automatically.</p>
        </div>
        <button
          type="button"
          className="rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white"
          onClick={() => {
            const id = `testimonial-${Date.now().toString(36)}`
            setLocal({
              ...local,
              items: sortItems([
                ...local.items,
                {
                  id,
                  internalTitle: 'New testimonial',
                  quote: emptyBi(),
                  customerName: emptyBi(),
                  designation: emptyBi(),
                  company: emptyBi(),
                  status: 'draft',
                  enabled: true,
                  featuredOnHomepage: false,
                  verified: false,
                  sortOrder: local.items.length,
                  countryCode: 'AE',
                  languageCode: 'en',
                },
              ]),
            })
          }}
        >
          Add New Testimonial
        </button>
      </div>

      <section className="rounded-xl border border-slate-200 p-4 space-y-4">
        <h3 className="font-bold text-slate-900">Homepage section</h3>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={local.section?.enabled !== false} onChange={(e) => setLocal({ ...local, section: { ...local.section, enabled: e.target.checked } })} />
          Enable homepage testimonials section
        </label>
        <BilingualInputs labelEn="Eyebrow" labelAr="Eyebrow (AR)" value={local.section?.eyebrow || emptyBi()} onChange={(eyebrow) => setLocal({ ...local, section: { ...local.section, eyebrow } })} />
        <BilingualInputs labelEn="Heading" labelAr="Heading (AR)" value={local.section?.heading || emptyBi()} onChange={(heading) => setLocal({ ...local, section: { ...local.section, heading } })} />
        <BilingualInputs labelEn="Supporting text" labelAr="Supporting text (AR)" multiline rows={2} value={local.section?.supportingText || emptyBi()} onChange={(supportingText) => setLocal({ ...local, section: { ...local.section, supportingText } })} />
        <BilingualInputs labelEn="View all label" labelAr="View all label (AR)" value={local.section?.viewAllLabel || emptyBi()} onChange={(viewAllLabel) => setLocal({ ...local, section: { ...local.section, viewAllLabel } })} />
        <label className="block text-sm">
          View all URL
          <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={local.section?.viewAllUrl || '/testimonials'} onChange={(e) => setLocal({ ...local, section: { ...local.section, viewAllUrl: e.target.value } })} />
        </label>
      </section>

      <section className="rounded-xl border border-slate-200 p-4 space-y-4">
        <h3 className="font-bold text-slate-900">Testimonials page (/testimonials)</h3>
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input type="checkbox" checked={local.page?.enabled !== false} onChange={(e) => setLocal({ ...local, page: { ...local.page, enabled: e.target.checked } })} />
          Enable dedicated testimonials page
        </label>
        <BilingualInputs labelEn="Page title" labelAr="Page title (AR)" value={local.page?.title || emptyBi()} onChange={(title) => setLocal({ ...local, page: { ...local.page, title } })} />
        <BilingualInputs labelEn="Page eyebrow" labelAr="Page eyebrow (AR)" value={local.page?.eyebrow || emptyBi()} onChange={(eyebrow) => setLocal({ ...local, page: { ...local.page, eyebrow } })} />
        <BilingualInputs labelEn="Introduction" labelAr="Introduction (AR)" multiline rows={3} value={local.page?.intro || emptyBi()} onChange={(intro) => setLocal({ ...local, page: { ...local.page, intro } })} />
        <BilingualInputs labelEn="SEO title" labelAr="SEO title (AR)" value={local.page?.seoTitle || emptyBi()} onChange={(seoTitle) => setLocal({ ...local, page: { ...local.page, seoTitle } })} />
        <BilingualInputs labelEn="SEO description" labelAr="SEO description (AR)" multiline rows={2} value={local.page?.seoDescription || emptyBi()} onChange={(seoDescription) => setLocal({ ...local, page: { ...local.page, seoDescription } })} />
      </section>

      <div className="flex flex-wrap gap-3">
        <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Search client or company" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="rounded-xl border border-slate-200 px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}>
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <select className="rounded-xl border border-slate-200 px-3 py-2 text-sm" value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)}>
          <option value="all">All countries</option>
          <option value="GCC">Shared GCC</option>
          <option value="AE">UAE</option>
          <option value="SA">Saudi Arabia</option>
          <option value="KW">Kuwait</option>
          <option value="QA">Qatar</option>
          <option value="OM">Oman</option>
          <option value="BH">Bahrain</option>
        </select>
        <select className="rounded-xl border border-slate-200 px-3 py-2 text-sm" value={langFilter} onChange={(e) => setLangFilter(e.target.value)}>
          <option value="all">All languages</option>
          <option value="en">English</option>
          <option value="ar">Arabic</option>
        </select>
        <select className="rounded-xl border border-slate-200 px-3 py-2 text-sm" value={industryFilter} onChange={(e) => setIndustryFilter(e.target.value)}>
          <option value="all">All industries</option>
          {industries.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-slate-900">{item.internalTitle || item.customerName?.en || item.id}</p>
                <p className="text-xs text-slate-500">{item.status || 'draft'}{item.isSample ? ' · sample draft' : ''}</p>
              </div>
              <div className="flex flex-wrap gap-3 text-xs font-semibold">
                <label className="flex items-center gap-1"><input type="checkbox" checked={item.enabled !== false} onChange={(e) => updateItem(item.id, { enabled: e.target.checked })} />Enabled</label>
                <label className="flex items-center gap-1"><input type="checkbox" checked={item.featuredOnHomepage === true} onChange={(e) => updateItem(item.id, { featuredOnHomepage: e.target.checked })} />Featured</label>
                <label className="flex items-center gap-1"><input type="checkbox" checked={item.verified === true} onChange={(e) => updateItem(item.id, { verified: e.target.checked })} />Verified</label>
                <select
                  value={item.status || 'draft'}
                  onChange={(e) => {
                    const next = e.target.value as 'draft' | 'published'
                    if (next === 'published' && item.isSample) {
                      toast.push('Sample testimonials cannot be published until real customer approval.', 'error')
                      return
                    }
                    updateItem(item.id, { status: next })
                  }}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
                <label className="flex items-center gap-1">
                  Order
                  <input
                    type="number"
                    className="w-14 rounded border border-slate-200 px-1 py-0.5"
                    value={item.sortOrder ?? 0}
                    onChange={(e) => updateItem(item.id, { sortOrder: Number(e.target.value) || 0 })}
                  />
                </label>
                <button type="button" className="text-slate-700" onClick={() => moveItem(item.id, -1)}>Up</button>
                <button type="button" className="text-slate-700" onClick={() => moveItem(item.id, 1)}>Down</button>
                <button type="button" className="text-slate-700" onClick={() => duplicateItem(item)}>Duplicate</button>
                {item.status === 'published' ? (
                  <a href="/#testimonials" target="_blank" rel="noreferrer" className="text-brand">
                    Preview
                  </a>
                ) : null}
                <button type="button" className="text-red-600" onClick={() => setDelId(item.id)}>Delete</button>
              </div>
            </div>
            <input className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Internal title" value={item.internalTitle || ''} onChange={(e) => updateItem(item.id, { internalTitle: e.target.value })} />
            <BilingualInputs labelEn="Quote" labelAr="Quote (AR)" multiline rows={3} value={item.quote} onChange={(quote) => updateItem(item.id, { quote })} />
            <BilingualInputs labelEn="Client name" labelAr="Client name (AR)" value={item.customerName} onChange={(customerName) => updateItem(item.id, { customerName })} />
            <BilingualInputs labelEn="Designation" labelAr="Designation (AR)" value={item.designation || emptyBi()} onChange={(designation) => updateItem(item.id, { designation })} />
            <BilingualInputs labelEn="Company" labelAr="Company (AR)" value={item.company || emptyBi()} onChange={(company) => updateItem(item.id, { company })} />
            <BilingualInputs labelEn="Product/service" labelAr="Product/service (AR)" value={item.productService || emptyBi()} onChange={(productService) => updateItem(item.id, { productService })} />
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-sm">Industry<input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={item.industry || ''} onChange={(e) => updateItem(item.id, { industry: e.target.value })} /></label>
              <label className="text-sm">City<input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={item.city || ''} onChange={(e) => updateItem(item.id, { city: e.target.value })} /></label>
              <label className="text-sm">
                Country scope
                <select className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={item.countryCode || 'GCC'} onChange={(e) => updateItem(item.id, { countryCode: e.target.value })}>
                  <option value="GCC">Shared GCC</option>
                  <option value="AE">UAE</option>
                  <option value="SA">Saudi Arabia</option>
                  <option value="KW">Kuwait</option>
                  <option value="QA">Qatar</option>
                  <option value="OM">Oman</option>
                  <option value="BH">Bahrain</option>
                </select>
              </label>
              <label className="text-sm">
                Language
                <select className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={item.languageCode || 'en'} onChange={(e) => updateItem(item.id, { languageCode: e.target.value })}>
                  <option value="en">English</option>
                  <option value="ar">Arabic</option>
                </select>
              </label>
              <label className="text-sm">Country label<input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={item.country || ''} onChange={(e) => updateItem(item.id, { country: e.target.value })} placeholder="e.g. UAE" /></label>
              <label className="text-sm">Rating (optional)<input type="number" min={1} max={5} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={item.rating ?? ''} onChange={(e) => updateItem(item.id, { rating: e.target.value ? Number(e.target.value) : undefined })} /></label>
            </div>
            <AdminLayoutMediaField label="Client photo" value={item.image || ''} onChange={(image) => updateItem(item.id, { image })} />
            <AdminLayoutMediaField label="Company logo" value={item.companyLogo || ''} onChange={(companyLogo) => updateItem(item.id, { companyLogo })} />
            <BilingualInputs labelEn="Photo alt text" labelAr="Photo alt (AR)" value={item.imageAlt || emptyBi()} onChange={(imageAlt) => updateItem(item.id, { imageAlt })} />
            <BilingualInputs labelEn="Logo alt text" labelAr="Logo alt (AR)" value={item.companyLogoAlt || emptyBi()} onChange={(companyLogoAlt) => updateItem(item.id, { companyLogoAlt })} />
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" checked={item.isSample === true} onChange={(e) => updateItem(item.id, { isSample: e.target.checked, status: e.target.checked ? 'draft' : item.status })} />
              Sample / placeholder (cannot publish until real approval)
            </label>
            <label className="text-sm">Verification note (admin only)<textarea className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" rows={2} value={item.verificationNote || ''} onChange={(e) => updateItem(item.id, { verificationNote: e.target.value })} /></label>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-sm">Solution URL<input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={item.solutionUrl || ''} onChange={(e) => updateItem(item.id, { solutionUrl: e.target.value })} /></label>
              <label className="text-sm">Case study URL<input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={item.caseStudyUrl || ''} onChange={(e) => updateItem(item.id, { caseStudyUrl: e.target.value })} /></label>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={delId != null}
        title="Delete testimonial?"
        message="This removes the testimonial from the library."
        confirmLabel="Delete"
        onConfirm={() => {
          if (!local || !delId) return
          setLocal({ ...local, items: local.items.filter((i) => i.id !== delId) })
          setDelId(null)
        }}
        onClose={() => setDelId(null)}
      />

      <AdminFormActions
        saving={sec.saving}
        publishing={sec.publishing}
        onSave={save}
        onPublish={async () => {
          const blocked = (local.items || []).filter((i) => i.isSample && i.status === 'published')
          if (blocked.length) {
            toast.push('Unpublish sample testimonials before publishing. Real customer approval is required.', 'error')
            return
          }
          // Force samples to remain draft in the saved document
          const safe = {
            ...local,
            items: local.items.map((i) => (i.isSample ? { ...i, status: 'draft' as const, featuredOnHomepage: false } : i)),
          }
          setLocal(safe)
          await sec.save(safe as TestimonialsContentDoc & Record<string, unknown>)
          setBaseline(JSON.stringify(safe))
          await sec.publish()
          toast.push('Testimonials published (samples kept as drafts)', 'success')
        }}
        onCancel={() => {
          try {
            setLocal(JSON.parse(baseline) as TestimonialsContentDoc)
          } catch {
            /* */
          }
        }}
        disableSave={!dirty}
        statusLabel={sec.publishStatus?.status || null}
      />
    </div>
  )
}
