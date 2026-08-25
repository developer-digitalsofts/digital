/**
 * Regionalize baseline-only homepage sections (demo CTA, mega menus, etc.)
 * when no locale record exists yet.
 */
import { getProfile, SHARED_COPY } from './profiles.mjs'

function arIn(name) {
  return `في ${name}`
}

const VAT_MENU_REPLACEMENTS = {
  AE: { en: 'UAE VAT & Tax Compliance', ar: 'امتثال ضريبة القيمة المضافة في الإمارات' },
  SA: { en: 'Saudi VAT Invoicing', ar: 'فوترة ضريبة القيمة المضافة السعودية' },
  QA: { en: 'Qatar VAT Invoicing', ar: 'فوترة ضريبة القيمة المضافة القطرية' },
  OM: { en: 'Oman Tax Invoicing', ar: 'فوترة ضريبية عُمانية' },
  KW: { en: 'Kuwait Tax Invoicing', ar: 'فوترة ضريبية كويتية' },
  BH: { en: 'Bahrain VAT Invoicing', ar: 'فوترة ضريبة القيمة المضافة البحرينية' },
}

function replaceBi(obj, fromEn, toEn, fromAr, toAr) {
  if (!obj || typeof obj !== 'object') return obj
  const next = { ...obj }
  if (typeof next.en === 'string' && next.en.includes(fromEn)) {
    next.en = next.en.split(fromEn).join(toEn)
  }
  if (typeof next.ar === 'string' && fromAr && toAr && next.ar.includes(fromAr)) {
    next.ar = next.ar.split(fromAr).join(toAr)
  }
  return next
}

function walkReplace(node, replacer) {
  if (typeof node === 'string') return replacer(node)
  if (Array.isArray(node)) return node.map((item) => walkReplace(item, replacer))
  if (node && typeof node === 'object') {
    if ('en' in node || 'ar' in node) return replacer(node)
    const out = {}
    for (const [k, v] of Object.entries(node)) out[k] = walkReplace(v, replacer)
    return out
  }
  return node
}

export function regionalizeMegaMenus(doc, countryCode) {
  const profile = getProfile(countryCode)
  const vat = VAT_MENU_REPLACEMENTS[profile.code] || VAT_MENU_REPLACEMENTS.AE
  return walkReplace(doc, (value) => {
    if (value && typeof value === 'object' && ('en' in value || 'ar' in value)) {
      let next = replaceBi(value, 'UAE VAT & Tax Compliance', vat.en, 'امتثال ضريبة القيمة المضافة في الإمارات', vat.ar)
      next = replaceBi(next, 'UAE VAT-compliant invoicing', `${profile.currency} invoicing`, 'فوترة متوافقة مع ضريبة القيمة المضافة', `فوترة ${profile.currencyName.ar}`)
      next = replaceBi(next, 'UAE VAT', `${profile.name.en} VAT`, 'ضريبة الإمارات', `ضريبة ${profile.name.ar}`)
      return next
    }
    if (typeof value === 'string') {
      return value
        .split('UAE VAT').join(`${profile.name.en} VAT`)
        .split('AED').join(profile.currency)
        .split('United Arab Emirates').join(profile.fullName.en)
        .split('UAE').join(profile.name.en)
    }
    return value
  })
}

export function regionalizeDemoCta(doc, profile) {
  if (!doc || typeof doc !== 'object') return doc
  return {
    ...doc,
    title: {
      en: `See DigitalManager in Action Across ${profile.fullName.en}`,
      ar: `شاهد DigitalManager أثناء العمل ${arIn(profile.fullName.ar)}`,
    },
    description: {
      en: `Book a personalized demo and explore ERP modules configured for ${profile.currency} operations in ${profile.cityPhrase.en}.`,
      ar: `احجز عرضاً مخصصاً واستكشف وحدات ERP المهيّأة لعمليات ${profile.currencyName.ar} في ${profile.cityPhrase.ar}.`,
    },
  }
}

export function regionalizeCta(doc, profile) {
  if (!doc || typeof doc !== 'object') return doc
  return {
    ...doc,
    title: {
      en: `Ready to modernize your business in ${profile.fullName.en}?`,
      ar: `هل أنت مستعد لتحديث أعمالك ${arIn(profile.fullName.ar)}؟`,
    },
    paragraph: {
      en: `DigitalManager helps growing businesses in ${profile.fullName.en} manage accounts, inventory, sales, payroll, POS and reporting from one connected platform. ${SHARED_COPY.regionalSupportNote.en}`,
      ar: `يساعد DigitalManager الشركات النامية ${arIn(profile.fullName.ar)} على إدارة الحسابات والمخزون والمبيعات والرواتب ونقطة البيع والتقارير من منصة واحدة. ${SHARED_COPY.regionalSupportNote.ar}`,
    },
  }
}

export function regionalizeBlogSection(doc, profile) {
  if (!doc?.section) return doc
  return {
    ...doc,
    section: {
      ...doc.section,
      heading: {
        en: `ERP Insights for ${profile.fullName.en} Business Leaders`,
        ar: `رؤى ERP لقادة الأعمال ${arIn(profile.fullName.ar)}`,
      },
      supportingText: {
        en: `Practical articles on cloud ERP, ${profile.currency} finance, inventory and multi-branch operations for teams in ${profile.cityPhrase.en}.`,
        ar: `مقالات عملية حول ERP السحابي ومالية ${profile.currencyName.ar} والمخزون وعمليات الفروع للفرق في ${profile.cityPhrase.ar}.`,
      },
    },
  }
}

export function regionalizePersonalizedDemo(doc, profile) {
  if (!doc || typeof doc !== 'object') return doc
  return {
    ...doc,
    title: {
      en: `Book a Demo Tailored to Your ${profile.name.en} Business`,
      ar: `احجز عرضاً مخصصاً لعملك ${arIn(profile.name.ar)}`,
    },
    description: {
      en: `Our specialists walk through finance, inventory and branch workflows relevant to ${profile.cityPhrase.en}. Regional GCC support is available from our UAE team.`,
      ar: `يرشدك متخصصونا عبر سير عمل المالية والمخزون والفروع المناسبة للفرق في ${profile.cityPhrase.ar}. الدعم الإقليمي متاح من فريقنا في الإمارات.`,
    },
  }
}

export function regionalizeHomepageBaseline(key, doc, countryCode) {
  const profile = getProfile(countryCode)
  if (!doc || !profile) return doc
  switch (key) {
    case 'megaMenus':
      return regionalizeMegaMenus(doc, countryCode)
    case 'demoCta':
      return regionalizeDemoCta(doc, profile)
    case 'cta':
      return regionalizeCta(doc, profile)
    case 'blogSection':
      return regionalizeBlogSection(doc, profile)
    case 'personalizedDemo':
      return regionalizePersonalizedDemo(doc, profile)
    default:
      return doc
  }
}
