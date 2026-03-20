import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Account Settings — Global FDI Monitor',
  description: 'Manage settings, notifications, team members, and API keys.',
  openGraph: {
    title: 'Account Settings — Global FDI Monitor',
    description: 'Manage settings, notifications, team members, and API keys.',
    url: 'https://fdimonitor.org/settings',
    siteName: 'Global FDI Monitor',
    type: 'website',
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
