/**
 * Builds localized city page payloads — Pakistan market (PKR, English).
 */
import {
  CITY_PAGE_SLUG,
  CITY_PRODUCT_PAGE_SLUGS,
  getCity,
  getCountryProfileForCity,
} from './cityRegistry.mjs'
import { CITY_PRODUCT_LABELS } from './pakistanConfig.mjs'

export const CITY_SEED_VERSION = 'pk-city-localized-content-v1'

function bi(en, ar = en) {
  return { en, ar }
}

function seedMeta() {
  return { _seedVersion: CITY_SEED_VERSION, _seedAt: new Date().toISOString() }
}

/** Unique hero angles per Pakistan city. */
const CITY_HERO_ANGLES = {
  karachi: {
    h1: 'Cloud ERP for Karachi trading, wholesale and multi-branch retail',
    intro:
      'Karachi operators run port-linked trading houses, wholesale depots and retail chains — often on disconnected spreadsheets. DigitalManager connects GL, inventory, POS and payroll so finance sees every branch in PKR without month-end surprises.',
    metaDesc:
      'ERP software for Karachi businesses — PKR finance, multi-branch inventory, POS and payroll on one cloud platform. Book a demo for trading, retail and logistics operators.',
  },
  lahore: {
    h1: 'ERP for Lahore textile, FMCG distribution and Punjab retail expansion',
    intro:
      'Lahore manufacturers and distributors scale across Punjab with seasonal demand and complex credit terms. DigitalManager links production planning, route delivery and branch KPIs on PKR books built for textile, FMCG and F&B operators.',
    metaDesc:
      'Lahore ERP software for textile, FMCG and retail. Production planning, branch POS and PKR reporting with DigitalManager cloud ERP.',
  },
  islamabad: {
    h1: 'Professional services ERP for Islamabad project billing and approvals',
    intro:
      'Islamabad firms bill by milestone, retainer and approved timesheets — not generic product lines. DigitalManager gives consulting, IT and healthcare teams PKR ledgers, approval workflows and audit-ready exports from Blue Area to I-8.',
    metaDesc:
      'Islamabad ERP for professional services, IT and clinics. Milestone billing, approvals and PKR finance on DigitalManager.',
  },
  rawalpindi: {
    h1: 'Workshop and retail ERP for Rawalpindi twin-city operators',
    intro:
      'Rawalpindi workshops, spare-parts counters and wholesale outlets need job costing without enterprise overhead. DigitalManager rolls out invoicing, stock and simple dashboards for operators serving Rawalpindi, Islamabad and northern Punjab routes.',
    metaDesc:
      'Rawalpindi ERP for workshops, retail and wholesale. Job costing, spare parts inventory and PKR invoicing with DigitalManager.',
  },
  faisalabad: {
    h1: 'Textile and industrial ERP for Faisalabad mills and agri-traders',
    intro:
      'Faisalabad textile mills and agri-traders track BOMs, landed costs and export documentation daily. DigitalManager connects production planning, vendor payments and PKR consolidation so plant managers and finance share one source of truth.',
    metaDesc:
      'Faisalabad ERP for textile manufacturing and agri-trading. BOM planning, landed costs and PKR reporting on DigitalManager.',
  },
  multan: {
    h1: 'Agri-business ERP for Multan cold storage and southern Punjab hubs',
    intro:
      'Multan operators manage seasonal crops, cold storage and inter-city transfers with tight margins. DigitalManager forecasts demand peaks, tracks cold-chain inventory and consolidates PKR reporting across Multan, Khanewal and Sahiwal depots.',
    metaDesc:
      'Multan ERP for agriculture, cold storage and wholesale. Seasonal forecasting, inventory control and PKR finance with DigitalManager.',
  },
  peshawar: {
    h1: 'Pharma and wholesale ERP for Peshawar regional distribution',
    intro:
      'Peshawar wholesalers and pharmacies need batch tracking, credit ageing and multi-warehouse stock without slow month-end closes. DigitalManager gives border-trade and healthcare distributors PKR ledgers and compliance-friendly audit trails.',
    metaDesc:
      'Peshawar ERP for pharmaceuticals, trading and healthcare. Batch tracking, credit control and PKR billing on DigitalManager.',
  },
  quetta: {
    h1: 'Trading and logistics ERP for Quetta provincial operators',
    intro:
      'Quetta trading houses and transport operators bill by project, delivery run and branch — not one-size-fits-all SKUs. DigitalManager links fleet costing, project billing and affordable cloud ERP rollout for Balochistan growth companies.',
    metaDesc:
      'Quetta ERP for trading houses, transport and construction supply. Fleet costing, project billing and PKR dashboards with DigitalManager.',
  },
}

