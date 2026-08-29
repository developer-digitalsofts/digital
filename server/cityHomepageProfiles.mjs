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

export const CITY_HOMEPAGE_PROFILES = {
  karachi: {
    eyebrow: 'Pakistan Ready — Karachi',
    h1: 'Cloud ERP for Karachi trading, wholesale and multi-branch retail',
    titleBefore: 'Cloud ERP for',
    titleAccent: 'Karachi',
    titleLine2: 'trading, wholesale and multi-branch retail',
    intro:
      'Karachi operators run port-linked trading houses, wholesale depots and retail chains — often on disconnected spreadsheets. DigitalManager connects GL, inventory, POS and payroll so finance sees every branch in PKR.',
    metaTitle: 'ERP Software in Karachi | DigitalManager Cloud ERP',
    metaDesc:
      'ERP software for Karachi businesses — PKR finance, multi-branch inventory, POS and payroll. Serving businesses in Karachi across trade, manufacturing and retail.',
    industriesFocus: 'distribution, port-linked trade, manufacturing and multi-branch retail',
    branches: ['Karachi', 'Korangi', 'Port Qasim', 'SITE'],
  },
  lahore: {
    eyebrow: 'Pakistan Ready — Lahore',
    h1: 'ERP for Lahore retail, manufacturing, services and distribution',
    titleBefore: 'Cloud ERP for',
    titleAccent: 'Lahore',
    titleLine2: 'retail, manufacturing and distribution',
    intro:
      'Lahore manufacturers and distributors scale across Punjab with seasonal demand and complex credit terms. DigitalManager links production planning, route delivery and branch KPIs on PKR books.',
    metaTitle: 'ERP Software in Lahore | DigitalManager Cloud ERP',
    metaDesc:
      'Lahore ERP software for retail, manufacturing, services and distribution. Production planning, branch POS and PKR reporting. Serving businesses in Lahore.',
    industriesFocus: 'retail, manufacturing, services and distribution',
    branches: ['Lahore', 'Sheikhupura', 'Kasur', 'Raiwind'],
  },
  islamabad: {
    eyebrow: 'Pakistan Ready — Islamabad',
    h1: 'ERP for Islamabad services, contracting and multi-branch operations',
    titleBefore: 'Cloud ERP for',
    titleAccent: 'Islamabad',
    titleLine2: 'services, contracting and distribution',
    intro:
      'Islamabad firms bill by milestone, retainer and approved timesheets. DigitalManager gives consulting, IT and healthcare teams PKR ledgers, approval workflows and audit-ready exports.',
    metaTitle: 'ERP Software in Islamabad | DigitalManager Cloud ERP',
    metaDesc:
      'Islamabad ERP for professional services, contracting and multi-branch operations. Milestone billing, approvals and PKR finance. Serving businesses in Islamabad.',
    industriesFocus: 'services, contracting, distribution and multi-branch operations',
    branches: ['Islamabad', 'Blue Area', 'I-8', 'F-10'],
  },
  rawalpindi: {
    eyebrow: 'Pakistan Ready — Rawalpindi',
    h1: 'ERP for Rawalpindi services, contracting and twin-city operations',
    titleBefore: 'Cloud ERP for',
    titleAccent: 'Rawalpindi',
    titleLine2: 'workshops, retail and distribution',
    intro:
      'Rawalpindi workshops, spare-parts counters and wholesale outlets need job costing without enterprise overhead. DigitalManager rolls out invoicing, stock and dashboards for twin-city operators.',
    metaTitle: 'ERP Software in Rawalpindi | DigitalManager Cloud ERP',
    metaDesc:
      'Rawalpindi ERP for workshops, retail, contracting and wholesale. Job costing, inventory and PKR invoicing. Serving businesses in Rawalpindi.',
    industriesFocus: 'services, contracting, distribution and multi-branch operations',
    branches: ['Rawalpindi', 'Saddar', 'Committee Chowk', 'Islamabad'],
  },
  faisalabad: {
    eyebrow: 'Pakistan Ready — Faisalabad',
    h1: 'Textile and industrial ERP for Faisalabad mills and wholesale',
    titleBefore: 'Cloud ERP for',
    titleAccent: 'Faisalabad',
    titleLine2: 'textile, manufacturing and wholesale',
    intro:
      'Faisalabad textile mills and agri-traders track BOMs, landed costs and export documentation daily. DigitalManager connects production planning, vendor payments and PKR consolidation.',
    metaTitle: 'ERP Software in Faisalabad | DigitalManager Cloud ERP',
    metaDesc:
      'Faisalabad ERP for textile manufacturing and wholesale. BOM planning, landed costs and PKR reporting. Serving businesses in Faisalabad.',
    industriesFocus: 'textile, manufacturing and wholesale',
    branches: ['Faisalabad', 'Jhang', 'Toba Tek Singh', 'Gojra'],
  },
  multan: {
    eyebrow: 'Pakistan Ready — Multan',
    h1: 'Agri-business ERP for Multan cold storage and southern Punjab hubs',
    titleBefore: 'Cloud ERP for',
    titleAccent: 'Multan',
    titleLine2: 'agriculture, wholesale and distribution',
    intro:
      'Multan operators manage seasonal crops, cold storage and inter-city transfers with tight margins. DigitalManager forecasts demand peaks and consolidates PKR reporting across depots.',
    metaTitle: 'ERP Software in Multan | DigitalManager Cloud ERP',
    metaDesc:
      'Multan ERP for agriculture, cold storage and wholesale. Seasonal forecasting, inventory and PKR finance. Serving businesses in Multan.',
    industriesFocus: 'agriculture, wholesale, distribution and multi-depot operations',
    branches: ['Multan', 'Khanewal', 'Sahiwal', 'Muzaffargarh'],
  },
  peshawar: {
    eyebrow: 'Pakistan Ready — Peshawar',
    h1: 'Pharma and wholesale ERP for Peshawar regional distribution',
    titleBefore: 'Cloud ERP for',
    titleAccent: 'Peshawar',
    titleLine2: 'wholesale, healthcare and distribution',
    intro:
      'Peshawar wholesalers and pharmacies need batch tracking, credit ageing and multi-warehouse stock. DigitalManager gives distributors PKR ledgers and compliance-friendly audit trails.',
    metaTitle: 'ERP Software in Peshawar | DigitalManager Cloud ERP',
    metaDesc:
      'Peshawar ERP for pharmaceuticals, trading and healthcare. Batch tracking, credit control and PKR billing. Serving businesses in Peshawar.',
    industriesFocus: 'wholesale, pharmaceuticals, healthcare and regional distribution',
    branches: ['Peshawar', 'Hayatabad', 'Charsadda', 'Nowshera'],
  },
  quetta: {
    eyebrow: 'Pakistan Ready — Quetta',
    h1: 'Trading and logistics ERP for Quetta provincial operators',
    titleBefore: 'Cloud ERP for',
    titleAccent: 'Quetta',
    titleLine2: 'trading, transport and supply',
    intro:
      'Quetta trading houses and transport operators bill by project, delivery run and branch. DigitalManager links fleet costing, project billing and PKR dashboards for Balochistan growth companies.',
    metaTitle: 'ERP Software in Quetta | DigitalManager Cloud ERP',
    metaDesc:
      'Quetta ERP for trading houses, transport and construction supply. Fleet costing, project billing and PKR dashboards. Serving businesses in Quetta.',
    industriesFocus: 'trading, logistics, construction supply and provincial distribution',
    branches: ['Quetta', 'Hub', 'Sibi', 'Khuzdar'],
  },
  hyderabad: {
    eyebrow: 'Pakistan Ready — Hyderabad',
    h1: 'Cloud ERP for Hyderabad wholesale, distribution and Sindh retail',
    titleBefore: 'Cloud ERP for',
    titleAccent: 'Hyderabad',
    titleLine2: 'wholesale, manufacturing and Sindh retail',
    intro:
      'Hyderabad operators run Sindh wholesale markets, light manufacturing and growing retail chains on mixed tools. DigitalManager connects PKR finance, distributor credit and multi-branch stock.',
    metaTitle: 'ERP Software in Hyderabad | DigitalManager Cloud ERP',
    metaDesc:
      'Hyderabad ERP software for wholesale, distribution, light manufacturing and Sindh retail. PKR invoicing, credit and inventory. Serving businesses in Hyderabad.',
    industriesFocus: 'wholesale, distribution, light manufacturing and Sindh retail',
    branches: ['Hyderabad', 'Kotri', 'Latifabad', 'Qasimabad'],
  },
  sialkot: {
    eyebrow: 'Pakistan Ready — Sialkot',
    h1: 'Export manufacturing ERP for Sialkot sports and surgical goods',
    titleBefore: 'Cloud ERP for',
    titleAccent: 'Sialkot',
    titleLine2: 'export manufacturing and sports goods',
    intro:
      'Sialkot exporters juggle job costing, shipment documents and PKR cashflow across sports goods and surgical lines. DigitalManager gives factory and finance teams one ledger for orders and export-ready reporting.',
    metaTitle: 'ERP Software in Sialkot | DigitalManager Cloud ERP',
    metaDesc:
      'Sialkot ERP for export manufacturing, sports goods and surgical instruments. Job costing, export documents and PKR reporting. Serving businesses in Sialkot.',
    industriesFocus: 'export manufacturing and sports/surgical goods',
    branches: ['Sialkot', 'Daska', 'Sambrial', 'Pasrur'],
  },
  gujranwala: {
    eyebrow: 'Pakistan Ready — Gujranwala',
    h1: 'Industrial ERP for Gujranwala ceramics, electrical and wholesale',
    titleBefore: 'Cloud ERP for',
    titleAccent: 'Gujranwala',
    titleLine2: 'ceramics, electrical and wholesale',
    intro:
      'Gujranwala manufacturers and wholesalers move ceramics, electrical goods and Punjab dealer stock at speed. DigitalManager ties production planning, dealer billing and PKR inventory.',
    metaTitle: 'ERP Software in Gujranwala | DigitalManager Cloud ERP',
    metaDesc:
      'Gujranwala ERP for ceramics, electrical goods and wholesale. Production planning, dealer billing and PKR finance. Serving businesses in Gujranwala.',
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
