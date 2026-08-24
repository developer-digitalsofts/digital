/**
 * Markdown representations for agent/crawler content negotiation.
 */
import { readBilingualText } from './contentHelpers.mjs'
import { navigationLinksFromContent } from './agenticContentLoader.mjs'

function mdEscape(text) {
  return String(text ?? '').replace(/\r\n/g, '\n').trim()
}

export function renderAgenticMarkdown(content) {
  const lines = []
  lines.push(`# ${mdEscape(content.title)}`)
  lines.push('')
  lines.push(`Canonical: ${content.canonical}`)
  lines.push('')
  if (content.description) {
    lines.push(mdEscape(content.description))
    lines.push('')
  }

  if (content.pageType === 'home') {
    const lang = content.lang
    const hero = content.hero || {}
    const about = content.about || {}
    const modules = content.modules || {}
    const industries = content.industries || {}
    const stats = content.stats || {}
    const site = content.siteSettings || {}

    lines.push(`## ${lang === 'ar' ? 'نظرة عامة' : 'Overview'}`)
    lines.push('')
    lines.push(mdEscape(readBilingualText(hero.body, lang) || readBilingualText(hero.sub, lang)))
    lines.push('')

    lines.push(`## ${lang === 'ar' ? 'الثقة والنتائج' : 'Trust and performance'}`)
    lines.push('')
    lines.push(mdEscape(readBilingualText(stats.subheading, lang) || readBilingualText(stats.title, lang)))
    lines.push('')

    lines.push(`## ${mdEscape(readBilingualText(modules.title, lang) || 'ERP Modules')}`)
    lines.push('')
    for (const item of (modules.items || []).filter((m) => m.active !== false).slice(0, 8)) {
      lines.push(`- **${mdEscape(readBilingualText(item.title, lang))}** — ${mdEscape(readBilingualText(item.description, lang))}`)
    }
    lines.push('')

    lines.push(`## ${mdEscape(readBilingualText(industries.title, lang) || (lang === 'ar' ? 'القطاعات' : 'Industries'))}`)
    lines.push('')
    for (const item of (industries.items || industries.cards || []).filter((i) => i.active !== false).slice(0, 8)) {
      lines.push(`- ${mdEscape(readBilingualText(item.title || item.name, lang))}`)
    }
    lines.push('')

    lines.push(`## ${mdEscape(readBilingualText(about.title, lang) || (lang === 'ar' ? 'من نحن' : 'About'))}`)
    lines.push('')
    for (const paragraph of about.paragraphs || []) {
      lines.push(mdEscape(readBilingualText(paragraph, lang)))
      lines.push('')
    }

    lines.push(`## ${lang === 'ar' ? 'روابط مهمة' : 'Important links'}`)
    lines.push('')
    for (const link of navigationLinksFromContent(content, lang)) {
      lines.push(`- [${link.label}](${link.href})`)
    }
    lines.push('')

    lines.push(`## ${lang === 'ar' ? 'تواصل' : 'Contact'}`)
    lines.push('')
    if (site.phoneDisplay) lines.push(`- Phone: ${site.phoneDisplay}`)
    if (site.primaryEmail) lines.push(`- Email: ${site.primaryEmail}`)
    if (readBilingualText(site.officeAddress, lang)) lines.push(`- Address: ${mdEscape(readBilingualText(site.officeAddress, lang))}`)
    lines.push(`- [Contact page](/contact)`)
    lines.push('')
  } else if (content.pageType === 'about') {
    for (const paragraph of content.about?.paragraphs || []) {
      lines.push(mdEscape(readBilingualText(paragraph, content.lang)))
      lines.push('')
    }
  } else if (content.pageType === 'contact') {
    const site = content.siteSettings || {}
    if (site.phoneDisplay) lines.push(`- Phone: ${site.phoneDisplay}`)
    if (site.primaryEmail) lines.push(`- Email: ${site.primaryEmail}`)
    if (readBilingualText(site.officeAddress, content.lang)) {
      lines.push(`- Address: ${mdEscape(readBilingualText(site.officeAddress, content.lang))}`)
    }
    lines.push('')
  } else if (content.pageType === 'privacy') {
    lines.push(content.lang === 'ar' ? 'راجع الأقسام على صفحة سياسة الخصوصية للتفاصيل.' : 'See the privacy page sections for full details.')
    lines.push('')
  } else if (content.pageType === 'blog-post' && content.post) {
    lines.push(mdEscape(readBilingualText(content.post.excerpt, content.lang)))
    lines.push('')
  }

  lines.push(`---`)
  lines.push(`Generated from published CMS content at ${content.canonical}`)
  return `${lines.join('\n')}\n`
}

export function render404Markdown(pathname, lang = 'en') {
  const title = lang === 'ar' ? 'الصفحة غير موجودة' : 'Page not found'
  return `# ${title}

The requested path \`${pathname}\` does not exist on DigitalManager.

## Recovery links

- [Homepage](/)
- [Sitemap](/sitemap.xml)
- [llms.txt](/llms.txt)
- [Blog](/blog)
- [Contact](/contact)
`
}
