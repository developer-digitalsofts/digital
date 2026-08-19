import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Mail, MapPin, Phone, X } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'
import { useSiteSettings } from '../cms/useSiteSettings'
import { DrawerSocialLinks } from './SocialIconLinks'
import { WhatsAppIcon } from './WhatsAppIcon'

type Props = {
  open: boolean
  onClose: () => void
}

export function ContactQuickDrawer({ open, onClose }: Props) {
  const { t } = useI18n()
  const site = useSiteSettings()

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[190] isolate" role="dialog" aria-modal="true" aria-labelledby="contact-drawer-title">
      {/* Backdrop: div (not button) so panel links are never blocked by stacking quirks */}
      <div
        className="absolute inset-0 z-0 bg-slate-900/50 backdrop-blur-[1px] motion-reduce:backdrop-blur-none"
        aria-hidden
        onClick={onClose}
      />

      <aside className="absolute inset-y-0 end-0 z-10 flex w-full max-w-sm flex-col border-s border-slate-200 bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
          <h2 id="contact-drawer-title" className="text-base font-bold text-slate-900">
            {t('contactDrawer.title')}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            aria-label={t('contactDrawer.closeAria')}
          >
            <X className="size-5" strokeWidth={2} />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 py-4">
          <p className="text-sm leading-relaxed text-slate-600">{t('contactDrawer.subtitle')}</p>

          <div className="space-y-4 text-sm">
            <div className="flex gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
              <p className="leading-relaxed text-slate-800">{site.officeAddress || t('footer.address')}</p>
            </div>

            {site.phoneDisplay ? (
              <div>
                <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <Phone className="size-4 text-brand" aria-hidden />
                  {t('contactPage.phoneLabel')}
                </p>
                <div className="flex flex-col gap-2 ps-0.5">
                  <a
                    href={site.phoneHref}
                    className="block font-semibold text-slate-900 underline-offset-2 hover:text-brand hover:underline"
                  >
                    {site.phoneDisplay}
                  </a>
                </div>
              </div>
            ) : null}

            {site.primaryEmail ? (
              <div className="flex gap-3">
                <Mail className="mt-0.5 size-5 shrink-0 text-brand" aria-hidden />
                <a
                  href={`mailto:${site.primaryEmail}`}
                  className="break-all font-semibold text-slate-900 underline-offset-2 hover:text-brand hover:underline"
                >
                  {site.primaryEmail}
                </a>
              </div>
            ) : null}

            <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5">
              <p className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Clock className="size-4 text-brand" aria-hidden />
                {t('contactPage.hoursTitle')}
              </p>
              <p className="mt-1 text-sm text-slate-800">{site.workingHours || t('contactPage.hoursBody')}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {site.whatsappUrl ? (
              <a
                href={site.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#20bd5a]"
            >
              <WhatsAppIcon className="size-5 shrink-0 text-white" />
              {t('contactPage.whatsappAction')}
            </a>
            ) : null}
            <Link
              to={site.demoPageLink || '/contact#contact-form'}
              onClick={onClose}
              className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-800 hover:border-brand hover:text-brand"
            >
              {t('contactDrawer.fullForm')}
            </Link>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{t('contactDrawer.followUs')}</p>
            <DrawerSocialLinks />
          </div>
        </div>
      </aside>
    </div>
  )
}
