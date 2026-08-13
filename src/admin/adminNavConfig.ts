import type { LucideIcon } from 'lucide-react'
import {
  FileStack,
  FileText,
  Home,
  ImageIcon,
  Layers,
  LayoutDashboard,
  LogOut,
  CalendarDays,
  MessageSquare,
  PanelBottom,
  Phone,
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
  { id: 'homepage', to: ADMIN_HOME_EDITOR_PATH, label: 'Homepage', icon: Home },
  { id: 'pages', to: ADMIN_PAGES_PATH, label: 'Pages', icon: FileText },
  { id: 'modules', to: ADMIN_ERP_MODULES_PATH, label: 'ERP Modules', icon: Layers },
  { id: 'industries', to: ADMIN_INDUSTRIES_PATH, label: 'Industries', icon: Sparkles },
  { id: 'detail-pages', to: ADMIN_DETAIL_PAGES_PATH, label: 'Detail Pages', icon: FileStack, end: true },
  { id: 'demo-requests', to: '/admin/demo-requests', label: 'Demo Requests', icon: CalendarDays },
  { id: 'inquiries', to: '/admin/leads', label: 'Contact Inquiries', icon: MessageSquare },
  { id: 'media', to: '/admin/media', label: 'Media / Images', icon: ImageIcon },
  { id: 'contact', to: '/admin/email-settings', label: 'Contact Details', icon: Phone },
  { id: 'footer', to: '/admin/layout/footer', label: 'Footer Settings', icon: PanelBottom },
  { id: 'users', to: '/admin/users', label: 'Users / Access', icon: Users },
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
