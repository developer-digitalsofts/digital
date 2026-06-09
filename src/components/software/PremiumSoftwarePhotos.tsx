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
          height={900}
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

type PhotoProps = {
  paths: PremiumPhotoPaths
  productLabel: string
  className?: string
}

export function PremiumHeroPhoto({ paths, productLabel, className }: PhotoProps) {
  return (
    <PremiumPhotoFrame
      src={paths.heroTeam}
      alt={`${productLabel} — industry ERP operations`}
      aspectClass="aspect-[5/4] min-h-[220px] sm:min-h-[260px] md:aspect-[16/11] md:min-h-[280px] lg:max-h-[440px]"
      priority
      className={className}
    />
  )
}

export function PremiumFinancialReportsPhoto({ paths, productLabel, className }: PhotoProps) {
  return (
    <PremiumPhotoFrame
      src={paths.financialReports}
      alt={`${productLabel} — analytics and reporting dashboard`}
      aspectClass="aspect-[4/3] sm:aspect-[5/4]"
      className={className}
    />
  )
}

export function PremiumDashboardPhoto({ paths, productLabel, className }: PhotoProps) {
  return (
    <PremiumPhotoFrame
      src={paths.dashboard}
      alt={`${productLabel} — ERP management dashboard`}
      aspectClass="aspect-[4/3] sm:aspect-[16/10]"
      className={className}
    />
  )
}

export function PremiumTeamMeetingPhoto({ paths, productLabel, className }: PhotoProps) {
  return (
    <PremiumPhotoFrame
      src={paths.teamMeeting}
      alt={`${productLabel} — industry workflow and operations`}
      aspectClass="aspect-[4/3] sm:aspect-[3/2]"
      className={className}
    />
  )
}

export function PremiumLedgerOfficePhoto({ paths, productLabel, className }: PhotoProps) {
  return (
    <PremiumPhotoFrame
      src={paths.ledgerOffice}
      alt={`${productLabel} — business records and document management`}
      aspectClass="aspect-[4/3] sm:aspect-[5/4]"
      className={className}
    />
  )
}
