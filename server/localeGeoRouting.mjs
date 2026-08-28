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

const TEST_COUNTRY_CODES = new Set(Object.keys(COUNTRY_TO_SLUG))

/**
 * Dev-only geo override via `?test_country=QA` on `/`.
 * In production requires LOCALE_TEST_COUNTRY_KEY and matching `?test_key=...`.
 * Ignored for bots, deep routes, and when unauthorized — real users never hit this accidentally.
 */
export function parseAuthorizedTestCountry(req) {
  const raw = req.query?.test_country
  if (!raw || typeof raw !== 'string') return null
  const code = raw.trim().toUpperCase()
  if (!TEST_COUNTRY_CODES.has(code)) return null

  if (process.env.NODE_ENV === 'production') {
    const secret = String(process.env.LOCALE_TEST_COUNTRY_KEY || '').trim()
    if (!secret) return null
    const key = String(req.query?.test_key ?? '').trim()
    if (!key || key !== secret) return null
  }

  return code
}

/** Optional `?test_lang=ar|en` with authorized test_country (root `/` only). */
export function parseAuthorizedTestLang(req) {
  if (!parseAuthorizedTestCountry(req)) return null
  const raw = req.query?.test_lang
  if (!raw || typeof raw !== 'string') return null
  const lang = raw.trim().toLowerCase()
  return lang === 'ar' || lang === 'en' ? lang : null
}

/** Matches /qa/en, /sa/ar/erp, /om/en/software/crm-software, etc. */
export const EXPLICIT_LOCALE_PATH_RE = /^\/(ae|sa|kw|qa|om|bh)\/(en|ar)(?=\/|$)/i

export function parseExplicitLocalePath(pathname) {
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`
  const match = path.match(EXPLICIT_LOCALE_PATH_RE)
  if (!match) return null
  const country = match[1].toLowerCase()
  const lang = match[2].toLowerCase()
  if (!COUNTRY_TO_SLUG[country.toUpperCase()]) return null
  return { country, lang: lang === 'ar' ? 'ar' : 'en' }
}

export function isExplicitLocalePath(pathname) {
  return parseExplicitLocalePath(pathname) != null
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

/**
 * Root-entry routing priority (explicit locale URLs never reach this function):
 * authorized test_country query → manual preference cookie → trusted proxy country → default UAE English.
 */
export async function resolveGeoRedirect(deps, req) {
  if (isGeoRedirectBot(req)) return { redirect: null, reason: 'bot' }

  const testCountry = parseAuthorizedTestCountry(req)
  const testLang = parseAuthorizedTestLang(req)
  const pref = parseLocalePrefCookie(req.headers.cookie)
  let countriesDoc
  try {
    countriesDoc = await deps.publishStore.readPublished('countries.json')
  } catch {
    countriesDoc = { items: [] }
  }
  const doc = deps.publishStore.stripMeta(countriesDoc) ?? { items: [] }

  let countryCode
  if (testCountry) {
    countryCode = normalizeCountryCode(testCountry)
  } else if (pref?.country) {
    countryCode = normalizeCountryCode(pref.country.toUpperCase())
  } else {
    countryCode = detectCountryFromRequest(req) || 'AE'
  }
  countryCode = normalizeCountryCode(countryCode)

  if (countryCode === 'AE') {
    return { redirect: null, reason: testCountry ? 'test_country_uae_default' : 'uae_default' }
  }

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

  const lang = await resolveLanguage(
    deps,
    countryCode,
    countryItem,
    req,
    testLang ?? (pref ? pref.lang : null),
  )
  const target = buildLocalePath(countrySlug, lang, '/')
  if (target === '/') return { redirect: null, reason: testCountry ? 'test_country_uae_default' : 'already_default' }

  const manual = testCountry ? false : pref?.manual === true
  return {
    redirect: target,
    reason: testCountry
      ? 'test_country'
      : manual
        ? 'manual_preference'
        : pref
          ? 'remembered_locale'
          : 'geo_detected',
    countryCode,
    lang,
    countrySlug,
    setPrefCookie: testCountry ? null : buildLocalePrefSetCookie(countrySlug, lang, manual),
  }
}

export function geoRedirectCacheHeaders() {
  return {
    'Cache-Control': 'private, no-store, max-age=0',
    Pragma: 'no-cache',
    Vary: 'CF-IPCountry, X-Country-Code, Cookie, Accept-Language',
  }
}

/** Sync dm_locale_pref to match explicit /:country/:lang URLs (Google landing pages, deep links). */
export function registerLocaleUrlPrefSync(app) {
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next()
    const explicit = parseExplicitLocalePath(req.path || '/')
    if (!explicit) return next()
    res.setHeader('Set-Cookie', buildLocalePrefSetCookie(explicit.country, explicit.lang, false))
    next()
  })
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
      if (result.reason === 'test_country') headers['X-Locale-Test-Country'] = result.countryCode || ''
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
