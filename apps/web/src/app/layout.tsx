import type { Metadata } from 'next';
import type { Viewport } from 'next';
import { PreviewGate } from '@/components/PreviewGate';

import Link from 'next/link';
import './globals.css';



export const metadata: Metadata = {
  title: { template: '%s | Global FDI Monitor', default: 'Global FDI Monitor' },
  description: 'World\'s first fully integrated global investment and trade intelligence platform.',
  metadataBase: new URL('https://fdimonitor.org'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <PreviewGate>
          <SiteNav />
          {children}
        </PreviewGate>
      </body>
    </html>
  );
}

function SiteNav() {
  return (
    <nav className="bg-white border-b border-slate-100 px-5 py-3 flex items-center gap-4 sticky top-0 z-40 shadow-sm">
      <a href="/" className="font-black text-[#0A2540] text-sm flex items-center gap-2">
        <span className="w-6 h-6 bg-[#0A2540] rounded text-white text-xs flex items-center justify-center font-black">G</span>
        GFM
      </a>
      <div className="flex gap-0.5 flex-wrap ml-2">
        {[
          ['/dashboard',      'Dashboard'],
          ['/signals',        'Signals'],
          ['/gfr',            'GFR'],
          ['/analytics',      'Analytics'],
          ['/reports',        'Reports'],
          ['/pmp',            'Mission'],
          ['/forecast',       'Forecast'],
          ['/investment-pipeline','Pipeline'],
          ['/company-profiles','Companies'],
          ['/market-insights','Insights'],
          ['/watchlists',     'Watchlists'],
        ].map(([href,label]) => (
          <Link key={href} href={href}
            className="text-xs font-semibold text-slate-500 hover:text-[#0A2540] hover:bg-slate-50 transition-colors px-2.5 py-1.5 rounded-lg">
            {label}
          </Link>
        ))}
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Link href="/pricing" className="text-xs font-semibold text-slate-500 hover:text-[#0A2540] px-2.5 py-1.5 rounded-lg">
          Pricing
        </Link>
        <Link href="/auth/login" className="text-xs font-semibold text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg hover:border-blue-300 transition-colors">
          Sign In
        </Link>
        <Link href="/register" className="text-xs font-black text-white bg-[#0A2540] px-3 py-1.5 rounded-lg hover:bg-[#1D4ED8] transition-colors">
          Free Trial
        </Link>
      </div>
    </nav>
  );
}
