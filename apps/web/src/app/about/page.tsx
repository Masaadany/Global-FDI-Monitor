'use client';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';

const TEAM_VALUES = [
  { icon:'🎯', title:'Precision Over Speed', desc:'Every signal is SHA-256 verified and SCI-scored before reaching our users. We never sacrifice accuracy for recency.' },
  { icon:'🌍', title:'Truly Global', desc:'215+ economies, 20+ sectors, 304+ official government sources. No region or market is left out of our intelligence.' },
  { icon:'🤖', title:'AI-First Methodology', desc:'Our 6-stage agent pipeline runs continuously, processing thousands of signals to surface only what matters to investors.' },
  { icon:'🔒', title:'Source Transparency', desc:'Every signal includes its official government source, timestamp, and SHA-256 provenance hash. Full audit trail.' },
];

const METHODOLOGY_LAYERS = [
  { n:'L1', name:'Doing Business Indicators', weight:'30%', color:'#2ecc71', desc:'World Bank\'s 10 Doing Business indicators normalized via Distance-to-Frontier method. Starting a Business, Construction Permits, Getting Electricity, Registering Property, Getting Credit, Protecting Investors, Paying Taxes, Trading Across Borders, Enforcing Contracts, Resolving Insolvency.' },
  { n:'L2', name:'Sector Indicators', weight:'20%', color:'#3498db', desc:'Sector-specific regulatory environment, incentive packages, labor availability, infrastructure readiness, and export potential. Covers 20+ sectors across all covered economies.' },
  { n:'L3', name:'Special Investment Zone Indicators', weight:'25%', color:'#9b59b6', desc:'Zone-level intelligence: land availability, occupancy rates, infrastructure quality, zone-specific incentives vs mainland competitiveness, existing tenant cluster analysis.' },
  { n:'L4', name:'Market Intelligence Matrix', weight:'25%', color:'#f1c40f', desc:'Real-time and forward-looking signals from 304+ sources: international financial institutions, trade organizations, development banks, central banks, company expansion announcements, and investment signals.' },
];

