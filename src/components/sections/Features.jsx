import { company } from "@/data/company.js";
import FeatureIcon from "@/components/FeatureIcon.jsx";

export default function Features() {
  const f = company.features;
  return (
    <section id={f.id} className="bg-zinc-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-accent-dim">{f.eyebrow}</p>
        <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">{f.title}</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-600 sm:text-base">{f.subtitle}</p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {f.items.map((item) => (
            <div key={item.title} className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-accent-card">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-brand-accent-dim">
                  <FeatureIcon name={item.icon} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
