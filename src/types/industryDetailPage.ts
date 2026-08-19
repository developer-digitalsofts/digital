import type { DetailDemoModel, DetailMetricModel, DetailMockupVariant } from './detailPageSections'

export type IndustryHeroModel = {
  eyebrow: string
  headline: string
  subhead: string
  introLead: string
  introMore: string[]
  benefits: string[]
  ctaPrimary: { label: string; to: string }
  ctaSecondary: { label: string; to: string }
  heroImage: string
  heroImageAlt: string
  heroImageFallbacks?: string[]
  objectPosition?: string
}

export type IndustryWorkflowStepModel = {
  label: string
  description: string
  icon?: string
}

export type IndustryWorkflowModel = {
  heading: string
  steps: IndustryWorkflowStepModel[]
}

export type IndustryOperationalCardModel = {
  title: string
  description: string
  image: string
  imageAlt: string
  icon?: string
}

export type IndustryChallengeSolutionModel = {
  challengeHeading: string
  challenges: string[]
  solutionHeading: string
  solutions: string[]
}

export type IndustryCapabilityRowModel = {
  icon: string
  title: string
  description: string
}

export type IndustryDashboardShowcaseModel = {
  heading: string
  lead?: string
  mockupVariant: DetailMockupVariant
  capabilities: IndustryCapabilityRowModel[]
}

export type IndustryAnalyticsModel = {
  heading: string
  mockupVariant: DetailMockupVariant
  benefits: { title: string; description: string }[]
}

export type IndustryBenefitRowModel = {
  title: string
  paragraphs: string[]
  bullets: string[]
  image: string
  imageAlt: string
  reverse?: boolean
}

export type IndustryRoleCardModel = {
  title: string
  description: string
  icon: string
}

export type IndustryBusinessTypeModel = {
  title: string
  image: string
  imageAlt: string
  to?: string
}

export type IndustryTestimonialModel = {
  quote: string
  attribution: string
  role?: string
  image?: string
  imageAlt?: string
  kpis: { value: string; label: string }[]
}

export type IndustryImplementationModel = {
  heading: string
  lead?: string
  steps: { icon: string; title: string; description: string }[]
}

export type IndustryFinalCtaModel = {
  heading: string
  sub: string
  ctaPrimary: { label: string; to: string }
  ctaSecondary: { label: string; to: string }
  trustPoints?: string[]
}

export type IndustryDetailPageSections = {
  hero: IndustryHeroModel
  metrics: DetailMetricModel[]
  workflow: IndustryWorkflowModel
  operationalCards: IndustryOperationalCardModel[]
  challengeSolution: IndustryChallengeSolutionModel
  dashboardShowcase: IndustryDashboardShowcaseModel
  analytics: IndustryAnalyticsModel
  benefitRows: IndustryBenefitRowModel[]
  roles: { heading: string; cards: IndustryRoleCardModel[] }
  businessTypes: { heading: string; cards: IndustryBusinessTypeModel[] }
  testimonial?: IndustryTestimonialModel
  implementation: IndustryImplementationModel
  finalCta: IndustryFinalCtaModel
  demo: DetailDemoModel
  faqs?: { heading: string; items: { q: string; a: string }[] }
}
