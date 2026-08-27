/**
 * Shared OpenAPI 3.1 component schemas for the public content API surface.
 */

export const PUBLIC_API_ERROR = {
  type: 'object',
  required: ['error'],
  properties: {
    error: {
      type: 'object',
      required: ['code', 'message', 'resolution'],
      properties: {
        code: {
          type: 'string',
          enum: [
            'RESOURCE_NOT_FOUND',
            'VALIDATION_ERROR',
            'RATE_LIMITED',
            'CONFLICT',
            'SERVICE_UNAVAILABLE',
            'INTERNAL_ERROR',
          ],
        },
        message: { type: 'string' },
        resolution: { type: 'string' },
      },
    },
  },
  example: {
    error: {
      code: 'RESOURCE_NOT_FOUND',
      message: 'The requested resource was not found.',
      resolution: 'Check the request path or consult /developers and /openapi.json.',
    },
  },
}

export const BILINGUAL_STRING = {
  type: 'object',
  properties: {
    en: { type: 'string' },
    ar: { type: 'string' },
  },
  additionalProperties: true,
}

export const PAGINATION = {
  type: 'object',
  properties: {
    page: { type: 'integer', minimum: 1, example: 1 },
    pageSize: { type: 'integer', minimum: 1, maximum: 24, example: 9 },
    total: { type: 'integer', minimum: 0, example: 42 },
    totalPages: { type: 'integer', minimum: 1, example: 5 },
  },
}

export const HEALTH_RESPONSE = {
  type: 'object',
  required: ['ok'],
  properties: {
    ok: { type: 'boolean', example: true },
    bootstrapReady: { type: 'boolean', example: true },
    bootstrapError: { type: 'string', nullable: true },
    dataDirReadable: { type: 'boolean', example: true },
    dataDirCheckMs: { type: 'integer', example: 12 },
    distAssets: { type: 'integer', example: 42 },
    serveStatic: { type: 'boolean', example: true },
    uptimeSec: { type: 'integer', example: 3600 },
    time: { type: 'string', format: 'date-time' },
    cache: { type: 'object', properties: { hits: { type: 'integer' }, misses: { type: 'integer' } } },
    env: { type: 'object', properties: { nodeEnv: { type: 'string' }, port: { type: 'integer' } } },
    service: { type: 'string', example: 'digitalmanager-cms-api' },
    timestamp: { type: 'string', format: 'date-time' },
  },
  example: { ok: true, bootstrapReady: true, dataDirReadable: true, serveStatic: true, uptimeSec: 3600, time: '2026-08-24T12:00:00.000Z' },
}

export const LEAD_REQUEST = {
  type: 'object',
  required: ['email'],
  properties: {
    name: { type: 'string', example: 'Aisha Khan' },
    email: { type: 'string', format: 'email', example: 'aisha@example.com' },
    phone: { type: 'string', example: '+971501234567' },
    company: { type: 'string', example: 'Example Trading LLC' },
    topic: { type: 'string', enum: ['demo', 'pricing', 'support', 'other'], example: 'demo' },
    message: { type: 'string', example: 'We need ERP for 3 retail branches.' },
    sourcePage: { type: 'string', example: '/contact' },
    source: { type: 'string', example: 'Contact Page' },
    productService: { type: 'string', example: 'Inventory Management' },
    countryCode: { type: 'string', example: 'AE' },
    localeCountry: { type: 'string', example: 'ae' },
    localeLang: { type: 'string', enum: ['en', 'ar'], example: 'en' },
  },
}

export const LEAD_RESPONSE = {
  type: 'object',
  properties: {
    ok: { type: 'boolean', example: true },
    id: { type: 'string', example: 'abc123xyz456' },
  },
  example: { ok: true, id: 'abc123xyz456' },
}

export const SEO_PAGE_RESPONSE = {
  type: 'object',
  properties: {
    path: { type: 'string', example: '/erp' },
    canonical: { type: 'string', format: 'uri', example: 'https://digitalmanager.ae/erp' },
    noIndex: { type: 'boolean', example: false },
    robots: { type: 'string', example: 'index, follow' },
    lang: { type: 'string', enum: ['en', 'ar'], example: 'en' },
    dir: { type: 'string', enum: ['ltr', 'rtl'], example: 'ltr' },
    title: { type: 'string' },
    description: { type: 'string' },
    alternates: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          hreflang: { type: 'string' },
          href: { type: 'string', format: 'uri' },
        },
      },
    },
  },
}

