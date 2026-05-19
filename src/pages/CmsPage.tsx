import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useI18n } from '../i18n/I18nProvider'
import { pick } from '../cms/pick'
import { fetchJson } from '../cms/api'
import type { CmsPageRecord } from '../cms/pagesTypes'

export function CmsPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  const { lang } = useI18n()
  const [page, setPage] = useState<CmsPageRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNotFound(false)
    fetchJson<{ page: CmsPageRecord }>(`/api/page/${encodeURIComponent(slug)}`)
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
    const t = pick(page.metaTitle, lang) || pick(page.title, lang) || page.slug
    document.title = t
    return () => {
      document.title = ''
    }
  }, [page, lang])

  if (loading) {
    return (
      <div className="mx-auto flex max-w-3xl items-center gap-2 px-4 py-14 text-slate-600">
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

  const heading = pick(page.heading, lang) || pick(page.title, lang)
  const shortDesc = pick(page.shortDescription, lang)
  const body = pick(page.content, lang)
  const metaDesc = pick(page.metaDescription, lang)

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      {page.featuredImageUrl ? (
        <img
          src={page.featuredImageUrl.startsWith('http') ? page.featuredImageUrl : page.featuredImageUrl}
          alt=""
          className="mb-6 w-full max-h-80 rounded-lg border border-slate-200 object-cover"
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
