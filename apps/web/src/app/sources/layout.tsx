import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Data Sources Library | Global FDI Monitor',
  description: '304 official government sources — powered by GOSA methodology and 304+ official sources.',
  openGraph: { title: 'Data Sources Library | Global FDI Monitor', description: '304 official government sources' },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
