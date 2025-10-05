/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/credits',          destination: '/admin/credits',          permanent: false },
      { source: '/settings',         destination: '/admin/settings',         permanent: false },
      { source: '/feature-flags',    destination: '/admin/feature-flags',    permanent: false },
      { source: '/prompt-templates', destination: '/admin/prompt-templates', permanent: false },
    ];
  },
};

module.exports = nextConfig;
