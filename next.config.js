/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true }, // চাইলে এটা বাদ দিতে পারো
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE}/api/:path*`,
      },
    ];
  },
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
