import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import DimensionWheel from '@/components/DimensionWheel';
import SourceBadge from '@/components/SourceBadge';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'GFR Methodology — FDI Monitor',
  description: 'Global Future Readiness Ranking methodology. 7 pillars, 28 dimensions, 112 indicators, 215 economies. ETR, ICT, TCM, DTF, SGT, GRP dimensions explained.',
};

const SOURCES = [
  { abbr:'WEO',  name:'IMF World Economic Outlook Apr 2026',   url:'https://imf.org/en/Publications/WEO', date:'Apr 2026',  ref:'GFM-SRC-000001' },
  { abbr:'GII',  name:'Global Innovation Index 2024',          url:'https://wipo.int/gii',                date:'Oct 2024', ref:'GFM-SRC-000002' },
  { abbr:'CCPI', name:'Climate Change Performance Index 2025', url:'https://ccpi.org',                    date:'Nov 2024', ref:'GFM-SRC-000003' },
  { abbr:'WJPI', name:'World Justice Project Rule of Law 2025',url:'https://worldjusticeproject.org',     date:'Oct 2025', ref:'GFM-SRC-000004' },
  { abbr:'WIR',  name:'UNCTAD World Investment Report 2025',   url:'https://unctad.org/wir',              date:'Jun 2025', ref:'GFM-SRC-000005' },
  { abbr:'WCR',  name:'IMD World Competitiveness Ranking 2025',url:'https://imd.org/centers/wcc/world-competitiveness-center/', date:'Jun 2025', ref:'GFM-SRC-000006' },
];

const PILLARS = [
  { n:'I',   name:'Market Fundamentals',       dims:['ETR','GRP'], icon:'📊' },
  { n:'II',  name:'Innovation Ecosystem',      dims:['ICT'],       icon:'💡' },
  { n:'III', name:'Human Capital',             dims:['TCM'],       icon:'🧑‍💼' },
  { n:'IV',  name:'Digital Infrastructure',   dims:['DTF'],       icon:'📡' },
  { n:'V',   name:'Sustainability',            dims:['SGT'],       icon:'🌿' },
  { n:'VI',  name:'Investment Climate',        dims:['IRES','IMS'],icon:'🌐' },
  { n:'VII', name:'Future Readiness',          dims:['PAI','GCI'], icon:'🔭' },
];

const NORMALISE_STEPS = [
  { n:1, title:'Raw Data Collection',          desc:'Collect indicators from 15+ authoritative sources across all 215 economies annually.' },
  { n:2, title:'Schema Validation',            desc:'Enforce correct formats, units, ISO-3166 codes, sector taxonomy, and range constraints.' },
  { n:3, title:'Cross-Source Verification',    desc:'Every critical indicator verified against 2–3 independent sources; conflicts resolved by Reconciliation Agent.' },
  { n:4, title:'Z-Score Normalisation',        desc:'All indicators standardised to mean 0, SD 1. Winsorised at ±3σ to control outliers.' },
  { n:5, title:'Min-Max Rescaling',            desc:'Normalised values mapped to 0–100 scale. Higher = better readiness throughout.' },
  { n:6, title:'Weighted Aggregation',         desc:'Dimension scores aggregated by pillar weights. Pillar scores aggregated to final GFR score.' },
];

