/**
 * Server-rendered HTML for crawlers — mirrors published CMS content.
 */
import { readBilingualText } from './contentHelpers.mjs'
import { getProfile } from './gccLocalizedContent/profiles.mjs'
import { PUBLIC_SITE_BASE } from './seoResolve.mjs'
import { navigationLinksFromContent } from './agenticContentLoader.mjs'

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function absoluteAsset(url) {
  if (!url) return `${PUBLIC_SITE_BASE}/digitalmanager-favicon.png`
  if (url.startsWith('http')) return url
  return `${PUBLIC_SITE_BASE}${url.startsWith('/') ? url : `/${url}`}`
}

function textBlock(value) {
  return escapeHtml(value).replace(/\n/g, '<br />')
}

function buildOrganizationJsonLd(content) {
  const site = content.siteSettings || {}
  const sameAs = [site.facebookUrl, site.linkedinUrl, site.instagramUrl, site.youtubeUrl, site.tiktokUrl].filter(
    (u) => typeof u === 'string' && u.startsWith('http'),
  )
  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DigitalManager',
    url: PUBLIC_SITE_BASE,
    logo: absoluteAsset(site.logoUrl || '/digitalmanager.svg'),
    description:
      readBilingualText(site.defaultMetaDescription, content.lang) ||
      readBilingualText(site.websiteTagline, content.lang) ||
      'Cloud ERP platform for finance, inventory, POS, payroll, and operations.',
  }
  if (site.primaryEmail) {
    org.contactPoint = {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: site.primaryEmail,
      telephone: site.phoneDisplay || undefined,
      availableLanguage: ['English', 'Arabic'],
    }
  }
  const addressText = readBilingualText(site.officeAddress, content.lang)
  if (addressText) {
    org.address = {
      '@type': 'PostalAddress',
      streetAddress: addressText,
      addressCountry: content.countryCode || 'AE',
    }
  }
  if (sameAs.length) org.sameAs = sameAs
  else {
    org.sameAs = [
      'https://www.facebook.com/Digitalsoftsltd',
      'https://www.linkedin.com/company/digitalsofts/',
    ]
  }
  return org
}

function buildSoftwareApplicationJsonLd(content) {
  const site = content.siteSettings || {}
  const profile = getProfile(content.countryCode || 'AE')
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'DigitalManager',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    url: content.canonical || PUBLIC_SITE_BASE,
    description:
      readBilingualText(site.defaultMetaDescription, content.lang) ||
      readBilingualText(content.hero?.body, content.lang) ||
      content.description ||
      'Cloud ERP for accounts, inventory, POS, payroll, and industry programmes.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: profile.currency,
      description: 'Contact DigitalManager for commercial ERP licensing and implementation.',
      url: `${PUBLIC_SITE_BASE}/contact`,
    },
    featureList: [
      'Financial management and VAT-ready invoicing',
      'Inventory and warehouse control',
      'Retail POS and branch operations',
      'Payroll and HRM',
      'CRM and customer operations',
      'Multi-branch GCC localization',
    ],
  }
}

function buildWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DigitalManager',
    url: PUBLIC_SITE_BASE,
  }
}

function buildBreadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.item,
    })),
  }
}

function buildArticleJsonLd(content) {
  const post = content.post
  if (!post) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: content.title,
    description: content.description,
    datePublished: post.publishedAt || post.createdAt || undefined,
    dateModified: post.updatedAt || post.publishedAt || undefined,
    author: { '@type': 'Organization', name: 'DigitalManager' },
    publisher: {
      '@type': 'Organization',
      name: 'DigitalManager',
      logo: { '@type': 'ImageObject', url: absoluteAsset('/digitalmanager.svg') },
    },
    mainEntityOfPage: content.canonical,
  }
}

export function buildJsonLdBlocks(content) {
  const blocks = [buildOrganizationJsonLd(content), buildSoftwareApplicationJsonLd(content), buildWebSiteJsonLd()]
  if (content.pageType === 'blog-post') {
    const article = buildArticleJsonLd(content)
    if (article) blocks.push(article)
    blocks.push(
      buildBreadcrumbJsonLd([
        { name: 'Home', item: PUBLIC_SITE_BASE },
        { name: content.lang === 'ar' ? 'المدونة' : 'Blog', item: `${PUBLIC_SITE_BASE}${content.lang === 'ar' ? '/ae/ar/insights' : '/blog'}` },
        { name: content.title, item: content.canonical },
      ]),
    )
  } else if (content.pageType !== 'home') {
    blocks.push(
      buildBreadcrumbJsonLd([
        { name: 'Home', item: PUBLIC_SITE_BASE },
        { name: content.title, item: content.canonical },
      ]),
    )
  }
  return blocks.filter(Boolean)
}

