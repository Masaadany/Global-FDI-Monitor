import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Subscription Active — FDI Monitor',
  description: 'Your FDI Monitor Professional subscription is now active. Access reports and API.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
