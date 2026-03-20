import type { MetadataRoute } from 'next';
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://fdimonitor.org';
  const now  = new Date().toISOString();
  return [
    {url:`${base}/`,lastModified:now,changeFrequency:'daily',priority:1.0},
    {url:`${base}/demo`,lastModified:now,changeFrequency:'weekly',priority:0.9},
    {url:`${base}/about`,lastModified:now,changeFrequency:'weekly',priority:0.6},
    {url:`${base}/contact`,lastModified:now,changeFrequency:'weekly',priority:0.6},

    {url:`${base}/country/ARE`,lastModified:now,changeFrequency:'weekly' as const,priority:0.8},
    {url:`${base}/country/SAU`,lastModified:now,changeFrequency:'weekly' as const,priority:0.8},
    {url:`${base}/country/IND`,lastModified:now,changeFrequency:'weekly' as const,priority:0.8},
    {url:`${base}/country/SGP`,lastModified:now,changeFrequency:'weekly' as const,priority:0.8},

    {url:`${base}/market-signals`,lastModified:now,changeFrequency:'weekly' as const,priority:0.5},

    {url:`${base}/gfr/methodology`,lastModified:now,changeFrequency:'monthly' as const,priority:0.8},

    {url:`${base}/fic/credits`,lastModified:now,changeFrequency:'monthly' as const,priority:0.6},

    {url:`${base}/api-docs`,lastModified:now,changeFrequency:'monthly' as const,priority:0.7},
    {url:`${base}/subscription`,lastModified:now,changeFrequency:'weekly',priority:0.9},
    {url:`${base}/pricing`,lastModified:now,changeFrequency:'weekly',priority:0.9},
    {url:`${base}/register`,lastModified:now,changeFrequency:'weekly',priority:0.9},
    {url:`${base}/privacy`,lastModified:now,changeFrequency:'weekly',priority:0.5},
    {url:`${base}/terms`,lastModified:now,changeFrequency:'weekly',priority:0.5},
    {url:`${base}/dashboard`,lastModified:now,changeFrequency:'daily',priority:0.5},
    {url:`${base}/signals`,lastModified:now,changeFrequency:'daily',priority:0.9},
    {url:`${base}/gfr`,lastModified:now,changeFrequency:'daily',priority:0.9},
    {url:`${base}/analytics`,lastModified:now,changeFrequency:'daily',priority:0.5},
    {url:`${base}/reports`,lastModified:now,changeFrequency:'weekly',priority:0.5},
    {url:`${base}/pmp`,lastModified:now,changeFrequency:'weekly',priority:0.5},
    {url:`${base}/forecast`,lastModified:now,changeFrequency:'weekly',priority:0.5},
    {url:`${base}/investment-pipeline`,lastModified:now,changeFrequency:'weekly',priority:0.5},
    {url:`${base}/company-profiles`,lastModified:now,changeFrequency:'weekly',priority:0.5},
    {url:`${base}/market-insights`,lastModified:now,changeFrequency:'weekly',priority:0.5},
    {url:`${base}/watchlists`,lastModified:now,changeFrequency:'weekly',priority:0.5},
    {url:`${base}/alerts`,lastModified:now,changeFrequency:'weekly',priority:0.5},
    {url:`${base}/benchmarking`,lastModified:now,changeFrequency:'weekly',priority:0.5},
    {url:`${base}/scenario-planner`,lastModified:now,changeFrequency:'weekly',priority:0.5},
    {url:`${base}/corridor-intelligence`,lastModified:now,changeFrequency:'weekly',priority:0.5},
    {url:`${base}/sectors`,lastModified:now,changeFrequency:'weekly',priority:0.5},
    {url:`${base}/publications`,lastModified:now,changeFrequency:'weekly',priority:0.5},
    {url:`${base}/settings`,lastModified:now,changeFrequency:'weekly',priority:0.5},
    {url:`${base}/fic`,lastModified:now,changeFrequency:'weekly',priority:0.5},
    {url:`${base}/admin`,lastModified:now,changeFrequency:'weekly',priority:0.5},
    {url:`${base}/health`,lastModified:now,changeFrequency:'weekly',priority:0.6},
    {url:`${base}/onboarding`,lastModified:now,changeFrequency:'weekly',priority:0.5},
    {url:`${base}/auth/login`,lastModified:now,changeFrequency:'weekly',priority:0.5},
    {url:`${base}/auth/reset`,lastModified:now,changeFrequency:'weekly',priority:0.5},
    {url:`${base}/ar`,lastModified:now,changeFrequency:'weekly',priority:0.5},
    {url:`${base}/fic/success`,lastModified:now,changeFrequency:'weekly',priority:0.5},
    {url:`${base}/dashboard/success`,lastModified:now,changeFrequency:'weekly',priority:0.5},
  ];
}
