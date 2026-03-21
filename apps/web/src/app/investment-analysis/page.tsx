'use client';
import { useState, useMemo } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Download, Filter, BarChart3, Globe, Target, Zap } from 'lucide-react';

const COUNTRIES = [
  {id:'SGP',name:'Singapore',    flag:'🇸🇬',gosa:88.4,l1:92.1,l2:85.3,l3:87.2,l4:89.0,trend:0.2, tier:'TOP',  region:'Asia Pacific',   gdp:'$466B',gdpg:'3.2%',fdi:'$91B',pop:'5.9M',  sectors:['Semiconductors','Biomedical','Fintech'],      zones:['Jurong Island','One-North','Changi BP']},
  {id:'NZL',name:'New Zealand',  flag:'🇳🇿',gosa:86.7,l1:89.5,l2:84.1,l3:85.8,l4:87.3,trend:-0.1,tier:'TOP',  region:'Oceania',         gdp:'$248B',gdpg:'2.1%',fdi:'$9B', pop:'5.1M',  sectors:['AgriTech','Tourism','IT Services'],           zones:['Auckland Tech Park','Christchurch ICT']},
  {id:'DNK',name:'Denmark',      flag:'🇩🇰',gosa:85.3,l1:87.2,l2:83.5,l3:84.9,l4:85.6,trend:0.3, tier:'TOP',  region:'Europe',          gdp:'$406B',gdpg:'1.8%',fdi:'$22B',pop:'5.9M',  sectors:['Green Energy','Pharma','Shipping'],           zones:['Copenhagen Tech Zone','Aarhus Offshore']},
  {id:'KOR',name:'South Korea',  flag:'🇰🇷',gosa:84.1,l1:86.0,l2:82.8,l3:83.5,l4:84.2,trend:0.1, tier:'TOP',  region:'Asia Pacific',   gdp:'$1.7T', gdpg:'2.4%',fdi:'$17B',pop:'51M',   sectors:['Semiconductors','EVs','Steel'],               zones:['Busan FTZ','Incheon Global Campus','Gwangyang']},
  {id:'USA',name:'United States',flag:'🇺🇸',gosa:83.9,l1:85.3,l2:82.1,l3:83.0,l4:85.1,trend:-0.2,tier:'TOP',  region:'Americas',        gdp:'$29T',  gdpg:'2.5%',fdi:'$349B',pop:'335M', sectors:['AI','Semiconductors','Defence'],              zones:['Silicon Valley','Texas Corridor','DC Metro']},
  {id:'GBR',name:'United Kingdom',flag:'🇬🇧',gosa:82.5,l1:84.1,l2:81.4,l3:82.2,l4:82.3,trend:-0.1,tier:'TOP',  region:'Europe',          gdp:'$3.1T', gdpg:'0.9%',fdi:'$50B',pop:'68M',   sectors:['FinTech','Life Sciences','Creative'],         zones:['London Tech City','Manchester City-Region']},
  {id:'ARE',name:'UAE',          flag:'🇦🇪',gosa:82.1,l1:83.4,l2:81.2,l3:82.8,l4:81.0,trend:1.2, tier:'TOP',  region:'Middle East',     gdp:'$508B', gdpg:'4.4%',fdi:'$23B',pop:'9.9M',  sectors:['AI & Data','Finance','Renewables'],           zones:['JAFZA','DIFC','ADGM','Dubai Internet City']},
  {id:'MYS',name:'Malaysia',     flag:'🇲🇾',gosa:81.2,l1:82.5,l2:80.7,l3:81.8,l4:79.8,trend:0.4, tier:'HIGH', region:'Asia Pacific',   gdp:'$400B', gdpg:'4.1%',fdi:'$22B',pop:'33M',   sectors:['Electronics','Data Centers','EV Battery'],   zones:['Penang FIZ','Port Klang FTZ','Johor BP']},
  {id:'THA',name:'Thailand',     flag:'🇹🇭',gosa:80.7,l1:81.8,l2:80.2,l3:81.0,l4:79.8,trend:0.2, tier:'HIGH', region:'Asia Pacific',   gdp:'$544B', gdpg:'2.8%',fdi:'$14B',pop:'72M',   sectors:['EV Assembly','Electronics','Tourism'],        zones:['EEC','Amata City','IEAT Laem Chabang']},
  {id:'VNM',name:'Vietnam',      flag:'🇻🇳',gosa:79.4,l1:80.5,l2:79.1,l3:78.9,l4:79.1,trend:0.5, tier:'HIGH', region:'Asia Pacific',   gdp:'$449B', gdpg:'6.1%',fdi:'$24B',pop:'98M',   sectors:['Electronics','EV Battery','Textiles'],        zones:['Binh Duong IP','VSIP','Hanoi IZ']},
  {id:'SAU',name:'Saudi Arabia', flag:'🇸🇦',gosa:79.1,l1:77.3,l2:80.4,l3:82.1,l4:76.6,trend:2.1, tier:'HIGH', region:'Middle East',     gdp:'$1.07T',gdpg:'2.6%',fdi:'$36B',pop:'35M',   sectors:['Renewables','Tourism','Mining'],              zones:['KAEC','NEOM','Riyadh SEZ']},
  {id:'IDN',name:'Indonesia',    flag:'🇮🇩',gosa:77.8,l1:78.9,l2:77.3,l3:77.5,l4:77.5,trend:0.1, tier:'HIGH', region:'Asia Pacific',   gdp:'$1.37T',gdpg:'5.0%',fdi:'$22B',pop:'278M',  sectors:['Nickel/EV','Palm Oil','Digital'],             zones:['Batam FTZ','Karawang IP','Kendal IP']},
  {id:'IND',name:'India',        flag:'🇮🇳',gosa:73.2,l1:69.8,l2:74.6,l3:74.8,l4:73.6,trend:0.8, tier:'HIGH', region:'Asia Pacific',   gdp:'$3.75T',gdpg:'6.5%',fdi:'$71B',pop:'1.44B', sectors:['Semiconductors','IT','Pharma'],               zones:['Bangalore TP','GIFT City','Chennai SEZ']},
  {id:'BRA',name:'Brazil',       flag:'🇧🇷',gosa:71.3,l1:68.4,l2:72.8,l3:71.2,l4:72.8,trend:0.4, tier:'HIGH', region:'Americas',        gdp:'$2.18T',gdpg:'2.9%',fdi:'$74B',pop:'215M',  sectors:['AgriTech','Data Centers','Renewables'],       zones:['São Paulo TZ','Manaus FTZ']},
  {id:'MAR',name:'Morocco',      flag:'🇲🇦',gosa:66.8,l1:63.8,l2:68.2,l3:68.4,l4:66.8,trend:0.6, tier:'HIGH', region:'Africa',          gdp:'$143B', gdpg:'3.2%',fdi:'$4B', pop:'38M',   sectors:['Automotive','Renewables','Offshoring'],       zones:['Tanger Med','Casablanca Finance City']},
];

