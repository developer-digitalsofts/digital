import { useEffect } from 'react'
import { useI18n } from '../i18n/I18nProvider'
import { useCms } from '../cms/CmsContext'
import { pick } from '../cms/pick'
import type { Bilingual } from '../cms/types'

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

export function SeoHead() {
  const { lang } = useI18n()
  const { data } = useCms()
  const seo = data?.seo as SeoExt | undefined
  const header = data?.header

  useEffect(() => {
    const title = seo?.pageTitle ? pick(seo.pageTitle, lang) : document.title
    document.title = title || 'DigitalManager'

    const desc = seo?.metaDescription ? pick(seo.metaDescription, lang) : ''
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

    const idx = seo?.robotsIndex === 'noindex' ? 'noindex' : 'index'
    const fol = seo?.robotsFollow === 'nofollow' ? 'nofollow' : 'follow'
    setMeta('robots', `${idx}, ${fol}`)

    const canon = seo?.canonicalUrl?.trim()
    if (canon) setLink('canonical', canon)

    const fav = header?.faviconUrl?.trim()
    if (fav) setLink('icon', fav.startsWith('http') ? fav : fav)
  }, [lang, seo, header])

  return null
}
