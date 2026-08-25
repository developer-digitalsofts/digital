/**
 * Builds genuinely localized city page payloads — unique copy per city, not name substitution.
 */
import {
  CITY_PAGE_SLUG,
  getCity,
  getCountryProfileForCity,
} from './cityRegistry.mjs'
import { REGIONAL_SUPPORT } from './gccLocalizedContent/profiles.mjs'

export const CITY_SEED_VERSION = 'city-localized-content-v1'

function bi(en, ar) {
  return { en, ar }
}

function seedMeta() {
  return { _seedVersion: CITY_SEED_VERSION, _seedAt: new Date().toISOString() }
}

/** Unique H1 / hero angles per city — written for local business context. */
const CITY_HERO_ANGLES = {
  dubai: {
    h1: 'Cloud ERP for Dubai trading, retail and multi-branch finance teams',
    intro:
      'Dubai businesses juggle free-zone entities, mainland outlets and warehouse hubs — often on disconnected spreadsheets. DigitalManager connects GL, inventory, POS and VAT reporting so your finance team sees every branch in real time, whether you operate from JAFZA, Dubai Internet City or Deira.',
    metaDesc:
      'ERP software for Dubai businesses — VAT-ready finance, multi-branch inventory, POS and CRM on one cloud platform. Book a demo for trading, retail and free-zone operators.',
  },
  'abu-dhabi': {
    h1: 'ERP built for Abu Dhabi contracting, procurement and enterprise finance',
    intro:
      'Abu Dhabi projects demand milestone billing, retention tracking and audit-ready procurement trails. DigitalManager gives contracting and facilities teams one ledger for purchase orders, job costs and client invoicing — aligned with UAE VAT and group reporting standards.',
    metaDesc:
      'Abu Dhabi ERP software for contracting, procurement and enterprise finance. Project costing, retention billing and VAT-compliant reporting from DigitalManager.',
  },
  sharjah: {
    h1: 'Manufacturing and warehouse ERP for Sharjah industrial operators',
    intro:
      'Sharjah industrial zones run on tight margins — BOM accuracy and warehouse throughput matter. DigitalManager links production planning, bin-level stock and export invoicing so plant managers and finance share one source of truth across Sharjah Industrial Areas and Hamriyah.',
    metaDesc:
      'Sharjah ERP for manufacturing, warehousing and export SMEs. BOM planning, landed costs and inventory control on DigitalManager cloud ERP.',
  },
  ajman: {
    h1: 'Affordable cloud ERP for Ajman SMEs and trading offices',
    intro:
      'Ajman companies need enterprise capability without enterprise overhead. DigitalManager rolls out in days with invoicing, stock, payroll and simple dashboards — ideal for trading offices, light workshops and growing F&B outlets across Ajman Free Zone and the corniche strip.',
    metaDesc:
      'Cloud ERP for Ajman SMEs — invoicing, inventory, payroll and branch dashboards without heavy IT. DigitalManager helps trading and service businesses grow.',
  },
  riyadh: {
    h1: 'Saudi ERP for Riyadh HQ teams scaling retail and enterprise operations',
    intro:
      'Riyadh headquarters coordinate dozens of branches across the Kingdom — often with legacy POS and siloed finance tools. DigitalManager unifies SAR ledgers, ZATCA e-invoicing readiness and branch KPIs so expansion along King Fahd Road and beyond stays controlled.',
    metaDesc:
      'Riyadh ERP software with ZATCA e-invoicing, multi-branch SAR finance and retail POS integration. DigitalManager supports Vision 2030 growth companies.',
  },
  jeddah: {
    h1: 'Distribution and hospitality ERP for Jeddah port-side businesses',
    intro:
      'Jeddah wholesalers and hotel groups move stock between corniche showrooms, port warehouses and Makkah-facing depots. DigitalManager tracks inter-city transfers, delivery routes and F&B revenue so operations teams reduce spoilage and finance closes faster each month.',
    metaDesc:
      'Jeddah ERP for logistics, wholesale and hospitality. Route planning, inter-city stock and SAR billing on DigitalManager cloud ERP.',
  },
  dammam: {
    h1: 'Project and spare-parts ERP for Dammam industrial services',
    intro:
      'Eastern Province service companies bill by job, contract and spare-parts consumption — not by generic product lines. DigitalManager ties workshop timesheets, parts catalogues and milestone invoices together for Dammam, Khobar and Jubail operators serving energy and industrial clients.',
    metaDesc:
      'Dammam ERP for oil & gas services, workshops and industrial supply. Job costing, spare parts and contract billing with DigitalManager.',
  },
  doha: {
    h1: 'Services-led ERP for Doha growing brands and project teams',
    intro:
      'Doha services firms win work on reputation and delivery speed — but lose margin when project costs sit in email threads. DigitalManager gives professional, events and retail teams QAR billing, approval workflows and milestone tracking aligned with how Doha businesses actually operate.',
    metaDesc:
      'Doha ERP software for services, events and retail brands. QAR billing, project milestones and multi-site inventory on DigitalManager.',
  },
  muscat: {
    h1: 'Tourism and trading ERP for Muscat multi-branch operators',
    intro:
      'Muscat family businesses often span hotels, clinics and trading counters — each with different peak seasons. DigitalManager forecasts Khareef and holiday demand, links OMR accounting across branches and gives owners one dashboard from Qurum to Ruwi.',
    metaDesc:
      'Muscat ERP for tourism, trading and healthcare groups. OMR finance, seasonal forecasting and branch dashboards from DigitalManager.',
  },
  'kuwait-city': {
    h1: 'Trading-house ERP for Kuwait City multi-brand operators',
    intro:
      'Kuwait City trading houses manage credit lines, showroom stock and inter-company transfers daily. DigitalManager consolidates KWD reporting, ageing and POS sales so partners see margin by brand — not just month-end totals from separate systems.',
    metaDesc:
      'Kuwait City ERP for trading houses and retail groups. KWD consolidation, credit control and showroom POS on DigitalManager cloud ERP.',
  },
  manama: {
    h1: 'Compact ERP for Manama professional firms and branch networks',
    intro:
      'Manama firms need audit trails and VAT-ready invoicing without a large IT footprint. DigitalManager supports time billing, compact branch rollouts and BHD reporting for legal, healthcare and retail operators across Manama and Seef.',
    metaDesc:
      'Manama ERP for professional services and multi-branch retail. BHD VAT invoicing, time billing and audit trails with DigitalManager.',
  },
}

