import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'Sign In — Global FDI Monitor',
  description: 'Sign in to access real-time FDI intelligence across 215 economies.',
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
