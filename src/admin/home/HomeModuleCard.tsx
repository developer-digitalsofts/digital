import { ChevronDown, Pencil, Trash2 } from 'lucide-react'
import { LucideByName } from '../../utils/lucideFromName'
import type { Bilingual } from '../../cms/types'

export type ModItem = {
  id: string
  icon: string
  badge: Bilingual
  title: Bilingual
  description: Bilingual
  href: string
  sortOrder: number
  active: boolean
}

export type ModuleTab = 'en' | 'ar' | 'settings'

const inputClass =
  'mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20'

type Props = {
  item: ModItem
  expanded: boolean
  tab: ModuleTab
  onTabChange: (tab: ModuleTab) => void
  onToggleExpand: () => void
  onChange: (next: ModItem) => void
  onDelete: () => void
}

export function HomeModuleCard({ item, expanded, tab, onTabChange, onToggleExpand, onChange, onDelete }: Props) {
  const title = item.title ?? { en: '', ar: '' }
  const badge = item.badge ?? { en: '', ar: '' }
  const description = item.description ?? { en: '', ar: '' }
  const patch = (partial: Partial<ModItem>) => onChange({ ...item, ...partial })

  return (
    <article
      className={`overflow-hidden rounded-xl border bg-white transition-colors ${
        expanded ? 'border-brand/30 ring-1 ring-brand/10' : 'border-slate-200'
      }`}
    >
      {/* Collapsed header — always visible */}
      <div
        className={`flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 sm:flex-nowrap ${
          expanded ? 'border-b border-slate-100 bg-slate-50/50' : ''
        }`}
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
          <LucideByName name={item.icon} className="size-5" strokeWidth={2} />
        </span>

        <div className="min-w-0 flex-1 basis-[12rem]">
          <p className="truncate text-sm font-bold text-slate-900">{title.en || 'Untitled module'}</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
            {badge.en ? (
              <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-semibold text-brand">{badge.en}</span>
            ) : (
              <span className="text-[11px] text-slate-400">No badge</span>
            )}
            <span className="truncate font-mono text-[11px] text-slate-500" title={item.href}>
              {item.href || '—'}
            </span>
          </div>
        </div>

        <label className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 text-xs font-semibold text-slate-700">
          <input
            type="checkbox"
            checked={item.active !== false}
            onChange={(e) => patch({ active: e.target.checked })}
            className="rounded border-slate-300 text-brand focus:ring-brand"
          />
          Active
        </label>

        <label className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-slate-700">
          Sort
          <input
            type="number"
            className="w-14 rounded-lg border border-slate-200 px-2 py-1 text-sm"
            value={item.sortOrder}
            onChange={(e) => patch({ sortOrder: Number(e.target.value) || 0 })}
          />
        </label>

        <button
          type="button"
          onClick={onToggleExpand}
          aria-expanded={expanded}
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            expanded
              ? 'border border-brand/30 bg-brand/5 text-brand'
              : 'border border-slate-200 bg-white text-slate-800 hover:border-brand/40 hover:text-brand'
          }`}
        >
          <Pencil className="size-3.5" aria-hidden />
          {expanded ? 'Close' : 'Edit'}
          <ChevronDown className={`size-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} aria-hidden />
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
        >
          <Trash2 className="size-3.5" aria-hidden />
          Delete
        </button>
      </div>

      {/* Expanded form — only when Edit is clicked */}
      {expanded ? (
        <div className="border-t border-slate-100 bg-white p-4">
          <div className="mb-4 flex flex-wrap gap-1 border-b border-slate-200 pb-3">
            {(
              [
                ['en', 'English Content'],
                ['ar', 'Arabic Content'],
                ['settings', 'Settings'],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => onTabChange(id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  tab === id ? 'bg-brand text-white' : 'bg-slate-50 text-slate-600 ring-1 ring-slate-200 hover:text-slate-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {tab === 'en' ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm sm:col-span-2">
                <span className="font-semibold text-slate-800">Title EN</span>
                <input className={inputClass} value={title.en} onChange={(e) => patch({ title: { ...title, en: e.target.value } })} />
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className="font-semibold text-slate-800">Description EN</span>
                <textarea
                  rows={3}
                  className={inputClass}
                  value={description.en}
                  onChange={(e) => patch({ description: { ...description, en: e.target.value } })}
                />
              </label>
              <label className="block text-sm">
                <span className="font-semibold text-slate-800">Badge EN</span>
                <input className={inputClass} value={badge.en} onChange={(e) => patch({ badge: { ...badge, en: e.target.value } })} />
              </label>
            </div>
          ) : null}

          {tab === 'ar' ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm sm:col-span-2">
                <span className="font-semibold text-slate-800">Title AR</span>
                <input
                  dir="rtl"
                  className={inputClass}
                  value={title.ar}
                  onChange={(e) => patch({ title: { ...title, ar: e.target.value } })}
                />
              </label>
              <label className="block text-sm sm:col-span-2">
                <span className="font-semibold text-slate-800">Description AR</span>
                <textarea
                  dir="rtl"
                  rows={3}
                  className={inputClass}
                  value={description.ar}
                  onChange={(e) => patch({ description: { ...description, ar: e.target.value } })}
                />
              </label>
              <label className="block text-sm">
                <span className="font-semibold text-slate-800">Badge AR</span>
                <input
                  dir="rtl"
                  className={inputClass}
                  value={badge.ar}
                  onChange={(e) => patch({ badge: { ...badge, ar: e.target.value } })}
                />
              </label>
            </div>
          ) : null}

          {tab === 'settings' ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="font-semibold text-slate-800">Icon name (Lucide)</span>
                <input className={`${inputClass} font-mono`} value={item.icon} onChange={(e) => patch({ icon: e.target.value })} />
              </label>
              <label className="block text-sm">
                <span className="font-semibold text-slate-800">Link / href</span>
                <input className={inputClass} value={item.href} onChange={(e) => patch({ href: e.target.value })} />
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={item.active !== false}
                  onChange={(e) => patch({ active: e.target.checked })}
                  className="rounded border-slate-300 text-brand focus:ring-brand"
                />
                Active on website
              </label>
              <label className="block text-sm">
                <span className="font-semibold text-slate-800">Sort order</span>
                <input
                  type="number"
                  className={inputClass}
                  value={item.sortOrder}
                  onChange={(e) => patch({ sortOrder: Number(e.target.value) || 0 })}
                />
              </label>
              <p className="text-xs text-slate-500 sm:col-span-2">Module ID: {item.id}</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </article>
  )
}
