/**
 * Create, save, and PUBLISH the 8 Shared GCC English SEO blog articles
 * through the real CMS admin API (draft save → publish).
 *
 * Usage: node scripts/publish-eight-seo-blogs.mjs
 */
import { EIGHT_SEO_ARTICLES, EIGHT_SEO_SEED_VERSION } from '../server/blogContent/eightSeoArticles.mjs'
import { bi, buildArticleBody, buildFaq } from '../server/blogContent/buildArticleBody.mjs'

const API = process.env.API_URL || 'http://127.0.0.1:3040'
const WEB = process.env.BASE_URL || 'http://127.0.0.1:5280'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@admin.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123'

async function json(url, opts = {}) {
  const res = await fetch(url, opts)
  const body = await res.json().catch(() => ({}))
  return { res, body }
}

function buildPublishedPost(article, relatedIds) {
  const now = new Date().toISOString()
  const faqItems = (article.faq || []).map((item) => ({
    id: item.id,
    question: item.question,
    answer: item.answer,
  }))

  return {
    id: article.id,
    internalTitle: article.title,
    translationPairId: article.id,
    translationStatus: 'published',
    title: bi(article.title, ''),
    slug: article.slug,
    excerpt: bi(article.excerpt, ''),
    featuredImage: article.featuredImage,
    featuredImageAlt: bi(article.featuredImageAlt, ''),
    categoryId: article.categoryId,
    tags: article.tags,
    author: bi('DigitalManager Team', 'فريق ديجيتال مانجر'),
    authorRole: bi('Product & Operations', 'المنتج والعمليات'),
    authorImage: '',
    body: buildArticleBody(article.sections, 'en'),
    faq: buildFaq(faqItems),
    relatedPostIds: relatedIds,
    relatedSolutionUrl: article.relatedSolutionUrl || '/erp',
    primaryKeyword: article.primaryKeyword,
    supportingKeywords: article.supportingKeywords || [],
    searchIntent: article.searchIntent,
    ctaHeading: bi(article.ctaHeading || 'See DigitalManager in action', ''),
    ctaDescription: bi(
      article.ctaDescription || 'Book a free demo tailored to your finance, inventory and branch workflows.',
      '',
    ),
    ctaLabel: bi('Book a Demo', 'احجز عرضاً'),
    ctaUrl: '/contact',
    featured: article.featured === true,
    showOnHomepage: article.showOnHomepage === true,
    sortOrder: article.sortOrder ?? 0,
    publishDate: now,
    updatedDate: now,
    status: 'published',
    enabled: true,
    countryCode: 'GCC',
    languageCode: 'en',
    seo: {
      title: bi(article.seoTitle, ''),
      description: bi(article.seoDescription, ''),
      canonicalUrl: `/blog/${article.slug}`,
      ogTitle: bi(article.seoTitle, ''),
      ogDescription: bi(article.seoDescription, ''),
      ogImage: article.featuredImage,
      robotsIndex: true,
      robotsFollow: true,
    },
    _seedVersion: EIGHT_SEO_SEED_VERSION,
    _meta: { updatedBy: 'publish-eight-seo-blogs', updatedAt: now },
  }
}

