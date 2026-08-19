import type { Bilingual } from '../../cms/types'
import { emptyBilingual, normalizeBilingual } from './normalizeHomeData'
import type { ModItem } from './HomeModuleCard'

export type ModulesDoc = {
  pill: Bilingual
  title: Bilingual
  subtitle: Bilingual
  exploreLabel: Bilingual
  items: ModItem[]
  _meta?: Record<string, unknown>
}

export function normalizeModItem(raw: unknown): ModItem {
  const o = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  return {
    id: typeof o.id === 'string' && o.id ? o.id : `m-${Math.random().toString(36).slice(2, 10)}`,
    icon: typeof o.icon === 'string' && o.icon ? o.icon : 'Box',
    badge: normalizeBilingual(o.badge),
    title: normalizeBilingual(o.title),
    description: normalizeBilingual(o.description),
    href: typeof o.href === 'string' ? o.href : '',
    sortOrder: typeof o.sortOrder === 'number' && Number.isFinite(o.sortOrder) ? o.sortOrder : 0,
    active: o.active !== false,
  }
}

export function normalizeModulesDoc(raw: unknown): ModulesDoc {
  const o = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  const items = Array.isArray(o.items) ? o.items.map(normalizeModItem) : []
  return {
    pill: normalizeBilingual(o.pill),
    title: normalizeBilingual(o.title),
    subtitle: normalizeBilingual(o.subtitle),
    exploreLabel: normalizeBilingual(o.exploreLabel),
    items,
    _meta: o._meta && typeof o._meta === 'object' ? (o._meta as Record<string, unknown>) : undefined,
  }
}

export function emptyModulesDoc(): ModulesDoc {
  return {
    pill: emptyBilingual(),
    title: emptyBilingual(),
    subtitle: emptyBilingual(),
    exploreLabel: emptyBilingual(),
    items: [],
  }
}

export type IndItem = {
  id: string
  icon: string
  category: Bilingual
  title: Bilingual
  description: Bilingual
  href: string
  imageUrl?: string
  sortOrder: number
  active: boolean
}

export type IndustriesDoc = {
  title: Bilingual
  subtitle: Bilingual
  exploreLabel: Bilingual
  items: IndItem[]
  _meta?: Record<string, unknown>
}

export function normalizeIndItem(raw: unknown): IndItem {
  const o = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  return {
    id: typeof o.id === 'string' && o.id ? o.id : `i-${Math.random().toString(36).slice(2, 10)}`,
    icon: typeof o.icon === 'string' && o.icon ? o.icon : 'Building2',
    category: normalizeBilingual(o.category),
    title: normalizeBilingual(o.title),
    description: normalizeBilingual(o.description),
    href: typeof o.href === 'string' ? o.href : '',
    imageUrl: typeof o.imageUrl === 'string' ? o.imageUrl : undefined,
    sortOrder: typeof o.sortOrder === 'number' && Number.isFinite(o.sortOrder) ? o.sortOrder : 0,
    active: o.active !== false,
  }
}

export function normalizeIndustriesDoc(raw: unknown): IndustriesDoc {
  const o = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {}
  const items = Array.isArray(o.items) ? o.items.map(normalizeIndItem) : []
  return {
    title: normalizeBilingual(o.title),
    subtitle: normalizeBilingual(o.subtitle),
    exploreLabel: normalizeBilingual(o.exploreLabel),
    items,
    _meta: o._meta && typeof o._meta === 'object' ? (o._meta as Record<string, unknown>) : undefined,
  }
}

export function emptyIndustriesDoc(): IndustriesDoc {
  return {
    title: emptyBilingual(),
    subtitle: emptyBilingual(),
    exploreLabel: emptyBilingual(),
    items: [],
  }
}
