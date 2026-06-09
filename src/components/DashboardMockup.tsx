import { BarChart3, ChevronRight, PieChart, TrendingUp } from 'lucide-react'

type DashboardMockupProps = {
  frameClassName?: string
  premium?: boolean
}

const floatCard = 'border border-slate-200/90 bg-white'

export function DashboardMockup({ frameClassName, premium }: DashboardMockupProps) {
  const bars = [38, 62, 48, 78, 58, 72, 88, 64, 76, 52, 84, 92]

  return (
    <div className={`relative ${premium ? 'animate-float' : ''}`}>
      {premium ? (
        <>
          <div
            className={`absolute -left-2 top-8 z-10 hidden max-w-[132px] rounded-lg p-2.5 md:block ${floatCard} animate-float-delayed`}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Live KPI</p>
            <p className="mt-0.5 text-base font-bold text-slate-900">PKR 2.4M</p>
            <p className="text-[10px] font-medium text-emerald-600">+8.2% vs last week</p>
          </div>
          <div
            className={`absolute -right-1 top-28 z-10 hidden rounded-lg p-2.5 md:block ${floatCard} animate-float-slow`}
          >
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              Synced
            </div>
          </div>
          <div
            className={`absolute -right-1 bottom-20 z-10 hidden rounded-lg border border-slate-200/90 bg-white px-2.5 py-2 md:block animate-float-slow`}
            aria-hidden
          >
            <p className="text-[10px] text-slate-500">Reports</p>
            <p className="text-xs font-bold text-brand">Real-time</p>
          </div>
        </>
      ) : null}

      <div
        className={`overflow-hidden rounded-xl border border-slate-200/90 bg-white${frameClassName ? ` ${frameClassName}` : ''}`}
      >
        <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/80 px-3.5 py-2.5">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-red-400/90" />
              <span className="size-2.5 rounded-full bg-amber-400/90" />
              <span className="size-2.5 rounded-full bg-emerald-400/90" />
            </div>
            <span className="text-xs font-semibold text-slate-600">DigitalManager — ERP</span>
          </div>
          <span className="rounded-full border border-brand/25 bg-brand/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">
            Live
          </span>
        </div>

        <div className="flex min-h-[300px] flex-col sm:min-h-[360px] lg:min-h-[400px]">
          <div className="grid grid-cols-3 gap-2.5 border-b border-slate-200/80 bg-slate-50/40 p-3 sm:gap-3">
            {[
              { label: 'Net sales', val: 'PKR 4.2M', chip: '+6%' },
              { label: 'Invoices', val: '1,284', chip: 'MTD' },
              { label: 'Stock health', val: '97%', chip: 'On target' },
            ].map((c) => (
              <div key={c.label} className="rounded-lg border border-slate-200/80 bg-white p-2.5 sm:p-3">
                <p className="text-[9px] font-medium uppercase tracking-wide text-slate-500 sm:text-[10px]">
                  {c.label}
                </p>
                <p className="mt-0.5 truncate text-sm font-bold text-slate-900 sm:text-base">{c.val}</p>
                <span className="mt-1 inline-block rounded-full border border-emerald-200/80 bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700">
                  {c.chip}
                </span>
              </div>
            ))}
          </div>

          <div className="grid flex-1 gap-2.5 p-3 sm:grid-cols-5 sm:gap-3">
            <div className="flex flex-col rounded-lg border border-slate-200/80 bg-white p-3 sm:col-span-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-800 sm:text-sm">
                  <BarChart3 className="size-4 text-brand" />
                  Revenue vs target
                </span>
                <span className="flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600 sm:text-xs">
                  <TrendingUp className="size-3.5" />
                  On track
                </span>
              </div>
              <div className="mt-3 flex h-28 flex-1 items-end gap-1 rounded-md border border-slate-100 bg-slate-50/60 px-2 pb-2 pt-4 sm:h-32">
                {bars.map((h, i) => (
                  <div
                    key={i}
                    className={`flex-1 rounded-t-sm bg-brand/90 transition-opacity hover:opacity-90${premium ? ' animate-bar-rise' : ''}`}
                    style={{
                      height: `${h}%`,
                      animationDelay: premium ? `${i * 55}ms` : undefined,
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center rounded-lg border border-slate-200/80 bg-white p-3 sm:col-span-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                <PieChart className="size-4 text-brand" />
                Margin mix
              </div>
              <div
                className="relative mt-2.5 size-24 rounded-full sm:size-28"
                style={{
                  background: 'conic-gradient(#f47c4d 0deg 210deg, #e2e8f0 210deg 360deg)',
                }}
              >
                <div className="absolute inset-[18%] flex flex-col items-center justify-center rounded-full border border-slate-100 bg-white text-center">
                  <span className="text-lg font-extrabold text-slate-900 sm:text-xl">68%</span>
                  <span className="text-[9px] font-medium text-slate-500">Gross</span>
                </div>
              </div>
              <div className="mt-3 flex w-full justify-center gap-4 text-[10px] text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-brand" />
                  Core
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-slate-200" />
                  Other
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200/80 px-3 pb-2.5">
            <div className="overflow-hidden rounded-lg border border-slate-200/80 bg-white">
              <table className="w-full text-left text-[10px] sm:text-xs">
                <thead className="bg-slate-50/90 text-slate-500">
                  <tr>
                    <th className="px-3 py-1.5 font-semibold">Document</th>
                    <th className="px-3 py-1.5 font-semibold">Branch</th>
                    <th className="hidden px-3 py-1.5 font-semibold sm:table-cell">Amount</th>
                    <th className="px-3 py-1.5 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {[
                    { d: 'SO-20481', b: 'Karachi', a: 'PKR 42,900', s: 'Posted' },
                    { d: 'GRN-8832', b: 'Lahore', a: 'PKR 18,200', s: 'Approved' },
                    { d: 'INV-9910', b: 'Islamabad', a: 'PKR 9,450', s: 'Sent' },
                  ].map((row) => (
                    <tr key={row.d} className="transition-colors hover:bg-brand/[0.04]">
                      <td className="px-3 py-1.5 font-semibold">{row.d}</td>
                      <td className="px-3 py-1.5">{row.b}</td>
                      <td className="hidden px-3 py-1.5 sm:table-cell">{row.a}</td>
                      <td className="px-3 py-1.5">
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-700 sm:text-[10px]">
                          {row.s}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-slate-200/80 bg-slate-50/60 px-3.5 py-2 text-[10px] text-slate-500 sm:px-4 sm:text-xs">
          <span>ERP dashboard preview</span>
          <span className="flex items-center gap-0.5 font-semibold text-brand">
            Open modules
            <ChevronRight className="size-3.5" />
          </span>
        </div>
      </div>
    </div>
  )
}
