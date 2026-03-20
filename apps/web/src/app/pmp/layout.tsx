import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Investment Mission Planning — Global FDI Monitor',
  description: 'Company targeting by MFS. Generate mission dossiers instantly.',
  openGraph: {
    title: 'Investment Mission Planning — Global FDI Monitor',
    description: 'Company targeting by MFS. Generate mission dossiers instantly.',
    url: 'https://fdimonitor.org/pmp',
    siteName: 'Global FDI Monitor',
    type: 'website',
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
