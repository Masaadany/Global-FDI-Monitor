import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'FDI Intelligence Dashboard | Global FDI Monitor',
  description: 'Live GOSA scores, signals, country analysis — powered by GOSA methodology and 304+ official sources.',
  openGraph: { title: 'FDI Intelligence Dashboard | Global FDI Monitor', description: 'Live GOSA scores, signals, country analysis' },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
