import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'GFR Ranking 2026 | Global FDI Monitor',
  description: 'Global Future Readiness ranking 25 economies — powered by GOSA methodology and 304+ official sources.',
  openGraph: { title: 'GFR Ranking 2026 | Global FDI Monitor', description: 'Global Future Readiness ranking 25 economies' },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