function buildHeadMeta(content) {
  const resolvedSeo =
    content.seo && typeof content.seo === 'object' && ('canonical' in content.seo || 'title' in content.seo)
      ? content.seo
      : null
  const title = resolvedSeo?.title || content.title || 'DigitalManager'
  const description = resolvedSeo?.description || content.description || ''
  const robots = resolvedSeo?.robots || (resolvedSeo?.noIndex ? 'noindex, follow' : 'index, follow')
  const ogImage = absoluteAsset(content.siteSettings?.ogImageUrl || content.siteSettings?.faviconUrl || '/digitalmanager-favicon.png')
  const ogType = content.pageType === 'blog-post' ? 'article' : 'website'
  const alternates = resolvedSeo?.alternates || []

  const tags = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<meta name="robots" content="${escapeHtml(robots)}" />`,
    `<link rel="canonical" href="${escapeHtml(content.canonical)}" />`,
    `<meta property="og:type" content="${ogType}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${escapeHtml(content.canonical)}" />`,
    `<meta property="og:image" content="${escapeHtml(ogImage)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(ogImage)}" />`,
  ]

  for (const alt of alternates) {
    if (alt.hreflang && alt.href) {
      tags.push(`<link rel="alternate" hreflang="${escapeHtml(alt.hreflang)}" href="${escapeHtml(alt.href)}" />`)
    }
  }

  for (const block of buildJsonLdBlocks(content)) {
    tags.push(`<script type="application/ld+json">${JSON.stringify(block)}</script>`)
  }

  return tags.join('\n    ')
}

function renderHomeBody(content) {
  const lang = content.lang
  const hero = content.hero || {}
  const about = content.about || {}
  const stats = content.stats || {}
  const modules = content.modules || {}
  const industries = content.industries || {}
  const site = content.siteSettings || {}
  const navLinks = navigationLinksFromContent(content, lang)

  const h1 = readBilingualText(hero.title, lang) || content.title
  const heroSub = readBilingualText(hero.sub, lang) || readBilingualText(hero.body, lang)
  const aboutParagraphs = (about.paragraphs || []).map((p) => readBilingualText(p, lang)).filter(Boolean)
  const moduleItems = (modules.items || []).filter((m) => m.active !== false).slice(0, 8)
  const industryItems = (industries.items || industries.cards || []).filter((i) => i.active !== false).slice(0, 8)
  const statItems = (stats.items || []).filter((s) => s.active !== false).slice(0, 4)

  const nav = navLinks
    .map((l) => `<li><a href="${escapeHtml(l.href)}">${escapeHtml(l.label)}</a></li>`)
    .join('\n          ')

  const moduleHtml = moduleItems
    .map(
      (m) =>
        `<li><strong>${escapeHtml(readBilingualText(m.title, lang))}</strong> — ${escapeHtml(readBilingualText(m.description, lang))}</li>`,
    )
    .join('\n          ')

  const industryHtml = industryItems
    .map((i) => `<li>${escapeHtml(readBilingualText(i.title || i.name, lang))}</li>`)
    .join('\n          ')

  const statsHtml = statItems
    .map((s) => `<li><strong>${escapeHtml(s.value || '')}</strong> ${escapeHtml(readBilingualText(s.label, lang))}</li>`)
    .join('\n          ')

  return `
    <article class="agentic-prerender" data-agentic-prerender="true">
      <header>
        <nav aria-label="Primary">
          <ul>
          ${nav}
          </ul>
        </nav>
        <h1>${textBlock(h1)}</h1>
        <p>${textBlock(heroSub)}</p>
      </header>
      <section>
        <h2>${lang === 'ar' ? 'لماذا DigitalManager' : 'Why DigitalManager'}</h2>
        <p>${textBlock(readBilingualText(stats.subheading, lang) || readBilingualText(stats.title, lang))}</p>
        <ul>${statsHtml}</ul>
      </section>
      <section>
        <h2>${escapeHtml(readBilingualText(modules.title, lang) || (lang === 'ar' ? 'وحدات ERP' : 'ERP Modules'))}</h2>
        <p>${textBlock(readBilingualText(modules.subtitle, lang))}</p>
        <ul>${moduleHtml}</ul>
      </section>
      <section>
        <h2>${escapeHtml(readBilingualText(industries.title, lang) || (lang === 'ar' ? 'القطاعات' : 'Industries'))}</h2>
        <p>${textBlock(readBilingualText(industries.subtitle, lang))}</p>
        <ul>${industryHtml}</ul>
      </section>
      <section>
        <h2>${escapeHtml(readBilingualText(about.title, lang) || (lang === 'ar' ? 'من نحن' : 'About'))}</h2>
        ${aboutParagraphs.map((p) => `<p>${textBlock(p)}</p>`).join('\n        ')}
      </section>
      <section>
        <h2>${lang === 'ar' ? 'تواصل معنا' : 'Contact'}</h2>
        <p>${lang === 'ar' ? 'فريق DigitalManager متاح للعروض التوضيحية والدعم.' : 'The DigitalManager team is available for demos and support.'}</p>
        ${site.phoneDisplay ? `<p>${lang === 'ar' ? 'الهاتف' : 'Phone'}: <a href="${escapeHtml(site.phoneHref || '#')}">${escapeHtml(site.phoneDisplay)}</a></p>` : ''}
        ${site.primaryEmail ? `<p>${lang === 'ar' ? 'البريد' : 'Email'}: <a href="mailto:${escapeHtml(site.primaryEmail)}">${escapeHtml(site.primaryEmail)}</a></p>` : ''}
        ${readBilingualText(site.officeAddress, lang) ? `<p>${textBlock(readBilingualText(site.officeAddress, lang))}</p>` : ''}
        <p><a href="/contact">${lang === 'ar' ? 'صفحة الاتصال' : 'Contact page'}</a></p>
      </section>
      <section>
        <h2>${lang === 'ar' ? 'DigitalManager — موارد المطورين' : 'DigitalManager developer resources'}</h2>
        <p>${lang === 'ar' ? 'واجهة API عامة للقراءة فقط للمحتوى المنشور — بدون مفاتيح API أو بيانات ERP.' : 'Read-only public content API for published marketing data — no API keys or ERP tenant data.'}</p>
        <ul>
          <li><a href="/developers">${lang === 'ar' ? 'نظرة عامة للمطورين' : 'Developer overview (/developers)'}</a></li>
          <li><a href="/openapi.json">OpenAPI 3.1 specification (/openapi.json)</a></li>
          <li><a href="/llms.txt">Agent instructions (llms.txt)</a></li>
          <li><a href="/sitemap.xml">${lang === 'ar' ? 'خريطة الموقع' : 'Sitemap'}</a></li>
        </ul>
      </section>
    </article>`
}

function renderAboutBody(content) {
  const lang = content.lang
  const about = content.about || {}
  const paragraphs = (about.paragraphs || []).map((p) => readBilingualText(p, lang)).filter(Boolean)
  return `
    <article class="agentic-prerender" data-agentic-prerender="true">
      <h1>${escapeHtml(readBilingualText(about.title, lang) || content.title)}</h1>
      ${paragraphs.map((p) => `<p>${textBlock(p)}</p>`).join('\n      ')}
      <section>
        <h2>${lang === 'ar' ? 'ما الذي نقدمه' : 'What we provide'}</h2>
        <p>${lang === 'ar' ? 'DigitalManager منصة ERP سحابية للحسابات والمخزون ونقطة البيع والرواتب والعمليات متعددة الفروع.' : 'DigitalManager is a cloud ERP platform for accounts, inventory, POS, payroll, and multi-branch operations.'}</p>
      </section>
      <p><a href="/contact">${lang === 'ar' ? 'تواصل معنا' : 'Contact us'}</a></p>
    </article>`
}

function renderContactBody(content) {
  const lang = content.lang
  const site = content.siteSettings || {}
  return `
    <article class="agentic-prerender" data-agentic-prerender="true">
      <h1>${escapeHtml(content.title)}</h1>
      <p>${textBlock(content.description)}</p>
      <p>${lang === 'ar' ? 'يسعدنا التواصل مع الشركات التي تبحث عن منصة ERP سحابية للحسابات والمخزون ونقطة البيع والرواتب والعمليات متعددة الفروع.' : 'We welcome enquiries from businesses exploring a cloud ERP platform for accounts, inventory, POS, payroll, and multi-branch operations.'}</p>
      <section>
        <h2>${lang === 'ar' ? 'معلومات التواصل' : 'Contact details'}</h2>
        ${site.phoneDisplay ? `<p>${lang === 'ar' ? 'الهاتف' : 'Phone'}: ${escapeHtml(site.phoneDisplay)}</p>` : ''}
        ${site.primaryEmail ? `<p>${lang === 'ar' ? 'البريد' : 'Email'}: ${escapeHtml(site.primaryEmail)}</p>` : ''}
        ${readBilingualText(site.officeAddress, lang) ? `<p>${textBlock(readBilingualText(site.officeAddress, lang))}</p>` : ''}
        ${readBilingualText(site.workingHours, lang) ? `<p>${textBlock(readBilingualText(site.workingHours, lang))}</p>` : ''}
      </section>
      <section>
        <h2>${lang === 'ar' ? 'طلب عرض' : 'Request a demo'}</h2>
        <p>${lang === 'ar' ? 'استخدم نموذج الاتصال على هذه الصفحة لطلب عرض توضيحي أو مناقشة متطلبات ERP الخاصة بك.' : 'Use the contact form on this page to request a demo or discuss your ERP requirements with our team.'}</p>
        <p>${lang === 'ar' ? 'يرجى تضمين اسم الشركة والقطاع وعدد الفروع إن أمكن — يساعدنا ذلك على تخصيص العرض.' : 'Please include your company name, industry, and branch count when possible — this helps us tailor the conversation.'}</p>
      </section>
      <section>
        <h2>${lang === 'ar' ? 'الدعم والمبيعات' : 'Sales and support'}</h2>
        <p>${lang === 'ar' ? 'يمكنك أيضاً التواصل عبر WhatsApp أو البريد الإلكتروني للاستفسارات العامة حول DigitalManager.' : 'You can also reach us by email for general questions about DigitalManager modules, industries, and implementation scope.'}</p>
      </section>
    </article>`
}

function renderPrivacyBody(content) {
  const lang = content.lang
  const site = content.siteSettings || {}
  const sections =
    lang === 'ar'
      ? [
          ['جمع المعلومات', 'نجمع معلومات التواصل التي تقدمها عبر نماذج الموقع — مثل الاسم والبريد الإلكتروني والهاتف والشركة — لمعالجة طلبات العروض والاستفسارات.'],
          ['استخدام المعلومات', 'نستخدم هذه المعلومات للرد على استفساراتك وتنسيق العروض التوضيحية وتقديم الدعم المتعلق بخدمات DigitalManager ERP.'],
          ['حماية البيانات', 'نطبق ضوابط عملية لحماية معلومات التواصل ونحدّ من الوصول إلى البيانات داخل فريقنا.'],
          ['ملفات تعريف الارتباط', 'قد يستخدم الموقع ملفات تعريف الارتباط الأساسية وتحليلات متوافقة مع إعدادات المتصفح لتحسين تجربة التصفح.'],
          ['حقوقك', 'يمكنك طلب الوصول إلى معلومات التواصل التي قدمتها أو تصحيحها عبر التواصل معنا على البريد أدناه.'],
          ['التواصل', `لأسئلة الخصوصية، راسل ${site.primaryEmail || 'info@digitalmanager.ae'}.`],
        ]
      : [
          ['Information we collect', 'We collect contact details you submit through website forms — such as name, email, phone, and company — to process demo requests and enquiries.'],
          ['How we use information', 'We use this information to respond to enquiries, coordinate product demos, and provide support related to DigitalManager ERP services.'],
          ['Data protection', 'We apply practical controls to protect contact information and limit internal access to submitted data.'],
          ['Cookies', 'The site may use essential cookies and privacy-conscious analytics compatible with browser settings to improve browsing experience.'],
          ['Your choices', 'You may request access to or correction of contact information you have submitted by contacting us using the email below.'],
          ['Contact', `For privacy questions, email ${site.primaryEmail || 'info@digitalmanager.ae'}.`],
        ]

  return `
    <article class="agentic-prerender" data-agentic-prerender="true">
      <h1>${escapeHtml(content.title)}</h1>
      <p>${textBlock(content.description)}</p>
      ${sections.map(([heading, body]) => `<section><h2>${escapeHtml(heading)}</h2><p>${textBlock(body)}</p></section>`).join('\n      ')}
      <p><a href="/contact">${lang === 'ar' ? 'اتصل بنا' : 'Contact us'}</a></p>
    </article>`
}

function renderDevelopersBody(content) {
  const copy = content.developers || {}
  const lang = content.lang
  const sections = (copy.sections || []).filter((s) => s.heading !== 'Examples')
  return `
    <article class="agentic-prerender" data-agentic-prerender="true" id="versioning">
      <h1>${escapeHtml(content.title)}</h1>
      <p>${textBlock(content.description)}</p>
      ${sections
        .map(
          (section) =>
            `<section><h2>${escapeHtml(section.heading)}</h2><ul>${(section.body || []).map((row) => `<li>${textBlock(row)}</li>`).join('')}</ul></section>`,
        )
        .join('\n      ')}
      <section>
        <h2>${lang === 'ar' ? 'أمثلة' : 'Examples'}</h2>
        <pre><code>${escapeHtml(copy.curlHealth || '')}</code></pre>
        <pre><code>${escapeHtml(copy.curlErp || '')}</code></pre>
      </section>
      <p><a href="/openapi.json">${escapeHtml(copy.openapiLabel || 'OpenAPI 3.1')}</a> · <a href="/llms.txt">${escapeHtml(copy.llmsLabel || 'llms.txt')}</a></p>
    </article>`
}

function renderGenericBody(content) {
  return `
    <article class="agentic-prerender" data-agentic-prerender="true">
      <h1>${escapeHtml(content.title)}</h1>
      <p>${textBlock(content.description)}</p>
      <p><a href="/">${content.lang === 'ar' ? 'العودة للرئيسية' : 'Back to homepage'}</a></p>
    </article>`
}

export function renderAgenticBody(content) {
  switch (content.pageType) {
    case 'home':
      return renderHomeBody(content)
    case 'about':
      return renderAboutBody(content)
    case 'contact':
      return renderContactBody(content)
    case 'privacy':
      return renderPrivacyBody(content)
    case 'developers':
      return renderDevelopersBody(content)
    default:
      return renderGenericBody(content)
  }
}

/** Critical above-the-fold CSS — brands SSR hero instantly; full Tailwind bundle completes styling after load. */
const CRITICAL_SSR_CSS = `
body { margin: 0; background: #111936; }
html:not(.dm-ready) #root .dm-ssr-shell,
html:not(.dm-ready) #root .agentic-prerender {
  background: #111936;
  color: #e2e8f0;
  min-height: 100vh;
  font-family: Inter, system-ui, sans-serif;
  line-height: 1.65;
  max-width: none;
  margin: 0;
  padding: 0;
}
html:not(.dm-ready) #root .agentic-prerender header {
  max-width: 1320px;
  margin: 0 auto;
  padding: 3rem 1.25rem 2rem;
}
html:not(.dm-ready) #root .agentic-prerender h1 {
  color: #ffffff;
  font-family: Sora, Inter, system-ui, sans-serif;
  font-size: clamp(1.75rem, 4vw, 2.75rem);
  font-weight: 700;
  line-height: 1.15;
  margin: 0 0 1rem;
}
html:not(.dm-ready) #root .agentic-prerender header > p {
  color: #cbd5e1;
  font-size: 1.05rem;
  max-width: 42rem;
  margin: 0;
}
html:not(.dm-ready) #root .agentic-prerender nav,
html:not(.dm-ready) #root .agentic-prerender > section {
  display: none;
}
`.trim()

const NOSCRIPT_SHELL_CSS =
  '.dm-noscript-shell{font-family:Inter,system-ui,sans-serif;color:#0f172a;line-height:1.65;max-width:52rem;margin:0 auto;padding:1.5rem 1.25rem}'

function extractViteAssets(templateHtml) {
  const cssHref = templateHtml.match(/<link[^>]+href="(\/assets\/[^"]+\.css)"[^>]*>/i)?.[1]
  const jsSrc = templateHtml.match(/<script[^>]+src="(\/assets\/[^"]+\.js)"[^>]*>/i)?.[1]
  return { cssHref, jsSrc }
}

function stripViteAssetTags(html) {
  return html
    .replace(/<script[^>]+src="\/assets\/[^"]+\.js"[^>]*>\s*<\/script>\s*/i, '')
    .replace(/<link[^>]+href="\/assets\/[^"]+\.css"[^>]*>\s*/i, '')
}

/** CSS before JS — preload hashed Vite assets from the current build. */
function buildViteAssetTags(templateHtml) {
  const { cssHref, jsSrc } = extractViteAssets(templateHtml)
  const tags = []
  if (cssHref) {
    tags.push(`<link rel="preload" href="${cssHref}" as="style" crossorigin />`)
    tags.push(`<link rel="stylesheet" crossorigin href="${cssHref}">`)
  }
  if (jsSrc) {
    tags.push(`<link rel="modulepreload" crossorigin href="${jsSrc}">`)
    tags.push(`<script type="module" crossorigin src="${jsSrc}"></script>`)
  }
  return tags.join('\n    ')
}

function applyShellHead(html, content) {
  const lang = content.lang || 'en'
  const dir = content.dir || (lang === 'ar' ? 'rtl' : 'ltr')
  const headMeta = buildHeadMeta(content)
  const assetTags = buildViteAssetTags(html)
  let out = stripViteAssetTags(html)
  out = out.replace(/<html[^>]*>/i, `<html lang="${escapeHtml(lang)}" dir="${dir}">`)
  out = out.replace(/<title>[\s\S]*?<\/title>/i, '')
  out = out.replace(/<meta\s+name="description"[^>]*>/i, '')
  out = out.replace('<head>', `<head>\n    ${headMeta}\n    ${assetTags}`)
  return out
}

export function injectAgenticHtml(templateHtml, content) {
  const body = renderAgenticBody(content)
  let html = applyShellHead(templateHtml, content)
  html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`)
  html = html.replace('<div id="root"><\/div>', `<div id="root">${body}</div>`)
  return html
}

