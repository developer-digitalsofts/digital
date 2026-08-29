/**
 * OpenAPI 3.1 document for intentionally public read-only content endpoints and lead submission.
 * Admin/CMS/auth/leads listing routes are excluded.
 */
import { PUBLIC_SITE_BASE } from './seoResolve.mjs'
import { isPakistanMarket, PK_OFFICIAL_CONTACT } from './pakistanConfig.mjs'
import { PUBLIC_API_VERSION_POLICY, PUBLIC_API_V1_SUNSET, openApiV1Path } from './publicApiVersioning.mjs'
import {
  PUBLIC_GET_RATE_LIMIT_MAX,
  PUBLIC_GET_RATE_LIMIT_WINDOW_MS,
  LEAD_RATE_LIMIT_MAX,
  LEAD_RATE_LIMIT_WINDOW_MS,
} from './publicApiRateLimit.mjs'
import {
  PUBLIC_API_ERROR,
  HEALTH_RESPONSE,
  LEAD_REQUEST,
  LEAD_RESPONSE,
  SEO_PAGE_RESPONSE,
  LOCALE_CONTENT_RESPONSE,
  LOCALE_CONTENT_NOT_FOUND,
  LOCALE_PAGE,
  LOCALE_META,
  PAGE_SEO,
  PAGE_SECTION,
  PAGINATION,
  BILINGUAL_STRING,
  SITE_SETTINGS_BUNDLE,
  HOMEPAGE_BUNDLE,
  NAVIGATION_RESPONSE,
  PUBLIC_PAGES_LIST,
  PUBLIC_PAGE_DETAIL,
  TESTIMONIALS_RESPONSE,
  BLOG_CATEGORY,
  BLOG_POSTS_LIST,
  BLOG_POST_DETAIL,
  BLOG_HOMEPAGE_PREVIEW,
  SOFTWARE_DETAIL,
  COUNTRIES_LIST,
  CITIES_LIST,
  LOCALE_HINT,
  LOCALE_ROUTING,
  OPENAPI_DOCUMENT,
  jsonResponse,
  errorResponse,
  queryCountry,
  queryLang,
} from './agenticOpenApiSchemas.mjs'

const registrySlugs = ['erp', 'solutions', 'business-models', 'faqs', 'contact', 'industries']

function jsonOkWithRateLimit(desc, schema, example) {
  return {
    200: {
      description: desc,
      headers: RATE_LIMIT_HEADERS,
      content: {
        'application/json': {
          schema,
          ...(example ? { example } : {}),
        },
      },
    },
  }
}

function getOp(description, operationId, tag, extra = {}) {
  return {
    summary: extra.summary || description.split('\n')[0],
    description,
    operationId,
    tags: [tag],
    ...extra,
  }
}

const RATE_LIMIT_HEADERS = {
  'RateLimit-Limit': { schema: { type: 'integer', example: PUBLIC_GET_RATE_LIMIT_MAX } },
  'RateLimit-Remaining': { schema: { type: 'integer', example: PUBLIC_GET_RATE_LIMIT_MAX - 1 } },
  'RateLimit-Reset': { schema: { type: 'integer', example: Math.floor(Date.now() / 1000) + 60 } },
}

function augmentPathsWithV1(paths) {
  const out = { ...paths }
  const apiPaths = Object.keys(paths).filter(
    (p) =>
      p.startsWith('/api/public/') ||
      p === '/api/health' ||
      p === '/api/site-settings' ||
      p === '/api/homepage' ||
      p === '/api/leads' ||
      p.startsWith('/api/page/') ||
      p.startsWith('/api/software-detail/'),
  )

  for (const legacyPath of apiPaths) {
    const v1 = openApiV1Path(legacyPath)
    if (!v1) continue
    const methods = paths[legacyPath]
    out[legacyPath] = {}
    for (const [method, op] of Object.entries(methods || {})) {
      out[legacyPath][method] = {
        ...op,
        deprecated: true,
        description: `${op.description}\n\n**Deprecated alias.** Prefer \`${v1}\`. Sunset: ${PUBLIC_API_V1_SUNSET}.`,
      }
      if (!out[v1]) out[v1] = {}
      out[v1][method] = {
        ...op,
        operationId: `${op.operationId}V1`,
        description: `${op.description}\n\nStable **v1** route under \`/api/public/v1/\`.`,
      }
    }
  }
  return out
}

