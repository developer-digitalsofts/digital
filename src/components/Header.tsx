import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, Clock, Mail, Menu, Search, X } from 'lucide-react'
import { industryCategories, industryCategoryTitleEn, moduleMegaItems } from '../data/megaMenu'
import { MegaMenuIndustriesPanel, MegaMenuModulesPanel } from './HeaderMegaMenu'
import { useGetDemo } from '../context/GetDemoContext'
import { CmsLink } from './CmsLink'
import { headerGetDemoButtonClass, headerShellDefault, headerShellScrolled } from '../ui/saas'
import { useI18n } from '../i18n/I18nProvider'
import { megaIndustryCatTitle, megaIndustryLabel, megaModuleLabel } from '../i18n/megaLabels'
import { SITE_LOGO_SRC, BRAND_DEEP_BG } from '../constants'
import { pageShellClass } from '../ui/pageShell'
import { useCms } from '../cms/CmsContext'
import { useRegionalSettings } from '../cms/useRegionalSettings'
import { pick } from '../cms/pick'
import { isTopBarVisibleFromSections, parsePageSections } from '../cms/pageSections'
import type { CmsHeader, CmsHeaderNavLink } from '../cms/types'
import { LocaleSelector } from './LocaleSelector'
import './header-layout.css'

type MegaKey = 'module' | 'industry'

function TopBar({ header }: { header?: CmsHeader }) {
  const { lang } = useI18n()
  const site = useRegionalSettings()
  const tb = header?.topBar
  const email = tb?.email ?? site.primaryEmail
  const hours = tb?.hours ? pick(tb.hours, lang) : site.workingHours
  const phoneCta = tb?.phoneCta ? pick(tb.phoneCta, lang) : lang === 'ar' ? 'تحدث معنا:' : 'Talk to Us:'
  const phoneDisplay = tb?.phoneDisplay ?? site.phoneDisplay
  const phoneHref = tb?.phoneHref ?? site.phoneHref
  return (
    <div
      className="border-b border-white/10 text-[11px] leading-snug text-slate-200 antialiased sm:text-[12px]"
      style={{ backgroundColor: BRAND_DEEP_BG }}
    >
      <div className={`${pageShellClass} flex flex-col gap-0.5 py-1 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:py-1.5`}>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5">
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center gap-1.5 text-slate-200 transition-colors hover:text-white"
          >
            <Mail className="size-3 shrink-0 text-brand sm:size-3.5" aria-hidden />
            <span className="font-medium">{email}</span>
          </a>
          <span className="hidden h-3 w-px bg-white/15 sm:block" aria-hidden />
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-3 shrink-0 text-brand sm:size-3.5" aria-hidden />
            <span className="font-medium">{hours}</span>
          </span>
        </div>
        <a
          href={phoneHref}
          className="shrink-0 text-[11px] font-semibold tracking-tight text-white transition-colors hover:text-slate-100 sm:text-[12px]"
        >
          {phoneCta} {phoneDisplay}
        </a>
      </div>
    </div>
  )
}

/** Home / Contact — color only, no hover underline. */
const navLinkBase =
  'dm-header__nav-link inline-flex items-center gap-1 whitespace-nowrap pb-0.5 text-[11px] font-bold uppercase tracking-wide text-[#0f172a] transition-colors duration-200 hover:text-brand min-[1180px]:text-[12px]'

/** Module / Industries triggers — color only, no underline on hover or when open. */
function navMegaTrigger(active: boolean) {
  return [
    'dm-header__nav-trigger inline-flex items-center gap-1 whitespace-nowrap border-0 bg-transparent pb-0.5 text-[11px] font-bold uppercase tracking-wide transition-colors duration-200 min-[1180px]:text-[12px]',
    active ? 'cursor-pointer text-brand' : 'cursor-pointer text-[#0f172a] hover:text-brand',
  ].join(' ')
}