/**
 * Browser shell: SEO meta + JSON-LD in <head>, Vite CSS/JS, empty #root.
 * React mounts immediately with no agent/prerender body flash before hydration.
 */
export function injectBrowserSeoShellHtml(templateHtml, content) {
  let html = applyShellHead(templateHtml, content)
  const noscriptMsg =
    content.lang === 'ar'
      ? 'يتطلب هذا الموقع JavaScript للحصول على أفضل تجربة. تواصل معنا عبر صفحة الاتصال.'
      : 'This site requires JavaScript for the full experience. Contact us via the contact page.'
  const shell = `
    <noscript><p class="dm-noscript-note">${escapeHtml(noscriptMsg)} <a href="/contact">${content.lang === 'ar' ? 'اتصل بنا' : 'Contact us'}</a></p></noscript>
    <div id="root"></div>`
  html = html.replace('<div id="root"></div>', shell)
  html = html.replace('<div id="root"><\/div>', shell)
  return html
}

/** @deprecated Use injectBrowserSeoShellHtml — kept as alias for tests migrating off SSR body injection. */
export function injectBrowserShellHtml(templateHtml, content) {
  return injectBrowserSeoShellHtml(templateHtml, content)
}

export function render404Html(templateHtml, pathname, lang = 'en') {
  const title = lang === 'ar' ? 'الصفحة غير موجودة' : 'Page not found'
  const intro =
    lang === 'ar'
      ? 'تعذر العثور على الصفحة المطلوبة. جرّب أحد الروابط أدناه.'
      : 'The page you requested could not be found. Try one of the links below.'
  const body = `
    <main class="agentic-prerender agentic-404" data-agentic-prerender="true" style="max-width:48rem;margin:2rem auto;padding:1.5rem;font-family:Inter,system-ui,sans-serif;color:#0f172a">
      <h1>${title}</h1>
      <p>${intro}</p>
      <ul>
        <li><a href="/">${lang === 'ar' ? 'الرئيسية' : 'Homepage'}</a></li>
        <li><a href="/sitemap.xml">${lang === 'ar' ? 'خريطة الموقع' : 'Sitemap'}</a></li>
        <li><a href="/llms.txt">llms.txt</a></li>
        <li><a href="/developers">${lang === 'ar' ? 'المطورون' : 'Developers'}</a></li>
        <li><a href="/openapi.json">OpenAPI</a></li>
        <li><a href="/blog">${lang === 'ar' ? 'المدونة' : 'Blog'}</a></li>
        <li><a href="/contact">${lang === 'ar' ? 'اتصل' : 'Contact'}</a></li>
      </ul>
      <p><small>${escapeHtml(pathname)}</small></p>
    </main>`

  let html = templateHtml
  html = html.replace(/<html[^>]*>/i, `<html lang="${lang}">`)
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title} — DigitalManager</title>`)
  html = html.replace('<div id="root"></div>', `<div id="root">${body}</div>`)
  html = html.replace('<div id="root"><\/div>', `<div id="root">${body}</div>`)
  return html
}
