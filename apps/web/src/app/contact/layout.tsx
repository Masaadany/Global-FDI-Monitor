import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Contact Global FDI Monitor',
  description: 'Get in touch for sales, enterprise, partnerships, or support.',
  openGraph: {
    title: 'Contact Global FDI Monitor',
    description: 'Get in touch for sales, enterprise, partnerships, or support.',
    url: 'https://fdimonitor.org/contact',
    siteName: 'Global FDI Monitor',
    type: 'website',
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
