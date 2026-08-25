import { useCallback, useEffect, useMemo, useState } from 'react'
import { adminFetch, friendlyAdminApiMessage } from './adminApi'
import { useAdminToast } from './AdminToastContext'
import { useAdminLocale } from './AdminLocaleContext'
import { AdminLocaleEditorBanner } from './AdminLocaleEditorBanner'
import { ADMIN_EDITOR_LOCALE } from './adminLocaleSections'
import type { Bilingual } from '../cms/types'

type SeoState = {
  pageTitle: Bilingual
  metaDescription: Bilingual
  metaKeywords: Bilingual
  ogImage: string
  canonicalUrl: string
  ogTitle: Bilingual
  ogDescription: Bilingual
  twitterTitle: Bilingual
  twitterDescription: Bilingual
  twitterImage: string
  robotsIndex: string
  robotsFollow: string
  _meta?: { createdAt?: string; updatedAt?: string; updatedBy?: string }
}

function normBi(v: unknown): Bilingual {
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    const b = v as Record<string, unknown>
    return { en: String(b.en ?? ''), ar: String(b.ar ?? '') }
  }
  return { en: '', ar: '' }
}

function CharBand({ len, min, max, label }: { len: number; min: number; max: number; label: string }) {
  const ok = len >= min && len <= max
  return (
    <p className={`text-xs ${ok ? 'text-slate-500' : 'text-amber-700'}`}>
      {label}: {len} chars (recommended {min}–{max})
    </p>
  )
}

function BiFields({
  label,
  value,
  onChange,
  rowsEn = 2,
  rowsAr = 2,
  charGuideEn,
}: {
  label: string
  value: Bilingual
  onChange: (next: Bilingual) => void
  rowsEn?: number
  rowsAr?: number
  charGuideEn?: { min: number; max: number; label: string }
}) {
  return (
    <fieldset className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
      <legend className="text-sm font-bold text-slate-800">{label}</legend>
      <div>
        <label className="text-xs font-semibold text-slate-600">English</label>
        <textarea
          value={value.en}
          onChange={(e) => onChange({ ...value, en: e.target.value })}
          rows={rowsEn}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
        />
        {charGuideEn ? <CharBand len={value.en.length} min={charGuideEn.min} max={charGuideEn.max} label={charGuideEn.label} /> : null}
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-600">Arabic</label>
        <textarea
          value={value.ar}
          onChange={(e) => onChange({ ...value, ar: e.target.value })}
          rows={rowsAr}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>
    </fieldset>
  )
}

