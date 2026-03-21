import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Global Investment Analysis | Global FDI Monitor',
  description: '15 economies GOSA-scored across 4 layers — powered by GOSA methodology and 1000+ official sources.',
  openGraph: { title: 'Global Investment Analysis | Global FDI Monitor', description: '15 economies GOSA-scored across 4 layers' },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
