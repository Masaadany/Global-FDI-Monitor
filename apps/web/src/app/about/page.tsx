import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Global FDI Monitor',
  description: 'FDI Monitor — advanced investment intelligence platform. INSIGHT philosophy, vision, mission, 215 countries, 1,400+ free zones, 30+ years historical data.',
};

const INSIGHT = [
  { letter:'I', text:"In today's complex and interconnected world," },
  { letter:'N', text:'Navigating investment decisions requires more than instinct,' },
  { letter:'S', text:'Strategic insight guides choices toward high-value opportunities,' },
  { letter:'I', text:'Intelligence must be accurate, timely, and comprehensive,' },
  { letter:'G', text:'Grounded in data, it empowers decision-makers to mitigate risk,' },
  { letter:'H', text:'Harnessing historical and real-time trends reveals emerging opportunities,' },
  { letter:'T', text:'Transforming investment decisions into sustainable economic impact.' },
];

const EXPERTISE = [
  { n:'01', title:'Enhancing National Investment Intelligence Capabilities',
    desc:'End-to-end analytics covering all 215 economies with quarterly GFR rankings and real-time signal feeds.' },
  { n:'02', title:'Enabling Targeted and Efficient Investor Outreach',
    desc:'Company Intelligence Centre with 12-dimension profiles, IMS scoring, and signal history for precision targeting.' },
  { n:'03', title:'Optimizing Investment Promotion Missions and Engagements',
    desc:'Mission Planning Command Centre matching destination economies, potential investors, government entities, and sector leads.' },
  { n:'04', title:'Strengthening Global Competitiveness and Strategic Positioning',
    desc:'GFR benchmarking, scenario modelling to 2050, and policy alignment indicators for long-term strategy.' },
];

const STRENGTHS = [
  { icon:'🌍', title:'Comprehensive Global Coverage',        desc:'215 economies · 21 ISIC sectors · 1,400+ free zones · 500 priority cities.' },
  { icon:'🔭', title:'Holistic Foresight & Scenario Planning', desc:'Probabilistic FDI projections to 2050 with optimistic, base, and stress scenarios.' },
  { icon:'🔬', title:'Cross-Sector Intelligence',            desc:'Sector heat maps, bilateral corridor analysis, and ESG-aligned investment screening.' },
  { icon:'⚡', title:'Real-Time Data & Signals',             desc:'2-second signal ingestion · Z3 formal verification · SHA-256 provenance.' },
  { icon:'🎯', title:'Investment Promotion Mission Planning', desc:'Full dossier generation with company, government entity, and sector lead profiles.' },
  { icon:'🏆', title:'Global Future Readiness & Value',      desc:'6-dimension GFR composite · 7 pillars · 28 dimensions · 112 indicators.' },
];

