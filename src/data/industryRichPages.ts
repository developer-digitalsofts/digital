import type { Lang } from '../i18n/messages'
import type { ModuleRichPage } from './moduleRichPages'
import { mergeIndustryPageAr } from './industryRichPagesAr'

/** Long-form marketing copy for `/software/industry/:slug` — same shape as module pages. */

function shortLabel(fullLabel: string): string {
  return fullLabel
    .replace(/\s+Software$/i, '')
    .replace(/\s+Business$/i, '')
    .replace(/\s+Management$/i, '')
    .trim()
}

/**
 * Default industry deep-dive: sector-specific phrasing using the product title
 * (covers every mega-menu industry URL with substantive copy).
 */
export function buildIndustryRichPage(productLabel: string): ModuleRichPage {
  const s = shortLabel(productLabel)
  const lower = productLabel.toLowerCase()

  return {
    headline: `${s}: one ledger from counter to consolidation`,
    subhead: `Industry workflows, stock discipline, and finance controls packaged for ${lower}.`,
    intro: `DigitalManager brings accounts, inventory, sales, purchases, payroll, and reporting into one timeline — the same integrated promise presented on digitalmanager.ae for ${lower} teams. This programme reflects how operators in your space structure branches, approvals, and tax treatment while keeping auditors and banks aligned with a single chart of accounts.

You configure masters once (items, vendors, customers, tax, dimensions), then run day‑to‑day transactions with maker–checker where policy demands it. Dashboards surface margin, stock ageing, cash, and exceptions without exporting to side BI tools — and permitted users can drill to vouchers and source documents when something looks off.`,
    highlights: [
      `Defaults and templates aligned to ${s}`,
      'Multi-location stock, transfers, and valuation you can defend in audits',
      'Executive roll-ups with drill-down where roles allow',
    ],
    capabilities: [
      {
        title: 'Front office & revenue',
        body: `Capture pricing, schemes, contracts, and service delivery patterns typical of ${lower}. Postings flow to AR, stock, and revenue dimensions without duplicate entry.`,
      },
      {
        title: 'Supply chain & inventory',
        body: 'Replenishment signals, GRN/returns, landed cost for imports, min/max by site, and cycle counts — tied to the same item master finance uses for COGS.',
      },
      {
        title: 'Finance, compliance & close',
        body: 'Timely GL, PDC, statutory registers, and branch consolidation for owners who need a predictable month-end with fewer manual journals.',
      },
    ],
    workflows: [
      {
        step: 'Blueprint',
        detail: `Map chart of accounts, branches, tax profiles, and catalogue to DigitalManager with sector checkpoints for ${s}.`,
      },
      {
        step: 'Parallel run',
        detail: 'Validate opening balances, stock counts, and payroll alongside legacy tools before switching live traffic.',
      },
      {
        step: 'Operate & scale',
        detail: 'Roll out roles, alerts, and additional modules as you add sites, product lines, or regulatory requirements.',
      },
    ],
    outcomes: [
      'Fewer gaps between what operations ships and what finance books',
      'Faster answers when leadership asks for margin, stock, or cash by branch',
      'Cleaner evidence chains for inspections, banks, and internal audit',
    ],
  }
}

