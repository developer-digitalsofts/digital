import Link from "next/link";
import { paths } from "@/config/paths.js";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-2xl font-semibold text-zinc-900">Page not found</h1>
      <Link href={paths.home} className="text-sm font-semibold text-brand-accent-dim underline">
        Go home
      </Link>
    </div>
  );
}
