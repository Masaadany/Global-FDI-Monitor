'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Search, X, Menu, Zap } from 'lucide-react';

const NAV = [
  { label:'Dashboard',          href:'/dashboard' },
  { label:'Investment Analysis',href:'/investment-analysis' },
  { label:'Market Signals',     href:'/signals' },
  { label:'GFR Ranking',        href:'/gfr' },
  { label:'Mission Planning',   href:'/pmp' },
  { label:'Publications',       href:'/publications' },
  { label:'Pricing',            href:'/pricing' },
];

export default function NavBar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{background:'#0f1e2a',borderBottom:'1px solid rgba(46,204,113,0.12)',position:'sticky',top:0,zIndex:200,backdropFilter:'blur(20px)'}}>
      <div style={{maxWidth:'1440px',margin:'0 auto',padding:'0 20px',display:'flex',alignItems:'center',height:'60px',gap:0,position:'relative'}}>
        
        {/* Logo */}
        <Link href="/" style={{textDecoration:'none',marginRight:'28px',flexShrink:0,display:'flex',alignItems:'center',gap:'9px'}}>
          <svg width="30" height="30" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" stroke="#2ecc71" strokeWidth="1.5" opacity="0.4"/>
            <circle cx="16" cy="16" r="10" stroke="#2ecc71" strokeWidth="1" opacity="0.6"/>
            <ellipse cx="16" cy="16" rx="5" ry="14" stroke="#2ecc71" strokeWidth="1" opacity="0.5"/>
            <line x1="2" y1="16" x2="30" y2="16" stroke="#2ecc71" strokeWidth="0.75" opacity="0.4"/>
            <path d="M16 26 L20 14 L16 6" stroke="#2ecc71" strokeWidth="2" strokeLinecap="round" fill="none"/>
            <circle cx="20" cy="14" r="2.5" fill="#2ecc71"/>
          </svg>
          <span style={{fontSize:'13px',fontWeight:900,letterSpacing:'0.05em'}}>
            <span style={{color:'white'}}>GLOBAL </span>
            <span style={{color:'#2ecc71'}}>FDI</span>
            <span style={{color:'white'}}> MONITOR</span>
          </span>
        </Link>

        {/* Nav Links — hidden on mobile */}
        <div style={{display:'flex',flex:1,overflowX:'auto',msOverflowStyle:'none',scrollbarWidth:'none'} as React.CSSProperties}>
          {NAV.map(({label,href})=>(
            <Link key={href} href={href}
              style={{padding:'0 11px',fontSize:'12px',fontWeight:500,color:'rgba(255,255,255,0.7)',textDecoration:'none',
                height:'60px',display:'flex',alignItems:'center',whiteSpace:'nowrap',
                borderBottom:'2px solid transparent',transition:'all 0.15s',flexShrink:0}}>
              {label}
            </Link>
          ))}
        </div>

        {/* Right CTA zone */}
        <div style={{display:'flex',alignItems:'center',gap:'6px',flexShrink:0,marginLeft:'8px'}}>
          {/* Live signals indicator */}
          <div style={{display:'flex',alignItems:'center',gap:'5px',padding:'4px 10px',background:'rgba(46,204,113,0.08)',borderRadius:'20px',border:'1px solid rgba(46,204,113,0.2)',marginRight:'4px'}}>
            <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'#2ecc71',display:'inline-block',animation:'pulse 2s infinite'}}/>
            <span style={{fontSize:'10px',fontWeight:700,color:'#2ecc71'}}>LIVE</span>
          </div>

          {/* Search */}
          {searchOpen ? (
            <div style={{display:'flex',alignItems:'center',gap:'6px',background:'rgba(255,255,255,0.08)',borderRadius:'8px',padding:'6px 12px',border:'1px solid rgba(46,204,113,0.3)'}}>
              <Search size={12} color="#2ecc71"/>
              <input autoFocus value={query} onChange={e=>setQuery(e.target.value)}
                placeholder="Countries, sectors, signals..."
                style={{background:'transparent',border:'none',outline:'none',color:'white',fontSize:'12px',width:'180px',fontFamily:'inherit'}}
                onKeyDown={e=>{if(e.key==='Escape'){setSearchOpen(false);setQuery('');}}}/>
              <button onClick={()=>{setSearchOpen(false);setQuery('');}} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.4)',padding:0}}><X size={13}/></button>
            </div>
          ) : (
            <button onClick={()=>setSearchOpen(true)} style={{width:'34px',height:'34px',borderRadius:'8px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,0.7)'}}>
              <Search size={14}/>
            </button>
          )}

          {/* Sign in */}
          <Link href="/auth/login" style={{padding:'7px 14px',background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:'8px',textDecoration:'none',fontSize:'12px',fontWeight:600,color:'rgba(255,255,255,0.8)',whiteSpace:'nowrap'}}>
            Sign In
          </Link>

          {/* Start Trial CTA */}
          <Link href="/register" style={{padding:'7px 14px',background:'#2ecc71',borderRadius:'8px',textDecoration:'none',fontSize:'12px',fontWeight:800,color:'#0f1e2a',whiteSpace:'nowrap'}}>
            Free Trial
          </Link>

          {/* Mobile menu */}
          <button onClick={()=>setMenuOpen(!menuOpen)} style={{display:'none',width:'34px',height:'34px',borderRadius:'8px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',cursor:'pointer',alignItems:'center',justifyContent:'center',color:'white'}}>
            {menuOpen?<X size={16}/>:<Menu size={16}/>}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div style={{background:'#1a2c3e',borderTop:'1px solid rgba(46,204,113,0.1)',padding:'12px 20px',display:'flex',flexDirection:'column',gap:'4px'}}>
          {NAV.map(({label,href})=>(
            <Link key={href} href={href} onClick={()=>setMenuOpen(false)}
              style={{padding:'10px 12px',fontSize:'13px',fontWeight:500,color:'rgba(255,255,255,0.8)',textDecoration:'none',borderRadius:'8px',display:'block'}}>
              {label}
            </Link>
          ))}
          <div style={{borderTop:'1px solid rgba(255,255,255,0.07)',marginTop:'8px',paddingTop:'8px',display:'flex',gap:'8px'}}>
            <Link href="/auth/login" style={{flex:1,padding:'9px',textAlign:'center',background:'rgba(255,255,255,0.07)',borderRadius:'8px',textDecoration:'none',fontSize:'12px',fontWeight:600,color:'white'}}>Sign In</Link>
            <Link href="/register" style={{flex:1,padding:'9px',textAlign:'center',background:'#2ecc71',borderRadius:'8px',textDecoration:'none',fontSize:'12px',fontWeight:800,color:'#0f1e2a'}}>Free Trial</Link>
          </div>
        </div>
      )}

      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </nav>
  );
}
