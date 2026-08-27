import express from 'express'
import cors from 'cors'
import { existsSync } from 'fs'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import { nanoid } from 'nanoid'
import nodemailer from 'nodemailer'
import { loadEnv } from './loadEnv.mjs'
import {
  allowAdminBootstrap,
  authSecretOrDevFallback,
  envConfigSummary,
  isAuthSecretConfigured,
  isProduction,
  resolveSmtpConfig,
} from './envConfig.mjs'
import { createPublishStore } from './publishStore.mjs'
import { migrateCmsSchemaV2 } from './cmsSchemaMigrate.mjs'
import { registerContentRoutes, ensureBlogBootstrap, ensureCountriesBootstrap } from './contentRoutes.mjs'
import { registerAgenticRoutes, createSpaShellHandler } from './agenticRoutes.mjs'
import { registerLocaleGeoRouting } from './localeGeoRouting.mjs'
import { isValidCityForCountry } from './cityRegistry.mjs'
import {
  notFoundError,
  internalError,
  validationError,
  rateLimitedError,
  conflictError,
  serviceUnavailableError,
} from './publicApiErrors.mjs'
import {
  checkLeadRateLimit,
  createPublicGetRateLimitMiddleware,
  LEAD_RATE_LIMIT_MAX,
  LEAD_RATE_LIMIT_WINDOW_MS,
  setRateLimitHeaders,
} from './publicApiRateLimit.mjs'
import {
  publicApiDeprecationMiddleware,
  publicApiV1RewriteMiddleware,
} from './publicApiVersioning.mjs'
import { createLocaleStorage } from './localeStorage.mjs'
import { registerLocaleRoutes } from './localeApi.mjs'
import { buildLocaleHomepagePayload } from './localeHomepage.mjs'
import { createLocalePublishHelpers } from './localePublish.mjs'
import { normalizeCountryCode } from './countryHelpers.mjs'
import { normalizeLocaleLang } from './localeContentModel.mjs'
import { ensureLocaleBaselines } from './localeMigrate.mjs'
import {
  clearJsonCache,
  invalidateJsonCache,
  invalidateJsonCachePrefix,
  jsonCacheStats,
  readJsonCached,
} from './jsonCache.mjs'
import {
  buildTemplateSections,
  createSection,
  getSystemPage,
  isSystemPageId,
  normalizeSections,
  PAGE_TEMPLATES,
  SECTION_TYPES,
  SYSTEM_PAGES,
} from './pageSections.mjs'

loadEnv()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = __dirname
const DATA_DIR = path.join(ROOT, 'data')
const UPLOADS_DIR = path.join(ROOT, 'uploads')
const DIST_DIR = path.join(ROOT, '..', 'dist')

const PORT = Number(process.env.PORT) || 3040
const HOST = process.env.HOST || '0.0.0.0'
const JWT_SECRET = authSecretOrDevFallback()
const DIST_INDEX = path.join(DIST_DIR, 'index.html')
const distReady = existsSync(DIST_INDEX)
// Coolify/Nixpacks often start only the Express process. Serve the Vite build
// automatically in production when dist/ exists (override with SERVE_STATIC=false).
const serveStaticEnv = (process.env.SERVE_STATIC || '').trim().toLowerCase()
const SERVE_STATIC =
  serveStaticEnv === 'true' ||
  (serveStaticEnv !== 'false' && isProduction() && distReady)

if (isProduction() && !isAuthSecretConfigured()) {
  console.warn('[security] AUTH_SECRET / JWT_SECRET is not set — admin auth is not safe for production')
}

if (isProduction() && !distReady) {
  console.warn(
    `[static] ${DIST_INDEX} not found — GET / will return "Cannot GET /". ` +
      'Build the frontend (`npm run build`) and keep the Coolify base directory at the repo root.',
  )
}

const DATA_FILES = {
  header: 'header.json',
  hero: 'hero.json',
  stats: 'stats.json',
  about: 'about.json',
  valueChain: 'valueChain.json',
  modules: 'modules.json',
  workflow: 'workflow.json',
  industries: 'industries.json',
  demoCta: 'demoCta.json',
  testimonials: 'testimonials.json',
  personalizedDemo: 'personalizedDemo.json',
  faqs: 'faqs.json',
  cta: 'cta.json',
  footer: 'footer.json',
  seo: 'seo.json',
}

const EXTRA_HOMEPAGE_FILES = {
  siteSettings: 'siteSettings.json',
  whatsappSettings: 'whatsappSettings.json',
  pageSections: 'pageSections.json',
  megaMenus: 'megaMenus.json',
  blogSection: 'blogSection.json',
  countries: 'countries.json',
}

const CONTENT_FILES = {
  blogPosts: 'blogPosts.json',
  blogCategories: 'blogCategories.json',
  blogSection: 'blogSection.json',
}

const ADMIN_KEYS = new Set([
  ...Object.keys(DATA_FILES),
  ...Object.keys(EXTRA_HOMEPAGE_FILES),
  ...Object.keys(CONTENT_FILES),
  'siteSettings',
  'whatsappSettings',
  'emailSettings',
  'pageSections',
  'pages',
  'megaMenus',
])

const ACTIVITY_FILE = 'activityLog.json'
const CONTENT_META_FILE = 'contentMeta.json'
const MEDIA_INDEX_FILE = 'mediaIndex.json'
const USERS_FILE = 'users.json'
const LEADS_FILE = 'leads.json'
const PAGES_FILE = 'pages.json'
const SOFTWARE_DETAILS_FILE = 'softwareDetails.json'

const PAGE_TYPES = new Set(['home', 'about', 'services', 'projects', 'blog', 'contact', 'residential', 'custom'])
const PAGE_STATUSES = new Set(['published', 'draft'])
const PAGE_LANG_MODES = new Set(['en', 'ar', 'both'])
const RESERVED_PAGE_SLUGS = new Set(['api', 'uploads', 'admin', 'about', 'privacy', 'developers', 'contact', 'software', 'blog', 'testimonials', 'industries'])
const SOFTWARE_KINDS = new Set(['module', 'industry'])
const ACCENT_COLORS = new Set(['orange', 'green', 'blue', 'purple', 'teal'])

const LEAD_STATUSES = new Set(['New', 'Contacted', 'Closed'])
const DEMO_REQUEST_STATUSES = new Set([
  'New',
  'Contacted',
  'Demo Scheduled',
  'Follow-up',
  'Converted',
  'Not Interested',
  'Closed',
])
const DEMO_DUPLICATE_WINDOW_MS = 5 * 60 * 1000
const recentDemoFingerprints = new Map()
const MAX_ACTIVITY = 500
const IMAGE_MIMES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon'])

const app = express()
app.set('trust proxy', 1)
app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: '8mb' }))

let bootstrapReady = false
let bootstrapError = null
const serverStartedAt = Date.now()

app.use((req, res, next) => {
  if (!req.path.startsWith('/api')) return next()
  const t0 = Date.now()
  res.on('finish', () => {
    const ms = Date.now() - t0
    if (ms >= 2000) console.warn(`[api] slow ${req.method} ${req.path} ${res.statusCode} ${ms}ms`)
    else if (process.env.LOG_API_TIMING === 'true') console.log(`[api] ${req.method} ${req.path} ${res.statusCode} ${ms}ms`)
  })
  next()
})

async function readJsonFile(relPath) {
  const p = path.join(DATA_DIR, relPath)
  const raw = await fs.readFile(p, 'utf8')
  return JSON.parse(raw)
}

async function writeJsonFile(relPath, data) {
  const p = path.join(DATA_DIR, relPath)
  await fs.mkdir(path.dirname(p), { recursive: true })
  const tmp = `${p}.${nanoid(6)}.tmp`
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8')
  await fs.rename(tmp, p)
  invalidateJsonCache(relPath)
  invalidateJsonCache(`published/${relPath}`)
}

async function safeReadJson(relPath, fallback = null) {
  try {
    return await readJsonCached({
      readFile: readJsonFile,
      relPath,
      fallback: undefined,
    })
  } catch {
    return fallback
  }
}

const publishStore = createPublishStore({
  dataDir: DATA_DIR,
  writeJsonFile,
  safeReadJson,
  readJsonFile,
})

const localeStorage = createLocaleStorage({
  dataDir: DATA_DIR,
  writeJsonFile,
  readJsonFile,
  safeReadJson,
})

const localePublish = createLocalePublishHelpers({ localeStorage, publishStore })

const PUBLIC_CACHE_HEADERS = {
  'Cache-Control': 'no-store',
  Pragma: 'no-cache',
}

function sendPublicJson(res, payload, status = 200) {
  if (status === 404 && payload?.error && typeof payload.error === 'string' && !payload.error.code) {
    notFoundError(res, payload.error)
    return
  }
  if (status >= 500 && payload?.error && typeof payload.error === 'string') {
    internalError(res, payload.error)
    return
  }
  res.set(PUBLIC_CACHE_HEADERS)
  res.status(status).json(payload)
}

function dataFileForKey(key) {
  if (DATA_FILES[key]) return DATA_FILES[key]
  if (EXTRA_HOMEPAGE_FILES[key]) return EXTRA_HOMEPAGE_FILES[key]
  if (CONTENT_FILES[key]) return CONTENT_FILES[key]
  if (key === 'pages') return PAGES_FILE
  if (key === 'mediaIndex') return MEDIA_INDEX_FILE
  return null
}

const PUBLISHABLE_KEYS = new Set([
  ...Object.keys(DATA_FILES),
  ...Object.keys(EXTRA_HOMEPAGE_FILES),
  ...Object.keys(CONTENT_FILES),
])

let homepagePayloadCache = null
let homepagePayloadCacheAt = 0
const HOMEPAGE_PAYLOAD_CACHE_MS = 0

async function buildHomepageMeta() {
  const pubMeta = (await publishStore.readPublishMeta()) || {}
  const stamps = Object.values(pubMeta)
    .map((row) => (row && typeof row === 'object' ? row.lastPublishedAt || row.lastSavedAt : null))
    .filter(Boolean)
  const publishedAt = stamps.length ? [...stamps].sort().at(-1) : null
  return {
    slug: 'home',
    status: 'published',
    schemaVersion: 2,
    updatedAt: publishedAt,
    publishedAt,
  }
}

async function loadPublishedHomepagePayload() {
  if (HOMEPAGE_PAYLOAD_CACHE_MS > 0 && homepagePayloadCache && Date.now() - homepagePayloadCacheAt < HOMEPAGE_PAYLOAD_CACHE_MS) {
    return homepagePayloadCache
  }
  const t0 = Date.now()
  const entries = [
    ...Object.entries(DATA_FILES),
    ...Object.entries(EXTRA_HOMEPAGE_FILES),
  ]
  const docs = await Promise.all(entries.map(([, file]) => publishStore.readPublished(file)))
  const out = {}
  entries.forEach(([key], i) => {
    out[key] = publishStore.stripMeta(docs[i]) ?? {}
  })
  out.navigation = await buildPublishedNavigation(out)
  out.meta = await buildHomepageMeta()
  homepagePayloadCache = out
  homepagePayloadCacheAt = Date.now()
  const ms = Date.now() - t0
  if (ms >= 1000) console.warn(`[homepage] loaded published payload in ${ms}ms`)
  return out
}

function clearHomepagePayloadCache() {
  homepagePayloadCache = null
  homepagePayloadCacheAt = 0
}

function invalidatePublishedContentCaches() {
  clearHomepagePayloadCache()
  invalidateJsonCachePrefix('published/')
}

function defaultPageSeo() {
  return {
    title: { en: '', ar: '' },
    description: { en: '', ar: '' },
    socialImage: '',
    canonicalUrl: '',
    noIndex: false,
  }
}

function coercePageSeo(raw, prev) {
  const base = prev && typeof prev === 'object' ? prev : defaultPageSeo()
  const o = raw && typeof raw === 'object' ? raw : {}
  return {
    title: coerceBilingual(o.title ?? base.title),
    description: coerceBilingual(o.description ?? base.description),
    socialImage: typeof o.socialImage === 'string' ? o.socialImage : base.socialImage || '',
    canonicalUrl: typeof o.canonicalUrl === 'string' ? o.canonicalUrl : base.canonicalUrl || '',
    noIndex: o.noIndex === true,
  }
}

function syncNavigationFromLegacy(page) {
  const nav = page.navigation && typeof page.navigation === 'object'
    ? page.navigation
    : { header: defaultHeaderNav(), footer: defaultFooterNav() }
  if (page.headerNav) nav.header = { ...defaultHeaderNav(), ...page.headerNav }
  if (page.footerNav) nav.footer = { ...defaultFooterNav(), ...page.footerNav }
  page.headerNav = nav.header
  page.footerNav = nav.footer
  page.navigation = nav
  page.showInMenu = nav.header.enabled === true
  return page
}

function findCustomPageById(store, id) {
  const idx = store.items.findIndex((p) => p.id === id)
  if (idx === -1) return { idx: -1, page: null }
  return { idx, page: store.items[idx] }
}

function adminPageListItem(page) {
  syncNavigationFromLegacy(page)
  return {
    ...page,
    editorialStatus: pageEditorialStatus(page),
    headerEnabled: page.headerNav?.enabled === true,
    footerEnabled: page.footerNav?.enabled === true,
  }
}

function systemPageListRows() {
  return SYSTEM_PAGES.map((sp) => ({
    id: sp.id,
    slug: sp.slug,
    title: sp.title,
    pageType: sp.pageType,
    template: sp.template,
    kind: 'system',
    status: 'published',
    language: 'both',
    sortOrder: 0,
    showInMenu: false,
    headerNav: defaultHeaderNav(),
    footerNav: defaultFooterNav(),
    navigation: { header: defaultHeaderNav(), footer: defaultFooterNav() },
    sections: [],
    editorialStatus: 'Published',
    headerEnabled: false,
    footerEnabled: false,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    publicPath: sp.publicPath,
    manageSections: sp.id === 'sys-home',
    editable: true,
  }))
}

async function publishPageRow(row, user) {
  const now = new Date().toISOString()
  syncNavigationFromLegacy(row)
  row.publishedContent = buildPublishedContentFromDraft(row, now)
  row.publishedSections = normalizeSections(row.sections)
  row.lastPublishedAt = now
  row.status = 'published'
  const store = await readPagesStore()
  const idx = store.items.findIndex((p) => p.id === row.id)
  if (idx >= 0) store.items[idx] = row
  await persistPagesStore(store, user, `Published page ${row.slug || row.id}`)
  return row
}

