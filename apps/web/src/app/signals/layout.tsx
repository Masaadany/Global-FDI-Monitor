import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Live FDI Signals — Global FDI Monitor',
  description: 'Real-time signals updated every 2s. PLATINUM–BRONZE grades.',
  openGraph: {
    title: 'Live FDI Signals — Global FDI Monitor',
    description: 'Real-time signals updated every 2s. PLATINUM–BRONZE grades.',
    url: 'https://fdimonitor.org/signals',
    siteName: 'Global FDI Monitor',
    type: 'website',
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
