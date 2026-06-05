"use client";

import { useState } from "react";
import Link from "next/link";
import { company } from "@/data/company.js";
import { paths } from "@/config/paths.js";

export default function ContactPage() {
  const c = company.contactPage;
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="border-b border-zinc-200 bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">{c.title}</h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 sm:text-base">{c.subtitle}</p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3">
            {sent ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-8 shadow-sm">
                <h2 className="text-lg font-semibold text-emerald-900">{c.successTitle}</h2>
                <p className="mt-2 text-sm leading-relaxed text-emerald-800">{c.successBody}</p>
                <Link href={paths.home} className="mt-6 inline-block text-sm font-semibold text-emerald-900 underline-offset-2 hover:underline">
                  Back to home
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="rounded-2xl border border-zinc-200 bg-zinc-50/50 p-6 shadow-sm sm:p-8">
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{c.form.nameLabel}</span>
                    <input required className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none ring-brand-accent/30 focus:ring-2" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{c.form.emailLabel}</span>
                    <input type="email" required className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none ring-brand-accent/30 focus:ring-2" />
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{c.form.companyLabel}</span>
                    <input required className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none ring-brand-accent/30 focus:ring-2" />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{c.form.messageLabel}</span>
                    <textarea rows={4} className="mt-1.5 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm outline-none ring-brand-accent/30 focus:ring-2" />
                  </label>
                </div>
                <button
                  type="submit"
                  className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-lg bg-brand-accent text-sm font-semibold text-white shadow-accent-soft transition hover:bg-brand-accent-dim sm:w-auto sm:px-8"
                >
                  {c.form.submitLabel}
                </button>
              </form>
            )}
          </div>
          <aside className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm lg:col-span-2">
            <p className="text-sm font-semibold text-zinc-900">Why static?</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              This site ships as HTML, JS, and CSS only—ideal for CDN hosting, fast loads, and zero server maintenance for marketing pages.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-zinc-600">
              <li>— No database or API keys in the browser</li>
              <li>— Forms are demo-only unless you wire an action</li>
              <li>
                — Content lives in <code className="rounded bg-zinc-100 px-1">src/data</code> files
              </li>
            </ul>
          </aside>
        </div>
      </div>
    </div>
  );
}