function defaultHeaderNav() {
  return {
    enabled: false,
    label: { en: '', ar: '' },
    sortOrder: 0,
    parentId: '',
    openInNewTab: false,
    highlightAsCta: false,
    showDesktop: true,
    showMobile: true,
  }
}

function defaultFooterNav() {
  return {
    enabled: false,
    label: { en: '', ar: '' },
    column: 'company',
    sortOrder: 0,
    openInNewTab: false,
  }
}

function defaultHeroCta() {
  return {
    enabled: false,
    label: { en: '', ar: '' },
    variant: 'primary',
    sortOrder: 0,
  }
}

function coerceHeaderNav(raw, fallbackLabel) {
  const o = raw && typeof raw === 'object' ? raw : {}
  const label = coerceBilingual(o.label ?? fallbackLabel)
  return {
    enabled: typeof o.enabled === 'boolean' ? o.enabled : false,
    label,
    sortOrder: typeof o.sortOrder === 'number' && Number.isFinite(o.sortOrder) ? o.sortOrder : 0,
    parentId: typeof o.parentId === 'string' ? o.parentId : '',
    openInNewTab: o.openInNewTab === true,
    highlightAsCta: o.highlightAsCta === true,
    showDesktop: o.showDesktop !== false,
    showMobile: o.showMobile !== false,
  }
}

function coerceFooterNav(raw, fallbackLabel) {
  const o = raw && typeof raw === 'object' ? raw : {}
  const cols = new Set(['product', 'industries', 'company', 'contact'])
  return {
    enabled: typeof o.enabled === 'boolean' ? o.enabled : false,
    label: coerceBilingual(o.label ?? fallbackLabel),
    column: cols.has(o.column) ? o.column : 'company',
    sortOrder: typeof o.sortOrder === 'number' && Number.isFinite(o.sortOrder) ? o.sortOrder : 0,
    openInNewTab: o.openInNewTab === true,
  }
}

function coerceHeroCta(raw) {
  const o = raw && typeof raw === 'object' ? raw : {}
  return {
    enabled: o.enabled === true,
    label: coerceBilingual(o.label),
    variant: o.variant === 'secondary' ? 'secondary' : 'primary',
    sortOrder: typeof o.sortOrder === 'number' && Number.isFinite(o.sortOrder) ? o.sortOrder : 0,
  }
}

function pagePublicView(page) {
  if (!page) return null
  const pub = page.publishedContent && typeof page.publishedContent === 'object' ? page.publishedContent : null
  if (!pub) return null
  const pubSections = normalizeSections(
    page.publishedSections?.length ? page.publishedSections : pub.sections || [],
  )
  const seo = pub.seo && typeof pub.seo === 'object' ? pub.seo : defaultPageSeo()
  return {
    id: page.id,
    slug: pub.slug || page.slug,
    pageType: pub.pageType || page.pageType,
    template: pub.template || page.template || 'blank',
    status: 'published',
    language: pub.language || page.language,
    sortOrder: pub.sortOrder ?? page.sortOrder ?? 0,
    showInMenu: pub.headerNav?.enabled === true || pub.showInMenu === true,
    metaTitle: seo.title?.en || seo.title?.ar ? seo.title : pub.metaTitle || page.metaTitle,
    metaDescription: seo.description?.en || seo.description?.ar ? seo.description : pub.metaDescription || page.metaDescription,
    seo,
    title: pub.title || page.title,
    heading: pub.heading || page.heading,
    shortDescription: pub.shortDescription || page.shortDescription,
    content: pub.content || page.content,
    featuredImageUrl: pub.featuredImageUrl || '',
    headerNav: pub.headerNav || defaultHeaderNav(),
    footerNav: pub.footerNav || defaultFooterNav(),
    heroCta: pub.heroCta || defaultHeroCta(),
    sections: pubSections.filter((s) => s.visible !== false),
    createdAt: page.createdAt,
    updatedAt: pub.publishedAt || page.updatedAt,
    publishedAt: pub.publishedAt || null,
  }
}

async function buildPublishedNavigation(homepage) {
  const store = await readPagesStore()
  const publishedPages = store.items
    .map(pagePublicView)
    .filter(Boolean)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))

  const headerFromPages = publishedPages
    .filter((p) => p.headerNav?.enabled)
    .map((p) => ({
      id: `page-${p.id}`,
      pageId: p.id,
      label: p.headerNav.label?.en || p.headerNav.label?.ar ? p.headerNav.label : p.title,
      href: `/${p.slug}`,
      sortOrder: p.headerNav.sortOrder ?? p.sortOrder ?? 0,
      openInNewTab: p.headerNav.openInNewTab === true,
      highlightAsCta: p.headerNav.highlightAsCta === true,
      showDesktop: p.headerNav.showDesktop !== false,
      showMobile: p.headerNav.showMobile !== false,
      active: true,
      source: 'cms-page',
    }))

  const headerFromConfig = Array.isArray(homepage?.header?.navLinks)
    ? homepage.header.navLinks.filter((l) => l && l.active !== false)
    : []

  const headerLinks = [...headerFromConfig, ...headerFromPages].sort(
    (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
  )

  const footerColumns = { product: [], industries: [], company: [], contact: [] }
  for (const p of publishedPages) {
    if (!p.footerNav?.enabled) continue
    const col = p.footerNav.column || 'company'
    if (!footerColumns[col]) continue
    footerColumns[col].push({
      id: `page-${p.id}`,
      pageId: p.id,
      label: p.footerNav.label?.en || p.footerNav.label?.ar ? p.footerNav.label : p.title,
      href: `/${p.slug}`,
      sortOrder: p.footerNav.sortOrder ?? p.sortOrder ?? 0,
      openInNewTab: p.footerNav.openInNewTab === true,
      active: true,
      source: 'cms-page',
    })
  }
  for (const col of Object.keys(footerColumns)) {
    footerColumns[col].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  }

  return {
    headerLinks,
    footerColumns,
    pages: publishedPages.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      headerEnabled: p.headerNav?.enabled === true,
      footerEnabled: p.footerNav?.enabled === true,
    })),
  }
}

async function readUsers() {
  return readJsonCached({
    readFile: readJsonFile,
    relPath: USERS_FILE,
  })
}

async function writeUsers(users) {
  await writeJsonFile(USERS_FILE, users)
}

async function readLeads() {
  return safeReadJson(LEADS_FILE, [])
}

async function writeLeads(leads) {
  await writeJsonFile(LEADS_FILE, leads)
}

function normalizeLead(row) {
  if (!row || typeof row !== 'object') return row
  const status = typeof row.status === 'string' ? row.status : 'New'
  return {
    ...row,
    internalNote: row.internalNote ?? '',
    sourcePage: row.sourcePage ?? '',
    countryCode: row.countryCode ?? '',
    localeCountry: row.localeCountry ?? '',
    localeLang: row.localeLang ?? '',
    source: row.source ?? '',
    company: row.company ?? '',
    productService: row.productService ?? '',
    assignedTo: row.assignedTo ?? '',
    followUpAt: row.followUpAt ?? '',
    updatedAt: row.updatedAt || row.createdAt || new Date().toISOString(),
    status: isDemoRequest(row)
      ? DEMO_REQUEST_STATUSES.has(status)
        ? status
        : status === 'Closed'
          ? 'Closed'
          : 'New'
      : LEAD_STATUSES.has(status)
        ? status
        : 'New',
  }
}

function isDemoRequest(row) {
  if (!row || typeof row !== 'object') return false
  const topic = String(row.topic || '').trim().toLowerCase()
  const sourcePage = String(row.sourcePage || '').toLowerCase()
  const source = String(row.source || '').toLowerCase()
  return (
    topic === 'demo' ||
    sourcePage.includes('header-get-demo') ||
    sourcePage.includes('get-demo') ||
    source.includes('get demo')
  )
}

function clientIp(req) {
  const fwd = req.headers['x-forwarded-for']
  if (typeof fwd === 'string' && fwd.trim()) return fwd.split(',')[0].trim()
  return req.ip || 'unknown'
}

function pruneLeadProtectionMaps(now = Date.now()) {
  for (const [k, at] of recentDemoFingerprints) {
    if (now - at > DEMO_DUPLICATE_WINDOW_MS) recentDemoFingerprints.delete(k)
  }
}

function demoSubmissionFingerprint(phone, email, topic) {
  const digits = String(phone || '').replace(/\D/g, '')
  return `${String(topic || '').trim().toLowerCase()}|${digits}|${String(email || '').trim().toLowerCase()}`
}

function isDuplicateDemoSubmission(phone, email, topic) {
  pruneLeadProtectionMaps()
  const key = demoSubmissionFingerprint(phone, email, topic)
  const prev = recentDemoFingerprints.get(key)
  return prev != null && Date.now() - prev < DEMO_DUPLICATE_WINDOW_MS
}

function markDemoSubmission(phone, email, topic) {
  recentDemoFingerprints.set(demoSubmissionFingerprint(phone, email, topic), Date.now())
}

function demoRequestsFromLeads(leads) {
  return leads.map(normalizeLead).filter(isDemoRequest)
}

function filterDemoRequests(leads, { q, status, from, to, page = 1, pageSize = 20 }) {
  let out = demoRequestsFromLeads(leads)
  if (status && DEMO_REQUEST_STATUSES.has(status)) out = out.filter((l) => l.status === status)
  if (q && String(q).trim()) {
    const s = String(q).toLowerCase()
    out = out.filter(
      (l) =>
        (l.name && l.name.toLowerCase().includes(s)) ||
        (l.email && l.email.toLowerCase().includes(s)) ||
        (l.phone && l.phone.includes(s)) ||
        (l.company && l.company.toLowerCase().includes(s)) ||
        (l.message && l.message.toLowerCase().includes(s)) ||
        (l.productService && l.productService.toLowerCase().includes(s)),
    )
  }
  if (from) {
    const t = new Date(from).getTime()
    out = out.filter((l) => new Date(l.createdAt).getTime() >= t)
  }
  if (to) {
    const t = new Date(to).getTime() + 86400000
    out = out.filter((l) => new Date(l.createdAt).getTime() < t)
  }
  out.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  const total = out.length
  const p = Math.max(1, Number(page) || 1)
  const size = Math.min(100, Math.max(1, Number(pageSize) || 20))
  const start = (p - 1) * size
  return { items: out.slice(start, start + size), total, page: p, pageSize: size }
}

function demoRequestStats(leads) {
  const demos = demoRequestsFromLeads(leads)
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = todayStart.getTime() + 86400000
  const followUpsDueToday = demos.filter((l) => {
    if (!l.followUpAt) return false
    const t = new Date(l.followUpAt).getTime()
    return t >= todayStart.getTime() && t < todayEnd
  }).length
  return {
    new: demos.filter((l) => l.status === 'New').length,
    contacted: demos.filter((l) => l.status === 'Contacted').length,
    demoScheduled: demos.filter((l) => l.status === 'Demo Scheduled').length,
    converted: demos.filter((l) => l.status === 'Converted').length,
    followUpsDueToday,
    total: demos.length,
  }
}

async function readContentMeta() {
  return safeReadJson(CONTENT_META_FILE, {})
}

async function touchContentMeta(sectionKey, email) {
  const meta = await readContentMeta()
  const prev = meta[sectionKey] || {}
  meta[sectionKey] = {
    createdAt: prev.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    updatedBy: email || '',
  }
  await writeJsonFile(CONTENT_META_FILE, meta)
}

async function readActivityLog() {
  return safeReadJson(ACTIVITY_FILE, [])
}

async function appendActivity({ action, section, description, adminEmail, adminName }) {
  const log = await readActivityLog()
  const entry = {
    id: nanoid(12),
    action,
    section: section || '',
    description: description || '',
    adminEmail: adminEmail || '',
    adminName: adminName || '',
    at: new Date().toISOString(),
  }
  log.unshift(entry)
  await writeJsonFile(ACTIVITY_FILE, log.slice(0, MAX_ACTIVITY))
}

async function readMediaIndex() {
  const raw = await safeReadJson(MEDIA_INDEX_FILE, { items: [] })
  if (!raw.items) raw.items = []
  return raw
}

async function writeMediaIndex(data) {
  await writeJsonFile(MEDIA_INDEX_FILE, data)
}

function defaultDataMeta() {
  const now = new Date().toISOString()
  return { createdAt: now, updatedAt: now, updatedBy: '' }
}

async function ensureDataFile(relPath, factory) {
  const full = path.join(DATA_DIR, relPath)
  try {
    await fs.access(full)
  } catch {
    const data = typeof factory === 'function' ? factory() : factory
    await writeJsonFile(relPath, data)
  }
}

