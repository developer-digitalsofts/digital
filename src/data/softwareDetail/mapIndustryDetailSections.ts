import { getIndustryRichPage } from '../industryRichPages'
import type { Lang } from '../../i18n/messages'
import type { SoftwareDetailPageData } from './types'
import { getPremiumPhotoPaths } from './premiumImagePacks'
import { getDetailPageConfig, resolveSlugPhoto, slugPhotoFallbackChain } from './detailPageConfig'
import type {
  ApprovedDetailPageSections,
  DetailWorkflowStepModel,
} from '../../types/detailPageSections'
import {
  buildAlternatingBenefits,
  buildAnnotatedViewSection,
  buildFeatureImageCards,
  buildImageFeaturesSection,
  buildIndustryCardsFromDetail,
  buildTestimonialSection,
  heroImageForPage,
  pickVisibleSections,
  splitIntroParagraphs,
} from './detailPageMapUtils'
import { resolveDetailIconName } from '../../components/software/detail/detailIconMap'

const WORKFLOW_ICONS: Record<string, string> = {
  purchase: 'ShoppingCart',
  sales: 'Receipt',
  inventory: 'Package',
  accounts: 'Landmark',
  tank: 'Fuel',
  hr: 'Users',
  manufacturing: 'Factory',
  retail: 'Store',
  logistics: 'Truck',
}

function workflowIcon(label: string): string {
  const key = label.toLowerCase()
  for (const [part, icon] of Object.entries(WORKFLOW_ICONS)) {
    if (key.includes(part)) return icon
  }
  return 'Circle'
}

function buildIndustryWorkflowSteps(
  detail: SoftwareDetailPageData,
  slug: string,
  productLabel: string,
  lang: Lang,
): DetailWorkflowStepModel[] {
  const rich = getIndustryRichPage(slug, productLabel, lang)
  if (rich?.workflows?.length) {
    return rich.workflows.map((w) => ({
      label: w.step,
      description: w.detail,
      icon: workflowIcon(w.step),
    }))
  }
  if (detail.features.length >= 4) {
    return detail.features.slice(0, 6).map((f) => ({
      label: f.title.replace(/\s+Management$/i, '').trim(),
      description: f.description,
      icon: f.icon || workflowIcon(f.title),
    }))
  }
  return []
}

