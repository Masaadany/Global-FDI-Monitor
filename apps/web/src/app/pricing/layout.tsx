import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Pricing Plans | Global FDI Monitor',
  description: 'Free trial Professional Enterprise FDI intelligence — powered by GOSA methodology and 1000+ official sources.',
  openGraph: { title: 'Pricing Plans | Global FDI Monitor', description: 'Free trial Professional Enterprise FDI intelligence' },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
