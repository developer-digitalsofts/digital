import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAdminSection } from '../hooks/useAdminSection'
import { useAdminToast } from '../AdminToastContext'
import { AdminFormActions } from '../cms/AdminFormActions'

type Row = { id: string; name?: string; visible?: boolean; sortOrder?: number }

type PageSectionsDoc = {
  sections: Row[]
  _meta?: Record<string, unknown>
}

export function HomeVisibilityForm() {
  const toast = useAdminToast()
  const sec = useAdminSection<PageSectionsDoc>('pageSections')
  const [local, setLocal] = useState<PageSectionsDoc | null>(null)
  const [baseline, setBaseline] = useState('')

  useEffect(() => {
    if (!sec.data) return
    const sorted = {
      ...sec.data,
      sections: [...(sec.data.sections || [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    }
    setLocal(sorted)
    setBaseline(JSON.stringify(sorted))
  }, [sec.data])

  const dirty = useMemo(() => (local ? JSON.stringify(local) !== baseline : false), [local, baseline])

  const cancel = useCallback(() => {
    try {
      setLocal(JSON.parse(baseline) as PageSectionsDoc)
      toast.push('Changes reverted', 'info')
    } catch {
      /* */
    }
  }, [baseline, toast])

  const save = async () => {
    if (!local) return
    try {
      await sec.save(local as PageSectionsDoc & Record<string, unknown>)
      setBaseline(JSON.stringify(local))
      toast.push('Saved successfully', 'success')
    } catch {
      /* */
    }
  }

  if (sec.loading || !local) {
    return (
      <div className="flex items-center gap-2 py-8 text-sm text-slate-600">
        <span className="size-4 animate-spin rounded-full border-2 border-brand border-t-transparent" aria-hidden />
        Loading section visibility…
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {sec.error ? <p className="text-sm text-red-700">{sec.error}</p> : null}
      <p className="text-sm text-slate-600">
        Control which homepage blocks appear and their order. Header top bar and footer visibility are included here.
      </p>
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-600">
            <tr>
              <th className="px-3 py-2">Section</th>
              <th className="px-3 py-2">ID</th>
              <th className="px-3 py-2">Visible</th>
              <th className="px-3 py-2">Sort</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[...local.sections].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)).map((row) => (
              <tr key={row.id}>
                <td className="px-3 py-2 font-medium text-slate-900">{row.name || row.id}</td>
                <td className="px-3 py-2 font-mono text-xs text-slate-500">{row.id}</td>
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={row.visible !== false}
                    onChange={(e) =>
                      setLocal({
                        ...local,
                        sections: local.sections.map((s) => (s.id === row.id ? { ...s, visible: e.target.checked } : s)),
                      })
                    }
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    className="w-16 rounded border border-slate-200 px-2 py-1 text-sm"
                    value={row.sortOrder ?? 0}
                    onChange={(e) =>
                      setLocal({
                        ...local,
                        sections: local.sections.map((s) =>
                          s.id === row.id ? { ...s, sortOrder: Number(e.target.value) || 0 } : s,
                        ),
                      })
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AdminFormActions saving={sec.saving} onSave={save} onCancel={cancel} disableSave={!dirty} />
    </div>
  )
}
