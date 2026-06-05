/** Lightweight inline icons per module slug — no extra dependencies */
export default function ModuleIcon({ slug, className = "h-6 w-6" }) {
  const c = `shrink-0 ${className} text-brand-accent`;
  switch (slug) {
    case "accounts":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M4 6h16M4 12h10M4 18h14" strokeLinecap="round" />
          <rect x="14" y="9" width="6" height="10" rx="1.5" className="fill-orange-500/15" />
        </svg>
      );
    case "production":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M12 3L4 8v8l8 5 8-5V8l-8-5z" className="fill-orange-500/15" />
          <path d="M12 12l8-4M12 12v9M12 12L4 8" strokeLinecap="round" />
        </svg>
      );
    case "pos":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <rect x="5" y="3" width="14" height="18" rx="2" className="fill-orange-500/15" />
          <path d="M9 8h6M9 12h4" strokeLinecap="round" />
        </svg>
      );
    case "fbr-pos":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <rect x="4" y="5" width="16" height="14" rx="2" className="fill-orange-500/15" />
          <path d="M8 10h8M8 14h5" strokeLinecap="round" />
          <circle cx="17" cy="8" r="2" className="fill-brand-accent" />
        </svg>
      );
    case "inventory":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <path d="M4 8l8-4 8 4v10l-8 4-8-4V8z" className="fill-orange-500/15" />
          <path d="M4 8l8 4 8-4M12 12v10" strokeLinecap="round" />
        </svg>
      );
    case "payroll":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <circle cx="9" cy="8" r="3" className="fill-orange-500/15" />
          <path d="M3 20v-1a4 4 0 014-4h4a4 4 0 014 4v1" strokeLinecap="round" />
          <path d="M16 11h5M18.5 9.5v3" strokeLinecap="round" />
        </svg>
      );
    case "integration":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <circle cx="8" cy="8" r="3" className="fill-orange-500/15" />
          <circle cx="16" cy="16" r="3" className="fill-orange-500/15" />
          <path d="M10.5 10.5l5 5M13.5 10.5l-5 5" strokeLinecap="round" />
        </svg>
      );
    case "crm":
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <rect x="4" y="5" width="16" height="14" rx="2" className="fill-orange-500/15" />
          <path d="M8 10h8M8 14h5" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg className={c} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
          <rect x="4" y="4" width="16" height="16" rx="3" className="fill-orange-500/15" />
        </svg>
      );
  }
}
