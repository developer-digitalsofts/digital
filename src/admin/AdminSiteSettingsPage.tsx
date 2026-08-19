import { useCallback, useEffect, useState } from 'react'
import { adminFetch, friendlyAdminApiMessage } from './adminApi'
import { useAdminToast } from './AdminToastContext'
import type { Bilingual } from '../cms/types'

type SiteDoc = {
  websiteName: Bilingual
  websiteTagline: Bilingual
  logoUrl: string
  faviconUrl: string
  primaryEmail: string
  salesEmail: string
  supportEmail: string
  phoneDisplay: string
  phoneHref: string
  whatsappNumber: string
  officeAddress: Bilingual
  workingHours: Bilingual
  googleMapLink: string
  facebookUrl: string
  linkedinUrl: string
  instagramUrl: string
  youtubeUrl: string
  tiktokUrl: string
  copyrightText: Bilingual
  defaultCountry: Bilingual
  defaultCurrency: string
  defaultPhoneCode: string
  primaryCtaLabel: Bilingual
  demoPageLink: string
  defaultSeoTitle: Bilingual
  defaultMetaDescription: Bilingual
  ogImageUrl: string
  _meta?: Record<string, unknown>
}

function normBi(v: unknown): Bilingual {
  if (v && typeof v === 'object' && !Array.isArray(v)) {
    const b = v as Record<string, unknown>
    return { en: String(b.en ?? ''), ar: String(b.ar ?? '') }
  }
  return { en: '', ar: '' }
}

function normalize(raw: Record<string, unknown>): SiteDoc {
  return {
    websiteName: normBi(raw.websiteName),
    websiteTagline: normBi(raw.websiteTagline),
    logoUrl: String(raw.logoUrl ?? ''),
    faviconUrl: String(raw.faviconUrl ?? ''),
    primaryEmail: String(raw.primaryEmail ?? ''),
    salesEmail: String(raw.salesEmail ?? ''),
    supportEmail: String(raw.supportEmail ?? ''),
    phoneDisplay: String(raw.phoneDisplay ?? ''),
    phoneHref: String(raw.phoneHref ?? ''),
    whatsappNumber: String(raw.whatsappNumber ?? '').replace(/\D/g, ''),
    officeAddress: normBi(raw.officeAddress),
    workingHours: normBi(raw.workingHours),
    googleMapLink: String(raw.googleMapLink ?? ''),
    facebookUrl: String(raw.facebookUrl ?? ''),
    linkedinUrl: String(raw.linkedinUrl ?? ''),
    instagramUrl: String(raw.instagramUrl ?? ''),
    youtubeUrl: String(raw.youtubeUrl ?? ''),
    tiktokUrl: String(raw.tiktokUrl ?? ''),
    copyrightText: normBi(raw.copyrightText),
    defaultCountry: normBi(raw.defaultCountry),
    defaultCurrency: String(raw.defaultCurrency ?? 'AED'),
    defaultPhoneCode: String(raw.defaultPhoneCode ?? '+971'),
    primaryCtaLabel: normBi(raw.primaryCtaLabel),
    demoPageLink: String(raw.demoPageLink ?? '/contact#contact-form'),
    defaultSeoTitle: normBi(raw.defaultSeoTitle),
    defaultMetaDescription: normBi(raw.defaultMetaDescription),
    ogImageUrl: String(raw.ogImageUrl ?? ''),
    _meta: raw._meta as SiteDoc['_meta'],
  }
}

function BiPair({
  label,
  value,
  onChange,
  rows = 2,
}: {
  label: string
  value: Bilingual
  onChange: (next: Bilingual) => void
  rows?: number
}) {
  return (
    <fieldset className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
      <legend className="text-sm font-bold text-slate-800">{label}</legend>
      <div>
        <label className="text-xs font-semibold text-slate-600">English</label>
        <textarea
          value={value.en}
          onChange={(e) => onChange({ ...value, en: e.target.value })}
          rows={rows}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-600">Arabic</label>
        <textarea
          value={value.ar}
          onChange={(e) => onChange({ ...value, ar: e.target.value })}
          rows={rows}
          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </div>
    </fieldset>
  )
}

