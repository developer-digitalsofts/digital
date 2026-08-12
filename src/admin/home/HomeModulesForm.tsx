import { useCallback, useEffect, useMemo, useState } from 'react'
import { ChevronDown, Plus } from 'lucide-react'
import { useAdminSection } from '../hooks/useAdminSection'
import { useAdminToast } from '../AdminToastContext'
import { BilingualInputs } from '../cms/BilingualInputs'
import { AdminFormActions } from '../cms/AdminFormActions'
import { ConfirmDialog } from '../cms/ConfirmDialog'
import { HomeModuleCard, type ModItem, type ModuleTab } from './HomeModuleCard'
import {
  emptyModulesDoc,
  normalizeModulesDoc,
  type ModulesDoc,
} from './normalizeModulesIndustries'

function sortItems(xs: ModItem[]) {
  return [...xs].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}

export function HomeModulesForm() {
  const toast = useAdminToast()
  const sec = useAdminSection<ModulesDoc>('modules')
  const [local, setLocal] = useState<ModulesDoc | null>(null)
  const [baseline, setBaseline] = useState('')
  const [delId, setDelId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [expandedTab, setExpandedTab] = useState<ModuleTab>('en')
  const [sectionIntroOpen, setSectionIntroOpen] = useState(false)

  useEffect(() => {
    if (sec.loading) return
    const d = normalizeModulesDoc(sec.data ?? emptyModulesDoc())
    d.items = sortItems(d.items)
    setLocal(d)
    setBaseline(JSON.stringify(d))
  }, [sec.data, sec.loading])

  const dirty = useMemo(() => (local ? JSON.stringify(local) !== baseline : false), [local, baseline])

  const cancel = useCallback(() => {
    try {
      setLocal(JSON.parse(baseline) as ModulesDoc)
      setExpandedId(null)
      toast.push('Changes reverted', 'info')
    } catch {
      /* */
    }
  }, [baseline, toast])

  const save = async () => {
    if (!local) return
    try {
      const out = { ...local, items: sortItems(local.items) }
      await sec.save(out as ModulesDoc & Record<string, unknown>)
      setBaseline(JSON.stringify(out))
      toast.push('Saved successfully', 'success')
    } catch {
      /* */
    }
  }

  const updateItem = (id: string, next: ModItem) => {
    setLocal((prev) =>
      prev ? { ...prev, items: prev.items.map((x) => (x.id === id ? next : x)) } : prev,
    )
  }

  const addModule = () => {
    const id = `m-${crypto.randomUUID().slice(0, 10)}`
    setLocal((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        items: [
          ...prev.items,
          {
            id,
            icon: 'Box',
            badge: { en: '', ar: '' },
            title: { en: '', ar: '' },
            description: { en: '', ar: '' },
            href: '/software/module/',
            sortOrder: prev.items.length,
            active: true,
          },
        ],
      }
    })
    setExpandedId(id)
    setExpandedTab('en')
  }

  const toggleExpand = (id: string) => {
    setExpandedId((current) => (current === id ? null : id))
    setExpandedTab('en')
  }

  if (sec.loading || !local) {
    return (
      <div className="flex items-center gap-2 py-8 text-sm text-slate-600">
        <span className="size-4 animate-spin rounded-full border-2 border-brand border-t-transparent" aria-hidden />
        Loading modules…
      </div>
    )
  }

  const sorted = sortItems(local.items ?? [])

  return (
    <>
      <div className="space-y-4 pb-28">
        {sec.error ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
            <p className="font-medium">Could not refresh from server.</p>
            <p className="mt-1">{sec.error}</p>
            <button type="button" className="mt-2 text-xs font-semibold text-brand hover:underline" onClick={() => sec.reload()}>
              Retry
            </button>
          </div>
        ) : null}

        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">ERP modules</h3>
            <p className="mt-0.5 text-sm text-slate-600">
              {sorted.length} module{sorted.length === 1 ? '' : 's'} · collapsed by default · click <strong>Edit</strong> to
              open fields
            </p>
          </div>
          <button
            type="button"
            onClick={addModule}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark"
          >
            <Plus className="size-4" aria-hidden />
            Add Module
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <button
            type="button"
            onClick={() => setSectionIntroOpen((v) => !v)}
            className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-slate-50"
          >
            <span>
              <span className="text-sm font-bold text-slate-900">Section intro text</span>
              <span className="mt-0.5 block text-xs text-slate-500">Pill, title, subtitle & explore label for the modules block</span>
            </span>
            <ChevronDown
              className={`size-5 shrink-0 text-slate-500 transition-transform ${sectionIntroOpen ? 'rotate-180' : ''}`}
              aria-hidden
            />
          </button>
          {sectionIntroOpen ? (
            <div className="space-y-4 border-t border-slate-100 px-4 py-4">
              <BilingualInputs labelEn="Pill (EN)" labelAr="Pill (AR)" value={local.pill} onChange={(pill) => setLocal({ ...local, pill })} />
              <BilingualInputs labelEn="Title (EN)" labelAr="Title (AR)" value={local.title} onChange={(title) => setLocal({ ...local, title })} />
              <BilingualInputs
                labelEn="Subtitle (EN)"
                labelAr="Subtitle (AR)"
                multiline
                rows={3}
                value={local.subtitle}
                onChange={(subtitle) => setLocal({ ...local, subtitle })}
              />
              <BilingualInputs
                labelEn="Explore label (EN)"
                labelAr="Explore label (AR)"
                value={local.exploreLabel}
                onChange={(exploreLabel) => setLocal({ ...local, exploreLabel })}
              />
            </div>
          ) : null}
        </div>

        {sorted.length === 0 ? (
          <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-10 text-center text-sm text-slate-500">
            No modules yet. Click <strong>Add Module</strong> to create one.
          </p>
        ) : (
          <div className="space-y-2">
            {sorted.map((it) => (
              <HomeModuleCard
                key={it.id}
                item={it}
                expanded={expandedId === it.id}
                tab={expandedId === it.id ? expandedTab : 'en'}
                onTabChange={setExpandedTab}
                onToggleExpand={() => toggleExpand(it.id)}
                onChange={(next) => updateItem(it.id, next)}
                onDelete={() => setDelId(it.id)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(15,23,42,0.06)] backdrop-blur-sm md:left-[15.5rem]">
        <div className="mx-auto max-w-5xl">
          <AdminFormActions
            saving={sec.saving}
            publishing={sec.publishing}
            onSave={save}
            onPublish={async () => {
              await save()
              await sec.publish()
              toast.push('Published successfully', 'success')
            }}
            onCancel={cancel}
            disableSave={!dirty}
            statusLabel={
              sec.publishStatus
                ? `${sec.publishStatus.status}${sec.publishStatus.lastPublishedAt ? ` · Last published ${new Date(sec.publishStatus.lastPublishedAt).toLocaleString()}` : ''}`
                : null
            }
            className="border-t-0 pt-0"
          />
        </div>
      </div>

      <ConfirmDialog
        open={!!delId}
        title="Delete module?"
        message="Are you sure you want to delete this item?"
        confirmLabel="Delete"
        onClose={() => setDelId(null)}
        onConfirm={() => {
          if (!delId) return
          setLocal((l) => (l ? { ...l, items: l.items.filter((x) => x.id !== delId) } : l))
          if (expandedId === delId) setExpandedId(null)
          setDelId(null)
        }}
      />
    </>
  )
}
