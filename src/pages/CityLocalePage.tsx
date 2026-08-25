import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useI18n } from '../i18n/I18nProvider'
import { useLocale } from '../locale/LocaleContext'
import { ApiError, fetchJson } from '../cms/api'
import { CmsPageSectionRenderer } from '../components/CmsPageSectionRenderer'
import { LocaleFallbackBanner } from '../components/LocaleFallbackBanner'
import { buildCityPagePath, CITY_PAGE_SLUG } from '../locale/cityPaths'
import type { LocalePublicPage } from './LocaleSlugPage'
import './content-pages.css'

type CityPageMeta = {
  resolvedFrom?: string
  fallbackUsed?: boolean
  cityFallback?: boolean
  missing?: boolean
}

type Props = {
  citySlug: string
  pageSlug?: string
}

function CityBreadcrumbs({
  cityName,
  homeHref,
  pageTitle,
}: {
  cityName: string
  homeHref: string
  pageTitle: string
}) {
  return (
    <nav className="content-page__breadcrumbs mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link to={homeHref} className="hover:text-brand">
            Home
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li className="font-medium text-slate-700" aria-current="page">
          {cityName}
        </li>
        <li aria-hidden="true">/</li>
        <li className="text-slate-600">{pageTitle}</li>
      </ol>
    </nav>
  )
}

function CityJsonLd({
  title,
  description,
  canonical,
  cityName,
}: {
  title: string
  description: string
  canonical: string
  cityName: string
}) {
  const schema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description,
      url: canonical,
      about: {
        '@type': 'Place',
        name: cityName,
      },
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: canonical.replace(/\/[^/]+\/[^/]+$/, '/') },
          { '@type': 'ListItem', position: 2, name: cityName, item: canonical },
        ],
      },
    }),
    [title, description, canonical, cityName],
  )

  useEffect(() => {
    const id = 'city-page-jsonld'
    let el = document.getElementById(id) as HTMLScriptElement | null
    if (!el) {
      el = document.createElement('script')
      el.id = id
      el.type = 'application/ld+json'
      document.head.appendChild(el)
    }
    el.textContent = JSON.stringify(schema)
    return () => {
      el?.remove()
    }
  }, [schema])

  return null
}

export function CityLocalePage({ citySlug, pageSlug = CITY_PAGE_SLUG }: Props) {
  const { lang } = useI18n()
  const { countryCode, country, href, localePrefix } = useLocale()
  const [page, setPage] = useState<LocalePublicPage | null>(null)
  const [meta, setMeta] = useState<CityPageMeta | null>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'missing' | 'error'>('loading')

  const cityPath = buildCityPagePath(country, lang, citySlug, pageSlug)
  const cityDisplayName = citySlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    void (async () => {
      try {
        const r = await fetchJson<{ page: LocalePublicPage; meta?: CityPageMeta }>(
          `/api/public/locale-content/city/${encodeURIComponent(citySlug)}/${encodeURIComponent(pageSlug)}?country=${encodeURIComponent(countryCode)}&lang=${encodeURIComponent(lang)}`,
          { signal: controller.signal, cache: 'no-store' },
        )
        if (cancelled) return
        setPage(r.page)
        setMeta(r.meta || r.page._locale || null)
        setState('ready')
      } catch (e: unknown) {
        if (cancelled) return
        if (e instanceof ApiError && e.status === 404) {
          setState('missing')
          return
        }
        setState('error')
      }
    })()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [citySlug, pageSlug, countryCode, lang])

  if (state === 'loading') {
    return (
      <main className="content-page">
        <div className="content-page__container">
          <p className="content-page__intro">Loading…</p>
        </div>
      </main>
    )
  }

  if (state === 'missing' || !page) {
    return (
      <main className="content-page">
        <div className="content-page__container">
          <h1>Content unavailable</h1>
          <p className="content-page__intro">
            This city page is not yet published for {cityDisplayName}. View the country ERP page or return home.
          </p>
          <p className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link to={href('/erp')} className="font-semibold text-brand">
              Country ERP page
            </Link>
            <Link to={localePrefix || '/'} className="font-semibold text-brand">
              Homepage
            </Link>
          </p>
        </div>
      </main>
    )
  }

  const showFallbackBanner = Boolean(meta?.fallbackUsed || meta?.cityFallback || page._locale?.fallbackUsed)
  const heading = page.heading || page.title
  const canonical =
    typeof window !== 'undefined'
      ? `${window.location.origin}${cityPath}`
      : `https://digitalmanager.ae${cityPath}`

  return (
    <main className="content-page">
      <CityJsonLd
        title={heading}
        description={page.shortDescription || ''}
        canonical={canonical}
        cityName={cityDisplayName}
      />
      <div className="content-page__container">
        {showFallbackBanner ? <LocaleFallbackBanner /> : null}
        <CityBreadcrumbs cityName={cityDisplayName} homeHref={localePrefix || '/'} pageTitle="ERP Software" />
        <header className="content-page__header">
          <h1>{heading}</h1>
          {page.shortDescription ? <p className="content-page__intro">{page.shortDescription}</p> : null}
        </header>
      </div>
      {page.sections?.length ? <CmsPageSectionRenderer sections={page.sections} /> : null}
    </main>
  )
}

/** Reads :citySlug and optional :pageSlug from route params. */
export function CityPageRoute() {
  const { citySlug = '', pageSlug = CITY_PAGE_SLUG } = useParams()
  return <CityLocalePage citySlug={citySlug.toLowerCase()} pageSlug={(pageSlug || CITY_PAGE_SLUG).toLowerCase()} />
}
