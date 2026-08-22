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
import type { Bilingual } from '../../cms/types'
import type { FooterSocialItem, FooterSocialPlatform } from '../../components/SocialIconLinks'

type FooterRow = { id: string; label: Bilingual; href: string; sortOrder: number; active: boolean }

type FooterDraft = {
  _meta?: Record<string, unknown>
  logoUrl: string
  tagline: Bilingual
  columnProduct: Bilingual
  columnIndustries: Bilingual
  columnCompany: Bilingual
  columnContact: Bilingual
  productLinks: FooterRow[]
  industryLinks: FooterRow[]
  companyLinks: FooterRow[]
  contact: {
    address: Bilingual
    phoneDisplay: string
    phoneHref: string
    email: string
    whatsappLabel: Bilingual
    whatsappHref: string
  }
  social: FooterSocialItem[]
  rightsSuffix: Bilingual
  copyrightLine: Bilingual
  privacy: { label: Bilingual; href: string }
  terms: { label: Bilingual; href: string }
  sitemap: { label: Bilingual; href: string }
}

function bi(en: string, ar: string): Bilingual {
  return { en, ar }
}

function migrateLink(row: { id: string; label?: Bilingual; href: string; sortOrder?: number; active?: boolean }, i: number): FooterRow {
  return {
    id: row.id,
    label: row.label ?? bi('', ''),
    href: row.href,
    sortOrder: typeof row.sortOrder === 'number' ? row.sortOrder : i,
    active: row.active !== false,
  }
}

function normalizeFooter(raw: Record<string, unknown>): FooterDraft {
  const f = raw as Partial<FooterDraft> & { _meta?: Record<string, unknown> }
  const pl = (f.productLinks ?? []).map((r, i) => migrateLink(r as FooterRow, i))
  const il = (f.industryLinks ?? []).map((r, i) => migrateLink(r as FooterRow, i))
  const cl = (f.companyLinks ?? []).map((r, i) => migrateLink(r as FooterRow, i))
  const contact = f.contact ?? {}
  const social = Array.isArray(f.social) && f.social.length ? ([...f.social] as FooterSocialItem[]) : defaultSocialFromSeed()
  return {
    _meta: f._meta,
    logoUrl: typeof f.logoUrl === 'string' ? f.logoUrl : '/digitalmanager.svg',
    tagline: f.tagline ?? bi('', ''),
    columnProduct: f.columnProduct ?? bi('Product', 'المنتج'),
    columnIndustries: f.columnIndustries ?? bi('Industries', 'القطاعات'),
    columnCompany: f.columnCompany ?? bi('Company', 'الشركة'),
    columnContact: f.columnContact ?? bi('Contact', 'اتصل'),
    productLinks: pl.length ? pl : [],
    industryLinks: il.length ? il : [],
    companyLinks: cl.length ? cl : [],
    contact: {
      address: (contact as { address?: Bilingual }).address ?? bi('', ''),
      phoneDisplay: typeof (contact as { phoneDisplay?: string }).phoneDisplay === 'string' ? (contact as { phoneDisplay: string }).phoneDisplay : '',
      phoneHref: typeof (contact as { phoneHref?: string }).phoneHref === 'string' ? (contact as { phoneHref: string }).phoneHref : '',
      email: typeof (contact as { email?: string }).email === 'string' ? (contact as { email: string }).email : '',
      whatsappLabel: (contact as { whatsappLabel?: Bilingual }).whatsappLabel ?? bi('WhatsApp', 'واتساب'),
      whatsappHref: typeof (contact as { whatsappHref?: string }).whatsappHref === 'string' ? (contact as { whatsappHref: string }).whatsappHref : '',
    },
    social,
    rightsSuffix: f.rightsSuffix ?? bi('', ''),
    copyrightLine: f.copyrightLine ?? bi('', ''),
    privacy: {
      label: f.privacy?.label ?? bi('', ''),
      href: f.privacy?.href ?? '#',
    },
    terms: {
      label: f.terms?.label ?? bi('', ''),
      href: f.terms?.href ?? '#',
    },
    sitemap: {
      label: f.sitemap?.label ?? bi('Sitemap', 'خريطة الموقع'),
      href: f.sitemap?.href ?? '',
    },
  }
}

