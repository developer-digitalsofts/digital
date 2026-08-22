import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/I18nProvider'
import { useLocale } from '../locale/LocaleContext'
import { ApiError, fetchJson } from '../cms/api'
import { CmsPageSectionRenderer } from '../components/CmsPageSectionRenderer'
import type { PageSectionRecord } from '../cms/sectionCatalog'
import './content-pages.css'

export type LocalePublicPage = {
  id: string
  slug: string
  template: string
  title: string
  heading: string
  shortDescription: string
  sections: PageSectionRecord[]
  _locale?: {
    resolvedFrom: string
    inherited: boolean
    fallbackUsed?: boolean
    missing?: boolean
  }
}

type FallbackInfo = {
  countryCode: string
  lang: string
  href: string
}

type LoadState = 'loading' | 'ready' | 'missing' | 'error'

type Props = { slug: string }

export function LocaleSlugPage({ slug }: Props) {
  const { lang } = useI18n()
  const { countryCode, href, localePrefix } = useLocale()
  const [page, setPage] = useState<LocalePublicPage | null>(null)
  const [fallback, setFallback] = useState<FallbackInfo | null>(null)
  const [state, setState] = useState<LoadState>('loading')

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    void (async () => {
      try {
        const r = await fetchJson<{ page: LocalePublicPage; meta?: unknown }>(
          `/api/public/locale-content/${encodeURIComponent(slug)}?country=${encodeURIComponent(countryCode)}&lang=${encodeURIComponent(lang)}`,
          { signal: controller.signal, cache: 'no-store' },
        )
        if (cancelled) return
        setPage(r.page)
        setState('ready')
      } catch (e: unknown) {
        if (cancelled) return
        if (e instanceof ApiError && e.status === 404) {
          setState('missing')
          setFallback({ countryCode: 'AE', lang: 'en', href: href(`/${slug}`) })
          return
        }
        setState('error')
      }
    })()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [slug, countryCode, lang, href])

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
            This page is not yet published for {countryCode} · {lang.toUpperCase()}. You can view the global version or return to your regional homepage.
          </p>
          <p className="mt-4 flex flex-wrap gap-3 text-sm">
            {fallback ? (
              <Link to={fallback.href} className="font-semibold text-brand">
                View global English version
              </Link>
            ) : null}
            <Link to={localePrefix || '/'} className="font-semibold text-brand">
              {countryCode} homepage
            </Link>
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="content-page">
      {page._locale?.fallbackUsed ? (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-xs text-amber-950">
          Showing inherited content — localized version for {countryCode} · {lang.toUpperCase()} is not published yet.
        </div>
      ) : null}
      <div className="content-page__container">
        <header className="content-page__header">
          <h1>{page.heading || page.title}</h1>
          {page.shortDescription ? <p className="content-page__intro">{page.shortDescription}</p> : null}
        </header>
      </div>
      {page.sections?.length ? <CmsPageSectionRenderer sections={page.sections} /> : null}
    </main>
  )
}

/** Route wrapper for /erp under locale paths */
export function ErpLocalePage() {
  const { countryCode, lang } = useLocale()
  return <LocaleSlugPage key={`erp-${countryCode}-${lang}`} slug="erp" />
}

export function ContactLocalePage() {
  const { countryCode, lang } = useLocale()
  return <LocaleSlugPage key={`contact-${countryCode}-${lang}`} slug="contact" />
}

export function SolutionsLocalePage() {
  const { countryCode, lang } = useLocale()
  return <LocaleSlugPage key={`solutions-${countryCode}-${lang}`} slug="solutions" />
}

export function BusinessModelsLocalePage() {
  const { countryCode, lang } = useLocale()
  return <LocaleSlugPage key={`business-models-${countryCode}-${lang}`} slug="business-models" />
}

export function FaqsLocalePage() {
  const { countryCode, lang } = useLocale()
  return <LocaleSlugPage key={`faqs-${countryCode}-${lang}`} slug="faqs" />
}

export function IndustriesListLocalePage() {
  const { countryCode, lang } = useLocale()
  return <LocaleSlugPage key={`industries-${countryCode}-${lang}`} slug="industries" />
}
