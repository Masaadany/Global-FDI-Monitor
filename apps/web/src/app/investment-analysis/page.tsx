'use client';
import { useState, useMemo } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Download, BarChart3, Globe, Target, Zap, ChevronRight } from 'lucide-react';
import ImpactModelAgent from './ImpactModelAgent';
import ScrollableSelect from '@/components/ScrollableSelect';

const COUNTRIES = [
  {id:'SGP',name:'Singapore',    flag:'🇸🇬',gosa:88.4,l1:92.1,l2:85.3,l3:87.2,l4:89.0,trend:+0.2,tier:'TOP', region:'Asia Pacific',   gdp:'$466B',gdpg:'3.2%',fdi:'$91B', pop:'5.9M', sectors:['Semiconductors','Biomedical','Fintech']},
  {id:'KOR',name:'South Korea',  flag:'🇰🇷',gosa:84.1,l1:86.0,l2:82.8,l3:83.5,l4:84.2,trend:+0.1,tier:'TOP', region:'Asia Pacific',   gdp:'$1.7T', gdpg:'2.4%',fdi:'$17B', pop:'51M',  sectors:['Semiconductors','EVs','Steel']},
  {id:'USA',name:'United States',flag:'🇺🇸',gosa:83.9,l1:85.3,l2:82.1,l3:83.0,l4:85.1,trend:-0.2,tier:'TOP', region:'Americas',        gdp:'$29T',  gdpg:'2.5%',fdi:'$349B',pop:'335M', sectors:['AI','Semiconductors','Defence']},
  {id:'GBR',name:'United Kingdom',flag:'🇬🇧',gosa:82.5,l1:84.1,l2:81.4,l3:82.2,l4:82.3,trend:-0.1,tier:'TOP', region:'Europe',          gdp:'$3.1T', gdpg:'0.9%',fdi:'$50B', pop:'68M',  sectors:['FinTech','Life Sciences','Creative']},
  {id:'ARE',name:'UAE',          flag:'🇦🇪',gosa:82.1,l1:83.4,l2:81.2,l3:82.8,l4:81.0,trend:+1.2,tier:'TOP', region:'Middle East',     gdp:'$508B', gdpg:'4.4%',fdi:'$23B', pop:'9.9M', sectors:['AI & Data','Finance','Renewables']},
  {id:'DNK',name:'Denmark',      flag:'🇩🇰',gosa:85.3,l1:87.2,l2:83.5,l3:84.9,l4:85.6,trend:+0.3,tier:'TOP', region:'Europe',          gdp:'$406B', gdpg:'1.8%',fdi:'$22B', pop:'5.9M', sectors:['Green Energy','Pharma','Shipping']},
  {id:'MYS',name:'Malaysia',     flag:'🇲🇾',gosa:81.2,l1:82.5,l2:80.7,l3:81.8,l4:79.8,trend:+0.4,tier:'HIGH',region:'Asia Pacific',   gdp:'$400B', gdpg:'4.1%',fdi:'$22B', pop:'33M',  sectors:['Electronics','Data Centers','EV Battery']},
  {id:'THA',name:'Thailand',     flag:'🇹🇭',gosa:80.7,l1:81.8,l2:80.2,l3:81.0,l4:79.8,trend:+0.2,tier:'HIGH',region:'Asia Pacific',   gdp:'$544B', gdpg:'2.8%',fdi:'$14B', pop:'72M',  sectors:['EV Assembly','Electronics','Tourism']},
  {id:'VNM',name:'Vietnam',      flag:'🇻🇳',gosa:79.4,l1:80.5,l2:79.1,l3:78.9,l4:79.1,trend:+0.5,tier:'HIGH',region:'Asia Pacific',   gdp:'$449B', gdpg:'6.1%',fdi:'$24B', pop:'98M',  sectors:['Electronics','EV Battery','Textiles']},
  {id:'SAU',name:'Saudi Arabia', flag:'🇸🇦',gosa:79.1,l1:77.3,l2:80.4,l3:82.1,l4:76.6,trend:+2.1,tier:'HIGH',region:'Middle East',     gdp:'$1.07T',gdpg:'2.6%',fdi:'$36B', pop:'35M',  sectors:['Renewables','Tourism','Mining']},
  {id:'IDN',name:'Indonesia',    flag:'🇮🇩',gosa:77.8,l1:78.9,l2:77.3,l3:77.5,l4:77.5,trend:+0.1,tier:'HIGH',region:'Asia Pacific',   gdp:'$1.37T',gdpg:'5.0%',fdi:'$22B', pop:'278M', sectors:['Nickel/EV','Palm Oil','Digital']},
  {id:'IND',name:'India',        flag:'🇮🇳',gosa:73.2,l1:69.8,l2:74.6,l3:74.8,l4:73.6,trend:+0.8,tier:'HIGH',region:'Asia Pacific',   gdp:'$3.75T',gdpg:'6.5%',fdi:'$71B', pop:'1.44B',sectors:['Semiconductors','IT','Pharma']},
  {id:'BRA',name:'Brazil',       flag:'🇧🇷',gosa:71.3,l1:68.4,l2:72.8,l3:71.2,l4:72.8,trend:+0.4,tier:'HIGH',region:'Americas',        gdp:'$2.18T',gdpg:'2.9%',fdi:'$74B', pop:'215M', sectors:['AgriTech','Data Centers','Renewables']},
  {id:'MAR',name:'Morocco',      flag:'🇲🇦',gosa:66.8,l1:63.8,l2:68.2,l3:68.4,l4:66.8,trend:+0.6,tier:'HIGH',region:'Africa',          gdp:'$143B', gdpg:'3.2%',fdi:'$4B',  pop:'38M',  sectors:['Automotive','Renewables','Offshoring']},
  {id:'NZL',name:'New Zealand',  flag:'🇳🇿',gosa:86.7,l1:89.5,l2:84.1,l3:85.8,l4:87.3,trend:-0.1,tier:'TOP', region:'Oceania',         gdp:'$248B', gdpg:'2.1%',fdi:'$9B',  pop:'5.1M', sectors:['AgriTech','Tourism','IT Services']},
];

