import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Bilingual } from '../../cms/types'
import type { BlogCategoriesDoc, BlogCategory } from '../../types/blogContent'
import { useAdminSection } from '../hooks/useAdminSection'
import { useAdminToast } from '../AdminToastContext'
import { BilingualInputs } from '../cms/BilingualInputs'
import { AdminFormActions } from '../cms/AdminFormActions'

const emptyBi = (): Bilingual => ({ en: '', ar: '' })

function slugify(input: string) {
  return input.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80)
}

export function AdminBlogCategoriesPage() {
  const sec = useAdminSection<BlogCategoriesDoc>('blogCategories')
  const sectionSec = useAdminSection<{ schemaVersion?: number; section?: Record<string, unknown> }>('blogSection')
  const toast = useAdminToast()
  const [local, setLocal] = useState<BlogCategoriesDoc | null>(null)
  const [baseline, setBaseline] = useState('')

  useEffect(() => {
    if (!sec.data) return
    setLocal({ ...sec.data, items: [...(sec.data.items || [])].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)) })
    setBaseline(JSON.stringify(sec.data))
  }, [sec.data])

  const save = async () => {
    if (!local) return
    await sec.save(local as BlogCategoriesDoc & Record<string, unknown>)
    setBaseline(JSON.stringify(local))
    toast.push('Categories saved', 'success')
  }

  const updateItem = (id: string, patch: Partial<BlogCategory>) => {
    if (!local) return
    setLocal({ ...local, items: local.items.map((c) => (c.id === id ? { ...c, ...patch } : c)) })
  }

  if (sec.loading || !local) return <p className="py-8 text-sm text-slate-600">Loading categories…</p>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Blog categories</h2>
        <Link to="/admin/content/blog" className="text-sm font-semibold text-brand">Back to posts</Link>
      </div>

      <button
        type="button"
        className="rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white"
        onClick={() => {
          const id = `cat-${Date.now().toString(36)}`
          setLocal({
            ...local,
            items: [
              ...local.items,
              { id, name: emptyBi(), slug: id, description: emptyBi(), sortOrder: local.items.length, enabled: true },
            ],
          })
        }}
      >
        Add category
      </button>

      <div className="space-y-4">
        {local.items.map((cat) => (
          <div key={cat.id} className="rounded-xl border border-slate-200 p-4 space-y-2">
            <BilingualInputs labelEn="Name" labelAr="Name (AR)" value={cat.name} onChange={(name) => updateItem(cat.id, { name, slug: cat.slug || slugify(name.en) })} />
            <label className="block text-sm">Slug<input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={cat.slug} onChange={(e) => updateItem(cat.id, { slug: slugify(e.target.value) })} /></label>
            <BilingualInputs labelEn="Description" labelAr="Description (AR)" multiline rows={2} value={cat.description || emptyBi()} onChange={(description) => updateItem(cat.id, { description })} />
            <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={cat.enabled !== false} onChange={(e) => updateItem(cat.id, { enabled: e.target.checked })} />Enabled</label>
          </div>
        ))}
      </div>

      <AdminFormActions
        saving={sec.saving}
        publishing={sec.publishing}
        onSave={save}
        onPublish={async () => {
          await save()
          await sec.publish()
          if (sectionSec.data) await sectionSec.publish()
          toast.push('Categories published', 'success')
        }}
        onCancel={() => {
          try {
            setLocal(JSON.parse(baseline) as BlogCategoriesDoc)
          } catch {
            /* */
          }
        }}
        disableSave={JSON.stringify(local) === baseline}
        statusLabel={sec.publishStatus?.status || null}
      />
    </div>
  )
}
