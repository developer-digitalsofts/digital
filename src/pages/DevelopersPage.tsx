import { Link } from 'react-router-dom'
import { useI18n } from '../i18n/I18nProvider'
import { pageShellClass } from '../ui/pageShell'
import { sectionPad } from '../ui/saas'

const BASE = typeof window !== 'undefined' ? window.location.origin : 'https://digitalmanager.com.pk'
const TITLE = 'DigitalManager Developer Platform'

export function DevelopersPage() {
  const { lang } = useI18n()
  const en = lang !== 'ar'

  const intro = en
    ? 'Read-only access to published DigitalManager marketing content. Admin CMS, ERP tenant data, and customer records are not exposed.'
    : 'وصول للقراءة فقط إلى المحتوى التسويقي المنشور. لا يتم عرض CMS الإداري أو بيانات ERP أو سجلات العملاء.'

  const sections = en
    ? [
        {
          heading: 'When to use this API',
          items: [
            'Fetch company contact details, homepage content, ERP modules, industries, business models, FAQs, blogs, and testimonials.',
            'Submit contact or demo requests via POST /api/public/v1/leads (alias POST /api/leads; rate limited; no API key today).',
            'Resolve SEO metadata and Pakistan city routing for public pages.',
          ],
        },
        {
          heading: 'Authentication & versioning',
          items: [
            'No API keys are required for documented public endpoints.',
            'Stable routes live under /api/public/v1/. Legacy unversioned paths remain as backward-compatible aliases with Deprecation headers.',
            'See #versioning below for the deprecation policy and Sunset date.',
            '/api/admin/* requires CMS login and is excluded from the public OpenAPI document.',
          ],
        },
        {
          heading: 'Rate limits',
          items: [
            'GET public JSON endpoints: 120 requests per IP per minute with RateLimit-* response headers.',
            'POST /api/public/v1/leads: 12 submissions per IP per 10 minutes (HTTP 429 with Retry-After when exceeded).',
            'Default limits use an in-memory store per server process — configure REDIS_URL for shared limits in multi-instance production.',
          ],
        },
        {
          heading: 'Key v1 endpoints',
          items: [
            'GET /api/public/v1/health',
            'GET /api/public/v1/site-settings',
            'GET /api/public/v1/homepage?country=AE&lang=en',
            'GET /api/public/v1/locale-content/erp',
            'GET /api/public/v1/blog/posts',
            'GET /api/public/v1/testimonials',
            'POST /api/public/v1/leads',
          ],
        },
        {
          heading: 'Available integrations',
          items: [
            'OpenAPI 3.1 at /openapi.json',
            'Agent instructions at /llms.txt',
            'Local CLI: node tools/dm-public-cli/bin/dm-public.mjs',
            'No hosted MCP server, webhooks product, or npm SDK at this time.',
          ],
        },
        {
          heading: 'Pricing',
          items: ['No dedicated pricing API. Published pricing CMS pages use GET /api/public/v1/pages/{slug}.'],
        },
      ]
    : [
        {
          heading: 'متى تستخدم الواجهة',
          items: ['محتوى تسويقي منشور، مدونة، شهادات، وPOST /api/public/v1/leads للتواصل.'],
        },
        {
          heading: 'المصادقة',
          items: ['لا مفاتيح API للنقاط العامة. /api/admin/* خاص.'],
        },
      ]

  const curlHealth = `curl -sS "${BASE}/api/public/v1/health"`
  const curlErp = `curl -sS "${BASE}/api/public/v1/locale-content/erp?country=AE&lang=en"`
  const jsExample = `const res = await fetch('/api/public/v1/testimonials?country=AE&lang=en');
const data = await res.json();`

  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50/50">
        <div className={`${pageShellClass} ${sectionPad}`}>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">{TITLE}</h1>
          <p className="mt-4 max-w-3xl text-base leading-[1.65] text-slate-600">{intro}</p>
        </div>
      </section>

      <section className={`${pageShellClass} ${sectionPad}`}>
        <div className="max-w-3xl space-y-10">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 className="font-heading text-lg font-bold text-slate-900">{section.heading}</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-[1.65] text-slate-600">
                {section.items.map((item) => (
                  <li key={item.slice(0, 40)}>{item}</li>
                ))}
              </ul>
            </div>
          ))}

          <div id="versioning">
            <h2 className="font-heading text-lg font-bold text-slate-900">{en ? 'Versioning policy' : 'سياسة الإصدارات'}</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-base leading-[1.65] text-slate-600">
              {(en
                ? [
                    'Stable public JSON routes live under /api/public/v1/.',
                    'Legacy unversioned paths remain available as aliases until the published Sunset date.',
                    'Deprecated aliases respond with Deprecation, Sunset, and Link headers.',
                    'Breaking changes ship only under a new major prefix (for example /api/public/v2/).',
                  ]
                : ['المسارات المستقرة تحت /api/public/v1/.']
              ).map((item) => (
                <li key={item.slice(0, 40)}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="font-heading text-lg font-bold text-slate-900">{en ? 'Examples' : 'أمثلة'}</h2>
            <p className="mt-2 text-sm font-medium text-slate-700">curl — health</p>
            <pre className="mt-1 overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-100">{curlHealth}</pre>
            <p className="mt-4 text-sm font-medium text-slate-700">curl — ERP content</p>
            <pre className="mt-1 overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-100">{curlErp}</pre>
            <p className="mt-4 text-sm font-medium text-slate-700">JavaScript — testimonials</p>
            <pre className="mt-1 overflow-x-auto rounded-lg bg-slate-900 p-4 text-sm text-slate-100">{jsExample}</pre>
          </div>

          <div>
            <h2 className="font-heading text-lg font-bold text-slate-900">{en ? 'Resources' : 'مصادر'}</h2>
            <ul className="mt-3 space-y-2 text-base">
              <li>
                <a href="/openapi.json" className="font-semibold text-brand hover:text-brand-dark">
                  OpenAPI 3.1 — /openapi.json
                </a>
              </li>
              <li>
                <a href="/llms.txt" className="font-semibold text-brand hover:text-brand-dark">
                  llms.txt — agent instructions
                </a>
              </li>
              <li>
                <Link to="/contact" className="font-semibold text-brand hover:text-brand-dark">
                  {en ? 'Contact / demo' : 'التواصل'}
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  )
}
