import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react'
import { FooterSocialLinks, type FooterSocialItem } from './SocialIconLinks'
import { useI18n } from '../i18n/I18nProvider'
import { useCms } from '../cms/CmsContext'
import { pick } from '../cms/pick'
import type { Bilingual } from '../cms/types'
import { SITE_LOGO_SRC, BRAND_DEEP_BG } from '../constants'
import { pageShellClass } from '../ui/pageShell'
import { getFooterProductModules, resolveFooterIndustryLinks } from '../data/footerMegaLinks'
import { megaIndustryLabel, megaModuleLabel } from '../i18n/megaLabels'
import { footerColTitle, footerLink, footerPad } from '../ui/saas'
import { CmsLink } from './CmsLink'

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
  /** When set, replaces the “DigitalManager. {rights}” segment (year is still prefixed). */
  copyrightLine?: Bilingual
  privacy?: { label?: Bilingual; href?: string }
  terms?: { label?: Bilingual; href?: string }
  sitemap?: { label?: Bilingual; href?: string }
}

function sortFooterLinks(rows: FooterLink[] | undefined) {
  if (!rows?.length) return []
  return [...rows]
    .filter((r) => r.active !== false)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
}

/**
 * Footer logo: icon keeps brand colors, wordmark reads white on navy.
 * Single aspect-ratio box + aligned layers (digitalmanager.svg viewBox 274×62).
 * `dir="ltr"` keeps identical rendering inside RTL pages (Arabic).
 */
