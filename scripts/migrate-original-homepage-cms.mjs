/**
 * One-time migration: seed draft + published CMS JSON from the approved
 * public frontend (i18n + hard-coded card catalogues). Does NOT run on server boot.
 *
 * Usage: node scripts/migrate-original-homepage-cms.mjs
 */
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DATA = path.join(__dirname, '..', 'server', 'data')
const PUBLISHED = path.join(DATA, 'published')

const bi = (en, ar) => ({ en, ar })
const now = new Date().toISOString()
const meta = () => ({ createdAt: now, updatedAt: now, updatedBy: 'migrate-original-homepage' })

const MODULES = [
  {
    id: 'm-accounts',
    icon: 'Landmark',
    accentColor: '#ff7a45',
    badge: bi('Core', 'أساسي'),
    title: bi('Accounts', 'الحسابات'),
    description: bi(
      'Ledger, vouchers, AR/AP, and audit-ready financial statements.',
      'دفتر أستاذ وقيود وذمم وقوائم مالية جاهزة للتدقيق.',
    ),
    href: '/software/accounts-management-software',
    sortOrder: 0,
  },
  {
    id: 'm-production',
    icon: 'Factory',
    accentColor: '#2563eb',
    badge: bi('Core', 'أساسي'),
    title: bi('Production', 'الإنتاج'),
    description: bi(
      'BOM, production orders, and shop-floor tracking linked to inventory.',
      'قوائم مواد وأوامر إنتاج وتتبع أرض الورشة مرتبط بالمخزون.',
    ),
    href: '/software/production-management-software',
    sortOrder: 1,
  },
  {
    id: 'm-pos',
    icon: 'TabletSmartphone',
    accentColor: '#7c3aed',
    badge: bi('Popular', 'شائع'),
    title: bi('POS', 'نقطة البيع'),
    description: bi(
      'Fast checkout, promotions, and live stock sync to ERP.',
      'كاشير سريع وعروض ومزامنة مخزون لحظية مع الـ ERP.',
    ),
    href: '/software/point-of-sale-software',
    sortOrder: 2,
  },
  {
    id: 'm-fbr',
    icon: 'FileText',
    accentColor: '#ef233c',
    badge: bi('Popular', 'شائع'),
    title: bi('FBR Integration', 'تكامل FBR'),
    description: bi(
      'FBR-compliant digital invoicing and real-time POS tax lines.',
      'فوترة رقمية متوافقة مع FBR وخطوط ضريبة نقطة البيع لحظيًا.',
    ),
    href: '/software/fbr-pos-integration-software',
    sortOrder: 3,
  },
  {
    id: 'm-inventory',
    icon: 'Package',
    accentColor: '#16a34a',
    badge: bi('Core', 'أساسي'),
    title: bi('Inventory', 'المخزون'),
    description: bi(
      'Multi-location stock, transfers, costing, and cycle counts.',
      'مخزون متعدد المواقع وتحويلات وتكلفة وجرد دوري.',
    ),
    href: '/software/inventory-management-software',
    sortOrder: 4,
  },
  {
    id: 'm-payroll',
    icon: 'Banknote',
    accentColor: '#991b1b',
    badge: bi('Core', 'أساسي'),
    title: bi('Payroll', 'الرواتب'),
    description: bi(
      'Payslips, statutory deductions, and approvals in one run.',
      'كشوف رواتب واستقطاعات نظامية وموافقات في دورة واحدة.',
    ),
    href: '/software/payroll-management-software',
    sortOrder: 5,
  },
  {
    id: 'm-sms',
    icon: 'Cpu',
    accentColor: '#84cc16',
    badge: bi('Core', 'أساسي'),
    title: bi('SMS', 'الرسائل'),
    description: bi(
      'SMS and system alerts connecting POS, CRM, and ERP branches.',
      'رسائل وتنبيهات تربط نقطة البيع وCRM وفروع ERP.',
    ),
    href: '/software/sms-integration-system',
    sortOrder: 6,
  },
  {
    id: 'm-crm',
    icon: 'Users',
    accentColor: '#db2777',
    badge: bi('Popular', 'شائع'),
    title: bi('CRM', 'إدارة العملاء'),
    description: bi(
      'Leads, pipelines, and customer history tied to sales and collections.',
      'عملاء محتملون ومسارات وتاريخ عملاء مرتبط بالمبيعات والتحصيل.',
    ),
    href: '/software/crm-software',
    sortOrder: 7,
  },
]

