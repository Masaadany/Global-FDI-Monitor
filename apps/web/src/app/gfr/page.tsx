'use client';
import { useState } from 'react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import PreviewGate from '@/components/PreviewGate';
import DimensionWheel from '@/components/DimensionWheel';
import Link from 'next/link';

const DIMS  = ['ETR','ICT','TCM','DTF','SGT','GRP'];
const TIERS = ['ALL','FRONTIER','HIGH','MEDIUM','DEVELOPING'];
const REGIONS = ['All Regions','Americas','Europe','Asia-Pacific','Middle East','Africa','South Asia'];

const GFR_DATA = [
  { r:1,  iso3:'SGP', name:'Singapore',     flag:'🇸🇬', score:100.0, ETR:98.2, ICT:97.5, TCM:96.8, DTF:95.4, SGT:94.2, GRP:93.8, tier:'FRONTIER', chg:+2,  region:'Asia-Pacific' },
  { r:2,  iso3:'CHE', name:'Switzerland',   flag:'🇨🇭', score:98.4,  ETR:96.5, ICT:95.8, TCM:95.2, DTF:94.1, SGT:93.5, GRP:92.9, tier:'FRONTIER', chg:-1,  region:'Europe' },
  { r:3,  iso3:'USA', name:'United States', flag:'🇺🇸', score:97.2,  ETR:95.8, ICT:98.9, TCM:94.5, DTF:96.2, SGT:92.8, GRP:91.5, tier:'FRONTIER', chg:0,   region:'Americas' },
  { r:4,  iso3:'DEU', name:'Germany',       flag:'🇩🇪', score:95.8,  ETR:94.2, ICT:93.8, TCM:94.1, DTF:93.5, SGT:92.1, GRP:91.8, tier:'FRONTIER', chg:0,   region:'Europe' },
  { r:5,  iso3:'ARE', name:'UAE',           flag:'🇦🇪', score:94.2,  ETR:93.5, ICT:92.8, TCM:93.1, DTF:92.5, SGT:91.8, GRP:90.5, tier:'FRONTIER', chg:+3,  region:'Middle East' },
  { r:6,  iso3:'SWE', name:'Sweden',        flag:'🇸🇪', score:93.8,  ETR:92.8, ICT:93.5, TCM:92.1, DTF:91.8, SGT:92.5, GRP:91.2, tier:'FRONTIER', chg:+1,  region:'Europe' },
  { r:7,  iso3:'CAN', name:'Canada',        flag:'🇨🇦', score:92.5,  ETR:91.8, ICT:92.1, TCM:91.5, DTF:92.8, SGT:91.2, GRP:90.8, tier:'FRONTIER', chg:0,   region:'Americas' },
  { r:8,  iso3:'NLD', name:'Netherlands',   flag:'🇳🇱', score:91.8,  ETR:91.2, ICT:91.5, TCM:92.5, DTF:91.2, SGT:90.8, GRP:90.2, tier:'FRONTIER', chg:+1,  region:'Europe' },
  { r:9,  iso3:'GBR', name:'UK',            flag:'🇬🇧', score:91.2,  ETR:90.8, ICT:91.8, TCM:91.2, DTF:90.5, SGT:90.2, GRP:89.8, tier:'FRONTIER', chg:-1,  region:'Europe' },
  { r:10, iso3:'JPN', name:'Japan',         flag:'🇯🇵', score:90.5,  ETR:90.2, ICT:91.2, TCM:89.8, DTF:90.8, SGT:89.5, GRP:89.2, tier:'FRONTIER', chg:0,   region:'Asia-Pacific' },
  { r:11, iso3:'KOR', name:'South Korea',   flag:'🇰🇷', score:89.8,  ETR:89.5, ICT:90.2, TCM:89.1, DTF:90.5, SGT:88.8, GRP:88.5, tier:'HIGH',     chg:+2,  region:'Asia-Pacific' },
  { r:12, iso3:'FRA', name:'France',        flag:'🇫🇷', score:89.2,  ETR:89.1, ICT:88.8, TCM:89.5, DTF:88.9, SGT:88.2, GRP:87.8, tier:'HIGH',     chg:-1,  region:'Europe' },
  { r:13, iso3:'AUS', name:'Australia',     flag:'🇦🇺', score:88.5,  ETR:88.2, ICT:88.5, TCM:88.1, DTF:88.8, SGT:87.9, GRP:87.5, tier:'HIGH',     chg:+1,  region:'Asia-Pacific' },
  { r:14, iso3:'SAU', name:'Saudi Arabia',  flag:'🇸🇦', score:86.2,  ETR:85.8, ICT:84.5, TCM:86.1, DTF:84.8, SGT:83.5, GRP:82.9, tier:'HIGH',     chg:+8,  region:'Middle East' },
  { r:15, iso3:'IND', name:'India',         flag:'🇮🇳', score:82.1,  ETR:81.5, ICT:80.8, TCM:82.5, DTF:79.8, SGT:78.5, GRP:77.9, tier:'HIGH',     chg:+4,  region:'South Asia' },
  { r:16, iso3:'VNM', name:'Vietnam',       flag:'🇻🇳', score:79.4,  ETR:78.8, ICT:77.5, TCM:79.2, DTF:76.5, SGT:75.2, GRP:74.8, tier:'HIGH',     chg:+6,  region:'Asia-Pacific' },
  { r:17, iso3:'POL', name:'Poland',        flag:'🇵🇱', score:82.5,  ETR:82.1, ICT:81.2, TCM:82.8, DTF:81.5, SGT:80.8, GRP:80.2, tier:'HIGH',     chg:+5,  region:'Europe' },
  { r:18, iso3:'ZAF', name:'South Africa',  flag:'🇿🇦', score:62.4,  ETR:62.1, ICT:61.5, TCM:63.2, DTF:60.8, SGT:59.5, GRP:58.9, tier:'MEDIUM',   chg:+1,  region:'Africa' },
  { r:19, iso3:'MAR', name:'Morocco',       flag:'🇲🇦', score:59.8,  ETR:59.5, ICT:58.8, TCM:60.2, DTF:57.5, SGT:56.8, GRP:56.2, tier:'MEDIUM',   chg:+2,  region:'Africa' },
  { r:20, iso3:'EGY', name:'Egypt',         flag:'🇪🇬', score:58.2,  ETR:57.9, ICT:56.5, TCM:58.8, DTF:55.2, SGT:54.5, GRP:53.9, tier:'MEDIUM',   chg:+3,  region:'Africa' },
];

