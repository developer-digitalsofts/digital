/**
 * Idempotent CMS schema v2 migration — aligns JSON data with approved frontend.
 * Safe to run on every bootstrap; backs up before first mutation.
 */
import fs from 'fs/promises'
import path from 'path'

export const CMS_SCHEMA_VERSION = 2
export const TESTIMONIALS_SCHEMA_VERSION = 3

const DEFAULT_HERO_SLIDES = [
  {
    id: 'slide-erp',
    moduleType: 'erp',
    navLabel: { en: 'ERP', ar: 'ERP' },
    navIcon: 'LayoutGrid',
    visible: true,
    sortOrder: 0,
    pill: { en: 'ONE PLATFORM. COMPLETE CONTROL.', ar: 'منصة واحدة. تحكم كامل.' },
    titleBefore: { en: 'Everything Your', ar: 'كل ما يحتاجه' },
    titleLine2: { en: 'Business Needs.', ar: 'عملك.' },
    titleAccent: { en: 'In One Smart System.', ar: 'في نظام ذكي واحد.' },
    controlledTitleWrap: true,
    body: {
      en: 'Connect finance, inventory, sales, POS, HR, CRM, branches and reporting through one secure cloud ERP platform.',
      ar: 'اربط المالية والمخزون والمبيعات ونقطة البيع والموارد وCRM والفروع والتقارير عبر منصة ERP سحابية آمنة واحدة.',
    },
    ctaPrimary: { label: { en: 'Book Free Demo', ar: 'احجز عرضاً مجانياً' }, href: '#get-demo' },
    ctaSecondary: { label: { en: 'Explore Modules', ar: 'استكشف الوحدات' }, href: '/#modules' },
    dashboardImageUrl: '',
  },
  {
    id: 'slide-finance',
    moduleType: 'finance',
    navLabel: { en: 'Finance', ar: 'المالية' },
    navIcon: 'Wallet',
    visible: true,
    sortOrder: 1,
    pill: { en: 'REAL-TIME FINANCIAL CONTROL', ar: 'تحكم مالي فوري' },
    titleBefore: { en: 'See Every Number.', ar: 'اطلع على كل رقم.' },
    titleLine2: { en: 'Make Every Decision', ar: 'اتخذ كل قرار' },
    titleAccent: { en: 'Faster.', ar: 'أسرع.' },
    controlledTitleWrap: true,
    body: {
      en: 'Track cash flow, receivables, expenses and profitability in real time from one accurate financial view.',
      ar: 'تابع التدفق النقدي والذمم والمصروفات والربحية في الوقت الفعلي من عرض مالي دقيق واحد.',
    },
    ctaPrimary: { label: { en: 'Book Free Demo', ar: 'احجز عرضاً مجانياً' }, href: '#get-demo' },
    ctaSecondary: { label: { en: 'Explore Finance', ar: 'استكشف المالية' }, href: '/software/accounts-management-software' },
    dashboardImageUrl: '',
  },
  {
    id: 'slide-inventory',
    moduleType: 'inventory',
    navLabel: { en: 'Inventory', ar: 'المخزون' },
    navIcon: 'Package',
    visible: true,
    sortOrder: 2,
    pill: { en: 'SMART INVENTORY CONTROL', ar: 'تحكم ذكي بالمخزون' },
    titleBefore: { en: "Know What's Moving.", ar: 'اعرف ما يتحرك.' },
    titleAccent: { en: "Control What's Next.", ar: 'تحكم في ما يلي.' },
    controlledTitleWrap: true,
    body: {
      en: 'Monitor stock health, low-stock alerts, fast-moving products and branch availability before they affect sales.',
      ar: 'راقب صحة المخزون وتنبيهات النقص والمنتجات سريعة الحركة وتوفر الفروع قبل أن تؤثر على المبيعات.',
    },
    ctaPrimary: { label: { en: 'Book Free Demo', ar: 'احجز عرضاً مجانياً' }, href: '#get-demo' },
    ctaSecondary: { label: { en: 'Explore Inventory', ar: 'استكشف المخزون' }, href: '/software/inventory-management-software' },
    dashboardImageUrl: '',
  },
  {
    id: 'slide-pos',
    moduleType: 'pos',
    navLabel: { en: 'POS', ar: 'نقطة البيع' },
    navIcon: 'ShoppingCart',
    visible: true,
    sortOrder: 3,
    pill: { en: 'FASTER SALES. BETTER CONTROL.', ar: 'مبيعات أسرع. تحكم أفضل.' },
    titleBefore: { en: 'Turn Every Checkout', ar: 'حوّل كل عملية دفع' },
    titleAccent: { en: 'Into a Smarter Sale.', ar: 'إلى بيع أذكى.' },
    controlledTitleWrap: true,
    body: {
      en: 'Manage billing, tills, payments, products and daily sales through one fast and connected point-of-sale system.',
      ar: 'أدر الفوترة والصناديق والمدفوعات والمنتجات والمبيعات اليومية عبر نظام نقطة بيع سريع ومتصل.',
    },
    ctaPrimary: { label: { en: 'Book Free Demo', ar: 'احجز عرضاً مجانياً' }, href: '#get-demo' },
    ctaSecondary: { label: { en: 'Explore POS', ar: 'استكشف نقطة البيع' }, href: '/software/point-of-sale-software' },
    dashboardImageUrl: '',
  },
  {
    id: 'slide-hr',
    moduleType: 'hr',
    navLabel: { en: 'HR', ar: 'الموارد' },
    navIcon: 'Users',
    visible: true,
    sortOrder: 4,
    pill: { en: 'YOUR WORKFORCE. ONE CLEAR VIEW.', ar: 'قواك العاملة. رؤية واحدة واضحة.' },
    titleBefore: { en: 'Manage People,', ar: 'أدر الموظفين،' },
    titleLine2: { en: 'Attendance and Payroll', ar: 'الحضور والرواتب' },
    titleAccent: { en: 'With Confidence.', ar: 'بثقة.' },
    controlledTitleWrap: true,
    body: {
      en: 'Keep employee records, attendance, leave, payroll and departmental performance connected in one system.',
      ar: 'احتفظ بسجلات الموظفين والحضور والإجازات والرواتب وأداء الأقسام متصلة في نظام واحد.',
    },
    ctaPrimary: { label: { en: 'Book Free Demo', ar: 'احجز عرضاً مجانياً' }, href: '#get-demo' },
    ctaSecondary: { label: { en: 'Explore HR', ar: 'استكشف الموارد' }, href: '/software/payroll-management-software' },
    dashboardImageUrl: '',
  },
]

