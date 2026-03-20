import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Intelligence Credits — FDI Monitor',
  description: 'Buy intelligence credits. Starter 50 credits, Professional 200, Enterprise 500.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
