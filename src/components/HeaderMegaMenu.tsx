import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { industryCategories, industryCategoryTitleEn, moduleMegaItems } from '../data/megaMenu'
import { useI18n } from '../i18n/I18nProvider'
import type { Lang } from '../i18n/messages'
import { megaIndustryCatTitle, megaIndustryLabel, megaModuleLabel } from '../i18n/megaLabels'
const megaMenuBoxClass =
  'pointer-events-auto w-[min(calc(100vw-2rem),1050px)] overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-[0_8px_30px_-12px_rgba(15,23,42,0.1)]'
const rowHover =
  'transition-colors duration-200 hover:bg-[#fff7f3] focus-visible:bg-[#fff7f3] focus-visible:outline-none'
const industryMegaGridClass =
  'grid max-h-[min(54vh,460px)] grid-cols-1 overflow-y-auto lg:grid-cols-2 lg:divide-x lg:divide-slate-100'

function MegaIconCircle({
  icon: Icon,
  bgClass,
  size = 'md',
}: {
  icon: LucideIcon
  bgClass: string
  size?: 'sm' | 'md'
}) {
  const dim = size === 'sm' ? 'size-8' : 'size-9'
  const iconDim = size === 'sm' ? 'size-3.5' : 'size-4'
  return (
    <span
      className={`flex ${dim} shrink-0 items-center justify-center rounded-full shadow-sm transition-transform duration-200 group-hover:scale-110 ${bgClass}`}
    >
      <Icon className={`${iconDim} text-white`} strokeWidth={2.25} aria-hidden />
    </span>
  )
}

function MegaRowChevron({ isRtl }: { isRtl: boolean }) {
  return isRtl ? (
    <ChevronLeft
      className="size-3.5 shrink-0 text-slate-300 transition-all duration-200 group-hover:-translate-x-0.5 group-hover:text-brand"
      aria-hidden
    />
  ) : (
    <ChevronRight
      className="size-3.5 shrink-0 text-slate-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-brand"
      aria-hidden
    />
  )
}

function ModuleColumn({ items, onPick, lang }: { items: typeof moduleMegaItems; onPick: () => void; lang: Lang }) {
  const isRtl = lang === 'ar'
  return (
    <ul className="divide-y divide-slate-100">
      {items.map((item) => (
        <li key={item.slug}>
          <Link
            to={item.to}
            onClick={onPick}
            className={`group flex items-center gap-3 px-4 py-3 no-underline sm:px-5 sm:py-3.5 ${rowHover} hover:no-underline focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand/25`}
          >
            <MegaIconCircle icon={item.icon} bgClass={item.iconWrap} />
            <span className="min-w-0 flex-1 text-start text-[13px] font-bold leading-snug text-slate-800 transition-colors duration-200 group-hover:text-brand sm:text-sm">
              {megaModuleLabel(lang, item.slug, item.labelEn)}
            </span>
            <MegaRowChevron isRtl={isRtl} />
          </Link>
        </li>
      ))}
    </ul>
  )
}

export function MegaMenuModulesPanel({ onPick }: { onPick: () => void }) {
  const { lang } = useI18n()
  const mid = Math.ceil(moduleMegaItems.length / 2)
  const leftCol = moduleMegaItems.slice(0, mid)
  const rightCol = moduleMegaItems.slice(mid)

  return (
    <div className={megaMenuBoxClass} onMouseDown={(e) => e.stopPropagation()}>
      <div className="grid md:grid-cols-2">
        <ModuleColumn items={leftCol} onPick={onPick} lang={lang} />
        <ModuleColumn items={rightCol} onPick={onPick} lang={lang} />
      </div>
    </div>
  )
}

function IndustryCategoryBlock({
  cat,
  isOpen,
  onToggle,
  onPick,
  lang,
}: {
  cat: (typeof industryCategories)[0]
  isOpen: boolean
  onToggle: () => void
  onPick: () => void
  lang: Lang
}) {
  const isRtl = lang === 'ar'
  const catTitle = megaIndustryCatTitle(lang, cat.id, industryCategoryTitleEn(cat.id))
  return (
    <div className="border-b border-slate-100 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className={`group flex w-full items-center gap-3 px-4 py-3 text-start sm:px-5 sm:py-3.5 ${rowHover} focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand/25`}
        aria-expanded={isOpen}
      >
        <MegaIconCircle icon={cat.icon} bgClass={cat.iconWrap} size="sm" />
        <span className="min-w-0 flex-1 text-start text-[13px] font-bold leading-snug text-slate-800 transition-colors duration-200 group-hover:text-brand sm:text-sm">
          {catTitle}
        </span>
        <span
          className={`inline-flex shrink-0 origin-center text-slate-400 transition-transform duration-200 group-hover:text-brand ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          aria-hidden
        >
          <ChevronDown className="size-3.5" aria-hidden />
        </span>
      </button>
      {isOpen && (
        <ul className="divide-y divide-slate-100 border-t border-slate-100 bg-slate-50/40">
          {cat.links.map((link) => (
            <li key={link.slug}>
              <Link
                to={link.to}
                onClick={onPick}
                className={`group flex items-center justify-between gap-2 px-5 py-2.5 ps-14 text-xs font-medium leading-snug text-slate-700 no-underline sm:px-6 sm:py-3 sm:text-[13px] ${rowHover} hover:text-brand hover:no-underline focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand/20`}
              >
                <span className="min-w-0 flex-1 text-start">
                  {megaIndustryLabel(lang, link.slug, link.labelEn)}
                </span>
                <span
                  className={`shrink-0 text-slate-300 transition-all group-hover:text-brand ${isRtl ? 'group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5'}`}
                  aria-hidden
                >
                  {isRtl ? '←' : '→'}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function MegaMenuIndustriesPanel({ onPick }: { onPick: () => void }) {
  const { lang } = useI18n()
  const [openId, setOpenId] = useState<string | null>(null)

  const mid = Math.ceil(industryCategories.length / 2)
  const leftCol = industryCategories.slice(0, mid)
  const rightCol = industryCategories.slice(mid)

  return (
    <div className={megaMenuBoxClass} onMouseDown={(e) => e.stopPropagation()}>
      <div className={industryMegaGridClass}>
        <div>
          {leftCol.map((cat) => (
            <IndustryCategoryBlock
              key={cat.id}
              cat={cat}
              isOpen={openId === cat.id}
              onToggle={() => setOpenId((prev) => (prev === cat.id ? null : cat.id))}
              onPick={onPick}
              lang={lang}
            />
          ))}
        </div>
        <div>
          {rightCol.map((cat) => (
            <IndustryCategoryBlock
              key={cat.id}
              cat={cat}
              isOpen={openId === cat.id}
              onToggle={() => setOpenId((prev) => (prev === cat.id ? null : cat.id))}
              onPick={onPick}
              lang={lang}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
