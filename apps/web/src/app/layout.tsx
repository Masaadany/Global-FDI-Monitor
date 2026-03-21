import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Global FDI Monitor — Intelligence Platform',
  description: 'The world\'s most advanced FDI intelligence platform. GOSA-scored investment intelligence across 215+ economies. Real-time signals, GFR rankings, AI-generated reports.',
  keywords: 'FDI, investment intelligence, GOSA, GFR ranking, investment analysis, market signals',
  themeColor: '#00ffc8',
  openGraph: {
    title: 'Global FDI Monitor — Intelligence Platform',
    description: 'GOSA-scored FDI intelligence across 215+ economies. Live signals, GFR ranking, AI reports.',
    url: 'https://fdimonitor.org',
    siteName: 'Global FDI Monitor',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='16' r='14' stroke='%2300ffc8' stroke-width='2' fill='none'/><path d='M16 26 L20 14 L16 6' stroke='%2300ffc8' stroke-width='3' stroke-linecap='round' fill='none'/><circle cx='20' cy='14' r='3' fill='%2300ffc8'/></svg>"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5"/>
        <style>{`
          html,body{background:#020c14}
          *{box-sizing:border-box}
        `}</style>
      </head>
      <body style={{ background: '#020c14', color: '#e8f4f8', minHeight: '100vh' }}>
        {children}
      </body>
    </html>
  );
}
