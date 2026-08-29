import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { useCms } from '../cms/CmsContext'
import type { MegaMenusCmsDoc, ResolvedMegaMenuPanel } from '../cms/megaMenuTypes'
import { resolvePublishedMegaMenuPanel } from '../data/resolvePublishedMegaMenus'
import { useI18n } from '../i18n/I18nProvider'
import { useLocale } from '../locale/LocaleContext'
import { useOptionalCity } from '../locale/CityContext'
import './header-mega-menu.css'

type MegaMenuPanelProps = {
  panel: ResolvedMegaMenuPanel
  ariaLabel: string
  onPick: () => void
}

function MegaMenuPanel({ panel, ariaLabel, onPick }: MegaMenuPanelProps) {
  const { lang } = useI18n()
  const { href: localeHref } = useLocale()
  const city = useOptionalCity()
  const toHref = (path: string) => city?.cityHref(localeHref(path)) || localeHref(path)
  const isRtl = lang === 'ar'
  const panelRef = useRef<HTMLElement>(null)

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
            'a.dm-mega-menu__item, a.dm-mega-menu__view-all, a.dm-mega-menu__link-action, a.dm-mega-menu__button-action',
          ) ?? [],
        )
        const idx = links.indexOf(document.activeElement as HTMLElement)
        if (idx === -1) return
        e.preventDefault()
        const next = e.key === 'ArrowDown' ? Math.min(idx + 1, links.length - 1) : Math.max(idx - 1, 0)
        links[next]?.focus()
      }}
    >
      <div className="dm-mega-menu__header">
        <div className="dm-mega-menu__header-copy">
          <h2 className="dm-mega-menu__heading">{panel.heading}</h2>
          <p className="dm-mega-menu__subheading">{panel.subheading}</p>
        </div>
        <Link to={localeHref(panel.viewAllHref)} className="dm-mega-menu__view-all" onClick={onPick}>
          {panel.viewAllLabel}
        </Link>
      </div>

      <div className="dm-mega-menu__grid">
        {panel.columns.map((column) => (
          <div key={column.id} className="dm-mega-menu__column">
            <h3 className="dm-mega-menu__column-title">{column.title}</h3>
            <ul className="dm-mega-menu__list">
              {column.items.map((item) => (
                <li key={item.id}>
                  <Link to={toHref(item.to)} className="dm-mega-menu__item" onClick={onPick}>
                    {item.image ? (
                      <span className="dm-mega-menu__thumb">
                        <img src={item.image} alt={item.imageAlt} loading="lazy" decoding="async" />
                      </span>
                    ) : null}
                    <span className="dm-mega-menu__copy">
                      <span className="dm-mega-menu__title">{item.title}</span>
                      <span className="dm-mega-menu__desc">{item.description}</span>
                    </span>
                    <span className="dm-mega-menu__arrow" aria-hidden>
                      {isRtl ? '←' : '→'}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="dm-mega-menu__footer">
        <p className="dm-mega-menu__footer-prompt">
          <Sparkles className="size-4" strokeWidth={2.25} aria-hidden />
          {panel.footer.prompt}
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

function useMegaMenuPanel(kind: 'modules' | 'industries'): ResolvedMegaMenuPanel {
  const { lang } = useI18n()
  const { data } = useCms()
  const doc = data?.megaMenus as MegaMenusCmsDoc | undefined
  return resolvePublishedMegaMenuPanel(doc, kind, lang)
}

export function MegaMenuModulesPanel({ onPick }: { onPick: () => void }) {
  const panel = useMegaMenuPanel('modules')
  return <MegaMenuPanel panel={panel} ariaLabel="Software by module" onPick={onPick} />
}

export function MegaMenuIndustriesPanel({ onPick }: { onPick: () => void }) {
  const panel = useMegaMenuPanel('industries')
  return <MegaMenuPanel panel={panel} ariaLabel="Software by industries" onPick={onPick} />
}
