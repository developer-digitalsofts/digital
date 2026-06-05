import Link from "next/link";
import { company } from "@/data/company.js";

export default function MidCta() {
  const c = company.midCta;
  return (
    <section id={c.id} className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 py-16 text-white sm:py-20">
      <div className="pointer-events-none absolute inset-0 opacity-40 hero-grid [background-size:40px_40px]" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{c.title}</h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-300 sm:text-base">{c.subtitle}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={c.primary.href}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-brand-accent px-6 text-sm font-semibold text-white shadow-glow transition hover:bg-brand-accent-dim"
            >
              {c.primary.label}
            </Link>
            <Link
              href={c.secondary.href}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-white/20 bg-white/5 px-6 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
            >
              {c.secondary.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
