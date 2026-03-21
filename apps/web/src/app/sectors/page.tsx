'use client';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { TrendingUp, Zap, Globe, ArrowRight } from 'lucide-react';

const SECTORS = [
  {id:'ev-battery',    emoji:'🔋',name:'EV Battery',         momentum:'HOT',    color:'#00ffc8',gosa:88,topCountries:['🇻🇳 Vietnam','🇹🇭 Thailand','🇮🇩 Indonesia'],signals:3, fdi:'$25B',growth:'+42%',desc:'Fastest-growing FDI sector in Southeast Asia driven by EV supply chain diversification from China. Vietnam, Thailand, and Indonesia leading with combined $25B+ in committed investment for 2026.'},
  {id:'data-centers',  emoji:'🖥',name:'Data Centers',       momentum:'HOT',    color:'#00d4ff',gosa:86,topCountries:['🇲🇾 Malaysia','🇸🇬 Singapore','🇦🇪 UAE'],signals:4,     fdi:'$18B',growth:'+38%',desc:'Hyperscaler expansion driving record greenfield investment. Malaysia 100% FDI liberalisation, UAE AI infrastructure commitment, Singapore land constraints creating Malaysia spillover opportunity.'},
  {id:'semiconductors',emoji:'💻',name:'Semiconductors',     momentum:'RISING', color:'#ffd700',gosa:84,topCountries:['🇸🇬 Singapore','🇰🇷 S. Korea','🇺🇸 USA'],signals:2,    fdi:'$15B',growth:'+28%',desc:'CHIPS Act and global chip shortage driving $50B+ in new fab investment. Singapore, South Korea, Japan, and US competing for leading-edge manufacturing with massive government subsidy packages.'},
  {id:'renewables',    emoji:'⚡',name:'Renewable Energy',   momentum:'RISING', color:'#e67e22',gosa:82,topCountries:['🇸🇦 Saudi Arabia','🇲🇦 Morocco','🇩🇰 Denmark'],signals:3,fdi:'$22B',growth:'+31%',desc:'Green hydrogen and offshore wind driving new investment corridors. Saudi Arabia $15B PIF renewables expansion, Morocco EU green hydrogen framework, Denmark offshore wind leadership creating massive supply chain opportunity.'},
  {id:'ai-tech',       emoji:'🤖',name:'AI & Technology',    momentum:'HOT',    color:'#9b59b6',gosa:85,topCountries:['🇦🇪 UAE','🇺🇸 USA','🇸🇬 Singapore'],signals:5,         fdi:'$12B',growth:'+55%',desc:'AI compute infrastructure driving hyperscaler investment. UAE Microsoft $3.3B, Saudi Arabia NVIDIA partnership, Singapore AI hub strategy. Data center and AI workload co-location creating new investment geography.'},
  {id:'manufacturing', emoji:'🏭',name:'Manufacturing',      momentum:'STABLE', color:'#00d4ff',gosa:78,topCountries:['🇻🇳 Vietnam','🇲🇾 Malaysia','🇮🇳 India'],signals:2,     fdi:'$31B',growth:'+12%',desc:'China+1 diversification sustaining strong manufacturing FDI flows across ASEAN. Vietnam electronics, Malaysia semiconductors, India Apple supply chain defining the 2026 manufacturing investment landscape.'},
  {id:'financial',     emoji:'💼',name:'Financial Services', momentum:'STABLE', color:'#00ffc8',gosa:80,topCountries:['🇦🇪 UAE','🇸🇬 Singapore','🇬🇧 UK'],signals:1,          fdi:'$8B', growth:'+8%', desc:'DIFC and ADGM continuing to attract global financial institutions. Singapore MAS strengthening crypto and digital asset framework. London fintech ecosystem recording £8B in 2025 investment despite macro headwinds.'},
  {id:'pharma',        emoji:'💊',name:'Pharmaceuticals',    momentum:'STABLE', color:'#ffd700',gosa:79,topCountries:['🇨🇭 Switzerland','🇬🇧 UK','🇮🇳 India'],signals:1,      fdi:'$9B', growth:'+14%', desc:'Biologics and vaccine manufacturing driving capital expenditure. India PLI scheme attracting $3B+ pharma investment. Switzerland biotech cluster recording CHF 12B record FDI. UK Cambridge campus expansion.'},
  {id:'logistics',     emoji:'🚢',name:'Logistics & Ports',  momentum:'COOLING',color:'#ff4466',gosa:72,topCountries:['🇲🇦 Morocco','🇸🇬 Singapore','🇦🇪 UAE'],signals:1,     fdi:'$6B', growth:'+3%', desc:'Port automation and last-mile infrastructure investment slowing post-pandemic. Tanger Med Phase 3, Singapore Tuas megaport, Jebel Ali automation driving selective investment. Regional trade route shifts creating new opportunities.'},
];

