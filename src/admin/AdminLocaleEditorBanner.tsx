import { adminFetch } from './adminApi'
import { useAdminLocale } from './AdminLocaleContext'
import { countrySlugToCode } from '../locale/localeConfig'
import { LOCALE_STATUS_LABELS } from '../types/localeContent'
import { useAdminLocaleRecord } from './useAdminLocaleRecord'
import type { TranslationStatus } from '../locale/localeConfig'

const WORKFLOW_STATUSES: TranslationStatus[] = ['missing', 'draft', 'needs_review', 'approved', 'published', 'archived']

type Props = {
  contentType: string
  globalIdentity: string
  slug?: string
  compact?: boolean
}

const TRACKED_FIELDS = ['title', 'heading', 'shortDescription']

function statusBadge(customized: boolean, inherited: boolean, status: TranslationStatus) {
  if (customized) return LOCALE_STATUS_LABELS.customized
  if (inherited) return LOCALE_STATUS_LABELS.inherited
  if (status === 'missing') return LOCALE_STATUS_LABELS.missing
  return LOCALE_STATUS_LABELS[status] || status
}

export function AdminLocaleEditorBanner({ contentType, globalIdentity, slug, compact }: Props) {
  const { country, lang, countryLabel, langLabel, setDirty } = useAdminLocale()
  const { loading, recordId, customized, inherited, status, reload, isDefault, meta } = useAdminLocaleRecord(
    contentType,
    globalIdentity,
    slug,
  )

  const countryCode = countrySlugToCode(country)
  const badge = statusBadge(Boolean(customized), Boolean(inherited), status as TranslationStatus)

  const runAction = async (action: string, extra?: Record<string, unknown>) => {
    try {
      let id = recordId

      const ensureOverride = async () => {
        if (id) return id
        const res = await adminFetch<{ record: { id: string } }>('/api/admin/locale/actions/customize', {
          method: 'POST',
          body: JSON.stringify({ contentType, globalIdentity, countryCode, lang, slug }),
        })
        id = res.record.id
        return id
      }

      if (action === 'reset' && recordId) {
        if (!window.confirm('Reset to inherited? This removes only the local override, not global content.')) return
        await adminFetch(`/api/admin/locale/records/${recordId}`, { method: 'DELETE' })
      } else if (action === 'customize') {
        await ensureOverride()
      } else if (action === 'use-global') {
        await adminFetch('/api/admin/locale/actions/use-global', {
          method: 'POST',
          body: JSON.stringify({ contentType, globalIdentity, countryCode, lang }),
        })
      } else if (action === 'copy-uae-structure') {
        await adminFetch('/api/admin/locale/actions/copy-uae-structure', {
          method: 'POST',
          body: JSON.stringify({ countryCode, lang, regionalize: true }),
        })
      } else if (action === 'copy-uae') {
        const targetId = await ensureOverride()
        await adminFetch(`/api/admin/locale/records/${targetId}/copy-from`, {
          method: 'POST',
          body: JSON.stringify({ sourceCountry: 'AE', sourceLang: 'en', asDraft: true }),
        })
      } else if (action === 'copy-country-en' && lang === 'ar') {
        const targetId = await ensureOverride()
        await adminFetch(`/api/admin/locale/records/${targetId}/copy-from`, {
          method: 'POST',
          body: JSON.stringify({ sourceCountry: countryCode, sourceLang: 'en', asDraft: true }),
        })
      } else if (action === 'publish' && recordId) {
        await adminFetch(`/api/admin/locale/records/${recordId}/publish`, { method: 'POST' })
      } else if (action === 'unpublish' && recordId) {
        await adminFetch(`/api/admin/locale/records/${recordId}/unpublish`, { method: 'POST' })
      } else if (action === 'approve' && recordId) {
        await adminFetch(`/api/admin/locale/records/${recordId}/approve`, { method: 'POST' })
      } else if (action === 'archive' && recordId) {
        await adminFetch(`/api/admin/locale/records/${recordId}/archive`, { method: 'POST' })
      } else if (action === 'translation-status' && recordId && extra?.status) {
        await adminFetch(`/api/admin/locale/records/${recordId}/translation-status`, {
          method: 'POST',
          body: JSON.stringify({ status: extra.status }),
        })
      } else if (action === 'field-reset' && recordId && extra?.field) {
        await adminFetch(`/api/admin/locale/records/${recordId}/fields/${encodeURIComponent(String(extra.field))}/reset`, {
          method: 'POST',
        })
      } else if (action === 'field-copy-uae' && recordId && extra?.field) {
        await adminFetch(
          `/api/admin/locale/records/${recordId}/fields/${encodeURIComponent(String(extra.field))}/copy-from`,
          { method: 'POST', body: JSON.stringify({ sourceCountry: 'AE', sourceLang: 'en' }) },
        )
      } else if (action === 'field-copy-en' && recordId && extra?.field) {
        await adminFetch(
          `/api/admin/locale/records/${recordId}/fields/${encodeURIComponent(String(extra.field))}/copy-from`,
          { method: 'POST', body: JSON.stringify({ sourceCountry: countryCode, sourceLang: 'en' }) },
        )
      } else if (action === 'publish-store') {
        await adminFetch('/api/admin/locale/publish-store', { method: 'POST', body: '{}' })
      }
      setDirty(false)
      await reload()
    } catch (e) {
      window.alert(e instanceof Error ? e.message : 'Action failed')
    }
  }

  if (isDefault && !compact) {
    return (
      <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-950">
        <strong>Editing:</strong> {countryLabel} · {langLabel} — Global published baseline
      </div>
    )
  }

  return (
    <div className={`mb-4 space-y-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs ${compact ? '' : 'shadow-sm'}`}>
      {!isDefault && meta?.fallbackUsed ? (
        <div className="rounded-md border border-amber-300 bg-amber-50 px-2 py-1.5 font-medium text-amber-950">
          UAE fallback content is in use for this locale preview. Publish localized content before it appears on the public site.
        </div>
      ) : null}
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold text-slate-700">
          Editing: {countryLabel} · {langLabel}
        </span>
        {loading ? (
          <span className="text-slate-500">Loading locale state…</span>
        ) : (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 font-semibold text-slate-700">{badge}</span>
        )}
        {meta?.resolvedFrom ? (
          <span className="text-slate-500">Resolved: {meta.resolvedFrom}{meta.fallbackUsed ? ' (fallback)' : ''}</span>
        ) : null}
      </div>

      {!isDefault ? (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-600">Translation workflow:</span>
            {WORKFLOW_STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                disabled={!recordId || status === s}
                className={`rounded border px-2 py-0.5 ${status === s ? 'border-brand bg-brand/10 font-semibold text-brand' : 'border-slate-200 hover:bg-slate-50'}`}
                onClick={() =>
                  void runAction(s === 'archived' ? 'archive' : 'translation-status', s === 'archived' ? undefined : { status: s })
                }
              >
                {LOCALE_STATUS_LABELS[s] || s}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1">
            <button type="button" className="rounded border border-slate-200 px-2 py-0.5 hover:bg-slate-50" onClick={() => void runAction('use-global')}>
              Use Global Content
            </button>
            <button type="button" className="rounded border border-slate-200 px-2 py-0.5 hover:bg-slate-50" onClick={() => void runAction('customize')}>
              Customize for This Country
            </button>
            <button
              type="button"
              className="rounded border border-brand/30 px-2 py-0.5 font-semibold text-brand hover:bg-brand/5"
              onClick={() => void runAction('copy-uae-structure')}
            >
              Copy UAE structure as {countryLabel} draft
            </button>
            <button type="button" className="rounded border border-slate-200 px-2 py-0.5 hover:bg-slate-50" onClick={() => void runAction('copy-uae')}>
              Copy this record from UAE English
            </button>
            {lang === 'ar' ? (
              <button type="button" className="rounded border border-slate-200 px-2 py-0.5 hover:bg-slate-50" onClick={() => void runAction('copy-country-en')}>
                Copy from This Country&apos;s English
              </button>
            ) : null}
            {customized && recordId ? (
              <button type="button" className="rounded border border-slate-200 px-2 py-0.5 hover:bg-slate-50" onClick={() => void runAction('reset')}>
                Reset to Inherited
              </button>
            ) : null}
            {recordId && status !== 'published' ? (
              <button type="button" className="rounded border border-brand/30 px-2 py-0.5 text-brand hover:bg-brand/5" onClick={() => void runAction('publish')}>
                Publish Record
              </button>
            ) : null}
            {recordId && status === 'published' ? (
              <button type="button" className="rounded border border-slate-200 px-2 py-0.5 hover:bg-slate-50" onClick={() => void runAction('unpublish')}>
                Unpublish
              </button>
            ) : null}
            <button type="button" className="rounded border border-amber-300 px-2 py-0.5 text-amber-900 hover:bg-amber-50" onClick={() => void runAction('publish-store')}>
              Sync Published Snapshot
            </button>
          </div>

          {!compact ? (
            <div className="border-t border-dashed border-slate-200 pt-2">
              <span className="font-semibold text-slate-600">Field inheritance:</span>
              <div className="mt-1 flex flex-wrap gap-2">
                {TRACKED_FIELDS.map((field) => (
                  <div key={field} className="flex items-center gap-1 rounded border border-slate-100 bg-slate-50 px-2 py-1">
                    <span className="font-medium capitalize">{field}</span>
                    <button type="button" className="text-brand hover:underline" disabled={!recordId} onClick={() => void runAction('field-reset', { field })}>
                      Reset
                    </button>
                    <button type="button" className="text-brand hover:underline" disabled={!recordId} onClick={() => void runAction('field-copy-uae', { field })}>
                      Copy UAE
                    </button>
                    {lang === 'ar' ? (
                      <button type="button" className="text-brand hover:underline" disabled={!recordId} onClick={() => void runAction('field-copy-en', { field })}>
                        Copy EN
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  )
}
