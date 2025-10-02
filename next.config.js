/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    // এই অংশটি নিশ্চিত করে যে '/api/...' দিয়ে শুরু হওয়া সব রিকোয়েস্ট
    // আপনার ব্যাকএন্ড সার্ভারে চলে যাবে।
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;