import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'FDI Corridor Intelligence — Global FDI Monitor',
  description: 'Bilateral FDI corridor analysis with 5-year historical trends.',
  openGraph: {
    title: 'FDI Corridor Intelligence — Global FDI Monitor',
    description: 'Bilateral FDI corridor analysis with 5-year historical trends.',
    url: 'https://fdimonitor.org/corridor-intelligence',
    siteName: 'Global FDI Monitor',
    type: 'website',
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
