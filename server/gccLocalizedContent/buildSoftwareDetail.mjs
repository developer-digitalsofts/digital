import { SEED_VERSION } from './profiles.mjs'
import { softwareDetailContentType } from './softwareDetailCatalog.mjs'
import { buildRegionalBlock } from './regionalDashboardDefaults.mjs'

function bi(en, ar) {
  return { en, ar }
}

function seedMeta() {
  return { _seedVersion: SEED_VERSION, _seedAt: new Date().toISOString() }
}

const VAT_LABELS = {
  AE: { en: 'UAE VAT', ar: 'ضريبة الإمارات' },
  SA: { en: 'Saudi VAT', ar: 'ضريبة القيمة المضافة السعودية' },
  QA: { en: 'Qatar VAT', ar: 'ضريبة القيمة المضافة القطرية' },
  OM: { en: 'Oman tax', ar: 'الضريبة العُمانية' },
  KW: { en: 'Kuwait tax', ar: 'الضريبة الكويتية' },
  BH: { en: 'Bahrain VAT', ar: 'ضريبة القيمة المضافة البحرينية' },
}

function detailPath(profile, kind, slug, lang) {
  const prefix = profile.code === 'AE' ? '' : `/${profile.slug}/${lang}`
  if (kind === 'module') {
    const flat =
      slug === 'point-of-sale-management-software'
        ? 'point-of-sale-software'
        : slug === 'integration-system'
          ? 'sms-integration-system'
          : slug
    return `${prefix}/software/${flat}`
  }
  return `${prefix}/software/industry/${slug}`
}

function localizeLabel(labelEn, vat) {
  return labelEn
    .split('UAE VAT & Tax Compliance')
    .join(`${vat.en} & Tax Compliance`)
    .split('UAE VAT')
    .join(vat.en)
}

export function buildSoftwareDetailLocale(profile, kind, slug, labelEn, lang = 'en') {
  const vat = VAT_LABELS[profile.code] || VAT_LABELS.AE
  const pagePath = detailPath(profile, kind, slug, lang)
  const isModule = kind === 'module'
  const localizedLabel = localizeLabel(labelEn, vat)
  const regional = buildRegionalBlock(profile)
  regional.vatLabel = vat

  const title = bi(`${localizedLabel} | DigitalManager`, `${localizedLabel} | DigitalManager`)
  const heading = bi(
    `${localizedLabel} for ${profile.fullName.en}`,
    `${localizedLabel} لـ${profile.fullName.ar}`,
  )
  const shortDescription = bi(
    `${isModule ? 'ERP module' : 'Industry ERP'} for ${profile.currency} operations in ${profile.cityPhrase.en}. Connect finance, inventory, sales and branch reporting from one cloud platform.`,
    `${isModule ? 'وحدة ERP' : 'ERP قطاعي'} لعمليات ${profile.currencyName.ar} في ${profile.cityPhrase.ar}.`,
  )
  const metaDescription = bi(
    `${localizedLabel} for businesses in ${profile.fullName.en}. ${profile.currency} finance, inventory and reporting for teams in ${profile.cityPhrase.en}. Book a demo.`,
    `${localizedLabel} للشركات في ${profile.fullName.ar}.`,
  )
  const heroSubhead = bi(
    `Track operations. Manage teams. Grow with ${profile.currency}.`,
    `تتبّع العمليات. أدِر الفرق. نمُ مع ${profile.currency}.`,
  )
  const demoCtaHeading = bi(
    `See ${localizedLabel} configured for ${profile.fullName.en}`,
    `شاهد ${localizedLabel} مهيّأ لـ${profile.fullName.ar}`,
  )
  const demoCtaSub = bi(
    `Book a walkthrough with ${profile.currency} demo data for ${profile.cityPhrase.en}.`,
    `احجز جولة ببيانات تجريبية ${profile.currency} لـ${profile.cityPhrase.ar}.`,
  )

  return {
    payload: {
      ...seedMeta(),
      template: 'software-detail',
      kind,
      slug,
      title,
      heading,
      shortDescription,
      label: bi(localizedLabel, localizedLabel),
      fields: {
        metaTitle: title,
        metaDescription,
        heroHeadline: heading,
        heroSubhead,
        heroIntro: shortDescription,
        heroEyebrow: bi(isModule ? 'SOFTWARE BY MODULE' : 'SOFTWARE BY INDUSTRY', isModule ? 'حسب الوحدة' : 'حسب القطاع'),
        demoCtaHeading,
        demoCtaSub,
      },
      hero: {
        eyebrow: bi(isModule ? 'SOFTWARE BY MODULE' : 'SOFTWARE BY INDUSTRY', isModule ? 'حسب الوحدة' : 'حسب القطاع'),
        headline: heading,
        subhead: heroSubhead,
        intro: shortDescription,
        ctaPrimary: bi('Get Live Demo', 'احجز عرضاً'),
        ctaSecondary: bi('WhatsApp Now', 'واتساب الآن'),
      },
      demoCta: {
        heading: demoCtaHeading,
        sub: demoCtaSub,
      },
      regional,
      _seedKind: 'software-detail',
    },
    seo: {
      pageTitle: title,
      metaDescription,
      metaKeywords: bi(
        `${localizedLabel}, ERP, ${profile.currency}, ${profile.name.en}, ${profile.cities.en[0]}, DigitalManager`,
        `${localizedLabel}, ERP, ${profile.currency}, ${profile.name.ar}, DigitalManager`,
      ),
      ogTitle: title,
      ogDescription: metaDescription,
      twitterTitle: title,
      twitterDescription: metaDescription,
      ogImage: '/digitalmanager-favicon.png',
      canonicalUrl: pagePath,
      twitterImage: '',
      robotsIndex: lang === 'ar' ? 'noindex' : 'index',
      robotsFollow: 'follow',
    },
  }
}

export function buildSoftwareDetailFromIdentity(profile, lang, contentType, globalIdentity, catalogEntry) {
  if (!globalIdentity?.includes(':')) return null
  const [kind, slug] = globalIdentity.split(':')
  if (softwareDetailContentType(kind) !== contentType) return null
  const entry = catalogEntry || { kind, slug, labelEn: slug }
  return buildSoftwareDetailLocale(profile, kind, slug, entry.labelEn, lang)
}
