import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import type { BlogPostRecord, BlogPostsDoc, BlogSectionDoc } from '../../types/blogContent'
import { useAdminSection } from '../hooks/useAdminSection'
import { useAdminToast } from '../AdminToastContext'
import { BilingualInputs } from '../cms/BilingualInputs'

export function AdminBlogPostsPage() {
  const sec = useAdminSection<BlogPostsDoc>('blogPosts')
  const sectionSec = useAdminSection<BlogSectionDoc>('blogSection')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<'all' | 'draft' | 'published'>('all')
  const toast = useAdminToast()

  const items = useMemo(() => {
    const rows = sec.data?.items || []
    return [...rows]
      .filter((p) => {
        if (status !== 'all' && p.status !== status) return false
        if (!query.trim()) return true
        const q = query.toLowerCase()
        return (p.title?.en || p.internalTitle || p.slug || '').toLowerCase().includes(q)
      })
      .sort((a, b) => Date.parse(b.updatedDate || b.publishDate || '') - Date.parse(a.updatedDate || a.publishDate || ''))
  }, [sec.data?.items, query, status])

  const duplicate = async (post: BlogPostRecord) => {
    if (!sec.data) return
    const copy: BlogPostRecord = {
      ...post,
      id: `post-${Date.now().toString(36)}`,
      slug: `${post.slug}-copy`,
      internalTitle: `${post.internalTitle || post.title.en} (copy)`,
      status: 'draft',
    }
    await sec.save({ ...sec.data, items: [...sec.data.items, copy] })
    toast.push('Draft duplicate created', 'success')
  }

  const togglePublish = async (post: BlogPostRecord) => {
    if (!sec.data) return
    const nextStatus: 'draft' | 'published' = post.status === 'published' ? 'draft' : 'published'
    const itemsNext = sec.data.items.map((p) =>
      p.id === post.id ? { ...p, status: nextStatus, publishDate: nextStatus === 'published' ? new Date().toISOString() : p.publishDate } : p,
    )
    await sec.save({ ...sec.data, items: itemsNext })
    await sec.publish()
    toast.push(nextStatus === 'published' ? 'Post published' : 'Post unpublished', 'success')
  }

  if (sec.loading) return <p className="py-8 text-sm text-slate-600">Loading blog posts…</p>

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Blog</h2>
          <p className="text-sm text-slate-600">Manage Insights articles for `/blog`.</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/content/blog/categories" className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold">Categories</Link>
          <Link to="/admin/content/blog/new" className="rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white">Add New Post</Link>
        </div>
      </div>

      {sectionSec.data ? (
        <section className="rounded-xl border border-slate-200 p-4 space-y-3">
          <h3 className="font-bold text-slate-900">Homepage Insights preview</h3>
          <label className="flex items-center gap-2 text-sm font-semibold">
            <input
              type="checkbox"
              checked={sectionSec.data.section?.enabled !== false}
              onChange={(e) =>
                sectionSec.setData({
                  ...sectionSec.data!,
                  section: { ...sectionSec.data!.section, enabled: e.target.checked },
                })
              }
            />
            Enable homepage section
          </label>
          <BilingualInputs
            labelEn="Heading"
            labelAr="Heading (AR)"
            value={sectionSec.data.section?.heading || { en: '', ar: '' }}
            onChange={(heading) => sectionSec.setData({ ...sectionSec.data!, section: { ...sectionSec.data!.section, heading } })}
          />
          <button
            type="button"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold"
            onClick={async () => {
              if (!sectionSec.data) return
              await sectionSec.save(sectionSec.data as BlogSectionDoc & Record<string, unknown>)
              await sectionSec.publish()
              toast.push('Homepage blog section published', 'success')
            }}
          >
            Save & publish homepage section
          </button>
        </section>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <input className="rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Search posts" value={query} onChange={(e) => setQuery(e.target.value)} />
        <select className="rounded-xl border border-slate-200 px-3 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
          <option value="all">All</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Category</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Published</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((post) => (
              <tr key={post.id} className="border-t border-slate-100">
                <td className="px-3 py-2 font-medium">{post.title?.en || post.internalTitle || post.slug}</td>
                <td className="px-3 py-2">{post.categoryId || '—'}</td>
                <td className="px-3 py-2">{post.status || 'draft'}</td>
                <td className="px-3 py-2">{post.publishDate ? new Date(post.publishDate).toLocaleDateString() : '—'}</td>
                <td className="px-3 py-2">
                  <div className="flex flex-wrap gap-2">
                    <Link to={`/admin/content/blog/${post.id}/edit`} className="text-brand font-semibold">Edit</Link>
                    <button type="button" className="font-semibold text-slate-700" onClick={() => duplicate(post)}>Duplicate</button>
                    <button type="button" className="font-semibold text-slate-700" onClick={() => togglePublish(post)}>
                      {post.status === 'published' ? 'Unpublish' : 'Publish'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
