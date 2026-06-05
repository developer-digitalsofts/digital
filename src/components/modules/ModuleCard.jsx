import Link from "next/link";
import { paths } from "@/config/paths.js";
import ModuleIcon from "./ModuleIcon.jsx";

export default function ModuleCard({ card }) {
  return (
    <Link
      href={paths.module(card.slug)}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-zinc-100/90 bg-gradient-to-br from-white via-white to-orange-50/40 p-6 shadow-sm ring-1 ring-black/[0.02] transition duration-300 hover:-translate-y-1 hover:border-orange-200/80 hover:shadow-xl hover:shadow-orange-500/[0.12] hover:ring-orange-200/40"
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
        style={{ backgroundColor: `${card.accent}33` }}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-100/80 bg-gradient-to-br from-orange-50 to-white shadow-inner"
          style={{ color: card.accent }}
        >
          <ModuleIcon slug={card.slug} className="h-7 w-7" />
        </div>
        <span className="rounded-full border border-orange-100/80 bg-orange-50/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-accent-dim">
          {card.badge}
        </span>
      </div>
      <h3 className="relative mt-5 text-lg font-bold tracking-tight text-zinc-900 sm:text-xl">{card.title}</h3>
      <p className="relative mt-2 flex-1 text-sm leading-relaxed text-zinc-600">{card.description}</p>
      <div className="relative mt-6 flex items-center justify-between border-t border-zinc-100/80 pt-5">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-brand-accent transition group-hover:gap-3">
          Explore module
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="h-2 w-2 rounded-full opacity-60 transition group-hover:opacity-100" style={{ backgroundColor: card.accent }} />
      </div>
    </Link>
  );
}
