'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, X, Menu, Zap, Bell, ChevronDown } from 'lucide-react';
import { SearchOverlay } from './GlobalSearch';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', hot: false },
  { label: 'Investment Analysis', href: '/investment-analysis', hot: false },
  {
    label: 'Intelligence',
    href: '#',
    hot: true,
    children: [
      { label: '⚡ Market Signals',   href: '/signals',       desc: 'Live signal feed' },
      { label: '🏆 GFR Ranking',      href: '/gfr',           desc: '25 economies' },
      { label: '🌍 Country Profiles', href: '/country/MYS',   desc: '20+ deep-dives' },
      { label: '🏭 Sector Monitor',   href: '/sectors',       desc: '9 sectors' },
      { label: '🔀 Corridor Intel',   href: '/corridors',     desc: '12 bilateral routes' },
      { label: '📈 Market Insights',  href: '/insights',      desc: 'Macro & sector trends' },
      { label: '⭐ Watchlists',        href: '/watchlists',    desc: 'Track economies' },
    ],
  },
  {
    label: 'Tools',
    href: '#',
    hot: false,
    children: [
      { label: '🎯 Mission Planning',  href: '/pmp',              desc: '4 guided workflows' },
      { label: '🔬 Scenario Planner',  href: '/scenario-planner', desc: 'What-if modelling' },
      { label: '📋 Pipeline Tracker',  href: '/pipeline',         desc: 'Deal pipeline board' },
      { label: '📄 PDF Reports',       href: '/reports',          desc: 'AI reports' },
      { label: '📊 Impact Analysis',   href: '/investment-analysis?tab=impact', desc: 'Model ROI' },
    ],
  },
  { label: 'Publications', href: '/publications', hot: false },
  { label: 'Pricing',      href: '/pricing',      hot: false },
];

