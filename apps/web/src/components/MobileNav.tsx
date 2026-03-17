'use client';
import { useState } from 'react';
import Link from 'next/link';

const NAV_ITEMS = [
  {href:'/dashboard',         label:'Dashboard',         icon:'📊'},
  {href:'/signals',           label:'Signals',           icon:'📡'},
  {href:'/gfr',               label:'GFR Rankings',      icon:'🏆'},
  {href:'/analytics',         label:'Analytics',         icon:'📈'},
  {href:'/reports',           label:'Reports',           icon:'📋'},
  {href:'/pmp',               label:'Mission Planning',  icon:'🎯'},
  {href:'/forecast',          label:'Forecast',          icon:'🔮'},
  {href:'/investment-pipeline',label:'Pipeline',         icon:'🗂'},
  {href:'/company-profiles',  label:'Companies',         icon:'🏢'},
  {href:'/market-insights',   label:'Insights',          icon:'💡'},
  {href:'/watchlists',        label:'Watchlists',        icon:'👁'},
  {href:'/alerts',            label:'Alerts',            icon:'🔔'},
  {href:'/publications',      label:'Publications',      icon:'📰'},
  {href:'/benchmarking',      label:'Benchmarking',      icon:'⚖️'},
  {href:'/corridor-intelligence',label:'Corridors',      icon:'🌐'},
  {href:'/pricing',           label:'Pricing',           icon:'💳'},
  {href:'/about',             label:'About',             icon:'ℹ️'},
  {href:'/contact',           label:'Contact',           icon:'✉️'},
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Hamburger button — only visible on mobile */}
      <button onClick={() => setOpen(true)}
        className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
        aria-label="Open menu">
        <div className="w-5 h-0.5 bg-slate-600 mb-1"/>
        <div className="w-5 h-0.5 bg-slate-600 mb-1"/>
        <div className="w-5 h-0.5 bg-slate-600"/>
      </button>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)}/>
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <div className="font-black text-[#0A2540]">Global FDI Monitor</div>
              <button onClick={() => setOpen(false)} className="text-2xl text-slate-400 hover:text-slate-600">×</button>
            </div>
            <div className="flex-1 overflow-y-auto p-3">
              {NAV_ITEMS.map(item => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors mb-0.5">
                  <span className="text-lg w-6 text-center">{item.icon}</span>
                  <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                </Link>
              ))}
            </div>
            <div className="p-4 border-t border-slate-100 space-y-2">
              <Link href="/register" onClick={() => setOpen(false)}
                className="block w-full text-center bg-[#0A2540] text-white font-black py-3 rounded-xl hover:bg-[#1D4ED8] transition-colors text-sm">
                Start Free Trial
              </Link>
              <Link href="/auth/login" onClick={() => setOpen(false)}
                className="block w-full text-center border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl text-sm hover:border-blue-300 transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