export const PAGE_SECTION = {
  type: 'object',
  required: ['id', 'type'],
  properties: {
    id: { type: 'string' },
    type: { type: 'string', enum: ['richText', 'faq', 'cta', 'featureGrid', 'bulletList', 'image', 'stats'] },
    visible: { type: 'boolean', default: true },
    heading: { type: 'string' },
    body: { type: 'string' },
    items: { type: 'array', items: { type: 'object', properties: { question: { type: 'string' }, answer: { type: 'string' } } } },
  },
}

export const LOCALE_PAGE = {
  type: 'object',
  required: ['id', 'slug', 'title', 'heading'],
  properties: {
    id: { type: 'string' },
    slug: { type: 'string' },
    contentType: { type: 'string', example: 'cityPage' },
    globalIdentity: { type: 'string' },
    template: { type: 'string', example: 'cms-page' },
    title: { type: 'string' },
    heading: { type: 'string' },
    shortDescription: { type: 'string' },
    sections: { type: 'array', items: PAGE_SECTION },
    seo: { $ref: '#/components/schemas/PageSeo' },
    sortOrder: { type: 'integer' },
    citySlug: { type: 'string', nullable: true },
    _locale: { $ref: '#/components/schemas/LocaleMeta' },
  },
}

export const LOCALE_META = {
  type: 'object',
  properties: {
    resolvedFrom: { type: 'string', enum: ['global', 'country_default', 'locale_override', 'city_override'] },
    inherited: { type: 'boolean' },
    fallbackUsed: { type: 'boolean' },
    cityFallback: { type: 'boolean' },
    missing: { type: 'boolean' },
    requestedCity: { type: 'string' },
  },
}

export const PAGE_SEO = {
  type: 'object',
  properties: {
    title: { $ref: '#/components/schemas/BilingualString' },
    description: { $ref: '#/components/schemas/BilingualString' },
    keywords: { $ref: '#/components/schemas/BilingualString' },
    noIndex: { type: 'boolean' },
    robotsIndex: { type: 'string', enum: ['index', 'noindex'] },
    robotsFollow: { type: 'string', enum: ['follow', 'nofollow'] },
    canonicalUrl: { type: 'string', format: 'uri' },
  },
}

export const LOCALE_CONTENT_RESPONSE = {
  type: 'object',
  required: ['page'],
  properties: {
    page: { $ref: '#/components/schemas/LocalePage' },
    meta: { $ref: '#/components/schemas/LocaleMeta' },
  },
}

export const LOCALE_CONTENT_NOT_FOUND = {
  allOf: [
    PUBLIC_API_ERROR,
    {
      type: 'object',
      properties: {
        slug: { type: 'string' },
        countryCode: { type: 'string', example: 'QA' },
        lang: { type: 'string', example: 'en' },
        meta: { $ref: '#/components/schemas/LocaleMeta' },
        fallback: {
          type: 'object',
          required: ['countryCode', 'lang', 'href'],
          properties: {
            countryCode: { type: 'string' },
            lang: { type: 'string', enum: ['en', 'ar'] },
            href: { type: 'string', format: 'uri' },
          },
        },
      },
    },
  ],
}

export const NAV_LINK = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    label: { type: 'string' },
    href: { type: 'string' },
    active: { type: 'boolean' },
    sortOrder: { type: 'integer' },
  },
}

export const SITE_SETTINGS_BUNDLE = {
  type: 'object',
  properties: {
    header: { type: 'object', properties: { navLinks: { type: 'array', items: NAV_LINK }, logoUrl: { type: 'string' } } },
    seo: { type: 'object', properties: { pageTitle: BILINGUAL_STRING, metaDescription: BILINGUAL_STRING } },
    footer: { type: 'object', properties: { columns: { type: 'array', items: { type: 'object', properties: { title: { type: 'string' } } } } } },
    siteSettings: {
      type: 'object',
      properties: {
        primaryEmail: { type: 'string', example: 'info@digitalmanager.ae' },
        phoneDisplay: { type: 'string', example: '+971 4 123 4567' },
        officeAddress: { $ref: '#/components/schemas/BilingualString' },
        logoUrl: { type: 'string' },
        facebookUrl: { type: 'string', format: 'uri' },
        linkedinUrl: { type: 'string', format: 'uri' },
      },
    },
  },
}

