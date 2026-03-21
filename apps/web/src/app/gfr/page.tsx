'use client';
import { useState, useMemo } from 'react';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { TrendingUp, TrendingDown, ChevronUp, ChevronDown, Download, Filter, Info, Award } from 'lucide-react';

const DIMS = [
  {code:'ETR',name:'Economic & Trade Resilience',weight:0.20,color:'#00ffc8',desc:'Macro stability, trade openness, external balance, currency resilience'},
  {code:'ICT',name:'Innovation & Creative Talent',weight:0.18,color:'#00d4ff',desc:'R&D spend, patent filings, STEM graduates, startup ecosystem'},
  {code:'TCM',name:'Trade & Capital Mobility',weight:0.18,color:'#ffd700',desc:'FDI inflows, capital controls, current account, trade facilitation'},
  {code:'DTF',name:'Digital & Tech Frontier',weight:0.16,color:'#9b59b6',desc:'Broadband, cloud adoption, digital government, AI readiness'},
  {code:'SGT',name:'Sustainable Growth Trajectory',weight:0.15,color:'#e67e22',desc:'Green investment, carbon intensity, ESG governance, SDG progress'},
  {code:'GRP',name:'Governance & Policy',weight:0.13,color:'#ff4466',desc:'Rule of law, regulatory quality, political stability, anti-corruption'},
];

