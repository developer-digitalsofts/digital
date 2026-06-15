import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { PremiumSoftwareDetailView } from '../components/software/PremiumSoftwareDetailView'
import { SoftwareDetailView } from '../components/software/SoftwareDetailView'
import { applyCmsToDetailPage, applyCmsToRichPage } from '../cms/applySoftwareDetailCms'
import { apiBase } from '../cms/api'
import type { SoftwareDetailCmsRecord } from '../cms/softwareDetailTypes'
import { buildAccountsManagementSoftwareDetail } from '../data/softwareDetail/accountsManagementDetail'
import { buildSoftwareDetailPageData } from '../data/softwareDetail/expandDetailPage'
import { getIndustryRichPage } from '../data/industryRichPages'
import { findSoftwareBySlug, moduleMegaItems } from '../data/megaMenu'
import { softwarePath } from '../utils/slug'
import { getModuleRichPage, type ModuleRichPage } from '../data/moduleRichPages'
import { useI18n } from '../i18n/I18nProvider'
import { megaIndustryLabel, megaModuleLabel } from '../i18n/megaLabels'
import { pick } from '../cms/pick'

function fallbackModulePage(name: string, t: (path: string) => string): ModuleRichPage {
  return {
    headline: name,
    subhead: t('softwarePage.fallbackSubhead'),
    intro: t('softwarePage.fallbackIntro').replace(/\{name\}/g, name),
    highlights: [t('softwarePage.fallbackHl1'), t('softwarePage.fallbackHl2'), t('softwarePage.fallbackHl3')],
    capabilities: [
      { title: t('softwarePage.fallbackCap1t'), body: t('softwarePage.fallbackCap1b') },
      { title: t('softwarePage.fallbackCap2t'), body: t('softwarePage.fallbackCap2b') },
      { title: t('softwarePage.fallbackCap3t'), body: t('softwarePage.fallbackCap3b') },
    ],
    workflows: [
      { step: t('softwarePage.fallbackW1s'), detail: t('softwarePage.fallbackW1d') },
      { step: t('softwarePage.fallbackW2s'), detail: t('softwarePage.fallbackW2d') },
      { step: t('softwarePage.fallbackW3s'), detail: t('softwarePage.fallbackW3d') },
    ],
    outcomes: [t('softwarePage.fallbackO1'), t('softwarePage.fallbackO2'), t('softwarePage.fallbackO3')],
  }
}

