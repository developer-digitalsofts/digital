/**
 * Builds locale record payloads per country, language and content identity.
 */
import { getProfile, SHARED_COPY, SEED_VERSION, REGIONAL_SUPPORT, arIn } from './profiles.mjs'
import industriesBaseline from '../data/industries.json' with { type: 'json' }
import faqsBaseline from '../data/faqs.json' with { type: 'json' }

function bi(en, ar) {
  return { en, ar }
}

function seedMeta() {
  return { _seedVersion: SEED_VERSION, _seedAt: new Date().toISOString() }
}

const TRUST_REGION_META = {
  AE: { value: 'UAE', label: bi('Focused Implementation', 'تنفيذ مركّز') },
  SA: { value: 'KSA', label: bi('Saudi-Focused Implementation', 'تنفيذ مخصص للسعودية') },
  QA: { value: 'Qatar', label: bi('Qatar-Focused Implementation', 'تنفيذ مخصص لقطر') },
  OM: { value: 'Oman', label: bi('Oman-Focused Implementation', 'تنفيذ مخصص لعُمان') },
  KW: { value: 'Kuwait', label: bi('Kuwait-Focused Implementation', 'تنفيذ مخصص للكويت') },
  BH: { value: 'Bahrain', label: bi('Bahrain-Focused Implementation', 'تنفيذ مخصص للبحرين') },
}

export function buildTrustStats(profile) {
  const region = TRUST_REGION_META[profile.code] || TRUST_REGION_META.AE
  const solutionsValue = profile.code === 'AE' ? '120+' : 'Modular'

  return {
    ...seedMeta(),
    eyebrow: bi('PROVEN PERFORMANCE', 'أداء مُثبت'),
    title:
      profile.code === 'AE'
        ? bi('Built on Trust.\nProven by Results.', 'مبني على الثقة.\nمثبت بالنتائج.')
        : profile.trustHeading,
    subheading: {
      en: `${SHARED_COPY.trustSubheading.en} Serving teams in ${profile.cityPhrase.en}.`,
      ar: `${SHARED_COPY.trustSubheading.ar} لخدمة الفرق في ${profile.cityPhrase.ar}.`,
    },
    items: [
      {
        id: 's-cloud',
        value: 'Cloud',
        label: bi('Native ERP Platform', 'منصة ERP سحابية'),
        icon: 'Award',
        accentColor: '#f47c4d',
        sortOrder: 0,
        active: true,
      },
      {
        id: 's-solutions',
        value: solutionsValue,
        label: bi('Business Solutions', 'حلول أعمال'),
        icon: 'Layers',
        accentColor: '#f47c4d',
        sortOrder: 1,
        active: true,
      },
      {
        id: 's-currency',
        value: profile.currency,
        label: bi('VAT-Ready Invoicing', 'فوترة جاهزة للضريبة'),
        icon: 'Users',
        accentColor: '#f47c4d',
        sortOrder: 2,
        active: true,
      },
      {
        id: 's-unified',
        value: 'Unified',
        label: bi('Connected Operations', 'عمليات متصلة'),
        icon: 'HeartHandshake',
        accentColor: '#f47c4d',
        sortOrder: 3,
        active: true,
      },
      {
        id: 's-region',
        value: region.value,
        label: region.label,
        icon: 'GitBranch',
        accentColor: '#f47c4d',
        sortOrder: 4,
        active: true,
      },
    ],
  }
}

