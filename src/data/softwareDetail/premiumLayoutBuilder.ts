import type { Lang } from '../../i18n/messages'
import { getSoftwareDetailCopy, type SoftwareDetailCopy } from '../../i18n/softwareDetailCopy'
import type { ModuleRichPage } from '../moduleRichPages'
import { WHATSAPP_URL } from '../../constants'
import type {
  SoftwareDetailPageData,
  SoftwareImplementationStep,
  SoftwareNamedItem,
  SoftwarePremiumPageConfig,
  SoftwareReportBullet,
  SoftwareTabBlock,
  SoftwareWhyPoint,
} from './types'
import { getSourceMapUrl, relatedToIndustryLinks } from './premiumImagePacks'

const v = (name: string, description: string): SoftwareNamedItem => ({ name, description })

function productShortName(displayName: string): string {
  return displayName
    .replace(/\s+Software$/i, '')
    .replace(/\s+ERP\s+Software$/i, '')
    .replace(/\s+Management\s+Software$/i, '')
    .trim()
}

function premiumImplementation(displayName: string, copy: SoftwareDetailCopy): SoftwareImplementationStep[] {
  const scope = productShortName(displayName)
  if (copy.lang === 'ar') {
    return copy.implementation
  }
  return [
    {
      icon: 'Compass',
      title: 'Consultancy',
      description: `Structured discovery for ${scope}: we map sales, inventory, finance, and integrations so DigitalManager mirrors how your teams actually work.`,
    },
    {
      icon: 'GraduationCap',
      title: 'Training',
      description:
        'Role-based training for branch users, supervisors, and administrators — with quick-reference guides for day-two operations.',
    },
    {
      icon: 'Download',
      title: 'Software installation',
      description: 'Provisioning, master imports, voucher templates, and sandbox validation before production cutover.',
    },
    {
      icon: 'Headphones',
      title: 'Support',
      description: 'Ongoing software, configuration, and troubleshooting support so adoption stays on track after go-live.',
    },
  ]
}

function premiumWorkflowTabs(displayName: string, rich: ModuleRichPage, copy: SoftwareDetailCopy): SoftwareTabBlock[] {
  const primaryItems: SoftwareNamedItem[] = [
    ...rich.workflows.map((w) => v(w.step, w.detail)),
    ...rich.capabilities.map((c) =>
      v(c.title, c.body.length > 240 ? `${c.body.slice(0, 237)}…` : c.body),
    ),
  ]
  const reportItems: SoftwareNamedItem[] = [
    ...rich.outcomes.map((o) => v(o, copy.workflowTabOutcomeDesc)),
    ...rich.highlights.map((h) => v(h, copy.workflowTabHighlightDesc)),
  ]
  const short = productShortName(displayName)
  const coreCycle =
    copy.lang === 'ar' ? `دورة ${short} الأساسية` : `Core ${short} cycle`
  const execRollups = copy.lang === 'ar' ? 'تجميع تنفيذي' : 'Executive roll-ups'
  return [
    {
      id: 'workflows',
      title: copy.premiumTabWorkflows,
      items: primaryItems.length ? primaryItems.slice(0, 6) : [v(coreCycle, rich.subhead)],
    },
    {
      id: 'reports',
      title: copy.premiumTabReports,
      items: reportItems.length ? reportItems.slice(0, 6) : [v(execRollups, rich.subhead)],
    },
  ]
}

function premiumChallengeBullets(displayName: string, rich: ModuleRichPage, copy: SoftwareDetailCopy): string[] {
  const s = productShortName(displayName)
  const suffix =
    copy.lang === 'ar'
      ? ' — يصعب ضبطه عندما تعيش البيانات في جداول أو أدوات جانبية.'
      : ' — difficult to govern when data lives in spreadsheets or side tools.'
  const fromHighlights = rich.highlights.map((h) => `${h}${suffix}`)
  if (copy.lang === 'ar') {
    const core = [
      `تفقد فرق ${s} وقتاً عند مطابقة الأرقام التشغيلية والمالية يدوياً بعد إقفال الشهر.`,
      `الموافقات غير الرسمية تزيد مخاطر السياسة لـ ${displayName}.`,
      `يتباطأ التدقيق عندما تتفرق الأدلة بين البريد وPDF والملفات المحلية.`,
      `توسيع الفروع أو خطوط المنتجات يكسر الأساسيات دون نواة ERP موحدة.`,
      `تُعاد لوحات الإدارة يدوياً لكل مراجعة بدلاً من قراءة نفس الترحيلات المباشرة.`,
    ]
    return [...core, ...fromHighlights].slice(0, 6)
  }
  const core = [
    `${s} teams lose time when operational and financial numbers are reconciled manually after month-end.`,
    `Disconnected approvals and informal sign-offs increase policy risk for ${displayName}.`,
    `Audits slow down when evidence is scattered across email, PDFs, and local files instead of voucher-backed trails.`,
    `Scaling branches or new product lines breaks item, tax, and pricing masters without a single governed ERP core.`,
    `Leadership dashboards are rebuilt manually for every review instead of reading the same live postings operations use.`,
  ]
  return [...core, ...fromHighlights].slice(0, 6)
}

