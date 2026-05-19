import { useCallback, useEffect, useState } from 'react'
import { adminFetch, friendlyAdminApiMessage } from './adminApi'
import { useAdminToast } from './AdminToastContext'

type Bilingual = { en: string; ar: string }

type WaDoc = {
  show?: boolean
  active?: boolean
  phoneDigits?: string
  defaultMessage?: Bilingual
  position?: string
  buttonLabel?: Bilingual
  _meta?: Record<string, unknown>
}

function normBi(v: unknown): Bilingual {
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    const b = v as Record<string, unknown>
    return { en: String(b.en ?? ''), ar: String(b.ar ?? '') }
  }
  return { en: '', ar: '' }
}

function normalizeDoc(raw: Record<string, unknown>): WaDoc {
  return {
    show: raw.show !== false,
    active: raw.active !== false,
    phoneDigits: String(raw.phoneDigits ?? '').replace(/\D/g, ''),
    defaultMessage: normBi(raw.defaultMessage),
    position: String(raw.position || 'bottom-right') === 'bottom-left' ? 'bottom-left' : 'bottom-right',
    buttonLabel: normBi(raw.buttonLabel),
    _meta: raw._meta as WaDoc['_meta'],
  }
}

export function AdminWhatsAppPage() {
  const toast = useAdminToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [doc, setDoc] = useState<WaDoc | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    adminFetch<Record<string, unknown>>('/api/admin/whatsapp')
      .then((raw) => setDoc(normalizeDoc(raw)))
      .catch((e: Error) => {
        toast.push(friendlyAdminApiMessage(e.message), 'error')
        setDoc(normalizeDoc({}))
      })
      .finally(() => setLoading(false))
  }, [toast])

  useEffect(() => {
    load()
  }, [load])

  const save = async () => {
    if (!doc) return
    setSaving(true)
    try {
      const payload = {
        ...doc,
        phoneDigits: (doc.phoneDigits ?? '').replace(/\D/g, ''),
        show: doc.show,
        active: doc.active,
        defaultMessage: { en: doc.defaultMessage?.en ?? '', ar: doc.defaultMessage?.ar ?? '' },
        buttonLabel: { en: doc.buttonLabel?.en ?? '', ar: doc.buttonLabel?.ar ?? '' },
        position: doc.position,
        _meta: doc._meta,
      }
      await adminFetch('/api/admin/whatsapp', { method: 'PUT', body: JSON.stringify(payload) })
      toast.push('WhatsApp settings saved', 'success')
      load()
    } catch (e) {
      toast.push(e instanceof Error ? friendlyAdminApiMessage(e.message) : 'Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  const enabled = doc ? doc.show !== false && doc.active !== false : false

  const setEnabled = (on: boolean) => {
    if (!doc) return
    setDoc({ ...doc, show: on, active: on })
  }

  if (loading || !doc) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">WhatsApp</h1>
        <p className="text-sm text-slate-600">Loading…</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">WhatsApp</h1>
        <p className="mt-1 text-sm text-slate-600">Floating chat button on the public site.</p>
      </div>

      <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
          <span className="text-sm font-semibold text-slate-800">Enable WhatsApp button</span>
          <input type="checkbox" className="size-5 accent-brand" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
        </label>

        <div>
          <label className="text-xs font-semibold text-slate-600">WhatsApp number (digits only, country code included)</label>
          <input
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
            value={doc.phoneDigits ?? ''}
            onChange={(e) => setDoc({ ...doc, phoneDigits: e.target.value.replace(/\D/g, '') })}
            placeholder="9715xxxxxxxx"
            inputMode="numeric"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600">Default message (English)</label>
          <textarea
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
            rows={3}
            value={doc.defaultMessage?.en ?? ''}
            onChange={(e) =>
              setDoc({
                ...doc,
                defaultMessage: { en: e.target.value, ar: doc.defaultMessage?.ar ?? '' },
              })
            }
            placeholder="Hello, I want to know more about your services."
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600">Default message (Arabic, optional)</label>
          <textarea
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
            rows={3}
            value={doc.defaultMessage?.ar ?? ''}
            onChange={(e) =>
              setDoc({
                ...doc,
                defaultMessage: { en: doc.defaultMessage?.en ?? '', ar: e.target.value },
              })
            }
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600">Button position</label>
          <select
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
            value={doc.position ?? 'bottom-right'}
            onChange={(e) => setDoc({ ...doc, position: e.target.value })}
          >
            <option value="bottom-right">Bottom right</option>
            <option value="bottom-left">Bottom left</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600">Button label (English, optional)</label>
          <input
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
            value={doc.buttonLabel?.en ?? ''}
            onChange={(e) =>
              setDoc({
                ...doc,
                buttonLabel: { en: e.target.value, ar: doc.buttonLabel?.ar ?? '' },
              })
            }
            placeholder="WhatsApp"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600">Button label (Arabic, optional)</label>
          <input
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
            value={doc.buttonLabel?.ar ?? ''}
            onChange={(e) =>
              setDoc({
                ...doc,
                buttonLabel: { en: doc.buttonLabel?.en ?? '', ar: e.target.value },
              })
            }
            placeholder="واتساب"
          />
        </div>

        <div className="flex justify-end border-t border-slate-100 pt-4">
          <button
            type="button"
            disabled={saving}
            onClick={() => void save()}
            className="rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:opacity-95 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
