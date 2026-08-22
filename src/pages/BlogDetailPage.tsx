import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchPublicBlogPost } from '../cms/contentApi'
import { BlogArticleBody } from '../components/blog/BlogArticleBody'
import { useI18n } from '../i18n/I18nProvider'
import { resolveBlogFeaturedImage } from '../cms/blogMedia'
import { useCountry } from '../context/CountryContext'
import type { ResolvedBlogPost } from '../types/blogContent'
import './content-pages.css'
import '../components/blog/blog.css'

type DetailResponse = {
  post: ResolvedBlogPost
  related: ResolvedBlogPost[]
  prev: { slug: string; title: string } | null
  next: { slug: string; title: string } | null
}

export function BlogDetailPage() {
  const { slug = '' } = useParams()
  const { lang } = useI18n()
  const { countryCode } = useCountry()
  const [data, setData] = useState<DetailResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

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
          <Link to="/blog">Back to Insights</Link>
        </div>
      </main>
    )
  }

  const hero = resolveBlogFeaturedImage(post.featuredImage)
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.seo.description || post.excerpt,
    image: post.seo.ogImage ? resolveBlogFeaturedImage(post.seo.ogImage) : hero,
    author: { '@type': 'Person', name: post.author || 'DigitalManager' },
    publisher: { '@type': 'Organization', name: 'DigitalManager', url: origin },
    datePublished: post.publishDate || undefined,
    dateModified: post.updatedDate || post.publishDate || undefined,
    mainEntityOfPage: `${origin}/blog/${post.slug}`,
  }

  return (
    <main className="content-page blog-article">
      <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>
      <div className="content-page__container">
        <nav className="blog-article__breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link> / <Link to="/blog">Insights</Link> / <span>{post.title}</span>
        </nav>

        <header className="blog-article__header">
          <p className="content-page__eyebrow">{post.categoryName}</p>
          <h1>{post.title}</h1>
          {post.excerpt ? <p className="content-page__intro">{post.excerpt}</p> : null}
          <p className="blog-article__meta">
            {post.author}
            {post.authorRole ? ` · ${post.authorRole}` : ''} · {post.publishDate ? new Date(post.publishDate).toLocaleDateString() : ''} · {post.readingMinutes} min read
          </p>
        </header>

        <img src={hero} alt={post.featuredImageAlt || post.title} className="blog-article__hero-image" />

        <BlogArticleBody blocks={post.body} lang={lang} />

        {post.ctaHeading || post.ctaLabel ? (
          <aside className="blog-article__cta">
            {post.ctaHeading ? <h3>{post.ctaHeading}</h3> : null}
            {post.ctaDescription ? <p>{post.ctaDescription}</p> : null}
            {post.ctaLabel ? (
              <a href={post.ctaUrl} className="blog-article__cta-btn">
                {post.ctaLabel}
              </a>
            ) : null}
          </aside>
        ) : null}

        {data.related.length ? (
          <section aria-labelledby="related-articles">
            <h2 id="related-articles">Related articles</h2>
            <ul>
              {data.related.map((r) => (
                <li key={r.id}>
                  <Link to={`/blog/${r.slug}`}>{r.title}</Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <nav aria-label="Article pagination">
          {data.prev ? (
            <p>
              Previous: <Link to={`/blog/${data.prev.slug}`}>{data.prev.title}</Link>
            </p>
          ) : null}
          {data.next ? (
            <p>
              Next: <Link to={`/blog/${data.next.slug}`}>{data.next.title}</Link>
            </p>
          ) : null}
        </nav>
      </div>
    </main>
  )
}
