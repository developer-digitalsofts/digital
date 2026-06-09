import type { CSSProperties } from 'react'
import { Check, Award, Layers, Users, ThumbsUp, Globe } from 'lucide-react'
import { useInViewOnce } from '../hooks/useInViewOnce'
import { useI18n } from '../i18n/I18nProvider'
import { useCms } from '../cms/CmsContext'
import { pick } from '../cms/pick'
import type { Bilingual } from '../cms/types'
import { pageShellClass } from '../ui/pageShell'
import {
  sectionEyebrow,
  sectionPadCompact,
  sectionTitleLeft,
  sectionWhite,
} from '../ui/saas'

const ease = '[transition-timing-function:cubic-bezier(0.22,1,0.36,1)]'

const checklistKeys = ['accounts', 'inventory', 'pos', 'payroll', 'reports', 'branches'] as const

const statCards = [
  { key: 'experience' as const, icon: Award },
  { key: 'softwares' as const, icon: Layers },
  { key: 'clients' as const, icon: Users },
  { key: 'satisfaction' as const, icon: ThumbsUp },
  { key: 'multinational' as const, icon: Globe },
]

const statCardShell =
  'group flex min-h-[4.25rem] items-center gap-4 rounded-xl border border-slate-200/90 bg-white px-4 py-3.5 transition-colors duration-200 hover:border-brand sm:min-h-[4.5rem]'

const statIconShell =
  'flex size-11 shrink-0 items-center justify-center rounded-lg border border-slate-200/90 bg-white text-brand transition-colors duration-200 group-hover:border-brand/35 group-hover:bg-brand/[0.05]'

function revealStyle(visible: boolean, delayMs: number): CSSProperties {
  return { transitionDelay: visible ? `${delayMs}ms` : '0ms' }
}

type AboutCms = {
  eyebrow?: Bilingual
  title?: Bilingual
  paragraphs?: Bilingual[]
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
  const p2 = about?.paragraphs?.[1] ? pick(about.paragraphs[1], lang) : t('about.p2')

  return (
    <section
      ref={ref}
      id="about"
      className={`relative scroll-mt-28 overflow-hidden ${sectionWhite} ${sectionPadCompact}`}
    >
      <div className={`${pageShellClass} relative`}>
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2 lg:items-center lg:gap-10 xl:gap-12">
          <div className="mx-auto max-w-xl text-center lg:mx-0 lg:max-w-none lg:text-left">
            <p className={`${sectionEyebrow} ${reveal()}`} style={revealStyle(visible, 0)}>
              {eyebrow}
            </p>
            <h2
              className={`${sectionTitleLeft} mt-4 text-center lg:text-left ${reveal()}`}
              style={revealStyle(visible, 60)}
            >
              {title}
            </h2>
            <div
              className={`mx-auto mt-4 h-0.5 w-12 rounded-full bg-brand/75 lg:mx-0 ${reveal()}`}
              style={revealStyle(visible, 120)}
              aria-hidden
            />
            <div className="mt-5 space-y-3.5 text-base leading-[1.68] text-slate-700">
              <p className={reveal()} style={revealStyle(visible, 160)}>
                {p1}
              </p>
              <p className={reveal()} style={revealStyle(visible, 220)}>
                {p2}
              </p>
            </div>

            <ul
              className={`mt-5 grid gap-x-5 gap-y-2 sm:grid-cols-2 ${reveal()}`}
              style={revealStyle(visible, 280)}
            >
              {checklistKeys.map((key) => (
                <li key={key} className="flex items-center gap-2 text-left">
                  <span
                    className="flex size-5 shrink-0 items-center justify-center rounded-full border border-brand/25 bg-brand/[0.08] text-brand"
                    aria-hidden
                  >
                    <Check className="size-3" strokeWidth={2.5} />
                  </span>
                  <span className="text-sm font-medium leading-snug text-slate-700">
                    {t(`about.checklist.${key}`)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <ul className="grid auto-rows-fr gap-3 sm:grid-cols-2">
            {statCards.map(({ key, icon: Icon }, i) => (
              <li
                key={key}
                className={`${statCardShell} ${key === 'multinational' ? 'sm:col-span-2' : ''} ${reveal()}`}
                style={revealStyle(visible, 200 + i * 70)}
              >
                <span className={statIconShell} aria-hidden>
                  <Icon className="size-5" strokeWidth={1.75} />
                </span>
                <p className="text-[0.9375rem] font-semibold leading-snug text-slate-900 sm:text-base">
                  {t(`about.stats.${key}`)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
