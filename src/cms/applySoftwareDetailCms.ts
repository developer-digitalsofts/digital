import type { Lang } from '../i18n/messages'
import { pick } from './pick'
import type { SoftwareDetailCmsRecord } from './softwareDetailTypes'
import type { ModuleRichPage } from '../data/moduleRichPages'
import type { SoftwareDetailPageData } from '../data/softwareDetail/types'
import type { IndustrySectionImageOverrides } from '../data/softwareDetail/industrySectionImages'

function pickLang(b: { en: string; ar: string }, lang: Lang): string {
  const v = pick(b, lang)
  return v.trim()
}

function pickList(list: { en: string[]; ar: string[] }, lang: Lang): string[] {
  const rows = lang === 'ar' ? list.ar : list.en
  return Array.isArray(rows) ? rows.filter(Boolean) : []
}

function hasText(b?: { en?: string; ar?: string }): boolean {
  if (!b) return false
  return Boolean((b.en || '').trim() || (b.ar || '').trim())
}

function mergeSectionImages(cms: SoftwareDetailCmsRecord): IndustrySectionImageOverrides | undefined {
  const raw = cms.sectionImages
  if (!raw) return undefined

  const operational = raw.operational?.map((s) => s.trim()).filter(Boolean)
  const benefitRows = raw.benefitRows?.map((s) => s.trim()).filter(Boolean)
  const businessTypes = raw.businessTypes?.map((s) => s.trim()).filter(Boolean)
  const testimonial = raw.testimonial?.trim()

  if (!operational?.length && !benefitRows?.length && !businessTypes?.length && !testimonial) {
    return undefined
  }

  return {
    ...(operational?.length ? { operational } : {}),
    ...(benefitRows?.length ? { benefitRows } : {}),
    ...(businessTypes?.length ? { businessTypes } : {}),
    ...(testimonial ? { testimonial } : {}),
  }
}

/** Merge CMS record into ModuleRichPage / industry rich shape used by the detail builder. */
export function applyCmsToRichPage(
  rich: ModuleRichPage,
  cms: SoftwareDetailCmsRecord | null | undefined,
  lang: Lang,
): ModuleRichPage {
  if (!cms) return rich

  const headline = pickLang(cms.hero.headline, lang) || pickLang(cms.label, lang)
  const subhead = pickLang(cms.hero.subhead, lang) || pickLang(cms.shortDescription, lang)
  const intro = pickLang(cms.hero.intro, lang)

  const hl = pickList(cms.highlights, lang)
  const oc = pickList(cms.outcomes, lang)

  const capabilities =
    cms.capabilities.length > 0
      ? cms.capabilities
          .filter((c) => hasText(c.title) || hasText(c.body))
          .map((c) => ({
            title: pickLang(c.title, lang) || rich.capabilities[0]?.title || '',
            body: pickLang(c.body, lang),
          }))
      : rich.capabilities

  const workflows =
    cms.workflows.length > 0
      ? cms.workflows
          .filter((w) => hasText(w.step) || hasText(w.detail))
          .map((w) => ({
            step: pickLang(w.step, lang),
            detail: pickLang(w.detail, lang),
          }))
      : rich.workflows

  return {
    headline: headline || rich.headline,
    subhead: subhead || rich.subhead,
    intro: intro || rich.intro,
    highlights: hl.length ? hl : rich.highlights,
    capabilities: capabilities.length ? capabilities : rich.capabilities,
    workflows: workflows.length ? workflows : rich.workflows,
    outcomes: oc.length ? oc : rich.outcomes,
  }
}

/** Apply CMS overrides onto built SoftwareDetailPageData. */
export function applyCmsToDetailPage(
  detail: SoftwareDetailPageData,
  cms: SoftwareDetailCmsRecord | null | undefined,
  lang: Lang,
): SoftwareDetailPageData {
  if (!cms) return detail

  const metaTitle = pickLang(cms.metaTitle, lang)
  const metaDescription = pickLang(cms.metaDescription, lang)
  const eyebrow = pickLang(cms.hero.eyebrow, lang)
  const headline = pickLang(cms.hero.headline, lang)
  const subhead = pickLang(cms.hero.subhead, lang)
  const intro = pickLang(cms.hero.intro, lang)
  const ctaPrimaryLabel = pickLang(cms.hero.ctaPrimary.label, lang)
  const ctaSecondaryLabel = pickLang(cms.hero.ctaSecondary.label, lang)
  const demoHeading = pickLang(cms.demoCta.heading, lang)
  const demoSub = pickLang(cms.demoCta.sub, lang)

  const features =
    cms.features.length > 0
      ? cms.features
          .filter((f) => hasText(f.title) || hasText(f.description))
          .map((f) => ({
            icon: f.icon || 'Sparkles',
            title: pickLang(f.title, lang),
            description: pickLang(f.description, lang),
          }))
      : detail.features

  const faqs =
    cms.faqs.length > 0
      ? cms.faqs
          .filter((f) => hasText(f.q) || hasText(f.a))
          .map((f) => ({
            q: pickLang(f.q, lang),
            a: pickLang(f.a, lang),
          }))
      : detail.faqs

  const sectionImages = mergeSectionImages(cms)

  return {
    ...detail,
    metaTitle: metaTitle || detail.metaTitle,
    metaDescription: metaDescription || detail.metaDescription,
    hero: {
      ...detail.hero,
      eyebrow: eyebrow || detail.hero.eyebrow,
      headline: headline || detail.hero.headline,
      subhead: subhead || detail.hero.subhead,
      intro: intro || detail.hero.intro,
      ctaPrimary: {
        label: ctaPrimaryLabel || detail.hero.ctaPrimary.label,
        to: cms.hero.ctaPrimary.href?.trim() || detail.hero.ctaPrimary.to,
      },
      ctaSecondary: {
        label: ctaSecondaryLabel || detail.hero.ctaSecondary.label,
        to: cms.hero.ctaSecondary.href?.trim() || detail.hero.ctaSecondary.to,
      },
    },
    features,
    faqs,
    demoCta: {
      ...detail.demoCta,
      heading: demoHeading || detail.demoCta.heading,
      sub: demoSub || detail.demoCta.sub,
    },
    ...(cms.heroImageUrl.trim() ? { heroImageUrl: cms.heroImageUrl.trim() } : {}),
    ...(sectionImages ? { sectionImages } : {}),
  }
}
