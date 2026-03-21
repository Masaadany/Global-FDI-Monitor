'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, ChevronDown, Search } from 'lucide-react'
import { FDILogoHorizontal } from './FDILogo'

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
    { href:'/reports', label:'📄 Export Reports' },
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
      <div className="max-w-[1540px] mx-auto px-6 h-16 flex items-center gap-3">
        {/* Logo */}
        <div className="flex-shrink-0 mr-4">
          <FDILogoHorizontal/>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0.5 flex-1">
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
          {/* Live status */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-green-700 bg-green-50 border border-green-200">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"/>
            LIVE
          </div>
          <Link href="/auth/login" className="hidden md:flex px-4 py-2 text-sm font-medium text-text-secondary hover:text-primary-dark transition-all rounded-full border border-transparent hover:border-border-light">
            Sign In
          </Link>
          <Link href="/register" className="hidden md:flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold text-white transition-all" style={{background:'#1A2C3E',boxShadow:'0 2px 8px rgba(26,44,62,0.25)'}}>
            Sign Up
          </Link>
          <button onClick={()=>setMobile(!mobile)} className="lg:hidden p-2 text-text-primary">
            {mobile?<X size={20}/>:<Menu size={20}/>}
          </button>
        </div>
      </div>

      {/* Mobile */}
      {mobile && (
        <div className="lg:hidden bg-white border-t border-border-light px-6 py-4 space-y-2 shadow-lg">
          {NAV.map(item=>(
            item.children ? (
              <div key={item.label}>
                <div className="text-[10px] font-black text-text-light uppercase tracking-wider px-3 py-2">{item.label}</div>
                {item.children.map(child=>(
                  <Link key={child.href} href={child.href} onClick={()=>setMobile(false)}
                    className="block px-3 py-2.5 text-sm text-text-secondary hover:text-primary-teal rounded-lg hover:bg-green-50 transition-all">{child.label}</Link>
                ))}
              </div>
            ):(
              <Link key={item.href} href={item.href||'#'} onClick={()=>setMobile(false)}
                className="block px-3 py-2.5 text-sm font-semibold text-text-primary hover:text-primary-teal rounded-lg hover:bg-green-50 transition-all">{item.label}</Link>
            )
          ))}
          <div className="flex gap-3 pt-3 border-t border-border-light">
            <Link href="/auth/login" className="flex-1 text-center py-2.5 text-sm font-medium border border-border-light rounded-full text-text-primary hover:border-primary-dark">Sign In</Link>
            <Link href="/register" className="flex-1 text-center py-2.5 text-sm font-bold rounded-full text-white" style={{background:'#1A2C3E'}}>Sign Up</Link>
          </div>
        </div>
      )}
    </header>
  )
}
