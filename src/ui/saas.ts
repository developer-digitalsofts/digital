/** Shared SaaS marketing UI tokens — premium compact enterprise ERP. */

export const sectionPad = 'py-12 md:py-[3.75rem] lg:py-[4.25rem]'
export const sectionPadCompact = 'py-10 md:py-12 lg:py-[3.25rem]'
export const heroPad = 'py-12 md:py-16 lg:py-[4.75rem] xl:py-20'
export const footerPad = 'py-10 md:py-11 lg:py-12'

/** Space between section title block and content grid */
export const sectionContentTop = 'mt-9 md:mt-10'

export const sectionWhite = 'relative border-y border-slate-200/50 bg-white'
export const sectionMuted =
  'relative border-y border-slate-200/50 bg-[#f8fafc]'

export const sectionNavy =
  'relative border-y border-slate-200/50 bg-gradient-to-br from-[#141d38] via-[#1a2744] to-[#141d38]'

export const sectionTitle =
  'font-heading text-center text-[1.875rem] font-bold tracking-tight text-slate-900 sm:text-[2rem] md:text-[2.125rem] md:leading-[1.14] lg:text-[2.25rem] lg:leading-[1.12]'

export const sectionTitleLeft =
  'font-heading text-[1.75rem] font-bold tracking-tight text-slate-900 sm:text-[1.875rem] md:text-[2rem] md:leading-[1.14] lg:text-[2.125rem] lg:leading-[1.12]'

export const sectionSub =
  'mt-3 text-pretty text-[0.9375rem] leading-[1.62] text-slate-600 md:text-base md:leading-[1.66]'

export const sectionSubCenter = `${sectionSub} mx-auto max-w-2xl text-center`

export const sectionEyebrow =
  'text-[11px] font-semibold uppercase tracking-[0.16em] text-brand'

/** Visible flat card border — no shadow */
export const cardBorderColor = 'border-[rgba(15,23,42,0.12)]'

/** Consistent card surface — clean white, soft visible border, no shadow */
export const cardBorder = `border ${cardBorderColor} bg-white`

export const cardFlat =
  `rounded-2xl border ${cardBorderColor} bg-white transition-[border-color,transform] duration-200 ease-out`

export const cardBase =
  'group/card relative rounded-2xl bg-white transition-[border-color,transform] duration-200 ease-out motion-reduce:transition-colors'

export const cardInteractive =
  `${cardBase} ${cardBorder} hover:-translate-y-px hover:border-brand/50 motion-reduce:hover:translate-y-0`

export const cardPad = 'p-6 sm:p-7'

export const cardTitle =
  'font-heading text-[1.0625rem] font-semibold leading-snug tracking-tight text-slate-900 sm:text-lg'

export const cardDesc = 'mt-2.5 flex-1 text-[0.9375rem] leading-[1.65] text-slate-600'

export const cardFooter = 'mt-auto border-t border-slate-100 pt-4'

export const statCard = `${cardInteractive} ${cardPad} flex min-h-[7.5rem] flex-col items-center justify-center text-center`

export const moduleCard = `${cardInteractive} ${cardPad} flex h-full flex-col`

export const industryCard = `${cardInteractive} ${cardPad} flex h-full flex-col`

export const featureCard = `${cardInteractive} ${cardPad} flex h-full min-h-[13rem] flex-col`

export const detailCard = `${cardInteractive} ${cardPad}`

export const detailCardStatic = `${cardBase} ${cardBorder} ${cardPad}`

export const headerShellBase =
  'sticky top-0 z-[100] border-b backdrop-blur-md transition-[box-shadow,background-color,border-color] duration-300 ease-out supports-[backdrop-filter]:bg-white/90'

export const headerShellDefault =
  `${headerShellBase} border-slate-200/70 bg-white/95 shadow-[0_1px_0_rgba(15,23,42,0.04)]`

export const headerShellScrolled =
  `${headerShellBase} border-slate-200/90 bg-white/[0.98] shadow-[0_8px_30px_-12px_rgba(15,23,42,0.14),0_1px_0_rgba(15,23,42,0.05)]`

export const headerGetDemoButtonClass =
  'btn-shine inline-flex shrink-0 items-center justify-center rounded-lg border border-brand/20 bg-brand px-3.5 py-2 text-xs font-semibold text-white shadow-[0_2px_12px_-4px_rgba(234,111,79,0.45)] transition-[background-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-px hover:border-brand-dark hover:bg-brand-dark hover:shadow-[0_6px_20px_-6px_rgba(234,111,79,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand motion-safe:active:scale-[0.99] motion-reduce:hover:translate-y-0 sm:px-4 sm:text-sm'

export const btnPrimary =
  'btn-shine inline-flex min-h-[44px] items-center justify-center rounded-lg border border-brand/20 bg-brand px-5 py-2.5 text-[0.9375rem] font-semibold text-white transition-[background-color,border-color] duration-200 ease-out hover:border-brand-dark hover:bg-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

export const btnSecondary =
  'inline-flex min-h-[44px] items-center justify-center rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-[0.9375rem] font-semibold text-slate-700 transition-[border-color,background-color,color] duration-200 ease-out hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 motion-safe:active:scale-[0.99] motion-reduce:hover:translate-y-0'

/** Secondary button on dark CTA banners */
export const btnOnDark =
  'inline-flex min-h-[44px] items-center justify-center rounded-lg border border-white/30 bg-white/10 px-5 py-2.5 text-[0.9375rem] font-semibold text-white backdrop-blur-[2px] transition-[border-color,background-color] duration-200 ease-out hover:border-white/50 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

