/**
 * Limited OpenAPI document for intentionally public endpoints only.
 * Does NOT include admin/CMS/private routes.
 */
import { PUBLIC_SITE_BASE } from './seoResolve.mjs'

const ERROR_SCHEMA = {
  type: 'object',
  required: ['error'],
  properties: {
    error: {
      type: 'object',
      required: ['code', 'message', 'resolution'],
      properties: {
        code: { type: 'string', example: 'RESOURCE_NOT_FOUND' },
        message: { type: 'string' },
        resolution: { type: 'string' },
      },
    },
  },
}

export function buildPublicOpenApiSpec() {
  return {
    openapi: '3.1.0',
    info: {
      title: 'DigitalManager Public Content API',
      version: '1.0.0',
      description:
        'Read-only public content endpoints and the lead/demo submission form. Admin/CMS APIs are private and excluded.',
    },
    servers: [{ url: PUBLIC_SITE_BASE }],
    tags: [
      { name: 'health', description: 'Service health' },
      { name: 'content', description: 'Published CMS content' },
      { name: 'locale', description: 'Localized public content' },
      { name: 'forms', description: 'Public form submission' },
      { name: 'seo', description: 'SEO and discovery files' },
    ],
    paths: {
      '/api/health': {
        get: {
          operationId: 'getHealth',
          tags: ['health'],
          summary: 'Health check',
          responses: {
            200: {
              description: 'Service health status',
              content: { 'application/json': { schema: { type: 'object' } } },
            },
          },
        },
      },
      '/api/homepage': {
        get: {
          operationId: 'getHomepage',
          tags: ['content'],
          summary: 'Locale-aware homepage CMS bundle',
          parameters: [
            { name: 'country', in: 'query', schema: { type: 'string', example: 'AE' } },
            { name: 'lang', in: 'query', schema: { type: 'string', enum: ['en', 'ar'] } },
          ],
          responses: {
            200: { description: 'Homepage payload', content: { 'application/json': { schema: { type: 'object' } } } },
            503: { description: 'Unavailable', content: { 'application/json': { schema: ERROR_SCHEMA } } },
          },
        },
      },
      '/api/public/seo-page': {
        get: {
          operationId: 'getSeoPage',
          tags: ['seo'],
          summary: 'Resolve SEO metadata for a public path',
          parameters: [{ name: 'path', in: 'query', required: true, schema: { type: 'string', example: '/' } }],
          responses: {
            200: { description: 'SEO metadata', content: { 'application/json': { schema: { type: 'object' } } } },
          },
        },
      },
      '/api/public/blog/posts/{slug}': {
        get: {
          operationId: 'getBlogPost',
          tags: ['content'],
          summary: 'Published blog post by slug',
          parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Blog post', content: { 'application/json': { schema: { type: 'object' } } } },
            404: { description: 'Not found', content: { 'application/json': { schema: ERROR_SCHEMA } } },
          },
        },
      },
      '/api/public/locale-content/{slug}': {
        get: {
          operationId: 'getLocaleContent',
          tags: ['locale'],
          summary: 'Localized registry page content',
          parameters: [
            { name: 'slug', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'country', in: 'query', schema: { type: 'string' } },
            { name: 'lang', in: 'query', schema: { type: 'string', enum: ['en', 'ar'] } },
          ],
          responses: {
            200: { description: 'Locale page payload', content: { 'application/json': { schema: { type: 'object' } } } },
            404: { description: 'Not found', content: { 'application/json': { schema: ERROR_SCHEMA } } },
          },
        },
      },
      '/api/leads': {
        post: {
          operationId: 'submitLead',
          tags: ['forms'],
          summary: 'Submit contact/demo lead',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['email', 'phone'],
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    phone: { type: 'string' },
                    company: { type: 'string' },
                    topic: { type: 'string' },
                    message: { type: 'string' },
                    sourcePage: { type: 'string' },
                    localeCountry: { type: 'string' },
                    localeLang: { type: 'string' },
                    countryCode: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Lead accepted', content: { 'application/json': { schema: { type: 'object' } } } },
            400: { description: 'Validation error', content: { 'application/json': { schema: ERROR_SCHEMA } } },
            429: { description: 'Rate limited', content: { 'application/json': { schema: ERROR_SCHEMA } } },
          },
        },
      },
      '/sitemap.xml': {
        get: {
          operationId: 'getSitemap',
          tags: ['seo'],
          summary: 'XML sitemap of indexable public pages',
          responses: {
            200: { description: 'Sitemap XML', content: { 'application/xml': { schema: { type: 'string' } } } },
          },
        },
      },
      '/robots.txt': {
        get: {
          operationId: 'getRobots',
          tags: ['seo'],
          summary: 'Robots directives',
          responses: {
            200: { description: 'Robots file', content: { 'text/plain': { schema: { type: 'string' } } } },
          },
        },
      },
      '/llms.txt': {
        get: {
          operationId: 'getLlmsTxt',
          tags: ['seo'],
          summary: 'Agent instructions for public site usage',
          responses: {
            200: { description: 'llms.txt', content: { 'text/plain': { schema: { type: 'string' } } } },
          },
        },
      },
    },
  }
}
