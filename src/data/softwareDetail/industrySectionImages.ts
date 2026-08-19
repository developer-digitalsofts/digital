import { industryCategoryForSlug, INDUSTRY_HERO_NEUTRAL_FALLBACK } from './industryHeroImages'
import { slugImagePath, type DetailPhotoSlot } from './detailPageConfig'
import manifestJson from './softwareImageManifest.json'
import type { SoftwareDetailPageData } from './types'

export type SectionImageRef = {
  src: string
  alt: string
  objectPosition?: string
}

export type IndustrySectionImageOverrides = {
  operational?: string[]
  benefitRows?: string[]
  businessTypes?: string[]
  testimonial?: string
}

export type ResolvedIndustrySectionImages = {
  operational: SectionImageRef[]
  benefitRows: SectionImageRef[]
  businessTypes: SectionImageRef[]
  testimonial?: SectionImageRef
}

type ImageCandidate = {
  slug: string
  slot: DetailPhotoSlot
  altSuffix: string
  objectPosition?: string
}

const MANIFEST_SLUGS = Object.keys(manifestJson as Record<string, unknown>)

const SLOT_FILES: DetailPhotoSlot[] = [
  'heroTeam',
  'teamMeeting',
  'ledgerOffice',
  'financialReports',
  'dashboard',
]

function cross(slug: string, slot: DetailPhotoSlot): string {
  return slugImagePath(slug, slot)
}

function normalizePath(src: string): string {
  try {
    return decodeURIComponent(src.split('?')[0].replace(/\\/g, '/').toLowerCase())
  } catch {
    return src.toLowerCase()
  }
}

function refFromCandidate(
  candidate: ImageCandidate,
  productLabel: string,
  context: string,
): SectionImageRef {
  return {
    src: cross(candidate.slug, candidate.slot),
    alt: `${productLabel} — ${context}${candidate.altSuffix ? ` — ${candidate.altSuffix}` : ''}`,
    objectPosition: candidate.objectPosition ?? 'center',
  }
}

