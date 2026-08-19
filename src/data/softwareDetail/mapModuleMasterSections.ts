import { getModuleRichPage } from '../moduleRichPages'
import type { Lang } from '../../i18n/messages'
import type { SoftwareDetailPageData } from './types'
import { getPremiumPhotoPaths } from './premiumImagePacks'
import { resolveSlugPhoto } from './detailPageConfig'
import { splitIntroParagraphs } from './detailPageMapUtils'
import { getUniqueHeading } from './detailHeadingUtils'
import {
  defaultRolesForSlug,
  integrationsForSlug,
  mockupVariantForModuleSlug,
  MODULE_NAV_ITEMS,
  visibilityHeadingForSlug,
  workflowStepsForSlug,
} from './moduleDetailConfig'
import type { ModuleAlternatingSectionModel, ModuleDetailPageSections } from '../../types/moduleDetailPage'

function moduleShortLabel(productLabel: string): string {
  return productLabel.replace(/\s+Management$/i, '').replace(/\s+Software$/i, '').trim() || productLabel
}

function buildWorkflow(
  detail: SoftwareDetailPageData,
  slug: string,
  productLabel: string,
  lang: Lang,
): ModuleDetailPageSections['workflow'] {
  const rich = getModuleRichPage(slug, lang)
  const override = workflowStepsForSlug(slug)
  const richSteps = rich?.workflows ?? []
  const featureDescs = detail.features.map((f) => f.description)
  const tabItems = detail.vouchersReports.tabs.flatMap((t) => t.items.map((i) => i.name))

  const steps = (override ?? richSteps.map((w) => ({ label: w.step, description: w.detail }))).map(
    (step, idx) => ({
      label: step.label,
      description:
        step.description ??
        richSteps[idx]?.detail ??
        featureDescs[idx] ??
        tabItems[idx] ??
        `Structured ${step.label.toLowerCase()} within ${productLabel}.`,
    }),
  )

  return {
    heading: `Connected ${moduleShortLabel(productLabel)} Workflow`,
    steps: steps.slice(0, 7),
  }
}

function buildChallenges(
  detail: SoftwareDetailPageData,
  cfg: NonNullable<SoftwareDetailPageData['premiumLayout'] | SoftwareDetailPageData['accounts']>,
): ModuleDetailPageSections['challengeSolution'] {
  const challenges =
    cfg.challengeBullets.length > 0
      ? cfg.challengeBullets
      : detail.challengesSolutions.map((c) => c.challenge).filter(Boolean)

  if (!challenges.length && cfg.challengesIntro) {
    challenges.push(cfg.challengesIntro)
  }

  const solutions =
    cfg.solutionParagraphs.length > 0
      ? cfg.solutionParagraphs
      : detail.challengesSolutions.map((c) => c.solution).filter(Boolean)

  return {
    challengeHeading: cfg.challengesHeading || 'Common Challenges',
    challenges: challenges.slice(0, 6),
    solutionHeading: cfg.solutionHeading || 'DigitalManager Solution',
    solutions: solutions.slice(0, 6),
  }
}

