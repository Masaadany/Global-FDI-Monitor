'use client';
import { useState, useMemo } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Flag from '@/components/Flag';
import ScrollableSelect from '@/components/ScrollableSelect';
import { LollipopChart, RadarChart, scoreColor } from '@/components/Charts';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Award, Download } from 'lucide-react';

const DIMS = [
  {code:'ETR',name:'Economic & Trade Resilience',weight:0.20,color:'#2ECC71'},
  {code:'ICT',name:'Innovation & Creative Talent', weight:0.18,color:'#3498DB'},
  {code:'TCM',name:'Trade & Capital Mobility',     weight:0.18,color:'#F1C40F'},
  {code:'DTF',name:'Digital & Tech Frontier',      weight:0.16,color:'#9B59B6'},
  {code:'SGT',name:'Sustainable Growth',           weight:0.15,color:'#E67E22'},
  {code:'GRP',name:'Governance & Policy',          weight:0.13,color:'#E74C3C'},
];

const GFR = [
  {rank:1, flag:'SG',name:'Singapore',    gfr:91.2,etr:93.1,ict:89.4,tcm:94.2,dtf:91.8,sgt:82.1,grp:96.4,trend:+0.3,cat:'TOP', region:'Asia Pacific'},
  {rank:2, flag:'DK',name:'Denmark',      gfr:89.8,etr:88.2,ict:91.4,tcm:86.3,dtf:90.1,sgt:94.2,grp:95.1,trend:+0.2,cat:'TOP', region:'Europe'},
  {rank:3, flag:'CH',name:'Switzerland',  gfr:89.1,etr:91.0,ict:92.3,tcm:88.4,dtf:87.6,sgt:88.3,grp:93.8,trend:+0.1,cat:'TOP', region:'Europe'},
  {rank:4, flag:'NL',name:'Netherlands',  gfr:87.4,etr:86.8,ict:88.2,tcm:89.1,dtf:89.4,sgt:87.6,grp:91.2,trend:-0.1,cat:'TOP', region:'Europe'},
  {rank:5, flag:'NZ',name:'New Zealand',  gfr:86.3,etr:83.1,ict:84.6,tcm:87.2,dtf:85.4,sgt:89.8,grp:94.6,trend:-0.2,cat:'TOP', region:'Oceania'},
  {rank:6, flag:'KR',name:'South Korea',  gfr:86.9,etr:84.3,ict:93.1,tcm:82.6,dtf:94.8,sgt:78.4,grp:88.2,trend:+0.4,cat:'TOP', region:'Asia Pacific'},
  {rank:7, flag:'GB',name:'UK',           gfr:84.2,etr:81.6,ict:87.4,tcm:85.8,dtf:86.2,sgt:81.4,grp:89.6,trend:-0.3,cat:'TOP', region:'Europe'},
  {rank:8, flag:'AE',name:'UAE',          gfr:83.8,etr:86.4,ict:82.1,tcm:88.6,dtf:84.2,sgt:76.8,grp:88.4,trend:+1.4,cat:'TOP', region:'Middle East'},
  {rank:9, flag:'US',name:'United States',gfr:82.6,etr:83.8,ict:88.4,tcm:84.2,dtf:89.6,sgt:72.4,grp:82.8,trend:-0.1,cat:'TOP', region:'Americas'},
  {rank:10,flag:'DE',name:'Germany',      gfr:83.1,etr:84.2,ict:85.6,tcm:81.4,dtf:82.8,sgt:85.6,grp:88.2,trend:-0.2,cat:'TOP', region:'Europe'},
  {rank:11,flag:'MY',name:'Malaysia',     gfr:79.2,etr:78.6,ict:76.4,tcm:81.8,dtf:78.2,sgt:74.6,grp:82.4,trend:+0.6,cat:'HIGH',region:'Asia Pacific'},
  {rank:12,flag:'SA',name:'Saudi Arabia', gfr:78.6,etr:82.4,ict:74.2,tcm:80.6,dtf:76.8,sgt:68.4,grp:82.6,trend:+2.2,cat:'HIGH',region:'Middle East'},
  {rank:13,flag:'TH',name:'Thailand',     gfr:77.4,etr:75.8,ict:72.6,tcm:78.4,dtf:74.6,sgt:72.8,grp:78.4,trend:+0.3,cat:'HIGH',region:'Asia Pacific'},
  {rank:14,flag:'VN',name:'Vietnam',      gfr:76.8,etr:74.2,ict:71.4,tcm:77.6,dtf:72.4,sgt:74.2,grp:74.8,trend:+0.8,cat:'HIGH',region:'Asia Pacific'},
  {rank:15,flag:'IN',name:'India',        gfr:75.6,etr:72.8,ict:76.4,tcm:74.2,dtf:72.8,sgt:68.6,grp:76.2,trend:+1.1,cat:'HIGH',region:'Asia Pacific'},
];

