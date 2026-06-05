/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async redirects() {
    return [
      { source: "/contact", destination: "/en/contact", permanent: false },
      { source: "/modules/:slug", destination: "/en/modules/:slug", permanent: false },
      { source: "/industries/:slug", destination: "/en/industries/:slug", permanent: false },
    ];
  },
};

export default nextConfig;