export function SoftwarePage() {
  const params = useParams<{ flatSlug?: string; kind?: string; slug?: string }>()
  const { lang, t } = useI18n()
  const [cmsRecord, setCmsRecord] = useState<SoftwareDetailCmsRecord | null>(null)
  const [cmsReady, setCmsReady] = useState(false)

  const routeKind: 'module' | 'industry' | undefined =
    params.flatSlug ? 'module' : params.kind === 'module' || params.kind === 'industry' ? params.kind : undefined
  const routeSlug = params.flatSlug ?? params.slug

  useEffect(() => {
    let cancelled = false
    setCmsReady(false)
    if (!routeKind || !routeSlug) {
      setCmsRecord(null)
      setCmsReady(true)
      return
    }
    fetch(`${apiBase()}/api/software-detail/${routeKind}/${encodeURIComponent(routeSlug)}`)
      .then(async (res) => (res.ok ? ((await res.json()) as { page?: SoftwareDetailCmsRecord }) : null))
      .then((data) => {
        if (!cancelled) {
          setCmsRecord(data?.page ?? null)
          setCmsReady(true)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setCmsRecord(null)
          setCmsReady(true)
        }
      })
    return () => {
      cancelled = true
    }
  }, [routeKind, routeSlug])

  const menuItem = routeSlug
    ? params.flatSlug
      ? findSoftwareBySlug(params.flatSlug, 'module')
      : findSoftwareBySlug(params.slug, routeKind)
    : undefined

  const customCms = cmsRecord?.isCustom && cmsRecord.active !== false ? cmsRecord : null

  const item =
    menuItem ??
    (customCms
      ? {
          slug: customCms.slug,
          labelEn: customCms.label.en || customCms.slug,
          to: softwarePath(customCms.kind, customCms.slug),
        }
      : undefined)

  const treatAsModule =
    item != null &&
    (customCms?.kind === 'module' || (!customCms && moduleMegaItems.some((m) => m.slug === item.slug)))
  const treatAsIndustry = Boolean(item) && !treatAsModule

  const displayName =
    item == null
      ? ''
      : cmsRecord && (cmsRecord.label.en || cmsRecord.label.ar)
        ? pick(cmsRecord.label, lang)
        : treatAsModule
          ? megaModuleLabel(lang, item.slug, item.labelEn)
          : megaIndustryLabel(lang, item.slug, item.labelEn)

  const canonicalSlug = item?.slug

  const moduleRich =
    item && treatAsModule && canonicalSlug
      ? getModuleRichPage(canonicalSlug, lang) ?? fallbackModulePage(displayName, t)
      : undefined

  const industryArTitle = item && treatAsIndustry ? megaIndustryLabel(lang, item.slug, item.labelEn) : ''

  const industryRich =
    item && treatAsIndustry && canonicalSlug
      ? getIndustryRichPage(canonicalSlug, item.labelEn, lang, industryArTitle)
      : undefined

  const baseRich = moduleRich ?? industryRich ?? (customCms ? fallbackModulePage(displayName, t) : undefined)

  const rich = useMemo(
    () => (baseRich ? applyCmsToRichPage(baseRich, cmsRecord, lang) : undefined),
    [baseRich, cmsRecord, lang],
  )

  const isModule = treatAsModule || customCms?.kind === 'module'

  const detail = useMemo(() => {
    if (!canonicalSlug || !rich) return null
    let built =
      canonicalSlug === 'accounts-management-software' && treatAsModule
        ? buildAccountsManagementSoftwareDetail(lang)
        : buildSoftwareDetailPageData(
            canonicalSlug,
            isModule ? 'module' : 'industry',
            displayName,
            rich,
            lang,
          )
    if (cmsRecord?.active === false && cmsRecord.isCustom) return null
    built = applyCmsToDetailPage(built, cmsRecord, lang)
    return built
  }, [canonicalSlug, treatAsModule, isModule, displayName, rich, lang, cmsRecord])

  if (!cmsReady) {
    return (
      <main className="flex min-h-[40vh] items-center justify-center text-sm text-slate-600">
        <span className="size-5 animate-spin rounded-full border-2 border-brand border-t-transparent" aria-hidden />
      </main>
    )
  }

  if (!item) {
    return (
      <main className="min-h-[60vh] border-b border-slate-100 bg-slate-50/50 px-4 py-12 lg:px-6">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-2xl font-bold text-slate-900">{t('softwarePage.notFoundTitle')}</h1>
          <p className="mt-3 text-slate-600">{t('softwarePage.notFoundBody')}</p>
          <Link to="/" className="mt-8 inline-flex rounded-2xl bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
            {t('softwarePage.notFoundHome')}
          </Link>
        </div>
      </main>
    )
  }

  if (!rich || !detail) {
    return (
      <main className="border-b border-slate-100 bg-white">
        <div className="mx-auto max-w-3xl px-4 py-10 lg:px-6">
          <p className="text-sm font-bold uppercase tracking-wider text-brand">{t('softwarePage.loadErrorTitle')}</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">{displayName}</h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-600">{t('softwarePage.loadErrorBody')}</p>
        </div>
      </main>
    )
  }

  const crumbMid = isModule ? t('softwarePage.crumbModules') : t('softwarePage.crumbIndustries')

  if ((detail.accounts ?? detail.premiumLayout) && canonicalSlug) {
    return (
      <PremiumSoftwareDetailView
        detail={detail}
        displayName={displayName}
        crumbMid={crumbMid}
        crumbHome={t('softwarePage.crumbHome')}
        slug={canonicalSlug}
        showBreadcrumb={false}
      />
    )
  }

  return (
    <SoftwareDetailView
      detail={detail}
      displayName={displayName}
      crumbMid={crumbMid}
      crumbHome={t('softwarePage.crumbHome')}
      isModule={isModule}
      slug={canonicalSlug!}
    />
  )
}
