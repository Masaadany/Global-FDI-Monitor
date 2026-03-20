import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Investment Pipeline — Global FDI Monitor',
  description: 'CRM pipeline for investment deals, stages, and stakeholder tracking.',
  openGraph: {
    title: 'Investment Pipeline — Global FDI Monitor',
    description: 'CRM pipeline for investment deals, stages, and stakeholder tracking.',
    url: 'https://fdimonitor.org/investment-pipeline',
    siteName: 'Global FDI Monitor',
    type: 'website',
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
