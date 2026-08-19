import { pick } from './pick'
import type { Lang } from '../i18n/messages'
import type { DemoCtaCms, ErpModulesHeaderCms, PersonalizedDemoCms, TestimonialsCms } from '../types/homepageCms'

type CmsPayload = Record<string, unknown> | undefined

export function resolveDemoCtaCms(cms: CmsPayload, t: (key: string) => string, lang: Lang): {
  title: string
  description: string
  buttonLabel: string
  enabled: boolean
} {
  const doc = cms?.demoCta as DemoCtaCms | undefined
  if (!doc) {
    return {
      title: t('demoCta.title'),
      description: t('demoCta.desc'),
      buttonLabel: t('demoCta.button'),
      enabled: true,
    }
  }
  return {
    title: pick(doc.title, lang) || t('demoCta.title'),
    description: pick(doc.description, lang) || t('demoCta.desc'),
    buttonLabel: pick(doc.buttonLabel, lang) || t('demoCta.button'),
    enabled: doc.enabled !== false,
  }
}

export function resolveErpModulesHeader(cms: CmsPayload, t: (key: string) => string, lang: Lang): {
  eyebrow: string
  title: string
} {
  const doc = cms?.valueChain as ErpModulesHeaderCms | undefined
  return {
    eyebrow: doc?.eyebrow ? pick(doc.eyebrow, lang) : t('erpModules.eyebrow'),
    title: doc?.title ? pick(doc.title, lang) : t('erpModules.sectionTitle'),
  }
}

export function resolveTestimonialsCms(cms: CmsPayload, t: (key: string) => string, lang: Lang): {
  eyebrow: string
  title: string
  items: {
    id: string
    quote: string
    customerName: string
    designation: string
    company: string
    image: string
    imageAlt: string
  }[]
} {
  const doc = cms?.testimonials as TestimonialsCms | undefined
  const fallbackItems = ['fahad', 'ayesha', 'usman', 'sara', 'bilal', 'nadia'].map((key) => ({
    id: key,
    quote: t(`testimonials.items.${key}.quote`),
    customerName: t(`testimonials.items.${key}.name`),
    designation: t(`testimonials.items.${key}.role`),
    company: t(`testimonials.items.${key}.company`),
    image: '',
    imageAlt: t(`testimonials.items.${key}.name`),
  }))

  if (!doc?.items?.length) {
    return {
      eyebrow: t('testimonials.eyebrow'),
      title: t('testimonials.title'),
      items: fallbackItems,
    }
  }

  const items = [...doc.items]
    .filter((item) => item.enabled !== false)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((item) => ({
      id: item.id,
      quote: pick(item.quote, lang),
      customerName: pick(item.customerName, lang),
      designation: pick(item.designation, lang),
      company: pick(item.company, lang),
      image: item.image?.trim() || '',
      imageAlt: item.imageAlt ? pick(item.imageAlt, lang) : pick(item.customerName, lang),
    }))
    .filter((item) => item.quote && item.customerName)

  return {
    eyebrow: doc.eyebrow ? pick(doc.eyebrow, lang) : t('testimonials.eyebrow'),
    title: doc.title ? pick(doc.title, lang) : t('testimonials.title'),
    items: items.length ? items : fallbackItems,
  }
}

export function resolvePersonalizedDemoCms(cms: CmsPayload, t: (key: string) => string, lang: Lang) {
  const doc = cms?.personalizedDemo as PersonalizedDemoCms | undefined
  if (!doc || doc.enabled === false) {
    return {
      enabled: true,
      eyebrow: t('personalizedDemo.eyebrow'),
      title: t('personalizedDemo.title'),
      description: t('personalizedDemo.desc'),
      submitLabel: t('personalizedDemo.submit'),
      successMessage: t('personalizedDemo.success'),
      errorMessage: t('personalizedDemo.formError'),
      highlights: [
        { id: 'tour', label: t('personalizedDemo.highlights.tour') },
        { id: 'commitment', label: t('personalizedDemo.highlights.commitment') },
        { id: 'response', label: t('personalizedDemo.highlights.response') },
      ],
    }
  }

  return {
    enabled: true,
    eyebrow: pick(doc.eyebrow, lang) || t('personalizedDemo.eyebrow'),
    title: pick(doc.title, lang) || t('personalizedDemo.title'),
    description: pick(doc.description, lang) || t('personalizedDemo.desc'),
    submitLabel: pick(doc.submitLabel, lang) || t('personalizedDemo.submit'),
    successMessage: pick(doc.successMessage, lang) || t('personalizedDemo.success'),
    errorMessage: pick(doc.errorMessage, lang) || t('personalizedDemo.formError'),
    highlights: [...(doc.highlights || [])]
      .filter((h) => h.enabled !== false)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((h) => ({
        id: h.id,
        label: pick(h.label, lang),
      })),
  }
}
