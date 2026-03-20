import type { Metadata } from 'next';
export const metadata: Metadata = {
  title: 'مراقب الاستثمار الأجنبي المباشر العالمي — Global FDI Monitor',
  description: 'منصة استخبارات الاستثمار الأجنبي المباشر الأكثر شمولاً في العالم. 215 اقتصاداً، إشارات حية، تصنيفات GFR.',
  openGraph: { title: 'GFM — مراقب الاستثمار', description: 'منصة استخبارات الاستثمار الأجنبي المباشر العالمي', locale: 'ar_AE' },
};
export default function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
