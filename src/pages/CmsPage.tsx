import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useI18n } from '../i18n/I18nProvider'
import { pick } from '../cms/pick'
import { fetchJson } from '../cms/api'
import { resolvePublicMediaUrl } from '../cms/publicMediaUrl'
import type { CmsPageRecord } from '../cms/pagesTypes'
import type { PageSectionRecord } from '../cms/sectionCatalog'
import { CmsPageSectionRenderer } from '../components/CmsPageSectionRenderer'

type PublicPage = CmsPageRecord & {
  sections?: PageSectionRecord[]
  seo?: {
    title?: { en?: string; ar?: string }
    description?: { en?: string; ar?: string }
    socialImage?: string
    canonicalUrl?: string
    noIndex?: boolean
  }
}

export function CmsPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const { lang } = useI18n()
  const [page, setPage] = useState<PublicPage | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNotFound(false)
    fetchJson<{ page: PublicPage }>(`/api/public/pages/${encodeURIComponent(slug)}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache' },
    })
      .then((r) => {
        if (!cancelled) setPage(r.page)
      })
      .catch(() => {
        if (!cancelled) {
          setPage(null)
          setNotFound(true)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  useEffect(() => {
    if (!page) return
    const seoTitle = page.seo?.title ? pick(page.seo.title, lang) : pick(page.metaTitle, lang)
    const t = seoTitle || pick(page.title, lang) || page.slug
    document.title = t

    const desc = page.seo?.description ? pick(page.seo.description, lang) : pick(page.metaDescription, lang)
    const meta = document.querySelector('meta[name="description"]')
    if (meta && desc) meta.setAttribute('content', desc)

    if (page.seo?.noIndex) {
      let robots = document.querySelector('meta[name="robots"]')
      if (!robots) {
        robots = document.createElement('meta')
        robots.setAttribute('name', 'robots')
        document.head.appendChild(robots)
      }
      robots.setAttribute('content', 'noindex,nofollow')
    }

    return () => {
      document.title = ''
    }
  }, [page, lang])

  if (loading) {
    return (
      <div className="mx-auto flex min-h-[40vh] max-w-3xl items-center gap-2 px-4 py-14 text-slate-600">
        <span className="size-5 animate-spin rounded-full border-2 border-brand border-t-transparent" aria-hidden />
        Loading…
      </div>
    )
  }

  if (notFound || !page) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14 text-center">
        <h1 className="text-2xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-2 text-slate-600">This URL is not available or the page is not published yet.</p>
      </div>
    )
  }

  if (page.sections && page.sections.length > 0) {
    return <CmsPageSectionRenderer sections={page.sections} />
  }

  const heading = pick(page.heading, lang) || pick(page.title, lang)
  const shortDesc = pick(page.shortDescription, lang)
  const body = pick(page.content, lang)
  const metaDesc = pick(page.metaDescription, lang)
  const imageSrc = resolvePublicMediaUrl(page.featuredImageUrl)

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      {imageSrc ? (
        <img
          src={imageSrc}
          alt=""
          className="mb-6 max-h-80 w-full rounded-lg border border-slate-200 object-cover"
        />
      ) : null}
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{heading}</h1>
        {shortDesc ? <p className="mt-3 text-lg text-slate-600">{shortDesc}</p> : null}
        {metaDesc && !shortDesc ? <p className="mt-3 text-slate-600">{metaDesc}</p> : null}
      </header>
      {body ? (
        <div className="prose prose-slate mt-8 max-w-none whitespace-pre-wrap text-slate-800">{body}</div>
      ) : null}
    </article>
  )
}
