import { useId, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  Headphones,
  Layers,
} from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import { megaModuleLabel, megaIndustryLabel } from '../i18n/megaLabels'
import { useLocale } from '../locale/LocaleContext'
import { useOptionalCity } from '../locale/CityContext'
import {
  getIndustryGroupFeaturedImage,
  getIndustryGroupSolutions,
  getPrimaryModuleMegaCards,
  industryMegaAllLink,
  industryMegaGroups,
} from '../data/megaMenuPremium'
import './header-mega-menu.css'

type PanelProps = { onPick: () => void }

function useMegaHref() {
  const { href: localeHref } = useLocale()
  const city = useOptionalCity()
  return (path: string) => city?.cityHref(localeHref(path)) || localeHref(path)
}

function MegaMenuFooter({ onPick }: { onPick: () => void }) {
  const toHref = useMegaHref()
  return (
    <div className="dm-mega-menu__footer">
      <div className="dm-mega-menu__footer-help">
        <span className="dm-mega-menu__footer-icon" aria-hidden>
          <Headphones strokeWidth={2} />
        </span>
        <div className="min-w-0">
          <p className="dm-mega-menu__footer-prompt">Not sure which solution fits?</p>
          <p className="dm-mega-menu__footer-sub">
            Our experts will help you choose the right software for your business.
          </p>
        </div>
      </div>
      <div className="dm-mega-menu__footer-actions">
        <span className="dm-mega-menu__footer-aside">Talk to an expert</span>
        <Link to={toHref('/contact')} className="dm-mega-menu__button-action" onClick={onPick}>
          Book a consultation
        </Link>
      </div>
    </div>
  )
}

function MegaMenuIntro({
  eyebrow,
  heading,
  subheading,
}: {
  eyebrow: string
  heading: string
  subheading: string
}) {
  return (
    <div className="dm-mega-menu__intro">
      <p className="dm-mega-menu__eyebrow">{eyebrow}</p>
      <h2 className="dm-mega-menu__heading">{heading}</h2>
      <p className="dm-mega-menu__subheading">{subheading}</p>
    </div>
  )
}

export function MegaMenuModulesPanel({ onPick }: PanelProps) {
  const { lang } = useI18n()
  const toHref = useMegaHref()
  const isRtl = lang === 'ar'
  const panelRef = useRef<HTMLElement>(null)
  const cards = useMemo(() => getPrimaryModuleMegaCards(), [])

  return (
    <nav
      ref={panelRef}
      className={`dm-mega-menu dm-mega-menu--modules${isRtl ? ' dm-mega-menu--rtl' : ''}`}
      aria-label="Software by module"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <MegaMenuIntro
        eyebrow="BUSINESS SOFTWARE"
        heading="Everything you need to run your business"
        subheading="Manage finance, inventory, sales, people and operations from one connected ERP platform."
      />

      <div className="dm-mega-menu__modules-layout">
        <div className="dm-mega-menu__module-grid" role="list">
          {cards.map((item) => {
            const Icon = item.icon
            const title = megaModuleLabel(lang, item.slug, item.labelEn)
            return (
              <Link
                key={item.slug}
                role="listitem"
                to={toHref(item.to)}
                className="dm-mega-menu__module-card"
                onClick={onPick}
              >
                <span className="dm-mega-menu__module-icon" aria-hidden>
                  <Icon strokeWidth={1.75} />
                </span>
                <span className="dm-mega-menu__module-copy">
                  <span className="dm-mega-menu__module-title">{title}</span>
                  <span className="dm-mega-menu__module-desc">{item.description}</span>
                </span>
                <span className="dm-mega-menu__module-arrow" aria-hidden>
                  <ArrowRight strokeWidth={2.25} />
                </span>
              </Link>
            )
          })}
        </div>

        <aside className="dm-mega-menu__suite-card">
          <p className="dm-mega-menu__suite-badge">COMPLETE ERP SUITE</p>
          <h3 className="dm-mega-menu__suite-heading">
            One platform.
            <br />
            Every business function connected.
          </h3>
          <ul className="dm-mega-menu__suite-benefits">
            <li>
              <Check strokeWidth={2.5} aria-hidden />
              Centralized business data
            </li>
            <li>
              <Check strokeWidth={2.5} aria-hidden />
              Real-time reporting
            </li>
            <li>
              <Check strokeWidth={2.5} aria-hidden />
              Role-based workflows
            </li>
          </ul>
          <Link to={toHref('/#modules')} className="dm-mega-menu__suite-cta" onClick={onPick}>
            Explore All Modules
            <ArrowRight strokeWidth={2.25} aria-hidden />
          </Link>
          <span className="dm-mega-menu__suite-deco" aria-hidden>
            <Layers strokeWidth={1.25} />
          </span>
        </aside>
      </div>

      <MegaMenuFooter onPick={onPick} />
    </nav>
  )
}

