import { Link, useSearchParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { fetchPublicBlogCategories, fetchPublicBlogPosts } from '../cms/contentApi'
import { useI18n } from '../i18n/I18nProvider'
import { useLocale } from '../locale/LocaleContext'
import { BlogCard } from '../components/blog/BlogCard'
import type { ResolvedBlogPost } from '../types/blogContent'
import './content-pages.css'
import '../components/blog/blog.css'

type BlogListResponse = {
  items: ResolvedBlogPost[]
  pagination: { page: number; pageSize: number; total: number; totalPages: number }
  section?: { heading?: string; supportingText?: string; eyebrow?: string }
}

export function BlogListingPage() {
  const { t, lang } = useI18n()
  const { countryCode, href } = useLocale()
  const [params, setParams] = useSearchParams()
  const category = params.get('category') || ''
  const search = params.get('search') || ''
  const page = Math.max(1, Number.parseInt(params.get('page') || '1', 10) || 1)
  const [data, setData] = useState<BlogListResponse | null>(null)
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState(search)

  useEffect(() => {
    fetchPublicBlogCategories()
      .then((res) => setCategories((res as { items: { id: string; name: string; slug: string }[] }).items || []))
      .catch(() => setCategories([]))
  }, [lang])

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetchPublicBlogPosts({ category, search, page, pageSize: 9, lang, country: countryCode })
      .then((res) => setData(res as BlogListResponse))
      .catch((e: unknown) => setError(e instanceof Error ? e.message : 'Unable to load articles'))
      .finally(() => setLoading(false))
  }, [category, search, page, lang, countryCode])

  const pageLabel = data?.section?.heading || t('footer.resources.blog')
  const pageIntro = data?.section?.supportingText || ''

  useEffect(() => {
    document.title = pageLabel ? `${pageLabel} | DigitalManager` : 'DigitalManager'
    return () => {
      document.title = ''
    }
  }, [pageLabel])

  const featured = useMemo(() => data?.items.find((p) => p.featured) || data?.items[0], [data?.items])
  const gridPosts = useMemo(() => (data?.items || []).filter((p) => p.id !== featured?.id), [data?.items, featured?.id])
  const totalPublished = data?.pagination.total ?? 0
  const showFeatured = Boolean(featured)
  const showGrid = gridPosts.length > 0

  const updateParams = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params)
    for (const [k, v] of Object.entries(patch)) {
      if (!v) next.delete(k)
      else next.set(k, v)
    }
    if (!patch.page) next.delete('page')
    setParams(next)
  }

  return (
    <main className="content-page blog-list">
      <div className="content-page__container blog-list__container">
        <header className="content-page__hero blog-list__hero">
          <p className="content-page__eyebrow">{data?.section?.eyebrow || 'INSIGHTS'}</p>
          <h1>{pageLabel}</h1>
          {pageIntro ? <p className="content-page__intro">{pageIntro}</p> : null}
        </header>

        <form
          className="blog-list__search"
          onSubmit={(e) => {
            e.preventDefault()
            updateParams({ search: searchInput.trim() || null, page: null })
          }}
        >
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search articles"
            aria-label="Search articles"
          />
          <button type="submit">Search</button>
          {search || category ? (
            <button
              type="button"
              onClick={() => {
                setSearchInput('')
                setParams(new URLSearchParams())
              }}
            >
              Clear filters
            </button>
          ) : null}
        </form>

        {categories.length > 0 ? (
          <div className="content-page__filters blog-list__filters" role="toolbar" aria-label="Article categories">
            <button type="button" className={!category ? 'is-active' : ''} onClick={() => updateParams({ category: null, page: null })}>
              All
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                className={category === c.slug ? 'is-active' : ''}
                onClick={() => updateParams({ category: c.slug, page: null })}
              >
                {c.name}
              </button>
            ))}
          </div>
        ) : null}

        <div className="blog-list__body">
          {error ? (
            <div className="blog-list__state blog-list__state--error" role="alert">
              <p className="content-page__error">{error}</p>
              <button type="button" className="blog-list__retry" onClick={() => updateParams({ page: String(page) })}>
                Try again
              </button>
            </div>
          ) : null}

          {loading ? <p className="content-page__loading blog-list__state">Loading articles…</p> : null}

          {!loading && !error && totalPublished === 0 ? (
            <div className="blog-list__state blog-list__state--empty">
              <p className="content-page__empty">No published articles yet. Check back soon for new insights.</p>
            </div>
          ) : null}

          {!loading && !error && showFeatured ? (
            <section className="blog-list__featured" aria-label="Featured article">
              <BlogCard post={featured!} variant="featured" />
            </section>
          ) : null}

          {!loading && !error && showGrid ? (
            <section className="blog-list__grid" aria-label="Latest articles">
              {gridPosts.map((post) => (
                <BlogCard key={post.id} post={post} variant="grid" />
              ))}
            </section>
          ) : null}

          {!loading && !error && totalPublished > 0 && !showGrid && showFeatured ? (
            <p className="blog-list__coming-soon">More articles will appear here as they are published.</p>
          ) : null}

          {!loading && !error && totalPublished > 0 && gridPosts.length === 0 && totalPublished > 1 ? (
            <p className="content-page__empty">No articles match your filters.</p>
          ) : null}

          {data && data.pagination.totalPages > 1 ? (
            <nav className="blog-list__pagination" aria-label="Article pagination">
              <button type="button" disabled={page <= 1} onClick={() => updateParams({ page: String(page - 1) })}>
                Previous
              </button>
              <span>
                Page {data.pagination.page} of {data.pagination.totalPages}
              </span>
              <button
                type="button"
                disabled={page >= data.pagination.totalPages}
                onClick={() => updateParams({ page: String(page + 1) })}
              >
                Next
              </button>
            </nav>
          ) : null}
        </div>

        <section className="blog-list__cta" aria-label="Book a demo">
          <div className="blog-list__cta-inner">
            <div>
              <h2>{t('demoCta.title')}</h2>
              <p>{t('demoCta.desc')}</p>
            </div>
            <Link to={href('/contact')} className="blog-list__cta-btn">
              {t('demoCta.button')}
            </Link>
          </div>
        </section>

        <section className="blog-list__newsletter" aria-label="Stay updated">
          <div className="blog-list__newsletter-inner">
            <h2>Stay updated on ERP insights</h2>
            <p>Get practical articles on finance, inventory and operations — or speak with our team for a tailored demo.</p>
            <Link to={href('/contact')} className="blog-list__newsletter-btn">
              Contact our team
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
