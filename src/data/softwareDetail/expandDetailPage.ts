import type { Lang } from '../../i18n/messages'
import { getSoftwareDetailCopy } from '../../i18n/softwareDetailCopy'
import { megaIndustryLabel, megaModuleLabel } from '../../i18n/megaLabels'
import type { ModuleRichPage } from '../moduleRichPages'
import { flattenMegaSearchMeta } from '../megaMenu'
import type {
  SoftwareDetailPageData,
  SoftwareFeatureCard,
  SoftwareRelatedLink,
  SoftwareReportBullet,
  SoftwareTabBlock,
  SoftwareTrustStat,
  SoftwareWhyPoint,
} from './types'
import { getSlugDetailPatch } from './slugPatches'
import { applyPremiumSoftwareTemplate } from './premiumLayoutBuilder'
import { mergeInventoryManagementPremiumPage } from './inventoryManagementPageContent'
import { mergePayrollManagementPremiumPage } from './payrollManagementPageContent'
import { mergeProductionManagementPremiumPage } from './productionManagementPageContent'
import { mergePosManagementPremiumPage } from './posManagementPageContent'
import { mergeFbrPosIntegrationPremiumPage } from './fbrPosIntegrationPageContent'
import { mergeCrmPremiumPage } from './crmPageContent'
import { mergeSmsIntegrationPremiumPage } from './smsIntegrationPageContent'
import { mergeGroceryStoreIndustryPage, mergeToyShopIndustryPage, mergeHardwareSanitaryIndustryPage, mergeLuggageBagsIndustryPage, mergeCrockeryStoreIndustryPage, mergeRetailManagementIndustryPage, mergeLogisticsTransportationIndustryPage, mergeMotorMarketIndustryPage, mergePoultryChickenSupplyIndustryPage, mergePoultryWasteIndustryPage, mergePoultryControlShedIndustryPage, mergeFabricStoreIndustryPage, mergeKnittingDyeingIndustryPage, mergeTextileIndustryErpPage } from './industryRetailPageContent'
import {
  mergeFleetFuelIndustryPage,
  mergeFuelTankLorryIndustryPage,
  mergeLpgBowserIndustryPage,
  mergeLpgErpIndustryPage,
  mergePetrolDepotIndustryPage,
  mergePetrolPumpIndustryPage,
} from './industryOilGasPageContent'
import { mergeAgricultureIndustryPage, mergeDairyFarmIndustryPage } from './industryAgrifoodPageContent'
import {
  mergeCandyManufacturingIndustryPage,
  mergeGarmentsManufacturingIndustryPage,
} from './industryManufacturingPageContent'
import { mergeVisaImmigrationIndustryPage } from './industryVisaPageContent'
import { mergeHotelManagementIndustryPage } from './industryHospitalityPageContent'
import {
  mergeHomeopathicBusinessIndustryPage,
  mergePharmacyBusinessIndustryPage,
} from './industryMedicalPageContent'
import {
  mergeComputersLaptopIndustryPage,
  mergeElectricStoreIndustryPage,
  mergeElectronicsManagementIndustryPage,
  mergeEvChargingIndustryPage,
  mergeMobileAccessoriesIndustryPage,
} from './industryElectronicsPageContent'
import { mergeAutoPartsBusinessIndustryPage } from './industryAutoPartsPageContent'
import {
  mergeConstructionBusinessIndustryPage,
  mergeRealEstateBusinessIndustryPage,
} from './industryPropertyPageContent'

const FEATURE_ICONS = [
  'Layers',
  'Shield',
  'BarChart3',
  'FileText',
  'Wallet',
  'Package',
  'Users',
  'Cpu',
  'Target',
  'LineChart',
  'CheckCircle2',
  'Sparkles',
] as const

function pickRelated(slug: string, kind: 'module' | 'industry', lang: Lang): SoftwareRelatedLink[] {
  const all = flattenMegaSearchMeta().filter((r) => !(r.slug === slug && r.kind === kind))
  const modules = all.filter((r) => r.kind === 'module').slice(0, 4)
  const industries = all.filter((r) => r.kind === 'industry').slice(0, 4)
  const mix: SoftwareRelatedLink[] = []
  for (const m of modules) {
    mix.push({
      kind: 'module',
      slug: m.slug,
      label: megaModuleLabel(lang, m.slug, m.labelEn).replace(/\s+Software$/i, ''),
    })
  }
  for (const i of industries) {
    mix.push({
      kind: 'industry',
      slug: i.slug,
      label: megaIndustryLabel(lang, i.slug, i.labelEn).replace(/\s+Software$/i, ''),
    })
  }
  return mix.slice(0, 8)
}

