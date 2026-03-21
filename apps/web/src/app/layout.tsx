import type { Metadata } from 'next';
import './globals.css';
import AIAssistant from '@/components/AIAssistant';
import CookieConsent from '@/components/CookieConsent';

export const metadata: Metadata = {
  title: 'Global FDI Monitor — Investment Intelligence Platform',
  description: "Global investment intelligence. Real-time. Verified. Smart. GOSA-scored FDI intelligence across 215+ economies.",
  themeColor: '#2ECC71',
  openGraph: {
    title: 'Global FDI Monitor — Investment Intelligence Platform',
    description: 'GOSA-scored FDI intelligence across 215+ economies.',
    url: 'https://fdimonitor.org',
    siteName: 'Global FDI Monitor',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='16' r='14' stroke='%232ECC71' stroke-width='2' fill='none'/><circle cx='22' cy='10' r='4' fill='%232ECC71'/><path d='M20 10 L22 8 L24 10' fill='%232ECC71'/></svg>"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <style>{`html,body{background:#F8F9FA}*{box-sizing:border-box}`}</style>
      </head>
      <body style={{ background: '#F8F9FA', color: '#1A2C3E', minHeight: '100vh' }}>
        {children}
        <AIAssistant/>
        <CookieConsent/>
      </body>
    </html>
  );
}
