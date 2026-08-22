import { resolveTestimonialsDoc, selectHomepageTestimonials } from './contentApi'
import type { Lang } from '../i18n/messages'
import type { TestimonialsContentDoc } from '../types/testimonialsContent'

export function resolveHomepageTestimonials(cms: Record<string, unknown> | undefined, lang: Lang) {
  const doc = cms?.testimonials as TestimonialsContentDoc | undefined
  const resolved = resolveTestimonialsDoc(doc, lang)
  const items = selectHomepageTestimonials(resolved)
  return {
    visible: resolved.sectionEnabled && items.length > 0,
    eyebrow: resolved.eyebrow,
    heading: resolved.heading,
    supportingText: resolved.supportingText,
    viewAllLabel: resolved.viewAllLabel,
    viewAllUrl: resolved.viewAllUrl,
    showViewAll: resolved.showViewAll,
    items,
  }
}
