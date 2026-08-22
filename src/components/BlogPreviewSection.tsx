import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { fetchPublicBlogHomepage } from '../cms/contentApi'
import { resolvePublicMediaUrl } from '../cms/publicMediaUrl'
import type { ResolvedBlogPost } from '../types/blogContent'
import { ScrollReveal } from './ScrollReveal'
import { sectionWhite } from '../ui/saas'
import './blog/blog.css'

type BlogHomeResponse = {
  enabled: boolean
  section?: {
    eyebrow?: string
    heading?: string
    supportingText?: string
    viewAllLabel?: string
    viewAllUrl?: string
  }
  featured?: ResolvedBlogPost
  items?: ResolvedBlogPost[]
}

export function BlogPreviewSection() {
  const [data, setData] = useState<BlogHomeResponse | null>(null)

  useEffect(() => {
    fetchPublicBlogHomepage()
      .then((res) => setData(res as BlogHomeResponse))
      .catch(() => setData({ enabled: false, items: [] }))
  }, [])

  if (!data?.enabled || (!data.featured && !(data.items || []).length)) return null

  const section = data.section || {}

  return (
    <section id="insights" className={`blog-home scroll-mt-28 ${sectionWhite} home-section`}>
      <div className="industries-section__container">
        <ScrollReveal>
          <header className="dm-testimonials__header">
            {section.eyebrow ? <p className="dm-testimonials__eyebrow">{section.eyebrow}</p> : null}
            {section.heading ? <h2 className="dm-testimonials__title">{section.heading}</h2> : null}
            {section.supportingText ? <p className="dm-testimonials__lead">{section.supportingText}</p> : null}
          </header>
        </ScrollReveal>

        <div className="blog-home__grid">
          {data.featured ? (
            <article className="blog-card blog-home__featured">
              {data.featured.featuredImage ? (
                <img
                  src={resolvePublicMediaUrl(data.featured.featuredImage)}
                  alt={data.featured.featuredImageAlt}
                  className="blog-card__image"
                />
              ) : null}
              <div className="blog-card__body">
                <p className="blog-card__category">{data.featured.categoryName}</p>
                <h3>
                  <Link to={`/blog/${data.featured.slug}`}>{data.featured.title}</Link>
                </h3>
                <p>{data.featured.excerpt}</p>
              </div>
            </article>
          ) : null}

          <div className="blog-home__list">
            {(data.items || []).map((post) => (
              <article key={post.id}>
                <p className="blog-card__category">{post.categoryName}</p>
                <p className="blog-home__list-item">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </p>
              </article>
            ))}
          </div>
        </div>

        {section.viewAllLabel ? (
          <p className="blog-home__view-all">
            <Link to={section.viewAllUrl || '/blog'}>{section.viewAllLabel}</Link>
          </p>
        ) : null}
      </div>
    </section>
  )
}
