import type { Bilingual } from './types'

export type MegaMenuItemCms = {
  id: string
  title: Bilingual
  description: Bilingual
  imageUrl: string
  imageAlt: Bilingual
  href: string
  slug?: string
  featured: boolean
  active: boolean
  sortOrder: number
}

export type MegaMenuCategoryCms = {
  id: string
  title: Bilingual
  items: MegaMenuItemCms[]
  sortOrder: number
  active: boolean
}

export type MegaMenuFooterCms = {
  prompt: Bilingual
  linkLabel: Bilingual
  linkHref: string
  buttonLabel: Bilingual
  buttonHref: string
}

export type MegaMenuPanelCms = {
  heading: Bilingual
  subheading: Bilingual
  viewAllLabel: Bilingual
  viewAllHref: string
  categories: MegaMenuCategoryCms[]
  footer: MegaMenuFooterCms
  status: 'draft' | 'published'
}

export type MegaMenusCmsDoc = {
  modules: MegaMenuPanelCms
  industries: MegaMenuPanelCms
  _meta?: Record<string, unknown>
}

export type ResolvedMegaMenuItem = {
  id: string
  title: string
  description: string
  image: string
  imageAlt: string
  to: string
}

export type ResolvedMegaMenuColumn = {
  id: string
  title: string
  items: ResolvedMegaMenuItem[]
}

export type ResolvedMegaMenuPanel = {
  heading: string
  subheading: string
  viewAllLabel: string
  viewAllHref: string
  columns: ResolvedMegaMenuColumn[]
  footer: {
    prompt: string
    linkLabel: string
    linkHref: string
    buttonLabel: string
    buttonHref: string
  }
}
