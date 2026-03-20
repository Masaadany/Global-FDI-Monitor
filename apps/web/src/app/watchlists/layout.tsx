import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Watchlists — Global FDI Monitor',
  description: 'Track economies and companies. Alerts on matching signals.',
  openGraph: {
    title: 'Watchlists — Global FDI Monitor',
    description: 'Track economies and companies. Alerts on matching signals.',
    url: 'https://fdimonitor.org/watchlists',
    siteName: 'Global FDI Monitor',
    type: 'website',
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
