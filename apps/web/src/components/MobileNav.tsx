'use client';
import Logo from '@/components/Logo';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_SECTIONS = [
  { title:'Intelligence', links:[
    {href:'/dashboard',  label:'Dashboard',         icon:'📊'},
    {href:'/signals',    label:'Live Signals',       icon:'📡'},
    {href:'/gfr',        label:'GFR Assessments',       icon:'🏆'},
    {href:'/analytics',  label:'Analytics',          icon:'📈'},
  ]},
  { title:'Planning', links:[
    {href:'/forecast',   label:'Foresight 2050',     icon:'🔭'},
    {href:'/pmp',        label:'Mission Planning',   icon:'🎯'},
    {href:'/scenario-planner', label:'Scenarios',   icon:'🎛'},
    {href:'/benchmarking',label:'Benchmarking',      icon:'📊'},
  ]},
  { title:'Data', links:[
    {href:'/sectors',    label:'Sectors',            icon:'🏭'},
    {href:'/company-profiles',label:'Companies',    icon:'🏢'},
    {href:'/corridor-intelligence',label:'Corridors',icon:'↔️'},
    {href:'/publications',label:'Publications',     icon:'📚'},
  ]},
  { title:'Account', links:[
    {href:'/reports',    label:'Reports',            icon:'📋'},
    {href:'/watchlists', label:'Watchlists',         icon:'👁️'},
    {href:'/alerts',     label:'Alerts',             icon:'🔔'},
    {href:'/settings',   label:'Settings',           icon:'⚙️'},
  ]},
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const path = usePathname() || '';

  // Close on route change
  useEffect(() => { setOpen(false); }, [path]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <button onClick={()=>setOpen(p=>!p)}
        aria-label="Open mobile navigation" className="lg:hidden p-2 rounded-lg transition-all"
        style={{color:'#696969'}}>
        {open
          ? <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          : <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
        }
      </button>

      {/* Backdrop */}
      {open && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={()=>setOpen(false)}/>}

      {/* Slide-out panel */}
      <div className={`fixed top-0 right-0 bottom-0 z-50 lg:hidden flex flex-col transition-transform duration-300 ${open?'translate-x-0':'translate-x-full'}`}
           style={{width:280,background:'#0F1A1C',borderLeft:'1px solid rgba(10,61,98,0.15)'}}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{borderBottomColor:'rgba(10,61,98,0.15)'}}>
          <Link href="/" className="flex items-center gap-2">
            <Logo variant="nav"/>
            <span className="font-extrabold text-sm" style={{color:'#0A3D62'}}>FDI Monitor</span>
          </Link>
          <button onClick={()=>setOpen(false)} className="text-fog hover:text-bright text-2xl leading-none">×</button>
        </div>

        {/* Nav sections */}
        <div className="flex-1 overflow-y-auto py-4">
          {NAV_SECTIONS.map(section=>(
            <div key={section.title} className="mb-5 px-5">
              <div className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{color:'#696969'}}>{section.title}</div>
              <div className="space-y-0.5">
                {section.links.map(link=>(
                  <Link key={link.href} href={link.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${path===link.href?'text-radiance bg-radiance/10':'text-fog hover:text-bright hover:bg-white/5'}`}>
                    <span className="text-base">{link.icon}</span>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTAs */}
        <div className="px-5 pb-5 pt-3 border-t space-y-2" style={{borderTopColor:'rgba(10,61,98,0.15)'}}>
          <Link href="/ar"           className="flex items-center gap-2 text-sm text-fog hover:text-bright px-3 py-2">🌐 العربية</Link>
          <Link href="/auth/login"   className="gfm-btn-outline w-full text-sm py-2.5 text-center" style={{color:'#696969'}}>Sign In</Link>
          <Link href="/register"     className="gfm-btn-primary w-full text-sm py-2.5 text-center block">Start Access</Link>
        </div>
      </div>
    </>
  );
}
