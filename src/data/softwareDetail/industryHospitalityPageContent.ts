import type {
  SoftwareDetailPageData,
  SoftwareNamedItem,
  SoftwarePremiumPageConfig,
  SoftwareTabBlock,
} from './types'

function retailTab(problem: string, solution: string, transactions: string[], reports: string[]): SoftwareNamedItem[] {
  return [
    { name: 'Problem', description: problem },
    { name: 'Solution', description: solution },
    { name: 'Transactions', description: transactions.join(' • ') },
    { name: 'Reports', description: reports.join(' • ') },
  ]
}

const HOSPITALITY_TRUST = [
  { value: '2000+', label: 'Happy Clients', icon: 'Users' },
  { value: '99%', label: 'Client Satisfaction', icon: 'BadgeCheck' },
  { value: '✓', label: 'Multinational Company', icon: 'Globe2' },
  { value: '20+', label: 'Years of Experience', icon: 'Clock' },
] as const

function baseIndustryTrim(pl: SoftwarePremiumPageConfig): SoftwarePremiumPageConfig {
  return {
    ...pl,
    heroChips: [],
    industriesSection: {
      ...pl.industriesSection,
      heading: '',
      description: '',
      items: [],
      note: '',
    },
    implementationSectionTitle: '',
    implementationSectionLead: '',
    demoSendButtonLabel: 'Request Here',
    faqSectionHeading: pl.faqSectionHeading,
  }
}

const HOTEL_TABS: SoftwareTabBlock[] = [
  {
    id: 'hotel-purchase',
    title: 'Purchase Management',
    items: retailTab(
      'Hotels often face issues in supplier handling, purchase tracking, food inventory, and procurement control.',
      'Our Purchase Management System manages supplier purchases, invoices, returns, and procurement reports.',
      ['Purchase Order Voucher', 'Purchase Invoice Voucher', 'Purchase Return Voucher'],
      [
        'Purchase Order Report',
        'Pending Purchase Report',
        'Purchase Report',
        'Purchase Summary Report',
        'Purchase Return Report',
      ],
    ),
  },
  {
    id: 'hotel-front-office',
    title: 'Front Office Management',
    items: retailTab(
      'Manual front desk operations create booking errors, delayed check-ins, and poor guest record tracking.',
      'Our Front Office Management System helps manage reservations, check-ins, check-outs, guest records, and room availability.',
      ['Room Reservation', 'Room Check-In Voucher', 'Room Check-Out Voucher'],
      ['Room Status Report', 'Guest Reservation Report', 'Check-In / Check-Out Report', 'Guest Ledger Report'],
    ),
  },
  {
    id: 'hotel-room-service',
    title: 'Room Service Management',
    items: retailTab(
      'Room service orders are difficult to track manually and may cause billing mistakes.',
      'Our Room Service Module manages room orders, service requests, billing, and guest service tracking.',
      ['Room Service Order', 'Room Service Billing', 'Service Charges Voucher'],
      ['Room Service Report', 'Service Billing Report'],
    ),
  },
  {
    id: 'hotel-restaurant',
    title: 'Restaurant Management',
    items: retailTab(
      'Restaurant billing, kitchen orders, table management, and food inventory need proper control.',
      'Our Restaurant Management System manages dine-in orders, takeaway, kitchen printing, billing, and restaurant stock.',
      ['Table Order Voucher', 'Food Sale Voucher', 'Restaurant Bill Voucher'],
      ['Food Sale Report', 'Table Order Report', 'Restaurant Billing Report'],
    ),
  },
  {
    id: 'hotel-banquet',
    title: 'Banquet Management',
    items: retailTab(
      'Banquet bookings require event planning, advance payments, service tracking, and billing control.',
      'Our Banquet Management System helps manage event bookings, customer details, payments, and banquet billing.',
      ['Banquet Booking Voucher', 'Banquet Service Voucher', 'Banquet Payment Voucher'],
      ['Banquet Booking Report', 'Banquet Payment Report', 'Event Summary Report'],
    ),
  },
  {
    id: 'hotel-inventory',
    title: 'Inventory Management',
    items: retailTab(
      'Hotel inventory includes food items, housekeeping supplies, and store items that need accurate stock control.',
      'Our Inventory Management System tracks stock movement, store items, consumption, and inventory reports.',
      [
        'Purchase Store Voucher',
        'Stock Issue Voucher',
        'Stock Adjustment Voucher',
        'Inventory Transfer Voucher',
      ],
      ['Stock Report', 'Stock Value Report', 'Consumption Report', 'Inventory Ledger'],
    ),
  },
  {
    id: 'hotel-accounts',
    title: 'Accounts Management',
    items: retailTab(
      'Hotel businesses require proper control over payments, receipts, expenses, guest balances, and financial reporting.',
      'Our Accounts Management System provides ledgers, vouchers, banking, receivables, payables, and complete financial statements.',
      [
        'Cash Payment Voucher',
        'Cash Receipt Voucher',
        'Bank Payment Voucher',
        'Bank Receipt Voucher',
        'Journal Entry Voucher',
      ],
      [
        'Account Ledger',
        'Cash Payment Report',
        'Cash Receipt Report',
        'Trial Balance',
        'Profit & Loss Sheet',
        'Balance Sheet',
      ],
    ),
  },
]

export function mergeHotelManagementIndustryPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...baseIndustryTrim(pl),
    featuresHeading: 'Software Modules',
    featuresLead:
      'Purchase, front office, room service, restaurant, banquet, inventory, and accounts — one system for hotels, guest houses, and restaurants.',
    vouchersSectionEyebrow: 'Hotel management',
    challengesHeading: 'Why hotels choose DigitalManager',
    challengesIntro:
      'Bookings, F&B, banquets, and finance rarely align when they live in separate tools—DigitalManager connects them on one ledger.',
    challengesListLead: '',
    challengeBullets: [],
    solutionHeading: 'Hospitality under one roof',
    solutionParagraphs: [
      'DigitalManager Hotel Management Software helps hotels, guest houses, and restaurants manage bookings, front office operations, room services, restaurant billing, banquet events, inventory, purchases, and accounts from one centralized system.',
    ],
    heroAsideCaption: 'Hotel ERP with front office, F&B, banquets, stock, and accounts on DigitalManager.',
  }

  return {
    ...data,
    metaTitle: 'Cloud Based Hotel Management Software | DigitalManager ERP',
    metaDescription:
      'Hotel management software for bookings, front office, room service, restaurant, banquet, inventory, and accounts — for hotels and guest houses.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Cloud Based Software For Hotel Management System',
      subhead: 'Bookings, F&B, Banquets & Finance in One Platform.',
      intro:
        'DigitalManager Hotel Management Software helps hotels, guest houses, and restaurants manage bookings, front office operations, room services, restaurant billing, banquet events, inventory, purchases, and accounts from one centralized system.',
      trust: [...HOSPITALITY_TRUST],
      ctaPrimary: { label: 'Get Live Demo', to: '/contact#contact-form' },
      ctaSecondary: data.hero.ctaSecondary,
    },
    features: [
      {
        icon: 'ShoppingCart',
        title: 'Purchase Management',
        description: 'Supplier purchases, food inventory, invoices, returns, and procurement reports.',
      },
      {
        icon: 'DoorOpen',
        title: 'Front Office Management',
        description: 'Reservations, check-in, check-out, guest records, and room availability.',
      },
      {
        icon: 'ConciergeBell',
        title: 'Room Service Management',
        description: 'Room orders, service requests, billing, and guest service tracking.',
      },
      {
        icon: 'UtensilsCrossed',
        title: 'Restaurant Management',
        description: 'Dine-in, takeaway, kitchen orders, table billing, and restaurant stock.',
      },
      {
        icon: 'PartyPopper',
        title: 'Banquet Management',
        description: 'Event bookings, advance payments, service tracking, and banquet billing.',
      },
      {
        icon: 'Package',
        title: 'Inventory Management',
        description: 'Food, housekeeping supplies, store stock, consumption, and transfers.',
      },
      {
        icon: 'Landmark',
        title: 'Accounts Management',
        description: 'Ledgers, banking, guest balances, receivables, payables, and financial statements.',
      },
    ],
    vouchersReports: {
      heading: 'Hotel operations by area',
      subheading:
        'Seven programme areas — purchase through accounts — with challenges, solutions, and representative transactions and reports.',
      tabs: HOTEL_TABS,
    },
    whyChoose: { ...data.whyChoose, points: [] },
    realtimeReports: { ...data.realtimeReports, bullets: [] },
    implementation: [],
    related: [],
    seoBlocks: [],
    faqs: [],
    demoCta: {
      ...data.demoCta,
      heading: 'Want To Try Our Software Or Need A Quotation?',
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for hotel management on DigitalManager.',
    },
  }
}
