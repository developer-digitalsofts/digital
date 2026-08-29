import { useCallback, useEffect, useMemo, useState } from 'react'
import { adminFetch } from '../adminApi'
import { useAdminToast } from '../AdminToastContext'
import { AdminJsonEditor } from '../AdminJsonEditor'
import { AdminFormActions } from '../cms/AdminFormActions'
import { BilingualInputs } from '../cms/BilingualInputs'
import { ConfirmDialog } from '../cms/ConfirmDialog'
import { useAdminLocale } from '../AdminLocaleContext'
import { AdminLayoutMediaField } from './AdminLayoutMediaField'
import { AdminLocaleEditorBanner } from '../AdminLocaleEditorBanner'
import { ADMIN_EDITOR_LOCALE } from '../adminLocaleSections'
import type { Bilingual, CmsHeader, CmsHeaderNavLink } from '../../cms/types'

const DEFAULT_NAV_LINKS: CmsHeaderNavLink[] = [
  { id: 'nl-home', label: { en: 'Home', ar: 'الرئيسية' }, href: '/', sortOrder: 0, active: true },
      { id: 'nl-about', label: { en: 'About Us', ar: 'من نحن' }, href: '/#industries', sortOrder: 1, active: true },
  { id: 'nl-services', label: { en: 'Services', ar: 'الخدمات' }, href: '/#modules', sortOrder: 2, active: true },
  { id: 'nl-projects', label: { en: 'Projects', ar: 'المشاريع' }, href: '/#workflow', sortOrder: 3, active: true },
  { id: 'nl-residential', label: { en: 'Residential', ar: 'سكني' }, href: '/residential', sortOrder: 4, active: true },
  { id: 'nl-blog', label: { en: 'Blog', ar: 'المدونة' }, href: '/blog', sortOrder: 5, active: true },
  { id: 'nl-contact', label: { en: 'Contact Us', ar: 'اتصل بنا' }, href: '/contact', sortOrder: 6, active: true },
]

function bi(en: string, ar: string): Bilingual {
  return { en, ar }
}

function normalizeHeader(raw: Record<string, unknown>): CmsHeader & { _meta?: Record<string, unknown> } {
  const h = raw as Partial<CmsHeader> & { _meta?: Record<string, unknown> }
  const topBar = h.topBar ?? {
    email: '',
    hours: bi('', ''),
    phoneCta: bi('', ''),
    phoneDisplay: '',
    phoneHref: '',
  }
  const nav = h.nav ?? {
    home: bi('Home', 'الرئيسية'),
    modules: bi('Software by module', ''),
    industries: bi('Software by industries', ''),
    contact: bi('Contact', ''),
    arabicToggle: bi('', ''),
  }
  const navLinks =
    Array.isArray(h.navLinks) && (h.navLinks as CmsHeaderNavLink[]).length > 0
      ? ([...(h.navLinks as CmsHeaderNavLink[])] as CmsHeaderNavLink[])
      : [...DEFAULT_NAV_LINKS]
  const loginButton = h.loginButton ?? { text: bi('Login', 'تسجيل الدخول'), href: '/admin/login' }
  const getInTouch = h.getInTouch ?? { show: false, text: bi('Get in Touch', 'تواصل معنا'), href: '/contact' }
  const branding = h.branding ?? { siteName: bi('DigitalManager', 'ديجيتال مانجر'), tagline: bi('', '') }
  return {
    logoUrl: typeof h.logoUrl === 'string' ? h.logoUrl : '/digitalmanager.svg',
    faviconUrl: typeof h.faviconUrl === 'string' ? h.faviconUrl : '/digitalmanager-favicon.png',
    showTopBar: h.showTopBar !== false,
    topBar: {
      email: typeof topBar.email === 'string' ? topBar.email : '',
      hours: topBar.hours ?? bi('', ''),
      phoneCta: topBar.phoneCta ?? bi('', ''),
      phoneDisplay: typeof topBar.phoneDisplay === 'string' ? topBar.phoneDisplay : '',
      phoneHref: typeof topBar.phoneHref === 'string' ? topBar.phoneHref : '',
    },
    nav: {
      home: nav.home ?? bi('Home', 'الرئيسية'),
      modules: nav.modules ?? bi('Software by module', ''),
      industries: nav.industries ?? bi('Software by industries', ''),
      contact: nav.contact ?? bi('Contact', ''),
      arabicToggle: nav.arabicToggle ?? bi('النسخة العربية', 'English version'),
    },
    showSearch: h.showSearch !== false,
    showContactGrid: h.showContactGrid === true,
    showLoginButton: h.showLoginButton !== false,
    loginButton,
    navStyle: h.navStyle === 'simple' ? 'simple' : 'mega',
    branding,
    navLinks,
    getInTouch,
    showLangSwitcher: h.showLangSwitcher === true,
    _meta: h._meta,
  }
}

