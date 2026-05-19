import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Bilingual } from '../../cms/types'
import { useAdminSection } from '../hooks/useAdminSection'
import { useAdminToast } from '../AdminToastContext'
import { BilingualInputs } from '../cms/BilingualInputs'
import { AdminFormActions } from '../cms/AdminFormActions'
import { ConfirmDialog } from '../cms/ConfirmDialog'

type FaqItem = {
  id: string
  question: Bilingual
  answer: Bilingual
  sortOrder: number
  active: boolean
}

type FaqsDoc = {
  title: Bilingual
  subtitle: Bilingual
  items: FaqItem[]
  _meta?: Record<string, unknown>
}

function sortItems<T extends { sortOrder?: number }>(xs: T[]) {
  return [...xs].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}

export function HomeFaqsForm() {
  const toast = useAdminToast()
  const sec = useAdminSection<FaqsDoc>('faqs')
  const [local, setLocal] = useState<FaqsDoc | null>(null)
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
      setLocal(JSON.parse(baseline) as FaqsDoc)
      toast.push('Changes reverted', 'info')
    } catch {
      /* */
    }
  }, [baseline, toast])

  const save = async () => {
    if (!local) return
    try {
      const out = { ...local, items: sortItems(local.items) }
      await sec.save(out as FaqsDoc & Record<string, unknown>)
      setBaseline(JSON.stringify(out))
      toast.push('Saved successfully', 'success')
    } catch {
      /* */
    }
  }

  if (sec.loading || !local) {
    return (
      <div className="flex items-center gap-2 py-8 text-sm text-slate-600">
        <span className="size-4 animate-spin rounded-full border-2 border-brand border-t-transparent" aria-hidden />
        Loading FAQs…
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {sec.error ? <p className="text-sm text-red-700">{sec.error}</p> : null}
      <BilingualInputs labelEn="Title (EN)" labelAr="Title (AR)" value={local.title} onChange={(title) => setLocal({ ...local, title })} />
      <BilingualInputs
        labelEn="Subtitle (EN)"
        labelAr="Subtitle (AR)"
        multiline
        rows={2}
        value={local.subtitle}
        onChange={(subtitle) => setLocal({ ...local, subtitle })}
      />

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">FAQ items</h3>
        <button
          type="button"
          className="text-xs font-bold uppercase tracking-wide text-brand hover:underline"
          onClick={() => {
            const id = `f-${crypto.randomUUID().slice(0, 10)}`
            setLocal({
              ...local,
              items: [
                ...local.items,
                {
                  id,
                  question: { en: '', ar: '' },
                  answer: { en: '', ar: '' },
                  sortOrder: local.items.length,
                  active: true,
                },
              ],
            })
          }}
        >
          + Add FAQ
        </button>
      </div>

      <div className="space-y-8">
        {sortItems(local.items).map((it) => (
          <div key={it.id} className="rounded-xl border border-slate-200 bg-slate-50/40 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs text-slate-500">{it.id}</span>
              <div className="flex items-center gap-3 text-xs">
                <label className="flex items-center gap-1 font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={it.active !== false}
                    onChange={(e) =>
                      setLocal({
                        ...local,
                        items: local.items.map((x) => (x.id === it.id ? { ...x, active: e.target.checked } : x)),
                      })
                    }
                  />
                  Active
                </label>
                <label className="flex items-center gap-1 text-slate-700">
                  Sort
                  <input
                    type="number"
                    className="w-14 rounded border border-slate-200 px-1 py-0.5"
                    value={it.sortOrder}
                    onChange={(e) =>
                      setLocal({
                        ...local,
                        items: local.items.map((x) =>
                          x.id === it.id ? { ...x, sortOrder: Number(e.target.value) || 0 } : x,
                        ),
                      })
                    }
                  />
                </label>
                <button type="button" className="font-semibold text-red-600 hover:underline" onClick={() => setDelId(it.id)}>
                  Delete
                </button>
              </div>
            </div>
            <BilingualInputs
              labelEn="Question (EN)"
              labelAr="Question (AR)"
              value={it.question}
              onChange={(question) =>
                setLocal({ ...local, items: local.items.map((x) => (x.id === it.id ? { ...x, question } : x)) })
              }
            />
            <div className="mt-3">
              <BilingualInputs
                labelEn="Answer (EN)"
                labelAr="Answer (AR)"
                multiline
                rows={4}
                value={it.answer}
                onChange={(answer) =>
                  setLocal({ ...local, items: local.items.map((x) => (x.id === it.id ? { ...x, answer } : x)) })
                }
              />
            </div>
          </div>
        ))}
      </div>

      <AdminFormActions saving={sec.saving} onSave={save} onCancel={cancel} disableSave={!dirty} />

      <ConfirmDialog
        open={!!delId}
        title="Delete FAQ?"
        message="Are you sure you want to delete this item?"
        confirmLabel="Delete"
        onClose={() => setDelId(null)}
        onConfirm={() => {
          if (!delId) return
          setLocal((l) => (l ? { ...l, items: l.items.filter((x) => x.id !== delId) } : l))
          setDelId(null)
        }}
      />
    </div>
  )
}
