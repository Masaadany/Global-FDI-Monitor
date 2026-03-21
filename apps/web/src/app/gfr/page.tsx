'use client';
import { useState } from 'react';
import { Award, Globe, TrendingUp, BarChart3, Target, CheckCircle, ArrowRight, Shield, Search } from 'lucide-react';
import NavBar from '@/components/NavBar';
import TrialBanner from '@/components/TrialBanner';
import Footer from '@/components/Footer';
import RadarChart from '@/components/RadarChart';
import SourceBadge from '@/components/SourceBadge';
import PreviewGate from '@/components/PreviewGate';
import Link from 'next/link';

const DIMS = ['ETR','ICT','TCM','DTF','SGT','GRP'];
const DIM_FULL: Record<string,{name:string,color:string,desc:string,weight:number}> = {
  ETR:{name:'Economic & Trade Resilience',  color:'#0A3D62',desc:'Macro stability, trade openness, external balance, currency resilience.',weight:20},
  ICT:{name:'Innovation & Creative Talent', color:'#74BB65',desc:'R&D spend, patent filings, STEM graduates, startup ecosystem.',     weight:18},
  TCM:{name:'Trade & Capital Mobility',     color:'#1B6CA8',desc:'FDI inflows, capital controls, current account, trade facilitation.',weight:18},
  DTF:{name:'Digital & Tech Frontier',      color:'#2E86AB',desc:'Broadband penetration, cloud adoption, digital government, AI readiness.',weight:16},
  SGT:{name:'Sustainable Growth Trajectory',color:'#74BB65',desc:'Green investment share, carbon intensity, ESG governance, SDG progress.',weight:15},
  GRP:{name:'Governance & Policy',          color:'#0A3D62',desc:'Rule of law, regulatory quality, political stability, anti-corruption.',weight:13},
};

const GFR_DATA = [
  {iso3:'SGP',flag:'🇸🇬',name:'Singapore',   score:100.0,tier:'VERY HIGH',chg:'+0.2',ETR:98.2,ICT:97.5,TCM:96.8,DTF:95.4,SGT:94.2,GRP:93.8,fdi:'$18.5B',jobs:'82K'},
  {iso3:'CHE',flag:'🇨🇭',name:'Switzerland', score:97.8, tier:'VERY HIGH',chg:'-0.1',ETR:96.4,ICT:98.1,TCM:94.2,DTF:96.8,SGT:92.1,GRP:97.2,fdi:'$14.2B',jobs:'55K'},
  {iso3:'USA',flag:'🇺🇸',name:'USA',          score:96.4, tier:'VERY HIGH',chg:'+0.3',ETR:95.8,ICT:97.2,TCM:93.5,DTF:97.1,SGT:88.4,GRP:92.6,fdi:'$285B',jobs:'1.2M'},
  {iso3:'DEU',flag:'🇩🇪',name:'Germany',     score:95.8, tier:'VERY HIGH',chg:'0.0', ETR:94.2,ICT:93.8,TCM:94.1,DTF:93.5,SGT:92.1,GRP:91.8,fdi:'$14.2B',jobs:'62K'},
  {iso3:'ARE',flag:'🇦🇪',name:'UAE',          score:94.2, tier:'VERY HIGH',chg:'+0.4',ETR:93.5,ICT:92.8,TCM:93.1,DTF:92.5,SGT:91.8,GRP:90.5,fdi:'$25.3B',jobs:'98K'},
  {iso3:'GBR',flag:'🇬🇧',name:'UK',           score:93.1, tier:'VERY HIGH',chg:'-0.2',ETR:92.4,ICT:93.5,TCM:92.8,DTF:91.9,SGT:90.2,GRP:92.4,fdi:'$58.2B',jobs:'214K'},
  {iso3:'SAU',flag:'🇸🇦',name:'Saudi Arabia', score:86.2, tier:'HIGH',     chg:'+0.8',ETR:85.8,ICT:84.5,TCM:86.1,DTF:84.8,SGT:83.5,GRP:82.9,fdi:'$18.2B',jobs:'88K'},
  {iso3:'KOR',flag:'🇰🇷',name:'South Korea', score:84.1, tier:'HIGH',     chg:'+0.1',ETR:86.0,ICT:88.2,TCM:82.8,DTF:91.5,SGT:79.4,GRP:83.8,fdi:'$12.8B',jobs:'45K'},
  {iso3:'IND',flag:'🇮🇳',name:'India',        score:82.1, tier:'HIGH',     chg:'+0.4',ETR:81.5,ICT:80.8,TCM:82.5,DTF:79.8,SGT:78.5,GRP:77.9,fdi:'$12.3B',jobs:'320K'},
  {iso3:'MYS',flag:'🇲🇾',name:'Malaysia',    score:78.2, tier:'HIGH',     chg:'+0.3',ETR:79.8,ICT:77.5,TCM:78.1,DTF:77.4,SGT:76.2,GRP:75.8,fdi:'$9.8B', jobs:'38K'},
  {iso3:'VNM',flag:'🇻🇳',name:'Vietnam',     score:79.4, tier:'HIGH',     chg:'+0.5',ETR:80.5,ICT:78.2,TCM:79.1,DTF:76.5,SGT:75.2,GRP:74.8,fdi:'$8.9B', jobs:'180K'},
  {iso3:'NGA',flag:'🇳🇬',name:'Nigeria',     score:52.4, tier:'MEDIUM',   chg:'+0.2',ETR:51.2,ICT:48.5,TCM:53.8,DTF:46.2,SGT:49.8,GRP:44.1,fdi:'$2.1B', jobs:'24K'},
  {iso3:'ETH',flag:'🇪🇹',name:'Ethiopia',    score:44.8, tier:'LOW',      chg:'+0.6',ETR:43.1,ICT:38.4,TCM:46.2,DTF:35.8,SGT:42.1,GRP:40.5,fdi:'$1.2B', jobs:'18K'},
];

