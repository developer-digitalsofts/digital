import { Link, useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { fetchPublicBlogPost } from '../cms/contentApi'
import { BlogArticleBody } from '../components/blog/BlogArticleBody'
import { BlogCard } from '../components/blog/BlogCard'
import { useI18n } from '../i18n/I18nProvider'
import { useLocale } from '../locale/LocaleContext'
import { resolveBlogFeaturedImage } from '../cms/blogMedia'
import { pick } from '../cms/pick'
import type { BlogBlock, ResolvedBlogPost } from '../types/blogContent'
import './content-pages.css'
import '../components/blog/blog.css'

type DetailResponse = {
  post: ResolvedBlogPost
  related: ResolvedBlogPost[]
  prev: { slug: string; title: string } | null
  next: { slug: string; title: string } | null
}

type TocItem = { id: string; text: string; level: 2 | 3 }

function buildToc(blocks: BlogBlock[], lang: 'en' | 'ar'): TocItem[] {
  return blocks
    .filter((b) => b.type === 'heading2' || b.type === 'heading3')
    .map((b, index) => ({
      id: `section-${index}-${b.id}`,
      text: pick(b.text, lang),
      level: (b.type === 'heading2' ? 2 : 3) as 2 | 3,
    }))
    .filter((item) => item.text.trim().length > 0)
}

export function BlogDetailPage() {
  const { slug = '' } = useParams()
  const { lang } = useI18n()
  const { countryCode, href } = useLocale()
  const [data, setData] = useState<DetailResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const listingHref = href('/blog')

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setError(null)
    fetchPublicBlogPost(slug, { lang, country: countryCode })
      .then((res) => setData(res as DetailResponse))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Article not found'))
      .finally(() => setLoading(false))
  }, [slug, lang, countryCode])

  const post = data?.post
  const toc = useMemo(() => (post ? buildToc(post.body, lang) : []), [post, lang])

  useEffect(() => {
    if (!post) return
    document.title = post.seo.title || post.title
    return () => {
      document.title = ''
    }
  }, [post])

  if (loading) {
    return (
      <main className="content-page blog-article">
        <div className="content-page__container">
          <p className="content-page__loading">Loading article…</p>
        </div>
      </main>
    )
  }

  if (error || !post) {
    return (
      <main className="content-page blog-article">
        <div className="content-page__container">
          <h1>Article not found</h1>
          <p className="content-page__empty">This article may have been unpublished or removed.</p>
          <Link to={listingHref}>Back to Insights</Link>
        </div>
      </main>
    )
  }

  const hero = resolveBlogFeaturedImage(post.featuredImage)
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const canonicalPath = post.seo.canonicalUrl || href(`/blog/${post.slug}`)
  const absoluteUrl = canonicalPath.startsWith('http') ? canonicalPath : `${origin}${canonicalPath}`

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.seo.description || post.excerpt,
    image: post.seo.ogImage ? resolveBlogFeaturedImage(post.seo.ogImage) : hero,
    author: { '@type': 'Organization', name: post.author || 'DigitalManager' },
    publisher: { '@type': 'Organization', name: 'DigitalManager', url: origin },
    datePublished: post.publishDate || undefined,
    dateModified: post.updatedDate || post.publishDate || undefined,
    mainEntityOfPage: absoluteUrl,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${origin}${href('/')}` },
      { '@type': 'ListItem', position: 2, name: 'Insights', item: `${origin}${listingHref}` },
      { '@type': 'ListItem', position: 3, name: post.title, item: absoluteUrl },
    ],
  }

  const faqJsonLd =
    post.faq?.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: post.faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          })),
        }
      : null

  const shareUrl = encodeURIComponent(absoluteUrl)
  const shareTitle = encodeURIComponent(post.title)

  return (
    <main className="content-page blog-article">
      <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      {faqJsonLd ? <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script> : null}

      <div className="content-page__container blog-article__container">
        <nav className="blog-article__breadcrumbs" aria-label="Breadcrumb">
          <Link to={href('/')}>Home</Link>
          <span aria-hidden> / </span>
          <Link to={listingHref}>Insights</Link>
          <span aria-hidden> / </span>
          <span aria-current="page">{post.title}</span>
        </nav>

        <header className="blog-article__header">
          {post.categoryName ? <p className="content-page__eyebrow">{post.categoryName}</p> : null}
          <h1>{post.title}</h1>
          {post.excerpt ? <p className="content-page__intro blog-article__intro">{post.excerpt}</p> : null}
          <div className="blog-article__meta-row">
            <p className="blog-article__meta">
              <span>{post.author}</span>
              {post.authorRole ? <span> · {post.authorRole}</span> : null}
              {post.publishDate ? (
                <span> · {new Date(post.publishDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              ) : null}
              {post.updatedDate && post.updatedDate !== post.publishDate ? (
                <span> · Updated {new Date(post.updatedDate).toLocaleDateString()}</span>
              ) : null}
              <span> · {post.readingMinutes} min read</span>
            </p>
            <div className="blog-article__share" aria-label="Share article">
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`} target="_blank" rel="noreferrer noopener">
                LinkedIn
              </a>
              <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`} target="_blank" rel="noreferrer noopener">
                X
              </a>
              <button type="button" onClick={() => void navigator.clipboard?.writeText(absoluteUrl)}>
                Copy link
              </button>
            </div>
          </div>
        </header>

        <img src={hero} alt={post.featuredImageAlt || post.title} className="blog-article__hero-image" />

        <div className="blog-article__layout">
          {toc.length >= 3 ? (
            <aside className="blog-article__toc" aria-label="Table of contents">
              <p className="blog-article__toc-title">On this page</p>
              <ol>
                {toc.map((item) => (
                  <li key={item.id} className={item.level === 3 ? 'blog-article__toc-item--nested' : undefined}>
                    <a href={`#${item.id}`}>{item.text}</a>
                  </li>
                ))}
              </ol>
            </aside>
          ) : null}

          <div className="blog-article__content">
            <BlogArticleBody blocks={post.body} lang={lang} headingIds={toc} />

            {post.faq?.length ? (
              <section className="blog-article__faq" aria-labelledby="article-faq">
                <h2 id="article-faq">Frequently asked questions</h2>
                <dl>
                  {post.faq.map((item) => (
                    <div key={item.id} className="blog-article__faq-item">
                      <dt>{item.question}</dt>
                      <dd>{item.answer}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}

            <aside className="blog-article__author-box" aria-label="About the author">
              <p className="blog-article__author-name">{post.author}</p>
              {post.authorRole ? <p className="blog-article__author-role">{post.authorRole}</p> : null}
              <p className="blog-article__author-bio">
                DigitalManager publishes practical guidance on ERP, inventory, finance and multi-branch operations for growing businesses across the GCC.
              </p>
            </aside>
          </div>
        </div>

        {(post.ctaHeading || post.ctaLabel) && (
          <aside className="blog-article__cta">
            {post.ctaHeading ? <h2>{post.ctaHeading}</h2> : null}
            {post.ctaDescription ? <p>{post.ctaDescription}</p> : null}
            {post.ctaLabel ? (
              <Link to={href(post.ctaUrl || '/contact')} className="blog-article__cta-btn">
                {post.ctaLabel}
              </Link>
            ) : null}
          </aside>
        )}

        {data.related.length ? (
          <section className="blog-article__related" aria-labelledby="related-articles">
            <h2 id="related-articles">Related articles</h2>
            <div className="blog-article__related-grid">
              {data.related.map((r) => (
                <BlogCard key={r.id} post={r} variant="grid" />
              ))}
            </div>
          </section>
        ) : null}

        <nav className="blog-article__adjacent" aria-label="Article navigation">
          {data.prev ? (
            <Link to={href(`/blog/${data.prev.slug}`)} className="blog-article__adjacent-link blog-article__adjacent-link--prev">
              <span>Previous</span>
              <strong>{data.prev.title}</strong>
            </Link>
          ) : (
            <span />
          )}
          {data.next ? (
            <Link to={href(`/blog/${data.next.slug}`)} className="blog-article__adjacent-link blog-article__adjacent-link--next">
              <span>Next</span>
              <strong>{data.next.title}</strong>
            </Link>
          ) : null}
        </nav>
      </div>
    </main>
  )
}
