import type { HeroCarouselSlide, HeroCmsPayload } from '../../types/heroCarousel'
import { pick } from '../../cms/pick'
import type { Lang } from '../../i18n/messages'

export const DEFAULT_AUTOPLAY_MS = 5000

export const DEFAULT_HERO_SLIDES: HeroCarouselSlide[] = [
  {
    id: 'slide-erp',
    moduleType: 'erp',
    navLabel: { en: 'ERP', ar: 'ERP' },
    navIcon: 'LayoutGrid',
    visible: true,
    sortOrder: 0,
    pill: { en: 'ONE PLATFORM. COMPLETE CONTROL.', ar: 'منصة واحدة. تحكم كامل.' },
    titleBefore: { en: 'Everything Your', ar: 'كل ما يحتاجه' },
    titleLine2: { en: 'Business Needs.', ar: 'عملك.' },
    titleLine2Accent: { en: 'Business', ar: 'عملك' },
    titleAccent: { en: 'In One Smart System.', ar: 'في نظام ذكي واحد.' },
    controlledTitleWrap: true,
    body: {
      en: 'Connect finance, inventory, sales, POS, HR, CRM, branches and reporting through one secure cloud ERP platform.',
      ar: 'اربط المالية والمخزون والمبيعات ونقطة البيع والموارد وCRM والفروع والتقارير عبر منصة ERP سحابية آمنة واحدة.',
    },
    ctaPrimary: { label: { en: 'Book Free Demo', ar: 'احجز عرضاً مجانياً' }, href: '#get-demo' },
    ctaSecondary: { label: { en: 'Explore Modules', ar: 'استكشف الوحدات' }, href: '/#modules' },
    dashboardImageUrl: '',
  },
  {
    id: 'slide-finance',
    moduleType: 'finance',
    navLabel: { en: 'Finance', ar: 'المالية' },
    navIcon: 'Wallet',
    visible: true,
    sortOrder: 1,
    pill: { en: 'REAL-TIME FINANCIAL CONTROL', ar: 'تحكم مالي فوري' },
    titleBefore: { en: 'See Every Number.', ar: 'اطلع على كل رقم.' },
    titleLine2: { en: 'Make Every Decision', ar: 'اتخذ كل قرار' },
    titleAccent: { en: 'Faster.', ar: 'أسرع.' },
    controlledTitleWrap: true,
    body: {
      en: 'Track cash flow, receivables, expenses and profitability in real time from one accurate financial view.',
      ar: 'تابع التدفق النقدي والذمم والمصروفات والربحية في الوقت الفعلي من عرض مالي دقيق واحد.',
    },
    ctaPrimary: { label: { en: 'Book Free Demo', ar: 'احجز عرضاً مجانياً' }, href: '#get-demo' },
    ctaSecondary: { label: { en: 'Explore Finance', ar: 'استكشف المالية' }, href: '/software/accounts-management-software' },
    dashboardImageUrl: '',
  },
  {
    id: 'slide-inventory',
    moduleType: 'inventory',
    navLabel: { en: 'Inventory', ar: 'المخزون' },
    navIcon: 'Package',
    visible: true,
    sortOrder: 2,
    pill: { en: 'SMART INVENTORY CONTROL', ar: 'تحكم ذكي بالمخزون' },
    titleBefore: { en: "Know What's Moving.", ar: 'اعرف ما يتحرك.' },
    titleAccent: { en: "Control What's Next.", ar: 'تحكم في ما يلي.' },
    controlledTitleWrap: true,
    body: {
      en: 'Monitor stock health, low-stock alerts, fast-moving products and branch availability before they affect sales.',
      ar: 'راقب صحة المخزون وتنبيهات النقص والمنتجات سريعة الحركة وتوفر الفروع قبل أن تؤثر على المبيعات.',
    },
    ctaPrimary: { label: { en: 'Book Free Demo', ar: 'احجز عرضاً مجانياً' }, href: '#get-demo' },
    ctaSecondary: { label: { en: 'Explore Inventory', ar: 'استكشف المخزون' }, href: '/software/inventory-management-software' },
    dashboardImageUrl: '',
  },
  {
    id: 'slide-pos',
    moduleType: 'pos',
    navLabel: { en: 'POS', ar: 'نقطة البيع' },
    navIcon: 'ShoppingCart',
    visible: true,
    sortOrder: 3,
    pill: { en: 'FASTER SALES. BETTER CONTROL.', ar: 'مبيعات أسرع. تحكم أفضل.' },
    titleBefore: { en: 'Turn Every Checkout', ar: 'حوّل كل عملية دفع' },
    titleAccent: { en: 'Into a Smarter Sale.', ar: 'إلى بيع أذكى.' },
    controlledTitleWrap: true,
    body: {
      en: 'Manage billing, tills, payments, products and daily sales through one fast and connected point-of-sale system.',
      ar: 'أدر الفوترة والصناديق والمدفوعات والمنتجات والمبيعات اليومية عبر نظام نقطة بيع سريع ومتصل.',
    },
    ctaPrimary: { label: { en: 'Book Free Demo', ar: 'احجز عرضاً مجانياً' }, href: '#get-demo' },
    ctaSecondary: { label: { en: 'Explore POS', ar: 'استكشف نقطة البيع' }, href: '/software/point-of-sale-software' },
    dashboardImageUrl: '',
  },
  {
    id: 'slide-hr',
    moduleType: 'hr',
    navLabel: { en: 'HR', ar: 'الموارد' },
    navIcon: 'Users',
    visible: true,
    sortOrder: 4,
    pill: { en: 'YOUR WORKFORCE. ONE CLEAR VIEW.', ar: 'قواك العاملة. رؤية واحدة واضحة.' },
    titleBefore: { en: 'Manage People,', ar: 'أدر الموظفين،' },
    titleLine2: { en: 'Attendance and Payroll', ar: 'الحضور والرواتب' },
    titleAccent: { en: 'With Confidence.', ar: 'بثقة.' },
    controlledTitleWrap: true,
    body: {
      en: 'Keep employee records, attendance, leave, payroll and departmental performance connected in one system.',
      ar: 'احتفظ بسجلات الموظفين والحضور والإجازات والرواتب وأداء الأقسام متصلة في نظام واحد.',
    },
    ctaPrimary: { label: { en: 'Book Free Demo', ar: 'احجز عرضاً مجانياً' }, href: '#get-demo' },
    ctaSecondary: { label: { en: 'Explore HR', ar: 'استكشف الموارد' }, href: '/software/payroll-management-software' },
    dashboardImageUrl: '',
  },
]

