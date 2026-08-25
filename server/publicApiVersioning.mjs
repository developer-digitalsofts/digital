/**
 * Public API URL versioning: /api/public/v1/* stable routes with legacy aliases.
 */
import { PUBLIC_SITE_BASE } from './seoResolve.mjs'

export const PUBLIC_API_V1_SUNSET = 'Sat, 01 Jan 2028 00:00:00 GMT'

export const PUBLIC_API_VERSION_POLICY = [
  'Stable public JSON routes live under `/api/public/v1/`.',
  'Legacy unversioned paths (`/api/public/*`, `/api/homepage`, `/api/site-settings`, `/api/page/{slug}`, `/api/software-detail/{kind}/{slug}`) remain available as backward-compatible aliases.',
  'Deprecated aliases respond with `Deprecation: true`, `Sunset`, and a `Link` header pointing to /developers#versioning.',
  'Breaking changes ship only in a new major prefix (for example `/api/public/v2/`). v1 aliases are supported until the published Sunset date.',
  'Admin CMS routes are private and are not versioned on this surface.',
].join('\n')

const LEGACY_DEPRECATION_PATTERNS = [
  /^\/api\/public\/(?!v1\/)/,
  /^\/api\/homepage$/,
  /^\/api\/site-settings$/,
  /^\/api\/page\//,
  /^\/api\/software-detail\//,
]

export function mapPublicApiV1Path(pathname) {
  if (!pathname.startsWith('/api/public/v1')) return null
  const suffix = pathname.slice('/api/public/v1'.length) || ''
  if (suffix === '/health') return '/api/health'
  if (suffix === '/site-settings') return '/api/site-settings'
  if (suffix === '/leads') return '/api/leads'
  if (suffix.startsWith('/')) return `/api/public${suffix}`
  return null
}

export function isDeprecatedLegacyPublicPath(pathname) {
  if (pathname.startsWith('/api/public/v1')) return false
  return LEGACY_DEPRECATION_PATTERNS.some((re) => re.test(pathname))
}

export function publicApiV1RewriteMiddleware(req, _res, next) {
  const pathname = req.path || req.url.split('?')[0]
  const mapped = mapPublicApiV1Path(pathname)
  if (!mapped) return next()

  req.publicApiV1Requested = true
  const query = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''
  req.url = mapped + query
  next()
}

export function publicApiDeprecationMiddleware(req, res, next) {
  const pathname = req.originalUrl?.split('?')[0] || req.path || req.url.split('?')[0]
  if (!isDeprecatedLegacyPublicPath(pathname)) return next()

  res.set({
    Deprecation: 'true',
    Sunset: PUBLIC_API_V1_SUNSET,
    Link: `<${PUBLIC_SITE_BASE}/developers#versioning>; rel="deprecation"`,
  })
  next()
}

export function openApiV1Path(legacyPath) {
  if (legacyPath === '/api/health') return '/api/public/v1/health'
  if (legacyPath === '/api/site-settings') return '/api/public/v1/site-settings'
  if (legacyPath === '/api/leads') return '/api/public/v1/leads'
  if (legacyPath.startsWith('/api/public/')) return legacyPath.replace('/api/public/', '/api/public/v1/')
  return null
}
