import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://samadhan-for-us.vercel.app';
  const routes = ['', '/challenges', '/challenges/map', '/collaborate', '/solutions', '/university', '/industry', '/government', '/impact', '/search'];
  return routes.map((route) => ({ url: `${base}${route}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: route === '' ? 1 : 0.7 }));
}
