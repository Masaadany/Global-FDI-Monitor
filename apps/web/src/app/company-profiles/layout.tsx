import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Company Intelligence Profiles — Global FDI Monitor',
  description: 'Intelligence for 140,000+ companies. IMS scores, FDI signals, ESG.',
  openGraph: {
    title: 'Company Intelligence Profiles — Global FDI Monitor',
    description: 'Intelligence for 140,000+ companies. IMS scores, FDI signals, ESG.',
    url: 'https://fdimonitor.org/company-profiles',
    siteName: 'Global FDI Monitor',
    type: 'website',
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
