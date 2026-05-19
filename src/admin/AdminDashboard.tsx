import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  CheckCircle2,
  Database,
  FileText,
  HardDrive,
  HelpCircle,
  ImageIcon,
  LayoutGrid,
  LayoutList,
  Layers,
  MessageSquare,
  PanelTop,
  Search,
  Server,
  Sparkles,
  Users,
  Wifi,
} from 'lucide-react'
import { apiBase } from '../cms/api'
import { loadDashboardSummary, type ContentBadge, type DashboardLoadSource, type DashboardSummary } from './loadDashboardData'

function StatusBadge({ kind }: { kind: ContentBadge }) {
  const map: Record<ContentBadge, { className: string; label: string }> = {
    complete: { className: 'bg-emerald-50 text-emerald-800 ring-emerald-200', label: 'Complete' },
    missing: { className: 'bg-amber-50 text-amber-900 ring-amber-200', label: 'Missing' },
    active: { className: 'bg-sky-50 text-sky-900 ring-sky-200', label: 'Active' },
    inactive: { className: 'bg-slate-100 text-slate-700 ring-slate-200', label: 'Inactive' },
  }
  const b = map[kind]
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset ${b.className}`}
    >
      {b.label}
    </span>
  )
}

function activityTitle(a: DashboardSummary['recentActivity'][number]): string {
  const d = (a.description || '').trim()
  if (d) return d
  const act = (a.action || '').toLowerCase()
  if (act === 'login') return 'Admin signed in'
  if (act === 'logout') return 'Admin signed out'
  if (act === 'save') return `Content updated (${a.section || 'section'})`
  if (act.includes('lead')) return (a.description || a.action).replace(/_/g, ' ')
  return a.action || 'CMS activity'
}

function cmsStatusRow(label: string, value: string, ok: boolean, Icon: typeof Wifi) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3">
      <span className="flex items-center gap-2 text-sm font-medium text-slate-800">
        <Icon className="size-4 text-brand" strokeWidth={1.75} aria-hidden />
        {label}
      </span>
      <span className={`text-xs font-bold uppercase tracking-wide ${ok ? 'text-emerald-700' : 'text-amber-800'}`}>{value}</span>
    </div>
  )
}

export function AdminDashboard() {
  const [data, setData] = useState<DashboardSummary | null>(null)
  const [publicApiOk, setPublicApiOk] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadSource, setLoadSource] = useState<DashboardLoadSource | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const { data: summary, source } = await loadDashboardSummary()
      if (cancelled) return
      setData(summary)
      setLoadSource(source)
      setLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    fetch(`${apiBase()}/api/health`)
      .then((r) => setPublicApiOk(r.ok))
      .catch(() => setPublicApiOk(false))
  }, [])

  const summaryCards = useMemo(() => {
    if (!data) return []
    const c = data.cards
    return [
      { label: 'Website Sections', value: c.sectionsTotal, sub: 'Homepage blocks & visibility', icon: LayoutGrid },
      {
        label: 'ERP Modules',
        value: c.erpModulesTotal,
        sub:
          c.erpModulesTotal === 0
            ? 'No modules in CMS data'
            : c.erpModulesActive === c.erpModulesTotal
              ? 'All active on site'
              : `${c.erpModulesActive} of ${c.erpModulesTotal} active on site`,
        icon: Layers,
      },
      {
        label: 'Industry Solutions',
        value: c.industriesTotal,
        sub:
          c.industriesTotal === 0
            ? 'No industries in CMS data'
            : c.industriesActive === c.industriesTotal
              ? 'All active on site'
              : `${c.industriesActive} of ${c.industriesTotal} active on site`,
        icon: Sparkles,
      },
      { label: 'FAQs', value: c.faqsTotal, sub: `${c.faqsActive} marked active`, icon: HelpCircle },
      { label: 'Leads', value: c.leadsTotal, sub: 'Website enquiries', icon: Users },
      { label: 'Media Files', value: c.mediaFiles, sub: 'Images & assets in library', icon: ImageIcon },
    ]
  }, [data])

  const quickActions = useMemo(
    () => [
      { to: '/admin/layout/header', label: 'Edit Header', icon: PanelTop },
      { to: '/admin/pages/home?tab=hero', label: 'Edit Hero', icon: LayoutGrid },
      { to: '/admin/pages/home?tab=modules', label: 'Manage ERP Modules', icon: Layers },
      { to: '/admin/pages/home?tab=industries', label: 'Manage Industries', icon: Sparkles },
      { to: '/admin/media', label: 'Upload Media', icon: ImageIcon },
      { to: '/admin/seo', label: 'SEO Settings', icon: Search },
      { to: '/admin/leads', label: 'View Leads', icon: MessageSquare },
      { to: '/admin/pages/home?tab=visibility', label: 'Section visibility', icon: LayoutList },
    ],
    [],
  )

  if (loading || !data) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-12 shadow-sm">
        <span className="size-10 animate-spin rounded-full border-2 border-brand border-t-transparent" aria-hidden />
        <p className="text-sm font-semibold text-slate-700">Loading your website overview…</p>
      </div>
    )
  }

  const checklist = data.contentStatus ?? []
  const showSoftHint = loadSource === 'empty'
  const jsonReady = data.health?.dataFiles !== false
  const mediaReady = data.health?.mediaUploads !== false
  const adminApiOk = loadSource !== 'empty'

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-10">
      {showSoftHint ? (
        <div
          role="status"
          className="rounded-2xl border border-amber-200 bg-amber-50/90 px-5 py-4 text-sm text-amber-950 shadow-sm"
        >
          <p className="font-semibold text-amber-950">We could not reach the CMS server just now.</p>
          <p className="mt-1 text-amber-900/90">Refresh the page. If this continues, start the website and CMS API together, then try again.</p>
        </div>
      ) : null}

      {/* Welcome */}
      <section className="overflow-hidden rounded-2xl border border-orange-200/60 bg-gradient-to-br from-white via-orange-50/40 to-white p-6 shadow-md shadow-orange-900/[0.06] sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl space-y-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">DigitalManager</p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Welcome to DigitalManager Website CMS</h1>
            <p className="text-sm leading-relaxed text-slate-700 sm:text-base">
              Manage website content, media, SEO, enquiries and homepage sections from one place.
            </p>
            {data.cards.lastUpdatedGlob ? (
              <p className="text-xs font-medium text-slate-500">
                Last content save: {new Date(data.cards.lastUpdatedGlob).toLocaleString()}
              </p>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 shadow-sm">
            <CheckCircle2 className="size-8 text-brand" strokeWidth={1.5} aria-hidden />
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Website CMS</p>
              <p className="text-sm font-semibold text-slate-900">Content control panel</p>
            </div>
          </div>
        </div>
      </section>

      {/* Summary metrics */}
      <section aria-labelledby="dash-metrics-heading">
        <h2 id="dash-metrics-heading" className="sr-only">
          Summary metrics
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {summaryCards.map((s) => (
            <div
              key={s.label}
              className="flex gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm shadow-slate-900/[0.04] transition-shadow hover:shadow-md"
            >
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-brand">
                <s.icon className="size-6" strokeWidth={1.65} aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{s.label}</p>
                <p className="mt-1 text-2xl font-bold tabular-nums tracking-tight text-slate-900">{s.value}</p>
                <p className="mt-1 text-xs leading-snug text-slate-600">{s.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Checklist + Quick actions */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Content status</h2>
          <p className="mt-1 text-xs text-slate-500">Key areas for your live website.</p>
          <ul className="mt-5 space-y-2.5">
            {checklist.map((row) => (
              <li
                key={row.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3 transition-colors hover:bg-slate-50"
              >
                <span className="text-sm font-semibold text-slate-800">{row.label}</span>
                <StatusBadge kind={row.badge} />
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Quick actions</h2>
          <p className="mt-1 text-xs text-slate-500">Jump straight into editing.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {quickActions.map((a) => {
              const Icon = a.icon
              return (
                <Link
                  key={a.to}
                  to={a.to}
                  className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-800 shadow-sm transition-all hover:border-brand/40 hover:bg-orange-50/50 hover:text-brand hover:shadow-md"
                >
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-brand transition-colors group-hover:bg-brand group-hover:text-white">
                      <Icon className="size-4" strokeWidth={1.75} aria-hidden />
                    </span>
                    <span className="truncate">{a.label}</span>
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 text-slate-300 transition-colors group-hover:text-brand" aria-hidden />
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Activity + Leads */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500">
              <FileText className="size-4 text-brand" aria-hidden />
              Recent activity
            </h2>
            <Link to="/admin/activity" className="text-xs font-bold text-brand hover:underline">
              View all
            </Link>
          </div>
          <ul className="mt-4 max-h-80 space-y-2 overflow-y-auto pr-1 text-sm">
            {data.recentActivity.length === 0 ? (
              <li className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 py-10 text-center text-sm text-slate-500">
                No recent activity yet.
              </li>
            ) : (
              data.recentActivity.map((a) => (
                <li key={a.id} className="rounded-xl border border-slate-100 bg-slate-50/40 px-4 py-3">
                  <p className="font-medium text-slate-900">{activityTitle(a)}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {new Date(a.at).toLocaleString()}
                    {a.adminName || a.adminEmail ? ` · ${a.adminName || a.adminEmail}` : ''}
                  </p>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-500">
              <MessageSquare className="size-4 text-brand" aria-hidden />
              Recent leads
            </h2>
            <Link to="/admin/leads" className="text-xs font-bold text-brand hover:underline">
              View all
            </Link>
          </div>
          {data.recentLeads.length === 0 ? (
            <p className="mt-8 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 py-10 text-center text-sm text-slate-500">
              No enquiries received yet.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto rounded-xl border border-slate-100">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-100 bg-slate-50/90 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-3 py-2.5">Name</th>
                    <th className="px-3 py-2.5">Phone / email</th>
                    <th className="px-3 py-2.5">Status</th>
                    <th className="px-3 py-2.5">Date</th>
                    <th className="px-3 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {data.recentLeads.map((l) => {
                    const contact = [l.phone, l.email].filter(Boolean).join(' · ') || '—'
                    return (
                      <tr key={l.id} className="border-b border-slate-50 last:border-0">
                        <td className="px-3 py-2.5 font-medium text-slate-900">{l.name || '—'}</td>
                        <td className="max-w-[11rem] truncate px-3 py-2.5 text-slate-600" title={contact}>
                          {contact}
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-semibold text-brand">{l.status}</span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-2.5 text-xs text-slate-500">{new Date(l.createdAt).toLocaleDateString()}</td>
                        <td className="px-3 py-2.5">
                          <Link to="/admin/leads" className="text-xs font-bold text-brand hover:underline">
                            View
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* CMS Health */}
      <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">CMS health</h2>
        <p className="mt-1 text-xs text-slate-500">Connection and storage status for this admin session.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {cmsStatusRow('Frontend', publicApiOk === false ? 'Offline' : 'Online', publicApiOk !== false, Wifi)}
          {cmsStatusRow('API', adminApiOk ? 'Online' : 'Offline', adminApiOk, Server)}
          {cmsStatusRow('JSON storage', jsonReady ? 'Ready' : 'Check', jsonReady, Database)}
          {cmsStatusRow('Media uploads', mediaReady ? 'Ready' : 'Check', mediaReady, HardDrive)}
        </div>
      </section>
    </div>
  )
}
