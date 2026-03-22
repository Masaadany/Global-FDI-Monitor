'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, ChevronDown, Search, Globe } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Home',                             href: '/' },
  { label: 'About Us',                         href: '/about' },
  { label: 'Dashboard',                        href: '/dashboard' },
  { label: 'Benchmark & Impact',               href: '/investment-analysis' },
  { label: 'Foresight & Scenario',             href: '/scenario-planner' },
  { label: 'Mission Planning',                 href: '/pmp' },
  { label: 'Custom Reports',                   href: '/reports' },
  { label: 'Resources',                        href: '/publications' },
  { label: 'Contact Us',                       href: '/contact' },
]

export function Header({ dark = false }: { dark?: boolean }) {
  const pathname = usePathname()
  const [scrolled, setScrolled]   = useState(false)
  const [mobile,   setMobile]     = useState(false)
  const [search,   setSearch]     = useState('')
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  const fg   = dark ? 'rgba(255,255,255,0.55)' : '#5A6874'
  const fgHv = dark ? 'rgba(255,255,255,0.95)' : '#1A2C3E'
  const act  = dark ? '#2ECC71'                 : '#2ECC71'
  const bg   = dark ? 'transparent' : scrolled ? 'rgba(255,255,255,0.98)' : '#FFFFFF'
  const bd   = dark ? 'none' : '1px solid #ECF0F1'

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: bg, borderBottom: bd,
      backdropFilter: scrolled && !dark ? 'blur(12px)' : 'none',
      transition: 'all 0.3s ease',
      boxShadow: scrolled && !dark ? '0 2px 12px rgba(0,0,0,0.06)' : 'none',
    }}>
      <div style={{ maxWidth: 1920, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', gap: 8 }}>

        {/* ── LOGO (left) ── */}
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0, marginRight: 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{ fontSize: 18, fontWeight: 900, color: dark ? '#FFFFFF' : '#1A2C3E', letterSpacing: '-0.03em', lineHeight: 1 }}>FDI</span>
            <span style={{ fontSize: 8, fontWeight: 700, color: dark ? 'rgba(255,255,255,0.35)' : '#5A6874', letterSpacing: '0.26em', textTransform: 'uppercase', marginTop: 1 }}>MONITOR</span>
          </div>
        </Link>

        {/* ── NAV CENTER (desktop) ── */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 0, flex: 1, justifyContent: 'center', flexWrap: 'nowrap', overflow: 'hidden' }}>
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} style={{
                padding: '6px 11px', fontSize: 12.5, fontWeight: isActive ? 700 : 500,
                color: isActive ? act : fg, textDecoration: 'none',
                borderRadius: 7, transition: 'color 0.15s',
                whiteSpace: 'nowrap', letterSpacing: '0.005em',
                borderBottom: isActive ? `2px solid ${act}` : '2px solid transparent',
              }}
              onMouseEnter={e => { (e.currentTarget as any).style.color = fgHv }}
              onMouseLeave={e => { (e.currentTarget as any).style.color = isActive ? act : fg }}>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* ── RIGHT: Search + Lang + Auth ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0, marginLeft: 8 }}>
          {/* Search */}
          {searchOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input autoFocus value={search} onChange={e => setSearch(e.target.value)}
                onBlur={() => { if (!search) setSearchOpen(false) }}
                placeholder="Search..." style={{
                  width: 160, padding: '5px 10px', border: '1px solid #ECF0F1',
                  borderRadius: 8, fontSize: 12, fontFamily: 'Inter,sans-serif',
                  outline: 'none', background: 'white', color: '#1A2C3E',
                }}/>
              <button onClick={() => { setSearchOpen(false); setSearch('') }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: fg, padding: 2 }}>
                <X size={14} />
              </button>
            </div>
          ) : (
            <button onClick={() => setSearchOpen(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: fg, padding: '5px 7px', borderRadius: 7, transition: 'color 0.15s', display: 'flex', alignItems: 'center' }}
              onMouseEnter={e => { (e.currentTarget as any).style.color = fgHv }}
              onMouseLeave={e => { (e.currentTarget as any).style.color = fg }}>
              <Search size={15} />
            </button>
          )}

          {/* Language */}
          <button style={{
            display: 'flex', alignItems: 'center', gap: 4, padding: '5px 9px',
            background: 'none', border: dark ? '1px solid rgba(255,255,255,0.12)' : '1px solid #ECF0F1',
            borderRadius: 7, cursor: 'pointer', fontSize: 11, fontWeight: 600,
            color: fg, transition: 'all 0.15s', fontFamily: 'Inter,sans-serif',
          }}
          onMouseEnter={e => { (e.currentTarget as any).style.color = fgHv }}
          onMouseLeave={e => { (e.currentTarget as any).style.color = fg }}>
            <Globe size={11} /> EN
          </button>

          {/* Sign In */}
          <Link href="/auth/login" style={{
            padding: '6px 12px', fontSize: 12, fontWeight: 500,
            color: fg, textDecoration: 'none', borderRadius: 7,
            transition: 'color 0.15s', whiteSpace: 'nowrap',
          }}
          onMouseEnter={e => { (e.currentTarget as any).style.color = fgHv }}
          onMouseLeave={e => { (e.currentTarget as any).style.color = fg }}>
            Sign In
          </Link>

          {/* Sign Up */}
          <Link href="/register" style={{
            padding: '7px 16px', fontSize: 12, fontWeight: 700,
            color: '#FFFFFF', textDecoration: 'none', borderRadius: 8, whiteSpace: 'nowrap',
            background: '#2ECC71', boxShadow: '0 3px 10px rgba(46,204,113,0.3)',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => { (e.currentTarget as any).style.transform = 'translateY(-1px)'; (e.currentTarget as any).style.boxShadow = '0 6px 16px rgba(46,204,113,0.4)' }}
          onMouseLeave={e => { (e.currentTarget as any).style.transform = 'none'; (e.currentTarget as any).style.boxShadow = '0 3px 10px rgba(46,204,113,0.3)' }}>
            Sign Up
          </Link>

          {/* Mobile toggle */}
          <button onClick={() => setMobile(!mobile)} className="lg-hide"
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: dark ? 'white' : '#1A2C3E', padding: 4, display: 'none' }}>
            {mobile ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobile && (
        <div style={{ background: 'white', borderTop: '1px solid #ECF0F1', padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href} onClick={() => setMobile(false)}
              style={{ padding: '10px 12px', fontSize: 13, fontWeight: 500, color: '#5A6874', textDecoration: 'none', borderRadius: 8, fontFamily: 'Inter,sans-serif' }}>
              {item.label}
            </Link>
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <Link href="/auth/login" style={{ flex: 1, textAlign: 'center', padding: '9px', border: '1px solid #ECF0F1', borderRadius: 8, textDecoration: 'none', fontSize: 12, fontWeight: 500, color: '#5A6874' }}>Sign In</Link>
            <Link href="/register" style={{ flex: 1, textAlign: 'center', padding: '9px', borderRadius: 8, textDecoration: 'none', fontSize: 12, fontWeight: 700, color: 'white', background: '#2ECC71' }}>Sign Up</Link>
          </div>
        </div>
      )}

      <style>{`
        @media(max-width:1100px){nav{display:none!important}.lg-hide{display:flex!important}}
        @media(min-width:1101px){.lg-hide{display:none!important}}
      `}</style>
    </header>
  )
}
