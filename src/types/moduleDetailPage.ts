import type {
  DetailCapabilitiesModel,
  DetailDemoModel,
  DetailFaqModel,
  DetailImplementationModel,
  DetailMetricModel,
  DetailMockupVariant,
} from './detailPageSections'

export type ModuleNavItem = {
  id: string
  label: string
}

export type ModuleHeroModel = {
  eyebrow: string
  headline: string
  subhead: string
  introLead: string
  introMore: string[]
  benefits: string[]
  ctaPrimary: { label: string; to: string }
  ctaSecondary: { label: string; to: string }
  mockupVariant: DetailMockupVariant
}

export type ModuleWorkflowStepModel = {
  label: string
  description: string
}

export type ModuleWorkflowModel = {
  heading: string
  steps: ModuleWorkflowStepModel[]
}

export type ModuleCapabilityCardModel = {
  icon: string
  title: string
  description: string
  linkLabel: string
  linkTo?: string
}

export type ModuleMockupSize = 'compact' | 'showcase' | 'hero'

export type ModuleCapabilitiesModel = {
  heading: string
  lead?: string
  mockupVariant: DetailMockupVariant
  screenshot?: string
  screenshotAlt?: string
  preferMockup?: boolean
  mockupSize?: ModuleMockupSize
  cards: ModuleCapabilityCardModel[]
}

export type ModuleOperationalModel = {
  heading: string
  intro: string
  benefits: string[]
  image: string
  imageAlt: string
}

export type ModuleFeatureStoryModel = {
  cards: {
    title: string
    description: string
    image: string
    imageAlt: string
    to?: string
  }[]
}

export type ModuleVisibilityModel = {
  heading: string
  points: { title: string; description: string }[]
  mockupVariant: DetailMockupVariant
  screenshot?: string
  screenshotAlt?: string
  preferMockup?: boolean
  mockupSize?: ModuleMockupSize
  showMarkers?: boolean
}

export type ModuleChallengeSolutionModel = {
  challengeHeading: string
  challenges: string[]
  solutionHeading: string
  solutions: string[]
}

export type ModuleAlternatingSectionModel = {
  title: string
  paragraphs: string[]
  bullets: string[]
  visual: 'photo' | 'mockup'
  image?: string
  imageAlt?: string
  mockupVariant?: DetailMockupVariant
  mockupSize?: ModuleMockupSize
  reverse?: boolean
}

export type ModuleIntegrationNodeModel = {
  label: string
  icon?: string
}

export type ModuleIntegrationsModel = {
  heading: string
  centerLabel: string
  nodes: ModuleIntegrationNodeModel[]
}

export type ModuleRoleCardModel = {
  title: string
  description: string
  icon: string
}

export type ModuleRolesModel = {
  heading: string
  cards: ModuleRoleCardModel[]
}

export type ModuleFinalCtaModel = {
  heading: string
  sub: string
  ctaPrimary: { label: string; to: string }
  ctaSecondary: { label: string; to: string }
}

export type ModuleDetailPageSections = {
  hero: ModuleHeroModel
  metrics: DetailMetricModel[]
  nav: ModuleNavItem[]
  workflow: ModuleWorkflowModel
  capabilities: ModuleCapabilitiesModel
  operational: ModuleOperationalModel
  featureStories: ModuleFeatureStoryModel
  visibility: ModuleVisibilityModel
  challengeSolution: ModuleChallengeSolutionModel
  alternating: ModuleAlternatingSectionModel[]
  transactions: DetailCapabilitiesModel
  integrations: ModuleIntegrationsModel
  roles: ModuleRolesModel
  implementation: DetailImplementationModel
  finalCta: ModuleFinalCtaModel
  demo: DetailDemoModel
  faqs?: DetailFaqModel
}