/** Optional per-slug overrides (merged on top of `buildIndustryRichPage` for that label). */
const industryOverrides: Record<string, Partial<ModuleRichPage>> = {
  'petrol-pump-software': {
    headline: 'Petrol Station Management Software in Pakistan',
    subhead: 'Complete Petrol Pump ERP Solution for Modern Fuel Stations.',
    intro: `Are you struggling with managing daily operations at your petrol station? DigitalManager Petrol Station Management Software is a complete cloud-based ERP solution specially designed for fuel stations across Pakistan. Monitor nozzle sales, tank stock, dip readings, lubricant inventory, customer balances, staff attendance, and financial reports from one centralized dashboard.`,
  },
  'retail-management-software': {
    headline: 'Cloud Based Point Of Sale & Retail Management Software',
    subhead: 'Smart Retail Operations with Powerful POS Management.',
    intro: `Streamline your retail operations with our advanced cloud-based POS and Retail Management Software.

Manage purchases, sales, inventory, customers, accounts, barcode billing, and reporting from one centralized platform designed for modern retail businesses.`,
  },
  'grocery-store-management-software': {
    headline: 'Cloud-Based Grocery Store Management Software for Fast Billing & Accurate Inventory',
    subhead: 'Save Items. Track Expiry. Delight Shoppers.',
    intro: `Run your grocery store with speed and accuracy using our all-in-one cloud-based management system.

Easily manage inventory, barcode billing, supplier purchases, sales, stock levels, product expiry, customer records, and accounts from one platform.`,
  },
  'garments-manufacturing-software': {
    headline: 'Cloud Based ERP Software for Garments Manufacturing Business',
    subhead: 'Streamline Procurement, Production, Sales & Finance.',
    intro: `Our Garments ERP Software helps garment factories streamline procurement, inventory tracking, production planning, HR operations, sales management, and financial accounting from one centralized cloud-based platform. Designed for textile and apparel manufacturers in Pakistan.`,
  },
  'logistics-transportation-software': {
    headline: 'Cloud ERP Software for Logistics & Transportation Business',
    subhead: 'Manage Fleet. Control Trips. Optimize Deliveries.',
    intro: `Manage your logistics and transportation operations with our powerful cloud ERP software.

Track vehicles, trips, fuel expenses, inventory, HR, accounts, sales, and warehouse activities from one centralized platform designed for transport companies and logistics businesses.`,
  },
  'poultry-control-shed-management-software': {
    headline: 'Cloud Based Poultry Control Shed Management Software',
    subhead: 'Smart Poultry Farm Monitoring and Shed Management Solution.',
    intro: `Digital Manager Poultry Control Shed Management Software helps poultry farms manage flock records, medicine usage, feed consumption, mortality tracking, inventory, accounts, and sales operations from one centralized cloud platform.`,
  },
  'dairy-farm-management-software': {
    headline: 'Cloud-Based Dairy Farm Management Software',
    subhead: 'Smart Dairy Operations with Complete Farm Control.',
    intro: `Track animal records, milk production, feed inventory, vaccination schedules, breeding cycles, expenses, and farm profitability using our advanced Dairy Farm Management Software. Designed for dairy farms, livestock businesses, and milk production units in Pakistan.`,
  },
  'lpg-business-software': {
    headline: 'Cloud ERP Software for LPG Business',
    subhead: 'Complete LPG Plant, Cylinder & Distribution Management Solution.',
    intro: `Comprehensive ERP software designed for LPG marketing companies and gas distribution businesses.
Manage procurement, cylinder inventory, plant filling, sales, finance, HR, and logistics operations from one centralized cloud-based platform.`,
  },
  'erp-software-for-real-estate-business': {
    headline: 'Software for Real Estate Business',
    subhead: 'Manage Properties. Track Installments. Control Real Estate Operations.',
    intro: `A complete ERP solution for real estate builders, property dealers, housing societies, and construction developers. Manage plots, customer bookings, installment plans, commissions, land purchases, accounts, and property sales from one centralized cloud-based platform.`,
  },
  'erp-software-for-construction-business': {
    headline: 'Cloud Based Builders and Construction Management Software',
    subhead: 'Manage Projects. Control Materials. Streamline Construction Operations.',
    intro: `An advanced ERP solution designed for builders, contractors, developers, and construction companies. Manage project costing, labor hiring, machinery, stock, material purchases, payroll, billing, and site operations through a centralized cloud-based system.`,
  },
  'motor-market-management-software': {
    headline: 'Cloud ERP Software for Motor Market Management Business',
    subhead: 'Manage Inventory. Track Sales. Control Workshop Operations.',
    intro: `Digital Manager Motor Market Management Software helps automobile businesses manage inventory, sales, customer relations, workshop activities, and accounts from one centralized cloud-based platform.`,
  },
  'auto-parts-business-software': {
    headline: 'Cloud-Based Auto Parts Business Software for Smarter Inventory & Sales',
    subhead: 'Manage Stock. Track Sales. Serve Faster.',
    intro: `A specialized software solution for auto parts dealers, spare parts retailers, and vehicle accessory shops. Efficiently manage inventory, track sales, handle suppliers, and monitor stock movement through a powerful cloud-based ERP system designed specifically for the auto parts industry in Pakistan.`,
  },
  'education-institute-management-software': {
    headline: 'Education institutes: fees, exams, HR, and campus stock on one ERP',
    subhead: 'Student information, fee billing, examination records, HR, accounts, and SMS notifications aligned to policy.',
    intro: `DigitalManager for education brings together admissions, fee plans, instalments, examination cycles, HR, procurement for campus stores, and finance-grade reporting. Administrators reduce duplicate entry between academic and finance offices while parents receive timely SMS or email alerts tied to real postings.

The programme reflects how schools, colleges, and training centres manage multi-branch fee collection, concessions, transport charges, and inventory for uniforms or books — with audit-friendly voucher trails and role-based access for sensitive student data.`,
  },
  'supply-chain-management-software': {
    headline: 'Supply chain ERP for distributors and suppliers',
    subhead: 'Consumer goods, industrial goods, medicine, water filling, petroleum goods, and cargo — with disciplined GRN, credit control, and route billing.',
    intro: `Distributors and suppliers need velocity without leakage: van sales, secondary sales, rebates, landed cost for imports, and multi-location stock that finance can defend in audits. DigitalManager connects purchase, sales, stock, AR/AP, and logistics trips so margin is visible before the week closes.

Route-wise profitability, vehicle expenses, and driver accountability can sit beside warehouse KPIs and branch P&L — with approvals when discounts or credit limits breach policy.`,
  },
  'fbr-digital-invoicing-industry-software': {
    headline: 'FBR digital invoicing & compliance for regulated retail and trade',
    subhead: 'Schema-aware payloads, submission queues, and reconciliation views that keep finance and tax teams aligned.',
  },
  'hospitality-management-software': {
    headline: 'Hospitality: front office, rooms, banquets, and F&B under one ledger',
    subhead: 'Check-in/out, room service, restaurant covers, banquet events, and all voucher types feeding accounts and inventory.',
  },
  'flour-mill-management-software': {
    headline: 'Flour mills: wheat, bardana, production, bagging, and distribution ERP',
    subhead: 'Wheat purchase, bardana handling, production runs, flour bag packaging, sales, accounts, inventory, attendance, and payroll integrated.',
  },
  'small-and-medium-business-erp-software': {
    headline: 'SMB ERP: sales, stock, credit, accounts, and payroll without complexity overload',
    subhead: 'Fast to adopt templates for growing businesses that need control today and room to scale tomorrow.',
  },
  'oil-and-gas-business-management-software': {
    headline: 'Cloud-Based Fuel Tank Lorry Management Software for Efficient Fuel Transport & Dispatch',
    subhead: 'Track Tankers. Monitor Fuel Loads. Ensure Delivery Accuracy.',
    intro: `Advanced fuel transportation software designed for oil marketing companies and fuel distributors.
Manage fuel dispatch, route planning, tanker tracking, inventory movement, and delivery operations through one centralized cloud-based system.`,
  },
  'professional-services-erp-software': {
    headline: 'Professional services ERP: engagements, billing, and delivery tied to finance',
    subhead: 'Projects, timesheets, expenses, and client invoicing with utilisation and margin clarity — aligned to the DigitalManager services positioning.',
  },
  'petrol-gas-filling-station-software': {
    headline: 'Cloud-Based Petrol Depot Management Software for Seamless Fuel Stock & Dispatch Control',
    subhead: 'Track Tankers. Monitor Stock. Automate Billing.',
    intro: `Powerful depot management software designed for oil depots and fuel storage facilities.
Manage inventory, fuel dispatch, tanker movement, purchase operations, and financial accounting from one integrated ERP platform.`,
  },
  'fleet-fuel-management-software': {
    headline: 'Cloud-Based Fleet Fuel Management Software to Maximize Efficiency & Minimize Costs',
    subhead: 'Monitor Fuel. Track Vehicles. Control Expenses.',
    intro: `A complete fleet fuel management solution for logistics companies, transport businesses, and delivery fleets.
Track fuel consumption, vehicle mileage, fuel issuance, and operational costs through one smart cloud platform.`,
  },
  'candy-and-confectionery-manufacturing-software': {
    headline: 'Cloud Based ERP Software for Candy and Confectionery Manufacturing',
    subhead: 'Automate Production, Inventory, Sales & Finance.',
    intro: `Manage candy production, raw materials, inventory, packaging, sales, finance, and HR operations with our advanced Candy Manufacturing ERP Software designed for confectionery businesses and food production factories.`,
  },
  'plastic-pipes-fitting-industry-software': {
    headline: 'Plastic pipes & fittings industry ERP for stock, projects, and billing',
    subhead: 'Distribution and light manufacturing patterns with inventory, AR/AP, and branch reporting on one ledger.',
  },
  'cloud-erp-software-for-textile-industries': {
    headline: 'Cloud Based ERP Software for Textile Industry',
    subhead: 'Smart ERP Solution for Textile Manufacturing and Processing.',
    intro: `Powerful ERP software designed for textile mills and textile manufacturing businesses to manage procurement, inventory, production, HR, finance, dyeing, weaving, and sales operations from one integrated cloud-based platform.`,
  },
  'knitting-dyeing-industry-software': {
    headline: 'Cloud Based ERP Software for Knitting & Dyeing Industry',
    subhead: 'Complete Textile Processing and Production Management Solution.',
    intro: `Manage knitting, dyeing, inventory, procurement, production, HR, finance, and sales operations from one centralized ERP platform built specifically for textile and dyeing industries.`,
  },
  'fabric-store-management-software': {
    headline: 'Cloud-Based Fabric Store Management Software for Seamless Stock & Sales Control',
    subhead: 'Manage Stock. Handle Sales. Improve Customer Experience.',
    intro: `A powerful retail solution built for fabric stores, cloth merchants, and tailoring material sellers.

Track fabric inventory, manage color and design variations, barcode billing, customer sales, supplier purchases, and accounts from one centralized cloud-based system.`,
  },
  'hotel-management-software': {
    headline: 'Cloud Based Software For Hotel Management System',
    subhead: 'Bookings, F&B, Banquets & Finance in One Platform.',
    intro: `DigitalManager Hotel Management Software helps hotels, guest houses, and restaurants manage bookings, front office operations, room services, restaurant billing, banquet events, inventory, purchases, and accounts from one centralized system.`,
  },
  'restaurant-banquet-management-software': {
    headline: 'Restaurant & banquet covers, events, and kitchen alignment',
    subhead: 'Banquets, restaurants, and room service flows feeding vouchers and inventory for hospitality finance.',
  },
  'pharmacy-business-management-software': {
    headline: 'Cloud-Based Pharmacy Business Management Software for Safe, Smart, and Streamlined Sales',
    subhead: 'Track Medicines. Monitor Expiry. Simplify Billing.',
    intro: `An all-in-one POS and inventory solution built specifically for pharmacies and medical stores. Manage medicine stock by batch and expiry, set up sale alerts for low stock or near-expiry drugs, handle barcode sales, maintain supplier records, and comply with health regulations — all in a secure cloud-based system built for pharmacies across Pakistan.`,
  },
  'homeopathic-business-management-software': {
    headline: 'Cloud-Based Homeopathic Business Management Software Built for Accurate Dispensing & Recordkeeping',
    subhead: 'Manage Medicines. Track Patients. Simplify Sales.',
    intro: `A complete software solution for homeopathic clinics, dispensaries, and medicine retailers. Organize medicine inventory and dosage records, monitor patient treatment history, manage prescriptions, and streamline billing through an intelligent cloud-based platform tailored for homeopathic businesses in Pakistan.`,
  },
  'luggage-bags-store-software': {
    headline: 'Cloud Based Point Of Sale Software for Luggage & Bags Store',
    subhead: 'Sales, purchases, inventory, customers, and accounting from one centralized platform.',
    intro: `Digital Manager POS Software for Luggage & Bags Stores helps manage sales, purchases, inventory control, customer handling, and accounting operations from one centralized platform.`,
  },
  'hardware-sanitary-store-software': {
    headline: 'Cloud Based Hardware & Sanitary Store Software',
    subhead: 'Trade-counter speed with inventory, suppliers, and accounts on one platform.',
    intro: `Elevate your retail experience with our Hardware & Sanitary Store Software.

Seamlessly process transactions, manage inventory, handle supplier purchases, and provide exceptional customer service from one smart cloud-based platform.`,
  },
  'toy-shop-management-software': {
    headline: 'Cloud Based ERP Software for Toy Shop',
    subhead: 'Purchase, sale, inventory, and accounting — automated for efficient growth.',
    intro: `Digital Manager Toy Shop Management Software helps manage and automate daily business operations like purchase, sale, inventory control, and accounting in an efficient way for better business growth.`,
  },
  'crockery-store-management-software': {
    headline: 'Cloud-Based Crockery Store Management Software for Elegant Inventory & Easy Billing',
    subhead: 'Track Designs. Simplify Sales. Manage Stock in Style.',
    intro: `Manage your crockery and kitchenware business efficiently with our advanced cloud-based store management system.

Handle inventory, barcode billing, supplier purchases, sales, stock tracking, customer records, and accounts from one centralized platform designed for crockery and household stores.`,
  },
  'computers-laptop-business-software': {
    headline: 'Cloud-Based Business Management Software for Computer & Laptop Retailers',
    subhead: 'Manage Sales. Track Inventory. Grow Your Tech Business.',
    intro: `An all-in-one business solution built for computer shops, laptop retailers, and electronics dealers. From inventory and invoicing to warranty tracking and customer history — everything you need to run your tech business efficiently in one cloud-powered system.`,
  },
  'electronics-management-software': {
    headline: 'Cloud-Based Electronics Store Management Software That Powers Smart Retailing',
    subhead: 'Manage Inventory. Track Sales. Deliver Better Service.',
    intro: `A specialized solution for electronics shops, gadget retailers, and appliance dealers. From product categorization and barcode billing to customer warranty handling and supplier management — everything in one integrated cloud-based platform.`,
  },
  'electric-store-management-software': {
    headline: 'Cloud-Based Electric Store Management Software Built for Efficiency & Control',
    subhead: 'Simplify Sales. Track Inventory. Manage Suppliers.',
    intro: `An all-in-one business solution designed for electric stores, wiring and lighting suppliers, switch dealers, and hardware shops. Manage stock levels, record supplier purchases, and handle customer orders — all through one smart cloud-based platform.`,
  },
  'mobile-accessories-business-software': {
    headline: 'Cloud-Based Mobile Accessories Business Software for Fast-Moving Retail',
    subhead: 'Track Stock. Simplify Billing. Maximize Profits.',
    intro: `A powerful solution for mobile accessories shops, mobile retailers, and gadget stores. Manage thousands of SKUs, barcode sales, chargers, covers, earbuds, and accessories with complete inventory and sales control.`,
  },
  'ev-charging-station-management-software': {
    headline: 'Cloud-Based Electric Vehicle Charging Station Software That Powers Smart Energy Management',
    subhead: 'Monitor Usage. Manage Stations. Increase Revenue.',
    intro: `A modern ERP solution for EV charging station operators. Monitor charging sessions, manage customer accounts, track payments, monitor station performance, and optimize energy operations through a secure cloud-based platform.`,
  },
  'marble-and-granite-factory-software': {
    headline: 'Marble & granite factories: slabs, projects, and job costing',
    subhead: 'Production and project billing with inventory and accounts for stone fabrication businesses.',
  },
  'ceiling-and-wall-paneling-store-software': {
    headline: 'Ceiling & wall paneling stores: measure, cut, and deliver with margin clarity',
    subhead: 'Project-linked retail with stock, dispatch, and receivables on one ERP.',
  },
  'poultry-chicken-supply-management-software': {
    headline: 'Poultry Arhat Software for Broiler Farm and Chicken Sale Shops in Pakistan',
    subhead: 'Manage Poultry Trading, Sales, and Inventory Efficiently.',
    intro: `Digital Manager Poultry Arhat Software helps poultry traders and chicken sale businesses manage purchases, sales, inventory, accounts, and customer records from one centralized cloud-based platform.`,
  },
  'poultry-waste-management-software': {
    headline: 'Cloud Based Poultry Waste Collection Management Software',
    subhead: 'Manage Poultry Waste Collection and Rendering Efficiently.',
    intro: `Digital Manager Poultry Waste Collection Management Software helps businesses manage slaughtered chicken waste collection, rendering operations, vehicle routes, inventory, accounts, and sales from one centralized cloud-based platform.`,
  },
  'cloud-erp-software-for-agriculture-business': {
    headline: 'Cloud-Based Smart Agriculture Farm Management Software for Modern Farming',
    subhead: 'Grow Smarter. Track Everything. Maximize Farm Profitability.',
    intro: `Manage crops, land records, fertilizers, pesticides, labor activities, inventory, expenses, irrigation schedules, and farm profitability with our modern Smart Agriculture Farm Management ERP Software.`,
  },
  'software-for-visa-immigration-consultants': {
    headline: 'ERP Software for Visa & Immigration Consultants',
    subhead: 'Manage Cases, Documents, Clients & Finance in One Platform.',
    intro: `Our cloud-based ERP Software for Visa & Immigration Consultants is designed to streamline consultancy operations, case handling, document management, client communication, invoicing, and financial tracking. Manage visa applications, immigration records, customer interactions, and office operations efficiently from one centralized platform.`,
  },
}

function mergeIndustryPage(label: string, slug: string | undefined): ModuleRichPage {
  const base = buildIndustryRichPage(label)
  if (!slug) return base
  const o = industryOverrides[slug]
  if (!o) return base
  return {
    ...base,
    ...o,
    highlights: o.highlights ?? base.highlights,
    capabilities: o.capabilities ?? base.capabilities,
    workflows: o.workflows ?? base.workflows,
    outcomes: o.outcomes ?? base.outcomes,
  }
}

export function getIndustryRichPage(
  slug: string | undefined,
  productLabelEn: string,
  lang: Lang = 'en',
  industryTitleAr?: string,
): ModuleRichPage {
  if (lang === 'ar' && slug) {
    return mergeIndustryPageAr(slug, industryTitleAr ?? productLabelEn)
  }
  return mergeIndustryPage(productLabelEn, slug)
}
