'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Search, X, Menu } from 'lucide-react';

const NAV = [
  {label:'Home', href:'/'},
  {label:'Dashboard', href:'/dashboard'},
  {label:'Investment Analysis', href:'/investment-analysis'},
  {label:'Publications', href:'/publications'},
  {label:'Resources', href:'/about'},
  {label:'Pricing', href:'/pricing'},
];

export default function NavBar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{background:'#0f1e2a',borderBottom:'1px solid rgba(46,204,113,0.12)',position:'sticky',top:0,zIndex:200,backdropFilter:'blur(20px)'}}>
      <div style={{maxWidth:'1440px',margin:'0 auto',padding:'0 24px',display:'flex',alignItems:'center',height:'60px',gap:'0',position:'relative'}}>
        
        {/* Logo */}
        <Link href="/" style={{textDecoration:'none',marginRight:'40px',flexShrink:0,display:'flex',alignItems:'center',gap:'10px'}}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="14" stroke="#2ecc71" strokeWidth="1.5" opacity="0.4"/>
            <circle cx="16" cy="16" r="10" stroke="#2ecc71" strokeWidth="1" opacity="0.6"/>
            <ellipse cx="16" cy="16" rx="5" ry="14" stroke="#2ecc71" strokeWidth="1" opacity="0.5"/>
            <line x1="2" y1="16" x2="30" y2="16" stroke="#2ecc71" strokeWidth="0.75" opacity="0.4"/>
            <path d="M16 26 L20 14 L16 6" stroke="#2ecc71" strokeWidth="2" strokeLinecap="round" fill="none"/>
            <circle cx="20" cy="14" r="2.5" fill="#2ecc71"/>
          </svg>
          <span style={{fontSize:'14px',fontWeight:900,letterSpacing:'0.05em'}}>
            <span style={{color:'white'}}>GLOBAL </span>
            <span style={{color:'#2ecc71'}}>FDI</span>
            <span style={{color:'white'}}> MONITOR</span>
          </span>
        </Link>

        {/* Nav Links */}
        <div style={{display:'flex',flex:1,overflowX:'auto',msOverflowStyle:'none',scrollbarWidth:'none'}}>
          {NAV.map(({label,href})=>(
            <Link key={href} href={href}
              style={{padding:'0 14px',fontSize:'13px',fontWeight:500,color:'rgba(255,255,255,0.7)',textDecoration:'none',
                height:'60px',display:'flex',alignItems:'center',whiteSpace:'nowrap',
                borderBottom:'2px solid transparent',transition:'all 0.15s',flexShrink:0}}>
              {label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div style={{display:'flex',alignItems:'center',gap:'8px',flexShrink:0}}>
          {/* Search */}
          {searchOpen ? (
            <div style={{display:'flex',alignItems:'center',gap:'6px',background:'rgba(255,255,255,0.08)',borderRadius:'8px',padding:'6px 12px',border:'1px solid rgba(46,204,113,0.3)'}}>
              <Search size={13} color="#2ecc71"/>
              <input autoFocus value={query} onChange={e=>setQuery(e.target.value)}
                placeholder="Countries, sectors, signals..."
                style={{background:'transparent',border:'none',outline:'none',color:'white',fontSize:'13px',width:'180px',fontFamily:'inherit'}}/>
              <button onClick={()=>{setSearchOpen(false);setQuery('');}} style={{background:'none',border:'none',cursor:'pointer',color:'rgba(255,255,255,0.5)',padding:'0',display:'flex'}}>
                <X size={13}/>
              </button>
            </div>
          ) : (
            <button onClick={()=>setSearchOpen(true)}
              style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'8px',padding:'7px 12px',cursor:'pointer',color:'rgba(255,255,255,0.6)',display:'flex',alignItems:'center',gap:'6px',fontSize:'12px',fontFamily:'inherit'}}>
              <Search size={13}/><span className="hide-mobile">Search</span>
            </button>
          )}

          {/* LIVE indicator */}
          <div style={{display:'flex',alignItems:'center',gap:'5px',padding:'5px 10px',background:'rgba(46,204,113,0.08)',borderRadius:'20px',border:'1px solid rgba(46,204,113,0.2)'}}>
            <span className="live-dot" style={{width:'6px',height:'6px',borderRadius:'50%',background:'#2ecc71',display:'inline-block',animation:'livePulse 2s infinite'}}/>
            <span style={{fontSize:'10px',fontWeight:800,color:'#2ecc71',letterSpacing:'0.08em'}}>LIVE</span>
          </div>

          <Link href="/auth/login"
            style={{padding:'7px 14px',border:'1px solid rgba(255,255,255,0.2)',color:'rgba(255,255,255,0.85)',borderRadius:'7px',textDecoration:'none',fontSize:'12px',fontWeight:600,transition:'all 0.2s'}}>
            Sign In
          </Link>
          <Link href="/register"
            style={{padding:'7px 16px',background:'#2ecc71',color:'#0f1e2a',borderRadius:'7px',textDecoration:'none',fontSize:'12px',fontWeight:800,transition:'all 0.2s',letterSpacing:'0.02em'}}>
            FREE TRIAL
          </Link>
        </div>
      </div>
    </nav>
  );
}
