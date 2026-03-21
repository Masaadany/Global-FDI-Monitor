import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Bilateral FDI Corridors | Global FDI Monitor',
  description: '12 active investment corridors — powered by GOSA methodology and 1000+ official sources.',
  openGraph: { title: 'Bilateral FDI Corridors | Global FDI Monitor', description: '12 active investment corridors' },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
