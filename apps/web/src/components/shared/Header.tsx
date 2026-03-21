'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Search, Menu, X, ChevronDown } from 'lucide-react'

const NAV = [
  { href:'/dashboard', label:'Dashboard' },
  { label:'Intelligence', children:[
    { href:'/investment-analysis', label:'📊 Investment Analysis' },
    { href:'/gfr', label:'🏆 GFR Ranking' },
    { href:'/signals', label:'⚡ Market Signals' },
    { href:'/sectors', label:'🏭 Sector Monitor' },
    { href:'/corridors', label:'🔀 Corridor Intel' },
    { href:'/insights', label:'📈 Market Insights' },
    { href:'/watchlists', label:'⭐ Watchlists' },
  ]},
  { label:'Tools', children:[
    { href:'/pmp', label:'🎯 Mission Planning' },
    { href:'/scenario-planner', label:'🔬 Scenario Planner' },
    { href:'/pipeline', label:'📋 Pipeline Tracker' },
    { href:'/reports', label:'📄 PDF Reports' },
  ]},
  { href:'/publications', label:'Publications' },
  { href:'/about', label:'About' },
]

export function Header() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [dropdown, setDropdown] = useState<string|null>(null)
  const [mobile, setMobile] = useState(false)

  useEffect(()=>{
    const h = ()=>setScrolled(window.scrollY>20)
    window.addEventListener('scroll',h)
    return ()=>window.removeEventListener('scroll',h)
  },[])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled?'bg-white/98 backdrop-blur-md shadow-sm':'bg-white/95'} border-b border-border-light`}>
      <div className="max-w-[1540px] mx-auto px-6 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0 mr-4">
          <svg width="32" height="32" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="14" stroke="#1A2C3E" strokeWidth="2" fill="none"/>
            <ellipse cx="16" cy="16" rx="7" ry="14" stroke="#1A2C3E" strokeWidth="1.5" fill="none"/>
            <line x1="2" y1="16" x2="30" y2="16" stroke="#1A2C3E" strokeWidth="1.5"/>
            <circle cx="22" cy="10" r="4" fill="#2ECC71"/>
          </svg>
          <div>
            <div className="text-xs font-black text-primary-dark tracking-wider leading-none">GLOBAL FDI</div>
            <div className="text-[10px] font-bold text-primary-teal tracking-widest leading-none">MONITOR</div>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 flex-1">
          {NAV.map(item=>(
            <div key={item.label||item.href} className="relative"
              onMouseEnter={()=>item.children&&setDropdown(item.label||'')}
              onMouseLeave={()=>setDropdown(null)}>
              {item.children ? (
                <button className={`flex items-center gap-1 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${dropdown===item.label?'bg-green-50 text-primary-teal':'text-text-secondary hover:text-primary-dark'}`}>
                  {item.label} <ChevronDown size={12} className={`transition-transform ${dropdown===item.label?'rotate-180':''}`}/>
                </button>
              ):(
                <Link href={item.href||'#'} className={`flex items-center px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${pathname===item.href?'bg-green-50 text-primary-teal':'text-text-secondary hover:text-primary-dark'}`}>
                  {item.label}
                </Link>
              )}
              {item.children && dropdown===item.label && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-2xl shadow-xl border border-border-light p-2 min-w-[220px] z-50">
                  {item.children.map(child=>(
                    <Link key={child.href} href={child.href} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-text-secondary hover:bg-background-offwhite hover:text-primary-dark transition-all">
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2 ml-auto">
          <Link href="/auth/login" className="hidden md:flex px-4 py-2 text-sm font-medium text-text-secondary hover:text-primary-dark transition-all rounded-full border border-transparent hover:border-border-light">
            Sign In
          </Link>
          <Link href="/register" className="btn-primary hidden md:flex">
            Sign Up
          </Link>
          <button onClick={()=>setMobile(!mobile)} className="lg:hidden p-2">
            {mobile?<X size={20}/>:<Menu size={20}/>}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobile && (
        <div className="lg:hidden bg-white border-t border-border-light px-6 py-4 space-y-2">
          {NAV.map(item=>(
            item.children ? (
              <div key={item.label}>
                <div className="text-xs font-bold text-text-light uppercase tracking-wider px-3 py-1">{item.label}</div>
                {item.children.map(child=>(
                  <Link key={child.href} href={child.href} onClick={()=>setMobile(false)} className="block px-3 py-2 text-sm text-text-secondary hover:text-primary-teal">{child.label}</Link>
                ))}
              </div>
            ):(
              <Link key={item.href} href={item.href||'#'} onClick={()=>setMobile(false)} className="block px-3 py-2 text-sm font-medium text-text-primary hover:text-primary-teal">{item.label}</Link>
            )
          ))}
          <div className="flex gap-3 pt-3 border-t border-border-light">
            <Link href="/auth/login" className="btn-outline flex-1 text-center">Sign In</Link>
            <Link href="/register" className="btn-primary flex-1 text-center">Sign Up</Link>
          </div>
        </div>
      )}
    </header>
  )
}
