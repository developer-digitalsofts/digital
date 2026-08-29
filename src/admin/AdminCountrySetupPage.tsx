import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminFetch } from './adminApi'
import { AdminLocaleContextBar } from './AdminLocaleContextBar'
import { AdminLocaleItemStatus } from './AdminLocaleItemStatus'
import { useAdminLocale } from './AdminLocaleContext'
import type { CountrySetupMode } from '../types/localeContent'

const COUNTRY_OPTIONS = [{ code: 'PK', label: 'Pakistan' }] as const

type SetupReport = {
  country: string
  languages: string[]
  mode: string
  pagesPrepared: number
  sectionsPrepared: number
  draftRecordsCreated: number
  missingTranslations: string[]
  sharedRecordsLinked: number
  rolledBack?: boolean
  errors?: string[]
}

export function AdminCountrySetupPage() {
  const { setCountry } = useAdminLocale()
  const navigate = useNavigate()
  const [countryCode, setCountryCode] = useState('PK')
  const [languages, setLanguages] = useState<Array<'en' | 'ar'>>(['en'])
  const [mode, setMode] = useState<CountrySetupMode>('structure_only')
  const [status, setStatus] = useState<'idle' | 'running' | 'done' | 'error'>('idle')
  const [report, setReport] = useState<SetupReport | null>(null)
  const [error, setError] = useState<string | null>(null)

  const canRun = useMemo(() => countryCode === 'PK' && languages.length > 0, [countryCode, languages])

  const toggleLang = (lang: 'en' | 'ar') => {
    setLanguages((prev) => (prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]))
  }

  const runSetup = useCallback(async () => {
    if (!canRun) return
    setStatus('running')
    setError(null)
    try {
      const res = await adminFetch<{ ok: boolean; report: SetupReport }>('/api/admin/countries/setup', {
        method: 'POST',
        body: JSON.stringify({ countryCode, languages, mode }),
      })
      setReport(res.report)
      setStatus('done')
      setCountry(countryCode.toLowerCase() as 'pk')
    } catch (e) {
      setStatus('error')
      setError(e instanceof Error ? e.message : 'Setup failed')
    }
  }, [canRun, countryCode, languages, mode, setCountry])

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (status === 'running') {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [status])

  return (
    <div className="space-y-6">
      <AdminLocaleContextBar />

      <AdminLocaleItemStatus globalIdentity="erp" contentType="solution" slug="erp" />

      <div>
        <h2 className="text-xl font-bold text-slate-900">Country setup</h2>
        <p className="text-sm text-slate-600">
          Register a Pakistan market locale record. Unpublished locales remain Draft and noindex until explicitly published.
        </p>
      </div>

      <div className="grid max-w-2xl gap-4 rounded-xl border border-slate-200 bg-white p-5">
        <label className="grid gap-1 text-sm">
          <span className="font-semibold text-slate-800">Country</span>
          <select className="rounded-lg border border-slate-200 px-3 py-2" value={countryCode} onChange={(e) => setCountryCode(e.target.value)}>
            {COUNTRY_OPTIONS.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="grid gap-2 text-sm">
          <legend className="font-semibold text-slate-800">Languages</legend>
          {(['en', 'ar'] as const).map((lang) => (
            <label key={lang} className="flex items-center gap-2">
              <input type="checkbox" checked={languages.includes(lang)} onChange={() => toggleLang(lang)} />
              {lang === 'en' ? 'English' : 'Arabic'}
            </label>
          ))}
        </fieldset>

        <fieldset className="grid gap-2 text-sm">
          <legend className="font-semibold text-slate-800">Bootstrap mode</legend>
          {(
            [
              ['structure_only', 'Structure Only — route/template placeholders, no published marketing copy'],
              ['structure_shared_draft', 'Structure + Shared Content as Draft — link reusable global content as draft'],
              ['blank', 'Blank — register country/languages only'],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className="flex items-start gap-2">
              <input type="radio" name="mode" value={value} checked={mode === value} onChange={() => setMode(value)} className="mt-1" />
              <span>{label}</span>
            </label>
          ))}
        </fieldset>

        <button
          type="button"
          disabled={!canRun || status === 'running'}
          onClick={() => void runSetup()}
          className="rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {status === 'running' ? 'Setting up…' : 'Run country setup'}
        </button>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
          <strong>Setup failed.</strong> {error}
        </div>
      ) : null}

      {report ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-950">
          <h3 className="font-bold">Setup report — {report.country}</h3>
          <ul className="mt-3 grid gap-1">
            <li>Mode: {report.mode}</li>
            <li>Languages: {report.languages?.join(', ')}</li>
            <li>Pages prepared: {report.pagesPrepared}</li>
            <li>Sections prepared: {report.sectionsPrepared}</li>
            <li>Draft records created: {report.draftRecordsCreated}</li>
            <li>Shared records linked: {report.sharedRecordsLinked ?? 0}</li>
            <li>Missing translations: {report.missingTranslations?.length ?? 0}</li>
          </ul>
          {report.missingTranslations?.length ? (
            <p className="mt-2 text-xs">Arabic placeholders: {report.missingTranslations.join(', ')}</p>
          ) : null}
          <button type="button" className="mt-4 text-sm font-semibold text-brand" onClick={() => navigate('/admin/content/countries')}>
            Open Countries →
          </button>
        </div>
      ) : null}
    </div>
  )
}