function premiumWhyChoosePoints(displayName: string, rich: ModuleRichPage, copy: SoftwareDetailCopy): SoftwareWhyPoint[] {
  const s = productShortName(displayName)
  const fromCaps = rich.capabilities.slice(0, 3).map((c) => ({
    title: c.title,
    body:
      copy.lang === 'ar'
        ? c.body.length > 320
          ? `${c.body.slice(0, 317)}…`
          : c.body
        : c.body.length > 320
          ? `${c.body.slice(0, 317)}…`
          : `${c.body} This is how DigitalManager keeps ${s} teams aligned from first capture to management review.`,
  }))
  return [...fromCaps, ...copy.whyTail].slice(0, 5)
}

function premiumRealtimeBullets(rich: ModuleRichPage, copy: SoftwareDetailCopy): SoftwareReportBullet[] {
  const rows: SoftwareReportBullet[] = []
  for (const o of rich.outcomes) {
    rows.push({ title: copy.premiumOutcomePulse, text: o })
  }
  for (const h of rich.highlights) {
    rows.push({ title: copy.premiumOperationalSignal, text: h })
  }
  for (const c of rich.capabilities) {
    rows.push({
      title: c.title,
      text: c.body.length > 200 ? `${c.body.slice(0, 197)}…` : c.body,
    })
  }
  return rows.slice(0, 6)
}

/**
 * Applies the approved Accounts-style premium template to generic module/industry detail data.
 * Content is grounded in `rich` (moduleRichPages / industryRichPages) — aligned with digitalmanager.ae positioning.
 */
