import { memo } from 'react'

type Branch = { name: string; value: number; amount: string }

export const BranchPerformance = memo(function BranchPerformance({
  branches,
  animate = false,
}: {
  branches: Branch[]
  animate?: boolean
}) {
  const max = Math.max(...branches.map((b) => b.value), 1)

  return (
    <ul className="space-y-1.5 lg:space-y-2">
      {branches.map((branch, i) => (
        <li key={branch.name}>
          <div className="mb-0.5 flex items-center justify-between gap-2 text-[8px] lg:text-[9px]">
            <span className="font-medium text-slate-600">{branch.name}</span>
            <span className="shrink-0 font-bold text-brand-deep">{branch.amount}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 lg:h-2">
            <div
              className={`h-full rounded-full bg-gradient-to-r from-brand/90 to-brand ${animate ? 'hero-bar-grow' : ''}`}
              style={{
                width: `${Math.round((branch.value / max) * 100)}%`,
                animationDelay: animate ? `${i * 70}ms` : undefined,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
})
