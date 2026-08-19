import type { BadgeTone } from './types'

const toneClass: Record<BadgeTone, string> = {
  positive: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  info: 'border-blue-200 bg-blue-50 text-blue-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  critical: 'border-red-200 bg-red-50 text-red-700',
  neutral: 'border-slate-200 bg-slate-50 text-slate-600',
  purple: 'border-violet-200 bg-violet-50 text-violet-700',
}

export function StatusBadge({ children, tone = 'neutral' }: { children: React.ReactNode; tone?: BadgeTone }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-1.5 py-px text-[8px] font-semibold leading-none sm:text-[9px] lg:text-[10px] ${toneClass[tone]}`}>
      {children}
    </span>
  )
}
