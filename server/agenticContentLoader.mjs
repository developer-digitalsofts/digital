/**
 * Load published CMS content for agentic HTML/Markdown rendering.
 */
import { readBilingualText, isPublishedRecord } from './contentHelpers.mjs'
import { buildLocaleHomepagePayload } from './localeHomepage.mjs'
import { normalizeCountryCode } from './countryHelpers.mjs'
import { normalizeLocaleLang } from './localeContentModel.mjs'
import { parseLocalePath } from './seoPaths.mjs'
import { resolveSeoForPath, PUBLIC_SITE_BASE } from './seoResolve.mjs'
import { uaeSoftwarePaths } from './seoRouteCatalog.mjs'

function pickLang(doc, lang, field) {
  return readBilingualText(doc?.[field], lang)
}

function pickItemLang(item, lang, field) {
  return readBilingualText(item?.[field], lang)
}

export async function loadAgenticPageContent(deps, pathname, routeInfo) {
  const parsed = routeInfo?.locale || parseLocalePath(pathname)
  const countryCode = normalizeCountryCode((parsed.country || 'ae').toUpperCase())
  const lang = normalizeLocaleLang(parsed.lang || 'en')
  const restPath = routeInfo?.restPath || parsed.restPath || '/'

  const homepageDeps = {
    publishStore: deps.publishStore,
    readPublishedLocaleStore: () => deps.localePublish.readPublishedStore(),
    loadPublishedHomepagePayload: deps.loadPublishedHomepagePayload,
    dataFiles: deps.dataFiles,
    extraHomepageFiles: deps.extraHomepageFiles,
  }

  let homepage
  if (countryCode === 'AE' && lang === 'en') {
    homepage = await deps.loadPublishedHomepagePayload()
  } else {
    homepage = await buildLocaleHomepagePayload(homepageDeps, countryCode, lang, {
      buildNavigation: deps.buildPublishedNavigation,
      buildMeta: deps.buildHomepageMeta,
    })
  }

  const siteSettings = homepage.siteSettings || {}
  const seo = await resolveSeoForPath(deps.seoDeps(), pathname)

  const base = {
    pathname,
    lang,
    countryCode,
    dir: lang === 'ar' ? 'rtl' : 'ltr',
    seo,
    siteSettings,
    canonical: seo.canonical || `${PUBLIC_SITE_BASE}${pathname === '/' ? '' : pathname}`,
  }

  const kind = routeInfo?.kind || 'unknown'

  if (kind === 'home') {
    return {
      ...base,
      pageType: 'home',
      title: pickLang(homepage.hero, lang, 'title') || pickLang(homepage.seo, lang, 'pageTitle') || 'DigitalManager',
      description:
        pickLang(homepage.hero, lang, 'body') ||
        pickLang(homepage.hero, lang, 'sub') ||
        pickLang(homepage.seo, lang, 'metaDescription') ||
        '',
      hero: homepage.hero || {},
      about: homepage.about || {},
      stats: homepage.stats || {},
      modules: homepage.modules || {},
      industries: homepage.industries || {},
      footer: homepage.footer || {},
      header: homepage.header || {},
      navigation: homepage.navigation || {},
      faqs: homepage.faqs || {},
    }
  }

  if (kind === 'about') {
    const about = homepage.about || {}
    return {
      ...base,
      pageType: 'about',
      title: pickLang(about, lang, 'title') || 'About DigitalManager',
      description: (about.paragraphs || []).map((p) => readBilingualText(p, lang)).join(' '),
      about,
      siteSettings,
    }
  }

  if (kind === 'contact') {
    return {
      ...base,
      pageType: 'contact',
      title: lang === 'ar' ? 'اتصل بنا' : 'Contact DigitalManager',
      description:
        lang === 'ar'
          ? 'تواصل مع فريق DigitalManager للعروض التوضيحية والدعم والاستفسارات.'
          : 'Contact the DigitalManager team for demos, support, and business enquiries.',
      siteSettings,
    }
  }

  if (kind === 'privacy') {
    return {
      ...base,
      pageType: 'privacy',
      title: lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy',
      description:
        lang === 'ar'
          ? 'كيف تجمع DigitalManager وتستخدم وتحمي معلوماتك عند استخدام موقعنا وخدمات ERP.'
          : 'How DigitalManager collects, uses, and protects your information when you use our website and ERP services.',
      siteSettings,
    }
  }

  if (kind === 'blog-list') {
    const blogSection = await deps.publishStore.readPublished('blogSection.json').catch(() => ({}))
    return {
      ...base,
      pageType: 'blog-list',
      title: readBilingualText(blogSection?.page?.title, lang) || (lang === 'ar' ? 'المدونة' : 'Blog'),
      description: readBilingualText(blogSection?.page?.intro, lang) || readBilingualText(blogSection?.page?.seoDescription, lang) || '',
      blogSection,
    }
  }

  if (kind === 'blog-post' && routeInfo?.post) {
    const post = routeInfo.post
    return {
      ...base,
      pageType: 'blog-post',
      title: readBilingualText(post.title, lang),
      description: readBilingualText(post.excerpt, lang) || readBilingualText(post.seoDescription, lang) || '',
      post,
    }
  }

  if (kind === 'software') {
    const softwarePaths = uaeSoftwarePaths()
    const matchPath = restPath.startsWith('/') ? restPath : `/${restPath}`
    return {
      ...base,
      pageType: 'software',
      title: lang === 'ar' ? 'برمجيات DigitalManager' : 'DigitalManager Software',
      description:
        lang === 'ar'
          ? 'وحدات ERP سحابية للحسابات والمخزون ونقطة البيع والرواتب والعمليات.'
          : 'Cloud ERP modules for accounts, inventory, POS, payroll, and operations.',
      softwarePath: softwarePaths.includes(matchPath) ? matchPath : matchPath,
    }
  }

  if (['registry', 'blog-list', 'testimonials', 'industries', 'erp', 'solutions', 'business-models', 'faqs'].includes(kind)) {
    return {
      ...base,
      pageType: kind,
      title: seo.title || kind,
      description: seo.description || '',
      homepage,
    }
  }

  return {
    ...base,
    pageType: kind,
    title: seo.title || 'DigitalManager',
    description: seo.description || '',
    homepage,
  }
}

export function navigationLinksFromContent(content, lang) {
  const links = []
  const header = content.header || content.homepage?.header || {}
  const nav = content.navigation || {}
  const headerLinks = nav.headerLinks || header.links || []
  for (const link of headerLinks) {
    const label = readBilingualText(link.label, lang)
    const href = link.href || link.url || ''
    if (label && href) links.push({ label, href })
  }
  if (!links.length) {
    links.push(
      { label: lang === 'ar' ? 'الرئيسية' : 'Home', href: '/' },
      { label: lang === 'ar' ? 'ERP' : 'ERP', href: '/erp' },
      { label: lang === 'ar' ? 'القطاعات' : 'Industries', href: '/industries' },
      { label: lang === 'ar' ? 'اتصل' : 'Contact', href: '/contact' },
      { label: lang === 'ar' ? 'المدونة' : 'Blog', href: '/blog' },
    )
  }
  return links
}

export async function loadPublishedBlogPosts(deps, lang = 'en') {
  const postsDoc = await deps.publishStore.readPublished('blogPosts.json').catch(() => ({ items: [] }))
  return (postsDoc?.items || [])
    .filter((p) => isPublishedRecord(p))
    .map((p) => ({
      slug: p.slug,
      title: readBilingualText(p.title, lang),
      excerpt: readBilingualText(p.excerpt, lang),
    }))
}
