/**
 * Shared copy for /developers (SPA, prerender HTML, markdown).
 */
import { PUBLIC_SITE_BASE } from './seoResolve.mjs'
import { PUBLIC_API_VERSION_POLICY, PUBLIC_API_V1_SUNSET } from './publicApiVersioning.mjs'
import { publicRateLimitPolicyText } from './publicApiRateLimit.mjs'

export const DEVELOPERS_PAGE_TITLE = 'DigitalManager Developers'

export function developersPageCopy(lang = 'en') {
  const en = {
    title: DEVELOPERS_PAGE_TITLE,
    metaTitle: `${DEVELOPERS_PAGE_TITLE} | DigitalManager`,
    intro:
      'DigitalManager publishes a read-only public content API for agents, integrators, and internal tools. It exposes published marketing content — not ERP tenant data, admin CMS, or customer records.',
    sections: [
      {
        heading: 'When to use this API',
        body: [
          'Retrieve published company contact details, homepage sections, ERP module pages, industries, business models, FAQs, blog posts, and testimonials.',
          'Submit contact or demo enquiries via POST /api/public/v1/leads (alias POST /api/leads; rate limited; no API key required today).',
          'Resolve SEO metadata, sitemaps, and locale routing for Pakistan city sites.',
          'Do not use this API for ERP transactions, admin CMS changes, lead exports, or authenticated back-office workflows.',
        ],
      },
      {
        heading: 'Authentication & versioning',
        body: [
          'No API keys are required for the documented public endpoints.',
          'Stable routes are under /api/public/v1/. Legacy unversioned paths remain as backward-compatible aliases until the Sunset date.',
          `Deprecation policy: legacy aliases return Deprecation and Sunset headers (Sunset: ${PUBLIC_API_V1_SUNSET}).`,
          'All /api/admin/* routes require CMS authentication and are excluded from the public specification.',
          'There is no public sandbox environment — use your local build or the production origin after deployment.',
        ],
      },
      {
        heading: 'Rate limits',
        body: publicRateLimitPolicyText(),
      },
      {
        heading: 'Public v1 endpoints (summary)',
        body: [
          'GET /api/public/v1/health — service health',
          'GET /api/public/v1/site-settings — company contact, header, footer',
          'GET /api/public/v1/homepage?country=&lang= — locale homepage bundle',
          'GET /api/public/v1/locale-content/{slug} — erp, solutions, business-models, faqs, contact, industries',
          'GET /api/public/v1/locale-content/software/{kind}/{slug} — module/industry detail',
          'GET /api/public/v1/locale-content/city/{citySlug}/{pageSlug} — city landing pages',
          'GET /api/public/v1/cities — published city registry',
          'GET /api/public/v1/blog/posts, /api/public/v1/blog/posts/{slug}',
          'GET /api/public/v1/testimonials',
          'GET /api/public/v1/seo-page?path=',
          'POST /api/public/v1/leads — contact/demo submission',
          'Discovery: /developers, /openapi.json, /llms.txt, /sitemap.xml',
        ],
      },
      {
        heading: 'Available integrations',
        body: [
          'OpenAPI 3.1 machine-readable contract at /openapi.json.',
          'Agent instructions at /llms.txt and markdown alternates (Accept: text/markdown) on public pages.',
          'Local developer CLI: node tools/dm-public-cli/bin/dm-public.mjs (health, erp, blog, seo helpers).',
          'No hosted MCP server, webhooks product, or npm-published SDK at this time.',
        ],
      },
      {
        heading: 'Versioning policy',
        body: PUBLIC_API_VERSION_POLICY.split('\n'),
      },
      {
        heading: 'Pricing',
        body: [
          'There is no dedicated public pricing API. If a pricing CMS page is published, fetch it with GET /api/public/v1/pages/{slug}.',
        ],
      },
      {
        heading: 'Examples',
        body: [],
      },
    ],
    curlHealth: `curl -sS "${PUBLIC_SITE_BASE}/api/public/v1/health"`,
    curlErp: `curl -sS "${PUBLIC_SITE_BASE}/api/public/v1/locale-content/erp?country=AE&lang=en"`,
    curlBlog: `curl -sS "${PUBLIC_SITE_BASE}/api/public/v1/blog/posts?country=AE&lang=en&page=1"`,
    jsFetch: `const res = await fetch('/api/public/v1/testimonials?country=AE&lang=en');
const data = await res.json();`,
    openapiLabel: 'OpenAPI 3.1 specification',
    llmsLabel: 'Agent instructions (llms.txt)',
  }

  if (lang === 'ar') {
    return {
      ...en,
      title: 'منصة DigitalManager للمطورين',
      metaTitle: 'منصة DigitalManager للمطورين',
      intro:
        'توفّر DigitalManager واجهة API عامة للقراءة فقط للوكلاء والأدوات الداخلية. تعرض محتوى تسويقي منشوراً — وليس بيانات ERP أو CMS الإداري أو سجلات العملاء.',
      sections: en.sections.map((s, i) =>
        i === 0
          ? {
              heading: 'متى تستخدم هذه الواجهة',
              body: [
                'جلب تفاصيل الشركة، الصفحة الرئيسية، الوحدات، القطاعات، النماذج، الأسئلة، المدونة، والشهادات المنشورة.',
                'إرسال طلبات التواصل أو العروض عبر POST /api/public/v1/leads (محدود المعدل).',
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
