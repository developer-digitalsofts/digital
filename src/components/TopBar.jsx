import Link from "next/link";
import { company } from "@/data/company.js";

export default function TopBar() {
  const t = company.topBar;
  return (
    <div className="border-b border-orange-100 bg-orange-50/90 text-center text-xs text-brand-accent-dim sm:text-sm">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-2 px-4 py-2 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
        <p>{t.message}</p>
        <Link href={t.cta.href} className="font-semibold underline-offset-2 hover:underline">
          {t.cta.label}
        </Link>
      </div>
    </div>
  );
}
