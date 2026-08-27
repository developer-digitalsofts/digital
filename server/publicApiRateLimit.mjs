/**
 * In-memory rate limiting for public JSON API endpoints.
 *
 * Production note: buckets are per Node process. For multi-instance deployments
 * (e.g. several Coolify containers), set REDIS_URL and replace this store with a
 * shared Redis backend — otherwise limits are enforced independently per instance.
 */
import { rateLimitedError } from './publicApiErrors.mjs'

export const PUBLIC_GET_RATE_LIMIT_WINDOW_MS = 60 * 1000
export const PUBLIC_GET_RATE_LIMIT_MAX = 120

export const LEAD_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
export const LEAD_RATE_LIMIT_MAX = 12

const publicGetBuckets = new Map()

function pruneBuckets(store, now = Date.now()) {
  for (const [key, bucket] of store) {
    if (!bucket || now >= bucket.resetAt) store.delete(key)
  }
}

export function setRateLimitHeaders(res, { limit, remaining, resetAt }) {
  const resetSeconds = Math.max(0, Math.ceil(resetAt / 1000))
  res.set({
    'RateLimit-Limit': String(limit),
    'RateLimit-Remaining': String(Math.max(0, remaining)),
    'RateLimit-Reset': String(resetSeconds),
  })
}

function consumeBucket(store, key, windowMs, max, now = Date.now()) {
  pruneBuckets(store, now)
  let bucket = store.get(key)
  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + windowMs }
  }
  bucket.count += 1
  store.set(key, bucket)
  return {
    allowed: bucket.count <= max,
    limit: max,
    remaining: max - bucket.count,
    resetAt: bucket.resetAt,
    retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
  }
}

export function shouldRateLimitPublicGet(pathname, method) {
  if (method !== 'GET') return false
  if (pathname.startsWith('/api/admin')) return false

  return (
    pathname === '/api/health' ||
    pathname === '/api/public/v1/health' ||
    pathname.startsWith('/api/public/') ||
    pathname.startsWith('/api/public/v1/') ||
    pathname === '/api/homepage' ||
    pathname === '/api/site-settings' ||
    pathname.startsWith('/api/page/') ||
    pathname.startsWith('/api/software-detail/')
  )
}

export function createPublicGetRateLimitMiddleware(clientIpFn) {
  return (req, res, next) => {
    const path = (req.originalUrl || req.url || '').split('?')[0]
    if (!shouldRateLimitPublicGet(path, req.method)) return next()

    const ip = clientIpFn(req)
    const result = consumeBucket(publicGetBuckets, `get:${ip}`, PUBLIC_GET_RATE_LIMIT_WINDOW_MS, PUBLIC_GET_RATE_LIMIT_MAX)

    if (!result.allowed) {
      rateLimitedError(res, 'Too many public API requests. Please wait before retrying.', {
        retryAfterSeconds: result.retryAfterSeconds,
        limit: result.limit,
        remaining: 0,
        resetAt: result.resetAt,
      })
      return
    }

    setRateLimitHeaders(res, result)
    next()
  }
}

export function checkLeadRateLimit(req, clientIpFn) {
  const ip = clientIpFn(req)
  const result = consumeBucket(publicGetBuckets, `lead:${ip}`, LEAD_RATE_LIMIT_WINDOW_MS, LEAD_RATE_LIMIT_MAX)
  return result
}

export function publicRateLimitPolicyText() {
  return [
    `GET public JSON endpoints: ${PUBLIC_GET_RATE_LIMIT_MAX} requests per IP per ${PUBLIC_GET_RATE_LIMIT_WINDOW_MS / 1000} seconds.`,
    `POST /api/public/v1/leads (alias /api/leads): ${LEAD_RATE_LIMIT_MAX} submissions per IP per ${LEAD_RATE_LIMIT_WINDOW_MS / 60000} minutes.`,
    'Responses include RateLimit-Limit, RateLimit-Remaining, and RateLimit-Reset. HTTP 429 responses include Retry-After and structured JSON.',
    process.env.REDIS_URL
      ? 'Shared Redis rate-limit store is configured for this deployment.'
      : 'Default in-memory store is per server process — configure REDIS_URL for multi-instance shared limits.',
  ]
}