const TIER_C: Record<string,string> = {
  FRONTIER:'#0A3D62', HIGH:'#1B6CA8', MEDIUM:'#74BB65', DEVELOPING:'#696969'
};
const TIER_BG: Record<string,string> = {
  FRONTIER:'rgba(10,61,98,0.1)', HIGH:'rgba(27,108,168,0.1)', MEDIUM:'rgba(116,187,101,0.12)', DEVELOPING:'rgba(105,105,105,0.1)'
};

const KEY_INSIGHTS = [
  'Asia-Pacific dominates top 10 with 6 economies, averaging 18% growth in future readiness indicators since 2020.',
  'GCC countries show strongest improvement: UAE (+12%), Saudi Arabia (+15%), Qatar (+8%) in economic resilience and competitiveness.',
  'Digital infrastructure remains the strongest differentiator between top 20 and lower-ranked economies, with a 42% average score gap.',
  'Small economies (<5M population) outperform larger peers in adaptability, scoring 18% higher on average in future readiness metrics.',
];

const TOP_BY_REGION = [
  { region:'Americas',     entries:[{n:'🇺🇸 USA',r:3},{n:'🇨🇦 Canada',r:7},{n:'🇧🇷 Brazil',r:24}] },
  { region:'Europe',       entries:[{n:'🇨🇭 Switzerland',r:2},{n:'🇩🇪 Germany',r:4},{n:'🇸🇪 Sweden',r:6}] },
  { region:'Asia-Pacific', entries:[{n:'🇸🇬 Singapore',r:1},{n:'🇯🇵 Japan',r:10},{n:'🇰🇷 Korea',r:12}] },
  { region:'Middle East',  entries:[{n:'🇦🇪 UAE',r:5},{n:'🇸🇦 Saudi Arabia',r:15},{n:'🇶🇦 Qatar',r:22}] },
  { region:'Africa',       entries:[{n:'🇿🇦 South Africa',r:38},{n:'🇲🇦 Morocco',r:45},{n:'🇪🇬 Egypt',r:52}] },
];

