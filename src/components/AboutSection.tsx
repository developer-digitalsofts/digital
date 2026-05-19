import type { CSSProperties } from 'react'
import { useInViewOnce } from '../hooks/useInViewOnce'
import { useI18n } from '../i18n/I18nProvider'
import { useCms } from '../cms/CmsContext'
import { pick } from '../cms/pick'
import type { Bilingual } from '../cms/types'
import { LucideByName } from '../utils/lucideFromName'
import { pageShellClass } from '../ui/pageShell'
import {
  cardBase,
  cardDesc,
  cardTitle,
  iconBox,
  iconGlyph,
  sectionEyebrow,
  sectionPad,
  sectionTitleLeft,
  sectionWhite,
} from '../ui/saas'

const ease = '[transition-timing-function:cubic-bezier(0.22,1,0.36,1)]'

function revealStyle(visible: boolean, delayMs: number): CSSProperties {
  return { transitionDelay: visible ? `${delayMs}ms` : '0ms' }
}

type AboutCard = {
  id: string
  icon?: string
  title?: Bilingual
  description?: Bilingual
  sortOrder?: number
  active?: boolean
}

type AboutCms = {
  eyebrow?: Bilingual
  title?: Bilingual
  paragraphs?: Bilingual[]
  highlightsLabel?: Bilingual
  cards?: AboutCard[]
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
  const hl = about?.highlightsLabel ? pick(about.highlightsLabel, lang) : t('about.highlightsLabel')

  const cards = about?.cards
    ? [...about.cards]
        .filter((c) => c.active !== false)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    : []

  const useCmsCards = cards.length > 0

  return (
    <section
      ref={ref}
      id="about"
      className={`relative overflow-hidden ${sectionWhite} ${sectionPad}`}
    >
      <div className={`${pageShellClass} relative`}>
        <div className="grid gap-6 lg:grid-cols-2 lg:items-start lg:gap-8">
          <div className="max-w-2xl lg:max-w-[42rem]">
            <p
              className={`${sectionEyebrow} ${reveal()}`}
              style={revealStyle(visible, 0)}
            >
              {eyebrow}
            </p>
            <h2
              className={`${sectionTitleLeft} mt-3 transition-all ${ease} duration-[780ms] ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'} motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none`}
              style={revealStyle(visible, 60)}
            >
              {title}
            </h2>
            <div
              className={`mt-2.5 h-0.5 w-14 rounded-full bg-gradient-to-r from-brand/90 to-brand-dark/65 transition-all ${ease} duration-700 ${visible ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'} motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:transition-none`}
              style={revealStyle(visible, 120)}
              aria-hidden
            />
            <div className="mt-3.5 space-y-3.5 text-[0.9375rem] leading-[1.55] text-slate-600 md:text-base">
              <p className={reveal()} style={revealStyle(visible, 140)}>
                {p1}
              </p>
              <p className={reveal()} style={revealStyle(visible, 220)}>
                {p2}
              </p>
            </div>
          </div>

          <div
            className={`group relative rounded-xl border border-slate-200 bg-[#fefefe] p-1 shadow-[0_4px_14px_rgba(15,23,42,0.04)] transition-opacity duration-500 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'} motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none`}
            style={{ transitionDelay: visible ? '180ms' : '0ms' }}
          >
            <div className="relative rounded-lg bg-slate-50/60 px-3 pb-3 pt-0 sm:px-4 sm:pb-4 sm:pt-0.5">
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-500 sm:text-xs">{hl}</p>
              <ul className="mt-1.5 space-y-2 sm:space-y-2">
                {useCmsCards
                  ? cards.map((c, i) => (
                      <li
                        key={c.id}
                        className={`${cardBase} p-4 transition-[opacity,transform,border-color] duration-500 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'} motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none motion-reduce:hover:translate-y-0`}
                        style={revealStyle(visible, 260 + i * 75)}
                      >
                        <div className="flex gap-2.5 sm:gap-3">
                          <span className={iconBox}>
                            <LucideByName name={c.icon} className={iconGlyph} strokeWidth={2} />
                          </span>
                          <div className="min-w-0 pt-px">
                            <p className={cardTitle}>{c.title ? pick(c.title, lang) : ''}</p>
                            <p className={`${cardDesc} mt-1`}>{c.description ? pick(c.description, lang) : ''}</p>
                          </div>
                        </div>
                      </li>
                    ))
                  : [0, 1, 2, 3].map((i) => {
                      const names = ['Boxes', 'Activity', 'ShieldCheck', 'Zap'] as const
                      return (
                        <li
                          key={i}
                          className={`${cardBase} p-4 transition-[opacity,transform,border-color] duration-500 ease-out ${visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'} motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none motion-reduce:hover:translate-y-0`}
                          style={revealStyle(visible, 260 + i * 75)}
                        >
                          <div className="flex gap-2.5 sm:gap-3">
                            <span className={iconBox}>
                              <LucideByName name={names[i]} className={iconGlyph} strokeWidth={2} />
                            </span>
                            <div className="min-w-0 pt-px">
                              <p className={cardTitle}>{t(`about.f${i + 1}t`)}</p>
                              <p className={`${cardDesc} mt-1`}>{t(`about.f${i + 1}d`)}</p>
                            </div>
                          </div>
                        </li>
                      )
                    })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
