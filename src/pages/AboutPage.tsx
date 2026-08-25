import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { useCms } from '../cms/CmsContext'
import { useI18n } from '../i18n/I18nProvider'
import { pick } from '../cms/pick'
import type { Bilingual } from '../cms/types'
import { pageShellClass } from '../ui/pageShell'
import { sectionEyebrow, sectionPad } from '../ui/saas'

type AboutCms = {
  eyebrow?: Bilingual
  title?: Bilingual
  paragraphs?: Bilingual[]
  trustItems?: { id: string; label?: Bilingual; sortOrder?: number; active?: boolean }[]
}

export function AboutPage() {
  const { data } = useCms()
  const { lang, t } = useI18n()
  const about = data?.about as AboutCms | undefined

  const eyebrow = about?.eyebrow ? pick(about.eyebrow, lang) : t('about.eyebrow')
  const title = about?.title ? pick(about.title, lang) : t('about.title')
  const paragraphs = (about?.paragraphs || []).map((p) => pick(p, lang)).filter(Boolean)
  const trustItems = (about?.trustItems || [])
    .filter((x) => x.active !== false)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))

  return (
    <main className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50/50">
        <div className={`${pageShellClass} ${sectionPad}`}>
          <p className={`${sectionEyebrow} uppercase`}>{eyebrow}</p>
          <h1 className="font-heading mt-2 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">{title}</h1>
          {paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 24)} className="mt-4 max-w-3xl text-base leading-[1.65] text-slate-600">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className={`${pageShellClass} ${sectionPad}`}>
        <h2 className="font-heading text-xl font-bold text-slate-900">
          {lang === 'ar' ? 'لماذا DigitalManager' : 'Why DigitalManager'}
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {trustItems.map((item) => (
            <li key={item.id} className="flex items-start gap-2 text-slate-700">
              <Check className="mt-0.5 size-4 shrink-0 text-brand" aria-hidden />
              <span>{pick(item.label || { en: '', ar: '' }, lang)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-8">
          <Link to="/contact" className="font-semibold text-brand hover:text-brand-dark">
            {lang === 'ar' ? 'تواصل معنا' : 'Contact us'}
          </Link>
        </p>
      </section>
    </main>
  )
}
