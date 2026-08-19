import { pick } from '../cms/pick'
import type {
  MegaMenuCategoryCms,
  MegaMenuItemCms,
  MegaMenuPanelCms,
  MegaMenusCmsDoc,
  ResolvedMegaMenuColumn,
  ResolvedMegaMenuPanel,
} from '../cms/megaMenuTypes'
import type { Lang } from '../i18n/messages'
import { megaMenuIndustryColumns } from './megaMenuIndustriesFeatured'
import { megaMenuModuleColumns } from './megaMenuModulesFeatured'
import { messages } from '../i18n/messages'

const MAX_CATEGORIES = 3
const MAX_ITEMS_PER_CATEGORY = 3

function sortByOrder<T extends { sortOrder: number }>(rows: T[]): T[] {
  return [...rows].sort((a, b) => a.sortOrder - b.sortOrder)
}

function resolveItems(items: MegaMenuItemCms[], lang: Lang): ResolvedMegaMenuColumn['items'] {
  return sortByOrder(items)
    .filter((item) => item.active !== false && item.featured !== false)
    .slice(0, MAX_ITEMS_PER_CATEGORY)
    .map((item) => ({
      id: item.id,
      title: pick(item.title, lang),
      description: pick(item.description, lang),
      image: item.imageUrl?.trim() || '',
      imageAlt: pick(item.imageAlt, lang) || pick(item.title, lang),
      to: item.href?.trim() || '#',
    }))
    .filter((item) => item.title.trim())
}

function resolveCategories(categories: MegaMenuCategoryCms[], lang: Lang): ResolvedMegaMenuColumn[] {
  return sortByOrder(categories)
    .filter((cat) => cat.active !== false)
    .slice(0, MAX_CATEGORIES)
    .map((cat) => ({
      id: cat.id,
      title: pick(cat.title, lang),
      items: resolveItems(cat.items ?? [], lang),
    }))
    .filter((cat) => cat.title.trim() && cat.items.length > 0)
}

function fallbackFromStatic(kind: 'modules' | 'industries', lang: Lang): ResolvedMegaMenuPanel {
  const copyPrefix = kind === 'modules' ? 'megaMenuModules' : 'megaMenuIndustries'
  const m = messages[lang] as Record<string, unknown>
  const copy = (m[copyPrefix] ?? messages.en[copyPrefix]) as Record<string, unknown>
  const columns = kind === 'modules' ? megaMenuModuleColumns : megaMenuIndustryColumns
  const itemsCopy = (copy.items ?? {}) as Record<string, { title: string; desc: string }>
  const columnsCopy = (copy.columns ?? {}) as Record<string, string>
  const footer = (copy.footer ?? {}) as Record<string, string>

  return {
    heading: String(copy.heading ?? ''),
    subheading: String(copy.subheading ?? ''),
    viewAllLabel: String(copy.viewAll ?? ''),
    viewAllHref: kind === 'modules' ? '/#modules' : '/industries',
    columns: columns.map((col) => ({
      id: col.id,
      title: columnsCopy[col.id] ?? col.id,
      items: col.items.map((item) => ({
        id: item.id,
        title: itemsCopy[item.id]?.title ?? item.slug,
        description: itemsCopy[item.id]?.desc ?? '',
        image: item.image,
        imageAlt: item.imageAlt,
        to: item.to,
      })),
    })),
    footer: {
      prompt: String(footer.prompt ?? ''),
      linkLabel: String(footer.linkAction ?? ''),
      linkHref: kind === 'modules' ? '/#modules' : '/contact',
      buttonLabel: String(footer.buttonAction ?? ''),
      buttonHref: kind === 'modules' ? '/contact' : '/contact#contact-form',
    },
  }
}

function resolvePanel(panel: MegaMenuPanelCms | undefined, lang: Lang): ResolvedMegaMenuPanel | null {
  if (!panel || panel.status !== 'published') return null
  const columns = resolveCategories(panel.categories ?? [], lang)
  if (!columns.length) return null

  return {
    heading: pick(panel.heading, lang),
    subheading: pick(panel.subheading, lang),
    viewAllLabel: pick(panel.viewAllLabel, lang),
    viewAllHref: panel.viewAllHref?.trim() || '#',
    columns,
    footer: {
      prompt: pick(panel.footer?.prompt, lang),
      linkLabel: pick(panel.footer?.linkLabel, lang),
      linkHref: panel.footer?.linkHref?.trim() || '#',
      buttonLabel: pick(panel.footer?.buttonLabel, lang),
      buttonHref: panel.footer?.buttonHref?.trim() || '#',
    },
  }
}

export function resolvePublishedMegaMenuPanel(
  doc: MegaMenusCmsDoc | undefined,
  kind: 'modules' | 'industries',
  lang: Lang,
): ResolvedMegaMenuPanel {
  const panel = kind === 'modules' ? doc?.modules : doc?.industries
  return resolvePanel(panel, lang) ?? fallbackFromStatic(kind, lang)
}
