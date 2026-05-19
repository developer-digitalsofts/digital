import type { LucideIcon } from 'lucide-react'
import {
  FileText,
  ImageIcon,
  LayoutDashboard,
  Megaphone,
  PanelTop,
  Settings,
} from 'lucide-react'

export type NavChild = { to: string; label: string; end?: boolean }

export type NavGroup = {
  id: string
  label: string
  icon: LucideIcon
  children: NavChild[]
}

export const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    children: [{ to: '/admin', label: 'Dashboard', end: true }],
  },
  {
    id: 'pages',
    label: 'Pages',
    icon: FileText,
    children: [
      { to: '/admin/pages', label: 'All Pages', end: true },
      { to: '/admin/pages/new', label: 'Add New Page' },
      { to: '/admin/pages/home', label: 'Home Page Sections' },
    ],
  },
  {
    id: 'layout',
    label: 'Layout',
    icon: PanelTop,
    children: [
      { to: '/admin/layout/header', label: 'Header' },
      { to: '/admin/layout/footer', label: 'Footer' },
      { to: '/admin/layout/navigation', label: 'Navigation' },
    ],
  },
  {
    id: 'media',
    label: 'Media & Enquiries',
    icon: ImageIcon,
    children: [
      { to: '/admin/media', label: 'Media Library' },
      { to: '/admin/leads', label: 'Leads' },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    icon: Megaphone,
    children: [
      { to: '/admin/seo', label: 'SEO' },
      { to: '/admin/whatsapp', label: 'WhatsApp' },
      { to: '/admin/email-settings', label: 'Email Settings' },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    children: [
      { to: '/admin/site-settings', label: 'Site Settings' },
      { to: '/admin/backup', label: 'Backup / Restore' },
      { to: '/admin/activity', label: 'Activity Log' },
      { to: '/admin/profile', label: 'Profile' },
      { to: '/admin/change-password', label: 'Password' },
    ],
  },
]

export function getAdminPageTitle(pathname: string): string {
  if (pathname === '/admin/pages/new') return 'Add New Page'
  if (pathname.startsWith('/admin/pages/') && pathname.endsWith('/edit')) return 'Edit Page'
  if (pathname === '/admin/pages' || pathname === '/admin/pages/') return 'All Pages'
  if (pathname.startsWith('/admin/pages/home')) return 'Home Page Sections'
  if (pathname.startsWith('/admin/layout/footer')) return 'Footer'
  if (pathname.startsWith('/admin/layout/header')) return 'Header'
  if (pathname.startsWith('/admin/layout/navigation')) return 'Navigation'
  const flat: { prefix: string; label: string; end?: boolean }[] = []
  for (const g of ADMIN_NAV_GROUPS) {
    for (const c of g.children) {
      flat.push({ prefix: c.to, label: c.label, end: c.end })
    }
  }
  flat.sort((a, b) => b.prefix.length - a.prefix.length)
  for (const row of flat) {
    if (row.end ? pathname === row.prefix : pathname === row.prefix || pathname.startsWith(`${row.prefix}/`)) {
      return row.label
    }
  }
  return 'CMS'
}