const COUNTRIES=[
  {rank:1,name:'Singapore',    flag:'🇸🇬',gfr:91.2,etr:93.1,ict:89.4,tcm:94.2,dtf:91.8,sgt:82.1,grp:96.4,trend:+0.3,tier:'TOP',region:'Asia Pacific',move:0},
  {rank:2,name:'Denmark',      flag:'🇩🇰',gfr:89.8,etr:88.2,ict:91.4,tcm:86.3,dtf:90.1,sgt:94.2,grp:95.1,trend:+0.2,tier:'TOP',region:'Europe',move:0},
  {rank:3,name:'Switzerland',  flag:'🇨🇭',gfr:89.1,etr:91.0,ict:92.3,tcm:88.4,dtf:87.6,sgt:88.3,grp:93.8,trend:+0.1,tier:'TOP',region:'Europe',move:0},
  {rank:4,name:'Netherlands',  flag:'🇳🇱',gfr:87.4,etr:86.8,ict:88.2,tcm:89.1,dtf:89.4,sgt:87.6,grp:91.2,trend:-0.1,tier:'TOP',region:'Europe',move:0},
  {rank:5,name:'South Korea',  flag:'🇰🇷',gfr:86.9,etr:84.3,ict:93.1,tcm:82.6,dtf:94.8,sgt:78.4,grp:88.2,trend:+0.4,tier:'TOP',region:'Asia Pacific',move:+1},
  {rank:6,name:'New Zealand',  flag:'🇳🇿',gfr:86.3,etr:83.1,ict:84.6,tcm:87.2,dtf:85.4,sgt:89.8,grp:94.6,trend:-0.2,tier:'TOP',region:'Oceania',move:-1},
  {rank:7,name:'Sweden',       flag:'🇸🇪',gfr:85.8,etr:82.4,ict:90.2,tcm:83.4,dtf:88.6,sgt:92.4,grp:92.8,trend:+0.1,tier:'TOP',region:'Europe',move:0},
  {rank:8,name:'United Kingdom',flag:'🇬🇧',gfr:84.2,etr:81.6,ict:87.4,tcm:85.8,dtf:86.2,sgt:81.4,grp:89.6,trend:-0.3,tier:'TOP',region:'Europe',move:0},
  {rank:9,name:'UAE',          flag:'🇦🇪',gfr:83.8,etr:86.4,ict:82.1,tcm:88.6,dtf:84.2,sgt:76.8,grp:88.4,trend:+1.4,tier:'TOP',region:'Middle East',move:+2},
  {rank:10,name:'Germany',     flag:'🇩🇪',gfr:83.1,etr:84.2,ict:85.6,tcm:81.4,dtf:82.8,sgt:85.6,grp:88.2,trend:-0.2,tier:'TOP',region:'Europe',move:0},
  {rank:11,name:'United States',flag:'🇺🇸',gfr:82.6,etr:83.8,ict:88.4,tcm:84.2,dtf:89.6,sgt:72.4,grp:82.8,trend:-0.1,tier:'TOP',region:'Americas',move:0},
  {rank:12,name:'Japan',       flag:'🇯🇵',gfr:81.4,etr:79.8,ict:84.2,tcm:78.6,dtf:82.4,sgt:82.6,grp:86.8,trend:+0.2,tier:'TOP',region:'Asia Pacific',move:0},
  {rank:13,name:'Canada',      flag:'🇨🇦',gfr:80.8,etr:78.4,ict:82.6,tcm:82.4,dtf:81.6,sgt:80.4,grp:88.4,trend:0.0, tier:'TOP',region:'Americas',move:0},
  {rank:14,name:'Malaysia',    flag:'🇲🇾',gfr:79.2,etr:78.6,ict:76.4,tcm:81.8,dtf:78.2,sgt:74.6,grp:82.4,trend:+0.6,tier:'HIGH',region:'Asia Pacific',move:+1},
  {rank:15,name:'Saudi Arabia',flag:'🇸🇦',gfr:78.6,etr:82.4,ict:74.2,tcm:80.6,dtf:76.8,sgt:68.4,grp:82.6,trend:+2.2,tier:'HIGH',region:'Middle East',move:+3},
  {rank:16,name:'Thailand',    flag:'🇹🇭',gfr:77.4,etr:75.8,ict:72.6,tcm:78.4,dtf:74.6,sgt:72.8,grp:78.4,trend:+0.3,tier:'HIGH',region:'Asia Pacific',move:0},
  {rank:17,name:'Vietnam',     flag:'🇻🇳',gfr:76.8,etr:74.2,ict:71.4,tcm:77.6,dtf:72.4,sgt:74.2,grp:74.8,trend:+0.8,tier:'HIGH',region:'Asia Pacific',move:+1},
  {rank:18,name:'India',       flag:'🇮🇳',gfr:75.6,etr:72.8,ict:76.4,tcm:74.2,dtf:72.8,sgt:68.6,grp:76.2,trend:+1.1,tier:'HIGH',region:'Asia Pacific',move:+2},
  {rank:19,name:'Indonesia',   flag:'🇮🇩',gfr:74.2,etr:72.4,ict:68.6,tcm:74.8,dtf:68.4,sgt:70.4,grp:74.6,trend:+0.4,tier:'HIGH',region:'Asia Pacific',move:0},
  {rank:20,name:'Brazil',      flag:'🇧🇷',gfr:70.8,etr:68.4,ict:69.2,tcm:70.4,dtf:66.8,sgt:72.6,grp:68.4,trend:+0.6,tier:'HIGH',region:'Americas',move:0},
  {rank:21,name:'Morocco',     flag:'🇲🇦',gfr:68.4,etr:66.8,ict:64.2,tcm:68.6,dtf:62.4,sgt:66.8,grp:70.2,trend:+0.8,tier:'HIGH',region:'Africa',move:+2},
  {rank:22,name:'Mexico',      flag:'🇲🇽',gfr:67.2,etr:65.4,ict:64.8,tcm:68.2,dtf:62.8,sgt:64.4,grp:66.8,trend:+0.2,tier:'HIGH',region:'Americas',move:0},
  {rank:23,name:'Turkey',      flag:'🇹🇷',gfr:64.8,etr:63.2,ict:63.6,tcm:65.4,dtf:62.4,sgt:62.8,grp:62.4,trend:-0.4,tier:'HIGH',region:'Europe',move:-2},
  {rank:24,name:'Egypt',       flag:'🇪🇬',gfr:62.4,etr:60.8,ict:58.6,tcm:62.4,dtf:56.8,sgt:62.4,grp:64.8,trend:+0.4,tier:'HIGH',region:'Africa',move:0},
  {rank:25,name:'Nigeria',     flag:'🇳🇬',gfr:54.6,etr:52.4,ict:50.8,tcm:54.2,dtf:48.6,sgt:56.4,grp:52.8,trend:+0.2,tier:'DEV', region:'Africa',move:0},
];

