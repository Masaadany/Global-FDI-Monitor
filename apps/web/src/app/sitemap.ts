import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://fdimonitor.org';
  const now = new Date();

  const staticPages = [
    { url: base, priority: 1.0, changeFrequency: 'daily' as const },
    { url: `${base}/dashboard`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${base}/investment-analysis`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${base}/signals`, priority: 0.9, changeFrequency: 'daily' as const },
    { url: `${base}/gfr`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${base}/sectors`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${base}/reports`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${base}/publications`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${base}/pmp`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${base}/pricing`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${base}/about`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${base}/contact`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${base}/sources`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${base}/api-docs`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${base}/sectors`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${base}/corridors`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${base}/watchlists`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${base}/faq`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${base}/insights`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${base}/pipeline`, priority: 0.7, changeFrequency: 'weekly' as const },
    { url: `${base}/scenario-planner`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${base}/settings`, priority: 0.4, changeFrequency: 'monthly' as const },
    { url: `${base}/alerts`, priority: 0.5, changeFrequency: 'daily' as const },
    { url: `${base}/onboarding`, priority: 0.6, changeFrequency: 'monthly' as const },
    { url: `${base}/register`, priority: 0.8, changeFrequency: 'monthly' as const },
    { url: `${base}/terms`, priority: 0.4, changeFrequency: 'yearly' as const },
    { url: `${base}/privacy`, priority: 0.4, changeFrequency: 'yearly' as const },
  ];

  const countryIds = ['SGP','MYS','THA','VNM','ARE','SAU','IND','IDN','BRA','MAR','DNK','CHE','NLD','KOR','NZL','GBR','DEU','USA','JPN','CAN','AUS','FRA','CHN'];
  const countryPages = countryIds.map(id => ({
    url: `${base}/country/${id}`,
    priority: 0.8,
    changeFrequency: 'weekly' as const,
    lastModified: now,
  }));

  return [...staticPages.map(p => ({ ...p, lastModified: now })), ...countryPages];
}
