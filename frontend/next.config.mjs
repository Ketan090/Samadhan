/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.vercel.app' },
      { protocol: 'https', hostname: '**.onrender.com' },
    ],
  },
  async rewrites() {
    // Local-first default (like the single-server CivicLens days): a bare
    // `npm run dev` just works. Production MUST set BACKEND_URL to the live
    // backend — localhost:5000 doesn't exist on Vercel.
    const backend = (process.env.BACKEND_URL || 'http://localhost:5000').trim();
    return [
      {
        source: '/api/:path*',
        destination: `${backend}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
