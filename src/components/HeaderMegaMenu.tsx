import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { industryCategories, industryCategoryTitleEn, moduleMegaItems } from '../data/megaMenu'
import { useI18n } from '../i18n/I18nProvider'
import type { Lang } from '../i18n/messages'
import { megaIndustryCatTitle, megaIndustryLabel, megaModuleLabel } from '../i18n/megaLabels'
import { pageShellClass } from '../ui/pageShell'

const megaPanelClass = 'border-t border-slate-200 bg-white'
const megaShellClass = `${pageShellClass} py-2 lg:py-2.5`
const megaBoxClass = 'rounded-lg border border-slate-200 bg-slate-50/50 p-2 sm:p-2.5 lg:p-3'
const industryMegaGridClass =
  'grid max-h-[min(54vh,440px)] grid-cols-1 gap-1 overflow-y-auto lg:grid-cols-2 lg:gap-1.5'

export function MegaMenuModulesPanel({ onPick }: { onPick: () => void }) {
  const { lang } = useI18n()
  const isRtl = lang === 'ar'
  return (
    <div className={megaPanelClass} onMouseDown={(e) => e.stopPropagation()}>
      <div className={megaShellClass}>
        <div className={megaBoxClass}>
          <div className="grid grid-cols-1 gap-1.5 md:grid-cols-2 md:gap-2">
            {moduleMegaItems.map((item) => (
              <Link
                key={item.slug}
                to={item.to}
                onClick={onPick}
                className="group flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-2.5 py-2 outline-none transition-colors duration-200 hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-brand/35 focus-visible:ring-offset-2 sm:px-3 sm:py-2"
              >
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-full transition-transform duration-200 group-hover:scale-105 ${item.iconWrap}`}
                >
                  <item.icon className="size-[1.05rem] text-[#ea6a45]" strokeWidth={2} aria-hidden />
                </span>
                <span className="min-w-0 flex-1 text-start text-[13px] font-semibold leading-snug text-slate-800 transition-colors group-hover:text-[#e85b3a]">
                  {megaModuleLabel(lang, item.slug, item.labelEn)}
                </span>
                {isRtl ? (
                  <ChevronLeft
                    className="size-3.5 shrink-0 text-brand/70 transition-transform duration-200 group-hover:-translate-x-0.5 group-hover:text-brand-dark"
                    aria-hidden
                  />
                ) : (
                  <ChevronRight
                    className="size-3.5 shrink-0 text-brand/70 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-brand-dark"
                    aria-hidden
                  />
                )}
              </Link>
            ))}
          </div>
        </div>
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
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white transition-colors duration-200 hover:border-slate-300">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-2 px-2 py-1.5 text-start outline-none transition-colors hover:bg-orange-50/50 focus-visible:bg-orange-50/40 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand/25 sm:px-2.5 sm:py-2"
        aria-expanded={isOpen}
      >
        <span
          className={`flex size-8 shrink-0 items-center justify-center rounded-full ${cat.iconWrap}`}
        >
          <cat.icon className="size-4 text-[#ea6a45]" strokeWidth={2} aria-hidden />
        </span>
        <span className="min-w-0 flex-1 font-heading text-[13px] font-semibold leading-snug text-[#0f172a]">
          {catTitle}
        </span>
        <span
          className={`inline-flex shrink-0 origin-center transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          aria-hidden
        >
          <ChevronDown className="size-3.5 shrink-0 text-brand" aria-hidden />
        </span>
      </button>
      {isOpen && (
        <ul className="border-t border-orange-100/60 bg-orange-50/40 py-0.5">
          {cat.links.map((link) => (
            <li key={link.slug}>
              <Link
                to={link.to}
                onClick={onPick}
                className="group flex items-center justify-between gap-2 px-2.5 py-1 text-xs font-medium leading-snug text-slate-700 outline-none transition-colors hover:bg-white hover:text-[#e85b3a] focus-visible:bg-white focus-visible:text-[#e85b3a] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand/20 sm:px-3 sm:py-1.5 sm:text-[13px]"
              >
                <span className="min-w-0 flex-1 text-start">
                  {megaIndustryLabel(lang, link.slug, link.labelEn)}
                </span>
                <span
                  className={`shrink-0 text-slate-300 transition-transform group-hover:text-[#e85b3a] ${isRtl ? 'group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5'}`}
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
    <div className={megaPanelClass} onMouseDown={(e) => e.stopPropagation()}>
      <div className={megaShellClass}>
        <div className={megaBoxClass}>
          <div className={industryMegaGridClass}>
            <div className="flex flex-col gap-1">
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
            <div className="flex flex-col gap-1">
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
      </div>
    </div>
  )
}
