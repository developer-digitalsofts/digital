import { Check } from 'lucide-react'
import { useInViewOnce } from '../hooks/useInViewOnce'
import { useI18n } from '../i18n/I18nProvider'
import { useCms } from '../cms/CmsContext'
import { pick } from '../cms/pick'
import type { Bilingual } from '../cms/types'
import { AboutBusinessGrowthVisual } from './AboutBusinessGrowthVisual'
import { pageShellClass } from '../ui/pageShell'
import { sectionEyebrow, sectionPad, sectionTitleLeft, sectionWhite } from '../ui/saas'

const ease = '[transition-timing-function:cubic-bezier(0.22,1,0.36,1)]'

const trustKeys = ['since2004', 'gcc', 'enterprise', 'multibranch'] as const

type AboutCms = {
  eyebrow?: Bilingual
  title?: Bilingual
  paragraphs?: Bilingual[]
  imageUrl?: string
  trustItems?: { id: string; label?: Bilingual; sortOrder?: number; active?: boolean }[]
}

export function AboutSection() {
  const { t, lang } = useI18n()
  const { data } = useCms()
  const about = data?.about as AboutCms | undefined
  const { ref, visible } = useInViewOnce<HTMLElement>()

  const reveal = () =>
    [
      'transition-all duration-[720ms]',
      ease,
      visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0',
      'motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none',
    ].join(' ')

  const eyebrow = about?.eyebrow ? pick(about.eyebrow, lang) : t('about.eyebrow')
  const title = about?.title ? pick(about.title, lang) : t('about.title')
  const p1 = about?.paragraphs?.[0] ? pick(about.paragraphs[0], lang) : t('about.p1')
  const trustItems = (about?.trustItems || [])
    .filter((x) => x.active !== false)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))

  return (
    <section
      ref={ref}
      id="about"
      className={`relative scroll-mt-28 overflow-hidden ${sectionWhite} ${sectionPad}`}
    >
      <div className={`${pageShellClass} relative`}>
        <div className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16 ${reveal()}`}>
          <div className="min-w-0 text-center lg:text-left">
            <p className={`${sectionEyebrow} uppercase`}>{eyebrow}</p>
            <h2 className={`${sectionTitleLeft} mt-2 text-center lg:text-left`}>{title}</h2>
            <div className="mx-auto mt-3 h-0.5 w-10 rounded-full bg-brand lg:mx-0" aria-hidden />

            <p className="mt-5 text-base leading-[1.68] text-slate-600 lg:max-w-[34rem]">{p1}</p>

            <ul className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-3.5">
              {trustItems.length > 0
                ? trustItems.map((item) => (
                    <li key={item.id} className="flex items-start gap-2.5 text-left">
                      <span
                        className="mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full bg-brand text-white"
                        aria-hidden
                      >
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                      <span className="text-sm font-medium leading-snug text-slate-700">
                        {item.label ? pick(item.label, lang) : ''}
                      </span>
                    </li>
                  ))
                : trustKeys.map((key) => (
                    <li key={key} className="flex items-start gap-2.5 text-left">
                      <span
                        className="mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full bg-brand text-white"
                        aria-hidden
                      >
                        <Check className="size-3" strokeWidth={3} />
                      </span>
                      <span className="text-sm font-medium leading-snug text-slate-700">
                        {t(`about.trust.${key}`)}
                      </span>
                    </li>
                  ))}
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-xl sm:max-w-2xl lg:mx-0 lg:max-w-none">
            <AboutBusinessGrowthVisual />
          </div>
        </div>
      </div>
    </section>
  )
}
