/**
 * GCC automatic country/language routing for root entry only.
 */
import { normalizeCountryCode } from './countryHelpers.mjs'
import { detectCountryFromRequest } from './localeDetect.mjs'
import { getLocaleHomepageIndexMeta } from './localeHomepage.mjs'
import { evaluateIndexability } from './seoResolve.mjs'
import { findLocaleRecord, resolveLocaleRecord } from './localeHelpers.mjs'
import { buildLocalePath } from './seoPaths.mjs'

export const LOCALE_PREF_COOKIE = 'dm_locale_pref'
export const LOCALE_PREF_MAX_AGE_SEC = 15552000

const BOT_UA_FRAGMENTS = [
  'googlebot',
  'bingbot',
  'chatgpt-user',
  'gptbot',
  'claudebot',
  'anthropic-ai',
  'google-extended',
  'deepseekbot',
  'ora-agent',
  'facebookexternalhit',
  'slurp',
]

const COUNTRY_TO_SLUG = {
  AE: 'ae',
  SA: 'sa',
  KW: 'kw',
  QA: 'qa',
  OM: 'om',
  BH: 'bh',
}

function parseCookies(header) {
  const out = {}
  if (!header || typeof header !== 'string') return out
  for (const part of header.split(';')) {
    const idx = part.indexOf('=')
    if (idx <= 0) continue
    out[part.slice(0, idx).trim()] = decodeURIComponent(part.slice(idx + 1).trim())
  }
  return out
}

export function buildLocalePrefSetCookie(countrySlug, lang, manual = false) {
  const payload = encodeURIComponent(
    JSON.stringify({
      country: String(countrySlug || '').toLowerCase(),
      lang: lang === 'ar' ? 'ar' : 'en',
      manual: manual === true,
    }),
  )
  let cookie = `${LOCALE_PREF_COOKIE}=${payload}; Path=/; Max-Age=${LOCALE_PREF_MAX_AGE_SEC}; SameSite=Lax`
  if (process.env.NODE_ENV === 'production') cookie += '; Secure'
  return cookie
}

export function parseLocalePrefCookie(cookieHeader) {
  const raw = parseCookies(cookieHeader)[LOCALE_PREF_COOKIE]
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    const country = String(parsed.country || parsed.c || '').toLowerCase()
    const lang = parsed.lang === 'ar' || parsed.l === 'ar' ? 'ar' : 'en'
    const manual = parsed.manual === true || parsed.m === 1 || parsed.m === true
    if (!COUNTRY_TO_SLUG[country.toUpperCase()]) return null
    return { country, lang, manual }
  } catch {
    return null
  }
}

export function isGeoRedirectBot(req) {
  const ua = String(req.headers['user-agent'] || '').toLowerCase()
  return BOT_UA_FRAGMENTS.some((frag) => ua.includes(frag))
}

function parseAcceptLanguage(header) {
  if (!header || typeof header !== 'string') return []
  return header
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';')
      const qParam = params.find((p) => p.trim().startsWith('q='))
      const q = qParam ? Number(qParam.trim().slice(2)) : 1
      return { tag: tag.trim().toLowerCase(), q: Number.isFinite(q) ? q : 0 }
    })
    .filter((row) => row.tag)
    .sort((a, b) => b.q - a.q)
}

function prefersArabic(req) {
  if (process.env.NODE_ENV !== 'production' && process.env.TEST_ACCEPT_LANGUAGE) {
    return String(process.env.TEST_ACCEPT_LANGUAGE).toLowerCase().startsWith('ar')
  }
  if (process.env.NODE_ENV !== 'production') {
    const test = req.headers['x-test-accept-language']
    if (typeof test === 'string' && test.toLowerCase().startsWith('ar')) return true
    if (typeof test === 'string' && test.toLowerCase().startsWith('en')) return false
  }
  for (const { tag } of parseAcceptLanguage(req.headers['accept-language'])) {
    if (tag === 'ar' || tag.startsWith('ar-')) return true
    if (tag === 'en' || tag.startsWith('en-')) return false
  }
  return false
}

async function englishPublished(deps, countryCode) {
  const meta = await getLocaleHomepageIndexMeta(deps, countryCode, 'en')
  return meta.hasPublishedContent === true
}

async function arabicApprovedPublic(deps, countryCode) {
  const store = await deps.localePublish.readPublishedStore()
  const matches = findLocaleRecord(store.records || [], {
    contentType: 'navigation',
    globalIdentity: 'header',
    countryCode,
    lang: 'ar',
  })
  const resolved = resolveLocaleRecord(null, matches, {
    context: 'public',
    allowFallback: false,
    allowGlobalFallback: false,
  })
  return (
    evaluateIndexability({
      record: resolved.record,
      meta: resolved.meta,
      countryCode,
      lang: 'ar',
      countryEnabled: true,
    }).indexable === true
  )
}

