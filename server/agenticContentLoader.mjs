/**
 * Load published CMS content for agentic HTML/Markdown rendering.
 */
import { readBilingualText, isPublishedRecord } from './contentHelpers.mjs'
import { buildLocaleHomepagePayload } from './localeHomepage.mjs'
import { normalizeCountryCode } from './countryHelpers.mjs'
import { normalizeLocaleLang, findRecordByIdentity } from './localeContentModel.mjs'
import { parseLocalePath } from './seoPaths.mjs'
import { resolveSeoForPath, PUBLIC_SITE_BASE } from './seoResolve.mjs'
import { uaeSoftwarePaths } from './seoRouteCatalog.mjs'
import { developersPageCopy } from './agenticDevelopersContent.mjs'

async function loadLocaleSoftwareDetailSeo(deps, countryCode, lang, kind, slug) {
  const contentType = kind === 'module' ? 'solution' : 'industry'
  const globalIdentity = `${kind}:${slug}`
  try {
    const store = await deps.localePublish.readPublishedStore()
    const match = findRecordByIdentity(store.records, contentType, globalIdentity, countryCode, lang)
    if (!match) return null
    const payload = match.payload || {}
    const seo = match.seo || {}
    return {
      title:
        readBilingualText(payload.heading, lang) ||
        readBilingualText(payload.title, lang) ||
        readBilingualText(seo.pageTitle, lang),
      description:
        readBilingualText(payload.shortDescription, lang) ||
        readBilingualText(seo.metaDescription, lang) ||
        readBilingualText(payload.fields?.metaDescription, lang),
    }
  } catch {
    return null
  }
}

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

  if (kind === 'developers') {
    const copy = developersPageCopy(lang)
    return {
      ...base,
      pageType: 'developers',
      title: copy.title,
      description: copy.intro,
      seo: { title: copy.metaTitle, description: copy.intro, robots: 'index, follow' },
      developers: copy,
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
    const parts = matchPath.split('/').filter(Boolean)
    const detailKind = parts[1] === 'industry' ? 'industry' : 'module'
    const detailSlug = parts[1] === 'industry' ? parts[2] : parts[1]
    const localeSeo =
      detailSlug && countryCode !== 'AE'
        ? await loadLocaleSoftwareDetailSeo(deps, countryCode, lang, detailKind, detailSlug)
        : null
    return {
      ...base,
      pageType: 'software',
      title:
        localeSeo?.title ||
        seo.title ||
        (lang === 'ar' ? 'برمجيات DigitalManager' : 'DigitalManager Software'),
      description:
        localeSeo?.description ||
        seo.description ||
        (lang === 'ar'
          ? 'وحدات ERP سحابية للحسابات والمخزون ونقطة البيع والرواتب والعمليات.'
          : 'Cloud ERP modules for accounts, inventory, POS, payroll, and operations.'),
      softwarePath: softwarePaths.includes(matchPath) ? matchPath : matchPath,
    }
  }

  if (kind === 'locale-industry' && routeInfo?.slug) {
    const slug = routeInfo.slug
    const localeSeo = await loadLocaleSoftwareDetailSeo(deps, countryCode, lang, 'industry', slug)
    return {
      ...base,
      pageType: 'software',
      title: localeSeo?.title || (lang === 'ar' ? 'برمجيات DigitalManager' : 'DigitalManager Software'),
      description:
        localeSeo?.description ||
        (lang === 'ar'
          ? 'حلول ERP سحابية مهيّأة لقطاعات الأعمال في دول الخليج.'
          : 'Cloud ERP industry solutions for GCC businesses.'),
      softwarePath: `/software/industry/${slug}`,
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
  links.push(
    { label: lang === 'ar' ? 'DigitalManager للمطورين' : 'DigitalManager Developers', href: '/developers' },
    { label: 'OpenAPI 3.1', href: '/openapi.json' },
    { label: 'llms.txt', href: '/llms.txt' },
  )
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
