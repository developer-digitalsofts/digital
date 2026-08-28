import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useI18n } from '../i18n/I18nProvider'
import { useLocale } from '../locale/LocaleContext'
import { useCms } from '../cms/CmsContext'
import { ApiError, fetchJson } from '../cms/api'
import { CmsPageSectionRenderer } from '../components/CmsPageSectionRenderer'
import { buildCityPagePath, CITY_PAGE_SLUG, getCityDisplayName } from '../locale/cityPaths'
import { CITY_PRODUCT_LABELS, PUBLIC_SITE_ORIGIN } from '../market/pakistanConfig'
import type { LocalePublicPage } from './LocaleSlugPage'
import './content-pages.css'

type CityPageMeta = {
  resolvedFrom?: string
  inherited?: boolean
  fallbackUsed?: boolean
  cityFallback?: boolean
  missing?: boolean
}

type Props = {
  citySlug: string
  pageSlug?: string
}

const SITE_ORIGIN = PUBLIC_SITE_ORIGIN.replace(/\/$/, '')

function CityBreadcrumbs({
  cityName,
  homeHref,
  pageTitle,
  homeLabel,
}: {
  cityName: string
  homeHref: string
  pageTitle: string
  homeLabel: string
}) {
  return (
    <nav className="content-page__breadcrumbs mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link to={homeHref} className="hover:text-brand">
            {homeLabel}
          </Link>
        </li>
        <li aria-hidden="true">/</li>
        <li className="font-medium text-slate-700">{cityName}</li>
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
  homeHref,
}: {
  title: string
  description: string
  canonical: string
  cityName: string
  homeHref: string
}) {
  const { data } = useCms()
  const site = data?.siteSettings as Record<string, string | undefined> | undefined

  const schemas = useMemo(() => {
    const homeUrl = `${SITE_ORIGIN}${homeHref === '/' ? '' : homeHref}`
    const org: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'DigitalManager',
      url: SITE_ORIGIN,
      logo: `${SITE_ORIGIN}/digitalmanager.svg`,
    }
    if (site?.primaryEmail) {
      org.contactPoint = {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: site.primaryEmail,
        telephone: site.phoneDisplay || undefined,
        availableLanguage: ['English'],
      }
    }

    const software: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'DigitalManager',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      url: SITE_ORIGIN,
      description: description || 'Cloud ERP for finance, inventory, POS, payroll, and multi-branch operations.',
    }

    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: homeUrl },
        { '@type': 'ListItem', position: 2, name: cityName, item: canonical },
      ],
    }

    const webPage = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      description,
      url: canonical,
      about: { '@type': 'Place', name: cityName },
    }

    return [org, software, breadcrumb, webPage]
  }, [title, description, canonical, cityName, homeHref, site?.primaryEmail, site?.phoneDisplay])

  useEffect(() => {
    const id = 'city-page-jsonld'
    let el = document.getElementById(id) as HTMLScriptElement | null
    if (!el) {
      el = document.createElement('script')
      el.id = id
      el.type = 'application/ld+json'
      document.head.appendChild(el)
    }
    el.textContent = JSON.stringify(schemas)
    return () => {
      el?.remove()
    }
  }, [schemas])

  return null
}

export function CityLocalePage({ citySlug, pageSlug = CITY_PAGE_SLUG }: Props) {
  const { lang, t } = useI18n()
  const { countryCode, country, href, localePrefix } = useLocale()
  const [page, setPage] = useState<LocalePublicPage | null>(null)
  const [meta, setMeta] = useState<CityPageMeta | null>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'missing' | 'error'>('loading')

  const cityPath = buildCityPagePath(country, lang, citySlug, pageSlug)
  const cityDisplayName = getCityDisplayName(citySlug, lang)
  const erpLabel = CITY_PRODUCT_LABELS[pageSlug as keyof typeof CITY_PRODUCT_LABELS] || 'ERP Software'
  const homeLabel = 'Home'

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
          <p className="content-page__intro">{lang === 'ar' ? 'جاري التحميل…' : 'Loading…'}</p>
        </div>
      </main>
    )
  }

  if (state === 'missing' || !page) {
    return (
      <main className="content-page">
        <div className="content-page__container">
          <h1>{lang === 'ar' ? 'المحتوى غير متاح' : 'Content unavailable'}</h1>
          <p className="content-page__intro">
            {lang === 'ar'
              ? `صفحة المدينة هذه غير منشورة بعد لـ ${cityDisplayName}.`
              : `This city page is not yet published for ${cityDisplayName}. View the country ERP page or return home.`}
          </p>
          <p className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link to={href('/erp')} className="font-semibold text-brand">
              {lang === 'ar' ? 'صفحة ERP للدولة' : 'Country ERP page'}
            </Link>
            <Link to={localePrefix || '/'} className="font-semibold text-brand">
              {lang === 'ar' ? 'الصفحة الرئيسية' : 'Homepage'}
            </Link>
          </p>
        </div>
      </main>
    )
  }

  const heading = page.heading || page.title
  const canonical =
    typeof window !== 'undefined' ? `${window.location.origin}${cityPath}` : `${SITE_ORIGIN}${cityPath}`

  return (
    <main className="content-page">
      <CityJsonLd
        title={heading}
        description={page.shortDescription || ''}
        canonical={canonical}
        cityName={cityDisplayName}
        homeHref={localePrefix || '/'}
      />
      <div className="content-page__container">
        <CityBreadcrumbs
          cityName={cityDisplayName}
          homeHref={localePrefix || '/'}
          pageTitle={erpLabel}
          homeLabel={homeLabel}
        />
        <header className="content-page__header">
          <h1>{heading}</h1>
          {page.shortDescription ? <p className="content-page__intro">{page.shortDescription}</p> : null}
        </header>
        {meta?.fallbackUsed || meta?.cityFallback ? null : (
          <p className="content-page__intro mt-4">
            <Link to={href('/contact')} className="font-semibold text-brand">
              {t('demoCta.button')}
            </Link>
          </p>
        )}
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