function FooterBrandLogo({ src }: { src: string }) {
  return (
    <Link
      to="/"
      dir="ltr"
      className="relative inline-block aspect-[274/62] h-12 max-w-[min(300px,85vw)] shrink-0 bg-transparent transition-opacity duration-200 hover:opacity-90 sm:h-[3.25rem] md:h-14"
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

export function Footer() {
  const { t, lang } = useI18n()
  const { data } = useCms()
  const f = data?.footer as FooterCms | undefined

  const logo = f?.logoUrl?.trim() || SITE_LOGO_SRC
  const tagline = f?.tagline ? pick(f.tagline, lang) : t('footer.tagline')
  const colP = f?.columnProduct ? pick(f.columnProduct, lang) : t('footer.colProduct')
  const colI = f?.columnIndustries ? pick(f.columnIndustries, lang) : t('footer.colIndustries')
  const colC = f?.columnCompany ? pick(f.columnCompany, lang) : t('footer.colCompany')
  const colContact = f?.columnContact ? pick(f.columnContact, lang) : t('footer.colContact')

  const addr = f?.contact?.address ? pick(f.contact.address, lang) : t('footer.address')
  const phoneDisplay = f?.contact?.phoneDisplay ?? '+971 6 536 6786'
  const phoneHref = f?.contact?.phoneHref ?? 'tel:+97165366786'
  const email = f?.contact?.email ?? 'info@digitalmanager.ae'

  const rights = f?.rightsSuffix ? pick(f.rightsSuffix, lang) : t('footer.rights')
  const privacyLabel = f?.privacy?.label ? pick(f.privacy.label, lang) : t('footer.privacy')
  const privacyHref = f?.privacy?.href ?? '#'
  const termsLabel = f?.terms?.label ? pick(f.terms.label, lang) : t('footer.terms')
  const termsHref = f?.terms?.href ?? '#'

  const productRows = useMemo(() => sortFooterLinks(f?.productLinks), [f?.productLinks])
  const industryRows = useMemo(() => sortFooterLinks(f?.industryLinks), [f?.industryLinks])
  const companyRows = useMemo(() => sortFooterLinks(f?.companyLinks), [f?.companyLinks])

  const copyrightText = useMemo(() => {
    const year = new Date().getFullYear()
    if (f?.copyrightLine?.en || f?.copyrightLine?.ar) {
      return `© ${year} ${pick(f.copyrightLine, lang)}`
    }
    return `© ${year} DigitalManager. ${rights}`
  }, [f?.copyrightLine, lang, rights])

  const sitemapHref = f?.sitemap?.href?.trim() || ''
  const sitemapLabel = f?.sitemap?.label ? pick(f.sitemap.label, lang) : 'Sitemap'
  const waHref = f?.contact?.whatsappHref?.trim()
  const waLabel =
    f?.contact?.whatsappLabel && (f.contact.whatsappLabel.en || f.contact.whatsappLabel.ar)
      ? pick(f.contact.whatsappLabel, lang)
      : 'WhatsApp'

  return (
    <footer
      id="contact"
      className="border-t border-white/10 text-slate-300"
      style={{ backgroundColor: BRAND_DEEP_BG }}
    >
      <div className={`${pageShellClass} ${footerPad}`}>
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-6 lg:gap-x-10">
          <div className="sm:col-span-2 lg:col-span-2">
            <FooterBrandLogo src={logo} />
            <p className="mt-4 max-w-md text-pretty text-[0.9375rem] leading-[1.7] text-slate-300">{tagline}</p>
            <div className="mt-5 flex gap-2.5">
              <FooterSocialLinks items={f?.social} />
            </div>
          </div>
          <div>
            <h3 className={footerColTitle}>{colP}</h3>
            <ul className="mt-4 space-y-2">
              {productRows.length
                ? productRows.map((row) => (
                    <li key={row.id}>
                      <CmsLink to={row.href} className={footerLink}>
                        {row.label ? pick(row.label, lang) : ''}
                      </CmsLink>
                    </li>
                  ))
                : footerProducts.map((item) => (
                    <li key={item.slug}>
                      <Link to={item.to} className={footerLink}>
                        {megaModuleLabel(lang, item.slug, item.labelEn)}
                      </Link>
                    </li>
                  ))}
            </ul>
          </div>
          <div>
            <h3 className={footerColTitle}>{colI}</h3>
            <ul className="mt-4 space-y-2">
              {industryRows.length
                ? industryRows.map((row) => (
                    <li key={row.id}>
                      <CmsLink to={row.href} className={footerLink}>
                        {row.label ? pick(row.label, lang) : ''}
                      </CmsLink>
                    </li>
                  ))
                : footerIndustries.map((item) => (
                    <li key={item.slug}>
                      <Link to={item.to} className={footerLink}>
                        {megaIndustryLabel(lang, item.slug, item.labelEn)}
                      </Link>
                    </li>
                  ))}
            </ul>
          </div>
          <div>
            <h3 className={footerColTitle}>{colC}</h3>
            <ul className="mt-4 space-y-2">
              {companyRows.length
                ? companyRows.map((row) => (
                    <li key={row.id}>
                      <CmsLink to={row.href} className={footerLink}>
                        {row.label ? pick(row.label, lang) : ''}
                      </CmsLink>
                    </li>
                  ))
                : companyKeys.map((key, i) => (
                    <li key={key}>
                      <CmsLink to={companyTos[i]} className={footerLink}>
                        {t(`footer.${key}`)}
                      </CmsLink>
                    </li>
                  ))}
            </ul>
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className={footerColTitle}>{colContact}</h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300/95">
              <li className="flex gap-2">
                <MapPin className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                <span>{addr}</span>
              </li>
              <li className="flex gap-2">
                <Phone className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                <a href={phoneHref} className="hover:text-brand">
                  {phoneDisplay}
                </a>
              </li>
              <li className="flex gap-2">
                <Mail className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                <a href={`mailto:${email}`} className="hover:text-brand">
                  {email}
                </a>
              </li>
              {waHref ? (
                <li className="flex gap-2">
                  <MessageCircle className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
                  <a href={waHref} className="hover:text-brand" target="_blank" rel="noopener noreferrer">
                    {waLabel}
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-7 text-center text-sm leading-relaxed text-slate-400 sm:flex-row sm:text-left">
          <p>{copyrightText}</p>
          <div className="flex flex-wrap justify-center gap-4 sm:justify-end sm:gap-6">
            <a href={privacyHref} className="hover:text-brand">
              {privacyLabel}
            </a>
            <a href={termsHref} className="hover:text-brand">
              {termsLabel}
            </a>
            {sitemapHref ? (
              <a href={sitemapHref} className="hover:text-brand">
                {sitemapLabel}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </footer>
  )
}
