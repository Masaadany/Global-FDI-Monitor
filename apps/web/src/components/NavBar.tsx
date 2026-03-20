'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { label: 'Home',                      href: '/' },
  { label: 'About Us',                  href: '/about' },
  { label: 'Global Dashboard',          href: '/dashboard' },
  { label: 'Investment Analysis',       href: '/investment-analysis' },
  { label: 'Promotion Mission Planning',href: '/pmp' },
  { label: 'Resources & Insights',      href: '/market-insights' },
  { label: 'Contact Us',                href: '/contact' },
];

export default function NavBar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav role="navigation" aria-label="Main navigation"
      style={{background:'white',boxShadow:'0 2px 12px rgba(10,61,98,0.08)',position:'sticky',top:0,zIndex:50}}>
      <div style={{maxWidth:'1400px',margin:'0 auto',padding:'0 24px'}}>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',height:'64px'}}>
          <Link href="/" style={{textDecoration:'none',display:'flex',alignItems:'baseline',gap:'2px'}} aria-label="Global FDI Monitor home">
            <span style={{fontSize:'20px',fontWeight:'900',color:'#0A3D62',letterSpacing:'-0.5px'}}>GLOBAL</span>
            <span style={{fontSize:'20px',fontWeight:'900',color:'#74BB65',letterSpacing:'-0.5px',marginLeft:'4px'}}>FDI</span>
            <span style={{fontSize:'20px',fontWeight:'900',color:'#0A3D62',letterSpacing:'-0.5px',marginLeft:'4px'}}>MONITOR</span>
          </Link>
          <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
            {/* LIVE indicator — always visible regardless of auth state */}
            <Link href="/signals" aria-label="View live FDI signals"
              style={{display:'flex',alignItems:'center',gap:'5px',padding:'5px 11px',borderRadius:'20px',
                background:'rgba(116,187,101,0.1)',border:'1px solid rgba(116,187,101,0.3)',textDecoration:'none',flexShrink:0}}>
              <span style={{display:'inline-block',width:'8px',height:'8px',borderRadius:'50%',background:'#74BB65',
                boxShadow:'0 0 6px rgba(116,187,101,0.6)',animation:'livePulse 2s ease-in-out infinite'}}/>
              <span style={{fontSize:'11px',fontWeight:800,color:'#74BB65',letterSpacing:'0.06em'}}>LIVE</span>
            </Link>
            <button style={{display:'flex',alignItems:'center',gap:'4px',fontSize:'13px',color:'#696969',
              border:'1px solid rgba(10,61,98,0.12)',borderRadius:'6px',padding:'6px 10px',background:'none',cursor:'pointer'}}
              aria-label="Language selector">🌐 EN ▾</button>
            <button onClick={()=>setSearchOpen(s=>!s)}
              style={{background:'none',border:'none',cursor:'pointer',color:'#696969',fontSize:'18px',padding:'6px'}}
              aria-label="Search">🔍</button>
            <Link href="/auth/login" style={{fontSize:'13px',fontWeight:'600',color:'#0A3D62',textDecoration:'none',padding:'6px 12px'}}>Sign In</Link>
            <Link href="/register" style={{fontSize:'13px',fontWeight:'600',color:'white',background:'#74BB65',borderRadius:'6px',padding:'8px 16px',textDecoration:'none'}}>Sign Up</Link>
            <button onClick={()=>setMobileOpen(m=>!m)}
              style={{display:'none',background:'none',border:'none',cursor:'pointer',fontSize:'20px',color:'#0A3D62'}}
              aria-label="Toggle menu" className="mobile-menu-btn">☰</button>
          </div>
        </div>
        {searchOpen && (
          <div style={{paddingBottom:'12px'}}>
            <input type="text" placeholder="Search countries, sectors, signals…"
              style={{width:'100%',padding:'10px 14px',borderRadius:'8px',border:'2px solid #74BB65',fontSize:'14px',outline:'none'}}
              autoFocus aria-label="Global search"/>
          </div>
        )}
      </div>
      {/* Navy nav bar */}
      <div style={{background:'#0A3D62',borderTop:'1px solid rgba(255,255,255,0.08)'}}>
        <div style={{maxWidth:'1400px',margin:'0 auto',padding:'0 24px',display:'flex',gap:'0',overflowX:'auto'}}>
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href}
                style={{padding:'12px 16px',fontSize:'13px',fontWeight:'500',
                  color: isActive ? '#74BB65' : 'rgba(255,255,255,0.82)',
                  textDecoration:'none',whiteSpace:'nowrap',display:'block',
                  borderBottom: isActive ? '2px solid #74BB65' : '2px solid transparent',transition:'all 0.2s'}}>
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
      {mobileOpen && (
        <div style={{background:'white',borderTop:'1px solid rgba(10,61,98,0.08)'}}>
          {NAV_ITEMS.map(item=>(
            <Link key={item.href} href={item.href} onClick={()=>setMobileOpen(false)}
              style={{display:'block',padding:'12px 24px',fontSize:'14px',color:'#0A3D62',textDecoration:'none',borderBottom:'1px solid rgba(10,61,98,0.06)'}}>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
