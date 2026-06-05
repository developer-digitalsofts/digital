"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { company } from "@/data/company.js";
import { paths } from "@/config/paths.js";

function subscribeHash(onStoreChange) {
  window.addEventListener("hashchange", onStoreChange);
  return () => window.removeEventListener("hashchange", onStoreChange);
}

function getHashSnapshot() {
  return typeof window !== "undefined" ? window.location.hash : "";
}

function getServerHash() {
  return "";
}

function useHash() {
  return useSyncExternalStore(subscribeHash, getHashSnapshot, getServerHash);
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const hash = useHash();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href={paths.home} className="flex items-center gap-2 font-semibold tracking-tight text-zinc-900" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-accent to-brand-accent-dim text-sm font-bold text-white shadow-accent-soft">
            DM
          </span>
          <span className="hidden sm:inline">{company.site.name}</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {company.navigation.links.map((l) => {
            let active = false;
            if (l.href === paths.contact) active = pathname === paths.contact;
            else if (l.href === paths.home) active = pathname === paths.home && hash === "";
            else if (l.href.startsWith(`${paths.home}#`)) active = pathname === paths.home && hash === "#" + l.href.split("#")[1];
            return (
              <Link
                key={l.href + l.label}
                href={l.href}
                className={[
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active ? "bg-orange-50 text-brand-accent-dim" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
                ].join(" ")}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:block">
          <Link
            href={paths.contact}
            className="inline-flex items-center justify-center rounded-lg bg-brand-accent px-4 py-2 text-sm font-semibold text-white shadow-accent-soft transition hover:bg-brand-accent-dim"
          >
            Book a demo
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 md:hidden"
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="text-lg">{open ? "×" : "≡"}</span>
        </button>
      </div>

      {open ? (
        <div className="border-t border-zinc-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {company.navigation.links.map((l) => (
              <Link
                key={l.href + l.label}
                href={l.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href={paths.contact}
              className="mt-2 inline-flex items-center justify-center rounded-lg bg-brand-accent px-4 py-2.5 text-sm font-semibold text-white"
              onClick={() => setOpen(false)}
            >
              Book a demo
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
