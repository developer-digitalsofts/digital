import Link from "next/link";
import { modulesSection } from "@/data/modules.js";
import { paths } from "@/config/paths.js";

export default function ModulesSection() {
  const m = modulesSection;
  return (
    <section id={m.id} className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">{m.title}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-600 sm:text-base">{m.subtitle}</p>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {m.cards.map((c) => (
            <Link
              key={c.slug}
              href={paths.module(c.slug)}
              className="group flex flex-col rounded-2xl border border-zinc-200 bg-zinc-50/40 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:bg-white hover:shadow-accent-card"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-600 ring-1 ring-zinc-200">
                  {c.badge}
                </span>
                <span className="text-zinc-400 transition group-hover:text-brand-accent" aria-hidden>
                  →
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-zinc-900" style={{ textDecorationColor: c.accent }}>
                {c.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600">{c.description}</p>
              <div className="mt-4 h-1 w-12 rounded-full" style={{ backgroundColor: c.accent }} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
