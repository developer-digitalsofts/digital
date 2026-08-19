import type { SoftwareDetailPageData } from './types'
import type { PremiumPhotoPaths } from './premiumImagePacks'
import type { DetailPageConfig, DetailPhotoSlot, DetailVisibleSections } from './detailPageConfig'
import { resolveSlugPhoto, slugImagePath, slugPhotoFallbackChain } from './detailPageConfig'
import { resolvePublicMediaUrl } from '../../cms/publicMediaUrl'
import type {
  DetailAlternatingBenefitModel,
  DetailAnnotatedViewModel,
  DetailImageFeatureCardModel,
  DetailImageFeaturesModel,
  DetailTestimonialModel,
  DetailWorkflowStepModel,
} from '../../types/detailPageSections'
import { mockupVariantForSlug } from '../../components/software/detail/DetailSoftwareMockup'
import { getModuleRichPage } from '../moduleRichPages'
import { buildSectionHeading } from './detailHeadingUtils'

export { splitIntroParagraphs } from '../../components/software/accounts/accountsUtils'

export function pickVisibleSections(
  config: DetailPageConfig,
  detail: SoftwareDetailPageData,
  cfg: NonNullable<SoftwareDetailPageData['premiumLayout'] | SoftwareDetailPageData['accounts']>,
): DetailVisibleSections {
  const v = { ...config.visibleSections }

  if (!detail.hero.trust.length) v.metrics = false
  if (!detail.features.length) {
    v.overview = false
    v.imageFeatures = false
    v.annotatedView = false
  }
  if (detail.features.length < 3) v.imageFeatures = false
  if (!detail.vouchersReports.tabs.length) v.capabilities = false
  if (!detail.implementation.length || !cfg.implementationSectionTitle) v.implementation = false
  if (!detail.faqs.length) v.faqs = false
  if (detail.whyChoose.points.length < 2) {
    v.alternatingBenefits = false
    v.roles = false
  }

  const hasAnnotated =
    detail.whyChoose.points.length > 0 ||
    detail.features.length >= 4 ||
    detail.realtimeReports.bullets.length > 0
  if (!hasAnnotated) v.annotatedView = false

  if (!cfg.industriesSection.items.length || !cfg.industriesSection.heading) v.industriesSection = false

  const hasChallenge =
    cfg.challengeBullets.length > 0 || cfg.challengesIntro.trim().length > 0 || cfg.solutionParagraphs.length > 0
  if (!hasChallenge) v.challengeSolution = false

  if (!extractTestimonialQuotes(detail).length) v.testimonial = false

  return v
}

function extractTestimonialQuotes(detail: SoftwareDetailPageData): string[] {
  for (const block of detail.seoBlocks) {
    if (/customer|testimonial|what our clients|what our customers/i.test(block.heading)) {
      const items = block.lists?.flatMap((l) => l.items) ?? []
      if (items.length) return items
    }
  }
  return []
}

export function buildTestimonialSection(
  detail: SoftwareDetailPageData,
  paths: PremiumPhotoPaths,
  slug: string,
  productLabel: string,
): DetailTestimonialModel | undefined {
  const quotes = extractTestimonialQuotes(detail)
  if (!quotes.length) return undefined

  return {
    quote: quotes[0],
    attribution: `${productLabel} customer`,
    image: resolveSlugPhoto(paths, 'teamMeeting', slug),
    imageAlt: `${productLabel} — customer success`,
    results: detail.hero.trust.slice(0, 3).map((t) => ({
      value: t.value,
      label: t.label,
      icon: t.icon,
    })),
  }
}

export function buildAnnotatedViewSection(
  detail: SoftwareDetailPageData,
  paths: PremiumPhotoPaths,
  slug: string,
  config: DetailPageConfig,
  productLabel: string,
  dashboardFallbacks: string[],
): DetailAnnotatedViewModel | undefined {
  const dashboardSrc = resolveSlugPhoto(paths, config.dashboardScreenshot, slug)
  const callouts =
    detail.whyChoose.points.length > 0
      ? detail.whyChoose.points.slice(0, 4).map((p, idx) => ({
          title: p.title,
          description: p.body,
          position: (['tl', 'tr', 'bl', 'br'] as const)[idx % 4],
        }))
      : detail.features.slice(0, 4).map((f, idx) => ({
          title: f.title,
          description: f.description,
          position: (['tl', 'tr', 'bl', 'br'] as const)[idx % 4],
        }))

  if (!callouts.length) return undefined

  return {
    heading: detail.whyChoose.heading || detail.realtimeReports.heading || 'Operational dashboard',
    lead: detail.whyChoose.intro || detail.realtimeReports.intro || detail.vouchersReports.subheading,
    screenshot: dashboardSrc,
    screenshotAlt: `${productLabel} — operational dashboard`,
    screenshotFallbacks: dashboardFallbacks,
    callouts,
  }
}