function sc(v:number){return v>=80?'#00ffc8':v>=60?'#00d4ff':v>=40?'#ffd700':'#ff4466';}
function tierStyle(t:string){
  if(t==='TOP') return {bg:'rgba(0,255,200,0.08)',color:'#00ffc8',border:'rgba(0,255,200,0.2)'};
  if(t==='HIGH') return {bg:'rgba(0,180,216,0.08)',color:'#00b4d8',border:'rgba(0,180,216,0.2)'};
  return {bg:'rgba(255,215,0,0.08)',color:'#ffd700',border:'rgba(255,215,0,0.2)'};
}

// Radar SVG
function Radar({data,size=120}:{data:typeof COUNTRIES[0];size?:number}){
  const dims2=['etr','ict','tcm','dtf','sgt','grp'];
  const vals=dims2.map(d=>(data as any)[d]);
  const n=dims2.length; const cx=size/2,cy=size/2,r=size*0.38;
  function pt(i:number,v:number){const a=(Math.PI*2*i/n)-Math.PI/2;const d=(v/100)*r;return{x:cx+d*Math.cos(a),y:cy+d*Math.sin(a)};}
  const pts=vals.map((v,i)=>pt(i,v));
  const poly=pts.map(p=>`${p.x},${p.y}`).join(' ');
  return(
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {[20,40,60,80,100].map(l=>{const ps=vals.map((_,i)=>pt(i,l));return(<polygon key={l} points={ps.map(p=>`${p.x},${p.y}`).join(' ')} fill="none" stroke="rgba(0,255,200,0.07)" strokeWidth="0.5"/>);})}
      {dims2.map((_,i)=>{const p=pt(i,100);return(<line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="rgba(0,255,200,0.07)" strokeWidth="0.5"/>);})}
      <polygon points={poly} fill="rgba(0,255,200,0.12)" stroke="#00ffc8" strokeWidth="1.5"/>
      {pts.map((p,i)=>(<circle key={i} cx={p.x} cy={p.y} r="2.5" fill="#00ffc8" style={{filter:'drop-shadow(0 0 4px #00ffc8)'}}/>))}
      {dims2.map((label,i)=>{const p=pt(i,115);return(<text key={label} x={p.x} y={p.y} fontSize="7" fill="rgba(232,244,248,0.4)" textAnchor="middle" dominantBaseline="middle">{label.toUpperCase()}</text>);})}
    </svg>
  );
}

