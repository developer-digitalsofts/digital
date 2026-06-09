import type { ReactNode } from 'react'
import { ScrollReveal } from './ScrollReveal'
import { pageShellClass } from '../ui/pageShell'

/** Premium Unsplash images for homepage CTAs */
export const CTA_BANNER_IMAGES = {
  /** Team collaboration / daily workflows — not used on software detail pages */
  workflow:
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1920&q=90',
  /** Business digitization / operations — not used on software detail pages */
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
  /** Solid dark overlay opacity */
  overlay?: 'default' | '40' | '45' | '55'
}

export function HomeCtaBanner({
  id,
  backgroundUrl,
  title,
  body,
  children,
  overlay = 'default',
}: HomeCtaBannerProps) {
  const overlayClass =
    overlay === '40'
      ? ' cta-banner--overlay-40'
      : overlay === '45'
        ? ' cta-banner--overlay-45'
        : overlay === '55'
          ? ' cta-banner--overlay-55'
          : ''

  return (
    <section id={id} className={`cta-banner relative scroll-mt-28 overflow-hidden${overlayClass}`}>
      <div
        className="cta-banner__bg absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundUrl})` }}
        aria-hidden
      />
      <div className="cta-banner__overlay absolute inset-0" aria-hidden />

      <div className={`${pageShellClass} relative z-10 py-20 md:py-24 lg:py-[7.5rem]`}>
        <ScrollReveal className="mx-auto max-w-3xl text-center md:max-w-4xl">
          <h2 className="font-heading text-[1.875rem] font-bold leading-[1.12] tracking-tight text-white sm:text-[2.125rem] md:text-[2.5rem] lg:text-[2.75rem]">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-base leading-[1.65] text-white md:mt-6 md:text-lg md:leading-[1.62]">
            {body}
          </p>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:mt-11 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center md:mt-12">
            {children}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