export function MegaMenuIndustriesPanel({ onPick }: PanelProps) {
  const { lang } = useI18n()
  const toHref = useMegaHref()
  const isRtl = lang === 'ar'
  const baseId = useId()
  const [activeId, setActiveId] = useState(industryMegaGroups[2]?.id ?? industryMegaGroups[0].id)
  const activeGroup = industryMegaGroups.find((g) => g.id === activeId) ?? industryMegaGroups[0]
  const solutions = useMemo(() => getIndustryGroupSolutions(activeGroup.id, 4), [activeGroup.id])
  const featuredImage = useMemo(() => getIndustryGroupFeaturedImage(activeGroup.id), [activeGroup.id])
  const LayoutGridIcon = industryMegaAllLink.icon
  const ActiveGroupIcon = activeGroup.icon

  return (
    <nav
      className={`dm-mega-menu dm-mega-menu--industries${isRtl ? ' dm-mega-menu--rtl' : ''}`}
      aria-label="Software by industries"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <MegaMenuIntro
        eyebrow="INDUSTRY SOLUTIONS"
        heading="Software built around how your business works"
        subheading="Explore purpose-built ERP, operations and management software for your industry."
      />

      <div className="dm-mega-menu__industries-layout">
        <aside className="dm-mega-menu__industry-nav" aria-label="Explore industries">
          <p className="dm-mega-menu__col-label">Explore industries</p>
          <ul className="dm-mega-menu__industry-cats">
            {industryMegaGroups.map((group) => {
              const Icon = group.icon
              const active = group.id === activeGroup.id
              return (
                <li key={group.id}>
                  <button
                    type="button"
                    id={`${baseId}-cat-${group.id}`}
                    className={`dm-mega-menu__industry-cat${active ? ' is-active' : ''}`}
                    aria-pressed={active}
                    aria-controls={`${baseId}-solutions`}
                    onMouseEnter={() => setActiveId(group.id)}
                    onFocus={() => setActiveId(group.id)}
                    onClick={() => setActiveId(group.id)}
                  >
                    <span className="dm-mega-menu__industry-cat-icon" aria-hidden>
                      <Icon strokeWidth={1.75} />
                    </span>
                    <span className="dm-mega-menu__industry-cat-label">{group.title}</span>
                  </button>
                </li>
              )
            })}
            <li>
              <Link
                to={toHref(industryMegaAllLink.to)}
                className="dm-mega-menu__industry-cat"
                onClick={onPick}
              >
                <span className="dm-mega-menu__industry-cat-icon" aria-hidden>
                  <LayoutGridIcon strokeWidth={1.75} />
                </span>
                <span className="dm-mega-menu__industry-cat-label">{industryMegaAllLink.title}</span>
              </Link>
            </li>
          </ul>
        </aside>

        <div className="dm-mega-menu__industry-solutions" id={`${baseId}-solutions`}>
          <h3 className="dm-mega-menu__solutions-title">{activeGroup.title} Solutions</h3>
          <div className="dm-mega-menu__solution-grid">
            {solutions.map((item) => {
              const title = megaIndustryLabel(lang, item.slug, item.labelEn)
              return (
                <Link
                  key={item.slug}
                  to={toHref(item.to)}
                  className="dm-mega-menu__solution-card"
                  onClick={onPick}
                >
                  <span className="dm-mega-menu__solution-icon" aria-hidden>
                    <ActiveGroupIcon strokeWidth={1.75} />
                  </span>
                  <span className="dm-mega-menu__solution-copy">
                    <span className="dm-mega-menu__solution-title">{title}</span>
                    <span className="dm-mega-menu__solution-desc">{item.description}</span>
                  </span>
                  <span className="dm-mega-menu__solution-arrow" aria-hidden>
                    <ArrowRight strokeWidth={2.25} />
                  </span>
                </Link>
              )
            })}
          </div>
          <Link to={toHref('/industries')} className="dm-mega-menu__view-all" onClick={onPick}>
            View all industry solutions
            <ArrowRight strokeWidth={2.25} aria-hidden />
          </Link>
        </div>

        <aside className="dm-mega-menu__featured-card">
          <div className="dm-mega-menu__featured-media">
            {featuredImage.src ? (
              <img
                src={featuredImage.src}
                alt={featuredImage.alt}
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ) : null}
            <div className="dm-mega-menu__featured-media-fallback" aria-hidden />
            <span className="dm-mega-menu__featured-badge">{activeGroup.featured.badge}</span>
          </div>
          <div className="dm-mega-menu__featured-body">
            <h3 className="dm-mega-menu__featured-heading">{activeGroup.featured.heading}</h3>
            <ul className="dm-mega-menu__featured-benefits">
              {activeGroup.featured.benefits.map((benefit) => (
                <li key={benefit}>
                  <Check strokeWidth={2.5} aria-hidden />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
            <Link
              to={toHref(activeGroup.featured.ctaTo)}
              className="dm-mega-menu__featured-cta"
              onClick={onPick}
            >
              {activeGroup.featured.ctaLabel}
              <ArrowRight strokeWidth={2.25} aria-hidden />
            </Link>
          </div>
        </aside>
      </div>

      <MegaMenuFooter onPick={onPick} />
    </nav>
  )
}
