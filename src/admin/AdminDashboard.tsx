import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  FileStack,
  Home,
  ImageIcon,
  Layers,
  MessageSquare,
  PanelBottom,
  Phone,
  Sparkles,
  Users,
} from 'lucide-react'
import { loadDashboardSummary, getEmptyDashboard, type DashboardLoadSource, type DashboardSummary } from './loadDashboardData'
import { ADMIN_API_OFFLINE_HINT } from './adminApi'

function formatInquirySource(lead: DashboardSummary['recentLeads'][number]): string {
  if (lead.source?.trim()) return lead.source.trim()
  if (lead.sourcePage?.trim()) {
    const sp = lead.sourcePage.trim()
    if (sp.includes('header-get-demo')) return 'Popup — Get Demo'
    if (sp.startsWith('/contact')) return 'Contact Form'
    return sp.length > 40 ? `${sp.slice(0, 40)}…` : sp
  }
  return 'Website'
}

function messagePreview(msg: string, max = 56): string {
  const t = msg.trim()
  if (!t) return '—'
  return t.length > max ? `${t.slice(0, max)}…` : t
}

type QuickAction = {
  to: string
  title: string
  description: string
  buttonLabel: string
  icon: typeof Home
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    to: '/admin/pages/home',
    title: 'Edit Homepage',
    description: 'Update hero, sections, FAQs, and homepage visibility.',
    buttonLabel: 'Open editor',
    icon: Home,
  },
  {
    to: '/admin/erp-modules',
    title: 'Manage ERP Modules',
    description: 'Add, edit, or reorder ERP module cards on the homepage.',
    buttonLabel: 'Manage modules',
    icon: Layers,
  },
  {
    to: '/admin/industries',
    title: 'Manage Industries',
    description: 'Control industry solutions shown to visitors.',
    buttonLabel: 'Manage industries',
    icon: Sparkles,
  },
  {
    to: '/admin/detail-pages',
    title: 'Manage Detail Pages',
    description: 'Create and edit CMS detail pages and landing content.',
    buttonLabel: 'View pages',
    icon: FileStack,
  },
  {
    to: '/admin/media',
    title: 'Manage Media',
    description: 'Upload images and assets used across the website.',
    buttonLabel: 'Media library',
    icon: ImageIcon,
  },
  {
    to: '/admin/email-settings',
    title: 'Contact Details',
    description: 'Configure enquiry email receiver and notification templates.',
    buttonLabel: 'Contact settings',
    icon: Phone,
  },
  {
    to: '/admin/layout/footer',
    title: 'Footer Settings',
    description: 'Edit footer links, tagline, and social profiles.',
    buttonLabel: 'Edit footer',
    icon: PanelBottom,
  },
]

