import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Sector Intelligence Monitor | Global FDI Monitor',
  description: '9 FDI sectors momentum scoring — powered by GOSA methodology and 304+ official sources.',
  openGraph: { title: 'Sector Intelligence Monitor | Global FDI Monitor', description: '9 FDI sectors momentum scoring' },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