export default function GFRPage() {
  const [tab,     setTab]     = useState<'results'|'ranking'|'profile'|'comparison'|'methodology'>('results');
  const [year,    setYear]    = useState('2026');
  const [region,  setRegion]  = useState('All Regions');
  const [tier,    setTier]    = useState('ALL');
  const [search,  setSearch]  = useState('');
  const [profile, setProfile] = useState(GFR_DATA[4]); // UAE default
  const [compare, setCompare] = useState<typeof GFR_DATA>([GFR_DATA[4], GFR_DATA[0], GFR_DATA[3]]);
  const [showTop, setShowTop] = useState(10);

  const filtered = GFR_DATA.filter(e => {
    const mr = region === 'All Regions' || e.region === region;
    const mt = tier === 'ALL' || e.tier === tier;
    const ms = !search || e.name.toLowerCase().includes(search.toLowerCase());
    return mr && mt && ms;
  });

  const TABS = [
    {id:'results',     label:'Results & Key Findings'},
    {id:'ranking',     label:'The Ranking'},
    {id:'profile',     label:'Country Profile'},
    {id:'comparison',  label:'Comparison'},
    {id:'methodology', label:'Methodology & Framework'},
  ];

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/>
      <TrialBanner/>

      {/* Page header */}
      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'36px 24px 0'}}>
        <div style={{maxWidth:'1400px',margin:'0 auto'}}>
          <h1 style={{fontSize:'28px',fontWeight:800,color:'white',marginBottom:'20px',lineHeight:'1.2'}}>
            Global Investment Future Readiness &<br/>Competitiveness Ranking
          </h1>
          {/* Filters */}
          <div style={{display:'flex',gap:'10px',flexWrap:'wrap',marginBottom:'20px'}}>
            {[
              ['Year', year, setYear, ['2026','2025','2024','2023']],
              ['Region', region, setRegion, REGIONS],
            ].map(([label,val,setter,opts]:[any,any,any,any]) => (
              <div key={label} style={{display:'flex',alignItems:'center',gap:'6px'}}>
                <label style={{fontSize:'12px',color:'rgba(226,242,223,0.7)',fontWeight:600}}>{label}:</label>
                <select value={val} onChange={e=>setter(e.target.value)}
                  style={{padding:'5px 10px',borderRadius:'6px',border:'none',fontSize:'13px',
                    background:'rgba(255,255,255,0.15)',color:'white',cursor:'pointer'}}>
                  {opts.map((o:string) => <option key={o} style={{background:'#0A3D62'}}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
          {/* Tabs */}
          <div style={{display:'flex',gap:'0',overflowX:'auto'}}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id as any)}
                style={{
                  padding:'12px 18px',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:600,
                  whiteSpace:'nowrap',borderBottom:tab===t.id?'3px solid #74BB65':'3px solid transparent',
                  background:'transparent',color:tab===t.id?'white':'rgba(226,242,223,0.6)',
                  transition:'all 0.2s',
                }}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div style={{maxWidth:'1400px',margin:'0 auto',padding:'28px 24px'}}>

        {/* TAB 1: RESULTS */}
        {tab==='results' && (
          <div style={{display:'flex',flexDirection:'column',gap:'24px'}}>
            {/* Top performers */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px'}}>
              <div className="gfm-card" style={{padding:'24px'}}>
                <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'16px'}}>🏆 Top Global Ranking</div>
                {GFR_DATA.slice(0,5).map(e=>(
                  <div key={e.iso3} style={{display:'flex',alignItems:'center',gap:'10px',padding:'8px 0',borderBottom:'1px solid rgba(10,61,98,0.06)'}}>
                    <span style={{fontSize:'13px',fontWeight:800,color:'#74BB65',minWidth:'20px',fontFamily:'monospace'}}>{e.r}.</span>
                    <span style={{fontSize:'18px'}}>{e.flag}</span>
                    <span style={{flex:1,fontSize:'14px',fontWeight:600,color:'#0A3D62'}}>{e.name}</span>
                    <span style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',fontFamily:'monospace'}}>{e.score.toFixed(1)}</span>
                  </div>
                ))}
              </div>
              <div className="gfm-card" style={{padding:'24px'}}>
                <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'16px'}}>📈 Top Performance (Most Improved)</div>
                {[...GFR_DATA].sort((a,b)=>b.chg-a.chg).slice(0,5).map(e=>(
                  <div key={e.iso3} style={{display:'flex',alignItems:'center',gap:'10px',padding:'8px 0',borderBottom:'1px solid rgba(10,61,98,0.06)'}}>
                    <span style={{fontSize:'18px'}}>{e.flag}</span>
                    <span style={{flex:1,fontSize:'14px',fontWeight:600,color:'#0A3D62'}}>{e.name}</span>
                    <span style={{fontSize:'13px',fontWeight:700,color:'#74BB65',fontFamily:'monospace'}}>+{e.chg}</span>
                    <span style={{fontSize:'13px',color:'#696969',fontFamily:'monospace'}}>{e.score.toFixed(1)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* By region */}
            <div className="gfm-card" style={{padding:'24px'}}>
              <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'16px'}}>🌍 Top Ranking by Region</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr)',gap:'12px'}}>
                {TOP_BY_REGION.map(rg=>(
                  <div key={rg.region} style={{padding:'12px',borderRadius:'8px',background:'rgba(10,61,98,0.03)'}}>
                    <div style={{fontSize:'11px',fontWeight:700,color:'#0A3D62',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:'6px'}}>{rg.region}</div>
                    {rg.entries.map(e=>(
                      <div key={e.n} style={{fontSize:'12px',color:'#696969',padding:'2px 0'}}>
                        <span style={{fontWeight:600,color:'#0A3D62'}}>#{e.r}</span> {e.n}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Dimension leaders - 8 cards */}
            <div>
              <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'14px'}}>Top Global Ranking by Dimension & Factor</div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px'}}>
                {DIMS.map(dim=>(
                  <div key={dim} className="gfm-card" style={{padding:'16px'}}>
                    <div style={{fontSize:'11px',fontWeight:700,color:'#0A3D62',textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:'8px'}}>
                      {dim} — {dim==='ETR'?'Economic Resilience':dim==='ICT'?'Innovation Capacity':dim==='TCM'?'Trade & Capital':dim==='DTF'?'Digital & Tech':dim==='SGT'?'Sustainable Growth':'Governance & Policy'}
                    </div>
                    {[...GFR_DATA].sort((a,b)=>b[dim as keyof typeof a]-a[dim as keyof typeof a]).slice(0,5).map((e,i)=>(
                      <div key={e.iso3} style={{display:'flex',gap:'6px',padding:'3px 0',fontSize:'11px'}}>
                        <span style={{color:'#74BB65',fontWeight:700,minWidth:'12px'}}>{i+1}</span>
                        <span>{e.flag}</span>
                        <span style={{color:'#0A3D62',fontWeight:600,flex:1}}>{e.iso3}</span>
                        <span style={{color:'#696969',fontFamily:'monospace'}}>{(e[dim as keyof typeof e] as number).toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Key insights */}
            <div className="gfm-card" style={{padding:'24px'}}>
              <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'14px'}}>Key Insights & Analytics</div>
              <ul style={{listStyle:'none',padding:0,margin:0}}>
                {KEY_INSIGHTS.map((ins,i)=>(
                  <li key={i} style={{display:'flex',gap:'10px',padding:'8px 0',borderBottom:i<KEY_INSIGHTS.length-1?'1px solid rgba(10,61,98,0.05)':'none'}}>
                    <span style={{color:'#74BB65',flexShrink:0}}>•</span>
                    <span style={{fontSize:'13px',color:'#696969',lineHeight:'1.6'}}>{ins}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* TAB 2: RANKING TABLE */}
        {tab==='ranking' && (
          <PreviewGate feature="full_profile">
            <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
              {/* Controls */}
              <div style={{display:'flex',gap:'12px',alignItems:'center',flexWrap:'wrap'}}>
                <input value={search} onChange={e=>setSearch(e.target.value)}
                  placeholder="🔍 Search economy…"
                  style={{padding:'8px 14px',borderRadius:'8px',border:'1px solid rgba(10,61,98,0.15)',
                    fontSize:'13px',background:'white',color:'#000',outline:'none'}}/>
                <div style={{display:'flex',gap:'4px'}}>
                  {TIERS.map(t=>(
                    <button key={t} onClick={()=>setTier(t)}
                      style={{padding:'6px 12px',borderRadius:'6px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:700,
                        background:tier===t?TIER_C[t]||'#0A3D62':'rgba(10,61,98,0.06)',
                        color:tier===t?'white':'#0A3D62',}}>
                      {t}
                    </button>
                  ))}
                </div>
                <div style={{display:'flex',gap:'6px',marginLeft:'auto'}}>
                  {[10,20,50].map(n=>(
                    <button key={n} onClick={()=>setShowTop(n)}
                      style={{padding:'5px 10px',borderRadius:'5px',border:'none',cursor:'pointer',fontSize:'12px',
                        background:showTop===n?'#0A3D62':'rgba(10,61,98,0.06)',
                        color:showTop===n?'white':'#0A3D62',fontWeight:600}}>
                      Top {n}
                    </button>
                  ))}
                </div>
              </div>
              <div className="gfm-card" style={{overflow:'auto'}}>
                <table className="gfm-table" style={{minWidth:'800px'}}>
                  <thead><tr>
                    <th>Rank</th><th>Economy</th><th>Score</th>
                    {DIMS.map(d=><th key={d}>{d}</th>)}
                    <th>Tier</th><th>vs 2025</th>
                  </tr></thead>
                  <tbody>
                    {filtered.slice(0,showTop).map(e=>(
                      <tr key={e.iso3} onClick={()=>{setProfile(e);setTab('profile');}} style={{cursor:'pointer'}}>
                        <td style={{fontWeight:800,fontFamily:'monospace',color:'#0A3D62'}}>#{e.r}</td>
                        <td>
                          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                            <span style={{fontSize:'18px'}}>{e.flag}</span>
                            <span style={{fontWeight:600,color:'#000'}}>{e.name}</span>
                          </div>
                        </td>
                        <td style={{fontWeight:800,fontFamily:'monospace',fontSize:'15px',color:'#0A3D62'}}>{e.score.toFixed(1)}</td>
                        {DIMS.map(d=>(
                          <td key={d} style={{fontFamily:'monospace',fontSize:'12px',color:'#696969'}}>{(e[d as keyof typeof e] as number).toFixed(1)}</td>
                        ))}
                        <td>
                          <span style={{fontSize:'11px',fontWeight:700,padding:'3px 8px',borderRadius:'12px',
                            background:TIER_BG[e.tier],color:TIER_C[e.tier]}}>
                            {e.tier}
                          </span>
                        </td>
                        <td style={{fontFamily:'monospace',fontSize:'13px',fontWeight:700,
                          color:e.chg>0?'#74BB65':e.chg<0?'#E57373':'#696969'}}>
                          {e.chg>0?`▲+${e.chg}`:e.chg<0?`▼${e.chg}`:'▬ 0'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p style={{fontSize:'12px',color:'#696969',textAlign:'center'}}>
                Showing {Math.min(filtered.length,showTop)} of 215 economies. Click any row for full country profile.
              </p>
            </div>
          </PreviewGate>
        )}

        {/* TAB 3: COUNTRY PROFILE */}
        {tab==='profile' && (
          <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
            {/* Selector */}
            <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
              {GFR_DATA.slice(0,10).map(e=>(
                <button key={e.iso3} onClick={()=>setProfile(e)}
                  style={{padding:'7px 14px',borderRadius:'8px',border:'1px solid rgba(10,61,98,0.15)',
                    cursor:'pointer',fontSize:'13px',fontWeight:600,transition:'all 0.15s',
                    background:profile.iso3===e.iso3?'#0A3D62':'white',
                    color:profile.iso3===e.iso3?'white':'#0A3D62'}}>
                  {e.flag} {e.iso3}
                </button>
              ))}
            </div>

            {/* Profile card */}
            <div className="gfm-card" style={{padding:'28px'}}>
              <div style={{display:'flex',alignItems:'flex-start',gap:'20px',marginBottom:'24px',flexWrap:'wrap'}}>
                <div style={{fontSize:'64px'}}>{profile.flag}</div>
                <div style={{flex:1}}>
                  <h2 style={{fontSize:'24px',fontWeight:800,color:'#0A3D62',marginBottom:'4px'}}>{profile.name}</h2>
                  <div style={{display:'flex',gap:'16px',flexWrap:'wrap'}}>
                    <div>
                      <span style={{fontSize:'32px',fontWeight:900,color:'#74BB65',fontFamily:'monospace'}}>#{profile.r}</span>
                      <span style={{fontSize:'14px',color:'#696969',marginLeft:'6px'}}>Global Rank</span>
                    </div>
                    <div>
                      <span style={{fontSize:'32px',fontWeight:900,color:'#0A3D62',fontFamily:'monospace'}}>{profile.score.toFixed(1)}</span>
                      <span style={{fontSize:'14px',color:'#696969',marginLeft:'6px'}}>GFR Score</span>
                    </div>
                    <div>
                      <span style={{fontSize:'20px',fontWeight:700,color:profile.chg>0?'#74BB65':'#E57373',fontFamily:'monospace'}}>
                        {profile.chg>0?`▲ +${profile.chg}`:profile.chg<0?`▼ ${profile.chg}`:'▬ 0'}
                      </span>
                      <span style={{fontSize:'14px',color:'#696969',marginLeft:'6px'}}>vs 2025</span>
                    </div>
                    <span style={{padding:'5px 14px',borderRadius:'20px',fontSize:'12px',fontWeight:700,
                      background:TIER_BG[profile.tier],color:TIER_C[profile.tier]}}>
                      {profile.tier}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dimension bars */}
              <div style={{marginBottom:'20px'}}>
                <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'12px'}}>Dimension Scores</div>
                {DIMS.map(dim=>{
                  const val = profile[dim as keyof typeof profile] as number;
                  const dimName = dim==='ETR'?'Economic Resilience':dim==='ICT'?'Innovation Capacity':dim==='TCM'?'Trade & Capital':dim==='DTF'?'Digital & Tech':dim==='SGT'?'Sustainable Growth':'Governance & Policy';
                  return (
                    <div key={dim} style={{marginBottom:'10px'}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
                        <div style={{fontSize:'12px',color:'#696969'}}><b style={{color:'#0A3D62'}}>{dim}</b> — {dimName}</div>
                        <span style={{fontSize:'13px',fontWeight:700,fontFamily:'monospace',color:'#0A3D62'}}>{val.toFixed(1)}</span>
                      </div>
                      <div style={{height:'8px',borderRadius:'4px',background:'rgba(10,61,98,0.08)'}}>
                        <div style={{height:'100%',borderRadius:'4px',width:`${val}%`,background:'linear-gradient(90deg,#74BB65,#0A3D62)',transition:'width 0.5s ease'}}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: COMPARISON */}
        {tab==='comparison' && (
          <div style={{display:'flex',flexDirection:'column',gap:'20px'}}>
            <div style={{display:'flex',gap:'8px',flexWrap:'wrap',alignItems:'center'}}>
              <span style={{fontSize:'13px',fontWeight:600,color:'#696969'}}>Selected:</span>
              {compare.map(e=>(
                <span key={e.iso3} style={{display:'flex',alignItems:'center',gap:'4px',padding:'5px 10px',
                  borderRadius:'6px',background:'rgba(10,61,98,0.08)',fontSize:'13px',fontWeight:600,color:'#0A3D62'}}>
                  {e.flag} {e.iso3}
                  <button onClick={()=>setCompare(compare.filter(x=>x.iso3!==e.iso3))}
                    style={{border:'none',background:'transparent',cursor:'pointer',color:'#E57373',fontSize:'14px',lineHeight:1}}>×</button>
                </span>
              ))}
              {compare.length < 5 && (
                <select onChange={e=>{
                  const found = GFR_DATA.find(x=>x.iso3===e.target.value);
                  if(found&&!compare.find(x=>x.iso3===found.iso3)) setCompare([...compare,found]);
                  e.target.value='';
                }} style={{padding:'6px 10px',borderRadius:'6px',border:'1px solid rgba(10,61,98,0.15)',fontSize:'12px',color:'#0A3D62',background:'white'}}>
                  <option value="">➕ Add country…</option>
                  {GFR_DATA.filter(x=>!compare.find(c=>c.iso3===x.iso3)).map(e=>(
                    <option key={e.iso3} value={e.iso3}>{e.flag} {e.name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Individual cards */}
            <div style={{display:'grid',gridTemplateColumns:`repeat(${compare.length},1fr)`,gap:'14px'}}>
              {compare.map(e=>(
                <div key={e.iso3} className="gfm-card" style={{padding:'18px'}}>
                  <div style={{textAlign:'center',marginBottom:'12px'}}>
                    <div style={{fontSize:'32px'}}>{e.flag}</div>
                    <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62'}}>{e.name}</div>
                    <div style={{fontSize:'24px',fontWeight:800,fontFamily:'monospace',color:'#74BB65'}}>{e.score.toFixed(1)}</div>
                  </div>
                  {DIMS.map(d=>(
                    <div key={d} style={{display:'flex',justifyContent:'space-between',fontSize:'11px',padding:'3px 0',borderBottom:'1px solid rgba(10,61,98,0.04)'}}>
                      <span style={{fontWeight:700,color:'#0A3D62'}}>{d}</span>
                      <span style={{fontFamily:'monospace',color:'#696969'}}>{(e[d as keyof typeof e] as number).toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Comparison table */}
            <div className="gfm-card" style={{overflow:'auto'}}>
              <table className="gfm-table">
                <thead><tr>
                  <th>Economy</th><th>Score</th>
                  {DIMS.map(d=><th key={d}>{d}</th>)}
                  <th>vs 2025</th>
                </tr></thead>
                <tbody>
                  {compare.map(e=>(
                    <tr key={e.iso3}>
                      <td><span style={{fontSize:'20px'}}>{e.flag}</span> <b style={{color:'#0A3D62'}}>{e.name}</b></td>
                      <td style={{fontWeight:800,fontFamily:'monospace',color:'#0A3D62'}}>{e.score.toFixed(1)}</td>
                      {DIMS.map(d=>(
                        <td key={d} style={{fontFamily:'monospace',fontSize:'12px',color:'#696969'}}>{(e[d as keyof typeof e] as number).toFixed(1)}</td>
                      ))}
                      <td style={{fontFamily:'monospace',fontWeight:700,color:e.chg>0?'#74BB65':e.chg<0?'#E57373':'#696969'}}>
                        {e.chg>0?`▲+${e.chg}`:e.chg<0?`▼${e.chg}`:'▬ 0'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: METHODOLOGY */}
        {tab==='methodology' && (
          <div style={{display:'flex',flexDirection:'column',gap:'24px'}}>
            <div className="gfm-card" style={{padding:'28px'}}>
              <h2 style={{fontSize:'18px',fontWeight:700,color:'#0A3D62',marginBottom:'6px'}}>Ranking Framework — 6 Dimensions</h2>
              <p style={{fontSize:'13px',color:'#696969',marginBottom:'20px'}}>Click dimensions to expand sub-indicators.</p>
              <DimensionWheel/>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px'}}>
              {[
                {t:'Scoring Methodology',pts:['All indicators normalised 0–100','Min-max with 5-year historical bounds','Outlier caps at 3σ','Ties broken by ICT then ETR']},
                {t:'Calculation Process',pts:['Dimension = weighted avg of sub-indicators','Overall = weighted avg of 6 dimensions','Quarterly recalculation cycle','Version-controlled with audit trail']},
                {t:'Data Sources (15+)',pts:['World Bank · IMF · UNCTAD · OECD','GII · CCPI · WJP · Oxford Economics','300+ trusted primary sources','Real-time signal integration']},
                {t:'Verification Process',pts:['Cross-source validation (min 2 sources)','Outlier detection & analyst review','Annual methodology update','Expert panel validation']},
              ].map(({t,pts})=>(
                <div key={t} className="gfm-card" style={{padding:'20px'}}>
                  <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'10px'}}>{t}</div>
                  <ul style={{listStyle:'none',padding:0,margin:0}}>
                    {pts.map(p=>(
                      <li key={p} style={{display:'flex',gap:'6px',padding:'4px 0',fontSize:'12px',color:'#696969'}}>
                        <span style={{color:'#74BB65',flexShrink:0}}>•</span>{p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div style={{textAlign:'center'}}>
              <Link href="/gfr/methodology" className="gfm-btn-primary" style={{padding:'12px 28px',textDecoration:'none',fontSize:'14px'}}>
                Download Full Methodology Report →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
