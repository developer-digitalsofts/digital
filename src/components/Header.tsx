import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, Clock, Mail, Menu, Search, X } from 'lucide-react'
import { industryCategories, industryCategoryTitleEn, moduleMegaItems } from '../data/megaMenu'
import { MegaMenuIndustriesPanel, MegaMenuModulesPanel } from './HeaderMegaMenu'
import { GetDemoModal } from './GetDemoModal'
import { CmsLink } from './CmsLink'
import { headerGetDemoButtonClass, headerShellDefault, headerShellScrolled } from '../ui/saas'
import { useI18n } from '../i18n/I18nProvider'
import { megaIndustryCatTitle, megaIndustryLabel, megaModuleLabel } from '../i18n/megaLabels'
import { SITE_LOGO_SRC, BRAND_DEEP_BG } from '../constants'
import { pageShellClass } from '../ui/pageShell'
import { useCms } from '../cms/CmsContext'
import { pick } from '../cms/pick'
import { isTopBarVisibleFromSections, parsePageSections } from '../cms/pageSections'
import type { CmsHeader, CmsHeaderNavLink } from '../cms/types'

type MegaKey = 'module' | 'industry'

function TopBar({ header }: { header?: CmsHeader }) {
  const { lang } = useI18n()
  const tb = header?.topBar
  const email = tb?.email ?? 'info@digitalmanager.ae'
  const hours = tb?.hours ? pick(tb.hours, lang) : lang === 'ar' ? 'السبت–الخميس: ١٠ ص – ٩ م' : 'Sat - Thu : 10.00 am - 9.00 pm'
  const phoneCta = tb?.phoneCta ? pick(tb.phoneCta, lang) : lang === 'ar' ? 'تحدث معنا:' : 'Talk to Us:'
  const phoneDisplay = tb?.phoneDisplay ?? '+971 58 117 4911'
  const phoneHref = tb?.phoneHref ?? 'tel:+971581174911'
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
  'inline-flex items-center gap-1.5 pb-0.5 text-[12px] font-bold uppercase tracking-wide text-[#0f172a] transition-colors duration-200 hover:text-brand lg:text-[13px]'

/** Module / Industries triggers — color only, no underline on hover or when open. */
function navMegaTrigger(active: boolean) {
  return [
    'inline-flex items-center gap-1.5 border-0 bg-transparent pb-1 text-[13px] font-bold uppercase tracking-wide transition-colors duration-200',
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
    const raw = header?.navLinks
    if (!Array.isArray(raw) || raw.length === 0) return []
    return [...raw]
      .filter((l): l is CmsHeaderNavLink => Boolean(l && typeof l === 'object' && typeof l.id === 'string'))
      .filter((l) => l.active !== false)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  }, [header?.navLinks])
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
  const [demoOpen, setDemoOpen] = useState(false)
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

  const openDemo = useCallback(() => {
    closeMobile()
    setDemoOpen(true)
  }, [closeMobile])

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
        className={scrolled ? headerShellScrolled : headerShellDefault}
      >
        <div className={pageShellClass}>
          <div className="flex min-h-[58px] items-center justify-between gap-2.5 py-2 sm:min-h-[62px] sm:gap-3 lg:min-h-[64px] lg:py-2.5">
            <Link
              to="/"
              className="isolate flex shrink-0 items-center gap-3 bg-transparent py-0.5 transition-opacity duration-200 hover:opacity-90"
              onClick={() => {
                closeMega()
                closeMobile()
              }}
            >
              <img
                src={logoSrc}
                alt={brandName && (brandName.en || brandName.ar) ? pick(brandName, lang) : 'DigitalManager'}
                className="h-7 max-h-8 w-auto max-w-[min(160px,48vw)] bg-transparent object-contain object-left sm:h-8 md:h-9 lg:max-h-9 rtl:object-right"
                width={200}
                height={58}
                loading="eager"
                decoding="async"
              />
              {brandName && (brandName.en || brandName.ar) ? (
                <span className="hidden min-w-0 flex-col sm:flex">
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

            <nav
              className="hidden flex-1 items-center justify-center px-2 lg:flex xl:justify-center"
              aria-label="Primary"
            >
              {navStyle === 'simple' && simpleNavLinks.length > 0 ? (
                <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 lg:gap-x-8 xl:gap-x-10">
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
                <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1 lg:gap-x-8 xl:gap-x-10">
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
                </ul>
              )}
            </nav>

            <div className="hidden shrink-0 items-center gap-1.5 sm:gap-2 lg:flex">
              {showLangSwitcher ? (
                <button
                  type="button"
                  onClick={() => {
                    closeMega()
                    toggleLang()
                  }}
                  className="rounded-lg px-2 py-1.5 text-xs font-bold text-brand transition-colors hover:bg-slate-100 sm:text-sm"
                >
                  {langSwitch}
                </button>
              ) : null}
              {showGetInTouch ? (
                <CmsLink
                  to={getInTouch!.href.trim()}
                  className="inline-flex items-center rounded-xl border-2 border-brand px-3 py-1.5 text-xs font-bold text-brand transition-colors hover:bg-orange-50"
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
                  <Search className="size-[1.15rem] sm:size-5" strokeWidth={2.25} />
                </button>
              ) : null}
              <button
                type="button"
                className={`${headerGetDemoButtonClass} min-h-[40px] sm:min-h-[44px]`}
                onClick={openDemo}
              >
                Get Demo
              </button>
            </div>

            <div className="flex items-center gap-1 sm:gap-1.5 lg:hidden">
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
                onClick={openDemo}
              >
                Get Demo
              </button>
              <button
                type="button"
                className="rounded-lg p-2 text-brand transition-colors hover:bg-orange-50 hover:text-brand-dark lg:hidden"
                aria-expanded={mobileOpen}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setMobileOpen((v) => !v)}
              >
                {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
              </button>
            </div>
          </div>

          {navStyle !== 'simple' && mega === 'module' && (
            <div id="nav-mega-modules-panel" role="region" aria-labelledby="nav-mega-modules-trigger" className="hidden lg:block">
              <MegaMenuModulesPanel key={`mega-mod-${lang}`} onPick={closeMega} />
            </div>
          )}
          {navStyle !== 'simple' && mega === 'industry' && (
            <div
              id="nav-mega-industries-panel"
              role="region"
              aria-labelledby="nav-mega-industries-trigger"
              className="hidden max-h-[min(54vh,440px)] overflow-y-auto lg:block"
            >
              <MegaMenuIndustriesPanel key={`mega-ind-${lang}`} onPick={closeMega} />
            </div>
          )}
        </div>

        {mobileOpen && (
          <div className="animate-fade-up max-h-[min(70dvh,520px)] overflow-y-auto overscroll-contain border-t border-slate-100 bg-white px-3 py-3 motion-reduce:animate-none lg:hidden">
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
                        <ul className="max-h-[50vh] space-y-1 overflow-y-auto border-t border-slate-100 bg-slate-50/60 p-2">
                          {moduleMegaItems.map((item) => (
                            <li key={item.slug}>
                              <Link
                                to={item.to}
                                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-[#0f172a] hover:bg-slate-100 hover:text-brand"
                                onClick={closeMobile}
                              >
                                <span
                                  className={`flex size-9 shrink-0 items-center justify-center rounded-full ${item.iconWrap}`}
                                >
                                  <item.icon className="size-4 text-[#ea6a45]" strokeWidth={2} aria-hidden />
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
                        <div className="max-h-[50vh] space-y-1.5 overflow-y-auto border-t border-slate-100 bg-slate-50/60 p-1.5">
                          {industryCategories.map((cat) => (
                            <div key={cat.id} className="overflow-hidden rounded-lg border border-slate-100 bg-white">
                              <button
                                type="button"
                                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm font-bold text-[#0f172a]"
                                onClick={() =>
                                  setMobileIndustryCat((prev) => (prev === cat.id ? null : cat.id))
                                }
                              >
                                <span
                                  className={`flex size-8 shrink-0 items-center justify-center rounded-full ${cat.iconWrap}`}
                                >
                                  <cat.icon className="size-4 text-[#ea6a45]" strokeWidth={2} aria-hidden />
                                </span>
                                <span className="min-w-0 flex-1 text-start">
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
                                <ul className="border-t border-slate-100 py-1">
                                  {cat.links.map((link) => (
                                    <li key={link.slug}>
                                      <Link
                                        to={link.to}
                                        className="flex items-center justify-between px-4 py-2 text-[13px] font-medium text-slate-700 hover:bg-orange-50/80 hover:text-brand"
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
                  </>
                )}
            </nav>
            {showLangSwitcher ? (
              <div className="mt-3 flex items-center border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    closeMega()
                    toggleLang()
                  }}
                  className="text-sm font-bold text-brand"
                >
                  {langSwitch}
                </button>
              </div>
            ) : null}
          </div>
        )}
      </div>
      <GetDemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
    </>
  )
}