const INDUSTRIES = [
  {
    id: 'i-petrol',
    icon: 'Fuel',
    accentColor: '#f97316',
    cardKey: 'petrol',
    category: bi('Industry Solution', 'حل قطاعي'),
    title: bi('Petrol & Gas', 'الوقود والغاز'),
    description: bi(
      'Shifts, nozzles, wet stock, and forecourt retail in one ledger.',
      'ورديات ومضخات ومخزون سائل وتجزئة المحطة في دفتر واحد.',
    ),
    href: '/software/industry/petrol-pump-software',
    sortOrder: 0,
  },
  {
    id: 'i-retail',
    icon: 'Store',
    accentColor: '#10b981',
    cardKey: 'general',
    category: bi('Industry Solution', 'حل قطاعي'),
    title: bi('Retail', 'التجزئة'),
    description: bi(
      'Finance, inventory, and operations for trading businesses.',
      'مالية ومخزون وعمليات لشركات التجارة.',
    ),
    href: '/software/industry/retail-management-software',
    sortOrder: 1,
  },
  {
    id: 'i-fbr',
    icon: 'FileText',
    accentColor: '#ef4444',
    cardKey: 'fbr',
    category: bi('Compliance', 'امتثال'),
    title: bi('FBR POS', 'نقطة بيع FBR'),
    description: bi(
      'Compliant digital invoicing with faster reconciliation.',
      'فوترة رقمية متوافقة مع تسوية أسرع.',
    ),
    href: '/software/module/fbr-pos-integration-software',
    sortOrder: 2,
  },
  {
    id: 'i-poultry',
    icon: 'Bird',
    accentColor: '#ec4899',
    cardKey: 'poultry',
    category: bi('Agriculture', 'زراعة'),
    title: bi('Poultry', 'الدواجن'),
    description: bi(
      'Flock cycles, feed, batches, and cost tracking unified.',
      'دورات القطعان والعلف والدفعات وتتبع التكلفة في نظام واحد.',
    ),
    href: '/software/industry/poultry-control-shed-management-software',
    sortOrder: 3,
  },
  {
    id: 'i-dairy',
    icon: 'Milk',
    accentColor: '#06b6d4',
    cardKey: 'dairy',
    category: bi('Agriculture', 'زراعة'),
    title: bi('Dairy Farm', 'مزارع الألبان'),
    description: bi(
      'Milk collection, routes, and producer settlements.',
      'جمع الحليب والمسارات وتسويات المنتجين.',
    ),
    href: '/software/industry/dairy-farm-management-software',
    sortOrder: 4,
  },
  {
    id: 'i-lpg',
    icon: 'Flame',
    accentColor: '#f59e0b',
    cardKey: 'lpg',
    category: bi('Energy', 'طاقة'),
    title: bi('LPG', 'غاز البترول المسال'),
    description: bi(
      'Cylinder tracking, refills, and depot operations.',
      'تتبع الأسطوانات والتعبئة وعمليات المستودع.',
    ),
    href: '/software/industry/lpg-business-software',
    sortOrder: 5,
  },
  {
    id: 'i-realestate',
    icon: 'Landmark',
    accentColor: '#14b8a6',
    cardKey: 'installment',
    category: bi('Finance', 'مالية'),
    title: bi('Real Estate', 'العقارات'),
    description: bi(
      'Contracts, installments, and collection tracking.',
      'عقود وأقساط وتتبع التحصيل.',
    ),
    href: '/software/industry/erp-software-for-real-estate-business',
    sortOrder: 6,
  },
  {
    id: 'i-garments',
    icon: 'Factory',
    accentColor: '#2563eb',
    cardKey: 'manuf',
    category: bi('Manufacturing', 'تصنيع'),
    title: bi('Garments', 'الملابس'),
    description: bi(
      'BOM, production orders, and shop-floor visibility.',
      'قوائم مواد وأوامر إنتاج ورؤية أرض الورشة.',
    ),
    href: '/software/industry/garments-manufacturing-software',
    sortOrder: 7,
  },
]

