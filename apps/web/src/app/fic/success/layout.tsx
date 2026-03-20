import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Credits Added — FDI Monitor',
  description: 'Your FDI Monitor intelligence credits have been added. Start generating reports.',
};

export default function Layout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
