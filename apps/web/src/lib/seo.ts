/**
 * GFM SEO Utilities
 * Per-page metadata with OpenGraph + Twitter cards
 */
import type { Metadata } from 'next';

const BASE_URL  = 'https://fdimonitor.org';
const SITE_NAME = 'Global FDI Monitor';
const DEFAULT_DESC = "World's first fully integrated FDI intelligence platform. Live signals, GFR rankings, and AI-powered reports across 215 economies.";

export function buildMetadata(opts: {
  title:        string;
  description?: string;
  path?:        string;
  image?:       string;
  noIndex?:     boolean;
}): Metadata {
  const { title, description = DEFAULT_DESC, path = '/', image, noIndex } = opts;
  const url    = `${BASE_URL}${path}`;
  const ogImg  = image || `${BASE_URL}/og-default.png`;

  return {
    title:       `${title} — ${SITE_NAME}`,
    description,
    metadataBase: new URL(BASE_URL),
    alternates:  { canonical: url },
    openGraph: {
      title:       `${title} — ${SITE_NAME}`,
      description,
      url,
      siteName:    SITE_NAME,
      locale:      'en_US',
      type:        'website',
      images: [{ url: ogImg, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card:        'summary_large_image',
      title:       `${title} — ${SITE_NAME}`,
      description,
      images:      [ogImg],
      creator:     '@fdimonitor',
    },
    robots: noIndex ? { index:false, follow:false } : { index:true, follow:true },
    keywords: [
      'FDI intelligence','investment monitoring','global investment',
      'IPA intelligence','investment promotion','GFR ranking',
      'FDI signals','foreign direct investment','investment platform',
    ].join(', '),
  };
}

// Per-page SEO configurations
export const PAGE_SEO = {
  home: buildMetadata({
    title: "World's First Fully Integrated FDI Intelligence Platform",
    description: "Live investment signals, GFR rankings, AI-powered reports across 215 economies. Powered by IMF, World Bank, UNCTAD, OECD data.",
    path: '/',
  }),
  gfr: buildMetadata({
    title: 'Global Future Readiness Rankings — 215 Economies',
    description: 'GFR composite rankings across 6 dimensions: Macro, Policy, Digital, Human Capital, Infrastructure, Sustainability. Q1 2026 update.',
    path: '/gfr',
  }),
  signals: buildMetadata({
    title: 'Live FDI Signal Monitor — Real-Time Investment Intelligence',
    description: 'Real-time Platinum, Gold, Silver investment signals from 215 economies. SHA-256 verified, 2-second updates.',
    path: '/signals',
  }),
  pricing: buildMetadata({
    title: 'Pricing — From $899/month',
    description: 'Professional plan $899/month. Enterprise from $29,500/year. 3-day free trial with 5 FIC credits.',
    path: '/pricing',
  }),
  reports: buildMetadata({
    title: 'Custom Intelligence Reports — 10 AI-Powered Types',
    description: 'Generate Country Economic Profiles, Sector Intelligence, Mission Dossiers. Z3 verified, SHA-256 provenance.',
    path: '/reports',
  }),
  about: buildMetadata({
    title: 'About — Methodology & Data Sources',
    description: 'GFR methodology, 14 authoritative data sources, Z3 verification layer, and the team behind Global FDI Monitor.',
    path: '/about',
  }),
  analytics: buildMetadata({
    title: '4D Analytics — FDI Intelligence Globe 2015–2030',
    description: 'Interactive 4D globe with investment flow particles, heatmaps, and live signal stream.',
    path: '/analytics',
  }),
};
