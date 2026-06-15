import { useCallback, useEffect, useMemo, useState, type MouseEvent, type ReactNode } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { AdminJsonEditor } from './AdminJsonEditor'
import { HomeHeroForm } from './home/HomeHeroForm'
import { HomeStatsForm } from './home/HomeStatsForm'
import { HomeAboutForm } from './home/HomeAboutForm'
import { HomeValueChainForm } from './home/HomeValueChainForm'
import { HomeModulesForm } from './home/HomeModulesForm'
import { HomeWorkflowForm } from './home/HomeWorkflowForm'
import { HomeIndustriesForm } from './home/HomeIndustriesForm'
import { HomeFaqsForm } from './home/HomeFaqsForm'
import { HomeCtaForm } from './home/HomeCtaForm'
import { HomeVisibilityForm } from './home/HomeVisibilityForm'
import { AdminPanelErrorBoundary } from './cms/AdminPanelErrorBoundary'
import { AdminButtonTabs } from './cms/AdminButtonTabs'
import {
  adminHomeEditorContextFromPath,
  defaultTabForContext,
  normalizeAdminHomeTab,
  tabsForContext,
  type AdminHomeEditorContext,
  type AdminHomeEditorTabId,
} from './home/adminHomeEditorTabs'

const DEV_JSON_KEY = 'dm_cms_dev_json'

type TabId = AdminHomeEditorTabId

type LocationPanelState = { adminPanel?: TabId }

function readDevJsonFlag(): boolean {
  try {
    return localStorage.getItem(DEV_JSON_KEY) === '1'
  } catch {
    return false
  }
}

function writeDevJsonFlag(v: boolean) {
  try {
    if (v) localStorage.setItem(DEV_JSON_KEY, '1')
    else localStorage.removeItem(DEV_JSON_KEY)
  } catch {
    /* ignore */
  }
}

function readInitialTab(
  context: AdminHomeEditorContext,
  searchParams: URLSearchParams,
  state: LocationPanelState | null,
): TabId {
  const allowed = tabsForContext(context)
  const fromState = state?.adminPanel
  if (fromState && allowed.some((t) => t.tab === fromState)) return fromState
  const fromPanel = searchParams.get('panel') ?? searchParams.get('tab')
  if (fromPanel) return normalizeAdminHomeTab(fromPanel, context)
  return defaultTabForContext(context)
}

function TabPanel({ tab, context }: { tab: TabId; context: AdminHomeEditorContext }) {
  const label = tabsForContext(context).find((t) => t.tab === tab)?.label ?? HOME_EDITOR_TAB_LABELS[tab] ?? 'Section'
  let panel: ReactNode = null
  switch (tab) {
    case 'hero':
      panel = <HomeHeroForm />
      break
    case 'stats':
      panel = <HomeStatsForm />
      break
    case 'about':
      panel = <HomeAboutForm />
      break
    case 'features':
      panel = <HomeValueChainForm />
      break
    case 'modules':
      panel = <HomeModulesForm />
      break
    case 'workflow':
      panel = <HomeWorkflowForm />
      break
    case 'industries':
      panel = <HomeIndustriesForm />
      break
    case 'faqs':
      panel = <HomeFaqsForm />
      break
    case 'cta':
      panel = <HomeCtaForm />
      break
    case 'visibility':
      panel = <HomeVisibilityForm />
      break
    default:
      panel = <p className="text-sm text-slate-600">Select a section tab above.</p>
  }
  return <AdminPanelErrorBoundary title={`${label} could not be loaded`}>{panel}</AdminPanelErrorBoundary>
}

const HOME_EDITOR_TAB_LABELS: Partial<Record<TabId, string>> = {
  hero: 'Hero',
  stats: 'Stats',
  about: 'About',
  features: 'Features',
  modules: 'ERP Modules',
  workflow: 'Workflow CTA',
  industries: 'Industries',
  faqs: 'FAQs',
  cta: 'Final CTA',
  visibility: 'Visibility',
}

const PAGE_TITLES: Record<AdminHomeEditorContext, string> = {
  homepage: 'Home Page Sections',
  'erp-modules': 'ERP Modules',
  industries: 'Industries',
}

const PAGE_INTROS: Record<AdminHomeEditorContext, string> = {
  homepage:
    'Edit each homepage block using the forms below. Changes are saved to the same JSON files the live site reads.',
  'erp-modules':
    'Manage ERP module cards and related homepage sections. Tab switches stay inside this admin screen — nothing opens on the public website.',
  industries:
    'Manage industry solutions and related homepage sections. Tab switches stay inside this admin screen — nothing opens on the public website.',
}

export function AdminHomePageEditor() {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const context = useMemo(() => adminHomeEditorContextFromPath(location.pathname), [location.pathname])
  const visibleTabs = useMemo(() => tabsForContext(context), [context])
  const [activeTab, setActiveTab] = useState<TabId>(() =>
    readInitialTab(context, searchParams, location.state as LocationPanelState | null),
  )
  const [showDevJson, setShowDevJson] = useState(readDevJsonFlag)

  useEffect(() => {
    setShowDevJson(readDevJsonFlag())
  }, [])

  useEffect(() => {
    setActiveTab(readInitialTab(context, searchParams, location.state as LocationPanelState | null))
  }, [context, location.pathname, location.state, searchParams])

  useEffect(() => {
    if (!visibleTabs.some((t) => t.tab === activeTab)) {
      setActiveTab(defaultTabForContext(context))
    }
  }, [activeTab, context, visibleTabs])

  const setTab = useCallback((tab: TabId, e?: MouseEvent<HTMLButtonElement>) => {
    e?.preventDefault()
    e?.stopPropagation()
    setActiveTab(tab)
  }, [])

  const active = visibleTabs.find((t) => t.tab === activeTab) ?? visibleTabs[0]

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{PAGE_TITLES[context]}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          {PAGE_INTROS[context]} Use the{' '}
          <strong className="font-semibold text-slate-800">Visibility</strong> tab to show or hide sections.
        </p>
        {context === 'homepage' ? (
          <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-800">
            <input
              type="checkbox"
              checked={showDevJson}
              onChange={(e) => {
                const v = e.target.checked
                setShowDevJson(v)
                writeDevJsonFlag(v)
              }}
            />
            Advanced: show raw JSON editor (developer)
          </label>
        ) : null}
      </header>

      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
        <AdminButtonTabs
          tabs={visibleTabs.map((t) => ({ id: t.tab, label: t.label }))}
          activeTab={activeTab}
          onTabChange={setTab}
          ariaLabel={`${PAGE_TITLES[context]} sections`}
        />

        <div className="p-4 sm:p-6" role="tabpanel">
          <TabPanel tab={activeTab} context={context} />
          {showDevJson && context === 'homepage' && active ? (
            <div className="mt-8 border-t border-dashed border-slate-300 pt-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-amber-800">Raw JSON — {active.section}.json</p>
              <AdminJsonEditor key={active.section} section={active.section} title={`${active.label} (JSON)`} embedded />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
