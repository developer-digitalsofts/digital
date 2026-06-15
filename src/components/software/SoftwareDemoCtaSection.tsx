import type { FormEvent } from 'react'
import { MessageCircle, Send } from 'lucide-react'
import { useI18n } from '../../i18n/I18nProvider'
import { pageShellClass } from '../../ui/pageShell'
import { WHATSAPP_URL } from '../../constants'
import { cardFlat } from '../../ui/saas'

type Props = {
  uid: string
  heading: string
  sub: string
  whatsappHref?: string
  whatsappLabel?: string
  sendLabel: string
  demoEmail: string
  setDemoEmail: (v: string) => void
  onSubmit: (e: FormEvent) => void
  submitStatus?: 'idle' | 'submitting' | 'success' | 'error'
}

/** Quotation / demo CTA — email only, optional WhatsApp below form. */
export function SoftwareDemoCtaSection({
  uid,
  heading,
  sub,
  whatsappHref,
  whatsappLabel,
  sendLabel,
  demoEmail,
  setDemoEmail,
  onSubmit,
  submitStatus = 'idle',
}: Props) {
  const { t } = useI18n()
  const showWhatsApp = Boolean(whatsappHref || whatsappLabel)

  return (
    <section className="border-b border-slate-100 bg-[#fffaf7] py-12 md:py-14">
      <div className={pageShellClass}>
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-12">
          <div className="max-w-lg">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900 md:text-[1.75rem] lg:text-3xl">
              {heading}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">{sub}</p>
          </div>

          <div>
            <form className={`${cardFlat} p-6 md:p-7`} onSubmit={onSubmit}>
              <label className="text-xs font-semibold text-slate-600" htmlFor={`${uid}-email`}>
                {t('softwareDetail.emailLabel')}
              </label>
              <input
                id={`${uid}-email`}
                type="email"
                required
                value={demoEmail}
                onChange={(e) => setDemoEmail(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-[rgba(15,23,42,0.12)] bg-white px-4 py-3 text-sm text-slate-900 outline-none transition-[border-color] focus:border-brand/50 focus:ring-2 focus:ring-brand/15"
                placeholder={t('softwareDetail.emailPlaceholder')}
                autoComplete="email"
              />
              <button
                type="submit"
                disabled={submitStatus === 'submitting'}
                className="mt-5 inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-brand px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60 sm:w-auto"
              >
                <Send className="size-4 shrink-0" aria-hidden />
                {submitStatus === 'submitting' ? t('softwareDetail.sending') : sendLabel}
              </button>

              {submitStatus === 'success' ? (
                <p className="mt-3 text-sm font-medium text-emerald-700">{t('softwareDetail.requestSuccess')}</p>
              ) : null}
              {submitStatus === 'error' ? (
                <p className="mt-3 text-sm font-medium text-red-600">{t('softwareDetail.requestError')}</p>
              ) : null}

              {showWhatsApp ? (
                <a
                  href={whatsappHref ?? WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-emerald-200 bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50"
                >
                  <MessageCircle className="size-4 shrink-0" aria-hidden />
                  {whatsappLabel ?? t('softwareDetail.whatsappNow')}
                </a>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
