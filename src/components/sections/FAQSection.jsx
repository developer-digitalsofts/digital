"use client";

import { useState } from "react";
import { faq } from "@/data/faqs.js";

export default function FAQSection() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-brand-accent-dim">{faq.eyebrow}</p>
        <h2 className="mt-3 text-center text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">{faq.title}</h2>
        <p className="mt-4 text-center text-sm leading-relaxed text-zinc-600 sm:text-base">{faq.subtitle}</p>
        <div className="mt-10 divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-zinc-50/50">
          {faq.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.question}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-zinc-900 sm:text-base">{item.question}</span>
                  <span className="shrink-0 text-lg text-brand-accent-dim">{isOpen ? "−" : "+"}</span>
                </button>
                {isOpen ? <div className="px-4 pb-4 text-sm leading-relaxed text-zinc-600 sm:px-5">{item.answer}</div> : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
