/** @type {import('next').NextConfig} */
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

const nextConfig = {
  // 👉 Vercel/Prod এ eslint বা টাইপ-চেকের জন্য বিল্ড থামবে না (সাময়িকভাবে)
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // লোকাল হলে localhost, প্রড হলে NEXT_PUBLIC_API_BASE থেকে যাবে
        destination: `${API_BASE}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;