export function buildImageFeaturesSection(
  cfg: NonNullable<SoftwareDetailPageData['premiumLayout'] | SoftwareDetailPageData['accounts']>,
  featured: DetailImageFeatureCardModel[],
  extra: DetailImageFeatureCardModel[],
  productLabel: string,
): DetailImageFeaturesModel | undefined {
  if (featured.length === 0) return undefined
  return {
    heading: buildSectionHeading(cfg.vouchersSectionEyebrow, productLabel, 'Key highlights'),
    lead: cfg.featuresLead,
    cards: featured,
    extraCards: extra,
  }
}

const WORKFLOW_ICON_KEYS: Record<string, string> = {
  record: 'FileInput',
  review: 'SearchCheck',
  approve: 'SearchCheck',
  report: 'BarChart3',
  reconcile: 'GitCompare',
  ledger: 'BookOpen',
  post: 'BookOpen',
  transaction: 'FileInput',
}

function workflowIconForLabel(label: string): string {
  const key = label.toLowerCase().replace(/[^a-z]/g, '')
  for (const [part, icon] of Object.entries(WORKFLOW_ICON_KEYS)) {
    if (key.includes(part)) return icon
  }
  return 'Circle'
}

/** Build workflow steps with descriptions from existing module rich-page content. */
export function buildModuleWorkflowSteps(
  detail: SoftwareDetailPageData,
  slug: string,
  lang: import('../../i18n/messages').Lang,
): DetailWorkflowStepModel[] {
  if (slug === 'accounts-management-software') {
    const rich = getModuleRichPage(slug, lang)
    const record = rich?.workflows.find((w) => /record/i.test(w.step))
    const review = rich?.workflows.find((w) => /review|approve/i.test(w.step))
    const report = rich?.workflows.find((w) => /report/i.test(w.step))
    const ledgerFeature = detail.features.find((f) => /double entry|ledger|chart of accounts/i.test(f.title))
    const reconcileFeature = detail.features.find((f) => /cheque|reconcil|bank/i.test(f.title))

    const steps: DetailWorkflowStepModel[] = []
    if (record) {
      steps.push({
        label: 'Record Transaction',
        description: record.detail,
        icon: 'FileInput',
      })
    }
    if (review) {
      steps.push({
        label: 'Approve',
        description: review.detail,
        icon: 'SearchCheck',
      })
    }
    if (ledgerFeature) {
      steps.push({
        label: 'Post to Ledger',
        description: ledgerFeature.description,
        icon: 'BookOpen',
      })
    }
    if (reconcileFeature) {
      steps.push({
        label: 'Reconcile',
        description: reconcileFeature.description,
        icon: 'GitCompare',
      })
    }
    if (report) {
      steps.push({
        label: 'Generate Reports',
        description: report.detail,
        icon: 'BarChart3',
      })
    }
    if (steps.length >= 2) return steps.slice(0, 5)
  }

  const rich = getModuleRichPage(slug, lang)
  if (rich?.workflows?.length) {
    return rich.workflows.map((w) => ({
      label: w.step,
      description: w.detail,
      icon: workflowIconForLabel(w.step),
    }))
  }
  return []
}

export function heroImageForPage(
  detail: SoftwareDetailPageData,
  paths: PremiumPhotoPaths,
  slug: string,
  config: DetailPageConfig,
  productLabel: string,
): { src: string; alt: string; fallbacks: string[] } {
  const cms = detail.heroImageUrl?.trim()
  const slot = config.heroImage
  const slugFallbacks = slugPhotoFallbackChain(slug, [
    config.heroImage,
    'teamMeeting',
    'heroTeam',
    'ledgerOffice',
  ]).filter((p) => !/dashboard|reports|accounting-dashboard/i.test(p))

  if (cms && !/dashboard|reports\.jpg|accounting-dashboard/i.test(cms)) {
    return {
      src: resolvePublicMediaUrl(cms),
      alt: `${productLabel} — operations team`,
      fallbacks: slugFallbacks,
    }
  }

  const primary = resolveSlugPhoto(paths, slot, slug)
  return {
    src: primary,
    alt: `${productLabel} — relevant operations photo`,
    fallbacks: slugFallbacks.filter((p) => p !== primary),
  }
}

