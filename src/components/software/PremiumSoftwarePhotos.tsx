import { useEffect, useState } from 'react'
import type { PremiumPhotoPaths } from '../../data/softwareDetail/premiumImagePacks'
import { PREMIUM_IMAGE_FALLBACK } from '../../data/softwareDetail/premiumImagePacks'

type FrameProps = {
  src: string
  alt: string
  aspectClass: string
  priority?: boolean
  className?: string
}

function PremiumPhotoFrame({ src, alt, aspectClass, priority = false, className = '' }: FrameProps) {
  const [imgSrc, setImgSrc] = useState(src)

  useEffect(() => {
    setImgSrc(src)
  }, [src])

  return (
    <figure
      className={`overflow-hidden rounded-xl border border-slate-200/90 bg-slate-50 ${className}`}
    >
      <div className={`relative w-full ${aspectClass}`}>
        <img
          src={imgSrc}
          alt={alt}
          width={1600}
          height={1200}
          className="absolute inset-0 size-full object-cover object-center"
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onError={() => {
            if (imgSrc !== PREMIUM_IMAGE_FALLBACK) setImgSrc(PREMIUM_IMAGE_FALLBACK)
          }}
        />
      </div>
    </figure>
  )
}

export function PremiumHeroPhoto({ paths, productLabel }: { paths: PremiumPhotoPaths; productLabel: string }) {
  return (
    <PremiumPhotoFrame
      src={paths.heroTeam}
      alt={`${productLabel} — business team collaborating with laptops and operational dashboards`}
      aspectClass="aspect-[5/4] min-h-[220px] sm:min-h-[260px] md:aspect-[16/11] md:min-h-[280px] lg:max-h-[440px]"
      priority
    />
  )
}

export function PremiumFinancialReportsPhoto({
  paths,
  productLabel,
}: {
  paths: PremiumPhotoPaths
  productLabel: string
}) {
  return (
    <PremiumPhotoFrame
      src={paths.financialReports}
      alt={`${productLabel} — financial reports and business performance review`}
      aspectClass="aspect-[4/3] sm:aspect-[5/4]"
    />
  )
}

export function PremiumDashboardPhoto({
  paths,
  productLabel,
}: {
  paths: PremiumPhotoPaths
  productLabel: string
}) {
  return (
    <PremiumPhotoFrame
      src={paths.dashboard}
      alt={`${productLabel} — operations dashboard with KPIs and analytics`}
      aspectClass="aspect-[4/3] sm:aspect-[16/10]"
    />
  )
}

export function PremiumTeamMeetingPhoto({
  paths,
  productLabel,
}: {
  paths: PremiumPhotoPaths
  productLabel: string
}) {
  return (
    <PremiumPhotoFrame
      src={paths.teamMeeting}
      alt={`${productLabel} — team meeting and business planning session`}
      aspectClass="aspect-[4/3] sm:aspect-[3/2]"
    />
  )
}

export function PremiumLedgerOfficePhoto({
  paths,
  productLabel,
}: {
  paths: PremiumPhotoPaths
  productLabel: string
}) {
  return (
    <PremiumPhotoFrame
      src={paths.ledgerOffice}
      alt={`${productLabel} — ledger, documents, and day-to-day operations`}
      aspectClass="aspect-[4/3] sm:aspect-[5/4]"
    />
  )
}
