import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { KeyRound, Pencil, Plus, Shield, User } from 'lucide-react'
import { adminFetch } from './adminApi'
import { useAdminToast } from './AdminToastContext'
import { PasswordInput } from './cms/PasswordInput'

type AdminUserRow = {
  id: string
  email: string
  name: string
  role: string
  status: 'Active' | 'Inactive'
}

type MeUser = {
  id: string
  email: string
  name: string
  role: string
}

const ROLES = ['Super Admin', 'Admin', 'Editor'] as const

function isSuperAdmin(role: string) {
  return role.trim().toLowerCase() === 'super admin'
}

type UserFormState = {
  name: string
  email: string
  role: (typeof ROLES)[number]
  status: 'Active' | 'Inactive'
  password: string
  confirmPassword: string
}

const emptyUserForm = (): UserFormState => ({
  name: '',
  email: '',
  role: 'Admin',
  status: 'Active',
  password: '',
  confirmPassword: '',
})

export function AdminUsers() {
  const toast = useAdminToast()
  const [me, setMe] = useState<MeUser | null>(null)
  const [meLoading, setMeLoading] = useState(true)
  const [rows, setRows] = useState<AdminUserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [userModal, setUserModal] = useState<'add' | 'edit' | null>(null)
  const [editTarget, setEditTarget] = useState<AdminUserRow | null>(null)
  const [userForm, setUserForm] = useState<UserFormState>(emptyUserForm)
  const [userSaving, setUserSaving] = useState(false)
  const [userFormError, setUserFormError] = useState<string | null>(null)

  const [resetTarget, setResetTarget] = useState<AdminUserRow | null>(null)
  const [resetPassword, setResetPassword] = useState('')
  const [resetConfirm, setResetConfirm] = useState('')
  const [resetBusy, setResetBusy] = useState(false)
  const [resetError, setResetError] = useState<string | null>(null)

  const loadUsers = useCallback(() => {
    setLoading(true)
    setError(null)
    adminFetch<AdminUserRow[]>('/api/admin/users')
      .then(setRows)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    adminFetch<{ user: MeUser }>('/api/admin/me')
      .then((r) => setMe(r.user))
      .catch((e: Error) => toast.push(e.message, 'error'))
      .finally(() => setMeLoading(false))
  }, [toast])

  useEffect(() => {
    if (me && isSuperAdmin(me.role)) loadUsers()
  }, [me, loadUsers])

  const openAdd = () => {
    setUserForm(emptyUserForm())
    setUserFormError(null)
    setEditTarget(null)
    setUserModal('add')
  }

  const openEdit = (row: AdminUserRow) => {
    setEditTarget(row)
    setUserForm({
      name: row.name,
      email: row.email,
      role: ROLES.includes(row.role as (typeof ROLES)[number]) ? (row.role as (typeof ROLES)[number]) : 'Admin',
      status: row.status,
      password: '',
      confirmPassword: '',
    })
    setUserFormError(null)
    setUserModal('edit')
  }

  const closeUserModal = () => {
    setUserModal(null)
    setEditTarget(null)
    setUserFormError(null)
  }

  const saveUser = async (e: FormEvent) => {
    e.preventDefault()
    setUserFormError(null)

    if (!userForm.email.trim().includes('@')) {
      setUserFormError('Valid email is required')
      return
    }
    if (userModal === 'add') {
      if (userForm.password.length < 8) {
        setUserFormError('Password must be at least 8 characters')
        return
      }
      if (userForm.password !== userForm.confirmPassword) {
        setUserFormError('Passwords do not match')
        return
      }
    }

    setUserSaving(true)
    try {
      if (userModal === 'add') {
        await adminFetch('/api/admin/users', {
          method: 'POST',
          body: JSON.stringify({
            name: userForm.name.trim(),
            email: userForm.email.trim(),
            role: userForm.role,
            password: userForm.password,
            confirmPassword: userForm.confirmPassword,
          }),
        })
        toast.push('User created successfully', 'success')
      } else if (userModal === 'edit' && editTarget) {
        await adminFetch(`/api/admin/users/${editTarget.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            name: userForm.name.trim(),
            email: userForm.email.trim(),
            role: userForm.role,
            status: userForm.status,
          }),
        })
        toast.push('User updated successfully', 'success')
      }
      closeUserModal()
      loadUsers()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Save failed'
      setUserFormError(msg)
      toast.push(msg, 'error')
    } finally {
      setUserSaving(false)
    }
  }

  const submitReset = async (e: FormEvent) => {
    e.preventDefault()
    if (!resetTarget) return
    setResetError(null)

    if (resetPassword.length < 8) {
      setResetError('Password must be at least 8 characters')
      return
    }
    if (resetPassword !== resetConfirm) {
      setResetError('Passwords do not match')
      return
    }

    setResetBusy(true)
    try {
      await adminFetch(`/api/admin/users/${resetTarget.id}/reset-password`, {
        method: 'POST',
        body: JSON.stringify({ newPassword: resetPassword, confirmPassword: resetConfirm }),
      })
      toast.push('Password reset successfully', 'success')
      setResetTarget(null)
      setResetPassword('')
      setResetConfirm('')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Reset failed'
      setResetError(msg)
      toast.push(msg, 'error')
    } finally {
      setResetBusy(false)
    }
  }

  if (meLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center rounded-xl border border-slate-200 bg-white">
        <span className="size-8 animate-spin rounded-full border-2 border-brand border-t-transparent" aria-hidden />
      </div>
    )
  }

  if (!me || !isSuperAdmin(me.role)) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
        <Shield className="mx-auto size-8 text-amber-700" aria-hidden />
        <h2 className="mt-3 text-lg font-bold text-amber-950">Super Admin access required</h2>
        <p className="mt-2 text-sm text-amber-900/90">Only Super Admin users can manage accounts and reset passwords.</p>
        <p className="mt-4 text-sm text-amber-900/90">
          You can change your own password from{' '}
          <a href="/admin/profile#change-password" className="font-semibold text-brand hover:underline">
            Admin Profile
          </a>
          .
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center rounded-xl border border-slate-200 bg-white">
        <span className="size-8 animate-spin rounded-full border-2 border-brand border-t-transparent" aria-hidden />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm font-semibold text-red-800">{error}</p>
        <button type="button" onClick={loadUsers} className="mt-4 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Users / Access</h1>
          <p className="mt-1 text-sm text-slate-600">Manage admin accounts, roles, and passwords.</p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-brand-dark"
        >
          <Plus className="size-4" aria-hidden />
          Add user
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                    No admin users found.
                  </td>
                </tr>
              ) : (
                rows.map((u) => (
                  <tr key={u.id} className="border-b border-slate-50 last:border-0">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      <span className="inline-flex items-center gap-2">
                        <User className="size-4 text-brand" aria-hidden />
                        {u.name || '—'}
                        {u.id === me.id ? <span className="text-[10px] font-bold uppercase text-slate-400">(you)</span> : null}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#141d38]/8 px-2.5 py-0.5 text-xs font-semibold text-[#141d38]">
                        <Shield className="size-3" aria-hidden />
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          u.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(u)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-800 hover:border-brand hover:text-brand"
                        >
                          <Pencil className="size-3.5" aria-hidden />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setResetTarget(u)
                            setResetPassword('')
                            setResetConfirm('')
                            setResetError(null)
                          }}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-800 hover:border-brand hover:text-brand"
                        >
                          <KeyRound className="size-3.5" aria-hidden />
                          Reset password
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {userModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button type="button" className="absolute inset-0 bg-slate-900/50" aria-label="Close" onClick={closeUserModal} />
          <form
            onSubmit={saveUser}
            className="relative z-10 w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
          >
            <h2 className="text-lg font-bold text-slate-900">{userModal === 'add' ? 'Add user' : 'Edit user'}</h2>
            {userFormError ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{userFormError}</p>
            ) : null}
            <div>
              <label className="block text-sm font-semibold text-slate-800">Name</label>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                value={userForm.name}
                onChange={(e) => setUserForm((f) => ({ ...f, name: e.target.value }))}
                maxLength={120}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800">Email</label>
              <input
                type="email"
                required
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                value={userForm.email}
                onChange={(e) => setUserForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800">Role</label>
              <select
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                value={userForm.role}
                onChange={(e) => setUserForm((f) => ({ ...f, role: e.target.value as (typeof ROLES)[number] }))}
                disabled={userModal === 'edit' && editTarget?.id === me.id}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            {userModal === 'edit' ? (
              <div>
                <label className="block text-sm font-semibold text-slate-800">Status</label>
                <select
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  value={userForm.status}
                  onChange={(e) => setUserForm((f) => ({ ...f, status: e.target.value as 'Active' | 'Inactive' }))}
                  disabled={editTarget?.id === me.id}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-semibold text-slate-800">Password</label>
                  <PasswordInput
                    required
                    minLength={8}
                    value={userForm.password}
                    onChange={(e) => setUserForm((f) => ({ ...f, password: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800">Confirm password</label>
                  <PasswordInput
                    required
                    value={userForm.confirmPassword}
                    onChange={(e) => setUserForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                  />
                </div>
              </>
            )}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={closeUserModal}
                disabled={userSaving}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={userSaving}
                className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
              >
                {userSaving ? 'Saving…' : userModal === 'add' ? 'Create user' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {resetTarget ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/50"
            aria-label="Close"
            onClick={() => setResetTarget(null)}
          />
          <form
            onSubmit={submitReset}
            className="relative z-10 w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
          >
            <h2 className="text-lg font-bold text-slate-900">Reset password</h2>
            <p className="text-sm text-slate-600">
              Set a new password for <strong className="font-semibold text-slate-900">{resetTarget.email}</strong>.
            </p>
            {resetError ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{resetError}</p>
            ) : null}
            <div>
              <label className="block text-sm font-semibold text-slate-800">New password</label>
              <PasswordInput required minLength={8} value={resetPassword} onChange={(e) => setResetPassword(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-800">Confirm password</label>
              <PasswordInput required value={resetConfirm} onChange={(e) => setResetConfirm(e.target.value)} />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setResetTarget(null)}
                disabled={resetBusy}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={resetBusy}
                className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
              >
                {resetBusy ? 'Resetting…' : 'Reset password'}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  )
}
