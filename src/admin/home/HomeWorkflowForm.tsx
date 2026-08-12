import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Bilingual } from '../../cms/types'
import { useAdminSection } from '../hooks/useAdminSection'
import { useAdminToast } from '../AdminToastContext'
import { BilingualInputs } from '../cms/BilingualInputs'
import { AdminFormActions } from '../cms/AdminFormActions'

type WorkflowDoc = {
  title: Bilingual
  paragraph: Bilingual
  cta: Bilingual
  ctaHref: string
  background?: string
  _meta?: Record<string, unknown>
}

export function HomeWorkflowForm() {
  const toast = useAdminToast()
  const sec = useAdminSection<WorkflowDoc>('workflow')
  const [local, setLocal] = useState<WorkflowDoc | null>(null)
  const [baseline, setBaseline] = useState('')

  useEffect(() => {
    if (!sec.data) return
    setLocal({ ...sec.data })
    setBaseline(JSON.stringify(sec.data))
  }, [sec.data])

  const dirty = useMemo(() => (local ? JSON.stringify(local) !== baseline : false), [local, baseline])

  const cancel = useCallback(() => {
    try {
      setLocal(JSON.parse(baseline) as WorkflowDoc)
      toast.push('Changes reverted', 'info')
    } catch {
      /* */
    }
  }, [baseline, toast])

  const save = async () => {
    if (!local) return
    try {
      await sec.save(local as WorkflowDoc & Record<string, unknown>)
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
        Loading…
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {sec.error ? <p className="text-sm text-red-700">{sec.error}</p> : null}
      <BilingualInputs labelEn="Title (EN)" labelAr="Title (AR)" value={local.title} onChange={(title) => setLocal({ ...local, title })} />
      <BilingualInputs
        labelEn="Paragraph (EN)"
        labelAr="Paragraph (AR)"
        multiline
        rows={4}
        value={local.paragraph}
        onChange={(paragraph) => setLocal({ ...local, paragraph })}
      />
      <BilingualInputs labelEn="CTA label (EN)" labelAr="CTA label (AR)" value={local.cta} onChange={(cta) => setLocal({ ...local, cta })} />
      <label className="block text-sm">
        <span className="font-semibold text-slate-800">CTA link</span>
        <input
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
          value={local.ctaHref}
          onChange={(e) => setLocal({ ...local, ctaHref: e.target.value })}
        />
      </label>
      <label className="block text-sm">
        <span className="font-semibold text-slate-800">Background</span>
        <select
          className="mt-1 w-full max-w-xs rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
          value={local.background || 'gradient-soft'}
          onChange={(e) => setLocal({ ...local, background: e.target.value })}
        >
          <option value="gradient-soft">Soft gradient</option>
          <option value="gradient-strong">Strong gradient</option>
        </select>
      </label>
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
