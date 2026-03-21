'use client'
import Link from 'next/link'
import { FDILogo } from './FDILogo'

const COLS = [
  { title:'Platform', links:[
    {l:'Dashboard',h:'/dashboard'},{l:'Investment Analysis',h:'/investment-analysis'},
    {l:'Market Signals',h:'/signals'},{l:'GFR Ranking',h:'/gfr'},
    {l:'Sector Monitor',h:'/sectors'},{l:'Corridor Intel',h:'/corridors'},
    {l:'Pipeline Tracker',h:'/pipeline'},{l:'Scenario Planner',h:'/scenario-planner'},
  ]},
  { title:'Intelligence', links:[
    {l:'Country Profiles',h:'/country/SGP'},{l:'Market Insights',h:'/insights'},
    {l:'Watchlists',h:'/watchlists'},{l:'Alerts Centre',h:'/alerts'},
    {l:'Publications',h:'/publications'},{l:'Data Sources',h:'/sources'},
    {l:'GOSA Methodology',h:'/about'},{l:'Agent Pipeline Report',h:'/pipeline-report'},
  ]},
  { title:'Company', links:[
    {l:'About Us',h:'/about'},{l:'Contact',h:'/contact'},
    {l:'FAQ',h:'/faq'},{l:'API Documentation',h:'/api-docs'},
    {l:'Privacy Policy',h:'/privacy'},{l:'Terms of Service',h:'/terms'},
  ]},
]

export function Footer() {
  return (
    <footer className="bg-primary-dark text-white/70">
      <div className="max-w-[1540px] mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Logo col */}
          <div>
            {/* FDI MONITOR text logo — matches attached brand */}
            <div className="flex flex-col mb-4" style={{gap:'0px'}}>
              <span style={{fontFamily:"'Inter',sans-serif",fontSize:'28px',fontWeight:900,color:'#FFFFFF',letterSpacing:'-0.02em',lineHeight:1}}>FDI</span>
              <span style={{fontFamily:"'Inter',sans-serif",fontSize:'13px',fontWeight:800,color:'rgba(255,255,255,0.5)',letterSpacing:'0.22em',lineHeight:1,textTransform:'uppercase'}}>MONITOR</span>
            </div>
            <p className="text-sm leading-relaxed text-white/50 mb-4">Global investment intelligence. Real-time. Verified. Smart.</p>
            <a href="mailto:info@fdimonitor.org" className="text-primary-teal text-sm hover:underline">info@fdimonitor.org</a>
          </div>
          {COLS.map(col=>(
            <div key={col.title}>
              <div className="text-xs font-black text-white/30 uppercase tracking-widest mb-4">{col.title}</div>
              <div className="space-y-2.5">
                {col.links.map(link=>(
                  <Link key={link.l} href={link.h} className="block text-sm text-white/50 hover:text-primary-teal transition-colors">{link.l}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-white/8 pt-6 flex flex-wrap justify-between items-center gap-4">
          <div className="text-xs text-white/30">© 2026 Global FDI Monitor. All rights reserved.</div>
          <div className="flex gap-2 flex-wrap">
            {[['1000+','Sources'],['215+','Economies'],['23+','Profiles'],['9','Sectors']].map(([v,l])=>(
              <div key={l} className="px-3 py-1.5 rounded-full text-xs flex gap-1.5 items-center" style={{background:'rgba(46,204,113,0.08)'}}>
                <span className="font-bold text-primary-teal">{v}</span>
                <span className="text-white/40">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
