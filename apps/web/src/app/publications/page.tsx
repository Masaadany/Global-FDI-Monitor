'use client'
import { BackgroundVideo } from '@/components/shared/BackgroundVideo'
import { CountryFlag } from '@/components/shared/CountryFlag'
import { Download, ExternalLink, ChevronRight } from 'lucide-react'

// ── PUBLICATION DATA WITH RICH COVER SYSTEM ──────────────────────
const PUBLICATIONS = [
  {
    issue:47,
    date:'March 24, 2026',
    title:'ASEAN EV Corridor: $25B Supply Chain Investment',
    subtitle:'Vietnam · Thailand · Malaysia Trilateral Agreement',
    summary:'Samsung SDI, CATL, and LG Energy Solution confirm combined $12B commitment to ASEAN EV corridor. Vietnam\'s VSIP Binh Duong designated primary battery cell manufacturing hub. Thailand\'s EEC to house module assembly. Malaysia\'s Penang FIZ to anchor semiconductor and BMS integration.',
    cover_emoji:'⚡',
    cover_gradient:['#1A2C3E','#2ECC71'],
    cover_theme:'EV',
    countries:['VN','TH','MY'],
    sectors:['EV Battery','Manufacturing','Semiconductors'],
    companies:[{name:'Samsung SDI',domain:'samsungsdi.com'},{name:'CATL',domain:'catl.com'},{name:'LG Energy',domain:'lgenergysolution.com'}],
    pages:24, reads:3847, downloads:892,
    highlight_stat:'+$25B', highlight_label:'Combined FDI Value',
  },
  {
    issue:46,
    date:'March 17, 2026',
    title:"Malaysia's Data Center Boom: $5B+ Investment Pipeline",
    subtitle:'Hyperscalers converge on Klang Valley after 100% FDI clearance',
    summary:'100% FDI cap removal triggers immediate hyperscaler response. Microsoft, Google, and AWS in advanced negotiations. Combined pipeline exceeds $5B in announced intentions within 72 hours of policy change.',
    cover_emoji:'🖥',
    cover_gradient:['#1A2C3E','#3498DB'],
    cover_theme:'DC',
    countries:['MY'],
    sectors:['Data Centers','Digital Economy'],
    companies:[{name:'Microsoft',domain:'microsoft.com'},{name:'Google',domain:'google.com'},{name:'AWS',domain:'amazon.com'}],
    pages:18, reads:5124, downloads:1203,
    highlight_stat:'+$5B+', highlight_label:'Investment Pipeline',
  },
  {
    issue:45,
    date:'March 10, 2026',
    title:'Vietnam Electronics Surge: 34% Export Growth YoY',
    subtitle:'Apple\'s $10B commitment cements China+1 position',
    summary:'Apple announces $10B Vietnam manufacturing expansion covering 6 new supplier relationships. Samsung and Intel simultaneously expand capacity. Electronics exports reach $28B in Q1 2026.',
    cover_emoji:'📱',
    cover_gradient:['#1A2C3E','#9B59B6'],
    cover_theme:'TECH',
    countries:['VN'],
    sectors:['Electronics','Manufacturing'],
    companies:[{name:'Apple',domain:'apple.com'},{name:'Samsung',domain:'samsung.com'},{name:'Intel',domain:'intel.com'}],
    pages:20, reads:4291, downloads:976,
    highlight_stat:'+34%', highlight_label:'Export Growth YoY',
  },
  {
    issue:44,
    date:'March 3, 2026',
    title:'Saudi Arabia Vision 2030: FDI Reform Deep Dive',
    subtitle:'30-day licensing · English courts · 100-year company lifetime',
    summary:'Three landmark reforms land simultaneously: 30-day FDI approval guarantee, English-language commercial courts operational, and 100-year company lifetime certificates. MISA reports 340% increase in FDI applications in first week.',
    cover_emoji:'🏙',
    cover_gradient:['#1A2C3E','#E74C3C'],
    cover_theme:'SA',
    countries:['SA'],
    sectors:['Regulatory Reform','Multi-sector'],
    companies:[{name:'Saudi Aramco',domain:'aramco.com'},{name:'SABIC',domain:'sabic.com'},{name:'NEOM',domain:'neom.com'}],
    pages:22, reads:6183, downloads:1547,
    highlight_stat:'+340%', highlight_label:'FDI Applications Week 1',
  },
  {
    issue:43,
    date:'February 24, 2026',
    title:'UAE AI Infrastructure: The $10B Ecosystem Play',
    subtitle:'Microsoft · Google · Oracle commit to Abu Dhabi AI hub',
    summary:'UAE positions as global AI data center and sovereign AI hub. Three hyperscaler commitments totaling $10B announced in 60 days. G42 emerges as primary local partner. Masdar City expansion adds 500MW renewable capacity.',
    cover_emoji:'🤖',
    cover_gradient:['#1A2C3E','#F1C40F'],
    cover_theme:'AI',
    countries:['AE'],
    sectors:['AI Technology','Digital Economy'],
    companies:[{name:'Microsoft',domain:'microsoft.com'},{name:'Oracle',domain:'oracle.com'},{name:'G42',domain:'g42.ai'}],
    pages:26, reads:7892, downloads:2104,
    highlight_stat:'$10B', highlight_label:'AI Infrastructure Committed',
  },
  {
    issue:42,
    date:'February 17, 2026',
    title:'India Semiconductors: PLI 2.0 Game Changer',
    subtitle:'TSMC · Samsung · Micron — three fabs confirmed',
    summary:'India Semiconductor Mission Phase 2 delivers $2.7B incentive package securing three major fab commitments. First Indian-made semiconductors now scheduled for Q3 2028. Total ecosystem value estimated at $50B over 10 years.',
    cover_emoji:'💾',
    cover_gradient:['#1A2C3E','#E67E22'],
    cover_theme:'CHIP',
    countries:['IN'],
    sectors:['Semiconductors','Manufacturing'],
    companies:[{name:'TSMC',domain:'tsmc.com'},{name:'Samsung',domain:'samsung.com'},{name:'Micron',domain:'micron.com'}],
    pages:28, reads:5674, downloads:1389,
    highlight_stat:'$2.7B', highlight_label:'Incentive Package',
  },
  {
    issue:41,
    date:'February 10, 2026',
    title:'Morocco Green Corridor: Europe\'s New Manufacturing Hub',
    subtitle:'EU-Morocco 0% EV tariff unlocks $8B investment thesis',
    summary:'Morocco emerges as primary EU-accessible manufacturing platform for post-CBAM era. Tanger Med Phase 3 adds 400ha. BYD, Renault, and Stellantis evaluate major facility commitments. Green hydrogen integration pathway confirmed.',
    cover_emoji:'🌿',
    cover_gradient:['#1A2C3E','#27ae60'],
    cover_theme:'GREEN',
    countries:['MA'],
    sectors:['Automotive','Green Energy'],
    companies:[{name:'Renault',domain:'renault.com'},{name:'BYD',domain:'byd.com'},{name:'Stellantis',domain:'stellantis.com'}],
    pages:20, reads:3214, downloads:782,
    highlight_stat:'$8B', highlight_label:'Investment Thesis Value',
  },
]

