'use client';
import { useState } from 'react';
import Link from 'next/link';

const NAV_ITEMS = [
  {href:'/dashboard',          icon:'🗂',  label:'Dashboard'},
  {href:'/signals',            icon:'📡',  label:'Signals'},
  {href:'/gfr',                icon:'🏆',  label:'GFR Rankings'},
  {href:'/analytics',          icon:'📊',  label:'Analytics'},
  {href:'/reports',            icon:'📋',  label:'Reports'},
  {href:'/pmp',                icon:'🎯',  label:'Mission'},
  {href:'/forecast',           icon:'🔮',  label:'Forecast'},
  {href:'/investment-pipeline',icon:'💼',  label:'Pipeline'},
  {href:'/company-profiles',   icon:'🏢',  label:'Companies'},
  {href:'/market-insights',    icon:'💡',  label:'Insights'},
  {href:'/watchlists',         icon:'👁',  label:'Watchlists'},
  {href:'/alerts',             icon:'🔔',  label:'Alerts'},
  {href:'/benchmarking',       icon:'📐',  label:'Benchmark'},
  {href:'/scenario-planner',   icon:'🧩',  label:'Scenarios'},
  {href:'/corridor-intelligence',icon:'🔗',label:'Corridors'},
  {href:'/publications',       icon:'📰',  label:'Publications'},
  {href:'/pricing',            icon:'💳',  label:'Pricing'},
  {href:'/fic',                icon:'⭐',  label:'FIC Credits'},
  {href:'/about',              icon:'ℹ️',  label:'About'},
  {href:'/contact',            icon:'✉️',  label:'Contact'},
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger */}
      <button onClick={() => setOpen(true)}
        className="md:hidden flex flex-col gap-1 p-2"
        aria-label="Open menu">
        <span className="w-5 h-0.5 bg-slate-400 rounded"/>
        <span className="w-5 h-0.5 bg-slate-400 rounded"/>
        <span className="w-5 h-0.5 bg-slate-400 rounded"/>
      </button>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)}/>
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-[#0A2540] rounded-lg flex items-center justify-center text-white text-xs font-black">G</div>
                <span className="font-black text-[#0A2540]">GFM</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl">×</button>
            </div>
            <div className="py-2">
              {NAV_ITEMS.map(item => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
                  <span className="text-xl w-8 text-center">{item.icon}</span>
                  <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                </Link>
              ))}
            </div>
            <div className="px-5 py-4 border-t border-slate-100 space-y-2">
              <Link href="/register" onClick={() => setOpen(false)}
                className="block w-full text-center bg-[#0A2540] text-white font-black py-3 rounded-xl hover:bg-[#1D4ED8] transition-colors">
                Start Free Trial
              </Link>
              <Link href="/auth/login" onClick={() => setOpen(false)}
                className="block w-full text-center border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl hover:border-blue-300 transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
