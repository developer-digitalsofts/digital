import Link from "next/link";
import { company } from "@/data/company.js";

export default function FinalCta() {
  const c = company.finalCta;
  return (
    <section className="border-t border-zinc-200 bg-gradient-to-b from-orange-50/80 to-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">{c.title}</h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-600 sm:text-base">{c.subtitle}</p>
        <Link
          href={c.primary.href}
          className="mt-8 inline-flex h-11 items-center justify-center rounded-lg bg-brand-accent px-8 text-sm font-semibold text-white shadow-accent-lift transition hover:bg-brand-accent-dim"
        >
          {c.primary.label}
        </Link>
      </div>
    </section>
  );
}
