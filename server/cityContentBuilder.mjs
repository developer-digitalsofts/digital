/**
 * Builds localized city page payloads — Pakistan market (PKR, English).
 */
import {
  CITY_HOME_SLUG,
  CITY_PAGE_SLUG,
  CITY_PRODUCT_PAGE_SLUGS,
  getCity,
  getCountryProfileForCity,
} from './cityRegistry.mjs'
import { CITY_PRODUCT_LABELS, resolvePakistanContact, servingBusinessesIn } from './pakistanConfig.mjs'

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
  hyderabad: {
    h1: 'Cloud ERP for Hyderabad wholesale, manufacturing and Sindh retail',
    intro:
      'Hyderabad operators run Sindh wholesale markets, light manufacturing and growing retail chains on mixed tools. DigitalManager connects PKR finance, distributor credit and multi-branch stock so Hyderabad teams close the month without spreadsheet chaos.',
    metaDesc:
      'Hyderabad ERP software for wholesale, manufacturing and retail. PKR invoicing, distributor credit and inventory sync with DigitalManager.',
  },
  sialkot: {
    h1: 'Export manufacturing ERP for Sialkot sports goods and surgical makers',
    intro:
      'Sialkot exporters juggle job costing, shipment documents and PKR cashflow across sports goods and surgical lines. DigitalManager gives factory and finance teams one ledger for orders, landed costs and export-ready reporting.',
    metaDesc:
      'Sialkot ERP for export manufacturing, sports goods and surgical instruments. Job costing, export documents and PKR reporting on DigitalManager.',
  },
  gujranwala: {
    h1: 'Industrial ERP for Gujranwala ceramics, electrical and wholesale markets',
    intro:
      'Gujranwala manufacturers and wholesalers move ceramics, electrical goods and Punjab dealer stock at speed. DigitalManager ties production planning, dealer billing and PKR inventory so plant and market teams share one source of truth.',
    metaDesc:
      'Gujranwala ERP for ceramics, electrical goods and wholesale. Production planning, dealer billing and PKR finance with DigitalManager.',
  },
}

const CITY_HOME_EXTRAS = {
  karachi:
    'From Korangi warehouses to Clifton service firms, Karachi businesses need one PKR ledger that follows stock across the port, wholesale markets and retail floors. DigitalManager is built for that tempo — not a generic overseas template. Serving businesses in Karachi means configuring tax-ready invoices, branch POS and payroll around how your team already works, then training users before go-live. Finance sees every location without waiting for month-end email attachments.',
  lahore:
    'Lahore growth companies expand across Punjab with seasonal peaks and long credit cycles. Serving businesses in Lahore, DigitalManager maps textile, FMCG and retail workflows onto PKR books so production, delivery and branch KPIs stay aligned. Implementation is phased: finance and inventory first, then POS or payroll when the core is stable.',
  islamabad:
    'Islamabad professional firms bill by milestone and approval, not shop-floor SKUs. Serving businesses in Islamabad, we configure timesheets, retainers and audit-ready exports for IT, consulting and clinic operators from Blue Area to F-sectors. Your PKR chart of accounts stays clean enough for banks and partners to trust.',
  rawalpindi:
    'Rawalpindi workshops and twin-city retailers need job costing without enterprise overhead. Serving businesses in Rawalpindi, DigitalManager rolls out invoicing, spare-parts catalogues and simple dashboards that still consolidate to PKR finance. Operators serving Islamabad routes keep one stock picture instead of two spreadsheets.',
  faisalabad:
    'Faisalabad mills and agri-traders live on BOMs, landed costs and vendor payments. Serving businesses in Faisalabad, DigitalManager connects production planning to PKR consolidation so plant managers and finance share one truth. Export documentation stays attached to the same order that hit the ledger.',
  multan:
    'Multan agri-businesses move seasonal crops through cold storage and southern Punjab hubs. Serving businesses in Multan, we forecast demand peaks, track cold-chain inventory and consolidate PKR reporting across depots. Credit terms and inter-city transfers stay visible instead of buried in WhatsApp threads.',
  peshawar:
    'Peshawar distributors need batch tracking and credit ageing that keep up with regional wholesale. Serving businesses in Peshawar, DigitalManager gives pharmacies and traders PKR ledgers plus compliance-friendly audit trails. Multi-warehouse stock no longer waits on a weekend close.',
  quetta:
    'Quetta trading houses and transport operators bill by project and delivery run. Serving businesses in Quetta, DigitalManager links fleet costing, project billing and affordable cloud ERP so Balochistan teams get branch reporting without a heavyweight rollout. PKR dashboards replace month-end reconstruction.',
  hyderabad:
    'Hyderabad wholesale and Sindh retail chains juggle distributor credit and mixed inventory. Serving businesses in Hyderabad, DigitalManager syncs POS to a central PKR ledger so counters and warehouses stay honest. Light manufacturers keep job costs next to the invoices they already issue.',
  sialkot:
    'Sialkot exporters cannot afford job costs that drift from shipment documents. Serving businesses in Sialkot, DigitalManager keeps sports goods and surgical lines on one PKR consolidation with export-ready reporting. Finance and production stop reconciling after the container has left.',
  gujranwala:
    'Gujranwala ceramics and electrical markets move dealer stock faster than paper can follow. Serving businesses in Gujranwala, DigitalManager ties production planning to dealer billing and PKR inventory. Plant and bazaar teams finally share the same numbers.',
}

