import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Investment Signals Feed | Global FDI Monitor',
  description: 'Live PLATINUM GOLD SILVER FDI signals — powered by GOSA methodology and 304+ official sources.',
  openGraph: { title: 'Investment Signals Feed | Global FDI Monitor', description: 'Live PLATINUM GOLD SILVER FDI signals' },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
