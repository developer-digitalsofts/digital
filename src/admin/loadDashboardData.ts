import { adminFetch } from './adminApi'

export type ContentBadge = 'complete' | 'missing' | 'active' | 'inactive'

export type ContentStatusRow = {
  id: string
  label: string
  badge: ContentBadge
}

export type DashboardSummary = {
  cards: {
    sectionsTotal: number
    erpModulesTotal: number
    erpModulesActive: number
    industriesTotal: number
    industriesActive: number
    faqsTotal: number
    faqsActive: number
    leadsTotal: number
    leadsNew: number
    leadsContacted: number
    leadsClosed: number
    demoRequests: {
      new: number
      contacted: number
      demoScheduled: number
      converted: number
      followUpsDueToday: number
      total: number
    }
    mediaFiles: number
    detailPagesTotal: number
    usersTotal: number
    lastUpdatedGlob: string | null
  }
  contentStatus?: ContentStatusRow[]
  recentLeads: {
    id: string
    name: string
    email: string
    phone: string
    message: string
    source: string
    sourcePage: string
    status: string
    createdAt: string
  }[]
  recentActivity: {
    id: string
    action: string
    section: string
    description: string
    adminEmail: string
    adminName?: string
    at: string
  }[]
  recentSections: { section: string; updatedAt: string; updatedBy: string }[]
  recentMedia: { id: string; filename: string; uploadedAt: string }[]
  health: { api: boolean; dataFiles: boolean; mediaUploads: boolean; frontend: boolean }
}

function pickEn(b: unknown): string {
  if (!b || typeof b !== 'object') return ''
  return String((b as { en?: string }).en ?? '').trim()
}

/** Checklist labels match CMS copy (badges stay Complete / Missing / Active / Inactive). */
export function buildContentStatusFromJson(
  header: unknown,
  hero: unknown,
  footer: unknown,
  seo: unknown,
  wa: unknown,
  email: unknown,
): ContentStatusRow[] {
  const h = header as { logoUrl?: string; nav?: { home?: { en?: string } } }
  const he = hero as { title?: { en?: string } }
  const f = footer as { productLinks?: unknown[]; tagline?: { en?: string } }
  const s = seo as { pageTitle?: { en?: string }; metaDescription?: { en?: string } }
  const w = wa as { show?: boolean; active?: boolean; phoneDigits?: string }
  const e = email as { receiverEmail?: string }

  const headerOk = !!(h?.logoUrl && pickEn(h?.nav?.home))
  const heroOk = !!pickEn(he?.title)
  const footerOk = !!(f?.productLinks?.length || pickEn(f?.tagline))
  const seoOk = !!(pickEn(s?.pageTitle) && pickEn(s?.metaDescription))
  const waDigits = String(w?.phoneDigits ?? '').replace(/\D/g, '')
  const waOn = !!(w?.show && w?.active !== false && waDigits.length >= 8)
  const recv = String(e?.receiverEmail ?? '').trim()
  const formReady = recv.includes('@')

  return [
    { id: 'header', label: 'Header Configured', badge: headerOk ? 'complete' : 'missing' },
    { id: 'hero', label: 'Hero Section Ready', badge: heroOk ? 'complete' : 'missing' },
    { id: 'footer', label: 'Footer Configured', badge: footerOk ? 'complete' : 'missing' },
    { id: 'seo', label: 'SEO Configured', badge: seoOk ? 'complete' : 'missing' },
    { id: 'whatsapp', label: 'WhatsApp Active', badge: waOn ? 'active' : 'inactive' },
    { id: 'contact', label: 'Contact Form Ready', badge: formReady ? 'complete' : 'missing' },
  ]
}

function defaultContentStatus(): ContentStatusRow[] {
  return [
    { id: 'header', label: 'Header Configured', badge: 'missing' },
    { id: 'hero', label: 'Hero Section Ready', badge: 'missing' },
    { id: 'footer', label: 'Footer Configured', badge: 'missing' },
    { id: 'seo', label: 'SEO Configured', badge: 'missing' },
    { id: 'whatsapp', label: 'WhatsApp Active', badge: 'inactive' },
    { id: 'contact', label: 'Contact Form Ready', badge: 'missing' },
  ]
}

function lastUpdatedFromMeta(meta: Record<string, { updatedAt?: string }>): string | null {
  const dates = Object.values(meta)
    .map((m) => m.updatedAt)
    .filter(Boolean) as string[]
  if (!dates.length) return null
  return dates.sort().pop() ?? null
}

type DashLegacy = {
  erpModules: number
  erpModulesTotal: number
  industrySolutions: number
  industrySolutionsTotal: number
  faqs: number
  leads: number
  mediaFiles: number
}