const APPROVED_PAGE_SECTIONS = [
  { id: 'topBar', name: 'Header top bar', visible: true, sortOrder: 0, deprecated: true },
  { id: 'hero', name: 'Hero Carousel', visible: true, sortOrder: 1 },
  { id: 'stats', name: 'Trust Metrics', visible: true, sortOrder: 2 },
  { id: 'about', name: 'Built for Your Industry', visible: true, sortOrder: 3 },
  { id: 'valueChain', name: 'One Platform — Every Business Function', visible: true, sortOrder: 4 },
  { id: 'demoCta', name: 'See DigitalManager in Action', visible: true, sortOrder: 5 },
  { id: 'modules', name: 'Powerful Modules', visible: true, sortOrder: 6 },
  { id: 'testimonials', name: 'Testimonials', visible: true, sortOrder: 7 },
  { id: 'personalizedDemo', name: 'Personalized Demo Form', visible: true, sortOrder: 8 },
  { id: 'faqs', name: 'FAQ', visible: true, sortOrder: 9 },
  { id: 'workflow', name: 'Workflow CTA', visible: false, sortOrder: 10, deprecated: true },
  { id: 'industries', name: 'Industry solutions (legacy)', visible: false, sortOrder: 11, deprecated: true },
  { id: 'cta', name: 'Final CTA (legacy)', visible: false, sortOrder: 12, deprecated: true },
  { id: 'footer', name: 'Footer', visible: true, sortOrder: 13, deprecated: true },
]

function nowMeta(updatedBy = 'cms-schema-migrate-v2') {
  const now = new Date().toISOString()
  return { createdAt: now, updatedAt: now, updatedBy }
}