function buildAlternating(
  detail: SoftwareDetailPageData,
  paths: ReturnType<typeof getPremiumPhotoPaths>,
  slug: string,
  productLabel: string,
): ModuleAlternatingSectionModel[] {
  const variant = mockupVariantForModuleSlug(slug)
  const photoSlots = ['teamMeeting', 'heroTeam', 'ledgerOffice'] as const
  const photo = resolveSlugPhoto(paths, photoSlots[0], slug)
  const photo2 = resolveSlugPhoto(paths, photoSlots[1], slug)

  const autoBullets =
    detail.whyChoose.points.length > 0
      ? detail.whyChoose.points.map((p) => p.title)
      : detail.features.slice(0, 3).map((f) => f.title)

  const autoParagraphs = detail.whyChoose.intro
    ? [detail.whyChoose.intro]
    : detail.features.slice(0, 1).map((f) => f.description)

  const reportBullets = detail.realtimeReports.bullets.map((b) => b.title)
  const reportParagraphs = detail.realtimeReports.bullets.map((b) => b.text)

  const sections: ModuleAlternatingSectionModel[] = [
    {
      title: detail.whyChoose.heading || `Automate ${moduleShortLabel(productLabel)} Operations`,
      paragraphs: autoParagraphs.length ? autoParagraphs : [detail.hero.subhead],
      bullets: autoBullets.slice(0, 3),
      visual: 'photo' as const,
      image: photo,
      imageAlt: `${productLabel} — operational team`,
      reverse: false,
    },
    {
      title: detail.realtimeReports.heading || 'Reporting & Decision Support',
      paragraphs: reportParagraphs.length
        ? reportParagraphs.slice(0, 2)
        : [detail.realtimeReports.intro || cfgLead(detail)],
      bullets: reportBullets.length ? reportBullets.slice(0, 3) : detail.features.slice(3, 6).map((f) => f.title),
      visual: 'mockup' as const,
      mockupVariant: variant,
      mockupSize: 'showcase' as const,
      reverse: true,
    },
  ]

  if (detail.seoBlocks[0]) {
    sections.push({
      title: detail.seoBlocks[0].heading,
      paragraphs: detail.seoBlocks[0].paragraphs.slice(0, 2),
      bullets: detail.seoBlocks[0].lists?.[0]?.items.slice(0, 3) ?? [],
      visual: 'photo',
      image: photo2,
      imageAlt: `${productLabel} — operations`,
      reverse: false,
    })
  }

  return sections.slice(0, 2)
}

function cfgLead(detail: SoftwareDetailPageData): string {
  const cfg = detail.accounts ?? detail.premiumLayout
  return cfg?.featuresLead ?? detail.hero.subhead
}

function buildFeatureStories(
  detail: SoftwareDetailPageData,
  paths: ReturnType<typeof getPremiumPhotoPaths>,
  slug: string,
  productLabel: string,
): ModuleDetailPageSections['featureStories'] {
  const slots = ['heroTeam', 'teamMeeting', 'ledgerOffice', 'financialReports', 'dashboard'] as const
  const cards = detail.features.slice(0, 3).map((feature, idx) => ({
    title: feature.title,
    description: feature.description,
    image: resolveSlugPhoto(paths, slots[idx % slots.length], slug),
    imageAlt: `${productLabel} — ${feature.title}`,
    to: '/contact#contact-form',
  }))
  return { cards }
}

function buildImplementation(
  detail: SoftwareDetailPageData,
  cfg: NonNullable<SoftwareDetailPageData['premiumLayout'] | SoftwareDetailPageData['accounts']>,
): ModuleDetailPageSections['implementation'] {
  const steps =
    detail.implementation.length > 0
      ? detail.implementation
      : [
          { icon: 'MessageSquare', title: 'Requirement Discussion', description: 'Structured discovery to map how your teams work today.' },
          { icon: 'Settings', title: 'System Configuration', description: 'Chart setup, approval paths, and module parameters aligned to your process.' },
          { icon: 'Database', title: 'Data Migration & Setup', description: 'Master imports, opening balances, and validation before go-live.' },
          { icon: 'GraduationCap', title: 'User Training & Testing', description: 'Role-based training and sandbox sign-off with your key users.' },
          { icon: 'Rocket', title: 'Go Live & Support', description: 'Cutover assistance and ongoing support so adoption stays on track.' },
        ]

  return {
    heading: cfg.implementationSectionTitle || 'Get Started in Simple Steps',
    lead: cfg.implementationSectionLead || 'A proven rollout path from discovery through go-live.',
    steps,
  }
}