function sc(v:number){return v>=80?'#00ffc8':v>=60?'#00d4ff':v>=40?'#ffd700':'#ff4466';}
function tierStyle(t:string){return t==='TOP'?{bg:'rgba(0,255,200,0.08)',c:'#00ffc8',b:'rgba(0,255,200,0.2)'}:{bg:'rgba(0,180,216,0.08)',c:'#00b4d8',b:'rgba(0,180,216,0.2)'};}

export default function InvestmentAnalysis() {
  const [tab,setTab]=useState('overview');
  const [sort,setSort]=useState('gosa');
  const [sortDir,setSortDir]=useState<'desc'|'asc'>('desc');
  const [filterRegion,setFilterRegion]=useState('ALL');
  const [search,setSearch]=useState('');
  const [selected,setSelected]=useState(['SGP','MYS','THA','VNM']);
  const [benchMetric,setBenchMetric]=useState('gosa');

  const filtered=useMemo(()=>{
    let d=[...COUNTRIES];
    if(filterRegion!=='ALL') d=d.filter(c=>c.region===filterRegion);
    if(search) d=d.filter(c=>c.name.toLowerCase().includes(search.toLowerCase()));
    d.sort((a,b)=>{const av=(a as any)[sort]||0,bv=(b as any)[sort]||0;return sortDir==='desc'?bv-av:av-bv;});
    return d;
  },[sort,sortDir,filterRegion,search]);

  const benchCountries=COUNTRIES.filter(c=>selected.includes(c.id));
  const regions=['ALL','Asia Pacific','Middle East','Americas','Europe','Oceania','Africa'];
  const bColors=['#00ffc8','#00d4ff','#ffd700','#9b59b6'];

  function toggleSelect(id:string){setSelected(s=>s.includes(id)?s.filter(x=>x!==id):[...s.slice(-3),id]);}
  function sortBy(col:string){if(sort===col)setSortDir(d=>d==='desc'?'asc':'desc');else{setSort(col);setSortDir('desc');}}

  return(
    <div style={{minHeight:'100vh',background:'#020c14',fontFamily:"'Inter','Helvetica Neue',sans-serif"}}>
      <NavBar/>

      {/* HERO */}
      <div style={{background:'linear-gradient(135deg,#020c14,#060f1a,#0a1628)',padding:'24px',borderBottom:'1px solid rgba(0,255,200,0.08)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,255,200,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,200,0.025) 1px,transparent 1px)',backgroundSize:'64px 64px',pointerEvents:'none'}}/>
        <div style={{maxWidth:'1540px',margin:'0 auto',position:'relative'}}>
          <div style={{fontSize:'10px',fontWeight:800,color:'rgba(0,255,200,0.5)',letterSpacing:'0.2em',marginBottom:'6px',fontFamily:"'Orbitron','Inter',sans-serif"}}>INVESTMENT ANALYSIS</div>
          <h1 style={{fontSize:'24px',fontWeight:900,color:'#e8f4f8',marginBottom:'4px'}}>Global Investment Analysis Platform</h1>
          <p style={{fontSize:'13px',color:'rgba(232,244,248,0.45)'}}>GOSA scored · 15 economies · 4-Layer Methodology · Doing Business · Sector · Zones · Market Intelligence</p>
        </div>
      </div>

      {/* TABS */}
      <div style={{background:'rgba(6,15,26,0.95)',borderBottom:'1px solid rgba(0,255,200,0.06)',backdropFilter:'blur(20px)'}}>
        <div style={{maxWidth:'1540px',margin:'0 auto',padding:'0 24px',display:'flex'}}>
          {[['overview','Overview'],['analysis','Global Analysis'],['benchmark','Benchmark Tool'],['impact','Impact Modeling']].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)}
              style={{padding:'13px 20px',border:'none',borderBottom:`2px solid ${tab===t?'#00ffc8':'transparent'}`,background:'transparent',fontSize:'12px',fontWeight:tab===t?700:400,color:tab===t?'#00ffc8':'rgba(232,244,248,0.45)',cursor:'pointer',fontFamily:"'Inter',sans-serif",marginBottom:'-1px',transition:'all 200ms'}}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:'1540px',margin:'0 auto',padding:'20px 24px'}}>

        {/* OVERVIEW TAB */}
        {tab==='overview'&&(
          <div>
            {/* Stats */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px',marginBottom:'16px'}}>
              {[[COUNTRIES.length+'','Economies Tracked','Weekly GOSA updates','#00ffc8'],[COUNTRIES.filter(c=>c.tier==='TOP').length+'','TOP Tier (≥80)','Best-in-class','#00ffc8'],[COUNTRIES.filter(c=>c.tier==='HIGH').length+'','HIGH Tier (60-79)','Strong cases','#00d4ff'],[(COUNTRIES.reduce((a,c)=>a+c.gosa,0)/COUNTRIES.length).toFixed(1),'Avg GOSA Score','All 15 economies','#ffd700']].map(([v,l,s,c])=>(
                <div key={String(l)} style={{background:'rgba(10,22,40,0.8)',border:'1px solid rgba(0,180,216,0.1)',borderRadius:'12px',padding:'18px',borderTop:'2px solid '+c}}>
                  <div style={{fontSize:'9px',color:'rgba(232,244,248,0.35)',textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:'6px'}}>{l}</div>
                  <div style={{fontSize:'28px',fontWeight:900,color:String(c),fontFamily:"'JetBrains Mono',monospace",textShadow:'0 0 16px '+c+'40'}}>{v}</div>
                  <div style={{fontSize:'10px',color:'rgba(232,244,248,0.3)',marginTop:'2px'}}>{s}</div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div style={{background:'rgba(10,22,40,0.8)',border:'1px solid rgba(0,180,216,0.1)',borderRadius:'12px',padding:'12px 16px',marginBottom:'12px',display:'flex',gap:'10px',flexWrap:'wrap',alignItems:'center'}}>
              <input placeholder="Search economy..." value={search} onChange={e=>setSearch(e.target.value)}
                style={{padding:'7px 12px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'7px',fontSize:'12px',outline:'none',fontFamily:"'Inter',sans-serif",color:'#e8f4f8',minWidth:'160px'}}/>
              <ScrollableSelect
                value={filterRegion} onChange={setFilterRegion} width="150px"
                options={regions.map(r=>({value:r,label:r==='ALL'?'All Regions':r}))}
                accentColor="#00ffc8"
              />
              <span style={{marginLeft:'auto',fontSize:'11px',color:'rgba(232,244,248,0.3)',fontFamily:"'JetBrains Mono',monospace"}}>{filtered.length} economies</span>
            </div>

            {/* Table */}
            <div style={{background:'rgba(10,22,40,0.8)',border:'1px solid rgba(0,180,216,0.1)',borderRadius:'12px',overflow:'hidden'}}>
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}>
                  <thead>
                    <tr style={{background:'rgba(0,0,0,0.3)'}}>
                      {[['#','rank'],['Economy','name'],['GOSA','gosa'],['L1','l1'],['L2','l2'],['L3','l3'],['L4','l4'],['Trend','trend'],['FDI','fdi'],['Actions','']].map(([label,col])=>(
                        <th key={label} onClick={()=>col?sortBy(col):null}
                          style={{padding:'10px 12px',textAlign:label==='Economy'?'left':'center',fontWeight:700,color:sort===col?'#00ffc8':'rgba(232,244,248,0.3)',textTransform:'uppercase',fontSize:'9px',letterSpacing:'0.08em',borderBottom:'1px solid rgba(0,255,200,0.06)',whiteSpace:'nowrap',cursor:col?'pointer':'default',fontFamily:"'JetBrains Mono',monospace",transition:'color 150ms'}}>
                          {label}{sort===col?(sortDir==='desc'?' ↓':' ↑'):''}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c,ri)=>{
                      const ts=tierStyle(c.tier);
                      return(
                        <tr key={c.id} style={{borderBottom:'1px solid rgba(255,255,255,0.025)',transition:'background 150ms ease'}}
                          onMouseEnter={e=>{e.currentTarget.style.background='rgba(0,255,200,0.025)';}}
                          onMouseLeave={e=>{e.currentTarget.style.background='transparent';}}>
                          <td style={{padding:'11px 12px',textAlign:'center',fontSize:'12px',fontWeight:700,color:'rgba(232,244,248,0.4)',fontFamily:"'JetBrains Mono',monospace"}}>{ri+1}</td>
                          <td style={{padding:'11px 12px'}}>
                            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                              <span style={{fontSize:'20px'}}>{c.flag}</span>
                              <div>
                                <Link href={'/country/'+c.id} style={{fontWeight:700,color:'#e8f4f8',textDecoration:'none',fontSize:'13px',display:'block'}}>{c.name}</Link>
                                <div style={{fontSize:'9px',color:'rgba(232,244,248,0.35)'}}>{c.region}</div>
                              </div>
                              <span style={{fontSize:'8px',fontWeight:800,padding:'2px 7px',borderRadius:'8px',background:ts.bg,color:ts.c,border:'1px solid '+ts.b,letterSpacing:'0.04em'}}>{c.tier}</span>
                            </div>
                          </td>
                          {[c.gosa,c.l1,c.l2,c.l3,c.l4].map((v,vi)=>(
                            <td key={vi} style={{padding:'11px 8px',textAlign:'center'}}>
                              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'2px'}}>
                                <span style={{fontSize:vi===0?'15px':'12px',fontWeight:vi===0?900:600,color:sc(v),fontFamily:"'JetBrains Mono',monospace",textShadow:vi===0?'0 0 10px '+sc(v)+'60':'none'}}>{v}</span>
                                <div style={{width:'36px',height:'3px',background:'rgba(255,255,255,0.05)',borderRadius:'2px'}}>
                                  <div style={{height:'100%',width:v+'%',background:sc(v),borderRadius:'2px'}}/>
                                </div>
                              </div>
                            </td>
                          ))}
                          <td style={{padding:'11px 8px',textAlign:'center'}}>
                            <span style={{fontSize:'11px',fontWeight:700,color:c.trend>0?'#00ffc8':c.trend<0?'#ff4466':'rgba(232,244,248,0.3)',display:'flex',alignItems:'center',gap:'2px',justifyContent:'center'}}>
                              {c.trend>0?<TrendingUp size={11}/>:c.trend<0?<TrendingDown size={11}/>:null}
                              {c.trend>0?'+':''}{c.trend}
                            </span>
                          </td>
                          <td style={{padding:'11px 8px',textAlign:'center',fontSize:'12px',fontWeight:700,color:'rgba(232,244,248,0.6)',fontFamily:"'JetBrains Mono',monospace"}}>{c.fdi}</td>
                          <td style={{padding:'11px 12px',textAlign:'center'}}>
                            <div style={{display:'flex',gap:'4px',justifyContent:'center'}}>
                              <Link href={'/country/'+c.id} style={{padding:'4px 10px',background:'rgba(0,255,200,0.07)',border:'1px solid rgba(0,255,200,0.18)',borderRadius:'6px',textDecoration:'none',fontSize:'10px',fontWeight:700,color:'#00ffc8'}}>Profile</Link>
                              <Link href="/reports" style={{padding:'4px 10px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.07)',borderRadius:'6px',textDecoration:'none',fontSize:'10px',fontWeight:600,color:'rgba(232,244,248,0.5)'}}>Report</Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* BENCHMARK TAB */}
        {tab==='benchmark'&&(
          <div>
            <div style={{background:'rgba(10,22,40,0.8)',border:'1px solid rgba(0,180,216,0.1)',borderRadius:'12px',padding:'18px',marginBottom:'14px'}}>
              <div style={{fontSize:'11px',fontWeight:700,color:'rgba(232,244,248,0.5)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'14px'}}>Select Economies (max 4)</div>
              <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                {COUNTRIES.map(c=>(
                  <button key={c.id} onClick={()=>toggleSelect(c.id)}
                    style={{padding:'6px 14px',borderRadius:'20px',border:'2px solid '+(selected.includes(c.id)?'#00ffc8':'rgba(255,255,255,0.08)'),background:selected.includes(c.id)?'rgba(0,255,200,0.08)':'rgba(255,255,255,0.02)',cursor:'pointer',fontSize:'12px',fontWeight:selected.includes(c.id)?700:400,color:selected.includes(c.id)?'#00ffc8':'rgba(232,244,248,0.5)',fontFamily:"'Inter',sans-serif",display:'flex',alignItems:'center',gap:'5px',transition:'all 150ms'}}>
                    {c.flag} {c.name}
                  </button>
                ))}
              </div>
            </div>

            {benchCountries.length>=2&&(
              <>
                <div style={{display:'flex',gap:'8px',marginBottom:'12px',background:'rgba(10,22,40,0.8)',padding:'12px 16px',borderRadius:'12px',border:'1px solid rgba(0,180,216,0.1)',flexWrap:'wrap'}}>
                  {[['gosa','GOSA Score'],['l1','L1 Doing Biz'],['l2','L2 Sector'],['l3','L3 Zones'],['l4','L4 Market Intel']].map(([k,l])=>(
                    <button key={k} onClick={()=>setBenchMetric(k)}
                      style={{padding:'6px 14px',borderRadius:'8px',border:'1px solid '+(benchMetric===k?'#00ffc8':'rgba(255,255,255,0.07)'),background:benchMetric===k?'rgba(0,255,200,0.08)':'transparent',cursor:'pointer',fontSize:'12px',fontWeight:benchMetric===k?700:400,color:benchMetric===k?'#00ffc8':'rgba(232,244,248,0.45)',fontFamily:"'Inter',sans-serif",transition:'all 150ms'}}>
                      {l}
                    </button>
                  ))}
                </div>
                <div style={{background:'rgba(10,22,40,0.8)',border:'1px solid rgba(0,180,216,0.1)',borderRadius:'12px',padding:'22px',marginBottom:'14px'}}>
                  <div style={{fontSize:'11px',fontWeight:700,color:'rgba(232,244,248,0.5)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'20px'}}>Head-to-Head Comparison</div>
                  {benchCountries.map((c,i)=>{
                    const v=(c as any)[benchMetric];
                    return(
                      <div key={c.id} style={{marginBottom:'18px'}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'6px'}}>
                          <span style={{fontSize:'14px',fontWeight:700,color:'rgba(232,244,248,0.85)',display:'flex',alignItems:'center',gap:'8px'}}>{c.flag} {c.name}</span>
                          <span style={{fontSize:'22px',fontWeight:900,color:bColors[i],fontFamily:"'JetBrains Mono',monospace",textShadow:'0 0 12px '+bColors[i]+'60'}}>{v}</span>
                        </div>
                        <div style={{height:'10px',background:'rgba(255,255,255,0.05)',borderRadius:'5px',overflow:'hidden'}}>
                          <div style={{height:'100%',width:v+'%',background:'linear-gradient(90deg,'+bColors[i]+'60,'+bColors[i]+')',borderRadius:'5px',transition:'width 0.8s ease'}}/>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            {benchCountries.length<2&&(
              <div style={{background:'rgba(10,22,40,0.7)',borderRadius:'14px',padding:'48px',textAlign:'center',border:'1px solid rgba(0,180,216,0.08)'}}>
                <div style={{fontSize:'40px',marginBottom:'14px'}}>📊</div>
                <div style={{fontSize:'16px',fontWeight:700,color:'rgba(232,244,248,0.7)',marginBottom:'6px'}}>Select at least 2 economies</div>
                <div style={{fontSize:'13px',color:'rgba(232,244,248,0.35)'}}>Choose up to 4 economies to compare across all GOSA layers</div>
              </div>
            )}
          </div>
        )}

        {/* IMPACT TAB — AI Powered */}
        {tab==='impact'&&(
          <ImpactModelAgent/>
        )}

        {tab==='analysis'&&(
          <div style={{background:'rgba(10,22,40,0.8)',border:'1px solid rgba(0,180,216,0.1)',borderRadius:'12px',padding:'20px'}}>
            <div style={{fontSize:'11px',fontWeight:700,color:'rgba(232,244,248,0.5)',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'16px'}}>FDI Inflow & Economic Overview — All 15 Economies</div>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}>
                <thead>
                  <tr style={{background:'rgba(0,0,0,0.3)'}}>
                    {['Economy','Region','GOSA','GDP','Growth','FDI Inflow','Population','Key Sectors','Profile'].map(h=>(
                      <th key={h} style={{padding:'9px 12px',textAlign:h==='Economy'||h==='Key Sectors'?'left':'center',fontWeight:700,color:'rgba(232,244,248,0.3)',fontSize:'9px',textTransform:'uppercase',letterSpacing:'0.08em',borderBottom:'1px solid rgba(0,255,200,0.06)',whiteSpace:'nowrap',fontFamily:"'JetBrains Mono',monospace"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COUNTRIES.map((c,i)=>(
                    <tr key={c.id} style={{borderBottom:'1px solid rgba(255,255,255,0.025)',transition:'background 150ms'}}
                      onMouseEnter={e=>{e.currentTarget.style.background='rgba(0,255,200,0.02)';}}
                      onMouseLeave={e=>{e.currentTarget.style.background='transparent';}}>
                      <td style={{padding:'10px 12px'}}>
                        <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                          <span style={{fontSize:'18px'}}>{c.flag}</span>
                          <span style={{fontWeight:700,color:'rgba(232,244,248,0.85)',fontSize:'13px'}}>{c.name}</span>
                        </div>
                      </td>
                      <td style={{padding:'10px 8px',textAlign:'center',fontSize:'11px',color:'rgba(232,244,248,0.4)'}}>{c.region}</td>
                      <td style={{padding:'10px 8px',textAlign:'center',fontWeight:900,color:sc(c.gosa),fontFamily:"'JetBrains Mono',monospace",fontSize:'14px'}}>{c.gosa}</td>
                      <td style={{padding:'10px 8px',textAlign:'center',fontSize:'12px',color:'rgba(232,244,248,0.7)',fontFamily:"'JetBrains Mono',monospace"}}>{c.gdp}</td>
                      <td style={{padding:'10px 8px',textAlign:'center',fontSize:'12px',color:'#00ffc8',fontWeight:700}}>{c.gdpg}</td>
                      <td style={{padding:'10px 8px',textAlign:'center',fontSize:'12px',color:'#ffd700',fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{c.fdi}</td>
                      <td style={{padding:'10px 8px',textAlign:'center',fontSize:'11px',color:'rgba(232,244,248,0.4)'}}>{c.pop}</td>
                      <td style={{padding:'10px 12px'}}>
                        <div style={{display:'flex',gap:'4px',flexWrap:'wrap'}}>
                          {c.sectors.slice(0,2).map(s=><span key={s} style={{padding:'2px 7px',background:'rgba(0,180,216,0.06)',border:'1px solid rgba(0,180,216,0.15)',borderRadius:'10px',fontSize:'9px',color:'rgba(0,180,216,0.8)',whiteSpace:'nowrap',fontWeight:600}}>{s}</span>)}
                        </div>
                      </td>
                      <td style={{padding:'10px 8px',textAlign:'center'}}>
                        <Link href={'/country/'+c.id} style={{padding:'4px 12px',background:'rgba(0,255,200,0.06)',border:'1px solid rgba(0,255,200,0.18)',borderRadius:'7px',textDecoration:'none',fontSize:'10px',fontWeight:700,color:'#00ffc8'}}>View →</Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}