async function ensureBootstrapFiles() {
  await fs.mkdir(UPLOADS_DIR, { recursive: true })
  await publishStore.ensurePublishedDir()
  await ensureDataFile(publishStore.PUBLISH_META_FILE, () => ({}))
  await ensureDataFile(MEDIA_INDEX_FILE, () => ({ items: [], _meta: defaultDataMeta() }))
  await ensureDataFile('whatsappSettings.json', () => ({
    show: true,
    active: true,
    phoneDigits: '',
    defaultMessage: {
      en: 'Hello, I want to know more about your services.',
      ar: 'مرحباً، أود معرفة المزيد عن خدماتكم.',
    },
    position: 'bottom-right',
    buttonLabel: { en: 'WhatsApp', ar: 'واتساب' },
    _meta: defaultDataMeta(),
  }))
  await ensureDataFile('emailSettings.json', () => ({
    enableEmailNotification: false,
    receiverEmail: '',
    ccEmail: '',
    bccEmail: '',
    fromEmail: 'noreply@localhost',
    fromName: 'Website',
    replyToField: 'customer',
    emailSubject: 'New lead from website',
    emailTemplateBody:
      'New enquiry:\n\nName: {{name}}\nEmail: {{email}}\nPhone: {{phone}}\nTopic: {{topic}}\nCompany: {{company}}\nMessage: {{message}}\nSource: {{sourcePage}}\n',
    _meta: defaultDataMeta(),
  }))
  await ensureDataFile('seo.json', () => ({
    pageTitle: { en: '', ar: '' },
    metaDescription: { en: '', ar: '' },
    metaKeywords: { en: '', ar: '' },
    ogImage: '',
    canonicalUrl: '',
    ogTitle: { en: '', ar: '' },
    ogDescription: { en: '', ar: '' },
    twitterTitle: { en: '', ar: '' },
    twitterDescription: { en: '', ar: '' },
    twitterImage: '',
    robotsIndex: 'index',
    robotsFollow: 'follow',
    _meta: defaultDataMeta(),
  }))
  await ensureDataFile('siteSettings.json', () => ({
    websiteName: { en: 'My Site', ar: '' },
    websiteTagline: { en: '', ar: '' },
    logoUrl: '',
    faviconUrl: '',
    primaryEmail: '',
    salesEmail: '',
    supportEmail: '',
    phoneDisplay: '',
    phoneHref: '',
    whatsappNumber: '',
    officeAddress: { en: '', ar: '' },
    workingHours: { en: '', ar: '' },
    googleMapLink: '',
    facebookUrl: '',
    linkedinUrl: '',
    instagramUrl: '',
    youtubeUrl: '',
    tiktokUrl: '',
    copyrightText: { en: '', ar: '' },
    _meta: defaultDataMeta(),
  }))
  await ensureDataFile(ACTIVITY_FILE, () => [])
  await ensureDataFile(SOFTWARE_DETAILS_FILE, () => ({ items: [], _meta: defaultDataMeta() }))

  try {
    const draftMigration = await migrateCmsSchemaV2({
      dataDir: DATA_DIR,
      readJsonFile,
      writeJsonFile,
      safeReadJson,
    })
    if (draftMigration.changed > 0) {
      console.log(`[cms-migrate] draft schema v2 updated ${draftMigration.changed} file(s)`)
      if (draftMigration.backupDir) console.log(`[cms-migrate] backup: ${draftMigration.backupDir}`)
    }

    const publishedMigration = await migrateCmsSchemaV2({
      dataDir: path.join(DATA_DIR, 'published'),
      readJsonFile: (relPath) => readJsonFile(`published/${relPath}`),
      writeJsonFile: (relPath, data) => writeJsonFile(`published/${relPath}`, data),
      safeReadJson: (relPath, fallback) => safeReadJson(`published/${relPath}`, fallback),
    })
    if (publishedMigration.changed > 0) {
      console.log(`[cms-migrate] published schema v2 updated ${publishedMigration.changed} file(s)`)
      clearHomepagePayloadCache()
    }
  } catch (err) {
    console.error('[cms-migrate] schema v2 migration failed — previous content retained', err?.message || err)
  }

  try {
    await ensureBlogBootstrap({ safeReadJson, writeJsonFile, defaultDataMeta })
  } catch (err) {
    console.error('[bootstrap] blog content files failed', err?.message || err)
  }

  try {
    await ensureCountriesBootstrap({ safeReadJson, writeJsonFile, defaultDataMeta })
  } catch (err) {
    console.error('[bootstrap] countries content files failed', err?.message || err)
  }

  try {
    await ensureLocaleBaselines({
      localeStorage,
      publishStore,
      safeReadJson,
      writeJsonFile,
      logActivity: appendActivity,
    })
  } catch (err) {
    console.error('[bootstrap] locale baselines failed', err?.message || err)
  }
}

async function readPagesStore() {
  const raw = await safeReadJson(PAGES_FILE, null)
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.items)) {
    return { _meta: {}, items: [] }
  }
  return raw
}

function normalizeSlugInput(s) {
  if (typeof s !== 'string') return ''
  return s.trim().replace(/^\/+/u, '').replace(/\/+$/u, '')
}

function isValidPageSlug(slug) {
  if (!slug || slug.length > 160) return false
  if (RESERVED_PAGE_SLUGS.has(slug.toLowerCase())) return false
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug)
}

function coerceBilingual(raw) {
  const o = raw && typeof raw === 'object' ? raw : {}
  return {
    en: typeof o.en === 'string' ? o.en : '',
    ar: typeof o.ar === 'string' ? o.ar : '',
  }
}

function normalizePageFromBody(body, prev) {
  const now = new Date().toISOString()
  const slug = normalizeSlugInput(body.slug)
  const base = prev || {}
  const title = coerceBilingual(body.title ?? base.title)
  const seo = coercePageSeo(body.seo, base.seo)
  const headerNav = coerceHeaderNav(
    body.headerNav ?? body.navigation?.header ?? base.headerNav ?? base.navigation?.header,
    body.headerNav?.label ?? title,
  )
  if (typeof body.showInMenu === 'boolean' && body.headerNav === undefined && body.navigation?.header === undefined) {
    headerNav.enabled = body.showInMenu
  }
  const footerNav = coerceFooterNav(
    body.footerNav ?? body.navigation?.footer ?? base.footerNav ?? base.navigation?.footer,
    title,
  )
  const heroCta = coerceHeroCta(body.heroCta ?? base.heroCta)
  const template = PAGE_TEMPLATES.has(body.template) ? body.template : base.template || 'blank'
  const sections =
    body.sections !== undefined ? normalizeSections(body.sections) : normalizeSections(base.sections || [])
  const metaTitle = coerceBilingual(body.metaTitle ?? seo.title ?? base.metaTitle)
  const metaDescription = coerceBilingual(body.metaDescription ?? seo.description ?? base.metaDescription)
  return {
    id: base.id,
    slug,
    pageType: PAGE_TYPES.has(body.pageType) ? body.pageType : base.pageType || 'custom',
    template,
    kind: base.kind || 'custom',
    status: PAGE_STATUSES.has(body.status) ? body.status : base.status || 'draft',
    language: PAGE_LANG_MODES.has(body.language) ? body.language : base.language || 'both',
    sortOrder: typeof body.sortOrder === 'number' && Number.isFinite(body.sortOrder) ? body.sortOrder : base.sortOrder ?? 0,
    showInMenu: headerNav.enabled,
    metaTitle,
    metaDescription,
    seo,
    title,
    heading: coerceBilingual(body.heading ?? base.heading),
    shortDescription: coerceBilingual(body.shortDescription ?? base.shortDescription),
    content: coerceBilingual(body.content ?? base.content),
    featuredImageUrl: typeof body.featuredImageUrl === 'string' ? body.featuredImageUrl : base.featuredImageUrl || '',
    navigation: { header: headerNav, footer: footerNav },
    headerNav,
    footerNav,
    heroCta,
    sections,
    publishedContent: base.publishedContent ?? null,
    publishedSections: base.publishedSections ?? null,
    lastPublishedAt: base.lastPublishedAt || null,
    createdAt: base.createdAt || now,
    updatedAt: now,
  }
}

function buildPublishedContentFromDraft(page, now = new Date().toISOString()) {
  syncNavigationFromLegacy(page)
  const seo = coercePageSeo(page.seo, null)
  return {
    slug: page.slug,
    pageType: page.pageType,
    template: page.template || 'blank',
    language: page.language,
    sortOrder: page.sortOrder,
    showInMenu: page.showInMenu,
    metaTitle: page.metaTitle,
    metaDescription: page.metaDescription,
    seo,
    title: page.title,
    heading: page.heading,
    shortDescription: page.shortDescription,
    content: page.content,
    featuredImageUrl: page.featuredImageUrl || '',
    headerNav: page.headerNav || defaultHeaderNav(),
    footerNav: page.footerNav || defaultFooterNav(),
    heroCta: page.heroCta || defaultHeroCta(),
    sections: normalizeSections(page.sections),
    publishedAt: now,
  }
}

function pageEditorialStatus(page) {
  if (!page?.publishedContent) return 'Draft'
  const pub = page.publishedContent
  const draftSections = normalizeSections(page.sections || [])
  const pubSections = normalizeSections(page.publishedSections || pub.sections || [])
  const changed =
    pub.slug !== page.slug ||
    JSON.stringify(pub.title) !== JSON.stringify(page.title) ||
    JSON.stringify(pub.content) !== JSON.stringify(page.content) ||
    JSON.stringify(pub.headerNav) !== JSON.stringify(page.headerNav) ||
    JSON.stringify(pub.footerNav) !== JSON.stringify(page.footerNav) ||
    JSON.stringify(pub.seo) !== JSON.stringify(page.seo) ||
    JSON.stringify(draftSections) !== JSON.stringify(pubSections) ||
    (pub.featuredImageUrl || '') !== (page.featuredImageUrl || '')
  if (page.status === 'draft' && page.publishedContent) return 'Unpublished Changes'
  if (page.status !== 'published') return changed ? 'Unpublished Changes' : 'Draft'
  return changed ? 'Unpublished Changes' : 'Published'
}

async function persistPagesStore(store, user, description) {
  const prevMeta = typeof store._meta === 'object' && store._meta ? store._meta : {}
  store._meta = {
    ...prevMeta,
    createdAt: prevMeta.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    updatedBy: user.email,
  }
  await writeJsonFile(PAGES_FILE, store)
  clearHomepagePayloadCache()
  await touchContentMeta('pages', user.email)
  await appendActivity({
    action: 'save',
    section: 'pages',
    description,
    adminEmail: user.email,
    adminName: user.name || '',
  })
}

async function readSoftwareDetailsStore() {
  const raw = await safeReadJson(SOFTWARE_DETAILS_FILE, null)
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.items)) {
    return { _meta: {}, items: [] }
  }
  return raw
}

function coerceStringArray(v) {
  if (!Array.isArray(v)) return []
  return v.map((x) => (typeof x === 'string' ? x : String(x ?? ''))).filter((s) => s.trim())
}

function coerceBilingualStringArrays(raw) {
  const o = raw && typeof raw === 'object' ? raw : {}
  return { en: coerceStringArray(o.en), ar: coerceStringArray(o.ar) }
}

function coerceFeatureList(raw) {
  if (!Array.isArray(raw)) return []
  return raw.map((row) => {
    const o = row && typeof row === 'object' ? row : {}
    return {
      icon: typeof o.icon === 'string' ? o.icon : 'Sparkles',
      title: coerceBilingual(o.title),
      description: coerceBilingual(o.description),
    }
  })
}

function coerceFaqList(raw) {
  if (!Array.isArray(raw)) return []
  return raw.map((row) => {
    const o = row && typeof row === 'object' ? row : {}
    return { q: coerceBilingual(o.q), a: coerceBilingual(o.a) }
  })
}

function coerceCapabilityList(raw) {
  if (!Array.isArray(raw)) return []
  return raw.map((row) => {
    const o = row && typeof row === 'object' ? row : {}
    return { title: coerceBilingual(o.title), body: coerceBilingual(o.body) }
  })
}

function coerceWorkflowList(raw) {
  if (!Array.isArray(raw)) return []
  return raw.map((row) => {
    const o = row && typeof row === 'object' ? row : {}
    return { step: coerceBilingual(o.step), detail: coerceBilingual(o.detail) }
  })
}

function coerceStringList(raw, fallback = []) {
  if (!Array.isArray(raw)) return fallback
  return raw.map((v) => (typeof v === 'string' ? v : ''))
}

function coerceSectionImages(raw, base) {
  const src = raw && typeof raw === 'object' ? raw : base?.sectionImages
  const fallback = {
    operational: ['', '', ''],
    benefitRows: ['', ''],
    businessTypes: ['', '', '', ''],
    testimonial: '',
  }
  if (!src || typeof src !== 'object') return fallback
  const operational = coerceStringList(src.operational, fallback.operational)
  const benefitRows = coerceStringList(src.benefitRows, fallback.benefitRows)
  const businessTypes = coerceStringList(src.businessTypes, fallback.businessTypes)
  return {
    operational: [operational[0] ?? '', operational[1] ?? '', operational[2] ?? ''],
    benefitRows: [benefitRows[0] ?? '', benefitRows[1] ?? ''],
    businessTypes: [businessTypes[0] ?? '', businessTypes[1] ?? '', businessTypes[2] ?? '', businessTypes[3] ?? ''],
    testimonial: typeof src.testimonial === 'string' ? src.testimonial : fallback.testimonial,
  }
}

function normalizeSoftwareDetailFromBody(body, prev) {
  const now = new Date().toISOString()
  const base = prev || {}
  const kind = SOFTWARE_KINDS.has(body.kind) ? body.kind : base.kind || 'module'
  const slug = normalizeSlugInput(body.slug ?? base.slug)
  const heroRaw = body.hero && typeof body.hero === 'object' ? body.hero : {}
  const ctaPrimaryRaw = heroRaw.ctaPrimary && typeof heroRaw.ctaPrimary === 'object' ? heroRaw.ctaPrimary : {}
  const ctaSecondaryRaw = heroRaw.ctaSecondary && typeof heroRaw.ctaSecondary === 'object' ? heroRaw.ctaSecondary : {}
  const demoRaw = body.demoCta && typeof body.demoCta === 'object' ? body.demoCta : {}

  return {
    id: base.id,
    kind,
    slug,
    active: typeof body.active === 'boolean' ? body.active : base.active ?? true,
    sortOrder:
      typeof body.sortOrder === 'number' && Number.isFinite(body.sortOrder) ? body.sortOrder : base.sortOrder ?? 0,
    icon: typeof body.icon === 'string' && body.icon.trim() ? body.icon.trim() : base.icon || 'Box',
    accentColor: ACCENT_COLORS.has(body.accentColor) ? body.accentColor : base.accentColor || 'orange',
    heroImageUrl: typeof body.heroImageUrl === 'string' ? body.heroImageUrl : base.heroImageUrl || '',
    sectionImages: coerceSectionImages(body.sectionImages, base),
    label: coerceBilingual(body.label ?? base.label),
    shortDescription: coerceBilingual(body.shortDescription ?? base.shortDescription),
    metaTitle: coerceBilingual(body.metaTitle ?? base.metaTitle),
    metaDescription: coerceBilingual(body.metaDescription ?? base.metaDescription),
    hero: {
      eyebrow: coerceBilingual(heroRaw.eyebrow ?? base.hero?.eyebrow),
      headline: coerceBilingual(heroRaw.headline ?? base.hero?.headline),
      subhead: coerceBilingual(heroRaw.subhead ?? base.hero?.subhead),
      intro: coerceBilingual(heroRaw.intro ?? base.hero?.intro),
      ctaPrimary: {
        label: coerceBilingual(ctaPrimaryRaw.label ?? base.hero?.ctaPrimary?.label),
        href:
          typeof ctaPrimaryRaw.href === 'string' && ctaPrimaryRaw.href.trim()
            ? ctaPrimaryRaw.href.trim()
            : base.hero?.ctaPrimary?.href || '/contact',
      },
      ctaSecondary: {
        label: coerceBilingual(ctaSecondaryRaw.label ?? base.hero?.ctaSecondary?.label),
        href:
          typeof ctaSecondaryRaw.href === 'string' && ctaSecondaryRaw.href.trim()
            ? ctaSecondaryRaw.href.trim()
            : base.hero?.ctaSecondary?.href || '/#modules',
      },
    },
    highlights: coerceBilingualStringArrays(body.highlights ?? base.highlights),
    capabilities: coerceCapabilityList(body.capabilities ?? base.capabilities),
    workflows: coerceWorkflowList(body.workflows ?? base.workflows),
    outcomes: coerceBilingualStringArrays(body.outcomes ?? base.outcomes),
    features: coerceFeatureList(body.features ?? base.features),
    faqs: coerceFaqList(body.faqs ?? base.faqs),
    demoCta: {
      heading: coerceBilingual(demoRaw.heading ?? base.demoCta?.heading),
      sub: coerceBilingual(demoRaw.sub ?? base.demoCta?.sub),
    },
    isCustom: typeof body.isCustom === 'boolean' ? body.isCustom : base.isCustom ?? false,
    createdAt: base.createdAt || now,
    updatedAt: now,
  }
}