async function main() {
  console.log('\n=== Publish 8 SEO Blog Articles ===\n')

  const login = await json(`${API}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })
  if (!login.res.ok || !login.body?.token) {
    throw new Error(`Admin login failed: ${login.res.status} ${JSON.stringify(login.body)}`)
  }
  const auth = { Authorization: `Bearer ${login.body.token}`, 'Content-Type': 'application/json' }
  console.log('✓ Admin authenticated')

  const current = await json(`${API}/api/admin/data/blogPosts`, { headers: auth })
  if (!current.res.ok) throw new Error(`Failed to load blogPosts: ${current.res.status}`)
  const doc = current.body
  const items = Array.isArray(doc.items) ? [...doc.items] : []

  const relatedIds = EIGHT_SEO_ARTICLES.map((a) => a.id)
  const built = EIGHT_SEO_ARTICLES.map((article, index) => {
    const others = relatedIds.filter((id) => id !== article.id).slice(index % 3, (index % 3) + 3)
    return buildPublishedPost(article, others.length ? others : relatedIds.filter((id) => id !== article.id).slice(0, 3))
  })

  // Upsert by id
  for (const post of built) {
    const idx = items.findIndex((p) => p.id === post.id || p.slug === post.slug)
    if (idx >= 0) items[idx] = post
    else items.push(post)
    console.log(`✓ Prepared: ${post.slug} (${post.status}, robotsIndex=${post.seo.robotsIndex})`)
  }

  const nextDoc = {
    ...doc,
    schemaVersion: doc.schemaVersion || 1,
    items,
    _meta: { ...(doc._meta || {}), updatedAt: new Date().toISOString(), updatedBy: 'publish-eight-seo-blogs' },
  }

  // Save draft first via CMS
  const save = await json(`${API}/api/admin/data/blogPosts`, {
    method: 'PUT',
    headers: auth,
    body: JSON.stringify(nextDoc),
  })
  if (!save.res.ok) throw new Error(`Save failed: ${save.res.status} ${JSON.stringify(save.body)}`)
  console.log('✓ Saved to CMS draft store')

  // Publish via real CMS publish operation
  const publish = await json(`${API}/api/admin/publish/blogPosts`, {
    method: 'POST',
    headers: auth,
    body: '{}',
  })
  if (!publish.res.ok) throw new Error(`Publish failed: ${publish.res.status} ${JSON.stringify(publish.body)}`)
  console.log('✓ Published blogPosts via CMS')

  // Verify published store + public API
  const pubFile = await json(`${API}/api/public/blog/posts?lang=en&country=AE&pageSize=24`)
  if (!pubFile.res.ok) throw new Error(`Public list failed: ${pubFile.res.status}`)
  const publicSlugs = (pubFile.body.items || []).map((p) => p.slug)
  const missing = EIGHT_SEO_ARTICLES.filter((a) => !publicSlugs.includes(a.slug))
  if (missing.length) {
    throw new Error(`Missing from public API: ${missing.map((m) => m.slug).join(', ')}`)
  }
  console.log(`✓ Public API returns all 8 articles (total published visible: ${pubFile.body.pagination?.total})`)

  for (const article of EIGHT_SEO_ARTICLES) {
    const detail = await json(`${API}/api/public/blog/posts/${article.slug}?lang=en&country=AE`)
    if (!detail.res.ok || !detail.body?.post) {
      throw new Error(`Detail API failed for ${article.slug}: ${detail.res.status}`)
    }
    const post = detail.body.post
    if (!post.body?.length) throw new Error(`Empty body for ${article.slug}`)
    if (!post.faq?.length) throw new Error(`Missing FAQ for ${article.slug}`)
    if (post.seo?.robotsIndex === false) console.warn(`  warn: robotsIndex false on ${article.slug}`)
    console.log(`✓ Detail OK: /blog/${article.slug} (${post.readingMinutes} min, ${post.body.length} blocks, ${post.faq.length} FAQs)`)
  }

  // Web pages
  const listHtml = await fetch(`${WEB}/blog`)
  if (!listHtml.ok) throw new Error(`/blog HTTP ${listHtml.status}`)
  console.log('✓ /blog responds 200')

  for (const article of EIGHT_SEO_ARTICLES) {
    const page = await fetch(`${WEB}/blog/${article.slug}`)
    if (!page.ok) throw new Error(`/blog/${article.slug} HTTP ${page.status}`)
  }
  console.log('✓ All 8 detail routes respond 200')

  // Sitemap
  const sitemap = await fetch(`${API}/sitemap.xml`)
  const sitemapText = await sitemap.text()
  const sitemapMissing = EIGHT_SEO_ARTICLES.filter((a) => !sitemapText.includes(`/blog/${a.slug}`))
  if (sitemapMissing.length) {
    console.warn(`⚠ Sitemap missing: ${sitemapMissing.map((m) => m.slug).join(', ')}`)
  } else {
    console.log('✓ All 8 slugs present in sitemap.xml')
  }

  console.log('\n=== Published URLs ===')
  for (const a of EIGHT_SEO_ARTICLES) {
    console.log(`  ${WEB}/blog/${a.slug}`)
  }
  console.log('\nDone.\n')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
