import express from 'express'
import cors from 'cors'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import { nanoid } from 'nanoid'
import nodemailer from 'nodemailer'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = __dirname
const DATA_DIR = path.join(ROOT, 'data')
const UPLOADS_DIR = path.join(ROOT, 'uploads')

const PORT = Number(process.env.PORT) || 3040
const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-change-me-in-production'

const DATA_FILES = {
  header: 'header.json',
  hero: 'hero.json',
  stats: 'stats.json',
  about: 'about.json',
  valueChain: 'valueChain.json',
  modules: 'modules.json',
  workflow: 'workflow.json',
  industries: 'industries.json',
  faqs: 'faqs.json',
  cta: 'cta.json',
  footer: 'footer.json',
  seo: 'seo.json',
}

const ADMIN_KEYS = new Set([
  ...Object.keys(DATA_FILES),
  'siteSettings',
  'whatsappSettings',
  'emailSettings',
  'pageSections',
  'pages',
])

const EXTRA_HOMEPAGE_FILES = {
  siteSettings: 'siteSettings.json',
  whatsappSettings: 'whatsappSettings.json',
  pageSections: 'pageSections.json',
}

const ACTIVITY_FILE = 'activityLog.json'
const CONTENT_META_FILE = 'contentMeta.json'
const MEDIA_INDEX_FILE = 'mediaIndex.json'
const USERS_FILE = 'users.json'
const LEADS_FILE = 'leads.json'
const PAGES_FILE = 'pages.json'

const PAGE_TYPES = new Set(['home', 'about', 'services', 'projects', 'blog', 'contact', 'residential', 'custom'])
const PAGE_STATUSES = new Set(['published', 'draft'])
const PAGE_LANG_MODES = new Set(['en', 'ar', 'both'])
const RESERVED_PAGE_SLUGS = new Set(['api', 'uploads', 'admin'])

const LEAD_STATUSES = new Set(['New', 'Contacted', 'Closed'])
const MAX_ACTIVITY = 500
const IMAGE_MIMES = new Set(['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/x-icon', 'image/vnd.microsoft.icon'])

const app = express()
app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: '8mb' }))

async function readJsonFile(relPath) {
  const p = path.join(DATA_DIR, relPath)
  const raw = await fs.readFile(p, 'utf8')
  return JSON.parse(raw)
}

async function writeJsonFile(relPath, data) {
  const p = path.join(DATA_DIR, relPath)
  const tmp = `${p}.${nanoid(6)}.tmp`
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8')
  await fs.rename(tmp, p)
}

async function safeReadJson(relPath, fallback = null) {
  try {
    return await readJsonFile(relPath)
  } catch {
    return fallback
  }
}

async function readUsers() {
  return readJsonFile(USERS_FILE)
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
  return {
    ...row,
    internalNote: row.internalNote ?? '',
    sourcePage: row.sourcePage ?? '',
    updatedAt: row.updatedAt || row.createdAt || new Date().toISOString(),
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
  return {
    id: base.id,
    slug,
    pageType: PAGE_TYPES.has(body.pageType) ? body.pageType : base.pageType || 'custom',
    status: PAGE_STATUSES.has(body.status) ? body.status : base.status || 'draft',
    language: PAGE_LANG_MODES.has(body.language) ? body.language : base.language || 'both',
    sortOrder: typeof body.sortOrder === 'number' && Number.isFinite(body.sortOrder) ? body.sortOrder : base.sortOrder ?? 0,
    showInMenu: typeof body.showInMenu === 'boolean' ? body.showInMenu : base.showInMenu ?? false,
    metaTitle: coerceBilingual(body.metaTitle ?? base.metaTitle),
    metaDescription: coerceBilingual(body.metaDescription ?? base.metaDescription),
    title: coerceBilingual(body.title ?? base.title),
    heading: coerceBilingual(body.heading ?? base.heading),
    shortDescription: coerceBilingual(body.shortDescription ?? base.shortDescription),
    content: coerceBilingual(body.content ?? base.content),
    featuredImageUrl: typeof body.featuredImageUrl === 'string' ? body.featuredImageUrl : base.featuredImageUrl || '',
    createdAt: base.createdAt || now,
    updatedAt: now,
  }
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
  await touchContentMeta('pages', user.email)
  await appendActivity({
    action: 'save',
    section: 'pages',
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

function dataFileForKey(key) {
  if (DATA_FILES[key]) return DATA_FILES[key]
  const map = {
    siteSettings: 'siteSettings.json',
    whatsappSettings: 'whatsappSettings.json',
    emailSettings: 'emailSettings.json',
    pageSections: 'pageSections.json',
    mediaIndex: 'mediaIndex.json',
    pages: PAGES_FILE,
  }
  return map[key] || null
}

async function trySendLeadEmail(lead, settings) {
  if (!settings?.enableEmailNotification) return
  const to = (settings.receiverEmail || '').trim()
  if (!to) return
  const subj = (settings.emailSubject || 'New lead').replace(/\{\{(\w+)\}\}/g, (_, k) => String(lead[k] ?? ''))
  let body = settings.emailTemplateBody || ''
  for (const k of ['name', 'email', 'phone', 'topic', 'company', 'message', 'sourcePage']) {
    body = body.split(`{{${k}}}`).join(String(lead[k] ?? ''))
  }
  const from = (settings.fromEmail || 'noreply@localhost').trim()
  const replyTo = settings.replyToField === 'customer' ? lead.email : from
  try {
    const transport = process.env.SMTP_HOST
      ? nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: process.env.SMTP_SECURE === 'true',
          auth:
            process.env.SMTP_USER && process.env.SMTP_PASS
              ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
              : undefined,
        })
      : nodemailer.createTransport({ jsonTransport: true })
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

await ensureBootstrapFiles()

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

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, time: new Date().toISOString() })
})

