import type { Metadata } from 'next';
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
    <html lang="en">
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
    <nav className="h-14 bg-white border-b border-slate-100 flex items-center gap-0 px-4 sticky top-0 z-50 shadow-sm">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mr-7 flex-shrink-0">
        <div className="w-8 h-8 bg-[#0A2540] rounded-lg flex items-center justify-center text-white font-black text-sm">
          G
        </div>
        <span className="font-black text-[#0A2540] text-[15px]">
          Global <span className="text-[#1D4ED8]">FDI</span> Monitor
        </span>
      </Link>

      {/* Nav items */}
      <div className="flex gap-0.5 flex-1 overflow-x-auto scrollbar-none">
        {NAV_ITEMS.map(item => (
          <Link key={item.href} href={item.href}
            className="px-3 py-1.5 rounded-md text-xs font-semibold text-slate-500 hover:bg-blue-50 hover:text-blue-700 transition-all whitespace-nowrap">
            {item.label}
          </Link>
        ))}
      </div>

      {/* Right actions */}
      <div className="flex gap-2 items-center ml-auto pl-4">
        <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-2.5 py-1 rounded-full text-xs font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live
        </div>
        <Link href="/pricing"
              className="text-xs font-semibold text-slate-500 hover:text-[#0A2540] transition-colors">Pricing</Link>
            <Link href="/about"
              className="text-xs font-semibold text-slate-500 hover:text-[#0A2540] transition-colors">About</Link>
            <Link href="/contact"
          className="border border-slate-200 text-slate-600 text-xs font-semibold px-4 py-1.5 rounded-md hover:border-blue-300 hover:text-blue-700 transition-all">
          Free Trial
        </Link>
        <Link href="/register"
          className="bg-[#1D4ED8] text-white text-xs font-bold px-4 py-1.5 rounded-md hover:bg-blue-700 transition-colors">
          Subscribe
        </Link>
      </div>
    </nav>
  );
}

const NAV_ITEMS = [
  { href: '/dashboard',   label: 'Dashboard' },
  { href: '/signals',     label: 'Market Signals' },
  { href: '/forecast',    label: 'Forecast & Outlook' },
  { href: '/gfr',         label: 'GFR Ranking' },
  { href: '/reports',     label: 'Custom Reports' },
  { href: '/pmp',         label: 'Mission Planning' },
  { href: '/publications',label: 'Publications' },
  { href: '/sources',     label: 'Data Sources' },
  { href: '/pricing',     label: 'Pricing' },
];
