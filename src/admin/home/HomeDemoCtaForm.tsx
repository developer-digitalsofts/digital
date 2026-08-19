import { useCallback, useEffect, useMemo, useState } from 'react'
import type { DemoCtaCms } from '../../types/homepageCms'
import { useAdminSection } from '../hooks/useAdminSection'
import { useAdminToast } from '../AdminToastContext'
import { BilingualInputs } from '../cms/BilingualInputs'
import { AdminFormActions } from '../cms/AdminFormActions'

export function HomeDemoCtaForm() {
  const toast = useAdminToast()
  const sec = useAdminSection<DemoCtaCms>('demoCta')
  const [local, setLocal] = useState<DemoCtaCms | null>(null)
  const [baseline, setBaseline] = useState('')

  useEffect(() => {
    if (!sec.data) return
    setLocal({ ...sec.data })
    setBaseline(JSON.stringify(sec.data))
  }, [sec.data])

  const dirty = useMemo(() => (local ? JSON.stringify(local) !== baseline : false), [local, baseline])

  const cancel = useCallback(() => {
    try {
      setLocal(JSON.parse(baseline) as DemoCtaCms)
      toast.push('Changes reverted', 'info')
    } catch {
      /* */
    }
  }, [baseline, toast])

  const save = async () => {
    if (!local) return
    try {
      await sec.save(local as DemoCtaCms & Record<string, unknown>)
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
        Loading demo CTA…
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {sec.error ? <p className="text-sm text-red-700">{sec.error}</p> : null}
      <p className="text-sm text-slate-600">
        Controls the &ldquo;See DigitalManager in Action&rdquo; strip between ERP modules and Powerful Modules.
      </p>

      <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
        <input
          type="checkbox"
          checked={local.enabled !== false}
          onChange={(e) => setLocal({ ...local, enabled: e.target.checked })}
        />
        Section enabled
      </label>

      <BilingualInputs labelEn="Heading (EN)" labelAr="Heading (AR)" value={local.title} onChange={(title) => setLocal({ ...local, title })} />
      <BilingualInputs
        labelEn="Description (EN)"
        labelAr="Description (AR)"
        multiline
        rows={3}
        value={local.description}
        onChange={(description) => setLocal({ ...local, description })}
      />
      <BilingualInputs
        labelEn="Button label (EN)"
        labelAr="Button label (AR)"
        value={local.buttonLabel}
        onChange={(buttonLabel) => setLocal({ ...local, buttonLabel })}
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
