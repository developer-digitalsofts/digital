import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { flattenMegaSearchMeta, industryCategoryTitleEn } from '../data/megaMenu'
import { useI18n } from '../i18n/I18nProvider'
import { megaIndustryCatTitle, megaIndustryLabel, megaModuleLabel } from '../i18n/megaLabels'

type Props = {
  open: boolean
  onClose: () => void
}

export function SearchModal({ open, onClose }: Props) {
  const { lang, t } = useI18n()
  const [q, setQ] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const meta = useMemo(() => flattenMegaSearchMeta(), [])

  const rows = useMemo(() => {
    return meta.map((row) => {
      const label =
        row.kind === 'module'
          ? megaModuleLabel(lang, row.slug, row.labelEn)
          : megaIndustryLabel(lang, row.slug, row.labelEn)
      const group =
        row.kind === 'module'
          ? t('search.groupModule')
          : `${t('search.groupIndustryLead')}${t('search.groupIndustrySep')}${megaIndustryCatTitle(lang, row.catId, industryCategoryTitleEn(row.catId))}`
      const haystack = `${row.labelEn} ${label} ${group}`.toLowerCase()
      return { to: row.to, label, group, haystack }
    })
  }, [lang, t, meta])

  useEffect(() => {
    if (!open) {
      setQ('')
      return
    }
    const id = window.setTimeout(() => inputRef.current?.focus(), 50)
    return () => window.clearTimeout(id)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const results = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return []
    return rows.filter((row) => row.haystack.includes(s))
  }, [q, rows])

  if (!open) return null

  return (
    <div
      className="animate-fade-up fixed inset-0 z-[200] flex items-start justify-center bg-slate-900/50 p-4 pt-[12vh] backdrop-blur-sm motion-reduce:animate-none"
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-dialog-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="w-full max-w-lg overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2">
          <Search className="size-5 shrink-0 text-brand" aria-hidden />
          <input
            ref={inputRef}
            id="search-dialog-title"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t('search.placeholder')}
            className="min-w-0 flex-1 border-0 bg-transparent py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            autoComplete="off"
          />
          <button
            type="button"
            className="rounded-lg p-2 text-brand transition-colors hover:bg-orange-50 hover:text-brand-dark"
            aria-label="Close search"
            onClick={onClose}
          >
            <X className="size-5" strokeWidth={2.25} />
          </button>
        </div>
        <div className="max-h-[min(60vh,420px)] overflow-y-auto p-2">
          {!q.trim() && (
            <p className="px-3 py-6 text-center text-sm text-slate-500">{t('search.empty')}</p>
          )}
          {q.trim() && results.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-slate-500">{t('search.noResults')}</p>
          )}
          <ul className="space-y-0.5">
            {results.map((row) => (
              <li key={row.to}>
                <Link
                  to={row.to}
                  className="block rounded-xl px-3 py-2.5 text-start text-sm transition-colors hover:bg-orange-50"
                  onClick={onClose}
                >
                  <span className="font-semibold text-slate-900">{row.label}</span>
                  <span className="mt-0.5 block text-xs text-slate-500">{row.group}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
