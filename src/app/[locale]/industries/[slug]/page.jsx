import Link from "next/link";
import { notFound } from "next/navigation";
import { industryPages } from "@/data/industries.js";
import { paths } from "@/config/paths.js";

export function generateStaticParams() {
  return Object.keys(industryPages).map((slug) => ({ locale: "en", slug }));
}

export default async function IndustryPage({ params }) {
  const { slug } = await params;
  const page = industryPages[slug];
  if (!page) notFound();

  return (
    <article className="border-b border-zinc-200 bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <Link href={paths.section("industries")} className="text-sm font-semibold text-brand-accent-dim hover:underline">
          ← All industries
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">{page.title}</h1>
        <p className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-base">{page.intro}</p>
        <ul className="mt-8 space-y-3">
          {page.bullets.map((b) => (
            <li key={b} className="flex gap-2 text-sm text-zinc-700">
              <span className="text-brand-accent">●</span>
              {b}
            </li>
          ))}
        </ul>
        <Link
          href={paths.contact}
          className="mt-10 inline-flex h-11 items-center justify-center rounded-lg bg-brand-accent px-6 text-sm font-semibold text-white shadow-accent-soft hover:bg-brand-accent-dim"
        >
          Talk to sales
        </Link>
      </div>
    </article>
  );
}