/** Map industry detail data into the approved 15-section layout. */
export function mapIndustryDetailSections(
  detail: SoftwareDetailPageData,
  slug: string,
  productLabel: string,
  lang: Lang,
): ApprovedDetailPageSections {
  const cfg = detail.premiumLayout ?? detail.accounts!
  const config = getDetailPageConfig(slug, 'industry')
  const paths = getPremiumPhotoPaths(slug)
  const visible = pickVisibleSections(config, detail, cfg)
  const usedImages = new Set<string>()

  const hero = heroImageForPage(detail, paths, slug, config, productLabel)
  usedImages.add(hero.src)

  const workflowSteps = buildIndustryWorkflowSteps(detail, slug, productLabel, lang)
  const { featured, extra } = buildFeatureImageCards(detail, paths, slug, config, productLabel, usedImages)
  const alternating = buildAlternatingBenefits(detail, paths, slug, config, productLabel, usedImages)

  const overviewCaps = detail.features.slice(0, 4)
  const overviewExtra = detail.features.slice(4)
  const dashboardFallbacks = slugPhotoFallbackChain(slug, [
    config.dashboardScreenshot,
    'financialReports',
    'teamMeeting',
    'heroTeam',
  ])

  const seoIndustryItems =
    detail.seoBlocks.flatMap((b) => b.lists?.flatMap((l) => l.items) ?? []) ?? []

  const industryCards = buildIndustryCardsFromDetail(
    cfg.industriesSection.items,
    seoIndustryItems,
    slug,
    (s) => getPremiumPhotoPaths(s),
    paths,
    usedImages,
  )

  const capabilityTabs = detail.vouchersReports.tabs.map((tab) => ({
    id: tab.id,
    label: tab.title,
    heading: tab.title,
    items: tab.items.map((item) => ({ name: item.name, description: item.description || undefined })),
  }))

  const hasChallenge =
    cfg.challengeBullets.length > 0 ||
    cfg.challengesIntro.trim().length > 0 ||
    cfg.solutionParagraphs.length > 0

  const annotated = buildAnnotatedViewSection(detail, paths, slug, config, productLabel, dashboardFallbacks)
  const imageFeatures = buildImageFeaturesSection(cfg, featured, extra, productLabel)
  const testimonial = buildTestimonialSection(detail, paths, slug, productLabel)

  return {
    hero: {
      eyebrow: detail.hero.eyebrow,
      headline: detail.hero.headline,
      subhead: detail.hero.subhead,
      introParagraphs: splitIntroParagraphs(detail.hero.intro),
      ctaPrimary: detail.hero.ctaPrimary,
      ctaSecondary: detail.hero.ctaSecondary,
      heroImage: hero.src,
      heroImageAlt: hero.alt,
      heroImageFallbacks: hero.fallbacks,
      statusPanel: cfg.heroChips?.length
        ? cfg.heroChips.map((c) => ({ label: c.label, value: c.value, hint: c.hint }))
        : undefined,
    },
    metrics: detail.hero.trust.map((t) => ({ value: t.value, label: t.label, icon: t.icon })),
    workflow:
      visible.workflow && workflowSteps.length >= 2
        ? { heading: detail.vouchersReports.heading, steps: workflowSteps }
        : undefined,
    overview: {
      heading: cfg.featuresHeading,
      lead: cfg.featuresLead,
      screenshot: resolveSlugPhoto(paths, config.overviewScreenshot, slug),
      screenshotAlt: `${productLabel} — software dashboard overview`,
      screenshotFallbacks: dashboardFallbacks,
      capabilities: overviewCaps.map((f) => ({
        icon: f.icon,
        title: f.title,
        description: f.description,
      })),
      extraCapabilities: overviewExtra.map((f) => ({
        icon: f.icon,
        title: f.title,
        description: f.description,
      })),
    },
    imageFeatures: visible.imageFeatures && imageFeatures ? imageFeatures : undefined,
    annotatedView: visible.annotatedView && annotated ? annotated : undefined,
    challengeSolution:
      visible.challengeSolution && hasChallenge
        ? {
            challengeHeading: cfg.challengesHeading,
            challengeIntro: cfg.challengesIntro,
            challengeListLead: cfg.challengeBullets.length > 0 ? cfg.challengesListLead : undefined,
            challenges: cfg.challengeBullets,
            solutionHeading: cfg.solutionHeading,
            solutions: cfg.solutionParagraphs,
          }
        : undefined,
    alternatingBenefits:
      visible.alternatingBenefits && alternating.length > 0 ? alternating : undefined,
    roles:
      visible.roles && detail.whyChoose.points.length >= 2
        ? {
            heading: detail.whyChoose.heading,
            items: detail.whyChoose.points.slice(0, 4).map((p) => ({
              title: p.title,
              description: p.body,
              icon: resolveDetailIconName(p.title, p.body),
            })),
          }
        : undefined,
    capabilities:
      visible.capabilities && capabilityTabs.length > 0
        ? {
            heading: detail.vouchersReports.heading,
            lead: detail.vouchersReports.subheading,
            tabs: capabilityTabs,
            solutionHeading: visible.challengeSolution ? undefined : cfg.solutionHeading,
            solutionParagraphs: visible.challengeSolution ? undefined : cfg.solutionParagraphs,
          }
        : undefined,
    implementation:
      visible.implementation && detail.implementation.length > 0
        ? {
            heading: cfg.implementationSectionTitle,
            lead: cfg.implementationSectionLead,
            steps: detail.implementation.map((s) => ({
              icon: s.icon,
              title: s.title,
              description: s.description,
            })),
          }
        : undefined,
    testimonial: visible.testimonial && testimonial ? testimonial : undefined,
    demo: {
      heading: detail.demoCta.heading,
      sub: detail.demoCta.sub,
      whatsappHref: detail.demoCta.whatsappHref,
      whatsappLabel: detail.demoCta.whatsappLabel,
      sendLabel: cfg.demoSendButtonLabel,
    },
    faqs:
      visible.faqs && detail.faqs.length > 0
        ? { heading: cfg.faqSectionHeading, items: detail.faqs.map((f) => ({ q: f.q, a: f.a })) }
        : undefined,
    industriesSection:
      visible.industriesSection && industryCards.length > 0
        ? {
            heading: cfg.industriesSection.heading,
            lead: cfg.industriesSection.description,
            cards: industryCards.slice(0, 3).map((c) => ({
              title: c.label,
              description: c.description,
              image: c.image,
              imageAlt: `${c.label} — ${productLabel}`,
              to: c.to,
            })),
            extraCards: industryCards.slice(3).map((c) => ({
              title: c.label,
              description: c.description,
              image: c.image,
              imageAlt: `${c.label} — ${productLabel}`,
              to: c.to,
            })),
          }
        : undefined,
  }
}