const CMS_OBJECT = { type: 'object', properties: { id: { type: 'string' }, title: { type: 'string' }, active: { type: 'boolean' } } }

export const HOMEPAGE_BUNDLE = {
  type: 'object',
  properties: {
    hero: { type: 'object', properties: { title: BILINGUAL_STRING, sub: BILINGUAL_STRING, body: BILINGUAL_STRING } },
    stats: {
      type: 'object',
      properties: {
        title: BILINGUAL_STRING,
        items: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, value: { type: 'string' }, label: BILINGUAL_STRING } } },
      },
    },
    modules: {
      type: 'object',
      properties: {
        title: BILINGUAL_STRING,
        items: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, title: BILINGUAL_STRING, description: BILINGUAL_STRING } } },
      },
    },
    industries: {
      type: 'object',
      properties: {
        title: BILINGUAL_STRING,
        items: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, title: BILINGUAL_STRING, name: BILINGUAL_STRING } } },
      },
    },
    about: { type: 'object', properties: { title: BILINGUAL_STRING, paragraphs: { type: 'array', items: BILINGUAL_STRING } } },
    navigation: {
      type: 'object',
      properties: {
        headerLinks: { type: 'array', items: NAV_LINK },
        footerColumns: { type: 'object', properties: { links: { type: 'array', items: NAV_LINK } } },
        pages: { type: 'array', items: CMS_OBJECT },
      },
    },
    testimonials: {
      type: 'object',
      properties: {
        section: { type: 'object', properties: { enabled: { type: 'boolean' } } },
        items: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, quote: { type: 'string' }, customerName: { type: 'string' } } } },
      },
    },
    demoCta: { type: 'object', properties: { enabled: { type: 'boolean' }, title: BILINGUAL_STRING } },
    _locale: { $ref: '#/components/schemas/LocaleMeta' },
  },
}

export const NAVIGATION_RESPONSE = {
  type: 'object',
  properties: {
    headerLinks: { type: 'array', items: NAV_LINK },
    footerColumns: { type: 'object', properties: { links: { type: 'array', items: NAV_LINK } } },
    pages: { type: 'array', items: { type: 'object', properties: { slug: { type: 'string' }, title: { type: 'string' } } } },
  },
}

export const PUBLIC_PAGE_SUMMARY = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    slug: { type: 'string' },
    title: { type: 'string' },
    template: { type: 'string' },
    published: { type: 'boolean' },
  },
}

export const PUBLIC_PAGES_LIST = {
  type: 'object',
  required: ['items'],
  properties: { items: { type: 'array', items: PUBLIC_PAGE_SUMMARY } },
}

export const PUBLIC_PAGE_DETAIL = {
  type: 'object',
  required: ['page'],
  properties: {
    page: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        slug: { type: 'string' },
        title: { type: 'string' },
        heading: { type: 'string' },
        shortDescription: { type: 'string' },
        sections: { type: 'array', items: PAGE_SECTION },
        seo: { $ref: '#/components/schemas/PageSeo' },
      },
    },
  },
}

export const TESTIMONIAL_ITEM = {
  type: 'object',
  required: ['id', 'quote', 'customerName'],
  properties: {
    id: { type: 'string' },
    quote: { type: 'string' },
    customerName: { type: 'string' },
    designation: { type: 'string' },
    company: { type: 'string' },
    image: { type: 'string' },
    imageAlt: { type: 'string' },
    industry: { type: 'string' },
    city: { type: 'string' },
    country: { type: 'string' },
    rating: { type: 'number', minimum: 1, maximum: 5 },
    verified: { type: 'boolean' },
    featuredOnHomepage: { type: 'boolean' },
  },
}

export const TESTIMONIALS_RESPONSE = {
  type: 'object',
  required: ['items'],
  properties: {
    schemaVersion: { type: 'integer' },
    section: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean' },
        eyebrow: { type: 'string' },
        heading: { type: 'string' },
        supportingText: { type: 'string' },
        viewAllLabel: { type: 'string' },
        viewAllUrl: { type: 'string' },
        showViewAll: { type: 'boolean' },
      },
    },
    page: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean' },
        title: { type: 'string' },
        intro: { type: 'string' },
        seoTitle: { type: 'string' },
        seoDescription: { type: 'string' },
      },
    },
    items: { type: 'array', items: TESTIMONIAL_ITEM },
  },
}

