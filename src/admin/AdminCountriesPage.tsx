import { useEffect, useMemo, useState } from 'react'
import type { Bilingual } from '../cms/types'
import type { CountriesDoc, CountryProfile } from '../types/countriesContent'
import { GCC_COUNTRY_CODES } from '../config/gccCountries'
import { useAdminSection } from './hooks/useAdminSection'
import { useAdminToast } from './AdminToastContext'
import { BilingualInputs } from './cms/BilingualInputs'
import { AdminFormActions } from './cms/AdminFormActions'
import { adminFetch } from './adminApi'

type RoutingStatus = {
  countryCode: string
  englishPublished: boolean
  arabicPublished: boolean
}

const emptyBi = (): Bilingual => ({ en: '', ar: '' })

function sortItems(items: CountryProfile[]) {
  return [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}

export function AdminCountriesPage() {
  const toast = useAdminToast()
  const sec = useAdminSection<CountriesDoc>('countries')
  const [local, setLocal] = useState<CountriesDoc | null>(null)
  const [baseline, setBaseline] = useState('')
  const [routingStatus, setRoutingStatus] = useState<RoutingStatus[]>([])

  useEffect(() => {
    if (!sec.data) return
    const d = { ...sec.data, items: sortItems(sec.data.items || []) }
    setLocal(d)
    setBaseline(JSON.stringify(d))
  }, [sec.data])

  useEffect(() => {
    adminFetch<{ items?: RoutingStatus[] }>('/api/admin/locale/routing-status')
      .then((payload) => {
        if (payload?.items) setRoutingStatus(payload.items)
      })
      .catch(() => {})
  }, [])

  const dirty = useMemo(() => (local ? JSON.stringify(local) !== baseline : false), [local, baseline])

  const updateItem = (code: string, patch: Partial<CountryProfile>) => {
    if (!local) return
    setLocal({
      ...local,
      items: local.items.map((item) => (item.code === code ? { ...item, ...patch } : item)),
    })
  }

  const save = async () => {
    if (!local) return
    const out = { ...local, schemaVersion: 1, items: sortItems(local.items) }
    await sec.save(out as CountriesDoc & Record<string, unknown>)
    setBaseline(JSON.stringify(out))
    toast.push('GCC countries saved', 'success')
  }

  if (sec.loading || !local) {
    return <p className="py-8 text-sm text-slate-600">Loading GCC countries…</p>
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900">GCC Countries</h2>
        <p className="text-sm text-slate-600">
          Manage regional contact details and availability for UAE, KSA, Kuwait, Qatar, Bahrain and Oman. Unset fields inherit from the default country (UAE).
        </p>
      </div>

      <label className="block text-sm font-semibold text-slate-700">
        Default country code
        <select
          className="mt-1 w-full max-w-xs rounded-xl border border-slate-200 px-3 py-2"
          value={local.defaultCountryCode || 'AE'}
          onChange={(e) => setLocal({ ...local, defaultCountryCode: e.target.value as CountriesDoc['defaultCountryCode'] })}
        >
          {GCC_COUNTRY_CODES.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </label>

      <div className="space-y-5">
        {local.items.map((item) => (
          <section key={item.code} className="rounded-xl border border-slate-200 p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-bold text-slate-900">
                {item.code} {item.isDefault ? '· default' : ''}
              </h3>
              <label className="flex items-center gap-2 text-sm font-semibold">
                <input type="checkbox" checked={item.enabled !== false} onChange={(e) => updateItem(item.code, { enabled: e.target.checked })} />
                Enabled in selector
              </label>
            </div>
            <BilingualInputs labelEn="Country name" labelAr="Country name (AR)" value={item.name} onChange={(name: Bilingual) => updateItem(item.code, { name })} />
            <BilingualInputs labelEn="Short name" labelAr="Short name (AR)" value={item.shortName || emptyBi()} onChange={(shortName: Bilingual) => updateItem(item.code, { shortName })} />
            <div className="grid gap-3 md:grid-cols-3">
              <label className="text-sm">
                Currency
                <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={item.currency || ''} onChange={(e) => updateItem(item.code, { currency: e.target.value })} />
              </label>
              <label className="text-sm">
                Phone code
                <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={item.phoneCode || ''} onChange={(e) => updateItem(item.code, { phoneCode: e.target.value })} />
              </label>
              <label className="text-sm">
                Sort order
                <input type="number" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={item.sortOrder ?? 0} onChange={(e) => updateItem(item.code, { sortOrder: Number(e.target.value) || 0 })} />
              </label>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-sm">
                Primary email
                <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={item.primaryEmail || ''} onChange={(e) => updateItem(item.code, { primaryEmail: e.target.value })} />
              </label>
              <label className="text-sm">
                WhatsApp number
                <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={item.whatsappNumber || ''} onChange={(e) => updateItem(item.code, { whatsappNumber: e.target.value })} />
              </label>
              <label className="text-sm">
                Phone display
                <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={item.phoneDisplay || ''} onChange={(e) => updateItem(item.code, { phoneDisplay: e.target.value })} />
              </label>
              <label className="text-sm">
                Phone href
                <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={item.phoneHref || ''} onChange={(e) => updateItem(item.code, { phoneHref: e.target.value })} />
              </label>
            </div>
            <BilingualInputs labelEn="Office address" labelAr="Office address (AR)" multiline rows={2} value={item.officeAddress || emptyBi()} onChange={(officeAddress: Bilingual) => updateItem(item.code, { officeAddress })} />
            <BilingualInputs labelEn="Working hours" labelAr="Working hours (AR)" value={item.workingHours || emptyBi()} onChange={(workingHours: Bilingual) => updateItem(item.code, { workingHours })} />

            <div className="rounded-lg border border-slate-100 bg-slate-50/80 p-3 space-y-2">
              <h4 className="text-sm font-bold text-slate-900">Automatic routing</h4>
              <p className="text-xs text-slate-600">
                Controls whether visitors opening the site root are redirected to this country&apos;s published locale.
              </p>
              <div className="flex flex-wrap gap-4 text-sm">
                <label className="flex items-center gap-2 font-semibold">
                  <input
                    type="checkbox"
                    checked={item.autoDetectEnabled !== false}
                    onChange={(e) => updateItem(item.code, { autoDetectEnabled: e.target.checked })}
                  />
                  Auto-detect enabled
                </label>
                <label className="flex items-center gap-2 font-semibold">
                  <input
                    type="checkbox"
                    checked={item.allowAutoRedirect !== false}
                    onChange={(e) => updateItem(item.code, { allowAutoRedirect: e.target.checked })}
                  />
                  Allow auto-redirect
                </label>
                <label className="text-sm">
                  Default language
                  <select
                    className="mt-1 block rounded-lg border border-slate-200 px-2 py-1.5"
                    value={item.defaultLanguage || 'en'}
                    onChange={(e) => updateItem(item.code, { defaultLanguage: e.target.value as 'en' | 'ar' })}
                  >
                    <option value="en">English</option>
                    <option value="ar">Arabic</option>
                  </select>
                </label>
              </div>
              {(() => {
                const status = routingStatus.find((row) => row.countryCode === item.code)
                if (!status) return null
                return (
                  <p className="text-xs text-slate-600">
                    English published: {status.englishPublished ? 'Yes' : 'No'} · Arabic approved/public:{' '}
                    {status.arabicPublished ? 'Yes' : 'No'}
                  </p>
                )
              })()}
            </div>
          </section>
        ))}
      </div>

      <AdminFormActions
        saving={sec.saving}
        publishing={sec.publishing}
        onSave={save}
        onPublish={async () => {
          await save()
          await sec.publish()
          toast.push('GCC countries published', 'success')
        }}
        onCancel={() => {
          try {
            setLocal(JSON.parse(baseline) as CountriesDoc)
          } catch {
            /* */
          }
        }}
        disableSave={!dirty}
        statusLabel={sec.publishStatus?.status || null}
      />
    </div>
  )
}
