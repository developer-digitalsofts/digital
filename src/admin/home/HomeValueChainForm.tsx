import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Bilingual } from '../../cms/types'
import type { ErpModulesHeaderCms } from '../../types/homepageCms'
import { useAdminSection } from '../hooks/useAdminSection'
import { useAdminToast } from '../AdminToastContext'
import { BilingualInputs } from '../cms/BilingualInputs'
import { AdminFormActions } from '../cms/AdminFormActions'

export function HomeValueChainForm() {
  const toast = useAdminToast()
  const sec = useAdminSection<ErpModulesHeaderCms>('valueChain')
  const [local, setLocal] = useState<ErpModulesHeaderCms | null>(null)
  const [baseline, setBaseline] = useState('')

  useEffect(() => {
    if (!sec.data) return
    setLocal({ ...sec.data })
    setBaseline(JSON.stringify(sec.data))
  }, [sec.data])

  const dirty = useMemo(() => (local ? JSON.stringify(local) !== baseline : false), [local, baseline])

  const cancel = useCallback(() => {
    try {
      setLocal(JSON.parse(baseline) as ErpModulesHeaderCms)
      toast.push('Changes reverted', 'info')
    } catch {
      /* */
    }
  }, [baseline, toast])

  const save = async () => {
    if (!local) return
    try {
      await sec.save(local as ErpModulesHeaderCms & Record<string, unknown>)
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
        Loading ERP section header…
      </div>
    )
  }

  const deprecatedCount = Array.isArray(local._deprecatedCards) ? local._deprecatedCards.length : 0

  return (
    <div className="space-y-6">
      {sec.error ? <p className="text-sm text-red-700">{sec.error}</p> : null}
      <p className="text-sm text-slate-600">
        Edit the eyebrow and heading for &ldquo;One Platform — Every Business Function&rdquo;. Module cards and previews are defined by the approved frontend layout.
      </p>

      <BilingualInputs
        labelEn="Eyebrow (EN)"
        labelAr="Eyebrow (AR)"
        value={local.eyebrow ?? ({ en: '', ar: '' } as Bilingual)}
        onChange={(eyebrow) => setLocal({ ...local, eyebrow })}
      />
      <BilingualInputs
        labelEn="Section title (EN)"
        labelAr="Section title (AR)"
        value={local.title ?? ({ en: '', ar: '' } as Bilingual)}
        onChange={(title) => setLocal({ ...local, title })}
      />

      {deprecatedCount > 0 ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
          {deprecatedCount} legacy feature card{deprecatedCount === 1 ? '' : 's'} archived in this file for rollback. They are no longer rendered on the homepage.
        </p>
      ) : null}

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
