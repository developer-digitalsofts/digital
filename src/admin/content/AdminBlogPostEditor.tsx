import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { Bilingual } from '../../cms/types'
import type { BlogBlock, BlogCategoriesDoc, BlogPostRecord, BlogPostsDoc } from '../../types/blogContent'
import { useAdminSection } from '../hooks/useAdminSection'
import { useAdminToast } from '../AdminToastContext'
import { BilingualInputs } from '../cms/BilingualInputs'
import { AdminFormActions } from '../cms/AdminFormActions'
import { hasCustomFeaturedImage } from '../../cms/blogMedia'
import { AdminLayoutMediaField } from '../layout/AdminLayoutMediaField'
import { AdminLocaleEditorBanner } from '../AdminLocaleEditorBanner'

const emptyBi = (): Bilingual => ({ en: '', ar: '' })

function slugify(input: string) {
  return input.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 120)
}

export function AdminBlogPostEditor({ mode }: { mode: 'new' | 'edit' }) {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const toast = useAdminToast()
  const postsSec = useAdminSection<BlogPostsDoc>('blogPosts')
  const catsSec = useAdminSection<BlogCategoriesDoc>('blogCategories')
  const [local, setLocal] = useState<BlogPostRecord | null>(null)

  useEffect(() => {
    if (postsSec.loading) return
    if (mode === 'new') {
      const nid = `post-${Date.now().toString(36)}`
      setLocal({
        id: nid,
        internalTitle: 'New article',
        title: emptyBi(),
        slug: '',
        excerpt: emptyBi(),
        featuredImage: '',
        featuredImageAlt: emptyBi(),
        categoryId: catsSec.data?.items?.[0]?.id || '',
        tags: [],
        author: { en: 'DigitalManager Team', ar: 'فريق ديجيتال مانجر' },
        authorRole: emptyBi(),
        authorImage: '',
        body: [{ id: 'p1', type: 'paragraph', text: emptyBi() }],
        relatedSolutionUrl: '',
        ctaHeading: emptyBi(),
        ctaDescription: emptyBi(),
        ctaLabel: { en: 'Book a Demo', ar: 'احجز عرضاً' },
        ctaUrl: '/contact',
        featured: false,
        showOnHomepage: false,
        sortOrder: 0,
        publishDate: '',
        updatedDate: new Date().toISOString(),
        status: 'draft',
        enabled: true,
        countryCode: 'AE',
        languageCode: 'en',
        seo: { title: emptyBi(), description: emptyBi(), canonicalUrl: '', ogTitle: emptyBi(), ogDescription: emptyBi(), ogImage: '' },
      })
      return
    }
    const found = postsSec.data?.items.find((p) => p.id === id)
    setLocal(found ? { ...found, body: found.body?.length ? found.body : [{ id: 'p1', type: 'paragraph', text: emptyBi() }] } : null)
  }, [mode, id, postsSec.loading, postsSec.data, catsSec.data?.items])

  const categories = catsSec.data?.items || []

  const save = async () => {
    if (!local || !postsSec.data) return
    const now = new Date().toISOString()
    const nextPost = {
      ...local,
      slug: local.slug || slugify(local.title.en || local.internalTitle || local.id),
      updatedDate: now,
      publishDate: local.status === 'published' && !local.publishDate ? now : local.publishDate,
    }
    const exists = postsSec.data.items.some((p) => p.id === nextPost.id)
    const items = exists
      ? postsSec.data.items.map((p) => (p.id === nextPost.id ? nextPost : p))
      : [...postsSec.data.items, nextPost]
    await postsSec.save({ ...postsSec.data, items })
    toast.push('Post saved', 'success')
    if (mode === 'new') navigate(`/admin/content/blog/${nextPost.id}/edit`, { replace: true })
  }

  const updateBlock = (blockId: string, patch: Partial<BlogBlock>) => {
    if (!local) return
    setLocal({
      ...local,
      body: local.body.map((b) => (b.id === blockId ? ({ ...b, ...patch } as BlogBlock) : b)),
    })
  }

  if (postsSec.loading || !local) return <p className="py-8 text-sm text-slate-600">Loading editor…</p>

  return (
    <div className="space-y-6">
      <AdminLocaleEditorBanner contentType="blog" globalIdentity={local.slug || 'blog'} slug={local.slug} />
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-slate-900">{mode === 'new' ? 'Add blog post' : 'Edit blog post'}</h2>
        <Link to="/admin/content/blog" className="text-sm font-semibold text-brand">Back to posts</Link>
      </div>

      <input className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Internal title" value={local.internalTitle || ''} onChange={(e) => setLocal({ ...local, internalTitle: e.target.value })} />
      <BilingualInputs labelEn="Public title" labelAr="Public title (AR)" value={local.title} onChange={(title) => setLocal({ ...local, title, slug: local.slug || slugify(title.en) })} />
      <label className="block text-sm">Slug<input className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={local.slug} onChange={(e) => setLocal({ ...local, slug: slugify(e.target.value) })} /></label>
      <BilingualInputs labelEn="Excerpt" labelAr="Excerpt (AR)" multiline rows={3} value={local.excerpt} onChange={(excerpt) => setLocal({ ...local, excerpt })} />
      <AdminLayoutMediaField label="Featured image" value={local.featuredImage || ''} onChange={(featuredImage) => setLocal({ ...local, featuredImage })} />
      <BilingualInputs labelEn="Featured image alt" labelAr="Featured image alt (AR)" value={local.featuredImageAlt || emptyBi()} onChange={(featuredImageAlt) => setLocal({ ...local, featuredImageAlt })} />

      <label className="block text-sm">
        Category
        <select className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={local.categoryId || ''} onChange={(e) => setLocal({ ...local, categoryId: e.target.value })}>
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name.en}</option>
          ))}
        </select>
      </label>

      <BilingualInputs labelEn="Author" labelAr="Author (AR)" value={local.author || emptyBi()} onChange={(author) => setLocal({ ...local, author })} />
      <BilingualInputs labelEn="Author role" labelAr="Author role (AR)" value={local.authorRole || emptyBi()} onChange={(authorRole) => setLocal({ ...local, authorRole })} />

      <section className="space-y-3 rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">Article body</h3>
          <button
            type="button"
            className="text-sm font-semibold text-brand"
            onClick={() =>
              setLocal({
                ...local,
                body: [...local.body, { id: `b-${Date.now()}`, type: 'paragraph', text: emptyBi() }],
              })
            }
          >
            Add paragraph
          </button>
        </div>
        {local.body.map((block) => {
          if (block.type === 'paragraph' || block.type === 'heading2' || block.type === 'heading3') {
            return (
              <div key={block.id} className="rounded-lg border border-slate-100 p-3">
                <p className="mb-2 text-xs font-bold uppercase text-slate-500">{block.type}</p>
                <BilingualInputs labelEn="Text (EN)" labelAr="Text (AR)" multiline rows={block.type === 'paragraph' ? 4 : 2} value={block.text} onChange={(text) => updateBlock(block.id, { text })} />
              </div>
            )
          }
          if (block.type === 'image') {
            return (
              <div key={block.id} className="rounded-lg border border-slate-100 p-3 space-y-2">
                <AdminLayoutMediaField label="Image" value={block.src} onChange={(src) => updateBlock(block.id, { src })} />
                <BilingualInputs labelEn="Caption" labelAr="Caption (AR)" value={block.caption || emptyBi()} onChange={(caption) => updateBlock(block.id, { caption })} />
              </div>
            )
          }
          return null
        })}
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={local.featured === true} onChange={(e) => setLocal({ ...local, featured: e.target.checked })} />Featured post</label>
        <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={local.showOnHomepage === true} onChange={(e) => setLocal({ ...local, showOnHomepage: e.target.checked })} />Show on homepage</label>
        <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={local.enabled !== false} onChange={(e) => setLocal({ ...local, enabled: e.target.checked })} />Enabled</label>
        <label className="text-sm">Status
          <select className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" value={local.status || 'draft'} onChange={(e) => setLocal({ ...local, status: e.target.value as 'draft' | 'published' })}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
      </section>

      <BilingualInputs labelEn="SEO title" labelAr="SEO title (AR)" value={local.seo?.title || emptyBi()} onChange={(title) => setLocal({ ...local, seo: { ...(local.seo || {}), title } })} />
      <BilingualInputs labelEn="SEO description" labelAr="SEO description (AR)" multiline rows={2} value={local.seo?.description || emptyBi()} onChange={(description) => setLocal({ ...local, seo: { ...(local.seo || {}), description } })} />

      {local.slug && local.status === 'published' ? (
        <p className="text-sm">
          <a href={`/blog/${local.slug}`} target="_blank" rel="noreferrer" className="font-semibold text-brand">
            Preview published article
          </a>
        </p>
      ) : null}

      <AdminFormActions
        saving={postsSec.saving}
        publishing={postsSec.publishing}
        onSave={save}
        onPublish={async () => {
          if (!hasCustomFeaturedImage(local.featuredImage)) {
            const proceed = window.confirm(
              'This post has no featured image. The site will use a branded fallback image. Add a featured image in the Media Library before publishing if possible. Publish anyway?',
            )
            if (!proceed) return
          }
          setLocal((prev) => (prev ? { ...prev, status: 'published', publishDate: prev.publishDate || new Date().toISOString() } : prev))
          await save()
          await postsSec.publish()
          toast.push('Post published', 'success')
        }}
        onCancel={() => navigate('/admin/content/blog')}
        disableSave={false}
        statusLabel={local.status || 'draft'}
      />
    </div>
  )
}
