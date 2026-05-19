import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
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

const DEV_JSON_KEY = 'dm_cms_dev_json'

const TABS = [
  { tab: 'hero', section: 'hero', label: 'Hero' },
  { tab: 'stats', section: 'stats', label: 'Stats' },
  { tab: 'about', section: 'about', label: 'About' },
  { tab: 'features', section: 'valueChain', label: 'Features' },
  { tab: 'modules', section: 'modules', label: 'ERP Modules' },
  { tab: 'workflow', section: 'workflow', label: 'Workflow CTA' },
  { tab: 'industries', section: 'industries', label: 'Industries' },
  { tab: 'faqs', section: 'faqs', label: 'FAQs' },
  { tab: 'cta', section: 'cta', label: 'Final CTA' },
  { tab: 'visibility', section: 'pageSections', label: 'Visibility' },
] as const

type TabId = (typeof TABS)[number]['tab']

function normalizeTab(raw: string | null): TabId {
  const hit = TABS.find((t) => t.tab === raw)
  return hit?.tab ?? 'hero'
}

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

function TabPanel({ tab }: { tab: TabId }) {
  switch (tab) {
    case 'hero':
      return <HomeHeroForm />
    case 'stats':
      return <HomeStatsForm />
    case 'about':
      return <HomeAboutForm />
    case 'features':
      return <HomeValueChainForm />
    case 'modules':
      return <HomeModulesForm />
    case 'workflow':
      return <HomeWorkflowForm />
    case 'industries':
      return <HomeIndustriesForm />
    case 'faqs':
      return <HomeFaqsForm />
    case 'cta':
      return <HomeCtaForm />
    case 'visibility':
      return <HomeVisibilityForm />
    default:
      return null
  }
}

export function AdminHomePageEditor() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = useMemo(() => normalizeTab(searchParams.get('tab')), [searchParams])
  const [showDevJson, setShowDevJson] = useState(readDevJsonFlag)

  useEffect(() => {
    setShowDevJson(readDevJsonFlag())
  }, [])

  const setTab = useCallback(
    (tab: TabId) => {
      setSearchParams({ tab }, { replace: true })
    },
    [setSearchParams],
  )

  const active = TABS.find((t) => t.tab === activeTab)!

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Home Page Sections</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Edit each homepage block using the forms below. Changes are saved to the same JSON files the live site reads. Use the{' '}
          <strong className="font-semibold text-slate-800">Visibility</strong> tab to show or hide sections.
        </p>
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
      </header>

      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
        <div
          role="tablist"
          aria-label="Homepage sections"
          className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50/80 p-2 sm:flex-nowrap sm:overflow-x-auto"
        >
          {TABS.map((t) => {
            const isActive = t.tab === activeTab
            return (
              <button
                key={t.tab}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setTab(t.tab)}
                className={`shrink-0 rounded-xl px-3.5 py-2 text-xs font-bold uppercase tracking-wide transition-colors sm:text-[13px] ${
                  isActive ? 'bg-brand text-white shadow-md' : 'text-slate-600 hover:bg-orange-100/80 hover:text-slate-900'
                }`}
              >
                {t.label}
              </button>
            )
          })}
        </div>

        <div className="p-4 sm:p-6" role="tabpanel">
          <TabPanel tab={activeTab} />
          {showDevJson ? (
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
