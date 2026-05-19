import type { Lang } from './messages'
import type {
  SoftwareChallengeSolution,
  SoftwareFaqItem,
  SoftwareImplementationStep,
  SoftwareNamedItem,
  SoftwareSeoBlock,
  SoftwareTrustStat,
  SoftwareWhyPoint,
} from '../data/softwareDetail/types'
import type { ModuleRichPage } from '../data/moduleRichPages'

export type SoftwareDetailCopy = {
  lang: Lang
  metaTitleSuffix: string
  trust: SoftwareTrustStat[]
  premiumTrust: SoftwareTrustStat[]
  heroEyebrowModule: string
  heroEyebrowIndustry: string
  ctaBookDemo: string
  ctaBrowseModules: string
  ctaBrowseIndustries: string
  ctaLetUsDemo: string
  ctaWhatsApp: string
  ctaExploreModules: string
  vouchersTabTitle: string
  reportsTabTitle: string
  vouchersReportsHeading: string
  vouchersReportsSubheading: string
  whyChooseHeading: (name: string) => string
  whyChooseIntro: string
  realtimeHeading: string
  realtimeIntro: string
  demoHeading: string
  demoSub: string
  demoWhatsapp: string
  featurePadSecurityTitle: string
  featurePadSecurityDesc: (name: string) => string
  featurePadIntegrationTitle: string
  featurePadIntegrationDesc: string
  reportBulletOutcome: string
  reportBulletSignal: string
  reportBulletCapability: string
  premiumFeaturesHeading: (name: string) => string
  premiumVouchersEyebrowModule: string
  premiumVouchersEyebrowIndustry: string
  premiumVouchersHeadingModule: string
  premiumVouchersHeadingIndustry: string
  premiumVouchersSub: (short: string) => string
  premiumChallengesHeading: (short: string) => string
  premiumChallengesIntro: (short: string, host: string) => string
  premiumChallengesListLead: string
  premiumSolutionHeading: (short: string) => string
  premiumWhyHeading: (short: string) => string
  premiumWhyIntro: string
  premiumRealtimeHeading: string
  premiumRealtimeIntro: (short: string) => string
  premiumIndustriesHeadingModule: string
  premiumIndustriesHeadingIndustry: string
  premiumIndustriesDesc: (name: string) => string
  premiumIndustriesNote: string
  premiumImplTitle: (short: string) => string
  premiumImplLead: string
  premiumFaqHeading: string
  premiumDemoHeading: string
  premiumDemoSub: (name: string) => string
  premiumHeroAside: (short: string) => string
  premiumTabWorkflows: string
  premiumTabReports: string
  premiumOutcomePulse: string
  premiumOperationalSignal: string
  premiumChipOps: string
  premiumChipFinance: string
  premiumChipScale: string
  premiumChipControl: string
  premiumChipVisibility: string
  premiumChipEvidence: string
  premiumChipHintLive: string
  premiumChipHintErp: string
  premiumChipHintNow: string
  premiumChipHintAudit: string
  expandFeature: (displayName: string, line: string) => string
  voucherItems: (displayName: string) => SoftwareNamedItem[]
  reportItems: (displayName: string) => SoftwareNamedItem[]
  challenges: (displayName: string) => SoftwareChallengeSolution[]
  whyTail: SoftwareWhyPoint[]
  faqs: (displayName: string, kind: 'module' | 'industry') => SoftwareFaqItem[]
  seoBlocks: (displayName: string, kind: 'module' | 'industry', rich: ModuleRichPage) => SoftwareSeoBlock[]
  implementation: SoftwareImplementationStep[]
  workflowTabOutcomeDesc: string
  workflowTabHighlightDesc: string
}

