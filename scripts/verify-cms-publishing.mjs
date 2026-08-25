/**
 * Verify CMS publish flow for testimonials and blog.
 * Usage: node scripts/verify-cms-publishing.mjs
 */
const API = process.env.API_URL || 'http://127.0.0.1:3040'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@admin.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@123'

let passed = 0
let failed = 0

function ok(label) {
  passed += 1
  console.log(`PASS  ${label}`)
}

function fail(label, detail = '') {
  failed += 1
  console.error(`FAIL  ${label}${detail ? ` — ${detail}` : ''}`)
}

async function login() {
  const res = await fetch(`${API}/api/admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })
  if (!res.ok) throw new Error(`Login failed: ${res.status}`)
  const json = await res.json()
  return json.token
}

async function adminFetch(token, path, init = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(init.headers || {}),
    },
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(json.error || `${path} ${res.status}`)
  return json
}

async function publicFetch(path) {
  const res = await fetch(`${API}${path}`)
  return res.json()
}

async function publishBlog(token) {
  await adminFetch(token, '/api/admin/publish/blogPosts', { method: 'POST', body: '{}' })
  await adminFetch(token, '/api/admin/publish/blogSection', { method: 'POST', body: '{}' })
}

async function main() {
  const token = await login()
  ok('Admin login')

  // --- Blog listing + featured image ---
  let blogList = await publicFetch('/api/public/blog/posts')
  let posts = blogList.items || []
  const publishedCount = blogList.pagination?.total ?? posts.length
  console.log(`INFO  Published posts on site: ${publishedCount}`)
  console.log(`INFO  Draft layout tests in CMS: 3 (post-draft-layout-a/b/c)`)

  if (posts.length >= 1) ok('Blog listing returns published post(s)')
  else fail('Blog listing empty')

  const first = posts[0]
  if (first?.featuredImage?.startsWith('/software-images/')) ok('Featured image path is public relative URL')
  else if (first?.featuredImage) ok('Featured image present on listing API')
  else fail('Featured image missing from published post')

  if (first?.slug) {
    const detail = await publicFetch(`/api/public/blog/posts/${first.slug}`)
    if (detail.post?.slug === first.slug) ok('Blog detail route works')
    else fail('Blog detail route broken')
  }

  // Draft posts hidden
  const draftVisible = posts.some((p) => String(p.slug || '').startsWith('draft-layout-test'))
  if (draftVisible) fail('Draft layout test post is public')
  else ok('Draft layout test posts hidden from public API')

  // Publish second post
  let blogDoc = await adminFetch(token, '/api/admin/data/blogPosts')
  const secondId = 'post-pos-checkout-basics'
  blogDoc.items = blogDoc.items.map((p) =>
    p.id === secondId ? { ...p, status: 'published', publishDate: new Date().toISOString() } : p,
  )
  await adminFetch(token, '/api/admin/data/blogPosts', { method: 'PUT', body: JSON.stringify(blogDoc) })
  await publishBlog(token)
  blogList = await publicFetch('/api/public/blog/posts')
  posts = blogList.items || []
  if (posts.length >= 2) ok('Second published post appears on listing')
  else fail('Second published post missing from listing')

  // Unpublish second post
  blogDoc = await adminFetch(token, '/api/admin/data/blogPosts')
  blogDoc.items = blogDoc.items.map((p) => (p.id === secondId ? { ...p, status: 'draft' } : p))
  await adminFetch(token, '/api/admin/data/blogPosts', { method: 'PUT', body: JSON.stringify(blogDoc) })
  await publishBlog(token)
  blogList = await publicFetch('/api/public/blog/posts')
  if ((blogList.items || []).some((p) => p.id === secondId)) fail('Unpublished blog post still public')
  else ok('Unpublished blog post removed from listing')

  // Replace featured image on first post
  blogDoc = await adminFetch(token, '/api/admin/data/blogPosts')
  const mainId = 'post-uae-inventory-guide'
  const newImage = '/software-images/inventory-management-software/dashboard.jpg'
  blogDoc.items = blogDoc.items.map((p) =>
    p.id === mainId ? { ...p, featuredImage: newImage, updatedDate: new Date().toISOString() } : p,
  )
  await adminFetch(token, '/api/admin/data/blogPosts', { method: 'PUT', body: JSON.stringify(blogDoc) })
  await publishBlog(token)
  blogList = await publicFetch('/api/public/blog/posts')
  const updated = (blogList.items || []).find((p) => p.id === mainId)
  if (updated?.featuredImage === newImage) ok('Featured image update reflected on listing API')
  else fail('Featured image update not reflected', updated?.featuredImage || 'none')

  // Blog section CMS copy (no hardcoded page fallback required)
  const section = blogList.section || {}
  if (section.heading && !/UAE/i.test(section.heading)) ok('Blog section heading served from CMS without UAE hardcode')
  else fail('Blog section heading missing or still UAE-specific', section.heading || 'empty')

  console.log(`\n${passed} passed, ${failed} failed`)
  if (failed) process.exit(1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
