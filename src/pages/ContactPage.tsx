import { Mail, MessageSquare, Phone } from 'lucide-react'
import { useCallback, useState, type FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { WHATSAPP_URL } from '../constants'
import { WhatsAppIcon } from '../components/WhatsAppIcon'
import { useI18n } from '../i18n/I18nProvider'
import { apiBase } from '../cms/api'
import { pageShellClass } from '../ui/pageShell'
import { sectionPad } from '../ui/saas'

const PHONE_DISPLAY = '+971 58 117 4911'
const PHONE_HREF = 'tel:+971581174911'
const EMAIL = 'info@digitalmanager.ae'

type Topic = 'demo' | 'pricing' | 'support' | 'other'

export function ContactPage() {
  const { t } = useI18n()
  const location = useLocation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [company, setCompany] = useState('')
  const [topic, setTopic] = useState<Topic | ''>('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      const phoneOk = phone.trim().length >= 6
      if (!emailOk || !phoneOk) {
        setStatus('error')
        return
      }
      setStatus('submitting')
      try {
        const res = await fetch(`${apiBase()}/api/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            company: company.trim(),
            topic: topic || '',
            message: message.trim(),
            sourcePage: `${location.pathname}${location.search}`.slice(0, 500),
          }),
        })
        if (!res.ok) {
          setStatus('error')
          return
        }
        setStatus('success')
      } catch {
        setStatus('error')
      }
    },
    [name, email, phone, company, topic, message, location.pathname, location.search],
  )

  return (
    <main className="bg-white">
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-50/50">
        <div className={`${pageShellClass} relative ${sectionPad}`}>
          <h1 className="font-heading text-3xl font-bold leading-tight tracking-tight text-slate-900 md:text-4xl md:leading-tight">
            {t('contactPage.title')}
          </h1>
          <p className="mt-3 max-w-2xl text-pretty text-base leading-[1.55] text-slate-600 md:text-[1.0625rem]">
            {t('contactPage.subtitle')}
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition-colors hover:border-brand hover:text-brand"
          >
            {t('contactPage.backHome')}
          </Link>
        </div>
      </section>

      <section className={`${pageShellClass} ${sectionPad}`}>
        <div className="grid gap-5 lg:grid-cols-12 lg:gap-7">
          <div className="lg:col-span-5">
            <div className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
              <h2 className="font-heading text-base font-bold text-slate-900">{t('contactPage.phoneLabel')}</h2>
              <a
                href={PHONE_HREF}
                className="mt-3 inline-flex items-center gap-2 text-base font-semibold text-brand hover:underline"
              >
                <Phone className="size-5 shrink-0" aria-hidden />
                {PHONE_DISPLAY}
              </a>

              <h2 className="font-heading mt-6 text-base font-bold text-slate-900">{t('contactPage.emailLabel')}</h2>
              <a
                href={`mailto:${EMAIL}`}
                className="mt-3 inline-flex items-center gap-2 break-all text-base font-semibold text-brand hover:underline"
              >
                <Mail className="size-5 shrink-0" aria-hidden />
                {EMAIL}
              </a>

              <h2 className="font-heading mt-6 text-base font-bold text-slate-900">{t('contactPage.whatsappLabel')}</h2>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-base font-semibold text-[#128C7E] hover:underline"
              >
                <WhatsAppIcon className="size-5 shrink-0" aria-hidden />
                {t('contactPage.whatsappAction')}
              </a>

              <div className="mt-10 rounded-xl bg-cream-dark/80 px-4 py-4">
                <p className="text-sm font-bold text-slate-900">{t('contactPage.hoursTitle')}</p>
                <p className="mt-1 text-sm text-slate-600">{t('contactPage.hoursBody')}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div
              id="contact-form"
              className="scroll-mt-24 rounded-lg border border-slate-200 bg-white p-5 md:p-6"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="size-5 text-brand" aria-hidden />
                <h2 className="font-heading text-base font-bold text-slate-900">{t('contactPage.formTitle')}</h2>
              </div>

              {status === 'success' ? (
                <p
                  className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm font-medium text-emerald-900"
                  role="status"
                >
                  {t('contactPage.formSuccess')}
                </p>
              ) : (
                <form className="mt-6 space-y-5" onSubmit={onSubmit} noValidate>
                  {status === 'error' && (
                    <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                      {t('contactPage.formError')}
                    </p>
                  )}

                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-semibold text-slate-800">
                      {t('contactPage.formName')}
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="contact-email" className="block text-sm font-semibold text-slate-800">
                        {t('contactPage.formEmail')} <span className="text-red-500" aria-hidden>*</span>
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-phone" className="block text-sm font-semibold text-slate-800">
                        {t('contactPage.formPhone')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-company" className="block text-sm font-semibold text-slate-800">
                      {t('contactPage.formCompany')}
                    </label>
                    <input
                      id="contact-company"
                      name="company"
                      type="text"
                      autoComplete="organization"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="contact-topic" className="block text-sm font-semibold text-slate-800">
                      {t('contactPage.formTopic')}
                    </label>
                    <select
                      id="contact-topic"
                      name="topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value as Topic | '')}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
                    >
                      <option value="">{t('contactPage.formTopicPlaceholder')}</option>
                      <option value="demo">{t('contactPage.formTopicDemo')}</option>
                      <option value="pricing">{t('contactPage.formTopicPricing')}</option>
                      <option value="support">{t('contactPage.formTopicSupport')}</option>
                      <option value="other">{t('contactPage.formTopicOther')}</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-semibold text-slate-800">
                      {t('contactPage.formMessage')}
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-slate-900 outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                  </div>

                  <p className="text-xs text-slate-500">{t('contactPage.formPrivacy')}</p>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="inline-flex w-full items-center justify-center rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                  >
                    {status === 'submitting' ? t('contactPage.formSubmitting') : t('contactPage.formSubmit')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