const EN: SoftwareDetailCopy = {
  lang: 'en',
  metaTitleSuffix: 'DigitalManager Cloud ERP',
  trust: [
    { value: '20+', label: 'Years experience' },
    { value: '1000+', label: 'Clients served' },
    { value: '99%', label: 'Satisfaction' },
    { value: '120+', label: 'Software products' },
  ],
  premiumTrust: [
    { value: '300+', label: 'Happy Clients', icon: 'Users' },
    { value: '99%', label: 'Client Satisfaction', icon: 'BadgeCheck' },
    { value: '✓', label: 'Multinational Company', icon: 'Globe2' },
    { value: '20+', label: 'Years of Experience', icon: 'Clock' },
  ],
  heroEyebrowModule: 'Module',
  heroEyebrowIndustry: 'Industry solution',
  ctaBookDemo: 'Book a demo',
  ctaBrowseModules: 'Browse all modules',
  ctaBrowseIndustries: 'Browse industries',
  ctaLetUsDemo: 'Let Us Demo',
  ctaWhatsApp: 'WhatsApp Now',
  ctaExploreModules: 'Explore ERP modules',
  vouchersTabTitle: 'Vouchers & postings',
  reportsTabTitle: 'Registers & reports',
  vouchersReportsHeading: 'Vouchers, registers, and operational reporting',
  vouchersReportsSubheading:
    'DigitalManager preserves classic ERP strengths—disciplined vouchers and audit-friendly registers—while presenting them in a modern, role-based workspace.',
  whyChooseHeading: (name) => `Why teams choose DigitalManager for ${name}`,
  whyChooseIntro:
    'The combination of product depth, implementation discipline, and long-term support makes DigitalManager a practical choice for organisations that have outgrown fragmented tools. Below are the pillars customers cite during evaluations.',
  realtimeHeading: 'Real-time reporting & operational signals',
  realtimeIntro:
    'Dashboards and registers read live postings—so flash sales, stock movements, and production issues surface immediately instead of after month-end spreadsheets are merged.',
  demoHeading: 'See DigitalManager running with your scenarios',
  demoSub:
    'Share your name and contact number — our consultants respond with a tailored walkthrough plan. WhatsApp is available for quick questions.',
  demoWhatsapp: 'WhatsApp us',
  featurePadSecurityTitle: 'Security, roles, and auditability',
  featurePadSecurityDesc: (name) =>
    `Fine-grained permissions, field-level discipline, and immutable audit trails keep ${name} data trustworthy across departments.`,
  featurePadIntegrationTitle: 'Integration-ready architecture',
  featurePadIntegrationDesc:
    'APIs, file exchange, and monitored jobs connect banks, devices, e-commerce, and regulators without breaking core posting rules.',
  reportBulletOutcome: 'Outcome you can measure',
  reportBulletSignal: 'Operational signal',
  reportBulletCapability: 'Capability',
  premiumFeaturesHeading: (name) => `Key Features of Our ${name}`,
  premiumVouchersEyebrowModule: 'Module depth',
  premiumVouchersEyebrowIndustry: 'Industry programme',
  premiumVouchersHeadingModule: 'Workflows, capabilities & reporting',
  premiumVouchersHeadingIndustry: 'Programme workflows & reporting',
  premiumVouchersSub: (short) =>
    `How DigitalManager encodes ${short} in vouchers, masters, and dashboards — without sacrificing ERP audit discipline.`,
  premiumChallengesHeading: (short) => `Challenges in ${short}`,
  premiumChallengesIntro: (short, host) =>
    `${short} programmes stall when businesses rely on manual records, fragmented spreadsheets, or tools that do not post cleanly into finance. Content aligned with DigitalManager’s positioning on ${host}.`,
  premiumChallengesListLead: 'Common challenges teams describe during evaluations:',
  premiumSolutionHeading: (short) => `DigitalManager ${short} Solution`,
  premiumWhyHeading: (short) => `Why choose DigitalManager for ${short}?`,
  premiumWhyIntro: 'Built for modern enterprises that need speed at the counter and discipline in the ledger.',
  premiumRealtimeHeading: 'Real-time visibility & management signals',
  premiumRealtimeIntro: (short) =>
    `Dashboards and registers read live postings so ${short} exceptions surface early — not only after spreadsheets are merged at month-end.`,
  premiumIndustriesHeadingModule: 'Explore related modules & industries',
  premiumIndustriesHeadingIndustry: 'Related modules & programmes',
  premiumIndustriesDesc: (name) =>
    `Discover adjacent DigitalManager capabilities that pair with ${name} — same security model, shared masters, and consistent reporting across your enterprise.`,
  premiumIndustriesNote: 'Need a tailored workflow or custom module? Our team will align it to your policy pack.',
  premiumImplTitle: (short) => `Implementation of ${short}`,
  premiumImplLead:
    'Consultancy, training, installation, and support — structured so operations, finance, and IT share one rollout playbook.',
  premiumFaqHeading: 'Frequently Asked Questions',
  premiumDemoHeading: 'Request for Demo!',
  premiumDemoSub: (name) =>
    `Share your work email and contact number — we will respond with a tailored walkthrough for ${name}.`,
  premiumHeroAside: (short) =>
    `Cloud ERP for ${short} — live operations, controlled postings, and analytics your board can trust.`,
  premiumTabWorkflows: 'Workflows & capabilities',
  premiumTabReports: 'Reports & insights',
  premiumOutcomePulse: 'Outcome pulse',
  premiumOperationalSignal: 'Operational signal',
  premiumChipOps: 'Operations',
  premiumChipFinance: 'Finance',
  premiumChipScale: 'Scale',
  premiumChipControl: 'Control',
  premiumChipVisibility: 'Visibility',
  premiumChipEvidence: 'Evidence',
  premiumChipHintLive: 'Live',
  premiumChipHintErp: 'ERP',
  premiumChipHintNow: 'Now',
  premiumChipHintAudit: 'Audit',
  expandFeature: (displayName, line) =>
    `${line} Within DigitalManager ${displayName}, this capability is modelled with configurable masters, maker–checker where you need it, and drill-down to vouchers so auditors and branch managers see the same numbers. Operational events post in real time, which reduces month-end surprises and keeps leadership dashboards trustworthy without manual consolidation.`,
  voucherItems: (displayName) => [
    { name: 'Payment voucher', description: `Records supplier, expense, and statutory payouts with bank/cash ledgers, tax lines, and cost dimensions. Tied to approvals so ${displayName} spend stays inside policy.` },
    { name: 'Receipt voucher', description: 'Customer collections, internal transfers, and other inflows with clear allocation to invoices or advances.' },
    { name: 'Journal voucher', description: 'Accruals, reclasses, and period adjustments with narratives, attachments, and reversal pairs when required.' },
    { name: 'Contra / transfer', description: 'Inter-account and inter-branch transfers with balanced entries and audit-friendly sequencing.' },
    { name: 'Bank reconciliation', description: 'Match statement lines to posted instruments, flag timing differences, and close exceptions with notes.' },
    { name: 'Sales & billing', description: 'Links to AR, stock, and tax so counter or field sales do not duplicate finance entry.' },
    { name: 'Purchase / GRN', description: 'Three-way alignment between PO, receipt, and invoice for clean payables and landed cost.' },
    { name: 'Stock adjustment', description: 'Controlled write-ups/down with reason codes, attachments, and sign-off before GL impact.' },
    { name: 'Payroll journal', description: 'Employer charges and net pay split across cost centres with export packs for banks.' },
    { name: 'Production / WIP', description: 'Issues, receipts, and overhead absorption when manufacturing or job costing is enabled.' },
  ],
  reportItems: (displayName) => [
    { name: 'Trial balance & ledgers', description: `Period snapshots with drill to voucher and document for ${displayName} — ideal for auditors and HQ reviews.` },
    { name: 'Aging AR / AP', description: 'Buckets, credit exposure, and dispute notes with export to Excel/PDF for collections teams.' },
    { name: 'Stock valuation & movement', description: 'FIFO/average views, branch comparison, and slow-mover lists aligned to finance COGS.' },
    { name: 'Cash & bank books', description: 'Day books, projected cash, and float tracking for treasury and branch managers.' },
    { name: 'Profitability slices', description: 'Margin by product, branch, salesperson, or project where dimensions are maintained.' },
    { name: 'Tax / compliance registers', description: 'Configurable registers for filing cycles; pairs with digital invoicing where deployed.' },
    { name: 'Executive dashboards', description: 'Role-based KPI tiles with thresholds and scheduled email packs for leadership cadence.' },
    { name: 'Audit trail extracts', description: 'User, time, and before/after context for sensitive masters and postings.' },
    { name: 'Operational daybooks', description: 'POS/shift, production, or logistics activity summarized for supervisors.' },
    { name: 'Budget vs actual', description: 'Variance commentary hooks for finance business partners and budget owners.' },
  ],
  challenges: (displayName) => [
    { challenge: 'Spreadsheets and side systems disagree with finance after week two of every month.', solution: `DigitalManager ${displayName} keeps operational and financial truth on one timeline with voucher traceability and branch-aware dimensions.` },
    { challenge: 'Approvals live in chat threads, so policy breaches are discovered late.', solution: 'Configurable maker–checker, amount thresholds, and exception queues replace informal sign-offs.' },
    { challenge: 'Audits require weeks of evidence gathering from PDFs and emails.', solution: 'Drill from statement lines to source documents, attachments, and user actions with exportable packs.' },
    { challenge: 'Scaling to new branches breaks item and tax masters.', solution: 'Central governance of masters with branch overrides where you explicitly allow them.' },
    { challenge: 'Leadership dashboards are rebuilt manually for every board meeting.', solution: 'Saved views, subscriptions, and KPI thresholds tied to the same ledger operations teams use daily.' },
    { challenge: 'Training new hires on legacy screens slows every rollout.', solution: 'Role-based navigation, documented playbooks, and DigitalManager implementation services for structured enablement.' },
  ],
  whyTail: [
    { title: 'Implementation depth from DigitalSofts', body: 'Since 2004 DigitalSofts has delivered business-specific software worldwide; DigitalManager packages that experience into ERP modules with upgrade-safe patterns.' },
    { title: 'Cloud operations without losing control', body: 'Encryption, backups, and layered access keep sensitive financial and HR data governed while staying accessible to authorised roles.' },
  ],
  faqs: (displayName, kind) => {
    const scope = kind === 'module' ? 'module' : 'industry programme'
    return [
      { q: `Does DigitalManager ${displayName} support multiple branches?`, a: `Yes. You can operate a central chart of accounts with branch dimensions, inter-branch transfers, and consolidated reporting while keeping local operational autonomy where policy allows. The ${scope} inherits the same security and voucher model across sites.` },
      { q: 'Can we start with a subset of users and expand later?', a: 'Typical rollouts begin with power users in finance and operations, then widen roles after parallel-run sign-off. Licensing and roles are structured so you can expand without re-implementing core masters.' },
      { q: 'How does DigitalManager handle statutory or tax changes?', a: 'Tax templates, registers, and digital invoicing connectors are updated on a cadence aligned to regulatory guidance in your region. Your team validates mappings before go-live and during return cycles.' },
      { q: 'What integrations are common with this area?', a: 'Banks, biometric devices, e-commerce carts, and regulator endpoints are frequent. DigitalManager integration services map payloads, retries, and monitoring so failures are visible to IT—not silent.' },
      { q: 'Is training included for new hires?', a: 'Yes. Implementation packages include structured training, quick-reference cards, and admin workshops so operational teams own day-two changes without opening tickets for every small tweak.' },
      { q: 'How are upgrades handled?', a: 'Upgrades preserve configuration where possible, with release notes and sandbox validation for critical finance and stock scenarios before production promotion.' },
      { q: 'Can we keep historical data from a legacy ERP?', a: 'Opening balances, stock counts, and AR/AP snapshots can be imported with validation reports. Parallel running is recommended until cut-over KPIs are met.' },
      { q: 'What support channels exist after go-live?', a: 'Named support tiers, ticketing, and remote sessions are available. Severity-based SLAs apply according to your service agreement.' },
      { q: `How long does a typical ${displayName} rollout take?`, a: 'Duration depends on branch count, data cleanliness, and integrations. A focused single-entity rollout may take weeks; multi-branch programmes may take longer with phased cutovers.' },
      { q: 'Is Arabic or bilingual UI supported?', a: 'DigitalManager supports bilingual experiences across navigation and key screens where enabled for your tenant, subject to configuration.' },
    ]
  },
  seoBlocks: (displayName, kind, rich) => {
    const k = kind === 'module' ? 'ERP module' : 'industry ERP programme'
    return [
      { heading: `${displayName} on DigitalManager — enterprise cloud ${k}`, level: 2, paragraphs: [`${rich.intro} DigitalManager is developed by DigitalSofts Pvt. Ltd., delivering business software since 2004 with a multinational client base and high satisfaction benchmarks.`, `When organisations modernise ${displayName}, they need disciplined vouchers, stock valuation finance trusts, and reporting that survives audits.`] },
      { heading: `Functional depth for ${displayName}`, level: 2, paragraphs: [`${rich.subhead} Capabilities span ${rich.capabilities.map((c) => c.title).join(', ')}.`, `Outcomes we target include: ${rich.outcomes.join(' · ')}.`] },
      { heading: 'Vouchers, registers, and evidence chains', level: 3, paragraphs: ['DigitalManager treats vouchers as the atomic unit of business truth.', 'Registers for tax, stock, and HR statutory reporting roll up from the same postings.'] },
      { heading: 'Deployment, training, and long-term success', level: 3, paragraphs: ['Rollouts follow a blueprinted approach: discovery, master data alignment, pilot parallel run, cutover, and hypercare.', 'Post go-live, support and managed monitoring help you absorb regulatory changes and new branches.'] },
      { heading: 'Why businesses choose DigitalManager (DigitalSofts)', level: 2, paragraphs: [`DigitalSofts serves 1000+ clients with a 99% satisfaction track record. If you are evaluating DigitalManager for ${displayName}, request a tailored demo.`] },
    ]
  },
  implementation: [
    { icon: 'Compass', title: 'Consultancy & blueprint', description: 'We map your processes, entities, tax profile, and integrations to DigitalManager modules.' },
    { icon: 'GraduationCap', title: 'Training & change management', description: 'Role-based workshops, quick-reference guides, and admin certification for month-end routines.' },
    { icon: 'Download', title: 'Software installation & configuration', description: 'Tenant provisioning, master imports, voucher templates, and integration endpoints in sandbox first.' },
    { icon: 'Headphones', title: 'Go-live support', description: 'Hypercare window with named consultants and optimisation sprints after stabilisation.' },
  ],
  workflowTabOutcomeDesc: 'Surfaced in DigitalManager dashboards, registers, and scheduled leadership packs.',
  workflowTabHighlightDesc: 'Tied to live postings so finance and operations share one version of the truth.',
}

