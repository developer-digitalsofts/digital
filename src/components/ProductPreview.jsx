/** Static dashboard preview card for hero */
export default function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:mx-0">
      <div className="pointer-events-none absolute -inset-4 rounded-3xl bg-gradient-to-tr from-orange-100/80 via-white to-orange-50/60 blur-2xl" />
      <div className="relative animate-hero-float overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-accent-card">
        <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50/80 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-brand-accent opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-accent" />
            </span>
            <span className="text-xs font-medium text-zinc-600">Live workspace</span>
          </div>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">Synced</span>
        </div>
        <div className="grid gap-3 p-4 sm:p-5">
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Cash", value: "PKR 4.2M", tone: "text-emerald-700 bg-emerald-50" },
              { label: "Stock", value: "98.2%", tone: "text-sky-700 bg-sky-50" },
              { label: "Payroll", value: "Ready", tone: "text-orange-800 bg-orange-50" },
            ].map((k) => (
              <div key={k.label} className={`rounded-xl px-2 py-2.5 sm:px-3 ${k.tone}`}>
                <p className="text-[10px] font-medium uppercase tracking-wide opacity-80">{k.label}</p>
                <p className="mt-1 text-sm font-semibold tabular-nums">{k.value}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-3">
            <div className="flex items-center justify-between text-xs font-medium text-zinc-500">
              <span>Orders today</span>
              <span className="text-zinc-900">142</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-200">
              <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-brand-accent to-amber-400" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg border border-zinc-100 bg-white p-3 shadow-sm">
              <p className="font-medium text-zinc-500">AR aging</p>
              <p className="mt-1 font-semibold text-zinc-900">Current · 12d</p>
            </div>
            <div className="rounded-lg border border-zinc-100 bg-white p-3 shadow-sm">
              <p className="font-medium text-zinc-500">Low stock</p>
              <p className="mt-1 font-semibold text-brand-accent-dim">7 SKUs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