const DB_INDICATORS = [
  'Starting a Business','Construction Permits','Getting Electricity','Registering Property',
  'Getting Credit','Protecting Investors','Paying Taxes','Trading Across Borders',
  'Enforcing Contracts','Resolving Insolvency'
];

const DB_SCORES: Record<string, number[]> = {
  SGP:[96.2,89.1,98.8,87.4,85.0,92.6,91.4,99.2,87.3,87.1],
  NZL:[92.1,84.6,96.7,91.2,70.0,84.0,89.3,88.7,81.4,92.3],
  DNK:[91.4,82.7,88.4,78.9,75.0,74.0,87.6,82.1,74.2,88.4],
  KOR:[88.6,79.4,91.2,74.6,85.0,79.0,87.9,78.6,69.4,82.1],
  USA:[91.3,80.2,81.4,73.2,95.0,87.0,86.7,90.1,73.9,82.6],
  GBR:[92.4,87.4,96.1,74.4,80.0,78.0,88.4,89.4,74.9,84.2],
  ARE:[91.4,88.2,99.1,94.2,55.0,74.0,99.4,94.8,72.4,61.2],
  MYS:[82.3,74.8,87.2,78.4,75.0,81.8,78.6,82.4,72.1,82.4],
  THA:[78.8,72.1,81.3,73.2,65.0,74.0,71.2,68.4,67.9,61.8],
  VNM:[79.2,68.4,87.2,62.8,75.0,72.4,68.7,73.1,62.3,61.5],
  SAU:[84.1,72.8,93.7,76.8,65.0,75.0,91.1,78.2,64.2,45.2],
  IDN:[76.4,66.3,79.8,68.4,70.0,65.0,72.4,67.8,58.3,62.7],
  IND:[78.2,71.3,84.7,58.7,80.0,74.0,67.0,62.0,41.2,62.0],
  BRA:[66.4,54.2,69.8,54.6,60.0,69.0,46.8,63.2,62.4,57.1],
  MAR:[71.2,62.4,74.8,58.9,55.0,62.0,69.4,66.8,56.2,58.4],
};

function sc(v: number) { return v>=80?'#2ecc71':v>=60?'#3498db':v>=40?'#f1c40f':'#e74c3c'; }

