'use client';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Shield, Zap, Globe, Target, BarChart3, Lock } from 'lucide-react';

const VALUES = [
  {icon:<Shield size={20} color="#00ffc8"/>,title:'Precision Over Speed',desc:'Every signal SHA-256 verified and SCI-scored before reaching users. We never sacrifice accuracy for recency.'},
  {icon:<Globe size={20} color="#00d4ff"/>,title:'Truly Global Coverage',desc:'215+ economies, 20+ sectors, 304+ official government sources. No region or market is excluded from our intelligence.'},
  {icon:<Zap size={20} color="#ffd700"/>,title:'AI-First Methodology',desc:'6-stage agent pipeline running continuously, processing thousands of signals to surface only what matters to investors.'},
  {icon:<Lock size={20} color="#9b59b6"/>,title:'Source Transparency',desc:'Every signal includes official government source, timestamp, and SHA-256 provenance hash. Full audit trail always.'},
];

const GOSA_LAYERS = [
  {n:'L1',name:'Doing Business Indicators',weight:'30%',color:'#00ffc8',desc:"World Bank's 10 Doing Business indicators normalized via Distance-to-Frontier method. Starting a Business, Construction Permits, Getting Electricity, Registering Property, Getting Credit, Protecting Investors, Paying Taxes, Trading Across Borders, Enforcing Contracts, Resolving Insolvency."},
  {n:'L2',name:'Sector Indicators',weight:'20%',color:'#00d4ff',desc:'Sector-specific regulatory environment, incentive packages, labor availability, infrastructure readiness, and export potential across 20+ sectors in all covered economies.'},
  {n:'L3',name:'Special Investment Zone Indicators',weight:'25%',color:'#9b59b6',desc:'Zone-level intelligence: land availability, occupancy rates, infrastructure quality, zone-specific incentives vs mainland, tenant cluster analysis, and connectivity scores.'},
  {n:'L4',name:'Market Intelligence Matrix',weight:'25%',color:'#ffd700',desc:'Real-time and forward-looking signals from 304+ sources: international financial institutions, trade organizations, development banks, central banks, company expansion announcements.'},
];

const AGENTS = [
  {id:'AGT-01',name:'Data Collection',desc:'Harvests raw data from 304+ official sources every 30 minutes'},
  {id:'AGT-02',name:'Signal Detection',desc:'Classifies and SCI-scores investment signals using proprietary algorithm'},
  {id:'AGT-03',name:'Verification',desc:'SHA-256 provenance hashing and deduplication of all signals'},
  {id:'AGT-04',name:'GOSA Scoring',desc:'4-layer weighted composite scoring engine, updates 15 economies weekly'},
  {id:'AGT-05',name:'GFR Ranking',desc:'6-dimension future readiness ranking across 25 economies'},
  {id:'AGT-06',name:'Newsletter',desc:'Generates weekly intelligence brief from top signals — human review required'},
];

