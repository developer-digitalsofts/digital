import type { Lang } from '../i18n/messages'
import { moduleRichPagesAr } from './moduleRichPagesAr'

/** Rich marketing copy for `/software/module/:slug` — keyed by slugify(module label). */

export type ModuleRichPage = {
  headline: string
  subhead: string
  intro: string
  highlights: string[]
  capabilities: { title: string; body: string }[]
  workflows: { step: string; detail: string }[]
  outcomes: string[]
}

const base = (partial: ModuleRichPage): ModuleRichPage => partial

export const moduleRichPages: Record<string, ModuleRichPage> = {
  'accounts-management-software': base({
    headline: 'Accounts management aligned with how you run the business',
    subhead:
      'Accounts receivable and payable, general ledger, trial balance, profit and loss, balance sheet, and cash flow — in one DigitalManager workspace.',
    intro:
      'DigitalManager Accounts reflects the same priorities highlighted on DigitalManager.ae: disciplined receivables and payables, a trustworthy ledger, and financial statements leadership can rely on. Whether you operate retail, distribution, services, or manufacturing, finance stays connected to operational vouchers so month-end is predictable instead of reactive.',
    highlights: [
      'Receivables and payables with clear ageing, limits, and collections context',
      'General ledger, trial balance, and statutory-ready financial statements',
      'Cash flow visibility that matches how cash and bank actually move in your branches',
    ],
    capabilities: [
      {
        title: 'Ledger & financial statements',
        body: 'Chart of accounts, journals, trial balance, profit and loss, balance sheet, and cash flow reporting designed for auditors and management reviews.',
      },
      {
        title: 'Receivables & payables',
        body: 'Customer and supplier balances, credit control, and payment runs that stay tied to source transactions across the ERP.',
      },
      {
        title: 'Cash, bank, and compliance',
        body: 'Bank and cash books, reconciliations, and reporting packs that keep finance, branches, and regulators aligned.',
      },
    ],
    workflows: [
      { step: 'Record', detail: 'Capture sales, purchases, payroll, and inventory impact through controlled vouchers.' },
      { step: 'Review', detail: 'Maker–checker, period discipline, and exception queues before you lock a period.' },
      { step: 'Report', detail: 'Trial balance through P&L, balance sheet, and cash flow with drill-down where roles allow.' },
    ],
    outcomes: [
      'Fewer surprises between operations and the general ledger',
      'Faster answers on profitability, liquidity, and working capital',
      'Cleaner evidence for banks, tax, and internal audit',
    ],
  }),

  'purchase-management-software': base({
    headline: 'Procurement that matches how you actually buy',
    subhead: 'Requisitions, RFQs, POs, GRN, and vendor scorecards wired to inventory and finance.',
    intro:
      'Operational buying stays disciplined: approvals, three-way match, and landed cost flow straight into stock valuation and payables.',
    highlights: [
      'Approval matrix by amount and category',
      'GRN / service entry linked to PO lines',
      'Vendor performance and lead-time tracking',
    ],
    capabilities: [
      {
        title: 'Requisition to PO',
        body: 'Internal requests, quotes, and negotiated rates before a PO is released to the supplier.',
      },
      {
        title: 'Goods receipt',
        body: 'Partial receipts, quality holds, and returns that update on-hand and accruals in real time.',
      },
      {
        title: 'Vendor financials',
        body: 'AP alignment, retention, and payment terms with dispute notes visible to buyers and finance.',
      },
    ],
    workflows: [
      { step: 'Plan', detail: 'Material requirements informed by sales and production signals.' },
      { step: 'Buy', detail: 'Issued POs with delivery schedules and tax treatment per line.' },
      { step: 'Receive & pay', detail: 'GRN posts stock; invoices matched before payment runs.' },
    ],
    outcomes: [
      'Lower leakage between ordered, received, and invoiced quantities',
      'Better negotiation data from historical spend',
      'Tighter control on branch-level buying',
    ],
  }),

  'sales-order-management-software': base({
    headline: 'Sales velocity from quote to cash',
    subhead: 'Quotes, orders, deliveries, billing, and collections synced with stock and receivables.',
    intro:
      'Commercial teams work one pipeline: pricing rules, credit checks, and fulfilment status without re-keying into finance.',
    highlights: [
      'Credit limits and exposure before order release',
      'Delivery planning with partial shipments',
      'Invoices and CN/DN tied to original orders',
    ],
    capabilities: [
      {
        title: 'Quotations & pricing',
        body: 'Price lists, bundles, promotions, and customer-specific agreements with validity windows.',
      },
      {
        title: 'Order fulfilment',
        body: 'Pick/pack/dispatch with serial/batch trace where required, and POD capture.',
      },
      {
        title: 'Receivables',
        body: 'Aging, reminders, and receipt allocation with clear linkage to sales executives and branches.',
      },
    ],
    workflows: [
      { step: 'Opportunity', detail: 'Structured quotes with margin visibility for approvers.' },
      { step: 'Fulfil', detail: 'Stock reservation and back-order handling across locations.' },
      { step: 'Bill & collect', detail: 'Tax-correct invoices and integrated collection follow-up.' },
    ],
    outcomes: [
      'Shorter order-to-cash cycles',
      'Fewer billing disputes through document traceability',
      'Sales and finance aligned on one revenue picture',
    ],
  }),

  'inventory-management-software': base({
    headline: 'Cloud-Based Inventory Management Software That Keeps Your Stock in Check',
    subhead: 'Track Stock. Avoid Shortages. Maximize Profits.',
    intro:
      'All-in-one inventory control solution for warehouses, retail stores, manufacturers, distributors, and service-based businesses.\n\nReal-time tracking, automated recording, and seamless integration with sales, purchases, and accounts — built for businesses of every scale.',
    highlights: [
      'Chart of items spanning raw material, finished goods, fixed assets, tools, and equipment',
      'Multiple stock locations with warehouse and rack management',
      'Requisitions, approvals, barcode labelling and scanning, and assemble / de-assemble',
    ],
    capabilities: [
      {
        title: 'Stock movement & valuation',
        body: 'Opening stock, requisitions, gate inward, issuance, consumption, transfers, and conversions with costing finance can reconcile.',
      },
      {
        title: 'Alerts & control',
        body: 'Low and high stock level alerts, repair inward/outward, and adjustment discipline before GL impact.',
      },
      {
        title: 'Reporting',
        body: 'Requisition, order, inward, issuance, consumption, transfer, ledger, summary, value, adjustment, and repair reports in one programme.',
      },
    ],
    workflows: [
      { step: 'Chart & locations', detail: 'Maintain item masters, warehouses, and racks as the foundation for every movement.' },
      { step: 'Transact', detail: 'Run requisitions, approvals, gate passes, issuance, consumption, and transfers with barcode support.' },
      { step: 'Report & act', detail: 'Use stock level, valuation, and movement reports to tighten purchasing and service levels.' },
    ],
    outcomes: [
      'Real-time visibility across locations with fewer manual errors',
      'Tighter alignment between physical stock and financial books',
      'Faster decisions from alerts and purpose-built inventory reports',
    ],
  }),

  'point-of-sale-management-software': base({
    headline: 'Cloud-Based Point Of Sale Software (POS) That Powers Your Retail Growth',
    subhead: 'Simplify Sales. Track Inventory. Delight Customers.',
    intro:
      'All-in-one retail management solution for grocery stores, fashion boutiques, electronics shops, salons, cafes, restaurants, and pharmacies.\n\nSeamlessly UAE VAT-integrated and designed for businesses of all sizes.',
    highlights: [
      'Purchase, sales, inventory, and accounts modules behind the register — one retail spine',
      'UAE VAT-aligned invoicing where enabled, with lanes, shifts, and tender control for busy stores',
      'Reporting from orders and sales through stock and financial statements without manual consolidation',
    ],
    capabilities: [
      {
        title: 'Purchase management',
        body: 'Purchase orders, invoices, and returns tied to suppliers and stock for disciplined inbound retail.',
      },
      {
        title: 'Sales management',
        body: 'Customer definitions, orders, credit and cash sales, and returns with faster billing and tracking.',
      },
      {
        title: 'Inventory & accounts',
        body: 'Items, warehouses, adjustments, transfers, and accounts vouchers that keep the floor and finance aligned.',
      },
    ],
    workflows: [
      { step: 'Serve customers', detail: 'Fast checkout with barcodes, promotions, and accurate stock impact at the lane.' },
      { step: 'Run the store', detail: 'Coordinate purchasing, stock, and shifts so replenishment and cash discipline hold.' },
      { step: 'Close with confidence', detail: 'Reconcile tenders, review module reports, and hand clean numbers to finance.' },
    ],
    outcomes: [
      'Fewer gaps between tickets, stock, and the ledger',
      'Faster billing and clearer credit and cash sale visibility',
      'Stronger retail reporting for head office without spreadsheet merges',
    ],
  }),

  'payroll-management-software': base({
    headline: 'Cloud-Based Payroll Management Software That Simplifies Employee Compensation',
    subhead: 'Automate Salaries. Stay Compliant. Save Time.',
    intro:
      'All-in-one payroll solution for SMEs, enterprises, factories, schools, and service businesses.\n\nManage employee salaries, deductions, attendance, and tax compliance — all from one centralized cloud-based system built for businesses of all sizes.',
    highlights: [
      'Staff hiring, shifts, roster management, and salary calculation methods in one programme',
      'Attendance management with overtime, advances, loans, incentives, and penalties',
      'Salary sheets, salary slips, and reporting for workforce and finance alignment',
    ],
    capabilities: [
      {
        title: 'Workforce setup',
        body: 'Departments, shifts, shift groups, roster defining, and salary days settings before pay runs.',
      },
      {
        title: 'Attendance & vouchers',
        body: 'Staff attendance, updates, advances, loans, incentives, penalties, mess charges, and overtime approvals with controlled postings.',
      },
      {
        title: 'Outputs & compliance',
        body: 'Salary generation, slips, and reports that support statutory context and management review.',
      },
    ],
    workflows: [
      { step: 'Define structure', detail: 'Set departments, shifts, rosters, and salary calculation rules for your organisation.' },
      { step: 'Capture & approve', detail: 'Record attendance and process vouchers for overtime, advances, loans, and adjustments.' },
      { step: 'Run & report', detail: 'Generate salary sheets and slips with attendance, overtime, and deduction reports for sign-off.' },
    ],
    outcomes: [
      'Less manual effort and fewer payroll calculation errors',
      'Clearer attendance and overtime visibility before pay is locked',
      'Stronger control over advances, loans, incentives, and penalties in one system',
    ],
  }),

  'human-resource-management-software': base({
    headline: 'HRM built around people records and policy',
    subhead: 'Onboarding, contracts, leave, and workforce analytics connected to payroll.',
    intro:
      'People teams maintain authoritative employee data while approvals and policies stay enforceable as the company scales.',
    highlights: [
      'Digital employee file with role-based access',
      'Leave policies, encashment, and balances',
      'Org structure and reporting lines',
    ],
    capabilities: [
      {
        title: 'Lifecycle',
        body: 'Joiners, transfers, and exits with checklist tasks and asset hand-back hooks.',
      },
      {
        title: 'Time off',
        body: 'Accrual rules, blackout dates, and delegation when managers are unavailable.',
      },
      {
        title: 'Insights',
        body: 'Headcount, tenure, and cost-to-serve views without exporting to BI tools first.',
      },
    ],
    workflows: [
      { step: 'Hire', detail: 'Requisition → offer → contract with document storage.' },
      { step: 'Operate', detail: 'Attendance, leave, and expense claims with approval paths.' },
      { step: 'Develop', detail: 'Goals and review cycles (where enabled) feeding talent decisions.' },
    ],
    outcomes: [
      'Single employee record across HR and payroll',
      'Fewer policy exceptions slipping through informal channels',
      'Leadership dashboards on workforce composition',
    ],
  }),

  'executive-reporting-analytics-software': base({
    headline: 'Reports executives actually open',
    subhead: 'Role-based dashboards, scheduled packs, and drill-downs across finance and operations.',
    intro:
      'Decision makers consume live slices of revenue, margin, stock, and cash — filtered by branch, product line, or cost centre without waiting on static exports.',
    highlights: [
      'Saved views per role (CXO, branch manager, finance)',
      'Scheduled email / PDF packs',
      'Drill to voucher or document where permissions allow',
    ],
    capabilities: [
      {
        title: 'Dashboards',
        body: 'KPI tiles with thresholds, spark trends, and comparison to budget or prior year.',
      },
      {
        title: 'Operational analytics',
        body: 'Slow movers, OTIF, and basket mix for retail and distribution teams.',
      },
      {
        title: 'Financial packs',
        body: 'Trial balance snapshots, cash forecasts, and segment P&L for board cycles.',
      },
    ],
    workflows: [
      { step: 'Define', detail: 'Standardise KPIs once; inherit by role and entity.' },
      { step: 'Distribute', detail: 'Subscriptions and burst alerts on threshold breaches.' },
      { step: 'Act', detail: 'Deep links into transactions to resolve exceptions quickly.' },
    ],
    outcomes: [
      'Less time assembling board packs manually',
      'Earlier detection of margin or stock anomalies',
      'Aligned metrics from shop floor to HQ',
    ],
  }),

  'production-management-software': base({
    headline: 'Cloud-Based Production Management Software That Powers Your Manufacturing Efficiency',
    subhead: 'Simplify Production. Track Resources. Deliver Quality.',
    intro:
      'All-in-one production management solution for textile units, pharmaceutical plants, food manufacturers, packaging industries, and engineering workshops.\n\nSeamlessly integrate production with inventory, sales, and accounts — designed for factories and production setups of all sizes.',
    highlights: [
      'Chart of accounts, departments, warehouses, BOM, and factory overheads in one manufacturing view',
      'Gate passes, transfers, consumption, estimations, and BOM or manual production vouchers',
      'Reporting from inward moves through BOM, manual, and all-production views to delivery chalan',
    ],
    capabilities: [
      {
        title: 'Planning & BOM',
        body: 'Production estimation, BOM production, and manual production paths with material visibility.',
      },
      {
        title: 'Stock & warehouse',
        body: 'Inward gate pass, transfers, consumption, and outward delivery aligned to inventory valuation.',
      },
      {
        title: 'Cost & control',
        body: 'FOH absorption and production reporting so leadership sees efficiency and wastage signals early.',
      },
    ],
    workflows: [
      { step: 'Prepare', detail: 'Maintain departments, warehouses, BOMs, and overhead rules before runs.' },
      { step: 'Produce', detail: 'Record gate passes, issues, consumption, and completions with voucher discipline.' },
      { step: 'Report', detail: 'Use production and delivery reports to tune plans and protect margin.' },
    ],
    outcomes: [
      'Better visibility from material issue to finished dispatch',
      'Tighter integration between shop floor activity and financial books',
      'Less waste and delay from manual production tracking gaps',
    ],
  }),

  'integration-system': base({
    headline: 'Cloud-Based SMS Integration System That Keeps Your Customers Connected',
    subhead: 'Send Alerts. Boost Engagement. Automate Communication.',
    intro:
      'All-in-one SMS solution for retail, healthcare, education, logistics, and service-based businesses.\n\nEasily integrate with your POS, CRM, or ERP to send invoices, promotions, reminders, and alerts — instantly and reliably across the UAE.',
    highlights: [
      'Sale and purchase alerts, minimum stock signals, and overdue customer reminders by SMS',
      'Promotions, welcome notes, and campaign-style messaging from the same integration layer',
      'ERP, POS, and CRM–triggered messages with logging suitable for operations and compliance reviews',
    ],
    capabilities: [
      {
        title: 'Transactional SMS',
        body: 'Tie SMS to vouchers and masters so invoices, dues, and controller alerts reflect real postings—not manual lists.',
      },
      {
        title: 'Engagement & stock',
        body: 'Promote products, welcome customers, and warn on minimum stock before service levels break.',
      },
      {
        title: 'Integration discipline',
        body: 'Templates, throttles, and delivery visibility so IT can monitor gateways and failures without shadow tools.',
      },
    ],
    workflows: [
      { step: 'Connect systems', detail: 'Link POS, CRM, or ERP events to SMS templates and approved sender profiles.' },
      { step: 'Automate messages', detail: 'Fire alerts for sales, purchases, stock, overdue balances, and campaigns from policy.' },
      { step: 'Review delivery', detail: 'Track logs, retries, and customer responses so teams refine timing and content.' },
    ],
    outcomes: [
      'Faster, more consistent customer communication than manual calling alone',
      'Earlier operational reaction to stock and collection signals',
      'Less duplicate effort between branches, marketing, and finance on messaging',
    ],
  }),

  'fbr-pos-integration-software': base({
    headline: 'UAE VAT-Integrated POS Software for Real-Time Sales Compliance',
    subhead: 'Compliant. Automated. Officially Integrated.',
    intro:
      'Stay fully compliant with regulatory standards using our officially verified Point of Sale (POS) software integrated with the UAE tax compliance workflows.\n\nThis smart cloud-based system automates real-time invoice reporting, generates digital receipts, verifies TRNs, and ensures seamless tax filing processes.\n\nIdeal for retail businesses, restaurants, pharmacies, and service providers.',
    highlights: [
      'POS, CRM, tax filing verification, and analytics aligned to UAE VAT digital invoicing expectations',
      'Varying tax percentages by product with sales and purchase history for audits and reviews',
      'SMS-aware filing verification with real-time reporting for leadership and tax teams',
    ],
    capabilities: [
      {
        title: 'Digital invoice generation',
        body: 'Structured payloads from real POS movements with buyer metadata and tax lines tied to masters.',
      },
      {
        title: 'Submission & monitoring',
        body: 'Queues, status, retries, and operator-readable diagnostics without breaking internal postings.',
      },
      {
        title: 'Reconciliation & security',
        body: 'Tie regulator references to AR and revenue while preserving access control and audit trails.',
      },
    ],
    workflows: [
      { step: 'Transact at POS', detail: 'Sell with compliant digital invoice data alongside stock and tender control.' },
      { step: 'Verify & notify', detail: 'Validate TRNs, use SMS alerts where configured, and track submission health.' },
      { step: 'Report & file', detail: 'Use analytics and history packs to support timely, confident tax filing.' },
    ],
    outcomes: [
      'Less manual gap between tills, ERP, and regulator submissions',
      'Earlier visibility on mismatches or rejected payloads',
      'Stores stay focused on service while compliance automation runs in the background',
    ],
  }),

  'crm-software': base({
    headline: 'Cloud-Based CRM Software That Strengthens Customer Relationships',
    subhead: 'Track Leads. Manage Clients. Grow Loyalty.',
    intro:
      'All-in-one CRM solution for sales teams, support centers, service businesses, and growing enterprises.\n\nStreamline lead management, follow-ups, support tickets, and customer insights — all from one scalable platform.',
    highlights: [
      'Contact and relationship management with marketing automation and service in one programme',
      'Support tickets, projects, and mobile access alongside insights and customizable reports',
      'Organize and track information so sales opportunities are not lost to disorganized follow-up',
    ],
    capabilities: [
      {
        title: 'Leads & pipeline',
        body: 'Stages, ownership, and follow-ups that convert cleanly into quotations and orders where integrated.',
      },
      {
        title: 'Marketing & service',
        body: 'Campaigns, tickets, and SLAs tied to the same customer timeline sales and support rely on.',
      },
      {
        title: 'Insights & mobility',
        body: 'Dashboards, exports, and mobile-friendly access so teams stay productive in the field or at the desk.',
      },
    ],
    workflows: [
      { step: 'Capture', detail: 'Record leads, contacts, and activities with clear ownership and next steps.' },
      { step: 'Engage', detail: 'Automate campaigns, manage tickets, and plan projects without losing context.' },
      { step: 'Analyze', detail: 'Report on pipeline, service load, and account health for predictable growth.' },
    ],
    outcomes: [
      'Better organized customer data and fewer missed follow-ups',
      'Faster handover from marketing and service into revenue motions',
      'Clearer visibility for leadership without manual spreadsheet roll-ups',
    ],
  }),
}

export function getModuleRichPage(slug: string | undefined, lang: Lang = 'en'): ModuleRichPage | undefined {
  if (!slug) return undefined
  if (lang === 'ar') {
    const ar = moduleRichPagesAr[slug]
    if (ar) return ar
  }
  return moduleRichPages[slug]
}
