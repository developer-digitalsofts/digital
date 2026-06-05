export const industriesSection = {
  id: "industries",
  title: "Software by Industries",
  subtitle:
    "Pre-configured workflows and reporting patterns tuned for how each sector actually operates day to day.",
  cards: [
    { title: "Retail & wholesale", slug: "retail", description: "Multi-branch stock, promotions, and POS with finance in sync.", accent: "#ea580c" },
    { title: "Textile & apparel", slug: "textile", description: "Shade lots, bundles, and season planning with costing clarity.", accent: "#be185d" },
    { title: "Manufacturing", slug: "manufacturing", description: "BOM, WIP, overhead, and shop-floor phases tied to inventory.", accent: "#0ea5e9" },
    { title: "Distribution", slug: "distribution", description: "Route planning, van sales, and credit control across territories.", accent: "#22c55e" },
    { title: "Services", slug: "services", description: "Projects, retainers, timesheets, and billing without spreadsheet chaos.", accent: "#6366f1" },
    { title: "Construction", slug: "construction", description: "Job costing, subcontractors, retention, and progress billing.", accent: "#78716c" },
    {
      title: "Petrol station",
      slug: "petrol-station",
      description: "Shift sales, wet-stock variance, pump reconciliation, and forecourt retail with head-office control.",
      accent: "#15803d",
    },
  ],
};

export const industryPages = {
  retail: {
    title: "Retail & wholesale ERP",
    intro: "Unify branches, warehouses, and lanes so merchandising, finance, and operations share one source of truth.",
    bullets: ["Multi-location inventory with transfers", "Promotions and price lists by channel", "Credit limits and collections visibility"],
  },
  textile: {
    title: "Textile & apparel ERP",
    intro: "Track lots, shades, and bundles from procurement through cutting room to dispatch with margin clarity.",
    bullets: ["Lot and shade traceability", "Seasonal assortment planning hooks", "Integrated production and stock"],
  },
  manufacturing: {
    title: "Manufacturing ERP",
    intro: "Plan capacity, absorb overheads, and close batches with BOM versioning and real-time WIP visibility.",
    bullets: ["BOM revisions and scrap reasons", "Routing and work center load", "Standard vs actual costing views"],
  },
  distribution: {
    title: "Distribution ERP",
    intro: "Move stock efficiently across territories with van sales, route sheets, and disciplined credit policies.",
    bullets: ["Route and beat planning", "Van stock and settlement", "AR aging by salesman or region"],
  },
  services: {
    title: "Professional services ERP",
    intro: "Run projects and retainers with timesheets, milestones, and invoicing aligned to delivery and finance.",
    bullets: ["Project budgets vs actuals", "Retainer burn-down", "Service tickets linked to billing"],
  },
  construction: {
    title: "Construction ERP",
    intro: "Job costing, subcontractors, retention, and progress claims in one ledger-friendly structure.",
    bullets: ["WIP and retention registers", "Subcontractor certificates", "Site-wise P&L snapshots"],
  },
  "petrol-station": {
    title: "Petrol station & forecourt ERP",
    intro:
      "Run shifts, nozzles, tanks, and shop sales in one flow—so wet-stock dips, cashier variances, and card batches reconcile without spreadsheet gymnastics.",
    bullets: ["Tank dips, deliveries, and variance alerts", "Shift-wise cashier and POS control", "Head-office pricing, credit limits, and compliance exports"],
  },
};
