import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Bilingual } from '../../cms/types'
import { useAdminSection } from '../hooks/useAdminSection'
import { useAdminToast } from '../AdminToastContext'
import { BilingualInputs } from '../cms/BilingualInputs'
import { AdminFormActions } from '../cms/AdminFormActions'
import { ConfirmDialog } from '../cms/ConfirmDialog'

type StatItem = {
  id: string
  value: string
  label: Bilingual
  icon: string
  sortOrder: number
  active: boolean
}

type StatsDoc = {
  title: Bilingual
  items: StatItem[]
  _meta?: Record<string, unknown>
}

function sortItems<T extends { sortOrder?: number }>(xs: T[]) {
  return [...xs].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}

export function HomeStatsForm() {
  const toast = useAdminToast()
  const sec = useAdminSection<StatsDoc>('stats')
  const [local, setLocal] = useState<StatsDoc | null>(null)
  const [baseline, setBaseline] = useState('')
  const [delId, setDelId] = useState<string | null>(null)

  useEffect(() => {
    if (!sec.data) return
    const s = { ...sec.data, items: sortItems(sec.data.items || []) }
    setLocal(s)
    setBaseline(JSON.stringify(s))
  }, [sec.data])

  const dirty = useMemo(() => (local ? JSON.stringify(local) !== baseline : false), [local, baseline])

  const cancel = useCallback(() => {
    try {
      setLocal(JSON.parse(baseline) as StatsDoc)
      toast.push('Changes reverted', 'info')
    } catch {
      /* ignore */
    }
  }, [baseline, toast])

  const save = async () => {
    if (!local) return
    try {
      await sec.save({ ...local, items: sortItems(local.items) } as StatsDoc & Record<string, unknown>)
      setBaseline(JSON.stringify({ ...local, items: sortItems(local.items) }))
      toast.push('Saved successfully', 'success')
    } catch {
      /* */
    }
  }

  if (sec.loading || !local) {
    return (
      <div className="flex items-center gap-2 py-8 text-sm text-slate-600">
        <span className="size-4 animate-spin rounded-full border-2 border-brand border-t-transparent" aria-hidden />
        Loading stats…
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {sec.error ? <p className="text-sm text-red-700">{sec.error}</p> : null}
      <BilingualInputs labelEn="Section title (EN)" labelAr="Section title (AR)" value={local.title} onChange={(title) => setLocal({ ...local, title })} />

      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-slate-900">Stat cards</h3>
        <button
          type="button"
          className="text-xs font-bold uppercase tracking-wide text-brand hover:underline"
          onClick={() => {
            const id = `s-${crypto.randomUUID().slice(0, 10)}`
            setLocal({
              ...local,
              items: [...local.items, { id, value: '', label: { en: '', ar: '' }, icon: 'Activity', sortOrder: local.items.length, active: true }],
            })
          }}
        >
          + Add stat
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full text-left text-xs">
          <thead className="bg-slate-50 font-bold uppercase text-slate-600">
            <tr>
              <th className="px-2 py-2">Value</th>
              <th className="px-2 py-2">Label EN</th>
              <th className="px-2 py-2">Label AR</th>
              <th className="px-2 py-2">Icon</th>
              <th className="px-2 py-2">Order</th>
              <th className="px-2 py-2">Active</th>
              <th className="px-2 py-2" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortItems(local.items).map((it) => (
              <tr key={it.id}>
                <td className="px-2 py-1">
                  <input
                    className="w-16 rounded border border-slate-200 px-1 py-1"
                    value={it.value}
                    onChange={(e) =>
                      setLocal({ ...local, items: local.items.map((x) => (x.id === it.id ? { ...x, value: e.target.value } : x)) })
                    }
                  />
                </td>
                <td className="px-2 py-1">
                  <input
                    className="w-28 rounded border border-slate-200 px-1 py-1 sm:w-36"
                    value={it.label.en}
                    onChange={(e) =>
                      setLocal({
                        ...local,
                        items: local.items.map((x) => (x.id === it.id ? { ...x, label: { ...x.label, en: e.target.value } } : x)),
                      })
                    }
                  />
                </td>
                <td className="px-2 py-1">
                  <input
                    className="w-28 rounded border border-slate-200 px-1 py-1 sm:w-36"
                    dir="rtl"
                    value={it.label.ar}
                    onChange={(e) =>
                      setLocal({
                        ...local,
                        items: local.items.map((x) => (x.id === it.id ? { ...x, label: { ...x.label, ar: e.target.value } } : x)),
                      })
                    }
                  />
                </td>
                <td className="px-2 py-1">
                  <input
                    className="w-20 rounded border border-slate-200 px-1 py-1 font-mono"
                    value={it.icon}
                    onChange={(e) =>
                      setLocal({ ...local, items: local.items.map((x) => (x.id === it.id ? { ...x, icon: e.target.value } : x)) })
                    }
                  />
                </td>
                <td className="px-2 py-1">
                  <input
                    type="number"
                    className="w-12 rounded border border-slate-200 px-1 py-1"
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
                </td>
                <td className="px-2 py-1">
                  <input
                    type="checkbox"
                    checked={it.active !== false}
                    onChange={(e) =>
                      setLocal({ ...local, items: local.items.map((x) => (x.id === it.id ? { ...x, active: e.target.checked } : x)) })
                    }
                  />
                </td>
                <td className="px-2 py-1">
                  <button type="button" className="text-red-600 hover:underline" onClick={() => setDelId(it.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminFormActions saving={sec.saving} onSave={save} onCancel={cancel} disableSave={!dirty} />

      <ConfirmDialog
        open={!!delId}
        title="Delete stat?"
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
