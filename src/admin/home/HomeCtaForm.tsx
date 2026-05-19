import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Bilingual } from '../../cms/types'
import { useAdminSection } from '../hooks/useAdminSection'
import { useAdminToast } from '../AdminToastContext'
import { BilingualInputs } from '../cms/BilingualInputs'
import { AdminFormActions } from '../cms/AdminFormActions'

type Btn = { label: Bilingual; href: string }

type CtaDoc = {
  title: Bilingual
  paragraph: Bilingual
  primary: Btn
  secondary: Btn
  whatsapp: Btn
  _meta?: Record<string, unknown>
}

export function HomeCtaForm() {
  const toast = useAdminToast()
  const sec = useAdminSection<CtaDoc>('cta')
  const [local, setLocal] = useState<CtaDoc | null>(null)
  const [baseline, setBaseline] = useState('')

  useEffect(() => {
    if (!sec.data) return
    setLocal({ ...sec.data })
    setBaseline(JSON.stringify(sec.data))
  }, [sec.data])

  const dirty = useMemo(() => (local ? JSON.stringify(local) !== baseline : false), [local, baseline])

  const cancel = useCallback(() => {
    try {
      setLocal(JSON.parse(baseline) as CtaDoc)
      toast.push('Changes reverted', 'info')
    } catch {
      /* */
    }
  }, [baseline, toast])

  const save = async () => {
    if (!local) return
    try {
      await sec.save(local as CtaDoc & Record<string, unknown>)
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

      <h3 className="text-sm font-bold text-slate-900">Primary button</h3>
      <BilingualInputs
        labelEn="Label (EN)"
        labelAr="Label (AR)"
        value={local.primary.label}
        onChange={(label) => setLocal({ ...local, primary: { ...local.primary, label } })}
      />
      <label className="block text-sm">
        <span className="font-semibold text-slate-800">Link</span>
        <input
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
          value={local.primary.href}
          onChange={(e) => setLocal({ ...local, primary: { ...local.primary, href: e.target.value } })}
        />
      </label>

      <h3 className="text-sm font-bold text-slate-900">Secondary button</h3>
      <BilingualInputs
        labelEn="Label (EN)"
        labelAr="Label (AR)"
        value={local.secondary.label}
        onChange={(label) => setLocal({ ...local, secondary: { ...local.secondary, label } })}
      />
      <label className="block text-sm">
        <span className="font-semibold text-slate-800">Link</span>
        <input
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
          value={local.secondary.href}
          onChange={(e) => setLocal({ ...local, secondary: { ...local.secondary, href: e.target.value } })}
        />
      </label>

      <h3 className="text-sm font-bold text-slate-900">WhatsApp button</h3>
      <BilingualInputs
        labelEn="Label (EN)"
        labelAr="Label (AR)"
        value={local.whatsapp.label}
        onChange={(label) => setLocal({ ...local, whatsapp: { ...local.whatsapp, label } })}
      />
      <label className="block text-sm">
        <span className="font-semibold text-slate-800">Link</span>
        <input
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
          value={local.whatsapp.href}
          onChange={(e) => setLocal({ ...local, whatsapp: { ...local.whatsapp, href: e.target.value } })}
        />
      </label>

      <AdminFormActions saving={sec.saving} onSave={save} onCancel={cancel} disableSave={!dirty} />
    </div>
  )
}
