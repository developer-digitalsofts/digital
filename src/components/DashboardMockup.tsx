import {
  BarChart3,
  Bell,
  Building2,
  FileText,
  LayoutDashboard,
  Package,
  PieChart,
  Search,
  Settings,
  TrendingUp,
  UserCircle,
  Wallet,
  Users,
} from 'lucide-react'
import { useDashboardRegionalData } from './hero/dashboards/useDashboardRegionalData'

type DashboardMockupProps = {
  frameClassName?: string
  premium?: boolean
}

const bars = [42, 58, 48, 72, 55, 68, 82, 61, 74, 50, 88, 94]

const sidebarItems = [
  { icon: LayoutDashboard, active: true },
  { icon: Wallet, active: false },
  { icon: Package, active: false },
  { icon: Users, active: false },
  { icon: BarChart3, active: false },
  { icon: Settings, active: false },
] as const

function ErpTopBar() {
  return (
    <div className="flex items-center gap-2 border-b border-slate-200/80 bg-white px-2.5 py-2 sm:gap-3 sm:px-3 sm:py-2.5">
      <div className="min-w-0 shrink">
        <p className="truncate text-[11px] font-bold text-brand-deep sm:text-xs">DigitalManager ERP</p>
        <p className="hidden text-[9px] text-slate-500 sm:block">Executive dashboard</p>
      </div>
      <div className="ms-auto flex min-w-0 flex-1 items-center justify-end gap-1.5 sm:max-w-[11rem] sm:flex-none md:max-w-[13rem]">
        <div className="hidden min-w-0 flex-1 items-center gap-1.5 rounded-md border border-slate-200/90 bg-slate-50/80 px-2 py-1 sm:flex">
          <Search className="size-3 shrink-0 text-slate-400" strokeWidth={2} aria-hidden />
          <span className="truncate text-[10px] text-slate-400">Search…</span>
        </div>
        <button
          type="button"
          className="relative flex size-7 shrink-0 items-center justify-center rounded-md border border-slate-200/90 bg-white text-slate-500"
          aria-hidden
        >
          <Bell className="size-3.5" strokeWidth={2} />
          <span className="absolute -right-0.5 -top-0.5 size-1.5 rounded-full bg-brand" />
        </button>
        <div
          className="flex size-7 shrink-0 items-center justify-center rounded-md border border-brand/20 bg-brand/[0.08] text-brand"
          aria-hidden
        >
          <UserCircle className="size-4" strokeWidth={2} />
        </div>
      </div>
    </div>
  )
}