async function readJsonSafe(readJsonFile, relPath, fallback = null) {
  try {
    return await readJsonFile(relPath)
  } catch {
    return fallback
  }
}

async function writeIfChanged(writeJsonFile, relPath, next, current) {
  const a = JSON.stringify(next)
  const b = current != null ? JSON.stringify(current) : null
  if (a === b) return false
  await writeJsonFile(relPath, next)
  return true
}

function migrateHero(hero) {
  const base = hero && typeof hero === 'object' ? { ...hero } : {}
  if (Array.isArray(base.slides) && base.slides.length >= 2 && base.schemaVersion >= CMS_SCHEMA_VERSION) {
    return base
  }
  return {
    ...base,
    schemaVersion: CMS_SCHEMA_VERSION,
    carouselEnabled: base.carouselEnabled !== false,
    autoplayEnabled: base.autoplayEnabled !== false,
    autoplayDurationMs: typeof base.autoplayDurationMs === 'number' ? base.autoplayDurationMs : 5000,
    slides: Array.isArray(base.slides) && base.slides.length >= 2 ? base.slides : DEFAULT_HERO_SLIDES,
    showTrustPoints: base.showTrustPoints !== false,
  }
}

function migrateValueChain(doc) {
  const base = doc && typeof doc === 'object' ? { ...doc } : {}
  if (base.schemaVersion >= CMS_SCHEMA_VERSION && base.eyebrow) return base
  const deprecatedCards = Array.isArray(base.cards) ? base.cards : []
  return {
    schemaVersion: CMS_SCHEMA_VERSION,
    eyebrow: base.eyebrow || {
      en: 'All-in-One ERP Modules',
      ar: 'وحدات ERP شاملة',
    },
    title: base.title || {
      en: 'One Platform. Every Business Function.',
      ar: 'منصة واحدة. كل وظائف الأعمال.',
    },
    subtitle: base.subtitle,
    _deprecatedCards: deprecatedCards,
    _meta: base._meta,
  }
}

function defaultDemoCta() {
  return {
    schemaVersion: CMS_SCHEMA_VERSION,
    enabled: true,
    title: {
      en: 'See DigitalManager in Action',
      ar: 'شاهد ديجيتال مانجر أثناء العمل',
    },
    description: {
      en: 'Book a personalized demo and discover the right ERP solution for your business.',
      ar: 'احجز عرضًا مخصصًا واكتشف حل ERP المناسب لعملك.',
    },
    buttonLabel: {
      en: 'Book Your Free Demo',
      ar: 'احجز عرضك المجاني',
    },
    _meta: nowMeta(),
  }
}

function defaultTestimonials() {
  return {
    schemaVersion: TESTIMONIALS_SCHEMA_VERSION,
    section: {
      enabled: true,
      eyebrow: { en: 'CLIENT SUCCESS', ar: 'نجاح العملاء' },
      heading: { en: 'Trusted by Growing UAE Businesses', ar: 'موثوق من الشركات النامية في الإمارات' },
      supportingText: {
        en: 'Verified feedback from teams using DigitalManager to unify finance, inventory, retail and operations.',
        ar: 'آراء موثقة من فرق تستخدم ديجيتال مانجر لتوحيد المالية والمخزون والتجزئة والعمليات.',
      },
      limit: 6,
      selectionMode: 'featured',
      manualIds: [],
      viewAllLabel: { en: 'View All Testimonials', ar: 'عرض كل الشهادات' },
      viewAllUrl: '/testimonials',
      showViewAll: true,
    },
    page: {
      enabled: true,
      title: { en: 'Client Testimonials', ar: 'شهادات العملاء' },
      intro: {
        en: 'Read verified client feedback from businesses using DigitalManager across the UAE.',
        ar: 'اقرأ آراء العملاء الموثقة من الشركات التي تستخدم ديجيتال مانجر في الإمارات.',
      },
      seoTitle: { en: 'Client Testimonials | DigitalManager', ar: 'شهادات العملاء | ديجيتال مانجر' },
      seoDescription: {
        en: 'Verified client testimonials from UAE businesses using DigitalManager ERP, POS and inventory solutions.',
        ar: 'شهادات عملاء موثقة من شركات إماراتية تستخدم حلول ديجيتال مانجر.',
      },
    },
    items: [],
    _meta: nowMeta(),
  }
}