async function tryAdmin<T>(path: string): Promise<T | null> {
  try {
    return await adminFetch<T>(path)
  } catch {
    return null
  }
}

type ItemsDoc = { items?: { active?: boolean }[] }

function statsFromItemsDoc(doc: unknown): { total: number; active: number } | null {
  if (!doc || typeof doc !== 'object') return null
  const items = (doc as ItemsDoc).items
  if (!Array.isArray(items)) return null
  const total = items.length
  const active = items.filter((x) => x && typeof x === 'object' && (x as { active?: boolean }).active !== false).length
  return { total, active }
}

/** Reconcile ERP / industry counts from CMS JSON so dashboard cards never disagree with live data. */
async function enrichDashboardCardsFromModulesIndustries(cards: DashboardSummary['cards']): Promise<void> {
  const [modDoc, indDoc] = await Promise.all([
    tryAdmin<unknown>('/api/admin/data/modules'),
    tryAdmin<unknown>('/api/admin/data/industries'),
  ])
  const modStats = statsFromItemsDoc(modDoc)
  const indStats = statsFromItemsDoc(indDoc)
  if (modStats) {
    cards.erpModulesTotal = modStats.total
    cards.erpModulesActive = modStats.active
  }
  if (indStats) {
    cards.industriesTotal = indStats.total
    cards.industriesActive = indStats.active
  }
}

export function getEmptyDashboard(): DashboardSummary {
  return {
    cards: {
      sectionsTotal: 0,
      erpModulesTotal: 0,
      erpModulesActive: 0,
      industriesTotal: 0,
      industriesActive: 0,
      faqsTotal: 0,
      faqsActive: 0,
      leadsTotal: 0,
      leadsNew: 0,
    leadsContacted: 0,
    leadsClosed: 0,
    demoRequests: {
      new: 0,
      contacted: 0,
      demoScheduled: 0,
      converted: 0,
      followUpsDueToday: 0,
      total: 0,
    },
    mediaFiles: 0,
      detailPagesTotal: 0,
      usersTotal: 0,
      lastUpdatedGlob: null,
    },
    contentStatus: defaultContentStatus(),
    recentLeads: [],
    recentActivity: [],
    recentSections: [],
    recentMedia: [],
    health: { api: false, dataFiles: false, mediaUploads: false, frontend: false },
  }
}

