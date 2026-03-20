/**
 * GFM SEO Utilities
 * Generates per-page metadata for Next.js 14+
 */
import type { Metadata } from 'next';

const BASE_URL  = 'https://fdimonitor.org';
const SITE_NAME = 'Global FDI Monitor';
const TWITTER   = '@fdimonitor';

export function generateMetadata(opts: {
  title:       string;
  description: string;
  path?:       string;
  image?:      string;
  noIndex?:    boolean;
}): Metadata {
  const url   = `${BASE_URL}${opts.path || '/'}`;
  const image = opts.image || `${BASE_URL}/og-default.svg`;

  return {
    title:       `${opts.title} | ${SITE_NAME}`,
    description: opts.description,
    metadataBase: new URL(BASE_URL),
    alternates:  { canonical: url },
    robots: opts.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      title:       opts.title,
      description: opts.description,
      url,
      siteName:    SITE_NAME,
      type:        'website',
      images:      [{ url: image, width: 1200, height: 630, alt: opts.title }],
    },
    twitter: {
      card:        'summary_large_image',
      title:       opts.title,
      description: opts.description,
      site:        TWITTER,
      images:      [image],
    },
  };
}

// Pre-built metadata for key pages
export const PAGE_META = {
  home:      generateMetadata({ title: 'Real-Time FDI Intelligence Platform', description: 'The world\'s most comprehensive FDI intelligence platform. 215 economies, real-time signals, GFR rankings, AI-powered reports. From $899/month.', path: '/' }),
  signals:   generateMetadata({ title: 'Live FDI Signals', description: 'Monitor 218+ live FDI signals across 215 economies. PLATINUM to BRONZE grades. Filter by country, sector, and type.', path: '/signals' }),
  gfr:       generateMetadata({ title: 'Global Future Readiness Rankings', description: 'GFR composite rankings for 215 economies. 6 core dimensions, 6 proprietary factors, quarterly update.', path: '/gfr' }),
  dashboard: generateMetadata({ title: 'Dashboard', description: 'Your GFM intelligence dashboard.', path: '/dashboard', noIndex: true }),
  demo:      generateMetadata({ title: 'Platform Demo', description: 'Preview GFM live — signals, maps, and analytics. No login required.', path: '/demo' }),
  pricing:   generateMetadata({ title: 'Pricing', description: 'Professional FDI intelligence from $799/month. 3-day free trial included.', path: '/pricing' }),
};

export const OG_IMAGE = {
  url:    'https://fdimonitor.org/og-image.png',
  width:  1200,
  height: 630,
  alt:    'Global FDI Monitor — Real-Time FDI Intelligence',
};

export const SITE_CONFIG = {
  name:        'Global FDI Monitor',
  url:         'https://fdimonitor.org',
  description: 'The world\'s first fully integrated FDI intelligence platform. 215 economies, real-time signals, GFR rankings.',
  twitter:     '@fdimonitor',
  locale:      'en_US',
};
