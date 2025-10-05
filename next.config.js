/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/settings', destination: '/admin/settings', permanent: false },
      { source: '/prompt-templates', destination: '/admin/prompt-templates', permanent: false },
      { source: '/feature-flags', destination: '/admin/feature-flags', permanent: false },
      { source: '/credits-manager', destination: '/admin/credits', permanent: false },
    ];
  },
};

module.exports = nextConfig;
