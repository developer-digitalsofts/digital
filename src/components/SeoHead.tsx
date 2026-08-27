import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useI18n } from '../i18n/I18nProvider'
import { useCms } from '../cms/CmsContext'
import { useLocale } from '../locale/LocaleContext'
import { pick } from '../cms/pick'
import type { Bilingual } from '../cms/types'

type SeoAlternate = { hreflang: string; href: string }

type ResolvedSeo = {
  canonical?: string
  noIndex?: boolean
  robots?: string
  lang?: string
  dir?: 'ltr' | 'rtl'
  title?: string
  description?: string
  ogLocale?: string
  ogUrl?: string
  alternates?: SeoAlternate[]
}

type SeoExt = {
  pageTitle?: Bilingual
  metaDescription?: Bilingual
  metaKeywords?: Bilingual
  ogImage?: string
  canonicalUrl?: string
  ogTitle?: Bilingual
  ogDescription?: Bilingual
  twitterTitle?: Bilingual
  twitterDescription?: Bilingual
  twitterImage?: string
  robotsIndex?: string
  robotsFollow?: string
}

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setOg(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setTw(name: string, content: string) {
  setMeta(name, content)
}

function setHreflang(hreflang: string, href: string) {
  if (!href) return
  let el = document.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'alternate')
    el.setAttribute('hreflang', hreflang)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function clearHreflangExcept(keep: string[]) {
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((node) => {
    const lang = node.getAttribute('hreflang')
    if (lang && !keep.includes(lang)) node.remove()
  })
}

function setLink(rel: string, href: string) {
  if (!href) return
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export function SeoHead() {
  const { lang } = useI18n()
  const { noIndex: localeNoIndex } = useLocale()
  const location = useLocation()
  const { data } = useCms()
  const seo = data?.seo as SeoExt | undefined
  const header = data?.header
  const [resolved, setResolved] = useState<ResolvedSeo | null>(null)

  useEffect(() => {
    let active = true
    const path = location.pathname
    fetch(`/api/public/seo-page?path=${encodeURIComponent(path)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((body: ResolvedSeo | null) => {
        if (active) setResolved(body)
      })
      .catch(() => {
        if (active) setResolved(null)
      })
    return () => {
      active = false
    }
  }, [location.pathname])

  useEffect(() => {
    const cmsTitle = seo?.pageTitle ? pick(seo.pageTitle, lang) : ''
    const title = resolved?.title || cmsTitle || document.title
    document.title = title || 'DigitalManager'

    if (resolved?.lang) {
      document.documentElement.lang = resolved.lang
    }
    if (resolved?.dir) {
      document.documentElement.dir = resolved.dir
    }

    const desc = resolved?.description || (seo?.metaDescription ? pick(seo.metaDescription, lang) : '')
    if (desc) setMeta('description', desc)

    const kw = seo?.metaKeywords ? pick(seo.metaKeywords, lang) : ''
    if (kw) setMeta('keywords', kw)

    const ogTitle = seo?.ogTitle ? pick(seo.ogTitle, lang) : title
    if (ogTitle) setOg('og:title', ogTitle)

    const ogDesc = seo?.ogDescription ? pick(seo.ogDescription, lang) : desc
    if (ogDesc) setOg('og:description', ogDesc)

    const og = seo?.ogImage?.trim()
    if (og) setOg('og:image', og.startsWith('http') ? og : `${window.location.origin}${og}`)

    const twTitle = seo?.twitterTitle ? pick(seo.twitterTitle, lang) : ogTitle
    if (twTitle) setTw('twitter:title', twTitle)
    const twDesc = seo?.twitterDescription ? pick(seo.twitterDescription, lang) : ogDesc
    if (twDesc) setTw('twitter:description', twDesc)
    const twImg = seo?.twitterImage?.trim() || og
    if (twImg) setTw('twitter:image', twImg.startsWith('http') ? twImg : `${window.location.origin}${twImg}`)
    setTw('twitter:card', 'summary_large_image')

    const noIndex =
      resolved != null
        ? resolved.noIndex === true
        : localeNoIndex || seo?.robotsIndex === 'noindex'
    const robots =
      resolved?.robots ||
      `${noIndex ? 'noindex' : 'index'}, ${seo?.robotsFollow === 'nofollow' ? 'nofollow' : 'follow'}`
    setMeta('robots', robots)

    const origin = window.location.origin
    const selfCanonical = `${origin}${location.pathname}${location.search || ''}`
    const canon = resolved?.canonical || seo?.canonicalUrl?.trim() || selfCanonical
    setLink('canonical', canon)

    if (resolved?.ogUrl) setOg('og:url', resolved.ogUrl)
    else setOg('og:url', canon)

    if (resolved?.ogLocale) setOg('og:locale', resolved.ogLocale)

    const keepHreflang: string[] = []
    const alternates = resolved?.alternates || []
    for (const alt of alternates) {
      if (!alt.hreflang || !alt.href) continue
      setHreflang(alt.hreflang, alt.href)
      keepHreflang.push(alt.hreflang)
    }
    clearHreflangExcept(keepHreflang)

    const fav = header?.faviconUrl?.trim()
    if (fav) setLink('icon', fav.startsWith('http') ? fav : fav)
  }, [lang, seo, header, location.pathname, location.search, localeNoIndex, resolved])

  return null
}
