import type { Lang } from '../../i18n/messages'
import type { SoftwareDetailPageData } from './types'
import { buildAccountsManagementSoftwareDetailAr } from './accountsManagementDetailAr'

const v = (name: string, description: string) => ({ name, description })

function buildAccountsManagementSoftwareDetailEn(): SoftwareDetailPageData {
  return {
    metaTitle: 'Cloud-Based Accounts Management Software | DigitalManager ERP',
    metaDescription:
      'Automate bookkeeping, track payments, manage vouchers, and generate accurate financial reports with cloud-based Accounts Management Software.',
    accounts: {
      layout: 'accounts-management',
      featuresHeading: 'Software Features',
      featuresLead:
        'Powerful accounting tools that improve accuracy, reduce manual workload, and help management make informed financial decisions.',
      vouchersSectionEyebrow: 'Accounts Management',
      challengesHeading: 'Problem Statement',
      challengeBullets: [
        'Duplicate or incorrect entries',
        'Delayed financial reports',
        'Difficulty tracking receivables and payables',
        'Lack of centralized financial control',
        'Limited visibility into business performance',
        'Manual cheque and bank reconciliation',
        'Complex multi-branch accounting handling',
      ],
      solutionHeading: 'Solution',
      solutionParagraphs: [
        'Our Accounts Management Software provides a centralized and automated accounting environment that helps businesses maintain accurate financial records with ease.',
        'The system streamlines voucher posting, financial tracking, cheque management, reporting, and reconciliation processes while improving operational efficiency and financial transparency.',
      ],
      challengesIntro:
        'Many businesses still rely on manual bookkeeping, spreadsheets, or disconnected accounting systems. This creates challenges in managing vouchers, tracking expenses, monitoring receivables/payables, preparing tax-related records, and generating accurate reports.',
      challengesListLead: 'Common issues include:',
      heroChips: [
        { label: 'Receivables', value: 'AR aging', hint: 'Real-time' },
        { label: 'Payables', value: 'AP & PDC', hint: 'Controlled' },
        { label: 'Cash & bank', value: 'Liquidity', hint: 'Live ledger' },
      ],
      industriesSection: {
        heading: 'Industries We Serve',
        description:
          'Our cloud-based Accounts Management Software is suitable for various industries and supports scalable financial management for growing businesses.',
        items: [
          { label: 'Retail Businesses', to: '/software/industry/retail-management-software' },
          { label: 'Hospitality', to: '/software/industry/hospitality-management-software' },
          { label: 'Manufacturing', to: '/software/industry/garments-manufacturing-software' },
          { label: 'Professional Services', to: '/software/industry/small-and-medium-business-erp-software' },
          { label: 'Healthcare', to: '/software/industry/pharmacy-business-management-software' },
          { label: 'E-Commerce', to: '/software/industry/retail-management-software' },
          { label: 'Nonprofit Organizations', to: '/contact#contact-form' },
          { label: 'Construction Industry', to: '/software/industry/erp-software-for-construction-business' },
        ],
        note: 'Need accounting workflows for your industry? We will tailor it to your business process.',
      },
      implementationSectionTitle: 'Implementation Process',
      implementationSectionLead: 'A clear rollout process for requirement analysis, training, setup, and ongoing support.',
      faqSectionHeading: 'Frequently Asked Questions (FAQs)',
      demoFormVariant: 'email-phone',
      demoSendButtonLabel: 'Send',
      heroAsideCaption: 'Cloud accounting, receivables & payables, and live financial analytics — in one ERP.',
    },
    hero: {
      eyebrow: 'Accounts module',
      headline: 'Cloud-Based Accounts Management Software That Powers Your Financial Clarity',
      subhead: 'Automate bookkeeping, track payments, manage vouchers, and generate accurate financial reports.',
      intro:
        'Automate bookkeeping, track payments, manage vouchers, and generate accurate financial reports with our cloud-based Accounts Management Software. Designed for retailers, manufacturers, distributors, service providers, and multi-branch businesses, the system helps companies manage their complete financial operations from a single platform.\n\nOur software simplifies daily accounting processes including cash handling, bank transactions, debit/credit notes, journal entries, post-dated cheques, receivables, payables, and financial reporting. With real-time dashboards, multi-user access, and centralized control, businesses can monitor financial performance anytime, anywhere.\n\nThe solution is built to support businesses of all sizes with powerful accounting tools that improve accuracy, reduce manual workload, and help management make informed financial decisions.',
      trust: [
        { value: '300+', label: 'Happy Clients', icon: 'Users' },
        { value: '99%', label: 'Client Satisfaction', icon: 'BadgeCheck' },
        { value: '✓', label: 'Multinational Company', icon: 'Globe2' },
        { value: '20+', label: 'Years of Experience', icon: 'Clock' },
      ],
      ctaPrimary: { label: 'Let Us Demo', to: '/contact#contact-form' },
      ctaSecondary: { label: 'Explore ERP modules', to: '/#modules' },
    },
    features: [
      {
        icon: 'Scale',
        title: 'Double Entry Accounting',
        description: 'Maintain accurate financial records with complete debit and credit transaction management.',
      },
      {
        icon: 'GitBranch',
        title: 'Multi-Level Chart of Accounts',
        description:
          'Organize accounts in a structured hierarchy for better financial control and reporting.',
      },
      {
        icon: 'CalendarDays',
        title: 'Post-Dated Cheque Management',
        description: 'Manage cheque issuance, receipts, maturity tracking, and cheque status efficiently.',
      },
      {
        icon: 'Building2',
        title: 'Multi-Company Support',
        description: 'Operate and manage multiple companies from one centralized system.',
      },
      {
        icon: 'Shield',
        title: 'Multi-User Access',
        description: 'Provide secure role-based access to accountants, managers, and staff.',
      },
      {
        icon: 'PieChart',
        title: 'Complete Financial Reporting',
        description:
          'Generate ledgers, trial balances, balance sheets, profit & loss reports, aging reports, and more.',
      },
    ],
    vouchersReports: {
      heading: 'Accounts Management',
      subheading:
        'Manage problem areas, daily accounting transactions, and reporting from one centralized accounting platform.',
      tabs: [
        {
          id: 'transactions',
          title: 'Transactions',
          items: [
            v('Chart of Accounts', ''),
            v('Opening Balance Voucher', ''),
            v('Cash Payment Voucher', ''),
            v('Cash Receipt Voucher', ''),
            v('Bank Payment Voucher', ''),
            v('Bank Receipt Voucher', ''),
            v('Post-Dated Cheque Issue Voucher', ''),
            v('Post-Dated Cheque Receipt Voucher', ''),
            v('Debit Note', ''),
            v('Credit Note', ''),
            v('Journal Entry Voucher', ''),
          ],
        },
        {
          id: 'reporting',
          title: 'Reporting',
          items: [
            v('Account Ledger', ''),
            v('Cash Payment Reports', ''),
            v('Cash Receipt Reports', ''),
            v('Bank Payment Reports', ''),
            v('Bank Receipt Reports', ''),
            v('Cheque Issue Reports', ''),
            v('Cheque Receipt Reports', ''),
            v('Day Book', ''),
            v('Cash Flow Statement', ''),
            v('Expense Reports', ''),
            v('Receivable Reports', ''),
            v('Payable Reports', ''),
            v('Invoice Aging Reports', ''),
            v('Debtor Aging Reports', ''),
            v('Creditor Aging Reports', ''),
            v('Trial Balance Reports', ''),
            v('Profit & Loss Reports', ''),
            v('Balance Sheet', ''),
            v('Financial Summary Reports', ''),
          ],
        },
      ],
    },
    challengesSolutions: [],
    whyChoose: {
      heading: 'Revolutionize Your Financial Management',
      intro:
        'Our cloud-based Accounts Management Software helps businesses automate financial operations, improve reporting accuracy, and gain better control over accounting activities.',
      points: [
        {
          title: 'Automate Financial Operations',
          body: 'Simplify daily accounting work, voucher posting, cheque management, and reconciliation from one platform.',
        },
        {
          title: 'Improve Reporting Accuracy',
          body: 'Generate accurate financial reports and reduce errors caused by spreadsheets or disconnected accounting tools.',
        },
        {
          title: 'Scalable for Growth',
          body: 'Support retailers, manufacturers, distributors, service providers, and multi-branch businesses as they grow.',
        },
      ],
    },
    realtimeReports: {
      heading: '',
      intro: '',
      bullets: [],
    },
    related: [],
    implementation: [
      {
        icon: 'Compass',
        title: 'Consultancy',
        description: 'Requirement gathering, workflow analysis, and business process understanding.',
      },
      {
        icon: 'GraduationCap',
        title: 'Training',
        description: 'User and staff training for smooth software adoption.',
      },
      {
        icon: 'Download',
        title: 'Software Installation',
        description: 'Complete system setup, configuration, and deployment.',
      },
      {
        icon: 'Headphones',
        title: 'Support',
        description: 'Technical support, troubleshooting, maintenance, and assistance.',
      },
    ],
    demoCta: {
      heading: 'Request for Demo!',
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough for your chart of accounts and branches.',
      whatsappLabel: 'WhatsApp',
      whatsappHref: 'https://wa.me/971581174911',
      contactHref: '/contact#contact-form',
    },
    seoBlocks: [
      {
        heading: 'Industries We Serve',
        level: 2,
        paragraphs: [
          'The software is suitable for various industries and supports scalable financial management for growing businesses.',
        ],
        lists: [
          {
            items: [
              'Retail Businesses — Track sales, expenses, inventory-related accounting, and customer payments efficiently.',
              'Hospitality — Manage billing, payroll, expenses, and financial records for hotels and restaurants.',
              'Manufacturing — Monitor production costs, raw material expenses, and operational accounting.',
              'Professional Services — Handle invoicing, receivables, and project-based financial management.',
              'Healthcare — Manage patient billing, operational expenses, and financial reporting.',
              'E-Commerce — Track online sales, vendor payments, and reconciliations in real time.',
              'Nonprofit Organizations — Maintain transparent financial records and expense tracking.',
              'Construction Industry — Manage project expenses, contractor payments, and site-wise financial control.',
            ],
          },
        ],
      },
    ],
    faqs: [
      {
        q: 'What is cloud-based accounts management software?',
        a: 'Cloud-based accounts management software is an online accounting solution that helps businesses manage transactions, vouchers, ledgers, expenses, and financial reporting from anywhere.',
      },
      {
        q: 'How does cloud accounting differ from traditional accounting software?',
        a: 'Cloud accounting provides real-time access, centralized data management, automatic backups, and remote accessibility compared to traditional offline software.',
      },
      {
        q: 'Can I access my accounts from anywhere?',
        a: 'Yes, the software can be accessed securely from any authorized device with internet access.',
      },
      {
        q: 'Does the software support multi-company management?',
        a: 'Yes, the system supports multiple companies and multi-branch operations from a centralized platform.',
      },
      {
        q: 'Can the software generate financial reports automatically?',
        a: 'Yes, the software provides automated reporting including ledgers, trial balance, balance sheet, profit & loss, aging reports, and cash flow statements.',
      },
      {
        q: 'Is training and support included?',
        a: 'Yes, implementation assistance, user training, and ongoing technical support are provided.',
      },
    ],
  }
}

/** Full page model for `/software/module/accounts-management-software` — replaces generic expander content. */
export function buildAccountsManagementSoftwareDetail(lang: Lang = 'en'): SoftwareDetailPageData {
  return lang === 'ar' ? buildAccountsManagementSoftwareDetailAr() : buildAccountsManagementSoftwareDetailEn()
}