function uniqueSlugImages(
  paths: PremiumPhotoPaths,
  slug: string,
  slots: DetailPhotoSlot[],
  used: Set<string>,
): string[] {
  const out: string[] = []
  for (const slot of slots) {
    const candidate = resolveSlugPhoto(paths, slot, slug)
    if (!used.has(candidate)) {
      used.add(candidate)
      out.push(candidate)
    }
  }
  return out
}

export function buildFeatureImageCards(
  detail: SoftwareDetailPageData,
  paths: PremiumPhotoPaths,
  slug: string,
  config: DetailPageConfig,
  productLabel: string,
  used: Set<string>,
): { featured: DetailImageFeatureCardModel[]; extra: DetailImageFeatureCardModel[] } {
  const pool = uniqueSlugImages(paths, slug, config.featureImages, used)
  const cards = detail.features.map((feature, idx) => ({
    title: feature.title,
    description: feature.description,
    image: pool[idx % pool.length] ?? slugImagePath(slug, config.featureImages[0] ?? 'heroTeam'),
    imageAlt: `${productLabel} — ${feature.title}`,
  }))
  return { featured: cards.slice(0, 3), extra: cards.slice(3) }
}

export function buildAlternatingBenefits(
  detail: SoftwareDetailPageData,
  paths: PremiumPhotoPaths,
  slug: string,
  config: DetailPageConfig,
  productLabel: string,
  used: Set<string>,
): DetailAlternatingBenefitModel[] {
  const mockupVariant = mockupVariantForSlug(slug, config.type)
  const photoSlots: DetailPhotoSlot[] = ['teamMeeting', 'ledgerOffice', 'heroTeam', 'financialReports']

  let photoImage = ''
  let photoAlt = `${productLabel} — operations`
  for (const slot of photoSlots) {
    const candidate = resolveSlugPhoto(paths, slot, slug)
    if (!used.has(candidate)) {
      photoImage = candidate
      used.add(candidate)
      photoAlt = `${productLabel} — ${slot === 'teamMeeting' ? 'team at work' : 'operational view'}`
      break
    }
  }
  if (!photoImage) {
    photoImage = slugImagePath(slug, config.heroImage)
    used.add(photoImage)
  }

  return detail.whyChoose.points.slice(0, 2).map((point, idx) => {
    if (idx === 0) {
      return {
        title: point.title,
        paragraphs: [point.body],
        visual: 'photo' as const,
        image: photoImage,
        imageAlt: photoAlt,
      }
    }
    return {
      title: point.title,
      paragraphs: [point.body],
      visual: 'mockup' as const,
      mockupVariant,
    }
  })
}

export function buildIndustryCardsFromDetail(
  items: { label: string; to: string }[],
  seoItems: string[],
  slug: string,
  getPaths: (s: string) => PremiumPhotoPaths,
  pagePaths: PremiumPhotoPaths,
  used: Set<string>,
) {
  const descByLabel = new Map<string, string>()
  for (const row of seoItems) {
    const [title, ...rest] = row.split(' — ')
    if (title) descByLabel.set(title.trim(), rest.join(' — ').trim())
  }

  const slots: DetailPhotoSlot[] = ['heroTeam', 'teamMeeting', 'ledgerOffice', 'financialReports', 'dashboard']

  return items.map((item, idx) => {
    const linkedSlug = item.to.match(/\/software\/(?:industry\/)?([^/?#]+)/)?.[1]
    const paths = linkedSlug ? getPaths(linkedSlug) : pagePaths
    const slot = slots[idx % slots.length]
    let image = resolveSlugPhoto(paths, slot, linkedSlug ?? slug)
    if (used.has(image)) {
      for (const s of slots) {
        const alt = resolveSlugPhoto(pagePaths, s, slug)
        if (!used.has(alt)) {
          image = alt
          break
        }
      }
    }
    used.add(image)
    return {
      label: item.label,
      to: item.to,
      description: descByLabel.get(item.label) ?? '',
      image,
    }
  })
}