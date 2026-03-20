import type { Metadata, ReactNode } from 'next';

export const metadata: Metadata = {
  title: 'Investment Sectors — FDI Monitor',
  description: 'FDI intelligence across all major investment sectors. Live signals and CapEx pipeline tracking.',
};

export default function SectorsLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
