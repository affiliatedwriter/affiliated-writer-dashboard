/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/settings', destination: '/admin/settings', permanent: true },
      { source: '/prompt-templates', destination: '/admin/prompt-templates', permanent: true },
      { source: '/feature-flags', destination: '/admin/feature-flags', permanent: true },
      { source: '/credits', destination: '/admin/credits', permanent: true },
    ];
  },
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [{ source: '/api/:path*', destination: 'http://localhost:8000/api/:path*' }];
    }
    return [];
  },
};
module.exports = nextConfig;
