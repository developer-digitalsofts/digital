import { getIndustryRichPage } from '../industryRichPages'
import type { Lang } from '../../i18n/messages'
import type { SoftwareDetailPageData } from './types'
import { splitIntroParagraphs, buildTestimonialSection } from './detailPageMapUtils'
import { resolveIndustryHeroImage } from './industryHeroImages'
import { resolveIndustrySectionImages } from './industrySectionImages'
import { getPremiumPhotoPaths } from './premiumImagePacks'
import { getUniqueHeading } from './detailHeadingUtils'
import {
  DEFAULT_INDUSTRY_ROLES,
  industryAnalyticsHeading,
  industryWorkflowHeading,
  industryWorkflowOverride,
  mockupVariantForIndustrySlug,
} from './industryDetailConfig'
import type { IndustryDetailPageSections } from '../../types/industryDetailPage'

function buildWorkflow(
  detail: SoftwareDetailPageData,
  slug: string,
  productLabel: string,
  lang: Lang,
): IndustryDetailPageSections['workflow'] {
  const rich = getIndustryRichPage(slug, productLabel, lang)
  const override = industryWorkflowOverride(slug)
  const richSteps = rich?.workflows ?? []
  const featureDescs = detail.features.map((f) => f.description)

  const steps = (override ?? richSteps.map((w) => ({ label: w.step }))).map((step, idx) => ({
    label: step.label,
    description:
      richSteps[idx]?.detail ??
      featureDescs[idx] ??
      detail.features[idx]?.description ??
      `Structured ${step.label.toLowerCase()} within ${productLabel}.`,
  }))

  return {
    heading: industryWorkflowHeading(slug, productLabel),
    steps: steps.slice(0, 7),
  }
}

function buildImplementation(
  detail: SoftwareDetailPageData,
  cfg: NonNullable<SoftwareDetailPageData['premiumLayout']>,
): IndustryDetailPageSections['implementation'] {
  const steps =
    detail.implementation.length >= 4
      ? detail.implementation.slice(0, 4)
      : [
          { icon: 'MessageSquare', title: 'Understanding', description: 'Structured discovery to map how your teams work today.' },
          { icon: 'Database', title: 'Setup & Data', description: 'Chart setup, master imports, and validation before go-live.' },
          { icon: 'GraduationCap', title: 'Training', description: 'Role-based training and sandbox sign-off with your key users.' },
          { icon: 'Rocket', title: 'Go Live & Support', description: 'Cutover assistance and ongoing support so adoption stays on track.' },
        ]

  return {
    heading: cfg.implementationSectionTitle || 'Get Started in Simple Steps',
    lead: cfg.implementationSectionLead,
    steps,
  }
}