async function fetchHeaderDraft() {
  const raw = await adminFetch<Record<string, unknown>>('/api/admin/data/header')
  return normalizeHeader(raw)
}

export function AdminHeaderEditor() {
  const toast = useAdminToast()
  const { setDirty: setLocaleDirty } = useAdminLocale()
  const [local, setLocal] = useState<(CmsHeader & { _meta?: Record<string, unknown> }) | null>(null)
  const [baseline, setBaseline] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [delNavId, setDelNavId] = useState<string | null>(null)
  const [jsonOpen, setJsonOpen] = useState(false)

  const reload = useCallback(async () => {
    try {
      const n = await fetchHeaderDraft()
      setLocal(n)
      setBaseline(JSON.stringify(n))
      setErr(null)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Load failed')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    fetchHeaderDraft()
      .then((n) => {
        if (!active) return
        setLocal(n)
        setBaseline(JSON.stringify(n))
        setErr(null)
      })
      .catch((e: Error) => {
        if (!active) return
        setErr(e.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const dirty = useMemo(() => (local ? JSON.stringify(local) !== baseline : false), [local, baseline])

  useEffect(() => {
    setLocaleDirty(dirty)
  }, [dirty, setLocaleDirty])

  const cancel = () => {
    try {
      setLocal(JSON.parse(baseline) as CmsHeader & { _meta?: Record<string, unknown> })
      toast.push('Changes reverted', 'info')
    } catch {
      /* */
    }
  }

  const save = async () => {
    if (!local) return
    setSaving(true)
    setErr(null)
    try {
      await adminFetch('/api/admin/data/header', {
        method: 'PUT',
        body: JSON.stringify(local),
      })
      toast.push('Draft saved', 'success')
      await reload()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Save failed'
      setErr(msg)
      toast.push(msg, 'error')
    } finally {
      setSaving(false)
    }
  }

  const publish = async () => {
    await save()
    setPublishing(true)
    try {
      await adminFetch('/api/admin/publish/header', { method: 'POST', body: '{}' })
      toast.push('Published successfully', 'success')
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Publish failed'
      setErr(msg)
      toast.push(msg, 'error')
    } finally {
      setPublishing(false)
    }
  }

  const sortedNav = useMemo(() => {
    if (!local?.navLinks) return []
    return [...local.navLinks].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  }, [local])

  if (loading || !local) {
    return (
      <div className="flex items-center gap-2 py-12 text-sm text-slate-600">
        <span className="size-5 animate-spin rounded-full border-2 border-brand border-t-transparent" aria-hidden />
        Loading header…
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-8">
      <AdminLocaleEditorBanner {...ADMIN_EDITOR_LOCALE.header} />
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Header</h1>
        <p className="mt-1 text-sm text-slate-600">
          Logo, top bar, navigation, and header actions. Use <strong className="font-semibold text-slate-800">Simple links</strong> mode for a
          classic menu list, or <strong className="font-semibold text-slate-800">Mega menu</strong> to keep Software-by-module and Software-by-industry
          panels.
        </p>
      </header>

      {err ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{err}</p> : null}

      <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Logo & branding</h2>
        <div className="mt-4 space-y-5">
          <AdminLayoutMediaField label="Logo image" value={local.logoUrl} onChange={(logoUrl) => setLocal({ ...local, logoUrl })} />
          <AdminLayoutMediaField label="Favicon" value={local.faviconUrl} onChange={(faviconUrl) => setLocal({ ...local, faviconUrl })} hint="Shown in browser tab; ICO or PNG works well." />
          <BilingualInputs
            labelEn="Website name (English)"
            labelAr="Website name (Arabic)"
            value={local.branding?.siteName ?? bi('', '')}
            onChange={(siteName) => setLocal({ ...local, branding: { ...local.branding!, siteName } })}
          />
          <BilingualInputs
            labelEn="Tagline (English, optional)"
            labelAr="Tagline (Arabic, optional)"
            value={local.branding?.tagline ?? bi('', '')}
            onChange={(tagline) => setLocal({ ...local, branding: { ...local.branding!, tagline } })}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Top bar</h2>
        <div className="mt-4 space-y-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <input
              type="checkbox"
              checked={local.showTopBar !== false}
              onChange={(e) => setLocal({ ...local, showTopBar: e.target.checked })}
            />
            Show top bar
          </label>
          <label className="block text-sm">
            <span className="font-semibold text-slate-800">Email</span>
            <input
              className="mt-1 w-full max-w-md rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
              value={local.topBar.email}
              onChange={(e) => setLocal({ ...local, topBar: { ...local.topBar, email: e.target.value } })}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-semibold text-slate-800">Phone display</span>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
                value={local.topBar.phoneDisplay}
                onChange={(e) => setLocal({ ...local, topBar: { ...local.topBar, phoneDisplay: e.target.value } })}
              />
            </label>
            <label className="block text-sm">
              <span className="font-semibold text-slate-800">Phone link (tel:)</span>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
                value={local.topBar.phoneHref}
                onChange={(e) => setLocal({ ...local, topBar: { ...local.topBar, phoneHref: e.target.value } })}
              />
            </label>
          </div>
          <BilingualInputs
            labelEn="Phone label (English)"
            labelAr="Phone label (Arabic)"
            value={local.topBar.phoneCta}
            onChange={(phoneCta) => setLocal({ ...local, topBar: { ...local.topBar, phoneCta } })}
          />
          <BilingualInputs
            labelEn="Working hours (English)"
            labelAr="Working hours (Arabic)"
            multiline
            rows={2}
            value={local.topBar.hours}
            onChange={(hours) => setLocal({ ...local, topBar: { ...local.topBar, hours } })}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Navigation</h2>
        <div className="mt-4 space-y-4">
          <label className="block text-sm">
            <span className="font-semibold text-slate-800">Navigation style</span>
            <select
              className="mt-1 w-full max-w-md rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
              value={local.navStyle === 'simple' ? 'simple' : 'mega'}
              onChange={(e) => setLocal({ ...local, navStyle: e.target.value as 'mega' | 'simple' })}
            >
              <option value="mega">Mega menu (Software modules + Industries)</option>
              <option value="simple">Simple link menu</option>
            </select>
          </label>

          {local.navStyle === 'mega' ? (
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-600">Mega menu labels</p>
              <div className="space-y-3">
                <BilingualInputs
                  labelEn="Home (EN)"
                  labelAr="Home (AR)"
                  value={local.nav.home}
                  onChange={(home) => setLocal({ ...local, nav: { ...local.nav, home } })}
                />
                <BilingualInputs
                  labelEn="Software by module (EN)"
                  labelAr="Software by module (AR)"
                  value={local.nav.modules}
                  onChange={(modules) => setLocal({ ...local, nav: { ...local.nav, modules } })}
                />
                <BilingualInputs
                  labelEn="Software by industries (EN)"
                  labelAr="Software by industries (AR)"
                  value={local.nav.industries}
                  onChange={(industries) => setLocal({ ...local, nav: { ...local.nav, industries } })}
                />
                <BilingualInputs
                  labelEn="Contact (EN)"
                  labelAr="Contact (AR)"
                  value={local.nav.contact}
                  onChange={(contact) => setLocal({ ...local, nav: { ...local.nav, contact } })}
                />
                <BilingualInputs
                  labelEn="Language toggle (EN)"
                  labelAr="Language toggle (AR)"
                  value={local.nav.arabicToggle}
                  onChange={(arabicToggle) => setLocal({ ...local, nav: { ...local.nav, arabicToggle } })}
                />
              </div>
            </div>
          ) : null}

          <div>
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-semibold text-slate-800">Menu items {local.navStyle === 'simple' ? '(visible on site)' : '(used when you switch to Simple)'}</p>
              <button
                type="button"
                className="text-xs font-bold uppercase tracking-wide text-brand hover:underline"
                onClick={() => {
                  const id = `nl-${crypto.randomUUID().slice(0, 10)}`
                  setLocal({
                    ...local,
                    navLinks: [
                      ...(local.navLinks ?? []),
                      { id, label: bi('', ''), href: '/', sortOrder: (local.navLinks?.length ?? 0) + 10, active: true },
                    ],
                  })
                }}
              >
                + Add menu item
              </button>
            </div>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="min-w-full text-left text-xs">
                <thead className="bg-slate-50 font-bold uppercase text-slate-600">
                  <tr>
                    <th className="px-2 py-2">Label EN</th>
                    <th className="px-2 py-2">Label AR</th>
                    <th className="px-2 py-2">URL</th>
                    <th className="px-2 py-2">Sort</th>
                    <th className="px-2 py-2">On</th>
                    <th className="px-2 py-2" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedNav.map((row) => (
                    <tr key={row.id}>
                      <td className="px-2 py-1">
                        <input
                          className="w-full min-w-[6rem] rounded border border-slate-200 px-1 py-1"
                          value={row.label.en}
                          onChange={(e) =>
                            setLocal({
                              ...local,
                              navLinks: local.navLinks!.map((x) =>
                                x.id === row.id ? { ...x, label: { ...x.label, en: e.target.value } } : x,
                              ),
                            })
                          }
                        />
                      </td>
                      <td className="px-2 py-1">
                        <input
                          className="w-full min-w-[6rem] rounded border border-slate-200 px-1 py-1"
                          dir="rtl"
                          value={row.label.ar}
                          onChange={(e) =>
                            setLocal({
                              ...local,
                              navLinks: local.navLinks!.map((x) =>
                                x.id === row.id ? { ...x, label: { ...x.label, ar: e.target.value } } : x,
                              ),
                            })
                          }
                        />
                      </td>
                      <td className="px-2 py-1">
                        <input
                          className="w-full min-w-[8rem] rounded border border-slate-200 px-1 py-1 font-mono text-[11px]"
                          value={row.href}
                          onChange={(e) =>
                            setLocal({
                              ...local,
                              navLinks: local.navLinks!.map((x) => (x.id === row.id ? { ...x, href: e.target.value } : x)),
                            })
                          }
                        />
                      </td>
                      <td className="px-2 py-1">
                        <input
                          type="number"
                          className="w-14 rounded border border-slate-200 px-1 py-1"
                          value={row.sortOrder}
                          onChange={(e) =>
                            setLocal({
                              ...local,
                              navLinks: local.navLinks!.map((x) =>
                                x.id === row.id ? { ...x, sortOrder: Number(e.target.value) || 0 } : x,
                              ),
                            })
                          }
                        />
                      </td>
                      <td className="px-2 py-1">
                        <input
                          type="checkbox"
                          checked={row.active !== false}
                          onChange={(e) =>
                            setLocal({
                              ...local,
                              navLinks: local.navLinks!.map((x) => (x.id === row.id ? { ...x, active: e.target.checked } : x)),
                            })
                          }
                        />
                      </td>
                      <td className="px-2 py-1">
                        <button type="button" className="text-red-600 hover:underline" onClick={() => setDelNavId(row.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Header actions</h2>
        <div className="mt-4 space-y-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <input
              type="checkbox"
              checked={local.getInTouch?.show === true}
              onChange={(e) =>
                setLocal({
                  ...local,
                  getInTouch: {
                    text: local.getInTouch?.text ?? bi('Get in Touch', 'تواصل معنا'),
                    href: local.getInTouch?.href ?? '/contact',
                    show: e.target.checked,
                  },
                })
              }
            />
            Show “Get in Touch” button
          </label>
          <BilingualInputs
            labelEn="Get in Touch text (EN)"
            labelAr="Get in Touch text (AR)"
            value={local.getInTouch?.text ?? bi('', '')}
            onChange={(text) =>
              setLocal({
                ...local,
                getInTouch: { show: local.getInTouch?.show === true, href: local.getInTouch?.href ?? '/contact', text },
              })
            }
          />
          <label className="block text-sm">
            <span className="font-semibold text-slate-800">Get in Touch URL</span>
            <input
              className="mt-1 w-full max-w-md rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
              value={local.getInTouch?.href ?? ''}
              onChange={(e) =>
                setLocal({
                  ...local,
                  getInTouch: {
                    show: local.getInTouch?.show === true,
                    text: local.getInTouch?.text ?? bi('Get in Touch', 'تواصل معنا'),
                    href: e.target.value,
                  },
                })
              }
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <input
              type="checkbox"
              checked={local.showSearch !== false}
              onChange={(e) => setLocal({ ...local, showSearch: e.target.checked })}
            />
            Show search icon
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <input
              type="checkbox"
              checked={local.showLangSwitcher !== false}
              onChange={(e) => setLocal({ ...local, showLangSwitcher: e.target.checked })}
            />
            Show language switcher
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <input
              type="checkbox"
              checked={local.showLoginButton !== false}
              onChange={(e) => setLocal({ ...local, showLoginButton: e.target.checked })}
            />
            Show login button
          </label>
          <BilingualInputs
            labelEn="Login button text (EN)"
            labelAr="Login button text (AR)"
            value={local.loginButton?.text ?? bi('', '')}
            onChange={(text) =>
              setLocal({
                ...local,
                loginButton: { href: local.loginButton?.href ?? '/admin/login', text },
              })
            }
          />
          <label className="block text-sm">
            <span className="font-semibold text-slate-800">Login button URL</span>
            <input
              className="mt-1 w-full max-w-md rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
              value={local.loginButton?.href ?? ''}
              onChange={(e) =>
                setLocal({
                  ...local,
                  loginButton: { text: local.loginButton?.text ?? bi('Login', 'تسجيل الدخول'), href: e.target.value },
                })
              }
            />
          </label>
        </div>
      </section>

      <AdminFormActions
        saving={saving}
        publishing={publishing}
        onSave={save}
        onPublish={publish}
        onCancel={cancel}
        disableSave={!dirty}
      />

      <details
        className="rounded-2xl border border-amber-200/80 bg-amber-50/40 px-4 py-3 text-sm"
        onToggle={(e) => setJsonOpen((e.target as HTMLDetailsElement).open)}
      >
        <summary className="cursor-pointer font-bold text-amber-950">Advanced / Developer — raw JSON</summary>
        <div className="mt-4 border-t border-amber-200/60 pt-4">
          {jsonOpen ? <AdminJsonEditor section="header" title="Header (JSON)" embedded /> : null}
        </div>
      </details>

      <ConfirmDialog
        open={!!delNavId}
        title="Delete menu item?"
        message="Are you sure you want to delete this item?"
        confirmLabel="Delete"
        onClose={() => setDelNavId(null)}
        onConfirm={() => {
          if (!delNavId) return
          setLocal((l) => (l ? { ...l, navLinks: l.navLinks?.filter((x) => x.id !== delNavId) } : l))
          setDelNavId(null)
        }}
      />
    </div>
  )
}