function buildFaqs(city, profile) {
  const cityName = city.name.en
  const currency = profile.currency
  return [
    {
      id: `faq-${city.slug}-1`,
      question: bi(`Is DigitalManager suitable for ${cityName} businesses?`, `هل DigitalManager مناسب لشركات ${city.name.ar}؟`),
      answer: bi(
        `Yes. We configure ${currency} ledgers, VAT workflows and modules for ${city.focus.en}. Implementation is led from our UAE headquarters with regional GCC support.`,
        `نعم. نُهيّئ دفاتر ${currency} وسير عمل VAT ووحدات لـ${city.focus.ar}. يُدار التنفيذ من مقرنا في الإمارات مع دعم إقليمي.`,
      ),
    },
    {
      id: `faq-${city.slug}-2`,
      question: bi(`How long does rollout take in ${cityName}?`, `كم يستغرق التنفيذ في ${city.name.ar}؟`),
      answer: bi(
        `Most ${cityName} SMEs go live in two to six weeks depending on branches and data migration. We phase finance and inventory first, then POS or payroll if needed.`,
        `معظم الشركات الصغيرة والمتوسطة في ${city.name.ar} تبدأ خلال 2–6 أسابيع حسب الفروع وترحيل البيانات.`,
      ),
    },
    {
      id: `faq-${city.slug}-3`,
      question: bi(`Do you support ${profile.fullName.en} VAT and local invoicing?`, `هل تدعمون VAT والفوترة المحلية في ${profile.fullName.ar}؟`),
      answer: bi(
        `DigitalManager supports ${currency} invoicing, tax-ready documents and audit exports configured for ${profile.fullName.en} regulations. Your finance team reviews mappings before go-live.`,
        `يدعم DigitalManager فوترة ${currency} ومستندات جاهزة للضريبة وتصديرات تدقيق مهيّأة لـ${profile.fullName.ar}.`,
      ),
    },
  ]
}