const TIER_C: Record<string,string>  = {'VERY HIGH':'#74BB65','HIGH':'#0A3D62','MEDIUM':'#FFB347','LOW':'#E57373'};
const TIER_BG: Record<string,string> = {'VERY HIGH':'rgba(116,187,101,0.1)','HIGH':'rgba(10,61,98,0.1)','MEDIUM':'rgba(255,179,71,0.1)','LOW':'rgba(229,115,115,0.1)'};

function TierBadge({tier}:{tier:string}) {
  return (
    <span style={{fontSize:'10px',fontWeight:700,padding:'2px 8px',borderRadius:'10px',
      background:TIER_BG[tier],color:TIER_C[tier],whiteSpace:'nowrap'}}>{tier}</span>
  );
}

export default function GFRRankingPage() {
  const [tab,      setTab]      = useState<'results'|'profile'|'compare'|'methodology'|'ia'>('results');
  const [selected, setSelected] = useState('SGP');
  const [compare,  setCompare]  = useState<string[]>(['SGP','ARE','SAU']);
  const [search,   setSearch]   = useState('');

  const profile = GFR_DATA.find(e=>e.iso3===selected);
  const TABS = [
    {id:'results',     label:'Assessment Results'},
    {id:'profile',     label:'Economy Profile'},
    {id:'compare',     label:'Compare Economies'},
    {id:'methodology', label:'Methodology'},
    {id:'ia',          label:'Investment Analysis →'},
  ];

  const filtered = GFR_DATA.filter(e=>
    !search || e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.iso3.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{background:'#E2F2DF'}}>
      <NavBar/><TrialBanner/>
      <section style={{background:'linear-gradient(135deg,#0A3D62 0%,#1B6CA8 100%)',padding:'36px 24px 0'}}>
        <div style={{maxWidth:'1400px',margin:'0 auto'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',flexWrap:'wrap',gap:'16px',marginBottom:'20px'}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:'8px',marginBottom:'8px'}}>
                <Award size={16} color="#74BB65"/>
                <span style={{fontSize:'11px',fontWeight:800,color:'#74BB65',letterSpacing:'0.08em',textTransform:'uppercase'}}>Global Future Readiness (GFR) Ranking</span>
              </div>
              <h1 style={{fontSize:'28px',fontWeight:800,color:'white',marginBottom:'6px'}}>GFR Ranking 2026</h1>
              <p style={{color:'rgba(226,242,223,0.8)',fontSize:'13px'}}>
                215 economies · 6 dimensions · 38 indicators · Quarterly recalculation
              </p>
            </div>
            <div style={{display:'flex',gap:'20px'}}>
              {[['215','Economies'],['6','Dimensions'],['38','Indicators'],['Q1 2026','Edition']].map(([v,l])=>(
                <div key={l} style={{textAlign:'center'}}>
                  <div style={{fontSize:'18px',fontWeight:800,color:'#74BB65',fontFamily:'monospace'}}>{v}</div>
                  <div style={{fontSize:'10px',color:'rgba(226,242,223,0.6)'}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:'flex',gap:'0',overflowX:'auto'}}>
            {TABS.map(t=>(
              <button key={t.id} onClick={()=>t.id==='ia' ? window.location.href='/investment-analysis' : setTab(t.id as any)}
                style={{padding:'11px 18px',border:'none',cursor:'pointer',fontSize:'13px',fontWeight:600,
                  whiteSpace:'nowrap',background:'transparent',
                  borderBottom:tab===t.id?'3px solid #74BB65':'3px solid transparent',
                  color:tab===t.id?'white':t.id==='ia'?'#74BB65':'rgba(226,242,223,0.65)',transition:'all 0.2s'}}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div style={{maxWidth:'1400px',margin:'0 auto',padding:'24px'}}>

        {/* RESULTS TAB */}
        {tab==='results' && (
          <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
            <div style={{display:'flex',gap:'10px',flexWrap:'wrap',alignItems:'center'}}>
              <Search size={14} color="#696969"/>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search economy…"
                style={{padding:'8px 14px',borderRadius:'8px',border:'1px solid rgba(10,61,98,0.15)',
                  fontSize:'13px',background:'white',color:'#000',outline:'none',minWidth:'200px'}}/>
              <span style={{fontSize:'12px',color:'#696969',marginLeft:'auto'}}>{filtered.length} economies shown</span>
            </div>
            <div className="gfm-card" style={{overflow:'hidden'}}>
              <div style={{padding:'13px 20px',borderBottom:'1px solid rgba(10,61,98,0.06)',
                display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',display:'flex',alignItems:'center',gap:'6px'}}>
                  <BarChart3 size={14} color="#74BB65"/> GFR Ranking Results — Q1 2026
                </div>
                <div style={{fontSize:'11px',color:'#696969',fontStyle:'italic'}}>
                  Sorted by GFR Score (highest first) · Economy Ranking
                </div>
              </div>
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead>
                    <tr style={{background:'rgba(10,61,98,0.03)'}}>
                      {['Economy','GFR Score','Tier','ETR','ICT','TCM','DTF','SGT','GRP','Δ Q/Q','FDI Inflows','Jobs'].map(h=>(
                        <th key={h} style={{padding:'10px 12px',fontSize:'11px',fontWeight:700,color:'#696969',
                          textAlign:'left',textTransform:'uppercase',letterSpacing:'0.04em',whiteSpace:'nowrap'}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.sort((a,b)=>b.score-a.score).map((e,i)=>(
                      <tr key={e.iso3}
                        onClick={()=>{setSelected(e.iso3);setTab('profile');}}
                        style={{borderBottom:'1px solid rgba(10,61,98,0.05)',cursor:'pointer',
                          background:i%2===0?'white':'rgba(10,61,98,0.01)'}}
                        onMouseEnter={ev=>ev.currentTarget.style.background='rgba(116,187,101,0.04)'}
                        onMouseLeave={ev=>ev.currentTarget.style.background=i%2===0?'white':'rgba(10,61,98,0.01)'}>
                        <td style={{padding:'11px 12px'}}>
                          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                            <span style={{fontSize:'20px'}}>{e.flag}</span>
                            <span style={{fontWeight:700,color:'#0A3D62',fontSize:'13px'}}>{e.name}</span>
                          </div>
                        </td>
                        <td style={{padding:'11px 12px'}}>
                          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                            <span style={{fontSize:'16px',fontWeight:900,color:'#0A3D62',fontFamily:'monospace'}}>{e.score.toFixed(1)}</span>
                            <div style={{width:'48px',height:'5px',borderRadius:'3px',background:'rgba(10,61,98,0.07)'}}>
                              <div style={{height:'100%',borderRadius:'3px',width:`${e.score}%`,background:TIER_C[e.tier]}}/>
                            </div>
                          </div>
                        </td>
                        <td style={{padding:'11px 12px'}}><TierBadge tier={e.tier}/></td>
                        {DIMS.map(d=>(
                          <td key={d} style={{padding:'11px 12px',fontFamily:'monospace',fontSize:'11px',
                            color:DIM_FULL[d].color}}>{(e as any)[d].toFixed(1)}</td>
                        ))}
                        <td style={{padding:'11px 12px',fontFamily:'monospace',fontWeight:700,fontSize:'12px',
                          color:e.chg.startsWith('+')?'#74BB65':e.chg.startsWith('-')?'#E57373':'#696969'}}>{e.chg}</td>
                        <td style={{padding:'11px 12px',fontSize:'12px',fontWeight:700,color:'#0A3D62',fontFamily:'monospace'}}>{e.fdi}</td>
                        <td style={{padding:'11px 12px',fontSize:'12px',color:'#696969'}}>{e.jobs}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
              {Object.entries(TIER_C).map(([tier,color])=>{
                const cnt = GFR_DATA.filter(e=>e.tier===tier).length;
                return (
                  <div key={tier} style={{display:'flex',alignItems:'center',gap:'8px',padding:'10px 16px',
                    borderRadius:'9px',background:'white',boxShadow:'0 2px 8px rgba(10,61,98,0.06)'}}>
                    <div style={{width:'10px',height:'10px',borderRadius:'50%',background:color}}/>
                    <span style={{fontSize:'12px',fontWeight:700,color}}>{tier}</span>
                    <span style={{fontSize:'12px',color:'#696969'}}>{cnt} economies</span>
                  </div>
                );
              })}
              <SourceBadge source="GFM Internal Computation" date="Q1 2026" accessed="20 Mar 2026" refCode="GFM-SRC-GFR-001">
                <span style={{fontSize:'11px',color:'#696969',padding:'10px 16px',background:'white',
                  borderRadius:'9px',boxShadow:'0 2px 8px rgba(10,61,98,0.06)',cursor:'default'}}>
                  Data source ℹ
                </span>
              </SourceBadge>
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {tab==='profile' && profile && (
          <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
            <div style={{display:'flex',gap:'10px',flexWrap:'wrap'}}>
              {GFR_DATA.slice(0,8).map(e=>(
                <button key={e.iso3} onClick={()=>setSelected(e.iso3)}
                  style={{padding:'6px 12px',borderRadius:'8px',border:'none',cursor:'pointer',
                    fontSize:'12px',fontWeight:600,transition:'all 0.15s',
                    background:selected===e.iso3?TIER_C[e.tier]:'rgba(10,61,98,0.07)',
                    color:selected===e.iso3?'white':'#0A3D62'}}>
                  {e.flag} {e.name}
                </button>
              ))}
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px'}}>
              {/* Radar */}
              <div className="gfm-card" style={{padding:'22px'}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'14px'}}>
                  <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',display:'flex',alignItems:'center',gap:'6px'}}>
                    <span style={{fontSize:'22px'}}>{profile.flag}</span>{profile.name}
                  </div>
                  <div style={{textAlign:'right'}}>
                    <div style={{fontSize:'22px',fontWeight:900,color:TIER_C[profile.tier],fontFamily:'monospace'}}>{profile.score.toFixed(1)}</div>
                    <TierBadge tier={profile.tier}/>
                  </div>
                </div>
                <RadarChart axes={DIMS.map(d=>({label:d,value:(profile as any)[d],max:100}))} size={260} animated/>
              </div>
              {/* Dimension breakdown */}
              <div className="gfm-card" style={{padding:'22px'}}>
                <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'14px',display:'flex',alignItems:'center',gap:'6px'}}>
                  <TrendingUp size={14} color="#74BB65"/> 6 Dimension Scores
                </div>
                {DIMS.map(d=>{
                  const val = (profile as any)[d];
                  const info = DIM_FULL[d];
                  return (
                    <div key={d} style={{marginBottom:'14px'}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
                        <div>
                          <span style={{fontSize:'11px',fontWeight:800,color:info.color,marginRight:'6px'}}>{d}</span>
                          <span style={{fontSize:'11px',color:'#696969'}}>{info.name}</span>
                        </div>
                        <span style={{fontSize:'13px',fontWeight:800,color:info.color,fontFamily:'monospace'}}>{val.toFixed(1)}</span>
                      </div>
                      <div style={{height:'8px',borderRadius:'4px',background:'rgba(10,61,98,0.06)'}}>
                        <div style={{height:'100%',borderRadius:'4px',width:`${val}%`,background:info.color,transition:'width 0.4s ease'}}/>
                      </div>
                      <div style={{fontSize:'10px',color:'#696969',marginTop:'2px'}}>{info.desc}</div>
                    </div>
                  );
                })}
                <div style={{display:'flex',gap:'8px',marginTop:'14px',paddingTop:'14px',borderTop:'1px solid rgba(10,61,98,0.06)'}}>
                  <Link href="/investment-analysis" style={{display:'flex',alignItems:'center',gap:'5px',
                    padding:'8px 16px',background:'#74BB65',color:'white',borderRadius:'8px',
                    textDecoration:'none',fontSize:'12px',fontWeight:700}}>
                    Investment Analysis <ArrowRight size={12}/>
                  </Link>
                  <Link href={`/country/${profile.iso3}`} style={{display:'flex',alignItems:'center',gap:'5px',
                    padding:'8px 14px',border:'1px solid rgba(10,61,98,0.15)',color:'#0A3D62',borderRadius:'8px',
                    textDecoration:'none',fontSize:'12px',fontWeight:600}}>
                    Country Profile <ArrowRight size={12}/>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COMPARE TAB */}
        {tab==='compare' && (
          <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
            <div className="gfm-card" style={{padding:'18px'}}>
              <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'12px'}}>Select up to 5 economies</div>
              <div style={{display:'flex',gap:'6px',flexWrap:'wrap'}}>
                {GFR_DATA.map(e=>(
                  <button key={e.iso3}
                    onClick={()=>setCompare(s=>s.includes(e.iso3)?s.filter(x=>x!==e.iso3):s.length<5?[...s,e.iso3]:s)}
                    style={{padding:'5px 11px',borderRadius:'7px',border:'none',cursor:'pointer',fontSize:'12px',fontWeight:600,transition:'all 0.15s',
                      background:compare.includes(e.iso3)?TIER_C[e.tier]:'rgba(10,61,98,0.07)',
                      color:compare.includes(e.iso3)?'white':'#0A3D62'}}>
                    {e.flag} {e.name}
                  </button>
                ))}
              </div>
            </div>
            <PreviewGate feature="full_profile">
              <div className="gfm-card" style={{padding:'22px'}}>
                <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'16px'}}>GFR Score Comparison</div>
                {GFR_DATA.filter(e=>compare.includes(e.iso3)).sort((a,b)=>b.score-a.score).map(e=>(
                  <div key={e.iso3} style={{marginBottom:'12px'}}>
                    <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'4px'}}>
                      <span style={{fontSize:'18px'}}>{e.flag}</span>
                      <span style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',minWidth:'120px'}}>{e.name}</span>
                      <div style={{flex:1,height:'12px',borderRadius:'6px',background:'rgba(10,61,98,0.06)'}}>
                        <div style={{height:'100%',borderRadius:'6px',width:`${e.score}%`,background:TIER_C[e.tier]}}/>
                      </div>
                      <span style={{fontSize:'14px',fontWeight:900,color:TIER_C[e.tier],fontFamily:'monospace',minWidth:'40px'}}>{e.score.toFixed(1)}</span>
                      <TierBadge tier={e.tier}/>
                    </div>
                  </div>
                ))}
              </div>
              <div className="gfm-card" style={{padding:'22px',overflow:'hidden'}}>
                <div style={{fontSize:'13px',fontWeight:700,color:'#0A3D62',marginBottom:'12px'}}>Dimension Comparison</div>
                <div style={{overflowX:'auto'}}>
                  <table style={{width:'100%',borderCollapse:'collapse'}}>
                    <thead>
                      <tr style={{background:'rgba(10,61,98,0.03)'}}>
                        <th style={{padding:'9px 12px',fontSize:'11px',fontWeight:700,color:'#696969',textAlign:'left'}}>Dimension</th>
                        {GFR_DATA.filter(e=>compare.includes(e.iso3)).map(e=>(
                          <th key={e.iso3} style={{padding:'9px 12px',fontSize:'11px',fontWeight:700,color:'#0A3D62',textAlign:'center',whiteSpace:'nowrap'}}>
                            {e.flag} {e.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {DIMS.map(d=>{
                        const sel = GFR_DATA.filter(e=>compare.includes(e.iso3));
                        const maxV = Math.max(...sel.map(e=>(e as any)[d]));
                        return (
                          <tr key={d} style={{borderBottom:'1px solid rgba(10,61,98,0.05)'}}>
                            <td style={{padding:'9px 12px',fontSize:'12px',fontWeight:700,color:DIM_FULL[d].color}}>{d}: {DIM_FULL[d].name}</td>
                            {sel.map(e=>{
                              const v=(e as any)[d]; const isMax=v===maxV;
                              return (
                                <td key={e.iso3} style={{padding:'9px 12px',textAlign:'center'}}>
                                  <span style={{fontSize:'12px',fontWeight:isMax?900:600,fontFamily:'monospace',
                                    color:isMax?DIM_FULL[d].color:'#696969',
                                    background:isMax?`${DIM_FULL[d].color}10`:'transparent',
                                    padding:isMax?'2px 6px':'0',borderRadius:'5px'}}>{v.toFixed(1)}</span>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </PreviewGate>
          </div>
        )}

        {/* METHODOLOGY TAB */}
        {tab==='methodology' && (
          <div style={{display:'flex',flexDirection:'column',gap:'16px'}}>
            <div className="gfm-card" style={{padding:'24px'}}>
              <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'14px',display:'flex',alignItems:'center',gap:'6px'}}>
                <Shield size={14} color="#74BB65"/> GFR Methodology — 6 Dimensions
              </div>
              <p style={{fontSize:'13px',color:'#696969',lineHeight:'1.75',marginBottom:'16px'}}>
                The Global Future Readiness (GFR) Assessment evaluates 215 economies across 6 dimensions using 38 indicators. Scores are normalized using a Distance-to-Frontier approach and aggregated using dimension-specific weights.
              </p>
              <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px'}}>
                {DIMS.map(d=>{
                  const info = DIM_FULL[d];
                  return (
                    <div key={d} style={{padding:'16px',borderRadius:'10px',background:`${info.color}06`,
                      border:`1px solid ${info.color}20`,borderLeft:`4px solid ${info.color}`}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'6px'}}>
                        <span style={{fontSize:'13px',fontWeight:800,color:info.color}}>{d}</span>
                        <span style={{fontSize:'11px',fontWeight:700,color:info.color,
                          background:`${info.color}12`,padding:'2px 8px',borderRadius:'8px'}}>{info.weight}%</span>
                      </div>
                      <div style={{fontSize:'12px',fontWeight:700,color:'#0A3D62',marginBottom:'4px'}}>{info.name}</div>
                      <div style={{fontSize:'11px',color:'#696969',lineHeight:'1.4'}}>{info.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="gfm-card" style={{padding:'24px',borderLeft:'4px solid #74BB65'}}>
              <div style={{fontSize:'14px',fontWeight:700,color:'#0A3D62',marginBottom:'12px'}}>Related: Investment Analysis</div>
              <p style={{fontSize:'13px',color:'#696969',lineHeight:'1.7',marginBottom:'14px'}}>
                For a deeper investment evaluation, the Investment Analysis module combines GFR dimension data with Doing Business indicators, sector intelligence, and investment zone data using the Global Opportunity Score Analysis formula.
              </p>
              <Link href="/investment-analysis" style={{display:'inline-flex',alignItems:'center',gap:'6px',
                padding:'10px 20px',background:'#0A3D62',color:'white',borderRadius:'8px',
                textDecoration:'none',fontSize:'13px',fontWeight:700}}>
                Open Investment Analysis <ArrowRight size={13}/>
              </Link>
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}
