import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Economy Watchlists | Global FDI Monitor',
  description: 'Track and monitor GOSA score alerts — powered by GOSA methodology and 304+ official sources.',
  openGraph: { title: 'Economy Watchlists | Global FDI Monitor', description: 'Track and monitor GOSA score alerts' },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