function migrateTestimonialsV3(doc) {
  if (!doc || typeof doc !== 'object') return defaultTestimonials()
  if ((doc.schemaVersion ?? 0) >= TESTIMONIALS_SCHEMA_VERSION) return doc

  const legacyItems = Array.isArray(doc.items) ? doc.items : []
  const items = legacyItems.map((item, index) => ({
    ...item,
    internalTitle: item.internalTitle || pickEn(item.customerName) || item.id || `Testimonial ${index + 1}`,
    status: 'draft',
    isSample: true,
    featuredOnHomepage: false,
    verified: false,
    countryCode: item.countryCode || 'AE',
    languageCode: item.languageCode || 'en',
    enabled: item.enabled !== false,
    sortOrder: item.sortOrder ?? index,
  }))

  return {
    schemaVersion: TESTIMONIALS_SCHEMA_VERSION,
    section: {
      enabled: true,
      eyebrow: doc.eyebrow || { en: 'CLIENT SUCCESS', ar: 'نجاح العملاء' },
      heading: doc.title || doc.heading || { en: 'Trusted by Growing UAE Businesses', ar: 'موثوق من الشركات النامية في الإمارات' },
      supportingText: doc.supportingText || {
        en: 'Verified feedback from teams using DigitalManager to unify finance, inventory, retail and operations.',
        ar: 'آراء موثقة من فرق تستخدم ديجيتال مانجر لتوحيد المالية والمخزون والتجزئة والعمليات.',
      },
      limit: 6,
      selectionMode: 'featured',
      manualIds: [],
      viewAllLabel: { en: 'View All Testimonials', ar: 'عرض كل الشهادات' },
      viewAllUrl: '/testimonials',
      showViewAll: true,
    },
    page: {
      enabled: true,
      title: doc.title || { en: 'Client Testimonials', ar: 'شهادات العملاء' },
      intro: doc.page?.intro || {
        en: 'Read verified client feedback from businesses using DigitalManager across the UAE.',
        ar: 'اقرأ آراء العملاء الموثقة من الشركات التي تستخدم ديجيتال مانجر في الإمارات.',
      },
      seoTitle: doc.page?.seoTitle || { en: 'Client Testimonials | DigitalManager', ar: 'شهادات العملاء | ديجيتال مانجر' },
      seoDescription: doc.page?.seoDescription || {
        en: 'Verified client testimonials from UAE businesses using DigitalManager ERP, POS and inventory solutions.',
        ar: 'شهادات عملاء موثقة من شركات إماراتية تستخدم حلول ديجيتال مانجر.',
      },
    },
    items,
    _meta: doc._meta || nowMeta(),
  }
}

function pickEn(value) {
  if (typeof value === 'string') return value
  if (value && typeof value === 'object' && typeof value.en === 'string') return value.en
  return ''
}

function defaultPersonalizedDemo() {
  return {
    schemaVersion: CMS_SCHEMA_VERSION,
    enabled: true,
    eyebrow: {
      en: 'See DigitalManager in Action',
      ar: 'شاهد ديجيتال مانجر أثناء العمل',
    },
    title: {
      en: 'Book a Personalized Demo Tailored to Your Business',
      ar: 'احجز عرضًا مخصصًا يناسب عملك',
    },
    description: {
      en: 'Our experts will walk you through the platform, show how it fits your needs and answer all your questions.',
      ar: 'سيرشدك خبراؤنا عبر المنصة، ويوضحون كيف تناسب احتياجاتك ويجيبون على جميع أسئلتك.',
    },
    highlights: [
      { id: 'tour', icon: 'Users', label: { en: 'Personalized Tour', ar: 'جولة مخصصة' }, sortOrder: 0, enabled: true },
      { id: 'commitment', icon: 'ShieldCheck', label: { en: 'No Commitment', ar: 'بدون التزام' }, sortOrder: 1, enabled: true },
      { id: 'response', icon: 'HandHelping', label: { en: 'Quick Response', ar: 'استجابة سريعة' }, sortOrder: 2, enabled: true },
    ],
    submitLabel: { en: 'Book My Demo', ar: 'احجز عرضي' },
    successMessage: { en: 'Thank you — we will contact you shortly.', ar: 'شكرًا — سنتواصل معك قريبًا.' },
    errorMessage: { en: 'Please check the highlighted fields and try again.', ar: 'يرجى مراجعة الحقول المظللة والمحاولة مرة أخرى.' },
    _meta: nowMeta(),
  }
}

