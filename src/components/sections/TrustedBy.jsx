import { company } from "@/data/company.js";

export default function TrustedBy() {
  const t = company.trustedBy;
  return (
    <section className="border-b border-zinc-200 bg-zinc-50/80 py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-zinc-500">{t.title}</p>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-zinc-600">{t.subtitle}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {t.names.map((name) => (
            <div
              key={name}
              className="flex h-11 min-w-[9rem] items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-xs font-semibold text-zinc-700 shadow-sm"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
