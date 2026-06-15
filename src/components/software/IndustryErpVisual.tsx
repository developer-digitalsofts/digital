import type { ReactNode } from 'react'
import { BarChart3, ChevronRight } from 'lucide-react'
import {
  getIndustryErpTheme,
  type IndustryVisualVariant,
} from '../../data/softwareDetail/industryErpThemes'
import { SoftwareColorIcon } from '../SoftwareColorIcon'

type Props = {
  categoryId: string
  slug?: string
  productLabel: string
  variant: IndustryVisualVariant
  className?: string
}

function Shell({
  theme,
  productLabel,
  categoryId,
  slug,
  children,
  className = '',
}: {
  theme: ReturnType<typeof getIndustryErpTheme>
  productLabel: string
  categoryId: string
  slug?: string
  children: ReactNode
  className?: string
}) {
  return (
    <figure
      className={`overflow-hidden rounded-xl border border-[rgba(15,23,42,0.08)] bg-white ${className}`}
      aria-label={`${productLabel} — ${theme.moduleLabel} preview`}
    >
      <div className="flex items-center justify-between border-b border-slate-200/80 bg-gradient-to-r from-slate-50/90 to-white px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <SoftwareColorIcon
            icon={theme.primaryIcon}
            slug={slug}
            categoryId={categoryId}
            kind="industry"
            size="sm"
          />
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-brand">{theme.moduleLabel}</p>
            <p className="text-xs font-semibold text-slate-700">DigitalManager ERP</p>
          </div>
        </div>
        <span className="rounded-full border border-brand/25 bg-brand/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-brand">
          Live
        </span>
      </div>
      {children}
      <figcaption className="border-t border-slate-100 px-3 py-2 text-center text-[10px] text-slate-400">
        {productLabel} — industry ERP preview
      </figcaption>
    </figure>
  )
}

function DashboardBody({ theme, compact = false }: { theme: ReturnType<typeof getIndustryErpTheme>; compact?: boolean }) {
  return (
    <div className={`flex flex-col ${compact ? 'min-h-[220px]' : 'min-h-[280px] sm:min-h-[320px]'}`}>
      <div className="grid grid-cols-3 gap-2 border-b border-slate-200/80 bg-slate-50/40 p-2.5">
        {theme.heroKpis.map((k) => (
          <div key={k.label} className="rounded-lg border border-[rgba(15,23,42,0.08)] bg-white p-2">
            <p className="text-[9px] font-medium uppercase tracking-wide text-slate-500">{k.label}</p>
            <p className="mt-0.5 truncate text-sm font-bold text-slate-900">{k.value}</p>
            <span className="mt-1 inline-block rounded-full border border-emerald-200/80 bg-emerald-50 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700">
              {k.chip}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-1 flex-col p-2.5 sm:p-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <BarChart3 className="size-4 text-brand" />
            {theme.chartTitle}
          </span>
          <span className="text-[10px] font-semibold text-emerald-600">On track</span>
        </div>
        <div className="mt-3 flex h-24 flex-1 items-end gap-1 rounded-md border border-slate-100 bg-gradient-to-b from-slate-50 to-white px-2 pb-2 pt-3 sm:h-28">
          {theme.chartBars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm bg-gradient-to-t from-brand to-orange-300/90"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function ListBody({
  title,
  rows,
  cols,
}: {
  title: string
  rows: { primary: string; secondary: string; status: string }[]
  cols: [string, string, string]
}) {
  return (
    <div className="p-3 sm:p-4">
      <p className="text-xs font-bold text-slate-800">{title}</p>
      <div className="mt-3 overflow-hidden rounded-lg border border-slate-200/80">
        <table className="w-full text-left text-[10px] sm:text-xs">
          <thead className="bg-slate-50/90 text-slate-500">
            <tr>
              {cols.map((c) => (
                <th key={c} className="px-3 py-1.5 font-semibold">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {rows.map((row) => (
              <tr key={row.primary} className="hover:bg-orange-50/40">
                <td className="px-3 py-1.5 font-semibold">{row.primary}</td>
                <td className="hidden px-3 py-1.5 sm:table-cell">{row.secondary}</td>
                <td className="px-3 py-1.5">
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-700">
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function WorkflowBody({ theme }: { theme: ReturnType<typeof getIndustryErpTheme> }) {
  return (
    <div className="p-3 sm:p-4">
      <p className="text-xs font-bold text-slate-800">{theme.workflowTitle}</p>
      <ol className="mt-3 space-y-2">
        {theme.workflowSteps.map((step, i) => (
          <li
            key={step}
            className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/60 px-3 py-2.5"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-brand/15 text-xs font-bold text-brand">
              {i + 1}
            </span>
            <span className="text-sm font-medium text-slate-800">{step}</span>
            <ChevronRight className="ms-auto size-4 text-slate-300" aria-hidden />
          </li>
        ))}
      </ol>
    </div>
  )
}

export function IndustryErpVisual({ categoryId, slug, productLabel, variant, className = '' }: Props) {
  const theme = getIndustryErpTheme(categoryId, slug)

  if (variant === 'hero' || variant === 'dashboard') {
    return (
      <Shell theme={theme} productLabel={productLabel} categoryId={categoryId} slug={slug} className={className}>
        <DashboardBody theme={theme} compact={variant === 'dashboard'} />
      </Shell>
    )
  }

  if (variant === 'workflow') {
    return (
      <Shell theme={theme} productLabel={productLabel} categoryId={categoryId} slug={slug} className={className}>
        <WorkflowBody theme={theme} />
      </Shell>
    )
  }

  if (variant === 'reports') {
    return (
      <Shell theme={theme} productLabel={productLabel} categoryId={categoryId} slug={slug} className={className}>
        <ListBody
          title={theme.reportTitle}
          cols={['Report', 'Value', 'Status']}
          rows={theme.reportRows.map((r) => ({
            primary: r.name,
            secondary: r.value,
            status: r.status,
          }))}
        />
      </Shell>
    )
  }

  return (
    <Shell theme={theme} productLabel={productLabel} categoryId={categoryId} slug={slug} className={className}>
      <ListBody
        title={theme.documentTitle}
        cols={['Document', 'Detail', 'Status']}
        rows={theme.documentRows.map((r) => ({
          primary: r.id,
          secondary: r.detail,
          status: r.status,
        }))}
      />
    </Shell>
  )
}
