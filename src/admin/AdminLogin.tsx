import { useCallback, useState, type FormEvent } from 'react'
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { adminFetch, setAdminToken } from './adminApi'

export function AdminLogin() {
  const nav = useNavigate()
  const loc = useLocation()
  const [searchParams] = useSearchParams()
  const ret = searchParams.get('return')
  const fromState = (loc.state as { from?: string } | null)?.from
  const from =
    (ret && ret.startsWith('/admin') && ret !== '/admin/login' ? ret : null) ??
    (fromState && fromState.startsWith('/admin') && fromState !== '/admin/login' ? fromState : null) ??
    '/admin'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const onSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault()
      setErr(null)
      setBusy(true)
      try {
        const res = await adminFetch<{ token: string }>('/api/admin/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: email.trim(), password, rememberMe }),
        })
        setAdminToken(res.token)
        nav(from, { replace: true })
      } catch (ex) {
        setErr(ex instanceof Error ? ex.message : 'Invalid email or password.')
      } finally {
        setBusy(false)
      }
    },
    [email, password, rememberMe, nav, from],
  )

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-100 to-slate-200/80">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
        <Link to="/" className="mb-8 text-center text-sm font-semibold text-brand hover:underline">
          ← Back to website
        </Link>
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-900/10">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.2em] text-brand">DigitalManager</p>
          <h1 className="mt-2 text-center text-xl font-bold text-slate-900">CMS Admin</h1>
          <p className="mt-1 text-center text-sm text-slate-600">Sign in to manage content and leads.</p>
          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            {err ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{err}</p> : null}
            <div>
              <label htmlFor="adm-email" className="block text-sm font-semibold text-slate-800">
                Email
              </label>
              <input
                id="adm-email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/25"
                required
              />
            </div>
            <div>
              <label htmlFor="adm-pass" className="block text-sm font-semibold text-slate-800">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  id="adm-pass"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 py-3 pl-4 pr-12 text-slate-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/25"
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPass((v) => !v)}
                >
                  {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="rounded border-slate-300 text-brand focus:ring-brand" />
              Remember me (longer session)
            </label>
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-brand py-3 text-sm font-semibold text-white shadow-md hover:bg-brand-dark disabled:opacity-60"
            >
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
