/** English locale prefix — matches legacy URLs like /en/industries/petrol-station */
export const paths = {
  home: "/en",
  contact: "/en/contact",
  module: (slug) => `/en/modules/${slug}`,
  industry: (slug) => `/en/industries/${slug}`,
  /** e.g. section("modules") -> /en#modules */
  section: (id) => `/en#${id.replace(/^#/, "")}`,
};
