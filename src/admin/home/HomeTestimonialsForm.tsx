import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Bilingual } from '../../cms/types'
import type { TestimonialCmsItem, TestimonialsCms } from '../../types/homepageCms'
import { useAdminSection } from '../hooks/useAdminSection'
import { useAdminToast } from '../AdminToastContext'
import { BilingualInputs } from '../cms/BilingualInputs'
import { AdminFormActions } from '../cms/AdminFormActions'
import { ConfirmDialog } from '../cms/ConfirmDialog'

function sortItems(xs: TestimonialCmsItem[]) {
  return [...xs].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}

export function HomeTestimonialsForm() {
  const toast = useAdminToast()
  const sec = useAdminSection<TestimonialsCms>('testimonials')
  const [local, setLocal] = useState<TestimonialsCms | null>(null)
  const [baseline, setBaseline] = useState('')
  const [delId, setDelId] = useState<string | null>(null)

  useEffect(() => {
    if (!sec.data) return
    const d = { ...sec.data, items: sortItems(sec.data.items || []) }
    setLocal(d)
    setBaseline(JSON.stringify(d))
  }, [sec.data])

  const dirty = useMemo(() => (local ? JSON.stringify(local) !== baseline : false), [local, baseline])

  const cancel = useCallback(() => {
    try {
      setLocal(JSON.parse(baseline) as TestimonialsCms)
      toast.push('Changes reverted', 'info')
    } catch {
      /* */
    }
  }, [baseline, toast])

  const save = async () => {
    if (!local) return
    try {
      const out = { ...local, items: sortItems(local.items) }
      await sec.save(out as TestimonialsCms & Record<string, unknown>)
      setBaseline(JSON.stringify(out))
      toast.push('Saved successfully', 'success')
    } catch {
      /* */
    }
  }

  const updateItem = (id: string, patch: Partial<TestimonialCmsItem>) => {
    if (!local) return
    setLocal({
      ...local,
      items: local.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    })
  }

  if (sec.loading || !local) {
    return (
      <div className="flex items-center gap-2 py-8 text-sm text-slate-600">
        <span className="size-4 animate-spin rounded-full border-2 border-brand border-t-transparent" aria-hidden />
        Loading testimonials…
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {sec.error ? <p className="text-sm text-red-700">{sec.error}</p> : null}

      <BilingualInputs labelEn="Eyebrow (EN)" labelAr="Eyebrow (AR)" value={local.eyebrow} onChange={(eyebrow) => setLocal({ ...local, eyebrow })} />
      <BilingualInputs labelEn="Title (EN)" labelAr="Title (AR)" value={local.title} onChange={(title) => setLocal({ ...local, title })} />

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Testimonial cards</h3>
        <button
          type="button"
          className="rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-dark"
          onClick={() => {
            const id = `testimonial-${Date.now().toString(36)}`
            const empty: Bilingual = { en: '', ar: '' }
            setLocal({
              ...local,
              items: sortItems([
                ...local.items,
                {
                  id,
                  quote: empty,
                  customerName: empty,
                  designation: empty,
                  company: empty,
                  image: '',
                  imageAlt: empty,
                  sortOrder: local.items.length,
                  enabled: true,
                },
              ]),
            })
          }}
        >
          Add testimonial
        </button>
      </div>

      <div className="space-y-4">
        {sortItems(local.items).map((item) => (
          <div key={item.id} className="rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs text-slate-500">{item.id}</span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={item.enabled !== false}
                    onChange={(e) => updateItem(item.id, { enabled: e.target.checked })}
                  />
                  Enabled
                </label>
                <label className="text-xs font-semibold text-slate-700">
                  Order
                  <input
                    type="number"
                    className="ml-1 w-16 rounded border border-slate-200 px-2 py-0.5"
                    value={item.sortOrder ?? 0}
                    onChange={(e) => updateItem(item.id, { sortOrder: Number(e.target.value) || 0 })}
                  />
                </label>
                <button type="button" className="text-xs font-semibold text-red-600" onClick={() => setDelId(item.id)}>
                  Delete
                </button>
              </div>
            </div>

            <BilingualInputs labelEn="Quote (EN)" labelAr="Quote (AR)" multiline rows={3} value={item.quote} onChange={(quote) => updateItem(item.id, { quote })} />
            <BilingualInputs labelEn="Customer name (EN)" labelAr="Customer name (AR)" value={item.customerName} onChange={(customerName) => updateItem(item.id, { customerName })} />
            <BilingualInputs labelEn="Designation (EN)" labelAr="Designation (AR)" value={item.designation} onChange={(designation) => updateItem(item.id, { designation })} />
            <BilingualInputs labelEn="Company (EN)" labelAr="Company (AR)" value={item.company} onChange={(company) => updateItem(item.id, { company })} />

            <label className="block text-sm">
              <span className="font-semibold text-slate-800">Portrait image URL</span>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
                value={item.image ?? ''}
                onChange={(e) => updateItem(item.id, { image: e.target.value })}
                placeholder="/uploads/… or https://…"
              />
            </label>
            <BilingualInputs labelEn="Image alt (EN)" labelAr="Image alt (AR)" value={item.imageAlt ?? { en: '', ar: '' }} onChange={(imageAlt) => updateItem(item.id, { imageAlt })} />
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={delId != null}
        title="Delete testimonial?"
        message="This removes the testimonial from the carousel. You can undo before saving."
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
          await save()
          await sec.publish()
          toast.push('Published successfully', 'success')
        }}
        onCancel={cancel}
        disableSave={!dirty}
        statusLabel={
          sec.publishStatus
            ? `${sec.publishStatus.status}${
                sec.publishStatus.lastPublishedAt
                  ? ` · Last published ${new Date(sec.publishStatus.lastPublishedAt).toLocaleString()}`
                  : ''
              }`
            : null
        }
      />
    </div>
  )
}
