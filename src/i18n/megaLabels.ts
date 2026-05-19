import type { Lang } from './messages'
import { megaMenuAr } from './megaMenuAr'

/** Flat maps for reliable slug lookups (avoids `as const` index quirks). */
const modulesAr: Record<string, string> = { ...megaMenuAr.modules }
const industriesAr: Record<string, string> = { ...megaMenuAr.industries }
const industryCatsAr: Record<string, string> = { ...megaMenuAr.industryCats }

export function megaModuleLabel(lang: Lang, slug: string, labelEn: string): string {
  if (lang !== 'ar') return labelEn
  return modulesAr[slug] ?? labelEn
}

export function megaIndustryLabel(lang: Lang, slug: string, labelEn: string): string {
  if (lang !== 'ar') return labelEn
  return industriesAr[slug] ?? labelEn
}

export function megaIndustryCatTitle(lang: Lang, catId: string, titleEn: string): string {
  if (lang !== 'ar') return titleEn
  return industryCatsAr[catId] ?? titleEn
}