app.get('/api/homepage', async (_req, res) => {
  try {
    const entries = await Promise.all(
      Object.entries(DATA_FILES).map(async ([key, file]) => [key, await readJsonFile(file)]),
    )
    const out = Object.fromEntries(entries)
    for (const [key, file] of Object.entries(EXTRA_HOMEPAGE_FILES)) {
      out[key] = (await safeReadJson(file)) ?? {}
    }
    for (const k of Object.keys(out)) {
      const v = out[k]
      if (v && typeof v === 'object' && !Array.isArray(v) && '_meta' in v) {
        const { _meta: _m, ...rest } = v
        out[k] = rest
      }
    }
    res.json(out)
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load homepage data' })
  }
})

app.get('/api/page/:slug', async (req, res) => {
  try {
    const slug = normalizeSlugInput(req.params.slug)
    if (!slug || !isValidPageSlug(slug)) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    const store = await readPagesStore()
    const item = store.items.find((p) => p.slug.toLowerCase() === slug.toLowerCase() && p.status === 'published')
    if (!item) {
      res.status(404).json({ error: 'Not found' })
      return
    }
    res.json({ page: item })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load page' })
  }
})

app.get('/api/site-settings', async (_req, res) => {
  try {
    const [header, seo, footer, siteSettings] = await Promise.all([
      readJsonFile('header.json'),
      readJsonFile('seo.json'),
      readJsonFile('footer.json'),
      safeReadJson('siteSettings.json', {}),
    ])
    res.json({ header, seo, footer, siteSettings })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to load site settings' })
  }
})

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

app.post('/api/leads', async (req, res) => {
  try {
    const { name, email, phone, message, topic, company, sourcePage } = req.body ?? {}
    const emailStr = typeof email === 'string' ? email.trim() : ''
    const phoneStr = typeof phone === 'string' ? phone.trim() : ''
    if (!emailRe.test(emailStr)) {
      res.status(400).json({ error: 'Valid email is required' })
      return
    }
    if (!phoneStr || phoneStr.length < 6) {
      res.status(400).json({ error: 'Phone is required' })
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
      topic: typeof topic === 'string' ? topic.trim() : '',
      company: typeof company === 'string' ? company.trim() : '',
      sourcePage: typeof sourcePage === 'string' ? sourcePage.trim().slice(0, 500) : '',
      status: 'New',
      internalNote: '',
      createdAt: now,
      updatedAt: now,
    })
    leads.unshift(row)
    await writeLeads(leads)
    const emailSettings = await safeReadJson('emailSettings.json', {})
    trySendLeadEmail(row, emailSettings).catch(() => {})
    res.status(201).json({ ok: true, id: row.id })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Could not save lead' })
  }
})