function DashboardBody({ premium }: { premium?: boolean }) {
  const data = useDashboardRegionalData()
  const docs = data.erpDocuments.rows
  const statusClasses = [
    'border-emerald-200 bg-emerald-50 text-emerald-700',
    'border-blue-200 bg-blue-50 text-blue-700',
    'border-amber-200 bg-amber-50 text-amber-700',
    'border-slate-200 bg-slate-50 text-slate-600',
  ]
  const tableRows = docs.map((row, i) => ({
    d: String(row.doc),
    b: String(row.branch),
    a: String(row.amount),
    s: typeof row.status === 'object' && row.status ? String(row.status.text) : 'Posted',
    sClass: statusClasses[i] || statusClasses[0],
  }))

  const kpis = [
    {
      label: 'Revenue',
      val: data.erpRevenueKpi,
      chip: '+8.2% this month',
      chipClass: 'border-emerald-200/80 bg-emerald-50 text-emerald-700',
      accent: '#16a34a',
      tint: 'rgba(22,163,74,0.09)',
      icon: TrendingUp,
    },
    {
      label: 'Invoices',
      val: '1,284',
      chip: 'MTD',
      chipClass: 'border-blue-200/80 bg-blue-50 text-blue-700',
      accent: '#2563eb',
      tint: 'rgba(37,99,235,0.09)',
      icon: FileText,
    },
    {
      label: 'Stock Health',
      val: '97%',
      chip: 'On target',
      chipClass: 'border-teal-200/80 bg-teal-50 text-teal-700',
      accent: '#0d9488',
      tint: 'rgba(13,148,136,0.09)',
      icon: Package,
    },
    {
      label: 'Branches',
      val: '12',
      chip: 'Active',
      chipClass: 'border-violet-200/80 bg-violet-50 text-violet-700',
      accent: '#7c3aed',
      tint: 'rgba(124,58,237,0.09)',
      icon: Building2,
    },
  ] as const

  return (
    <>
      <div className="grid grid-cols-2 gap-1.5 border-b border-slate-200/80 bg-slate-50/30 p-2 sm:grid-cols-4 sm:gap-2 sm:p-2.5">
        {kpis.map((c) => (
          <div
            key={c.label}
            className="rounded-lg border border-slate-200/80 bg-white p-2 sm:p-2.5"
            style={{ backgroundColor: c.tint }}
          >
            <div className="flex items-start justify-between gap-1">
              <p className="text-[8px] font-semibold uppercase tracking-wide text-slate-600 sm:text-[9px]">
                {c.label}
              </p>
              <span
                className="flex size-5 shrink-0 items-center justify-center rounded-md text-white sm:size-6"
                style={{ backgroundColor: c.accent }}
                aria-hidden
              >
                <c.icon className="size-2.5 sm:size-3" strokeWidth={2.25} />
              </span>
            </div>
            <p className="mt-0.5 truncate text-xs font-bold text-slate-900 sm:text-sm">{c.val}</p>
            <span
              className={`mt-1 inline-block rounded-full border px-1.5 py-0.5 text-[8px] font-semibold sm:text-[9px] ${c.chipClass}`}
            >
              {c.chip}
            </span>
          </div>
        ))}
      </div>

      <div className="grid gap-2 p-2 sm:grid-cols-5 sm:gap-2.5 sm:p-2.5">
        <div className="rounded-lg border border-slate-200/80 bg-white p-2 sm:col-span-3 sm:p-2.5">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1 text-[10px] font-bold text-slate-800 sm:text-xs">
              <BarChart3 className="size-3.5 text-brand" strokeWidth={2} />
              Revenue vs Target
            </span>
            <span className="inline-flex items-center gap-0.5 rounded-full border border-emerald-200/80 bg-emerald-50 px-1.5 py-0.5 text-[8px] font-semibold text-emerald-700 sm:text-[9px]">
              <TrendingUp className="size-2.5" strokeWidth={2.5} />
              On Track
            </span>
          </div>
          <div
            className="relative mt-2 flex h-20 items-end gap-0.5 rounded-md border border-slate-200/70 bg-slate-50/50 px-1.5 pb-1.5 pt-2 sm:h-24"
            style={{
              backgroundImage:
                'linear-gradient(to right, rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(to top, rgba(148,163,184,0.12) 1px, transparent 1px)',
              backgroundSize: '20% 25%',
            }}
          >
            {bars.map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t-[2px]${premium ? ' animate-bar-rise' : ''}`}
                style={{
                  height: `${h}%`,
                  background: 'linear-gradient(to top, #ff7a45 0%, #ffb088 100%)',
                  animationDelay: premium ? `${i * 55}ms` : undefined,
                }}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center rounded-lg border border-slate-200/80 bg-white p-2 sm:col-span-2 sm:p-2.5">
          <span className="flex w-full items-center gap-1 text-[10px] font-bold text-slate-800 sm:text-xs">
            <PieChart className="size-3.5 text-brand" strokeWidth={2} />
            Margin Mix
          </span>
          <div
            className="relative mt-1.5 size-16 rounded-full sm:size-[4.5rem]"
            style={{
              background:
                'conic-gradient(#ff7a45 0deg 132deg, #141d38 132deg 248deg, #e2e8f0 248deg 360deg)',
            }}
          >
            <div className="absolute inset-[20%] flex flex-col items-center justify-center rounded-full border border-slate-100 bg-white text-center">
              <span className="text-sm font-extrabold text-slate-900">68%</span>
              <span className="text-[7px] font-medium text-slate-500">Gross</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200/80 px-2 pb-2 pt-0 sm:px-2.5">
        <div className="overflow-hidden rounded-lg border border-slate-200/80 bg-white">
          <p className="border-b border-slate-100 bg-slate-50/80 px-2.5 py-1.5 text-[9px] font-semibold text-slate-600 sm:text-[10px]">
            Recent documents
          </p>
          <table className="w-full text-left text-[9px] sm:text-[10px]">
            <thead className="bg-slate-50/90 text-slate-500">
              <tr>
                <th className="px-2 py-1 font-semibold sm:px-2.5">Document</th>
                <th className="px-2 py-1 font-semibold sm:px-2.5">Branch</th>
                <th className="hidden px-2 py-1 font-semibold sm:table-cell sm:px-2.5">Amount</th>
                <th className="px-2 py-1 font-semibold sm:px-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {tableRows.map((row) => (
                <tr key={row.d} className="hover:bg-brand/[0.03]">
                  <td className="px-2 py-1 font-semibold sm:px-2.5">{row.d}</td>
                  <td className="px-2 py-1 sm:px-2.5">{row.b}</td>
                  <td className="hidden px-2 py-1 sm:table-cell sm:px-2.5">{row.a}</td>
                  <td className="px-2 py-1 sm:px-2.5">
                    <span
                      className={`rounded-full border px-1.5 py-0.5 text-[8px] font-semibold sm:text-[9px] ${row.sClass}`}
                    >
                      {row.s}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export function DashboardMockup({ frameClassName, premium }: DashboardMockupProps) {
  if (premium) {
    return (
      <div className="relative">
        <div
          className={`overflow-hidden rounded-xl border border-[rgba(15,23,42,0.1)] bg-white${frameClassName ? ` ${frameClassName}` : ''}`}
        >
          <div className="flex min-h-[320px] sm:min-h-[360px] lg:min-h-[400px]">
            <aside
              className="flex w-10 shrink-0 flex-col items-center gap-2 border-r border-white/10 bg-brand-deep py-3 sm:w-12 sm:gap-2.5"
              aria-hidden
            >
              <div className="mb-1 flex size-7 items-center justify-center rounded-lg bg-brand text-[10px] font-bold text-white sm:size-8">
                DM
              </div>
              {sidebarItems.map(({ icon: Icon, active }, i) => (
                <div
                  key={i}
                  className={`flex size-7 items-center justify-center rounded-lg sm:size-8 ${
                    active ? 'bg-brand text-white' : 'text-white/55'
                  }`}
                >
                  <Icon className="size-3.5 sm:size-4" strokeWidth={active ? 2.25 : 2} />
                </div>
              ))}
            </aside>

            <div className="flex min-w-0 flex-1 flex-col bg-[#fafbfc]">
              <ErpTopBar />
              <DashboardBody premium={premium} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div
        className={`overflow-hidden rounded-xl border border-[rgba(15,23,42,0.08)] bg-white${frameClassName ? ` ${frameClassName}` : ''}`}
      >
        <ErpTopBar />
        <div className="min-h-[280px]">
          <DashboardBody premium={premium} />
        </div>
      </div>
    </div>
  )
}
