import { memo } from 'react'
import { MiniSparkline } from './MiniSparkline'
import { StatusBadge } from './StatusBadge'
import type { KpiItem } from './types'

export const KpiCard = memo(function KpiCard({ item }: { item: KpiItem }) {
  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-white px-2 py-1.5 sm:px-2.5 sm:py-2 lg:px-3 lg:py-2.5">
      <div className="flex items-start justify-between gap-1">
        <p className="text-[8px] font-semibold uppercase tracking-wide text-slate-500 sm:text-[9px] lg:text-[10px]">{item.label}</p>
        {item.sparkline ? <MiniSparkline values={item.sparkline} /> : null}
      </div>
      <p className="mt-0.5 text-[11px] font-bold text-brand-deep sm:text-xs lg:text-sm">{item.value}</p>
      {item.hint ? (
        <div className="mt-1">
          <StatusBadge tone={item.tone}>{item.hint}</StatusBadge>
        </div>
      ) : null}
    </div>
  )
})

export function KpiRow({ items }: { items: KpiItem[] }) {
  return (
    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:gap-2">
      {items.map((item) => (
        <KpiCard key={item.label} item={item} />
      ))}
    </div>
  )
}
