import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useLocale } from '../locale/LocaleContext'
import { ApiError, fetchJson } from '../cms/api'
import { SoftwarePage } from './SoftwarePage'
import type { LocalePublicPage } from './LocaleSlugPage'
import { CmsPageSectionRenderer } from '../components/CmsPageSectionRenderer'
import './content-pages.css'

type ResolvedSnapshot = {
  key: string
  state: 'locale' | 'fallback' | 'error'
  page: LocalePublicPage | null
}

/** Locale-aware software detail — tries CMS locale record, falls back to global SoftwarePage. */
export function LocaleSoftwarePage({ forceKind, forceSlug }: { forceKind?: 'module' | 'industry'; forceSlug?: string } = {}) {
  const params = useParams<{ flatSlug?: string; kind?: string; slug?: string }>()
  const { countryCode, lang, href, localePrefix } = useLocale()

  const routeKind: 'module' | 'industry' | undefined =
    forceKind ??
    (params.flatSlug ? 'module' : params.kind === 'module' || params.kind === 'industry' ? params.kind : undefined)
  const routeSlug = forceSlug ?? params.flatSlug ?? params.slug
  const canResolve = Boolean(routeKind && routeSlug)
  const fetchKey = `${routeKind}:${routeSlug}:${countryCode}:${lang}`

  const [snapshot, setSnapshot] = useState<ResolvedSnapshot | null>(null)
  const loading = canResolve && (!snapshot || snapshot.key !== fetchKey)
  const resolved = snapshot?.key === fetchKey ? snapshot : null

  useEffect(() => {
    if (!canResolve || !routeKind || !routeSlug) return

    let cancelled = false
    const controller = new AbortController()

    void (async () => {
      try {
        const r = await fetchJson<{ page: LocalePublicPage }>(
          `/api/public/locale-content/software/${encodeURIComponent(routeKind)}/${encodeURIComponent(routeSlug)}?country=${encodeURIComponent(countryCode)}&lang=${encodeURIComponent(lang)}`,
          { signal: controller.signal, cache: 'no-store' },
        )
        if (cancelled) return
        setSnapshot({ key: fetchKey, state: 'locale', page: r.page })
      } catch (e: unknown) {
        if (cancelled) return
        if (e instanceof ApiError && e.status === 404) {
          setSnapshot({ key: fetchKey, state: 'fallback', page: null })
          return
        }
        setSnapshot({ key: fetchKey, state: 'error', page: null })
      }
    })()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [canResolve, fetchKey, routeKind, routeSlug, countryCode, lang])

  if (!canResolve) {
    if (forceKind && forceSlug) {
      return <Navigate to={href(`/software/${forceKind}/${forceSlug}`)} replace />
    }
    return <SoftwarePage />
  }

  if (loading) {
    return (
      <main className="content-page">
        <div className="content-page__container">
          <p className="content-page__intro">Loading…</p>
        </div>
      </main>
    )
  }

  if (resolved?.state === 'fallback') {
    if (forceKind && forceSlug) {
      return <Navigate to={href(`/software/${forceKind}/${forceSlug}`)} replace />
    }
    return <SoftwarePage />
  }

  if (resolved?.state === 'error' || !resolved?.page) {
    return (
      <main className="content-page">
        <div className="content-page__container">
          <h1>Content unavailable</h1>
          <p className="content-page__intro">Unable to load this page right now.</p>
          <Link to={localePrefix || '/'} className="mt-4 inline-block font-semibold text-brand">
            {countryCode} homepage
          </Link>
        </div>
      </main>
    )
  }

  const page = resolved.page

  return (
    <main className="content-page">
      <div className="content-page__container">
        <header className="content-page__header">
          <h1>{page.heading || page.title}</h1>
          {page.shortDescription ? <p className="content-page__intro">{page.shortDescription}</p> : null}
        </header>
      </div>
      {page.sections?.length ? <CmsPageSectionRenderer sections={page.sections} /> : null}
      <p className="content-page__container mt-6 text-sm">
        <Link to={href(`/software/${routeKind}/${routeSlug}`)} className="font-semibold text-brand">
          View global English version
        </Link>
      </p>
    </main>
  )
}

/** Industry detail alias: /industries/:slug */
export function LocaleIndustrySlugPage() {
  const { slug = '' } = useParams<{ slug: string }>()
  return <LocaleSoftwarePage forceKind="industry" forceSlug={slug} />
}
