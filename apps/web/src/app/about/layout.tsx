import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'About Global FDI Monitor — Vision, Mission & Philosophy',
  description: 'The story, vision, mission and philosophy behind Global FDI Monitor.',
  openGraph: {
    title: 'About Global FDI Monitor — Vision, Mission & Philosophy',
    description: 'The story, vision, mission and philosophy behind Global FDI Monitor.',
    url: 'https://fdimonitor.org/about',
    siteName: 'Global FDI Monitor',
    type: 'website',
  },
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
