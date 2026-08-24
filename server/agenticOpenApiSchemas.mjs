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
  properties: {
    ok: { type: 'boolean', example: true },
    service: { type: 'string', example: 'digitalmanager-cms-api' },
    timestamp: { type: 'string', format: 'date-time' },
  },
  example: { ok: true, service: 'digitalmanager-cms-api', timestamp: '2026-08-24T12:00:00.000Z' },
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

export const LOCALE_CONTENT_RESPONSE = {
  type: 'object',
  properties: {
    page: { type: 'object', additionalProperties: true },
    meta: { type: 'object', additionalProperties: true },
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
        meta: { type: 'object', additionalProperties: true },
        fallback: {
          type: 'object',
          properties: {
            countryCode: { type: 'string' },
            lang: { type: 'string' },
            href: { type: 'string' },
          },
        },
      },
    },
  ],
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