export default function InvestmentAnalysis() {
  const [tab, setTab] = useState('overview');
  const [sort, setSort] = useState('gosa');
  const [sortDir, setSortDir] = useState<'desc'|'asc'>('desc');
  const [filterRegion, setFilterRegion] = useState('ALL');
  const [filterTier, setFilterTier] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(['SGP','MYS','THA','VNM']);
  const [benchTab, setBenchTab] = useState('gosa');

  const filtered = useMemo(()=>{
    let d=[...COUNTRIES];
    if(filterRegion!=='ALL') d=d.filter(c=>c.region===filterRegion);
    if(filterTier!=='ALL') d=d.filter(c=>c.tier===filterTier);
    if(search) d=d.filter(c=>c.name.toLowerCase().includes(search.toLowerCase()));
    d.sort((a,b)=>{
      const av=(a as any)[sort]??0, bv=(b as any)[sort]??0;
      return sortDir==='desc'?bv-av:av-bv;
    });
    return d;
  },[sort,sortDir,filterRegion,filterTier,search]);

  const benchCountries = COUNTRIES.filter(c=>selected.includes(c.id));
  const regions=['ALL','Asia Pacific','Middle East','Americas','Europe','Oceania','Africa'];

  function toggleSelect(id: string) {
    setSelected(s=>s.includes(id)?s.filter(x=>x!==id):[...s.slice(-3),id]);
  }

  return (
    <div style={{minHeight:'100vh',background:'#f0f4f8',fontFamily:"Inter,'Helvetica Neue',sans-serif"}}>
      <NavBar/>
      <div style={{background:'linear-gradient(135deg,#0f1e2a,#1a2c3e)',padding:'20px 24px',borderBottom:'1px solid rgba(46,204,113,0.1)'}}>
        <div style={{maxWidth:'1440px',margin:'0 auto'}}>
          <div style={{fontSize:'10px',fontWeight:800,color:'#2ecc71',letterSpacing:'0.12em',marginBottom:'4px'}}>INVESTMENT ANALYSIS</div>
          <h1 style={{fontSize:'22px',fontWeight:900,color:'white',marginBottom:'4px'}}>Global Investment Analysis Platform</h1>
          <p style={{fontSize:'13px',color:'rgba(255,255,255,0.6)'}}>GOSA scored · 15 economies · 4-Layer Methodology · Doing Business · Sector · Zones · Market Intelligence</p>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{background:'white',borderBottom:'2px solid rgba(26,44,62,0.08)'}}>
        <div style={{maxWidth:'1440px',margin:'0 auto',padding:'0 24px',display:'flex'}}>
          {[['overview','Overview'],['analysis','Global Investment Analysis'],['benchmark','Benchmark Tool'],['impact','Impact Analysis']].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)}
              style={{padding:'14px 20px',border:'none',borderBottom:`3px solid ${tab===t?'#2ecc71':'transparent'}`,
                background:'transparent',fontSize:'13px',fontWeight:tab===t?700:500,
                color:tab===t?'#1a2c3e':'#7f8c8d',cursor:'pointer',fontFamily:'inherit',marginBottom:'-2px',whiteSpace:'nowrap'}}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:'1440px',margin:'0 auto',padding:'20px 24px'}}>

        {/* ── TAB 1: OVERVIEW ──────────────────────────────────────────────── */}
        {tab==='overview' && (
          <div>
            {/* Summary cards */}
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'12px',marginBottom:'16px'}}>
              {[
                {l:'Economies Tracked',v:'15',sub:'Weekly GOSA updates',c:'#2ecc71'},
                {l:'TOP Tier (≥80)',v:COUNTRIES.filter(c=>c.tier==='TOP').length.toString(),sub:'Best-in-class destinations',c:'#2ecc71'},
                {l:'HIGH Tier (60-79)',v:COUNTRIES.filter(c=>c.tier==='HIGH').length.toString(),sub:'Strong investment cases',c:'#3498db'},
                {l:'Avg GOSA Score',v:(COUNTRIES.reduce((a,c)=>a+c.gosa,0)/COUNTRIES.length).toFixed(1),sub:'All 15 economies',c:'#f1c40f'},
              ].map(({l,v,sub,c})=>(
                <div key={l} style={{background:'white',borderRadius:'12px',padding:'18px',border:'1px solid rgba(26,44,62,0.08)',borderTop:`3px solid ${c}`}}>
                  <div style={{fontSize:'10px',color:'#7f8c8d',textTransform:'uppercase',letterSpacing:'0.06em',marginBottom:'6px'}}>{l}</div>
                  <div style={{fontSize:'28px',fontWeight:900,color:'#1a2c3e',fontFamily:"'JetBrains Mono',monospace"}}>{v}</div>
                  <div style={{fontSize:'11px',color:'#7f8c8d',marginTop:'2px'}}>{sub}</div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div style={{background:'white',borderRadius:'12px',padding:'12px 16px',marginBottom:'12px',border:'1px solid rgba(26,44,62,0.08)',display:'flex',gap:'10px',flexWrap:'wrap',alignItems:'center'}}>
              <input placeholder="Search economy..." value={search} onChange={e=>setSearch(e.target.value)}
                style={{padding:'7px 12px',border:'1px solid rgba(26,44,62,0.12)',borderRadius:'8px',fontSize:'12px',outline:'none',fontFamily:'inherit',minWidth:'160px'}}/>
              <select value={filterRegion} onChange={e=>setFilterRegion(e.target.value)}
                style={{padding:'7px 12px',border:'1px solid rgba(26,44,62,0.12)',borderRadius:'8px',fontSize:'12px',background:'white',outline:'none',cursor:'pointer',fontFamily:'inherit'}}>
                {regions.map(r=><option key={r}>{r}</option>)}
              </select>
              <select value={filterTier} onChange={e=>setFilterTier(e.target.value)}
                style={{padding:'7px 12px',border:'1px solid rgba(26,44,62,0.12)',borderRadius:'8px',fontSize:'12px',background:'white',outline:'none',cursor:'pointer',fontFamily:'inherit'}}>
                {['ALL','TOP','HIGH'].map(t=><option key={t}>{t}</option>)}
              </select>
              <span style={{marginLeft:'auto',fontSize:'12px',color:'#7f8c8d'}}>{filtered.length} economies</span>
            </div>

            {/* Table */}
            <div style={{background:'white',borderRadius:'14px',border:'1px solid rgba(26,44,62,0.08)',overflow:'hidden'}}>
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}>
                  <thead>
                    <tr style={{background:'rgba(26,44,62,0.03)'}}>
                      {[['#','rank'],['Economy','name'],['GOSA','gosa'],['L1 Doing Business','l1'],['L2 Sector','l2'],['L3 Zones','l3'],['L4 Market Intel','l4'],['Trend','trend'],['Actions','']].map(([label,col])=>(
                        <th key={label} onClick={()=>col?setSortDir(d=>sort===col?(d==='desc'?'asc':'desc'):d)||setSort(col):null}
                          style={{padding:'10px 12px',textAlign:label==='Economy'?'left':'center',fontWeight:700,color:'#7f8c8d',textTransform:'uppercase',fontSize:'10px',letterSpacing:'0.06em',borderBottom:'1px solid rgba(26,44,62,0.08)',whiteSpace:'nowrap',cursor:col?'pointer':'default'}}>
                          {label}{sort===col?(sortDir==='desc'?' ↓':' ↑'):''}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c,ri)=>{
                      const tb=c.tier==='TOP'?{bg:'rgba(46,204,113,0.1)',col:'#1e8449'}:{bg:'rgba(52,152,219,0.1)',col:'#1a6ea8'};
                      return (
                        <tr key={c.id} style={{borderBottom:'1px solid rgba(26,44,62,0.05)',background:ri%2===0?'white':'rgba(26,44,62,0.01)'}}>
                          <td style={{padding:'11px 12px',textAlign:'center',fontWeight:700,color:'#7f8c8d',fontFamily:"'JetBrains Mono',monospace"}}>{ri+1}</td>
                          <td style={{padding:'11px 12px'}}>
                            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                              <span style={{fontSize:'18px'}}>{c.flag}</span>
                              <div>
                                <Link href={`/country/${c.id}`} style={{fontWeight:700,color:'#1a2c3e',textDecoration:'none',display:'block'}}>{c.name}</Link>
                                <div style={{fontSize:'10px',color:'#7f8c8d'}}>{c.region} · {c.gdp}</div>
                              </div>
                              <span style={{fontSize:'9px',fontWeight:800,padding:'2px 6px',borderRadius:'8px',background:tb.bg,color:tb.col}}>{c.tier}</span>
                            </div>
                          </td>
                          {[c.gosa,c.l1,c.l2,c.l3,c.l4].map((v,vi)=>(
                            <td key={vi} style={{padding:'11px 8px',textAlign:'center'}}>
                              <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'2px'}}>
                                <span style={{fontSize:vi===0?'15px':'13px',fontWeight:vi===0?900:700,color:sc(v),fontFamily:"'JetBrains Mono',monospace"}}>{v}</span>
                                <div style={{width:'40px',height:'3px',background:'rgba(26,44,62,0.07)',borderRadius:'2px'}}>
                                  <div style={{height:'100%',width:`${v}%`,background:sc(v),borderRadius:'2px'}}/>
                                </div>
                              </div>
                            </td>
                          ))}
                          <td style={{padding:'11px 8px',textAlign:'center'}}>
                            <span style={{fontSize:'11px',fontWeight:700,color:c.trend>0?'#2ecc71':c.trend<0?'#e74c3c':'#7f8c8d',display:'flex',alignItems:'center',gap:'2px',justifyContent:'center'}}>
                              {c.trend>0?<TrendingUp size={11}/>:<TrendingDown size={11}/>}
                              {c.trend>0?'+':''}{c.trend}
                            </span>
                          </td>
                          <td style={{padding:'11px 12px',textAlign:'center'}}>
                            <div style={{display:'flex',gap:'4px',justifyContent:'center'}}>
                              <Link href={`/country/${c.id}`} style={{padding:'4px 10px',background:'rgba(46,204,113,0.08)',border:'1px solid rgba(46,204,113,0.2)',borderRadius:'6px',textDecoration:'none',fontSize:'10px',fontWeight:600,color:'#2ecc71'}}>Profile</Link>
                              <Link href="/reports" style={{padding:'4px 10px',background:'rgba(26,44,62,0.06)',border:'1px solid rgba(26,44,62,0.1)',borderRadius:'6px',textDecoration:'none',fontSize:'10px',fontWeight:600,color:'#1a2c3e'}}>Report</Link>
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

        {/* ── TAB 2: GLOBAL INVESTMENT ANALYSIS ────────────────────────────── */}
        {tab==='analysis' && (
          <div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'16px'}}>
              {/* Regional heat map */}
              <div style={{background:'white',borderRadius:'14px',border:'1px solid rgba(26,44,62,0.08)',padding:'20px'}}>
                <div style={{fontSize:'13px',fontWeight:700,color:'#1a2c3e',marginBottom:'16px',display:'flex',alignItems:'center',gap:'7px'}}><Globe size={14} color="#2ecc71"/> Regional GOSA Performance</div>
                {['Asia Pacific','Middle East','Americas','Europe','Oceania','Africa'].map(region=>{
                  const rcs=COUNTRIES.filter(c=>c.region===region);
                  const avg=rcs.reduce((a,c)=>a+c.gosa,0)/rcs.length;
                  return (
                    <div key={region} style={{marginBottom:'12px'}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'4px'}}>
                        <span style={{fontSize:'12px',fontWeight:600,color:'#1a2c3e'}}>{region}</span>
                        <span style={{fontSize:'12px',fontWeight:800,color:sc(avg),fontFamily:"'JetBrains Mono',monospace"}}>{avg.toFixed(1)}</span>
                      </div>
                      <div style={{height:'8px',background:'rgba(26,44,62,0.07)',borderRadius:'4px',display:'flex',gap:'2px'}}>
                        {rcs.map(c=>(
                          <div key={c.id} title={`${c.name}: ${c.gosa}`} style={{flex:1,height:'100%',background:sc(c.gosa),borderRadius:'2px',cursor:'pointer'}} onClick={()=>{setSelected([c.id]);setBenchTab('gosa');setTab('benchmark');}}/>
                        ))}
                      </div>
                      <div style={{fontSize:'10px',color:'#7f8c8d',marginTop:'2px'}}>{rcs.length} economies · avg {avg.toFixed(1)}</div>
                    </div>
                  );
                })}
              </div>

              {/* GOSA 4-layer breakdown */}
              <div style={{background:'white',borderRadius:'14px',border:'1px solid rgba(26,44,62,0.08)',padding:'20px'}}>
                <div style={{fontSize:'13px',fontWeight:700,color:'#1a2c3e',marginBottom:'16px',display:'flex',alignItems:'center',gap:'7px'}}><BarChart3 size={14} color="#3498db"/> Layer Performance — Top 8 Economies</div>
                {COUNTRIES.filter((_,i)=>i<8).map(c=>(
                  <div key={c.id} style={{marginBottom:'10px',padding:'8px 10px',background:'rgba(26,44,62,0.02)',borderRadius:'8px',border:'1px solid rgba(26,44,62,0.05)'}}>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'4px'}}>
                      <span style={{fontSize:'12px',fontWeight:600}}>{c.flag} {c.name}</span>
                      <span style={{fontSize:'13px',fontWeight:900,color:'#2ecc71',fontFamily:"'JetBrains Mono',monospace"}}>{c.gosa}</span>
                    </div>
                    <div style={{display:'flex',gap:'3px',height:'6px'}}>
                      {[{v:c.l1,c:'#2ecc71',w:30},{v:c.l2,c:'#3498db',w:20},{v:c.l3,c:'#9b59b6',w:25},{v:c.l4,c:'#f1c40f',w:25}].map(({v,c:col,w})=>(
                        <div key={col} style={{flex:w,background:'rgba(26,44,62,0.07)',borderRadius:'2px',overflow:'hidden'}}>
                          <div style={{height:'100%',width:`${v}%`,background:col,borderRadius:'2px'}}/>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <div style={{display:'flex',gap:'10px',marginTop:'10px',flexWrap:'wrap'}}>
                  {[['L1','#2ecc71'],['L2','#3498db'],['L3','#9b59b6'],['L4','#f1c40f']].map(([l,c])=>(
                    <div key={l} style={{display:'flex',alignItems:'center',gap:'4px',fontSize:'10px',color:'#7f8c8d'}}>
                      <div style={{width:'10px',height:'4px',background:c,borderRadius:'2px'}}/>
                      {l}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* FDI flows table */}
            <div style={{background:'white',borderRadius:'14px',border:'1px solid rgba(26,44,62,0.08)',padding:'20px',marginBottom:'16px'}}>
              <div style={{fontSize:'13px',fontWeight:700,color:'#1a2c3e',marginBottom:'16px'}}>FDI Inflow & Economic Overview</div>
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}>
                  <thead>
                    <tr style={{background:'rgba(26,44,62,0.03)'}}>
                      {['Economy','Region','GOSA','GDP','GDP Growth','FDI Inflow','Population','Top Sectors','Country Profile'].map(h=>(
                        <th key={h} style={{padding:'9px 12px',textAlign:h==='Economy'||h==='Top Sectors'?'left':'center',fontWeight:700,color:'#7f8c8d',fontSize:'10px',textTransform:'uppercase',letterSpacing:'0.05em',borderBottom:'1px solid rgba(26,44,62,0.08)',whiteSpace:'nowrap'}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COUNTRIES.map((c,i)=>(
                      <tr key={c.id} style={{borderBottom:'1px solid rgba(26,44,62,0.05)',background:i%2===0?'white':'rgba(26,44,62,0.01)'}}>
                        <td style={{padding:'10px 12px'}}>
                          <div style={{display:'flex',alignItems:'center',gap:'7px'}}>
                            <span style={{fontSize:'16px'}}>{c.flag}</span>
                            <span style={{fontWeight:700,color:'#1a2c3e'}}>{c.name}</span>
                          </div>
                        </td>
                        <td style={{padding:'10px 8px',textAlign:'center',fontSize:'11px',color:'#7f8c8d'}}>{c.region}</td>
                        <td style={{padding:'10px 8px',textAlign:'center',fontWeight:800,color:sc(c.gosa),fontFamily:"'JetBrains Mono',monospace"}}>{c.gosa}</td>
                        <td style={{padding:'10px 8px',textAlign:'center',fontSize:'12px',color:'#2c3e50',fontFamily:"'JetBrains Mono',monospace"}}>{c.gdp}</td>
                        <td style={{padding:'10px 8px',textAlign:'center',fontSize:'12px',color:'#2ecc71',fontWeight:700}}>{c.gdpg}</td>
                        <td style={{padding:'10px 8px',textAlign:'center',fontSize:'12px',color:'#3498db',fontWeight:700,fontFamily:"'JetBrains Mono',monospace"}}>{c.fdi}</td>
                        <td style={{padding:'10px 8px',textAlign:'center',fontSize:'11px',color:'#7f8c8d'}}>{c.pop}</td>
                        <td style={{padding:'10px 12px'}}>
                          <div style={{display:'flex',gap:'4px',flexWrap:'wrap'}}>
                            {c.sectors.slice(0,2).map(s=>(
                              <span key={s} style={{padding:'2px 7px',background:'rgba(26,44,62,0.06)',borderRadius:'10px',fontSize:'10px',color:'#2c3e50',whiteSpace:'nowrap'}}>{s}</span>
                            ))}
                          </div>
                        </td>
                        <td style={{padding:'10px 8px',textAlign:'center'}}>
                          <Link href={`/country/${c.id}`} style={{padding:'4px 12px',background:'rgba(46,204,113,0.08)',border:'1px solid rgba(46,204,113,0.2)',borderRadius:'7px',textDecoration:'none',fontSize:'10px',fontWeight:600,color:'#2ecc71'}}>View →</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: BENCHMARK ─────────────────────────────────────────────── */}
        {tab==='benchmark' && (
          <div>
            <div style={{background:'white',borderRadius:'14px',border:'1px solid rgba(26,44,62,0.08)',padding:'18px',marginBottom:'14px'}}>
              <div style={{fontSize:'13px',fontWeight:700,color:'#1a2c3e',marginBottom:'14px'}}>Select Economies to Benchmark (max 4)</div>
              <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                {COUNTRIES.map(c=>(
                  <button key={c.id} onClick={()=>toggleSelect(c.id)}
                    style={{padding:'6px 14px',borderRadius:'20px',border:`2px solid ${selected.includes(c.id)?'#2ecc71':'rgba(26,44,62,0.12)'}`,
                      background:selected.includes(c.id)?'rgba(46,204,113,0.08)':'white',cursor:'pointer',fontSize:'12px',fontWeight:selected.includes(c.id)?700:400,
                      color:selected.includes(c.id)?'#1e8449':'#7f8c8d',fontFamily:'inherit',display:'flex',alignItems:'center',gap:'5px'}}>
                    {c.flag} {c.name} <span style={{fontWeight:800,color:'#2ecc71'}}>{c.gosa}</span>
                  </button>
                ))}
              </div>
            </div>

            {benchCountries.length>=2 && (
              <>
                {/* Benchmark metric selector */}
                <div style={{display:'flex',gap:'8px',marginBottom:'14px',background:'white',padding:'12px 16px',borderRadius:'12px',border:'1px solid rgba(26,44,62,0.08)',flexWrap:'wrap'}}>
                  {[['gosa','GOSA Score'],['l1','L1 Doing Business'],['l2','L2 Sector'],['l3','L3 Zones'],['l4','L4 Market Intel']].map(([k,l])=>(
                    <button key={k} onClick={()=>setBenchTab(k)}
                      style={{padding:'6px 14px',borderRadius:'8px',border:`1px solid ${benchTab===k?'#2ecc71':'rgba(26,44,62,0.1)'}`,
                        background:benchTab===k?'rgba(46,204,113,0.08)':'white',cursor:'pointer',fontSize:'12px',fontWeight:benchTab===k?700:400,
                        color:benchTab===k?'#2ecc71':'#7f8c8d',fontFamily:'inherit'}}>
                      {l}
                    </button>
                  ))}
                </div>

                {/* Comparison bars */}
                <div style={{background:'white',borderRadius:'14px',border:'1px solid rgba(26,44,62,0.08)',padding:'22px',marginBottom:'14px'}}>
                  <div style={{fontSize:'13px',fontWeight:700,color:'#1a2c3e',marginBottom:'20px'}}>
                    {benchTab==='gosa'?'GOSA Composite':benchTab==='l1'?'L1 Doing Business':benchTab==='l2'?'L2 Sector Indicators':benchTab==='l3'?'L3 Zone Indicators':'L4 Market Intelligence'} — Head-to-Head
                  </div>
                  {benchCountries.map(c=>{
                    const v=(c as any)[benchTab];
                    const colors=['#2ecc71','#3498db','#9b59b6','#f1c40f'];
                    const idx=benchCountries.indexOf(c);
                    return (
                      <div key={c.id} style={{marginBottom:'18px'}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'6px'}}>
                          <span style={{fontSize:'14px',fontWeight:700,display:'flex',alignItems:'center',gap:'8px'}}>{c.flag} {c.name}</span>
                          <span style={{fontSize:'20px',fontWeight:900,color:colors[idx],fontFamily:"'JetBrains Mono',monospace"}}>{v}</span>
                        </div>
                        <div style={{height:'12px',background:'rgba(26,44,62,0.07)',borderRadius:'6px',overflow:'hidden'}}>
                          <div style={{height:'100%',width:`${v}%`,background:colors[idx],borderRadius:'6px',transition:'width 0.8s ease',display:'flex',alignItems:'center',justifyContent:'flex-end',paddingRight:'6px'}}>
                            {v>=25&&<span style={{fontSize:'9px',fontWeight:800,color:'white'}}>{v}</span>}
                          </div>
                        </div>
                        <div style={{display:'flex',gap:'16px',marginTop:'4px'}}>
                          <span style={{fontSize:'10px',color:'#7f8c8d'}}>L1:{c.l1} L2:{c.l2} L3:{c.l3} L4:{c.l4}</span>
                          <span style={{fontSize:'10px',color:c.trend>0?'#2ecc71':'#e74c3c',fontWeight:600}}>{c.trend>0?'+':''}{c.trend} MoM</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Doing Business comparison */}
                <div style={{background:'white',borderRadius:'14px',border:'1px solid rgba(26,44,62,0.08)',padding:'20px',marginBottom:'14px'}}>
                  <div style={{fontSize:'13px',fontWeight:700,color:'#1a2c3e',marginBottom:'16px'}}>Doing Business — 10 Indicators Comparison</div>
                  <div style={{overflowX:'auto'}}>
                    <table style={{width:'100%',borderCollapse:'collapse',fontSize:'11px'}}>
                      <thead>
                        <tr>
                          <th style={{padding:'8px 10px',textAlign:'left',fontWeight:700,color:'#7f8c8d',textTransform:'uppercase',fontSize:'9px',letterSpacing:'0.06em',borderBottom:'1px solid rgba(26,44,62,0.08)'}}>Indicator</th>
                          {benchCountries.map((c,i)=>(
                            <th key={c.id} style={{padding:'8px 10px',textAlign:'center',fontWeight:700,color:['#2ecc71','#3498db','#9b59b6','#f1c40f'][i],textTransform:'uppercase',fontSize:'9px',letterSpacing:'0.06em',borderBottom:'1px solid rgba(26,44,62,0.08)'}}>
                              {c.flag} {c.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {DB_INDICATORS.map((ind,ii)=>(
                          <tr key={ind} style={{borderBottom:'1px solid rgba(26,44,62,0.04)',background:ii%2===0?'white':'rgba(26,44,62,0.01)'}}>
                            <td style={{padding:'8px 10px',fontSize:'11px',color:'#2c3e50',fontWeight:500}}>{ind}</td>
                            {benchCountries.map((c,ci)=>{
                              const v=(DB_SCORES[c.id]||[])[ii]||0;
                              const best=Math.max(...benchCountries.map(bc=>(DB_SCORES[bc.id]||[])[ii]||0));
                              return (
                                <td key={c.id} style={{padding:'8px 10px',textAlign:'center',fontWeight:v===best?900:600,color:v===best?['#2ecc71','#3498db','#9b59b6','#f1c40f'][ci]:sc(v),fontFamily:"'JetBrains Mono',monospace",fontSize:'12px'}}>
                                  {v===best?`★ ${v}`:v}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
            {benchCountries.length<2 && (
              <div style={{background:'white',borderRadius:'14px',padding:'40px',textAlign:'center',border:'1px solid rgba(26,44,62,0.08)'}}>
                <div style={{fontSize:'40px',marginBottom:'12px'}}>📊</div>
                <div style={{fontSize:'16px',fontWeight:700,color:'#1a2c3e',marginBottom:'6px'}}>Select at least 2 economies above</div>
                <div style={{fontSize:'13px',color:'#7f8c8d'}}>Choose up to 4 economies to compare across all GOSA layers and Doing Business indicators</div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 4: IMPACT ANALYSIS ───────────────────────────────────────── */}
        {tab==='impact' && (
          <div style={{display:'grid',gridTemplateColumns:'360px 1fr',gap:'16px',alignItems:'start'}}>
            {/* Config */}
            <div style={{background:'white',borderRadius:'14px',border:'1px solid rgba(26,44,62,0.08)',padding:'22px'}}>
              <div style={{fontSize:'13px',fontWeight:700,color:'#1a2c3e',marginBottom:'18px',display:'flex',alignItems:'center',gap:'7px'}}><Target size={14} color="#2ecc71"/> Investment Parameters</div>
              {[
                {l:'Target Economy',type:'select',opts:COUNTRIES.map(c=>c.name)},
                {l:'Investment Size (USD)',type:'select',opts:['$10M–$50M','$50M–$250M','$250M–$1B','$1B+']},
                {l:'Primary Sector',type:'select',opts:['EV Battery','Data Centers','Semiconductors','Renewables','Manufacturing','All Sectors']},
                {l:'Investment Timeline',type:'select',opts:['1–2 years','2–5 years','5–10 years','10+ years']},
                {l:'Employment Target',type:'select',opts:['<100 jobs','100–500 jobs','500–2,000 jobs','2,000+ jobs']},
              ].map(({l,opts})=>(
                <div key={l} style={{marginBottom:'12px'}}>
                  <label style={{fontSize:'11px',fontWeight:700,color:'#7f8c8d',display:'block',marginBottom:'3px',textTransform:'uppercase',letterSpacing:'0.05em'}}>{l}</label>
                  <select style={{width:'100%',padding:'9px 12px',border:'1px solid rgba(26,44,62,0.12)',borderRadius:'8px',fontSize:'12px',fontFamily:'inherit',outline:'none',background:'white'}}>
                    {(opts||[]).map((o: string)=><option key={o}>{o}</option>)}
                  </select>
                </div>
              ))}
              <button style={{width:'100%',marginTop:'8px',padding:'11px',background:'#2ecc71',color:'#0f1e2a',border:'none',borderRadius:'9px',cursor:'pointer',fontSize:'13px',fontWeight:800,fontFamily:'inherit',display:'flex',alignItems:'center',justifyContent:'center',gap:'7px'}}>
                <Zap size={14}/> Model Investment Impact
              </button>
            </div>

            {/* Impact results */}
            <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
              <div style={{background:'white',borderRadius:'14px',border:'1px solid rgba(26,44,62,0.08)',padding:'20px'}}>
                <div style={{fontSize:'13px',fontWeight:700,color:'#1a2c3e',marginBottom:'16px'}}>Economic Impact Projections — Vietnam · EV Battery · $250M</div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',marginBottom:'18px'}}>
                  {[
                    {l:'Projected GDP Contribution',v:'$1.8B',sub:'Over 10-year project life',c:'#2ecc71'},
                    {l:'Direct Jobs Created',v:'4,200',sub:'+ 8,400 indirect (2× multiplier)',c:'#3498db'},
                    {l:'Tax Revenue (Yr 1–5)',v:'$42M',sub:'Corporate + employment taxes',c:'#f1c40f'},
                    {l:'Export Value Added',v:'$340M/yr',sub:'At target production capacity',c:'#9b59b6'},
                    {l:'Incentive Capture',v:'$28M',sub:'Tax holidays + grants over 5 years',c:'#e67e22'},
                    {l:'IRR (Post-incentive)',v:'18.4%',sub:'Based on GOSA L2/L3 indicators',c:'#2ecc71'},
                  ].map(({l,v,sub,c})=>(
                    <div key={l} style={{padding:'14px',background:'rgba(26,44,62,0.02)',borderRadius:'10px',border:'1px solid rgba(26,44,62,0.07)'}}>
                      <div style={{fontSize:'10px',color:'#7f8c8d',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.05em'}}>{l}</div>
                      <div style={{fontSize:'22px',fontWeight:900,color:c,fontFamily:"'JetBrains Mono',monospace",marginBottom:'2px'}}>{v}</div>
                      <div style={{fontSize:'10px',color:'#7f8c8d'}}>{sub}</div>
                    </div>
                  ))}
                </div>
                <div style={{padding:'14px',background:'rgba(46,204,113,0.06)',borderRadius:'10px',border:'1px solid rgba(46,204,113,0.15)'}}>
                  <div style={{fontSize:'12px',fontWeight:700,color:'#2ecc71',marginBottom:'4px'}}>IMPACT VERDICT</div>
                  <div style={{fontSize:'13px',color:'#1a2c3e',lineHeight:'1.65'}}>
                    Vietnam EV Battery investment at $250M shows <strong>strong economic impact</strong> with 18.4% IRR. GOSA L3 zone score of 78.9/100 indicates favorable zone conditions. Recommended entry: Q3 2026 via Binh Duong Industrial Zone with 50% CIT reduction for first 5 years.
                  </div>
                </div>
              </div>

              <div style={{background:'white',borderRadius:'14px',border:'1px solid rgba(26,44,62,0.08)',padding:'20px'}}>
                <div style={{fontSize:'13px',fontWeight:700,color:'#1a2c3e',marginBottom:'14px'}}>5-Year Financial Model</div>
                <div style={{overflowX:'auto'}}>
                  <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}>
                    <thead>
                      <tr style={{background:'rgba(26,44,62,0.03)'}}>
                        {['Metric','Year 1','Year 2','Year 3','Year 4','Year 5'].map(h=>(
                          <th key={h} style={{padding:'8px 12px',fontWeight:700,color:'#7f8c8d',textTransform:'uppercase',fontSize:'10px',letterSpacing:'0.05em',borderBottom:'1px solid rgba(26,44,62,0.08)',textAlign:h==='Metric'?'left':'center'}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Revenue ($M)','$42','$98','$168','$224','$280'],
                        ['EBITDA ($M)','$8','$22','$42','$61','$78'],
                        ['CIT (with incentives)','$0','$0','$2.1M','$6.1M','$7.8M'],
                        ['Cumulative Jobs','850','1,920','3,100','3,840','4,200'],
                        ['GOSA Score (proj.)','79.4','79.9','80.4','80.8','81.2'],
                      ].map(([m,...vals])=>(
                        <tr key={m} style={{borderBottom:'1px solid rgba(26,44,62,0.04)'}}>
                          <td style={{padding:'9px 12px',fontWeight:600,color:'#2c3e50'}}>{m}</td>
                          {vals.map((v,i)=>(
                            <td key={i} style={{padding:'9px 12px',textAlign:'center',fontFamily:"'JetBrains Mono',monospace",color:'#1a2c3e'}}>{v}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div style={{marginTop:'14px',display:'flex',gap:'10px'}}>
                  <Link href="/reports" style={{padding:'9px 20px',background:'#2ecc71',color:'#0f1e2a',borderRadius:'9px',textDecoration:'none',fontSize:'12px',fontWeight:800,display:'flex',alignItems:'center',gap:'6px'}}>
                    <Download size={13}/> Export Full Report
                  </Link>
                  <button onClick={()=>setTab('benchmark')} style={{padding:'9px 18px',background:'rgba(26,44,62,0.06)',border:'1px solid rgba(26,44,62,0.1)',borderRadius:'9px',cursor:'pointer',fontSize:'12px',fontWeight:600,color:'#1a2c3e',fontFamily:'inherit'}}>
                    Compare Competitors →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
      <Footer/>
    </div>
  );
}
