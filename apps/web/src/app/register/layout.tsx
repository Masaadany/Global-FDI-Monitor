import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Start Access — Global FDI Monitor',
  description: '3-day access, 5 credits credits. No credit card required.',
  openGraph: {
    title: 'Start Access — Global FDI Monitor',
    description: '3-day access, 5 credits credits. No credit card required.',
    url: 'https://fdimonitor.org/register',
    siteName: 'Global FDI Monitor',
    type: 'website',
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