export function buildHero(profile) {
  return {
    ...seedMeta(),
    title: bi(
      `Run Your Business Smarter Across ${profile.fullName.en}`,
      `نسّق عملياتك بذكاء ${arIn(profile.fullName.ar)}`,
    ),
    pill: bi(
      `All-in-One ERP for ${profile.fullName.en} Businesses`,
      `منصة ERP متكاملة لشركات ${profile.fullName.ar}`,
    ),
    useStructuredTitle: true,
    showPill: true,
    showTrustPoints: true,
    sub: bi(
      `One cloud ERP for finance, inventory, retail and multi-branch teams in ${profile.cityPhrase.en}.`,
      `ERP سحابي واحد للمالية والمخزون والتجزئة وفرق الفروع في ${profile.cityPhrase.ar}.`,
    ),
    body: bi(
      `DigitalManager helps businesses in ${profile.fullName.en} manage finance, inventory, sales, POS, HR, CRM, branches and reports from one secure cloud platform.`,
      `يساعد DigitalManager الشركات ${arIn(profile.fullName.ar)} على إدارة المالية والمخزون والمبيعات ونقطة البيع والموارد البشرية وCRM والفروع والتقارير من منصة سحابية آمنة واحدة.`,
    ),
    ctaPrimary: { label: bi('Book Free Demo', 'احجز عرضاً مجانياً'), href: '/contact' },
    ctaSecondary: { label: bi('Explore ERP Modules', 'استكشف وحدات ERP'), href: '/#modules' },
    mockupImageUrl: '',
    trustPoints: [
      { id: 'tp1', icon: 'Shield', label: bi('Secure Cloud ERP', 'ERP سحابي آمن'), sortOrder: 0, active: true },
      {
        id: 'tp2',
        icon: 'Cloud',
        label: bi(`${profile.heroAccent.en} Ready`, `جاهز ${arIn(profile.name.ar)}`),
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
    carouselEnabled: true,
    autoplayEnabled: true,
  }
}

export function buildAbout(profile) {
  return {
    ...seedMeta(),
    eyebrow: bi('About Us', 'من نحن'),
    title: bi('About DigitalManager', 'عن DigitalManager'),
    paragraphs: [
      bi(
        `DigitalManager is a cloud ERP platform for growing businesses in ${profile.fullName.en}. Finance, inventory, sales and branch reporting connect in one system built for ${profile.cityPhrase.en}.`,
        `DigitalManager منصة ERP سحابية للشركات النامية في ${profile.fullName.ar}. تربط المالية والمخزون والمبيعات وتقارير الفروع في نظام واحد لـ${profile.cityPhrase.ar}.`,
      ),
      bi(
        `Whether you operate from ${profile.cityPhrase.en} or across multiple locations, DigitalManager improves visibility and reduces manual work between departments.`,
        `سواء كنت تعمل من ${profile.cityPhrase.ar} أو عبر مواقع متعددة، يعزّز DigitalManager الرؤية ويقلّل العمل اليدوي بين الأقسام.`,
      ),
    ],
  }
}

export function buildValueChain(profile) {
  return {
    ...seedMeta(),
    eyebrow: bi('End-to-End Control', 'تحكم شامل'),
    title: bi('One Platform Across Your Value Chain', 'منصة واحدة عبر سلسلة القيمة'),
    subheading: bi(
      `Connect procurement, inventory, sales and finance for ${profile.currency} operations across ${profile.cityPhrase.en}.`,
      `اربط المشتريات والمخزون والمبيعات والمالية لعمليات ${profile.currencyName.ar} في ${profile.cityPhrase.ar}.`,
    ),
  }
}

export function buildModulesIntro(profile) {
  return {
    ...seedMeta(),
    eyebrow: bi('ERP Modules', 'وحدات ERP'),
    title: bi('Software Built for How You Operate', 'برمجيات مصممة لطريقة عملك'),
    subheading: bi(
      `Explore finance, inventory, POS, HR and industry modules configured for ${profile.currency} operations in ${profile.name.en}.`,
      `استكشف وحدات المالية والمخزون ونقطة البيع والموارد البشرية والقطاعات المهيّأة لعمليات ${profile.currencyName.ar} ${arIn(profile.name.ar)}.`,
    ),
  }
}

export function buildTestimonialsIntro(profile) {
  return {
    ...seedMeta(),
    eyebrow: bi('Client Stories', 'قصص العملاء'),
    title: bi('Businesses That Rely on DigitalManager', 'شركات تعتمد على DigitalManager'),
    subheading: bi(
      `See how growing companies in ${profile.fullName.en} streamline operations with connected ERP modules.`,
      `اطلع على كيفية تبسيط الشركات النامية في ${profile.fullName.ar} عملياتها بوحدات ERP متصلة.`,
    ),
  }
}

export function buildSeo(profile, lang = 'en') {
  const pathPrefix = profile.code === 'AE' ? '' : `/${profile.slug}/${lang}`
  const homePath = pathPrefix || '/'
  const title = bi(
    `DigitalManager — Cloud ERP for ${profile.fullName.en}`,
    `DigitalManager — ERP سحابي لـ${profile.fullName.ar}`,
  )
  const description = bi(
    `Cloud ERP for finance, inventory, POS and multi-branch operations in ${profile.fullName.en}. Serving ${profile.cityPhrase.en}. Book a demo.`,
    `ERP سحابي للمالية والمخزون ونقطة البيع وعمليات الفروع في ${profile.fullName.ar}. نخدم ${profile.cityPhrase.ar}. احجز عرضاً.`,
  )
  return {
    pageTitle: title,
    metaDescription: description,
    metaKeywords: bi(
      `ERP, cloud ERP, ${profile.currency}, ${profile.name.en}, DigitalManager, inventory, POS, ${profile.cities.en[0]}`,
      `ERP, ERP سحابي, ${profile.currency}, ${profile.name.ar}, DigitalManager, مخزون, نقطة بيع`,
    ),
    ogTitle: title,
    ogDescription: description,
    twitterTitle: title,
    twitterDescription: description,
    ogImage: '/digitalmanager-favicon.png',
    canonicalUrl: homePath,
    twitterImage: '',
    robotsIndex: lang === 'ar' ? 'noindex' : 'index',
    robotsFollow: 'follow',
  }
}

export function buildIndustriesSection(profile) {
  return {
    ...seedMeta(),
    eyebrow: bi(
      `Industry Solutions for ${profile.fullName.en}`,
      `حلول قطاعية لـ${profile.fullName.ar}`,
    ),
    title: bi(
      `ERP Built for ${profile.name.en} Industries`,
      `ERP مصمّم لقطاعات ${profile.name.ar}`,
    ),
    subtitle: bi(
      `From retail and distribution to manufacturing and services — industry modules configured for ${profile.currency} operations across ${profile.cityPhrase.en}.`,
      `من التجزئة والتوزيع إلى التصنيع والخدمات — وحدات قطاعية مهيّأة لعمليات ${profile.currencyName.ar} في ${profile.cityPhrase.ar}.`,
    ),
    viewAllLabel: industriesBaseline.viewAllLabel,
    exploreLabel: industriesBaseline.exploreLabel,
    items: industriesBaseline.items,
  }
}

export function buildFaqsSection(profile) {
  const items = (faqsBaseline.items || []).map((item) => {
    if (item.id === 'f5') {
      return {
        ...item,
        answer: bi(
          `Retail, manufacturing, hospitality, distribution and services across ${profile.fullName.en} — with industry workflows built into the platform.`,
          `التجزئة والتصنيع والضيافة والتوزيع والخدمات في ${profile.fullName.ar} — مع سير عمل قطاعي ضمن المنصة.`,
        ),
      }
    }
    if (item.id === 'f10') {
      return {
        ...item,
        answer: bi(
          `Pricing depends on modules, users, branches and support level. Plans are scoped for ${profile.currency} operations in ${profile.name.en}. Book a demo for a tailored quote.`,
          `يعتمد التسعير على الوحدات والمستخدمين والفروع والدعم. الخطط مصممة لعمليات ${profile.currencyName.ar} في ${profile.name.ar}. احجز عرضاً للحصول على عرض مخصص.`,
        ),
      }
    }
    return item
  })

  return {
    ...seedMeta(),
    title: bi('Frequently Asked Questions', 'الأسئلة الشائعة'),
    subtitle: bi(
      `Common questions about DigitalManager for businesses in ${profile.fullName.en}.`,
      `أسئلة شائعة حول DigitalManager للشركات في ${profile.fullName.ar}.`,
    ),
    items,
  }
}

export function buildHeaderPayload(profile) {
  const support = REGIONAL_SUPPORT
  return {
    ...seedMeta(),
    useBaseline: true,
    sourceFile: 'header.json',
    fields: {
      topBar: {
        enabled: true,
        message: bi(
          profile.code === 'AE'
            ? 'Cloud ERP for UAE & GCC businesses — book a free demo'
            : `Cloud ERP for ${profile.fullName.en} — ${support.label.en} available`,
          profile.code === 'AE'
            ? 'ERP سحابي لشركات الإمارات والخليج — احجز عرضاً مجانياً'
            : `ERP سحابي لـ${profile.fullName.ar} — ${support.label.ar} متاح`,
        ),
        phoneDisplay: support.phoneDisplay,
        phoneHref: support.phoneHref,
        showPhone: true,
        showEmail: true,
        email: support.email,
        phoneCta: bi('Regional Support:', 'الدعم الإقليمي:'),
        supportLabel: support.label,
      },
    },
  }
}

export function buildFooterPayload(profile) {
  const support = REGIONAL_SUPPORT
  return {
    ...seedMeta(),
    useBaseline: true,
    sourceFile: 'footer.json',
    fields: {
      tagline: bi(
        `Cloud ERP for growing businesses in ${profile.fullName.en}.`,
        `ERP سحابي للشركات النامية في ${profile.fullName.ar}.`,
      ),
      description: bi(
        `DigitalManager connects finance, inventory, sales and branch reporting for teams in ${profile.cityPhrase.en}. ${SHARED_COPY.regionalSupportNote.en}`,
        `يربط DigitalManager المالية والمخزون والمبيعات وتقارير الفروع للفرق في ${profile.cityPhrase.ar}. ${SHARED_COPY.regionalSupportNote.ar}`,
      ),
      phoneDisplay: support.phoneDisplay,
      phoneHref: support.phoneHref,
      primaryEmail: support.email,
      supportNote: bi(
        `${support.label.en}: ${support.phoneDisplay} · ${support.email}`,
        `${support.label.ar}: ${support.phoneDisplay} · ${support.email}`,
      ),
    },
  }
}

export function buildRoutePage(profile, kind) {
  const pages = {
    erp: {
      title: bi('Enterprise ERP Software', 'برمجيات ERP للمؤسسات'),
      heading: bi(`Enterprise-grade ERP for ${profile.fullName.en}`, `ERP على مستوى المؤسسات لـ${profile.fullName.ar}`),
      shortDescription: bi(
        `Manage finance, inventory, sales and branches on one platform configured for ${profile.currency} operations.`,
        `أدِر المالية والمخزون والمبيعات والفروع على منصة واحدة مهيّأة لعمليات ${profile.currencyName.ar}.`,
      ),
    },
    contact: {
      title: bi('Contact DigitalManager', 'تواصل مع DigitalManager'),
      heading: bi('Talk to Our ERP Specialists', 'تحدث إلى متخصصي ERP'),
      shortDescription: bi(
        `Request a demo or ${profile.currency} ERP support for teams in ${profile.cityPhrase.en}. Regional GCC enquiries are handled from our UAE team.`,
        `اطلب عرضاً أو دعم ERP بـ${profile.currencyName.ar} للفرق في ${profile.cityPhrase.ar}. تُعالَج استفسارات الخليج من فريقنا في الإمارات.`,
      ),
    },
    industries: {
      title: bi('Industries We Serve', 'القطاعات التي نخدمها'),
      heading: bi(`ERP for ${profile.fullName.en} Industries`, `ERP لقطاعات ${profile.fullName.ar}`),
      shortDescription: bi(
        `Industry programs for retail, distribution, manufacturing and services in ${profile.cityPhrase.en}.`,
        `برامج قطاعية للتجزئة والتوزيع والتصنيع والخدمات في ${profile.cityPhrase.ar}.`,
      ),
    },
    solutions: {
      title: bi('ERP Solutions', 'حلول ERP'),
      heading: bi('Modular ERP Solutions', 'حلول ERP معيارية'),
      shortDescription: bi(
        `Explore finance, inventory, POS, HR and CRM modules for ${profile.name.en} businesses.`,
        `استكشف وحدات المالية والمخزون ونقطة البيع والموارد وCRM لشركات ${profile.name.ar}.`,
      ),
    },
    'business-models': {
      title: bi('Business Models', 'نماذج الأعمال'),
      heading: bi('ERP for Your Operating Model', 'ERP لنموذج عملك'),
      shortDescription: bi(
        `Retail, wholesale, services and multi-branch models supported for ${profile.fullName.en}.`,
        `نماذج التجزئة والجملة والخدمات والفروع المتعددة مدعومة في ${profile.fullName.ar}.`,
      ),
    },
    faqs: {
      title: bi('Frequently Asked Questions', 'الأسئلة الشائعة'),
      heading: bi('ERP FAQs', 'أسئلة ERP الشائعة'),
      shortDescription: bi(
        `Common questions about DigitalManager deployment, modules and support in ${profile.fullName.en}.`,
        `أسئلة شائعة حول نشر DigitalManager والوحدات والدعم في ${profile.fullName.ar}.`,
      ),
    },
    testimonials: {
      title: bi('Customer Testimonials', 'شهادات العملاء'),
      heading: bi('What Teams Say About DigitalManager', 'ماذا تقول الفرق عن DigitalManager'),
      shortDescription: bi(
        `Feedback from businesses using DigitalManager across ${profile.fullName.en} and the wider GCC.`,
        `ملاحظات من شركات تستخدم DigitalManager في ${profile.fullName.ar} ومنطقة الخليج.`,
      ),
    },
    blog: {
      title: bi('Insights & Resources', 'رؤى وموارد'),
      heading: bi('ERP Insights for Growing Businesses', 'رؤى ERP للشركات النامية'),
      shortDescription: bi(
        `Articles on ERP, inventory and operations for ${profile.name.en} business leaders.`,
        `مقالات حول ERP والمخزون والعمليات لقادة الأعمال في ${profile.name.ar}.`,
      ),
    },
  }

  const page = pages[kind] || pages.erp
  return {
    ...seedMeta(),
    template: 'cms-page',
    title: page.title,
    heading: page.heading,
    shortDescription: page.shortDescription,
    sections: [
      { id: `${kind}-hero`, type: 'hero', visible: true, order: 0, content: {} },
      { id: `${kind}-body`, type: 'richText', visible: true, order: 1, content: {} },
    ],
  }
}

const PAGE_SECTION_BUILDERS = {
  hero: buildHero,
  stats: buildTrustStats,
  about: buildAbout,
  valueChain: buildValueChain,
  modules: buildModulesIntro,
  testimonials: buildTestimonialsIntro,
  industries: buildIndustriesSection,
  faqs: buildFaqsSection,
}

export function buildLocalizedContent(countryCode, lang, contentType, globalIdentity) {
  const profile = getProfile(countryCode)

  if (contentType === 'pageSection' && PAGE_SECTION_BUILDERS[globalIdentity]) {
    return { payload: PAGE_SECTION_BUILDERS[globalIdentity](profile) }
  }

  if (contentType === 'navigation' && globalIdentity === 'header') {
    return { payload: buildHeaderPayload(profile) }
  }

  if (contentType === 'footer' && globalIdentity === 'footer') {
    return { payload: buildFooterPayload(profile) }
  }

  if (contentType === 'seo' && globalIdentity === 'site') {
    return { seo: buildSeo(profile, lang), payload: { ...seedMeta() } }
  }

  if (contentType === 'contact' && globalIdentity === 'contact') {
    return { payload: buildRoutePage(profile, 'contact') }
  }

  if (contentType === 'faq' && globalIdentity === 'faqs') {
    return { payload: buildRoutePage(profile, 'faqs') }
  }

  if (contentType === 'solution' && globalIdentity === 'erp') {
    return { payload: buildRoutePage(profile, 'erp') }
  }

  if (contentType === 'solution' && globalIdentity === 'solutions-list') {
    return { payload: buildRoutePage(profile, 'solutions') }
  }

  if (contentType === 'industry' && globalIdentity === 'industries-list') {
    return { payload: buildRoutePage(profile, 'industries') }
  }

  if (contentType === 'businessModel' && globalIdentity === 'business-models-list') {
    return { payload: buildRoutePage(profile, 'business-models') }
  }

  if (contentType === 'testimonial' && globalIdentity === 'testimonials') {
    return { payload: buildRoutePage(profile, 'testimonials') }
  }

  if (contentType === 'blog' && globalIdentity === 'blog') {
    return { payload: buildRoutePage(profile, 'blog') }
  }

  return null
}
