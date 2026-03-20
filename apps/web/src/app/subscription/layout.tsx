import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Subscription Plans — Global FDI Monitor',
  description: 'Professional FDI intelligence from $799/month. 4,800 credits/year.',
  openGraph: {
    title: 'Subscription Plans — Global FDI Monitor',
    description: 'Professional FDI intelligence from $799/month. 4,800 credits/year.',
    url: 'https://fdimonitor.org/subscription',
    siteName: 'Global FDI Monitor',
    type: 'website',
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