async function persistSoftwareDetailsStore(store, user, description) {
  const prevMeta = typeof store._meta === 'object' && store._meta ? store._meta : {}
  store._meta = {
    ...prevMeta,
    createdAt: prevMeta.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    updatedBy: user.email,
  }
  await writeJsonFile(SOFTWARE_DETAILS_FILE, store)
  await appendActivity({
    action: 'save',
    section: 'softwareDetails',
    description,
    adminEmail: user.email,
    adminName: user.name || '',
  })
}

function authMiddleware(req, res, next) {
  const h = req.headers.authorization
  const token = h?.startsWith('Bearer ') ? h.slice(7) : null
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

function normalizeAdminRole(role) {
  const r = String(role ?? 'Admin').trim().toLowerCase()
  if (r === 'super admin' || r === 'superadmin') return 'Super Admin'
  if (r === 'editor') return 'Editor'
  return 'Admin'
}

function isSuperAdminRole(role) {
  return normalizeAdminRole(role) === 'Super Admin'
}

function superAdminMiddleware(req, res, next) {
  if (!isSuperAdminRole(req.user?.role)) {
    res.status(403).json({ error: 'Super Admin access required' })
    return
  }
  next()
}

function normalizeUserStatus(status) {
  return status === 'Inactive' ? 'Inactive' : 'Active'
}

function sanitizeUserResponse(u) {
  return {
    id: u.id,
    email: u.email,
    name: u.name || '',
    role: normalizeAdminRole(u.role),
    status: normalizeUserStatus(u.status),
    profileImageUrl: u.profileImageUrl || '',
  }
}

function validatePasswordPair(newPassword, confirmPassword, res) {
  if (typeof newPassword !== 'string' || typeof confirmPassword !== 'string') {
    res.status(400).json({ error: 'Password fields required' })
    return false
  }
  if (newPassword.length < 8) {
    res.status(400).json({ error: 'New password must be at least 8 characters' })
    return false
  }
  if (newPassword !== confirmPassword) {
    res.status(400).json({ error: 'Passwords do not match' })
    return false
  }
  return true
}

async function handleProfileChangePassword(req, res) {
  const { currentPassword, newPassword, confirmPassword } = req.body ?? {}
  if (typeof currentPassword !== 'string' || typeof newPassword !== 'string' || typeof confirmPassword !== 'string') {
    res.status(400).json({ error: 'All fields required' })
    return
  }
  if (!currentPassword.trim()) {
    res.status(400).json({ error: 'Current password is required' })
    return
  }
  if (!validatePasswordPair(newPassword, confirmPassword, res)) return

  const users = await readUsers()
  const idx = users.findIndex((x) => x.id === req.user.sub || x.email === req.user.email)
  if (idx === -1) {
    res.status(404).json({ error: 'User not found' })
    return
  }
  if (!(await bcrypt.compare(currentPassword, users[idx].passwordHash))) {
    res.status(400).json({ error: 'Current password is incorrect' })
    return
  }
  users[idx] = { ...users[idx], passwordHash: await bcrypt.hash(newPassword, 10) }
  await writeUsers(users)
  await appendActivity({
    action: 'password_changed',
    section: 'admin',
    description: 'Password changed',
    adminEmail: req.user.email,
    adminName: users[idx].name || '',
  })
  res.json({ ok: true, message: 'Password updated successfully' })
}

async function trySendLeadEmail(lead, settings) {
  if (!settings?.enableEmailNotification) return
  const smtp = resolveSmtpConfig()
  const to = (settings.receiverEmail || smtp.receiverEmail || '').trim()
  if (!to) {
    console.warn('[lead email] skipped — set receiver email in admin or CONTACT_RECEIVER_EMAIL')
    return
  }
  const subj = (settings.emailSubject || 'New lead').replace(/\{\{(\w+)\}\}/g, (_, k) => String(lead[k] ?? ''))
  let body = settings.emailTemplateBody || ''
  for (const k of ['name', 'email', 'phone', 'topic', 'company', 'message', 'sourcePage', 'source']) {
    body = body.split(`{{${k}}}`).join(String(lead[k] ?? ''))
  }
  const from = (settings.fromEmail || smtp.fromEmail || 'noreply@localhost').trim()
  const replyTo = settings.replyToField === 'customer' ? lead.email : from
  if (!smtp.host) {
    console.warn('[lead email] skipped — SMTP_HOST is not configured')
    return
  }
  if (!smtp.ok) {
    console.warn(`[lead email] skipped — missing SMTP env: ${smtp.missing.join(', ')}`)
    return
  }
  try {
    const transport = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: { user: smtp.user, pass: smtp.pass },
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 8000,
    })
    await transport.sendMail({
      from: `"${settings.fromName || 'Site'}" <${from}>`,
      to,
      cc: (settings.ccEmail || '').trim() || undefined,
      bcc: (settings.bccEmail || '').trim() || undefined,
      replyTo,
      subject: subj,
      text: body,
    })
  } catch (e) {
    console.error('[lead email]', e.message || e)
  }
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').slice(0, 8) || '.bin'
    cb(null, `${nanoid(10)}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 6 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (IMAGE_MIMES.has(file.mimetype)) cb(null, true)
    else cb(new Error('Unsupported file type'))
  },
})

function registerMediaUploadRoute(routePath) {
  app.post(routePath, authMiddleware, (req, res) => {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        res.status(400).json({ error: err.message || 'Upload failed' })
        return
      }
      if (!req.file) {
        res.status(400).json({ error: 'file field required' })
        return
      }
      const url = `/uploads/${req.file.filename}`
      const stat = await fs.stat(path.join(UPLOADS_DIR, req.file.filename)).catch(() => null)
      const entry = {
        id: nanoid(10),
        url,
        filename: req.file.filename,
        originalName: req.file.originalname || req.file.filename,
        size: stat?.size ?? 0,
        uploadedAt: new Date().toISOString(),
      }
      const idx = await readMediaIndex()
      idx.items = [entry, ...(idx.items || [])]
      await writeMediaIndex(idx)
      await appendActivity({
        action: 'media_upload',
        section: 'media',
        description: entry.filename,
        adminEmail: req.user.email,
        adminName: req.user.name || '',
      })
      res.status(201).json(entry)
    })
  })
}

app.use('/uploads', express.static(UPLOADS_DIR))

app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next()
  if (!bootstrapReady) {
    res.status(503).json({
      error: bootstrapError || 'CMS storage is initializing — please retry shortly',
    })
    return
  }
  next()
})

app.use(publicApiV1RewriteMiddleware)
app.use(publicApiDeprecationMiddleware)
app.use(createPublicGetRateLimitMiddleware(clientIp))

app.get('/api/health', async (_req, res) => {
  const t0 = Date.now()
  let dataDirReadable = false
  let dataDirMs = null
  try {
    await Promise.race([
      fs.access(DATA_DIR),
      new Promise((_, reject) => setTimeout(() => reject(new Error('DATA_DIR_TIMEOUT')), 3000)),
    ])
    dataDirReadable = true
    dataDirMs = Date.now() - t0
  } catch (e) {
    dataDirMs = Date.now() - t0
    console.warn('[health] data dir check failed:', e instanceof Error ? e.message : e)
  }
  const assetsDir = path.join(DIST_DIR, 'assets')
  let distAssets = 0
  try {
    const names = await fs.readdir(assetsDir)
    distAssets = names.length
  } catch {
    distAssets = -1
  }
  const ok = bootstrapReady && dataDirReadable
  res.status(ok ? 200 : 503).json({
    ok,
    bootstrapReady,
    bootstrapError,
    dataDirReadable,
    dataDirCheckMs: dataDirMs,
    distAssets,
    serveStatic: SERVE_STATIC,
    uptimeSec: Math.floor((Date.now() - serverStartedAt) / 1000),
    time: new Date().toISOString(),
    cache: jsonCacheStats(),
    env: envConfigSummary(),
  })
})

function isStorageTimeoutError(e) {
  const msg = e instanceof Error ? e.message : String(e)
  return msg.includes('_TIMEOUT') || msg.includes('DATA_DIR')
}

app.get('/api/homepage', async (req, res) => {
  try {
    const countryCode = normalizeCountryCode(req.query.country || req.query.countryCode || 'AE')
    const lang = normalizeLocaleLang(req.query.lang || req.query.language || 'en')
    let out
    if (countryCode === 'AE' && lang === 'en') {
      out = await loadPublishedHomepagePayload()
    } else {
      out = await buildLocaleHomepagePayload(
        {
          publishStore,
          readPublishedLocaleStore: () => localePublish.readPublishedStore(),
          loadPublishedHomepagePayload,
          dataFiles: DATA_FILES,
          extraHomepageFiles: EXTRA_HOMEPAGE_FILES,
        },
        countryCode,
        lang,
        {
          buildNavigation: (homepage) => buildPublishedNavigation(homepage),
          buildMeta: () => buildHomepageMeta(),
        },
      )
    }
    sendPublicJson(res, out)
  } catch (e) {
    if (isStorageTimeoutError(e)) {
      res.status(503).json({ error: 'Content storage temporarily unavailable' })
      return
    }
    console.error(e)
    res.status(500).json({ error: 'Failed to load homepage data' })
  }
})

app.get('/api/public/site', async (_req, res) => {
  try {
    const out = await loadPublishedHomepagePayload()
    sendPublicJson(res, out)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load site' })
  }
})

app.get('/api/public/homepage', async (_req, res) => {
  try {
    const out = await loadPublishedHomepagePayload()
    sendPublicJson(res, out)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load homepage data' })
  }
})

app.get('/api/public/navigation', async (_req, res) => {
  try {
    const home = await loadPublishedHomepagePayload()
    sendPublicJson(res, home.navigation || { headerLinks: [], footerColumns: {}, pages: [] })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load navigation' })
  }
})

app.get('/api/public/pages', async (_req, res) => {
  try {
    const store = await readPagesStore()
    const items = store.items.map(pagePublicView).filter(Boolean)
    sendPublicJson(res, { items })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load pages' })
  }
})

app.get('/api/public/pages/:slug', async (req, res) => {
  try {
    const slug = normalizeSlugInput(req.params.slug)
    if (!slug || !isValidPageSlug(slug)) {
      sendPublicJson(res, { error: 'Not found' }, 404)
      return
    }
    const store = await readPagesStore()
    const item = store.items.find((p) => {
      const view = pagePublicView(p)
      return view && view.slug.toLowerCase() === slug.toLowerCase()
    })
    const view = pagePublicView(item)
    if (!view) {
      sendPublicJson(res, { error: 'Not found' }, 404)
      return
    }
    sendPublicJson(res, { page: view })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load page' })
  }
})

app.get('/api/page/:slug', async (req, res) => {
  try {
    const slug = normalizeSlugInput(req.params.slug)
    if (!slug || !isValidPageSlug(slug)) {
      sendPublicJson(res, { error: 'Not found' }, 404)
      return
    }
    const store = await readPagesStore()
    // Prefer publishedContent snapshot; fall back to legacy status===published rows
    let view = null
    for (const p of store.items) {
      const pub = pagePublicView(p)
      if (pub && pub.slug.toLowerCase() === slug.toLowerCase()) {
        view = pub
        break
      }
      if (
        !p.publishedContent &&
        p.status === 'published' &&
        p.slug.toLowerCase() === slug.toLowerCase()
      ) {
        view = { ...p, publishedAt: p.updatedAt }
        break
      }
    }
    if (!view) {
      sendPublicJson(res, { error: 'Not found' }, 404)
      return
    }
    sendPublicJson(res, { page: view })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load page' })
  }
})

app.get('/api/site-settings', async (_req, res) => {
  try {
    const [header, seo, footer, siteSettings] = await Promise.all([
      publishStore.readPublished('header.json'),
      publishStore.readPublished('seo.json'),
      publishStore.readPublished('footer.json'),
      publishStore.readPublished('siteSettings.json'),
    ])
    sendPublicJson(res, {
      header: publishStore.stripMeta(header) ?? {},
      seo: publishStore.stripMeta(seo) ?? {},
      footer: publishStore.stripMeta(footer) ?? {},
      siteSettings: publishStore.stripMeta(siteSettings) ?? {},
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load site settings' })
  }
})

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

app.post('/api/leads', async (req, res) => {
  try {
    const leadLimit = checkLeadRateLimit(req, clientIp)
    if (!leadLimit.allowed) {
      rateLimitedError(res, 'Too many submissions. Please wait a few minutes and try again.', {
        retryAfterSeconds: leadLimit.retryAfterSeconds,
        limit: leadLimit.limit,
        remaining: 0,
        resetAt: leadLimit.resetAt,
      })
      return
    }
    setRateLimitHeaders(res, leadLimit)
    const { name, email, phone, message, topic, company, sourcePage, source, productService, countryCode, localeCountry, localeLang } = req.body ?? {}
    const emailStr = typeof email === 'string' ? email.trim() : ''
    const phoneStr = typeof phone === 'string' ? phone.trim() : ''
    const sourceStr = typeof source === 'string' ? source.trim() : ''
    const topicStr = typeof topic === 'string' ? topic.trim() : ''
    const isDetailPageRequest = sourceStr === 'Detail Page Request'
    const isDemo = topicStr.toLowerCase() === 'demo' || sourceStr.toLowerCase().includes('get demo')
    if (!emailRe.test(emailStr)) {
      validationError(res, 'Valid email is required.')
      return
    }
    if (!isDetailPageRequest && (!phoneStr || phoneStr.length < 6)) {
      validationError(res, 'Phone is required.')
      return
    }
    if (isDemo && typeof name === 'string' && !name.trim()) {
      validationError(res, 'Name is required for demo requests.')
      return
    }
    if (isDemo && isDuplicateDemoSubmission(phoneStr, emailStr, topicStr)) {
      conflictError(res, 'A demo request with this phone number was just submitted. Please wait a few minutes.')
      return
    }
    const leads = (await readLeads()).map(normalizeLead)
    const now = new Date().toISOString()
    const row = normalizeLead({
      id: nanoid(12),
      name: typeof name === 'string' ? name.trim() : '',
      email: emailStr,
      phone: phoneStr,
      message: typeof message === 'string' ? message.trim() : '',
      topic: topicStr,
      company: typeof company === 'string' ? company.trim() : '',
      productService: typeof productService === 'string' ? productService.trim() : '',
      source: sourceStr,
      sourcePage: typeof sourcePage === 'string' ? sourcePage.trim().slice(0, 500) : '',
      countryCode: typeof countryCode === 'string' ? countryCode.trim().toUpperCase().slice(0, 3) : '',
      localeCountry: typeof localeCountry === 'string' ? localeCountry.trim().toLowerCase().slice(0, 3) : '',
      localeLang: typeof localeLang === 'string' && localeLang.trim() === 'ar' ? 'ar' : typeof localeLang === 'string' ? 'en' : '',
      status: 'New',
      internalNote: '',
      assignedTo: '',
      followUpAt: '',
      createdAt: now,
      updatedAt: now,
    })
    leads.unshift(row)
    await writeLeads(leads)
    if (isDemo) markDemoSubmission(phoneStr, emailStr, topicStr)
    const emailSettings = await safeReadJson('emailSettings.json', {})
    trySendLeadEmail(row, emailSettings).catch(() => {})
    res.status(201).json({ ok: true, id: row.id })
  } catch (e) {
    if (isStorageTimeoutError(e)) {
      serviceUnavailableError(res, 'Could not save lead — storage temporarily unavailable.')
      return
    }
    console.error(e)
    internalError(res, 'Could not save lead.')
  }
})

app.post('/api/admin/auth/login', async (req, res) => {
  try {
    if (isProduction() && !isAuthSecretConfigured()) {
      res.status(503).json({ error: 'Server misconfigured: AUTH_SECRET (or JWT_SECRET) is not set' })
      return
    }
    const { email, password, rememberMe } = req.body ?? {}
    if (typeof email !== 'string' || typeof password !== 'string') {
      res.status(400).json({ error: 'Email and password required' })
      return
    }
    const users = await readUsers()
    const user = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }
    if (user.status && user.status !== 'Active') {
      res.status(403).json({ error: 'Account is not active' })
      return
    }
    const expiresIn = rememberMe === true ? '30d' : '7d'
    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role, name: user.name || '' },
      JWT_SECRET,
      { expiresIn },
    )
    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role, name: user.name || '' },
    })
    appendActivity({
      action: 'login',
      section: 'auth',
      description: 'Admin signed in',
      adminEmail: user.email,
      adminName: user.name || '',
    }).catch((e) => console.error('[login activity]', e))
  } catch (e) {
    if (isStorageTimeoutError(e)) {
      res.status(503).json({ error: 'Auth storage temporarily unavailable' })
      return
    }
    console.error(e)
    res.status(500).json({ error: 'Login failed' })
  }
})

app.post('/api/admin/auth/logout', authMiddleware, async (req, res) => {
  try {
    await appendActivity({
      action: 'logout',
      section: 'auth',
      description: 'Admin signed out',
      adminEmail: req.user.email,
      adminName: req.user.name || '',
    })
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Logout failed' })
  }
})

app.get('/api/admin/me', authMiddleware, async (req, res) => {
  try {
    const users = await readUsers()
    const u = users.find((x) => x.id === req.user.sub || x.email === req.user.email)
    if (!u) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    res.json({
      user: {
        id: u.id,
        email: u.email,
        name: u.name || '',
        profileImageUrl: u.profileImageUrl || '',
        role: normalizeAdminRole(u.role),
      },
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed' })
  }
})

/** Session check — same user payload as GET /api/admin/me */
app.get('/api/admin/auth/session', authMiddleware, async (req, res) => {
  try {
    const users = await readUsers()
    const u = users.find((x) => x.id === req.user.sub || x.email === req.user.email)
    if (!u) {
      res.status(401).json({ error: 'Session invalid' })
      return
    }
    res.json({
      ok: true,
      user: {
        id: u.id,
        email: u.email,
        name: u.name || '',
        profileImageUrl: u.profileImageUrl || '',
        role: normalizeAdminRole(u.role),
      },
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Session check failed' })
  }
})

app.get('/api/admin/users', authMiddleware, superAdminMiddleware, async (_req, res) => {
  try {
    const users = await readUsers()
    res.json(users.map((u) => sanitizeUserResponse(u)))
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load users' })
  }
})

app.post('/api/admin/users', authMiddleware, superAdminMiddleware, async (req, res) => {
  try {
    const { email, name, password, confirmPassword, role } = req.body ?? {}
    if (typeof email !== 'string' || !email.trim().includes('@')) {
      res.status(400).json({ error: 'Valid email is required' })
      return
    }
    if (!validatePasswordPair(password, confirmPassword, res)) return

    const users = await readUsers()
    const emailNorm = email.trim().toLowerCase()
    if (users.some((u) => String(u.email).toLowerCase() === emailNorm)) {
      res.status(400).json({ error: 'Email already in use' })
      return
    }

    const row = {
      id: nanoid(12),
      email: email.trim(),
      name: typeof name === 'string' ? name.trim().slice(0, 120) : '',
      profileImageUrl: '',
      passwordHash: await bcrypt.hash(password, 10),
      role: normalizeAdminRole(role),
      status: 'Active',
    }
    users.push(row)
    await writeUsers(users)
    await appendActivity({
      action: 'user_created',
      section: 'admin',
      description: `Created user ${row.email}`,
      adminEmail: req.user.email,
      adminName: req.user.name || '',
    })
    res.status(201).json({ ok: true, user: sanitizeUserResponse(row) })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to create user' })
  }
})

app.patch('/api/admin/users/:id', authMiddleware, superAdminMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, role, status } = req.body ?? {}
    const users = await readUsers()
    const idx = users.findIndex((u) => u.id === id)
    if (idx === -1) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    const target = users[idx]
    const nextRole = role !== undefined ? normalizeAdminRole(role) : normalizeAdminRole(target.role)
    const nextStatus = status !== undefined ? normalizeUserStatus(status) : normalizeUserStatus(target.status)

    if (target.id === req.user.sub && nextStatus === 'Inactive') {
      res.status(400).json({ error: 'You cannot deactivate your own account' })
      return
    }
    if (target.id === req.user.sub && !isSuperAdminRole(nextRole)) {
      res.status(400).json({ error: 'You cannot change your own role' })
      return
    }

    if (isSuperAdminRole(target.role) && !isSuperAdminRole(nextRole)) {
      const otherSupers = users.filter((u) => u.id !== id && isSuperAdminRole(u.role) && normalizeUserStatus(u.status) === 'Active')
      if (otherSupers.length === 0) {
        res.status(400).json({ error: 'At least one active Super Admin is required' })
        return
      }
    }

    if (typeof email === 'string') {
      const emailNorm = email.trim().toLowerCase()
      if (!emailNorm.includes('@')) {
        res.status(400).json({ error: 'Valid email is required' })
        return
      }
      if (users.some((u) => u.id !== id && String(u.email).toLowerCase() === emailNorm)) {
        res.status(400).json({ error: 'Email already in use' })
        return
      }
      target.email = email.trim()
    }

    if (typeof name === 'string') target.name = name.trim().slice(0, 120)
    target.role = nextRole
    target.status = nextStatus
    users[idx] = target
    await writeUsers(users)
    await appendActivity({
      action: 'user_updated',
      section: 'admin',
      description: `Updated user ${target.email}`,
      adminEmail: req.user.email,
      adminName: req.user.name || '',
    })
    res.json({ ok: true, user: sanitizeUserResponse(target) })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to update user' })
  }
})

app.post('/api/admin/users/:id/reset-password', authMiddleware, superAdminMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { newPassword, confirmPassword } = req.body ?? {}
    if (!validatePasswordPair(newPassword, confirmPassword, res)) return

    const users = await readUsers()
    const idx = users.findIndex((u) => u.id === id)
    if (idx === -1) {
      res.status(404).json({ error: 'User not found' })
      return
    }

    users[idx] = { ...users[idx], passwordHash: await bcrypt.hash(newPassword, 10) }
    await writeUsers(users)
    await appendActivity({
      action: 'password_reset',
      section: 'admin',
      description: `Reset password for ${users[idx].email}`,
      adminEmail: req.user.email,
      adminName: req.user.name || '',
    })
    res.json({ ok: true, message: 'Password reset successfully' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to reset password' })
  }
})

app.patch('/api/admin/me/profile', authMiddleware, async (req, res) => {
  try {
    const { name, profileImageUrl } = req.body ?? {}
    const users = await readUsers()
    const idx = users.findIndex((x) => x.id === req.user.sub || x.email === req.user.email)
    if (idx === -1) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    users[idx] = {
      ...users[idx],
      name: typeof name === 'string' ? name.trim().slice(0, 120) : users[idx].name,
      profileImageUrl: typeof profileImageUrl === 'string' ? profileImageUrl.trim().slice(0, 500) : users[idx].profileImageUrl,
    }
    await writeUsers(users)
    await appendActivity({
      action: 'profile_updated',
      section: 'admin',
      description: 'Profile updated',
      adminEmail: req.user.email,
      adminName: users[idx].name || '',
    })
    res.json({ ok: true, user: { id: users[idx].id, email: users[idx].email, name: users[idx].name, profileImageUrl: users[idx].profileImageUrl } })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Update failed' })
  }
})

app.post('/api/admin/me/change-password', authMiddleware, async (req, res) => {
  try {
    await handleProfileChangePassword(req, res)
  } catch (e) {
    console.error(e)
    if (!res.headersSent) res.status(500).json({ error: 'Failed' })
  }
})

app.post('/api/admin/profile/change-password', authMiddleware, async (req, res) => {
  try {
    await handleProfileChangePassword(req, res)
  } catch (e) {
    console.error(e)
    if (!res.headersSent) res.status(500).json({ error: 'Failed' })
  }
})

function pickEn(b) {
  if (!b || typeof b !== 'object') return ''
  return String(b.en ?? '').trim()
}

function buildContentStatusPanel(header, hero, footer, seo, wa, email) {
  const headerOk = !!(header?.logoUrl && pickEn(header?.nav?.home))
  const heroOk = !!pickEn(hero?.title)
  const footerOk = !!(footer?.productLinks?.length || pickEn(footer?.tagline))
  const seoOk = !!(pickEn(seo?.pageTitle) && pickEn(seo?.metaDescription))
  const waDigits = String(wa?.phoneDigits ?? '').replace(/\D/g, '')
  const waOn = !!(wa?.show && wa?.active !== false && waDigits.length >= 8)
  const recv = String(email?.receiverEmail ?? '').trim()
  const formReady = recv.includes('@')
  return [
    { id: 'header', label: 'Header Configured', badge: headerOk ? 'complete' : 'missing' },
    { id: 'hero', label: 'Hero Section Ready', badge: heroOk ? 'complete' : 'missing' },
    { id: 'footer', label: 'Footer Configured', badge: footerOk ? 'complete' : 'missing' },
    { id: 'seo', label: 'SEO Configured', badge: seoOk ? 'complete' : 'missing' },
    { id: 'whatsapp', label: 'WhatsApp Active', badge: waOn ? 'active' : 'inactive' },
    { id: 'contact', label: 'Contact Form Ready', badge: formReady ? 'complete' : 'missing' },
  ]
}

/** Safe empty dashboard payload — always valid JSON with zero counts. */
function emptyAdminDashboardResponse(healthOverrides = {}) {
  return {
    success: true,
    cards: {
      sectionsTotal: 0,
      erpModulesTotal: 0,
      erpModulesActive: 0,
      industriesTotal: 0,
      industriesActive: 0,
      faqsTotal: 0,
      faqsActive: 0,
      leadsTotal: 0,
      leadsNew: 0,
      leadsContacted: 0,
      leadsClosed: 0,
      demoRequests: {
        new: 0,
        contacted: 0,
        demoScheduled: 0,
        converted: 0,
        followUpsDueToday: 0,
        total: 0,
      },
      mediaFiles: 0,
      detailPagesTotal: 0,
      usersTotal: 0,
      lastUpdatedGlob: null,
    },
    contentStatus: buildContentStatusPanel({}, {}, {}, {}, {}, {}),
    recentLeads: [],
    recentActivity: [],
    recentSections: [],
    recentMedia: [],
    health: {
      api: true,
      dataFiles: false,
      mediaUploads: false,
      frontend: true,
      ...healthOverrides,
    },
  }
}

async function sendAdminSummary(_req, res) {
  try {
    let dataFilesOk = true
    let mediaUploadsOk = true
    try {
      await readJsonFile('header.json')
    } catch {
      dataFilesOk = false
    }
    try {
      await fs.access(UPLOADS_DIR, fs.constants.W_OK)
    } catch {
      mediaUploadsOk = false
    }
    const [
      modules,
      industries,
      faqs,
      leads,
      mediaIdx,
      meta,
      activity,
      header,
      hero,
      footer,
      seo,
      wa,
      email,
      pageSections,
      pagesDoc,
      users,
    ] = await Promise.all([
      readJsonFile('modules.json'),
      readJsonFile('industries.json'),
      readJsonFile('faqs.json'),
      readLeads(),
      readMediaIndex(),
      readContentMeta(),
      readActivityLog(),
      safeReadJson('header.json', {}),
      safeReadJson('hero.json', {}),
      safeReadJson('footer.json', {}),
      safeReadJson('seo.json', {}),
      safeReadJson('whatsappSettings.json', {}),
      safeReadJson('emailSettings.json', {}),
      safeReadJson('pageSections.json', { sections: [] }),
      safeReadJson('pages.json', { items: [] }),
      readUsers(),
    ])
    const modItems = modules.items || []
    const indItems = industries.items || []
    const faqItems = faqs.items || []
    const countActive = (arr) => arr.filter((x) => x.active !== false).length
    const normLeads = leads.map(normalizeLead)
    const lastUpdated = Object.values(meta)
      .map((m) => m.updatedAt)
      .filter(Boolean)
      .sort()
      .pop()
    const pageItems = Array.isArray(pagesDoc.items) ? pagesDoc.items : []
    const userRows = Array.isArray(users) ? users : []
    const sectionsArr = Array.isArray(pageSections.sections) ? pageSections.sections : []
    const sectionsTotal = sectionsArr.length
    const contentStatus = buildContentStatusPanel(header, hero, footer, seo, wa, email)
    res.json({
      success: true,
      cards: {
        sectionsTotal,
        erpModulesTotal: modItems.length,
        erpModulesActive: countActive(modItems),
        industriesTotal: indItems.length,
        industriesActive: countActive(indItems),
        faqsTotal: faqItems.length,
        faqsActive: countActive(faqItems),
        leadsTotal: normLeads.filter((l) => !isDemoRequest(l)).length,
        leadsNew: normLeads.filter((l) => !isDemoRequest(l) && l.status === 'New').length,
        leadsContacted: normLeads.filter((l) => !isDemoRequest(l) && l.status === 'Contacted').length,
        leadsClosed: normLeads.filter((l) => !isDemoRequest(l) && l.status === 'Closed').length,
        demoRequests: demoRequestStats(normLeads),
        mediaFiles: mediaIdx.items?.length ?? 0,
        detailPagesTotal: pageItems.length,
        usersTotal: userRows.length,
        lastUpdatedGlob: lastUpdated || null,
      },
      contentStatus,
      recentLeads: normLeads.slice(0, 8).map((l) => ({
        id: l.id,
        name: l.name,
        email: l.email,
        phone: l.phone,
        message: l.message,
        source: l.source ?? '',
        sourcePage: l.sourcePage,
        status: l.status,
        createdAt: l.createdAt,
      })),
      recentActivity: activity.slice(0, 12),
      recentSections: Object.entries(meta)
        .map(([k, v]) => ({ section: k, updatedAt: v.updatedAt, updatedBy: v.updatedBy }))
        .filter((x) => x.updatedAt)
        .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
        .slice(0, 8),
      recentMedia: (mediaIdx.items || []).slice(0, 5),
      health: {
        api: true,
        dataFiles: dataFilesOk,
        mediaUploads: mediaUploadsOk,
        frontend: true,
      },
    })
  } catch (e) {
    console.error('Admin summary error:', e)
    res.status(200).json(emptyAdminDashboardResponse())
  }
}

app.get('/api/admin/summary', authMiddleware, sendAdminSummary)
app.get('/api/admin/cms-summary', authMiddleware, sendAdminSummary)

app.get('/api/admin/dashboard', authMiddleware, async (_req, res) => {
  try {
    const [modules, industries, faqs, leads, mediaIdx] = await Promise.all([
      readJsonFile('modules.json'),
      readJsonFile('industries.json'),
      readJsonFile('faqs.json'),
      readLeads(),
      readMediaIndex(),
    ])
    const items = (x) => (Array.isArray(x) ? x : [])
    const modItems = items(modules.items)
    const indItems = items(industries.items)
    const faqItems = items(faqs.items)
    const countActive = (arr) => arr.filter((x) => x.active !== false).length
    const normLeads = leads.map(normalizeLead)
    const contactLeads = normLeads.filter((l) => !isDemoRequest(l))
    res.json({
      erpModules: countActive(modItems),
      erpModulesTotal: modItems.length,
      industrySolutions: countActive(indItems),
      industrySolutionsTotal: indItems.length,
      faqs: countActive(faqItems),
      leads: contactLeads.length,
      newLeads: contactLeads.filter((l) => l.status === 'New').length,
      contactedLeads: contactLeads.filter((l) => l.status === 'Contacted').length,
      closedLeads: contactLeads.filter((l) => l.status === 'Closed').length,
      demoRequests: demoRequestStats(normLeads),
      mediaFiles: mediaIdx.items?.length ?? 0,
      ctaSections: 2,
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Dashboard load failed' })
  }
})

app.get('/api/admin/system/health', authMiddleware, async (_req, res) => {
  let dataOk = true
  let uploadsOk = true
  try {
    await readJsonFile('header.json')
  } catch {
    dataOk = false
  }
  try {
    await fs.access(UPLOADS_DIR, fs.constants.W_OK)
  } catch {
    uploadsOk = false
  }
  res.json({ api: true, dataFiles: dataOk, mediaUploads: uploadsOk, frontend: true })
})

app.get('/api/admin/activity', authMiddleware, async (_req, res) => {
  res.json(await readActivityLog())
})

app.get('/api/admin/content-meta', authMiddleware, async (_req, res) => {
  res.json(await readContentMeta())
})

app.get('/api/admin/data/:key', authMiddleware, async (req, res) => {
  const { key } = req.params
  if (!ADMIN_KEYS.has(key)) {
    res.status(404).json({ error: 'Unknown resource' })
    return
  }
  try {
    const file = dataFileForKey(key)
    if (!file) {
      res.status(404).json({ error: 'Unknown resource' })
      return
    }
    const data = await readJsonFile(file)
    res.json(data)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Read failed' })
  }
})

app.put('/api/admin/data/:key', authMiddleware, async (req, res) => {
  const { key } = req.params
  if (!ADMIN_KEYS.has(key)) {
    res.status(404).json({ error: 'Unknown resource' })
    return
  }
  try {
    const body = req.body
    if (body === undefined || typeof body !== 'object' || Array.isArray(body)) {
      res.status(400).json({ error: 'JSON object body required' })
      return
    }
    const file = dataFileForKey(key)
    if (!file) {
      res.status(404).json({ error: 'Unknown resource' })
      return
    }
    const prev = (await safeReadJson(file, {})) || {}
    const merged = { ...prev, ...body }
    const prevMeta = typeof merged._meta === 'object' && merged._meta ? merged._meta : {}
    merged._meta = {
      ...prevMeta,
      createdAt: prevMeta.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: req.user.email,
    }
    await writeJsonFile(file, merged)
    await touchContentMeta(key, req.user.email)
    if (PUBLISHABLE_KEYS.has(key)) {
      await publishStore.markDraftSaved(key, req.user.email)
    }
    await appendActivity({
      action: 'save',
      section: key,
      description: `Saved draft ${key}`,
      adminEmail: req.user.email,
      adminName: req.user.name || '',
    })
    const publishStatus = PUBLISHABLE_KEYS.has(key)
      ? await publishStore.getSectionStatus(key, file)
      : null
    res.json({ ok: true, ...(publishStatus ? { publishStatus } : {}) })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Save failed' })
  }
})

app.get('/api/admin/publish-status/:key', authMiddleware, async (req, res) => {
  const { key } = req.params
  const file = dataFileForKey(key)
  if (!file || !PUBLISHABLE_KEYS.has(key)) {
    res.status(404).json({ error: 'Unknown resource' })
    return
  }
  try {
    res.json(await publishStore.getSectionStatus(key, file))
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Status failed' })
  }
})

app.post('/api/admin/publish/:key', authMiddleware, async (req, res) => {
  const { key } = req.params
  const file = dataFileForKey(key)
  if (!file || !PUBLISHABLE_KEYS.has(key)) {
    res.status(404).json({ error: 'Unknown resource' })
    return
  }
  try {
    const result = await publishStore.publishFile(file, key, req.user.email)
    invalidatePublishedContentCaches()
    await appendActivity({
      action: 'publish',
      section: key,
      description: `Published ${key}`,
      adminEmail: req.user.email,
      adminName: req.user.name || '',
    })
    res.json({
      success: true,
      ok: true,
      key,
      message: 'Published successfully',
      data: { published: publishStore.stripMeta(result.published) },
      publishStatus: result.status,
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Publish failed' })
  }
})

app.post('/api/admin/publish', authMiddleware, async (req, res) => {
  try {
    const keys = Array.isArray(req.body?.keys) && req.body.keys.length
      ? req.body.keys.filter((k) => PUBLISHABLE_KEYS.has(k))
      : [...PUBLISHABLE_KEYS]
    const results = {}
    for (const key of keys) {
      const file = dataFileForKey(key)
      if (!file) continue
      const result = await publishStore.publishFile(file, key, req.user.email)
      results[key] = result.status
    }
    invalidatePublishedContentCaches()
    await appendActivity({
      action: 'publish',
      section: 'site',
      description: `Published ${keys.join(', ')}`,
      adminEmail: req.user.email,
      adminName: req.user.name || '',
    })
    res.json({ ok: true, results })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Publish failed' })
  }
})

app.get('/api/admin/media', authMiddleware, async (_req, res) => {
  const idx = await readMediaIndex()
  res.json(idx.items || [])
})

registerMediaUploadRoute('/api/admin/media')
registerMediaUploadRoute('/api/admin/media/upload')

app.delete('/api/admin/media/:id', authMiddleware, async (req, res) => {
  try {
    const idx = await readMediaIndex()
    const entry = (idx.items || []).find((x) => x.id === req.params.id)
    if (!entry) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    const fp = path.join(UPLOADS_DIR, path.basename(entry.filename))
    await fs.unlink(fp).catch(() => {})
    idx.items = (idx.items || []).filter((x) => x.id !== req.params.id)
    await writeMediaIndex(idx)
    await appendActivity({
      action: 'media_deleted',
      section: 'media',
      description: entry.filename,
      adminEmail: req.user.email,
      adminName: req.user.name || '',
    })
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Delete failed' })
  }
})

const WHATSAPP_SETTINGS_FILE = 'whatsappSettings.json'
const EMAIL_SETTINGS_FILE = 'emailSettings.json'

app.get('/api/admin/whatsapp', authMiddleware, async (_req, res) => {
  try {
    res.json(await safeReadJson(WHATSAPP_SETTINGS_FILE, {}))
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Read failed' })
  }
})

app.put('/api/admin/whatsapp', authMiddleware, async (req, res) => {
  try {
    const body = req.body
    if (body === undefined || typeof body !== 'object' || Array.isArray(body)) {
      res.status(400).json({ error: 'JSON object body required' })
      return
    }
    const merged = { ...body }
    const prevMeta = typeof body._meta === 'object' && body._meta ? body._meta : {}
    merged._meta = {
      ...prevMeta,
      createdAt: prevMeta.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: req.user.email,
    }
    await writeJsonFile(WHATSAPP_SETTINGS_FILE, merged)
    await touchContentMeta('whatsappSettings', req.user.email)
    await appendActivity({
      action: 'save',
      section: 'whatsappSettings',
      description: 'Saved whatsappSettings',
      adminEmail: req.user.email,
      adminName: req.user.name || '',
    })
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Save failed' })
  }
})

app.get('/api/admin/email', authMiddleware, async (_req, res) => {
  try {
    res.json(await safeReadJson(EMAIL_SETTINGS_FILE, {}))
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Read failed' })
  }
})

app.put('/api/admin/email', authMiddleware, async (req, res) => {
  try {
    const body = req.body
    if (body === undefined || typeof body !== 'object' || Array.isArray(body)) {
      res.status(400).json({ error: 'JSON object body required' })
      return
    }
    if (body.enableEmailNotification === true) {
      const smtp = resolveSmtpConfig()
      const receiver = (body.receiverEmail || smtp.receiverEmail || '').trim()
      if (!receiver) {
        res.status(400).json({
          error: 'Receiver email is required. Set it in admin email settings or CONTACT_RECEIVER_EMAIL in .env.local',
        })
        return
      }
      if (!smtp.host) {
        res.status(400).json({ error: 'SMTP is not configured. Set SMTP_HOST (and related vars) in .env.local' })
        return
      }
      if (!smtp.ok) {
        res.status(400).json({
          error: `SMTP is incomplete. Missing: ${smtp.missing.join(', ')}`,
        })
        return
      }
    }
    const merged = { ...body }
    const prevMeta = typeof body._meta === 'object' && body._meta ? body._meta : {}
    merged._meta = {
      ...prevMeta,
      createdAt: prevMeta.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: req.user.email,
    }
    await writeJsonFile(EMAIL_SETTINGS_FILE, merged)
    await touchContentMeta('emailSettings', req.user.email)
    await appendActivity({
      action: 'save',
      section: 'emailSettings',
      description: 'Saved emailSettings',
      adminEmail: req.user.email,
      adminName: req.user.name || '',
    })
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Save failed' })
  }
})

app.get('/api/admin/pages', authMiddleware, async (_req, res) => {
  try {
    const store = await readPagesStore()
    const custom = [...store.items]
      .sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')))
      .map(adminPageListItem)
    const items = [...systemPageListRows(), ...custom]
    res.json({ items })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to read pages' })
  }
})

app.get('/api/admin/pages/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    if (isSystemPageId(id)) {
      const sp = getSystemPage(id)
      const row = systemPageListRows().find((p) => p.id === id)
      res.json({ page: { ...row, editorialStatus: 'Published', system: sp } })
      return
    }
    const store = await readPagesStore()
    const page = store.items.find((p) => p.id === id)
    if (!page) {
      res.status(404).json({ error: 'Page not found' })
      return
    }
    res.json({ page: adminPageListItem(page) })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to read page' })
  }
})

app.post('/api/admin/pages', authMiddleware, async (req, res) => {
  try {
    const body = req.body
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      res.status(400).json({ error: 'JSON object body required' })
      return
    }
    const slug = normalizeSlugInput(body.slug)
    if (!isValidPageSlug(slug)) {
      res.status(400).json({ error: 'Invalid slug. Use lowercase letters, numbers, and single hyphens only.' })
      return
    }
    const store = await readPagesStore()
    if (store.items.some((p) => p.slug.toLowerCase() === slug.toLowerCase())) {
      res.status(409).json({ error: 'A page with this slug already exists' })
      return
    }
    const id = nanoid(12)
    const doPublish = body.action === 'publish' || body.publish === true || body.status === 'published'
    const template = PAGE_TEMPLATES.has(body.template) ? body.template : 'blank'
    const initialSections = Array.isArray(body.sections)
      ? normalizeSections(body.sections)
      : buildTemplateSections(template)
    const row = normalizePageFromBody(
      { ...body, slug, template, sections: initialSections, status: doPublish ? 'published' : 'draft' },
      { id },
    )
    row.id = id
    if (doPublish) {
      const now = new Date().toISOString()
      row.publishedContent = buildPublishedContentFromDraft(row, now)
      row.publishedSections = normalizeSections(row.sections)
      row.lastPublishedAt = now
      row.status = 'published'
    } else {
      row.publishedContent = null
      row.publishedSections = null
      row.status = 'draft'
    }
    store.items.push(row)
    await persistPagesStore(store, req.user, doPublish ? `Published page ${slug}` : `Created draft page ${slug}`)
    res.status(201).json({ ok: true, page: { ...row, editorialStatus: pageEditorialStatus(row) } })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Create failed' })
  }
})

async function updateAdminPage(req, res) {
  try {
    const { id } = req.params
    const body = req.body
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      res.status(400).json({ error: 'JSON object body required' })
      return
    }
    if (isSystemPageId(id)) {
      res.status(400).json({ error: 'System pages use dedicated editors' })
      return
    }
    const store = await readPagesStore()
    const idx = store.items.findIndex((p) => p.id === id)
    if (idx === -1) {
      res.status(404).json({ error: 'Page not found' })
      return
    }
    const prev = store.items[idx]
    const slug = normalizeSlugInput(body.slug ?? prev.slug)
    if (!isValidPageSlug(slug)) {
      res.status(400).json({ error: 'Invalid slug' })
      return
    }
    if (store.items.some((p, i) => i !== idx && p.slug.toLowerCase() === slug.toLowerCase())) {
      res.status(409).json({ error: 'Another page already uses this slug' })
      return
    }
    const doPublish = body.action === 'publish' || body.publish === true
    const doUnpublish = body.action === 'unpublish' || body.unpublish === true
    const row = normalizePageFromBody({ ...body, slug }, prev)
    row.id = prev.id
    row.publishedContent = prev.publishedContent ?? null
    row.publishedSections = prev.publishedSections ?? null
    row.lastPublishedAt = prev.lastPublishedAt || null

    if (doUnpublish) {
      row.publishedContent = null
      row.publishedSections = null
      row.lastPublishedAt = null
      row.status = 'draft'
    } else if (doPublish) {
      const now = new Date().toISOString()
      row.publishedContent = buildPublishedContentFromDraft(row, now)
      row.publishedSections = normalizeSections(row.sections)
      row.lastPublishedAt = now
      row.status = 'published'
    } else {
      row.status = row.publishedContent ? 'published' : 'draft'
    }

    store.items[idx] = row
    const desc = doPublish
      ? `Published page ${slug}`
      : doUnpublish
        ? `Unpublished page ${slug}`
        : `Saved draft page ${slug}`
    await persistPagesStore(store, req.user, desc)
    res.json({ ok: true, page: adminPageListItem(row) })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Update failed' })
  }
}

app.put('/api/admin/pages/:id', authMiddleware, updateAdminPage)
app.patch('/api/admin/pages/:id', authMiddleware, updateAdminPage)

async function loadCustomPageOr404(req, res) {
  if (isSystemPageId(req.params.id)) {
    res.status(400).json({ error: 'System pages use dedicated editors' })
    return null
  }
  const store = await readPagesStore()
  const idx = store.items.findIndex((p) => p.id === req.params.id)
  if (idx === -1) {
    res.status(404).json({ error: 'Page not found' })
    return null
  }
  return { store, idx, page: store.items[idx] }
}

app.post('/api/admin/pages/:id/publish', authMiddleware, async (req, res) => {
  try {
    const ctx = await loadCustomPageOr404(req, res)
    if (!ctx) return
    const { store, idx } = ctx
    let row = normalizePageFromBody(req.body && typeof req.body === 'object' ? req.body : {}, ctx.page)
    row.id = ctx.page.id
    row.publishedContent = ctx.page.publishedContent
    row.publishedSections = ctx.page.publishedSections
    row = await publishPageRow(row, req.user)
    store.items[idx] = row
    res.json({ ok: true, page: adminPageListItem(row) })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Publish failed' })
  }
})

app.post('/api/admin/pages/:id/unpublish', authMiddleware, async (req, res) => {
  try {
    const ctx = await loadCustomPageOr404(req, res)
    if (!ctx) return
    const { store, idx, page } = ctx
    page.publishedContent = null
    page.publishedSections = null
    page.lastPublishedAt = null
    page.status = 'draft'
    page.updatedAt = new Date().toISOString()
    store.items[idx] = page
    await persistPagesStore(store, req.user, `Unpublished page ${page.slug || page.id}`)
    res.json({ ok: true, page: adminPageListItem(page) })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Unpublish failed' })
  }
})

app.post('/api/admin/pages/:id/duplicate', authMiddleware, async (req, res) => {
  try {
    const ctx = await loadCustomPageOr404(req, res)
    if (!ctx) return
    const { store, page } = ctx
    const baseSlug = `${page.slug}-copy`
    let slug = baseSlug
    let n = 2
    while (store.items.some((p) => p.slug.toLowerCase() === slug.toLowerCase())) {
      slug = `${baseSlug}-${n}`
      n += 1
    }
    const id = nanoid(12)
    const now = new Date().toISOString()
    const copy = {
      ...JSON.parse(JSON.stringify(page)),
      id,
      slug,
      title: {
        en: page.title?.en ? `${page.title.en} (Copy)` : '',
        ar: page.title?.ar ? `${page.title.ar} (Copy)` : '',
      },
      status: 'draft',
      publishedContent: null,
      publishedSections: null,
      lastPublishedAt: null,
      sections: normalizeSections(page.sections).map((s) => ({
        ...s,
        id: nanoid(10),
        content: JSON.parse(JSON.stringify(s.content || {})),
      })),
      createdAt: now,
      updatedAt: now,
    }
    store.items.push(copy)
    await persistPagesStore(store, req.user, `Duplicated page ${page.slug} → ${slug}`)
    res.status(201).json({ ok: true, page: adminPageListItem(copy) })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Duplicate failed' })
  }
})

app.post('/api/admin/pages/:id/sections', authMiddleware, async (req, res) => {
  try {
    const ctx = await loadCustomPageOr404(req, res)
    if (!ctx) return
    const { store, idx, page } = ctx
    const type = req.body?.type
    if (!SECTION_TYPES.has(type)) {
      res.status(400).json({ error: 'Invalid section type' })
      return
    }
    const sections = normalizeSections(page.sections)
    const nextOrder = sections.length ? Math.max(...sections.map((s) => s.order)) + 1 : 1
    const section = createSection(type, nextOrder)
    page.sections = [...sections, section]
    page.updatedAt = new Date().toISOString()
    store.items[idx] = page
    await persistPagesStore(store, req.user, `Added ${type} section to page ${page.slug}`)
    res.status(201).json({ ok: true, section, page: adminPageListItem(page) })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Add section failed' })
  }
})

app.patch('/api/admin/pages/:id/sections/:sectionId', authMiddleware, async (req, res) => {
  try {
    const ctx = await loadCustomPageOr404(req, res)
    if (!ctx) return
    const { store, idx, page } = ctx
    const { sectionId } = req.params
    const body = req.body && typeof req.body === 'object' ? req.body : {}
    const sections = normalizeSections(page.sections)
    const sIdx = sections.findIndex((s) => s.id === sectionId)
    if (sIdx === -1) {
      res.status(404).json({ error: 'Section not found' })
      return
    }
    const prev = sections[sIdx]
    const next = {
      ...prev,
      ...body,
      id: prev.id,
      type: SECTION_TYPES.has(body.type) ? body.type : prev.type,
      content:
        body.content && typeof body.content === 'object'
          ? { ...(prev.content || {}), ...body.content }
          : prev.content,
    }
    sections[sIdx] = next
    page.sections = normalizeSections(sections)
    page.updatedAt = new Date().toISOString()
    store.items[idx] = page
    await persistPagesStore(store, req.user, `Updated section ${sectionId} on page ${page.slug}`)
    res.json({ ok: true, section: next, page: adminPageListItem(page) })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Update section failed' })
  }
})

app.post('/api/admin/pages/:id/sections/reorder', authMiddleware, async (req, res) => {
  try {
    const ctx = await loadCustomPageOr404(req, res)
    if (!ctx) return
    const { store, idx, page } = ctx
    const order = req.body?.order
    if (!Array.isArray(order)) {
      res.status(400).json({ error: 'order array required' })
      return
    }
    const map = new Map(normalizeSections(page.sections).map((s) => [s.id, s]))
    const reordered = order
      .filter((id) => typeof id === 'string' && map.has(id))
      .map((id, i) => ({ ...map.get(id), order: i + 1 }))
    for (const s of map.values()) {
      if (!reordered.some((r) => r.id === s.id)) reordered.push({ ...s, order: reordered.length + 1 })
    }
    page.sections = normalizeSections(reordered)
    page.updatedAt = new Date().toISOString()
    store.items[idx] = page
    await persistPagesStore(store, req.user, `Reordered sections on page ${page.slug}`)
    res.json({ ok: true, sections: page.sections, page: adminPageListItem(page) })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Reorder failed' })
  }
})

app.post('/api/admin/pages/:id/sections/:sectionId/duplicate', authMiddleware, async (req, res) => {
  try {
    const ctx = await loadCustomPageOr404(req, res)
    if (!ctx) return
    const { store, idx, page } = ctx
    const { sectionId } = req.params
    const sections = normalizeSections(page.sections)
    const src = sections.find((s) => s.id === sectionId)
    if (!src) {
      res.status(404).json({ error: 'Section not found' })
      return
    }
    const nextOrder = sections.length ? Math.max(...sections.map((s) => s.order)) + 1 : 1
    const copy = {
      ...JSON.parse(JSON.stringify(src)),
      id: nanoid(10),
      order: nextOrder,
    }
    page.sections = normalizeSections([...sections, copy])
    page.updatedAt = new Date().toISOString()
    store.items[idx] = page
    await persistPagesStore(store, req.user, `Duplicated section ${sectionId} on page ${page.slug}`)
    res.status(201).json({ ok: true, section: copy, page: adminPageListItem(page) })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Duplicate section failed' })
  }
})

app.delete('/api/admin/pages/:id/sections/:sectionId', authMiddleware, async (req, res) => {
  try {
    const ctx = await loadCustomPageOr404(req, res)
    if (!ctx) return
    const { store, idx, page } = ctx
    const { sectionId } = req.params
    const before = normalizeSections(page.sections)
    if (!before.some((s) => s.id === sectionId)) {
      res.status(404).json({ error: 'Section not found' })
      return
    }
    page.sections = normalizeSections(before.filter((s) => s.id !== sectionId))
    page.updatedAt = new Date().toISOString()
    store.items[idx] = page
    await persistPagesStore(store, req.user, `Deleted section ${sectionId} on page ${page.slug}`)
    res.json({ ok: true, page: adminPageListItem(page) })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Delete section failed' })
  }
})

app.delete('/api/admin/pages/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const store = await readPagesStore()
    const idx = store.items.findIndex((p) => p.id === id)
    if (idx === -1) {
      res.status(404).json({ error: 'Page not found' })
      return
    }
    const removed = store.items[idx]
    store.items.splice(idx, 1)
    const prevMeta = typeof store._meta === 'object' && store._meta ? store._meta : {}
    store._meta = {
      ...prevMeta,
      createdAt: prevMeta.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: req.user.email,
    }
    await writeJsonFile(PAGES_FILE, store)
    await touchContentMeta('pages', req.user.email)
    await appendActivity({
      action: 'delete',
      section: 'pages',
      description: `Deleted page ${removed.slug || id}`,
      adminEmail: req.user.email,
      adminName: req.user.name || '',
    })
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Delete failed' })
  }
})

app.get('/api/software-detail/:kind/:slug', async (req, res) => {
  const t0 = Date.now()
  try {
    const kind = req.params.kind
    const slug = normalizeSlugInput(req.params.slug)
    if (!SOFTWARE_KINDS.has(kind) || !isValidPageSlug(slug)) {
      res.status(400).json({ error: 'Invalid kind or slug' })
      return
    }
    const store = await readSoftwareDetailsStore()
    const row = store.items.find((p) => p.kind === kind && p.slug.toLowerCase() === slug.toLowerCase())
    if (!row || row.active === false) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    res.json({ page: row })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    if (msg.includes('_TIMEOUT') || msg.includes('DATA_DIR')) {
      console.error('[software-detail] storage timeout', req.params, `${Date.now() - t0}ms`)
      res.status(503).json({ error: 'Content storage temporarily unavailable' })
      return
    }
    console.error(e)
    res.status(500).json({ error: 'Failed to read software detail page' })
  }
})

app.get('/api/admin/software-details', authMiddleware, async (_req, res) => {
  try {
    const store = await readSoftwareDetailsStore()
    const items = [...store.items].sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')))
    res.json({ items })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to read software detail pages' })
  }
})

app.get('/api/admin/software-details/:kind/:slug', authMiddleware, async (req, res) => {
  try {
    const kind = req.params.kind
    const slug = normalizeSlugInput(req.params.slug)
    if (!SOFTWARE_KINDS.has(kind) || !slug) {
      res.status(400).json({ error: 'Invalid kind or slug' })
      return
    }
    const store = await readSoftwareDetailsStore()
    const page = store.items.find((p) => p.kind === kind && p.slug.toLowerCase() === slug.toLowerCase())
    if (!page) {
      res.status(404).json({ error: 'Page not found' })
      return
    }
    res.json({ page })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to read software detail page' })
  }
})

app.put('/api/admin/software-details/:kind/:slug', authMiddleware, async (req, res) => {
  try {
    const kind = req.params.kind
    const slugParam = normalizeSlugInput(req.params.slug)
    const body = req.body
    if (!SOFTWARE_KINDS.has(kind)) {
      res.status(400).json({ error: 'Invalid kind' })
      return
    }
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      res.status(400).json({ error: 'JSON object body required' })
      return
    }
    const slug = normalizeSlugInput(body.slug || slugParam)
    if (!isValidPageSlug(slug)) {
      res.status(400).json({ error: 'Invalid slug. Use lowercase letters, numbers, and single hyphens only.' })
      return
    }
    const store = await readSoftwareDetailsStore()
    const idx = store.items.findIndex((p) => p.kind === kind && p.slug.toLowerCase() === slugParam.toLowerCase())
    const prev = idx >= 0 ? store.items[idx] : null
    if (store.items.some((p, i) => i !== idx && p.kind === kind && p.slug.toLowerCase() === slug.toLowerCase())) {
      res.status(409).json({ error: 'A page with this slug already exists for this type' })
      return
    }
    const row = normalizeSoftwareDetailFromBody({ ...body, kind, slug }, prev)
    row.id = prev?.id || nanoid(12)
    if (idx >= 0) store.items[idx] = row
    else store.items.push(row)
    await persistSoftwareDetailsStore(store, req.user, `${prev ? 'Updated' : 'Created'} ${kind} page ${slug}`)
    res.json({ ok: true, page: row })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Save failed' })
  }
})

app.delete('/api/admin/software-details/:kind/:slug', authMiddleware, async (req, res) => {
  try {
    const kind = req.params.kind
    const slug = normalizeSlugInput(req.params.slug)
    if (!SOFTWARE_KINDS.has(kind) || !slug) {
      res.status(400).json({ error: 'Invalid kind or slug' })
      return
    }
    const store = await readSoftwareDetailsStore()
    const idx = store.items.findIndex((p) => p.kind === kind && p.slug.toLowerCase() === slug.toLowerCase())
    if (idx === -1) {
      res.status(404).json({ error: 'Page not found' })
      return
    }
    const removed = store.items[idx]
    if (!removed.isCustom) {
      res.status(400).json({ error: 'Built-in pages cannot be deleted. Set inactive or clear CMS overrides instead.' })
      return
    }
    store.items.splice(idx, 1)
    await persistSoftwareDetailsStore(store, req.user, `Deleted custom ${kind} page ${slug}`)
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Delete failed' })
  }
})

function filterLeads(leads, { q, status, from, to }) {
  let out = leads.map(normalizeLead).filter((l) => !isDemoRequest(l))
  if (status && LEAD_STATUSES.has(status)) out = out.filter((l) => l.status === status)
  if (q && String(q).trim()) {
    const s = String(q).toLowerCase()
    out = out.filter(
      (l) =>
        (l.name && l.name.toLowerCase().includes(s)) ||
        (l.email && l.email.toLowerCase().includes(s)) ||
        (l.phone && l.phone.includes(s)) ||
        (l.message && l.message.toLowerCase().includes(s)) ||
        (l.topic && l.topic.toLowerCase().includes(s)),
    )
  }
  if (from) {
    const t = new Date(from).getTime()
    out = out.filter((l) => new Date(l.createdAt).getTime() >= t)
  }
  if (to) {
    const t = new Date(to).getTime() + 86400000
    out = out.filter((l) => new Date(l.createdAt).getTime() < t)
  }
  return out
}

app.get('/api/admin/leads', authMiddleware, async (req, res) => {
  try {
    const leads = (await readLeads()).map(normalizeLead)
    const { q, status, from, to } = req.query
    res.json(filterLeads(leads, { q, status, from, to }))
  } catch (e) {
    console.error(e)
    res.status(200).json([])
  }
})

app.get('/api/admin/inquiries', authMiddleware, async (req, res) => {
  try {
    const leads = (await readLeads()).map(normalizeLead)
    const { q, status, from, to } = req.query
    res.json(filterLeads(leads, { q, status, from, to }))
  } catch (e) {
    console.error(e)
    res.status(200).json([])
  }
})

app.get('/api/admin/leads/export', authMiddleware, async (_req, res) => {
  try {
    const leads = (await readLeads()).map(normalizeLead).filter((l) => !isDemoRequest(l))
    const cols = ['id', 'name', 'email', 'phone', 'topic', 'company', 'message', 'status', 'sourcePage', 'internalNote', 'createdAt', 'updatedAt']
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const lines = [cols.join(',')]
    for (const l of leads) {
      lines.push(cols.map((c) => esc(l[c])).join(','))
    }
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename="leads.csv"')
    res.send('\uFEFF' + lines.join('\n'))
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Export failed' })
  }
})

app.patch('/api/admin/leads/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { status, internalNote } = req.body ?? {}
    const leads = (await readLeads()).map(normalizeLead)
    const idx = leads.findIndex((l) => l.id === id)
    if (idx === -1) {
      res.status(404).json({ error: 'Lead not found' })
      return
    }
    const next = { ...leads[idx] }
    if (typeof status === 'string' && LEAD_STATUSES.has(status)) next.status = status
    if (typeof internalNote === 'string') next.internalNote = internalNote.slice(0, 5000)
    next.updatedAt = new Date().toISOString()
    leads[idx] = next
    await writeLeads(leads)
    await appendActivity({
      action: 'lead_updated',
      section: 'leads',
      description: `Lead ${id} updated`,
      adminEmail: req.user.email,
      adminName: req.user.name || '',
    })
    res.json(next)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Update failed' })
  }
})

app.delete('/api/admin/leads/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    let leads = (await readLeads()).map(normalizeLead)
    const before = leads.length
    leads = leads.filter((l) => l.id !== id)
    if (leads.length === before) {
      res.status(404).json({ error: 'Lead not found' })
      return
    }
    await writeLeads(leads)
    await appendActivity({
      action: 'lead_deleted',
      section: 'leads',
      description: `Lead ${id} deleted`,
      adminEmail: req.user.email,
      adminName: req.user.name || '',
    })
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Delete failed' })
  }
})

app.get('/api/admin/demo-requests/stats', authMiddleware, async (_req, res) => {
  try {
    const leads = (await readLeads()).map(normalizeLead)
    res.json(demoRequestStats(leads))
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load demo request stats' })
  }
})

app.get('/api/admin/demo-requests/export', authMiddleware, async (req, res) => {
  try {
    const leads = (await readLeads()).map(normalizeLead)
    const { q, status, from, to } = req.query
    const { items } = filterDemoRequests(leads, {
      q,
      status,
      from,
      to,
      page: 1,
      pageSize: 100000,
    })
    const cols = [
      'id',
      'createdAt',
      'name',
      'company',
      'email',
      'phone',
      'productService',
      'message',
      'sourcePage',
      'status',
      'assignedTo',
      'followUpAt',
      'internalNote',
      'updatedAt',
    ]
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
    const lines = [cols.join(',')]
    for (const l of items) {
      lines.push(cols.map((c) => esc(l[c])).join(','))
    }
    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', 'attachment; filename="demo-requests.csv"')
    res.send('\uFEFF' + lines.join('\n'))
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Export failed' })
  }
})

app.get('/api/admin/demo-requests', authMiddleware, async (req, res) => {
  try {
    const leads = (await readLeads()).map(normalizeLead)
    const { q, status, from, to, page, pageSize } = req.query
    res.json(filterDemoRequests(leads, { q, status, from, to, page, pageSize }))
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load demo requests' })
  }
})

app.get('/api/admin/demo-requests/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const leads = (await readLeads()).map(normalizeLead)
    const row = demoRequestsFromLeads(leads).find((l) => l.id === id)
    if (!row) {
      res.status(404).json({ error: 'Demo request not found' })
      return
    }
    res.json({ item: row })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load demo request' })
  }
})

app.patch('/api/admin/demo-requests/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const { status, internalNote, followUpAt, assignedTo } = req.body ?? {}
    const leads = (await readLeads()).map(normalizeLead)
    const idx = leads.findIndex((l) => l.id === id)
    if (idx === -1 || !isDemoRequest(leads[idx])) {
      res.status(404).json({ error: 'Demo request not found' })
      return
    }
    const next = { ...leads[idx] }
    if (typeof status === 'string' && DEMO_REQUEST_STATUSES.has(status)) next.status = status
    if (typeof internalNote === 'string') next.internalNote = internalNote.slice(0, 5000)
    if (typeof assignedTo === 'string') next.assignedTo = assignedTo.slice(0, 200)
    if (followUpAt === null || followUpAt === '') next.followUpAt = ''
    else if (typeof followUpAt === 'string') {
      const t = new Date(followUpAt)
      if (!Number.isNaN(t.getTime())) next.followUpAt = t.toISOString()
    }
    next.updatedAt = new Date().toISOString()
    leads[idx] = normalizeLead(next)
    await writeLeads(leads)
    appendActivity({
      action: 'demo_request_updated',
      section: 'demo-requests',
      description: `Demo request ${id} updated`,
      adminEmail: req.user.email,
      adminName: req.user.name || '',
    }).catch((e) => console.error('[demo activity]', e))
    res.json(leads[idx])
  } catch (e) {
    if (isStorageTimeoutError(e)) {
      res.status(503).json({ error: 'Storage temporarily unavailable' })
      return
    }
    console.error(e)
    res.status(500).json({ error: 'Update failed' })
  }
})

app.delete('/api/admin/demo-requests/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    let leads = (await readLeads()).map(normalizeLead)
    const target = leads.find((l) => l.id === id)
    if (!target || !isDemoRequest(target)) {
      res.status(404).json({ error: 'Demo request not found' })
      return
    }
    leads = leads.filter((l) => l.id !== id)
    await writeLeads(leads)
    appendActivity({
      action: 'demo_request_deleted',
      section: 'demo-requests',
      description: `Demo request ${id} deleted`,
      adminEmail: req.user.email,
      adminName: req.user.name || '',
    }).catch((e) => console.error('[demo activity]', e))
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Delete failed' })
  }
})

app.get('/api/admin/backup/export', authMiddleware, async (_req, res) => {
  try {
    const files = await fs.readdir(DATA_DIR)
    const jsonFiles = files.filter((f) => f.endsWith('.json'))
    const bundle = {}
    for (const f of jsonFiles) {
      bundle[f] = await readJsonFile(f)
    }
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename="digitalmanager-cms-backup-${Date.now()}.json"`)
    res.send(JSON.stringify({ exportedAt: new Date().toISOString(), files: bundle }, null, 2))
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Backup failed' })
  }
})

