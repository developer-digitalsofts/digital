/** Maps admin homepage tabs to locale record identities. */
import type { AdminHomeEditorTabId } from './home/adminHomeEditorTabs'

export type LocaleSectionRef = {
  contentType: string
  globalIdentity: string
  slug?: string
}

export const HOME_TAB_LOCALE: Partial<Record<AdminHomeEditorTabId, LocaleSectionRef>> = {
  hero: { contentType: 'pageSection', globalIdentity: 'hero', slug: 'hero' },
  stats: { contentType: 'pageSection', globalIdentity: 'stats', slug: 'stats' },
  about: { contentType: 'pageSection', globalIdentity: 'about', slug: 'about' },
  features: { contentType: 'pageSection', globalIdentity: 'valueChain', slug: 'valueChain' },
  modules: { contentType: 'pageSection', globalIdentity: 'modules', slug: 'modules' },
  testimonials: { contentType: 'pageSection', globalIdentity: 'testimonials', slug: 'testimonials' },
  faqs: { contentType: 'faq', globalIdentity: 'faqs', slug: 'faqs' },
}

export const ADMIN_EDITOR_LOCALE: Record<string, LocaleSectionRef> = {
  header: { contentType: 'navigation', globalIdentity: 'header', slug: 'header' },
  footer: { contentType: 'footer', globalIdentity: 'footer', slug: 'footer' },
  seo: { contentType: 'seo', globalIdentity: 'site', slug: 'seo' },
  contact: { contentType: 'contact', globalIdentity: 'contact', slug: 'contact' },
  erp: { contentType: 'solution', globalIdentity: 'erp', slug: 'erp' },
  industries: { contentType: 'industry', globalIdentity: 'industries-list', slug: 'industries' },
  solutions: { contentType: 'solution', globalIdentity: 'solutions-list', slug: 'solutions' },
  'business-models': { contentType: 'businessModel', globalIdentity: 'business-models-list', slug: 'business-models' },
  testimonials: { contentType: 'testimonial', globalIdentity: 'testimonials', slug: 'testimonials' },
  blog: { contentType: 'blog', globalIdentity: 'blog', slug: 'blog' },
}

/** Maps legacy admin section keys to locale records when editing non-UAE locales. */
export const ADMIN_SECTION_LOCALE: Record<string, LocaleSectionRef> = {
  ...Object.fromEntries(
    Object.entries(HOME_TAB_LOCALE).filter(([, v]) => v).map(([k, v]) => [k, v!]),
  ),
  header: ADMIN_EDITOR_LOCALE.header,
  footer: ADMIN_EDITOR_LOCALE.footer,
  seo: ADMIN_EDITOR_LOCALE.seo,
  contact: ADMIN_EDITOR_LOCALE.contact,
  faqs: HOME_TAB_LOCALE.faqs!,
}
