import { useCallback, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { AdminCityProvider, useAdminCity } from './AdminCityContext'
import { AdminCityContextBar } from './AdminCityContextBar'
import { AdminCitySectionBanner } from './AdminCitySectionBanner'
import { AdminPanelErrorBoundary } from './cms/AdminPanelErrorBoundary'
import { AdminButtonTabs } from './cms/AdminButtonTabs'
import { HomeHeroForm } from './home/HomeHeroForm'
import { HomeStatsForm } from './home/HomeStatsForm'
import { HomeIndustriesForm } from './home/HomeIndustriesForm'
import { HomeValueChainForm } from './home/HomeValueChainForm'
import { HomeDemoCtaForm } from './home/HomeDemoCtaForm'
import { HomeModulesForm } from './home/HomeModulesForm'
import { HomeTestimonialsForm } from './home/HomeTestimonialsForm'
import { HomePersonalizedDemoForm } from './home/HomePersonalizedDemoForm'
import { HomeFaqsForm } from './home/HomeFaqsForm'
import { HomeVisibilityForm } from './home/HomeVisibilityForm'
import { AdminCitySeoForm } from './AdminCitySeoForm'
import { HOME_EDITOR_TABS, type AdminHomeEditorTabId } from './home/adminHomeEditorTabs'

const CITY_TABS = [
  ...HOME_EDITOR_TABS,
  { tab: 'seo' as const, section: 'seo', label: 'SEO & Open Graph' },
]

type CityEditorTab = AdminHomeEditorTabId | 'seo'

function CityHomeEditorInner() {
  const { citySlug } = useAdminCity()
  const [activeTab, setActiveTab] = useState<CityEditorTab>('hero')

  const tabs = useMemo(() => CITY_TABS, [])

  const panel = useCallback(() => {
    if (!citySlug) {
      return <p className="text-sm text-slate-600">Select a city above to edit its homepage sections.</p>
    }
    switch (activeTab) {
      case 'hero':
        return <HomeHeroForm />
      case 'stats':
        return <HomeStatsForm />
      case 'about':
        return <HomeIndustriesForm />
      case 'features':
        return <HomeValueChainForm />
      case 'demoCta':
        return <HomeDemoCtaForm />
      case 'modules':
        return <HomeModulesForm />
      case 'testimonials':
        return <HomeTestimonialsForm />
      case 'personalizedDemo':
        return <HomePersonalizedDemoForm />
      case 'faqs':
        return <HomeFaqsForm />
      case 'visibility':
        return <HomeVisibilityForm />
      case 'seo':
        return <AdminCitySeoForm />
      default:
        return null
    }
  }, [activeTab, citySlug])

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <AdminCityContextBar />
      {citySlug ? <AdminCitySectionBanner section={activeTab === 'about' ? 'industries' : activeTab === 'features' ? 'valueChain' : activeTab === 'visibility' ? 'pageSections' : activeTab} /> : null}
      <header className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">City Homepage CMS</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Edit homepage sections for the selected city. Unspecified sections inherit the Pakistan national homepage. Overrides are stored per city and do not affect other cities.
        </p>
      </header>
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm">
        <AdminButtonTabs
          tabs={tabs.map((t) => ({ id: t.tab, label: t.label }))}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          ariaLabel="City homepage sections"
        />
        <div className="p-4 sm:p-6">
          <AdminPanelErrorBoundary title="City section editor failed to load">{panel()}</AdminPanelErrorBoundary>
        </div>
      </div>
    </div>
  )
}

export function AdminCityHomeEditor() {
  const { citySlug = '' } = useParams()
  return (
    <AdminCityProvider initialCitySlug={citySlug || null} cityRequired>
      <CityHomeEditorInner />
    </AdminCityProvider>
  )
}

export function AdminCityHubPage() {
  return (
    <AdminCityProvider cityRequired={false}>
      <AdminCityHubInner />
    </AdminCityProvider>
  )
}

function AdminCityHubInner() {
  const { cities, citySlug, setCitySlug } = useAdminCity()

  return (
    <div className="space-y-6">
      <AdminCityContextBar showProductLink={false} />
      <div>
        <h2 className="text-xl font-bold text-slate-900">City Pages</h2>
        <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
          Manage individual Pakistan city websites. Unspecified fields inherit the main Pakistan website.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cities.map((city) => (
          <a
            key={city.slug}
            href={`/admin/content/cities/${city.slug}/home`}
            className={`rounded-xl border p-4 transition hover:border-brand hover:shadow-sm ${citySlug === city.slug ? 'border-brand bg-brand/5' : 'border-slate-200 bg-white'}`}
            onClick={(e) => {
              e.preventDefault()
              setCitySlug(city.slug)
              window.location.href = `/admin/content/cities/${city.slug}/home`
            }}
          >
            <p className="font-semibold text-slate-900">{city.name}</p>
            <p className="mt-1 font-mono text-xs text-slate-500">/{city.slug}</p>
          </a>
        ))}
      </div>
    </div>
  )
}
