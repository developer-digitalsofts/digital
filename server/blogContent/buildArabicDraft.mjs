/**
 * Builds an Arabic blog post draft paired with an English source article.
 * Uses pre-authored MSA metadata and condensed section translations from the catalog.
 */

import { bi, buildArticleBody, buildFaq } from './buildArticleBody.mjs'

/**
 * @typedef {import('./catalog.mjs').ArticleDef} ArticleDef
 */

/**
 * Create an Arabic BlogPostRecord draft from catalog article metadata.
 *
 * @param {ArticleDef} article
 * @param {{
 *   englishPostId: string
 *   translationPairId?: string
 *   publishDate?: string
 *   updatedDate?: string
 *   status?: 'draft'|'published'
 *   translationStatus?: 'draft'|'needs_review'|'approved'|'published'
 * }} options
 * @returns {Record<string, unknown>}
 */
export function buildArabicDraft(article, options) {
  const {
    englishPostId,
    translationPairId = englishPostId,
    publishDate = '',
    updatedDate = '',
    status = 'draft',
    translationStatus = 'needs_review',
  } = options

  const faqItems = (article.faq || []).map((item) => ({
    id: item.id,
    question: bi(item.question, item.questionAr || ''),
    answer: bi(item.answer, item.answerAr || ''),
  }))

  const body = buildArticleBody(article.sections, 'ar')

  return {
    id: `${article.id}-ar`,
    internalTitle: `${article.title} (Arabic draft)`,
    translationPairId,
    translationStatus,
    title: bi(article.title, article.titleAr),
    slug: article.slug,
    excerpt: bi(article.excerpt, article.excerptAr),
    featuredImage: article.featuredImage,
    featuredImageAlt: bi(article.featuredImageAlt, article.featuredImageAltAr || ''),
    categoryId: article.categoryId,
    tags: article.tags,
    author: bi('DigitalManager Team', 'فريق ديجيتال مانجر'),
    authorRole: bi('Product & Operations', 'المنتج والعمليات'),
    authorImage: '',
    body,
    faq: buildFaq(faqItems),
    relatedPostIds: [],
    relatedSolutionUrl: article.relatedSolutionUrl || '',
    primaryKeyword: article.primaryKeywordAr || article.primaryKeyword,
    searchIntent: article.searchIntent,
    ctaHeading: bi(
      article.ctaHeading || 'Talk to our team',
      article.ctaHeadingAr || 'تحدث مع فريقنا',
    ),
    ctaDescription: bi(
      article.ctaDescription || 'Book a demo tailored to your operations.',
      article.ctaDescriptionAr || 'احجز عرضاً مخصصاً لعملياتك.',
    ),
    ctaLabel: bi('Book a Demo', 'احجز عرضاً'),
    ctaUrl: '/contact',
    featured: article.featured ?? false,
    showOnHomepage: article.showOnHomepage ?? false,
    sortOrder: article.sortOrder ?? 0,
    publishDate,
    updatedDate,
    status,
    enabled: true,
    countryCode: article.countryCode ?? null,
    languageCode: 'ar',
    seo: {
      title: bi(article.seoTitle, article.seoTitleAr || ''),
      description: bi(article.seoDescription, article.seoDescriptionAr || ''),
      canonicalUrl: `/blog/${article.slug}`,
      ogTitle: bi(article.title, article.titleAr || ''),
      ogDescription: bi(article.excerpt, article.excerptAr || ''),
      ogImage: article.featuredImage,
      robotsIndex: false,
      robotsFollow: true,
    },
    _seedVersion: article._seedVersion,
  }
}

/**
 * Create the English BlogPostRecord from catalog article metadata.
 *
 * @param {ArticleDef} article
 * @param {{
 *   publishDate?: string
 *   updatedDate?: string
 *   status?: 'draft'|'published'
 *   translationPairId?: string
 * }} [options]
 * @returns {Record<string, unknown>}
 */
export function buildEnglishPost(article, options = {}) {
  const {
    publishDate = '',
    updatedDate = '',
    status = 'draft',
    translationPairId,
  } = options

  const faqItems = (article.faq || []).map((item) => ({
    id: item.id,
    question: item.question,
    answer: item.answer,
  }))

  return {
    id: article.id,
    internalTitle: article.title,
    translationPairId: translationPairId || article.id,
    translationStatus: 'draft',
    title: bi(article.title, article.titleAr || ''),
    slug: article.slug,
    excerpt: bi(article.excerpt, article.excerptAr || ''),
    featuredImage: article.featuredImage,
    featuredImageAlt: bi(article.featuredImageAlt, article.featuredImageAltAr || ''),
    categoryId: article.categoryId,
    tags: article.tags,
    author: bi('DigitalManager Team', 'فريق ديجيتال مانجر'),
    authorRole: bi('Product & Operations', 'المنتج والعمليات'),
    authorImage: '',
    body: buildArticleBody(article.sections, 'en'),
    faq: buildFaq(faqItems),
    relatedPostIds: [],
    relatedSolutionUrl: article.relatedSolutionUrl || '',
    primaryKeyword: article.primaryKeyword,
    searchIntent: article.searchIntent,
    ctaHeading: bi(
      article.ctaHeading || 'Talk to our team',
      article.ctaHeadingAr || 'تحدث مع فريقنا',
    ),
    ctaDescription: bi(
      article.ctaDescription || 'Book a demo tailored to your operations.',
      article.ctaDescriptionAr || 'احجز عرضاً مخصصاً لعملياتك.',
    ),
    ctaLabel: bi('Book a Demo', 'احجز عرضاً'),
    ctaUrl: '/contact',
    featured: article.featured ?? false,
    showOnHomepage: article.showOnHomepage ?? false,
    sortOrder: article.sortOrder ?? 0,
    publishDate,
    updatedDate,
    status,
    enabled: true,
    countryCode: article.countryCode ?? null,
    languageCode: 'en',
    seo: {
      title: bi(article.seoTitle, article.seoTitleAr || ''),
      description: bi(article.seoDescription, article.seoDescriptionAr || ''),
      canonicalUrl: `/blog/${article.slug}`,
      ogTitle: bi(article.seoTitle, article.seoTitleAr || ''),
      ogDescription: bi(article.seoDescription, article.seoDescriptionAr || ''),
      ogImage: article.featuredImage,
      robotsIndex: false,
      robotsFollow: true,
    },
    _seedVersion: article._seedVersion,
  }
}
