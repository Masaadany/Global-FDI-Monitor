import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Economy Benchmarking — Global FDI Monitor',
  description: 'Compare up to 5 economies across all GFR dimensions.',
  openGraph: {
    title: 'Economy Benchmarking — Global FDI Monitor',
    description: 'Compare up to 5 economies across all GFR dimensions.',
    url: 'https://fdimonitor.org/benchmarking',
    siteName: 'Global FDI Monitor',
    type: 'website',
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
