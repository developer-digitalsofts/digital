import { useMemo, useState } from 'react'
import { AdminFormActions } from './cms/AdminFormActions'
import { BilingualInputs } from './cms/BilingualInputs'
import { AdminLayoutMediaField } from './layout/AdminLayoutMediaField'
import { useAdminSection } from './hooks/useAdminSection'
import { useAdminToast } from './AdminToastContext'
import type { MegaMenuCategoryCms, MegaMenuItemCms, MegaMenuPanelCms, MegaMenusCmsDoc } from '../cms/megaMenuTypes'

const inputClass = 'mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm'

type Tab = 'modules' | 'industries'

export function AdminMegaMenusPage() {
  const toast = useAdminToast()
  const { data, loading, saving, publishing, error, publishStatus, save, publish, setData, reload } =
    useAdminSection<MegaMenusCmsDoc>('megaMenus')
  const [tab, setTab] = useState<Tab>('modules')

  const panel = useMemo(() => (data ? data[tab] : null), [data, tab])

  const patchPanel = (partial: Partial<MegaMenuPanelCms>) => {
    if (!data) return
    setData({ ...data, [tab]: { ...data[tab], ...partial } })
  }

  const patchCategory = (catId: string, partial: Partial<MegaMenuCategoryCms>) => {
    if (!data || !panel) return
    patchPanel({
      categories: panel.categories.map((c) => (c.id === catId ? { ...c, ...partial } : c)),
    })
  }

  const patchItem = (catId: string, itemId: string, partial: Partial<MegaMenuItemCms>) => {
    if (!data || !panel) return
    patchPanel({
      categories: panel.categories.map((c) =>
        c.id === catId
          ? { ...c, items: c.items.map((item) => (item.id === itemId ? { ...item, ...partial } : item)) }
          : c,
      ),
    })
  }

  const handleSave = async () => {
    if (!data) return
    try {
      await save({ ...data, _meta: { ...data._meta, updatedAt: new Date().toISOString() } })
      toast.push('Mega menu saved as draft', 'success')
    } catch {
      toast.push('Save failed', 'error')
    }
  }

  const handlePublish = async () => {
    if (!data) return
    try {
      await save({ ...data, [tab]: { ...data[tab], status: 'published' } })
      await publish()
      toast.push('Mega menu published', 'success')
    } catch {
      toast.push('Publish failed', 'error')
    }
  }

  if (loading) return <p className="text-sm text-slate-600">Loading mega menus…</p>
  if (!data || !panel) return <p className="text-sm text-red-600">{error ?? 'Failed to load mega menus.'}</p>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Mega Menus</h1>
        <p className="mt-1 text-sm text-slate-600">
          Edit desktop mega menu content only. Layout and styling stay fixed (3 categories × 3 featured items).
        </p>
      </div>

      <div className="flex gap-2">
        {(['modules', 'industries'] as Tab[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded-xl px-4 py-2 text-sm font-bold ${tab === key ? 'bg-brand text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            {key === 'modules' ? 'Software by Module' : 'Software by Industries'}
          </button>
        ))}
      </div>

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold text-slate-900">Header</h2>
        <BilingualInputs labelEn="Title (EN)" labelAr="Title (AR)" value={panel.heading} onChange={(heading) => patchPanel({ heading })} />
        <BilingualInputs labelEn="Description (EN)" labelAr="Description (AR)" multiline rows={2} value={panel.subheading} onChange={(subheading) => patchPanel({ subheading })} />
        <BilingualInputs labelEn="View all label (EN)" labelAr="View all label (AR)" value={panel.viewAllLabel} onChange={(viewAllLabel) => patchPanel({ viewAllLabel })} />
        <label className="block text-sm">
          <span className="font-semibold text-slate-800">View all link</span>
          <input className={inputClass} value={panel.viewAllHref} onChange={(e) => patchPanel({ viewAllHref: e.target.value })} />
        </label>
      </section>

      {panel.categories.map((cat) => (
        <section key={cat.id} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-900">Category: {cat.id}</h2>
            <label className="inline-flex items-center gap-2 text-sm">
              <input type="checkbox" checked={cat.active !== false} onChange={(e) => patchCategory(cat.id, { active: e.target.checked })} />
              Active
            </label>
          </div>
          <BilingualInputs labelEn="Category title (EN)" labelAr="Category title (AR)" value={cat.title} onChange={(title) => patchCategory(cat.id, { title })} />

          {cat.items.map((item) => (
            <div key={item.id} className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-bold text-slate-800">{item.id}</p>
                <div className="flex gap-4 text-sm">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={item.featured !== false} onChange={(e) => patchItem(cat.id, item.id, { featured: e.target.checked })} />
                    Featured
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={item.active !== false} onChange={(e) => patchItem(cat.id, item.id, { active: e.target.checked })} />
                    Active
                  </label>
                </div>
              </div>
              <BilingualInputs labelEn="Item title (EN)" labelAr="Item title (AR)" value={item.title} onChange={(title) => patchItem(cat.id, item.id, { title })} />
              <BilingualInputs labelEn="Description (EN)" labelAr="Description (AR)" multiline rows={2} value={item.description} onChange={(description) => patchItem(cat.id, item.id, { description })} />
              <AdminLayoutMediaField label="Thumbnail" value={item.imageUrl} onChange={(imageUrl) => patchItem(cat.id, item.id, { imageUrl })} />
              <BilingualInputs labelEn="Image alt (EN)" labelAr="Image alt (AR)" value={item.imageAlt} onChange={(imageAlt) => patchItem(cat.id, item.id, { imageAlt })} />
              <label className="block text-sm">
                <span className="font-semibold text-slate-800">Destination link</span>
                <input className={inputClass} value={item.href} onChange={(e) => patchItem(cat.id, item.id, { href: e.target.value })} />
              </label>
            </div>
          ))}
        </section>
      ))}

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-bold text-slate-900">Footer CTA strip</h2>
        <BilingualInputs labelEn="Prompt (EN)" labelAr="Prompt (AR)" value={panel.footer.prompt} onChange={(prompt) => patchPanel({ footer: { ...panel.footer, prompt } })} />
        <BilingualInputs labelEn="Link label (EN)" labelAr="Link label (AR)" value={panel.footer.linkLabel} onChange={(linkLabel) => patchPanel({ footer: { ...panel.footer, linkLabel } })} />
        <label className="block text-sm">
          <span className="font-semibold text-slate-800">Link URL</span>
          <input className={inputClass} value={panel.footer.linkHref} onChange={(e) => patchPanel({ footer: { ...panel.footer, linkHref: e.target.value } })} />
        </label>
        <BilingualInputs labelEn="Button label (EN)" labelAr="Button label (AR)" value={panel.footer.buttonLabel} onChange={(buttonLabel) => patchPanel({ footer: { ...panel.footer, buttonLabel } })} />
        <label className="block text-sm">
          <span className="font-semibold text-slate-800">Button URL</span>
          <input className={inputClass} value={panel.footer.buttonHref} onChange={(e) => patchPanel({ footer: { ...panel.footer, buttonHref: e.target.value } })} />
        </label>
      </section>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <AdminFormActions
        saving={saving}
        publishing={publishing}
        statusLabel={
          publishStatus
            ? `${publishStatus.status}${publishStatus.lastPublishedAt ? ` · Last published ${new Date(publishStatus.lastPublishedAt).toLocaleString()}` : ''}`
            : null
        }
        onSave={handleSave}
        onPublish={handlePublish}
        onCancel={() => reload()}
      />
    </div>
  )
}
