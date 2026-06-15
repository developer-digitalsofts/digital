import { Link } from 'react-router-dom'
import { SITE_LOGO_SRC } from '../constants'

/**
 * Admin sidebar brand on dark navy: colored icon + inverted white wordmark.
 * Uses the same clip layers as the public footer — no full SVG img on navy.
 */
export function AdminSidebarBrand() {
  return (
    <Link to="/admin" className="block bg-transparent" aria-label="DigitalManager Admin">
      <span className="relative block aspect-[274/62] h-9 max-w-[11.5rem] bg-transparent">
        <img
          src={SITE_LOGO_SRC}
          alt=""
          width={274}
          height={62}
          className="pointer-events-none absolute inset-0 size-full bg-transparent object-contain object-left [clip-path:inset(0_80.73%_0_0)]"
          decoding="async"
          aria-hidden
        />
        <img
          src={SITE_LOGO_SRC}
          alt=""
          width={274}
          height={62}
          className="pointer-events-none absolute inset-0 size-full bg-transparent object-contain object-left brightness-0 invert [clip-path:inset(16.13%_0_17.74%_24.09%)]"
          decoding="async"
          aria-hidden
        />
      </span>
      <p className="mt-2 text-[11px] font-medium leading-snug text-slate-400">Business Management Software</p>
    </Link>
  )
}