/** 48px icon tile — compact rows */
export const iconGlyph = 'size-6 shrink-0 text-brand'

export const iconTile =
  'border border-slate-200/90 bg-slate-50/80 text-brand transition-colors duration-300 group-hover/card:border-brand/30 group-hover/card:bg-brand/[0.06]'

export const iconBox = `flex size-[3.25rem] shrink-0 items-center justify-center rounded-xl ${iconTile}`

/** 60px icon tile — primary card icons */
export const iconGlyphLg = 'size-8 shrink-0 text-brand'

export const iconBoxLg = `flex size-[3.75rem] shrink-0 items-center justify-center rounded-xl ${iconTile}`

export const linkAccent =
  'inline-flex items-center gap-1.5 text-[0.9375rem] font-semibold text-brand transition-[color,gap] duration-300 hover:text-brand-dark'

export const badgePill =
  'inline-flex items-center gap-2 rounded-full border border-[rgba(15,23,42,0.08)] bg-white px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-slate-600 sm:text-xs'

export const frameBorder = 'rounded-xl border border-slate-200/60 bg-white'

export const heroSection =
  'relative overflow-hidden border-b border-slate-200/60 bg-gradient-to-b from-[#f8fafc] via-white to-[#f6f8fc]'

export const heroTitle =
  'font-heading text-[2.25rem] font-bold leading-[1.14] tracking-tight text-slate-900 sm:text-[2.625rem] sm:leading-[1.12] md:text-[3rem] md:leading-[1.1] lg:text-[3.375rem] lg:leading-[1.08] xl:text-[3.5rem] xl:leading-[1.06]'

export const heroSub =
  'mt-5 font-sans text-base font-semibold leading-relaxed text-brand sm:mt-6 sm:text-[1.0625rem]'

export const heroBody =
  'mx-auto mt-6 max-w-[34rem] text-pretty text-base leading-[1.68] text-slate-600 sm:mt-7 lg:mx-0 lg:max-w-[36rem]'

export const heroTrustLine =
  'mx-auto mt-5 max-w-[34rem] text-pretty text-sm font-medium leading-relaxed text-slate-500 sm:mt-6 lg:mx-0 lg:max-w-[36rem]'

/** Wrapper for dashboard preview — pairs with .hero-mockup-stage in index.css */
export const heroMockupWrap = 'hero-mockup-stage relative isolate w-full'

export const heroMockupPanel =
  'hero-mockup-panel relative'

/** Premium listing cards — visible border, no shadow */
export const cardBorderStrong = 'border-[rgba(15,23,42,0.14)]'

export const faqItem = `${cardBase} ${cardBorder} overflow-hidden`

export const faqTrigger =
  'flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-semibold leading-snug text-slate-900 transition-colors duration-200 hover:bg-slate-50/80 sm:px-6'

export const faqPanel =
  'border-t border-slate-100 bg-slate-50/50 px-5 py-4 text-[0.8125rem] leading-[1.65] text-slate-600 sm:px-6 sm:text-sm'

export const ctaPanel =
  'cta-panel-visual cta-panel-visual--final relative mx-auto max-w-[min(100%,52rem)] overflow-hidden rounded-2xl px-6 py-9 text-center sm:px-10 sm:py-10 md:px-12 md:py-11'

export const workflowCtaPanel =
  'cta-panel-visual cta-panel-visual--workflow relative mx-auto max-w-[min(100%,52rem)] overflow-hidden rounded-2xl px-6 py-9 text-center sm:px-10 sm:py-10 md:px-12 md:py-11'

export const footerColTitle =
  'font-heading text-xs font-bold uppercase tracking-[0.14em] text-white'

export const footerLink =
  'text-sm leading-relaxed text-slate-300/90 transition-colors duration-200 hover:text-white'

export const cardEyebrow =
  'shrink-0 rounded border border-slate-200/90 bg-slate-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600 transition-colors duration-300 group-hover/premium:border-brand/35 group-hover/premium:bg-brand/[0.08] group-hover/premium:text-brand-dark'

export const cardEyebrowIndustry =
  'shrink-0 rounded-full border border-slate-200/90 bg-slate-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600 transition-colors duration-300 group-hover/premium:border-brand/30 group-hover/premium:bg-brand/[0.06] group-hover/premium:text-brand-dark'

/** Prominent CTA buttons — no heavy shadow */
export const btnCtaLg =
  'inline-flex min-h-[48px] items-center justify-center rounded-lg border border-brand/20 bg-brand px-7 py-3 text-base font-semibold text-white transition-[background-color,border-color] duration-200 hover:bg-brand-dark hover:border-brand-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand'

export const btnOnDarkLg =
  'inline-flex min-h-[48px] items-center justify-center rounded-lg border border-white/35 bg-white/10 px-7 py-3 text-base font-semibold text-white backdrop-blur-[2px] transition-[border-color,background-color] duration-200 hover:border-white/55 hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

export const faqItemInteractive =
  `card-accent-hover ${cardFlat} overflow-hidden data-[open=true]:border-brand/35`

export const faqTriggerModern =
  'flex w-full min-h-[4.5rem] items-center justify-between gap-4 px-5 py-5 text-left leading-snug transition-colors duration-300 hover:bg-slate-50/60 sm:min-h-[4.75rem] sm:px-7 sm:py-5'

export const faqPanelModern =
  'border-t border-slate-100/90 bg-slate-50/35 px-5 py-5 text-[0.9375rem] leading-[1.78] text-slate-600 sm:px-7 sm:py-6 sm:text-base sm:leading-[1.75]'