function candidatesForFeatureTitle(title: string, pageSlug: string, category: string): ImageCandidate[] {
  const t = title.toLowerCase()

  if (/livestock|herd|dairy|animal|milk|poultry|broiler|shed/.test(t)) {
    return [
      { slug: 'dairy-farm-management-software', slot: 'heroTeam', altSuffix: 'livestock operations' },
      { slug: 'poultry-control-shed-management-software', slot: 'heroTeam', altSuffix: 'poultry operations' },
      { slug: 'dairy-farm-management-software', slot: 'teamMeeting', altSuffix: 'farm management' },
    ]
  }

  if (/crop|land|field|sprout|harvest|irrigation|plot|agronom/.test(t)) {
    return [
      { slug: 'cloud-erp-software-for-agriculture-business', slot: 'teamMeeting', altSuffix: 'crop management' },
      { slug: 'cloud-erp-software-for-agriculture-business', slot: 'financialReports', altSuffix: 'field monitoring' },
    ]
  }

  if (/purchase|procurement|supplier|input|seed|fertilizer|feed/.test(t)) {
    return [
      { slug: pageSlug, slot: 'ledgerOffice', altSuffix: 'purchase and procurement' },
      { slug: 'cloud-erp-software-for-agriculture-business', slot: 'ledgerOffice', altSuffix: 'agricultural inputs' },
      { slug: 'inventory-management-software', slot: 'ledgerOffice', altSuffix: 'supplier receiving' },
    ]
  }

  if (/fleet|dispatch|trip|route|driver|vehicle|transport|logistic/.test(t)) {
    return [
      { slug: 'logistics-transportation-software', slot: 'teamMeeting', altSuffix: 'fleet operations' },
      { slug: 'logistics-transportation-software', slot: 'heroTeam', altSuffix: 'logistics hub' },
    ]
  }

  if (/inventory|stock|warehouse/.test(t)) {
    return [
      { slug: 'inventory-management-software', slot: 'heroTeam', altSuffix: 'warehouse operations' },
      { slug: pageSlug, slot: 'ledgerOffice', altSuffix: 'inventory control' },
    ]
  }

  if (/production|manufactur|bom|shop.?floor|assembly/.test(t)) {
    return [
      { slug: 'garments-manufacturing-software', slot: 'heroTeam', altSuffix: 'production floor' },
      { slug: 'production-management-software', slot: 'heroTeam', altSuffix: 'manufacturing line' },
    ]
  }

  if (/quality|inspect/.test(t)) {
    return [
      { slug: 'garments-manufacturing-software', slot: 'teamMeeting', altSuffix: 'quality inspection' },
      { slug: pageSlug, slot: 'financialReports', altSuffix: 'quality control' },
    ]
  }

  if (/yarn|knit|dye|fabric|textile|weav/.test(t)) {
    return [
      { slug: 'knitting-dyeing-industry-software', slot: 'heroTeam', altSuffix: 'textile production' },
      { slug: 'cloud-erp-software-for-textile-industries', slot: 'teamMeeting', altSuffix: 'textile floor' },
    ]
  }

  if (/fuel|nozzle|tank|cng|petrol|lpg|shift|dispens/.test(t)) {
    return [
      { slug: 'petrol-pump-software', slot: 'teamMeeting', altSuffix: 'fuel station operations' },
      { slug: 'petrol-gas-filling-station-software', slot: 'heroTeam', altSuffix: 'filling station' },
    ]
  }

  if (/pos|sale|checkout|billing|retail/.test(t)) {
    return [
      { slug: 'retail-management-software', slot: 'teamMeeting', altSuffix: 'retail checkout' },
      { slug: 'grocery-store-management-software', slot: 'heroTeam', altSuffix: 'store operations' },
    ]
  }

  if (/hotel|restaurant|hospitality|reservation|housekeeping/.test(t)) {
    return [
      { slug: 'hotel-management-software', slot: 'heroTeam', altSuffix: 'hospitality operations' },
      { slug: 'hotel-management-software', slot: 'teamMeeting', altSuffix: 'guest services' },
    ]
  }

  if (/pharmacy|medical|dispens|homeopathic/.test(t)) {
    return [
      { slug: 'pharmacy-business-management-software', slot: 'heroTeam', altSuffix: 'pharmacy operations' },
      { slug: 'homeopathic-business-management-software', slot: 'teamMeeting', altSuffix: 'clinic operations' },
    ]
  }

  if (/account|finance|ledger|payment|receipt/.test(t)) {
    return [
      { slug: pageSlug, slot: 'financialReports', altSuffix: 'financial reporting' },
      { slug: pageSlug, slot: 'ledgerOffice', altSuffix: 'accounts operations' },
    ]
  }

  if (/construct|marble|granite|tile|hardware|real.?estate|property/.test(t)) {
    return [
      { slug: 'marble-and-granite-factory-software', slot: 'heroTeam', altSuffix: 'construction site' },
      { slug: 'erp-software-for-construction-business', slot: 'teamMeeting', altSuffix: 'project operations' },
    ]
  }

  if (/visa|immigration|consult/.test(t)) {
    return [
      { slug: 'software-for-visa-immigration-consultants', slot: 'heroTeam', altSuffix: 'consultancy office' },
    ]
  }

  if (/electron|mobile|laptop|computer|charging|ev/.test(t)) {
    return [
      { slug: 'computers-laptop-business-software', slot: 'heroTeam', altSuffix: 'electronics retail' },
      { slug: 'mobile-accessories-business-software', slot: 'teamMeeting', altSuffix: 'mobile retail' },
    ]
  }

  if (category === 'agriculture' || category === 'poultry') {
    return [
      { slug: 'cloud-erp-software-for-agriculture-business', slot: 'teamMeeting', altSuffix: 'farm operations' },
      { slug: 'dairy-farm-management-software', slot: 'heroTeam', altSuffix: 'farm environment' },
    ]
  }

  return SLOT_FILES.map((slot) => ({ slug: pageSlug, slot, altSuffix: title }))
}

