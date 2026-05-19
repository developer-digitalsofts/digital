export type Bilingual = { en: string; ar: string }

/** Optional primary nav row when `navStyle` is `simple` (mega menu is the default). */
export type CmsHeaderNavLink = {
  id: string
  label: Bilingual
  href: string
  sortOrder: number
  /** When false, link is hidden on the site. Default: true */
  active?: boolean
}

export type CmsHeader = {
  logoUrl: string
  faviconUrl: string
  /** When omitted, top bar is shown */
  showTopBar?: boolean
  topBar: {
    email: string
    hours: Bilingual
    phoneCta: Bilingual
    phoneDisplay: string
    phoneHref: string
  }
  nav: {
    home: Bilingual
    modules: Bilingual
    industries: Bilingual
    contact: Bilingual
    arabicToggle: Bilingual
  }
  showSearch: boolean
  showContactGrid: boolean
  /** When omitted, treated as true */
  showLoginButton?: boolean
  loginButton?: {
    text: Bilingual
    href: string
  }
  /** `mega` = Software mega menus (default). `simple` = use `navLinks` only. */
  navStyle?: 'mega' | 'simple'
  branding?: {
    siteName?: Bilingual
    tagline?: Bilingual
  }
  navLinks?: CmsHeaderNavLink[]
  getInTouch?: {
    show?: boolean
    text: Bilingual
    href: string
  }
  /** When omitted, language switcher is shown */
  showLangSwitcher?: boolean
}

export type HomepagePayload = {
  header: CmsHeader
  hero: Record<string, unknown>
  stats: Record<string, unknown>
  about: Record<string, unknown>
  valueChain: Record<string, unknown>
  modules: Record<string, unknown>
  workflow: Record<string, unknown>
  industries: Record<string, unknown>
  faqs: Record<string, unknown>
  cta: Record<string, unknown>
  footer: Record<string, unknown>
  seo: Record<string, unknown>
  siteSettings?: Record<string, unknown>
  whatsappSettings?: Record<string, unknown>
  pageSections?: { sections?: { id: string; name?: string; visible?: boolean; sortOrder?: number }[] }
}
