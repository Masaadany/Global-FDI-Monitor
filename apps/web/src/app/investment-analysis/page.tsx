'use client';
import { useState, useMemo } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Flag from '@/components/Flag';
import ScrollableSelect from '@/components/ScrollableSelect';
import { LollipopChart, RadarChart, ParallelCoords, Sankey, scoreColor } from '@/components/Charts';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Download, Zap } from 'lucide-react';

const ECONOMIES = [
  {id:'SGP',flag:'SG',name:'Singapore',    gosa:88.4,trend:+0.2,fdi:'$91B', l1:92.1,l2:85.3,l3:87.2,l4:89.0,cat:'TOP',  region:'Asia Pacific'},
  {id:'NZL',flag:'NZ',name:'New Zealand',  gosa:86.7,trend:-0.1,fdi:'$9B',  l1:89.5,l2:84.1,l3:85.8,l4:87.3,cat:'TOP',  region:'Oceania'},
  {id:'DNK',flag:'DK',name:'Denmark',      gosa:85.3,trend:+0.3,fdi:'$22B', l1:87.2,l2:83.5,l3:84.9,l4:85.6,cat:'TOP',  region:'Europe'},
  {id:'KOR',flag:'KR',name:'South Korea',  gosa:84.1,trend:+0.1,fdi:'$17B', l1:86.0,l2:82.8,l3:83.5,l4:84.2,cat:'TOP',  region:'Asia Pacific'},
  {id:'USA',flag:'US',name:'United States',gosa:83.9,trend:-0.2,fdi:'$349B',l1:85.3,l2:82.1,l3:83.0,l4:85.1,cat:'TOP',  region:'Americas'},
  {id:'GBR',flag:'GB',name:'United Kingdom',gosa:82.5,trend:-0.1,fdi:'$50B',l1:84.1,l2:81.4,l3:82.2,l4:82.3,cat:'TOP', region:'Europe'},
  {id:'ARE',flag:'AE',name:'UAE',          gosa:82.1,trend:+1.2,fdi:'$23B', l1:83.4,l2:81.2,l3:82.8,l4:81.0,cat:'TOP',  region:'Middle East'},
  {id:'MYS',flag:'MY',name:'Malaysia',     gosa:81.2,trend:+0.4,fdi:'$22B', l1:82.5,l2:80.7,l3:81.8,l4:79.8,cat:'HIGH', region:'Asia Pacific'},
  {id:'THA',flag:'TH',name:'Thailand',     gosa:80.7,trend:+0.2,fdi:'$14B', l1:81.8,l2:80.2,l3:81.0,l4:79.8,cat:'HIGH', region:'Asia Pacific'},
  {id:'VNM',flag:'VN',name:'Vietnam',      gosa:79.4,trend:+0.5,fdi:'$24B', l1:80.5,l2:79.1,l3:78.9,l4:79.1,cat:'HIGH', region:'Asia Pacific'},
  {id:'SAU',flag:'SA',name:'Saudi Arabia', gosa:79.1,trend:+2.1,fdi:'$36B', l1:77.3,l2:80.4,l3:82.1,l4:76.6,cat:'HIGH', region:'Middle East'},
  {id:'IDN',flag:'ID',name:'Indonesia',    gosa:77.8,trend:+0.1,fdi:'$22B', l1:78.9,l2:77.3,l3:77.5,l4:77.5,cat:'HIGH', region:'Asia Pacific'},
  {id:'IND',flag:'IN',name:'India',        gosa:73.2,trend:+0.8,fdi:'$71B', l1:69.8,l2:74.6,l3:74.8,l4:73.6,cat:'HIGH', region:'Asia Pacific'},
  {id:'BRA',flag:'BR',name:'Brazil',       gosa:71.3,trend:+0.4,fdi:'$74B', l1:68.4,l2:72.8,l3:71.2,l4:72.8,cat:'HIGH', region:'Americas'},
  {id:'MAR',flag:'MA',name:'Morocco',      gosa:66.8,trend:+0.6,fdi:'$4B',  l1:63.8,l2:68.2,l3:68.4,l4:66.8,cat:'HIGH', region:'Africa'},
];

const BENCH_COLORS = ['#2ECC71','#3498DB','#F1C40F','#E74C3C','#9B59B6'];