export default function NavBar() {
  const path = usePathname();
  const [_search, _setSearch] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdown, setDropdown] = useState<string|null>(null);
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 500,
        background: scrolled
          ? 'rgba(2,12,20,0.96)'
          : 'linear-gradient(180deg,rgba(2,12,20,0.98),rgba(6,15,26,0.95))',
        backdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: `1px solid rgba(0,255,200,${scrolled?0.12:0.08})`,
        boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.6)' : 'none',
        transition: 'all 300ms ease',
      }}>
        <div style={{maxWidth:'1540px', margin:'0 auto', padding:'0 24px', height:'58px', display:'flex', alignItems:'center', gap:0, position:'relative'}}>

          {/* ── LOGO ──────────────────────────────────────────────── */}
          <Link href="/" style={{textDecoration:'none', marginRight:'36px', flexShrink:0, display:'flex', alignItems:'center', gap:'10px'}}>
            {/* Animated globe icon */}
            <div style={{position:'relative', width:'34px', height:'34px'}}>
              <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="17" stroke="rgba(0,255,200,0.3)" strokeWidth="1.5"/>
                <circle cx="20" cy="20" r="11" stroke="rgba(0,212,255,0.4)" strokeWidth="1"/>
                <ellipse cx="20" cy="20" rx="6" ry="17" stroke="rgba(0,255,200,0.3)" strokeWidth="0.8"/>
                <line x1="3" y1="20" x2="37" y2="20" stroke="rgba(0,255,200,0.2)" strokeWidth="0.8"/>
                <line x1="20" y1="3" x2="20" y2="37" stroke="rgba(0,255,200,0.15)" strokeWidth="0.8"/>
                <path d="M20 32 L24 18 L20 6" stroke="#00ffc8" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                <circle cx="24" cy="18" r="3" fill="#00ffc8" style={{filter:'drop-shadow(0 0 6px #00ffc8)'}}/>
              </svg>
              <div style={{position:'absolute', inset:0, borderRadius:'50%', background:'radial-gradient(circle, rgba(0,255,200,0.1) 0%, transparent 70%)'}}/>
            </div>
            <div style={{lineHeight:1}}>
              <div style={{fontSize:'13px', fontWeight:900, letterSpacing:'0.06em', fontFamily:"'Orbitron','Inter',sans-serif"}}>
                <span style={{color:'#e8f4f8'}}>GLOBAL </span>
                <span style={{color:'#00ffc8', textShadow:'0 0 16px rgba(0,255,200,0.6)'}}>FDI</span>
                <span style={{color:'#e8f4f8'}}> MONITOR</span>
              </div>
              <div style={{fontSize:'8px', color:'rgba(0,255,200,0.5)', letterSpacing:'0.2em', marginTop:'2px', fontFamily:"'JetBrains Mono',monospace"}}>INTELLIGENCE PLATFORM</div>
            </div>
          </Link>

          {/* ── NAV LINKS ─────────────────────────────────────────── */}
          <div style={{display:'flex', flex:1, overflowX:'auto', msOverflowStyle:'none', scrollbarWidth:'none'} as React.CSSProperties}>
            {NAV_ITEMS.map((item) => {
              const isActive = path === item.href || (item.children?.some(c=>path===c.href));
              if(item.children) return (
                <div key={item.label} style={{position:'relative'}}
                  onMouseEnter={()=>setDropdown(item.label)}
                  onMouseLeave={()=>setDropdown(null)}>
                  <button style={{
                    display:'flex', alignItems:'center', gap:'4px',
                    padding:'0 14px', height:'58px', background:'transparent', border:'none', cursor:'pointer',
                    fontSize:'12px', fontWeight:500, color:isActive?'#00ffc8':'rgba(232,244,248,0.7)',
                    fontFamily:"'Inter',sans-serif", whiteSpace:'nowrap', letterSpacing:'0.02em',
                    borderBottom:`2px solid ${isActive?'#00ffc8':'transparent'}`,
                    transition:'all 200ms ease',
                  }}>
                    {item.label}
                    {item.hot && <span style={{fontSize:'8px',fontWeight:800,padding:'1px 5px',background:'rgba(0,255,200,0.12)',color:'#00ffc8',borderRadius:'4px',letterSpacing:'0.06em'}}>LIVE</span>}
                    <ChevronDown size={12} style={{opacity:0.5, transition:'transform 200ms ease', transform:dropdown===item.label?'rotate(180deg)':'none'}}/>
                  </button>
                  {dropdown===item.label && (
                    <div style={{position:'absolute', top:'100%', left:0, minWidth:'220px', background:'rgba(6,15,26,0.98)', border:'1px solid rgba(0,255,200,0.15)', borderRadius:'10px', padding:'6px', boxShadow:'0 16px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,255,200,0.05)', backdropFilter:'blur(20px)', zIndex:600}}>
                      {item.children.map(child=>(
                        <Link key={child.href} href={child.href}
                          style={{display:'flex', flexDirection:'column', gap:'2px', padding:'10px 12px', borderRadius:'7px', textDecoration:'none', transition:'background 150ms ease', background:'transparent'}}
                          onMouseEnter={e=>(e.currentTarget.style.background='rgba(0,255,200,0.06)')}
                          onMouseLeave={e=>(e.currentTarget.style.background='transparent')}>
                          <span style={{fontSize:'12px', fontWeight:600, color:'#e8f4f8'}}>{child.label}</span>
                          <span style={{fontSize:'10px', color:'rgba(0,255,200,0.5)'}}>{child.desc}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
              return (
                <Link key={item.href} href={item.href}
                  style={{
                    padding:'0 14px', fontSize:'12px', fontWeight:500, letterSpacing:'0.02em',
                    color:isActive?'#00ffc8':'rgba(232,244,248,0.7)',
                    textDecoration:'none', height:'58px', display:'flex', alignItems:'center',
                    whiteSpace:'nowrap', borderBottom:`2px solid ${isActive?'#00ffc8':'transparent'}`,
                    transition:'all 200ms ease', flexShrink:0, fontFamily:"'Inter',sans-serif",
                  }}>
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* ── RIGHT ZONE ──────────────────────────────────────────── */}
          <div style={{display:'flex', alignItems:'center', gap:'8px', flexShrink:0}}>
            {/* Live indicator */}
            <div style={{display:'flex', alignItems:'center', gap:'6px', padding:'4px 10px', background:'rgba(0,255,200,0.06)', border:'1px solid rgba(0,255,200,0.15)', borderRadius:'20px', marginRight:'4px'}}>
              <div className="live-dot" style={{width:'6px',height:'6px'}}/>
              <span style={{fontSize:'9px', fontWeight:800, color:'#00ffc8', letterSpacing:'0.1em', fontFamily:"'JetBrains Mono',monospace"}}>LIVE</span>
            </div>

            {/* Search */}
            <button onClick={()=>setSearchOverlayOpen(true)}
              style={{display:'flex',alignItems:'center',gap:'8px',padding:'6px 12px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'8px',cursor:'pointer',color:'rgba(232,244,248,0.5)',transition:'all 150ms ease',fontFamily:"'Inter',sans-serif",fontSize:'12px'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(0,255,200,0.3)';e.currentTarget.style.color='#00ffc8';e.currentTarget.style.background='rgba(0,255,200,0.04)';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.07)';e.currentTarget.style.color='rgba(232,244,248,0.5)';e.currentTarget.style.background='rgba(255,255,255,0.04)';}}>
              <Search size={13}/>
              <span>Search</span>
              <span style={{padding:'1px 6px',background:'rgba(255,255,255,0.06)',borderRadius:'4px',fontSize:'10px',color:'rgba(232,244,248,0.3)'}}>⌘K</span>
            </button>
            <SearchOverlay open={searchOverlayOpen} onClose={()=>setSearchOverlayOpen(false)}/>

            {/* Notifications */}
            <Link href="/alerts" style={{position:'relative',width:'34px',height:'34px',borderRadius:'8px',background:'rgba(13,29,48,0.7)',border:'1px solid rgba(255,255,255,0.07)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(232,244,248,0.6)',textDecoration:'none',transition:'all 150ms ease'}}
              onMouseEnter={(e:any)=>{e.currentTarget.style.borderColor='rgba(255,68,102,0.4)';e.currentTarget.style.color='#ff4466';}}
              onMouseLeave={(e:any)=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.07)';e.currentTarget.style.color='rgba(232,244,248,0.6)';}}>
              <Bell size={14}/>
              <span style={{position:'absolute',top:'6px',right:'6px',width:'6px',height:'6px',borderRadius:'50%',background:'#ff4466',border:'1px solid rgba(2,12,20,0.8)',boxShadow:'0 0 6px rgba(255,68,102,0.8)'}}/>
            </Link>

            {/* Auth CTAs */}
            <Link href="/settings"
              style={{width:'34px',height:'34px',borderRadius:'8px',background:'rgba(13,29,48,0.7)',border:'1px solid rgba(255,255,255,0.07)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(232,244,248,0.5)',textDecoration:'none',transition:'all 150ms ease',fontSize:'14px'}}
              onMouseEnter={(e:any)=>{e.currentTarget.style.borderColor='rgba(0,255,200,0.3)';e.currentTarget.style.color='#00ffc8';}}
              onMouseLeave={(e:any)=>{e.currentTarget.style.borderColor='rgba(255,255,255,0.07)';e.currentTarget.style.color='rgba(232,244,248,0.5)';}}>
              ⚙
            </Link>
            <Link href="/auth/login"
              style={{padding:'7px 14px',background:'transparent',border:'1px solid rgba(232,244,248,0.12)',borderRadius:'7px',textDecoration:'none',fontSize:'12px',fontWeight:600,color:'rgba(232,244,248,0.7)',letterSpacing:'0.02em',transition:'all 150ms ease'}}
              onMouseEnter={(e:any)=>{e.target.style.borderColor='rgba(0,255,200,0.3)';e.target.style.color='#00ffc8';}}
              onMouseLeave={(e:any)=>{e.target.style.borderColor='rgba(232,244,248,0.12)';e.target.style.color='rgba(232,244,248,0.7)';}}>
              Sign In
            </Link>
            <Link href="/register"
              style={{padding:'7px 16px',background:'linear-gradient(135deg,#00ffc8,#00c49a)',border:'none',borderRadius:'7px',textDecoration:'none',fontSize:'12px',fontWeight:800,color:'#020c14',letterSpacing:'0.02em',boxShadow:'0 4px 16px rgba(0,255,200,0.3)',transition:'all 150ms ease',whiteSpace:'nowrap'}}
              onMouseEnter={(e:any)=>{e.target.style.boxShadow='0 6px 24px rgba(0,255,200,0.5)';e.target.style.transform='translateY(-1px)';}}
              onMouseLeave={(e:any)=>{e.target.style.boxShadow='0 4px 16px rgba(0,255,200,0.3)';e.target.style.transform='none';}}>
              Free Trial
            </Link>

            {/* Mobile hamburger */}
            <button onClick={()=>setMenuOpen(!menuOpen)}
              style={{display:'none',width:'34px',height:'34px',borderRadius:'8px',background:'rgba(13,29,48,0.7)',border:'1px solid rgba(255,255,255,0.07)',cursor:'pointer',alignItems:'center',justifyContent:'center',color:'rgba(232,244,248,0.7)'}}>
              {menuOpen?<X size={16}/>:<Menu size={16}/>}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div style={{background:'rgba(6,15,26,0.98)',borderTop:'1px solid rgba(0,255,200,0.1)',padding:'12px 16px',backdropFilter:'blur(20px)'}}>
            {NAV_ITEMS.map(item=>(
              item.children ? item.children.map(c=>(
                <Link key={c.href} href={c.href} onClick={()=>setMenuOpen(false)}
                  style={{display:'block',padding:'10px 12px',fontSize:'13px',color:'rgba(232,244,248,0.8)',textDecoration:'none',borderRadius:'8px'}}>
                  {c.label}
                </Link>
              )) : (
                <Link key={item.href} href={item.href} onClick={()=>setMenuOpen(false)}
                  style={{display:'block',padding:'10px 12px',fontSize:'13px',color:'rgba(232,244,248,0.8)',textDecoration:'none',borderRadius:'8px'}}>
                  {item.label}
                </Link>
              )
            ))}
            <div style={{display:'flex',gap:'8px',padding:'10px 0',borderTop:'1px solid rgba(255,255,255,0.06)',marginTop:'8px'}}>
              <Link href="/auth/login" style={{flex:1,padding:'9px',textAlign:'center',background:'rgba(255,255,255,0.06)',borderRadius:'7px',textDecoration:'none',fontSize:'12px',fontWeight:600,color:'rgba(232,244,248,0.8)'}}>Sign In</Link>
              <Link href="/register" style={{flex:1,padding:'9px',textAlign:'center',background:'linear-gradient(135deg,#00ffc8,#00c49a)',borderRadius:'7px',textDecoration:'none',fontSize:'12px',fontWeight:800,color:'#020c14'}}>Free Trial</Link>
            </div>
          </div>
        )}
      </nav>
      <style>{`
        @keyframes livePulse{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(0,255,200,0.4)}50%{opacity:0.7;box-shadow:0 0 0 6px rgba(0,255,200,0)}}
        @keyframes liveRing{0%{transform:scale(1);opacity:0.8}100%{transform:scale(2.5);opacity:0}}
        .live-dot{border-radius:50%;background:#00ffc8;position:relative;animation:livePulse 2s ease-in-out infinite}
        .live-dot::after{content:'';position:absolute;inset:-2px;border-radius:50%;border:1.5px solid #00ffc8;animation:liveRing 1.5s ease-out infinite}
      `}</style>
    </>
  );
}
