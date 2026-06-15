import type { MouseEvent } from 'react'

export type AdminButtonTab<T extends string = string> = {
  id: T
  label: string
}

type Props<T extends string> = {
  tabs: readonly AdminButtonTab<T>[]
  activeTab: T
  onTabChange: (tab: T, e: MouseEvent<HTMLButtonElement>) => void
  ariaLabel: string
  className?: string
}

/** Admin-only tab bar — always buttons, never anchor/hash links. */
export function AdminButtonTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  ariaLabel,
  className = '',
}: Props<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50/80 p-2 sm:flex-nowrap sm:overflow-x-auto ${className}`.trim()}
    >
      {tabs.map((t) => {
        const isActive = t.id === activeTab
        return (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={(e) => onTabChange(t.id, e)}
            className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold uppercase tracking-wide transition-colors sm:text-[13px] ${
              isActive ? 'bg-brand text-white shadow-md' : 'text-slate-600 hover:bg-orange-100/80 hover:text-slate-900'
            }`}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}
