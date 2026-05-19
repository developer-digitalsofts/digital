import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChevronDown, ExternalLink, LogOut, Menu, X } from 'lucide-react'
import { getAdminToken, setAdminToken, adminFetch } from './adminApi'
import { ADMIN_NAV_GROUPS, getAdminPageTitle, type NavGroup } from './adminNavConfig'

function groupContainsPath(group: NavGroup, pathname: string): boolean {
  return group.children.some((c) => (c.end ? pathname === c.to : pathname === c.to || pathname.startsWith(`${c.to}/`)))
}

function initialOpenState(pathname: string): Record<string, boolean> {
  const o: Record<string, boolean> = {}
  for (const g of ADMIN_NAV_GROUPS) {
    o[g.id] = groupContainsPath(g, pathname)
  }
  return o
}

export function AdminLayout() {
  const loc = useLocation()
  const [me, setMe] = useState<{ email: string; name: string } | null>(null)
  const [mobileNav, setMobileNav] = useState(false)
  const [open, setOpen] = useState<Record<string, boolean>>(() => initialOpenState(loc.pathname))

  useEffect(() => {
    if (!getAdminToken()) return
    adminFetch<{ user: { email: string; name: string } }>('/api/admin/me')
      .then((r) => setMe(r.user))
      .catch(() => setMe(null))
  }, [])

  useEffect(() => {
    setOpen((prev) => {
      const next = { ...prev }
      for (const g of ADMIN_NAV_GROUPS) {
        if (groupContainsPath(g, loc.pathname)) next[g.id] = true
      }
      return next
    })
  }, [loc.pathname])

  if (!getAdminToken()) return <Navigate to="/admin/login" replace state={{ from: loc.pathname }} />

  const title = useMemo(() => getAdminPageTitle(loc.pathname), [loc.pathname])

  const signOut = async () => {
    try {
      await adminFetch('/api/admin/auth/logout', { method: 'POST' })
    } catch {
      /* still sign out locally */
    }
    setAdminToken(null)
    window.location.href = '/admin/login'
  }

  const toggle = useCallback((id: string) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }))
  }, [])

  const childClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-lg py-2 pl-9 pr-2 text-[13px] font-semibold transition-colors ${
      isActive ? 'bg-brand text-white shadow-sm' : 'text-slate-700 hover:bg-orange-100/80 hover:text-slate-900'
    }`

  const dashOnly = ADMIN_NAV_GROUPS.filter((g) => g.id === 'dashboard')
  const grouped = ADMIN_NAV_GROUPS.filter((g) => g.id !== 'dashboard')

  const renderNav = (onNavigate?: () => void) => (
    <div className="space-y-1">
      {dashOnly.map((group) => {
        const c = group.children[0]
        return (
          <NavLink
            key={c.to}
            to={c.to}
            end={Boolean(c.end)}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${
                isActive ? 'bg-brand text-white shadow-md shadow-orange-900/15' : 'text-slate-800 hover:bg-orange-100/90'
              }`
            }
          >
            <group.icon className="size-4 shrink-0 opacity-90" strokeWidth={1.75} aria-hidden />
            {c.label}
          </NavLink>
        )
      })}

      {grouped.map((group) => {
        const Icon = group.icon
        const expanded = open[group.id] ?? false
        const childActive = groupContainsPath(group, loc.pathname)
        return (
          <div key={group.id} className="rounded-xl border border-orange-200/40 bg-white/40">
            <button
              type="button"
              onClick={() => toggle(group.id)}
              className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition-colors ${
                childActive ? 'bg-orange-100/70 text-slate-900' : 'text-slate-700 hover:bg-orange-100/50'
              }`}
              aria-expanded={expanded}
            >
              <span className="flex min-w-0 items-center gap-2">
                <Icon className="size-4 shrink-0 text-brand" strokeWidth={1.75} aria-hidden />
                <span className="truncate">{group.label}</span>
              </span>
              <ChevronDown
                className={`size-4 shrink-0 text-slate-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
                aria-hidden
              />
            </button>
            {expanded ? (
              <nav className="border-t border-orange-100/80 pb-1 pt-0.5">
                {group.children.map((c) => (
                  <NavLink key={c.to} to={c.to} end={Boolean(c.end)} onClick={onNavigate} className={childClass}>
                    {c.label}
                  </NavLink>
                ))}
              </nav>
            ) : null}
          </div>
        )
      })}
    </div>
  )

  return (
    <div className="flex min-h-screen bg-[#f4f6f8] text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-[120] hidden w-[16.5rem] flex-col border-r border-orange-200/80 bg-gradient-to-b from-[#fff7ed] to-[#ffedd5] shadow-sm md:flex">
        <div className="border-b border-orange-200/80 px-4 py-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">DigitalManager</p>
          <p className="mt-0.5 text-base font-bold leading-tight text-slate-900">Website CMS</p>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-3">{renderNav()}</nav>
        <div className="mt-auto border-t border-orange-200/80 bg-[#fff7ed]/90 p-2">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-bold text-white shadow-md transition-colors hover:bg-slate-800"
            onClick={signOut}
          >
            <LogOut className="size-4 shrink-0" aria-hidden />
            Log out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col md:pl-[16.5rem]">
        <header className="sticky top-0 z-[110] flex min-h-14 flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-3 py-2 shadow-sm sm:px-4">
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
          <div className="flex w-full shrink-0 flex-wrap items-center justify-end gap-2 sm:w-auto sm:gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:border-brand hover:text-brand sm:text-sm"
            >
              <ExternalLink className="size-3.5 shrink-0" aria-hidden />
              View website
            </a>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:border-red-200 hover:text-red-700 sm:text-sm"
            >
              <LogOut className="size-3.5 shrink-0" aria-hidden />
              <span className="hidden sm:inline">Log out</span>
            </button>
            <div className="order-last flex w-full min-w-0 justify-end text-right text-[11px] leading-tight text-slate-600 sm:order-none sm:w-auto sm:max-w-[10rem] lg:max-w-[12rem]">
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-900">{me?.name || 'Admin'}</p>
                <p className="truncate">{me?.email}</p>
              </div>
            </div>
          </div>
        </header>

        {mobileNav ? (
          <div className="max-h-[min(75vh,520px)] overflow-y-auto border-b border-orange-200/80 bg-gradient-to-b from-[#fff7ed] to-[#ffedd5] px-2 py-3 md:hidden">
            {renderNav(() => setMobileNav(false))}
            <button
              type="button"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-sm font-bold text-white"
              onClick={() => {
                setMobileNav(false)
                void signOut()
              }}
            >
              <LogOut className="size-4" aria-hidden />
              Log out
            </button>
          </div>
        ) : null}

        <main className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
