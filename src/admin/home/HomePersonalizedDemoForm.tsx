import { useCallback, useEffect, useMemo, useState } from 'react'
import type { PersonalizedDemoCms } from '../../types/homepageCms'
import { useAdminSection } from '../hooks/useAdminSection'
import { useAdminToast } from '../AdminToastContext'
import { BilingualInputs } from '../cms/BilingualInputs'
import { AdminFormActions } from '../cms/AdminFormActions'

function sortHighlights(doc: PersonalizedDemoCms) {
  return [...(doc.highlights || [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}

export function HomePersonalizedDemoForm() {
  const toast = useAdminToast()
  const sec = useAdminSection<PersonalizedDemoCms>('personalizedDemo')
  const [local, setLocal] = useState<PersonalizedDemoCms | null>(null)
  const [baseline, setBaseline] = useState('')

  useEffect(() => {
    if (!sec.data) return
    setLocal({ ...sec.data, highlights: sortHighlights(sec.data) })
    setBaseline(JSON.stringify({ ...sec.data, highlights: sortHighlights(sec.data) }))
  }, [sec.data])

  const dirty = useMemo(() => (local ? JSON.stringify(local) !== baseline : false), [local, baseline])

  const cancel = useCallback(() => {
    try {
      setLocal(JSON.parse(baseline) as PersonalizedDemoCms)
      toast.push('Changes reverted', 'info')
    } catch {
      /* */
    }
  }, [baseline, toast])

  const save = async () => {
    if (!local) return
    try {
      const out = { ...local, highlights: sortHighlights(local) }
      await sec.save(out as PersonalizedDemoCms & Record<string, unknown>)
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
        Loading personalized demo…
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {sec.error ? <p className="text-sm text-red-700">{sec.error}</p> : null}
      <p className="text-sm text-slate-600">
        Edit presentation copy only. Form validation, submission endpoint and lead delivery are unchanged.
      </p>

      <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
        <input
          type="checkbox"
          checked={local.enabled !== false}
          onChange={(e) => setLocal({ ...local, enabled: e.target.checked })}
        />
        Section enabled
      </label>

      <BilingualInputs labelEn="Eyebrow (EN)" labelAr="Eyebrow (AR)" value={local.eyebrow} onChange={(eyebrow) => setLocal({ ...local, eyebrow })} />
      <BilingualInputs labelEn="Heading (EN)" labelAr="Heading (AR)" value={local.title} onChange={(title) => setLocal({ ...local, title })} />
      <BilingualInputs
        labelEn="Description (EN)"
        labelAr="Description (AR)"
        multiline
        rows={3}
        value={local.description}
        onChange={(description) => setLocal({ ...local, description })}
      />

      <h3 className="text-sm font-bold text-slate-900">Highlights</h3>
      <div className="space-y-3">
        {sortHighlights(local).map((h) => (
          <div key={h.id} className="rounded-xl border border-slate-200 p-3 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-slate-500">{h.id}</span>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={h.enabled !== false}
                  onChange={(e) =>
                    setLocal({
                      ...local,
                      highlights: local.highlights.map((row) =>
                        row.id === h.id ? { ...row, enabled: e.target.checked } : row,
                      ),
                    })
                  }
                />
                Enabled
              </label>
            </div>
            <BilingualInputs
              labelEn="Label (EN)"
              labelAr="Label (AR)"
              value={h.label}
              onChange={(label) =>
                setLocal({
                  ...local,
                  highlights: local.highlights.map((row) => (row.id === h.id ? { ...row, label } : row)),
                })
              }
            />
          </div>
        ))}
      </div>

      <BilingualInputs labelEn="Submit button (EN)" labelAr="Submit button (AR)" value={local.submitLabel} onChange={(submitLabel) => setLocal({ ...local, submitLabel })} />
      <BilingualInputs labelEn="Success message (EN)" labelAr="Success message (AR)" multiline rows={2} value={local.successMessage} onChange={(successMessage) => setLocal({ ...local, successMessage })} />
      <BilingualInputs labelEn="Error message (EN)" labelAr="Error message (AR)" multiline rows={2} value={local.errorMessage} onChange={(errorMessage) => setLocal({ ...local, errorMessage })} />

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