function PublicationCover({ pub, size='full' }:{ pub:typeof PUBLICATIONS[0]; size?:'full'|'sm' }) {
  const isFull = size==='full'
  return (
    <div className={`relative overflow-hidden flex-shrink-0 ${isFull?'rounded-2xl h-[280px] w-full':'rounded-xl h-[110px] w-[110px]'}`}
      style={{background:`linear-gradient(135deg, ${pub.cover_gradient[0]}, ${pub.cover_gradient[1]})`}}>
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{backgroundImage:'radial-gradient(circle at 70% 30%, white 0%, transparent 50%)',backgroundSize:'100% 100%'}}/>
      {/* Grid lines */}
      <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
        {[10,20,30,40,50,60,70,80,90].map(x=><line key={x} x1={x} y1="0" x2={x} y2="100" stroke="white" strokeWidth="0.5"/>)}
        {[10,20,30,40,50,60,70,80,90].map(y=><line key={y} x1="0" y1={y} x2="100" y2={y} stroke="white" strokeWidth="0.5"/>)}
      </svg>
      {/* Emoji */}
      <div className={`absolute ${isFull?'text-7xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-25':'text-4xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30'}`}>
        {pub.cover_emoji}
      </div>
      {/* Issue number + FDI branding */}
      {isFull && (
        <>
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
            <div>
              <div className="text-[9px] font-black text-white/60 uppercase tracking-widest">GLOBAL FDI MONITOR</div>
              <div className="text-xs font-bold text-white/80">Weekly Intelligence Brief</div>
            </div>
            <div className="text-right">
              <div className="text-[9px] text-white/50">Issue #{pub.issue}</div>
              <div className="text-[10px] font-bold text-white/70">{pub.date}</div>
            </div>
          </div>
          <div className="absolute bottom-4 left-4 right-4">
            <div className="text-xl font-black text-white leading-tight mb-1">{pub.title}</div>
            <div className="text-xs text-white/60">{pub.subtitle}</div>
          </div>
        </>
      )}
      {/* Small: just issue number */}
      {!isFull && (
        <div className="absolute top-1.5 right-2 text-[9px] font-black text-white/60">#{pub.issue}</div>
      )}
      {/* Stat callout */}
      {isFull && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-center bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20">
          <div className="text-2xl font-black text-white" style={{color:pub.cover_gradient[1]}}>{pub.highlight_stat}</div>
          <div className="text-[9px] text-white/60 mt-0.5 max-w-[70px] leading-tight">{pub.highlight_label}</div>
        </div>
      )}
    </div>
  )
}