function migratePageSections(doc) {
  const base = doc && typeof doc === 'object' ? { ...doc } : {}
  const existing = Array.isArray(base.sections) ? base.sections : []
  const byId = new Map(existing.map((s) => [s.id, s]))
  const merged = APPROVED_PAGE_SECTIONS.map((def) => {
    const prev = byId.get(def.id)
    return {
      ...def,
      visible: prev?.visible ?? def.visible,
      sortOrder: prev?.sortOrder ?? def.sortOrder,
      name: def.name,
    }
  })
  for (const s of existing) {
    if (!merged.some((m) => m.id === s.id)) merged.push({ ...s, deprecated: true, visible: false })
  }
  return {
    schemaVersion: CMS_SCHEMA_VERSION,
    sections: merged.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    _meta: base._meta || nowMeta(),
  }
}

/**
 * @param {{ dataDir: string, readJsonFile: Function, writeJsonFile: Function, safeReadJson: Function }} deps
 */
export async function migrateCmsSchemaV2(deps) {
  const { dataDir, readJsonFile, writeJsonFile, safeReadJson } = deps
  const backupDir = path.join(dataDir, 'backups', `schema-v2-${Date.now()}`)
  let changed = 0

  const targets = ['hero.json', 'valueChain.json', 'pageSections.json', 'demoCta.json', 'testimonials.json', 'personalizedDemo.json']

  const existingHero = await readJsonSafe(readJsonFile, 'hero.json', {})
  if ((existingHero?.schemaVersion ?? 0) < CMS_SCHEMA_VERSION) {
    await fs.mkdir(backupDir, { recursive: true })
    for (const file of targets) {
      const p = path.join(dataDir, file)
      try {
        await fs.copyFile(p, path.join(backupDir, file))
      } catch {
        /* file may not exist yet */
      }
    }
  }

  if (await writeIfChanged(writeJsonFile, 'hero.json', migrateHero(existingHero), existingHero)) changed++

  const vc = await readJsonSafe(readJsonFile, 'valueChain.json', {})
  if (await writeIfChanged(writeJsonFile, 'valueChain.json', migrateValueChain(vc), vc)) changed++

  const ps = await readJsonSafe(readJsonFile, 'pageSections.json', {})
  if (await writeIfChanged(writeJsonFile, 'pageSections.json', migratePageSections(ps), ps)) changed++

  const demoCta = await readJsonSafe(readJsonFile, 'demoCta.json', null)
  const nextDemoCta = demoCta?.schemaVersion >= CMS_SCHEMA_VERSION ? demoCta : defaultDemoCta()
  if (await writeIfChanged(writeJsonFile, 'demoCta.json', nextDemoCta, demoCta)) changed++

  const testimonials = await readJsonSafe(readJsonFile, 'testimonials.json', null)
  const migratedTestimonials = migrateTestimonialsV3(testimonials)
  if (await writeIfChanged(writeJsonFile, 'testimonials.json', migratedTestimonials, testimonials)) changed++

  const personalizedDemo = await readJsonSafe(readJsonFile, 'personalizedDemo.json', null)
  const nextPersonalizedDemo =
    personalizedDemo?.schemaVersion >= CMS_SCHEMA_VERSION ? personalizedDemo : defaultPersonalizedDemo()
  if (await writeIfChanged(writeJsonFile, 'personalizedDemo.json', nextPersonalizedDemo, personalizedDemo)) changed++

  return { changed, backupDir: changed > 0 ? backupDir : null }
}