function candidatesForBusinessType(title: string, pageSlug: string, category: string): ImageCandidate[] {
  const t = title.toLowerCase()

  if (/dairy|milk/.test(t)) {
    return [{ slug: 'dairy-farm-management-software', slot: 'heroTeam', altSuffix: 'dairy farm' }]
  }
  if (/poultry|broiler|hatchery|shed/.test(t)) {
    return [{ slug: 'poultry-control-shed-management-software', slot: 'heroTeam', altSuffix: 'poultry farm' }]
  }
  if (/livestock|cattle|herd/.test(t)) {
    return [{ slug: 'dairy-farm-management-software', slot: 'teamMeeting', altSuffix: 'livestock farm' }]
  }
  if (/greenhouse/.test(t)) {
    return [{ slug: 'cloud-erp-software-for-agriculture-business', slot: 'dashboard', altSuffix: 'greenhouse cultivation' }]
  }
  if (/distribut|supplier|warehouse|feed|seed|fertilizer/.test(t)) {
    return [{ slug: 'inventory-management-software', slot: 'heroTeam', altSuffix: 'supply warehouse' }]
  }
  if (/crop|farm|agri|field/.test(t)) {
    return [{ slug: 'cloud-erp-software-for-agriculture-business', slot: 'heroTeam', altSuffix: 'crop farm' }]
  }

  return candidatesForFeatureTitle(title, pageSlug, category)
}

function candidatesForBenefitRow(
  heading: string,
  reverse: boolean,
  pageSlug: string,
  category: string,
): ImageCandidate[] {
  const h = heading.toLowerCase()

  if (/why choose|automation|digitalmanager|control/.test(h)) {
    return [
      { slug: pageSlug, slot: 'teamMeeting', altSuffix: 'operations team on-site' },
      { slug: 'cloud-erp-software-for-agriculture-business', slot: 'teamMeeting', altSuffix: 'farm manager with technology' },
    ]
  }

  if (/report|visibility|monitor|real.?time|analytics|clearly/.test(h)) {
    return [
      { slug: pageSlug, slot: 'dashboard', altSuffix: 'operations dashboard' },
      { slug: pageSlug, slot: 'financialReports', altSuffix: 'monitoring and reports' },
    ]
  }

  if (category === 'oil-gas') {
    return reverse
      ? [{ slug: 'petrol-pump-software', slot: 'dashboard', altSuffix: 'station dashboard' }]
      : [{ slug: 'petrol-gas-filling-station-software', slot: 'teamMeeting', altSuffix: 'station operations' }]
  }

  return reverse
    ? [{ slug: pageSlug, slot: 'dashboard', altSuffix: 'management dashboard' }]
    : [{ slug: pageSlug, slot: 'teamMeeting', altSuffix: 'operational workflow' }]
}

const RELATED_SLUGS: Record<string, string[]> = {
  'cloud-erp-software-for-agriculture-business': [
    'dairy-farm-management-software',
    'poultry-control-shed-management-software',
    'inventory-management-software',
  ],
  'dairy-farm-management-software': [
    'cloud-erp-software-for-agriculture-business',
    'poultry-control-shed-management-software',
  ],
  'logistics-transportation-software': ['fleet-fuel-management-software', 'motor-market-management-software'],
  'petrol-pump-software': [
    'petrol-gas-filling-station-software',
    'petrol-depot-management-software',
  ],
  'garments-manufacturing-software': [
    'cloud-erp-software-for-textile-industries',
    'knitting-dyeing-industry-software',
  ],
  'retail-management-software': ['grocery-store-management-software', 'inventory-management-software'],
}

const SLUG_OPERATIONAL_OVERRIDES: Record<string, ImageCandidate[]> = {
  'cloud-erp-software-for-agriculture-business': [
    { slug: 'cloud-erp-software-for-agriculture-business', slot: 'financialReports', altSuffix: 'land and field mapping', objectPosition: 'center 40%' },
    { slug: 'cloud-erp-software-for-agriculture-business', slot: 'teamMeeting', altSuffix: 'crop inspection', objectPosition: 'center 40%' },
    { slug: 'cloud-erp-software-for-agriculture-business', slot: 'ledgerOffice', altSuffix: 'input procurement', objectPosition: 'center' },
  ],
  'petrol-pump-software': [
    { slug: 'petrol-gas-filling-station-software', slot: 'teamMeeting', altSuffix: 'nozzle sales' },
    { slug: 'petrol-pump-software', slot: 'ledgerOffice', altSuffix: 'tank stock' },
    { slug: 'petrol-pump-software', slot: 'financialReports', altSuffix: 'shift closing' },
  ],
  'logistics-transportation-software': [
    { slug: 'logistics-transportation-software', slot: 'teamMeeting', altSuffix: 'fleet dispatch' },
    { slug: 'inventory-management-software', slot: 'heroTeam', altSuffix: 'distribution warehouse' },
    { slug: 'logistics-transportation-software', slot: 'dashboard', altSuffix: 'trip management' },
  ],
  'garments-manufacturing-software': [
    { slug: 'garments-manufacturing-software', slot: 'teamMeeting', altSuffix: 'production planning' },
    { slug: 'inventory-management-software', slot: 'ledgerOffice', altSuffix: 'material warehouse' },
    { slug: 'garments-manufacturing-software', slot: 'financialReports', altSuffix: 'quality inspection' },
  ],
  'retail-management-software': [
    { slug: 'retail-management-software', slot: 'teamMeeting', altSuffix: 'POS checkout' },
    { slug: 'grocery-store-management-software', slot: 'heroTeam', altSuffix: 'store inventory' },
    { slug: 'retail-management-software', slot: 'ledgerOffice', altSuffix: 'customer service' },
  ],
}

