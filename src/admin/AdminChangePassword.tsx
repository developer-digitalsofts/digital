import { useCallback, useState, type FormEvent } from 'react'
import { adminFetch } from './adminApi'
import { useAdminToast } from './AdminToastContext'

export function AdminChangePassword() {
  const toast = useAdminToast()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [busy, setBusy] = useState(false)

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      if (newPassword.length < 8) {
        toast.push('New password must be at least 8 characters', 'error')
        return
      }
      if (newPassword !== confirmPassword) {
        toast.push('New password and confirmation do not match', 'error')
        return
      }
      setBusy(true)
      try {
        await adminFetch('/api/admin/me/change-password', {
          method: 'POST',
          body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
        })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        toast.push('Password updated successfully', 'success')
      } catch (err) {
        toast.push(err instanceof Error ? err.message : 'Update failed', 'error')
      } finally {
        setBusy(false)
      }
    },
    [confirmPassword, currentPassword, newPassword, toast],
  )

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Change password</h1>
        <p className="text-sm text-slate-600">Use a strong password you do not reuse elsewhere.</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-semibold text-slate-800" htmlFor="cp-cur">
            Current password
          </label>
          <input
            id="cp-cur"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-800" htmlFor="cp-new">
            New password (min 8 characters)
          </label>
          <input
            id="cp-new"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-800" htmlFor="cp-conf">
            Confirm new password
          </label>
          <input
            id="cp-conf"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={busy}
            className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-brand-dark disabled:opacity-60"
          >
            {busy ? 'Updating…' : 'Update password'}
          </button>
        </div>
      </form>
    </div>
  )
}
