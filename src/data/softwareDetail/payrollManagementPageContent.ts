import type {
  SoftwareDetailPageData,
  SoftwareFaqItem,
  SoftwareImplementationStep,
  SoftwareNamedItem,
  SoftwarePremiumPageConfig,
} from './types'

const tx = (name: string): SoftwareNamedItem => ({ name, description: '' })

const PAYROLL_TRANSACTIONS: SoftwareNamedItem[] = [
  tx('Roaster Defining'),
  tx('Salary Days Setting'),
  tx('Departments Management'),
  tx('Shifts Management'),
  tx('Shifts Group Management'),
  tx('Staff Hiring Form'),
  tx('Staff Attendance'),
  tx('Staff Advance Voucher'),
  tx('Staff Loan Voucher'),
  tx('Staff Incentive Voucher'),
  tx('Staff Penalty Voucher'),
  tx('Staff Mess Charges'),
  tx('Overtime Approval Voucher'),
  tx('Update Attendance Voucher'),
]

const PAYROLL_REPORTS: SoftwareNamedItem[] = [
  tx('Attendance Reports'),
  tx('Roasters Detail Reports'),
  tx('Overtime Reports'),
  tx('Staff Loan Reports'),
  tx('Mess Charges Reports'),
  tx('Staff Advances Reports'),
  tx('Staff Penalty Reports'),
  tx('Staff Incentive Reports'),
  tx('Salary Sheet Reports'),
  tx('Salary Slips Reports'),
]

const PROBLEM =
  'Managing payroll manually is time-consuming and error-prone. Businesses face issues with attendance tracking, salary calculations, overtime, deductions, and compliance management.'

const SOLUTION =
  'Our Payroll Management Software automates payroll processing, attendance integration, salary generation, overtime calculations, staff management, and reporting for complete workforce control.'

const INTRO =
  'All-in-one payroll solution for SMEs, enterprises, factories, schools, and service businesses.\n\nManage employee salaries, deductions, attendance, and tax compliance — all from one centralized cloud-based system built for businesses of all sizes.'

const PAYROLL_FAQS: SoftwareFaqItem[] = [
  {
    q: 'Does DigitalManager Payroll support multiple branches?',
    a: 'Yes. You can define departments, shifts, and rosters per site while consolidating salary runs and reports for head office. Role-based access keeps sensitive pay data limited to authorised HR and finance users.',
  },
  {
    q: 'Can attendance connect to biometric devices or imports?',
    a: 'Attendance can be captured or imported according to your rollout plan, then validated before pay is locked. Update attendance vouchers help you correct exceptions with an audit-friendly trail.',
  },
  {
    q: 'How are overtime, incentives, and penalties handled?',
    a: 'Overtime approval vouchers, incentive and penalty lines, and mess charges feed the same pay calculation engine so gross-to-net stays transparent for HR sign-off and finance posting.',
  },
  {
    q: 'Can we track staff loans and advances?',
    a: 'Staff loan and advance vouchers integrate with repayment schedules and pay runs, reducing side spreadsheets and reconciliation gaps at month-end.',
  },
  {
    q: 'Are salary sheets and payslips supported?',
    a: 'Salary sheet and salary slip reports are part of the programme, with export options suitable for internal distribution and bank disbursement packs where configured.',
  },
  {
    q: 'How does payroll stay aligned with accounts?',
    a: 'Payroll journals and disbursement postings can map to your chart of accounts and cost dimensions so people costs land in the general ledger with voucher traceability.',
  },
  {
    q: 'Can we start with a pilot group of employees?',
    a: 'Yes. Typical rollouts begin with a department or branch, validate rosters and salary rules, then expand users and policies without re-implementing core masters.',
  },
  {
    q: 'What implementation support is included?',
    a: 'Consultancy, training, installation, and ongoing support are structured so your team owns rosters, shifts, and pay rules after go-live, with DigitalManager consultants available for policy changes and optimisation.',
  },
]

const PAYROLL_IMPLEMENTATION: SoftwareImplementationStep[] = [
  {
    icon: 'Compass',
    title: 'Consultancy',
    description:
      'We map your pay structure, shifts, roster rules, departments, and statutory requirements so DigitalManager payroll mirrors how your organisation actually pays people.',
  },
  {
    icon: 'GraduationCap',
    title: 'Training',
    description:
      'Role-based training for HR, payroll officers, and supervisors — covering attendance, vouchers, approvals, and reporting so day-two operations stay in your team’s hands.',
  },
  {
    icon: 'Download',
    title: 'Software Installation',
    description:
      'Tenant setup, master imports, roster and shift templates, and sandbox validation before you run live pay periods on production.',
  },
  {
    icon: 'Headphones',
    title: 'Support',
    description:
      'Ongoing configuration, troubleshooting, and guidance after go-live so seasonal peaks, policy tweaks, and new hires do not disrupt payroll continuity.',
  },
]

