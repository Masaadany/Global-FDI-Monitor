import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Intelligence Credits — FDI Monitor',
  description: 'FDI Monitor intelligence credits for report generation and data exports.',
};

export default function FICLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
