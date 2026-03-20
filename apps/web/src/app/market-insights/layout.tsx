import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Market Insights — Global FDI Monitor',
  description: 'Deep-dive FDI analysis: MENA, ASEAN, Africa, South Asia.',
  openGraph: {
    title: 'Market Insights — Global FDI Monitor',
    description: 'Deep-dive FDI analysis: MENA, ASEAN, Africa, South Asia.',
    url: 'https://fdimonitor.org/market-insights',
    siteName: 'Global FDI Monitor',
    type: 'website',
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
