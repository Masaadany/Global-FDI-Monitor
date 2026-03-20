import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Admin Dashboard — Global FDI Monitor',
  description: 'Platform administration: health, data refresh, user management, and analytics.',
  openGraph: {
    title: 'Admin Dashboard — Global FDI Monitor',
    description: 'Platform administration: health, data refresh, user management, and analytics.',
    url: 'https://fdimonitor.org/admin',
    siteName: 'Global FDI Monitor',
    type: 'website',
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
