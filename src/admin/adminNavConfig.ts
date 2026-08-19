import type { LucideIcon } from 'lucide-react'
import {
  FileStack,
  FileText,
  Globe2,
  Home,
  ImageIcon,
  Layers,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  CalendarDays,
  MessageSquare,
  PanelTop,
  Search,
  Sparkles,
  UserCircle,
  Users,
} from 'lucide-react'
import {
  ADMIN_DETAIL_PAGES_PATH,
  ADMIN_ERP_MODULES_PATH,
  ADMIN_HOME_EDITOR_PATH,
  ADMIN_INDUSTRIES_PATH,
} from './home/adminHomeEditorTabs'

export type AdminNavItem = {
  id: string
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

export const ADMIN_PAGES_PATH = '/admin/pages-list'

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { id: 'dashboard', to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { id: 'pages', to: ADMIN_PAGES_PATH, label: 'Pages', icon: FileText },
  { id: 'homepage', to: ADMIN_HOME_EDITOR_PATH, label: 'Homepage', icon: Home },
  { id: 'modules', to: ADMIN_ERP_MODULES_PATH, label: 'Modules', icon: Layers },
  { id: 'industries', to: ADMIN_INDUSTRIES_PATH, label: 'Industries', icon: Sparkles },
  { id: 'mega-menus', to: '/admin/mega-menus', label: 'Mega Menus', icon: LayoutGrid },
  { id: 'detail-pages', to: ADMIN_DETAIL_PAGES_PATH, label: 'Detail Pages', icon: FileStack, end: true },
  { id: 'demo-requests', to: '/admin/demo-requests', label: 'Forms & Leads', icon: CalendarDays },
  { id: 'media', to: '/admin/media', label: 'Media Library', icon: ImageIcon },
  { id: 'header', to: '/admin/layout/header', label: 'Header & Footer', icon: PanelTop },
  { id: 'seo', to: '/admin/seo', label: 'SEO', icon: Search },
  { id: 'site-settings', to: '/admin/site-settings', label: 'Global Settings', icon: Globe2 },
  { id: 'users', to: '/admin/users', label: 'Users', icon: Users },
  { id: 'activity', to: '/admin/activity', label: 'Activity Log', icon: MessageSquare },
  { id: 'profile', to: '/admin/profile', label: 'Admin Profile', icon: UserCircle },
]

export const ADMIN_LOGOUT_ITEM = { label: 'Logout', icon: LogOut }

export function isPathMatch(pathname: string, path: string, mode: 'exact' | 'nested' = 'exact'): boolean {
  const norm = pathname.replace(/\/$/, '') || '/'
  const target = path.replace(/\/$/, '') || '/'
  if (mode === 'exact') return norm === target
  return norm === target || norm.startsWith(`${target}/`)
}

export function isAdminNavActive(pathname: string, _search: string, item: AdminNavItem): boolean {
  if (item.to === ADMIN_HOME_EDITOR_PATH) {
    return pathname === ADMIN_HOME_EDITOR_PATH
  }
  if (item.to === ADMIN_ERP_MODULES_PATH) {
    return pathname === ADMIN_ERP_MODULES_PATH
  }
  if (item.to === ADMIN_INDUSTRIES_PATH) {
    return pathname === ADMIN_INDUSTRIES_PATH
  }
  if (item.to === '/admin/mega-menus') {
    return pathname === '/admin/mega-menus'
  }
  if (item.to === '/admin/site-settings') {
    return pathname === '/admin/site-settings'
  }
  if (item.to === '/admin/seo') {
    return pathname === '/admin/seo'
  }
  if (item.to === '/admin/layout/header') {
    return pathname === '/admin/layout/header' || pathname === '/admin/layout/footer'
  }

  if (item.end) return isPathMatch(pathname, item.to, 'exact')
  return isPathMatch(pathname, item.to, 'nested')
}

export function getAdminPageTitle(pathname: string, search = ''): string {
  if (pathname === ADMIN_ERP_MODULES_PATH) return 'ERP Modules'
  if (pathname === ADMIN_INDUSTRIES_PATH) return 'Industries'
  if (pathname === ADMIN_HOME_EDITOR_PATH) return 'Homepage'
  if (pathname === ADMIN_PAGES_PATH || pathname === ADMIN_DETAIL_PAGES_PATH) return 'Pages'
  if (pathname === '/admin/pages/new') return 'Add New Page'
  if (pathname.startsWith('/admin/pages/') && pathname.endsWith('/sections')) return 'Manage Sections'
  if (pathname.startsWith('/admin/pages/detail/') && pathname.endsWith('/edit')) return 'Edit Detail Page'
  if (pathname === '/admin/pages/detail/new') return 'Add Detail Page'
  if (pathname.startsWith('/admin/pages/') && pathname.endsWith('/edit')) return 'Edit Page'

  for (const item of ADMIN_NAV_ITEMS) {
    if (isAdminNavActive(pathname, search, item)) return item.label
  }

  const legacy: Record<string, string> = {
    '/admin/site-settings': 'Site Settings',
    '/admin/seo': 'SEO',
    '/admin/whatsapp': 'WhatsApp',
    '/admin/backup': 'Backup / Restore',
    '/admin/activity': 'Activity Log',
    '/admin/change-password': 'Change Password',
    '/admin/layout/header': 'Header',
  }
  for (const [prefix, label] of Object.entries(legacy)) {
    if (pathname === prefix || pathname.startsWith(`${prefix}/`)) return label
  }
  return 'Admin'
}

/** @deprecated grouped nav — kept for any legacy imports */
export type NavChild = { to: string; label: string; end?: boolean }
export type NavGroup = { id: string; label: string; icon: LucideIcon; children: NavChild[] }
export const ADMIN_NAV_GROUPS: NavGroup[] = []