/**
 * Post-template content for the Payroll Management module page only.
 */
export function mergePayrollManagementPremiumPage(data: SoftwareDetailPageData): SoftwareDetailPageData {
  const pl = data.premiumLayout
  if (!pl) return data

  const premiumLayout: SoftwarePremiumPageConfig = {
    ...pl,
    featuresHeading: 'Software Features',
    featuresLead:
      'Staff hiring, shifts, rosters, salary calculation methods, attendance, and extended payroll controls — designed for SMEs, enterprises, factories, schools, and service businesses on one cloud system.',
    vouchersSectionEyebrow: 'Payroll module',
    challengesHeading: 'Payroll Management Software',
    challengesIntro: PROBLEM,
    challengesListLead: '',
    challengeBullets: [],
    solutionHeading: 'Solution',
    solutionParagraphs: [SOLUTION],
    heroChips: [],
    heroAsideCaption: 'Centralized payroll, attendance, and compliance — with salary outputs your workforce and finance teams can trust.',
    industriesSection: {
      ...pl.industriesSection,
      heading: '',
      description: '',
      items: [],
      note: '',
    },
    implementationSectionTitle: 'Implementation',
    implementationSectionLead:
      'Consultancy, training, software installation, and support — structured so HR and finance share one rollout path for payroll on DigitalManager.',
    demoSendButtonLabel: 'Request Here',
    faqSectionHeading: pl.faqSectionHeading,
  }

  return {
    ...data,
    metaTitle: 'Cloud-Based Payroll Management Software | DigitalManager ERP',
    metaDescription:
      'Automate salaries, stay compliant, and save time with cloud payroll — attendance, deductions, salary generation, and reporting for businesses of all sizes.',
    premiumLayout,
    hero: {
      ...data.hero,
      headline: 'Cloud-Based Payroll Management Software That Simplifies Employee Compensation',
      subhead: 'Automate Salaries. Stay Compliant. Save Time.',
      intro: INTRO,
      trust: [
        { value: '2000+', label: 'Happy Clients', icon: 'Users' },
        { value: '99%', label: 'Client Satisfaction', icon: 'BadgeCheck' },
        { value: '✓', label: 'Multinational Company', icon: 'Globe2' },
        { value: '20+', label: 'Years of Experience', icon: 'Clock' },
      ],
      ctaPrimary: { label: 'Get Live Demo', to: '/contact#contact-form' },
      ctaSecondary: data.hero.ctaSecondary,
    },
    features: [
      {
        icon: 'UserPlus',
        title: 'Staff Hiring',
        description: 'Capture hiring details and employee master data that feed attendance, shifts, and pay calculations.',
      },
      {
        icon: 'Clock',
        title: 'Shifts Management',
        description: 'Define and maintain shift patterns and coverage so pay rules align to how teams actually work.',
      },
      {
        icon: 'CalendarDays',
        title: 'Roaster Management',
        description: 'Plan rosters and assignments with clarity for supervisors and payroll before each run.',
      },
      {
        icon: 'Calculator',
        title: 'Salary Calculation Method',
        description: 'Configure salary days, components, and calculation logic for consistent gross-to-net results.',
      },
      {
        icon: 'Fingerprint',
        title: 'Attendance Management',
        description: 'Track and validate attendance as the foundation for overtime, incentives, and accurate pay.',
      },
      {
        icon: 'Sparkles',
        title: 'And More',
        description:
          'Advances, loans, incentives, penalties, mess charges, overtime approvals, and attendance updates — integrated vouchers in one payroll programme.',
      },
    ],
    vouchersReports: {
      heading: 'Payroll Management Software',
      subheading:
        'Transactions and reporting below reflect core DigitalManager payroll flows — from roster and shift setup through attendance, vouchers, and salary outputs.',
      tabs: [
        { id: 'transactions', title: 'Transactions', items: PAYROLL_TRANSACTIONS },
        { id: 'reports', title: 'Reporting', items: PAYROLL_REPORTS },
      ],
    },
    whyChoose: {
      ...data.whyChoose,
      points: [],
    },
    realtimeReports: {
      ...data.realtimeReports,
      bullets: [],
    },
    implementation: PAYROLL_IMPLEMENTATION,
    related: [],
    seoBlocks: [],
    faqs: PAYROLL_FAQS,
    demoCta: {
      ...data.demoCta,
      heading: 'Want To Try Our Software Or Need A Quotation?',
      sub: 'Share your email and contact number — we will respond with a tailored walkthrough or quotation for payroll management on DigitalManager.',
    },
  }
}