/** Map existing module page data into the Inventory master layout. */
export function mapModuleMasterSections(
  detail: SoftwareDetailPageData,
  slug: string,
  productLabel: string,
  lang: Lang,
): ModuleDetailPageSections {
  const cfg = detail.accounts ?? detail.premiumLayout!
  const paths = getPremiumPhotoPaths(slug)
  const rich = getModuleRichPage(slug, lang)
  const variant = mockupVariantForModuleSlug(slug)
  const introParts = splitIntroParagraphs(detail.hero.intro)
  const { eyebrow } = getUniqueHeading(detail.hero.eyebrow, productLabel)

  const capabilityCards = detail.features.slice(0, 4).map((f) => ({
    icon: f.icon,
    title: f.title,
    description: f.description,
    linkLabel: `View ${f.title.split(' ')[0]} →`,
    linkTo: '/contact#contact-form',
  }))

  const operationalBenefits =
    rich && rich.highlights.length >= 3
      ? rich.highlights.slice(0, 6)
      : detail.features.slice(0, 6).map((f) => `${f.title} — ${f.description}`)

  const visibilityPoints =
    detail.realtimeReports.bullets.length > 0
      ? detail.realtimeReports.bullets.slice(0, 5).map((b) => ({ title: b.title, description: b.text }))
      : detail.features.slice(0, 5).map((f) => ({ title: f.title, description: f.description }))

  const roleCards = defaultRolesForSlug(slug).map((r) => ({
    title: r.title,
    description: r.description,
    icon: r.icon,
  }))

  const txTabs = detail.vouchersReports.tabs.map((tab) => ({
    id: tab.id,
    label: tab.title,
    heading: tab.title,
    items: tab.items.map((item) => ({ name: item.name, description: item.description || undefined })),
  }))

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
      mockupVariant: variant,
    },
    metrics: detail.hero.trust.map((t) => ({ value: t.value, label: t.label, icon: t.icon })),
    nav: MODULE_NAV_ITEMS,
    workflow: buildWorkflow(detail, slug, productLabel, lang),
    capabilities: {
      heading: cfg.featuresHeading || `${moduleShortLabel(productLabel)} Capabilities`,
      lead: cfg.featuresLead,
      mockupVariant: variant,
      preferMockup: true,
      mockupSize: 'showcase',
      screenshotAlt: `${productLabel} — module dashboard`,
      cards: capabilityCards,
    },
    operational: {
      heading: detail.whyChoose.heading || `Everything ${moduleShortLabel(productLabel)} Teams Need`,
      intro: detail.whyChoose.intro || cfg.featuresLead || detail.hero.subhead,
      benefits: operationalBenefits,
      image: resolveSlugPhoto(paths, 'teamMeeting', slug),
      imageAlt: `${productLabel} — operational team at work`,
    },
    featureStories: buildFeatureStories(detail, paths, slug, productLabel),
    visibility: {
      heading: visibilityHeadingForSlug(slug, moduleShortLabel(productLabel)),
      points: visibilityPoints,
      mockupVariant: variant,
      preferMockup: true,
      mockupSize: 'showcase',
      showMarkers: true,
      screenshotAlt: `${productLabel} — visibility dashboard`,
    },
    challengeSolution: buildChallenges(detail, cfg),
    alternating: buildAlternating(detail, paths, slug, productLabel),
    transactions: {
      heading: detail.vouchersReports.heading,
      lead: detail.vouchersReports.subheading,
      tabs: txTabs.length ? txTabs : [{ id: 'transactions', label: 'Transactions', heading: 'Transactions', items: [] }],
    },
    integrations: {
      heading: 'Seamless Integrations',
      centerLabel: moduleShortLabel(productLabel),
      nodes: integrationsForSlug(slug),
    },
    roles: {
      heading: 'Built for Every Role',
      cards: roleCards,
    },
    implementation: buildImplementation(detail, cfg),
    finalCta: {
      heading: detail.demoCta.heading,
      sub: detail.demoCta.sub,
      ctaPrimary: { label: 'Get Live Demo', to: detail.demoCta.contactHref || '/contact#contact-form' },
      ctaSecondary: {
        label: detail.demoCta.whatsappLabel || 'WhatsApp Now',
        to: detail.demoCta.whatsappHref,
      },
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