export function buildPublicOpenApiSpec() {
  const jsonOk = (desc, schema, example) => ({ 200: jsonResponse(desc, schema, example) })
  const jsonErr = (codes) =>
    Object.fromEntries(codes.map(([status, desc, example]) => [status, errorResponse(desc, example)]))

  const jsonErrWithRateLimit = (codes) => ({
    ...jsonErr(codes),
    429: {
      description: 'Rate limit exceeded.',
      headers: {
        ...RATE_LIMIT_HEADERS,
        'Retry-After': { schema: { type: 'integer', example: 60 } },
      },
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/PublicApiError' },
          example: {
            error: {
              code: 'RATE_LIMITED',
              message: 'Too many public API requests. Please wait before retrying.',
              resolution: 'Wait and retry after Retry-After seconds.',
            },
          },
        },
      },
    },
  })

  return {
    openapi: '3.1.0',
    info: {
      title: 'DigitalManager Public Content API',
      version: '1.0.0',
      description: [
        'Read-only published marketing content, localized GCC pages, blog/testimonials, SEO metadata, and public demo/contact submission.',
        '',
        '**Stable routes:** `/api/public/v1/*` (documented below with `V1` operationIds).',
        '',
        PUBLIC_API_VERSION_POLICY,
        '',
        `GET rate limit: ${PUBLIC_GET_RATE_LIMIT_MAX} requests per IP per ${PUBLIC_GET_RATE_LIMIT_WINDOW_MS / 1000}s.`,
        `POST /api/public/v1/leads rate limit: ${LEAD_RATE_LIMIT_MAX} submissions per IP per ${LEAD_RATE_LIMIT_WINDOW_MS / 60000} minutes.`,
        '',
        '**Not included:** admin CMS mutations, authentication, lead/customer/financial records, ERP tenant data, API keys, MCP, or webhooks.',
        '',
        'Human overview: [/developers](/developers). Machine-readable agent guide: [/llms.txt](/llms.txt).',
        '',
        'Pricing is not exposed as a dedicated pricing API. If a pricing CMS page is published, use `GET /api/public/v1/pages/{slug}`.',
      ].join('\n'),
      contact: {
        name: 'DigitalManager',
        url: `${PUBLIC_SITE_BASE}/contact`,
        email: isPakistanMarket() ? PK_OFFICIAL_CONTACT.emails.primary : 'info@digitalmanager.ae',
      },
    },
    servers: [{ url: PUBLIC_SITE_BASE, description: 'Production website origin (canonical)' }],
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
        LocalePage: LOCALE_PAGE,
        LocaleMeta: LOCALE_META,
        PageSeo: PAGE_SEO,
        PageSection: PAGE_SECTION,
        Pagination: PAGINATION,
        BilingualString: BILINGUAL_STRING,
        SiteSettingsBundle: SITE_SETTINGS_BUNDLE,
        HomepageBundle: HOMEPAGE_BUNDLE,
        NavigationResponse: NAVIGATION_RESPONSE,
        PublicPagesList: PUBLIC_PAGES_LIST,
        PublicPageDetail: PUBLIC_PAGE_DETAIL,
        TestimonialsResponse: TESTIMONIALS_RESPONSE,
        BlogCategory: BLOG_CATEGORY,
        BlogPostsList: BLOG_POSTS_LIST,
        BlogPostDetail: BLOG_POST_DETAIL,
        BlogHomepagePreview: BLOG_HOMEPAGE_PREVIEW,
        SoftwareDetail: SOFTWARE_DETAIL,
        CountriesList: COUNTRIES_LIST,
        CitiesList: CITIES_LIST,
        LocaleHint: LOCALE_HINT,
        LocaleRouting: LOCALE_ROUTING,
        OpenApiDocument: OPENAPI_DOCUMENT,
      },
      parameters: {
        QueryCountry: queryCountry,
        QueryLang: queryLang,
      },
    },
    paths: augmentPathsWithV1({
      '/api/health': {
        get: {
          ...getOp('Returns API process health for uptime checks.', 'getHealth', 'health'),
          responses: {
            ...jsonOkWithRateLimit('Service is running.', { $ref: '#/components/schemas/HealthResponse' }),
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
            ...jsonOkWithRateLimit('Site settings bundle.', { $ref: '#/components/schemas/SiteSettingsBundle' }),
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
            ...jsonOk('Enabled countries.', { $ref: '#/components/schemas/CountriesList' }),
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
            ...jsonOkWithRateLimit('Homepage payload.', { $ref: '#/components/schemas/HomepageBundle' }),
            ...jsonErr([[503, 'Published content temporarily unavailable.'], [500, 'Unexpected server error.']]),
          },
        },
      },
      '/api/public/homepage': {
        get: {
          ...getOp('Alias of homepage bundle for UAE English legacy clients.', 'getPublicHomepage', 'homepage'),
          responses: {
            ...jsonOk('Homepage payload.', { $ref: '#/components/schemas/HomepageBundle' }),
            ...jsonErr([[500, 'Unexpected server error.']]),
          },
        },
      },
      '/api/public/site': {
        get: {
          ...getOp('Full published site bundle (same shape as homepage).', 'getPublicSite', 'homepage'),
          responses: {
            ...jsonOk('Site bundle.', { $ref: '#/components/schemas/HomepageBundle' }),
            ...jsonErr([[500, 'Unexpected server error.']]),
          },
        },
      },
      '/api/public/navigation': {
        get: {
          ...getOp('Published header/footer navigation links.', 'getNavigation', 'homepage'),
          responses: {
            ...jsonOk('Navigation payload.', { $ref: '#/components/schemas/NavigationResponse' }),
            ...jsonErr([[500, 'Unexpected server error.']]),
          },
        },
      },
      '/api/public/pages': {
        get: {
          ...getOp('List published CMS marketing pages (excludes admin routes).', 'listPublicPages', 'company'),
          responses: {
            ...jsonOk('Published pages.', { $ref: '#/components/schemas/PublicPagesList' }),
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
            ...jsonOk('Page payload.', { $ref: '#/components/schemas/PublicPageDetail' }),
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
            ...jsonOk('Software detail document.', { $ref: '#/components/schemas/SoftwareDetail' }),
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
            ...jsonOkWithRateLimit('Testimonials payload.', { $ref: '#/components/schemas/TestimonialsResponse' }),
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
              required: ['items'],
              properties: { items: { type: 'array', items: { $ref: '#/components/schemas/BlogCategory' } } },
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
            ...jsonOk('Blog listing.', { $ref: '#/components/schemas/BlogPostsList' }),
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
            ...jsonOk('Blog post detail.', { $ref: '#/components/schemas/BlogPostDetail' }),
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
            ...jsonOk('Homepage blog section.', { $ref: '#/components/schemas/BlogHomepagePreview' }),
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
            ...jsonOk('Country hint.', { $ref: '#/components/schemas/LocaleHint' }),
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
            ...jsonOk('Routing decision.', { $ref: '#/components/schemas/LocaleRouting' }),
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
            ...jsonErrWithRateLimit([[503, 'SEO resolver unavailable.'], [500, 'Unexpected server error.']]),
          },
        },
      },
      '/api/public/cities': {
        get: {
          ...getOp('Published city registry for UAE and GCC locale pages.', 'listCities', 'locale', {
            parameters: [queryCountry, queryLang],
          }),
          responses: {
            ...jsonOkWithRateLimit('City list.', { $ref: '#/components/schemas/CitiesList' }),
            ...jsonErrWithRateLimit([[500, 'Unexpected server error.']]),
          },
        },
      },
      '/api/public/locale-content/city/{citySlug}/{pageSlug}': {
        get: {
          ...getOp('Published city landing page content.', 'getCityLocaleContent', 'locale', {
            parameters: [
              { name: 'citySlug', in: 'path', required: true, schema: { type: 'string', example: 'dubai' } },
              { name: 'pageSlug', in: 'path', required: true, schema: { type: 'string', example: 'erp-software' } },
              queryCountry,
              queryLang,
            ],
          }),
          responses: {
            ...jsonOk('City page content.', { $ref: '#/components/schemas/LocaleContentResponse' }),
            ...jsonErrWithRateLimit([[404, 'City page not found.'], [500, 'Unexpected server error.']]),
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
              [503, 'Storage temporarily unavailable.'],
              [500, 'Unexpected server error.'],
            ]),
            429: {
              description: `Too many submissions (${LEAD_RATE_LIMIT_MAX} per ${LEAD_RATE_LIMIT_WINDOW_MS / 60000} minutes per IP).`,
              headers: {
                ...RATE_LIMIT_HEADERS,
                'Retry-After': { schema: { type: 'integer', example: 120 } },
              },
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/PublicApiError' },
                },
              },
            },
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
            200: jsonResponse('OpenAPI document.', { $ref: '#/components/schemas/OpenApiDocument' }),
          },
        },
      },
    }),
  }
}
