import { flattenMegaSearchMeta } from '../../data/megaMenu'
import { softwarePageIconName } from '../../ui/cardIconColors'
import type { SoftwareDetailCmsRecord } from '../../cms/softwareDetailTypes'

export type DetailPageListRow = {
  kind: 'module' | 'industry'
  slug: string
  titleEn: string
  url: string
  cms: SoftwareDetailCmsRecord | null
  active: boolean
  updatedAt: string | null
  isCustom: boolean
}

function pageUrl(kind: 'module' | 'industry', slug: string): string {
  const meta = flattenMegaSearchMeta().find((r) => r.kind === kind && r.slug === slug)
  if (meta) return meta.to
  return kind === 'module' ? `/software/module/${slug}` : `/software/industry/${slug}`
}

export function buildDetailPageCatalog(cmsItems: SoftwareDetailCmsRecord[]): DetailPageListRow[] {
  const cmsByKey = new Map<string, SoftwareDetailCmsRecord>()
  for (const row of cmsItems) {
    cmsByKey.set(`${row.kind}:${row.slug}`, row)
  }

  const rows: DetailPageListRow[] = []
  const seen = new Set<string>()

  for (const meta of flattenMegaSearchMeta()) {
    const key = `${meta.kind}:${meta.slug}`
    seen.add(key)
    const cms = cmsByKey.get(key) ?? null
    rows.push({
      kind: meta.kind,
      slug: meta.slug,
      titleEn: cms?.label?.en?.trim() || meta.labelEn,
      url: meta.to,
      cms,
      active: cms ? cms.active !== false : true,
      updatedAt: cms?.updatedAt ?? null,
      isCustom: false,
    })
  }

  for (const cms of cmsItems) {
    const key = `${cms.kind}:${cms.slug}`
    if (seen.has(key)) continue
    rows.push({
      kind: cms.kind,
      slug: cms.slug,
      titleEn: cms.label?.en?.trim() || cms.slug,
      url: pageUrl(cms.kind, cms.slug),
      cms,
      active: cms.active !== false,
      updatedAt: cms.updatedAt ?? null,
      isCustom: true,
    })
  }

  return rows.sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === 'module' ? -1 : 1
    return a.titleEn.localeCompare(b.titleEn)
  })
}

export function defaultLabelForSlug(kind: 'module' | 'industry', slug: string): string {
  const meta = flattenMegaSearchMeta().find((r) => r.kind === kind && r.slug === slug)
  return meta?.labelEn ?? slug
}

export function iconForSlug(kind: 'module' | 'industry', slug: string): string {
  return softwarePageIconName(slug, kind)
}