function countryRoutingConfig(item) {
  return {
    autoDetectEnabled: item?.autoDetectEnabled !== false,
    allowAutoRedirect: item?.allowAutoRedirect !== false,
    defaultLanguage: item?.defaultLanguage === 'ar' ? 'ar' : 'en',
  }
}

async function resolveLanguage(deps, countryCode, countryItem, req, prefLang) {
  if (prefLang === 'ar') {
    return (await arabicApprovedPublic(deps, countryCode)) ? 'ar' : 'en'
  }
  if (prefLang === 'en') return 'en'

  const routing = countryRoutingConfig(countryItem)
  if (prefersArabic(req) && (await arabicApprovedPublic(deps, countryCode))) return 'ar'
  if (routing.defaultLanguage === 'ar' && (await arabicApprovedPublic(deps, countryCode))) return 'ar'
  return 'en'
}

export async function resolveGeoRedirect(deps, req) {
  if (isGeoRedirectBot(req)) return { redirect: null, reason: 'bot' }

  const pref = parseLocalePrefCookie(req.headers.cookie)
  let countriesDoc
  try {
    countriesDoc = await deps.publishStore.readPublished('countries.json')
  } catch {
    countriesDoc = { items: [] }
  }
  const doc = deps.publishStore.stripMeta(countriesDoc) ?? { items: [] }

  let countryCode
  if (pref?.country) {
    countryCode = normalizeCountryCode(pref.country.toUpperCase())
  } else {
    countryCode = detectCountryFromRequest(req) || 'AE'
  }
  countryCode = normalizeCountryCode(countryCode)

  if (countryCode === 'AE') return { redirect: null, reason: 'uae_default' }

  const countryItem = (doc.items || []).find((item) => normalizeCountryCode(item.code) === countryCode)
  if (!countryItem || countryItem.enabled === false) return { redirect: null, reason: 'country_disabled' }

  const routing = countryRoutingConfig(countryItem)
  if (!routing.autoDetectEnabled || !routing.allowAutoRedirect) {
    return { redirect: null, reason: 'routing_disabled' }
  }
  if (!(await englishPublished(deps, countryCode))) {
    return { redirect: null, reason: 'english_unpublished' }
  }

  const countrySlug = COUNTRY_TO_SLUG[countryCode]
  if (!countrySlug) return { redirect: null, reason: 'unknown_country' }

  const lang = await resolveLanguage(deps, countryCode, countryItem, req, pref ? pref.lang : null)
  const target = buildLocalePath(countrySlug, lang, '/')
  if (target === '/') return { redirect: null, reason: 'already_default' }

  const manual = pref?.manual === true
  return {
    redirect: target,
    reason: manual ? 'manual_preference' : pref ? 'remembered_locale' : 'geo_detected',
    countryCode,
    lang,
    countrySlug,
    setPrefCookie: buildLocalePrefSetCookie(countrySlug, lang, manual),
  }
}

export function geoRedirectCacheHeaders() {
  return {
    'Cache-Control': 'private, no-store, max-age=0',
    Pragma: 'no-cache',
    Vary: 'Accept-Language, Cookie, CF-IPCountry, X-Country-Code, X-Vercel-IP-Country, CloudFront-Viewer-Country',
  }
}

export function registerLocaleGeoRouting(app, deps) {
  app.get('/api/public/locale-routing', async (req, res) => {
    try {
      if (req.query.path && String(req.query.path) !== '/') {
        res.set({ 'Cache-Control': 'no-store' })
        res.json({ redirect: null, reason: 'not_entry_route' })
        return
      }
      const result = await resolveGeoRedirect(deps, req)
      res.set({ ...geoRedirectCacheHeaders() })
      res.json({
        redirect: result.redirect,
        reason: result.reason,
        countryCode: result.countryCode || null,
        lang: result.lang || null,
      })
    } catch (e) {
      console.error(e)
      res.status(500).json({ error: 'Failed to resolve locale routing' })
    }
  })

  app.use(async (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next()
    if (req.path !== '/') return next()
    try {
      const result = await resolveGeoRedirect(deps, req)
      if (!result.redirect) return next()
      const headers = { Location: result.redirect, ...geoRedirectCacheHeaders() }
      if (result.setPrefCookie) headers['Set-Cookie'] = result.setPrefCookie
      res.status(302).set(headers).end()
    } catch (e) {
      console.error('[geo-routing]', e)
      next()
    }
  })
}

export async function getCountryRoutingStatus(deps, countryCode) {
  const code = normalizeCountryCode(countryCode)
  return {
    countryCode: code,
    englishPublished: await englishPublished(deps, code),
    arabicPublished: await arabicApprovedPublic(deps, code),
  }
}
