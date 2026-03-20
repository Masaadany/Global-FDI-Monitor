import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'FDI Scenario Planner — Global FDI Monitor',
  description: 'Monte Carlo scenario simulations with 10,000 iterations.',
  openGraph: {
    title: 'FDI Scenario Planner — Global FDI Monitor',
    description: 'Monte Carlo scenario simulations with 10,000 iterations.',
    url: 'https://fdimonitor.org/scenario-planner',
    siteName: 'Global FDI Monitor',
    type: 'website',
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