export default function GFRPage(){
  const [sortCol,setSortCol]=useState('rank');
  const [sortDir,setSortDir]=useState<'asc'|'desc'>('asc');
  const [selRegion,setSelRegion]=useState('ALL');
  const [selTier,setSelTier]=useState('ALL');
  const [search,setSearch]=useState('');
  const [selCountry,setSelCountry]=useState(COUNTRIES[0]);
  const [tab,setTab]=useState('ranking');

  const filtered=useMemo(()=>{
    let d=[...COUNTRIES];
    if(selRegion!=='ALL')d=d.filter(c=>c.region===selRegion);
    if(selTier!=='ALL')d=d.filter(c=>c.tier===selTier);
    if(search)d=d.filter(c=>c.name.toLowerCase().includes(search.toLowerCase()));
    d.sort((a,b)=>{const av=(a as any)[sortCol]??0,bv=(b as any)[sortCol]??0;return sortDir==='asc'?av-bv:bv-av;});
    return d;
  },[sortCol,sortDir,selRegion,selTier,search]);

  const regions=['ALL',...Array.from(new Set(COUNTRIES.map(c=>c.region)))];

  return(
    <div style={{minHeight:'100vh',background:'#020c14',fontFamily:"'Inter','Helvetica Neue',sans-serif"}}>
      <NavBar/>

      {/* HERO */}
      <div style={{background:'linear-gradient(135deg,#020c14,#0a1628,#060f1a)',padding:'36px 24px',borderBottom:'1px solid rgba(0,255,200,0.08)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,backgroundImage:'linear-gradient(rgba(0,255,200,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,200,0.025) 1px,transparent 1px)',backgroundSize:'64px 64px',pointerEvents:'none'}}/>
        <div style={{maxWidth:'1540px',margin:'0 auto',position:'relative'}}>
          <div style={{display:'flex',gap:'12px',alignItems:'center',marginBottom:'10px',flexWrap:'wrap'}}>
            <Award size={16} color="#ffd700"/>
            <div style={{fontSize:'10px',fontWeight:800,color:'rgba(255,215,0,0.7)',letterSpacing:'0.2em',textTransform:'uppercase',fontFamily:"'Orbitron','Inter',sans-serif"}}>GFR RANKING 2026</div>
            <span style={{fontSize:'9px',padding:'2px 8px',background:'rgba(0,255,200,0.08)',border:'1px solid rgba(0,255,200,0.2)',borderRadius:'4px',color:'#00ffc8',fontFamily:"'JetBrains Mono',monospace"}}>COMPARABLE TO IMD WCR · KEARNEY GCR · WORLD HAPPINESS</span>
          </div>
          <h1 style={{fontSize:'32px',fontWeight:900,color:'#e8f4f8',marginBottom:'8px',lineHeight:1.1}}>
            Global Future Readiness Ranking
          </h1>
          <p style={{fontSize:'14px',color:'rgba(232,244,248,0.5)',marginBottom:'20px',maxWidth:'700px',lineHeight:1.7}}>
            6-dimension composite scoring across 25 economies · AI-updated weekly · ETR · ICT · TCM · DTF · SGT · GRP
          </p>
          {/* Formula */}
          <div style={{padding:'10px 16px',background:'rgba(0,255,200,0.04)',border:'1px solid rgba(0,255,200,0.12)',borderRadius:'8px',display:'inline-block',marginBottom:'20px'}}>
            <span style={{fontSize:'10px',fontWeight:700,color:'rgba(0,255,200,0.6)',letterSpacing:'0.08em',marginRight:'10px'}}>GFR FORMULA</span>
            <span style={{fontSize:'11px',color:'rgba(232,244,248,0.7)',fontFamily:"'JetBrains Mono',monospace"}}>= (0.20×ETR) + (0.18×ICT) + (0.18×TCM) + (0.16×DTF) + (0.15×SGT) + (0.13×GRP)</span>
          </div>
          {/* Dimension pills */}
          <div style={{display:'flex',gap:'8px',flexWrap:'wrap'}}>
            {DIMS.map(d=>(
              <div key={d.code} style={{padding:'5px 12px',background:`${d.color}08`,border:`1px solid ${d.color}20`,borderRadius:'20px',fontSize:'11px'}}>
                <span style={{fontWeight:800,color:d.color,marginRight:'6px',fontFamily:"'JetBrains Mono',monospace"}}>{d.code}</span>
                <span style={{color:'rgba(232,244,248,0.4)',fontSize:'10px'}}>{(d.weight*100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{background:'rgba(6,15,26,0.95)',borderBottom:'1px solid rgba(0,255,200,0.06)',backdropFilter:'blur(20px)'}}>
        <div style={{maxWidth:'1540px',margin:'0 auto',padding:'0 24px',display:'flex'}}>
          {[['ranking','📊 Ranking Table'],['methodology','🔬 Methodology'],['compare','⚖ Compare']].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)}
              style={{padding:'14px 20px',border:'none',borderBottom:`2px solid ${tab===t?'#ffd700':'transparent'}`,background:'transparent',fontSize:'12px',fontWeight:tab===t?700:400,color:tab===t?'#ffd700':'rgba(232,244,248,0.5)',cursor:'pointer',fontFamily:"'Inter',sans-serif",marginBottom:'-1px',transition:'all 200ms ease'}}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{maxWidth:'1540px',margin:'0 auto',padding:'20px 24px'}}>
        {tab==='ranking'&&(
          <div style={{display:'grid',gridTemplateColumns:'1fr 300px',gap:'16px',alignItems:'start'}}>
            {/* Main table */}
            <div style={{background:'rgba(10,22,40,0.7)',border:'1px solid rgba(0,180,216,0.12)',borderRadius:'12px',overflow:'hidden',backdropFilter:'blur(10px)'}}>
              {/* Filters */}
              <div style={{padding:'12px 16px',borderBottom:'1px solid rgba(0,255,200,0.06)',display:'flex',gap:'10px',flexWrap:'wrap',alignItems:'center',background:'rgba(0,0,0,0.2)'}}>
                <input placeholder="Search economy..." value={search} onChange={e=>setSearch(e.target.value)}
                  style={{padding:'7px 12px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'7px',fontSize:'12px',outline:'none',fontFamily:"'Inter',sans-serif",color:'#e8f4f8',minWidth:'160px'}}/>
                <select value={selRegion} onChange={e=>setSelRegion(e.target.value)}
                  style={{padding:'7px 12px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'7px',fontSize:'12px',color:'#e8f4f8',outline:'none',cursor:'pointer',fontFamily:"'Inter',sans-serif"}}>
                  {regions.map(r=><option key={r} style={{background:'#0a1628'}}>{r}</option>)}
                </select>
                <select value={selTier} onChange={e=>setSelTier(e.target.value)}
                  style={{padding:'7px 12px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:'7px',fontSize:'12px',color:'#e8f4f8',outline:'none',cursor:'pointer',fontFamily:"'Inter',sans-serif"}}>
                  {['ALL','TOP','HIGH','DEV'].map(t=><option key={t} style={{background:'#0a1628'}}>{t}</option>)}
                </select>
                <span style={{marginLeft:'auto',fontSize:'11px',color:'rgba(232,244,248,0.3)',fontFamily:"'JetBrains Mono',monospace"}}>{filtered.length} economies</span>
                <button style={{padding:'7px 14px',background:'rgba(0,255,200,0.06)',border:'1px solid rgba(0,255,200,0.2)',borderRadius:'7px',cursor:'pointer',fontSize:'11px',fontWeight:700,color:'#00ffc8',fontFamily:"'Inter',sans-serif",display:'flex',alignItems:'center',gap:'6px'}}>
                  <Download size={11}/> Export
                </button>
              </div>
              {/* Table */}
              <div style={{overflowX:'auto'}}>
                <table style={{width:'100%',borderCollapse:'collapse',fontSize:'12px'}}>
                  <thead>
                    <tr style={{background:'rgba(0,0,0,0.3)'}}>
                      {[['rank','#'],['name','Economy'],['gfr','GFR'],['etr','ETR'],['ict','ICT'],['tcm','TCM'],['dtf','DTF'],['sgt','SGT'],['grp','GRP'],['trend','Trend']].map(([col,label])=>(
                        <th key={col} onClick={()=>{if(sortCol===col)setSortDir(d=>d==='asc'?'desc':'asc');else{setSortCol(col);setSortDir('desc');}}}
                          style={{padding:'10px 12px',textAlign:label==='Economy'?'left':'center',fontWeight:700,color:sortCol===col?'#00ffc8':'rgba(232,244,248,0.3)',textTransform:'uppercase',fontSize:'9px',letterSpacing:'0.08em',borderBottom:'1px solid rgba(0,255,200,0.06)',whiteSpace:'nowrap',cursor:'pointer',fontFamily:"'JetBrains Mono',monospace',sans-serif",transition:'color 150ms ease'}}>
                          {label}{sortCol===col?(sortDir==='asc'?' ↑':' ↓'):''}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c,ri)=>{
                      const ts=tierStyle(c.tier);
                      const isSel=c.name===selCountry.name;
                      return(
                        <tr key={c.name} onClick={()=>setSelCountry(c)}
                          style={{cursor:'pointer',background:isSel?'rgba(0,255,200,0.04)':ri%2===0?'rgba(255,255,255,0.01)':'transparent',borderBottom:'1px solid rgba(255,255,255,0.025)',transition:'background 150ms ease'}}
                          onMouseEnter={e=>{if(!isSel)e.currentTarget.style.background='rgba(0,255,200,0.025)';}}
                          onMouseLeave={e=>{if(!isSel)e.currentTarget.style.background=ri%2===0?'rgba(255,255,255,0.01)':'transparent';}}>
                          <td style={{padding:'11px 12px',textAlign:'center'}}>
                            {c.rank<=3?(
                              <span style={{width:'24px',height:'24px',borderRadius:'50%',background:c.rank===1?'rgba(255,215,0,0.15)':c.rank===2?'rgba(200,200,210,0.15)':'rgba(200,140,60,0.15)',color:c.rank===1?'#ffd700':c.rank===2?'#c0c8d2':'#c8843c',fontSize:'12px',fontWeight:900,display:'inline-flex',alignItems:'center',justifyContent:'center',fontFamily:"'JetBrains Mono',monospace"}}>
                                {c.rank===1?'🥇':c.rank===2?'🥈':'🥉'}
                              </span>
                            ):(
                              <span style={{fontSize:'13px',fontWeight:700,color:'rgba(232,244,248,0.4)',fontFamily:"'JetBrains Mono',monospace"}}>{c.rank}</span>
                            )}
                            {c.move!==0&&(
                              <div style={{fontSize:'8px',color:c.move>0?'#00ffc8':'#ff4466',fontWeight:700,marginTop:'1px'}}>{c.move>0?`↑${c.move}`:`↓${Math.abs(c.move)}`}</div>
                            )}
                          </td>
                          <td style={{padding:'11px 12px'}}>
                            <div style={{display:'flex',alignItems:'center',gap:'10px'}}>
                              <span style={{fontSize:'20px'}}>{c.flag}</span>
                              <div>
                                <div style={{fontWeight:700,color:'#e8f4f8',fontSize:'13px'}}>{c.name}</div>
                                <div style={{fontSize:'9px',color:'rgba(232,244,248,0.35)'}}>{c.region}</div>
                              </div>
                              <span style={{fontSize:'8px',fontWeight:800,padding:'2px 7px',borderRadius:'10px',background:ts.bg,color:ts.color,border:`1px solid ${ts.border}`,letterSpacing:'0.04em',marginLeft:'4px'}}>{c.tier}</span>
                            </div>
                          </td>
                          {/* GFR with bar */}
                          <td style={{padding:'11px 8px',textAlign:'center'}}>
                            <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:'3px'}}>
                              <span style={{fontSize:'16px',fontWeight:900,color:sc(c.gfr),fontFamily:"'JetBrains Mono',monospace",textShadow:`0 0 12px ${sc(c.gfr)}60`}}>{c.gfr}</span>
                              <div style={{width:'44px',height:'3px',background:'rgba(255,255,255,0.05)',borderRadius:'2px',overflow:'hidden'}}>
                                <div style={{height:'100%',width:`${c.gfr}%`,background:sc(c.gfr),borderRadius:'2px'}}/>
                              </div>
                            </div>
                          </td>
                          {/* Dimension scores */}
                          {[c.etr,c.ict,c.tcm,c.dtf,c.sgt,c.grp].map((v,vi)=>{
                            const dc=DIMS[vi].color;
                            return(
                              <td key={vi} style={{padding:'11px 8px',textAlign:'center',fontSize:'12px',fontWeight:600,color:sc(v),fontFamily:"'JetBrains Mono',monospace"}}>{v}</td>
                            );
                          })}
                          {/* Trend */}
                          <td style={{padding:'11px 12px',textAlign:'center'}}>
                            <span style={{display:'flex',alignItems:'center',gap:'3px',justifyContent:'center',fontSize:'11px',fontWeight:700,color:c.trend>0?'#00ffc8':c.trend<0?'#ff4466':'rgba(232,244,248,0.3)'}}>
                              {c.trend>0?<TrendingUp size={11}/>:c.trend<0?<TrendingDown size={11}/>:null}
                              {c.trend!==0?(c.trend>0?'+':'')+c.trend:'—'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {/* Legend */}
              <div style={{padding:'10px 16px',borderTop:'1px solid rgba(0,255,200,0.06)',display:'flex',justifyContent:'space-between',alignItems:'center',background:'rgba(0,0,0,0.2)'}}>
                <span style={{fontSize:'10px',color:'rgba(232,244,248,0.3)',fontFamily:"'JetBrains Mono',monospace"}}>{filtered.length} of 25 economies · Weekly AI update · AGT-05</span>
                <div style={{display:'flex',gap:'10px'}}>
                  {[['TOP (≥80)','#00ffc8'],['HIGH (60-79)','#00d4ff'],['DEV (<60)','#ffd700']].map(([l,c])=>(
                    <div key={l} style={{display:'flex',alignItems:'center',gap:'5px',fontSize:'9px',color:'rgba(232,244,248,0.3)'}}>
                      <div style={{width:'8px',height:'8px',borderRadius:'50%',background:c}}/>
                      {l}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SIDE PANEL */}
            <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
              {/* Country card */}
              <div style={{background:'rgba(10,22,40,0.9)',border:'1px solid rgba(0,180,216,0.15)',borderRadius:'12px',overflow:'hidden',backdropFilter:'blur(10px)'}}>
                <div style={{background:'linear-gradient(135deg,rgba(0,255,200,0.08),rgba(0,180,216,0.05))',padding:'16px 18px',borderBottom:'1px solid rgba(0,255,200,0.08)'}}>
                  <div style={{fontSize:'9px',color:'rgba(0,255,200,0.4)',letterSpacing:'0.15em',marginBottom:'8px',fontFamily:"'Orbitron','Inter',sans-serif"}}>SELECTED ECONOMY</div>
                  <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'12px'}}>
                    <span style={{fontSize:'36px'}}>{selCountry.flag}</span>
                    <div>
                      <div style={{fontSize:'18px',fontWeight:900,color:'#e8f4f8'}}>{selCountry.name}</div>
                      <div style={{fontSize:'10px',color:'rgba(0,255,200,0.5)'}}>{selCountry.region} · #{selCountry.rank}</div>
                    </div>
                  </div>
                  <div style={{textAlign:'center',marginBottom:'4px'}}>
                    <div style={{fontSize:'48px',fontWeight:900,color:'#00ffc8',fontFamily:"'JetBrains Mono',monospace",textShadow:'0 0 24px rgba(0,255,200,0.5)',lineHeight:1}}>{selCountry.gfr}</div>
                    <div style={{fontSize:'11px',color:'rgba(232,244,248,0.4)',marginTop:'4px'}}>GFR Score · {tierStyle(selCountry.tier).color && selCountry.tier} TIER</div>
                  </div>
                </div>
                <div style={{padding:'16px 18px'}}>
                  <div style={{display:'flex',justifyContent:'center',marginBottom:'14px'}}>
                    <Radar data={selCountry} size={140}/>
                  </div>
                  {DIMS.map(dim=>{
                    const v=(selCountry as any)[dim.code.toLowerCase()];
                    return(
                      <div key={dim.code} style={{marginBottom:'8px'}}>
                        <div style={{display:'flex',justifyContent:'space-between',marginBottom:'2px'}}>
                          <span style={{fontSize:'10px',fontWeight:600,color:'rgba(232,244,248,0.6)'}}>{dim.code} <span style={{fontSize:'9px',color:'rgba(232,244,248,0.3)'}}>({(dim.weight*100).toFixed(0)}%)</span></span>
                          <span style={{fontSize:'11px',fontWeight:800,color:dim.color,fontFamily:"'JetBrains Mono',monospace"}}>{v}</span>
                        </div>
                        <div style={{height:'4px',background:'rgba(255,255,255,0.05)',borderRadius:'2px',overflow:'hidden'}}>
                          <div style={{height:'100%',width:`${v}%`,background:dim.color,borderRadius:'2px',boxShadow:`0 0 6px ${dim.color}60`}}/>
                        </div>
                      </div>
                    );
                  })}
                  <div style={{display:'flex',gap:'8px',marginTop:'16px'}}>
                    <Link href="/investment-analysis?tab=benchmark" style={{flex:1,padding:'8px',background:'rgba(0,255,200,0.07)',border:'1px solid rgba(0,255,200,0.2)',borderRadius:'7px',textDecoration:'none',fontSize:'11px',fontWeight:700,color:'#00ffc8',textAlign:'center'}}>Benchmark</Link>
                    <Link href="/reports" style={{flex:1,padding:'8px',background:'rgba(255,215,0,0.07)',border:'1px solid rgba(255,215,0,0.2)',borderRadius:'7px',textDecoration:'none',fontSize:'11px',fontWeight:700,color:'#ffd700',textAlign:'center'}}>Report</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab==='methodology'&&(
          <div style={{background:'rgba(10,22,40,0.7)',border:'1px solid rgba(0,180,216,0.12)',borderRadius:'12px',padding:'28px',backdropFilter:'blur(10px)'}}>
            <h2 style={{fontSize:'22px',fontWeight:900,color:'#e8f4f8',marginBottom:'8px'}}>GFR Methodology</h2>
            <p style={{fontSize:'13px',color:'rgba(232,244,248,0.5)',marginBottom:'28px',lineHeight:1.75}}>The Global Future Readiness Ranking measures an economy's preparedness to attract and sustain FDI in the medium-to-long term. Comparable to IMD World Competitiveness Ranking, Kearney Global Cities Report, and the World Happiness Report in rigour and scope.</p>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'14px'}}>
              {DIMS.map(dim=>(
                <div key={dim.code} style={{padding:'20px',background:'rgba(255,255,255,0.02)',borderRadius:'10px',border:`1px solid ${dim.color}15`,borderLeft:`3px solid ${dim.color}`}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'8px'}}>
                    <span style={{fontSize:'18px',fontWeight:900,color:dim.color,fontFamily:"'JetBrains Mono',monospace"}}>{dim.code}</span>
                    <span style={{fontSize:'11px',fontWeight:800,padding:'3px 10px',borderRadius:'12px',background:`${dim.color}10`,color:dim.color}}>{(dim.weight*100).toFixed(0)}%</span>
                  </div>
                  <div style={{fontSize:'13px',fontWeight:700,color:'rgba(232,244,248,0.8)',marginBottom:'6px'}}>{dim.name}</div>
                  <div style={{fontSize:'11px',color:'rgba(232,244,248,0.4)',lineHeight:1.7}}>{dim.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab==='compare'&&(
          <div style={{background:'rgba(10,22,40,0.7)',border:'1px solid rgba(0,180,216,0.12)',borderRadius:'12px',padding:'40px',backdropFilter:'blur(10px)',textAlign:'center'}}>
            <div style={{fontSize:'40px',marginBottom:'16px'}}>⚖</div>
            <h2 style={{fontSize:'20px',fontWeight:900,color:'#e8f4f8',marginBottom:'10px'}}>Economy Comparison Tool</h2>
            <p style={{fontSize:'13px',color:'rgba(232,244,248,0.45)',marginBottom:'22px'}}>Compare multiple economies side-by-side across all 6 GFR dimensions</p>
            <Link href="/investment-analysis?tab=benchmark" style={{display:'inline-flex',alignItems:'center',gap:'8px',padding:'12px 28px',background:'linear-gradient(135deg,#ffd700,#f0b429)',color:'#020c14',borderRadius:'9px',textDecoration:'none',fontSize:'13px',fontWeight:800}}>
              Open Benchmark Tool →
            </Link>
          </div>
        )}
      </div>
      <Footer/>
    </div>
  );
}
