'use client';
import { useState } from 'react';
import Link from 'next/link';

const NAV_SECTIONS = [
  {
    label: 'Intelligence',
    items: [
      {href:'/dashboard',           icon:'🗂',  label:'Dashboard'},
      {href:'/signals',             icon:'📡',  label:'Market Signals'},
      {href:'/analytics',           icon:'📊',  label:'Analytics'},
      {href:'/market-insights',     icon:'💡',  label:'Resources & Insights'},
    ]
  },
  {
    label: 'Rankings & Data',
    items: [
      {href:'/gfr',                 icon:'🏆',  label:'GFR Rankings'},
      {href:'/country/ARE',         icon:'🌍',  label:'Country Profiles'},
      {href:'/company-profiles',    icon:'🏢',  label:'Company Profiles'},
      {href:'/sectors',             icon:'🏭',  label:'Sector Intelligence'},
      {href:'/corridor-intelligence',icon:'🛤', label:'Corridor Intelligence'},
    ]
  },
  {
    label: 'Analysis Tools',
    items: [
      {href:'/forecast',            icon:'🔮',  label:'Forecast & Outlook'},
      {href:'/scenario-planner',    icon:'🎲',  label:'Scenario Planner'},
      {href:'/benchmarking',        icon:'📐',  label:'Benchmarking'},
      {href:'/pmp',                 icon:'🎯',  label:'Mission Planning'},
    ]
  },
  {
    label: 'Platform',
    items: [
      {href:'/reports',             icon:'📋',  label:'Custom Reports'},
      {href:'/investment-pipeline', icon:'➕',  label:'Investment Pipeline'},
      {href:'/watchlists',          icon:'👁',  label:'Watchlists'},
      {href:'/alerts',              icon:'🔔',  label:'Alerts'},
      {href:'/publications',        icon:'📰',  label:'Publications'},
    ]
  },
  {
    label: 'Account',
    items: [
      {href:'/fic',                 icon:'⭐',  label:'FIC Credits'},
      {href:'/subscription',        icon:'💳',  label:'Subscription Plans'},
      {href:'/settings',            icon:'⚙️',  label:'Settings'},
      {href:'/demo',                icon:'▶️',  label:'Live Demo'},
    ]
  },
  {
    label: 'Company',
    items: [
      {href:'/about',               icon:'ℹ️',  label:'About Us'},
      {href:'/pricing',             icon:'💰',  label:'Pricing'},
      {href:'/contact',             icon:'✉️',  label:'Contact'},
      {href:'/ar',                  icon:'🌐',  label:'العربية'},
    ]
  },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button onClick={() => setOpen(true)}
        className="flex flex-col gap-1 p-2 rounded-lg hover:bg-slate-100 transition-colors"
        aria-label="Open menu">
        <span className="w-5 h-0.5 bg-slate-600 rounded"/>
        <span className="w-5 h-0.5 bg-slate-600 rounded"/>
        <span className="w-4 h-0.5 bg-slate-600 rounded"/>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)}/>
          {/* Panel */}
          <div className="relative ml-auto w-72 bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-white text-sm"
                  style={{background:'linear-gradient(135deg,#0A2540,#0A66C2)'}}>G</div>
                <span className="font-extrabold text-deep text-sm">GFM Menu</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-deep p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-lg">×</button>
            </div>

            {/* Nav sections */}
            <div className="flex-1 overflow-y-auto py-2">
              {NAV_SECTIONS.map(section => (
                <div key={section.label} className="mb-1">
                  <div className="px-4 py-1.5 text-xs font-bold text-slate-400 uppercase tracking-widest">{section.label}</div>
                  {section.items.map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors group">
                      <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
                      <span className="text-sm font-medium text-slate-600 group-hover:text-primary transition-colors">{item.label}</span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 px-4 py-4 flex-shrink-0 space-y-2">
              <Link href="/register" onClick={() => setOpen(false)}
                className="block w-full text-center gfm-btn-primary py-2.5 rounded-xl text-sm">
                Start Free Trial
              </Link>
              <Link href="/auth/login" onClick={() => setOpen(false)}
                className="block w-full text-center border border-slate-200 text-slate-600 font-semibold py-2.5 rounded-xl text-sm hover:border-primary hover:text-primary transition-all">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
