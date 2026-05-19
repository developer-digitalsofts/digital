import { useCallback, useEffect, useState } from 'react'
import { adminFetch, friendlyAdminApiMessage } from './adminApi'
import { useAdminToast } from './AdminToastContext'

type EmailDoc = {
  enableEmailNotification?: boolean
  receiverEmail?: string
  ccEmail?: string
  bccEmail?: string
  fromEmail?: string
  fromName?: string
  replyToField?: string
  emailSubject?: string
  emailTemplateBody?: string
  _meta?: Record<string, unknown>
}

function normalizeDoc(raw: Record<string, unknown>): EmailDoc {
  return {
    enableEmailNotification: raw.enableEmailNotification === true,
    receiverEmail: String(raw.receiverEmail ?? ''),
    ccEmail: String(raw.ccEmail ?? ''),
    bccEmail: String(raw.bccEmail ?? ''),
    fromEmail: String(raw.fromEmail ?? ''),
    fromName: String(raw.fromName ?? ''),
    replyToField: raw.replyToField === 'customer' ? 'customer' : 'from',
    emailSubject: String(raw.emailSubject ?? ''),
    emailTemplateBody: String(raw.emailTemplateBody ?? ''),
    _meta: raw._meta as EmailDoc['_meta'],
  }
}

export function AdminEmailSettingsPage() {
  const toast = useAdminToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [doc, setDoc] = useState<EmailDoc | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    adminFetch<Record<string, unknown>>('/api/admin/email')
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
      await adminFetch('/api/admin/email', { method: 'PUT', body: JSON.stringify({ ...doc, _meta: doc._meta }) })
      toast.push('Email settings saved', 'success')
      load()
    } catch (e) {
      toast.push(e instanceof Error ? friendlyAdminApiMessage(e.message) : 'Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !doc) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Email settings</h1>
        <p className="text-sm text-slate-600">Loading…</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Email settings</h1>
        <p className="mt-1 text-sm text-slate-600">Contact form notification email (SMTP is configured on the server).</p>
      </div>

      <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
          <span className="text-sm font-semibold text-slate-800">Enable email notifications</span>
          <input
            type="checkbox"
            className="size-5 accent-brand"
            checked={!!doc.enableEmailNotification}
            onChange={(e) => setDoc({ ...doc, enableEmailNotification: e.target.checked })}
          />
        </label>

        <div>
          <label className="text-xs font-semibold text-slate-600">Receiver email</label>
          <input
            type="email"
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
            value={doc.receiverEmail}
            onChange={(e) => setDoc({ ...doc, receiverEmail: e.target.value })}
            placeholder="you@company.com"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600">CC email (optional)</label>
          <input
            type="email"
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
            value={doc.ccEmail}
            onChange={(e) => setDoc({ ...doc, ccEmail: e.target.value })}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600">BCC email (optional)</label>
          <input
            type="email"
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
            value={doc.bccEmail}
            onChange={(e) => setDoc({ ...doc, bccEmail: e.target.value })}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600">From email</label>
          <input
            type="email"
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
            value={doc.fromEmail}
            onChange={(e) => setDoc({ ...doc, fromEmail: e.target.value })}
            placeholder="noreply@company.com"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600">From name</label>
          <input
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
            value={doc.fromName}
            onChange={(e) => setDoc({ ...doc, fromName: e.target.value })}
            placeholder="My Company Website"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600">Reply-To</label>
          <select
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
            value={doc.replyToField}
            onChange={(e) => setDoc({ ...doc, replyToField: e.target.value })}
          >
            <option value="customer">Customer email (submitter)</option>
            <option value="from">From email (site)</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600">Subject</label>
          <input
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
            value={doc.emailSubject}
            onChange={(e) => setDoc({ ...doc, emailSubject: e.target.value })}
            placeholder="New lead from website"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600">Email body template</label>
          <p className="mt-0.5 text-xs text-slate-500">Placeholders: {'{{name}}'} {'{{email}}'} {'{{phone}}'} {'{{topic}}'} {'{{company}}'} {'{{message}}'} {'{{sourcePage}}'}</p>
          <textarea
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 font-mono text-xs outline-none ring-brand/30 focus:ring-2"
            rows={8}
            value={doc.emailTemplateBody}
            onChange={(e) => setDoc({ ...doc, emailTemplateBody: e.target.value })}
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
