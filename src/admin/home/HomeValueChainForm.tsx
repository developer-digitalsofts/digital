import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Bilingual } from '../../cms/types'
import { useAdminSection } from '../hooks/useAdminSection'
import { useAdminToast } from '../AdminToastContext'
import { BilingualInputs } from '../cms/BilingualInputs'
import { AdminFormActions } from '../cms/AdminFormActions'
import { ConfirmDialog } from '../cms/ConfirmDialog'

type VcCard = {
  id: string
  icon: string
  title: Bilingual
  description: Bilingual
  sortOrder: number
  active: boolean
}

type ValueChainDoc = {
  title: Bilingual
  subtitle: Bilingual
  cards: VcCard[]
  _meta?: Record<string, unknown>
}

function sortCards(xs: VcCard[]) {
  return [...xs].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}

export function HomeValueChainForm() {
  const toast = useAdminToast()
  const sec = useAdminSection<ValueChainDoc>('valueChain')
  const [local, setLocal] = useState<ValueChainDoc | null>(null)
  const [baseline, setBaseline] = useState('')
  const [delId, setDelId] = useState<string | null>(null)

  useEffect(() => {
    if (!sec.data) return
    const d = { ...sec.data, cards: sortCards(sec.data.cards || []) }
    setLocal(d)
    setBaseline(JSON.stringify(d))
  }, [sec.data])

  const dirty = useMemo(() => (local ? JSON.stringify(local) !== baseline : false), [local, baseline])

  const cancel = useCallback(() => {
    try {
      setLocal(JSON.parse(baseline) as ValueChainDoc)
      toast.push('Changes reverted', 'info')
    } catch {
      /* */
    }
  }, [baseline, toast])

  const save = async () => {
    if (!local) return
    try {
      const out = { ...local, cards: sortCards(local.cards) }
      await sec.save(out as ValueChainDoc & Record<string, unknown>)
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
        Loading features…
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
        rows={3}
        value={local.subtitle}
        onChange={(subtitle) => setLocal({ ...local, subtitle })}
      />

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Feature cards</h3>
        <button
          type="button"
          className="text-xs font-bold uppercase tracking-wide text-brand hover:underline"
          onClick={() => {
            const id = `vc-${crypto.randomUUID().slice(0, 10)}`
            setLocal({
              ...local,
              cards: [
                ...local.cards,
                {
                  id,
                  icon: 'Activity',
                  title: { en: '', ar: '' },
                  description: { en: '', ar: '' },
                  sortOrder: local.cards.length,
                  active: true,
                },
              ],
            })
          }}
        >
          + Add card
        </button>
      </div>

      <div className="space-y-6">
        {sortCards(local.cards).map((c) => (
          <div key={c.id} className="rounded-xl border border-slate-200 bg-slate-50/40 p-4">
            <div className="mb-3 flex flex-wrap justify-between gap-2">
              <span className="font-mono text-xs text-slate-500">{c.id}</span>
              <div className="flex items-center gap-3 text-xs">
                <label className="flex items-center gap-1 font-semibold">
                  <input
                    type="checkbox"
                    checked={c.active !== false}
                    onChange={(e) =>
                      setLocal({
                        ...local,
                        cards: local.cards.map((x) => (x.id === c.id ? { ...x, active: e.target.checked } : x)),
                      })
                    }
                  />
                  Active
                </label>
                <label className="flex items-center gap-1">
                  Sort
                  <input
                    type="number"
                    className="w-14 rounded border border-slate-200 px-1 py-0.5"
                    value={c.sortOrder}
                    onChange={(e) =>
                      setLocal({
                        ...local,
                        cards: local.cards.map((x) =>
                          x.id === c.id ? { ...x, sortOrder: Number(e.target.value) || 0 } : x,
                        ),
                      })
                    }
                  />
                </label>
                <button type="button" className="font-semibold text-red-600 hover:underline" onClick={() => setDelId(c.id)}>
                  Delete
                </button>
              </div>
            </div>
            <label className="mb-2 block text-xs font-semibold">
              Icon
              <input
                className="mt-1 w-full max-w-xs rounded-lg border border-slate-200 px-2 py-1.5 font-mono text-sm"
                value={c.icon}
                onChange={(e) =>
                  setLocal({ ...local, cards: local.cards.map((x) => (x.id === c.id ? { ...x, icon: e.target.value } : x)) })
                }
              />
            </label>
            <BilingualInputs
              labelEn="Title (EN)"
              labelAr="Title (AR)"
              value={c.title}
              onChange={(title) =>
                setLocal({ ...local, cards: local.cards.map((x) => (x.id === c.id ? { ...x, title } : x)) })
              }
            />
            <div className="mt-3">
              <BilingualInputs
                labelEn="Description (EN)"
                labelAr="Description (AR)"
                multiline
                rows={3}
                value={c.description}
                onChange={(description) =>
                  setLocal({ ...local, cards: local.cards.map((x) => (x.id === c.id ? { ...x, description } : x)) })
                }
              />
            </div>
          </div>
        ))}
      </div>

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

      <ConfirmDialog
        open={!!delId}
        title="Delete card?"
        message="Are you sure you want to delete this item?"
        confirmLabel="Delete"
        onClose={() => setDelId(null)}
        onConfirm={() => {
          if (!delId) return
          setLocal((l) => (l ? { ...l, cards: l.cards.filter((x) => x.id !== delId) } : l))
          setDelId(null)
        }}
      />
    </div>
  )
}
