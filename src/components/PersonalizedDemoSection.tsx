import { useCallback, useMemo, useState, type FormEvent } from 'react'
import { ArrowRight, HandHelping, ShieldCheck, Users, type LucideIcon } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useCms } from '../cms/CmsContext'
import { resolvePersonalizedDemoCms } from '../cms/resolveHomepageCms'
import { useI18n } from '../i18n/I18nProvider'
import { apiBase, fetchWithTimeout } from '../cms/api'
import { useSiteSettings } from '../cms/useSiteSettings'
import { ScrollReveal } from './ScrollReveal'
import { sectionWhite } from '../ui/saas'
import './personalized-demo.css'

const INDUSTRY_VALUES = [
  'retail',
  'manufacturing',
  'hospitality',
  'healthcare',
  'services',
  'agriculture',
  'other',
] as const

const EMPLOYEE_VALUES = ['1-10', '11-50', '51-200', '201-500', '500-plus'] as const

const HIGHLIGHT_ICONS: Record<string, LucideIcon> = {
  Users,
  ShieldCheck,
  HandHelping,
  tour: Users,
  commitment: ShieldCheck,
  response: HandHelping,
}

export function PersonalizedDemoSection() {
  const { t, lang } = useI18n()
  const { data } = useCms()
  const copy = useMemo(() => resolvePersonalizedDemoCms(data ?? undefined, t, lang), [data, t, lang])
  const site = useSiteSettings()
  const location = useLocation()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [phone, setPhone] = useState('')
  const [industry, setIndustry] = useState('')
  const [employees, setEmployees] = useState('')
  const [discussion, setDiscussion] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const onSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
      const phoneOk = phone.trim().length >= 6

      if (
        !name.trim() ||
        !emailOk ||
        !company.trim() ||
        !phoneOk ||
        !industry ||
        !employees
      ) {
        setErrorMsg(copy.errorMessage)
        setStatus('error')
        return
      }

      setStatus('submitting')
      setErrorMsg(null)

      const employeeLabel = t(`personalizedDemo.employees.${employees}`)
      const industryLabel = t(`personalizedDemo.industries.${industry}`)
      const discussionText = discussion.trim()
      const messageParts = [`Employees: ${employeeLabel}`, `Industry: ${industryLabel}`]
      if (discussionText) messageParts.push('', discussionText)

      try {
        const res = await fetchWithTimeout(`${apiBase()}/api/leads`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            company: company.trim(),
            topic: 'demo',
            source: 'Homepage Personalized Demo',
            productService: industryLabel,
            message: messageParts.join('\n'),
            sourcePage: `homepage-personalized-demo:${location.pathname}${location.search}`.slice(0, 500),
          }),
        })

        if (!res.ok) {
          let message = t('personalizedDemo.submitError')
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

        setStatus('success')
      } catch {
        setErrorMsg(t('personalizedDemo.networkError'))
        setStatus('error')
      }
    },
    [company, copy.errorMessage, discussion, email, employees, industry, location.pathname, location.search, name, phone, t],
  )

  if (!copy.enabled) return null

  return (
    <section id="personalized-demo" className={`dm-personalized-demo scroll-mt-28 ${sectionWhite} home-section home-section--personalized-demo`}>
      <div className="industries-section__container">
        <ScrollReveal>
          <div className="dm-personalized-demo__card personalized-demo__card">
            <div className="dm-personalized-demo__copy">
              <p className="dm-personalized-demo__eyebrow">{copy.eyebrow}</p>
              <h2 className="dm-personalized-demo__title">{copy.title}</h2>
              <p className="dm-personalized-demo__desc">{copy.description}</p>

              <ul className="dm-personalized-demo__highlights">
                {copy.highlights.map(({ id, label }) => {
                  const Icon = HIGHLIGHT_ICONS[id] ?? Users
                  return (
                  <li key={id} className="dm-personalized-demo__highlight">
                    <Icon className="dm-personalized-demo__highlight-icon" strokeWidth={1.85} aria-hidden />
                    <span>{label}</span>
                  </li>
                  )
                })}
              </ul>
            </div>

            <div className="dm-personalized-demo__form-wrap">
              {status === 'success' ? (
                <div className="dm-personalized-demo__success" role="status">
                  <p className="dm-personalized-demo__success-title">{t('personalizedDemo.successTitle')}</p>
                  <p className="dm-personalized-demo__success-desc">{copy.successMessage}</p>
                </div>
              ) : (
                <form className="dm-personalized-demo__form" onSubmit={onSubmit} noValidate>
                  <div className="dm-personalized-demo__field-row">
                    <label className="dm-personalized-demo__field">
                      <span className="dm-personalized-demo__label dm-personalized-demo__label--sr">{t('personalizedDemo.fields.name')}</span>
                      <input
                        type="text"
                        name="name"
                        autoComplete="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="dm-personalized-demo__input"
                        placeholder={t('personalizedDemo.placeholders.name')}
                      />
                    </label>
                    <label className="dm-personalized-demo__field">
                      <span className="dm-personalized-demo__label dm-personalized-demo__label--sr">{t('personalizedDemo.fields.email')}</span>
                      <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="dm-personalized-demo__input"
                        placeholder={t('personalizedDemo.placeholders.email')}
                      />
                    </label>
                  </div>

                  <div className="dm-personalized-demo__field-row">
                    <label className="dm-personalized-demo__field">
                      <span className="dm-personalized-demo__label dm-personalized-demo__label--sr">{t('personalizedDemo.fields.company')}</span>
                      <input
                        type="text"
                        name="company"
                        autoComplete="organization"
                        required
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className="dm-personalized-demo__input"
                        placeholder={t('personalizedDemo.placeholders.company')}
                      />
                    </label>
                    <label className="dm-personalized-demo__field">
                      <span className="dm-personalized-demo__label dm-personalized-demo__label--sr">{t('personalizedDemo.fields.phone')}</span>
                      <input
                        type="tel"
                        name="phone"
                        autoComplete="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="dm-personalized-demo__input"
                        placeholder={site.phonePlaceholder}
                      />
                    </label>
                  </div>

                  <div className="dm-personalized-demo__field-row">
                    <label className="dm-personalized-demo__field">
                      <span className="dm-personalized-demo__label dm-personalized-demo__label--sr">{t('personalizedDemo.fields.industry')}</span>
                      <select
                        name="industry"
                        required
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="dm-personalized-demo__select"
                      >
                        <option value="">{t('personalizedDemo.placeholders.industry')}</option>
                        {INDUSTRY_VALUES.map((value) => (
                          <option key={value} value={value}>
                            {t(`personalizedDemo.industries.${value}`)}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="dm-personalized-demo__field">
                      <span className="dm-personalized-demo__label dm-personalized-demo__label--sr">{t('personalizedDemo.fields.employees')}</span>
                      <select
                        name="employees"
                        required
                        value={employees}
                        onChange={(e) => setEmployees(e.target.value)}
                        className="dm-personalized-demo__select"
                      >
                        <option value="">{t('personalizedDemo.placeholders.employees')}</option>
                        {EMPLOYEE_VALUES.map((value) => (
                          <option key={value} value={value}>
                            {t(`personalizedDemo.employees.${value}`)}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <label className="dm-personalized-demo__field dm-personalized-demo__field--full">
                    <span className="dm-personalized-demo__label dm-personalized-demo__label--sr">
                      {t('personalizedDemo.fields.discussion')}
                    </span>
                    <textarea
                      name="discussion"
                      rows={1}
                      value={discussion}
                      onChange={(e) => setDiscussion(e.target.value)}
                      className="dm-personalized-demo__textarea"
                      placeholder={t('personalizedDemo.placeholders.discussion')}
                    />
                  </label>

                  {status === 'error' && errorMsg ? (
                    <p className="dm-personalized-demo__error" role="alert">
                      {errorMsg}
                    </p>
                  ) : null}

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="dm-personalized-demo__submit"
                  >
                    {status === 'submitting' ? t('personalizedDemo.submitting') : copy.submitLabel}
                    <ArrowRight className="dm-personalized-demo__submit-icon" strokeWidth={2.25} aria-hidden />
                  </button>
                </form>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
