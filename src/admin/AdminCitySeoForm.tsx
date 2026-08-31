import { useCallback, useMemo, useState } from 'react'
import type { Bilingual } from '../cms/types'
import { useCityAdminSection } from './hooks/useCityAdminSection'
import { useAdminToast } from './AdminToastContext'
import { AdminFormActions } from './cms/AdminFormActions'
import { BilingualInputs } from './cms/BilingualInputs'

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
}

function normBi(v: unknown): Bilingual {
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    const b = v as Record<string, unknown>
    return { en: String(b.en ?? ''), ar: String(b.ar ?? '') }
  }
  return { en: '', ar: '' }
}

function normalizeSeo(raw: Record<string, unknown> | null): SeoState {
  return {
    pageTitle: normBi(raw?.pageTitle),
    metaDescription: normBi(raw?.metaDescription),
    metaKeywords: normBi(raw?.metaKeywords),
    ogImage: String(raw?.ogImage ?? ''),
    canonicalUrl: String(raw?.canonicalUrl ?? ''),
    ogTitle: normBi(raw?.ogTitle),
    ogDescription: normBi(raw?.ogDescription),
    twitterTitle: normBi(raw?.twitterTitle),
    twitterDescription: normBi(raw?.twitterDescription),
    twitterImage: String(raw?.twitterImage ?? ''),
    robotsIndex: raw?.robotsIndex === 'noindex' ? 'noindex' : 'index',
    robotsFollow: raw?.robotsFollow === 'nofollow' ? 'nofollow' : 'follow',
  }
}

export function AdminCitySeoForm() {
  const toast = useAdminToast()
  const sec = useCityAdminSection<SeoState>('seo')
  const [local, setLocal] = useState<SeoState | null>(null)

  const doc = local ?? (sec.data ? normalizeSeo(sec.data) : null)

  const setField = useCallback(<K extends keyof SeoState>(key: K, value: SeoState[K]) => {
    setLocal((prev) => ({ ...(prev ?? doc ?? normalizeSeo(null)), [key]: value }))
  }, [doc])

  const save = useCallback(async () => {
    if (!doc) return
    try {
      await sec.save(doc)
      setLocal(null)
      toast.push('City SEO saved', 'success')
    } catch (e) {
      toast.push(e instanceof Error ? e.message : 'Save failed', 'error')
    }
  }, [doc, sec, toast])

  const publish = useCallback(async () => {
    try {
      if (doc && JSON.stringify(doc) !== JSON.stringify(sec.data)) await sec.save(doc)
      await sec.publish()
      toast.push('City SEO published', 'success')
    } catch (e) {
      toast.push(e instanceof Error ? e.message : 'Publish failed', 'error')
    }
  }, [doc, sec, toast])

  const loading = sec.loading
  const previewTitle = useMemo(() => doc?.pageTitle.en || '', [doc?.pageTitle.en])

  if (loading || !doc) return <p className="text-sm text-slate-600">Loading city SEO…</p>

  return (
    <div className="space-y-6">
      <BilingualInputs labelEn="SEO title (EN)" labelAr="SEO title (AR)" value={doc.pageTitle} onChange={(v) => setField('pageTitle', v)} />
      <BilingualInputs labelEn="Meta description (EN)" labelAr="Meta description (AR)" value={doc.metaDescription} onChange={(v) => setField('metaDescription', v)} multiline />
      <BilingualInputs labelEn="Meta keywords (EN)" labelAr="Meta keywords (AR)" value={doc.metaKeywords} onChange={(v) => setField('metaKeywords', v)} />
      <label className="block text-sm font-semibold text-slate-700">
        Canonical URL
        <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={doc.canonicalUrl} onChange={(e) => setField('canonicalUrl', e.target.value)} />
      </label>
      <label className="block text-sm font-semibold text-slate-700">
        Open Graph image URL
        <input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={doc.ogImage} onChange={(e) => setField('ogImage', e.target.value)} />
      </label>
      <BilingualInputs labelEn="Open Graph title (EN)" labelAr="Open Graph title (AR)" value={doc.ogTitle} onChange={(v) => setField('ogTitle', v)} />
      <BilingualInputs labelEn="Open Graph description (EN)" labelAr="Open Graph description (AR)" value={doc.ogDescription} onChange={(v) => setField('ogDescription', v)} multiline />
      <BilingualInputs labelEn="Twitter title (EN)" labelAr="Twitter title (AR)" value={doc.twitterTitle} onChange={(v) => setField('twitterTitle', v)} />
      <BilingualInputs labelEn="Twitter description (EN)" labelAr="Twitter description (AR)" value={doc.twitterDescription} onChange={(v) => setField('twitterDescription', v)} multiline />
      <p className="text-xs text-slate-500">Preview title: {previewTitle}</p>
      <AdminFormActions saving={sec.saving} onSave={() => void save()} onPublish={() => void publish()} onCancel={() => setLocal(null)} publishing={sec.publishing} />
    </div>
  )
}