const MOMENTUM_STYLE: Record<string, {bg:string,c:string,b:string}> = {
  HOT:    {bg:'rgba(0,255,200,0.1)',c:'#00ffc8',b:'rgba(0,255,200,0.25)'},
  RISING: {bg:'rgba(255,215,0,0.1)',c:'#ffd700',b:'rgba(255,215,0,0.25)'},
  STABLE: {bg:'rgba(0,180,216,0.1)',c:'#00b4d8',b:'rgba(0,180,216,0.25)'},
  COOLING:{bg:'rgba(255,68,102,0.1)',c:'#ff4466',b:'rgba(255,68,102,0.25)'},
};

export default function SectorsPage() {
  return (
    <div style={{minHeight:'100vh',background:'#020c14',fontFamily:"'Inter','Helvetica Neue',sans-serif"}}>
      <NavBar/>
      <div style={{background:'linear-gradient(135deg,#020c14,#060f1a)',padding:'28px 24px',borderBottom:'1px solid rgba(0,255,200,0.06)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,255,200,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,200,0.025) 1px,transparent 1px)',backgroundSize:'64px 64px',pointerEvents:'none'}}/>
        <div style={{maxWidth:'1540px',margin:'0 auto',position:'relative'}}>
          <div style={{fontSize:'10px',fontWeight:800,color:'rgba(0,255,200,0.5)',letterSpacing:'0.2em',marginBottom:'6px',fontFamily:"'Orbitron','Inter',sans-serif"}}>SECTOR INTELLIGENCE</div>
          <h1 style={{fontSize:'28px',fontWeight:900,color:'#e8f4f8',marginBottom:'6px'}}>Investment Sector Monitor</h1>
          <p style={{fontSize:'13px',color:'rgba(232,244,248,0.45)'}}>9 sectors · Momentum scoring · Top destinations · Live signals · GOSA-weighted</p>
        </div>
      </div>

      <div style={{maxWidth:'1540px',margin:'0 auto',padding:'24px'}}>
        {/* Summary row */}
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px',marginBottom:'20px'}}>
          {[
            [SECTORS.filter(s=>s.momentum==='HOT').length,'HOT Sectors','Immediate opportunity','#00ffc8'],
            [SECTORS.filter(s=>s.momentum==='RISING').length,'RISING Sectors','Building momentum','#ffd700'],
            ['$146B','Total Sector FDI','2025 committed','#9b59b6'],
            [SECTORS.reduce((a,s)=>a+s.signals,0)+'','Active Signals','Across all sectors','#00d4ff'],
          ].map(([v,l,s,c]) => (
            <div key={String(l)} style={{padding:'16px',background:'rgba(10,22,40,0.8)',border:'1px solid rgba(0,180,216,0.1)',borderRadius:'12px',borderTop:'2px solid '+c}}>
              <div style={{fontSize:'9px',color:'rgba(232,244,248,0.3)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'6px'}}>{l as string}</div>
              <div style={{fontSize:'26px',fontWeight:900,color:String(c),fontFamily:"'JetBrains Mono',monospace"}}>{v}</div>
              <div style={{fontSize:'10px',color:'rgba(232,244,248,0.3)',marginTop:'2px'}}>{s as string}</div>
            </div>
          ))}
        </div>

        {/* Sector cards */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'14px'}}>
          {SECTORS.map(sec => {
            const ms = MOMENTUM_STYLE[sec.momentum];
            return (
              <div key={sec.id} style={{background:'rgba(10,22,40,0.7)',border:'1px solid rgba(0,180,216,0.1)',borderRadius:'14px',overflow:'hidden',transition:'all 250ms ease',position:'relative'}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=sec.color+'25';e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.boxShadow=`0 12px 32px rgba(0,0,0,0.4), 0 0 0 1px ${sec.color}12`;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(0,180,216,0.1)';e.currentTarget.style.transform='none';e.currentTarget.style.boxShadow='none';}}>
                <div style={{position:'absolute',top:0,right:0,width:'80px',height:'80px',background:`radial-gradient(circle at top right, ${sec.color}08, transparent)`,pointerEvents:'none'}}/>
                <div style={{padding:'18px 20px',borderBottom:'1px solid rgba(255,255,255,0.04)'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'10px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                      <span style={{fontSize:'28px'}}>{sec.emoji}</span>
                      <div>
                        <div style={{fontSize:'16px',fontWeight:800,color:'#e8f4f8'}}>{sec.name}</div>
                        <div style={{fontSize:'10px',color:'rgba(232,244,248,0.35)'}}>{sec.signals} active signals</div>
                      </div>
                    </div>
                    <span style={{fontSize:'9px',fontWeight:800,padding:'3px 9px',borderRadius:'10px',background:ms.bg,color:ms.c,border:'1px solid '+ms.b,letterSpacing:'0.05em',flexShrink:0}}>{sec.momentum}</span>
                  </div>
                  <p style={{fontSize:'12px',color:'rgba(232,244,248,0.5)',lineHeight:1.7,marginBottom:'12px'}}>{sec.desc.slice(0,130)}...</p>
                  <div style={{display:'flex',gap:'14px',marginBottom:'10px'}}>
                    {[['FDI',sec.fdi,sec.color],['Growth',sec.growth,'#00ffc8'],['GOSA',sec.gosa,sec.color]].map(([l,v,c]) => (
                      <div key={String(l)}>
                        <div style={{fontSize:'9px',color:'rgba(232,244,248,0.3)',marginBottom:'1px',textTransform:'uppercase',letterSpacing:'0.06em'}}>{l as string}</div>
                        <div style={{fontSize:'14px',fontWeight:800,color:String(c),fontFamily:"'JetBrains Mono',monospace"}}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
                    {sec.topCountries.map(co => (
                      <span key={co} style={{fontSize:'10px',padding:'2px 8px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'10px',color:'rgba(232,244,248,0.6)',fontWeight:500}}>{co}</span>
                    ))}
                  </div>
                </div>
                <div style={{padding:'12px 20px',display:'flex',gap:'8px',background:'rgba(0,0,0,0.2)'}}>
                  <Link href={'/investment-analysis?sector='+sec.id} style={{flex:1,padding:'7px',background:sec.color+'0a',border:'1px solid '+sec.color+'1a',borderRadius:'7px',textDecoration:'none',fontSize:'11px',fontWeight:700,color:sec.color,textAlign:'center'}}>
                    Analysis →
                  </Link>
                  <Link href="/signals" style={{flex:1,padding:'7px',background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:'7px',textDecoration:'none',fontSize:'11px',fontWeight:600,color:'rgba(232,244,248,0.5)',textAlign:'center'}}>
                    Signals →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Footer/>
    </div>
  );
}
