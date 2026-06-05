export const modulesSection = {
  id: "modules",
  title: "Software by Module",
  subtitle:
    "Composable capabilities that connect finance, operations, and customer touchpoints in one coherent system.",
  cards: [
    {
      title: "Accounts",
      slug: "accounts",
      description:
        "Receivables, payables, ledger, trial balance, P&L, balance sheet, and cash flow with audit-ready reporting.",
      accent: "#e68a5c",
      badge: "Financial core",
    },
    {
      title: "Production",
      slug: "production",
      description: "BOM assembly, costing, overhead, operations, and phased visibility across the shop floor.",
      accent: "#22d3ee",
      badge: "BOM · WIP · Costing",
    },
    {
      title: "Point of sale",
      slug: "pos",
      description: "Barcode sales, purchases, returns, cash register, and X/Y reporting for busy retail lanes.",
      accent: "#a855f7",
      badge: "Lanes · Shifts · Returns",
    },
    {
      title: "FBR integration",
      slug: "fbr-pos",
      description: "POS integration and compliance workflows aligned with regulatory reporting requirements.",
      accent: "#991b1b",
      badge: "Compliance pulse",
    },
    {
      title: "Inventory",
      slug: "inventory",
      description: "Requisitions, inward/outward, valuation, aging, costing, and automated reorder signals.",
      accent: "#ec4899",
      badge: "Stock truth",
    },
    {
      title: "Payroll",
      slug: "payroll",
      description: "Attendance, overtime, advances, salary sheets, slips, and statutory compliance in one place.",
      accent: "#be123c",
      badge: "HR · Statutory",
    },
    {
      title: "Integration",
      slug: "integration",
      description: "Connect POS, SMS, payments, and third-party services with monitored, reliable pipelines.",
      accent: "#22c55e",
      badge: "Connected stack",
    },
    {
      title: "CRM",
      slug: "crm",
      description:
        "Pipeline, accounts, activities, and service touchpoints aligned with your finance and delivery teams.",
      accent: "#1e3a8a",
      badge: "Pipeline · Service",
    },
  ],
};

export const modulePages = {
  accounts: {
    title: "Accounts management software",
    intro:
      "A complete financial core for receivables, payables, taxation, and management reporting—designed for multi-branch and multi-entity operations.",
    bullets: [
      "Multi-currency and multi-company ledgers",
      "Aging, budgeting, and cash-flow views",
      "Role-based approvals and audit trails",
    ],
  },
  production: {
    title: "Production management software",
    intro: "Plan BOMs, track WIP, absorb overheads, and close batches with clarity from raw material to finished goods.",
    bullets: ["BOM versioning and scrap tracking", "Shop-floor phases and capacity", "Integrated inventory and costing"],
  },
  pos: {
    title: "Point of sale management software",
    intro:
      "Fast, reliable POS for retail lanes with barcode control, returns, shifts, and tight integration to inventory and accounts.",
    bullets: ["Offline-tolerant lanes where required", "Promotions, bundles, and price lists", "Real-time stock and margin signals"],
  },
  "fbr-pos": {
    title: "FBR (POS) integration software",
    intro: "Align invoicing and POS events with regulatory workflows while keeping operations smooth for cashiers and finance.",
    bullets: ["Configurable posting templates", "Exception queues for reviewers", "Reconciliation-friendly exports"],
  },
  inventory: {
    title: "Inventory management software",
    intro: "Control stock across warehouses, transfers, reorders, and valuation methods with full traceability.",
    bullets: ["Lots, serials, and batches where needed", "Min/max and safety stock policies", "Integrated with sales and production"],
  },
  payroll: {
    title: "Payroll management software",
    intro: "Pay people accurately and on time—attendance, shifts, loans, statutory deductions, and payslips in one place.",
    bullets: ["Biometric and roster integrations", "Overtime and allowance rules", "Bank file and compliance outputs"],
  },
  integration: {
    title: "Integration system",
    intro: "Connect SMS gateways, payments, e-commerce, and partner APIs with monitoring, retries, and clear ownership of data flows.",
    bullets: ["Event-driven connectors", "Secure credentials and rotation", "Operational dashboards for IT teams"],
  },
  crm: {
    title: "CRM software",
    intro: "Pipeline, accounts, and service history aligned with orders and finance so teams see one customer truth.",
    bullets: ["Activities, tasks, and SLAs", "Quotes tied to inventory availability", "Service tickets linked to billing"],
  },
};
