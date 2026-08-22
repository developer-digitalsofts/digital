import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { resolveBlogFeaturedImage } from '../../cms/blogMedia'
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
  const image = resolveBlogFeaturedImage(post.featuredImage)
  const alt = post.featuredImageAlt || post.title
  const date = formatPublishDate(post.publishDate)
  const metaParts = [post.author, date, post.readingMinutes ? `${post.readingMinutes} min read` : ''].filter(Boolean)

  if (variant === 'featured') {
    return (
      <article className="blog-card blog-card--featured">
        <Link to={`/blog/${post.slug}`} className="blog-card__media-link" tabIndex={-1} aria-hidden="true">
          <img src={image} alt={alt} className="blog-card__image blog-card__image--featured" loading="eager" />
        </Link>
        <div className="blog-card__body blog-card__body--featured">
          {post.categoryName ? <p className="blog-card__category">{post.categoryName}</p> : null}
          <h2 className="blog-card__title">
            <Link to={`/blog/${post.slug}`}>{post.title}</Link>
          </h2>
          {post.excerpt ? <p className="blog-card__excerpt">{post.excerpt}</p> : null}
          {metaParts.length ? <p className="blog-card__meta">{metaParts.join(' · ')}</p> : null}
          <Link to={`/blog/${post.slug}`} className="blog-card__action blog-card__action--featured">
            Read Article
            <ArrowRight className="blog-card__action-icon" aria-hidden strokeWidth={2.25} />
          </Link>
        </div>
      </article>
    )
  }

  return (
    <article className="blog-card blog-card--grid">
      <Link to={`/blog/${post.slug}`} className="blog-card__media-link" tabIndex={-1} aria-hidden="true">
        <img src={image} alt={alt} className="blog-card__image" loading="lazy" />
      </Link>
      <div className="blog-card__body">
        {post.categoryName ? <p className="blog-card__category">{post.categoryName}</p> : null}
        <h2 className="blog-card__title">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>
        {post.excerpt ? <p className="blog-card__excerpt">{post.excerpt}</p> : null}
        {metaParts.length ? <p className="blog-card__meta">{metaParts.join(' · ')}</p> : null}
        <Link to={`/blog/${post.slug}`} className="blog-card__action">
          Read Article
          <ArrowRight className="blog-card__action-icon" aria-hidden strokeWidth={2.25} />
        </Link>
      </div>
    </article>
  )
}
