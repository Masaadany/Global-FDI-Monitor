import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Signal Alerts — Global FDI Monitor',
  description: 'Configure intelligent FDI signal alerts. Get notified on PLATINUM signals.',
  openGraph: {
    title: 'Signal Alerts — Global FDI Monitor',
    description: 'Configure intelligent FDI signal alerts. Get notified on PLATINUM signals.',
    url: 'https://fdimonitor.org/alerts',
    siteName: 'Global FDI Monitor',
    type: 'website',
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