export function applyPremiumSoftwareTemplate(
  merged: SoftwareDetailPageData,
  ctx: {
    slug: string
    kind: 'module' | 'industry'
    displayName: string
    rich: ModuleRichPage
    lang?: Lang
  },
): SoftwareDetailPageData {
  const { slug, kind, displayName, rich, lang = 'en' } = ctx
  const copy = getSoftwareDetailCopy(lang)
  const short = productShortName(displayName)
  const sourceUrl = getSourceMapUrl(slug)

  const trust = [...copy.premiumTrust]

  const introPlain = rich.intro.replace(/\s+/g, ' ').trim()
  const metaDescription = `${rich.subhead} ${introPlain.slice(0, 130)}${introPlain.length > 130 ? '…' : ''}`

  const solutionSecond =
    copy.lang === 'ar'
      ? `يحل ديجيتال مانجر هذه الفجوات لـ ${displayName} بربط سير العمل والمخزون والفوترة والرواتب حيث يلزم والتقارير المالية في ERP واحد. ${rich.subhead} النتائج المتوقعة: ${rich.outcomes.join(' · ')}`
      : `DigitalManager solves these gaps for ${displayName} by connecting workflows, inventory, billing, payroll where relevant, and financial reporting in one ERP. ${rich.subhead} Expected outcomes include: ${rich.outcomes.join(' · ')}`

  const premiumLayout: SoftwarePremiumPageConfig = {
    layout: 'premium',
    featuresHeading: copy.premiumFeaturesHeading(displayName),
    featuresLead: `${rich.subhead} ${introPlain.slice(0, 200)}${introPlain.length > 200 ? '…' : ''}`,
    vouchersSectionEyebrow:
      kind === 'module' ? copy.premiumVouchersEyebrowModule : copy.premiumVouchersEyebrowIndustry,
    challengesHeading: copy.premiumChallengesHeading(short),
    challengesIntro: copy.premiumChallengesIntro(short, sourceUrl.replace('https://', '')),
    challengesListLead: copy.premiumChallengesListLead,
    challengeBullets: premiumChallengeBullets(displayName, rich, copy),
    solutionHeading: copy.premiumSolutionHeading(short),
    solutionParagraphs: [`${rich.intro.split('\n\n')[0]?.trim() ?? rich.intro}`, solutionSecond],
    industriesSection: {
      heading:
        kind === 'module' ? copy.premiumIndustriesHeadingModule : copy.premiumIndustriesHeadingIndustry,
      description: copy.premiumIndustriesDesc(displayName),
      items: relatedToIndustryLinks(merged.related),
      note: copy.premiumIndustriesNote,
    },
    implementationSectionTitle: copy.premiumImplTitle(short),
    implementationSectionLead: copy.premiumImplLead,
    faqSectionHeading: copy.premiumFaqHeading,
    demoFormVariant: 'email-phone',
    demoSendButtonLabel: copy.lang === 'ar' ? 'إرسال' : 'Send',
    heroAsideCaption: copy.premiumHeroAside(short),
    heroChips: (() => {
      const chipLabels = [copy.premiumChipOps, copy.premiumChipFinance, copy.premiumChipScale] as const
      const from = rich.highlights.slice(0, 3).map((h, i) => ({
        label: chipLabels[i] ?? copy.premiumChipVisibility,
        value: h.length > 30 ? `${h.slice(0, 27)}…` : h,
        hint: copy.premiumChipHintLive,
      }))
      const pad: { label: string; value: string; hint: string }[] = [...from]
      const fallbacks = [
        {
          label: copy.premiumChipControl,
          value: copy.lang === 'ar' ? 'ترحيل جاهز للسياسة' : 'Policy-ready postings',
          hint: copy.premiumChipHintErp,
        },
        {
          label: copy.premiumChipVisibility,
          value: copy.lang === 'ar' ? 'لوحات حسب الفرع' : 'Branch-aware dashboards',
          hint: copy.premiumChipHintNow,
        },
        {
          label: copy.premiumChipEvidence,
          value: copy.lang === 'ar' ? 'مسارات مدعومة بالقيود' : 'Voucher-backed trails',
          hint: copy.premiumChipHintAudit,
        },
      ]
      let i = 0
      while (pad.length < 3) {
        pad.push(fallbacks[i % fallbacks.length])
        i++
      }
      return pad.slice(0, 3)
    })(),
  }

  const tabs = premiumWorkflowTabs(displayName, rich, copy)
  const heroEyebrow =
    copy.lang === 'ar'
      ? kind === 'module'
        ? 'البرمجيات حسب الوحدة'
        : 'البرمجيات حسب القطاع'
      : kind === 'module'
        ? 'Software by module'
        : 'Software by industry'

  const industryIntro =
    kind === 'industry'
      ? (rich.intro.split(/\n+/).map((p) => p.trim()).filter(Boolean)[0] ?? rich.intro).slice(0, 380)
      : rich.intro

  return {
    ...merged,
    metaTitle: `${displayName} | ${copy.metaTitleSuffix}`,
    metaDescription,
    premiumLayout,
    hero: {
      ...merged.hero,
      eyebrow: heroEyebrow,
      headline: rich.headline,
      subhead: rich.subhead,
      intro: industryIntro,
      trust: [...trust],
      ctaPrimary: { label: copy.ctaLetUsDemo, to: '/contact#contact-form' },
      ctaSecondary: { label: copy.ctaWhatsApp, to: WHATSAPP_URL },
    },
    features: kind === 'industry' ? merged.features.slice(0, 6) : merged.features,
    vouchersReports: {
      heading:
        kind === 'module' ? copy.premiumVouchersHeadingModule : copy.premiumVouchersHeadingIndustry,
      subheading: copy.premiumVouchersSub(short),
      tabs,
    },
    challengesSolutions: [],
    whyChoose: {
      heading: copy.premiumWhyHeading(short),
      intro: `${rich.subhead} ${copy.premiumWhyIntro}`,
      points:
        kind === 'industry'
          ? premiumWhyChoosePoints(displayName, rich, copy).slice(0, 3)
          : premiumWhyChoosePoints(displayName, rich, copy),
    },
    realtimeReports: {
      heading: copy.premiumRealtimeHeading,
      intro: copy.premiumRealtimeIntro(short),
      bullets:
        kind === 'industry'
          ? premiumRealtimeBullets(rich, copy).slice(0, 4)
          : premiumRealtimeBullets(rich, copy),
    },
    implementation: kind === 'industry' ? premiumImplementation(displayName, copy).slice(0, 4) : premiumImplementation(displayName, copy),
    seoBlocks: kind === 'industry' ? [] : merged.seoBlocks,
    demoCta: {
      ...merged.demoCta,
      heading: copy.premiumDemoHeading,
      sub: copy.premiumDemoSub(displayName),
      whatsappLabel: copy.ctaWhatsApp,
      whatsappHref: WHATSAPP_URL,
      contactHref: '/contact#contact-form',
    },
  }
}