type MegaMenuTriggerProps = {
  id: string
  ariaControlsId: string
  label: string
  isOpen: boolean
  onToggle: () => void
}

/** Desktop mega nav trigger: open = chevron up (`rotate-180`), closed = chevron down. */
function MegaMenuTrigger({ id, ariaControlsId, label, isOpen, onToggle }: MegaMenuTriggerProps) {
  return (
    <button
      type="button"
      id={id}
      aria-expanded={isOpen}
      aria-controls={ariaControlsId}
      className={navMegaTrigger(isOpen)}
      onClick={onToggle}
    >
      {label}
      <span
        className={`inline-flex shrink-0 origin-center transition-transform duration-200 ease-out motion-reduce:transition-none ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        aria-hidden
      >
        <ChevronDown
          className="size-3.5 text-brand"
          strokeWidth={2.5}
          aria-hidden
        />
      </span>
    </button>
  )
}

type HeaderProps = {
  onOpenSearch: () => void
}

export function Header({ onOpenSearch }: HeaderProps) {
  const { lang, t, toggleLang } = useI18n()
  const { data } = useCms()
  const header = data?.header as CmsHeader | undefined
  const sections = useMemo(() => parsePageSections(data?.pageSections), [data?.pageSections])
  const showTopBar = (header?.showTopBar !== false) && isTopBarVisibleFromSections(sections)
  const navHome = header?.nav?.home ? pick(header.nav.home, lang) : t('nav.home')
  const navModules = header?.nav?.modules ? pick(header.nav.modules, lang) : t('nav.modules')
  const navIndustries = header?.nav?.industries ? pick(header.nav.industries, lang) : t('nav.industries')
  const navContact = header?.nav?.contact ? pick(header.nav.contact, lang) : t('nav.contact')
  const langSwitch = header?.nav?.arabicToggle ? pick(header.nav.arabicToggle, lang) : lang === 'en' ? t('nav.arabic') : 'English version'
  const showSearch = header?.showSearch !== false
  const logoSrc = header?.logoUrl?.trim() || SITE_LOGO_SRC
  const navStyle = header?.navStyle === 'simple' ? 'simple' : 'mega'
  const brandName = header?.branding?.siteName
  const brandTagline = header?.branding?.tagline
  const simpleNavLinks = useMemo(() => {
    const fromHeader = Array.isArray(header?.navLinks) ? header.navLinks : []
    const fromPages = Array.isArray(data?.navigation?.headerLinks)
      ? data!.navigation!.headerLinks!.filter((l) => l.source === 'cms-page' || !header?.navLinks?.some((h) => h.id === l.id))
      : []
    const merged = [...fromHeader]
    for (const link of fromPages) {
      if (!merged.some((m) => m.id === link.id || m.href === link.href)) merged.push(link as CmsHeaderNavLink)
    }
    return merged
      .filter((l): l is CmsHeaderNavLink => Boolean(l && typeof l === 'object' && typeof l.id === 'string'))
      .filter((l) => l.active !== false)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  }, [header?.navLinks, data?.navigation?.headerLinks])

  const supplementalHeaderLinks = useMemo(() => {
    const rows = data?.navigation?.headerLinks
    if (!Array.isArray(rows)) return []
    return rows
      .filter((l) => l && l.active !== false)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  }, [data?.navigation?.headerLinks])
  const showLangSwitcher = header?.showLangSwitcher !== false
  const getInTouch = header?.getInTouch
  const showGetInTouch =
    getInTouch?.show === true &&
    getInTouch.href?.trim() &&
    (getInTouch.text?.en?.trim() || getInTouch.text?.ar?.trim())
  const getInTouchLabel = getInTouch?.text ? pick(getInTouch.text, lang) : ''
  const location = useLocation()
  const headerShellRef = useRef<HTMLDivElement>(null)
  const [mega, setMega] = useState<MegaKey | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileModulesOpen, setMobileModulesOpen] = useState(false)
  const [mobileIndustriesOpen, setMobileIndustriesOpen] = useState(false)
  const [mobileIndustryCat, setMobileIndustryCat] = useState<string | null>(null)
  const { openDemo } = useGetDemo()
  const [scrolled, setScrolled] = useState(false)
  const closeMega = useCallback(() => {
    setMega(null)
  }, [])

  /** Same item = close; other key = switch to that mega (previous closes). */
  const toggleMega = useCallback((k: MegaKey) => {
    setMega((prev) => (prev === k ? null : k))
  }, [])

  const closeMobile = useCallback(() => {
    setMobileOpen(false)
    setMobileModulesOpen(false)
    setMobileIndustriesOpen(false)
    setMobileIndustryCat(null)
    closeMega()
  }, [closeMega])

  const handleOpenDemo = useCallback(() => {
    closeMobile()
    openDemo()
  }, [closeMobile, openDemo])

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMobile()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen, closeMobile])

  useEffect(() => {
    closeMega()
  }, [location.pathname, closeMega])

  useEffect(() => {
    closeMega()
    closeMobile()
  }, [lang, closeMega, closeMobile])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (mega == null) return
    const onPointerDownOutside = (e: PointerEvent) => {
      const shell = headerShellRef.current
      if (!shell) return
      if (!shell.contains(e.target as Node)) closeMega()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMega()
    }
    document.addEventListener('pointerdown', onPointerDownOutside, true)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointerDownOutside, true)
      document.removeEventListener('keydown', onKey)
    }
  }, [mega, closeMega])

  return (
    <>
      {showTopBar ? <TopBar header={header} /> : null}

      <div
        ref={headerShellRef}
        className={`relative ${scrolled ? headerShellScrolled : headerShellDefault}`}
      >
        <div className="dm-header__container">
          <div className="dm-header__bar">
            <Link
              to="/"
              className="dm-header__logo isolate flex shrink-0 items-center gap-2 bg-transparent transition-opacity duration-200 hover:opacity-90"
              onClick={() => {
                closeMega()
                closeMobile()
              }}
            >
              <img
                src={logoSrc}
                alt={brandName && (brandName.en || brandName.ar) ? pick(brandName, lang) : 'DigitalManager'}
                className="dm-header__logo-img bg-transparent rtl:object-right"
                width={200}
                height={58}
                loading="eager"
                decoding="async"
              />
              {brandName && (brandName.en || brandName.ar) ? (
                <span className="hidden min-w-0 flex-col xl:flex">
                  <span className="truncate font-heading text-sm font-bold leading-tight tracking-tight text-[#0f172a]">
                    {pick(brandName, lang)}
                  </span>
                  {brandTagline && (brandTagline.en || brandTagline.ar) ? (
                    <span className="truncate text-[11px] font-medium leading-snug text-slate-500">
                      {pick(brandTagline, lang)}
                    </span>
                  ) : null}
                </span>
              ) : null}
            </Link>

            <nav className="dm-header__nav" aria-label="Primary">
              {navStyle === 'simple' && simpleNavLinks.length > 0 ? (
                <ul className="dm-header__nav-list">
                  {simpleNavLinks.map((item) => (
                    <li key={item.id}>
                      {/^https?:\/\//i.test(item.href.trim()) ? (
                        <a
                          href={item.href.trim()}
                          className={navLinkBase}
                          onClick={closeMega}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {pick(item.label, lang)}
                        </a>
                      ) : (
                        <NavLink
                          to={item.href.trim()}
                          end={item.href.trim() === '/'}
                          onClick={closeMega}
                          className={({ isActive }) => `${navLinkBase} ${isActive ? 'text-brand' : ''}`}
                        >
                          {pick(item.label, lang)}
                        </NavLink>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <ul className="dm-header__nav-list">
                  <li>
                    <NavLink
                      to="/"
                      end
                      onClick={closeMega}
                      className={({ isActive }) =>
                        `${navLinkBase} ${isActive ? 'text-brand' : ''}`
                      }
                    >
                      {navHome}
                    </NavLink>
                  </li>
                  <li>
                    <MegaMenuTrigger
                      id="nav-mega-modules-trigger"
                      ariaControlsId="nav-mega-modules-panel"
                      label={navModules}
                      isOpen={mega === 'module'}
                      onToggle={() => toggleMega('module')}
                    />
                  </li>
                  <li>
                    <MegaMenuTrigger
                      id="nav-mega-industries-trigger"
                      ariaControlsId="nav-mega-industries-panel"
                      label={navIndustries}
                      isOpen={mega === 'industry'}
                      onToggle={() => toggleMega('industry')}
                    />
                  </li>
                  <li>
                    <NavLink
                      to="/contact"
                      onClick={closeMega}
                      className={({ isActive }) =>
                        `${navLinkBase} ${isActive ? 'text-brand' : ''}`
                      }
                    >
                      {navContact}
                    </NavLink>
                  </li>
                  {supplementalHeaderLinks.map((item) => (
                    <li key={item.id}>
                      <CmsLink
                        to={item.href}
                        onClick={closeMega}
                        className={`${navLinkBase} ${(item as { highlightAsCta?: boolean }).highlightAsCta ? 'text-brand' : ''}`}
                      >
                        {pick(item.label, lang)}
                      </CmsLink>
                    </li>
                  ))}
                </ul>
              )}
            </nav>

            <div className="dm-header__actions">
              <LocaleSelector compact />
              {showLangSwitcher ? (
                <button
                  type="button"
                  onClick={() => {
                    closeMega()
                    toggleLang()
                  }}
                  className="dm-header__lang-btn transition-colors hover:bg-slate-100"
                >
                  {langSwitch}
                </button>
              ) : null}
              {showGetInTouch ? (
                <CmsLink
                  to={getInTouch!.href.trim()}
                  className="inline-flex items-center rounded-xl border-2 border-brand px-2.5 py-1 text-[11px] font-bold text-brand transition-colors hover:bg-orange-50"
                  onClick={() => {
                    closeMega()
                    closeMobile()
                  }}
                >
                  {getInTouchLabel}
                </CmsLink>
              ) : null}
              {showSearch ? (
                <button
                  type="button"
                  className="dm-header__search-btn text-slate-900 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  aria-label="Search"
                  onClick={() => {
                    closeMega()
                    onOpenSearch()
                  }}
                >
                  <Search className="size-[1.05rem]" strokeWidth={2.25} />
                </button>
              ) : null}
              <button
                type="button"
                className={`${headerGetDemoButtonClass} dm-header__demo-btn`}
                onClick={handleOpenDemo}
              >
                Get Demo
              </button>
            </div>

            <div className="dm-header__mobile">
              {showLangSwitcher ? (
                <button
                  type="button"
                  onClick={() => {
                    closeMega()
                    toggleLang()
                  }}
                  className="rounded-lg px-2 py-1.5 text-xs font-bold text-brand"
                >
                  {lang === 'en' ? 'AR' : 'EN'}
                </button>
              ) : null}
              {showGetInTouch ? (
                <CmsLink
                  to={getInTouch!.href.trim()}
                  className="rounded-lg border border-brand px-2 py-1 text-[11px] font-bold text-brand"
                  onClick={() => {
                    closeMega()
                    closeMobile()
                  }}
                >
                  {getInTouchLabel}
                </CmsLink>
              ) : null}
              {showSearch ? (
                <button
                  type="button"
                  className="rounded-lg p-2 text-slate-900 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  aria-label="Search"
                  onClick={() => {
                    closeMega()
                    onOpenSearch()
                  }}
                >
                  <Search className="size-5" />
                </button>
              ) : null}
              <button
                type="button"
                className={`${headerGetDemoButtonClass} min-h-[36px] px-2.5 py-1.5 text-[11px] sm:min-h-[40px] sm:px-3.5 sm:py-2 sm:text-xs`}
                onClick={handleOpenDemo}
              >
                Get Demo
              </button>
              <button
                type="button"
                className="rounded-lg p-2 text-brand transition-colors hover:bg-orange-50 hover:text-brand-dark"
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setMobileOpen((v) => !v)}
              >
                {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
              </button>
            </div>
          </div>
        </div>

        {navStyle !== 'simple' && mega === 'module' && (
          <div
            id="nav-mega-modules-panel"
            role="presentation"
            data-mega="module"
            className="dm-mega-menu-wrap"
            aria-labelledby="nav-mega-modules-trigger"
          >
            <MegaMenuModulesPanel key={`mega-mod-${lang}`} onPick={closeMega} />
          </div>
        )}
        {navStyle !== 'simple' && mega === 'industry' && (
          <div
            id="nav-mega-industries-panel"
            role="presentation"
            data-mega="industry"
            className="dm-mega-menu-wrap"
            aria-labelledby="nav-mega-industries-trigger"
          >
            <MegaMenuIndustriesPanel key={`mega-ind-${lang}`} onPick={closeMega} />
          </div>
        )}

        {mobileOpen && (
          <div className="animate-fade-up max-h-[min(70dvh,520px)] overflow-y-auto overscroll-contain border-t border-slate-100 bg-white px-3 py-3 motion-reduce:animate-none min-[1180px]:hidden">
            <nav className="flex flex-col gap-0.5" aria-label="Mobile">
              {navStyle === 'simple' && simpleNavLinks.length > 0
                ? simpleNavLinks.map((item) => (
                    <div key={item.id}>
                      {/^https?:\/\//i.test(item.href.trim()) ? (
                        <a
                          href={item.href.trim()}
                          className="block rounded-lg px-3 py-2.5 text-sm font-bold uppercase tracking-wide text-[#0f172a] hover:bg-slate-100"
                          onClick={closeMobile}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {pick(item.label, lang)}
                        </a>
                      ) : (
                        <NavLink
                          to={item.href.trim()}
                          end={item.href.trim() === '/'}
                          className="block rounded-lg px-3 py-2.5 text-sm font-bold uppercase tracking-wide text-[#0f172a] hover:bg-slate-100"
                          onClick={closeMobile}
                        >
                          {pick(item.label, lang)}
                        </NavLink>
                      )}
                    </div>
                  ))
                : (
                  <>
                    <NavLink
                      to="/"
                      end
                      className="rounded-lg px-3 py-2.5 text-sm font-bold uppercase tracking-wide text-[#0f172a] hover:bg-slate-100"
                      onClick={closeMobile}
                    >
                      {navHome}
                    </NavLink>
                    <div className="overflow-hidden rounded-xl border border-slate-200/90">
                      <button
                        type="button"
                        className="flex w-full items-center justify-between px-3 py-3 text-left text-sm font-bold uppercase tracking-wide text-[#0f172a]"
                        aria-expanded={mobileModulesOpen}
                        onClick={() => setMobileModulesOpen((v) => !v)}
                      >
                        {navModules}
                        <span
                          className={`inline-flex shrink-0 origin-center transition-transform duration-200 ${mobileModulesOpen ? 'rotate-180' : 'rotate-0'}`}
                          aria-hidden
                        >
                          <ChevronDown className="size-4 text-brand" />
                        </span>
                      </button>
                      {mobileModulesOpen && (
                        <ul className="max-h-[50vh] divide-y divide-slate-100 overflow-y-auto border-t border-slate-100 bg-white">
                          {moduleMegaItems.map((item) => (
                            <li key={item.slug}>
                              <Link
                                to={item.to}
                                className="group flex items-center gap-3 px-3 py-3 text-sm font-bold text-slate-800 transition-colors hover:bg-[#fff7f3] hover:text-brand"
                                onClick={closeMobile}
                              >
                                <span
                                  className={`flex size-9 shrink-0 items-center justify-center rounded-full shadow-sm transition-transform group-hover:scale-110 ${item.iconWrap}`}
                                >
                                  <item.icon className="size-4 text-white" strokeWidth={2.25} aria-hidden />
                                </span>
                                <span className="min-w-0 flex-1 text-start">
                                  {megaModuleLabel(lang, item.slug, item.labelEn)}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="overflow-hidden rounded-xl border border-slate-200/90">
                      <button
                        type="button"
                        className="flex w-full items-center justify-between px-3 py-3 text-left text-sm font-bold uppercase tracking-wide text-[#0f172a]"
                        aria-expanded={mobileIndustriesOpen}
                        onClick={() => setMobileIndustriesOpen((v) => !v)}
                      >
                        {navIndustries}
                        <span
                          className={`inline-flex shrink-0 origin-center transition-transform duration-200 ${mobileIndustriesOpen ? 'rotate-180' : 'rotate-0'}`}
                          aria-hidden
                        >
                          <ChevronDown className="size-4 text-brand" />
                        </span>
                      </button>
                      {mobileIndustriesOpen && (
                        <div className="max-h-[50vh] divide-y divide-slate-100 overflow-y-auto border-t border-slate-100 bg-white">
                          {industryCategories.map((cat) => (
                            <div key={cat.id}>
                              <button
                                type="button"
                                className="group flex w-full items-center gap-3 px-3 py-3 text-left text-sm font-bold text-slate-800 transition-colors hover:bg-[#fff7f3]"
                                onClick={() =>
                                  setMobileIndustryCat((prev) => (prev === cat.id ? null : cat.id))
                                }
                              >
                                <span
                                  className={`flex size-8 shrink-0 items-center justify-center rounded-full shadow-sm transition-transform group-hover:scale-110 ${cat.iconWrap}`}
                                >
                                  <cat.icon className="size-3.5 text-white" strokeWidth={2.25} aria-hidden />
                                </span>
                                <span className="min-w-0 flex-1 text-start group-hover:text-brand">
                                  {megaIndustryCatTitle(lang, cat.id, industryCategoryTitleEn(cat.id))}
                                </span>
                                <span
                                  className={`inline-flex shrink-0 origin-center transition-transform duration-200 ${mobileIndustryCat === cat.id ? 'rotate-180' : 'rotate-0'}`}
                                  aria-hidden
                                >
                                  <ChevronDown className="size-4 text-brand" />
                                </span>
                              </button>
                              {mobileIndustryCat === cat.id && (
                                <ul className="divide-y divide-slate-100 border-t border-slate-100 bg-slate-50/50">
                                  {cat.links.map((link) => (
                                    <li key={link.slug}>
                                      <Link
                                        to={link.to}
                                        className="flex items-center justify-between px-4 py-2.5 ps-12 text-[13px] font-medium text-slate-700 transition-colors hover:bg-[#fff7f3] hover:text-brand"
                                        onClick={closeMobile}
                                      >
                                        {megaIndustryLabel(lang, link.slug, link.labelEn)}
                                        <span className="text-slate-300">→</span>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <NavLink
                      to="/contact"
                      className="rounded-lg px-3 py-2.5 text-sm font-bold uppercase tracking-wide text-[#0f172a] hover:bg-slate-100"
                      onClick={closeMobile}
                    >
                      {navContact}
                    </NavLink>
                    {supplementalHeaderLinks.map((item) => (
                      <CmsLink
                        key={item.id}
                        to={item.href}
                        className="block rounded-lg px-3 py-2.5 text-sm font-bold uppercase tracking-wide text-[#0f172a] hover:bg-slate-100"
                        onClick={closeMobile}
                      >
                        {pick(item.label, lang)}
                      </CmsLink>
                    ))}
                  </>
                )}
            </nav>
            <div className="mt-3 border-t border-slate-100 pt-3">
              <LocaleSelector />
            </div>
          </div>
        )}
      </div>
    </>
  )
}