export default function AboutPage(){
  return(
    <div style={{minHeight:'100vh',background:'#020c14',fontFamily:"'Inter','Helvetica Neue',sans-serif"}}>
      <NavBar/>

      {/* HERO */}
      <div style={{background:'linear-gradient(135deg,#020c14,#060f1a,#0a1628)',padding:'72px 24px',textAlign:'center',borderBottom:'1px solid rgba(0,255,200,0.06)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,255,200,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,200,0.02) 1px,transparent 1px)',backgroundSize:'64px 64px',pointerEvents:'none'}}/>
        <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-50%)',width:'800px',height:'400px',background:'radial-gradient(ellipse, rgba(0,80,120,0.1), transparent)',pointerEvents:'none'}}/>
        <div style={{maxWidth:'800px',margin:'0 auto',position:'relative'}}>
          <div style={{fontSize:'10px',fontWeight:800,color:'rgba(0,255,200,0.5)',letterSpacing:'0.2em',marginBottom:'12px',fontFamily:"'Orbitron','Inter',sans-serif"}}>ABOUT GLOBAL FDI MONITOR</div>
          <h1 style={{fontSize:'clamp(28px,4vw,48px)',fontWeight:900,color:'#e8f4f8',marginBottom:'16px',lineHeight:1.1}}>
            The World's Most Advanced<br/>
            <span style={{background:'linear-gradient(135deg,#00ffc8,#00d4ff)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>FDI Intelligence Platform</span>
          </h1>
          <p style={{fontSize:'16px',color:'rgba(232,244,248,0.55)',lineHeight:1.8,marginBottom:'32px'}}>
            We combine World Bank Doing Business methodology with sector-level intelligence, zone-specific reality data, and real-time market signals — delivering actionable investment insights for global investors, governments, and economic development organizations.
          </p>
          <div style={{display:'flex',gap:'32px',justifyContent:'center',flexWrap:'wrap'}}>
            {[['215+','Economies'],['304+','Official Sources'],['6','AI Agents'],['12,847','Subscribers']].map(([v,l])=>(
              <div key={l} style={{textAlign:'center'}}>
                <div style={{fontSize:'32px',fontWeight:900,color:'#00ffc8',fontFamily:"'JetBrains Mono',monospace",textShadow:'0 0 20px rgba(0,255,200,0.4)'}}>{v}</div>
                <div style={{fontSize:'10px',color:'rgba(232,244,248,0.4)',marginTop:'2px',letterSpacing:'0.08em',textTransform:'uppercase'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'64px 24px'}}>
        {/* Values */}
        <div style={{textAlign:'center',marginBottom:'48px'}}>
          <div style={{fontSize:'10px',fontWeight:800,color:'rgba(0,255,200,0.4)',letterSpacing:'0.2em',marginBottom:'10px',fontFamily:"'Orbitron','Inter',sans-serif"}}>OUR PRINCIPLES</div>
          <h2 style={{fontSize:'30px',fontWeight:900,color:'#e8f4f8'}}>What Drives Every Decision</h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'72px'}}>
          {VALUES.map(({icon,title,desc})=>(
            <div key={title} style={{padding:'26px',background:'rgba(10,22,40,0.7)',border:'1px solid rgba(0,180,216,0.1)',borderRadius:'14px',display:'flex',gap:'18px',alignItems:'flex-start',transition:'all 250ms ease'}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='rgba(0,255,200,0.2)';e.currentTarget.style.transform='translateY(-2px)';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='rgba(0,180,216,0.1)';e.currentTarget.style.transform='none';}}>
              <div style={{width:'46px',height:'46px',borderRadius:'12px',background:'rgba(0,255,200,0.06)',border:'1px solid rgba(0,255,200,0.12)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{icon}</div>
              <div>
                <div style={{fontSize:'16px',fontWeight:800,color:'#e8f4f8',marginBottom:'6px'}}>{title}</div>
                <div style={{fontSize:'13px',color:'rgba(232,244,248,0.5)',lineHeight:1.75}}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* GOSA Methodology */}
        <div id="gosa" style={{marginBottom:'72px'}}>
          <div style={{textAlign:'center',marginBottom:'40px'}}>
            <div style={{fontSize:'10px',fontWeight:800,color:'rgba(0,255,200,0.4)',letterSpacing:'0.2em',marginBottom:'10px',fontFamily:"'Orbitron','Inter',sans-serif"}}>METHODOLOGY</div>
            <h2 style={{fontSize:'30px',fontWeight:900,color:'#e8f4f8',marginBottom:'10px'}}>GOSA — 4-Layer Composite Index</h2>
            <div style={{padding:'10px 20px',background:'rgba(0,255,200,0.04)',border:'1px solid rgba(0,255,200,0.12)',borderRadius:'8px',display:'inline-block'}}>
              <span style={{fontSize:'12px',color:'rgba(232,244,248,0.7)',fontFamily:"'JetBrains Mono',monospace"}}>
                GOSA = (0.30 × L1) + (0.20 × L2) + (0.25 × L3) + (0.25 × L4)
              </span>
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
            {GOSA_LAYERS.map(({n,name,weight,color,desc})=>(
              <div key={n} style={{background:'rgba(10,22,40,0.7)',borderRadius:'12px',border:`1px solid rgba(255,255,255,0.04)`,borderLeft:`4px solid ${color}`,padding:'20px 24px',display:'grid',gridTemplateColumns:'auto 1fr',gap:'20px',alignItems:'start'}}>
                <div style={{textAlign:'center',minWidth:'64px'}}>
                  <div style={{fontSize:'22px',fontWeight:900,color,fontFamily:"'JetBrains Mono',monospace",textShadow:`0 0 12px ${color}60`}}>{n}</div>
                  <div style={{fontSize:'11px',fontWeight:800,padding:'3px 8px',borderRadius:'8px',background:`${color}10`,color,border:`1px solid ${color}20`,marginTop:'4px'}}>{weight}</div>
                </div>
                <div>
                  <div style={{fontSize:'15px',fontWeight:700,color:'rgba(232,244,248,0.85)',marginBottom:'6px'}}>{name}</div>
                  <div style={{fontSize:'12px',color:'rgba(232,244,248,0.45)',lineHeight:1.75}}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Agent Pipeline */}
        <div id="agents" style={{marginBottom:'64px'}}>
          <div style={{textAlign:'center',marginBottom:'36px'}}>
            <div style={{fontSize:'10px',fontWeight:800,color:'rgba(0,255,200,0.4)',letterSpacing:'0.2em',marginBottom:'10px',fontFamily:"'Orbitron','Inter',sans-serif"}}>AI AGENT PIPELINE</div>
            <h2 style={{fontSize:'28px',fontWeight:900,color:'#e8f4f8'}}>6-Stage Intelligence Pipeline</h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'12px'}}>
            {AGENTS.map(({id,name,desc},i)=>(
              <div key={id} style={{padding:'18px',background:'rgba(10,22,40,0.7)',border:'1px solid rgba(0,180,216,0.08)',borderRadius:'10px',display:'flex',gap:'12px',alignItems:'flex-start'}}>
                <div style={{width:'36px',height:'36px',borderRadius:'8px',background:'rgba(0,255,200,0.08)',border:'1px solid rgba(0,255,200,0.15)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'10px',fontWeight:900,color:'#00ffc8',fontFamily:"'JetBrains Mono',monospace"}}>{i+1}</div>
                <div>
                  <div style={{fontSize:'9px',fontWeight:800,color:'rgba(0,255,200,0.5)',marginBottom:'2px',letterSpacing:'0.08em',fontFamily:"'JetBrains Mono',monospace"}}>{id}</div>
                  <div style={{fontSize:'13px',fontWeight:700,color:'rgba(232,244,248,0.85)',marginBottom:'4px'}}>{name}</div>
                  <div style={{fontSize:'11px',color:'rgba(232,244,248,0.4)',lineHeight:1.6}}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{background:'rgba(0,255,200,0.04)',border:'1px solid rgba(0,255,200,0.12)',borderRadius:'16px',padding:'40px',textAlign:'center'}}>
          <h2 style={{fontSize:'24px',fontWeight:900,color:'#e8f4f8',marginBottom:'10px'}}>Ready to access global FDI intelligence?</h2>
          <p style={{fontSize:'14px',color:'rgba(232,244,248,0.5)',marginBottom:'24px'}}>Start your free 7-day trial. No credit card required.</p>
          <div style={{display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/register" style={{padding:'12px 28px',background:'linear-gradient(135deg,#00ffc8,#00c49a)',color:'#020c14',borderRadius:'10px',textDecoration:'none',fontSize:'14px',fontWeight:800,boxShadow:'0 4px 16px rgba(0,255,200,0.25)'}}>
              Start Free Trial →
            </Link>
            <Link href="/contact" style={{padding:'12px 24px',border:'1px solid rgba(232,244,248,0.12)',color:'rgba(232,244,248,0.7)',borderRadius:'10px',textDecoration:'none',fontSize:'14px',fontWeight:600}}>
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