export default function PublicationsPage() {
  const latest = PUBLICATIONS[0]
  return (
    <div className="min-h-screen bg-background-offwhite">
      <BackgroundVideo/>
      <div className="max-w-[1540px] mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="text-[10px] font-black text-primary-teal uppercase tracking-widest mb-2">Weekly Intelligence</div>
          <h1 className="text-4xl font-black text-primary-dark mb-2">Publications</h1>
          <p className="text-text-secondary">Weekly Intelligence Briefs — Strategic FDI intelligence delivered every Monday to 12,847 professionals</p>
        </div>

        {/* ── LATEST ISSUE — HERO ── */}
        <div className="floating-card !p-0 overflow-hidden mb-10">
          <div className="grid grid-cols-[380px_1fr] min-h-[340px]">
            <div className="p-6">
              <PublicationCover pub={latest} size="full"/>
            </div>
            <div className="p-8 flex flex-col justify-center border-l border-border-light">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[9px] font-black text-primary-teal uppercase tracking-wider px-3 py-1 rounded-full bg-green-50 border border-green-200">
                  Issue #{latest.issue} · LATEST
                </span>
                <span className="text-sm text-text-secondary">{latest.date}</span>
              </div>
              <h2 className="text-2xl font-black text-primary-dark mb-1">{latest.title}</h2>
              <div className="text-sm font-medium text-primary-teal mb-4">{latest.subtitle}</div>
              <p className="text-text-secondary leading-relaxed mb-5 text-sm">{latest.summary}</p>

              {/* Countries + Sectors */}
              <div className="flex flex-wrap gap-2 mb-5">
                {latest.countries.map(c=><CountryFlag key={c} code={c} size={20} className="bg-background-offwhite px-2 py-1 rounded-lg border border-border-light"/>)}
                {latest.sectors.map(s=>(
                  <span key={s} className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-background-offwhite border border-border-light text-text-secondary">{s}</span>
                ))}
              </div>

              {/* Company logos */}
              <div className="flex flex-wrap gap-2 mb-6">
                {latest.companies.map(c=>(
                  <div key={c.domain} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white border border-border-light shadow-sm">
                    <img src={`https://logo.clearbit.com/${c.domain}`} alt={c.name} width={18} height={18} className="rounded object-contain"
                      onError={e=>{(e.target as any).style.display='none'}}/>
                    <span className="text-[10px] font-semibold text-text-secondary">{c.name}</span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-5 mb-6 text-sm">
                {[['📄',latest.pages,'Pages'],['👁',latest.reads.toLocaleString(),'Reads'],['⬇️',latest.downloads.toLocaleString(),'Downloads']].map(([icon,v,l])=>(
                  <div key={String(l)} className="text-center">
                    <div className="font-black font-mono text-primary-dark">{v}</div>
                    <div className="text-[10px] text-text-light">{l}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white" style={{background:'#1A2C3E',boxShadow:'0 4px 14px rgba(26,44,62,0.2)'}}>
                  <Download size={14}/> Download PDF
                </button>
                <button className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-primary-dark border border-border-light bg-white hover:border-primary-dark transition-all">
                  <ExternalLink size={14}/> Read Online
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── ARCHIVE ── */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-black text-primary-dark">Archive</h2>
          <div className="text-sm text-text-secondary">{PUBLICATIONS.length-1} previous issues</div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {PUBLICATIONS.slice(1).map(pub=>(
            <div key={pub.issue} className="floating-card !p-0 overflow-hidden group">
              {/* Cover */}
              <div className="relative overflow-hidden h-[160px]"
                style={{background:`linear-gradient(135deg, ${pub.cover_gradient[0]}, ${pub.cover_gradient[1]})`}}>
                <svg className="absolute inset-0 w-full h-full opacity-8" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {[15,30,45,60,75,90].map(x=><line key={x} x1={x} y1="0" x2={x} y2="100" stroke="white" strokeWidth="0.4"/>)}
                  {[15,30,45,60,75,90].map(y=><line key={y} x1="0" y1={y} x2="100" y2={y} stroke="white" strokeWidth="0.4"/>)}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-6xl opacity-20">{pub.cover_emoji}</div>
                <div className="absolute top-3 left-3 right-3 flex justify-between">
                  <span className="text-[8px] font-black text-white/50 uppercase tracking-wider">FDI MONITOR</span>
                  <span className="text-[8px] text-white/50">#{pub.issue}</span>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="text-white/90 font-black text-sm leading-tight line-clamp-2">{pub.title}</div>
                </div>
                {/* Hover stat */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center opacity-0 group-hover:opacity-100 transition-all bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2">
                  <div className="text-xl font-black text-white">{pub.highlight_stat}</div>
                  <div className="text-[9px] text-white/60">{pub.highlight_label}</div>
                </div>
              </div>

              {/* Card body */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {pub.countries.map(c=><CountryFlag key={c} code={c} size={16}/>)}
                  <span className="text-[10px] text-text-light ml-auto">{pub.date}</span>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed mb-3 line-clamp-2">{pub.summary}</p>
                {/* Company logos */}
                <div className="flex gap-1.5 flex-wrap mb-3">
                  {pub.companies.map(c=>(
                    <div key={c.domain} className="flex items-center gap-1 px-1.5 py-1 rounded-lg bg-background-offwhite border border-border-light">
                      <img src={`https://logo.clearbit.com/${c.domain}`} alt={c.name} width={14} height={14} className="rounded object-contain"
                        onError={e=>{(e.target as any).style.display='none'}}/>
                      <span className="text-[9px] font-medium text-text-light">{c.name}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3 text-xs text-text-light">
                    <span>{pub.pages}p</span>
                    <span>{pub.downloads} ⬇</span>
                  </div>
                  <button className="flex items-center gap-1 text-xs font-bold text-primary-teal hover:gap-2 transition-all">
                    Download <Download size={11}/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Subscribe */}
        <div className="mt-10 p-10 rounded-3xl text-center relative overflow-hidden"
          style={{background:'linear-gradient(135deg,#1A2C3E 0%,#243d56 100%)'}}>
          <div className="absolute inset-0 opacity-5"
            style={{backgroundImage:'radial-gradient(circle at 30% 50%, white, transparent 40%),'+'radial-gradient(circle at 70% 50%, white, transparent 40%)'}}/>
          <div className="relative">
            <div className="text-[10px] font-black text-primary-teal uppercase tracking-widest mb-3">WEEKLY INTELLIGENCE</div>
            <h3 className="text-2xl font-black text-white mb-2">Never miss an Intelligence Brief</h3>
            <p className="text-white/50 text-sm mb-6">12,847 investment professionals subscribe. Delivered every Monday 09:00 GMT. Unsubscribe anytime.</p>
            <div className="flex justify-center gap-3 max-w-md mx-auto">
              <input type="email" placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-xl text-sm focus:outline-none bg-white/10 text-white placeholder-white/30 border border-white/15 focus:border-primary-teal"/>
              <button className="px-6 py-3 rounded-xl text-sm font-bold text-primary-dark" style={{background:'#2ECC71'}}>
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