function buildTestimonials(city, profile) {
  const industry = city.industries[0]
  return [
    {
      id: `t-${city.slug}-1`,
      name: bi(`${city.name.en} Operations Lead`, `مسؤول عمليات ${city.name.ar}`),
      role: bi(`${industry} · ${city.name.en}`, `${industry} · ${city.name.ar}`),
      quote: bi(
        `We replaced three disconnected tools with DigitalManager. Our ${city.name.en} team now closes books faster and sees stock across branches without manual spreadsheets.`,
        `استبدلنا ثلاث أدوات منفصلة بـ DigitalManager. فريق ${city.name.ar} يُغلق الحسابات أسرع ويرى المخزون عبر الفروع.`,
      ),
      rating: 5,
    },
  ]
}

/**
 * @param {string} citySlug
 * @param {{ countrySlug: string }} opts
 */
export function buildCityPagePayload(citySlug, opts = {}) {
  const city = getCity(citySlug)
  if (!city) throw new Error(`Unknown city: ${citySlug}`)
  const profile = getCountryProfileForCity(citySlug)
  const angle = CITY_HERO_ANGLES[city.slug] || CITY_HERO_ANGLES.dubai
  const countrySlug = opts.countrySlug || profile.slug

  const internalLinks = [
    { label: bi('Contact us', 'تواصل'), href: `/${countrySlug}/en/contact` },
    { label: bi('ERP modules', 'وحدات ERP'), href: countrySlug === 'ae' ? '/erp' : `/${countrySlug}/en/erp` },
    { label: bi('Industries', 'القطاعات'), href: countrySlug === 'ae' ? '/industries' : `/${countrySlug}/en/industries` },
  ]

  return {
    ...seedMeta(),
    template: 'cms-page',
    citySlug: city.slug,
    cityName: city.name,
    pageSlug: CITY_PAGE_SLUG,
    title: bi(angle.h1, `ERP سحابي لـ${city.name.ar}`),
    heading: bi(angle.h1, `ERP سحابي لـ${city.name.ar}`),
    shortDescription: bi(angle.intro.slice(0, 220), `حل ERP سحابي للشركات في ${city.name.ar}.`),
    contact: {
      phoneDisplay: REGIONAL_SUPPORT.phoneDisplay,
      phoneHref: REGIONAL_SUPPORT.phoneHref,
      email: REGIONAL_SUPPORT.email,
      label: REGIONAL_SUPPORT.label,
      address: bi(
        `Regional GCC support from DigitalManager UAE — serving ${city.name.en}, ${profile.fullName.en}.`,
        `دعم إقليمي من DigitalManager الإمارات — نخدم ${city.name.ar} و${profile.fullName.ar}.`,
      ),
    },
    internalLinks,
    sections: [
      {
        id: `${city.slug}-hero`,
        type: 'hero',
        visible: true,
        order: 0,
        content: {
          eyebrow: bi(`ERP Software · ${city.name.en}`, `برمجيات ERP · ${city.name.ar}`),
          title: bi(angle.h1, `ERP سحابي لـ${city.name.ar}`),
          description: bi(angle.intro, `منصة ERP للشركات في ${city.name.ar}.`),
          primaryCta: { label: bi('Book a Demo', 'احجز عرضاً'), href: '/contact' },
          secondaryCta: {
            label: bi('Explore Modules', 'استكشف الوحدات'),
            href: countrySlug === 'ae' ? '/erp' : `/${countrySlug}/en/erp`,
          },
        },
      },
      {
        id: `${city.slug}-services`,
        type: 'featureGrid',
        visible: true,
        order: 1,
        content: {
          eyebrow: bi('Core capabilities', 'القدرات الأساسية'),
          title: bi(`ERP services configured for ${city.name.en}`, `خدمات ERP مهيّأة لـ${city.name.ar}`),
          items: city.services.map((s, i) => ({
            id: `svc-${city.slug}-${i}`,
            title: bi(s, s),
            description: bi(
              `${s} for ${city.focus.en} — on ${profile.currency} books with DigitalManager.`,
              `${s} لـ${city.focus.ar} — على دفاتر ${profile.currency}.`,
            ),
          })),
        },
      },
      {
        id: `${city.slug}-industries`,
        type: 'featureGrid',
        visible: true,
        order: 2,
        content: {
          eyebrow: bi('Industries we serve', 'القطاعات'),
          title: bi(`Industry programmes popular in ${city.name.en}`, `برامج قطاعية في ${city.name.ar}`),
          items: city.industries.map((ind, i) => ({
            id: `ind-${city.slug}-${i}`,
            title: bi(ind, ind),
            description: bi(
              `${ind} operators in ${city.name.en} use DigitalManager for finance, stock and branch reporting.`,
              `مشغلو ${ind} في ${city.name.ar} يستخدمون DigitalManager.`,
            ),
          })),
        },
      },
      {
        id: `${city.slug}-body`,
        type: 'richText',
        visible: true,
        order: 3,
        content: {
          html: bi(
            `<p>${angle.intro}</p><p>Teams across ${profile.fullName.en} choose DigitalManager when spreadsheets slow month-end close or branch stock stops matching the ledger. We configure ${profile.currency} charts, tax mappings and role-based access before your ${city.name.en} users log in.</p>`,
            `<p>حل ERP للشركات في ${city.name.ar}.</p>`,
          ),
        },
      },
      {
        id: `${city.slug}-testimonials`,
        type: 'testimonials',
        visible: true,
        order: 4,
        content: { items: buildTestimonials(city, profile) },
      },
      {
        id: `${city.slug}-faqs`,
        type: 'faq',
        visible: true,
        order: 5,
        content: { items: buildFaqs(city, profile) },
      },
    ],
  }
}

