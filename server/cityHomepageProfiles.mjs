/**
 * City homepage overlays for Pakistan. Unspecified CMS fields inherit the
 * national homepage. Dashboard labels are illustrative UI samples, not customers.
 */
import { PK_CITY_NAMES, servingBusinessesIn } from './pakistanConfig.mjs'

function sampleCompanies(cityName) {
  return [
    `${cityName} Trading Desk`,
    `${cityName} Retail Group`,
    `${cityName} Supplies`,
    `${cityName} Holdings`,
  ]
}

function faq(cityName) {
  const area = servingBusinessesIn(cityName)
  return [
    {
      q: `Do you have an office in ${cityName}?`,
      a: `${area}. Contact and demo requests are handled nationally — we do not list a local office unless DigitalManager operates one there.`,
    },
    {
      q: `Can DigitalManager support a ${cityName} rollout?`,
      a: `Yes. Implementation is configured around your PKR books, branches and industry workflows. ${area}. Book a demo to review finance, inventory, POS and payroll on your processes.`,
    },
  ]
}

function cityMetaTitle(cityName) {
  return `DigitalManager in ${cityName} | ERP & Business Management Software`
}

export const CITY_HOMEPAGE_PROFILES = {
  karachi: {
    eyebrow: 'Pakistan Ready — Karachi',
    h1: 'DigitalManager in Karachi — Cloud ERP for trading, wholesale and multi-branch retail',
    titleBefore: 'DigitalManager in Karachi',
    titleAccent: 'Cloud ERP for trading, wholesale and multi-branch retail',
    titleLine2: '',
    intro:
      'Karachi operators run port-linked trading houses, wholesale depots and retail chains — often on disconnected spreadsheets. DigitalManager connects GL, inventory, POS and payroll so finance sees every branch in PKR.',
    metaTitle: cityMetaTitle('Karachi'),
    metaDesc:
      'DigitalManager is cloud ERP software for Karachi businesses — PKR finance, multi-branch inventory, POS and payroll for trade, manufacturing and retail.',
    industriesFocus: 'distribution, port-linked trade, manufacturing and multi-branch retail',
    branches: ['Karachi', 'Korangi', 'Port Qasim', 'SITE'],
  },
  lahore: {
    eyebrow: 'Pakistan Ready — Lahore',
    h1: 'DigitalManager in Lahore — Cloud ERP for retail, manufacturing and distribution',
    titleBefore: 'DigitalManager in Lahore',
    titleAccent: 'Cloud ERP for retail, manufacturing and distribution',
    titleLine2: '',
    intro:
      'Lahore manufacturers and distributors scale across Punjab with seasonal demand and complex credit terms. DigitalManager links production planning, route delivery and branch KPIs on PKR books.',
    metaTitle: cityMetaTitle('Lahore'),
    metaDesc:
      'DigitalManager is ERP and business management software for Lahore — production planning, branch POS and PKR reporting for retail, manufacturing and distribution.',
    industriesFocus: 'retail, manufacturing, services and distribution',
    branches: ['Lahore', 'Sheikhupura', 'Kasur', 'Raiwind'],
  },
  islamabad: {
    eyebrow: 'Pakistan Ready — Islamabad',
    h1: 'DigitalManager in Islamabad — Cloud ERP for services, contracting and multi-branch operations',
    titleBefore: 'DigitalManager in Islamabad',
    titleAccent: 'Cloud ERP for services, contracting and distribution',
    titleLine2: '',
    intro:
      'Islamabad firms bill by milestone, retainer and approved timesheets. DigitalManager gives consulting, IT and healthcare teams PKR ledgers, approval workflows and audit-ready exports.',
    metaTitle: cityMetaTitle('Islamabad'),
    metaDesc:
      'DigitalManager is cloud ERP software for Islamabad professional services and contracting teams — milestone billing, approvals and PKR finance.',
    industriesFocus: 'services, contracting, distribution and multi-branch operations',
    branches: ['Islamabad', 'Blue Area', 'I-8', 'F-10'],
  },
  rawalpindi: {
    eyebrow: 'Pakistan Ready — Rawalpindi',
    h1: 'DigitalManager in Rawalpindi — Cloud ERP for workshops, retail and twin-city operations',
    titleBefore: 'DigitalManager in Rawalpindi',
    titleAccent: 'Cloud ERP for workshops, retail and distribution',
    titleLine2: '',
    intro:
      'Rawalpindi workshops, spare-parts counters and wholesale outlets need job costing without enterprise overhead. DigitalManager rolls out invoicing, stock and dashboards for twin-city operators.',
    metaTitle: cityMetaTitle('Rawalpindi'),
    metaDesc:
      'DigitalManager is ERP software for Rawalpindi workshops, retail and wholesale — job costing, inventory and PKR invoicing for twin-city operators.',
    industriesFocus: 'services, contracting, distribution and multi-branch operations',
    branches: ['Rawalpindi', 'Saddar', 'Committee Chowk', 'Islamabad'],
  },
  faisalabad: {
    eyebrow: 'Pakistan Ready — Faisalabad',
    h1: 'DigitalManager in Faisalabad — Cloud ERP for textile, manufacturing and wholesale',
    titleBefore: 'DigitalManager in Faisalabad',
    titleAccent: 'Cloud ERP for textile, manufacturing and wholesale',
    titleLine2: '',
    intro:
      'Faisalabad textile mills and agri-traders track BOMs, landed costs and export documentation daily. DigitalManager connects production planning, vendor payments and PKR consolidation.',
    metaTitle: cityMetaTitle('Faisalabad'),
    metaDesc:
      'DigitalManager is ERP and business management software for Faisalabad textile mills and wholesale — BOM planning, landed costs and PKR reporting.',
    industriesFocus: 'textile, manufacturing and wholesale',
    branches: ['Faisalabad', 'Jhang', 'Toba Tek Singh', 'Gojra'],
  },
  multan: {
    eyebrow: 'Pakistan Ready — Multan',
    h1: 'DigitalManager in Multan — Cloud ERP for agriculture, wholesale and distribution',
    titleBefore: 'DigitalManager in Multan',
    titleAccent: 'Cloud ERP for agriculture, wholesale and distribution',
    titleLine2: '',
    intro:
      'Multan operators manage seasonal crops, cold storage and inter-city transfers with tight margins. DigitalManager forecasts demand peaks and consolidates PKR reporting across depots.',
    metaTitle: cityMetaTitle('Multan'),
    metaDesc:
      'DigitalManager is cloud ERP software for Multan agriculture, cold storage and wholesale — seasonal forecasting, inventory and PKR finance.',
    industriesFocus: 'agriculture, wholesale, distribution and multi-depot operations',
    branches: ['Multan', 'Khanewal', 'Sahiwal', 'Muzaffargarh'],
  },
  peshawar: {
    eyebrow: 'Pakistan Ready — Peshawar',
    h1: 'DigitalManager in Peshawar — Cloud ERP for wholesale, healthcare and distribution',
    titleBefore: 'DigitalManager in Peshawar',
    titleAccent: 'Cloud ERP for wholesale, healthcare and distribution',
    titleLine2: '',
    intro:
      'Peshawar wholesalers and pharmacies need batch tracking, credit ageing and multi-warehouse stock. DigitalManager gives distributors PKR ledgers and compliance-friendly audit trails.',
    metaTitle: cityMetaTitle('Peshawar'),
    metaDesc:
      'DigitalManager is ERP software for Peshawar pharmaceuticals, trading and healthcare — batch tracking, credit control and PKR billing.',
    industriesFocus: 'wholesale, pharmaceuticals, healthcare and regional distribution',
    branches: ['Peshawar', 'Hayatabad', 'Charsadda', 'Nowshera'],
  },
  quetta: {
    eyebrow: 'Pakistan Ready — Quetta',
    h1: 'DigitalManager in Quetta — Cloud ERP for trading, transport and supply',
    titleBefore: 'DigitalManager in Quetta',
    titleAccent: 'Cloud ERP for trading, transport and supply',
    titleLine2: '',
    intro:
      'Quetta trading houses and transport operators bill by project, delivery run and branch. DigitalManager links fleet costing, project billing and PKR dashboards for Balochistan growth companies.',
    metaTitle: cityMetaTitle('Quetta'),
    metaDesc:
      'DigitalManager is cloud ERP software for Quetta trading houses, transport and construction supply — fleet costing, project billing and PKR dashboards.',
    industriesFocus: 'trading, logistics, construction supply and provincial distribution',
    branches: ['Quetta', 'Hub', 'Sibi', 'Khuzdar'],
  },
  hyderabad: {
    eyebrow: 'Pakistan Ready — Hyderabad',
    h1: 'DigitalManager in Hyderabad — Cloud ERP for wholesale, manufacturing and Sindh retail',
    titleBefore: 'DigitalManager in Hyderabad',
    titleAccent: 'Cloud ERP for wholesale, manufacturing and Sindh retail',
    titleLine2: '',
    intro:
      'Hyderabad operators run Sindh wholesale markets, light manufacturing and growing retail chains on mixed tools. DigitalManager connects PKR finance, distributor credit and multi-branch stock.',
    metaTitle: cityMetaTitle('Hyderabad'),
    metaDesc:
      'DigitalManager is ERP software for Hyderabad wholesale, distribution and Sindh retail — PKR invoicing, credit control and multi-branch inventory.',
    industriesFocus: 'wholesale, distribution, light manufacturing and Sindh retail',
    branches: ['Hyderabad', 'Kotri', 'Latifabad', 'Qasimabad'],
  },
  sialkot: {
    eyebrow: 'Pakistan Ready — Sialkot',
    h1: 'DigitalManager in Sialkot — Cloud ERP for export manufacturing and sports goods',
    titleBefore: 'DigitalManager in Sialkot',
    titleAccent: 'Cloud ERP for export manufacturing and sports goods',
    titleLine2: '',
    intro:
      'Sialkot exporters juggle job costing, shipment documents and PKR cashflow across sports goods and surgical lines. DigitalManager gives factory and finance teams one ledger for orders and export-ready reporting.',
    metaTitle: cityMetaTitle('Sialkot'),
    metaDesc:
      'DigitalManager is ERP and business management software for Sialkot export manufacturers — job costing, export documents and PKR reporting.',
    industriesFocus: 'export manufacturing and sports/surgical goods',
    branches: ['Sialkot', 'Daska', 'Sambrial', 'Pasrur'],
  },
  gujranwala: {
    eyebrow: 'Pakistan Ready — Gujranwala',
    h1: 'DigitalManager in Gujranwala — Cloud ERP for ceramics, electrical and wholesale',
    titleBefore: 'DigitalManager in Gujranwala',
    titleAccent: 'Cloud ERP for ceramics, electrical and wholesale',
    titleLine2: '',
    intro:
      'Gujranwala manufacturers and wholesalers move ceramics, electrical goods and Punjab dealer stock at speed. DigitalManager ties production planning, dealer billing and PKR inventory.',
    metaTitle: cityMetaTitle('Gujranwala'),
    metaDesc:
      'DigitalManager is cloud ERP software for Gujranwala ceramics, electrical goods and wholesale — production planning, dealer billing and PKR finance.',
    industriesFocus: 'ceramics, electrical goods, manufacturing and wholesale',
    branches: ['Gujranwala', 'Wazirabad', 'Kamoke', 'Gujrat'],
  },
}

export function getCityHomepageProfile(citySlug) {
  const slug = String(citySlug || '').toLowerCase()
  const profile = CITY_HOMEPAGE_PROFILES[slug]
  if (!profile) return null
  const cityName = PK_CITY_NAMES[slug] || profile.titleAccent
  return {
    slug,
    cityName,
    serviceArea: servingBusinessesIn(cityName),
    ...profile,
    companies: sampleCompanies(cityName),
    faqs: faq(cityName),
  }
}

export function cityDocumentTitle(cityName) {
  return cityMetaTitle(cityName)
}
