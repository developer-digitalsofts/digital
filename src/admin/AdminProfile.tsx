import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { adminFetch } from './adminApi'
import { useAdminToast } from './AdminToastContext'

export function AdminProfile() {
  const toast = useAdminToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [profileImageUrl, setProfileImageUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    adminFetch<{ user: { name: string; email: string; profileImageUrl: string } }>('/api/admin/me')
      .then((r) => {
        setName(r.user.name || '')
        setEmail(r.user.email)
        setProfileImageUrl(r.user.profileImageUrl || '')
      })
      .catch((e: Error) => toast.push(e.message, 'error'))
      .finally(() => setLoading(false))
  }, [toast])

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      setSaving(true)
      try {
        await adminFetch('/api/admin/me/profile', {
          method: 'PATCH',
          body: JSON.stringify({ name: name.trim(), profileImageUrl: profileImageUrl.trim() }),
        })
        toast.push('Profile saved', 'success')
      } catch (err) {
        toast.push(err instanceof Error ? err.message : 'Save failed', 'error')
      } finally {
        setSaving(false)
      }
    },
    [name, profileImageUrl, toast],
  )

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <span className="size-4 animate-spin rounded-full border-2 border-brand border-t-transparent" aria-hidden />
        Loading…
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin profile</h1>
        <p className="text-sm text-slate-600">Your display name and optional avatar URL.</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-semibold text-slate-800" htmlFor="pf-name">
            Name
          </label>
          <input
            id="pf-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            maxLength={120}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-800" htmlFor="pf-email">
            Email
          </label>
          <input id="pf-email" value={email} readOnly className="mt-1 w-full cursor-not-allowed rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-600" />
          <p className="mt-1 text-xs text-slate-500">Email is managed in users data; contact your developer to change it.</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-800" htmlFor="pf-img">
            Profile image URL
          </label>
          <input
            id="pf-img"
            value={profileImageUrl}
            onChange={(e) => setProfileImageUrl(e.target.value)}
            placeholder="https://… or /uploads/…"
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <div className="sticky bottom-0 flex justify-end border-t border-slate-100 bg-white pt-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-brand-dark disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save profile'}
          </button>
        </div>
      </form>
    </div>
  )
}
