import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { resolveBlogFeaturedImage } from '../../cms/blogMedia'
import { useLocale } from '../../locale/LocaleContext'
import type { ResolvedBlogPost } from '../../types/blogContent'

function formatPublishDate(value: string): string {
  if (!value) return ''
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

type BlogCardProps = {
  post: ResolvedBlogPost
  variant?: 'featured' | 'grid'
}

export function BlogCard({ post, variant = 'grid' }: BlogCardProps) {
  const navigate = useNavigate()
  const { href } = useLocale()
  const slug = String(post.slug || '').replace(/^\/+|\/+$/g, '')
  const articleHref = href(`/blog/${slug}`)
  const image = resolveBlogFeaturedImage(post.featuredImage)
  const alt = post.featuredImageAlt || post.title
  const date = formatPublishDate(post.publishDate)
  const metaParts = [post.author, date, post.readingMinutes ? `${post.readingMinutes} min read` : ''].filter(Boolean)
  const isFeatured = variant === 'featured'

  const openArticle = () => {
    if (!slug) return
    navigate(articleHref)
  }

  return (
    <article
      className={`blog-card ${isFeatured ? 'blog-card--featured' : 'blog-card--grid'}`}
      onClick={openArticle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          openArticle()
        }
      }}
      role="link"
      tabIndex={0}
      aria-label={`Read article: ${post.title}`}
    >
      <div className="blog-card__media">
        <img
          src={image}
          alt={alt}
          className={`blog-card__image${isFeatured ? ' blog-card__image--featured' : ''}`}
          loading={isFeatured ? 'eager' : 'lazy'}
        />
      </div>
      <div className={`blog-card__body${isFeatured ? ' blog-card__body--featured' : ''}`}>
        {post.categoryName ? <p className="blog-card__category">{post.categoryName}</p> : null}
        <h2 className="blog-card__title">{post.title}</h2>
        {post.excerpt ? <p className="blog-card__excerpt">{post.excerpt}</p> : null}
        {metaParts.length ? <p className="blog-card__meta">{metaParts.join(' · ')}</p> : null}
        <Link
          to={articleHref}
          className={`blog-card__action${isFeatured ? ' blog-card__action--featured' : ''}`}
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          Read Article
          <ArrowRight className="blog-card__action-icon" aria-hidden strokeWidth={2.25} />
        </Link>
      </div>
    </article>
  )
}