async function loadDashboardFallback(): Promise<DashboardSummary> {
  const [
    dash,
    activity,
    leadsList,
    mediaList,
    meta,
    header,
    hero,
    footer,
    seo,
    wa,
    email,
    pageSections,
    faqsDoc,
    pagesDoc,
    usersList,
    demoStats,
  ] = await Promise.all([
    tryAdmin<DashLegacy>('/api/admin/dashboard'),
    tryAdmin<DashboardSummary['recentActivity'][number][]>('/api/admin/activity'),
    tryAdmin<DashboardSummary['recentLeads'][number][]>('/api/admin/leads'),
    tryAdmin<{ id: string; filename: string; uploadedAt: string }[]>('/api/admin/media'),
    tryAdmin<Record<string, { updatedAt?: string; updatedBy?: string }>>('/api/admin/content-meta'),
    tryAdmin<unknown>('/api/admin/data/header'),
    tryAdmin<unknown>('/api/admin/data/hero'),
    tryAdmin<unknown>('/api/admin/data/footer'),
    tryAdmin<unknown>('/api/admin/data/seo'),
    tryAdmin<unknown>('/api/admin/data/whatsappSettings'),
    tryAdmin<unknown>('/api/admin/data/emailSettings'),
    tryAdmin<{ sections?: unknown[] }>('/api/admin/data/pageSections'),
    tryAdmin<{ items?: { active?: boolean }[] }>('/api/admin/data/faqs'),
    tryAdmin<{ items?: unknown[] }>('/api/admin/pages'),
    tryAdmin<{ id: string }[]>('/api/admin/users'),
    tryAdmin<{
      new: number
      contacted: number
      demoScheduled: number
      converted: number
      followUpsDueToday: number
      total: number
    }>('/api/admin/demo-requests/stats'),
  ])

  const faqItems = faqsDoc?.items || []
  const sectionsArr = Array.isArray(pageSections?.sections) ? pageSections!.sections! : []
  const leadsRaw = Array.isArray(leadsList) ? leadsList : []
  const normLeads = leadsRaw.map((l) => ({
    id: l.id,
    name: l.name ?? '',
    email: l.email ?? '',
    phone: l.phone ?? '',
    message: l.message ?? '',
    source: l.source ?? '',
    sourcePage: l.sourcePage ?? '',
    status: l.status ?? 'New',
    createdAt: l.createdAt ?? '',
  }))
  const mediaRaw = Array.isArray(mediaList) ? mediaList : []
  const actRaw = Array.isArray(activity) ? activity : []
  const metaObj = meta && typeof meta === 'object' ? meta : {}
  const pageItems = Array.isArray(pagesDoc?.items) ? pagesDoc!.items! : []
  const usersRaw = Array.isArray(usersList) ? usersList : []

  const d = dash
  const cards = {
    sectionsTotal: sectionsArr.length,
    erpModulesTotal: d?.erpModulesTotal ?? 0,
    erpModulesActive: d?.erpModules ?? 0,
    industriesTotal: d?.industrySolutionsTotal ?? 0,
    industriesActive: d?.industrySolutions ?? 0,
    faqsTotal: faqItems.length || (d?.faqs ?? 0),
    faqsActive: faqItems.length ? faqItems.filter((x) => x.active !== false).length : d?.faqs ?? 0,
    leadsTotal: normLeads.length || (d?.leads ?? 0),
    leadsNew: normLeads.filter((x) => x.status === 'New').length,
    leadsContacted: normLeads.filter((x) => x.status === 'Contacted').length,
    leadsClosed: normLeads.filter((x) => x.status === 'Closed').length,
    demoRequests: demoStats ?? {
      new: 0,
      contacted: 0,
      demoScheduled: 0,
      converted: 0,
      followUpsDueToday: 0,
      total: 0,
    },
    mediaFiles: mediaRaw.length || (d?.mediaFiles ?? 0),
    detailPagesTotal: pageItems.length,
    usersTotal: usersRaw.length,
    lastUpdatedGlob: lastUpdatedFromMeta(metaObj),
  }

  const contentStatus = buildContentStatusFromJson(
    header ?? {},
    hero ?? {},
    footer ?? {},
    seo ?? {},
    wa ?? {},
    email ?? {},
  )

  return {
    cards,
    contentStatus,
    recentLeads: normLeads.slice(0, 8),
    recentActivity: actRaw.slice(0, 12),
    recentSections: Object.entries(metaObj)
      .map(([section, v]) => ({ section, updatedAt: v.updatedAt || '', updatedBy: v.updatedBy || '' }))
      .filter((x) => x.updatedAt)
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
      .slice(0, 8),
    recentMedia: mediaRaw.slice(0, 5).map((m) => ({ id: m.id, filename: m.filename, uploadedAt: m.uploadedAt })),
    health: { api: true, dataFiles: true, mediaUploads: true, frontend: true },
  }
}

export type DashboardLoadSource = 'summary' | 'alias' | 'fallback' | 'empty'

export type DashboardLoadResult = {
  data: DashboardSummary
  source: DashboardLoadSource
  /** Last fetch error when falling back to empty data */
  apiError?: string
}

/**
 * Loads dashboard data for `npm run dev` (Vite proxy → API).
 * Never throws: falls back through summary → alias → partial stitch → empty shell.
 */
export async function loadDashboardSummary(): Promise<DashboardLoadResult> {
  let lastError: string | undefined

  const normalizeSummary = async (data: DashboardSummary): Promise<DashboardSummary> => {
    data.cards.detailPagesTotal ??= 0
    data.cards.usersTotal ??= 0
    data.cards.demoRequests ??= {
      new: 0,
      contacted: 0,
      demoScheduled: 0,
      converted: 0,
      followUpsDueToday: 0,
      total: 0,
    }
    data.recentLeads = (data.recentLeads ?? []).map((l) => ({
      id: l.id,
      name: l.name ?? '',
      email: l.email ?? '',
      phone: l.phone ?? '',
      message: l.message ?? '',
      source: l.source ?? '',
      sourcePage: l.sourcePage ?? '',
      status: l.status ?? 'New',
      createdAt: l.createdAt ?? '',
    }))
    await enrichDashboardCardsFromModulesIndustries(data.cards)
    return data
  }

  const capture = (e: unknown) => {
    lastError = e instanceof Error ? e.message : 'CMS API unavailable'
  }

  try {
    const data = await adminFetch<DashboardSummary>('/api/admin/summary')
    return { data: await normalizeSummary(data), source: 'summary' }
  } catch (e) {
    capture(e)
    try {
      const data = await adminFetch<DashboardSummary>('/api/admin/cms-summary')
      return { data: await normalizeSummary(data), source: 'alias' }
    } catch (e2) {
      capture(e2)
      try {
        const data = await loadDashboardFallback()
        return { data: await normalizeSummary(data), source: 'fallback' }
      } catch (e3) {
        capture(e3)
        return { data: getEmptyDashboard(), source: 'empty', apiError: lastError }
      }
    }
  }
}
