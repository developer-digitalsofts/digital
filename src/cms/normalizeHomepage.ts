import type { HomepagePayload } from './types'
import { HOME_SECTION_REGISTRY } from './homeSectionRegistry'
import type { PageSectionRow } from './pageSections'

export type HomepageMeta = {
  slug: 'home'
  status: 'published'
  schemaVersion: number
  updatedAt: string | null
  publishedAt: string | null
}

export type NormalizedHomepagePayload = HomepagePayload & { meta: HomepageMeta }

const APPROVED_SECTION_IDS = HOME_SECTION_REGISTRY.map((s) => s.id)

function readMetaStamp(doc: Record<string, unknown> | undefined): string | null {
  if (!doc || typeof doc !== 'object') return null
  const meta = doc._meta
  if (!meta || typeof meta !== 'object') return null
  const updatedAt = (meta as { updatedAt?: string }).updatedAt
  return typeof updatedAt === 'string' ? updatedAt : null
}

function mergePageSections(raw: unknown): PageSectionRow[] {
  const sections = (raw as { sections?: PageSectionRow[] } | null)?.sections
  const fromApi = Array.isArray(sections) ? [...sections] : []
  const byId = new Map(fromApi.map((s) => [s.id, s]))

  for (const def of HOME_SECTION_REGISTRY) {
    if (!byId.has(def.id)) {
      byId.set(def.id, {
        id: def.id,
        name: def.label,
        visible: true,
        sortOrder: def.defaultSortOrder,
      })
    }
  }

  return [...byId.values()].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}

/** Map published API payload into the shape expected by frontend renderers. */
export function normalizeHomepagePayload(raw: HomepagePayload & { meta?: Partial<HomepageMeta> }): NormalizedHomepagePayload {
  const stamps = [
    readMetaStamp(raw.hero),
    readMetaStamp(raw.stats),
    readMetaStamp(raw.industries),
    readMetaStamp(raw.valueChain),
    readMetaStamp(raw.demoCta),
    readMetaStamp(raw.modules),
    readMetaStamp(raw.testimonials),
    readMetaStamp(raw.personalizedDemo),
    readMetaStamp(raw.faqs),
    readMetaStamp(raw.pageSections as Record<string, unknown> | undefined),
  ].filter(Boolean) as string[]

  const updatedAt = raw.meta?.updatedAt ?? (stamps.length ? stamps.sort().at(-1)! : null)
  const publishedAt = raw.meta?.publishedAt ?? updatedAt

  return {
    ...raw,
    pageSections: { sections: mergePageSections(raw.pageSections) },
    meta: {
      slug: 'home',
      status: 'published',
      schemaVersion: raw.meta?.schemaVersion ?? 2,
      updatedAt,
      publishedAt,
    },
  }
}

export function unknownHomeSectionIds(sections: PageSectionRow[]): string[] {
  const known = new Set<string>([...APPROVED_SECTION_IDS, 'topBar', 'footer', 'workflow', 'industries', 'cta'])
  return sections.map((s) => s.id).filter((id) => !known.has(id))
}
