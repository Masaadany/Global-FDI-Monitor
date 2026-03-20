import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'GFR Rankings Q1 2026 — Global FDI Monitor',
  description: 'Global Future Readiness Rankings for 215 economies. Q1 2026 composite scores across 6 dimensions.',
  openGraph: {
    title: 'GFR Rankings Q1 2026 — Global FDI Monitor',
    description: 'Quarterly GFR composite scores for 215 economies: Macro, Policy, Digital, Human, Infrastructure, Sustainability.',
    url: 'https://fdimonitor.org/gfr',
    siteName: 'Global FDI Monitor',
  },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
