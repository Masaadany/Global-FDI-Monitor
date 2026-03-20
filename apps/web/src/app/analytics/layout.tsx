import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Advanced Analytics — Global FDI Monitor',
  description: 'Interactive FDI analytics. Trends, heatmaps, scatter plots, radar charts.',
  openGraph: {
    title: 'Advanced Analytics — Global FDI Monitor',
    description: 'Interactive FDI analytics. Trends, heatmaps, scatter plots, radar charts.',
    url: 'https://fdimonitor.org/analytics',
    siteName: 'Global FDI Monitor',
    type: 'website',
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