const VALUE_CHAIN = [
  {
    id: 'vc1',
    icon: 'Activity',
    accentColor: '#ff7a45',
    title: bi('Everyday business activity', 'النشاط التجاري اليومي'),
    description: bi(
      'Capture operational events as they happen so finance and inventory stay aligned.',
      'سجّل الأحداث التشغيلية فور حدوثها لتبقى المالية والمخزون متوافقتين.',
    ),
    sortOrder: 0,
  },
  {
    id: 'vc2',
    icon: 'BookOpen',
    accentColor: '#2563eb',
    title: bi('Accounts and bookkeeping', 'الحسابات والدفاتر'),
    description: bi(
      'Vouchers, ledgers, and period controls designed for disciplined month-end close.',
      'قيود وسجلات وضوابط فترات تدعم إغلاق الشهر بانضباط.',
    ),
    sortOrder: 1,
  },
  {
    id: 'vc3',
    icon: 'ShoppingBag',
    accentColor: '#10b981',
    title: bi('Sales and operations', 'المبيعات والعمليات'),
    description: bi(
      'Orders, deliveries, and billing connected to stock and receivables in real time.',
      'طلبات وتسليم وفوترة مرتبطة بالمخزون والذمم المدينة لحظيًا.',
    ),
    sortOrder: 2,
  },
  {
    id: 'vc4',
    icon: 'Users',
    accentColor: '#db2777',
    title: bi('Payroll and HR', 'الرواتب وإدارة الموارد البشرية'),
    description: bi(
      'Attendance, leave, and payroll outputs with approvals your auditors can follow.',
      'حضور وإجازات ورواتب مع موافقات يمكن للمراجعين تتبعها.',
    ),
    sortOrder: 3,
  },
  {
    id: 'vc5',
    icon: 'Package',
    accentColor: '#16a34a',
    title: bi('Inventory management', 'إدارة المخزون'),
    description: bi(
      'Multi-location stock, transfers, and costing that matches what your warehouse sees.',
      'مخزون متعدد المواقع وتحويلات وتكلفة تعكس ما يراه المستودع.',
    ),
    sortOrder: 4,
  },
  {
    id: 'vc6',
    icon: 'LineChart',
    accentColor: '#f59e0b',
    title: bi('Business intelligence reporting', 'ذكاء الأعمال والتقارير'),
    description: bi(
      'Executive dashboards and operational KPIs without exporting to spreadsheets.',
      'لوحات قيادة ومؤشرات تشغيلية دون تصدير لجداول منفصلة.',
    ),
    sortOrder: 5,
  },
]

async function writeBoth(rel, data) {
  const json = JSON.stringify(data, null, 2) + '\n'
  await fs.writeFile(path.join(DATA, rel), json, 'utf8')
  await fs.mkdir(PUBLISHED, { recursive: true })
  await fs.writeFile(path.join(PUBLISHED, rel), json, 'utf8')
  console.log('wrote', rel)
}

