/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif','image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: '**.vercel.app' }, { protocol: 'https', hostname: '**.onrender.com' }],
  },
};

export default nextConfig;