/** Map existing industry page data into the Petrol master layout. */
export function mapIndustryMasterSections(
  detail: SoftwareDetailPageData,
  slug: string,
  productLabel: string,
  lang: Lang,
): IndustryDetailPageSections {
  const cfg = detail.premiumLayout ?? detail.accounts!
  const rich = getIndustryRichPage(slug, productLabel, lang)
  const variant = mockupVariantForIndustrySlug(slug)
  const introParts = splitIntroParagraphs(detail.hero.intro)
  const { eyebrow } = getUniqueHeading(detail.hero.eyebrow, productLabel)

  const hero = resolveIndustryHeroImage(detail, slug, productLabel)

  const businessItems = cfg.industriesSection.items.length >= 4
    ? cfg.industriesSection.items.slice(0, 4)
    : detail.features.slice(0, 4).map((f) => ({ label: f.title, to: '/contact#contact-form' }))

  const benefitHeadings: { title: string; reverse: boolean }[] = []
  if (detail.whyChoose.points.length > 0 || detail.whyChoose.intro) {
    benefitHeadings.push({
      title: detail.whyChoose.heading || `Operational Control for ${productLabel}`,
      reverse: false,
    })
  }
  if (detail.realtimeReports.bullets.length > 0 || detail.realtimeReports.intro) {
    benefitHeadings.push({
      title: detail.realtimeReports.heading || industryAnalyticsHeading(slug, productLabel),
      reverse: true,
    })
  }

  const sectionImages = resolveIndustrySectionImages(detail, slug, productLabel, {
    heroSrc: hero.src,
    featureTitles: detail.features.slice(0, 3).map((f) => f.title),
    businessTitles: businessItems.map((item) => item.label),
    benefitHeadings,
  })

  const operationalCards = detail.features.slice(0, 3).map((f, idx) => ({
    title: f.title,
    description: f.description,
    image: sectionImages.operational[idx]?.src ?? hero.fallbacks[0] ?? hero.src,
    imageAlt: sectionImages.operational[idx]?.alt ?? `${productLabel} — ${f.title}`,
    icon: f.icon,
  }))

  const challenges =
    cfg.challengeBullets.length > 0
      ? cfg.challengeBullets
      : detail.challengesSolutions.map((c) => c.challenge).filter(Boolean)
  if (!challenges.length && cfg.challengesIntro) challenges.push(cfg.challengesIntro)

  const solutions =
    cfg.solutionParagraphs.length > 0
      ? cfg.solutionParagraphs
      : detail.challengesSolutions.map((c) => c.solution).filter(Boolean)

  const analyticsBenefits =
    detail.realtimeReports.bullets.length > 0
      ? detail.realtimeReports.bullets.slice(0, 5).map((b) => ({ title: b.title, description: b.text }))
      : detail.features.slice(0, 5).map((f) => ({ title: f.title, description: f.description }))

  const benefitRows: IndustryDetailPageSections['benefitRows'] = []

  if (detail.whyChoose.points.length > 0 || detail.whyChoose.intro) {
    const img = sectionImages.benefitRows[0]
    benefitRows.push({
      title: detail.whyChoose.heading || `Operational Control for ${productLabel}`,
      paragraphs: detail.whyChoose.intro ? [detail.whyChoose.intro] : [detail.hero.subhead],
      bullets: detail.whyChoose.points.length
        ? detail.whyChoose.points.map((p) => p.title)
        : detail.features.slice(0, 3).map((f) => f.title),
      image: img?.src ?? sectionImages.operational[0]?.src ?? hero.src,
      imageAlt: img?.alt ?? `${productLabel} — operations`,
      reverse: false,
    })
  }

  if (detail.realtimeReports.bullets.length > 0 || detail.realtimeReports.intro) {
    const img = sectionImages.benefitRows[1] ?? sectionImages.benefitRows[0]
    benefitRows.push({
      title: detail.realtimeReports.heading || 'Reporting & Visibility',
      paragraphs: [detail.realtimeReports.intro || cfg.featuresLead],
      bullets: detail.realtimeReports.bullets.slice(0, 3).map((b) => b.title),
      image: img?.src ?? sectionImages.operational[1]?.src ?? hero.src,
      imageAlt: img?.alt ?? `${productLabel} — operational view`,
      reverse: true,
    })
  }

  const businessCards = businessItems.map((item, idx) => ({
    title: item.label,
    image: sectionImages.businessTypes[idx]?.src ?? hero.fallbacks[idx] ?? hero.src,
    imageAlt: sectionImages.businessTypes[idx]?.alt ?? `${item.label} — ${productLabel}`,
    to: item.to,
  }))

  const testimonialBase = buildTestimonialSection(detail, getPremiumPhotoPaths(slug), slug, productLabel)
  const testimonial = testimonialBase
    ? {
        quote: testimonialBase.quote,
        attribution: testimonialBase.attribution,
        role: `${productLabel} customer`,
        image: sectionImages.testimonial?.src ?? testimonialBase.image,
        imageAlt: sectionImages.testimonial?.alt ?? testimonialBase.imageAlt,
        kpis: detail.hero.trust.slice(0, 3).map((t) => ({ value: t.value, label: t.label })),
      }
    : detail.hero.trust.length >= 2
      ? {
          quote: rich?.intro ?? detail.hero.subhead,
          attribution: productLabel,
          role: 'Verified operations team',
          image: sectionImages.testimonial?.src ?? hero.fallbacks[0] ?? hero.src,
          imageAlt: sectionImages.testimonial?.alt ?? `${productLabel} customer`,
          kpis: detail.hero.trust.slice(0, 3).map((t) => ({ value: t.value, label: t.label })),
        }
      : undefined

  return {
    hero: {
      eyebrow: eyebrow ?? detail.hero.eyebrow,
      headline: detail.hero.headline,
      subhead: detail.hero.subhead,
      introLead: introParts[0] ?? '',
      introMore: introParts.slice(1),
      benefits: rich?.highlights?.slice(0, 3) ?? detail.features.slice(0, 3).map((f) => f.title),
      ctaPrimary: detail.hero.ctaPrimary.label.toLowerCase().includes('demo')
        ? detail.hero.ctaPrimary
        : { label: 'Get Live Demo', to: detail.hero.ctaPrimary.to },
      ctaSecondary: {
        label: detail.demoCta.whatsappLabel || 'WhatsApp Now',
        to: detail.demoCta.whatsappHref,
      },
      heroImage: hero.src,
      heroImageAlt: hero.alt,
      heroImageFallbacks: hero.fallbacks,
      objectPosition: hero.objectPosition,
    },
    metrics: detail.hero.trust.slice(0, 4).map((t) => ({ value: t.value, label: t.label, icon: t.icon })),
    workflow: buildWorkflow(detail, slug, productLabel, lang),
    operationalCards,
    challengeSolution: {
      challengeHeading: cfg.challengesHeading || 'The Challenge',
      challenges: challenges.slice(0, 6),
      solutionHeading: cfg.solutionHeading || 'DigitalManager Solution',
      solutions: solutions.slice(0, 6),
    },
    dashboardShowcase: {
      heading: cfg.featuresHeading || `One Connected ${productLabel} System`,
      lead: cfg.featuresLead,
      mockupVariant: variant,
      capabilities: detail.features.slice(0, 4).map((f) => ({
        icon: f.icon,
        title: f.title,
        description: f.description,
      })),
    },
    analytics: {
      heading: industryAnalyticsHeading(slug, productLabel),
      mockupVariant: variant,
      benefits: analyticsBenefits,
    },
    benefitRows: benefitRows.slice(0, 2),
    roles: {
      heading: 'Made for Every Role',
      cards: DEFAULT_INDUSTRY_ROLES.map((r) => ({
        title: r.title,
        description: r.description,
        icon: r.icon,
      })),
    },
    businessTypes: {
      heading: cfg.industriesSection.heading || 'Solutions for Every Business Type',
      cards: businessCards,
    },
    testimonial,
    implementation: buildImplementation(detail, cfg),
    finalCta: {
      heading: detail.demoCta.heading,
      sub: detail.demoCta.sub,
      ctaPrimary: { label: 'Get Live Demo', to: detail.demoCta.contactHref || '/contact#contact-form' },
      ctaSecondary: {
        label: detail.demoCta.whatsappLabel || 'WhatsApp Now',
        to: detail.demoCta.whatsappHref,
      },
      trustPoints: rich?.highlights?.slice(0, 3),
    },
    demo: {
      heading: detail.demoCta.heading,
      sub: detail.demoCta.sub,
      whatsappHref: detail.demoCta.whatsappHref,
      whatsappLabel: detail.demoCta.whatsappLabel,
      sendLabel: cfg.demoSendButtonLabel,
    },
    faqs:
      detail.faqs.length > 0
        ? { heading: cfg.faqSectionHeading || `${productLabel} FAQs`, items: detail.faqs.map((f) => ({ q: f.q, a: f.a })) }
        : undefined,
  }
}
