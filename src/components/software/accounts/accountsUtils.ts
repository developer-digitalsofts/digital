/** 1200px shell with 40–48px desktop gutters — Accounts prototype only. */
export const accountsShellClass =
  'accounts-proto-shell mx-auto w-full max-w-[1200px] px-5 sm:px-8 md:px-10 lg:px-12'

/** Verified local fallback — always exists under public/software-images/accounts-management-software/ */
export const ACCOUNTS_IMAGE_FALLBACK = '/software-images/accounts-management-software/hero.jpg'

export function splitIntroParagraphs(intro: string): string[] {
  return intro.split(/\n+/).map((p) => p.trim()).filter(Boolean)
}

/** Extract software slug from flat or nested industry/module URLs. */
export function slugFromIndustryLink(to: string): string | null {
  const cleaned = to.split('?')[0]?.split('#')[0] ?? to
  const nested = cleaned.match(/\/software\/(?:industry|module)\/([^/]+)\/?$/i)
  if (nested?.[1]) return nested[1]
  const flat = cleaned.match(/\/software\/([^/]+)\/?$/i)
  if (flat?.[1] && flat[1] !== 'industry' && flat[1] !== 'module') return flat[1]
  return null
}

export type IndustryCardModel = {
  label: string
  to: string
  description: string
  image: string
}

type PhotoSlots = Record<
  'heroTeam' | 'teamMeeting' | 'ledgerOffice' | 'financialReports' | 'dashboard',
  string
>

/** Explicit label → slug/slot map guarantees unique, relevant industry photos. */
const INDUSTRY_IMAGE_MAP: Record<string, { slug: string; slot: keyof PhotoSlots }> = {
  'Retail Businesses': { slug: 'retail-management-software', slot: 'heroTeam' },
  Hospitality: { slug: 'hotel-management-software', slot: 'heroTeam' },
  Manufacturing: { slug: 'garments-manufacturing-software', slot: 'heroTeam' },
  'Professional Services': { slug: 'small-and-medium-business-erp-software', slot: 'heroTeam' },
  Healthcare: { slug: 'pharmacy-business-management-software', slot: 'heroTeam' },
  'E-Commerce': { slug: 'retail-management-software', slot: 'teamMeeting' },
  'Nonprofit Organizations': { slug: 'small-and-medium-business-erp-software', slot: 'ledgerOffice' },
  'Construction Industry': { slug: 'erp-software-for-construction-business', slot: 'heroTeam' },
}

function slugFromPaths(paths: PhotoSlots): string {
  const match = paths.heroTeam?.match(/\/software-images\/([^/]+)\//)
  return match?.[1] ?? 'accounts-management-software'
}

function pathForSlot(paths: PhotoSlots, slot: keyof PhotoSlots, slug: string): string {
  if (paths[slot]) return paths[slot]
  const file =
    slot === 'heroTeam'
      ? 'hero'
      : slot === 'teamMeeting'
        ? 'meeting'
        : slot === 'financialReports'
          ? 'reports'
          : slot === 'ledgerOffice'
            ? 'ledger'
            : 'dashboard'
  return `/software-images/${slug}/${file}.jpg`
}

/**
 * Assign a unique hero-team (or alternate slot) image per industry card.
 * Handles duplicate slugs (e.g. Retail + E-Commerce) by rotating slots.
 */
export function buildIndustryCards(
  items: { label: string; to: string }[],
  seoItems: string[],
  getPaths: (slug: string) => PhotoSlots,
  accountPaths: PhotoSlots,
): IndustryCardModel[] {
  const descByLabel = new Map<string, string>()
  for (const row of seoItems) {
    const [title, ...rest] = row.split(' — ')
    if (title) descByLabel.set(title.trim(), rest.join(' — ').trim())
  }

  const usedImages = new Set<string>()
  const slots = ['heroTeam', 'teamMeeting', 'ledgerOffice', 'financialReports', 'dashboard'] as const
  const pageSlug = slugFromPaths(accountPaths)

  return items.map((item, idx) => {
    const mapped = INDUSTRY_IMAGE_MAP[item.label]
    const linkedSlug = mapped?.slug ?? slugFromIndustryLink(item.to)
    const paths = linkedSlug ? getPaths(linkedSlug) : accountPaths
    const slot = mapped?.slot ?? slots[idx % slots.length]
    let image = pathForSlot(paths, slot, linkedSlug ?? pageSlug)

    if (usedImages.has(image)) {
      for (const s of slots) {
        const candidate = pathForSlot(accountPaths, s, pageSlug)
        if (candidate && !usedImages.has(candidate)) {
          image = candidate
          break
        }
      }
    }

    usedImages.add(image)

    return {
      label: item.label,
      to: item.to,
      description: descByLabel.get(item.label) ?? '',
      image,
    }
  })
}
