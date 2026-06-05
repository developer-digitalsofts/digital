import Link from "next/link";
import { industriesSection } from "@/data/industries.js";
import { paths } from "@/config/paths.js";

export default function IndustriesSection() {
  const s = industriesSection;
  return (
    <section id={s.id} className="border-t border-zinc-200 bg-zinc-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">{s.title}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-600 sm:text-base">{s.subtitle}</p>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {s.cards.map((c) => (
            <Link
              key={c.slug}
              href={paths.industry(c.slug)}
              className="group rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-accent-card"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold text-zinc-900">{c.title}</h3>
                <span className="text-zinc-400 transition group-hover:text-brand-accent" aria-hidden>
                  →
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">{c.description}</p>
              <div className="mt-4 h-1 w-10 rounded-full" style={{ backgroundColor: c.accent }} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