export function AdminSeo() {
  const toast = useAdminToast()
  const { setDirty: setLocaleDirty } = useAdminLocale()
  const [doc, setDoc] = useState<SeoState | null>(null)
  const [baseline, setBaseline] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    adminFetch<Record<string, unknown>>('/api/admin/data/seo')
      .then((raw) => {
        const next: SeoState = {
          pageTitle: normBi(raw.pageTitle),
          metaDescription: normBi(raw.metaDescription),
          metaKeywords: normBi(raw.metaKeywords),
          ogImage: String(raw.ogImage ?? ''),
          canonicalUrl: String(raw.canonicalUrl ?? ''),
          ogTitle: normBi(raw.ogTitle),
          ogDescription: normBi(raw.ogDescription),
          twitterTitle: normBi(raw.twitterTitle),
          twitterDescription: normBi(raw.twitterDescription),
          twitterImage: String(raw.twitterImage ?? ''),
          robotsIndex: raw.robotsIndex === 'noindex' ? 'noindex' : 'index',
          robotsFollow: raw.robotsFollow === 'nofollow' ? 'nofollow' : 'follow',
          _meta: raw._meta as SeoState['_meta'],
        }
        setDoc(next)
        setBaseline(JSON.stringify(next))
      })
      .catch((e: Error) => toast.push(friendlyAdminApiMessage(e.message), 'error'))
      .finally(() => setLoading(false))
  }, [toast])

  const dirty = useMemo(() => (doc ? JSON.stringify(doc) !== baseline : false), [doc, baseline])

  useEffect(() => {
    setLocaleDirty(dirty)
  }, [dirty, setLocaleDirty])

  const save = useCallback(async () => {
    if (!doc) return
    setSaving(true)
    try {
      await adminFetch('/api/admin/data/seo', { method: 'PUT', body: JSON.stringify(doc) })
      setBaseline(JSON.stringify(doc))
      setLocaleDirty(false)
      toast.push('SEO settings saved', 'success')
    } catch (e) {
      toast.push(e instanceof Error ? friendlyAdminApiMessage(e.message) : 'Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }, [doc, toast, setLocaleDirty])

  if (loading || !doc) {
    return (
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <span className="size-4 animate-spin rounded-full border-2 border-brand border-t-transparent" aria-hidden />
        Loading…
      </div>
    )
  }

  const metaLine = doc._meta?.updatedAt
    ? `Last saved: ${new Date(doc._meta.updatedAt).toLocaleString()} · ${doc._meta.updatedBy || '—'}`
    : null

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-24">
      <AdminLocaleEditorBanner {...ADMIN_EDITOR_LOCALE.seo} />
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">SEO</h1>
          <p className="text-sm text-slate-600">Meta tags, Open Graph, Twitter cards, and robots directives.</p>
        </div>
        {metaLine ? <p className="text-xs font-medium text-slate-500">{metaLine}</p> : null}
      </div>

      <BiFields
        label="Page title (meta title)"
        value={doc.pageTitle}
        onChange={(pageTitle) => setDoc({ ...doc, pageTitle })}
        charGuideEn={{ min: 50, max: 60, label: 'Meta title (EN)' }}
      />
      <BiFields
        label="Meta description"
        value={doc.metaDescription}
        onChange={(metaDescription) => setDoc({ ...doc, metaDescription })}
        rowsEn={4}
        rowsAr={4}
        charGuideEn={{ min: 150, max: 160, label: 'Meta description (EN)' }}
      />
      <BiFields label="Meta keywords" value={doc.metaKeywords} onChange={(metaKeywords) => setDoc({ ...doc, metaKeywords })} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-slate-800">Canonical URL</label>
          <input
            value={doc.canonicalUrl}
            onChange={(e) => setDoc({ ...doc, canonicalUrl: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand"
            placeholder="https://…"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-800">OG image URL</label>
          <input
            value={doc.ogImage}
            onChange={(e) => setDoc({ ...doc, ogImage: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand"
            placeholder="/uploads/… or https://…"
          />
        </div>
      </div>

      <BiFields
        label="OG title (optional)"
        value={doc.ogTitle}
        onChange={(ogTitle) => setDoc({ ...doc, ogTitle })}
        charGuideEn={{ min: 50, max: 60, label: 'OG title (EN)' }}
      />
      <BiFields
        label="OG description (optional)"
        value={doc.ogDescription}
        onChange={(ogDescription) => setDoc({ ...doc, ogDescription })}
        rowsEn={4}
        rowsAr={4}
        charGuideEn={{ min: 150, max: 160, label: 'OG description (EN)' }}
      />

      <BiFields
        label="Twitter title (optional)"
        value={doc.twitterTitle}
        onChange={(twitterTitle) => setDoc({ ...doc, twitterTitle })}
        charGuideEn={{ min: 50, max: 60, label: 'Twitter title (EN)' }}
      />
      <BiFields
        label="Twitter description (optional)"
        value={doc.twitterDescription}
        onChange={(twitterDescription) => setDoc({ ...doc, twitterDescription })}
        rowsEn={4}
        rowsAr={4}
        charGuideEn={{ min: 150, max: 160, label: 'Twitter description (EN)' }}
      />
      <div>
        <label className="text-sm font-semibold text-slate-800">Twitter image URL (optional)</label>
        <input
          value={doc.twitterImage}
          onChange={(e) => setDoc({ ...doc, twitterImage: e.target.value })}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-slate-800">Robots index</label>
          <select
            value={doc.robotsIndex}
            onChange={(e) => setDoc({ ...doc, robotsIndex: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand"
          >
            <option value="index">index</option>
            <option value="noindex">noindex</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-800">Robots follow</label>
          <select
            value={doc.robotsFollow}
            onChange={(e) => setDoc({ ...doc, robotsFollow: e.target.value })}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand"
          >
            <option value="follow">follow</option>
            <option value="nofollow">nofollow</option>
          </select>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-[100] flex justify-end border-t border-slate-200 bg-[#f4f6f8]/95 px-4 py-3 backdrop-blur md:left-60">
        <button
          type="button"
          disabled={saving}
          onClick={save}
          className="rounded-xl bg-brand px-6 py-2.5 text-sm font-semibold text-white shadow hover:bg-brand-dark disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save SEO'}
        </button>
      </div>
    </div>
  )
}