const SLUG_BUSINESS_OVERRIDES: Record<string, ImageCandidate[]> = {
  'cloud-erp-software-for-agriculture-business': [
    { slug: 'cloud-erp-software-for-agriculture-business', slot: 'dashboard', altSuffix: 'land management' },
    { slug: 'dairy-farm-management-software', slot: 'heroTeam', altSuffix: 'crop and dairy operations' },
    { slug: 'poultry-control-shed-management-software', slot: 'heroTeam', altSuffix: 'poultry operations' },
    { slug: 'inventory-management-software', slot: 'heroTeam', altSuffix: 'agricultural supply warehouse' },
  ],
  'petrol-pump-software': [
    { slug: 'petrol-pump-software', slot: 'heroTeam', altSuffix: 'petrol station' },
    { slug: 'petrol-gas-filling-station-software', slot: 'heroTeam', altSuffix: 'CNG station' },
    { slug: 'petrol-depot-management-software', slot: 'heroTeam', altSuffix: 'multi-branch chain' },
    { slug: 'fleet-fuel-management-software', slot: 'teamMeeting', altSuffix: 'fleet fuel operations' },
  ],
}

function pickUniqueCandidate(
  candidates: ImageCandidate[],
  used: Set<string>,
  productLabel: string,
  context: string,
  pageSlug: string,
): SectionImageRef {
  for (const candidate of candidates) {
    const src = cross(candidate.slug, candidate.slot)
    const normalized = normalizePath(src)
    if (!used.has(normalized)) {
      used.add(normalized)
      return refFromCandidate(candidate, productLabel, context)
    }
  }

  const slugOrder = [
    pageSlug,
    ...(RELATED_SLUGS[pageSlug] ?? []),
    ...MANIFEST_SLUGS.filter((s) => s !== pageSlug && !(RELATED_SLUGS[pageSlug] ?? []).includes(s)),
  ]

  for (const slot of SLOT_FILES) {
    for (const altSlug of slugOrder) {
      const src = cross(altSlug, slot)
      const normalized = normalizePath(src)
      if (!used.has(normalized)) {
        used.add(normalized)
        return refFromCandidate({ slug: altSlug, slot, altSuffix: context }, productLabel, context)
      }
    }
  }

  const neutral = INDUSTRY_HERO_NEUTRAL_FALLBACK
  const neutralKey = normalizePath(neutral)
  if (!used.has(neutralKey)) {
    used.add(neutralKey)
    return { src: neutral, alt: `${productLabel} — ${context}`, objectPosition: 'center' }
  }

  for (const slot of SLOT_FILES) {
    for (const altSlug of MANIFEST_SLUGS) {
      const src = cross(altSlug, slot)
      const normalized = normalizePath(src)
      if (!used.has(normalized)) {
        used.add(normalized)
        return refFromCandidate({ slug: altSlug, slot, altSuffix: context }, productLabel, context)
      }
    }
  }

  return { src: neutral, alt: `${productLabel} — ${context}`, objectPosition: 'center' }
}

function cmsOverrideRef(
  src: string | undefined,
  alt: string,
  used: Set<string>,
): SectionImageRef | undefined {
  const trimmed = src?.trim()
  if (!trimmed) return undefined
  const normalized = normalizePath(trimmed)
  if (used.has(normalized)) return undefined
  used.add(normalized)
  return { src: trimmed, alt }
}

