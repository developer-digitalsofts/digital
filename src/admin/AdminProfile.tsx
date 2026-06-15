import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { adminFetch } from './adminApi'
import { useAdminToast } from './AdminToastContext'
import { PasswordInput } from './cms/PasswordInput'

export function AdminProfile() {
  const toast = useAdminToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [profileImageUrl, setProfileImageUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordBusy, setPasswordBusy] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordSuccess, setPasswordSuccess] = useState(false)

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

  const onSubmitProfile = useCallback(
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

  const onSubmitPassword = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      setPasswordError(null)
      setPasswordSuccess(false)

      if (!currentPassword.trim()) {
        setPasswordError('Current password is required')
        return
      }
      if (newPassword.length < 8) {
        setPasswordError('New password must be at least 8 characters')
        return
      }
      if (newPassword !== confirmPassword) {
        setPasswordError('New password and confirmation do not match')
        return
      }

      setPasswordBusy(true)
      try {
        await adminFetch('/api/admin/profile/change-password', {
          method: 'POST',
          body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
        })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setPasswordSuccess(true)
        toast.push('Password updated successfully', 'success')
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Update failed'
        setPasswordError(msg)
        toast.push(msg, 'error')
      } finally {
        setPasswordBusy(false)
      }
    },
    [confirmPassword, currentPassword, newPassword, toast],
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
        <p className="text-sm text-slate-600">Your display name, avatar, and account password.</p>
      </div>

      <form onSubmit={onSubmitProfile} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-900">Profile details</h2>
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
          <p className="mt-1 text-xs text-slate-500">Email is managed under Users / Access by a Super Admin.</p>
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
        <div className="flex justify-end border-t border-slate-100 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-brand-dark disabled:opacity-60"
          >
            {saving ? 'Saving…' : 'Save profile'}
          </button>
        </div>
      </form>

      <form
        id="change-password"
        onSubmit={onSubmitPassword}
        className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-base font-bold text-slate-900">Change password</h2>
        <p className="text-sm text-slate-600">Use a strong password you do not reuse elsewhere.</p>

        {passwordError ? (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
            {passwordError}
          </p>
        ) : null}
        {passwordSuccess ? (
          <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900" role="status">
            Password updated successfully
          </p>
        ) : null}

        <div>
          <label className="block text-sm font-semibold text-slate-800" htmlFor="cp-cur">
            Current password
          </label>
          <PasswordInput
            id="cp-cur"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-800" htmlFor="cp-new">
            New password
          </label>
          <PasswordInput
            id="cp-new"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
          />
          <p className="mt-1 text-xs text-slate-500">Minimum 8 characters</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-800" htmlFor="cp-conf">
            Confirm new password
          </label>
          <PasswordInput
            id="cp-conf"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex justify-end border-t border-slate-100 pt-4">
          <button
            type="submit"
            disabled={passwordBusy}
            className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-brand-dark disabled:opacity-60"
          >
            {passwordBusy ? 'Updating…' : 'Update password'}
          </button>
        </div>
      </form>
    </div>
  )
}
