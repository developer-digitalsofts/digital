type Props = {
  title: string
  badge?: React.ReactNode
  legend?: React.ReactNode
  className?: string
  children: React.ReactNode
}

export function ChartCard({ title, badge, legend, className = '', children }: Props) {
  return (
    <div className={`flex min-h-0 flex-col rounded-lg border border-[#E2E8F0] bg-white p-2 sm:p-2.5 lg:p-3 ${className}`}>
      <div className="mb-1 flex items-center justify-between gap-2 lg:mb-1.5">
        <p className="text-[9px] font-bold text-brand-deep sm:text-[10px] lg:text-[11px]">{title}</p>
        <div className="flex items-center gap-1.5">{badge}{legend}</div>
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  )
}

export function ChartLegend({ items }: { items: { label: string; color: string }[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 text-[7px] text-slate-500 sm:text-[8px] lg:text-[9px]">
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1">
          <span className="size-1.5 rounded-full" style={{ backgroundColor: item.color }} />
          {item.label}
        </span>
      ))}
    </div>
  )
}
