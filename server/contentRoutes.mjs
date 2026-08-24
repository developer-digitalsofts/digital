/**
 * Public + admin-adjacent content routes for testimonials and blog.
 */
import { nanoid } from 'nanoid'
import {
  CONTENT_SCHEMA,
  estimateReadingMinutes,
  isPublishedRecord,
  isValidTestimonial,
  readBilingualText,
  slugify,
  stripAdminFieldsBlogPost,
  stripAdminFieldsTestimonial,
  uniqueSlug,
} from './contentHelpers.mjs'
import { matchesCountryScope, normalizeCountryCode, publishedCountries, defaultCountriesDoc } from './countryHelpers.mjs'
import { detectCountryFromRequest } from './localeHelpers.mjs'
import { createLocalePublishHelpers } from './localePublish.mjs'
import { buildSitemapXml, PUBLIC_SITE_BASE, resolveSeoForPath } from './seoResolve.mjs'

const BLOG_FILES = {
  posts: 'blogPosts.json',
  categories: 'blogCategories.json',
  section: 'blogSection.json',
}

export function registerContentRoutes(app, deps) {
  const {
    authMiddleware,
    publishStore,
    localeStorage,
    readJsonFile,
    safeReadJson,
    writeJsonFile,
    sendPublicJson,
    invalidatePublishedContentCaches,
    logActivity,
  } = deps

  const localePublish = localeStorage ? createLocalePublishHelpers({ localeStorage, publishStore }) : null
  const seoDeps = () => ({ localePublish, publishStore })

  async function readPublishedDoc(file) {
    return publishStore.readPublished(file)
  }

  async function readDraftDoc(file, fallback = { items: [] }) {
    return (await safeReadJson(file, fallback)) || fallback
  }

  function matchesTestimonialLanguage(item, lang) {
    const code = (item.languageCode || '').trim().toLowerCase()
    if (!code) return true
    return code === lang
  }

  function publishedTestimonials(doc, lang = 'en', countryCode = 'AE') {
    const section = doc?.section || {}
    const page = doc?.page || {}
    const selectedCountry = normalizeCountryCode(countryCode)
    const items = (doc?.items || [])
      .filter(
        (item) =>
          isPublishedRecord(item) &&
          item.isSample !== true &&
          isValidTestimonial(item) &&
          matchesCountryScope(item.countryCode, selectedCountry) &&
          matchesTestimonialLanguage(item, lang),
      )
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((item) => ({
        ...stripAdminFieldsTestimonial(item),
        quote: readBilingualText(item.quote, lang),
        customerName: readBilingualText(item.customerName, lang),
        designation: readBilingualText(item.designation, lang),
        company: readBilingualText(item.company, lang),
        companyLogo: item.companyLogo?.trim() || '',
        companyLogoAlt: readBilingualText(item.companyLogoAlt, lang),
        image: item.image?.trim() || '',
        imageAlt: readBilingualText(item.imageAlt, lang) || readBilingualText(item.customerName, lang),
        productService: readBilingualText(item.productService, lang),
        industry: item.industry || '',
        city: item.city || '',
        country: item.country || '',
        rating: typeof item.rating === 'number' ? item.rating : undefined,
        verified: item.verified === true,
        caseStudyUrl: item.caseStudyUrl?.trim() || '',
        solutionUrl: item.solutionUrl?.trim() || '',
        featuredOnHomepage: item.featuredOnHomepage === true,
      }))

    return {
      schemaVersion: doc?.schemaVersion ?? CONTENT_SCHEMA.testimonials,
      section: {
        enabled: section.enabled !== false,
        eyebrow: readBilingualText(section.eyebrow, lang),
        heading: readBilingualText(section.heading, lang),
        supportingText: readBilingualText(section.supportingText, lang),
        limit: typeof section.limit === 'number' ? section.limit : 6,
        selectionMode: section.selectionMode === 'manual' ? 'manual' : 'featured',
        manualIds: Array.isArray(section.manualIds) ? section.manualIds : [],
        viewAllLabel: readBilingualText(section.viewAllLabel, lang),
        viewAllUrl: section.viewAllUrl?.trim() || '/testimonials',
        showViewAll: section.showViewAll !== false,
      },
      page: {
        enabled: page.enabled !== false,
        eyebrow: readBilingualText(page.eyebrow, lang),
        title: readBilingualText(page.title, lang),
        intro: readBilingualText(page.intro, lang),
        seoTitle: readBilingualText(page.seoTitle, lang),
        seoDescription: readBilingualText(page.seoDescription, lang),
      },
      items,
    }
  }

  function selectHomepageTestimonials(payload, limit) {
    const { section, items } = payload
    if (!section.enabled || !items.length) return []
    let selected = []
    if (section.selectionMode === 'manual' && section.manualIds?.length) {
      const byId = new Map(items.map((i) => [i.id, i]))
      selected = section.manualIds.map((id) => byId.get(id)).filter(Boolean)
    } else {
      selected = items.filter((i) => i.featuredOnHomepage)
      if (!selected.length) selected = items
    }
    return selected.slice(0, Math.max(1, limit || section.limit || 6))
  }

  function publishedBlogCategories(doc, lang = 'en') {
    return (doc?.items || [])
      .filter((c) => c.enabled !== false)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .map((c) => ({
        id: c.id,
        name: readBilingualText(c.name, lang),
        slug: c.slug,
        description: readBilingualText(c.description, lang),
      }))
  }

  function resolveCategory(categoryId, categories) {
    return categories.find((c) => c.id === categoryId) || { id: '', name: '', slug: '', description: '' }
  }

  function matchesBlogLanguage(post, lang) {
    const code = (post.languageCode || '').trim().toLowerCase()
    if (code) return code === lang
    return Boolean(readBilingualText(post.title, lang))
  }

  function publishedBlogPosts(doc, categories, lang = 'en', countryCode = 'AE') {
    const selectedCountry = normalizeCountryCode(countryCode)
    return (doc?.items || [])
      .filter(
        (p) =>
          isPublishedRecord(p) &&
          p.slug &&
          readBilingualText(p.title, lang) &&
          matchesCountryScope(p.countryCode, selectedCountry) &&
          matchesBlogLanguage(p, lang),
      )
      .sort((a, b) => {
        const da = Date.parse(a.publishDate || '') || 0
        const db = Date.parse(b.publishDate || '') || 0
        return db - da
      })
      .map((p) => mapBlogPostPublic(p, categories, lang))
  }

  function mapBlogPostPublic(post, categories, lang = 'en') {
    const cat = resolveCategory(post.categoryId, categories)
    const body = Array.isArray(post.body) ? post.body : []
    return {
      id: post.id,
      slug: post.slug,
      title: readBilingualText(post.title, lang),
      excerpt: readBilingualText(post.excerpt, lang),
      featuredImage: post.featuredImage?.trim() || '',
      featuredImageAlt: readBilingualText(post.featuredImageAlt, lang) || readBilingualText(post.title, lang),
      categoryId: cat.id,
      categoryName: cat.name,
      categorySlug: cat.slug,
      tags: Array.isArray(post.tags) ? post.tags.filter(Boolean) : [],
      author: readBilingualText(post.author, lang),
      authorRole: readBilingualText(post.authorRole, lang),
      authorImage: post.authorImage?.trim() || '',
      body,
      faq: (post.faq || []).map((item) => ({
        id: item.id,
        question: readBilingualText(item.question, lang),
        answer: readBilingualText(item.answer, lang),
      })),
      relatedPostIds: Array.isArray(post.relatedPostIds) ? post.relatedPostIds.filter(Boolean) : [],
      relatedSolutionUrl: post.relatedSolutionUrl?.trim() || '',
      ctaHeading: readBilingualText(post.ctaHeading, lang),
      ctaDescription: readBilingualText(post.ctaDescription, lang),
      ctaLabel: readBilingualText(post.ctaLabel, lang),
      ctaUrl: post.ctaUrl?.trim() || '/contact',
      featured: post.featured === true,
      showOnHomepage: post.showOnHomepage === true,
      publishDate: post.publishDate || '',
      updatedDate: post.updatedDate || post.publishDate || '',
      readingMinutes: estimateReadingMinutes(body, lang),
      seo: {
        title: readBilingualText(post.seo?.title, lang) || readBilingualText(post.title, lang),
        description: readBilingualText(post.seo?.description, lang) || readBilingualText(post.excerpt, lang),
        canonicalUrl: post.seo?.canonicalUrl?.trim() || `/blog/${post.slug}`,
        ogTitle: readBilingualText(post.seo?.ogTitle, lang) || readBilingualText(post.title, lang),
        ogDescription: readBilingualText(post.seo?.ogDescription, lang) || readBilingualText(post.excerpt, lang),
        ogImage: post.seo?.ogImage?.trim() || post.featuredImage?.trim() || '',
        robotsIndex: post.seo?.robotsIndex !== false,
        robotsFollow: post.seo?.robotsFollow !== false,
      },
    }
  }

  app.get('/api/public/locale-hint', (req, res) => {
    const countryCode = detectCountryFromRequest(req) || 'AE'
    res.json({ countryCode, source: countryCode === 'AE' ? 'fallback' : 'header' })
  })

  app.get('/api/public/countries', async (req, res) => {
    try {
      const lang = req.query.lang === 'ar' ? 'ar' : 'en'
      const doc = await readPublishedDoc('countries.json')
      sendPublicJson(res, publishedCountries(publishStore.stripMeta(doc) ?? { items: [] }, lang))
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: 'Failed to load countries' })
    }
  })

  app.get('/api/public/testimonials', async (req, res) => {
    try {
      const lang = req.query.lang === 'ar' ? 'ar' : 'en'
      const country = normalizeCountryCode(req.query.country)
      const doc = await readPublishedDoc('testimonials.json')
      const payload = publishedTestimonials(publishStore.stripMeta(doc) ?? { items: [] }, lang, country)
      sendPublicJson(res, payload)
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: 'Failed to load testimonials' })
    }
  })

  app.get('/api/public/blog/categories', async (req, res) => {
    try {
      const lang = req.query.lang === 'ar' ? 'ar' : 'en'
      const doc = await readPublishedDoc(BLOG_FILES.categories)
      sendPublicJson(res, {
        items: publishedBlogCategories(publishStore.stripMeta(doc) ?? { items: [] }, lang),
      })
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: 'Failed to load blog categories' })
    }
  })

  app.get('/api/public/blog/posts', async (req, res) => {
    try {
      const lang = req.query.lang === 'ar' ? 'ar' : 'en'
      const country = normalizeCountryCode(req.query.country)
      const category = typeof req.query.category === 'string' ? req.query.category.trim() : ''
      const search = typeof req.query.search === 'string' ? req.query.search.trim().toLowerCase() : ''
      const page = Math.max(1, Number.parseInt(String(req.query.page || '1'), 10) || 1)
      const pageSize = Math.min(24, Math.max(1, Number.parseInt(String(req.query.pageSize || '9'), 10) || 9))

      const [postsDoc, catsDoc, sectionDoc] = await Promise.all([
        readPublishedDoc(BLOG_FILES.posts),
        readPublishedDoc(BLOG_FILES.categories),
        readPublishedDoc(BLOG_FILES.section),
      ])
      const categories = publishedBlogCategories(publishStore.stripMeta(catsDoc) ?? { items: [] }, lang)
      let posts = publishedBlogPosts(publishStore.stripMeta(postsDoc) ?? { items: [] }, categories, lang, country)

      if (category) {
        posts = posts.filter((p) => p.categorySlug === category || p.categoryId === category)
      }
      if (search) {
        posts = posts.filter((p) => {
          const bodyText = (p.body || [])
            .map((block) => {
              if (!block || typeof block !== 'object') return ''
              if ('text' in block) return readBilingualText(block.text, lang)
              if (block.type === 'bulletList' || block.type === 'numberedList') {
                return (block.items || []).map((item) => readBilingualText(item, lang)).join(' ')
              }
              return ''
            })
            .join(' ')
          const hay = `${p.title} ${p.excerpt} ${p.categoryName} ${p.tags.join(' ')} ${bodyText}`.toLowerCase()
          return hay.includes(search)
        })
      }

      const total = posts.length
      const start = (page - 1) * pageSize
      const slice = posts.slice(start, start + pageSize)
      const sectionRaw = publishStore.stripMeta(sectionDoc) ?? {}
      const section = sectionRaw.section || {}

      sendPublicJson(res, {
        items: slice,
        pagination: { page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) },
        section: {
          enabled: section.enabled !== false,
          eyebrow: readBilingualText(section.eyebrow, lang),
          heading: readBilingualText(section.heading, lang),
          supportingText: readBilingualText(section.supportingText, lang),
          viewAllLabel: readBilingualText(section.viewAllLabel, lang),
          viewAllUrl: section.viewAllUrl?.trim() || '/blog',
        },
      })
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: 'Failed to load blog posts' })
    }
  })

  app.get('/api/public/blog/posts/:slug', async (req, res) => {
    try {
      const lang = req.query.lang === 'ar' ? 'ar' : 'en'
      const country = normalizeCountryCode(req.query.country)
      const slug = slugify(req.params.slug)
      const [postsDoc, catsDoc] = await Promise.all([
        readPublishedDoc(BLOG_FILES.posts),
        readPublishedDoc(BLOG_FILES.categories),
      ])
      const categories = publishedBlogCategories(publishStore.stripMeta(catsDoc) ?? { items: [] }, lang)
      const posts = publishedBlogPosts(publishStore.stripMeta(postsDoc) ?? { items: [] }, categories, lang, country)
      const post = posts.find((p) => p.slug === slug)
      if (!post) {
        sendPublicJson(res, { error: 'Not found' }, 404)
        return
      }
      const relatedById = new Map(posts.map((p) => [p.id, p]))
      let related = (post.relatedPostIds || [])
        .map((id) => relatedById.get(id))
        .filter(Boolean)
      if (!related.length) {
        related = posts
          .filter((p) => p.id !== post.id && (p.categoryId === post.categoryId || p.tags.some((t) => post.tags.includes(t))))
          .slice(0, 3)
      } else {
        related = related.slice(0, 3)
      }
      const idx = posts.findIndex((p) => p.id === post.id)
      sendPublicJson(res, {
        post,
        related,
        prev: idx > 0 ? { slug: posts[idx - 1].slug, title: posts[idx - 1].title } : null,
        next: idx >= 0 && idx < posts.length - 1 ? { slug: posts[idx + 1].slug, title: posts[idx + 1].title } : null,
      })
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: 'Failed to load blog post' })
    }
  })

  app.get('/api/public/blog/homepage', async (req, res) => {
    try {
      const lang = req.query.lang === 'ar' ? 'ar' : 'en'
      const country = normalizeCountryCode(req.query.country)
      const limit = Math.min(6, Math.max(1, Number.parseInt(String(req.query.limit || '3'), 10) || 3))
      const [postsDoc, catsDoc, sectionDoc] = await Promise.all([
        readPublishedDoc(BLOG_FILES.posts),
        readPublishedDoc(BLOG_FILES.categories),
        readPublishedDoc(BLOG_FILES.section),
      ])
      const categories = publishedBlogCategories(publishStore.stripMeta(catsDoc) ?? { items: [] }, lang)
      const posts = publishedBlogPosts(publishStore.stripMeta(postsDoc) ?? { items: [] }, categories, lang, country)
      const sectionRaw = publishStore.stripMeta(sectionDoc) ?? {}
      const section = sectionRaw.section || {}
      if (section.enabled === false) {
        sendPublicJson(res, { enabled: false, items: [], section: { enabled: false } })
        return
      }
      let selected = []
      if (section.selectionMode === 'manual' && Array.isArray(section.manualIds) && section.manualIds.length) {
        const byId = new Map(posts.map((p) => [p.id, p]))
        selected = section.manualIds.map((id) => byId.get(id)).filter(Boolean)
      } else if (section.selectionMode === 'featured') {
        selected = posts.filter((p) => p.featured || p.showOnHomepage)
        if (!selected.length) selected = posts
      } else {
        selected = posts
      }
      const featured = selected.find((p) => p.featured) || selected[0]
      const rest = selected.filter((p) => p.id !== featured?.id).slice(0, limit - 1)
      sendPublicJson(res, {
        enabled: true,
        section: {
          eyebrow: readBilingualText(section.eyebrow, lang),
          heading: readBilingualText(section.heading, lang),
          supportingText: readBilingualText(section.supportingText, lang),
          viewAllLabel: readBilingualText(section.viewAllLabel, lang),
          viewAllUrl: section.viewAllUrl?.trim() || '/blog',
        },
        featured,
        items: rest,
      })
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: 'Failed to load homepage blog preview' })
    }
  })

  app.get('/robots.txt', (_req, res) => {
    const body = [
      'User-agent: *',
      'Allow: /',
      'Disallow: /admin',
      'Disallow: /api/',
      '',
      `Sitemap: ${PUBLIC_SITE_BASE}/sitemap.xml`,
      `LLMs: ${PUBLIC_SITE_BASE}/llms.txt`,
      '',
    ].join('\n')
    res.type('text/plain; charset=utf-8').send(body)
  })

  app.get('/api/public/seo-page', async (req, res) => {
    try {
      if (!localePublish) {
        res.status(503).json({ error: 'SEO resolver unavailable' })
        return
      }
      const pathParam = String(req.query.path || '/').trim() || '/'
      const seo = await resolveSeoForPath(seoDeps(), pathParam)
      res.set({ 'Cache-Control': 'public, max-age=60' })
      res.json(seo)
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: 'Failed to resolve SEO metadata' })
    }
  })

  app.get('/sitemap.xml', async (_req, res) => {
    try {
      if (!localePublish) {
        res.status(503).type('text/plain').send('Sitemap unavailable')
        return
      }
      const { xml } = await buildSitemapXml(seoDeps())
      res.set('Content-Type', 'application/xml; charset=utf-8')
      res.set('Cache-Control', 'public, max-age=300')
      res.send(xml)
    } catch (e) {
      console.error(e)
      res.status(500).type('text/plain').send('Sitemap unavailable')
    }
  })

  return {
    BLOG_FILES,
    publishedTestimonials,
    selectHomepageTestimonials,
    publishedBlogPosts,
  }
}

