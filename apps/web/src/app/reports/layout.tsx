import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Custom Intelligence Reports — Global FDI Monitor',
  description: '10 AI-powered report types. Z3 verified. Ready in 45 seconds.',
  openGraph: {
    title: 'Custom Intelligence Reports — Global FDI Monitor',
    description: '10 AI-powered report types. Z3 verified. Ready in 45 seconds.',
    url: 'https://fdimonitor.org/reports',
    siteName: 'Global FDI Monitor',
    type: 'website',
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
