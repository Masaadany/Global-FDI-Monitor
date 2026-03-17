import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { PreviewGate }       from '@/components/PreviewGate';
import { CookieConsent }     from '@/components/CookieConsent';
import { ToastProvider }     from '@/components/Toast';
import GlobalSearch          from '@/components/GlobalSearch';
import MobileNav             from '@/components/MobileNav';
import LiveTicker            from '@/components/LiveTicker';
import NotificationBell      from '@/components/NotificationBell';
import LanguageSelector      from '@/components/LanguageSelector';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A2540',
};

export const metadata: Metadata = {
  title: {
    default:  'Global FDI Monitor — Real-Time Investment Intelligence',
    template: '%s | Global FDI Monitor',
  },
  description: 'Real-time FDI signals, GFR rankings, and AI-powered reports across 215 economies. Powered by IMF, World Bank, UNCTAD, OECD.',
  metadataBase: new URL('https://fdimonitor.org'),
  icons: { icon: '/favicon.svg', apple: '/apple-touch-icon.svg' },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website', siteName: 'Global FDI Monitor',
    images: [{ url: '/og-default.svg', width: 1200, height: 630 }],
  },
};

const NAV_ITEMS = [
  { href:'/dashboard',            label:'Dashboard'    },
  { href:'/signals',              label:'Signals'      },
  { href:'/gfr',                  label:'GFR Rankings' },
  { href:'/analytics',            label:'Analytics'    },
  { href:'/forecast',             label:'Forecast'     },
  { href:'/pmp',                  label:'Mission'      },
  { href:'/reports',              label:'Reports'      },
  { href:'/publications',         label:'Publications' },
];

function GFMHeader() {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      {/* Top bar */}
      <div className="px-4 lg:px-6 h-14 flex items-center gap-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 mr-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-white text-sm"
            style={{background:'linear-gradient(135deg,#0A2540,#0A66C2)'}}>G</div>
          <div className="hidden sm:block">
            <div className="text-xs font-black text-deep leading-none tracking-tight">GLOBAL FDI</div>
            <div className="text-xs font-bold text-primary leading-none">MONITOR</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-0.5 flex-1 overflow-x-auto scrollbar-none">
          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-primary hover:bg-primary-light rounded-md whitespace-nowrap transition-all">
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          <GlobalSearch/>
          <LanguageSelector/>
          <NotificationBell/>
          <Link href="/auth/login"
            className="hidden md:block text-xs font-semibold text-slate-600 px-3 py-1.5 rounded-md border border-slate-200 hover:border-primary hover:text-primary transition-all">
            Sign In
          </Link>
          <Link href="/register"
            className="text-xs font-bold text-white px-3 py-1.5 rounded-md transition-all"
            style={{background:'var(--primary)'}}>
            Start Free
          </Link>
          <MobileNav/>
        </div>
      </div>
    </header>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{__html:`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
      `}}/>
      </head>
      <body suppressHydrationWarning>
        <ToastProvider>
          <PreviewGate>
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-deep text-white px-4 py-2 rounded-lg z-50 text-xs font-bold">
              Skip to main content
            </a>
            <GFMHeader/>
            <LiveTicker/>
            <main id="main-content">{children}</main>
            <CookieConsent/>
          </PreviewGate>
        </ToastProvider>
        <script dangerouslySetInnerHTML={{__html:`
          if('serviceWorker' in navigator){
            window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}));
          }
        `}}/>
      </body>
    </html>
  );
}
