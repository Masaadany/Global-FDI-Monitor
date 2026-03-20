import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Publications Library — Global FDI Monitor',
  description: 'FDI intelligence publications, factsheets, and newsletters.',
  openGraph: {
    title: 'Publications Library — Global FDI Monitor',
    description: 'FDI intelligence publications, factsheets, and newsletters.',
    url: 'https://fdimonitor.org/publications',
    siteName: 'Global FDI Monitor',
    type: 'website',
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
