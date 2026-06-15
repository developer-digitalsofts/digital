/** Rich software / industry detail page — used by `/software/:kind/:slug`. */

export type SoftwareTrustStat = { value: string; label: string; icon?: string }

export type SoftwareFeatureCard = {
  icon: string
  title: string
  description: string
}

export type SoftwareNamedItem = { name: string; description: string }

export type SoftwareTabBlock = {
  id: string
  title: string
  items: SoftwareNamedItem[]
}

export type SoftwareChallengeSolution = { challenge: string; solution: string }

export type SoftwareWhyPoint = { title: string; body: string }

export type SoftwareReportBullet = { title: string; text: string }

export type SoftwareRelatedLink = { kind: 'module' | 'industry'; slug: string; label: string }

export type SoftwareImplementationStep = { icon: string; title: string; description: string }

export type SoftwareSeoBlock = {
  heading: string
  level: 2 | 3
  paragraphs: string[]
  lists?: { title?: string; items: string[] }[]
}

export type SoftwareFaqItem = { q: string; a: string }

/**
 * Premium SaaS/ERP detail layout (Accounts page is the reference implementation).
 * `accounts-management` keeps legacy layout id; other pages use `premium`.
 */
export type SoftwarePremiumPageConfig = {
  layout: 'accounts-management' | 'premium'
  featuresHeading: string
  featuresLead: string
  vouchersSectionEyebrow: string
  challengesHeading: string
  /** Intro paragraph above the numbered challenge list */
  challengesIntro: string
  /** Short line before bullets (e.g. “Common challenges include:”) */
  challengesListLead: string
  challengeBullets: string[]
  solutionHeading: string
  solutionParagraphs: string[]
  /** Optional hero stat chips (defaults provided by builder for non-accounts pages) */
  heroChips?: { label: string; value: string; hint: string }[]
  industriesSection: {
    heading: string
    description: string
    items: { label: string; to: string }[]
    note: string
  }
  implementationSectionTitle: string
  implementationSectionLead: string
  faqSectionHeading: string
  demoFormVariant: 'email-phone'
  demoSendButtonLabel: string
  heroAsideCaption: string
}

/** @deprecated Use SoftwarePremiumPageConfig */
export type SoftwareAccountsPageConfig = SoftwarePremiumPageConfig

export type SoftwareDetailPageData = {
  metaTitle: string
  metaDescription: string
  /** Accounts page (reference). Same shape as premiumLayout. */
  accounts?: SoftwarePremiumPageConfig
  /** All other module & industry mega-menu pages use this for the premium template. */
  premiumLayout?: SoftwarePremiumPageConfig
  /** CMS override — replaces default premium hero photo when set. */
  heroImageUrl?: string
  hero: {
    eyebrow: string
    headline: string
    subhead: string
    intro: string
    trust: SoftwareTrustStat[]
    ctaPrimary: { label: string; to: string }
    ctaSecondary: { label: string; to: string }
  }
  features: SoftwareFeatureCard[]
  vouchersReports: {
    heading: string
    subheading: string
    tabs: SoftwareTabBlock[]
  }
  challengesSolutions: SoftwareChallengeSolution[]
  whyChoose: {
    heading: string
    intro: string
    points: SoftwareWhyPoint[]
  }
  realtimeReports: {
    heading: string
    intro: string
    bullets: SoftwareReportBullet[]
  }
  related: SoftwareRelatedLink[]
  implementation: SoftwareImplementationStep[]
  demoCta: {
    heading: string
    sub: string
    whatsappLabel: string
    whatsappHref: string
    contactHref: string
  }
  seoBlocks: SoftwareSeoBlock[]
  faqs: SoftwareFaqItem[]
}
