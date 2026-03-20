import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'FAQ — FDI Monitor',
  description: 'Frequently asked questions about FDI Monitor. Signals, GFR assessments, reports, API, and trial.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
