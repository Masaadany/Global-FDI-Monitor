import Link from 'next/link';
import NavBar from '@/components/NavBar';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: '404 — Page Not Found | FDI Monitor' };

export default function NotFound() {
  return (
    <div className="min-h-screen" style={{background:'#0F0A0A'}}>
      <NavBar/>
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
        <div className="text-8xl font-extrabold font-data mb-4" style={{color:'rgba(255,102,0,0.15)'}}>404</div>
        <div className="text-4xl font-extrabold mb-3" style={{color:'#FAFAF0'}}>Page Not Found</div>
        <p className="text-base max-w-md mb-8" style={{color:'#87A19E'}}>
          The intelligence you&apos;re looking for may have moved. Try navigating from the dashboard.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link href="/dashboard" className="gfm-btn-primary px-8 py-3">Go to Dashboard</Link>
          <Link href="/"          className="gfm-btn-outline px-8 py-3" style={{color:'#87A19E'}}>Homepage</Link>
          <Link href="/signals"   className="gfm-btn-outline px-8 py-3" style={{color:'#87A19E'}}>Live Signals</Link>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-12 max-w-2xl">
          {[
            {href:'/gfr',          label:'GFR Rankings',      icon:'🏆'},
            {href:'/forecast',     label:'Foresight 2050',    icon:'📈'},
            {href:'/pmp',          label:'Mission Planning',  icon:'🎯'},
            {href:'/sectors',      label:'Sectors',           icon:'🏭'},
            {href:'/reports',      label:'Reports',           icon:'📋'},
            {href:'/sources',      label:'Data Sources',      icon:'🔍'},
          ].map(item=>(
            <Link key={item.href} href={item.href}
              className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-white/5 transition-all">
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs" style={{color:'#496767'}}>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