const AR: SoftwareDetailCopy = {
  lang: 'ar',
  metaTitleSuffix: 'ديجيتال مانجر ERP سحابي',
  trust: [
    { value: '+20', label: 'سنة خبرة' },
    { value: '+1000', label: 'عميل' },
    { value: '99%', label: 'رضا العملاء' },
    { value: '+120', label: 'منتج برمجي' },
  ],
  premiumTrust: [
    { value: '+300', label: 'عميل سعيد', icon: 'Users' },
    { value: '99%', label: 'رضا العملاء', icon: 'BadgeCheck' },
    { value: '✓', label: 'شركة متعددة الجنسيات', icon: 'Globe2' },
    { value: '+20', label: 'سنة خبرة', icon: 'Clock' },
  ],
  heroEyebrowModule: 'وحدة برمجية',
  heroEyebrowIndustry: 'حل قطاعي',
  ctaBookDemo: 'احجز عرضاً',
  ctaBrowseModules: 'تصفح كل الوحدات',
  ctaBrowseIndustries: 'تصفح القطاعات',
  ctaLetUsDemo: 'اطلب عرضاً',
  ctaWhatsApp: 'واتساب الآن',
  ctaExploreModules: 'استكشف وحدات ERP',
  vouchersTabTitle: 'القيود والترحيل',
  reportsTabTitle: 'السجلات والتقارير',
  vouchersReportsHeading: 'القيود والسجلات والتقارير التشغيلية',
  vouchersReportsSubheading:
    'يحافظ ديجيتال مانجر على قوة ERP الكلاسيكية — قيود منضبطة وسجلات صديقة للتدقيق — في واجهة حديثة حسب الأدوار.',
  whyChooseHeading: (name) => `لماذا تختار الفرق ديجيتال مانجر لـ ${name}`,
  whyChooseIntro:
    'يجمع العمق الوظيفي وانضباط التنفيذ والدعم طويل الأمد خياراً عملياً للمنشآت التي تجاوزت الأدوات المتفرقة. فيما يلي أبرز ما يذكره العملاء أثناء التقييم.',
  realtimeHeading: 'تقارير لحظية وإشارات تشغيلية',
  realtimeIntro:
    'تقرأ لوحات المعلومات والسجلات الترحيلات المباشرة — لتظهر المبيعات والمخزون والإنتاج فوراً بدلاً من انتظار دمج الجداول بعد إقفال الشهر.',
  demoHeading: 'شاهد ديجيتال مانجر على سيناريوهاتك',
  demoSub: 'شارك اسمك ورقم التواصل — يرد مستشارونا بخطة جولة مخصصة. واتساب متاح للأسئلة السريعة.',
  demoWhatsapp: 'راسلنا على واتساب',
  featurePadSecurityTitle: 'الأمان والأدوار وقابلية التدقيق',
  featurePadSecurityDesc: (name) =>
    `صلاحيات دقيقة ومسارات تدقيق تحافظ على موثوقية بيانات ${name} بين الأقسام.`,
  featurePadIntegrationTitle: 'جاهزية للتكامل',
  featurePadIntegrationDesc:
    'واجهات وتبادل ملفات ومهام مراقبة تربط البنوك والأجهزة والتجارة الإلكترونية والجهات التنظيمية دون كسر قواعد الترحيل.',
  reportBulletOutcome: 'نتيجة قابلة للقياس',
  reportBulletSignal: 'إشارة تشغيلية',
  reportBulletCapability: 'قدرة',
  premiumFeaturesHeading: (name) => `أهم ميزات ${name}`,
  premiumVouchersEyebrowModule: 'عمق الوحدة',
  premiumVouchersEyebrowIndustry: 'برنامج قطاعي',
  premiumVouchersHeadingModule: 'سير العمل والقدرات والتقارير',
  premiumVouchersHeadingIndustry: 'سير البرنامج والتقارير',
  premiumVouchersSub: (short) =>
    `كيف يُرمّز ديجيتال مانجر ${short} في القيود والأساسيات ولوحات المعلومات — دون التضحية بانضباط التدقيق.`,
  premiumChallengesHeading: (short) => `تحديات في ${short}`,
  premiumChallengesIntro: (short, host) =>
    `تتعثر برامج ${short} عند الاعتماد على سجلات يدوية أو جداول متفرقة أو أدوات لا ترحّل بانضباط إلى المالية. محتوى متوافق مع موقع ${host}.`,
  premiumChallengesListLead: 'تحديات شائعة يذكرها الفريق أثناء التقييم:',
  premiumSolutionHeading: (short) => `حل ديجيتال مانجر لـ ${short}`,
  premiumWhyHeading: (short) => `لماذا ديجيتال مانجر لـ ${short}؟`,
  premiumWhyIntro: 'مبني للمؤسسات الحديثة التي تحتاج سرعة عند نقطة البيع وانضباطاً في الدفتر.',
  premiumRealtimeHeading: 'رؤية لحظية وإشارات إدارية',
  premiumRealtimeIntro: (short) =>
    `تقرأ اللوحات والسجلات الترحيلات المباشرة لتظهر استثناءات ${short} مبكراً — لا بعد دمج الجداول في نهاية الشهر.`,
  premiumIndustriesHeadingModule: 'وحدات وقطاعات ذات صلة',
  premiumIndustriesHeadingIndustry: 'وحدات وبرامج ذات صلة',
  premiumIndustriesDesc: (name) =>
    `اكتشف قدرات ديجيتال مانجر المجاورة التي تُكمّل ${name} — نفس نموذج الأمان والأساسيات المشتركة والتقارير الموحدة.`,
  premiumIndustriesNote: 'تحتاج سير عمل مخصصاً أو وحدة خاصة؟ نُوائمها مع حزمة السياسات لديك.',
  premiumImplTitle: (short) => `تنفيذ ${short}`,
  premiumImplLead: 'استشارات وتدريب وتركيب ودعم — بخطة واحدة للعمليات والمالية وتقنية المعلومات.',
  premiumFaqHeading: 'الأسئلة الشائعة',
  premiumDemoHeading: 'اطلب عرضاً!',
  premiumDemoSub: (name) => `شارك بريد العمل ورقم التواصل — نرد بجولة مخصصة لـ ${name}.`,
  premiumHeroAside: (short) =>
    `ERP سحابي لـ ${short} — عمليات مباشرة وترحيل منضبط وتحليلات تثق بها الإدارة.`,
  premiumTabWorkflows: 'سير العمل والقدرات',
  premiumTabReports: 'التقارير والرؤى',
  premiumOutcomePulse: 'نبض النتائج',
  premiumOperationalSignal: 'إشارة تشغيلية',
  premiumChipOps: 'العمليات',
  premiumChipFinance: 'المالية',
  premiumChipScale: 'التوسع',
  premiumChipControl: 'الضبط',
  premiumChipVisibility: 'الرؤية',
  premiumChipEvidence: 'الأدلة',
  premiumChipHintLive: 'مباشر',
  premiumChipHintErp: 'ERP',
  premiumChipHintNow: 'الآن',
  premiumChipHintAudit: 'تدقيق',
  expandFeature: (displayName, line) =>
    `${line} ضمن ديجيتال مانجر ${displayName}، قدرة قابلة للضبط مع صانع-مدقق وتتبع حتى القيود ليرى المدققون والفروع نفس الأرقام. الأحداث التشغيلية تُرحّل مباشرة لتقليل مفاجآت إقفال الشهر.`,
  voucherItems: (displayName) => [
    { name: 'سند صرف', description: `مدفوعات موردين ومصروفات وضرائب مع دفاتر بنك/نقد وأبعاد تكلفة — مربوطة بالموافقات لإنفاق ${displayName}.` },
    { name: 'سند قبض', description: 'تحصيلات عملاء وتحويلات داخلية وتدفقات أخرى مع تخصيص واضح للفواتير أو السلف.' },
    { name: 'قيد يومية', description: 'استحقاقات وإعادة تصنيف وتسويات فترة مع مرفقات وأزواج عكس عند الحاجة.' },
    { name: 'تحويل / مقاصة', description: 'تحويلات بين حسابات أو فروع بقيود متوازنة وتسلسل مناسب للتدقيق.' },
    { name: 'مطابقة بنكية', description: 'مطابقة كشف الحساب مع الأدوات المسجلة وإغلاق الفروقات بملاحظات.' },
    { name: 'مبيعات وفوترة', description: 'ربط بالذمم المدينة والمخزون والضريبة دون إدخال مزدوج للمالية.' },
    { name: 'شراء / استلام', description: 'مطابقة ثلاثية بين أمر الشراء والاستلام والفاتورة للذمم الدائنة وتكلفة الشحن.' },
    { name: 'تسوية مخزون', description: 'زيادات/نقص بأكواد أسباب وموافقات قبل أثر الدفتر.' },
    { name: 'قيد رواتب', description: 'أعباء صاحب العمل وصافي الأجر موزعة على مراكز التكلفة مع ملفات للبنوك.' },
    { name: 'إنتاج / أعمال جارية', description: 'صرف واستلام واستيعاب أعباء عند تفعيل التصنيع أو تكلفة الأوامر.' },
  ],
  reportItems: (displayName) => [
    { name: 'ميزان المراجعة والدفاتر', description: `لقطات فترة مع تتبع حتى القيد والمستند لـ ${displayName}.` },
    { name: 'أعمار الذمم مدينة/دائنة', description: 'شرائح وتعرض ائتماني وملاحظات نزاع مع تصدير.' },
    { name: 'تقييم وحركة المخزون', description: 'FIFO/متوسط ومقارنة فروع وقوائم بطيئة الحركة متوافقة مع تكلفة البضاعة.' },
    { name: 'دفاتر النقد والبنك', description: 'يوميات وتدفق نقدي متوقع ومتابعة عهدة للخزينة والفروع.' },
    { name: 'شرائح الربحية', description: 'هامش حسب منتج أو فرع أو مندوب أو مشروع عند صيانة الأبعاد.' },
    { name: 'سجلات ضريبة/امتثال', description: 'سجلات قابلة للضبط لدورات الإقرار مع الفوترة الرقمية حيث مُفعّلة.' },
    { name: 'لوحات تنفيذية', description: 'مؤشرات حسب الدور وحدود وتقارير مجدولة للإدارة.' },
    { name: 'استخراجات مسار التدقيق', description: 'مستخدم ووقت وسياق قبل/بعد للأساسيات والترحيلات الحساسة.' },
    { name: 'يوميات تشغيلية', description: 'ملخص ورديات نقطة بيع أو إنتاج أو لوجستيات للمشرفين.' },
    { name: 'موازنة مقابل فعلي', description: 'تعليقات تباين لشركاء المالية وأصحاب الموازنة.' },
  ],
  challenges: (displayName) => [
    { challenge: 'تختلف الجداول والأنظمة الجانبية عن المالية بعد الأسبوع الثاني من كل شهر.', solution: `ديجيتال مانجر ${displayName} يوحّد الحقيقة التشغيلية والمالية بمسار قيود وأبعاد فروع.` },
    { challenge: 'الموافقات في المحادثات، فتُكتشف مخالفات السياسة متأخراً.', solution: 'صانع-مدقق وحدود مبالغ وقوائم استثناءات بدلاً من الموافقات غير الرسمية.' },
    { challenge: 'التدقيق يستغرق أسابيع لجمع الأدلة من PDF والبريد.', solution: 'تتبع من البيان إلى المستند والمرفقات وإجراءات المستخدم مع حزم تصدير.' },
    { challenge: 'توسيع الفروع يكسر سجل الأصناف والضرائب.', solution: 'حوكمة مركزية للأساسيات مع تجاوزات فرعية حيث تسمح السياسة.' },
    { challenge: 'لوحات الإدارة تُعاد يدوياً لكل اجتماع.', solution: 'عروض محفوظة واشتراكات وعتبات مرتبطة بنفس الترحيلات اليومية.' },
    { challenge: 'تدريب الموظفين الجدد على شاشات قديمة يبطئ كل إطلاق.', solution: 'تنقل حسب الدور وأدلة وتنفيذ منظم من ديجيتال مانجر.' },
  ],
  whyTail: [
    { title: 'عمق التنفيذ من DigitalSofts', body: 'منذ 2004 تقدّم DigitalSofts برمجيات أعمال عالمياً؛ ديجيتال مانجر يعبئ ذلك في وحدات ERP قابلة للترقية.' },
    { title: 'سحابة دون فقدان السيطرة', body: 'تشفير ونسخ احتياطي وصلاحيات طبقية تحمي البيانات الحساسة مع إتاحتها للأدوار المصرح بها.' },
  ],
  faqs: (displayName, kind) => {
    const scope = kind === 'module' ? 'الوحدة' : 'البرنامج القطاعي'
    return [
      { q: `هل يدعم ديجيتال مانجر ${displayName} عدة فروع؟`, a: `نعم. دليل حسابات مركزي مع أبعاد فروع وتحويلات وتقارير موحدة مع استقلالية تشغيلية حيث تسمح السياسة. ${scope} يستخدم نفس نموذج الأمان والقيود.` },
      { q: 'هل يمكن البدء بعدد محدود من المستخدمين؟', a: 'غالباً يبدأ التنفيذ بمستخدمي مالية وعمليات ثم يتوسع بعد التشغيل المتوازي.' },
      { q: 'كيف يتعامل النظام مع تغييرات الضرائب؟', a: 'قوالب ضريبة وسجلات وموصلات فوترة رقمية تُحدَّث وفق التوجيهات؛ فريقكم يتحقق قبل الإطلاق.' },
      { q: 'ما التكاملات الشائعة؟', a: 'بنوك وأجهزة بصمة وسلال تجارة إلكترونية ونقاط جهات تنظيمية — مع مراقبة للأعطال.' },
      { q: 'هل التدريب مشمول؟', a: 'نعم. حزم التنفيذ تشمل تدريباً منظماً وبطاقات مرجعية وورش إدارة.' },
      { q: 'كيف تُدار الترقيات؟', a: 'الترقيات تحافظ على الإعداد حيث أمكن مع ملاحظات إصدار واختبار في بيئة تجريبية.' },
      { q: 'هل يمكن نقل بيانات ERP قديم؟', a: 'أرصدة افتتاحية وجرد وذمم يمكن استيرادها مع تقارير تحقق؛ يُنصح بالتشغيل المتوازي.' },
      { q: 'ما قنوات الدعم بعد الإطلاق؟', a: 'تذاكر وجلسات عن بُعد ومستويات خدمة حسب الاتفاق.' },
      { q: `كم يستغرق تنفيذ ${displayName} عادةً؟`, a: 'يعتمد على عدد الفروع ونظافة البيانات والتكاملات — من أسابيع لكيان واحد إلى مراحل لعدة فروع.' },
      { q: 'هل الواجهة العربية مدعومة؟', a: 'ديجيتال مانجر يدعم تجربة ثنائية اللغة في التنقل والشاشات الرئيسية عند التفعيل.' },
    ]
  },
  seoBlocks: (displayName, kind, rich) => {
    const k = kind === 'module' ? 'وحدة ERP' : 'برنامج ERP قطاعي'
    return [
      { heading: `${displayName} على ديجيتال مانجر — ${k} سحابي للمؤسسات`, level: 2, paragraphs: [rich.intro, 'ديجيتال مانجر من DigitalSofts منذ 2004 — قاعدة عملاء متعددة الجنسيات ورضا عالٍ.'] },
      { heading: `عمق وظيفي لـ ${displayName}`, level: 2, paragraphs: [`${rich.subhead} القدرات تشمل: ${rich.capabilities.map((c) => c.title).join('، ')}.`, `النتائج المستهدفة: ${rich.outcomes.join(' · ')}.`] },
      { heading: 'القيود والسجلات وسلاسل الأدلة', level: 3, paragraphs: ['القيود وحدة الحقيقة التجارية في ديجيتال مانجر.', 'سجلات الضريبة والمخزون والموارد البشرية تُجمَّع من نفس الترحيلات.'] },
      { heading: 'النشر والتدريب والنجاح طويل الأمد', level: 3, paragraphs: ['اكتشاف ومواءمة أساسيات وتشغيل متوازٍ وإطلاق ودعم مكثف.', 'بعد الإطلاق: دعم ومراقبة لاستيعاب التغييرات التنظيمية والفروع الجديدة.'] },
      { heading: 'لماذا يختار العملاء ديجيتال مانجر', level: 2, paragraphs: [`إذا تقيّمون ${displayName}، اطلبوا عرضاً مخصصاً بسيناريوهاتكم الفعلية.`] },
    ]
  },
  implementation: [
    { icon: 'Compass', title: 'استشارات ومخطط', description: 'نرسم العمليات والكيانات والضرائب والتكاملات على وحدات ديجيتال مانجر.' },
    { icon: 'GraduationCap', title: 'تدريب وإدارة تغيير', description: 'ورش حسب الدور وأدلة مرجعية وشهادة مسؤولي النظام.' },
    { icon: 'Download', title: 'تركيب وإعداد', description: 'تجهيز المستأجر واستيراد الأساسيات وقوالب القيود في بيئة تجريبية أولاً.' },
    { icon: 'Headphones', title: 'دعم الإطلاق', description: 'نافذة دعم مكثف مع مستشارين مسماة وتحسين بعد الاستقرار.' },
  ],
  workflowTabOutcomeDesc: 'تظهر في لوحات ديجيتال مانجر والسجلات وتقارير الإدارة المجدولة.',
  workflowTabHighlightDesc: 'مرتبطة بترحيلات مباشرة ليتشارك التشغيل والمالية نفس الحقيقة.',
}

export function getSoftwareDetailCopy(lang: Lang): SoftwareDetailCopy {
  return lang === 'ar' ? AR : EN
}
