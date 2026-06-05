import { paths } from "@/config/paths.js";

/** Site-wide copy, navigation, testimonials, footer — no network calls */
export const company = {
  site: {
    name: "DigitalManager",
    legalName: "DigitalManager",
    tagline: "Cloud ERP & business management",
  },
  topBar: {
    message: "Static demo site — contact form shows confirmation only.",
    cta: { label: "Talk to us", href: paths.contact },
  },
  navigation: {
    links: [
      { label: "Home", href: paths.home },
      { label: "Modules", href: paths.section("modules") },
      { label: "Industries", href: paths.section("industries") },
      { label: "FAQ", href: paths.section("faq") },
      { label: "Contact", href: paths.contact },
    ],
  },
  hero: {
    titleLine1: "Run Your Entire Business from",
    titleHighlight: "One ERP",
    subheading:
      "DigitalManager helps you automate accounts, inventory, sales, HR, payroll, and industry workflows with ease.",
    primaryCta: { label: "Book a demo", href: paths.contact },
    secondaryCta: { label: "View modules", href: paths.section("modules") },
    trustBadges: ["SOC-style controls", "Role-based access", "Audit-friendly logs"],
  },
  trustedBy: {
    title: "Trusted by companies",
    subtitle: "Names shown are illustrative for this static demo.",
    names: ["Northwind Traders", "Contoso Retail", "Fabrikam Mills", "Adventure Works", "Litware Logistics", "Wide World Importers"],
  },
  statsEyebrow: "Impact",
  about: {
    id: "about",
    eyebrow: "About us",
    title: "Built for operators, loved by finance",
    paragraphs: [
      "DigitalManager brings accounts, inventory, payroll, and customer workflows into one coherent ERP experience—so leaders see cash, stock, and people in the same frame.",
      "This marketing build is fully static: no database, no backend, and no API calls. It is production-ready for hosting on any CDN or static file host.",
    ],
    bullets: ["Composable modules", "Industry-aware defaults", "Implementation partners available"],
  },
  features: {
    id: "features",
    eyebrow: "Platform",
    title: "Everything connected, nothing duplicated",
    subtitle: "Replace brittle spreadsheets and disconnected tools with one operating layer for your business.",
    items: [
      {
        title: "Unified ledger",
        description: "Post once from POS, payroll, or inventory—your trial balance stays honest.",
        icon: "ledger",
      },
      {
        title: "Live inventory",
        description: "Transfers, adjustments, and costing methods with clear ownership at every branch.",
        icon: "inventory",
      },
      {
        title: "People & payroll",
        description: "Attendance, shifts, loans, and statutory outputs without re-keying into finance.",
        icon: "people",
      },
      {
        title: "Customer clarity",
        description: "Orders, service, and receivables aligned so teams stop arguing about the same numbers.",
        icon: "crm",
      },
    ],
  },
  midCta: {
    id: "mid-cta",
    title: "See DigitalManager on your data model",
    subtitle: "Walk through modules, industries, and reporting paths with a solutions engineer.",
    primary: { label: "Schedule a demo", href: paths.contact },
    secondary: { label: "Browse industries", href: paths.section("industries") },
  },
  finalCta: {
    title: "Ready to simplify how you run the business?",
    subtitle: "Start with a focused pilot, expand by module, and keep your teams on one system.",
    primary: { label: "Contact sales", href: paths.contact },
  },
  testimonials: {
    title: "What teams say",
    subtitle: "Quotes are representative for this static demo.",
    items: [
      {
        quote: "We finally stopped reconciling three systems every weekend. Finance and ops finally match.",
        name: "Ayesha Khan",
        role: "CFO, regional retail chain",
      },
      {
        quote: "Inventory truth improved overnight once POS and warehouses shared the same rules.",
        name: "Omar Siddiqui",
        role: "Head of Operations, distributor",
      },
      {
        quote: "Payroll exceptions are visible before month-end. That alone saved us days.",
        name: "Sana Malik",
        role: "HR Director, manufacturing",
      },
    ],
  },
  contactPage: {
    title: "Book a demo",
    subtitle: "Tell us what you run today. This form is static—it shows a success message only.",
    successTitle: "Thanks — you are all set",
    successBody: "In a live deployment this would route to our team. Here, nothing is stored or transmitted.",
    form: {
      nameLabel: "Full name",
      emailLabel: "Work email",
      companyLabel: "Company",
      messageLabel: "What should we cover?",
      submitLabel: "Request demo",
    },
  },
  footer: {
    tagline: "Modern ERP for growing businesses.",
    columns: [
      {
        title: "Product",
        links: [
          { label: "Modules", href: paths.section("modules") },
          { label: "Industries", href: paths.section("industries") },
          { label: "Features", href: paths.section("features") },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About", href: paths.section("about") },
          { label: "FAQ", href: paths.section("faq") },
          { label: "Contact", href: paths.contact },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy (demo)", href: "#" },
          { label: "Terms (demo)", href: "#" },
        ],
      },
    ],
    copyright: "© {year} DigitalManager. Static demo.",
  },
};
