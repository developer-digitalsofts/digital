import "./globals.css";

export const metadata = {
  title: "DigitalManager | Cloud ERP & business management software",
  description:
    "DigitalManager — cloud ERP and business management software. Unify finance, inventory, payroll, and industry workflows.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
