/**
 * OpenAPI 3.1 document for intentionally public read-only content endpoints and lead submission.
 * Admin/CMS/auth/leads listing routes are excluded.
 */
import { PUBLIC_SITE_BASE } from './seoResolve.mjs'
import {
  PUBLIC_API_ERROR,
  HEALTH_RESPONSE,
  LEAD_REQUEST,
  LEAD_RESPONSE,
  SEO_PAGE_RESPONSE,
  LOCALE_CONTENT_RESPONSE,
  LOCALE_CONTENT_NOT_FOUND,
  PAGINATION,
  BILINGUAL_STRING,
  jsonResponse,
  errorResponse,
  queryCountry,
  queryLang,
} from './agenticOpenApiSchemas.mjs'

const registrySlugs = ['erp', 'solutions', 'business-models', 'faqs', 'contact', 'industries']

function getOp(description, operationId, tag, extra = {}) {
  return {
    summary: extra.summary || description,
    description,
    operationId,
    tags: [tag],
    ...extra,
  }
}

export function buildPublicOpenApiSpec() {
  const jsonOk = (desc, schema, example) => ({ 200: jsonResponse(desc, schema, example) })
  const jsonErr = (codes) =>
    Object.fromEntries(codes.map(([status, desc, example]) => [status, errorResponse(desc, example)]))

  return {
    openapi: '3.1.0',
    info: {
      title: 'DigitalManager Public Content API',
      version: '1.1.0',
      description: [
        'Read-only published marketing content, localized GCC pages, blog/testimonials, SEO metadata, and public demo/contact submission.',
        '',
        '**Not included:** admin CMS mutations, authentication, lead/customer/financial records, ERP tenant data, API keys, or MCP integrations.',
        '',
        'Human overview: [/developers](/developers). Machine-readable agent guide: [/llms.txt](/llms.txt).',
        '',
        'Pricing is not exposed as a dedicated pricing API. If a pricing CMS page is published, use `GET /api/public/pages/{slug}`.',
      ].join('\n'),
      contact: {
        name: 'DigitalManager',
        url: `${PUBLIC_SITE_BASE}/contact`,
        email: 'info@digitalmanager.ae',
      },
    },
    servers: [{ url: PUBLIC_SITE_BASE, description: 'Production website origin' }],
    tags: [
      { name: 'health', description: 'Service availability' },
      { name: 'company', description: 'Company and site settings' },
      { name: 'homepage', description: 'Homepage CMS bundles' },
      { name: 'solutions', description: 'ERP modules, industries, business models, FAQs via locale content' },
      { name: 'blog', description: 'Published blog posts and categories' },
      { name: 'testimonials', description: 'Published customer testimonials' },
      { name: 'locale', description: 'GCC localized public content resolution' },
      { name: 'seo', description: 'SEO metadata and discovery files' },
      { name: 'forms', description: 'Public contact and demo submission' },
    ],
    components: {
      schemas: {
        PublicApiError: PUBLIC_API_ERROR,
        HealthResponse: HEALTH_RESPONSE,
        LeadRequest: LEAD_REQUEST,
        LeadResponse: LEAD_RESPONSE,
        SeoPageResponse: SEO_PAGE_RESPONSE,
        LocaleContentResponse: LOCALE_CONTENT_RESPONSE,
        Pagination: PAGINATION,
        BilingualString: BILINGUAL_STRING,
      },
      parameters: {
        QueryCountry: queryCountry,
        QueryLang: queryLang,
      },
    },
    paths: {
      '/api/health': {
        get: {
          ...getOp('Returns API process health for uptime checks.', 'getHealth', 'health'),
          responses: {
            ...jsonOk('Service is running.', { $ref: '#/components/schemas/HealthResponse' }),
            ...jsonErr([[503, 'Storage or dependencies unavailable.']]),
          },
        },
      },
      '/api/site-settings': {
        get: {
          ...getOp(
            'Published company/site settings: header, SEO defaults, footer, and contact details.',
            'getSiteSettings',
            'company',
          ),
          responses: {
            ...jsonOk('Site settings bundle.', {
              type: 'object',
              properties: {
                header: { type: 'object' },
                seo: { type: 'object' },
                footer: { type: 'object' },
                siteSettings: {
                  type: 'object',
                  properties: {
                    primaryEmail: { type: 'string', example: 'info@digitalmanager.ae' },
                    phoneDisplay: { type: 'string', example: '+971 4 123 4567' },
                    officeAddress: { $ref: '#/components/schemas/BilingualString' },
                  },
                },
              },
            }),
            ...jsonErr([[500, 'Unexpected server error.'], [503, 'Published content temporarily unavailable.']]),
          },
        },
      },
      '/api/public/countries': {
        get: {
          ...getOp('Published GCC country list for locale selectors.', 'listCountries', 'locale', {
            parameters: [queryLang],
          }),
          responses: {
            ...jsonOk('Enabled countries.', {
              type: 'object',
              properties: { items: { type: 'array', items: { type: 'object' } } },
            }),
            ...jsonErr([[500, 'Unexpected server error.']]),
          },
        },
      },
      '/api/homepage': {
        get: {
          ...getOp(
            'Locale-aware homepage CMS bundle (hero, modules, industries, stats, navigation).',
            'getHomepageBundle',
            'homepage',
            { parameters: [queryCountry, queryLang] },
          ),
          responses: {
            ...jsonOk('Homepage payload.', { type: 'object', additionalProperties: true }),
            ...jsonErr([[503, 'Published content temporarily unavailable.'], [500, 'Unexpected server error.']]),
          },
        },
      },
      '/api/public/homepage': {
        get: {
          ...getOp('Alias of homepage bundle for UAE English legacy clients.', 'getPublicHomepage', 'homepage'),
          responses: {
            ...jsonOk('Homepage payload.', { type: 'object', additionalProperties: true }),
            ...jsonErr([[500, 'Unexpected server error.']]),
          },
        },
      },
      '/api/public/site': {
        get: {
          ...getOp('Full published site bundle (same shape as homepage).', 'getPublicSite', 'homepage'),
          responses: {
            ...jsonOk('Site bundle.', { type: 'object', additionalProperties: true }),
            ...jsonErr([[500, 'Unexpected server error.']]),
          },
        },
      },
      '/api/public/navigation': {
        get: {
          ...getOp('Published header/footer navigation links.', 'getNavigation', 'homepage'),
          responses: {
            ...jsonOk('Navigation payload.', {
              type: 'object',
              properties: {
                headerLinks: { type: 'array', items: { type: 'object' } },
                footerColumns: { type: 'object' },
                pages: { type: 'array', items: { type: 'object' } },
              },
            }),
            ...jsonErr([[500, 'Unexpected server error.']]),
          },
        },
      },
      '/api/public/pages': {
        get: {
          ...getOp('List published CMS marketing pages (excludes admin routes).', 'listPublicPages', 'company'),
          responses: {
            ...jsonOk('Published pages.', {
              type: 'object',
              properties: { items: { type: 'array', items: { type: 'object' } } },
            }),
            ...jsonErr([[500, 'Unexpected server error.']]),
          },
        },
      },
      '/api/public/pages/{slug}': {
        get: {
          ...getOp(
            'Fetch one published CMS page by slug. Use for optional pricing or custom marketing pages when published.',
            'getPublicPageBySlug',
            'company',
            {
              parameters: [
                {
                  name: 'slug',
                  in: 'path',
                  required: true,
                  schema: { type: 'string', example: 'pricing' },
                  description: 'Published CMS page slug.',
                },
              ],
            },
          ),
          responses: {
            ...jsonOk('Page payload.', {
              type: 'object',
              properties: { page: { type: 'object', additionalProperties: true } },
            }),
            ...jsonErr([[404, 'Page slug not found or not published.'], [500, 'Unexpected server error.']]),
          },
        },
      },
      '/api/public/locale-content/{slug}': {
        get: {
          ...getOp(
            `Localized registry page content. Supported slugs include: ${registrySlugs.join(', ')}.`,
            'getLocaleContentBySlug',
            'solutions',
            {
              parameters: [
                {
                  name: 'slug',
                  in: 'path',
                  required: true,
                  schema: { type: 'string', enum: registrySlugs, example: 'erp' },
                },
                queryCountry,
                queryLang,
              ],
            },
          ),
          responses: {
            ...jsonOk('Localized page view.', { $ref: '#/components/schemas/LocaleContentResponse' }),
            404: jsonResponse('Not published for locale or missing translation.', LOCALE_CONTENT_NOT_FOUND),
            ...jsonErr([[500, 'Unexpected server error.']]),
          },
        },
      },
      '/api/public/locale-content/software/{kind}/{slug}': {
        get: {
          ...getOp('Localized ERP module or industry software detail page.', 'getLocaleSoftwareContent', 'solutions', {
            parameters: [
              {
                name: 'kind',
                in: 'path',
                required: true,
                schema: { type: 'string', enum: ['module', 'industry'], example: 'module' },
              },
              {
                name: 'slug',
                in: 'path',
                required: true,
                schema: { type: 'string', example: 'inventory-management-software' },
              },
              queryCountry,
              queryLang,
            ],
          }),
          responses: {
            ...jsonOk('Software detail page.', { $ref: '#/components/schemas/LocaleContentResponse' }),
            ...jsonErr([
              [400, 'Invalid kind or slug.'],
              [404, 'Software page not published for locale.'],
              [500, 'Unexpected server error.'],
            ]),
          },
        },
      },
      '/api/software-detail/{kind}/{slug}': {
        get: {
          ...getOp(
            'UAE English software detail JSON used by the marketing site (legacy public read endpoint).',
            'getSoftwareDetail',
            'solutions',
            {
              parameters: [
                { name: 'kind', in: 'path', required: true, schema: { type: 'string', enum: ['module', 'industry'] } },
                { name: 'slug', in: 'path', required: true, schema: { type: 'string' } },
              ],
            },
          ),
          responses: {
            ...jsonOk('Software detail document.', { type: 'object', additionalProperties: true }),
            ...jsonErr([[404, 'Software detail not found.'], [500, 'Unexpected server error.']]),
          },
        },
      },
      '/api/public/testimonials': {
        get: {
          ...getOp('Published testimonials section and items.', 'listTestimonials', 'testimonials', {
            parameters: [queryCountry, queryLang],
          }),
          responses: {
            ...jsonOk('Testimonials payload.', { type: 'object', additionalProperties: true }),
            ...jsonErr([[500, 'Unexpected server error.']]),
          },
        },
      },
      '/api/public/blog/categories': {
        get: {
          ...getOp('Published blog categories.', 'listBlogCategories', 'blog', { parameters: [queryLang] }),
          responses: {
            ...jsonOk('Categories.', {
              type: 'object',
              properties: { items: { type: 'array', items: { type: 'object' } } },
            }),
            ...jsonErr([[500, 'Unexpected server error.']]),
          },
        },
      },
      '/api/public/blog/posts': {
        get: {
          ...getOp('Paginated published blog posts with optional search and category filter.', 'listBlogPosts', 'blog', {
            parameters: [
              queryCountry,
              queryLang,
              { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Category slug or id.' },
              { name: 'search', in: 'query', schema: { type: 'string' }, description: 'Case-insensitive title/excerpt search.' },
              { name: 'page', in: 'query', schema: { type: 'integer', minimum: 1, default: 1 } },
              { name: 'pageSize', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 24, default: 9 } },
            ],
          }),
          responses: {
            ...jsonOk('Blog listing.', {
              type: 'object',
              properties: {
                items: { type: 'array', items: { type: 'object' } },
                pagination: { $ref: '#/components/schemas/Pagination' },
                section: { type: 'object' },
              },
            }),
            ...jsonErr([[500, 'Unexpected server error.']]),
          },
        },
      },
      '/api/public/blog/posts/{slug}': {
        get: {
          ...getOp('One published blog post with related posts.', 'getBlogPostBySlug', 'blog', {
            parameters: [
              { name: 'slug', in: 'path', required: true, schema: { type: 'string', example: 'retail-pos-uae' } },
              queryCountry,
              queryLang,
            ],
          }),
          responses: {
            ...jsonOk('Blog post detail.', {
              type: 'object',
              properties: {
                post: { type: 'object' },
                related: { type: 'array', items: { type: 'object' } },
                prev: { type: 'object', nullable: true },
                next: { type: 'object', nullable: true },
              },
            }),
            ...jsonErr([[404, 'Blog post not found.'], [500, 'Unexpected server error.']]),
          },
        },
      },
      '/api/public/blog/homepage': {
        get: {
          ...getOp('Homepage blog preview (featured + items).', 'getBlogHomepagePreview', 'blog', {
            parameters: [
              queryCountry,
              queryLang,
              { name: 'limit', in: 'query', schema: { type: 'integer', minimum: 1, maximum: 6, default: 3 } },
            ],
          }),
          responses: {
            ...jsonOk('Homepage blog section.', { type: 'object', additionalProperties: true }),
            ...jsonErr([[500, 'Unexpected server error.']]),
          },
        },
      },
      '/api/public/locale-hint': {
        get: {
          ...getOp(
            'Non-precise country hint from trusted proxy headers (never stores IP). Used for UX only.',
            'getLocaleHint',
            'locale',
          ),
          responses: {
            ...jsonOk('Country hint.', {
              type: 'object',
              properties: {
                countryCode: { type: 'string', example: 'AE' },
                source: { type: 'string', enum: ['header', 'fallback'], example: 'header' },
              },
            }),
          },
        },
      },
      '/api/public/locale-routing': {
        get: {
          ...getOp(
            'Public locale routing decision for `/` (same logic as geo redirect; informational).',
            'getLocaleRouting',
            'locale',
          ),
          responses: {
            ...jsonOk('Routing decision.', {
              type: 'object',
              properties: {
                redirect: { type: 'string', nullable: true, example: '/qa/en' },
                country: { type: 'string', example: 'qa' },
                lang: { type: 'string', example: 'en' },
              },
            }),
          },
        },
      },
      '/api/public/seo-page': {
        get: {
          ...getOp('Resolve canonical, robots, hreflang, and title for a public path.', 'getSeoPage', 'seo', {
            parameters: [
              {
                name: 'path',
                in: 'query',
                required: true,
                schema: { type: 'string', example: '/erp' },
                description: 'Public site path including locale prefix when applicable.',
              },
            ],
          }),
          responses: {
            ...jsonOk('SEO metadata.', { $ref: '#/components/schemas/SeoPageResponse' }),
            ...jsonErr([[503, 'SEO resolver unavailable.'], [500, 'Unexpected server error.']]),
          },
        },
      },
      '/api/leads': {
        post: {
          ...getOp(
            'Submit a contact, demo, or pricing enquiry. Rate limited per IP. Does not return stored lead records.',
            'submitLead',
            'forms',
            {
              requestBody: {
                required: true,
                content: { 'application/json': { schema: { $ref: '#/components/schemas/LeadRequest' } } },
              },
            },
          ),
          responses: {
            201: jsonResponse('Lead accepted.', { $ref: '#/components/schemas/LeadResponse' }),
            ...jsonErr([
              [400, 'Validation failed (email, phone, or required demo fields).'],
              [409, 'Duplicate demo submission within cooldown window.'],
              [429, 'Too many submissions from this IP.'],
              [503, 'Storage temporarily unavailable.'],
              [500, 'Unexpected server error.'],
            ]),
          },
        },
      },
      '/sitemap.xml': {
        get: {
          ...getOp('XML sitemap of indexable public marketing URLs.', 'getSitemapXml', 'seo'),
          responses: {
            200: { description: 'Sitemap XML', content: { 'application/xml': { schema: { type: 'string' } } } },
          },
        },
      },
      '/robots.txt': {
        get: {
          ...getOp('Robots directives; disallows /admin and /api/.', 'getRobotsTxt', 'seo'),
          responses: {
            200: { description: 'Robots file', content: { 'text/plain': { schema: { type: 'string' } } } },
          },
        },
      },
      '/llms.txt': {
        get: {
          ...getOp('Agent instructions for safe public site usage.', 'getLlmsTxt', 'seo'),
          responses: {
            200: { description: 'llms.txt', content: { 'text/plain': { schema: { type: 'string' } } } },
          },
        },
      },
      '/llms-full.txt': {
        get: {
          ...getOp('Extended llms.txt with full module URL list.', 'getLlmsFullTxt', 'seo'),
          responses: {
            200: { description: 'llms-full.txt', content: { 'text/plain': { schema: { type: 'string' } } } },
          },
        },
      },
      '/openapi.json': {
        get: {
          ...getOp('This OpenAPI 3.1 specification.', 'getOpenApiSpec', 'seo'),
          responses: {
            200: jsonResponse('OpenAPI document.', { type: 'object', additionalProperties: true }),
          },
        },
      },
    },
  }
}
