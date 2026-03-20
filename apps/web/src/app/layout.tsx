import type { Metadata } from 'next';
import './globals.css';
import { TrialProvider } from '@/lib/trialContext';
import JsonLd from '@/components/JsonLd';
import CookieConsent from '@/components/CookieConsent';
import TrialGateWrapper from '@/components/TrialGateWrapper';

export const metadata: Metadata = {
  title: { default:'Global FDI Monitor', template:'%s — Global FDI Monitor' },
  description:'The global standard for foreign direct investment intelligence. Real-time signals, GFR rankings for 215 economies, AI-powered reports, and mission planning.',
  keywords:['FDI','investment intelligence','GFR ranking','investment monitor','signal confidence'],
  authors:[{name:'Global FDI Monitor',url:'https://fdimonitor.org'}],
  openGraph:{
    title:'Global FDI Monitor',
    description:'Real-time FDI intelligence. GFR rankings for 215 economies, live signals, AI reports.',
    url:'https://fdimonitor.org',
    siteName:'Global FDI Monitor',
    type:'website',
    images:[{url:'https://fdimonitor.org/og-image.svg',width:1200,height:630}],
  },
  twitter:{card:'summary_large_image',title:'Global FDI Monitor'},
  icons:{icon:'/favicon.svg',apple:'/apple-touch-icon.svg'},
  manifest:'/manifest.json',
  robots:{index:true,follow:true},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <JsonLd/>
        <TrialProvider>
          <TrialGateWrapper>
            {children}
          </TrialGateWrapper>
        </TrialProvider>
        <CookieConsent/>
      </body>
    </html>
  );
}
