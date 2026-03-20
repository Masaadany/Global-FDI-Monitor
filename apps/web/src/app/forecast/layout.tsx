import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'FDI Forecast 2025–2030 — Global FDI Monitor',
  description: 'Bayesian VAR + Prophet ensemble forecasts. P10/P50/P90 confidence.',
  openGraph: {
    title: 'FDI Forecast 2025–2030 — Global FDI Monitor',
    description: 'Bayesian VAR + Prophet ensemble forecasts. P10/P50/P90 confidence.',
    url: 'https://fdimonitor.org/forecast',
    siteName: 'Global FDI Monitor',
    type: 'website',
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
