import type { Metadata } from 'next';
import GlobalSearch from '@/components/GlobalSearch';
import MobileNav from '@/components/MobileNav';
import Link from 'next/link';
import './globals.css';
import { PreviewGate } from '@/components/PreviewGate';


export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#0A2540',
};

export const metadata: Metadata = {
  title:       { template: '%s | Global FDI Monitor', default: 'Global FDI Monitor — World\'s First Integrated FDI Intelligence Platform' },
  description: 'Live FDI signals, GFR rankings, custom reports and mission planning across 215 economies. Powered by 50 AI agents and 3,000+ data sources.',
  keywords:    'FDI intelligence, investment monitor, global FDI, investment signals, GFR ranking, investment promotion',
  metadataBase: new URL('https://fdimonitor.org'),
  openGraph: {
    title:       'Global FDI Monitor',
    description: 'Live global investment intelligence across 215 economies',
    url:         'https://fdimonitor.org',
    siteName:    'Global FDI Monitor',
    type:        'website',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Global FDI Monitor',
    description: 'Live global investment intelligence across 215 economies',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <PreviewGate>
          <SiteNav />
  
        <script dangerouslySetInnerHTML={{__html: `
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js').catch(() => {});
            });
          }
        `}}/>
        {children}
          <CookieConsent/>
        </PreviewGate>
      </body>
    </html>
  );
}

function SiteNav() {
  return (
    <nav className="bg-white border-b border-slate-100 px-4 py-2.5 flex items-center gap-3 sticky top-0 z-40 shadow-sm">
      <a href="/" className="font-black text-[#0A2540] text-sm flex items-center gap-2 flex-shrink-0">
        <span className="w-7 h-7 bg-[#0A2540] rounded-lg text-white text-xs flex items-center justify-center font-black">G</span>
        <span className="hidden sm:inline">GFM</span>
      </a>
      {/* Desktop nav - scrollable */}
      <div className="hidden md:flex gap-0.5 overflow-x-auto flex-1 scrollbar-hide">
        {[
          ['/dashboard',       'Dashboard'],
          ['/signals',         'Signals'],
          ['/gfr',             'GFR'],
          ['/analytics',       'Analytics'],
          ['/reports',         'Reports'],
          ['/pmp',             'Mission'],
          ['/forecast',        'Forecast'],
          ['/investment-pipeline','Pipeline'],
          ['/company-profiles','Companies'],
          ['/market-insights', 'Insights'],
          ['/watchlists',      'Watchlists'],
          ['/benchmarking',    'Benchmark'],
          ['/sectors',         'Sectors'],
          ['/corridor-intelligence','Corridors'],
        ].map(([href,label]) => (
          <Link key={href} href={href}
            className="text-xs font-semibold text-slate-500 hover:text-[#0A2540] hover:bg-slate-50 transition-colors px-2.5 py-1.5 rounded-lg whitespace-nowrap flex-shrink-0">
            {label}
          </Link>
        ))}
      </div>
      {/* Right side */}
      <div className="ml-auto flex items-center gap-2">
        <GlobalSearch/>
        <Link href="/pricing"     className="hidden md:block text-xs font-semibold text-slate-400 hover:text-slate-600 px-2 py-1.5 rounded-lg">Pricing</Link>
        <Link href="/auth/login"  className="hidden md:block text-xs font-semibold text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg hover:border-blue-300 transition-colors">Sign In</Link>
        <Link href="/register"    className="text-xs font-black text-white bg-[#0A2540] px-3 py-1.5 rounded-lg hover:bg-[#1D4ED8] transition-colors">Free Trial</Link>
        <MobileNav/>
      </div>
    </nav>
  );
}
