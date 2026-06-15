import type { ReactNode } from 'react'
import { ScrollReveal } from './ScrollReveal'
import { pageShellClass } from '../ui/pageShell'

/** Premium Unsplash images for homepage CTAs */
export const CTA_BANNER_IMAGES = {
  workflow:
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1920&q=90',
  final:
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1920&q=90',
} as const

export function resolveCtaBackgroundUrl(cmsValue: string | undefined, fallback: string): string {
  const raw = cmsValue?.trim()
  if (!raw || raw === 'gradient-soft') return fallback
  if (raw.startsWith('http') || raw.startsWith('/')) return raw
  return fallback
}

type HomeCtaBannerProps = {
  id?: string
  backgroundUrl: string
  title: string
  body: string
  children: ReactNode
  trustLine?: string
  credibilityRow?: ReactNode
  /** @deprecated Use trustLine instead */
  trustIndicators?: ReactNode
  overlay?: 'default' | '40' | '45' | '55' | 'premium' | 'navy'
  gradientOnly?: boolean
  compact?: boolean
  /** Render trust line below CTA buttons */
  trustAfterActions?: boolean
  /** Premium homepage bottom CTA — navy gradient matching footer */
  variant?: 'default' | 'final'
}

export function HomeCtaBanner({
  id,
  backgroundUrl,
  title,
  body,
  children,
  trustLine,
  credibilityRow,
  trustIndicators,
  overlay = 'default',
  gradientOnly = false,
  compact = false,
  trustAfterActions = false,
  variant = 'default',
}: HomeCtaBannerProps) {
  const isFinal = variant === 'final'

  const overlayClass = isFinal
    ? ''
    : overlay === '40'
      ? ' cta-banner--overlay-40'
      : overlay === '45'
        ? ' cta-banner--overlay-45'
        : overlay === '55'
          ? ' cta-banner--overlay-55'
          : overlay === 'premium'
            ? ' cta-banner--overlay-premium'
            : overlay === 'navy'
              ? ' cta-banner--overlay-navy'
              : ''

  const sectionClass = [
    'cta-banner relative scroll-mt-28 overflow-hidden',
    overlayClass,
    isFinal ? ' cta-banner--final' : gradientOnly ? ' cta-banner--gradient-only' : '',
  ].join('')

  const padClass = isFinal
    ? 'relative z-10 px-4 py-14 sm:px-6 md:py-16 lg:py-20'
    : compact
      ? 'relative z-10 px-4 py-14 sm:px-6 md:py-16'
      : 'relative z-10 px-4 py-16 sm:px-6 md:py-20 lg:py-24'

  const trustEl = trustLine ? (
    <p
      className={
        isFinal
          ? 'cta-banner__trust mx-auto max-w-[38rem] text-pretty text-[0.8125rem] font-normal leading-[1.65] tracking-wide text-white/75 sm:text-sm sm:leading-[1.7]'
          : 'cta-banner__trust mx-auto max-w-[40rem] text-pretty text-base font-medium leading-[1.72] text-white/90 sm:text-[1.0625rem]'
      }
    >
      {trustLine}
    </p>
  ) : null

  return (
    <section id={id} className={sectionClass}>
      {!isFinal && !gradientOnly ? (
        <div
          className="cta-banner__bg absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundUrl})` }}
          aria-hidden
        />
      ) : null}
      <div className="cta-banner__overlay absolute inset-0" aria-hidden />
      {isFinal ? <div className="cta-banner__pattern absolute inset-0" aria-hidden /> : null}

      <div className={`${pageShellClass} ${padClass}`}>
        <ScrollReveal className="mx-auto max-w-3xl text-center md:max-w-[44rem] lg:max-w-[50rem]">
          <h2
            className={
              isFinal
                ? 'cta-banner__title font-heading text-[1.875rem] font-bold leading-[1.14] tracking-tight text-white sm:text-[2.25rem] md:text-[2.625rem] md:leading-[1.12] lg:text-[2.875rem]'
                : 'cta-banner__title font-heading text-[2rem] font-bold leading-[1.12] tracking-tight text-white sm:text-[2.375rem] md:text-[2.75rem] md:leading-[1.1] lg:text-[3rem]'
            }
          >
            {title}
          </h2>
          <p
            className={
              isFinal
                ? 'cta-banner__body mx-auto mt-4 max-w-[40rem] text-pretty text-base leading-[1.68] text-white/92 md:mt-5 md:max-w-[44rem] md:text-lg md:leading-[1.66]'
                : 'cta-banner__body mx-auto mt-5 max-w-[40rem] text-pretty text-lg leading-[1.72] text-white/[0.96] md:mt-6 md:max-w-[44rem] md:text-xl md:leading-[1.68]'
            }
          >
            {body}
          </p>

          {!trustAfterActions && trustEl ? (
            <div className="mt-5 md:mt-6">{trustEl}</div>
          ) : null}

          {trustIndicators ? (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 md:mt-10 md:gap-3">
              {trustIndicators}
            </div>
          ) : null}

          <div
            className={
              isFinal
                ? 'cta-banner__actions mx-auto mt-8 grid w-full max-w-2xl grid-cols-1 gap-2.5 sm:mt-9 sm:max-w-3xl sm:grid-cols-[repeat(auto-fit,minmax(10.5rem,1fr))] sm:gap-3'
                : 'cta-banner__actions mx-auto mt-9 grid w-full max-w-3xl grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-[repeat(auto-fit,minmax(11.5rem,1fr))] sm:gap-4'
            }
          >
            {children}
          </div>

          {trustAfterActions && trustEl ? (
            <div className={isFinal ? 'mt-6 md:mt-7' : 'mt-8 md:mt-9'}>{trustEl}</div>
          ) : null}

          {credibilityRow ? <div className="mt-8 md:mt-9">{credibilityRow}</div> : null}
        </ScrollReveal>
      </div>
    </section>
  )
}