export function resolveIndustrySectionImages(
  detail: SoftwareDetailPageData,
  slug: string,
  productLabel: string,
  options: {
    heroSrc: string
    featureTitles: string[]
    businessTitles: string[]
    benefitHeadings: { title: string; reverse: boolean }[]
  },
): ResolvedIndustrySectionImages {
  const category = industryCategoryForSlug(slug)
  const used = new Set<string>([normalizePath(options.heroSrc)])
  const overrides = detail.sectionImages

  const operational: SectionImageRef[] = []
  const opOverrides = SLUG_OPERATIONAL_OVERRIDES[slug]

  options.featureTitles.slice(0, 3).forEach((title, idx) => {
    const cms = cmsOverrideRef(overrides?.operational?.[idx], `${productLabel} — ${title}`, used)
    if (cms) {
      operational.push(cms)
      return
    }
    const candidates = opOverrides?.[idx]
      ? [opOverrides[idx], ...candidatesForFeatureTitle(title, slug, category)]
      : candidatesForFeatureTitle(title, slug, category)
    operational.push(pickUniqueCandidate(candidates, used, productLabel, title, slug))
  })

  const businessTypes: SectionImageRef[] = []
  const bizOverrides = SLUG_BUSINESS_OVERRIDES[slug]

  options.businessTitles.slice(0, 4).forEach((title, idx) => {
    const cms = cmsOverrideRef(overrides?.businessTypes?.[idx], `${title} — ${productLabel}`, used)
    if (cms) {
      businessTypes.push(cms)
      return
    }
    const candidates = bizOverrides?.[idx]
      ? [bizOverrides[idx], ...candidatesForBusinessType(title, slug, category)]
      : candidatesForBusinessType(title, slug, category)
    businessTypes.push(pickUniqueCandidate(candidates, used, productLabel, title, slug))
  })

  const benefitRows: SectionImageRef[] = []
  options.benefitHeadings.slice(0, 2).forEach(({ title, reverse }, idx) => {
    const cms = cmsOverrideRef(overrides?.benefitRows?.[idx], `${productLabel} — ${title}`, used)
    if (cms) {
      benefitRows.push(cms)
      return
    }
    benefitRows.push(
      pickUniqueCandidate(
        candidatesForBenefitRow(title, reverse, slug, category),
        used,
        productLabel,
        title,
        slug,
      ),
    )
  })

  const cmsTestimonial = cmsOverrideRef(overrides?.testimonial, `${productLabel} customer`, used)
  const testimonial =
    cmsTestimonial ??
    pickUniqueCandidate(
      [
        { slug, slot: 'dashboard', altSuffix: 'customer operations' },
        { slug, slot: 'financialReports', altSuffix: 'verified customer' },
        ...(RELATED_SLUGS[slug] ?? []).flatMap((s) => [
          { slug: s, slot: 'dashboard' as DetailPhotoSlot, altSuffix: 'customer success' },
          { slug: s, slot: 'financialReports' as DetailPhotoSlot, altSuffix: 'operations team' },
        ]),
      ],
      used,
      productLabel,
      'customer success',
      slug,
    )

  if (import.meta.env.DEV) {
    validateIndustrySectionImages(slug, options.heroSrc, {
      operational,
      benefitRows,
      businessTypes,
      testimonial,
    })
  }

  return { operational, benefitRows, businessTypes, testimonial }
}

export function validateIndustrySectionImages(
  slug: string,
  heroSrc: string,
  images: ResolvedIndustrySectionImages,
): void {
  const seen = new Map<string, string>()
  const register = (src: string, section: string) => {
    const key = normalizePath(src)
    if (seen.has(key)) {
      console.warn(
        `[industry-images] Duplicate on ${slug}: "${key}" used in ${seen.get(key)} and ${section}`,
      )
    } else {
      seen.set(key, section)
    }
  }

  register(heroSrc, 'hero')
  images.operational.forEach((img, i) => register(img.src, `operational[${i}]`))
  images.benefitRows.forEach((img, i) => register(img.src, `benefitRow[${i}]`))
  images.businessTypes.forEach((img, i) => register(img.src, `businessType[${i}]`))
  if (images.testimonial) register(images.testimonial.src, 'testimonial')
}