export default function MethodologyPage() {
  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>

      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'48px 24px 32px'}}>
        <div className="max-w-screen-lg mx-auto">
          <div style={{fontSize:'11px',fontWeight:800,textTransform:'uppercase',letterSpacing:'0.1em',color:'#74BB65',marginBottom:'8px'}}>
            Technical Reference Manual · TRS-GMFRR-001
          </div>
          <h1 style={{fontSize:'32px',fontWeight:800,color:'white',marginBottom:'12px',lineHeight:'1.2'}}>
            Global Future Readiness Ranking<br/>Methodology
          </h1>
          <p style={{color:'rgba(226,242,223,0.8)',maxWidth:'640px',lineHeight:'1.6',marginBottom:'20px'}}>
            A composite, forward-looking framework synthesising intelligence from 15+ leading international indices into a single authoritative assessment of each economy's readiness to attract, sustain, and benefit from global investment flows over a 5-year horizon.
          </p>
          <div style={{display:'flex',gap:'24px',flexWrap:'wrap'}}>
            {[['7','Pillars'],['28','Dimensions'],['112','Indicators'],['215','Economies'],['15+','Source Indices'],['Annual','Publication']].map(([v,l])=>(
              <div key={l} style={{textAlign:'center'}}>
                <div style={{fontSize:'24px',fontWeight:800,color:'#74BB65',fontFamily:'monospace'}}>{v}</div>
                <div style={{fontSize:'11px',color:'rgba(226,242,223,0.7)'}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-screen-lg mx-auto px-6 py-8 space-y-8">

        {/* 6-Dimension Wheel */}
        <div className="gfm-card" style={{padding:'28px'}}>
          <h2 style={{fontSize:'18px',fontWeight:700,color:'#0A3D62',marginBottom:'4px'}}>
            The Six Core Dimensions
          </h2>
          <p style={{fontSize:'13px',color:'#696969',marginBottom:'20px'}}>
            Click a dimension to expand indicators. Width represents score; weight shown as W:%.
          </p>
          <DimensionWheel/>
        </div>

        {/* 7 Pillars */}
        <div className="gfm-card" style={{padding:'28px'}}>
          <h2 style={{fontSize:'18px',fontWeight:700,color:'#0A3D62',marginBottom:'16px'}}>
            7-Pillar Architecture
          </h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:'12px'}}>
            {PILLARS.map(p=>(
              <div key={p.n} style={{
                padding:'16px',borderRadius:'10px',
                background:'rgba(10,61,98,0.04)',border:'1px solid rgba(10,61,98,0.08)',
              }}>
                <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'6px'}}>
                  <span style={{fontSize:'20px'}}>{p.icon}</span>
                  <div>
                    <div style={{fontSize:'10px',color:'#696969',fontWeight:700}}>PILLAR {p.n}</div>
                    <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62'}}>{p.name}</div>
                  </div>
                </div>
                <div style={{display:'flex',gap:'4px',flexWrap:'wrap'}}>
                  {p.dims.map(d=>(
                    <span key={d} style={{fontSize:'10px',background:'rgba(116,187,101,0.15)',
                      color:'#0A3D62',padding:'2px 8px',borderRadius:'12px',fontWeight:700}}>{d}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Normalisation methodology */}
        <div className="gfm-card" style={{padding:'28px'}}>
          <h2 style={{fontSize:'18px',fontWeight:700,color:'#0A3D62',marginBottom:'16px'}}>
            6-Step Normalisation & Scoring
          </h2>
          <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'12px'}}>
            {NORMALISE_STEPS.map(s=>(
              <div key={s.n} style={{display:'flex',gap:'12px',alignItems:'flex-start',
                padding:'14px',background:'rgba(10,61,98,0.03)',borderRadius:'10px'}}>
                <div style={{
                  width:'28px',height:'28px',borderRadius:'50%',flexShrink:0,
                  background:'#0A3D62',color:'white',display:'flex',alignItems:'center',
                  justifyContent:'center',fontSize:'12px',fontWeight:800,
                }}>{s.n}</div>
                <div>
                  <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'3px'}}>{s.title}</div>
                  <div style={{fontSize:'12px',color:'#696969',lineHeight:'1.4'}}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Sources */}
        <div className="gfm-card" style={{padding:'28px'}}>
          <h2 style={{fontSize:'18px',fontWeight:700,color:'#0A3D62',marginBottom:'16px'}}>
            Primary Data Sources
          </h2>
          <div className="gfm-card" style={{overflow:'hidden'}}>
            <table className="gfm-table">
              <thead><tr><th>Code</th><th>Source</th><th>Published</th><th>Reference</th></tr></thead>
              <tbody>
                {SOURCES.map(s=>(
                  <tr key={s.abbr}>
                    <td style={{fontFamily:'monospace',fontWeight:700,color:'#0A3D62'}}>{s.abbr}</td>
                    <td>
                      <a href={s.url} target="_blank" rel="noopener" style={{color:'#1B6CA8',fontWeight:500,textDecoration:'none'}}>
                        {s.name} ↗
                      </a>
                    </td>
                    <td style={{color:'#696969',fontSize:'12px'}}>{s.date}</td>
                    <td style={{fontFamily:'monospace',fontSize:'11px',color:'#696969'}}>{s.ref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{fontSize:'12px',color:'#696969',marginTop:'12px'}}>
            Full source inventory in the{' '}
            <Link href="/sources" style={{color:'#1B6CA8'}}>Data Sources Registry →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
