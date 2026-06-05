import { company } from "@/data/company.js";

export default function AboutUs() {
  const a = company.about;
  const quotes = company.testimonials.items;

  return (
    <section id={a.id} className="border-y border-zinc-200 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-accent-dim">{a.eyebrow}</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">{a.title}</h2>
            <div className="mt-6 space-y-4 text-sm leading-relaxed text-zinc-600 sm:text-base">
              {a.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <ul className="mt-8 space-y-3">
              {a.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2 text-sm font-medium text-zinc-800">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-50 text-xs text-brand-accent-dim">✓</span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{company.testimonials.title}</p>
            {quotes.map((q) => (
              <figure key={q.name} className="rounded-2xl border border-zinc-200 bg-zinc-50/60 p-5 shadow-sm">
                <blockquote className="text-sm leading-relaxed text-zinc-700">“{q.quote}”</blockquote>
                <figcaption className="mt-4 text-sm">
                  <span className="font-semibold text-zinc-900">{q.name}</span>
                  <span className="text-zinc-500"> — {q.role}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
