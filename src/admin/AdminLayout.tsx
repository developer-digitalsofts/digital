import { Link, Outlet, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { ExternalLink, LogOut, Menu, X } from 'lucide-react'
import { getAdminToken, setAdminToken, adminFetch } from './adminApi'
import { ADMIN_LOGOUT_ITEM, ADMIN_NAV_ITEMS, getAdminPageTitle, isAdminNavActive } from './adminNavConfig'
import { AdminSidebarBrand } from './AdminSidebarBrand'
import { interceptPublicHashLinksInAdmin } from './adminHomeHashGuard'

export function AdminLayout() {
  const loc = useLocation()
  const navigate = useNavigate()
  const [me, setMe] = useState<{ email: string; name: string } | null>(null)
  const [mobileNav, setMobileNav] = useState(false)

  useEffect(() => {
    if (!getAdminToken()) return
    adminFetch<{ user: { email: string; name: string } }>('/api/admin/me')
      .then((r) => setMe(r.user))
      .catch(() => setMe(null))
  }, [])

  useEffect(() => {
    if (!loc.pathname.startsWith('/admin') || !loc.hash) return
    navigate({ pathname: loc.pathname, search: loc.search, hash: '' }, { replace: true })
  }, [loc.pathname, loc.hash, loc.search, navigate])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!loc.pathname.startsWith('/admin')) return
      interceptPublicHashLinksInAdmin(e, navigate, loc.pathname)
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [loc.pathname, navigate])

  if (!getAdminToken()) return <Navigate to="/admin/login" replace state={{ from: loc.pathname }} />

  const title = useMemo(() => getAdminPageTitle(loc.pathname, loc.search), [loc.pathname, loc.search])

  const signOut = async () => {
    try {
      await adminFetch('/api/admin/auth/logout', { method: 'POST' })
    } catch {
      /* still sign out locally */
    }
    setAdminToken(null)
    window.location.href = '/admin/login'
  }

  const renderNav = (onNavigate?: () => void) => (
    <nav className="space-y-0.5">
      {ADMIN_NAV_ITEMS.map((item) => {
        const Icon = item.icon
        const to = item.to
        const active = isAdminNavActive(loc.pathname, loc.search, item)
        return (
          <Link
            key={item.id}
            to={to}
            aria-current={active ? 'page' : undefined}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold transition-colors ${
              active ? 'bg-brand text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon className="size-[1.125rem] shrink-0 opacity-90" strokeWidth={1.75} aria-hidden />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )

  return (
    <div className="flex min-h-screen bg-[#f4f6f8] text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-[120] hidden w-[15.5rem] flex-col bg-[#141d38] md:flex">
        <div className="border-b border-white/10 bg-transparent px-4 py-4">
          <AdminSidebarBrand />
        </div>
        <div className="flex-1 overflow-y-auto px-2.5 py-3">{renderNav()}</div>
        <div className="border-t border-white/10 p-2.5">
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            onClick={() => void signOut()}
          >
            <ADMIN_LOGOUT_ITEM.icon className="size-[1.125rem] shrink-0" strokeWidth={1.75} aria-hidden />
            {ADMIN_LOGOUT_ITEM.label}
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col md:pl-[15.5rem]">
        <header className="sticky top-0 z-[110] flex min-h-14 items-center justify-between gap-3 border-b border-slate-200 bg-white px-3 sm:px-5">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
              aria-label="Menu"
              onClick={() => setMobileNav((v) => !v)}
            >
              {mobileNav ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
            <h1 className="truncate text-base font-bold text-slate-900">{title}</h1>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:border-brand hover:text-brand sm:inline-flex sm:text-sm"
            >
              <ExternalLink className="size-3.5 shrink-0" aria-hidden />
              View website
            </a>
            <div className="hidden text-right text-[11px] leading-tight text-slate-600 sm:block">
              <p className="font-semibold text-slate-900">{me?.name || 'Admin'}</p>
              <p className="max-w-[11rem] truncate">{me?.email}</p>
            </div>
          </div>
        </header>

        {mobileNav ? (
          <div className="max-h-[min(75vh,520px)] overflow-y-auto border-b border-white/10 bg-[#141d38] px-2.5 py-3 md:hidden">
            {renderNav(() => setMobileNav(false))}
            <button
              type="button"
              className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-semibold text-slate-300 hover:bg-white/10 hover:text-white"
              onClick={() => {
                setMobileNav(false)
                void signOut()
              }}
            >
              <LogOut className="size-[1.125rem] shrink-0" aria-hidden />
              Logout
            </button>
          </div>
        ) : null}

        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
