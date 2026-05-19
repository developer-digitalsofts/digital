/** Shared SaaS marketing UI tokens — premium compact enterprise ERP. */

export const sectionPad = 'py-10 md:py-12 lg:py-14'
export const sectionPadCompact = 'py-8 md:py-10 lg:py-11'
export const heroPad = 'py-8 md:py-10 lg:py-11'
export const footerPad = 'py-9 md:py-10 lg:py-11'

/** Space between section title block and content grid */
export const sectionContentTop = 'mt-6 md:mt-7'

export const sectionWhite = 'relative border-y border-slate-200/50 bg-white'
export const sectionMuted =
  'relative border-y border-slate-200/50 bg-gradient-to-b from-[#f8fafc] via-slate-50/90 to-[#f1f5f9]'

export const sectionTitle =
  'font-heading text-center text-[1.625rem] font-bold tracking-tight text-slate-900 sm:text-[1.75rem] md:text-[1.875rem] md:leading-[1.12] lg:text-[2rem] lg:leading-[1.1]'

export const sectionTitleLeft =
  'font-heading text-[1.625rem] font-bold tracking-tight text-slate-900 sm:text-[1.75rem] md:text-[1.875rem] md:leading-[1.12] lg:text-[2rem] lg:leading-[1.1]'

export const sectionSub =
  'mt-2.5 text-pretty text-[0.875rem] leading-[1.58] text-slate-600 md:text-[0.9375rem] md:leading-[1.62]'

export const sectionSubCenter = `${sectionSub} mx-auto max-w-2xl text-center`

export const sectionEyebrow =
  'text-[11px] font-semibold uppercase tracking-[0.16em] text-brand'

/** Light card elevation — no heavy shadows */
export const cardShadow = 'shadow-[0_4px_14px_rgba(15,23,42,0.04)]'

export const cardBase =
  `group/card relative rounded-xl border border-slate-200 bg-[#fefefe] ${cardShadow} transition-[border-color,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-slate-300 motion-reduce:transition-colors motion-reduce:hover:translate-y-0`

export const cardPad = 'p-5'

export const cardTitle =
  'font-heading text-[0.9375rem] font-bold leading-snug tracking-tight text-slate-900 sm:text-base'

export const cardDesc = 'mt-2 flex-1 text-sm leading-[1.6] text-slate-600'

export const cardFooter = 'mt-auto border-t border-slate-100 pt-3.5'

export const statCard = `${cardBase} ${cardPad} flex min-h-[116px] flex-col items-center justify-center text-center`

export const moduleCard = `${cardBase} ${cardPad} flex h-full flex-col`

export const industryCard = `${cardBase} ${cardPad} flex h-full flex-col`

export const featureCard = `${cardBase} ${cardPad} flex h-full min-h-[140px] flex-col`

export const headerShellBase =
  'sticky top-0 z-[100] border-b backdrop-blur-md transition-[box-shadow,background-color,border-color] duration-300 ease-out supports-[backdrop-filter]:bg-white/90'

export const headerShellDefault =
  `${headerShellBase} border-slate-200/70 bg-white/95 shadow-[0_1px_0_rgba(15,23,42,0.04)]`

export const headerShellScrolled =
  `${headerShellBase} border-slate-200/90 bg-white/[0.98] shadow-[0_8px_30px_-12px_rgba(15,23,42,0.14),0_1px_0_rgba(15,23,42,0.05)]`

export const headerGetDemoButtonClass =
  'btn-shine inline-flex shrink-0 items-center justify-center rounded-lg border border-brand/20 bg-brand px-3.5 py-2 text-xs font-semibold text-white shadow-[0_2px_12px_-4px_rgba(234,111,79,0.45)] transition-[background-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-px hover:border-brand-dark hover:bg-brand-dark hover:shadow-[0_6px_20px_-6px_rgba(234,111,79,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand motion-safe:active:scale-[0.99] motion-reduce:hover:translate-y-0 sm:px-4 sm:text-sm'

export const btnPrimary =
  'btn-shine inline-flex min-h-[42px] items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-[0_2px_14px_-4px_rgba(234,111,79,0.45)] transition-[background-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-px hover:bg-brand-dark hover:shadow-[0_8px_24px_-8px_rgba(234,111,79,0.52)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand motion-safe:active:scale-[0.99] motion-reduce:hover:translate-y-0'

export const btnSecondary =
  'inline-flex min-h-[42px] items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-[border-color,background-color,box-shadow,color,transform] duration-200 ease-out hover:-translate-y-px hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 hover:shadow-[0_6px_18px_-10px_rgba(15,23,42,0.1)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 motion-safe:active:scale-[0.99] motion-reduce:hover:translate-y-0'

export const iconGlyph = 'size-5 shrink-0 text-brand'

export const iconTile = 'border border-slate-200/90 bg-[#fffaf8] text-brand'

export const iconBox = `flex size-10 shrink-0 items-center justify-center rounded-lg ${iconTile}`

/** Same footprint as iconBox — consistent card icons */
export const iconBoxLg = iconBox

export const linkAccent =
  'inline-flex items-center gap-1.5 text-sm font-semibold text-brand transition-[color,gap] duration-200 hover:text-brand-dark'

export const badgePill =
  'inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white/90 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-slate-600 shadow-[0_1px_4px_-2px_rgba(15,23,42,0.06)] sm:text-[11px]'

export const frameBorder =
  'rounded-xl border border-slate-200/60 bg-white shadow-[0_20px_50px_-28px_rgba(15,23,42,0.22),0_0_0_1px_rgba(15,23,42,0.04)]'

export const heroSection =
  'relative overflow-hidden border-b border-slate-200/60 bg-gradient-to-br from-[#f6f8fc] via-white to-[#fff7f3]'

export const heroTitle =
  'font-heading text-[1.625rem] font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-[1.875rem] md:text-[2.125rem] md:leading-[1.08] lg:text-[2.375rem] lg:leading-[1.06]'

export const heroSub =
  'mt-2.5 bg-gradient-to-r from-brand to-brand-dark bg-clip-text font-sans text-[0.9375rem] font-semibold leading-snug text-transparent sm:text-base'

export const heroBody =
  'mx-auto mt-3 max-w-[34rem] text-pretty text-[0.875rem] leading-[1.58] text-slate-600 sm:text-[0.9375rem] lg:mx-0 lg:max-w-[36rem]'

/** Wrapper for dashboard preview — pairs with .hero-mockup-stage / .hero-mockup-float in index.css */
export const heroMockupWrap = 'hero-mockup-stage relative isolate w-full'

export const faqItem = `${cardBase} overflow-hidden bg-white`

export const faqTrigger =
  'flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-semibold leading-snug text-slate-900 transition-colors duration-200 hover:bg-slate-50/80 sm:px-5 sm:py-4'

export const faqPanel =
  'border-t border-slate-100 bg-slate-50/50 px-4 py-3.5 text-[0.8125rem] leading-[1.65] text-slate-600 sm:px-5 sm:py-4 sm:text-sm'

export const ctaPanel =
  'cta-glass-panel relative mx-auto max-w-[min(100%,42rem)] overflow-hidden rounded-xl border border-white/80 px-6 py-8 text-center sm:px-8 sm:py-9'

export const workflowCtaPanel =
  'cta-glass-panel relative mx-auto max-w-[min(100%,40rem)] overflow-hidden rounded-xl border border-white/70 px-5 py-8 text-center sm:px-8 sm:py-9'

export const footerColTitle =
  'font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-white'

export const footerLink =
  'text-[13px] leading-snug text-slate-300 transition-colors duration-200 hover:text-white'