const PAGE_FOCUS = {
  [CITY_HOME_SLUG]: {
    suffix: 'Cloud ERP',
    angle: (city) =>
      `DigitalManager cloud ERP for ${city.name.en} — PKR finance, inventory, POS and payroll configured for ${city.focus.en}. ${servingBusinessesIn(city.name.en)}.`,
    meta: (city) =>
      `ERP software in ${city.name.en} — finance, inventory, POS and payroll on PKR books. DigitalManager for ${city.focus.en}.`,
  },
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
export function buildCityPagePayload(citySlug, pageSlug = CITY_PAGE_SLUG, siteSettings = {}) {
  const city = getCity(citySlug)
  if (!city) throw new Error(`Unknown city: ${citySlug}`)
  const allowed = [CITY_HOME_SLUG, ...CITY_PRODUCT_PAGE_SLUGS]
  if (!allowed.includes(pageSlug)) {
    throw new Error(`Unknown city page slug: ${pageSlug}`)
  }
  const profile = getCountryProfileForCity(citySlug)
  const contact = resolvePakistanContact(siteSettings)
  const base = CITY_HERO_ANGLES[city.slug] || CITY_HERO_ANGLES.karachi
  const pageDef = PAGE_FOCUS[pageSlug] || PAGE_FOCUS[CITY_HOME_SLUG]
  const isHome = pageSlug === CITY_HOME_SLUG
  const productLabel = isHome ? 'Cloud ERP' : CITY_PRODUCT_LABELS[pageSlug]?.en || pageDef.suffix
  const h1 = isHome ? base.h1 : `${productLabel} for ${city.name.en}`
  const intro = isHome ? base.intro : pageDef.angle(city)
  const extra = CITY_HOME_EXTRAS[city.slug] || CITY_HOME_EXTRAS.karachi
  const serving = servingBusinessesIn(city.name.en)

  const internalLinks = [
    { label: bi('Contact us'), href: '/contact' },
    { label: bi('ERP modules'), href: '/erp' },
    { label: bi('Industries'), href: '/industries' },
    ...CITY_PRODUCT_PAGE_SLUGS.map((s) => ({
      label: bi(CITY_PRODUCT_LABELS[s]?.en || s),
      href: `/${city.slug}/software/${s}`,
    })),
  ]

  return {
    ...seedMeta(),
    template: 'cms-page',
    citySlug: city.slug,
    cityName: city.name,
    pageSlug,
    title: bi(isHome ? `${city.name.en} Cloud ERP | DigitalManager Pakistan` : `${productLabel} · ${city.name.en}`),
    heading: bi(h1, h1),
    shortDescription: bi(intro, intro),
    serviceArea: bi(serving, serving),
    contact: {
      phoneDisplay: contact.phoneDisplay,
      phoneHref: contact.phoneHref,
      email: contact.primaryEmail,
      label: bi('Pakistan sales'),
      address: bi(serving, serving),
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
          primaryCta: { label: bi(`Book a ${city.name.en} demo`), href: '/contact' },
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
            `<p>${intro}</p><p>${extra}</p><p>Teams in ${city.name.en} choose DigitalManager when spreadsheets slow month-end close or branch stock stops matching the ledger. We configure PKR charts, tax mappings and role-based access before your users log in. ${serving} — we do not list a local office unless the company operates one there.</p>`,
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
  const pageDef = PAGE_FOCUS[pageSlug] || PAGE_FOCUS[CITY_HOME_SLUG]
  const isHome = pageSlug === CITY_HOME_SLUG
  const product = isHome ? 'Cloud ERP' : CITY_PRODUCT_LABELS[pageSlug]?.en || 'ERP'
  const metaDesc = pageDef.meta(city)
  const title = isHome
    ? `${city.name.en} Cloud ERP | DigitalManager Pakistan`
    : `${product} in ${city.name.en} | DigitalManager Pakistan`
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
