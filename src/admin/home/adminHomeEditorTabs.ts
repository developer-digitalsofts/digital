/** Admin home page editor — tab ids stay in-panel; never map to public `/#section` anchors. */
export const ADMIN_HOME_EDITOR_PATH = '/admin/pages/home'
export const ADMIN_ERP_MODULES_PATH = '/admin/erp-modules'
export const ADMIN_INDUSTRIES_PATH = '/admin/industries'
export const ADMIN_DETAIL_PAGES_PATH = '/admin/detail-pages'

export const HOME_EDITOR_TABS = [
  { tab: 'hero', section: 'hero', label: 'Hero' },
  { tab: 'stats', section: 'stats', label: 'Stats' },
  { tab: 'about', section: 'about', label: 'About' },
  { tab: 'features', section: 'valueChain', label: 'Features' },
  { tab: 'modules', section: 'modules', label: 'ERP Modules' },
  { tab: 'workflow', section: 'workflow', label: 'Workflow CTA' },
  { tab: 'industries', section: 'industries', label: 'Industries' },
  { tab: 'faqs', section: 'faqs', label: 'FAQs' },
  { tab: 'cta', section: 'cta', label: 'Final CTA' },
  { tab: 'visibility', section: 'pageSections', label: 'Visibility' },
] as const

export type AdminHomeEditorTabId = (typeof HOME_EDITOR_TABS)[number]['tab']

export type AdminHomeEditorContext = 'homepage' | 'erp-modules' | 'industries'

const INDUSTRIES_CONTEXT_TABS = new Set<AdminHomeEditorTabId>([
  'hero',
  'stats',
  'about',
  'features',
  'industries',
  'faqs',
  'cta',
  'visibility',
])

export function adminHomeEditorContextFromPath(pathname: string): AdminHomeEditorContext {
  if (pathname === ADMIN_ERP_MODULES_PATH || pathname.startsWith(`${ADMIN_ERP_MODULES_PATH}/`)) return 'erp-modules'
  if (pathname === ADMIN_INDUSTRIES_PATH || pathname.startsWith(`${ADMIN_INDUSTRIES_PATH}/`)) return 'industries'
  return 'homepage'
}

export function adminHomeEditorPathForContext(context: AdminHomeEditorContext): string {
  switch (context) {
    case 'erp-modules':
      return ADMIN_ERP_MODULES_PATH
    case 'industries':
      return ADMIN_INDUSTRIES_PATH
    default:
      return ADMIN_HOME_EDITOR_PATH
  }
}

export function defaultTabForContext(context: AdminHomeEditorContext): AdminHomeEditorTabId {
  switch (context) {
    case 'erp-modules':
      return 'modules'
    case 'industries':
      return 'industries'
    default:
      return 'hero'
  }
}

export function tabsForContext(context: AdminHomeEditorContext) {
  if (context === 'industries') {
    return HOME_EDITOR_TABS.filter((t) => INDUSTRIES_CONTEXT_TABS.has(t.tab))
  }
  return HOME_EDITOR_TABS
}

export function normalizeAdminHomeTab(raw: string | null, context: AdminHomeEditorContext): AdminHomeEditorTabId {
  const allowed = tabsForContext(context)
  const hit = allowed.find((t) => t.tab === raw)
  return hit?.tab ?? defaultTabForContext(context)
}

export function adminHomeEditorTabSearch(tab: AdminHomeEditorTabId): string {
  return `panel=${encodeURIComponent(tab)}`
}

export function adminHomeEditorTabUrl(context: AdminHomeEditorContext, tab: AdminHomeEditorTabId): string {
  return `${adminHomeEditorPathForContext(context)}?${adminHomeEditorTabSearch(tab)}`
}