export default function InvestmentAnalysis() {
  const [tab, setTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [filterRegion, setFilterRegion] = useState('ALL');
  const [benchSel, setBenchSel] = useState(['SGP','ARE','MYS','VNM']);
  const [impactCountry, setImpactCountry] = useState('Malaysia');
  const [impactSector, setImpactSector] = useState('EV Battery');
  const [impactSize, setImpactSize] = useState('$250M');
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<any>(null);

  const regions = ['ALL',...Array.from(new Set(ECONOMIES.map(e=>e.region)))];
  const filtered = useMemo(() => ECONOMIES.filter(e => {
    if (filterRegion!=='ALL' && e.region!==filterRegion) return false;
    if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [filterRegion, search]);

  const benchCountries = ECONOMIES.filter(e => benchSel.includes(e.id));

  async function runImpact() {
    setRunning(true);
    await new Promise(r=>setTimeout(r,1400));
    const gosa = ECONOMIES.find(e=>e.name===impactCountry)?.gosa||75;
    const sizeN = parseFloat(impactSize.replace(/[$MB]/g,''))*(impactSize.endsWith('B')?1000:1);
    setResults({
      gdp:`$${(sizeN*0.18).toFixed(0)}M`,jobs:Math.round(sizeN*4.2),tax:`$${(sizeN*0.08).toFixed(0)}M/yr`,
      irr:`${(12+(gosa-60)*0.3).toFixed(1)}%`,incentives:`$${(sizeN*0.12).toFixed(0)}M`,
      verdict:gosa>=80?'STRONG CASE':'VIABLE CASE',risk:gosa>=78?'LOW':'MODERATE',
    });
    setRunning(false);
  }

  const card = {background:'white',borderRadius:'20px',padding:'22px',border:'1px solid var(--border)',boxShadow:'0 4px 16px rgba(26,44,62,0.05)'};

  return (
    <div style={{minHeight:'100vh',background:'var(--bg-page)',fontFamily:'var(--font-ui)'}}>
      <NavBar/>
      <div style={{background:'white',borderBottom:'1px solid var(--border)',padding:'20px 24px'}}>
        <div style={{maxWidth:'1440px',margin:'0 auto'}}>
          <div style={{fontSize:'11px',fontWeight:700,color:'var(--accent-green)',letterSpacing:'0.14em',textTransform:'uppercase',marginBottom:'4px',fontFamily:'var(--font-mono)'}}>INVESTMENT ANALYSIS</div>
          <h1 style={{fontSize:'26px',fontWeight:900,color:'var(--text-primary)',fontFamily:'var(--font-display)',marginBottom:'16px'}}>Global Investment Analysis Platform</h1>
          <div style={{display:'flex',gap:'4px'}}>
            {[['overview','📊 Overview'],['analysis','🌍 Global Analysis'],['benchmark','⚖ Benchmark'],['impact','💡 Impact Analysis']].map(([t,l])=>(
              <button key={t} onClick={()=>setTab(t)} style={{padding:'9px 18px',border:'none',borderBottom:`2px solid ${tab===t?'var(--accent-green)':'transparent'}`,background:'transparent',cursor:'pointer',fontSize:'13px',fontWeight:tab===t?700:500,color:tab===t?'var(--accent-green)':'var(--text-secondary)',fontFamily:'var(--font-ui)',transition:'all 200ms'}}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:'1440px',margin:'0 auto',padding:'24px'}}>

        {/* OVERVIEW TAB */}
        {tab==='overview' && (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'20px'}}>
            <div style={card}>
              <h3 style={{fontSize:'16px',fontWeight:700,color:'var(--text-primary)',marginBottom:'8px'}}>GOSA Methodology</h3>
              <p style={{fontSize:'13px',color:'var(--text-secondary)',lineHeight:1.75,marginBottom:'16px'}}>The Global Opportunity Scoring Algorithm (GOSA) is a 4-layer composite methodology scoring economies 0-100.</p>
              <div style={{fontFamily:'var(--font-mono)',fontSize:'13px',padding:'12px',background:'var(--bg-subtle)',borderRadius:'10px',marginBottom:'16px',color:'var(--text-primary)',fontWeight:600}}>
                GOSA = (0.30×L1) + (0.20×L2) + (0.25×L3) + (0.25×L4)
              </div>
              <RadarChart datasets={[{label:'Example',data:[87,82,85,83,87,82],color:'#2ECC71'}]} labels={['L1','L2','L3','L4','ETR','ICT']} size={200}/>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'14px'}}>
              {[['L1','Doing Business (30%)','World Bank methodology — 10 indicators across regulatory efficiency','#2ECC71'],['L2','Sector Intelligence (20%)','Sector-level scoring across 9 investment categories','#3498DB'],['L3','Investment Zones (25%)','SEZ/FTZ availability, incentives, and infrastructure','#F1C40F'],['L4','Market Intelligence (25%)','Real-time signals from 1000+ official sources','#9B59B6']].map(([l,t,d,c])=>(
                <div key={String(l)} style={{...card,padding:'16px',borderLeft:`4px solid ${c}`}}>
                  <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'5px'}}>
                    <span style={{fontSize:'18px',fontWeight:900,color:c as string,fontFamily:'var(--font-mono)'}}>{l}</span>
                    <span style={{fontSize:'14px',fontWeight:700,color:'var(--text-primary)'}}>{t as string}</span>
                  </div>
                  <p style={{fontSize:'12px',color:'var(--text-secondary)',lineHeight:1.6}}>{d as string}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ANALYSIS TAB */}
        {tab==='analysis' && (
          <div>
            <div style={{...card,marginBottom:'16px'}}>
              <div style={{display:'flex',gap:'12px',flexWrap:'wrap',alignItems:'flex-end'}}>
                <div style={{flex:1,minWidth:'160px'}}>
                  <label style={{fontSize:'11px',fontWeight:600,color:'var(--text-muted)',display:'block',marginBottom:'4px',textTransform:'uppercase',letterSpacing:'0.07em'}}>Search</label>
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search economy..." style={{width:'100%'}}/>
                </div>
                <ScrollableSelect label="Region" value={filterRegion} onChange={setFilterRegion} width="160px" options={regions.map(r=>({value:r,label:r==='ALL'?'All Regions':r}))}/>
                <span style={{fontSize:'11px',color:'var(--text-muted)',fontFamily:'var(--font-mono)',paddingBottom:'2px'}}>{filtered.length} economies</span>
              </div>
            </div>
            <div style={card}>
              <LollipopChart data={filtered.map(e=>({id:e.id,name:e.name,score:e.gosa,trend:e.trend,flag:e.flag}))} height={filtered.length*28+40}/>
            </div>
          </div>
        )}

        {/* BENCHMARK TAB */}
        {tab==='benchmark' && (
          <div>
            <div style={{...card,marginBottom:'16px'}}>
              <div style={{fontSize:'13px',fontWeight:600,color:'var(--text-secondary)',marginBottom:'12px'}}>Select up to 5 economies to compare across all indicators</div>
              <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
                {ECONOMIES.map(e=>{
                  const idx=benchSel.indexOf(e.id);
                  const isIn=idx!==-1;
                  const col=BENCH_COLORS[idx%BENCH_COLORS.length];
                  return (
                    <button key={e.id}
                      onClick={()=>setBenchSel(p=>p.includes(e.id)?p.filter(x=>x!==e.id):[...p.slice(-4),e.id])}
                      style={{display:'flex',alignItems:'center',gap:'6px',padding:'6px 13px',borderRadius:'20px',border:`2px solid ${isIn?col+'60':'var(--border)'}`,background:isIn?`${col}10`:'transparent',cursor:'pointer',fontSize:'12px',fontWeight:isIn?700:400,color:isIn?col:'var(--text-secondary)',transition:'all 150ms',fontFamily:'var(--font-ui)'}}>
                      <Flag country={e.flag} size="sm"/> {e.name}
                      {isIn && <span style={{fontSize:'9px',fontWeight:800}}>#{ idx+1}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
            {benchCountries.length >= 2 ? (
              <div style={card}>
                <h3 style={{fontSize:'15px',fontWeight:700,color:'var(--text-primary)',marginBottom:'16px'}}>Parallel Coordinates — All Indicators</h3>
                <ParallelCoords
                  countries={benchCountries.map((c,i)=>({id:c.id,name:c.name,flag:c.flag,color:BENCH_COLORS[i%BENCH_COLORS.length],values:[c.l1,c.l2,c.l3,c.l4,c.gosa,Math.round(c.l1*0.9),Math.round(c.l2*0.95)]}))}
                  axes={['L1','L2','L3','L4','GOSA','DB','Trend']}
                />
              </div>
            ) : (
              <div style={{...card,textAlign:'center',padding:'48px',color:'var(--text-muted)'}}>Select at least 2 economies above to see the comparison</div>
            )}
          </div>
        )}

        {/* IMPACT TAB */}
        {tab==='impact' && (
          <div style={{display:'grid',gridTemplateColumns:'360px 1fr',gap:'20px',alignItems:'start'}}>
            <div style={{...card,position:'sticky',top:'130px'}}>
              <h3 style={{fontSize:'16px',fontWeight:700,color:'var(--text-primary)',marginBottom:'16px'}}>Configure Analysis</h3>
              {[
                {label:'Target Economy',key:'impactCountry',val:impactCountry,setter:setImpactCountry,opts:ECONOMIES.map(e=>({value:e.name,label:e.name,flag:e.flag,sub:`GOSA ${e.gosa}`}))},
                {label:'Primary Sector',key:'sector',val:impactSector,setter:setImpactSector,opts:['EV Battery','Data Centers','Semiconductors','Renewables','Manufacturing','AI & Technology'].map(s=>({value:s,label:s}))},
                {label:'Investment Size',key:'size',val:impactSize,setter:setImpactSize,opts:['$50M','$100M','$250M','$500M','$1B','$2B','$5B'].map(s=>({value:s,label:s}))},
              ].map(({label,key,val,setter,opts})=>(
                <div key={key} style={{marginBottom:'14px'}}>
                  <ScrollableSelect label={label} value={val} onChange={setter} width="100%" options={opts}/>
                </div>
              ))}
              <button onClick={runImpact} disabled={running}
                style={{width:'100%',padding:'12px',background:running?'var(--bg-subtle)':'var(--primary)',color:running?'var(--text-muted)':'white',border:'none',borderRadius:'12px',cursor:running?'not-allowed':'pointer',fontSize:'13px',fontWeight:700,fontFamily:'var(--font-ui)',display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',boxShadow:running?'none':'0 4px 14px rgba(26,44,62,0.25)'}}>
                {running?<><span style={{animation:'spin 1s linear infinite',display:'inline-block'}}>⟳</span> Modelling...</>:<><Zap size={14}/> Run Impact Analysis</>}
              </button>
            </div>
            <div>
              {results ? (
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'14px',marginBottom:'16px'}}>
                  {[['GDP Contribution',results.gdp,'Economic impact','#2ECC71'],['Jobs Created',results.jobs.toLocaleString(),'Direct employment','#3498DB'],['Tax Revenue/yr',results.tax,'Government revenue','#F1C40F'],['Projected IRR',results.irr,'Post-incentive','#9B59B6'],['Incentive Value',results.incentives,'5-year package','#E67E22'],['Verdict',results.verdict,`Risk: ${results.risk}`,'#2ECC71']].map(([l,v,s,c])=>(
                    <div key={String(l)} style={{...card,borderTop:`3px solid ${c}`}}>
                      <div style={{fontSize:'11px',color:'var(--text-muted)',marginBottom:'6px',textTransform:'uppercase',letterSpacing:'0.06em',fontFamily:'var(--font-mono)'}}>{l as string}</div>
                      <div style={{fontSize:'26px',fontWeight:900,color:c as string,fontFamily:'var(--font-mono)'}}>{v}</div>
                      <div style={{fontSize:'11px',color:'var(--text-muted)',marginTop:'3px'}}>{s as string}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{...card,textAlign:'center',padding:'56px',color:'var(--text-muted)'}}>
                  <div style={{fontSize:'40px',marginBottom:'14px'}}>💡</div>
                  <div style={{fontSize:'16px',fontWeight:700,marginBottom:'6px',color:'var(--text-secondary)'}}>Configure and run analysis</div>
                  <div style={{fontSize:'13px'}}>Set parameters on the left and click Run Impact Analysis</div>
                </div>
              )}
              {results && (
                <div style={card}>
                  <h3 style={{fontSize:'15px',fontWeight:700,marginBottom:'14px',color:'var(--text-primary)'}}>Investment Flow Visualization — Sankey</h3>
                  <Sankey
                    nodes={[{id:'equity',label:'Equity',color:'#2ECC71'},{id:'debt',label:'Debt',color:'#3498DB'},{id:'grants',label:'Grants',color:'#F1C40F'},{id:'gdp',label:'GDP',color:'#27AE60'},{id:'jobs',label:'Jobs',color:'#2980B9'},{id:'tax',label:'Tax Rev.',color:'#D4AC0D'}]}
                    links={[{source:'equity',target:'gdp',value:60},{source:'equity',target:'jobs',value:40},{source:'debt',target:'gdp',value:30},{source:'debt',target:'tax',value:20},{source:'grants',target:'jobs',value:15},{source:'grants',target:'tax',value:10}]}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer/>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