export default function AboutPage() {
  return (
    <div style={{minHeight:'100vh', background:'#f0f4f8', fontFamily:"Inter,'Helvetica Neue',sans-serif"}}>
      <NavBar/>
      {/* Hero */}
      <div style={{background:'linear-gradient(135deg,#0f1e2a,#1a2c3e)', padding:'60px 24px', textAlign:'center'}}>
        <div style={{maxWidth:'700px', margin:'0 auto'}}>
          <div style={{fontSize:'10px', fontWeight:800, color:'#2ecc71', letterSpacing:'0.12em', marginBottom:'12px'}}>ABOUT GLOBAL FDI MONITOR</div>
          <h1 style={{fontSize:'36px', fontWeight:900, color:'white', marginBottom:'16px', lineHeight:'1.2'}}>The world's most advanced FDI intelligence platform</h1>
          <p style={{fontSize:'15px', color:'rgba(255,255,255,0.65)', lineHeight:'1.75', marginBottom:'28px'}}>
            We combine World Bank Doing Business methodology with sector-level intelligence, zone-specific reality data, and real-time market signals across all countries and all sectors — delivering actionable investment insights for global investors, governments, and economic development organizations.
          </p>
          <div style={{display:'flex', gap:'24px', justifyContent:'center', flexWrap:'wrap'}}>
            {[['215+','Economies'],['304+','Official Sources'],['50+','AI Agents'],['12,847','Subscribers']].map(([v,l])=>(
              <div key={l} style={{textAlign:'center'}}>
                <div style={{fontSize:'28px', fontWeight:900, color:'#2ecc71', fontFamily:"'JetBrains Mono',monospace"}}>{v}</div>
                <div style={{fontSize:'11px', color:'rgba(255,255,255,0.5)'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:'1200px', margin:'0 auto', padding:'60px 24px'}}>
        {/* Values */}
        <h2 style={{fontSize:'26px', fontWeight:800, color:'#1a2c3e', marginBottom:'8px', textAlign:'center'}}>Our Principles</h2>
        <p style={{fontSize:'13px', color:'#7f8c8d', textAlign:'center', marginBottom:'32px'}}>What drives every decision in our platform</p>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'60px'}}>
          {TEAM_VALUES.map(({icon,title,desc})=>(
            <div key={title} style={{background:'white', borderRadius:'16px', padding:'24px', border:'1px solid rgba(26,44,62,0.08)', display:'flex', gap:'16px', alignItems:'flex-start'}}>
              <div style={{fontSize:'28px', flexShrink:0}}>{icon}</div>
              <div>
                <div style={{fontSize:'16px', fontWeight:800, color:'#1a2c3e', marginBottom:'6px'}}>{title}</div>
                <div style={{fontSize:'13px', color:'#7f8c8d', lineHeight:'1.7'}}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* GOSA Methodology */}
        <h2 style={{fontSize:'26px', fontWeight:800, color:'#1a2c3e', marginBottom:'8px', textAlign:'center'}}>GOSA Methodology</h2>
        <p style={{fontSize:'13px', color:'#7f8c8d', textAlign:'center', marginBottom:'8px'}}>Global Opportunity Score Analysis — 4-Layer Weighted Composite</p>
        <div style={{textAlign:'center', padding:'12px 20px', background:'rgba(26,44,62,0.04)', borderRadius:'10px', marginBottom:'32px', display:'inline-block', left:'50%', position:'relative', transform:'translateX(-50%)'}}>
          <span style={{fontSize:'13px', color:'#1a2c3e', fontFamily:"'JetBrains Mono',monospace"}}>
            GOSA = (0.30 × L1) + (0.20 × L2) + (0.25 × L3) + (0.25 × L4)
          </span>
        </div>
        <div style={{display:'flex', flexDirection:'column', gap:'12px', marginBottom:'60px'}}>
          {METHODOLOGY_LAYERS.map(({n,name,weight,color,desc})=>(
            <div key={n} style={{background:'white', borderRadius:'14px', padding:'20px 24px', border:'1px solid rgba(26,44,62,0.08)', display:'grid', gridTemplateColumns:'auto 1fr', gap:'20px', alignItems:'start', borderLeft:`5px solid ${color}`}}>
              <div style={{textAlign:'center', minWidth:'60px'}}>
                <div style={{fontSize:'20px', fontWeight:900, color:color}}>{n}</div>
                <div style={{fontSize:'12px', fontWeight:800, padding:'3px 8px', borderRadius:'8px', background:`${color}15`, color}}>{weight}</div>
              </div>
              <div>
                <div style={{fontSize:'15px', fontWeight:700, color:'#1a2c3e', marginBottom:'6px'}}>{name}</div>
                <div style={{fontSize:'12px', color:'#7f8c8d', lineHeight:'1.7'}}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{background:'#1a2c3e', borderRadius:'20px', padding:'40px', textAlign:'center', border:'1px solid rgba(46,204,113,0.15)'}}>
          <h2 style={{fontSize:'24px', fontWeight:900, color:'white', marginBottom:'10px'}}>Ready to access global FDI intelligence?</h2>
          <p style={{fontSize:'14px', color:'rgba(255,255,255,0.55)', marginBottom:'24px'}}>Start your free 7-day trial. No credit card required.</p>
          <div style={{display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap'}}>
            <Link href="/register" style={{padding:'12px 28px', background:'#2ecc71', color:'#0f1e2a', borderRadius:'10px', textDecoration:'none', fontSize:'14px', fontWeight:800}}>
              Start Free Trial →
            </Link>
            <Link href="/contact" style={{padding:'12px 24px', border:'1px solid rgba(255,255,255,0.2)', color:'white', borderRadius:'10px', textDecoration:'none', fontSize:'14px', fontWeight:600}}>
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}
