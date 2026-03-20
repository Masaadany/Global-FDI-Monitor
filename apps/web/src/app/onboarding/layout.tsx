import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Getting Started — Global FDI Monitor',
  description: 'Complete your GFM setup and start exploring FDI intelligence.',
  openGraph: {
    title: 'Getting Started — Global FDI Monitor',
    description: 'Complete your GFM setup and start exploring FDI intelligence.',
    url: 'https://fdimonitor.org/onboarding',
    siteName: 'Global FDI Monitor',
    type: 'website',
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