const STATS = [
  ['215',    'Countries Ranked'],
  ['1,400+', 'Free Zones Tracked'],
  ['30+',    'Years Historical Data'],
  ['15+',    'Primary Source Indices'],
  ['112',    'GFR Indicators'],
  ['2s',     'Signal Latency'],
];

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>

      {/* Hero */}
      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'56px 24px'}}>
        <div className="max-w-screen-lg mx-auto text-center">
          <h1 style={{fontSize:'38px',fontWeight:800,color:'white',marginBottom:'16px',lineHeight:'1.2'}}>
            About Global FDI Monitor
          </h1>
          <p style={{color:'rgba(226,242,223,0.85)',fontSize:'16px',maxWidth:'720px',margin:'0 auto 32px',lineHeight:'1.7'}}>
            GLOBAL FDI MONITOR is an advanced investment intelligence platform designed to transform complex global investment data into actionable strategic insight. By integrating real-time signals, historical data, and forward-looking analytics, the platform enables governments and institutional stakeholders to make informed, data-driven decisions.
          </p>
          {/* Stats strip */}
          <div style={{display:'flex',gap:'32px',justifyContent:'center',flexWrap:'wrap'}}>
            {STATS.map(([v,l])=>(
              <div key={l} style={{textAlign:'center'}}>
                <div style={{fontSize:'26px',fontWeight:800,color:'#74BB65',fontFamily:'monospace'}}>{v}</div>
                <div style={{fontSize:'11px',color:'rgba(226,242,223,0.7)',marginTop:'2px'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-screen-lg mx-auto px-6 py-10 space-y-10">

        {/* Vision & Mission */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px'}}>
          {[
            { title:'VISION', icon:'👁',
              text:'To become the global standard for investment intelligence, empowering nations to anticipate, attract, and sustain high-value investments.' },
            { title:'MISSION', icon:'🎯',
              text:'To enable governments and institutions with a next-generation intelligence platform that delivers real-time insights, predictive analytics, and strategic tools for informed investment decision-making.' },
          ].map(item=>(
            <div key={item.title} className="gfm-card" style={{padding:'28px'}}>
              <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'12px'}}>
                <span style={{fontSize:'28px'}}>{item.icon}</span>
                <span style={{fontSize:'12px',fontWeight:800,color:'#74BB65',letterSpacing:'0.1em'}}>{item.title}</span>
              </div>
              <p style={{fontSize:'14px',color:'#696969',lineHeight:'1.7'}}>{item.text}</p>
            </div>
          ))}
        </div>

        {/* INSIGHT philosophy */}
        <div>
          <div style={{fontSize:'11px',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em',color:'#74BB65',marginBottom:'6px'}}>Philosophy</div>
          <h2 style={{fontSize:'22px',fontWeight:700,color:'#0A3D62',marginBottom:'20px'}}>The INSIGHT Framework</h2>
          <div style={{display:'grid',gap:'10px'}}>
            {INSIGHT.map((item,i)=>(
              <div key={i} className="gfm-card" style={{padding:'16px 20px',display:'flex',alignItems:'center',gap:'16px',
                borderLeft:`4px solid ${i%2===0?'#74BB65':'#0A3D62'}`}}>
                <div style={{width:'32px',height:'32px',borderRadius:'8px',flexShrink:0,display:'flex',
                  alignItems:'center',justifyContent:'center',fontSize:'18px',fontWeight:900,
                  background:i%2===0?'rgba(116,187,101,0.12)':'rgba(10,61,98,0.08)',
                  color:i%2===0?'#74BB65':'#0A3D62'}}>
                  {item.letter}
                </div>
                <p style={{fontSize:'14px',color:'#696969',lineHeight:'1.5',margin:0}}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Expertise */}
        <div>
          <div style={{fontSize:'11px',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em',color:'#74BB65',marginBottom:'6px'}}>Our Expertise</div>
          <h2 style={{fontSize:'22px',fontWeight:700,color:'#0A3D62',marginBottom:'20px'}}>Expertise & Focus</h2>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
            {EXPERTISE.map(e=>(
              <div key={e.n} className="gfm-card" style={{padding:'24px'}}>
                <div style={{fontSize:'28px',fontWeight:900,color:'rgba(116,187,101,0.25)',marginBottom:'8px',fontFamily:'monospace'}}>{e.n}</div>
                <h3 style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'8px'}}>{e.title}</h3>
                <p style={{fontSize:'13px',color:'#696969',lineHeight:'1.6'}}>{e.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic strengths */}
        <div>
          <div style={{fontSize:'11px',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em',color:'#74BB65',marginBottom:'6px'}}>Capabilities</div>
          <h2 style={{fontSize:'22px',fontWeight:700,color:'#0A3D62',marginBottom:'20px'}}>Strategic Strong Points</h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'16px'}}>
            {STRENGTHS.map(s=>(
              <div key={s.title} className="gfm-card" style={{padding:'20px'}}>
                <div style={{fontSize:'28px',marginBottom:'10px'}}>{s.icon}</div>
                <h3 style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'6px'}}>{s.title}</h3>
                <p style={{fontSize:'12px',color:'#696969',lineHeight:'1.5'}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Methodology */}
        <div className="gfm-card" style={{padding:'32px',background:'rgba(10,61,98,0.03)',border:'1px solid rgba(10,61,98,0.08)'}}>
          <div style={{fontSize:'11px',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em',color:'#74BB65',marginBottom:'6px'}}>Methodology</div>
          <h2 style={{fontSize:'20px',fontWeight:700,color:'#0A3D62',marginBottom:'12px'}}>Analytical Framework</h2>
          <p style={{fontSize:'14px',color:'#696969',lineHeight:'1.8',marginBottom:'16px'}}>
            GLOBAL FDI MONITOR applies a multi-layered analytical framework combining real-time investment signals, verified data sources, and historical datasets spanning over three decades. The platform integrates cross-source validation and proprietary scoring models to ensure accuracy, consistency, and strategic relevance. Investment data is continuously monitored and refined based on verified announcement data, ensuring a balance between immediacy, reliability, and long-term foresight.
          </p>
          <Link href="/gfr/methodology" style={{color:'#0A3D62',fontWeight:700,fontSize:'14px',textDecoration:'none',
            display:'inline-flex',alignItems:'center',gap:'4px',
            padding:'8px 16px',borderRadius:'8px',background:'rgba(116,187,101,0.12)',border:'1px solid rgba(116,187,101,0.3)'}}>
            View Full Methodology →
          </Link>
        </div>

        {/* CTA */}
        <div style={{textAlign:'center',paddingBottom:'16px'}}>
          <div style={{display:'flex',gap:'12px',justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/register" className="gfm-btn-primary" style={{padding:'14px 32px',fontSize:'15px'}}>
              Start Free Trial →
            </Link>
            <Link href="/gfr" style={{padding:'14px 32px',fontSize:'15px',fontWeight:600,
              borderRadius:'8px',border:'2px solid #0A3D62',color:'#0A3D62',textDecoration:'none'}}>
              View GFR Rankings
            </Link>
            <Link href="/contact" style={{padding:'14px 32px',fontSize:'15px',fontWeight:600,
              borderRadius:'8px',border:'2px solid #696969',color:'#696969',textDecoration:'none'}}>
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
