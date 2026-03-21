import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'FAQ Global FDI Monitor | Global FDI Monitor',
  description: 'Platform pricing data technical answers — powered by GOSA methodology and 304+ official sources.',
  openGraph: { title: 'FAQ Global FDI Monitor | Global FDI Monitor', description: 'Platform pricing data technical answers' },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
