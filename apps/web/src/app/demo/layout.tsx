import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Live Platform Demo — Global FDI Monitor',
  description: 'Explore GFM live. Real signals, GFR assessments, AI reports. No login required.',
  openGraph: {
    title: 'Live Platform Demo — Global FDI Monitor',
    description: 'Explore GFM live. Real signals, GFR assessments, AI reports. No login required.',
    url: 'https://fdimonitor.org/demo',
    siteName: 'Global FDI Monitor',
    type: 'website',
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