export const BLOG_CATEGORY = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    slug: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' },
  },
}

export const BLOG_POST_SUMMARY = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    slug: { type: 'string' },
    title: { type: 'string' },
    excerpt: { type: 'string' },
    publishedAt: { type: 'string', format: 'date-time' },
    categoryName: { type: 'string' },
    categorySlug: { type: 'string' },
    coverImage: { type: 'string' },
    tags: { type: 'array', items: { type: 'string' } },
  },
}

export const BLOG_POSTS_LIST = {
  type: 'object',
  required: ['items', 'pagination'],
  properties: {
    items: { type: 'array', items: BLOG_POST_SUMMARY },
    pagination: { $ref: '#/components/schemas/Pagination' },
    section: { type: 'object', properties: { enabled: { type: 'boolean' }, title: { type: 'string' } } },
  },
}

export const BLOG_POST_DETAIL = {
  type: 'object',
  required: ['post'],
  properties: {
    post: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        slug: { type: 'string' },
        title: { type: 'string' },
        excerpt: { type: 'string' },
        body: { type: 'array', items: { type: 'object', properties: { type: { type: 'string' }, text: { type: 'string' } } } },
        publishedAt: { type: 'string', format: 'date-time' },
        coverImage: { type: 'string' },
        tags: { type: 'array', items: { type: 'string' } },
      },
    },
    related: { type: 'array', items: BLOG_POST_SUMMARY },
    prev: { type: 'object', nullable: true, properties: BLOG_POST_SUMMARY.properties },
    next: { type: 'object', nullable: true, properties: BLOG_POST_SUMMARY.properties },
  },
}

export const BLOG_HOMEPAGE_PREVIEW = {
  type: 'object',
  properties: {
    enabled: { type: 'boolean' },
    title: { type: 'string' },
    featured: BLOG_POST_SUMMARY,
    items: { type: 'array', items: BLOG_POST_SUMMARY },
  },
}

export const SOFTWARE_DETAIL = {
  type: 'object',
  properties: {
    kind: { type: 'string', enum: ['module', 'industry'] },
    slug: { type: 'string' },
    title: { type: 'string' },
    heading: { type: 'string' },
    shortDescription: { type: 'string' },
    sections: { type: 'array', items: PAGE_SECTION },
    seo: { $ref: '#/components/schemas/PageSeo' },
  },
}

export const COUNTRY_PROFILE = {
  type: 'object',
  properties: {
    code: { type: 'string', enum: ['AE', 'SA', 'QA', 'OM', 'KW', 'BH'] },
    slug: { type: 'string', enum: ['ae', 'sa', 'qa', 'om', 'kw', 'bh'] },
    name: { type: 'string' },
    currency: { type: 'string' },
    enabled: { type: 'boolean' },
  },
}

export const COUNTRIES_LIST = {
  type: 'object',
  required: ['items'],
  properties: { items: { type: 'array', items: COUNTRY_PROFILE } },
}

export const CITY_REGISTRY_ENTRY = {
  type: 'object',
  required: ['slug', 'countryCode', 'name'],
  properties: {
    slug: { type: 'string', example: 'dubai' },
    countryCode: { type: 'string', enum: ['AE', 'SA', 'QA', 'OM', 'KW', 'BH'] },
    name: { $ref: '#/components/schemas/BilingualString' },
    focus: { $ref: '#/components/schemas/BilingualString' },
    industries: { type: 'array', items: { type: 'string' } },
    services: { type: 'array', items: { type: 'string' } },
  },
}

export const CITIES_LIST = {
  type: 'object',
  required: ['cities'],
  properties: { cities: { type: 'array', items: CITY_REGISTRY_ENTRY } },
}

export const LOCALE_HINT = {
  type: 'object',
  properties: {
    countryCode: { type: 'string', enum: ['AE', 'SA', 'QA', 'OM', 'KW', 'BH'] },
    source: { type: 'string', enum: ['header', 'fallback'] },
  },
}