const COMPARE_COLORS = ['#2ECC71','#3498DB','#F1C40F','#9B59B6'];

export default function GFRPage() {
  const [tab, setTab] = useState('ranking');
  const [sel, setSel] = useState(GFR[0]);
  const [search, setSearch] = useState('');
  const [filterRegion, setFilterRegion] = useState('ALL');
  const [filterCat, setFilterCat] = useState('ALL');
  const [compareSet, setCompareSet] = useState(['Singapore','UAE','Malaysia','Saudi Arabia']);

  const filtered = useMemo(() => {
    let d = GFR.filter(c => {
      if (filterRegion!=='ALL' && c.region!==filterRegion) return false;
      if (filterCat!=='ALL' && c.cat!==filterCat) return false;
      if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    return d;
  }, [filterRegion, filterCat, search]);

  const compareCountries = GFR.filter(c => compareSet.includes(c.name));
  const regionOpts = [{value:'ALL',label:'All Regions'},...Array.from(new Set(GFR.map(c=>c.region))).map(r=>({value:r,label:r}))];
  const catOpts = [{value:'ALL',label:'All Categories'},{value:'TOP',label:'TOP (≥80)'},{value:'HIGH',label:'HIGH (60-79)'}];

  const card = {background:'white',borderRadius:'20px',padding:'22px',border:'1px solid var(--border)',boxShadow:'0 4px 16px rgba(26,44,62,0.05)'};

  return (
    <div style={{minHeight:'100vh',background:'var(--bg-page)',fontFamily:'var(--font-ui)'}}>
      <NavBar/>
      <div style={{background:'white',borderBottom:'1px solid var(--border)',padding:'20px 24px'}}>
        <div style={{maxWidth:'1440px',margin:'0 auto'}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'8px',flexWrap:'wrap'}}>
            <Award size={18} color="#D4AC0D"/>
            <div style={{fontSize:'11px',fontWeight:700,color:'var(--text-muted)',letterSpacing:'0.12em',textTransform:'uppercase',fontFamily:'var(--font-mono)'}}>GFR RANKING 2026</div>
            <span style={{fontSize:'10px',padding:'3px 10px',background:'rgba(46,204,113,0.1)',border:'1px solid rgba(46,204,113,0.25)',borderRadius:'12px',color:'var(--accent-green)',fontFamily:'var(--font-mono)',fontWeight:700}}>COMPARABLE TO IMD WCR · KEARNEY GCR</span>
          </div>
          <h1 style={{fontSize:'26px',fontWeight:900,color:'var(--text-primary)',fontFamily:'var(--font-display)',marginBottom:'6px'}}>Global Future Readiness Ranking</h1>
          <div style={{fontFamily:'var(--font-mono)',fontSize:'12px',color:'var(--text-muted)',marginBottom:'16px'}}>
            GFR = (0.20×ETR) + (0.18×ICT) + (0.18×TCM) + (0.16×DTF) + (0.15×SGT) + (0.13×GRP)
          </div>
          <div style={{display:'flex',gap:'4px'}}>
            {[['ranking','📊 Ranking'],['compare','⚖ Compare'],['methodology','🔬 Methodology']].map(([t,l])=>(
              <button key={t} onClick={()=>setTab(t)} style={{padding:'8px 18px',border:'none',borderBottom:`2px solid ${tab===t?'var(--accent-green)':'transparent'}`,background:'transparent',cursor:'pointer',fontSize:'13px',fontWeight:tab===t?700:500,color:tab===t?'var(--accent-green)':'var(--text-secondary)',fontFamily:'var(--font-ui)',transition:'all 200ms'}}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:'1440px',margin:'0 auto',padding:'24px'}}>
        {tab==='ranking' && (
          <div style={{display:'grid',gridTemplateColumns:'1fr 300px',gap:'20px',alignItems:'start'}}>
            <div style={card}>
              <div style={{display:'flex',gap:'10px',flexWrap:'wrap',marginBottom:'16px',alignItems:'flex-end'}}>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search economy..." style={{width:'180px'}}/>
                <ScrollableSelect value={filterRegion} onChange={setFilterRegion} width="150px" options={regionOpts}/>
                <ScrollableSelect label="Category" value={filterCat} onChange={setFilterCat} width="140px" options={catOpts}/>
                <span style={{marginLeft:'auto',fontSize:'11px',color:'var(--text-muted)',fontFamily:'var(--font-mono)'}}>{filtered.length} economies</span>
              </div>
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse'}}>
                  <thead>
                    <tr style={{background:'var(--bg-subtle)'}}>
                      {['#','Economy','GFR','ETR','ICT','TCM','DTF','SGT','GRP','Trend'].map(h=>(
                        <th key={h} style={{padding:'9px 12px',textAlign:h==='Economy'?'left':'center',fontSize:'10px',fontWeight:700,color:'var(--text-muted)',textTransform:'uppercase',letterSpacing:'0.07em',borderBottom:'1px solid var(--border)',fontFamily:'var(--font-mono)',whiteSpace:'nowrap'}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(c=>(
                      <tr key={c.name} style={{cursor:'pointer',borderBottom:'1px solid var(--border)',background:sel.name===c.name?'rgba(46,204,113,0.04)':'white',transition:'background 150ms'}}
                        onClick={()=>setSel(c)}
                        onMouseEnter={e=>{if(sel.name!==c.name)e.currentTarget.style.background='rgba(46,204,113,0.02)';}}
                        onMouseLeave={e=>{if(sel.name!==c.name)e.currentTarget.style.background='white';}}>
                        <td style={{padding:'11px 12px',textAlign:'center',fontWeight:800,color:'var(--text-muted)',fontFamily:'var(--font-mono)'}}>{c.rank<=3?['🥇','🥈','🥉'][c.rank-1]:c.rank}</td>
                        <td style={{padding:'11px 12px'}}>
                          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
                            <Flag country={c.flag} size="md"/>
                            <span style={{fontWeight:600,color:'var(--text-primary)'}}>{c.name}</span>
                            <span style={{fontSize:'9px',fontWeight:800,padding:'2px 7px',borderRadius:'10px',background:c.cat==='TOP'?'rgba(46,204,113,0.1)':'rgba(52,152,219,0.1)',color:c.cat==='TOP'?'#27AE60':'#2980B9'}}>{c.cat}</span>
                          </div>
                        </td>
                        <td style={{padding:'11px 8px',textAlign:'center'}}>
                          <div style={{fontSize:'16px',fontWeight:900,color:scoreColor(c.gfr),fontFamily:'var(--font-mono)'}}>{c.gfr}</div>
                        </td>
                        {[c.etr,c.ict,c.tcm,c.dtf,c.sgt,c.grp].map((v,i)=>(
                          <td key={i} style={{padding:'11px 8px',textAlign:'center',fontSize:'12px',fontWeight:600,color:scoreColor(v),fontFamily:'var(--font-mono)'}}>{v}</td>
                        ))}
                        <td style={{padding:'11px 8px',textAlign:'center',fontSize:'11px',fontWeight:700,color:c.trend>0?'#27AE60':c.trend<0?'#E74C3C':'var(--text-muted)'}}>
                          {c.trend>0?`▲+${c.trend}`:c.trend<0?`▼${c.trend}`:'—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Side panel */}
            <div style={card}>
              <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px'}}>
                <Flag country={sel.flag} size="lg"/>
                <div>
                  <div style={{fontSize:'16px',fontWeight:800,color:'var(--text-primary)'}}>{sel.name}</div>
                  <div style={{fontSize:'11px',color:'var(--text-muted)'}}>#{sel.rank} · {sel.region}</div>
                </div>
              </div>
              <div style={{fontSize:'40px',fontWeight:900,color:scoreColor(sel.gfr),fontFamily:'var(--font-mono)',marginBottom:'12px'}}>{sel.gfr}</div>
              <div style={{display:'flex',justifyContent:'center',marginBottom:'14px'}}>
                <RadarChart datasets={[{label:sel.name,data:[sel.etr,sel.ict,sel.tcm,sel.dtf,sel.sgt,sel.grp],color:scoreColor(sel.gfr)}]} labels={['ETR','ICT','TCM','DTF','SGT','GRP']} size={180}/>
              </div>
              {DIMS.map(d=>{
                const v=(sel as any)[d.code.toLowerCase()];
                return (
                  <div key={d.code} style={{marginBottom:'7px'}}>
                    <div style={{display:'flex',justifyContent:'space-between',marginBottom:'2px',fontSize:'11px'}}>
                      <span style={{color:'var(--text-muted)'}}>{d.code} <span style={{color:'var(--text-light)',fontSize:'9px'}}>({(d.weight*100).toFixed(0)}%)</span></span>
                      <span style={{fontWeight:700,color:d.color,fontFamily:'var(--font-mono)'}}>{v}</span>
                    </div>
                    <div style={{height:'4px',background:'var(--border)',borderRadius:'2px',overflow:'hidden'}}>
                      <div style={{height:'100%',width:`${v}%`,background:d.color,borderRadius:'2px'}}/>
                    </div>
                  </div>
                );
              })}
              <button onClick={()=>{setCompareSet(p=>p.includes(sel.name)?p:([...p.slice(-3),sel.name]));setTab('compare');}}
                style={{width:'100%',marginTop:'12px',padding:'9px',background:'var(--primary)',color:'white',border:'none',borderRadius:'10px',cursor:'pointer',fontSize:'12px',fontWeight:700,fontFamily:'var(--font-ui)'}}>
                Compare →
              </button>
            </div>
          </div>
        )}

        {tab==='compare' && (
          <div>
            <div style={{...card,marginBottom:'16px'}}>
              <div style={{fontSize:'13px',fontWeight:600,color:'var(--text-secondary)',marginBottom:'12px'}}>Select economies (up to 4):</div>
              <div style={{display:'flex',gap:'7px',flexWrap:'wrap'}}>
                {GFR.map(c=>{
                  const idx=compareSet.indexOf(c.name); const isIn=idx!==-1; const col=COMPARE_COLORS[idx%4];
                  return (
                    <button key={c.name} onClick={()=>setCompareSet(p=>p.includes(c.name)?p.filter(x=>x!==c.name):[...p.slice(-3),c.name])}
                      style={{display:'flex',alignItems:'center',gap:'6px',padding:'5px 12px',borderRadius:'20px',border:`2px solid ${isIn?col+'60':'var(--border)'}`,background:isIn?`${col}10`:'white',cursor:'pointer',fontSize:'11px',fontWeight:isIn?700:400,color:isIn?col:'var(--text-secondary)',fontFamily:'var(--font-ui)',transition:'all 150ms'}}>
                      <Flag country={c.flag} size="sm"/> {c.name}
                    </button>
                  );
                })}
              </div>
            </div>
            {compareCountries.length >= 2 && (
              <>
                <div style={{display:'grid',gridTemplateColumns:'240px 1fr',gap:'16px',marginBottom:'16px'}}>
                  <div style={card}>
                    <RadarChart datasets={compareCountries.map((c,i)=>({label:c.name,data:[c.etr,c.ict,c.tcm,c.dtf,c.sgt,c.grp],color:COMPARE_COLORS[i]}))} labels={['ETR','ICT','TCM','DTF','SGT','GRP']} size={210} showLegend/>
                  </div>
                  <div style={card}>
                    <div style={{fontSize:'13px',fontWeight:700,color:'var(--text-primary)',marginBottom:'14px'}}>Overall GFR Score</div>
                    {compareCountries.map((c,i)=>(
                      <div key={c.name} style={{marginBottom:'14px'}}>
                        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'6px'}}>
                          <div style={{display:'flex',alignItems:'center',gap:'8px'}}><Flag country={c.flag} size="md"/><span style={{fontSize:'13px',fontWeight:600}}>{c.name}</span></div>
                          <span style={{fontSize:'22px',fontWeight:900,color:COMPARE_COLORS[i],fontFamily:'var(--font-mono)'}}>{c.gfr}</span>
                        </div>
                        <div style={{height:'10px',background:'var(--bg-subtle)',borderRadius:'5px',overflow:'hidden'}}>
                          <div style={{height:'100%',width:`${c.gfr}%`,background:COMPARE_COLORS[i],borderRadius:'5px',transition:'width 0.8s ease'}}/>
                        </div>
                      </div>
                    ))}
                    <div style={{display:'grid',gridTemplateColumns:`repeat(${DIMS.length},1fr)`,gap:'8px',marginTop:'16px'}}>
                      {DIMS.map(d=>{
                        const vals=compareCountries.map(c=>(c as any)[d.code.toLowerCase()]);
                        const best=Math.max(...vals);
                        return (
                          <div key={d.code}>
                            <div style={{fontSize:'9px',fontWeight:700,color:d.color,marginBottom:'6px',textAlign:'center',fontFamily:'var(--font-mono)'}}>{d.code}</div>
                            {vals.map((v,ci)=>(
                              <div key={ci} style={{height:'20px',display:'flex',alignItems:'center',marginBottom:'3px'}}>
                                <div style={{flex:1,height:'6px',background:'var(--bg-subtle)',borderRadius:'3px',overflow:'hidden'}}>
                                  <div style={{height:'100%',width:`${v}%`,background:COMPARE_COLORS[ci],borderRadius:'3px'}}/>
                                </div>
                                <span style={{fontSize:'9px',fontWeight:v===best?900:600,color:COMPARE_COLORS[ci],marginLeft:'4px',minWidth:'24px',fontFamily:'var(--font-mono)'}}>{v===best?'★':''}{v}</span>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {tab==='methodology' && (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'16px'}}>
            {DIMS.map(d=>(
              <div key={d.code} style={{...card,borderTop:`4px solid ${d.color}`}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
                  <span style={{fontSize:'20px',fontWeight:900,color:d.color,fontFamily:'var(--font-mono)'}}>{d.code}</span>
                  <span style={{fontSize:'12px',fontWeight:800,padding:'3px 10px',borderRadius:'12px',background:`${d.color}15`,color:d.color}}>{(d.weight*100).toFixed(0)}%</span>
                </div>
                <div style={{fontSize:'14px',fontWeight:700,color:'var(--text-primary)'}}>{d.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}
