import { megaIndustryLabel } from '../../i18n/megaLabels'
import { getSoftwareDetailCopy } from '../../i18n/softwareDetailCopy'
import { moduleRichPagesAr } from '../moduleRichPagesAr'
import type { SoftwareDetailPageData } from './types'

const v = (name: string, description: string) => ({ name, description })
const REPORT_SUB = 'حسب التاريخ، الحساب، البنك'

const INDUSTRY_LINKS: { slug: string; labelEn: string }[] = [
  { slug: 'oil-and-gas-business-management-software', labelEn: 'Oil and Gas' },
  { slug: 'cloud-erp-software-for-textile-industries', labelEn: 'Textile' },
  { slug: 'garments-manufacturing-software', labelEn: 'Manufacturing' },
  { slug: 'logistics-transportation-software', labelEn: 'Logistics and Transportation' },
  { slug: 'hospitality-management-software', labelEn: 'Hospitality' },
  { slug: 'erp-software-for-construction-business', labelEn: 'Construction' },
  { slug: 'erp-software-for-real-estate-business', labelEn: 'Real Estate' },
  { slug: 'small-and-medium-business-erp-software', labelEn: 'Small and Medium Businesses' },
]

export function buildAccountsManagementSoftwareDetailAr(): SoftwareDetailPageData {
  const copy = getSoftwareDetailCopy('ar')
  const rich = moduleRichPagesAr['accounts-management-software']
  const displayName = 'برنامج إدارة الحسابات'

  return {
    metaTitle: `${displayName} | ${copy.metaTitleSuffix}`,
    metaDescription:
      'أتمتة مسك الدفاتر وتتبع المدفوعات وتبسيط الامتثال مع ديجيتال مانجر — إدارة مالية متكاملة مع نقطة البيع والمخزون والتقارير الضريبية.',
    accounts: {
      layout: 'accounts-management',
      featuresHeading: 'أهم ميزات برنامج إدارة الحسابات',
      featuresLead:
        'ضوابط مالية مبنية لمحاسبة القيد المزدوج وهيكل متعدد الشركات وحزم تقارير يطلبها المدققون ومجلس الإدارة.',
      vouchersSectionEyebrow: 'المحاسبة الأساسية',
      challengesHeading: 'تحديات في الحسابات',
      challengeBullets: [
        'أخطاء مسك الدفاتر اليدوي',
        'صعوبة تتبع الذمم المدينة والدائنة',
        'تأخر التقارير المالية',
        'سجلات شيكات مؤجلة ناقصة',
        'ضعف رؤية التدفق النقدي',
        'ضعف ضبط المصروفات',
        'لا توجد صورة أرباح وخسائر لحظية',
        'صعوبة إدارة فروع أو شركات متعددة',
        'نقص ضبط الموافقات والمستخدمين',
        'مشكلات امتثال وتدقيق',
      ],
      solutionHeading: 'الحل',
      solutionParagraphs: [
        'يحل برنامج إدارة الحسابات في ديجيتال مانجر هذه المشكلات بربط القيود والدفاتر والبنوك والنقد والذمم والتقارير المالية في نظام ERP واحد.',
        'يوفر رؤية محاسبية لحظية، يقلل الأخطاء اليدوية، يحسّن الضبط المالي، ويساعد الإدارة على قرارات أفضل.',
      ],
      challengesIntro:
        'تصبح إدارة الحسابات صعبة عند الاعتماد على سجلات يدوية أو جداول أو أنظمة غير متصلة.',
      challengesListLead: 'تحديات محاسبية شائعة تشمل:',
      heroChips: [
        { label: 'الذمم المدينة', value: 'أعمار AR', hint: 'لحظي' },
        { label: 'الذمم الدائنة', value: 'AP وشيكات', hint: 'منضبط' },
        { label: 'النقد والبنك', value: 'سيولة', hint: 'دفتر مباشر' },
      ],
      industriesSection: {
        heading: 'القطاعات التي نخدمها',
        description:
          'برنامجنا المحاسبي يدعم قطاعات متعددة بسير عمل مالي مرن وتقارير مخصصة وضوابط محاسبية حسب القطاع.',
        items: INDUSTRY_LINKS.map(({ slug, labelEn }) => ({
          label: megaIndustryLabel('ar', slug, labelEn),
          to: `/software/industry/${slug}`,
        })),
        note: 'تحتاج وحدة مخصصة؟ سنُوائمها مع سير عملك.',
      },
      implementationSectionTitle: 'تنفيذ برنامج الحسابات',
      implementationSectionLead:
        'إطلاق منظم ليشارك المالية والعمليات وتقنية المعلومات نفس خطة التنفيذ من الاكتشاف حتى الدعم المكثف.',
      faqSectionHeading: 'الأسئلة الشائعة',
      demoFormVariant: 'email-phone',
      demoSendButtonLabel: 'إرسال',
      heroAsideCaption: 'محاسبة سحابية وذمم مدينة/دائنة وتحليلات مالية مباشرة — في ERP واحد.',
    },
    hero: {
      eyebrow: 'وحدة الحسابات',
      headline: rich?.headline ?? 'حسابات سحابية تمنح وضوحاً مالياً',
      subhead: rich?.subhead ?? 'أتمتة مسك الدفاتر. تتبع المدفوعات. تبسيط الامتثال.',
      intro:
        rich?.intro ??
        'حل إدارة مالية شامل لتجزئة وتصنيع وخدمات والمزيد — متكامل مع نقطة البيع والمخزون والتقارير الضريبية.',
      trust: [...copy.premiumTrust],
      ctaPrimary: { label: copy.ctaLetUsDemo, to: '/contact#contact-form' },
      ctaSecondary: { label: copy.ctaExploreModules, to: '/#modules' },
    },
    features: [
      {
        icon: 'Scale',
        title: 'نظام القيد المزدوج',
        description: 'دقة مالية مع محاسبة قيد مزدوج آلي لكل معاملة.',
      },
      {
        icon: 'GitBranch',
        title: 'دليل حسابات متعدد المستويات',
        description: 'هيكل دفتر أستاذ عام مع مجموعات وحسابات تفصيلية.',
      },
      {
        icon: 'CalendarDays',
        title: 'إدارة الشيكات المؤجلة',
        description: 'إصدار واستلام ومتابعة الشيكات المؤجلة مع تواريخ الاستحقاق والتحصيل.',
      },
      {
        icon: 'Building2',
        title: 'دعم شركات متعددة',
        description: 'إدارة أعمال أو فروع متعددة بتقارير وضوابط منفصلة من لوحة واحدة.',
      },
      {
        icon: 'Shield',
        title: 'صلاحيات مستخدمين وأدوار',
        description: 'أمان البيانات بصلاحيات على مستوى المستخدم والموافقات.',
      },
      {
        icon: 'PieChart',
        title: 'تقارير مالية شاملة',
        description: 'دفاتر وميزان مراجعة وقائمة مركز مالي وأرباح وخسائر وتدفقات وذمم.',
      },
      {
        icon: 'Library',
        title: 'بدون دفاتر يدوية',
        description: 'رقمنة دفاتر العملاء والموردين والنقد والبنك والمصروفات.',
      },
    ],
    vouchersReports: {
      heading: 'القيود والتقارير المالية',
      subheading: 'نطاق المعاملات والتقارير في وحدة الحسابات — متوافق مع دفتر العمليات.',
      tabs: [
        {
          id: 'transactions',
          title: 'المعاملات',
          items: [
            v('دليل الحسابات', ''),
            v('قيد الأرصدة الافتتاحية', ''),
            v('سند صرف نقدي', ''),
            v('سند قبض نقدي', ''),
            v('سند صرف بنكي', ''),
            v('سند قبض بنكي', ''),
            v('قيد إصدار شيك مؤجل', ''),
            v('قيد استلام شيك مؤجل', ''),
            v('إشعار مدين', ''),
            v('إشعار دائن', ''),
            v('قيد يومية عام', ''),
          ],
        },
        {
          id: 'reporting',
          title: 'التقارير',
          items: [
            v('دفتر الحساب', REPORT_SUB),
            v('تقارير الصرف النقدي', REPORT_SUB),
            v('تقارير القبض النقدي', REPORT_SUB),
            v('تقارير الصرف البنكي', REPORT_SUB),
            v('تقارير القبض البنكي', REPORT_SUB),
            v('تقارير إصدار الشيكات', REPORT_SUB),
            v('تقارير استلام الشيكات', REPORT_SUB),
            v('تقارير الشيكات في اليد', REPORT_SUB),
            v('دفتر اليومية', REPORT_SUB),
            v('قائمة التدفقات النقدية', REPORT_SUB),
            v('تقارير المصروفات', REPORT_SUB),
            v('تقارير الدائنة', REPORT_SUB),
            v('تقارير المدينة', REPORT_SUB),
            v('تقرير أعمار الفواتير', REPORT_SUB),
            v('كشف أعمار المدينين', REPORT_SUB),
            v('كشف أعمار الدائنين', REPORT_SUB),
            v('ميزان مراجعة عمودان', REPORT_SUB),
            v('ميزان مراجعة 6 أعمدة', REPORT_SUB),
            v('إيضاحات الأرباح والخسائر', REPORT_SUB),
            v('تقرير الأرباح والخسائر', REPORT_SUB),
            v('الميزانية العمومية', REPORT_SUB),
            v('إيضاحات الميزانية', REPORT_SUB),
          ],
        },
      ],
    },
    challengesSolutions: [],
    whyChoose: {
      heading: 'لماذا برنامجنا المحاسبي؟',
      intro:
        'مبني للأعمال الحديثة في باكستان — أتمتة ذكية وتقارير دقيقة وضبط مالي كامل بدلاً من العمل اليدوي.',
      points: [
        {
          title: 'سحابي 100%',
          body: 'الوصول لنظام المحاسبة من أي مكان بأمان.',
        },
        {
          title: 'بدون جداول وأخطاء يدوية',
          body: 'تقليل الأخطاء اليومية بترحيل قيود وتحديث دفاتر آلي.',
        },
        {
          title: 'لأعمال باكستان',
          body: 'شيكات مؤجلة وقيود نقد/بنك وذمم وتقارير ضريبية محلية.',
        },
      ],
    },
    realtimeReports: {
      heading: 'تقارير مالية لحظية',
      intro:
        'ابقَ على اطلاع بماليتك بتقارير لحظية للنقد والبنك والعملاء والموردين والمصروفات والربحية.',
      bullets: [
        { title: 'ميزان مراجعة بعمودين و6 أعمدة', text: 'جاهز لإقفال الفترة للمالية والمدققين.' },
        { title: 'قائمة أرباح وخسائر لحظية', text: 'إيرادات وتكاليف مباشرة دون دمج خارجي.' },
        { title: 'ميزانية محدثة', text: 'أصول والتزامات وحقوق ملكية مع تتبع للجداول.' },
        {
          title: 'أعمار مدينين ودائنين',
          text: 'شرائح قابلة للتنفيذ مع متابعة التحصيل.',
        },
        { title: 'تقارير إدارة الشيكات', text: 'تقويم استحقاق واستثناءات التحصيل.' },
        { title: 'قائمة تدفقات نقدية', text: 'توقع مقابل فعلي مع تعليقات.' },
        { title: 'تتبع المصروفات وتحليل التكلفة', text: 'شرائح قسم ومشروع للهامش.' },
        { title: 'دفاتر وقيود محدثة', text: 'قوائم استثناء وانضباط عكس.' },
      ],
    },
    related: [],
    implementation: copy.implementation,
    demoCta: {
      heading: copy.premiumDemoHeading,
      sub: 'شارك بريدك ورقم التواصل — نرد بجولة مخصصة لدليل حساباتك وفروعك.',
      whatsappLabel: copy.ctaWhatsApp,
      whatsappHref: 'https://wa.me/971581174911',
      contactHref: '/contact#contact-form',
    },
    seoBlocks: [
      {
        heading: 'حوّل إدارتك المالية ببرنامج محاسبة سحابي',
        level: 2,
        paragraphs: [
          'برنامجنا مصمم لتبسيط العمليات المالية لجميع أحجام الأعمال.',
          'وصول لحظي للبيانات وتتبع آلي للمعاملات وتقارير قابلة للتخصيص.',
        ],
      },
      {
        heading: 'للنمو والامتثال',
        level: 3,
        paragraphs: ['حل موثوق وآمن يساعد الأعمال على النمو في سوق تنافسي.'],
      },
    ],
    faqs: [
      {
        q: 'ما هو برنامج إدارة الحسابات السحابي؟',
        a: 'أداة رقمية لإدارة المعاملات والمصروفات والفواتير والتقارير من أي مكان مع رؤية مالية لحظية.',
      },
      {
        q: 'كيف يختلف عن البرامج التقليدية؟',
        a: 'السحابي يسمح بوصول آمن من أي مكان وتحديثات لحظية وتعاون فروع ومستخدمين.',
      },
      {
        q: 'هل بياناتي المالية آمنة؟',
        a: 'نعم — صلاحيات ونسخ احتياطي وضوابط دخول لحماية البيانات.',
      },
      {
        q: 'هل يمكن الوصول من أي مكان؟',
        a: 'نعم، للمستخدمين المصرح لهم حسب الصلاحيات.',
      },
      {
        q: 'ماذا عن الدعم الفني؟',
        a: 'ديجيتال مانجر يقدم دعماً وتدريباً وإرشاداً للاستخدام السلس.',
      },
      {
        q: 'كيف أنقل البيانات الحالية؟',
        a: 'استيراد أو إدخال عبر أرصدة افتتاحية ودليل حسابات وأرصدة عملاء وموردين.',
      },
    ],
  }
}
