import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Dashboard — Global FDI Monitor',
  description: 'Live signals, GFR updates, balance, and quick actions.',
  openGraph: {
    title: 'Dashboard — Global FDI Monitor',
    description: 'Live signals, GFR updates, balance, and quick actions.',
    url: 'https://fdimonitor.org/dashboard',
    siteName: 'Global FDI Monitor',
    type: 'website',
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
