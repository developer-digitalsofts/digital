import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  ChevronDown,
  Headphones,
} from 'lucide-react'
import { useCms } from '../cms/CmsContext'
import type { MegaMenusCmsDoc, ResolvedMegaMenuColumn, ResolvedMegaMenuPanel } from '../cms/megaMenuTypes'
import { resolvePublishedMegaMenuPanel } from '../data/resolvePublishedMegaMenus'
import { megaMenuCategoryIcon, megaMenuItemIcon } from '../data/megaMenuIcons'
import { useI18n } from '../i18n/I18nProvider'
import { useLocale } from '../locale/LocaleContext'
import './header-mega-menu.css'

export type MegaMenuKind = 'modules' | 'industries'

export function useResolvedMegaMenuPanel(kind: MegaMenuKind): ResolvedMegaMenuPanel {
  const { lang } = useI18n()
  const { data } = useCms()
  const doc = data?.megaMenus as MegaMenusCmsDoc | undefined
  return resolvePublishedMegaMenuPanel(doc, kind, lang)
}

function chunkSolutionRows<T>(items: T[]): T[][] {
  const rows: T[][] = []
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2))
  }
  return rows
}

function formatCategoryLabel(title: string): string {
  const trimmed = title.trim()
  if (!trimmed) return trimmed
  if (/[a-z]/.test(trimmed)) return trimmed
  return trimmed
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

type MegaMenuPanelProps = {
  kind: MegaMenuKind
  panel: ResolvedMegaMenuPanel
  ariaLabel: string
  onPick: () => void
}

function MegaMenuPanel({ kind, panel, ariaLabel, onPick }: MegaMenuPanelProps) {
  const { lang, t } = useI18n()
  const { href: localeHref } = useLocale()
  const toHref = useCallback((path: string) => localeHref(path), [localeHref])
  const isRtl = lang === 'ar'
  const panelRef = useRef<HTMLElement>(null)
  const [activeCategoryId, setActiveCategoryId] = useState(panel.columns[0]?.id ?? '')

  useEffect(() => {
    setActiveCategoryId(panel.columns[0]?.id ?? '')
  }, [panel.columns])

  const activeCategory = useMemo(
    () => panel.columns.find((col) => col.id === activeCategoryId) ?? panel.columns[0],
    [activeCategoryId, panel.columns],
  )

  const featuredItem = activeCategory?.items[0]
  const benefitPoints = activeCategory?.items.slice(0, 2).map((item) => item.description).filter(Boolean) ?? []

  const eyebrow = kind === 'industries' ? t('megaMenuUi.industryEyebrow') : t('megaMenuUi.moduleEyebrow')
  const exploreLabel = kind === 'industries' ? t('megaMenuUi.exploreIndustries') : t('megaMenuUi.exploreModules')
  const viewAllBottom =
    kind === 'industries' ? t('megaMenuUi.viewAllSolutions') : t('megaMenuUi.viewAllModules')
  const centerTitle = activeCategory
    ? `${formatCategoryLabel(activeCategory.title)} ${t('megaMenuUi.solutionsSuffix')}`
    : ''

  const solutionRows = useMemo(
    () => chunkSolutionRows(activeCategory?.items ?? []),
    [activeCategory?.items],
  )

  const selectCategory = (column: ResolvedMegaMenuColumn) => {
    setActiveCategoryId(column.id)
  }

  return (
    <nav
      ref={panelRef}
      className={`dm-mega-menu${isRtl ? ' dm-mega-menu--rtl' : ''}`}
      aria-label={ariaLabel}
      onMouseDown={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return
        const links = Array.from(
          panelRef.current?.querySelectorAll<HTMLElement>(
            'button.dm-mega-menu__category, a.dm-mega-menu__solution, a.dm-mega-menu__view-all-bottom, a.dm-mega-menu__featured-link, a.dm-mega-menu__link-action, a.dm-mega-menu__button-action, a.dm-mega-menu__sidebar-all',
          ) ?? [],
        )
        const idx = links.indexOf(document.activeElement as HTMLElement)
        if (idx === -1) return
        e.preventDefault()
        const next = e.key === 'ArrowDown' ? Math.min(idx + 1, links.length - 1) : Math.max(idx - 1, 0)
        links[next]?.focus()
      }}
    >
      <div className="dm-mega-menu__intro">
        <p className="dm-mega-menu__eyebrow">{eyebrow}</p>
        <h2 className="dm-mega-menu__heading">{panel.heading}</h2>
        <p className="dm-mega-menu__subheading">{panel.subheading}</p>
      </div>

      <div className="dm-mega-menu__body">
        <aside className="dm-mega-menu__sidebar" aria-label={exploreLabel}>
          <p className="dm-mega-menu__sidebar-label">{exploreLabel}</p>
          <ul className="dm-mega-menu__category-list" role="list">
            {panel.columns.map((column) => {
              const Icon = megaMenuCategoryIcon(kind, column.id)
              const isActive = column.id === activeCategory?.id
              return (
                <li key={column.id}>
                  <button
                    type="button"
                    className={`dm-mega-menu__category${isActive ? ' is-active' : ''}`}
                    aria-current={isActive ? 'true' : undefined}
                    onMouseEnter={() => selectCategory(column)}
                    onFocus={() => selectCategory(column)}
                    onClick={() => selectCategory(column)}
                  >
                    <Icon className="dm-mega-menu__category-icon" strokeWidth={1.85} aria-hidden />
                    <span className="dm-mega-menu__category-label">{formatCategoryLabel(column.title)}</span>
                  </button>
                </li>
              )
            })}
          </ul>
          <Link
            to={toHref(panel.viewAllHref)}
            className="dm-mega-menu__sidebar-all"
            onClick={onPick}
          >
            {panel.viewAllLabel.replace(/\s*[→←]\s*$/, '')}
          </Link>
        </aside>

        <section className="dm-mega-menu__solutions" aria-labelledby="dm-mega-menu-solutions-title">
          <h3 id="dm-mega-menu-solutions-title" className="dm-mega-menu__solutions-title">
            {centerTitle}
          </h3>
          <ul className="dm-mega-menu__solution-list" role="list">
            {solutionRows.map((row, rowIndex) => (
              <li key={`row-${rowIndex}`} className="dm-mega-menu__solution-row">
                {row.map((item) => {
                  const ItemIcon = megaMenuItemIcon(item.id, item.to)
                  return (
                    <div key={item.id} className="dm-mega-menu__solution-cell">
                      <Link to={toHref(item.to)} className="dm-mega-menu__solution" onClick={onPick}>
                        <ItemIcon className="dm-mega-menu__solution-icon" strokeWidth={1.75} aria-hidden />
                        <span className="dm-mega-menu__solution-copy">
                          <span className="dm-mega-menu__solution-title">{item.title}</span>
                          <span className="dm-mega-menu__solution-desc">{item.description}</span>
                        </span>
                        <ArrowRight className="dm-mega-menu__solution-arrow" strokeWidth={2} aria-hidden />
                      </Link>
                    </div>
                  )
                })}
                {row.length === 1 ? <div className="dm-mega-menu__solution-cell" aria-hidden /> : null}
              </li>
            ))}
          </ul>
          <Link to={toHref(panel.viewAllHref)} className="dm-mega-menu__view-all-bottom" onClick={onPick}>
            {viewAllBottom}
            <ArrowRight className="size-3.5" strokeWidth={2.25} aria-hidden />
          </Link>
        </section>

        {featuredItem ? (
          <aside className="dm-mega-menu__featured" aria-label={t('megaMenuUi.featuredBadge')}>
            <div className="dm-mega-menu__featured-inner">
              <div className="dm-mega-menu__featured-media">
                {featuredItem.image ? (
                  <img
                    src={featuredItem.image}
                    alt={featuredItem.imageAlt || featuredItem.title}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="dm-mega-menu__featured-placeholder" aria-hidden />
                )}
                <span className="dm-mega-menu__featured-badge">{t('megaMenuUi.featuredBadge')}</span>
              </div>
              <div className="dm-mega-menu__featured-body">
                <h4 className="dm-mega-menu__featured-title">{featuredItem.title}</h4>
                <ul className="dm-mega-menu__featured-points" role="list">
                  {benefitPoints.map((point, index) => (
                    <li key={`${featuredItem.id}-benefit-${index}`}>
                      <Check className="dm-mega-menu__featured-check" strokeWidth={2.5} aria-hidden />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <Link to={toHref(featuredItem.to)} className="dm-mega-menu__featured-link" onClick={onPick}>
                  {t('megaMenuUi.exploreSolution')} {featuredItem.title}
                  <ArrowRight className="size-3.5" strokeWidth={2.25} aria-hidden />
                </Link>
              </div>
            </div>
          </aside>
        ) : null}
      </div>

      <div className="dm-mega-menu__footer">
        <p className="dm-mega-menu__footer-prompt">
          <span className="dm-mega-menu__footer-icon-wrap">
            <Headphones className="dm-mega-menu__footer-icon" strokeWidth={2} aria-hidden />
          </span>
          <span className="dm-mega-menu__footer-copy">
            <strong>{t('megaMenuUi.notSureTitle')}</strong>
            <span className="dm-mega-menu__footer-support">{panel.footer.prompt}</span>
          </span>
        </p>
        <div className="dm-mega-menu__footer-actions">
          <Link to={toHref(panel.footer.linkHref)} className="dm-mega-menu__link-action" onClick={onPick}>
            {panel.footer.linkLabel}
          </Link>
          <Link to={toHref(panel.footer.buttonHref)} className="dm-mega-menu__button-action" onClick={onPick}>
            {panel.footer.buttonLabel}
          </Link>
        </div>
      </div>
    </nav>
  )
}

export function MegaMenuModulesPanel({ onPick }: { onPick: () => void }) {
  const panel = useResolvedMegaMenuPanel('modules')
  return (
    <MegaMenuPanel kind="modules" panel={panel} ariaLabel="Software by module" onPick={onPick} />
  )
}

export function MegaMenuIndustriesPanel({ onPick }: { onPick: () => void }) {
  const panel = useResolvedMegaMenuPanel('industries')
  return (
    <MegaMenuPanel kind="industries" panel={panel} ariaLabel="Software by industries" onPick={onPick} />
  )
}

type MobileMegaMenuAccordionProps = {
  kind: MegaMenuKind
  label: string
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
  resolveHref: (path: string) => string
}

export function MobileMegaMenuAccordion({
  kind,
  label,
  isOpen,
  onToggle,
  onClose,
  resolveHref,
}: MobileMegaMenuAccordionProps) {
  const panel = useResolvedMegaMenuPanel(kind)
  const { t } = useI18n()
  const [openCategoryId, setOpenCategoryId] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) setOpenCategoryId(null)
  }, [isOpen])

  return (
    <div className="dm-mega-mobile overflow-hidden rounded-xl border border-slate-200/90">
      <button
        type="button"
        className="flex w-full items-center justify-between px-3 py-3 text-left text-sm font-bold uppercase tracking-wide text-[#0f172a]"
        aria-expanded={isOpen}
        onClick={onToggle}
      >
        {label}
        <span
          className={`inline-flex shrink-0 origin-center transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`}
          aria-hidden
        >
          <ChevronDown className="size-4 text-brand" />
        </span>
      </button>
      {isOpen ? (
        <div className="dm-mega-mobile__panel max-h-[55vh] overflow-y-auto overflow-x-hidden">
          <p className="dm-mega-mobile__eyebrow">
            {kind === 'industries' ? t('megaMenuUi.industryEyebrow') : t('megaMenuUi.moduleEyebrow')}
          </p>
          <p className="dm-mega-mobile__heading">{panel.heading}</p>
          <p className="dm-mega-mobile__subheading">{panel.subheading}</p>

          {panel.columns.map((column) => {
            const Icon = megaMenuCategoryIcon(kind, column.id)
            const categoryOpen = openCategoryId === column.id
            const featured = column.items[0]
            return (
              <div key={column.id} className="border-t border-slate-200/90 bg-white">
                <button
                  type="button"
                  className={`flex w-full items-center gap-3 px-3 py-3 text-left text-sm font-semibold text-[#0f172a] transition-colors ${categoryOpen ? 'dm-mega-mobile__category-btn is-open' : 'hover:bg-[#fdf9f6]'}`}
                  aria-expanded={categoryOpen}
                  onClick={() => setOpenCategoryId((prev) => (prev === column.id ? null : column.id))}
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white">
                    <Icon className="size-4 text-brand" strokeWidth={1.85} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">{formatCategoryLabel(column.title)}</span>
                  <ChevronDown
                    className={`size-4 shrink-0 text-slate-400 transition-transform ${categoryOpen ? 'rotate-180' : ''}`}
                    aria-hidden
                  />
                </button>
                {categoryOpen ? (
                  <div className="border-t border-slate-200/90 bg-[#fdf9f6]">
                    {featured?.image ? (
                      <div className="relative mx-3 mt-3 overflow-hidden rounded-lg border border-slate-200">
                        <img
                          src={featured.image}
                          alt={featured.imageAlt || featured.title}
                          className="h-28 w-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                        <span className="absolute bottom-2 start-2 rounded bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">
                          {t('megaMenuUi.featuredBadge')}
                        </span>
                      </div>
                    ) : null}
                    <ul className="divide-y divide-slate-200/90">
                      {column.items.map((item) => (
                        <li key={item.id}>
                          <Link
                            to={resolveHref(item.to)}
                            className="dm-mega-mobile__item-link flex items-start gap-2 px-4 py-2.5 text-[13px] font-medium text-[#0f172a] transition-colors"
                            onClick={onClose}
                          >
                            <ArrowRight className="mt-0.5 size-3.5 shrink-0 text-brand" aria-hidden />
                            <span className="min-w-0">
                              <span className="block font-semibold">{item.title}</span>
                              <span className="mt-0.5 block text-xs text-slate-500">{item.description}</span>
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            )
          })}

          <div className="space-y-2 border-t border-slate-200/90 bg-white px-3 py-3">
            <Link
              to={resolveHref(panel.viewAllHref)}
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand"
              onClick={onClose}
            >
              {panel.viewAllLabel}
            </Link>
            <p className="text-xs leading-relaxed text-slate-500">
              <strong className="text-[#0f172a]">{t('megaMenuUi.notSureTitle')}</strong>
              <span className="mt-0.5 block">{panel.footer.prompt}</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                to={resolveHref(panel.footer.linkHref)}
                className="text-sm font-semibold text-brand"
                onClick={onClose}
              >
                {panel.footer.linkLabel}
              </Link>
              <Link
                to={resolveHref(panel.footer.buttonHref)}
                className="dm-mega-mobile__cta-outline inline-flex min-h-9 items-center rounded-lg border px-3 py-1.5 text-sm font-semibold"
                onClick={onClose}
              >
                {panel.footer.buttonLabel}
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
