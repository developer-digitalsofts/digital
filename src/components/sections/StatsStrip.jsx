import { stats } from "@/data/stats.js";
import { company } from "@/data/company.js";

export default function StatsStrip() {
  return (
    <section className="bg-white py-12 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-brand-accent-dim">{company.statsEyebrow}</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-zinc-200 bg-gradient-to-b from-white to-zinc-50/80 p-5 text-center shadow-sm"
            >
              <div className="text-2xl" aria-hidden>
                {s.icon}
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900">{s.value}</p>
              <p className="mt-1 text-sm text-zinc-600">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