export function AdminDashboard() {
  const [data, setData] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadSource, setLoadSource] = useState<DashboardLoadSource | null>(null)
  const [apiError, setApiError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    setApiError(null)
    try {
      const { data: summary, source, apiError: fetchErr } = await loadDashboardSummary()
      setData(summary)
      setLoadSource(source)
      if (fetchErr) setApiError(fetchErr)
    } catch (e) {
      setData(getEmptyDashboard())
      setLoadSource('empty')
      setApiError(e instanceof Error ? e.message : ADMIN_API_OFFLINE_HINT)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const summaryCards = useMemo(() => {
    if (!data) return []
    const c = data.cards
    return [
      { label: 'Total Inquiries', value: c.leadsTotal, icon: MessageSquare },
      { label: 'New Inquiries', value: c.leadsNew, icon: MessageSquare },
      { label: 'ERP Modules', value: c.erpModulesTotal, icon: Layers },
      { label: 'Industries', value: c.industriesTotal, icon: Sparkles },
      { label: 'Detail Pages', value: c.detailPagesTotal, icon: FileStack },
      { label: 'Media Files', value: c.mediaFiles, icon: ImageIcon },
      { label: 'Users', value: c.usersTotal, icon: Users },
    ]
  }, [data])

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 rounded-xl border border-slate-200 bg-white p-12">
        <span className="size-10 animate-spin rounded-full border-2 border-brand border-t-transparent" aria-hidden />
        <p className="text-sm font-semibold text-slate-700">Loading dashboard…</p>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-lg rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="text-sm font-semibold text-red-900">{error || apiError || 'Dashboard unavailable'}</p>
        <p className="mt-2 text-sm text-red-800/90">{ADMIN_API_OFFLINE_HINT}</p>
        <button
          type="button"
          onClick={() => void load()}
          className="mt-5 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          Retry
        </button>
      </div>
    )
  }

  const apiOffline = loadSource === 'empty' || loadSource === 'fallback'

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-8">
      {apiOffline ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-950">
          <p className="font-semibold">CMS API was not fully reachable — showing available data (zeros if empty).</p>
          <p className="mt-1">{apiError || ADMIN_API_OFFLINE_HINT}</p>
        </div>
      ) : null}

      <section className="rounded-xl border border-slate-200 bg-white p-6 sm:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">DigitalManager CMS</p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Website admin dashboard</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Manage frontend content, enquiries, modules, industries, media, and site settings from one place.
        </p>
        {data.cards.lastUpdatedGlob ? (
          <p className="mt-3 text-xs text-slate-500">
            Last content update: {new Date(data.cards.lastUpdatedGlob).toLocaleString()}
          </p>
        ) : null}
      </section>

      <section aria-labelledby="dash-stats">
        <h2 id="dash-stats" className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">
          Overview
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((s) => (
            <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500">{s.label}</p>
                  <p className="mt-1 text-2xl font-bold tabular-nums text-slate-900">{s.value}</p>
                </div>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                  <s.icon className="size-5" strokeWidth={1.75} aria-hidden />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="dash-content-overview">
        <h2 id="dash-content-overview" className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">
          Website content overview
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon
            return (
              <div key={action.title} className="flex flex-col rounded-xl border border-slate-200 bg-white p-5">
                <span className="flex size-10 items-center justify-center rounded-lg bg-[#141d38]/[0.06] text-[#141d38]">
                  <Icon className="size-5" strokeWidth={1.75} aria-hidden />
                </span>
                <h3 className="mt-4 text-base font-bold text-slate-900">{action.title}</h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">{action.description}</p>
                <Link
                  to={action.to}
                  className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
                >
                  {action.buttonLabel}
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
            )
          })}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6" aria-labelledby="dash-inquiries">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <h2 id="dash-inquiries" className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Recent contact inquiries
          </h2>
          <Link to="/admin/leads" className="text-sm font-semibold text-brand hover:underline">
            View all
          </Link>
        </div>

        {data.recentLeads.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-200 bg-slate-50 py-12 text-center text-sm text-slate-500">
            No inquiries yet. Submissions from contact form, popup, and detail pages will appear here.
          </p>
        ) : (
          <div className="-mx-1 overflow-x-auto">
            <table className="min-w-[720px] w-full text-left text-sm">
              <thead className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-3 py-2.5">Name</th>
                  <th className="px-3 py-2.5">Email</th>
                  <th className="px-3 py-2.5">Phone</th>
                  <th className="px-3 py-2.5">Source</th>
                  <th className="px-3 py-2.5">Message</th>
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-3 py-2.5">Date</th>
                  <th className="px-3 py-2.5">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.recentLeads.map((lead) => (
                  <tr key={lead.id} className="border-b border-slate-50 last:border-0">
                    <td className="px-3 py-2.5 font-medium text-slate-900">{lead.name || '—'}</td>
                    <td className="max-w-[10rem] truncate px-3 py-2.5 text-slate-600" title={lead.email}>
                      {lead.email || '—'}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-slate-600">{lead.phone || '—'}</td>
                    <td className="max-w-[8rem] truncate px-3 py-2.5 text-xs text-slate-500" title={formatInquirySource(lead)}>
                      {formatInquirySource(lead)}
                    </td>
                    <td className="max-w-[12rem] truncate px-3 py-2.5 text-slate-600" title={lead.message}>
                      {messagePreview(lead.message)}
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-semibold text-brand">
                        {lead.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-xs text-slate-500">
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-3 py-2.5">
                      <Link to="/admin/leads" className="text-xs font-bold text-brand hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