app.post('/api/admin/auth/login', async (req, res) => {
  try {
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
    const expiresIn = rememberMe === true ? '30d' : '7d'
    const token = jwt.sign(
      { sub: user.id, email: user.email, role: user.role, name: user.name || '' },
      JWT_SECRET,
      { expiresIn },
    )
    await appendActivity({
      action: 'login',
      section: 'auth',
      description: 'Admin signed in',
      adminEmail: user.email,
      adminName: user.name || '',
    })
    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role, name: user.name || '' },
    })
  } catch (e) {
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
        role: u.role,
      },
    })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed' })
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
    const { currentPassword, newPassword, confirmPassword } = req.body ?? {}
    if (typeof currentPassword !== 'string' || typeof newPassword !== 'string' || typeof confirmPassword !== 'string') {
      res.status(400).json({ error: 'All fields required' })
      return
    }
    if (newPassword.length < 8) {
      res.status(400).json({ error: 'New password must be at least 8 characters' })
      return
    }
    if (newPassword !== confirmPassword) {
      res.status(400).json({ error: 'Passwords do not match' })
      return
    }
    const users = await readUsers()
    const idx = users.findIndex((x) => x.id === req.user.sub || x.email === req.user.email)
    if (idx === -1) {
      res.status(404).json({ error: 'Not found' })
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
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed' })
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
    const sectionsArr = Array.isArray(pageSections.sections) ? pageSections.sections : []
    const sectionsTotal = sectionsArr.length
    const contentStatus = buildContentStatusPanel(header, hero, footer, seo, wa, email)
    res.json({
      cards: {
        sectionsTotal,
        erpModulesTotal: modItems.length,
        erpModulesActive: countActive(modItems),
        industriesTotal: indItems.length,
        industriesActive: countActive(indItems),
        faqsTotal: faqItems.length,
        faqsActive: countActive(faqItems),
        leadsTotal: normLeads.length,
        leadsNew: normLeads.filter((l) => l.status === 'New').length,
        leadsContacted: normLeads.filter((l) => l.status === 'Contacted').length,
        leadsClosed: normLeads.filter((l) => l.status === 'Closed').length,
        mediaFiles: mediaIdx.items?.length ?? 0,
        lastUpdatedGlob: lastUpdated || null,
      },
      contentStatus,
      recentLeads: normLeads.slice(0, 5).map((l) => ({
        id: l.id,
        name: l.name,
        email: l.email,
        phone: l.phone,
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
    console.error(e)
    res.status(500).json({ error: 'Summary failed' })
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
    res.json({
      erpModules: countActive(modItems),
      erpModulesTotal: modItems.length,
      industrySolutions: countActive(indItems),
      industrySolutionsTotal: indItems.length,
      faqs: countActive(faqItems),
      leads: normLeads.length,
      newLeads: normLeads.filter((l) => l.status === 'New').length,
      contactedLeads: normLeads.filter((l) => l.status === 'Contacted').length,
      closedLeads: normLeads.filter((l) => l.status === 'Closed').length,
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
    const merged = { ...body }
    const prevMeta = typeof body._meta === 'object' && body._meta ? body._meta : {}
    merged._meta = {
      ...prevMeta,
      createdAt: prevMeta.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      updatedBy: req.user.email,
    }
    await writeJsonFile(file, merged)
    await touchContentMeta(key, req.user.email)
    await appendActivity({
      action: 'save',
      section: key,
      description: `Saved ${key}`,
      adminEmail: req.user.email,
      adminName: req.user.name || '',
    })
    res.json({ ok: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Save failed' })
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
    const items = [...store.items].sort((a, b) => String(b.updatedAt || '').localeCompare(String(a.updatedAt || '')))
    res.json({ items })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Failed to read pages' })
  }
})

app.get('/api/admin/pages/:id', authMiddleware, async (req, res) => {
  try {
    const store = await readPagesStore()
    const page = store.items.find((p) => p.id === req.params.id)
    if (!page) {
      res.status(404).json({ error: 'Page not found' })
      return
    }
    res.json({ page })
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
    const row = normalizePageFromBody({ ...body, slug }, { id })
    row.id = id
    store.items.push(row)
    await persistPagesStore(store, req.user, `Created page ${slug}`)
    res.status(201).json({ ok: true, page: row })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Create failed' })
  }
})

app.put('/api/admin/pages/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    const body = req.body
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      res.status(400).json({ error: 'JSON object body required' })
      return
    }
    const store = await readPagesStore()
    const idx = store.items.findIndex((p) => p.id === id)
    if (idx === -1) {
      res.status(404).json({ error: 'Page not found' })
      return
    }
    const prev = store.items[idx]
    const slug = normalizeSlugInput(body.slug)
    if (!isValidPageSlug(slug)) {
      res.status(400).json({ error: 'Invalid slug' })
      return
    }
    if (store.items.some((p, i) => i !== idx && p.slug.toLowerCase() === slug.toLowerCase())) {
      res.status(409).json({ error: 'Another page already uses this slug' })
      return
    }
    const row = normalizePageFromBody({ ...body, slug }, prev)
    row.id = prev.id
    store.items[idx] = row
    await persistPagesStore(store, req.user, `Updated page ${slug}`)
    res.json({ ok: true, page: row })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Update failed' })
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

function filterLeads(leads, { q, status, from, to }) {
  let out = leads.map(normalizeLead)
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
    res.status(500).json({ error: 'Failed to read leads' })
  }
})

app.get('/api/admin/leads/export', authMiddleware, async (_req, res) => {
  try {
    const leads = (await readLeads()).map(normalizeLead)
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

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Server error' })
})

app.listen(PORT, () => {
  console.log(`CMS API http://localhost:${PORT}`)
})