const PAGE_FOCUS = {
  'erp-software': {
    suffix: 'Cloud ERP',
    angle: (city) =>
      `Full finance, inventory, payroll and multi-branch operations for ${city.name.en} — configured on PKR books with phased rollout from DigitalManager Pakistan.`,
    meta: (city) =>
      `${city.name.en} ERP software — finance, inventory, payroll and branch reporting in PKR. DigitalManager cloud ERP for ${city.focus.en}.`,
  },
  'pos-software': {
    suffix: 'POS Software',
    angle: (city) =>
      `Retail billing, stock sync and branch POS for ${city.name.en} outlets — connected to central PKR inventory and finance so counter sales match the ledger.`,
    meta: (city) =>
      `${city.name.en} POS software with inventory sync and PKR reporting. DigitalManager retail POS for ${city.focus.en}.`,
  },
  'accounting-software': {
    suffix: 'Accounting Software',
    angle: (city) =>
      `General ledger, invoicing and management reporting for ${city.name.en} finance teams — VAT-ready documents and audit exports on PKR without spreadsheet chaos.`,
    meta: (city) =>
      `${city.name.en} accounting software — PKR general ledger, invoicing and financial reporting. DigitalManager for ${city.focus.en}.`,
  },
}

function buildFaqs(city, profile, pageSlug) {
  const cityName = city.name.en
  const product = CITY_PRODUCT_LABELS[pageSlug]?.en || 'ERP'
  return [
    {
      id: `faq-${city.slug}-${pageSlug}-1`,
      question: bi(`Is DigitalManager ${product} suitable for ${cityName} businesses?`),
      answer: bi(
        `Yes. We configure PKR ledgers, invoicing workflows and modules for ${city.focus.en}. Implementation is led for Pakistan with support for ${cityName} operators.`,
      ),
    },
    {
      id: `faq-${city.slug}-${pageSlug}-2`,
      question: bi(`How long does ${product} rollout take in ${cityName}?`),
      answer: bi(
        `Most ${cityName} SMEs go live in two to six weeks depending on branches and data migration. We phase finance and inventory first, then POS or payroll if needed.`,
      ),
    },
    {
      id: `faq-${city.slug}-${pageSlug}-3`,
      question: bi(`Do you support PKR and local invoicing in ${cityName}?`),
      answer: bi(
        `DigitalManager supports ${profile.currency} invoicing, tax-ready documents and audit exports configured for Pakistan regulations. Your finance team reviews mappings before go-live.`,
      ),
    },
  ]
}

function buildTestimonials(city, pageSlug) {
  const industry = city.industries[0]
  const product = CITY_PRODUCT_LABELS[pageSlug]?.en || 'ERP'
  return [
    {
      id: `t-${city.slug}-${pageSlug}-1`,
      name: bi(`${city.name.en} Operations Lead`),
      role: bi(`${industry} · ${city.name.en}`),
      quote: bi(
        `We replaced disconnected tools with DigitalManager ${product}. Our ${city.name.en} team closes books faster and sees stock across branches without manual spreadsheets.`,
      ),
      rating: 5,
    },
  ]
}

/**
 * @param {string} citySlug
 * @param {string} pageSlug
 */
