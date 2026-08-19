/** Section models for approved detail-page layout — populated from existing page data. */

export type DetailMockupVariant =
  | 'accounts'
  | 'inventory'
  | 'production'
  | 'pos'
  | 'payroll'
  | 'petrol'
  | 'textile'
  | 'poultry'
  | 'agriculture'
  | 'crm'
  | 'generic-module'
  | 'generic-industry'

export type DetailHeroModel = {
  eyebrow: string
  headline: string
  subhead: string
  introParagraphs: string[]
  ctaPrimary: { label: string; to: string }
  ctaSecondary: { label: string; to: string }
  heroImage: string
  heroImageAlt: string
  heroImageFallbacks?: string[]
  statusPanel?: { label: string; value: string; hint: string }[]
}

export type DetailMetricModel = {
  value: string
  label: string
  icon?: string
}

export type DetailWorkflowStepModel = {
  label: string
  icon?: string
  description?: string
}

export type DetailOverviewCapabilityModel = {
  icon: string
  title: string
  description: string
}

export type DetailOverviewModel = {
  heading: string
  lead: string
  screenshot: string
  screenshotAlt: string
  screenshotFallbacks?: string[]
  capabilities: DetailOverviewCapabilityModel[]
  extraCapabilities?: DetailOverviewCapabilityModel[]
}

export type DetailImageFeatureCardModel = {
  title: string
  description: string
  image: string
  imageAlt: string
  to?: string
}

export type DetailImageFeaturesModel = {
  heading: string
  lead?: string
  cards: DetailImageFeatureCardModel[]
  extraCards?: DetailImageFeatureCardModel[]
}

export type DetailAnnotatedCalloutModel = {
  title: string
  description?: string
  position: 'tl' | 'tr' | 'bl' | 'br'
}

export type DetailAnnotatedViewModel = {
  heading: string
  lead?: string
  screenshot: string
  screenshotAlt: string
  screenshotFallbacks?: string[]
  callouts: DetailAnnotatedCalloutModel[]
}

export type DetailChallengeSolutionModel = {
  challengeHeading: string
  challengeIntro?: string
  challengeListLead?: string
  challenges: string[]
  solutionHeading: string
  solutions: string[]
}

export type DetailAlternatingBenefitModel = {
  title: string
  paragraphs: string[]
  bullets?: string[]
  visual: 'photo' | 'mockup'
  image?: string
  imageAlt?: string
  mockupVariant?: DetailMockupVariant
}

export type DetailRoleModel = {
  title: string
  description: string
  icon: string
}

export type DetailTestimonialModel = {
  quote: string
  attribution: string
  image: string
  imageAlt: string
  results: { value: string; label: string; icon?: string }[]
}

export type DetailImplementationModel = {
  heading: string
  lead?: string
  steps: { icon: string; title: string; description: string }[]
}

export type DetailCapabilitiesTabModel = {
  id: string
  label: string
  heading: string
  intro?: string
  listLead?: string
  bullets?: string[]
  items?: { name: string; description?: string }[]
}

export type DetailCapabilitiesModel = {
  heading: string
  lead?: string
  tabs: DetailCapabilitiesTabModel[]
  solutionHeading?: string
  solutionParagraphs?: string[]
}

export type DetailFaqModel = {
  heading: string
  items: { q: string; a: string }[]
}

export type DetailDemoModel = {
  heading: string
  sub: string
  whatsappHref?: string
  whatsappLabel?: string
  sendLabel: string
}

export type ApprovedDetailPageSections = {
  hero: DetailHeroModel
  metrics: DetailMetricModel[]
  workflow?: { heading: string; steps: DetailWorkflowStepModel[] }
  overview: DetailOverviewModel
  imageFeatures?: DetailImageFeaturesModel
  industriesSection?: DetailImageFeaturesModel
  annotatedView?: DetailAnnotatedViewModel
  challengeSolution?: DetailChallengeSolutionModel
  alternatingBenefits?: DetailAlternatingBenefitModel[]
  roles?: { heading: string; items: DetailRoleModel[] }
  testimonial?: DetailTestimonialModel
  capabilities?: DetailCapabilitiesModel
  implementation?: DetailImplementationModel
  demo: DetailDemoModel
  faqs?: DetailFaqModel
}