function defaultSocialFromSeed(): FooterSocialItem[] {
  return [
    { id: 's1', platform: 'facebook', href: 'https://www.facebook.com/Digitalsoftsltd' },
    { id: 's2', platform: 'twitter', href: 'https://twitter.com/DIGITALSOFTS' },
    { id: 's3', platform: 'linkedin', href: 'https://www.linkedin.com/company/digitalsofts/' },
    { id: 's4', platform: 'instagram', href: '' },
    { id: 's5', platform: 'youtube', href: '' },
  ]
}

type LinkField = 'productLinks' | 'industryLinks' | 'companyLinks'

async function fetchFooterDraft() {
  const raw = await adminFetch<Record<string, unknown>>('/api/admin/data/footer')
  return normalizeFooter(raw)
}

export function AdminFooterEditor() {
  const toast = useAdminToast()
  const { setDirty: setLocaleDirty } = useAdminLocale()
  const [local, setLocal] = useState<FooterDraft | null>(null)
  const [baseline, setBaseline] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [jsonOpen, setJsonOpen] = useState(false)
  const [del, setDel] = useState<{ field: LinkField; id: string } | null>(null)

  const reload = useCallback(async () => {
    try {
      const n = await fetchFooterDraft()
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
    fetchFooterDraft()
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
      setLocal(JSON.parse(baseline) as FooterDraft)
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
      await adminFetch('/api/admin/data/footer', {
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
      await adminFetch('/api/admin/publish/footer', { method: 'POST', body: '{}' })
      toast.push('Published successfully', 'success')
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Publish failed'
      setErr(msg)
      toast.push(msg, 'error')
    } finally {
      setPublishing(false)
    }
  }

  const sortRows = (rows: FooterRow[]) => [...rows].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))

  const renderLinkBlock = (title: string, field: LinkField, hint: string) => {
    if (!local) return null
    const rows = sortRows(local[field])
    return (
      <div>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500">{hint}</p>
          </div>
          <button
            type="button"
            className="text-xs font-bold uppercase tracking-wide text-brand hover:underline"
            onClick={() => {
              const id = `row-${crypto.randomUUID().slice(0, 10)}`
              setLocal({
                ...local,
                [field]: [...local[field], { id, label: bi('', ''), href: '/', sortOrder: local[field].length + 10, active: true }],
              })
            }}
          >
            + Add link
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
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-2 py-1">
                    <input
                      className="w-full min-w-[5rem] rounded border border-slate-200 px-1 py-1"
                      value={row.label.en}
                      onChange={(e) =>
                        setLocal({
                          ...local,
                          [field]: local[field].map((x) =>
                            x.id === row.id ? { ...x, label: { ...x.label, en: e.target.value } } : x,
                          ),
                        })
                      }
                    />
                  </td>
                  <td className="px-2 py-1">
                    <input
                      className="w-full min-w-[5rem] rounded border border-slate-200 px-1 py-1"
                      dir="rtl"
                      value={row.label.ar}
                      onChange={(e) =>
                        setLocal({
                          ...local,
                          [field]: local[field].map((x) =>
                            x.id === row.id ? { ...x, label: { ...x.label, ar: e.target.value } } : x,
                          ),
                        })
                      }
                    />
                  </td>
                  <td className="px-2 py-1">
                    <input
                      className="w-full min-w-[7rem] rounded border border-slate-200 px-1 py-1 font-mono text-[11px]"
                      value={row.href}
                      onChange={(e) =>
                        setLocal({
                          ...local,
                          [field]: local[field].map((x) => (x.id === row.id ? { ...x, href: e.target.value } : x)),
                        })
                      }
                    />
                  </td>
                  <td className="px-2 py-1">
                    <input
                      type="number"
                      className="w-12 rounded border border-slate-200 px-1 py-1"
                      value={row.sortOrder}
                      onChange={(e) =>
                        setLocal({
                          ...local,
                          [field]: local[field].map((x) =>
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
                          [field]: local[field].map((x) => (x.id === row.id ? { ...x, active: e.target.checked } : x)),
                        })
                      }
                    />
                  </td>
                  <td className="px-2 py-1">
                    <button type="button" className="text-red-600 hover:underline" onClick={() => setDel({ field, id: row.id })}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const socialRow = (platform: FooterSocialPlatform, label: string) => {
    if (!local) return null
    const row = local.social.find((s) => s.platform === platform)
    const href = row?.href ?? ''
    return (
      <label className="block text-sm" key={platform}>
        <span className="font-semibold text-slate-800">{label}</span>
        <input
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
          value={href}
          onChange={(e) => {
            const v = e.target.value
            setLocal((prev) => {
              if (!prev) return prev
              const idx = prev.social.findIndex((s) => s.platform === platform)
              const id = idx >= 0 ? prev.social[idx].id : `${platform}-${crypto.randomUUID().slice(0, 6)}`
              const next = [...prev.social]
              if (idx >= 0) next[idx] = { ...next[idx], href: v }
              else next.push({ id, platform, href: v })
              return { ...prev, social: next }
            })
          }}
          placeholder="https://…"
        />
      </label>
    )
  }

  if (loading || !local) {
    return (
      <div className="flex items-center gap-2 py-12 text-sm text-slate-600">
        <span className="size-5 animate-spin rounded-full border-2 border-brand border-t-transparent" aria-hidden />
        Loading footer…
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-8">
      <AdminLocaleEditorBanner {...ADMIN_EDITOR_LOCALE.footer} />
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Footer</h1>
        <p className="mt-1 text-sm text-slate-600">Branding, link columns, contact block, social icons, and bottom bar links.</p>
      </header>

      {err ? <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{err}</p> : null}

      <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Footer branding</h2>
        <div className="mt-4 space-y-5">
          <AdminLayoutMediaField label="Footer logo" value={local.logoUrl} onChange={(logoUrl) => setLocal({ ...local, logoUrl })} />
          <BilingualInputs
            labelEn="Short description (English)"
            labelAr="Short description (Arabic)"
            multiline
            rows={3}
            value={local.tagline}
            onChange={(tagline) => setLocal({ ...local, tagline })}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Column titles</h2>
        <div className="mt-4 space-y-4">
          <BilingualInputs
            labelEn="Services column title (EN)"
            labelAr="Services column title (AR)"
            value={local.columnProduct}
            onChange={(columnProduct) => setLocal({ ...local, columnProduct })}
          />
          <BilingualInputs
            labelEn="Industries column title (EN)"
            labelAr="Industries column title (AR)"
            value={local.columnIndustries}
            onChange={(columnIndustries) => setLocal({ ...local, columnIndustries })}
          />
          <BilingualInputs
            labelEn="Quick links column title (EN)"
            labelAr="Quick links column title (AR)"
            value={local.columnCompany}
            onChange={(columnCompany) => setLocal({ ...local, columnCompany })}
          />
          <BilingualInputs
            labelEn="Contact column title (EN)"
            labelAr="Contact column title (AR)"
            value={local.columnContact}
            onChange={(columnContact) => setLocal({ ...local, columnContact })}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Link columns</h2>
        <div className="mt-6 space-y-10">
          {renderLinkBlock('Services links', 'productLinks', 'Shown under the Services column heading.')}
          {renderLinkBlock('Industry links', 'industryLinks', 'Industry highlights column.')}
          {renderLinkBlock('Quick links', 'companyLinks', 'Company / quick navigation column.')}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Contact</h2>
        <div className="mt-4 space-y-4">
          <BilingualInputs
            labelEn="Address (English)"
            labelAr="Address (Arabic)"
            multiline
            rows={2}
            value={local.contact.address}
            onChange={(address) => setLocal({ ...local, contact: { ...local.contact, address } })}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="font-semibold text-slate-800">Phone display</span>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
                value={local.contact.phoneDisplay}
                onChange={(e) => setLocal({ ...local, contact: { ...local.contact, phoneDisplay: e.target.value } })}
              />
            </label>
            <label className="block text-sm">
              <span className="font-semibold text-slate-800">Phone link (tel:)</span>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
                value={local.contact.phoneHref}
                onChange={(e) => setLocal({ ...local, contact: { ...local.contact, phoneHref: e.target.value } })}
              />
            </label>
          </div>
          <label className="block text-sm">
            <span className="font-semibold text-slate-800">Email</span>
            <input
              className="mt-1 w-full max-w-md rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
              value={local.contact.email}
              onChange={(e) => setLocal({ ...local, contact: { ...local.contact, email: e.target.value } })}
            />
          </label>
          <BilingualInputs
            labelEn="WhatsApp label (English)"
            labelAr="WhatsApp label (Arabic)"
            value={local.contact.whatsappLabel}
            onChange={(whatsappLabel) => setLocal({ ...local, contact: { ...local.contact, whatsappLabel } })}
          />
          <label className="block text-sm">
            <span className="font-semibold text-slate-800">WhatsApp link (https://wa.me/…)</span>
            <input
              className="mt-1 w-full max-w-md rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
              value={local.contact.whatsappHref}
              onChange={(e) => setLocal({ ...local, contact: { ...local.contact, whatsappHref: e.target.value } })}
              placeholder="https://wa.me/971…"
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Social links</h2>
        <p className="mt-1 text-xs text-slate-500">Leave a field empty to hide that icon on the public site.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {socialRow('facebook', 'Facebook')}
          {socialRow('twitter', 'X (Twitter)')}
          {socialRow('linkedin', 'LinkedIn')}
          {socialRow('instagram', 'Instagram')}
          {socialRow('youtube', 'YouTube')}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900">Footer bottom</h2>
        <div className="mt-4 space-y-4">
          <BilingualInputs
            labelEn="Copyright line (English)"
            labelAr="Copyright line (Arabic)"
            multiline
            rows={2}
            value={local.copyrightLine}
            onChange={(copyrightLine) => setLocal({ ...local, copyrightLine })}
          />
          <p className="text-xs text-slate-500">
            Optional. If both languages are empty, the site shows “DigitalManager” plus the rights suffix below.
          </p>
          <BilingualInputs
            labelEn="Rights suffix (English)"
            labelAr="Rights suffix (Arabic)"
            value={local.rightsSuffix}
            onChange={(rightsSuffix) => setLocal({ ...local, rightsSuffix })}
          />
          <p className="text-xs text-slate-500">Public line: © {new Date().getFullYear()} then either your copyright line, or DigitalManager + rights suffix.</p>
          <div className="grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
            <BilingualInputs
              labelEn="Privacy label (EN)"
              labelAr="Privacy label (AR)"
              value={local.privacy.label}
              onChange={(label) => setLocal({ ...local, privacy: { ...local.privacy, label } })}
            />
            <label className="block text-sm">
              <span className="font-semibold text-slate-800">Privacy URL</span>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
                value={local.privacy.href}
                onChange={(e) => setLocal({ ...local, privacy: { ...local.privacy, href: e.target.value } })}
              />
            </label>
            <BilingualInputs
              labelEn="Terms label (EN)"
              labelAr="Terms label (AR)"
              value={local.terms.label}
              onChange={(label) => setLocal({ ...local, terms: { ...local.terms, label } })}
            />
            <label className="block text-sm">
              <span className="font-semibold text-slate-800">Terms URL</span>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
                value={local.terms.href}
                onChange={(e) => setLocal({ ...local, terms: { ...local.terms, href: e.target.value } })}
              />
            </label>
            <BilingualInputs
              labelEn="Sitemap label (EN)"
              labelAr="Sitemap label (AR)"
              value={local.sitemap.label}
              onChange={(label) => setLocal({ ...local, sitemap: { ...local.sitemap, label } })}
            />
            <label className="block text-sm">
              <span className="font-semibold text-slate-800">Sitemap URL</span>
              <input
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none ring-brand/30 focus:ring-2"
                value={local.sitemap.href}
                onChange={(e) => setLocal({ ...local, sitemap: { ...local.sitemap, href: e.target.value } })}
                placeholder="# or /sitemap.xml"
              />
            </label>
          </div>
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
          {jsonOpen ? <AdminJsonEditor section="footer" title="Footer (JSON)" embedded /> : null}
        </div>
      </details>

      <ConfirmDialog
        open={!!del}
        title="Delete link?"
        message="Are you sure you want to delete this item?"
        confirmLabel="Delete"
        onClose={() => setDel(null)}
        onConfirm={() => {
          if (!del || !local) return
          setLocal({
            ...local,
            [del.field]: local[del.field].filter((x) => x.id !== del.id),
          })
          setDel(null)
        }}
      />
    </div>
  )
}
