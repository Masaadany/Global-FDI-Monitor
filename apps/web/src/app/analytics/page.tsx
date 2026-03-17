'use client';
import dynamic from 'next/dynamic';
import FDIWorldMap from '@/components/FDIWorldMap';
const AdvancedAnalytics = dynamic(() => import('@/components/AdvancedAnalytics'), { ssr: false });

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-5">
      <div className="max-w-7xl mx-auto space-y-5">
        <div>
          <h1 className="text-2xl font-black text-[#0A2540]">Global Intelligence Analytics</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time FDI signals, GFR rankings, and investment intelligence across 215 economies</p>
        </div>
        <FDIWorldMap />
        <AdvancedAnalytics />
      </div>
    </div>
  );
}