function defaultWhyPoints(displayName: string, rich: ModuleRichPage, copy: ReturnType<typeof getSoftwareDetailCopy>): SoftwareWhyPoint[] {
  const fromCaps = rich.capabilities.map((c) => ({
    title: c.title,
    body:
      copy.lang === 'ar'
        ? c.body
        : `${c.body} Teams adopt faster when screens match how ${displayName} actually works day to day.`,
  }))
  return [...fromCaps, ...copy.whyTail].slice(0, 8)
}

function defaultReportBullets(rich: ModuleRichPage, copy: ReturnType<typeof getSoftwareDetailCopy>): SoftwareReportBullet[] {
  const fromOutcomes = rich.outcomes.map((o) => ({
    title: copy.reportBulletOutcome,
    text: o,
  }))
  const extra: SoftwareReportBullet[] = rich.highlights.map((h) => ({
    title: copy.reportBulletSignal,
    text: h,
  }))
  return [...fromOutcomes, ...extra].slice(0, 12)
}

export function buildSoftwareDetailPageData(
  slug: string,
  kind: 'module' | 'industry',
  displayName: string,
  rich: ModuleRichPage,
  lang: Lang = 'en',
): SoftwareDetailPageData {
  const copy = getSoftwareDetailCopy(lang)
  const metaTitle = `${displayName} | ${copy.metaTitleSuffix}`
  const metaDescription = `${rich.subhead} ${rich.intro.slice(0, 140)}…`

  const trust: SoftwareTrustStat[] = [...copy.trust]

  const features: SoftwareFeatureCard[] = []
  let fi = 0
  for (const h of rich.highlights) {
    features.push({
      icon: FEATURE_ICONS[fi++ % FEATURE_ICONS.length],
      title: h,
      description: copy.expandFeature(displayName, h),
    })
  }
  for (const c of rich.capabilities) {
    features.push({
      icon: FEATURE_ICONS[fi++ % FEATURE_ICONS.length],
      title: c.title,
      description: copy.expandFeature(displayName, c.body),
    })
  }
  for (const w of rich.workflows) {
    features.push({
      icon: FEATURE_ICONS[fi++ % FEATURE_ICONS.length],
      title: w.step,
      description: copy.expandFeature(displayName, w.detail),
    })
  }
  while (features.length < 12) {
    features.push({
      icon: FEATURE_ICONS[fi++ % FEATURE_ICONS.length],
      title: copy.featurePadSecurityTitle,
      description: copy.featurePadSecurityDesc(displayName),
    })
    if (features.length >= 12) break
    features.push({
      icon: FEATURE_ICONS[fi++ % FEATURE_ICONS.length],
      title: copy.featurePadIntegrationTitle,
      description: copy.featurePadIntegrationDesc,
    })
  }

  const voucherTab: SoftwareTabBlock = {
    id: 'vouchers',
    title: copy.vouchersTabTitle,
    items: copy.voucherItems(displayName),
  }
  const reportTab: SoftwareTabBlock = {
    id: 'reports',
    title: copy.reportsTabTitle,
    items: copy.reportItems(displayName),
  }

  const base: SoftwareDetailPageData = {
    metaTitle,
    metaDescription,
    hero: {
      eyebrow: kind === 'module' ? copy.heroEyebrowModule : copy.heroEyebrowIndustry,
      headline: rich.headline,
      subhead: rich.subhead,
      intro: rich.intro,
      trust,
      ctaPrimary: { label: copy.ctaBookDemo, to: '/contact#contact-form' },
      ctaSecondary: {
        label: kind === 'module' ? copy.ctaBrowseModules : copy.ctaBrowseIndustries,
        to: kind === 'module' ? '/#modules' : '/#industries',
      },
    },
    features,
    vouchersReports: {
      heading: copy.vouchersReportsHeading,
      subheading: copy.vouchersReportsSubheading,
      tabs: [voucherTab, reportTab],
    },
    challengesSolutions: copy.challenges(displayName),
    whyChoose: {
      heading: copy.whyChooseHeading(displayName),
      intro: copy.whyChooseIntro,
      points: defaultWhyPoints(displayName, rich, copy),
    },
    realtimeReports: {
      heading: copy.realtimeHeading,
      intro: copy.realtimeIntro,
      bullets: defaultReportBullets(rich, copy),
    },
    related: pickRelated(slug, kind, lang),
    implementation: copy.implementation,
    demoCta: {
      heading: copy.demoHeading,
      sub: copy.demoSub,
      whatsappLabel: copy.demoWhatsapp,
      whatsappHref: 'https://wa.me/971581174911',
      contactHref: '/contact#contact-form',
    },
    seoBlocks: copy.seoBlocks(displayName, kind, rich),
    faqs: copy.faqs(displayName, kind),
  }

  const patch = lang === 'en' ? getSlugDetailPatch(slug, displayName, kind) : undefined
  const merged: SoftwareDetailPageData = !patch
    ? base
    : {
        ...base,
        ...patch,
        hero: patch.hero ? { ...base.hero, ...patch.hero } : base.hero,
        features: patch.features ?? base.features,
        vouchersReports: patch.vouchersReports ?? base.vouchersReports,
        challengesSolutions: patch.challengesSolutions ?? base.challengesSolutions,
        whyChoose: patch.whyChoose
          ? {
              ...base.whyChoose,
              ...patch.whyChoose,
              points: patch.whyChoose.points ?? base.whyChoose.points,
            }
          : base.whyChoose,
        realtimeReports: patch.realtimeReports
          ? {
              ...base.realtimeReports,
              ...patch.realtimeReports,
              bullets: patch.realtimeReports.bullets ?? base.realtimeReports.bullets,
            }
          : base.realtimeReports,
        related: patch.related ?? base.related,
        implementation: patch.implementation ?? base.implementation,
        demoCta: patch.demoCta ? { ...base.demoCta, ...patch.demoCta } : base.demoCta,
        seoBlocks: patch.seoBlocks ?? base.seoBlocks,
        faqs: patch.faqs ? [...patch.faqs, ...base.faqs] : base.faqs,
      }

  const templated = applyPremiumSoftwareTemplate(merged, { slug, kind, displayName, rich, lang })

  let out: SoftwareDetailPageData = templated
  if (lang === 'ar') {
    return out
  }
  if (patch?.vouchersReports) {
    out = { ...out, vouchersReports: patch.vouchersReports }
  }
  if (slug === 'inventory-management-software' && kind === 'module') {
    out = mergeInventoryManagementPremiumPage(out)
  }
  if (slug === 'payroll-management-software' && kind === 'module') {
    out = mergePayrollManagementPremiumPage(out)
  }
  if (slug === 'production-management-software' && kind === 'module') {
    out = mergeProductionManagementPremiumPage(out)
  }
  if (slug === 'point-of-sale-management-software' && kind === 'module') {
    out = mergePosManagementPremiumPage(out)
  }
  if (slug === 'fbr-pos-integration-software' && kind === 'module') {
    out = mergeFbrPosIntegrationPremiumPage(out)
  }
  if (slug === 'crm-software' && kind === 'module') {
    out = mergeCrmPremiumPage(out)
  }
  if (slug === 'integration-system' && kind === 'module') {
    out = mergeSmsIntegrationPremiumPage(out)
  }
  if (slug === 'grocery-store-management-software' && kind === 'industry') {
    out = mergeGroceryStoreIndustryPage(out)
  }
  if (slug === 'toy-shop-management-software' && kind === 'industry') {
    out = mergeToyShopIndustryPage(out)
  }
  if (slug === 'hardware-sanitary-store-software' && kind === 'industry') {
    out = mergeHardwareSanitaryIndustryPage(out)
  }
  if (slug === 'luggage-bags-store-software' && kind === 'industry') {
    out = mergeLuggageBagsIndustryPage(out)
  }
  if (slug === 'crockery-store-management-software' && kind === 'industry') {
    out = mergeCrockeryStoreIndustryPage(out)
  }
  if (slug === 'retail-management-software' && kind === 'industry') {
    out = mergeRetailManagementIndustryPage(out)
  }
  if (slug === 'logistics-transportation-software' && kind === 'industry') {
    out = mergeLogisticsTransportationIndustryPage(out)
  }
  if (slug === 'motor-market-management-software' && kind === 'industry') {
    out = mergeMotorMarketIndustryPage(out)
  }
  if (slug === 'poultry-chicken-supply-management-software' && kind === 'industry') {
    out = mergePoultryChickenSupplyIndustryPage(out)
  }
  if (slug === 'poultry-waste-management-software' && kind === 'industry') {
    out = mergePoultryWasteIndustryPage(out)
  }
  if (slug === 'poultry-control-shed-management-software' && kind === 'industry') {
    out = mergePoultryControlShedIndustryPage(out)
  }
  if (slug === 'fabric-store-management-software' && kind === 'industry') {
    out = mergeFabricStoreIndustryPage(out)
  }
  if (slug === 'knitting-dyeing-industry-software' && kind === 'industry') {
    out = mergeKnittingDyeingIndustryPage(out)
  }
  if (slug === 'cloud-erp-software-for-textile-industries' && kind === 'industry') {
    out = mergeTextileIndustryErpPage(out)
  }
  if (slug === 'oil-and-gas-business-management-software' && kind === 'industry') {
    out = mergeFuelTankLorryIndustryPage(out)
  }
  if (slug === 'petrol-gas-filling-station-software' && kind === 'industry') {
    out = mergePetrolDepotIndustryPage(out)
  }
  if (slug === 'petrol-depot-management-software' && kind === 'industry') {
    out = mergePetrolDepotIndustryPage(out)
  }
  if (slug === 'fleet-fuel-management-software' && kind === 'industry') {
    out = mergeFleetFuelIndustryPage(out)
  }
  if (slug === 'lpg-business-software' && kind === 'industry') {
    out = mergeLpgErpIndustryPage(out)
  }
  if (slug === 'lpg-bowser-supply-chain-software' && kind === 'industry') {
    out = mergeLpgBowserIndustryPage(out)
  }
  if (slug === 'petrol-pump-software' && kind === 'industry') {
    out = mergePetrolPumpIndustryPage(out)
  }
  if (slug === 'fuel-tank-lorry-management-software' && kind === 'industry') {
    out = mergeFuelTankLorryIndustryPage(out)
  }
  if (slug === 'poultry-arhat-software' && kind === 'industry') {
    out = mergePoultryChickenSupplyIndustryPage(out)
  }
  if (slug === 'dairy-farm-management-software' && kind === 'industry') {
    out = mergeDairyFarmIndustryPage(out)
  }
  if (slug === 'cloud-erp-software-for-agriculture-business' && kind === 'industry') {
    out = mergeAgricultureIndustryPage(out)
  }
  if (slug === 'garments-manufacturing-software' && kind === 'industry') {
    out = mergeGarmentsManufacturingIndustryPage(out)
  }
  if (slug === 'candy-and-confectionery-manufacturing-software' && kind === 'industry') {
    out = mergeCandyManufacturingIndustryPage(out)
  }
  if (slug === 'software-for-visa-immigration-consultants' && kind === 'industry') {
    out = mergeVisaImmigrationIndustryPage(out)
  }
  if (slug === 'hotel-management-software' && kind === 'industry') {
    out = mergeHotelManagementIndustryPage(out)
  }
  if (slug === 'pharmacy-business-management-software' && kind === 'industry') {
    out = mergePharmacyBusinessIndustryPage(out)
  }
  if (slug === 'homeopathic-business-management-software' && kind === 'industry') {
    out = mergeHomeopathicBusinessIndustryPage(out)
  }
  if (slug === 'computers-laptop-business-software' && kind === 'industry') {
    out = mergeComputersLaptopIndustryPage(out)
  }
  if (slug === 'electronics-management-software' && kind === 'industry') {
    out = mergeElectronicsManagementIndustryPage(out)
  }
  if (slug === 'electric-store-management-software' && kind === 'industry') {
    out = mergeElectricStoreIndustryPage(out)
  }
  if (slug === 'mobile-accessories-business-software' && kind === 'industry') {
    out = mergeMobileAccessoriesIndustryPage(out)
  }
  if (slug === 'ev-charging-station-management-software' && kind === 'industry') {
    out = mergeEvChargingIndustryPage(out)
  }
  if (slug === 'auto-parts-business-software' && kind === 'industry') {
    out = mergeAutoPartsBusinessIndustryPage(out)
  }
  if (slug === 'erp-software-for-real-estate-business' && kind === 'industry') {
    out = mergeRealEstateBusinessIndustryPage(out)
  }
  if (slug === 'erp-software-for-construction-business' && kind === 'industry') {
    out = mergeConstructionBusinessIndustryPage(out)
  }
  return out
}