async function main() {
  await writeBoth('hero.json', {
    title: bi(
      'Run Your Business Smarter With One Connected ERP Platform',
      'أدر عملك بذكاء من منصة ERP متصلة واحدة',
    ),
    titleBefore: bi('Run Your Business ', 'أدر عملك '),
    titleAccent: bi('Smarter', 'بذكاء'),
    titleLine2: bi('With One Connected ERP Platform', 'من منصة ERP متصلة واحدة'),
    pill: bi(
      'All-in-One ERP Solution for Growing Businesses',
      'حل ERP شامل للشركات النامية',
    ),
    useStructuredTitle: true,
    showPill: true,
    showTrustPoints: true,
    sub: bi(
      'One cloud ERP for finance, inventory, retail, HR, and industry programs.',
      'ERP سحابي واحد للمالية والمخزون والتجزئة والموارد وبرامج القطاع.',
    ),
    body: bi(
      'DigitalManager helps businesses manage finance, inventory, sales, POS, HR, CRM, branches and reports from one secure cloud platform.',
      'يساعد ديجيتال مانجر الشركات على إدارة المالية والمخزون والمبيعات ونقطة البيع والموارد وCRM والفروع والتقارير من منصة سحابية آمنة واحدة.',
    ),
    ctaPrimary: {
      label: bi('Book Free Demo', 'احجز عرضاً مجانياً'),
      href: '/contact',
    },
    ctaSecondary: {
      label: bi('Explore ERP Modules', 'استكشف وحدات ERP'),
      href: '/#modules',
    },
    mockupImageUrl: '',
    trustPoints: [
      {
        id: 'tp1',
        icon: 'Shield',
        label: bi('Secure Cloud ERP', 'ERP سحابي آمن'),
        sortOrder: 0,
        active: true,
      },
      {
        id: 'tp2',
        icon: 'Cloud',
        label: bi('UAE & GCC Ready', 'جاهز للإمارات ودول الخليج'),
        sortOrder: 1,
        active: true,
      },
      {
        id: 'tp3',
        icon: 'GitBranch',
        label: bi('Multi-Branch Reporting', 'تقارير متعددة الفروع'),
        sortOrder: 2,
        active: true,
      },
    ],
    badges: [],
    _meta: meta(),
  })

  await writeBoth('stats.json', {
    title: bi(
      'Trusted By Businesses Across UAE & GCC',
      'موثوق به من الشركات عبر الإمارات ودول الخليج',
    ),
    items: [
      {
        id: 's-exp',
        value: '20+',
        label: bi('Years Experience', 'سنوات خبرة'),
        icon: 'Award',
        accentColor: '#ff7a45',
        sortOrder: 0,
        active: true,
      },
      {
        id: 's-sol',
        value: '120+',
        label: bi('Business Solutions', 'حلول أعمال'),
        icon: 'Layers',
        accentColor: '#2563eb',
        sortOrder: 1,
        active: true,
      },
      {
        id: 's-cli',
        value: '1000+',
        label: bi('Happy Clients', 'عملاء سعداء'),
        icon: 'Users',
        accentColor: '#16a34a',
        sortOrder: 2,
        active: true,
      },
      {
        id: 's-sat',
        value: '99%',
        label: bi('Client Satisfaction', 'رضا العملاء'),
        icon: 'HeartHandshake',
        accentColor: '#db2777',
        sortOrder: 3,
        active: true,
      },
      {
        id: 's-mb',
        value: 'Multi-Branch',
        label: bi('ERP Platform', 'منصة ERP'),
        icon: 'Network',
        accentColor: '#0ea5e9',
        sortOrder: 4,
        active: true,
      },
    ],
    _meta: meta(),
  })

  await writeBoth('about.json', {
    eyebrow: bi('About Us', 'من نحن'),
    title: bi('About DigitalManager', 'عن ديجيتال مانجر'),
    paragraphs: [
      bi(
        'DigitalManager is a cloud ERP platform built for growing businesses across UAE, GCC and international markets. It helps companies manage finance, inventory, sales, operations and reporting from one connected system.',
        'ديجيتال مانجر منصة ERP سحابية للشركات النامية عبر الإمارات والخليج والأسواق الدولية. تساعد الشركات على إدارة المالية والمخزون والمبيعات والعمليات والتقارير من نظام متصل واحد.',
      ),
      bi(
        'Built for multi-branch teams and industry-specific workflows, DigitalManager improves visibility, reduces manual work and helps management make faster decisions.',
        'مصممة للفرق متعددة الفروع وسير العمل الخاص بالقطاع، تحسّن الرؤية وتقلّل العمل اليدوي وتساعد الإدارة على اتخاذ قرارات أسرع.',
      ),
    ],
    trustItems: [
      { id: 'at1', label: bi('Since 2004', 'منذ ٢٠٠٤'), sortOrder: 0, active: true },
      {
        id: 'at2',
        label: bi('Trusted Across UAE & GCC', 'موثوق عبر الإمارات والخليج'),
        sortOrder: 1,
        active: true,
      },
      {
        id: 'at3',
        label: bi('Enterprise ERP Solutions', 'حلول ERP للمؤسسات'),
        sortOrder: 2,
        active: true,
      },
      {
        id: 'at4',
        label: bi('Multi-Branch ERP Support', 'دعم ERP متعدد الفروع'),
        sortOrder: 3,
        active: true,
      },
    ],
    imageUrl: '',
    _meta: meta(),
  })

  await writeBoth('valueChain.json', {
    title: bi(
      'Enterprise-grade control across your value chain',
      'تحكم على مستوى المؤسسات عبر سلسلة قيمتك',
    ),
    subtitle: bi(
      'Manage every department with one connected ERP system.',
      'أدِر كل الأقسام بنظام ERP واحد متصل.',
    ),
    cards: VALUE_CHAIN.map((c) => ({ ...c, active: true })),
    _meta: meta(),
  })

  await writeBoth('modules.json', {
    pill: bi('Connected platform', 'منصة متصلة'),
    title: bi('ERP Module Ecosystem', 'منظومة وحدات ERP'),
    subtitle: bi(
      'Accounts, inventory, POS, payroll, and reports — one connected ERP platform.',
      'الحسابات والمخزون ونقطة البيع والرواتب والتقارير — منصة ERP واحدة متصلة.',
    ),
    exploreLabel: bi('Explore →', 'استكشف ←'),
    items: MODULES.map((m) => ({ ...m, active: true })),
    _meta: meta(),
  })

  await writeBoth('workflow.json', {
    eyebrow: bi('Connected workflows', 'سير عمل متصل'),
    title: bi(
      'See how your daily workflows run inside DigitalManager',
      'شاهد كيف تسير عملياتك اليومية داخل ديجيتال مانجر',
    ),
    body: bi(
      'From sales and purchases to stock, accounts, and reports — all in one ERP platform.',
      'من المبيعات والمشتريات إلى المخزون والحسابات والتقارير — في منصة ERP واحدة.',
    ),
    cta: {
      label: bi('Book Workflow Walkthrough', 'احجز جولة على سير العمل'),
      href: '/contact',
    },
    _meta: meta(),
  })

  await writeBoth('industries.json', {
    title: bi('Industry ERP Solutions', 'حلول ERP للقطاعات'),
    subtitle: bi(
      'Purpose-built ERP for petrol, retail, manufacturing, poultry, dairy, real estate, and more.',
      'ERP مخصص للوقود والتجزئة والتصنيع والدواجن والألبان والعقارات والمزيد.',
    ),
    exploreLabel: bi('Explore →', 'استكشف ←'),
    items: INDUSTRIES.map((i) => ({ ...i, active: true })),
    _meta: meta(),
  })

  await writeBoth('faqs.json', {
    title: bi('Questions ERP buyers ask', 'أسئلة يطرحها مشترو ERP'),
    subtitle: bi(
      'Straight answers before you shortlist or roll out.',
      'إجابات مباشرة قبل الاختيار أو الإطلاق.',
    ),
    items: [
      {
        id: 'f1',
        question: bi(
          'Is DigitalManager suitable for small businesses?',
          'هل يناسب ديجيتال مانجر الشركات الصغيرة؟',
        ),
        answer: bi(
          'Yes. Start with accounts and inventory, then add POS or payroll as you grow. You only enable what you are ready to run day to day.',
          'نعم. ابدأ بالحسابات والمخزون ثم أضف نقطة البيع أو الرواتب مع النمو. تفعّل فقط ما أنت مستعد لتشغيله يوميًا.',
        ),
        sortOrder: 0,
        active: true,
      },
      {
        id: 'f2',
        question: bi('Can I use only selected ERP modules?', 'هل يمكن استخدام وحدات محددة فقط؟'),
        answer: bi(
          'Yes. Turn on the modules you need while sharing one chart of accounts, item master, and customer records across the company.',
          'نعم. فعّل الوحدات التي تحتاجها مع مشاركة دليل حسابات وأصناف وعملاء واحد عبر الشركة.',
        ),
        sortOrder: 1,
        active: true,
      },
      {
        id: 'f3',
        question: bi('Does it support POS and inventory?', 'هل يدعم نقطة البيع والمخزون؟'),
        answer: bi(
          'Yes. POS sales can update stock in near real time, and inventory valuation follows the same rules your finance team expects.',
          'نعم. مبيعات نقطة البيع تحدّث المخزون شبه لحظيًا، وتقييم المخزون يتبع قواعد فريق المالية.',
        ),
        sortOrder: 2,
        active: true,
      },
      {
        id: 'f4',
        question: bi('Can reports be customized?', 'هل يمكن تخصيص التقارير؟'),
        answer: bi(
          'Role-based dashboards and standard packs are included. Heavier custom layouts depend on your plan and implementation scope.',
          'تتضمن لوحات حسب الدور وحزمًا قياسية. التخصيص الأعمق يعتمد على خطتك ونطاق التنفيذ.',
        ),
        sortOrder: 3,
        active: true,
      },
      {
        id: 'f5',
        question: bi('Can it work for multiple branches?', 'هل يعمل لعدة فروع؟'),
        answer: bi(
          'Yes. Use inter-branch transfers, consolidated reporting, and branch-level permissions without splitting your data.',
          'نعم. استخدم التحويلات بين الفروع والتقارير الموحدة وصلاحيات الفروع دون تقسيم بياناتك.',
        ),
        sortOrder: 4,
        active: true,
      },
      {
        id: 'f6',
        question: bi('How do I start?', 'كيف أبدأ؟'),
        answer: bi(
          'Book a demo, share your priorities, and we will recommend a sensible module footprint and rollout sequence.',
          'احجز عرضًا وشارك أولوياتك وسنقترح وحدات مناسبة وتسلسل إطلاق.',
        ),
        sortOrder: 5,
        active: true,
      },
    ],
    _meta: meta(),
  })

  await writeBoth('cta.json', {
    title: bi(
      'Ready to modernize your business with a trusted ERP partner?',
      'هل أنت مستعد لتحديث أعمالك مع شريك ERP موثوق؟',
    ),
    paragraph: bi(
      'DigitalManager helps growing businesses across UAE, GCC and international markets manage accounts, inventory, sales, payroll, POS and reporting from one connected platform.',
      'يساعد ديجيتال مانجر الشركات النامية عبر الإمارات والخليج والأسواق الدولية على إدارة الحسابات والمخزون والمبيعات والرواتب ونقطة البيع والتقارير من منصة واحدة متصلة.',
    ),
    background: '',
    primary: {
      label: bi('Book Free Demo', 'احجز عرضًا مجانيًا'),
      href: '/contact',
    },
    secondary: {
      label: bi('Talk to an ERP Consultant', 'تحدث مع مستشار ERP'),
      href: '/contact',
    },
    whatsapp: {
      label: bi('WhatsApp Now', 'واتساب الآن'),
      href: 'https://wa.me/971581174911',
    },
    _meta: meta(),
  })

  // Restore footer product links to original module set (not Purchase/Sales/Reports)
  const footerPath = path.join(DATA, 'footer.json')
  const footerRaw = JSON.parse(await fs.readFile(footerPath, 'utf8'))
  footerRaw.productLinks = [
    {
      id: 'pl1',
      label: bi('Accounts', 'الحسابات'),
      href: '/software/accounts-management-software',
      sortOrder: 0,
      active: true,
    },
    {
      id: 'pl2',
      label: bi('Inventory', 'المخزون'),
      href: '/software/inventory-management-software',
      sortOrder: 1,
      active: true,
    },
    {
      id: 'pl3',
      label: bi('POS', 'نقطة البيع'),
      href: '/software/point-of-sale-software',
      sortOrder: 2,
      active: true,
    },
    {
      id: 'pl4',
      label: bi('Payroll & HRM', 'الرواتب والموارد'),
      href: '/software/payroll-management-software',
      sortOrder: 3,
      active: true,
    },
    {
      id: 'pl5',
      label: bi('CRM', 'إدارة العملاء'),
      href: '/software/crm-software',
      sortOrder: 4,
      active: true,
    },
  ]
  footerRaw.tagline = bi(
    'Cloud ERP for accounts, inventory, POS, payroll, and industry-specific programmes — built for teams that need dependable operations every day.',
    'ERP سحابي للحسابات والمخزون ونقاط البيع والرواتب وبرامج قطاعية — لفرق تعتمد على العمليات اليومية.',
  )
  footerRaw._meta = meta()
  await writeBoth('footer.json', footerRaw)

  await writeBoth('pageSections.json', {
    sections: [
      { id: 'topBar', name: 'Header top bar', visible: true, sortOrder: 0 },
      { id: 'hero', name: 'Hero', visible: true, sortOrder: 1 },
      { id: 'stats', name: 'Stats', visible: true, sortOrder: 2 },
      { id: 'about', name: 'About', visible: true, sortOrder: 3 },
      { id: 'valueChain', name: 'Features / Value chain', visible: true, sortOrder: 4 },
      { id: 'modules', name: 'ERP module ecosystem', visible: true, sortOrder: 5 },
      { id: 'workflow', name: 'Workflow CTA', visible: true, sortOrder: 6 },
      { id: 'industries', name: 'Industry solutions', visible: true, sortOrder: 7 },
      { id: 'faqs', name: 'FAQ', visible: true, sortOrder: 8 },
      { id: 'cta', name: 'Final CTA', visible: true, sortOrder: 9 },
      { id: 'footer', name: 'Footer', visible: true, sortOrder: 10 },
    ],
    _meta: meta(),
  })

  // Mark all migrated keys as published (no unpublished changes)
  const publishMeta = {}
  for (const key of [
    'hero',
    'stats',
    'about',
    'valueChain',
    'modules',
    'workflow',
    'industries',
    'faqs',
    'cta',
    'footer',
    'pageSections',
  ]) {
    publishMeta[key] = {
      lastSavedAt: now,
      lastPublishedAt: now,
      lastPublishedBy: 'migrate-original-homepage',
      hasUnpublishedChanges: false,
      migratedAt: now,
    }
  }
  await fs.writeFile(path.join(DATA, 'publishMeta.json'), JSON.stringify(publishMeta, null, 2) + '\n', 'utf8')
  console.log('Migration complete. Draft + published restored from original frontend content.')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