app.post('/api/admin/backup/import', authMiddleware, async (req, res) => {
  try {
    const body = req.body
    if (!body || typeof body !== 'object' || !body.files || typeof body.files !== 'object') {
      res.status(400).json({ error: 'Invalid backup: expected { files: { "header.json": ... } }' })
      return
    }
    const required = ['header.json', 'hero.json']
    for (const r of required) {
      if (!(r in body.files)) {
        res.status(400).json({ error: `Missing required file key: ${r}` })
        return
      }
    }
    const stamp = Date.now()
    const jsonFiles = Object.keys(body.files).filter((k) => k.endsWith('.json'))
    for (const f of jsonFiles) {
      const prev = await safeReadJson(f, null)
      const safeName = f.replace(/[^a-zA-Z0-9._-]/g, '_')
      if (prev) {
        await writeJsonFile(`backup-pre-import-${stamp}-${safeName}`, prev)
      }
      await writeJsonFile(f, body.files[f])
    }
    await appendActivity({
      action: 'backup_import',
      section: 'system',
      description: 'CMS JSON bundle imported',
      adminEmail: req.user.email,
      adminName: req.user.name || '',
    })
    res.json({ ok: true, imported: jsonFiles.length })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Import failed' })
  }
})

registerContentRoutes(app, {
  authMiddleware,
  publishStore,
  localeStorage,
  readJsonFile,
  safeReadJson,
  writeJsonFile,
  sendPublicJson,
  invalidatePublishedContentCaches,
  logActivity: appendActivity,
})

