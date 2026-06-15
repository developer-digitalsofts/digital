import { FileSpreadsheet, Package, TrendingUp, Wallet } from 'lucide-react'
import { useI18n } from '../i18n/I18nProvider'

const modules = [
  {
    labelKey: 'about.checklist.accounts',
    icon: Wallet,
    badge: 'border-brand bg-brand text-white',
  },
  {
    labelKey: 'about.checklist.inventory',
    icon: Package,
    badge: 'border-emerald-500 bg-emerald-500 text-white',
  },
  {
    labelKey: 'about.visual.sales',
    icon: TrendingUp,
    badge: 'border-blue-500 bg-blue-500 text-white',
  },
  {
    labelKey: 'about.checklist.reports',
    icon: FileSpreadsheet,
    badge: 'border-violet-500 bg-violet-500 text-white',
  },
] as const

function GrowthCurve() {
  return (
    <svg viewBox="0 0 200 72" className="h-[3.75rem] w-full sm:h-[4.25rem]" aria-hidden>
      <defs>
        <linearGradient id="about-growth-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff7a45" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#ff7a45" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M8 58 C36 54, 52 44, 72 38 S108 18, 132 14 S168 8, 192 4"
        fill="none"
        stroke="#141d38"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.18"
      />
      <path
        d="M8 62 L8 58 C36 54, 52 44, 72 38 S108 18, 132 14 S168 8, 192 4 L192 62 Z"
        fill="url(#about-growth-fill)"
      />
      <path
        d="M8 58 C36 54, 52 44, 72 38 S108 18, 132 14 S168 8, 192 4"
        fill="none"
        stroke="#ff7a45"
        strokeWidth="2.75"
        strokeLinecap="round"
      />
      <polygon points="192,4 186,10 198,10" fill="#ff7a45" />
    </svg>
  )
}

function TeamFigure({ x, scale = 1 }: { x: number; scale?: number }) {
  return (
    <g transform={`translate(${x}, 0) scale(${scale})`} aria-hidden>
      <circle cx="24" cy="14" r="11" fill="#141d38" />
      <path d="M8 52 Q24 38 40 52 L40 68 L8 68 Z" fill="#141d38" />
      <rect x="30" y="44" width="18" height="14" rx="3" fill="#fff" stroke="#141d38" strokeWidth="1.5" />
      <rect x="33" y="47" width="10" height="2" rx="1" fill="#ff7a45" />
      <rect x="33" y="51" width="8" height="1.5" rx="0.75" fill="#cbd5e1" />
    </g>
  )
}

function PlanningBoard() {
  return (
    <svg viewBox="0 0 80 64" className="h-[3.75rem] w-[4.75rem] shrink-0 sm:h-16 sm:w-[5.25rem]" aria-hidden>
      <rect x="4" y="6" width="72" height="52" rx="6" fill="#fff" stroke="#141d38" strokeWidth="1.5" opacity="0.95" />
      <rect x="12" y="14" width="28" height="4" rx="2" fill="#ff7a45" opacity="0.85" />
      <rect x="12" y="22" width="48" height="3" rx="1.5" fill="#e2e8f0" />
      <rect x="12" y="29" width="40" height="3" rx="1.5" fill="#e2e8f0" />
      <circle cx="58" cy="42" r="10" fill="#141d38" opacity="0.08" />
      <path
        d="M54 42 L57 45 L62 38"
        fill="none"
        stroke="#ff7a45"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function AboutBusinessGrowthVisual() {
  const { t } = useI18n()

  return (
    <figure
      className="overflow-hidden rounded-2xl border border-[rgba(15,23,42,0.1)] bg-gradient-to-br from-[#fffbf8] via-white to-[#f8fafc]"
      aria-label={t('about.imageAlt')}
    >
      <div className="relative aspect-[5/4] w-full min-h-[17.5rem] overflow-hidden p-5 sm:min-h-[19rem] sm:p-6 lg:aspect-[5/4] lg:min-h-[21.5rem] xl:min-h-[23rem]">
        <div
          className="pointer-events-none absolute -end-4 -top-4 size-24 rounded-full bg-brand/[0.08] sm:size-28"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-6 -start-4 size-28 rounded-2xl bg-[#141d38]/[0.04] sm:size-32"
          aria-hidden
        />

        <div className="relative flex h-full flex-col gap-3 sm:gap-3.5">
          <div className="flex items-center justify-between gap-2.5 rounded-xl border border-[rgba(15,23,42,0.08)] bg-white px-3 py-2.5 sm:px-3.5">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wide text-brand">
                {t('about.visual.eyebrow')}
              </p>
              <p className="mt-0.5 text-xs font-semibold text-[#141d38] sm:text-[0.8125rem]">
                {t('about.visual.tagline')}
              </p>
            </div>
            <PlanningBoard />
          </div>

          <div className="flex min-h-0 flex-1 items-stretch gap-2.5 rounded-xl border border-[rgba(15,23,42,0.08)] bg-white p-3 sm:gap-3 sm:p-3.5">
            <div className="flex min-w-0 flex-1 flex-col justify-center">
              <svg viewBox="0 0 120 72" className="mx-auto h-[4.25rem] w-full max-w-[9.5rem] sm:h-[4.75rem] sm:max-w-[10.5rem]" aria-hidden>
                <TeamFigure x={0} scale={0.95} />
                <TeamFigure x={38} scale={1.05} />
                <TeamFigure x={76} scale={0.9} />
              </svg>
              <p className="mt-2 text-center text-[10px] leading-snug text-slate-500 sm:text-[11px]">
                {t('about.visual.teamCaption')}
              </p>
            </div>

            <div className="w-px shrink-0 self-stretch bg-gradient-to-b from-transparent via-slate-200/90 to-transparent" aria-hidden />

            <div className="flex min-w-0 flex-1 flex-col justify-center">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:text-[11px]">
                {t('about.visual.growthLabel')}
              </p>
              <GrowthCurve />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
            {modules.map(({ labelKey, icon: Icon, badge }) => (
              <div
                key={labelKey}
                className="flex flex-col items-center rounded-lg border border-[rgba(15,23,42,0.08)] bg-white px-1.5 py-2.5 text-center sm:px-2 sm:py-3"
              >
                <span
                  className={`flex size-9 items-center justify-center rounded-full border sm:size-10 ${badge}`}
                >
                  <Icon className="size-4 sm:size-[1.125rem]" strokeWidth={2.25} aria-hidden />
                </span>
                <span className="mt-2 line-clamp-2 text-[9px] font-semibold leading-tight text-slate-600 sm:text-[10px]">
                  {t(labelKey)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </figure>
  )
}
