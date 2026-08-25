/**
 * Shared copy for /developers (SPA, prerender HTML, markdown).
 */
import { PUBLIC_SITE_BASE } from './seoResolve.mjs'

export function developersPageCopy(lang = 'en') {
  const en = {
    title: 'Developers & Public API',
    intro:
      'DigitalManager publishes a read-only public content API for agents, integrators, and internal tools. It exposes published marketing content — not ERP tenant data, admin CMS, or customer records.',
    sections: [
      {
        heading: 'When to use this API',
        body: [
          'Retrieve published company contact details, homepage sections, ERP module pages, industries, business models, FAQs, blog posts, and testimonials.',
          'Submit contact or demo enquiries via POST /api/leads (rate limited; no API key required today).',
          'Resolve SEO metadata, sitemaps, and locale routing for GCC country sites.',
          'Do not use this API for ERP transactions, admin CMS changes, lead exports, or authenticated back-office workflows.',
        ],
      },
      {
        heading: 'Authentication',
        body: [
          'No API keys are required for the documented public endpoints.',
          'All /api/admin/* routes require CMS authentication and are excluded from the public specification.',
          'There is no public sandbox environment — use your local build or the production origin after deployment.',
        ],
      },
      {
        heading: 'Rate limits',
        body: [
          'GET endpoints: reasonable use expected; responses use Cache-Control: no-store for JSON content APIs.',
          'POST /api/leads: per-IP rate limit (approximately 5 submissions per 15 minutes). Returns HTTP 429 with a structured error when exceeded.',
        ],
      },
      {
        heading: 'Public endpoints (summary)',
        body: [
          'GET /api/health — service health',
          'GET /api/site-settings — company contact, header, footer',
          'GET /api/homepage?country=&lang= — locale homepage bundle',
          'GET /api/public/locale-content/{slug} — erp, solutions, business-models, faqs, contact, industries',
          'GET /api/public/locale-content/software/{kind}/{slug} — module/industry detail',
          'GET /api/public/blog/posts, /api/public/blog/posts/{slug}',
          'GET /api/public/testimonials',
          'GET /api/public/seo-page?path=',
          'POST /api/leads — contact/demo submission',
          'Discovery: /openapi.json, /llms.txt, /sitemap.xml',
        ],
      },
      {
        heading: 'Pricing',
        body: [
          'There is no dedicated public pricing API. If a pricing CMS page is published, fetch it with GET /api/public/pages/{slug}.',
        ],
      },
      {
        heading: 'Examples',
        body: [],
      },
    ],
    curlHealth: `curl -sS "${PUBLIC_SITE_BASE}/api/health"`,
    curlErp: `curl -sS "${PUBLIC_SITE_BASE}/api/public/locale-content/erp?country=AE&lang=en"`,
    curlBlog: `curl -sS "${PUBLIC_SITE_BASE}/api/public/blog/posts?country=AE&lang=en&page=1"`,
    jsFetch: `const res = await fetch('/api/public/testimonials?country=AE&lang=en');
const data = await res.json();`,
    openapiLabel: 'OpenAPI 3.1 specification',
    llmsLabel: 'Agent instructions (llms.txt)',
  }

  if (lang === 'ar') {
    return {
      ...en,
      title: 'المطورون وواجهة API العامة',
      intro:
        'توفّر DigitalManager واجهة API عامة للقراءة فقط للوكلاء والأدوات الداخلية. تعرض محتوى تسويقي منشوراً — وليس بيانات ERP أو CMS الإداري أو سجلات العملاء.',
      sections: en.sections.map((s, i) =>
        i === 0
          ? {
              heading: 'متى تستخدم هذه الواجهة',
              body: [
                'جلب تفاصيل الشركة، الصفحة الرئيسية، الوحدات، القطاعات، النماذج، الأسئلة، المدونة، والشهادات المنشورة.',
                'إرسال طلبات التواصل أو العروض عبر POST /api/leads (محدود المعدل).',
                'لا تستخدمها لمعاملات ERP أو تغييرات CMS أو تصدير العملاء.',
              ],
            }
          : s,
      ),
    }
  }

  return en
}

export function developersMarkdown(lang = 'en') {
  const copy = developersPageCopy(lang)
  const lines = [`# ${copy.title}`, '', copy.intro, '']
  for (const section of copy.sections) {
    if (section.heading === 'Examples') continue
    lines.push(`## ${section.heading}`, '')
    for (const row of section.body) lines.push(`- ${row}`)
    lines.push('')
  }
  lines.push('## Examples', '')
  lines.push('### curl — health', '```', copy.curlHealth, '```', '')
  lines.push('### curl — ERP page', '```', copy.curlErp, '```', '')
  lines.push('### curl — blog listing', '```', copy.curlBlog, '```', '')
  lines.push('### JavaScript — testimonials', '```javascript', copy.jsFetch, '```', '')
  lines.push('## Resources', '')
  lines.push(`- [${copy.openapiLabel}](${PUBLIC_SITE_BASE}/openapi.json)`)
  lines.push(`- [${copy.llmsLabel}](${PUBLIC_SITE_BASE}/llms.txt)`)
  lines.push(`- [Contact](${PUBLIC_SITE_BASE}/contact)`)
  lines.push('')
  return `${lines.join('\n')}\n`
}