registerLocaleRoutes(app, {
  authMiddleware,
  localeStorage,
  publishStore,
  safeReadJson,
  invalidateJsonCache,
  logActivity: appendActivity,
})

registerLocaleGeoRouting(app, { publishStore, localePublish })

/** Canonicalize UAE English city URLs: /ae/en/dubai/erp-software → /dubai/erp-software */
app.get(/^\/ae\/en\/([^/]+)\/([^/]+)\/?$/, (req, res, next) => {
  const citySlug = String(req.params[0] || '').toLowerCase()
  const pageSlug = String(req.params[1] || '').toLowerCase()
  if (isValidCityForCountry(citySlug, 'AE')) {
    res.redirect(302, `/${citySlug}/${pageSlug}`)
    return
  }
  next()
})

const agenticDeps = () => ({
  distIndex: DIST_INDEX,
  publishStore,
  localePublish,
  loadPublishedHomepagePayload,
  buildPublishedNavigation,
  buildHomepageMeta,
  readPagesStore,
  dataFiles: DATA_FILES,
  extraHomepageFiles: EXTRA_HOMEPAGE_FILES,
  seoDeps: () => ({ localePublish, publishStore }),
})

if (SERVE_STATIC) {
  // 1) Static assets first — never intercepted by agent or SPA handlers.
  app.use('/assets', express.static(path.join(DIST_DIR, 'assets'), { index: false, fallthrough: false }))
  // Do not auto-serve index.html for `/` — negotiation runs on downstream routes.
  app.use(express.static(DIST_DIR, { index: false }))

  registerAgenticRoutes(app, agenticDeps())
}

