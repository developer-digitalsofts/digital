import type { NavigateFunction } from 'react-router-dom'
import {
  ADMIN_ERP_MODULES_PATH,
  ADMIN_HOME_EDITOR_PATH,
  ADMIN_INDUSTRIES_PATH,
  adminHomeEditorTabSearch,
  type AdminHomeEditorContext,
  type AdminHomeEditorTabId,
} from './home/adminHomeEditorTabs'

/** Public homepage section hashes → admin home editor tab ids. */
const PUBLIC_HASH_TO_ADMIN_TAB: Record<string, AdminHomeEditorTabId> = {
  hero: 'hero',
  stats: 'stats',
  about: 'about',
  features: 'features',
  valueChain: 'features',
  modules: 'modules',
  industries: 'about',
  'erp-modules': 'features',
  'demo-cta': 'demoCta',
  testimonials: 'testimonials',
  'personalized-demo': 'personalizedDemo',
  'get-demo': 'personalizedDemo',
  faqs: 'faqs',
  workflow: 'visibility',
  'final-cta': 'demoCta',
  cta: 'demoCta',
}

function adminContextFromPath(pathname: string): AdminHomeEditorContext {
  if (pathname.startsWith(ADMIN_ERP_MODULES_PATH)) return 'erp-modules'
  if (pathname.startsWith(ADMIN_INDUSTRIES_PATH)) return 'industries'
  return 'homepage'
}

function adminPathForContext(context: AdminHomeEditorContext): string {
  switch (context) {
    case 'erp-modules':
      return ADMIN_ERP_MODULES_PATH
    case 'industries':
      return ADMIN_INDUSTRIES_PATH
    default:
      return ADMIN_HOME_EDITOR_PATH
  }
}

export function isPublicHomeHashLink(href: string | null): href is string {
  if (!href) return false
  return /^\/#\w/.test(href) || /^#\w/.test(href)
}

export function adminTabForPublicHomeHash(href: string): AdminHomeEditorTabId | null {
  const hash = href.replace(/^\/?#/, '')
  return PUBLIC_HASH_TO_ADMIN_TAB[hash] ?? null
}

export function navigateToAdminHomeTab(
  navigate: NavigateFunction,
  tab: AdminHomeEditorTabId,
  pathname: string,
) {
  const context = adminContextFromPath(pathname)
  navigate(
    {
      pathname: adminPathForContext(context),
      search: adminHomeEditorTabSearch(tab),
      hash: '',
    },
    { replace: false, state: { adminPanel: tab } },
  )
}

/** Block public `/#section` and `#section` navigation while inside the admin panel. */
export function interceptPublicHashLinksInAdmin(e: MouseEvent, navigate: NavigateFunction, pathname: string): boolean {
  const anchor = (e.target as HTMLElement | null)?.closest('a')
  if (!anchor) return false

  const href = anchor.getAttribute('href')
  if (!isPublicHomeHashLink(href)) return false

  const tab = adminTabForPublicHomeHash(href)
  if (!tab) return false

  e.preventDefault()
  e.stopPropagation()
  navigateToAdminHomeTab(navigate, tab, pathname)
  return true
}
