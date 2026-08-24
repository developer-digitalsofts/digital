import { useCallback, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { FooterSocialLinks, type FooterSocialItem } from './SocialIconLinks'
import { useI18n } from '../i18n/I18nProvider'
import { useCms } from '../cms/CmsContext'
import { pick } from '../cms/pick'
import type { Bilingual } from '../cms/types'
import { SITE_LOGO_SRC } from '../constants'
import { getFooterProductModules, resolveFooterIndustryLinks } from '../data/footerMegaLinks'
import { footerResourceLinks } from '../data/footerResourceLinks'
import { megaIndustryLabel, megaModuleLabel } from '../i18n/megaLabels'
import { apiBase, fetchWithTimeout } from '../cms/api'
import { CmsLink } from './CmsLink'
import { RegionLanguageUtility } from './RegionLanguageUtility'
import './footer.css'

const companyKeys = ['coAbout', 'coWorkflow', 'coFaq', 'coContact'] as const
const companyTos = ['/#about', '/#workflow', '/#faqs', '/contact'] as const

const footerProducts = getFooterProductModules()
const footerIndustries = resolveFooterIndustryLinks()

type FooterLink = { id: string; label?: Bilingual; href: string; sortOrder?: number; active?: boolean }

type FooterCms = {
  logoUrl?: string
  tagline?: Bilingual
  columnProduct?: Bilingual
  columnIndustries?: Bilingual
  columnCompany?: Bilingual
  columnResources?: Bilingual
  columnContact?: Bilingual
  productLinks?: FooterLink[]
  industryLinks?: FooterLink[]
  companyLinks?: FooterLink[]
  contact?: {
    address?: Bilingual
    phoneDisplay?: string
    phoneHref?: string
    email?: string
    whatsappLabel?: Bilingual
    whatsappHref?: string
  }
  social?: FooterSocialItem[]
  rightsSuffix?: Bilingual
  copyrightLine?: Bilingual
  privacy?: { label?: Bilingual; href?: string }
  developers?: { label?: Bilingual; href?: string }
  terms?: { label?: Bilingual; href?: string }
  sitemap?: { label?: Bilingual; href?: string }
}

function sortFooterLinks(rows: FooterLink[] | undefined) {
  if (!rows?.length) return []
  return [...rows]
    .filter((r) => r.active !== false)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}

/** Locale merges may flatten bilingual CMS fields to plain strings — never surface undefined/null. */
function resolveFooterText(value: unknown, lang: 'en' | 'ar', fallback: string): string {
  if (value == null) return fallback
  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (!trimmed || trimmed === 'undefined' || trimmed === 'null') return fallback
    return trimmed
  }
  if (typeof value === 'object' && !Array.isArray(value) && ('en' in value || 'ar' in value)) {
    const picked = pick(value as Bilingual, lang).trim()
    return picked && picked !== 'undefined' && picked !== 'null' ? picked : fallback
  }
  return fallback
}

function mergeFooterRows(base: FooterLink[], extra: FooterLink[]) {
  const out = [...base]
  for (const row of extra) {
    if (!out.some((x) => x.id === row.id || x.href === row.href)) out.push(row)
  }
  return out.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}

function FooterBrandLogo({ src }: { src: string }) {
  return (
    <Link
      to="/"
      dir="ltr"
      className="dm-footer__brand-logo relative inline-block shrink-0 bg-transparent transition-opacity duration-200 hover:opacity-90"
      aria-label="DigitalManager"
    >
      <img
        src={src}
        alt=""
        width={274}
        height={62}
        className="pointer-events-none absolute inset-0 size-full object-contain object-left [clip-path:inset(0_80.73%_0_0)]"
        loading="lazy"
        decoding="async"
        aria-hidden
      />
      <img
        src={src}
        alt=""
        width={274}
        height={62}
        className="pointer-events-none absolute inset-0 size-full object-contain object-left brightness-0 invert [clip-path:inset(16.13%_0_17.74%_24.09%)]"
        loading="lazy"
        decoding="async"
        aria-hidden
      />
    </Link>
  )
}