export const LOCALE_ROUTING = {
  type: 'object',
  properties: {
    redirect: { type: 'string', nullable: true, example: '/qa/en' },
    country: { type: 'string', enum: ['ae', 'sa', 'qa', 'om', 'kw', 'bh'] },
    lang: { type: 'string', enum: ['en', 'ar'] },
  },
}

export const OPENAPI_DOCUMENT = {
  type: 'object',
  required: ['openapi', 'info', 'paths'],
  properties: {
    openapi: { type: 'string', example: '3.1.0' },
    info: {
      type: 'object',
      required: ['title', 'version'],
      properties: { title: { type: 'string' }, version: { type: 'string' }, description: { type: 'string' } },
    },
    servers: { type: 'array', items: { type: 'object', properties: { url: { type: 'string', format: 'uri' } } } },
    paths: {
      type: 'object',
      additionalProperties: {
        type: 'object',
        additionalProperties: {
          type: 'object',
          properties: {
            operationId: { type: 'string' },
            summary: { type: 'string' },
            description: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            responses: {
              type: 'object',
              additionalProperties: {
                type: 'object',
                properties: { description: { type: 'string' }, operationId: { type: 'string' } },
              },
            },
          },
        },
      },
    },
    components: {
      type: 'object',
      properties: {
        schemas: {
          type: 'object',
          additionalProperties: {
            type: 'object',
            properties: {
              type: { type: 'string' },
              properties: { type: 'object', additionalProperties: { type: 'object', properties: { type: { type: 'string' } } } },
            },
          },
        },
      },
    },
  },
}

/** Returns true when a response schema has explicit typed structure (not a bare additionalProperties stub). */
export function isTypedResponseSchema(schema, components = {}) {
  if (!schema) return false
  if (schema.$ref) {
    const name = schema.$ref.replace('#/components/schemas/', '')
    return isTypedResponseSchema(components[name], components)
  }
  if (schema.allOf) return schema.allOf.every((s) => isTypedResponseSchema(s, components))
  if (schema.type === 'string' || schema.type === 'boolean' || schema.type === 'integer' || schema.type === 'number') {
    return true
  }
  if (schema.type === 'array') return schema.items ? isTypedResponseSchema(schema.items, components) : false
  if (schema.type === 'object') {
    if (schema.properties && Object.keys(schema.properties).length > 0) {
      return Object.values(schema.properties).every((p) => isTypedResponseSchema(p, components))
    }
    if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
      return isTypedResponseSchema(schema.additionalProperties, components)
    }
    return false
  }
  return false
}

export function countTypedOperations(spec) {
  const components = spec.components?.schemas || {}
  let total = 0
  let typed = 0
  const untyped = []
  for (const [path, methods] of Object.entries(spec.paths || {})) {
    for (const [method, op] of Object.entries(methods || {})) {
      total++
      const responses = op.responses || {}
      const success = responses['200'] || responses['201']
      if (!success) {
        untyped.push(`${method.toUpperCase()} ${path}`)
        continue
      }
      const content = success.content || {}
      const media =
        content['application/json'] ||
        content['application/xml'] ||
        content['text/plain'] ||
        Object.values(content)[0]
      const schema = media?.schema
      if (isTypedResponseSchema(schema, components)) typed++
      else untyped.push(`${method.toUpperCase()} ${path}`)
    }
  }
  return { total, typed, untyped }
}


export const jsonResponse = (description, schema, example) => ({
  description,
  content: {
    'application/json': {
      schema,
      ...(example ? { example } : {}),
    },
  },
})

export const errorResponse = (description, statusExample) => ({
  description,
  content: {
    'application/json': {
      schema: PUBLIC_API_ERROR,
      example: statusExample || PUBLIC_API_ERROR.example,
    },
  },
})

export const queryCountry = {
  name: 'country',
  in: 'query',
  description: 'ISO GCC country code (AE, SA, QA, OM, KW, BH). Defaults to AE.',
  schema: { type: 'string', enum: ['AE', 'SA', 'QA', 'OM', 'KW', 'BH'], default: 'AE' },
  example: 'AE',
}

export const queryLang = {
  name: 'lang',
  in: 'query',
  description: 'Published language code.',
  schema: { type: 'string', enum: ['en', 'ar'], default: 'en' },
  example: 'en',
}
