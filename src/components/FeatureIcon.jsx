export default function FeatureIcon({ name, className = "h-6 w-6" }) {
  const common = `shrink-0 ${className}`;
  switch (name) {
    case "ledger":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M4 6h16M4 12h10M4 18h14" strokeLinecap="round" />
          <rect x="14" y="9" width="6" height="10" rx="1" className="fill-orange-50 stroke-brand-accent" />
        </svg>
      );
    case "inventory":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M4 8l8-4 8 4v10l-8 4-8-4V8z" className="fill-orange-50 stroke-brand-accent" />
          <path d="M4 8l8 4 8-4M12 12v10" strokeLinecap="round" />
        </svg>
      );
    case "people":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="9" cy="8" r="3" className="fill-orange-50 stroke-brand-accent" />
          <path d="M3 20v-1a4 4 0 014-4h4a4 4 0 014 4v1" strokeLinecap="round" />
          <circle cx="17" cy="9" r="2.5" />
          <path d="M21 20v-0.5a3 3 0 00-3-3h-1" strokeLinecap="round" />
        </svg>
      );
    case "crm":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <rect x="4" y="5" width="16" height="14" rx="2" className="fill-orange-50 stroke-brand-accent" />
          <path d="M8 10h8M8 14h5" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <circle cx="12" cy="12" r="9" className="fill-orange-50 stroke-brand-accent" />
        </svg>
      );
  }
}