export function AdminSiteSettingsPage() {
  const toast = useAdminToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [doc, setDoc] = useState<SiteDoc | null>(null)

  const load = useCallback(() => {
    setLoading(true)
    adminFetch<Record<string, unknown>>('/api/admin/data/siteSettings')
      .then((raw) => setDoc(normalize(raw)))
      .catch((e: Error) => {
        toast.push(friendlyAdminApiMessage(e.message), 'error')
        setDoc(normalize({}))
      })
      .finally(() => setLoading(false))
  }, [toast])

  useEffect(() => {
    load()
  }, [load])

  const save = async () => {
    if (!doc) return
    setSaving(true)
    try {
      const payload = {
        ...doc,
        whatsappNumber: doc.whatsappNumber.replace(/\D/g, ''),
        _meta: doc._meta,
      }
      await adminFetch('/api/admin/data/siteSettings', { method: 'PUT', body: JSON.stringify(payload) })
      toast.push('Site settings saved', 'success')
      load()
    } catch (e) {
      toast.push(e instanceof Error ? friendlyAdminApiMessage(e.message) : 'Save failed', 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !doc) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Site settings</h1>
        <p className="text-sm text-slate-600">Loading…</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Site settings</h1>
        <p className="mt-1 text-sm text-slate-600">Global branding, contact details, and social links used across the website.</p>
      </div>

      <div className="space-y-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <BiPair label="Website name" value={doc.websiteName} onChange={(websiteName) => setDoc({ ...doc, websiteName })} rows={2} />
        <BiPair label="Tagline" value={doc.websiteTagline} onChange={(websiteTagline) => setDoc({ ...doc, websiteTagline })} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-slate-600">Logo URL</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand"
              value={doc.logoUrl}
              onChange={(e) => setDoc({ ...doc, logoUrl: e.target.value })}
              placeholder="/logo.svg"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600">Favicon URL</label>
            <input
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand"
              value={doc.faviconUrl}
              onChange={(e) => setDoc({ ...doc, faviconUrl: e.target.value })}
            />
          </div>
        </div>

        <fieldset className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <legend className="text-sm font-bold text-slate-800">Contact</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-600">Primary email</label>
              <input
                type="email"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                value={doc.primaryEmail}
                onChange={(e) => setDoc({ ...doc, primaryEmail: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Sales email</label>
              <input
                type="email"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                value={doc.salesEmail}
                onChange={(e) => setDoc({ ...doc, salesEmail: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Support email</label>
              <input
                type="email"
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                value={doc.supportEmail}
                onChange={(e) => setDoc({ ...doc, supportEmail: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Phone (display)</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                value={doc.phoneDisplay}
                onChange={(e) => setDoc({ ...doc, phoneDisplay: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Phone link (tel:)</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                value={doc.phoneHref}
                onChange={(e) => setDoc({ ...doc, phoneHref: e.target.value })}
                placeholder="tel:+971..."
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-600">WhatsApp number (digits, country code)</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                value={doc.whatsappNumber}
                onChange={(e) => setDoc({ ...doc, whatsappNumber: e.target.value.replace(/\D/g, '') })}
              />
            </div>
          </div>
        </fieldset>

        <BiPair label="Office address" value={doc.officeAddress} onChange={(officeAddress) => setDoc({ ...doc, officeAddress })} />
        <BiPair label="Working hours" value={doc.workingHours} onChange={(workingHours) => setDoc({ ...doc, workingHours })} rows={2} />

        <div>
          <label className="text-xs font-semibold text-slate-600">Google Maps link (optional)</label>
          <input
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand"
            value={doc.googleMapLink}
            onChange={(e) => setDoc({ ...doc, googleMapLink: e.target.value })}
            placeholder="https://maps.google.com/..."
          />
        </div>

        <fieldset className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <legend className="text-sm font-bold text-slate-800">Social links</legend>
          <div className="grid gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-600">Facebook</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                value={doc.facebookUrl}
                onChange={(e) => setDoc({ ...doc, facebookUrl: e.target.value })}
                placeholder="https://"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">LinkedIn</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                value={doc.linkedinUrl}
                onChange={(e) => setDoc({ ...doc, linkedinUrl: e.target.value })}
                placeholder="https://"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Instagram</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                value={doc.instagramUrl}
                onChange={(e) => setDoc({ ...doc, instagramUrl: e.target.value })}
                placeholder="https://"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">YouTube</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                value={doc.youtubeUrl}
                onChange={(e) => setDoc({ ...doc, youtubeUrl: e.target.value })}
                placeholder="https://"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">TikTok</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                value={doc.tiktokUrl}
                onChange={(e) => setDoc({ ...doc, tiktokUrl: e.target.value })}
                placeholder="https://"
              />
            </div>
          </div>
        </fieldset>

        <BiPair label="Copyright line" value={doc.copyrightText} onChange={(copyrightText) => setDoc({ ...doc, copyrightText })} rows={2} />

        <fieldset className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <legend className="text-sm font-bold text-slate-800">UAE localization</legend>
          <BiPair label="Default country" value={doc.defaultCountry} onChange={(defaultCountry) => setDoc({ ...doc, defaultCountry })} />
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold text-slate-600">Default currency</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                value={doc.defaultCurrency}
                onChange={(e) => setDoc({ ...doc, defaultCurrency: e.target.value })}
                placeholder="AED"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600">Default phone code</label>
              <input
                className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
                value={doc.defaultPhoneCode}
                onChange={(e) => setDoc({ ...doc, defaultPhoneCode: e.target.value })}
                placeholder="+971"
              />
            </div>
          </div>
          <BiPair label="Primary CTA label" value={doc.primaryCtaLabel} onChange={(primaryCtaLabel) => setDoc({ ...doc, primaryCtaLabel })} rows={1} />
          <div>
            <label className="text-xs font-semibold text-slate-600">Demo page link</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
              value={doc.demoPageLink}
              onChange={(e) => setDoc({ ...doc, demoPageLink: e.target.value })}
              placeholder="/contact#contact-form"
            />
          </div>
        </fieldset>

        <fieldset className="space-y-3 rounded-xl border border-slate-200 bg-slate-50/50 p-4">
          <legend className="text-sm font-bold text-slate-800">Default SEO</legend>
          <BiPair label="Default SEO title" value={doc.defaultSeoTitle} onChange={(defaultSeoTitle) => setDoc({ ...doc, defaultSeoTitle })} rows={2} />
          <BiPair
            label="Default meta description"
            value={doc.defaultMetaDescription}
            onChange={(defaultMetaDescription) => setDoc({ ...doc, defaultMetaDescription })}
            rows={3}
          />
          <div>
            <label className="text-xs font-semibold text-slate-600">Open Graph image URL</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
              value={doc.ogImageUrl}
              onChange={(e) => setDoc({ ...doc, ogImageUrl: e.target.value })}
              placeholder="/og-image.jpg"
            />
          </div>
        </fieldset>

        <div className="flex justify-end border-t border-slate-100 pt-4">
          <button
            type="button"
            disabled={saving}
            onClick={() => void save()}
            className="rounded-xl bg-brand px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:opacity-95 disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
