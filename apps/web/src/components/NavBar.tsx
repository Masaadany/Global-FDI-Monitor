'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SearchOverlay } from './GlobalSearch';
import { Search, Menu, X, ChevronDown } from 'lucide-react';

const NAV = [
  { label: 'Dashboard', href: '/dashboard' },
  {
    label: 'Intelligence', href: '#',
    children: [
      { label: '📡 Market Signals',     href: '/signals',       desc: 'Live signal feed' },
      { label: '🏆 GFR Ranking',        href: '/gfr',           desc: '25 economies · 6 dims' },
      { label: '🌍 Country Profiles',   href: '/country/MYS',   desc: '23+ deep-dives' },
      { label: '🏭 Sector Monitor',     href: '/sectors',       desc: '9 sectors tracked' },
      { label: '🔀 Corridor Intel',     href: '/corridors',     desc: '12 bilateral routes' },
      { label: '📈 Market Insights',    href: '/insights',      desc: 'Macro trends' },
      { label: '⭐ Watchlists',          href: '/watchlists',    desc: 'Track economies' },
      { label: '📊 Agent Report',        href: '/pipeline-report', desc: '6-stage pipeline data' },
    ],
  },
  {
    label: 'Tools', href: '#',
    children: [
      { label: '🎯 Mission Planning',   href: '/pmp',              desc: '4 guided workflows' },
      { label: '🔬 Scenario Planner',   href: '/scenario-planner', desc: 'What-if modelling' },
      { label: '📋 Pipeline Tracker',   href: '/pipeline',         desc: 'Deal pipeline board' },
      { label: '📄 PDF Reports',        href: '/reports',          desc: 'AI reports' },
    ],
  },
  { label: 'Publications', href: '/publications' },
  { label: 'About', href: '/about' },
];

export default function NavBar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [dropdown, setDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); }
    }
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 500,
        background: scrolled ? 'rgba(255,255,255,0.95)' : '#FFFFFF',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: '1px solid #ECF0F1',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.06)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ maxWidth: '1540px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', height: '64px', gap: '8px' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0, marginRight: '16px' }}>
            <svg width="32" height="32" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="14" stroke="#1A2C3E" strokeWidth="2" fill="none"/>
              <ellipse cx="16" cy="16" rx="7" ry="14" stroke="#1A2C3E" strokeWidth="1.5" fill="none"/>
              <line x1="2" y1="16" x2="30" y2="16" stroke="#1A2C3E" strokeWidth="1.5"/>
              <circle cx="22" cy="10" r="4" fill="#2ECC71"/>
              <path d="M20 10 L22 8 L24 10" fill="#2ECC71"/>
            </svg>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 900, color: '#1A2C3E', letterSpacing: '0.05em', lineHeight: 1 }}>GLOBAL FDI</div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#2ECC71', letterSpacing: '0.12em', lineHeight: 1 }}>MONITOR</div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1 }}>
            {NAV.map(item => (
              <div key={item.label} style={{ position: 'relative' }}
                onMouseEnter={() => item.children && setDropdown(item.label)}
                onMouseLeave={() => setDropdown(null)}>
                {item.children ? (
                  <button style={{
                    display: 'flex', alignItems: 'center', gap: '4px',
                    padding: '8px 14px', background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: '13px', fontWeight: 600, color: '#1A2C3E',
                    borderRadius: '8px', transition: 'all 0.15s',
                    background: dropdown === item.label ? 'rgba(26,44,62,0.06)' : 'transparent',
                  } as any}>
                    {item.label} <ChevronDown size={12} style={{ transition: 'transform 0.2s', transform: dropdown === item.label ? 'rotate(180deg)' : 'none' }}/>
                  </button>
                ) : (
                  <Link href={item.href} style={{
                    display: 'flex', alignItems: 'center', padding: '8px 14px',
                    fontSize: '13px', fontWeight: 600, color: pathname === item.href ? '#2ECC71' : '#1A2C3E',
                    textDecoration: 'none', borderRadius: '8px', transition: 'all 0.15s',
                    background: pathname === item.href ? 'rgba(46,204,113,0.08)' : 'transparent',
                  }}>{item.label}</Link>
                )}

                {/* Dropdown */}
                {item.children && dropdown === item.label && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, marginTop: '4px',
                    background: '#FFFFFF', borderRadius: '16px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.12)', border: '1px solid #ECF0F1',
                    padding: '8px', minWidth: '240px', zIndex: 1000,
                  }}>
                    {item.children.map(child => (
                      <Link key={child.label} href={child.href} style={{ display: 'block', padding: '10px 14px', borderRadius: '10px', textDecoration: 'none', transition: 'background 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#F8F9FA'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#1A2C3E' }}>{child.label}</div>
                        <div style={{ fontSize: '11px', color: '#5A6874', marginTop: '1px' }}>{child.desc}</div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button onClick={() => setSearchOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 12px', background: '#F8F9FA', border: '1px solid #ECF0F1', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', color: '#5A6874', fontFamily: 'Inter,sans-serif', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#2ECC71'; e.currentTarget.style.color = '#1A2C3E'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#ECF0F1'; e.currentTarget.style.color = '#5A6874'; }}>
              <Search size={13}/> Search <span style={{ padding: '1px 5px', background: '#ECF0F1', borderRadius: '4px', fontSize: '10px' }}>⌘K</span>
            </button>
            <Link href="/auth/login" style={{ padding: '8px 18px', background: 'transparent', border: '1.5px solid #1A2C3E', borderRadius: '50px', textDecoration: 'none', fontSize: '13px', fontWeight: 600, color: '#1A2C3E', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as any).style.background = '#1A2C3E'; (e.currentTarget as any).style.color = '#fff'; }}
              onMouseLeave={e => { (e.currentTarget as any).style.background = 'transparent'; (e.currentTarget as any).style.color = '#1A2C3E'; }}>
              Sign In
            </Link>
            <Link href="/register" className="btn-primary" style={{ padding: '8px 20px', borderRadius: '50px', background: '#2ECC71', color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: 700, boxShadow: '0 4px 14px rgba(46,204,113,0.3)', display: 'flex', alignItems: 'center' }}>
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)}/>
    </>
  );
}