// Unmatched /api/* → JSON 404 (never SPA index.html)
app.use('/api', (_req, res) => {
  notFoundError(res, 'API route not found.')
})

if (SERVE_STATIC) {
  app.get(
    /^(?!\/api|\/uploads|\/sitemap\.xml|\/robots\.txt|\/llms\.txt|\/llms-full\.txt|\/openapi\.json).*/,
    createSpaShellHandler(agenticDeps()),
  )
} else {
  app.get('/', (_req, res) => {
    res.status(404).type('text').send(
      'Cannot GET /\n\n' +
        'This process is the Express CMS API only. ' +
        'For single-process hosting, run `npm run build` then start with NODE_ENV=production ' +
        '(or SERVE_STATIC=true) from the repo root so ../dist exists after build.\n',
    )
  })
}

app.use((err, req, res, _next) => {
  console.error(err)
  if (res.headersSent) return
  if (String(req.originalUrl || req.url || '').startsWith('/api')) {
    internalError(res, 'An unexpected server error occurred.')
    return
  }
  res.status(500).type('text/plain').send('Server error')
})

app.listen(PORT, HOST, () => {
  console.log(`CMS API listening on http://${HOST}:${PORT}`)
  console.info('CMS storage directory:', DATA_DIR)
  console.info('CMS published directory:', path.join(DATA_DIR, 'published'))
  if (SERVE_STATIC) {
    console.log(`Serving frontend from ${DIST_DIR}`)
    fs.readdir(path.join(DIST_DIR, 'assets'))
      .then((names) => console.log(`[static] dist/assets contains ${names.length} file(s)`))
      .catch(() => console.warn('[static] dist/assets missing — run npm run build before deploy'))
  } else if (isProduction()) {
    console.warn('[static] Frontend not served — set SERVE_STATIC=true or ensure dist/ exists after build')
  }
  ensureBootstrapFiles()
    .then(() => {
      bootstrapReady = true
      console.log('[bootstrap] data files ready')
    })
    .catch((e) => {
      bootstrapError = e instanceof Error ? e.message : String(e)
      console.error('[bootstrap] failed:', bootstrapError)
    })
}).on('error', (err) => {
  if (err && err.code === 'EADDRINUSE') {
    console.error(`\nPort ${PORT} is already in use (EADDRINUSE).`)
    console.error('Stop the other process using this port, or start the API on another port:')
    console.error('  PowerShell: $env:PORT=3041; npm run dev:api')
    console.error('  Or:         npm run dev:api:3041\n')
    process.exit(1)
  }
  throw err
})