function FooterNewsletter() {
  const { t } = useI18n()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const trimmed = email.trim()
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
      if (!emailOk) {
        setErrorMsg(t('footer.newsletter.error'))
        setStatus('error')
        return
      }

      setStatus('submitting')
      setErrorMsg(null)

      try {
        const res = await fetchWithTimeout(`${apiBase()}/api/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Newsletter subscriber',
            email: email.trim(),
            phone: '000000',
            topic: 'newsletter',
            source: 'Footer Newsletter',
            message: 'Newsletter subscription request',
            sourcePage: 'footer-newsletter',
          }),
        })

        if (!res.ok) {
          let message = t('footer.newsletter.error')
          try {
            const data = (await res.json()) as { error?: string }
            if (data?.error?.trim()) message = data.error.trim()
          } catch {
            /* use default */
          }
          setErrorMsg(message)
          setStatus('error')
          return
        }

        setEmail('')
        setStatus('success')
      } catch {
        setErrorMsg(t('footer.newsletter.networkError'))
        setStatus('error')
      }
    },
    [email, t],
  )

  return (
    <div className="dm-footer__newsletter-card">
      <h3 className="dm-footer__newsletter-title">{t('footer.newsletter.title')}</h3>
      <p className="dm-footer__newsletter-desc">{t('footer.newsletter.desc')}</p>
      <form className="dm-footer__newsletter-form" onSubmit={onSubmit} noValidate>
        <input
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            if (status === 'error') {
              setStatus('idle')
              setErrorMsg(null)
            }
          }}
          onBlur={() => {
            const trimmed = email.trim()
            if (!trimmed) return
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
              setErrorMsg(t('footer.newsletter.error'))
              setStatus('error')
            }
          }}
          aria-invalid={status === 'error' ? true : undefined}
          className="dm-footer__newsletter-input"
          placeholder={t('footer.newsletter.placeholder')}
        />
        <button type="submit" disabled={status === 'submitting'} className="dm-footer__newsletter-submit">
          {status === 'submitting' ? t('footer.newsletter.submitting') : t('footer.newsletter.submit')}
        </button>
      </form>
      {status === 'success' ? (
        <p className="dm-footer__newsletter-message dm-footer__newsletter-message--success" role="status">
          {t('footer.newsletter.success')}
        </p>
      ) : null}
      {status === 'error' && errorMsg ? (
        <p className="dm-footer__newsletter-message dm-footer__newsletter-message--error" role="alert">
          {errorMsg}
        </p>
      ) : null}
    </div>
  )
}

function FooterLinkList({
  links,
}: {
  links: { key: string; label: string; href: string; useCms?: boolean }[]
}) {
  return (
    <ul className="dm-footer__links">
      {links.map((row) => (
        <li key={row.key}>
          {row.useCms ? (
            <CmsLink to={row.href} className="dm-footer__link">
              {row.label}
            </CmsLink>
          ) : row.href.startsWith('http') || row.href.startsWith('#') || row.href.startsWith('mailto:') ? (
            <a href={row.href} className="dm-footer__link">
              {row.label}
            </a>
          ) : (
            <Link to={row.href} className="dm-footer__link">
              {row.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  )
}

export function Footer() {
  const { t, lang } = useI18n()
  const { data } = useCms()
  const f = data?.footer as FooterCms | undefined

  const logo = f?.logoUrl?.trim() || SITE_LOGO_SRC
  const tagline = resolveFooterText(f?.tagline, lang, t('footer.tagline'))
  const colP = resolveFooterText(f?.columnProduct, lang, t('footer.colProduct'))
  const colI = resolveFooterText(f?.columnIndustries, lang, t('footer.colIndustries'))
  const colC = resolveFooterText(f?.columnCompany, lang, t('footer.colCompany'))
  const colR = resolveFooterText(f?.columnResources, lang, t('footer.colResources'))

  const addr = resolveFooterText(f?.contact?.address, lang, t('footer.address'))
  const phoneDisplay = f?.contact?.phoneDisplay ?? '+971 6 536 6786'
  const phoneHref = f?.contact?.phoneHref ?? 'tel:+97165366786'
  const email = f?.contact?.email ?? 'info@digitalmanager.ae'

  const rightsFallback = t('footer.rights')
  const privacyLabel = resolveFooterText(f?.privacy?.label, lang, t('footer.privacy'))
  const privacyHref = f?.privacy?.href ?? '#'
  const developersLabel = f?.developers?.label ? pick(f.developers.label, lang) : 'Developers'
  const developersHref = f?.developers?.href ?? '/developers'
  const termsLabel = f?.terms?.label ? pick(f.terms.label, lang) : t('footer.terms')
  const termsHref = f?.terms?.href ?? '#'

  const productRows = useMemo(() => {
    const base = sortFooterLinks(f?.productLinks)
    const extra = sortFooterLinks(data?.navigation?.footerColumns?.product as FooterLink[] | undefined)
    return mergeFooterRows(base, extra)
  }, [f?.productLinks, data?.navigation?.footerColumns?.product])

  const industryRows = useMemo(() => {
    const base = sortFooterLinks(f?.industryLinks)
    const extra = sortFooterLinks(data?.navigation?.footerColumns?.industries as FooterLink[] | undefined)
    return mergeFooterRows(base, extra)
  }, [f?.industryLinks, data?.navigation?.footerColumns?.industries])

  const companyRows = useMemo(() => {
    const base = sortFooterLinks(f?.companyLinks)
    const extra = sortFooterLinks(data?.navigation?.footerColumns?.company as FooterLink[] | undefined)
    return mergeFooterRows(base, extra)
  }, [f?.companyLinks, data?.navigation?.footerColumns?.company])

  const productLinks = useMemo(
    () =>
      productRows.length
        ? productRows.map((row) => ({
            key: row.id,
            label: row.label ? pick(row.label, lang) : '',
            href: row.href,
            useCms: true,
          }))
        : footerProducts.map((item) => ({
            key: item.slug,
            label: megaModuleLabel(lang, item.slug, item.labelEn),
            href: item.to,
            useCms: false,
          })),
    [lang, productRows],
  )

  const industryLinks = useMemo(
    () =>
      industryRows.length
        ? industryRows.map((row) => ({
            key: row.id,
            label: row.label ? pick(row.label, lang) : '',
            href: row.href,
            useCms: true,
          }))
        : footerIndustries.map((item) => ({
            key: item.slug,
            label: megaIndustryLabel(lang, item.slug, item.labelEn),
            href: item.to,
            useCms: false,
          })),
    [industryRows, lang],
  )

  const resourceLinks = useMemo(
    () =>
      footerResourceLinks.map((item) => ({
        key: item.key,
        label: t(`footer.resources.${item.key}`),
        href: item.href,
        useCms: false,
      })),
    [t],
  )

  const companyLinks = useMemo(() => {
    if (companyRows.length) {
      return companyRows.map((row) => ({
        key: row.id,
        label: row.label ? pick(row.label, lang) : '',
        href: row.href,
        useCms: true,
      }))
    }

    return companyKeys.map((key, i) => ({
      key,
      label: t(`footer.${key}`),
      href: companyTos[i],
      useCms: true,
    }))
  }, [companyRows, lang, t])

  const sitemapHref = f?.sitemap?.href?.trim() || ''
  const sitemapLabel = f?.sitemap?.label ? pick(f.sitemap.label, lang) : 'Sitemap'

  const copyrightText = useMemo(() => {
    const year = new Date().getFullYear()
    const rights = resolveFooterText(f?.rightsSuffix, lang, rightsFallback)
    const customLine = resolveFooterText(f?.copyrightLine, lang, '')
    if (customLine) {
      return customLine.includes('©') ? customLine : `© ${year} ${customLine}`
    }
    return `© ${year} DigitalManager (Pvt.) Limited. ${rights}`
  }, [f?.copyrightLine, f?.rightsSuffix, lang, rightsFallback])

  const waHref = f?.contact?.whatsappHref?.trim()
  const waLabel =
    f?.contact?.whatsappLabel && (f.contact.whatsappLabel.en || f.contact.whatsappLabel.ar)
      ? pick(f.contact.whatsappLabel, lang)
      : 'WhatsApp'

  return (
    <footer id="contact" className="dm-footer scroll-mt-28">
      <div className="dm-footer__accent" aria-hidden="true" />

      <div className="industries-section__container dm-footer__container">
        <div className="dm-footer__main">
          <div className="dm-footer__brand">
            <FooterBrandLogo src={logo} />
            <p className="dm-footer__brand-subtitle">{t('footer.brandSubtitle')}</p>
            <p className="dm-footer__tagline" title={tagline}>
              {tagline}
            </p>
          </div>

          <div className="dm-footer__col">
            <h3 className="dm-footer__col-title">{colP}</h3>
            <FooterLinkList links={productLinks} />
          </div>

          <div className="dm-footer__col">
            <h3 className="dm-footer__col-title">{colI}</h3>
            <FooterLinkList links={industryLinks} />
          </div>

          <div className="dm-footer__col">
            <h3 className="dm-footer__col-title">{colR}</h3>
            <FooterLinkList links={resourceLinks} />
          </div>

          <div className="dm-footer__col">
            <h3 className="dm-footer__col-title">{colC}</h3>
            <FooterLinkList links={companyLinks} />
          </div>

          <div className="dm-footer__newsletter">
            <FooterNewsletter />
          </div>
        </div>

        <div className="dm-footer__trust-row">
          <div className="dm-footer__contact-summary">
            <span className="dm-footer__contact-chip">
              <MapPin className="dm-footer__contact-icon" aria-hidden />
              <span>{addr}</span>
            </span>
            <span className="dm-footer__contact-divider" aria-hidden />
            <span className="dm-footer__contact-chip">
              <Phone className="dm-footer__contact-icon" aria-hidden />
              <a href={phoneHref} className="dm-footer__contact-link">
                {phoneDisplay}
              </a>
            </span>
            <span className="dm-footer__contact-divider" aria-hidden />
            <span className="dm-footer__contact-chip">
              <Mail className="dm-footer__contact-icon" aria-hidden />
              <a href={`mailto:${email}`} className="dm-footer__contact-link">
                {email}
              </a>
            </span>
            {waHref ? (
              <>
                <span className="dm-footer__contact-divider" aria-hidden />
                <span className="dm-footer__contact-chip">
                  <MessageCircle className="dm-footer__contact-icon" aria-hidden />
                  <a href={waHref} className="dm-footer__contact-link" target="_blank" rel="noopener noreferrer">
                    {waLabel}
                  </a>
                </span>
              </>
            ) : null}
          </div>

          <p className="dm-footer__trust-message">{t('footer.trustMessage')}</p>

          <div className="dm-footer__social">
            <FooterSocialLinks items={f?.social} />
          </div>
        </div>

        <div className="dm-footer__bottom">
          <div className="dm-footer__bottom-main">
            <p className="dm-footer__copyright">{copyrightText}</p>
            <RegionLanguageUtility className="dm-footer__locale-utility" hint={false} />
          </div>
          <nav className="dm-footer__legal" aria-label={t('footer.legalNav')}>
            <a href={privacyHref} className="dm-footer__legal-link">
              {privacyLabel}
            </a>
            <a href={developersHref} className="dm-footer__legal-link">
              {developersLabel}
            </a>
            <a href={termsHref} className="dm-footer__legal-link">
              {termsLabel}
            </a>
            {sitemapHref ? (
              <a href={sitemapHref} className="dm-footer__legal-link">
                {sitemapLabel}
              </a>
            ) : null}
          </nav>
        </div>
      </div>
    </footer>
  )
}