export function buildCityPagePayload(citySlug, pageSlug = CITY_PAGE_SLUG) {
  const city = getCity(citySlug)
  if (!city) throw new Error(`Unknown city: ${citySlug}`)
  if (!CITY_PRODUCT_PAGE_SLUGS.includes(pageSlug)) {
    throw new Error(`Unknown city page slug: ${pageSlug}`)
  }
  const profile = getCountryProfileForCity(citySlug)
  const base = CITY_HERO_ANGLES[city.slug] || CITY_HERO_ANGLES.karachi
  const pageDef = PAGE_FOCUS[pageSlug] || PAGE_FOCUS[CITY_PAGE_SLUG]
  const productLabel = CITY_PRODUCT_LABELS[pageSlug]?.en || pageDef.suffix
  const h1 = `${productLabel} for ${city.name.en} — ${pageDef.suffix === 'Cloud ERP' ? base.h1.replace(/^Cloud ERP for /, '') : city.focus.en}`
  const intro = pageDef.angle(city)

  const internalLinks = [
    { label: bi('Contact us'), href: '/contact' },
    { label: bi('ERP modules'), href: '/erp' },
    { label: bi('Industries'), href: '/industries' },
    ...CITY_PRODUCT_PAGE_SLUGS.filter((s) => s !== pageSlug).map((s) => ({
      label: bi(CITY_PRODUCT_LABELS[s]?.en || s),
      href: `/${city.slug}/${s}`,
    })),
  ]

  return {
    ...seedMeta(),
    template: 'cms-page',
    citySlug: city.slug,
    cityName: city.name,
    pageSlug,
    title: bi(`${productLabel} · ${city.name.en}`, `${productLabel} · ${city.name.en}`),
    heading: bi(h1, h1),
    shortDescription: bi(intro.slice(0, 240), intro.slice(0, 240)),
    contact: {
      phoneDisplay: '+92 300 000 0000',
      phoneHref: 'tel:+923000000000',
      email: 'info@digitalmanager.com.pk',
      label: bi('Pakistan sales'),
      address: bi(
        `DigitalManager Pakistan — serving ${city.name.en} and businesses across Pakistan.`,
      ),
    },
    internalLinks,
    sections: [
      {
        id: `${city.slug}-${pageSlug}-hero`,
        type: 'hero',
        visible: true,
        order: 0,
        content: {
          eyebrow: bi(`${productLabel} · ${city.name.en}`),
          title: bi(h1, h1),
          description: bi(intro, intro),
          primaryCta: { label: bi('Book a Demo'), href: '/contact' },
          secondaryCta: { label: bi('Explore Modules'), href: '/erp' },
        },
      },
      {
        id: `${city.slug}-${pageSlug}-services`,
        type: 'featureGrid',
        visible: true,
        order: 1,
        content: {
          eyebrow: bi('Core capabilities'),
          title: bi(`${productLabel} configured for ${city.name.en}`),
          items: city.services.map((s, i) => ({
            id: `svc-${city.slug}-${pageSlug}-${i}`,
            title: bi(s, s),
            description: bi(`${s} for ${city.focus.en} — on PKR books with DigitalManager.`),
          })),
        },
      },
      {
        id: `${city.slug}-${pageSlug}-industries`,
        type: 'featureGrid',
        visible: true,
        order: 2,
        content: {
          eyebrow: bi('Industries we serve'),
          title: bi(`Industry programmes popular in ${city.name.en}`),
          items: city.industries.map((ind, i) => ({
            id: `ind-${city.slug}-${pageSlug}-${i}`,
            title: bi(ind, ind),
            description: bi(
              `${ind} operators in ${city.name.en} use DigitalManager for finance, stock and branch reporting.`,
            ),
          })),
        },
      },
      {
        id: `${city.slug}-${pageSlug}-body`,
        type: 'richText',
        visible: true,
        order: 3,
        content: {
          html: bi(
            `<p>${intro}</p><p>Teams in ${city.name.en} choose DigitalManager when spreadsheets slow month-end close or branch stock stops matching the ledger. We configure PKR charts, tax mappings and role-based access before your users log in.</p>`,
          ),
        },
      },
      {
        id: `${city.slug}-${pageSlug}-testimonials`,
        type: 'testimonials',
        visible: true,
        order: 4,
        content: { items: buildTestimonials(city, pageSlug) },
      },
      {
        id: `${city.slug}-${pageSlug}-faqs`,
        type: 'faq',
        visible: true,
        order: 5,
        content: { items: buildFaqs(city, profile, pageSlug) },
      },
    ],
  }
}

export function buildCityPageSeo(citySlug, pageSlug = CITY_PAGE_SLUG) {
  const city = getCity(citySlug)
  const pageDef = PAGE_FOCUS[pageSlug] || PAGE_FOCUS[CITY_PAGE_SLUG]
  const product = CITY_PRODUCT_LABELS[pageSlug]?.en || 'ERP'
  const metaDesc = pageDef.meta(city)
  const title = `${product} ${city.name.en} | DigitalManager Pakistan`
  return {
    title: bi(title, title),
    description: bi(metaDesc, metaDesc),
    keywords: bi(
      `${product} ${city.name.en}, cloud ERP Pakistan, PKR accounting, DigitalManager ${city.name.en}`,
    ),
    noIndex: false,
    robotsIndex: 'index',
    robotsFollow: 'follow',
  }
}

export function buildCityLocaleRecord(citySlug, pageSlug = CITY_PAGE_SLUG, lang = 'en', partial = {}) {
  const city = getCity(citySlug)
  if (!city) throw new Error(`Unknown city: ${citySlug}`)
  const payload = buildCityPagePayload(citySlug, pageSlug)
  const seo = buildCityPageSeo(citySlug, pageSlug)
  const isEn = lang === 'en'

  return {
    contentType: 'cityPage',
    globalIdentity: `city:${city.slug}:${pageSlug}`,
    slug: pageSlug,
    citySlug: city.slug,
    countryCode: city.countryCode,
    languageCode: lang,
    inheritanceMode: 'override',
    translationStatus: isEn ? 'published' : 'missing',
    publicationStatus: isEn ? 'published' : 'draft',
    enabled: true,
    seo,
    payload,
    ...partial,
  }
}