export async function ensureBlogBootstrap({ safeReadJson, writeJsonFile, defaultDataMeta }) {
  const categoriesFallback = {
    schemaVersion: CONTENT_SCHEMA.blogCategories,
    items: [
      { id: 'cat-erp', name: { en: 'ERP', ar: 'ERP' }, slug: 'erp', description: { en: '', ar: '' }, sortOrder: 0, enabled: true },
      { id: 'cat-pos', name: { en: 'POS', ar: 'نقطة البيع' }, slug: 'pos', description: { en: '', ar: '' }, sortOrder: 1, enabled: true },
      { id: 'cat-inventory', name: { en: 'Inventory', ar: 'المخزون' }, slug: 'inventory', description: { en: '', ar: '' }, sortOrder: 2, enabled: true },
      { id: 'cat-accounting', name: { en: 'Accounting', ar: 'المحاسبة' }, slug: 'accounting', description: { en: '', ar: '' }, sortOrder: 3, enabled: true },
      { id: 'cat-automation', name: { en: 'Business Automation', ar: 'أتمتة الأعمال' }, slug: 'business-automation', description: { en: '', ar: '' }, sortOrder: 4, enabled: true },
      { id: 'cat-transformation', name: { en: 'Digital Transformation', ar: 'التحول الرقمي' }, slug: 'digital-transformation', description: { en: '', ar: '' }, sortOrder: 5, enabled: true },
      { id: 'cat-industry', name: { en: 'Industry Insights', ar: 'رؤى القطاعات' }, slug: 'industry-insights', description: { en: '', ar: '' }, sortOrder: 6, enabled: true },
    ],
    _meta: defaultDataMeta(),
  }

  const postsFallback = { schemaVersion: CONTENT_SCHEMA.blogPosts, items: [], _meta: defaultDataMeta() }
  const sectionFallback = {
    schemaVersion: CONTENT_SCHEMA.blogSection,
    section: {
      enabled: true,
      eyebrow: { en: 'LATEST INSIGHTS', ar: 'أحدث الرؤى' },
      heading: { en: 'Insights for Growing UAE Businesses', ar: 'رؤى للشركات النامية في الإمارات' },
      supportingText: {
        en: 'Practical guidance on ERP, retail, inventory, finance and digital operations.',
        ar: 'إرشادات عملية حول ERP والتجزئة والمخزون والمالية والعمليات الرقمية.',
      },
      limit: 3,
      selectionMode: 'recent',
      manualIds: [],
      viewAllLabel: { en: 'View All Insights', ar: 'عرض كل الرؤى' },
      viewAllUrl: '/blog',
    },
    _meta: defaultDataMeta(),
  }

  for (const [file, fallback] of [
    [BLOG_FILES.categories, categoriesFallback],
    [BLOG_FILES.posts, postsFallback],
    [BLOG_FILES.section, sectionFallback],
  ]) {
    const existing = await safeReadJson(file, null)
    if (!existing) await writeJsonFile(file, fallback)
  }
}

export async function ensureCountriesBootstrap(deps) {
  const { safeReadJson, writeJsonFile, defaultDataMeta } = deps
  const existing = await safeReadJson('countries.json', null)
  if (!existing) {
    await writeJsonFile('countries.json', { ...defaultCountriesDoc(), _meta: defaultDataMeta() })
  }
}
