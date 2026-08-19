import { memo } from 'react'

type Item = { label: string; value: number; color?: string }

export const ProgressBars = memo(function ProgressBars({ items, animate = false }: { items: Item[]; animate?: boolean }) {
  return (
    <ul className="space-y-1.5 lg:space-y-2">
      {items.map((item, i) => (
        <li key={item.label}>
          <div className="mb-0.5 flex items-center justify-between text-[8px] lg:text-[9px]">
            <span className="font-medium text-slate-600">{item.label}</span>
            <span className="font-bold text-brand-deep">{item.value}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 lg:h-2">
            <div
              className={`h-full rounded-full ${animate ? 'hero-bar-grow' : ''}`}
              style={{
                width: `${item.value}%`,
                backgroundColor: item.color ?? '#f47c4d',
                animationDelay: animate ? `${i * 80}ms` : undefined,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
})

export function WarehouseIndicators({ items }: { items: { name: string; value: number }[] }) {
  return (
    <div className="mt-2 grid grid-cols-2 gap-1.5 lg:gap-2">
      {items.map((w) => (
        <div key={w.name} className="rounded-md border border-[#E2E8F0] bg-slate-50/70 px-2 py-1.5">
          <p className="text-[7px] text-slate-500 lg:text-[8px]">{w.name}</p>
          <p className="text-[10px] font-bold text-brand-deep lg:text-[11px]">{w.value}%</p>
        </div>
      ))}
    </div>
  )
}

export function TillIndicators({ items }: { items: { label: string; count: number; tone: 'positive' | 'warning' | 'critical' }[] }) {
  const colors = { positive: 'text-emerald-600', warning: 'text-amber-600', critical: 'text-red-600' }
  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      {items.map((t) => (
        <span key={t.label} className="rounded-full border border-[#E2E8F0] bg-white px-2 py-0.5 text-[7px] lg:text-[8px]">
          <span className="text-slate-500">{t.label}</span>{' '}
          <span className={`font-bold ${colors[t.tone]}`}>{t.count}</span>
        </span>
      ))}
    </div>
  )
}
