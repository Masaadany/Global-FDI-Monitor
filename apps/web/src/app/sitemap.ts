import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://fdimonitor.org';
  const routes = [
    '','/dashboard','/signals','/gfr','/analytics','/reports',
    '/pmp','/forecast','/investment-pipeline','/company-profiles',
    '/market-insights','/watchlists','/alerts','/publications',
    '/benchmarking','/scenario-planner','/corridor-intelligence',
    '/pricing','/about','/contact','/register','/auth/login','/fic',
  ];
  return routes.map(route => ({
    url: `${base}${route}`,
    lastModified: new Date('2026-03-17'),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1.0 : route.startsWith('/dashboard') ? 0.9 : 0.7,
  }));
}
