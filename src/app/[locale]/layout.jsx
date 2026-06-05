import { notFound } from "next/navigation";
import PageShell from "@/components/PageShell.jsx";

const allowed = new Set(["en"]);

export function generateStaticParams() {
  return [{ locale: "en" }];
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!allowed.has(locale)) notFound();
  return <PageShell>{children}</PageShell>;
}