/** Build a single fallback slide from legacy hero fields when carousel data is absent. */
export function legacyHeroToSlide(hero: HeroCmsPayload | undefined): HeroCarouselSlide {
  const base = DEFAULT_HERO_SLIDES[0]
  if (!hero) return base
  return {
    ...base,
    id: 'slide-legacy',
    pill: hero.pill ?? base.pill,
    titleBefore: hero.titleBefore ?? base.titleBefore,
    titleAccent: hero.titleAccent ?? hero.title ?? base.titleAccent,
    titleLine2: hero.titleLine2,
    body: hero.body ?? base.body,
    ctaPrimary: {
      label: hero.ctaPrimary?.label ?? base.ctaPrimary.label,
      href: hero.ctaPrimary?.href?.trim() || '#get-demo',
    },
    ctaSecondary: {
      label: hero.ctaSecondary?.label ?? base.ctaSecondary.label,
      href: hero.ctaSecondary?.href?.trim() || '/#modules',
    },
    dashboardImageUrl: hero.mockupImageUrl?.trim() || '',
  }
}

export type ResolveHeroSlidesOptions = {
  /** Published CMS payload loaded — do not substitute bundled default slides. */
  cmsLoaded?: boolean
}

export function resolveHeroSlides(
  hero: HeroCmsPayload | undefined,
  options: ResolveHeroSlidesOptions = {},
): HeroCarouselSlide[] {
  const cmsLoaded = options.cmsLoaded === true
  const raw = hero?.slides

  if (hero?.carouselEnabled === false) {
    return [legacyHeroToSlide(hero)]
  }

  if (Array.isArray(raw) && raw.length > 0) {
    const filtered = [...raw]
      .filter((s) => s && s.visible !== false)
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    if (filtered.length > 0) return filtered
  }

  if (cmsLoaded) {
    if (hero) return [legacyHeroToSlide(hero)]
    return []
  }

  return DEFAULT_HERO_SLIDES
}

export function resolveAutoplayMs(hero: HeroCmsPayload | undefined) {
  const ms = hero?.autoplayDurationMs
  if (typeof ms === 'number' && ms >= 3000 && ms <= 30000) return ms
  return DEFAULT_AUTOPLAY_MS
}

const DEFAULT_HERO_TRUST_POINTS = {
  en: ['Secure Cloud ERP', 'UAE & GCC Ready', 'Multi-Branch Reporting'],
  ar: ['ERP سحابي آمن', 'جاهز للإمارات ودول الخليج', 'تقارير متعددة الفروع'],
} as const

/** Verified hero trust points — CMS first, then published defaults. */
export function resolveHeroTrustPoints(hero: HeroCmsPayload | undefined, lang: Lang): string[] {
  if (hero?.showTrustPoints === false) return []

  const cmsPoints = hero?.trustPoints?.length
    ? [...hero.trustPoints]
        .filter((p) => p.active !== false)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
        .slice(0, 3)
        .map((p) => (p.label ? pick(p.label, lang) : ''))
        .filter(Boolean)
    : []

  if (cmsPoints.length) return cmsPoints

  return [...DEFAULT_HERO_TRUST_POINTS[lang === 'ar' ? 'ar' : 'en']]
}
