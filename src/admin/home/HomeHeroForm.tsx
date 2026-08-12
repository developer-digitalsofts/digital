import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Bilingual } from '../../cms/types'
import { useAdminSection } from '../hooks/useAdminSection'
import { useAdminToast } from '../AdminToastContext'
import { BilingualInputs } from '../cms/BilingualInputs'
import { AdminFormActions } from '../cms/AdminFormActions'
import { ConfirmDialog } from '../cms/ConfirmDialog'

type HeroBadge = {
  id: string
  icon: string
  label: Bilingual
  sortOrder: number
  active: boolean
}

type HeroDoc = {
  title: Bilingual
  sub: Bilingual
  body: Bilingual
  ctaPrimary: { label: Bilingual; href: string }
  ctaSecondary: { label: Bilingual; href: string }
  mockupImageUrl: string
  badges: HeroBadge[]
  _meta?: Record<string, unknown>
}

type PageSectionsDoc = {
  sections: { id: string; name?: string; visible?: boolean; sortOrder?: number }[]
  _meta?: Record<string, unknown>
}

function sortBadges(b: HeroBadge[]) {
  return [...b].sort((a, x) => (a.sortOrder ?? 0) - (x.sortOrder ?? 0))
}

export function HomeHeroForm() {
  const toast = useAdminToast()
  const hero = useAdminSection<HeroDoc>('hero')
  const pageSec = useAdminSection<PageSectionsDoc>('pageSections')
  const [local, setLocal] = useState<HeroDoc | null>(null)
  const [heroVisible, setHeroVisible] = useState(true)
  const [baseline, setBaseline] = useState('')
  const [deleteBadgeId, setDeleteBadgeId] = useState<string | null>(null)

  useEffect(() => {
    if (!hero.data) return
    const h = { ...hero.data, badges: sortBadges(hero.data.badges || []) }
    setLocal(h)
    const vis =
      pageSec.data?.sections?.find((s) => s.id === 'hero')?.visible !== false
    setHeroVisible(vis)
    setBaseline(JSON.stringify({ hero: h, heroVisible: vis }))
  }, [hero.data, pageSec.data])

  const dirty = useMemo(() => {
    if (!local) return false
    return JSON.stringify({ hero: local, heroVisible }) !== baseline
  }, [local, heroVisible, baseline])

  const cancel = useCallback(() => {
    try {
      const p = JSON.parse(baseline) as { hero: HeroDoc; heroVisible: boolean }
      setLocal(p.hero)
      setHeroVisible(p.heroVisible)
      toast.push('Changes reverted', 'info')
    } catch {
      /* ignore */
    }
  }, [baseline, toast])

  const save = async () => {
    if (!local || !pageSec.data) return
    try {
      const nextSections = {
        ...pageSec.data,
        sections: (pageSec.data.sections || []).map((s) =>
          s.id === 'hero' ? { ...s, visible: heroVisible } : s,
        ),
      }
      await hero.save({ ...local, badges: sortBadges(local.badges) } as HeroDoc & Record<string, unknown>)
      await pageSec.save(nextSections as PageSectionsDoc & Record<string, unknown>)
      setBaseline(JSON.stringify({ hero: { ...local, badges: sortBadges(local.badges) }, heroVisible }))
      toast.push('Draft saved', 'success')
    } catch {
      /* toast in hook */
    }
  }

  const publish = async () => {
    await save()
    try {
      await hero.publish()
      await pageSec.publish()
      toast.push('Published successfully', 'success')
    } catch {
      /* toast in hook */
    }
  }

  if (hero.loading || pageSec.loading || !local) {
    return (
      <div className="flex items-center gap-2 py-8 text-sm text-slate-600">
        <span className="size-4 animate-spin rounded-full border-2 border-brand border-t-transparent" aria-hidden />
        Loading hero…
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {hero.error || pageSec.error ? (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{hero.error || pageSec.error}</p>
      ) : null}

      <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
        <input type="checkbox" checked={heroVisible} onChange={(e) => setHeroVisible(e.target.checked)} />
        Show hero section on homepage
      </label>

      <BilingualInputs labelEn="English title" labelAr="Arabic title" value={local.title} onChange={(title) => setLocal({ ...local, title })} />
      <BilingualInputs labelEn="English subtitle" labelAr="Arabic subtitle" value={local.sub} onChange={(sub) => setLocal({ ...local, sub })} />
      <BilingualInputs
        labelEn="English body"
        labelAr="Arabic body"
        multiline
        rows={5}
        value={local.body}
        onChange={(body) => setLocal({ ...local, body })}
      />

      <div className="grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
        <BilingualInputs
          labelEn="Primary button (EN)"
          labelAr="Primary button (AR)"
          value={local.ctaPrimary.label}
          onChange={(label) => setLocal({ ...local, ctaPrimary: { ...local.ctaPrimary, label } })}
        />
        <label className="block text-sm sm:col-span-2">
          <span className="font-semibold text-slate-800">Primary button link</span>
          <input
            className="mt-1 w-full max-w-xl rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
            value={local.ctaPrimary.href}
            onChange={(e) => setLocal({ ...local, ctaPrimary: { ...local.ctaPrimary, href: e.target.value } })}
          />
        </label>
        <BilingualInputs
          labelEn="Secondary button (EN)"
          labelAr="Secondary button (AR)"
          value={local.ctaSecondary.label}
          onChange={(label) => setLocal({ ...local, ctaSecondary: { ...local.ctaSecondary, label } })}
        />
        <label className="block text-sm sm:col-span-2">
          <span className="font-semibold text-slate-800">Secondary button link</span>
          <input
            className="mt-1 w-full max-w-xl rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
            value={local.ctaSecondary.href}
            onChange={(e) => setLocal({ ...local, ctaSecondary: { ...local.ctaSecondary, href: e.target.value } })}
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="font-semibold text-slate-800">Hero image URL</span>
        <input
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
          value={local.mockupImageUrl}
          onChange={(e) => setLocal({ ...local, mockupImageUrl: e.target.value })}
          placeholder="/uploads/…"
        />
      </label>

      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-slate-900">Badges</h3>
          <button
            type="button"
            className="text-xs font-bold uppercase tracking-wide text-brand hover:underline"
            onClick={() => {
              const id = `b-${crypto.randomUUID().slice(0, 10)}`
              setLocal({
                ...local,
                badges: [
                  ...local.badges,
                  { id, icon: 'Circle', label: { en: '', ar: '' }, sortOrder: local.badges.length, active: true },
                ],
              })
            }}
          >
            + Add badge
          </button>
        </div>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-slate-50 font-bold uppercase tracking-wide text-slate-600">
              <tr>
                <th className="px-2 py-2">Icon</th>
                <th className="px-2 py-2">EN</th>
                <th className="px-2 py-2">AR</th>
                <th className="px-2 py-2">Order</th>
                <th className="px-2 py-2">Active</th>
                <th className="px-2 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortBadges(local.badges).map((b) => (
                <tr key={b.id}>
                  <td className="px-2 py-1">
                    <input
                      className="w-20 rounded border border-slate-200 px-1 py-1 font-mono"
                      value={b.icon}
                      onChange={(e) =>
                        setLocal({
                          ...local,
                          badges: local.badges.map((x) => (x.id === b.id ? { ...x, icon: e.target.value } : x)),
                        })
                      }
                    />
                  </td>
                  <td className="px-2 py-1">
                    <input
                      className="w-32 rounded border border-slate-200 px-1 py-1 sm:w-40"
                      value={b.label.en}
                      onChange={(e) =>
                        setLocal({
                          ...local,
                          badges: local.badges.map((x) =>
                            x.id === b.id ? { ...x, label: { ...x.label, en: e.target.value } } : x,
                          ),
                        })
                      }
                    />
                  </td>
                  <td className="px-2 py-1">
                    <input
                      className="w-32 rounded border border-slate-200 px-1 py-1 sm:w-40"
                      dir="rtl"
                      value={b.label.ar}
                      onChange={(e) =>
                        setLocal({
                          ...local,
                          badges: local.badges.map((x) =>
                            x.id === b.id ? { ...x, label: { ...x.label, ar: e.target.value } } : x,
                          ),
                        })
                      }
                    />
                  </td>
                  <td className="px-2 py-1">
                    <input
                      type="number"
                      className="w-14 rounded border border-slate-200 px-1 py-1"
                      value={b.sortOrder}
                      onChange={(e) =>
                        setLocal({
                          ...local,
                          badges: local.badges.map((x) =>
                            x.id === b.id ? { ...x, sortOrder: Number(e.target.value) || 0 } : x,
                          ),
                        })
                      }
                    />
                  </td>
                  <td className="px-2 py-1">
                    <input
                      type="checkbox"
                      checked={b.active !== false}
                      onChange={(e) =>
                        setLocal({
                          ...local,
                          badges: local.badges.map((x) => (x.id === b.id ? { ...x, active: e.target.checked } : x)),
                        })
                      }
                    />
                  </td>
                  <td className="px-2 py-1">
                    <button type="button" className="text-red-600 hover:underline" onClick={() => setDeleteBadgeId(b.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AdminFormActions
        saving={hero.saving || pageSec.saving}
        publishing={hero.publishing || pageSec.publishing}
        onSave={save}
        onPublish={publish}
        onCancel={cancel}
        disableSave={!dirty}
        statusLabel={
          hero.publishStatus
            ? `${hero.publishStatus.status}${hero.publishStatus.lastPublishedAt ? ` · Last published ${new Date(hero.publishStatus.lastPublishedAt).toLocaleString()}` : ''}`
            : null
        }
      />

      <ConfirmDialog
        open={!!deleteBadgeId}
        title="Delete badge?"
        message="Are you sure you want to delete this item?"
        confirmLabel="Delete"
        onClose={() => setDeleteBadgeId(null)}
        onConfirm={() => {
          if (!deleteBadgeId || !local) return
          setLocal({ ...local, badges: local.badges.filter((x) => x.id !== deleteBadgeId) })
          setDeleteBadgeId(null)
        }}
      />
    </div>
  )
}
