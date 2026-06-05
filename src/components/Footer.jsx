import Link from "next/link";
import { company } from "@/data/company.js";

export default function Footer() {
  const year = new Date().getFullYear();
  const copy = company.footer.copyright.replace("{year}", String(year));

  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 font-semibold text-zinc-900">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-accent text-sm font-bold text-white">DM</span>
              {company.site.name}
            </div>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600">{company.footer.tagline}</p>
          </div>
          {company.footer.columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold text-zinc-900">{col.title}</h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.label + l.href}>
                    {l.href.startsWith("http") || l.href === "#" ? (
                      <a href={l.href} className="text-sm text-zinc-600 hover:text-brand-accent-dim">
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className="text-sm text-zinc-600 hover:text-brand-accent-dim">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-xs text-zinc-500 md:text-left">{copy}</p>
      </div>
    </footer>
  );
}
