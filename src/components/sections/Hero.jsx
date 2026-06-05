import Link from "next/link";
import { company } from "@/data/company.js";
import ProductPreview from "@/components/ProductPreview.jsx";

export default function Hero() {
  const h = company.hero;

  return (
    <section className="relative overflow-hidden border-b border-zinc-200/80 bg-white">
      <div className="pointer-events-none absolute inset-0 hero-grid opacity-70" />
      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:px-8 lg:pb-24 lg:pt-16">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-10">
          <div>
            <div className="inline-flex flex-wrap gap-2">
              {h.trustBadges.map((b) => (
                <span
                  key={b}
                  className="rounded-full border border-orange-100 bg-orange-50/80 px-3 py-1 text-xs font-medium text-brand-accent-dim"
                >
                  {b}
                </span>
              ))}
            </div>

            <h1 className="mt-6 max-w-[22ch] text-balance text-3xl font-semibold leading-[1.2] tracking-tight text-zinc-900 sm:text-4xl sm:leading-[1.18] lg:text-5xl lg:leading-[1.14] xl:text-6xl xl:leading-[1.12]">
              {h.titleLine1}{" "}
              <span className="bg-gradient-to-r from-brand-accent to-amber-500 bg-clip-text text-transparent">{h.titleHighlight}</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg">{h.subheading}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={h.primaryCta.href}
                className="inline-flex h-11 items-center justify-center rounded-lg bg-brand-accent px-6 text-sm font-semibold text-white shadow-accent-lift transition hover:bg-brand-accent-dim focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
              >
                {h.primaryCta.label}
              </Link>
              <Link
                href={h.secondaryCta.href}
                className="inline-flex h-11 items-center justify-center rounded-lg border border-zinc-300 bg-white px-6 text-sm font-semibold text-zinc-800 shadow-sm transition hover:border-zinc-400 hover:bg-zinc-50"
              >
                {h.secondaryCta.label}
              </Link>
            </div>
          </div>

          <ProductPreview />
        </div>
      </div>
    </section>
  );
}