export function buildCityPageSeo(citySlug) {
  const city = getCity(citySlug)
  const profile = getCountryProfileForCity(citySlug)
  const angle = CITY_HERO_ANGLES[city.slug]
  const title = `${angle.h1} | DigitalManager`
  return {
    title: bi(title, `ERP ${city.name.ar} | DigitalManager`),
    description: bi(angle.metaDesc, `ERP سحابي في ${city.name.ar} — ${profile.fullName.ar}.`),
    keywords: bi(
      `ERP ${city.name.en}, cloud ERP ${profile.fullName.en}, ${profile.currency} accounting, DigitalManager`,
      `ERP ${city.name.ar}, ERP سحابي ${profile.fullName.ar}`,
    ),
    noIndex: false,
    robotsIndex: 'index',
    robotsFollow: 'follow',
  }
}

export function buildCityLocaleRecord(citySlug, lang = 'en', partial = {}) {
  const city = getCity(citySlug)
  const profile = getCountryProfileForCity(citySlug)
  const payload = buildCityPagePayload(citySlug, { countrySlug: profile.slug })
  const seo = buildCityPageSeo(citySlug)
  const isEn = lang === 'en'

  return {
    contentType: 'cityPage',
    globalIdentity: `city:${city.slug}:${CITY_PAGE_SLUG}`,
    slug: CITY_PAGE_SLUG,
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
